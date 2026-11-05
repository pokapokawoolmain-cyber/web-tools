// ============================================================
// 画像1枚の処理（Worker とメインスレッドで共通）
//
// 入力: 向き補正済みの ImageBitmap と設定 → 出力: 書き出した Blob と結果情報。
// キャンバスの作り方だけを外から渡すので、Worker（OffscreenCanvas）でも
// メインスレッド（HTMLCanvasElement）でも同じ処理になる。
// ============================================================
import { MIME, LIMITS, planDraw, resolveFormat, type ImageJobOptions, type OutputFormat } from "./image-plan";
import type { FileKind } from "./sniff";

export interface CanvasLike {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  encode(type: string, quality?: number): Promise<Blob | null>;
}

export type CanvasFactory = (w: number, h: number) => CanvasLike;

export interface ImageJobResult {
  blob: Blob;
  format: OutputFormat;
  width: number;
  height: number;
  srcWidth: number;
  srcHeight: number;
  /** 実際に使った画質（1〜100。PNG は undefined） */
  quality?: number;
  /** 目標ファイルサイズを指定したときに達成できたか */
  metTarget?: boolean;
}

/** 利用者に見せるエラーの種類（文言は画面側で決める） */
export type ImageJobErrorCode = "decode-failed" | "too-many-pixels" | "unsupported-output" | "canvas-failed";

export class ImageJobError extends Error {
  constructor(public code: ImageJobErrorCode) {
    super(code);
  }
}

const TARGET_MIN_QUALITY = 0.4;
const TARGET_STEPS = 6;
const TARGET_MIN_SCALE = 0.3;

export async function runImageJob(
  bmp: ImageBitmap,
  input: { kind: FileKind; hasAlpha: boolean },
  opts: ImageJobOptions,
  makeCanvas: CanvasFactory,
): Promise<ImageJobResult> {
  if (bmp.width * bmp.height > LIMITS.maxPixels) throw new ImageJobError("too-many-pixels");
  const format = resolveFormat(opts.format, input.kind, input.hasAlpha);
  const mime = MIME[format];
  const lossy = format !== "png";

  const render = async (scale: number, quality: number) => {
    const plan = planDraw(bmp.width, bmp.height, opts, scale);
    const c = makeCanvas(plan.canvasW, plan.canvasH);
    // JPG は透過できない。余白で縦横比を合わせたときも余白を背景色で塗る
    if (format === "jpeg" || plan.padded) {
      c.ctx.fillStyle = opts.background;
      c.ctx.fillRect(0, 0, plan.canvasW, plan.canvasH);
    }
    c.ctx.imageSmoothingEnabled = true;
    c.ctx.imageSmoothingQuality = "high";
    c.ctx.drawImage(bmp, plan.sx, plan.sy, plan.sw, plan.sh, plan.dx, plan.dy, plan.dw, plan.dh);
    const blob = await c.encode(mime, lossy ? quality : undefined);
    if (!blob) throw new ImageJobError("canvas-failed");
    if (blob.type !== mime) throw new ImageJobError("unsupported-output");
    return { blob, plan };
  };

  const q0 = Math.min(1, Math.max(0.01, opts.quality / 100));
  let { blob, plan } = await render(1, q0);
  let quality = q0;
  let metTarget: boolean | undefined;

  if (opts.targetBytes > 0) {
    if (blob.size > opts.targetBytes && lossy) {
      // 画質を二分探索で下げ、目標以下で最も高い画質を探す
      let lo = TARGET_MIN_QUALITY, hi = q0;
      let best: { blob: Blob; plan: typeof plan; q: number } | null = null;
      for (let i = 0; i < TARGET_STEPS; i++) {
        const mid = (lo + hi) / 2;
        const r = await render(1, mid);
        if (r.blob.size <= opts.targetBytes) { best = { ...r, q: mid }; lo = mid; }
        else hi = mid;
      }
      if (best) { blob = best.blob; plan = best.plan; quality = best.q; }
      else { quality = TARGET_MIN_QUALITY; ({ blob, plan } = await render(1, quality)); }
    }
    // 画質だけで届かないとき（PNG を含む）は寸法を段階的に縮める
    let scale = 1;
    while (blob.size > opts.targetBytes && scale > TARGET_MIN_SCALE) {
      scale *= 0.85;
      ({ blob, plan } = await render(scale, quality));
    }
    metTarget = blob.size <= opts.targetBytes;
  }

  return {
    blob,
    format,
    width: plan.canvasW,
    height: plan.canvasH,
    srcWidth: bmp.width,
    srcHeight: bmp.height,
    quality: lossy ? Math.round(quality * 100) : undefined,
    metTarget,
  };
}

/** Worker 内で使うキャンバス */
export const offscreenFactory: CanvasFactory = (w, h) => {
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageJobError("canvas-failed");
  return { ctx, encode: (type, quality) => canvas.convertToBlob({ type, quality }) };
};

/** メインスレッドで使うキャンバス（OffscreenCanvas が使えないブラウザ向け） */
export const domCanvasFactory: CanvasFactory = (w, h) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageJobError("canvas-failed");
  return { ctx, encode: (type, quality) => new Promise((res) => canvas.toBlob(res, type, quality)) };
};

/** 向き補正つきでデコードする */
export async function decodeImage(blob: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    throw new ImageJobError("decode-failed");
  }
}
