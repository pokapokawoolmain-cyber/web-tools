"use client";
// ============================================================
// アップロード前の画像前処理（ブラウザ内で完結）
//
//  1. 形式チェック（非対応は理由を説明して止める）
//  2. HEIC/HEIF はブラウザが直接デコードできなければ heic2any で JPEG 化
//  3. EXIF の向きを反映して描画（createImageBitmap の imageOrientation）
//  4. 詳細用（長辺1600px）と一覧用サムネ（長辺480px）の2枚を生成
//  5. WebP（非対応ブラウザは JPEG）で圧縮し、2MB 以下になるまで品質を下げる
//
// Canvas で再エンコードするため、位置情報などの EXIF メタデータは保存されない
// （撮影場所の漏洩防止にもなる）。
// ============================================================

export const MAX_INPUT_BYTES = 40 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024; // バケットの file_size_limit と同じ
const FULL_EDGE = 1600;
const THUMB_EDGE = 480;

export const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,image/gif,.heic,.heif";

export interface ProcessedImage {
  full: Blob;
  thumb: Blob;
  ext: "webp" | "jpg";
  mime: "image/webp" | "image/jpeg";
  width: number;
  height: number;
  /** プレビュー表示用（呼び出し側で revoke する） */
  previewUrl: string;
}

export class ImageProcessError extends Error {
  constructor(public userMessage: string) {
    super(userMessage);
  }
}

function isHeic(file: File): boolean {
  return /\.(heic|heif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type);
}

function checkType(file: File) {
  if (file.size === 0) throw new ImageProcessError("画像ファイルが空です。別の画像を選んでください。");
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageProcessError("画像が大きすぎます（40MBまで）。スクリーンショットや別の写真でお試しください。");
  }
  if (isHeic(file)) return;
  if (/image\/svg/i.test(file.type) || /\.svg$/i.test(file.name)) {
    throw new ImageProcessError("SVG形式は使えません。JPG・PNG・HEICなどの写真を選んでください。");
  }
  const okType = /^image\/(jpeg|png|webp|avif|gif)$/i.test(file.type);
  const okExt = /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name);
  if (!okType && !okExt) {
    throw new ImageProcessError("この形式の画像は使えません。JPG・PNG・WebP・HEICの写真を選んでください。");
  }
}

async function decode(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob, { imageOrientation: "from-image" });
    } catch {
      /* 下の <img> デコードへ */
    }
  }
  // <img> は現行ブラウザで EXIF の向きを自動適用する
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeFile(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    // iOS Safari などは HEIC もそのままデコードできる
    return await decode(file);
  } catch {
    if (!isHeic(file)) {
      throw new ImageProcessError("画像を読み込めませんでした。ファイルが壊れているか、対応していない形式です。");
    }
  }
  try {
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    const jpeg = Array.isArray(out) ? out[0] : out;
    return await decode(jpeg);
  } catch {
    throw new ImageProcessError(
      "HEIC画像を変換できませんでした。iPhoneの「設定 > カメラ > フォーマット」で「互換性優先」にするか、スクリーンショットでお試しください。"
    );
  }
}

let webpSupport: boolean | null = null;
async function supportsWebpEncode(): Promise<boolean> {
  if (webpSupport !== null) return webpSupport;
  const c = document.createElement("canvas");
  c.width = c.height = 2;
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.8));
  webpSupport = blob?.type === "image/webp";
  return webpSupport;
}

function draw(src: ImageBitmap | HTMLImageElement, maxEdge: number) {
  const w0 = "naturalWidth" in src ? src.naturalWidth : src.width;
  const h0 = "naturalHeight" in src ? src.naturalHeight : src.height;
  const scale = Math.min(1, maxEdge / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * scale));
  const h = Math.max(1, Math.round(h0 * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageProcessError("この端末では画像を処理できませんでした。");
  // 透過PNGは JPEG 化で黒くならないよう白で下地を塗る
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, w, h);
  return { canvas, w, h };
}

async function encode(canvas: HTMLCanvasElement, mime: string, startQuality: number): Promise<Blob> {
  let q = startQuality;
  for (let i = 0; i < 6; i++) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, mime, q));
    if (!blob) break;
    if (blob.size <= MAX_OUTPUT_BYTES) return blob;
    q -= 0.12;
  }
  throw new ImageProcessError("画像を十分に小さくできませんでした。別の画像でお試しください。");
}

export async function preprocessImage(file: File): Promise<ProcessedImage> {
  checkType(file);
  const src = await decodeFile(file);
  try {
    const webp = await supportsWebpEncode();
    const mime = webp ? "image/webp" : "image/jpeg";
    const full = draw(src, FULL_EDGE);
    const fullBlob = await encode(full.canvas, mime, 0.82);
    const thumb = draw(src, THUMB_EDGE);
    const thumbBlob = await encode(thumb.canvas, mime, 0.78);
    return {
      full: fullBlob,
      thumb: thumbBlob,
      ext: webp ? "webp" : "jpg",
      mime,
      width: full.w,
      height: full.h,
      previewUrl: URL.createObjectURL(thumbBlob),
    };
  } finally {
    if ("close" in src) src.close();
  }
}
