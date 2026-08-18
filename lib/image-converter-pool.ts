// ============================================================
// 画像変換Workerプール
//
// WORKER_SOURCE から Worker を生成し、変換をメインスレッドの外で行う。
// Worker / OffscreenCanvas 非対応環境では convertOnMainThread に自動フォールバック。
// すべてブラウザ内で完結し、ネットワーク送信は一切行わない。
// ============================================================
import {
  WORKER_SOURCE,
  canUseWorker,
  convertOnMainThread,
  formatByKey,
  type ConvertOptions,
  type ConvertResult,
} from "./image-converter";

interface Pending {
  resolve: (r: ConvertResult) => void;
  reject: (e: Error) => void;
}

export class ConverterPool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private waiters: ((w: Worker) => void)[] = [];
  private pending = new Map<number, Pending>();
  private blobUrl: string | null = null;
  private seq = 0;
  private readonly useWorker: boolean;

  constructor(size: number) {
    this.useWorker = canUseWorker();
    if (this.useWorker) {
      try {
        this.blobUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
        for (let i = 0; i < Math.max(1, size); i++) {
          const w = new Worker(this.blobUrl);
          w.onmessage = (e) => this.onMessage(w, e);
          this.workers.push(w);
          this.idle.push(w);
        }
      } catch {
        // Worker生成に失敗したらメインスレッドにフォールバック
        this.workers = [];
        this.idle = [];
      }
    }
  }

  get mode(): "worker" | "main" {
    return this.workers.length > 0 ? "worker" : "main";
  }

  private onMessage(w: Worker, e: MessageEvent) {
    const d = e.data as {
      id: number; ok: boolean; ab?: ArrayBuffer; outType?: string;
      w?: number; h?: number; srcW?: number; srcH?: number; error?: string;
    };
    const p = this.pending.get(d.id);
    this.pending.delete(d.id);
    // ワーカーをアイドルに戻す
    const waiter = this.waiters.shift();
    if (waiter) waiter(w);
    else this.idle.push(w);
    if (!p) return;
    if (d.ok && d.ab) {
      p.resolve({
        blob: new Blob([d.ab], { type: d.outType }),
        outW: d.w ?? 0, outH: d.h ?? 0, srcW: d.srcW ?? 0, srcH: d.srcH ?? 0,
      });
    } else {
      p.reject(new Error(d.error || "conversion-failed"));
    }
  }

  private acquire(): Promise<Worker> {
    const w = this.idle.pop();
    if (w) return Promise.resolve(w);
    return new Promise((res) => this.waiters.push(res));
  }

  /** 1ファイルを変換する。すべてブラウザ内処理。 */
  async convert(file: File, opts: ConvertOptions): Promise<ConvertResult> {
    if (this.workers.length === 0) {
      // フォールバック（メインスレッド）
      return convertOnMainThread(file, opts);
    }
    const fmt = formatByKey(opts.format);
    const useAlpha = fmt.supportsAlpha && opts.keepTransparency;
    const buffer = await file.arrayBuffer();
    const w = await this.acquire();
    const id = ++this.seq;
    return new Promise<ConvertResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      w.postMessage(
        {
          id, buffer, inType: file.type || "image/*", outMime: fmt.mime,
          quality: opts.quality / 100,
          opts: {
            maxWidth: opts.maxWidth, maxHeight: opts.maxHeight,
            keepAspect: opts.keepAspect, allowUpscale: opts.allowUpscale,
            alpha: useAlpha, background: opts.background,
          },
        },
        [buffer]
      );
    });
  }

  destroy() {
    for (const w of this.workers) w.terminate();
    this.workers = [];
    this.idle = [];
    this.waiters = [];
    this.pending.clear();
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = null;
  }
}
