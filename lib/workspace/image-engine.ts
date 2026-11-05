// ============================================================
// 画像ワークスペースの実行エンジン
//
// - Worker を CPU コア数の半分（最大4）だけ立て、1枚ずつ並列に処理する
// - Worker / OffscreenCanvas が使えないブラウザではメインスレッドで処理する
// - ブラウザが HEIC を直接読めない場合は heic2any で一度 PNG にしてから処理する
// - 中断すると Worker を止め、未処理のファイルは「中断」にする
// - ファイルは端末の外へ一切送信しない
// ============================================================
import { decodeImage, domCanvasFactory, ImageJobError, runImageJob, type ImageJobErrorCode, type ImageJobResult } from "./image-core";
import type { ImageJobOptions } from "./image-plan";
import type { FileKind } from "./sniff";
import type { WorkerRequest } from "./image.worker";

export interface EngineInput {
  id: number;
  file: File;
  kind: FileKind;
  hasAlpha: boolean;
}

export type EngineOutcome =
  | { id: number; ok: true; result: ImageJobResult }
  | { id: number; ok: false; code: ImageJobErrorCode | "cancelled" };

type WorkerReply = { id: number; ok: true; result: ImageJobResult } | { id: number; ok: false; code: ImageJobErrorCode };

export function workerCount(): number {
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2;
  return Math.max(1, Math.min(4, Math.floor(cores / 2)));
}

function canUseWorker(): boolean {
  return typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && typeof createImageBitmap !== "undefined";
}

async function heicToPng(file: Blob): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const out = await heic2any({ blob: file, toType: "image/png" });
  return Array.isArray(out) ? out[0] : out;
}

export class ImageEngine {
  private workers: Worker[] = [];
  private cancelled = false;
  /** Worker の返事待ち。terminate した Worker は返事をしないため、止めるときにこちらから「中断」で終わらせる */
  private pending = new Set<() => void>();

  /** すべてのファイルを処理し、1枚終わるごとに onDone を呼ぶ */
  async run(inputs: EngineInput[], opts: ImageJobOptions, onDone: (o: EngineOutcome) => void): Promise<void> {
    this.cancelled = false;
    const queue = [...inputs];
    const useWorker = canUseWorker();
    const size = useWorker ? Math.min(workerCount(), queue.length) : 1;

    const lane = async (worker: Worker | null) => {
      while (!this.cancelled) {
        const item = queue.shift();
        if (!item) return;
        onDone(await this.processOne(item, opts, worker));
      }
    };

    if (useWorker) {
      this.workers = Array.from({ length: size }, () => new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module" }));
    }
    try {
      await Promise.all(useWorker ? this.workers.map((w) => lane(w)) : [lane(null)]);
    } finally {
      this.terminate();
    }
    // 中断された分を知らせる
    for (const item of queue) onDone({ id: item.id, ok: false, code: "cancelled" });
  }

  cancel() {
    this.cancelled = true;
    this.terminate();
  }

  private terminate() {
    for (const w of this.workers) w.terminate();
    this.workers = [];
    for (const settle of [...this.pending]) settle();
  }

  private async processOne(item: EngineInput, opts: ImageJobOptions, worker: Worker | null): Promise<EngineOutcome> {
    const attempt = (blob: Blob, kind: FileKind, hasAlpha: boolean) =>
      worker ? this.viaWorker(worker, { id: item.id, blob, kind, hasAlpha, opts }) : this.onMainThread(item.id, blob, kind, hasAlpha, opts);

    let outcome = await attempt(item.file, item.kind, item.hasAlpha);
    // HEIC をブラウザが直接読めないときは PNG に変換してからやり直す
    if (!outcome.ok && outcome.code === "decode-failed" && item.kind === "heic" && !this.cancelled) {
      try {
        const png = await heicToPng(item.file);
        // 中身は PNG だが、元の形式は HEIC として扱う（"keep" のとき JPG で書き出すため）
        outcome = await attempt(png, "heic", false);
      } catch {
        outcome = { id: item.id, ok: false, code: "decode-failed" };
      }
    }
    if (this.cancelled && !outcome.ok) return { id: item.id, ok: false, code: "cancelled" };
    return outcome;
  }

  private viaWorker(worker: Worker, req: WorkerRequest): Promise<EngineOutcome> {
    return new Promise((resolve) => {
      const finish = (o: EngineOutcome) => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        this.pending.delete(onTerminate);
        resolve(o);
      };
      const onMessage = (e: MessageEvent<WorkerReply>) => {
        if (e.data.id === req.id) finish(e.data);
      };
      const onError = () => finish({ id: req.id, ok: false, code: this.cancelled ? "cancelled" : "canvas-failed" });
      const onTerminate = () => finish({ id: req.id, ok: false, code: "cancelled" });
      this.pending.add(onTerminate);
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage(req);
    });
  }

  private async onMainThread(id: number, blob: Blob, kind: FileKind, hasAlpha: boolean, opts: ImageJobOptions): Promise<EngineOutcome> {
    let bmp: ImageBitmap | null = null;
    try {
      bmp = await decodeImage(blob);
      const result = await runImageJob(bmp, { kind, hasAlpha }, opts, domCanvasFactory);
      return { id, ok: true, result };
    } catch (err) {
      return { id, ok: false, code: err instanceof ImageJobError ? err.code : "canvas-failed" };
    } finally {
      bmp?.close();
    }
  }
}
