// ============================================================
// 画像一括変換ラボ 共有ロジック
//
// 設計方針（重要）:
//  - 変換はすべてブラウザ内（クライアント）で完結する。
//    ファイルはサーバー / Vercel Function へ一切送信しない。
//  - 可能な場合は Web Worker + OffscreenCanvas で変換をメインスレッドから
//    分離し、20枚以上でもUIが固まらないようにする。
//  - 非対応ブラウザではメインスレッドの Canvas にフォールバックする。
//  - 将来「クラウド変換モード」を追加する場合はこのファイルに手を入れず、
//    別モジュール（例: lib/cloud-convert.ts）として分離する。
// ============================================================

export type OutputFormat = "jpeg" | "png" | "webp" | "avif";

export interface FormatInfo {
  key: OutputFormat;
  label: string;
  mime: string;
  ext: string;
  supportsAlpha: boolean;
}

export const OUTPUT_FORMATS: FormatInfo[] = [
  { key: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg", supportsAlpha: false },
  { key: "png", label: "PNG", mime: "image/png", ext: "png", supportsAlpha: true },
  { key: "webp", label: "WebP", mime: "image/webp", ext: "webp", supportsAlpha: true },
  { key: "avif", label: "AVIF", mime: "image/avif", ext: "avif", supportsAlpha: true },
];

export function formatByKey(key: OutputFormat): FormatInfo {
  return OUTPUT_FORMATS.find((f) => f.key === key) ?? OUTPUT_FORMATS[0];
}

/** 入力として受け付ける拡張子 / MIME */
export const ACCEPTED_INPUT = ".jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,image/*";

/** 入力ファイルがこのツールで扱える画像かの簡易判定（HEICは別ツールへ誘導） */
export function isSupportedInput(file: File): { ok: boolean; heic?: boolean; reason?: string } {
  const name = file.name.toLowerCase();
  if (/\.(heic|heif)$/.test(name) || file.type === "image/heic" || file.type === "image/heif") {
    return { ok: false, heic: true, reason: "HEIC/HEIF形式はこのツールでは変換できません。専用の「HEIC→JPG変換」をご利用ください。" };
  }
  const isImageType = file.type.startsWith("image/");
  const okExt = /\.(jpe?g|png|webp|avif|gif|bmp)$/.test(name);
  if (!isImageType && !okExt) {
    return { ok: false, reason: "画像ファイル（JPG・PNG・WebP・AVIF・GIF・BMP）を選択してください。" };
  }
  return { ok: true };
}

export interface ConvertOptions {
  format: OutputFormat;
  /** 1–100。PNGは無視される（可逆） */
  quality: number;
  /** 0 = 制限なし */
  maxWidth: number;
  maxHeight: number;
  keepAspect: boolean;
  allowUpscale: boolean;
  /** 透過を保持するか（アルファ非対応形式では無視） */
  keepTransparency: boolean;
  /** JPGなど透過を潰すときの背景色 */
  background: string;
}

export interface FilenameRule {
  base: "keep" | "sequence" | "custom";
  prefix: string;
  suffix: string;
  appendFormat: boolean;
  lowercase: boolean;
  spaceToHyphen: boolean;
  customName: string;
}

export const DEFAULT_OPTIONS: ConvertOptions = {
  format: "webp",
  quality: 80,
  maxWidth: 0,
  maxHeight: 0,
  keepAspect: true,
  allowUpscale: false,
  keepTransparency: true,
  background: "#ffffff",
};

export const DEFAULT_FILENAME_RULE: FilenameRule = {
  base: "keep",
  prefix: "",
  suffix: "",
  appendFormat: false,
  lowercase: false,
  spaceToHyphen: false,
  customName: "image",
};

// ─── 用途別プリセット ───────────────────────────────────────
export interface Preset {
  id: string;
  name: string;
  hint: string;
  options: Partial<ConvertOptions>;
}

export const PRESETS: Preset[] = [
  { id: "lossless", name: "画質そのまま（無劣化）", hint: "PNG・寸法変更なし。1ピクセルも画質を落とさず形式だけ変換", options: { format: "png", maxWidth: 0, maxHeight: 0, allowUpscale: false, keepTransparency: true } },
  { id: "web", name: "Web掲載用", hint: "WebPで軽量化。サイト表示を速くしたいとき", options: { format: "webp", quality: 80, maxWidth: 1600, maxHeight: 0 } },
  { id: "blog", name: "ブログ用", hint: "横幅1200px・WebP。記事の表示速度とSEO向け", options: { format: "webp", quality: 80, maxWidth: 1200, maxHeight: 0 } },
  { id: "sns", name: "SNS投稿用", hint: "長辺1440px・JPG。スマホ写真の投稿に", options: { format: "jpeg", quality: 82, maxWidth: 1440, maxHeight: 1440 } },
  { id: "line", name: "LINE送信用", hint: "かなり軽量なJPG。送信しやすさ重視", options: { format: "jpeg", quality: 70, maxWidth: 1280, maxHeight: 1280 } },
  { id: "ec", name: "EC商品画像用", hint: "1000px前後・JPG。画質と軽さのバランス", options: { format: "jpeg", quality: 85, maxWidth: 1000, maxHeight: 1000 } },
  { id: "print", name: "印刷用", hint: "高画質JPG。リサイズは控えめ", options: { format: "jpeg", quality: 95, maxWidth: 0, maxHeight: 0 } },
  { id: "transparent", name: "背景透過を残す", hint: "PNGで透過を保持。ロゴ・アイコンに", options: { format: "png", keepTransparency: true, maxWidth: 0 } },
  { id: "highquality", name: "高画質優先", hint: "品質高め。サイズ削減は控えめ", options: { format: "webp", quality: 92, maxWidth: 0 } },
  { id: "lightweight", name: "軽量化優先", hint: "品質低め。とにかく軽くしたいとき", options: { format: "webp", quality: 60, maxWidth: 1280 } },
  { id: "compat", name: "互換性優先", hint: "JPGで古い環境でも開きやすく", options: { format: "jpeg", quality: 85, maxWidth: 0 } },
];

// ─── ユーティリティ ─────────────────────────────────────────
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** リサイズ後の目標寸法を計算（純関数・Workerと共有できるロジック） */
export function computeTargetSize(
  srcW: number,
  srcH: number,
  o: Pick<ConvertOptions, "maxWidth" | "maxHeight" | "keepAspect" | "allowUpscale">
): { w: number; h: number } {
  const maxW = o.maxWidth > 0 ? o.maxWidth : Infinity;
  const maxH = o.maxHeight > 0 ? o.maxHeight : Infinity;
  if (maxW === Infinity && maxH === Infinity) return { w: srcW, h: srcH };

  if (o.keepAspect) {
    let scale = Math.min(maxW / srcW, maxH / srcH);
    if (!o.allowUpscale) scale = Math.min(scale, 1);
    return { w: Math.max(1, Math.round(srcW * scale)), h: Math.max(1, Math.round(srcH * scale)) };
  }
  let w = maxW === Infinity ? srcW : maxW;
  let h = maxH === Infinity ? srcH : maxH;
  if (!o.allowUpscale) {
    w = Math.min(w, srcW);
    h = Math.min(h, srcH);
  }
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}

/** 出力ファイル名を組み立てる */
export function buildFilename(originalName: string, index: number, rule: FilenameRule, ext: string): string {
  const dot = originalName.lastIndexOf(".");
  const stem = dot > 0 ? originalName.slice(0, dot) : originalName;
  let base: string;
  if (rule.base === "sequence") base = String(index + 1).padStart(3, "0");
  else if (rule.base === "custom") base = `${rule.customName || "image"}-${String(index + 1).padStart(3, "0")}`;
  else base = stem;

  let name = `${rule.prefix}${base}${rule.suffix}`;
  if (rule.appendFormat) name += `_${ext}`;
  if (rule.spaceToHyphen) name = name.replace(/\s+/g, "-");
  if (rule.lowercase) name = name.toLowerCase();
  name = name.replace(/[\\/:*?"<>|]/g, "_"); // ファイル名に使えない文字を除去
  return `${name}.${ext}`;
}

// ─── ブラウザの出力対応判定 ─────────────────────────────────
let supportCache: Record<string, boolean> | null = null;

/** canvas.toBlob で各形式にエンコードできるかを判定（初回のみ実測） */
export async function detectEncodeSupport(): Promise<Record<OutputFormat, boolean>> {
  if (supportCache) return supportCache as Record<OutputFormat, boolean>;
  const test = async (mime: string): Promise<boolean> => {
    try {
      const c = document.createElement("canvas");
      c.width = 2; c.height = 2;
      const blob: Blob | null = await new Promise((res) => c.toBlob(res, mime, 0.8));
      return !!blob && blob.type === mime;
    } catch {
      return false;
    }
  };
  const result: Record<OutputFormat, boolean> = {
    jpeg: true,
    png: true,
    webp: await test("image/webp"),
    avif: await test("image/avif"),
  };
  supportCache = result;
  return result;
}

/** Worker + OffscreenCanvas が使えるか */
export function canUseWorker(): boolean {
  return typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && typeof createImageBitmap !== "undefined";
}

// ─── Worker ソース（インラインBlobで生成しビルド構成に依存しない）──
// decode(createImageBitmap) → resize/flatten(OffscreenCanvas) → encode(convertToBlob)
// をメインスレッドの外で実行する。
export const WORKER_SOURCE = `
function computeTargetSize(srcW, srcH, o) {
  var maxW = o.maxWidth > 0 ? o.maxWidth : Infinity;
  var maxH = o.maxHeight > 0 ? o.maxHeight : Infinity;
  if (maxW === Infinity && maxH === Infinity) return { w: srcW, h: srcH };
  if (o.keepAspect) {
    var scale = Math.min(maxW / srcW, maxH / srcH);
    if (!o.allowUpscale) scale = Math.min(scale, 1);
    return { w: Math.max(1, Math.round(srcW * scale)), h: Math.max(1, Math.round(srcH * scale)) };
  }
  var w = maxW === Infinity ? srcW : maxW;
  var h = maxH === Infinity ? srcH : maxH;
  if (!o.allowUpscale) { w = Math.min(w, srcW); h = Math.min(h, srcH); }
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}
self.onmessage = async function (e) {
  var d = e.data;
  try {
    var blob = new Blob([d.buffer], { type: d.inType });
    var bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
    var t = computeTargetSize(bmp.width, bmp.height, d.opts);
    var canvas = new OffscreenCanvas(t.w, t.h);
    var ctx = canvas.getContext("2d");
    if (!d.opts.alpha) { ctx.fillStyle = d.opts.background; ctx.fillRect(0, 0, t.w, t.h); }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, t.w, t.h);
    bmp.close();
    var out = await canvas.convertToBlob({ type: d.outMime, quality: d.quality });
    if (!out || out.type !== d.outMime) { self.postMessage({ id: d.id, ok: false, error: "unsupported-output" }); return; }
    var ab = await out.arrayBuffer();
    self.postMessage({ id: d.id, ok: true, ab: ab, outType: out.type, w: t.w, h: t.h, srcW: bmp.width, srcH: bmp.height }, [ab]);
  } catch (err) {
    self.postMessage({ id: d.id, ok: false, error: String((err && err.message) || err) });
  }
};
`;

// ─── メインスレッド版の変換（Worker非対応時のフォールバック）──
export interface ConvertResult {
  blob: Blob;
  outW: number;
  outH: number;
  srcW: number;
  srcH: number;
}

export async function convertOnMainThread(file: File, opts: ConvertOptions): Promise<ConvertResult> {
  const fmt = formatByKey(opts.format);
  const useAlpha = fmt.supportsAlpha && opts.keepTransparency;
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const t = computeTargetSize(bmp.width, bmp.height, opts);
  const canvas = document.createElement("canvas");
  canvas.width = t.w;
  canvas.height = t.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  if (!useAlpha) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, t.w, t.h);
  }
  // 縮小・拡大時の画質を最大化（既定の "low" では劣化するため）
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, t.w, t.h);
  const srcW = bmp.width, srcH = bmp.height;
  bmp.close?.();
  const q = opts.format === "png" ? undefined : opts.quality / 100;
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, fmt.mime, q));
  if (!blob || blob.type !== fmt.mime) throw new Error("unsupported-output");
  return { blob, outW: t.w, outH: t.h, srcW, srcH };
}
