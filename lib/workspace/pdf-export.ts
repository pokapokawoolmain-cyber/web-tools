// ============================================================
// PDFワークスペースの読み込み・書き出し（ブラウザで実行）
//
// - 読み込み: pdf-lib（ページ構成・回転・暗号化の判定）と PDF.js（サムネイル・画像化）
// - PDF書き出し: pdf-lib の copyPages でページをそのまま写す（文字や画像を再圧縮・画像化しない）
// - 画像書き出し: PDF.js で1ページずつ描画する
// - ファイルは端末の外へ送信しない
// ============================================================
import type { PDFDocument } from "pdf-lib";
import { openPdfDocument } from "@/lib/pdfjs";
import type { PageItem } from "./pdf-plan";
import { sniffPdf } from "./pdf-plan";

type PdfjsDoc = Awaited<ReturnType<typeof openPdfDocument>>;

export type PdfLoadErrorCode = "not-pdf" | "encrypted" | "broken";

export class PdfLoadError extends Error {
  constructor(public code: PdfLoadErrorCode) {
    super(code);
  }
}

export interface LoadedPdf {
  name: string;
  bytes: Uint8Array;
  lib: PDFDocument;
  view: PdfjsDoc;
  pages: { landscape: boolean; width: number; height: number }[];
}

const TAIL_BYTES = 64 * 1024;

/** PDF を読み込む。暗号化・壊れている・PDFではない場合は PdfLoadError */
export async function loadPdf(file: File): Promise<LoadedPdf> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = sniffPdf(bytes.subarray(0, 1024), bytes.subarray(Math.max(0, bytes.length - TAIL_BYTES)));
  if (!head.isPdf) throw new PdfLoadError("not-pdf");
  if (head.encrypted) throw new PdfLoadError("encrypted");
  const { PDFDocument, EncryptedPDFError } = await import("pdf-lib");
  let lib: PDFDocument;
  try {
    lib = await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (e) {
    throw new PdfLoadError(e instanceof EncryptedPDFError ? "encrypted" : "broken");
  }
  let view: PdfjsDoc;
  try {
    view = await openPdfDocument(bytes);
  } catch {
    throw new PdfLoadError("broken");
  }
  const pages = lib.getPages().map((p) => {
    const { width, height } = p.getSize();
    const quarter = p.getRotation().angle % 180 !== 0;
    const w = quarter ? height : width;
    const h = quarter ? width : height;
    return { width: w, height: h, landscape: w > h };
  });
  if (!pages.length) throw new PdfLoadError("broken");
  return { name: file.name, bytes, lib, view, pages };
}

/** ページの並びから新しい PDF を作る */
export async function buildPdf(sources: LoadedPdf[], group: PageItem[]): Promise<Blob> {
  const { PDFDocument, degrees } = await import("pdf-lib");
  // updateMetadata: false にしないと保存時に作成者情報が pdf-lib で上書きされる
  const out = await PDFDocument.create({ updateMetadata: false });
  out.setProducer("ToolBoxJP");
  out.setCreator("ToolBoxJP");
  // ファイルごとにまとめて写す（同じファイルの共有資源を1回だけ写すため）
  const byFile = new Map<number, number[]>();
  for (const p of group) byFile.set(p.fileIndex, [...(byFile.get(p.fileIndex) ?? []), p.pageIndex]);
  const copied = new Map<string, Awaited<ReturnType<PDFDocument["copyPages"]>>[number]>();
  for (const [fileIndex, indices] of byFile) {
    const unique = [...new Set(indices)];
    const pages = await out.copyPages(sources[fileIndex].lib, unique);
    unique.forEach((pi, i) => copied.set(`${fileIndex}-${pi}`, pages[i]));
  }
  for (const item of group) {
    let page = copied.get(`${item.fileIndex}-${item.pageIndex}`)!;
    // 同じページを2回使う場合は写し直す（pdf-lib は同じページを2回 addPage できない）
    if (out.getPages().includes(page)) [page] = await out.copyPages(sources[item.fileIndex].lib, [item.pageIndex]);
    const base = page.getRotation().angle;
    page.setRotation(degrees((((base + item.rotation) % 360) + 360) % 360));
    out.addPage(page);
  }
  const data = await out.save();
  return new Blob([data as BlobPart], { type: "application/pdf" });
}

export type ImageFormat = "jpeg" | "png";

/** 1ページを画像にする。dpi は解像度（72 = 原寸） */
export async function renderPageImage(
  source: LoadedPdf,
  item: PageItem,
  opts: { format: ImageFormat; dpi: number; quality: number },
): Promise<{ blob: Blob; width: number; height: number }> {
  const page = await source.view.getPage(item.pageIndex + 1);
  const viewport = page.getViewport({ scale: opts.dpi / 72, rotation: (page.rotate + item.rotation) % 360 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  // JPG は透過できないため白で塗っておく
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const mime = opts.format === "png" ? "image/png" : "image/jpeg";
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, mime, opts.quality));
  const { width, height } = canvas;
  canvas.width = 0;
  canvas.height = 0;
  page.cleanup();
  if (!blob) throw new Error("canvas");
  return { blob, width, height };
}

/** サムネイル（長い辺 px を指定） */
export async function renderThumbnail(source: LoadedPdf, item: PageItem, longEdge = 220): Promise<string> {
  const page = await source.view.getPage(item.pageIndex + 1);
  const base = page.getViewport({ scale: 1, rotation: (page.rotate + item.rotation) % 360 });
  const scale = longEdge / Math.max(base.width, base.height);
  const viewport = page.getViewport({ scale, rotation: (page.rotate + item.rotation) % 360 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.7));
  return blob ? URL.createObjectURL(blob) : "";
}

export async function closePdfs(sources: LoadedPdf[]) {
  await Promise.all(sources.map((s) => s.view.loadingTask.destroy().catch(() => undefined)));
}
