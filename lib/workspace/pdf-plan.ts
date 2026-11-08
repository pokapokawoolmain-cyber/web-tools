// ============================================================
// PDFワークスペースの処理計画（純関数。ブラウザ・Node のどちらでも動く）
//
// - ページは「どのファイルの何ページ目を、何度回して出すか」の並びで表す
// - 並び替え・回転・削除はこの並びを作り直すだけ（PDF本体は書き出すまで触らない）
// - 書き出し時にこの並びから PDF を組み立てる（pdf-export.ts）
// ============================================================

export const PDF_LIMITS = {
  maxFiles: 20,
  /** 合計サイズ（暫定。iPhone 実機で測ってから確定する） */
  maxTotalBytes: 100 * 1024 * 1024,
  /** 合計ページ数（暫定） */
  maxPages: 500,
} as const;

export type Rotation = 0 | 90 | 180 | 270;

export interface PageItem {
  /** 画面で使う一意のキー（ファイル番号-ページ番号） */
  key: string;
  fileIndex: number;
  /** 0 始まりのページ番号 */
  pageIndex: number;
  /** 元のページに足す回転 */
  rotation: Rotation;
  /** 元のページの向き（回転を反映した見た目。おすすめの判定に使う） */
  landscape: boolean;
}

export interface PdfHead {
  isPdf: boolean;
  /** 暗号化されている（パスワード付き）。先頭と末尾の辞書から判定する目安 */
  encrypted: boolean;
}

const ascii = (b: Uint8Array) => {
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return s;
};

/**
 * 先頭と末尾のバイトから、PDF かどうかと暗号化の有無を判定する。
 * 暗号化の最終判断は読み込み時（pdf-lib が EncryptedPDFError を出す）に行う。
 */
export function sniffPdf(head: Uint8Array, tail: Uint8Array = new Uint8Array()): PdfHead {
  // 仕様上 %PDF- は先頭1024バイト以内にあればよい
  const h = ascii(head.subarray(0, Math.min(head.length, 1024)));
  const isPdf = h.includes("%PDF-");
  if (!isPdf) return { isPdf: false, encrypted: false };
  const encrypted = /\/Encrypt\s*\d+\s+\d+\s+R|\/Encrypt\s*<</.test(ascii(tail)) || /\/Encrypt\s*\d+\s+\d+\s+R/.test(ascii(head));
  return { isPdf, encrypted };
}

export function pageKey(fileIndex: number, pageIndex: number) {
  return `${fileIndex}-${pageIndex}`;
}

/** 読み込んだファイルのページを並べる（ファイル順・ページ順） */
export function initialPages(files: { pages: { landscape: boolean }[] }[]): PageItem[] {
  return files.flatMap((f, fileIndex) =>
    f.pages.map((p, pageIndex) => ({ key: pageKey(fileIndex, pageIndex), fileIndex, pageIndex, rotation: 0 as Rotation, landscape: p.landscape })),
  );
}

export function rotatePages(items: PageItem[], keys: Set<string>, delta: 90 | -90 | 180): PageItem[] {
  return items.map((p) => {
    if (!keys.has(p.key)) return p;
    const rotation = ((((p.rotation + delta) % 360) + 360) % 360) as Rotation;
    const quarter = Math.abs(delta) === 90;
    return { ...p, rotation, landscape: quarter ? !p.landscape : p.landscape };
  });
}

export function removePages(items: PageItem[], keys: Set<string>): PageItem[] {
  return items.filter((p) => !keys.has(p.key));
}

/** from 番目のページを to 番目へ動かす（0 始まり） */
export function movePage(items: PageItem[], from: number, to: number): PageItem[] {
  if (from === to || from < 0 || from >= items.length) return items;
  const next = items.slice();
  const [it] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, it);
  return next;
}

export interface RangeResult {
  /** 1 始まり・両端を含む範囲 */
  ranges: [number, number][];
  error?: string;
}

/**
 * 「1-3, 5, 8-」のようなページ指定を読む。
 * 全角数字・全角記号・「、」「〜」も受け付ける。"8-" は最後まで、"-3" は 1〜3。
 */
