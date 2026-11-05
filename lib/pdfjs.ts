// ============================================================
// PDF.js の読み込み（全ツール共通）
//
// - ライブラリ本体と worker（public/pdf.worker.min.mjs）のバージョンは必ず一致させる。
//   worker は `npm run build` の前に scripts/copy-pdf-worker.mjs が node_modules からコピーする。
// - 外部 CDN からは読み込まない（自サイトから配信）。
// - 脆弱性対応のため pdfjs-dist は 6.2.108 以上を使う（GHSA-hq66-cqwq-w95j）。
// ============================================================

export const PDF_WORKER_SRC = "/pdf.worker.min.mjs";

type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

/** PDF.js を動的に読み込み、worker の場所を設定して返す（2回目以降は同じものを返す） */
export function loadPdfjs(): Promise<PdfjsModule> {
  pdfjsPromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
    return pdfjs;
  });
  return pdfjsPromise;
}

/**
 * PDF を開く。PDF.js は渡したデータを worker へ移す（元の ArrayBuffer は空になる）ため、
 * 呼び出し側で同じデータを使い回しても壊れないよう、必ず複製を渡す。
 */
export async function openPdfDocument(data: ArrayBuffer | Uint8Array) {
  const pdfjs = await loadPdfjs();
  const copy = data instanceof Uint8Array ? data.slice() : new Uint8Array(data.slice(0));
  return pdfjs.getDocument({ data: copy }).promise;
}
