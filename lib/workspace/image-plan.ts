// ============================================================
// 画像ワークスペースの処理計画（純関数）
//
// 元画像の寸法と設定から「どこを切り取り、どの大きさのキャンバスのどこに描くか」を決める。
// Worker・メインスレッド・将来のサーバー処理で同じ計算を使う。
// ============================================================
import type { FileKind } from "./sniff";

// ─── 上限（PoC の受け入れ基準） ─────────────────────────────
export const LIMITS = {
  maxFiles: 50,
  maxBytes: 25 * 1024 * 1024,
  maxPixels: 50_000_000,
  /** 出力キャンバスの一辺の上限（ブラウザのキャンバス制限に余裕を持たせる） */
  maxOutputEdge: 12_000,
} as const;

/** ワークスペースで受け付ける画像形式 */
export const INPUT_KINDS: FileKind[] = ["jpeg", "png", "webp", "gif", "bmp", "avif", "heic"];

export type OutputFormat = "jpeg" | "png" | "webp" | "avif";
export type ResizeMode = "none" | "long" | "width" | "height" | "percent";
export type AspectRatio = "none" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
export type AspectFit = "pad" | "crop";

export interface ImageJobOptions {
  resize: { mode: ResizeMode; value: number };
  aspect: { ratio: AspectRatio; fit: AspectFit };
  /** "keep" は元の形式（JPG・PNG・WebP・AVIF 以外は JPG か PNG に置き換える） */
  format: OutputFormat | "keep";
  /** 1〜100（PNG では使わない） */
  quality: number;
  /** 目標ファイルサイズ（バイト）。0 で指定なし */
  targetBytes: number;
  /** 透過を残さない形式で塗る背景色・余白の色 */
  background: string;
}

export const DEFAULT_JOB_OPTIONS: ImageJobOptions = {
  resize: { mode: "none", value: 0 },
  aspect: { ratio: "none", fit: "pad" },
  format: "keep",
  quality: 85,
  targetBytes: 0,
  background: "#ffffff",
};

export const MIME: Record<OutputFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export const EXT: Record<OutputFormat, string> = { jpeg: "jpg", png: "png", webp: "webp", avif: "avif" };

const RATIO: Record<Exclude<AspectRatio, "none">, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

/** 出力形式を決める（"keep" のとき、書き出せない形式は置き換える） */
export function resolveFormat(format: ImageJobOptions["format"], input: FileKind, hasAlpha: boolean): OutputFormat {
  if (format !== "keep") return format;
  if (input === "jpeg" || input === "png" || input === "webp" || input === "avif") return input;
  // GIF・BMP・HEIC は書き出せないため、透過があれば PNG、なければ JPG
  return hasAlpha ? "png" : "jpeg";
}

export interface DrawPlan {
  canvasW: number;
  canvasH: number;
  /** 元画像から切り取る範囲 */
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  /** キャンバス上の描画位置 */
  dx: number;
  dy: number;
  dw: number;
  dh: number;
  /** 余白を塗る必要があるか（縦横比を「余白で合わせる」とき） */
  padded: boolean;
}

/**
 * 元画像の寸法（EXIF の向き補正後）と設定から描画計画を作る。
 * 順序: 縦横比（切り抜き or 余白）→ 大きさ変更。元より大きくはしない。
 */
export function planDraw(srcW: number, srcH: number, opts: Pick<ImageJobOptions, "resize" | "aspect">, extraScale = 1): DrawPlan {
  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  // 縦横比を合わせた「仮のキャンバス」（元画像の画素単位）
  let baseW = srcW, baseH = srcH;
  let offX = 0, offY = 0;
  let padded = false;

  if (opts.aspect.ratio !== "none") {
    const r = RATIO[opts.aspect.ratio];
    const srcR = srcW / srcH;
    if (opts.aspect.fit === "crop") {
      if (srcR > r) { sw = srcH * r; sx = (srcW - sw) / 2; }
      else if (srcR < r) { sh = srcW / r; sy = (srcH - sh) / 2; }
      baseW = sw; baseH = sh;
    } else {
      if (srcR > r) { baseH = srcW / r; offY = (baseH - srcH) / 2; }
      else if (srcR < r) { baseW = srcH * r; offX = (baseW - srcW) / 2; }
      padded = baseW !== srcW || baseH !== srcH;
    }
  }

  // 大きさ変更の倍率（拡大はしない）
  let scale = 1;
  const v = opts.resize.value;
  switch (opts.resize.mode) {
    case "long": if (v > 0) scale = v / Math.max(baseW, baseH); break;
    case "width": if (v > 0) scale = v / baseW; break;
    case "height": if (v > 0) scale = v / baseH; break;
    case "percent": if (v > 0) scale = v / 100; break;
  }
  scale = Math.min(scale, 1) * extraScale;
  // ブラウザのキャンバス上限を超えないように抑える
  const maxEdge = Math.max(baseW, baseH) * scale;
  if (maxEdge > LIMITS.maxOutputEdge) scale *= LIMITS.maxOutputEdge / maxEdge;

  const canvasW = Math.max(1, Math.round(baseW * scale));
  const canvasH = Math.max(1, Math.round(baseH * scale));
  return {
    canvasW,
    canvasH,
    sx, sy, sw, sh,
    dx: offX * scale,
    dy: offY * scale,
    dw: (padded ? srcW : sw) * scale,
    dh: (padded ? srcH : sh) * scale,
    padded,
  };
}

/** 出力ファイル名（元の名前＋新しい拡張子。使えない文字は置き換える） */
export function outputName(originalName: string, format: OutputFormat): string {
  const dot = originalName.lastIndexOf(".");
  const stem = (dot > 0 ? originalName.slice(0, dot) : originalName).replace(/[\\/:*?"<>|]/g, "_") || "image";
  return `${stem}.${EXT[format]}`;
}

/** 同じ名前が重なったら連番を付ける */
export function dedupeNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((n) => {
    const count = seen.get(n) ?? 0;
    seen.set(n, count + 1);
    if (count === 0) return n;
    const dot = n.lastIndexOf(".");
    return `${n.slice(0, dot)}-${count + 1}${n.slice(dot)}`;
  });
}
