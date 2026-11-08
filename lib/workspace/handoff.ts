// ============================================================
// ホームで入れたファイルをワークスペースへ渡す
//
// ページ移動（Next.js のクライアント遷移）ではメモリが引き継がれるため、
// ここに一時的に置いて、移動先のワークスペースが1回だけ受け取る。
// ファイルは保存も送信もしない（ページを再読み込みすると消える）。
// ============================================================

let pending: { target: "image" | "pdf"; files: File[] } | null = null;

export function handOff(target: "image" | "pdf", files: File[]) {
  pending = { target, files };
}

/** 自分あてのファイルを受け取る（受け取ったら空にする） */
export function takeHandOff(target: "image" | "pdf"): File[] {
  if (!pending || pending.target !== target) return [];
  const { files } = pending;
  pending = null;
  return files;
}

const PDF_RE = /\.pdf$/i;

/** 入れたファイルの行き先を決める。PDFが1つでもあればPDF、なければ画像 */
export function routeFiles(files: File[]): { target: "image" | "pdf"; files: File[] } | null {
  const pdfs = files.filter((f) => f.type === "application/pdf" || PDF_RE.test(f.name));
  if (pdfs.length) return { target: "pdf", files: pdfs };
  const images = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif|jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
  if (images.length) return { target: "image", files: images };
  return null;
}