export function parseRanges(input: string, total: number): RangeResult {
  const text = input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[－ー―‐〜～]/g, "-")
    .replace(/[、，]/g, ",")
    .replace(/\s+/g, "");
  if (!text) return { ranges: [], error: "ページを指定してください（例: 1-3, 5, 8-）" };
  const ranges: [number, number][] = [];
  for (const part of text.split(",").filter(Boolean)) {
    const m = /^(\d*)-(\d*)$/.exec(part) ?? (/^(\d+)$/.test(part) ? [part, part, part] : null);
    if (!m || (m[1] === "" && m[2] === "")) return { ranges: [], error: `「${part}」を読み取れませんでした（例: 1-3, 5, 8-）` };
    const start = m[1] === "" ? 1 : Number(m[1]);
    const end = m[2] === "" ? total : Number(m[2]);
    if (start < 1 || end < 1) return { ranges: [], error: "ページ番号は1から始まります" };
    if (start > total || end > total) return { ranges: [], error: `このPDFは全${total}ページです（「${part}」は範囲外）` };
    if (start > end) return { ranges: [], error: `「${part}」は始まりが終わりより後ろになっています` };
    ranges.push([start, end]);
  }
  return { ranges };
}

export type SplitMode = "single" | "ranges" | "each" | "every";

/**
 * 書き出す PDF ごとのページの並びを作る。
 * single: 全部で1つ / ranges: 指定範囲ごと / each: 1ページずつ / every: n ページずつ
 */
export function splitGroups(items: PageItem[], mode: SplitMode, opt: { ranges?: [number, number][]; every?: number } = {}): PageItem[][] {
  if (!items.length) return [];
  switch (mode) {
    case "single":
      return [items];
    case "each":
      return items.map((p) => [p]);
    case "every": {
      const n = Math.max(1, Math.floor(opt.every ?? 1));
      const out: PageItem[][] = [];
      for (let i = 0; i < items.length; i += n) out.push(items.slice(i, i + n));
      return out;
    }
    case "ranges":
      return (opt.ranges ?? []).map(([s, e]) => items.slice(s - 1, e)).filter((g) => g.length);
  }
}

export type PdfPurposeId = "merge" | "extract" | "to-image" | "organize" | "split-each";

export interface PdfPurpose {
  id: PdfPurposeId;
  label: string;
  detail: string;
}

export interface PdfSuggestion {
  purpose: PdfPurpose;
  reason?: string;
}

const PDF_PURPOSES: Record<PdfPurposeId, PdfPurpose> = {
  merge: { id: "merge", label: "1つのPDFにまとめる", detail: "入れた順にまとめて1つのPDFに。順番はあとから入れ替えられます" },
  extract: { id: "extract", label: "必要なページだけ取り出す", detail: "「1-3, 5」のようにページを指定して、新しいPDFに" },
  "to-image": { id: "to-image", label: "画像（JPG・PNG）にする", detail: "1ページを1枚の画像に。複数ページはZIPにまとめて保存" },
  organize: { id: "organize", label: "ページを並べ替え・回転・削除する", detail: "ページを見ながら整えて、1つのPDFに保存" },
  "split-each": { id: "split-each", label: "1ページずつ別のPDFに分ける", detail: "ページごとに別のファイルにしてZIPで保存" },
};

export interface PdfEntry {
  pages: number;
  /** 横向きのページ数 */
  landscapePages: number;
}

/** 入れたPDFの状態から、よくある目的を理由付きで並べる */
export function suggestPdf(files: PdfEntry[]): PdfSuggestion[] {
  const total = files.reduce((s, f) => s + f.pages, 0);
  const landscape = files.reduce((s, f) => s + f.landscapePages, 0);
  const ranked: PdfSuggestion[] = [];
  const add = (id: PdfPurposeId, reason?: string) => {
    if (!ranked.some((r) => r.purpose.id === id)) ranked.push({ purpose: PDF_PURPOSES[id], reason });
  };
  if (files.length > 1) add("merge", `PDFが${files.length}件あります`);
  if (total === 1) add("to-image", "1ページだけのPDFです");
  if (landscape > 0 && landscape < total) add("organize", `縦と横のページが混ざっています（横 ${landscape}ページ）`);
  if (total >= 10) add("extract", `全部で${total}ページあります`);
  for (const id of ["organize", "to-image", "extract", "split-each", "merge"] as PdfPurposeId[]) {
    if (id === "merge" && files.length < 2) continue;
    add(id);
  }
  return ranked;
}

/** 書き出すファイル名（元の名前を土台に、使えない文字を置き換える） */
export function pdfOutputName(base: string, suffix = "", ext = "pdf") {
  const stem = base.replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]/g, "_") || "document";
  return `${stem}${suffix}.${ext}`;
}
