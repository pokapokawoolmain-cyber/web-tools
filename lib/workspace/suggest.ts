// ============================================================
// Smart File Entry：入れた画像の状態から「よくある目的」を並べる（純関数）
//
// 利用者がツールを選ぶのではなく、完成させたいものを選べるようにする。
// 各目的は ImageJobOptions と書き出し方法のセットで、選ぶと設定がまとめて入る。
// ============================================================
import type { FileKind } from "./sniff";
import { DEFAULT_JOB_OPTIONS, type ImageJobOptions } from "./image-plan";

export type OutputMode = "files" | "zip" | "pdf";

export interface Purpose {
  id: string;
  label: string;
  /** 何が起きるかを一言で（設定の要約） */
  detail: string;
  options: ImageJobOptions;
  output: OutputMode;
}

export interface EntryFile {
  kind: FileKind;
  bytes: number;
  width?: number;
  height?: number;
  hasAlpha?: boolean;
}

export interface Suggestion {
  purpose: Purpose;
  /** この目的を上に出した理由（入れたファイルの状態） */
  reason?: string;
}

const MB = 1024 * 1024;

const base = (patch: Partial<ImageJobOptions>): ImageJobOptions => ({
  ...DEFAULT_JOB_OPTIONS,
  ...patch,
  resize: { ...DEFAULT_JOB_OPTIONS.resize, ...(patch.resize ?? {}) },
  aspect: { ...DEFAULT_JOB_OPTIONS.aspect, ...(patch.aspect ?? {}) },
});

/** 目的の一覧（表示順の初期値） */
export function purposes(multiple: boolean): Purpose[] {
  const out: OutputMode = multiple ? "zip" : "files";
  return [
    {
      id: "lighten",
      label: "メールやアップロード用に軽くする",
      detail: "長辺2,000px・1枚1MB以内を目安にJPGで書き出し",
      options: base({ resize: { mode: "long", value: 2000 }, format: "jpeg", quality: 82, targetBytes: 1 * MB }),
      output: out,
    },
    {
      id: "jpg",
      label: "iPhone写真などをJPGにする",
      detail: "大きさはそのまま、どの環境でも開けるJPGに変換",
      options: base({ format: "jpeg", quality: 90 }),
      output: out,
    },
    {
      id: "pdf",
      label: "1つのPDFにまとめる",
      detail: "1枚を1ページにしてA4のPDFに。提出書類・スキャンの送付に",
      options: base({ resize: { mode: "long", value: 2400 }, format: "jpeg", quality: 85 }),
      output: "pdf",
    },
    {
      id: "sns",
      label: "SNSに投稿する",
      detail: "長辺1,440pxのJPG。Instagram・X・LINEで扱いやすい大きさ",
      options: base({ resize: { mode: "long", value: 1440 }, format: "jpeg", quality: 85 }),
      output: out,
    },
    {
      id: "square",
      label: "正方形にする",
      detail: "縦横比1:1。余白は白で埋める（切り抜きにも変更可）",
      options: base({ aspect: { ratio: "1:1", fit: "pad" }, resize: { mode: "long", value: 1440 }, format: "jpeg", quality: 88 }),
      output: out,
    },
    {
      id: "web",
      label: "Webサイト用にWebPで軽くする",
      detail: "横幅1,600px・WebP。ページの表示を速くしたいとき",
      options: base({ resize: { mode: "width", value: 1600 }, format: "webp", quality: 80 }),
      output: out,
    },
    {
      id: "custom",
      label: "自分で細かく設定する",
      detail: "大きさ・縦横比・形式・画質を自由に選ぶ",
      options: base({}),
      output: out,
    },
  ];
}

/**
 * 入れたファイルの状態から目的を並べ替え、先頭を初期選択にする。
 * ルールは単純に保ち、なぜその順番なのかを reason で必ず説明する。
 */
export function suggest(files: EntryFile[]): Suggestion[] {
  const multiple = files.length > 1;
  const list = purposes(multiple);
  const byId = new Map(list.map((p) => [p.id, p]));
  const ranked: Suggestion[] = [];
  const push = (id: string, reason?: string) => {
    const p = byId.get(id);
    if (p && !ranked.some((s) => s.purpose.id === id)) ranked.push({ purpose: p, reason });
  };

  const heic = files.filter((f) => f.kind === "heic").length;
  const heavy = files.filter((f) => f.bytes >= 5 * MB).length;
  const huge = files.filter((f) => (f.width ?? 0) * (f.height ?? 0) >= 12_000_000).length;
  const portraitDocs = files.filter((f) => f.width && f.height && f.height > f.width).length;

  if (heic > 0) push("jpg", `HEIC形式の写真が${heic}枚あります（パソコンや一部のサイトでは開けません）`);
  if (heavy > 0 || huge > 0) {
    push("lighten", heavy > 0 ? `5MBを超える画像が${heavy}枚あります` : `1,200万画素を超える大きな画像が${huge}枚あります`);
  }
  if (multiple && portraitDocs >= Math.ceil(files.length / 2)) {
    push("pdf", `縦長の画像が${portraitDocs}枚あります（書類の写真なら1つのPDFにまとめると送りやすくなります）`);
  }
  for (const p of list) push(p.id);
  return ranked;
}
