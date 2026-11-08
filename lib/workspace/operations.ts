// ============================================================
// ワークスペースの操作台帳
//
// 各操作が「受け取る形式」「出す形式」「設定項目」を宣言する。
// 画面はこの台帳を見て操作を並べ、将来の API・MCP はこの宣言から
// エンドポイントやツール定義を作る（処理本体は image-core.ts の純粋な関数）。
// ============================================================
import type { FileKind } from "./sniff";
import { INPUT_KINDS, LIMITS } from "./image-plan";
import { PDF_LIMITS } from "./pdf-plan";

export interface OperationParam {
  key: string;
  label: string;
  type: "enum" | "number" | "color";
  values?: string[];
  min?: number;
  max?: number;
}

export interface OperationSpec {
  id: string;
  label: string;
  accepts: FileKind[];
  produces: ("jpeg" | "png" | "webp" | "avif" | "zip" | "pdf")[];
  params: OperationParam[];
  /** 処理場所。"browser" はファイルを端末の外へ送らない */
  runtime: "browser";
  limits: { maxFiles: number; maxBytes: number; maxPixels: number };
}

const IMAGE_OUT = ["jpeg", "png", "webp", "avif"] as const;
const limits = { maxFiles: LIMITS.maxFiles, maxBytes: LIMITS.maxBytes, maxPixels: LIMITS.maxPixels };

export const IMAGE_OPERATIONS: OperationSpec[] = [
  {
    id: "image.resize",
    label: "大きさを変える",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "resize.mode", label: "基準", type: "enum", values: ["none", "long", "width", "height", "percent"] },
      { key: "resize.value", label: "値（px または %）", type: "number", min: 1, max: LIMITS.maxOutputEdge },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.aspect",
    label: "縦横比を合わせる",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "aspect.ratio", label: "縦横比", type: "enum", values: ["none", "1:1", "4:3", "3:4", "16:9", "9:16"] },
      { key: "aspect.fit", label: "合わせ方", type: "enum", values: ["pad", "crop"] },
      { key: "background", label: "余白の色", type: "color" },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.convert",
    label: "形式を変える",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [{ key: "format", label: "形式", type: "enum", values: ["keep", ...IMAGE_OUT] }],
    runtime: "browser",
    limits,
  },
  {
    id: "image.compress",
    label: "軽くする",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "quality", label: "画質", type: "number", min: 1, max: 100 },
      { key: "targetBytes", label: "目標ファイルサイズ（バイト）", type: "number", min: 0 },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.bundle-pdf",
    label: "1つのPDFにまとめる",
    accepts: INPUT_KINDS,
    produces: ["pdf"],
    params: [],
    runtime: "browser",
    limits,
  },
];

const pdfLimits = { maxFiles: PDF_LIMITS.maxFiles, maxBytes: PDF_LIMITS.maxTotalBytes, maxPages: PDF_LIMITS.maxPages };

/** PDF の操作。ページは書き出すまで並び（PageItem[]）で扱い、PDF本体は書き出し時に組み立てる */
export const PDF_OPERATIONS: (Omit<OperationSpec, "limits"> & { limits: typeof pdfLimits })[] = [
  { id: "pdf.merge", label: "1つのPDFにまとめる", accepts: ["pdf"], produces: ["pdf"], params: [], runtime: "browser", limits: pdfLimits },
  {
    id: "pdf.reorder", label: "ページを並べ替える", accepts: ["pdf"], produces: ["pdf"],
    params: [{ key: "order", label: "ページの順番（1始まり）", type: "number", min: 1, max: PDF_LIMITS.maxPages }], runtime: "browser", limits: pdfLimits,
  },
  {
    id: "pdf.rotate", label: "ページを回転する", accepts: ["pdf"], produces: ["pdf"],
    params: [{ key: "rotation", label: "回転", type: "enum", values: ["90", "180", "270"] }], runtime: "browser", limits: pdfLimits,
  },
  { id: "pdf.delete", label: "ページを削除する", accepts: ["pdf"], produces: ["pdf"], params: [], runtime: "browser", limits: pdfLimits },
  {
    id: "pdf.split", label: "PDFを分ける", accepts: ["pdf"], produces: ["pdf", "zip"],
    params: [
      { key: "mode", label: "分け方", type: "enum", values: ["single", "ranges", "each", "every"] },
      { key: "every", label: "何ページずつ", type: "number", min: 1, max: PDF_LIMITS.maxPages },
    ],
    runtime: "browser", limits: pdfLimits,
  },
  {
    id: "pdf.to-image", label: "画像にする", accepts: ["pdf"], produces: ["jpeg", "png", "zip"],
    params: [
      { key: "format", label: "形式", type: "enum", values: ["jpeg", "png"] },
      { key: "dpi", label: "解像度（dpi）", type: "number", min: 72, max: 300 },
    ],
    runtime: "browser", limits: pdfLimits,
  },
];
