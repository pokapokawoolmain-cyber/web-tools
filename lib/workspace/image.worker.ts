// ============================================================
// 画像処理 Worker（メインスレッドを止めずに1枚ずつ処理する）
// ============================================================
import { decodeImage, ImageJobError, offscreenFactory, runImageJob } from "./image-core";
import type { ImageJobOptions } from "./image-plan";
import type { FileKind } from "./sniff";

export interface WorkerRequest {
  id: number;
  blob: Blob;
  kind: FileKind;
  hasAlpha: boolean;
  opts: ImageJobOptions;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, blob, kind, hasAlpha, opts } = e.data;
  let bmp: ImageBitmap | null = null;
  try {
    bmp = await decodeImage(blob);
    const result = await runImageJob(bmp, { kind, hasAlpha }, opts, offscreenFactory);
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    const code = err instanceof ImageJobError ? err.code : "canvas-failed";
    self.postMessage({ id, ok: false, code });
  } finally {
    bmp?.close();
  }
};
