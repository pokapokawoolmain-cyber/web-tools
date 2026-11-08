// ============================================================
// ツール検索（ホームの「何をしたいですか？」で使う。純関数）
//
// - 全角・半角、カタカナ・ひらがな、大文字・小文字の違いを吸収する
// - ツール名にない言い方（「くっつける」「軽くする」「iPhoneの写真」など）は
//   言い換え辞書で拾う
// - 空白区切りの語はすべて含むものを優先し、なければどれかを含むものを出す
// ============================================================
import type { ToolItem } from "@/data/tools";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  /** ツール名にない言い方 */
  keywords?: string;
}

/** ファイルを入れて一括で作業する画面（ツール一覧には載せていないため検索にだけ足す） */
export const WORKSPACE_ENTRIES: SearchEntry[] = [
  {
    id: "workspace-image", title: "画像ワークスペース", href: "/workspace/image", category: "まとめて作業",
    description: "画像を入れるだけで、軽くする・大きさをそろえる・形式を変える・PDFにまとめるまでを一度に。",
    keywords: "画像 写真 まとめて 一括 たくさん 複数 軽く 圧縮 リサイズ 変換 heic jpg png webp",
  },
  {
    id: "workspace-pdf", title: "PDFワークスペース", href: "/workspace/pdf", category: "まとめて作業",
    description: "PDFを入れるだけで、まとめる・並べ替える・回転・削除・分ける・画像にするまでを一度に。",
    keywords: "pdf まとめて 一括 結合 並べ替え 回転 削除 分割 取り出す 画像",
  },
];

// ツール名にない言い方。キーは tools.ts の id
const KEYWORDS: Record<string, string> = {
  "heic-to-jpg": "iphone アイフォン 写真 開けない heif 変換",
  "image-compress": "軽く 小さく 容量 サイズ 減らす 圧縮 写真",
  "image-resize": "大きさ サイズ 縮小 拡大 トリミング 正方形 インスタ",
  "image-converter": "png jpg webp 形式 変換 一括",
  "id-photo": "履歴書 写真 マイナンバー パスポート",
  "pdf-merge": "くっつける まとめる 合体 1つに 結合",
  "pdf-split": "分ける 分割 切り離す",
  "pdf-compress": "軽く 小さく 容量 メール 送れない",
  "jpg-to-pdf": "写真 画像 pdfにする スキャン",
  "pdf-to-jpg": "画像にする 写真 png",
  "pdf-rotate": "向き 横向き 逆さ",
  "pdf-delete-pages": "いらない ページ 消す",
  "pdf-reorder": "順番 入れ替え ページ",
  "pdf-password": "鍵 ロック 保護 暗号",
  "word-to-pdf": "docx ワード",
  "excel-to-pdf": "xlsx csv エクセル 表",
  "pdf-to-excel": "表 エクセル 取り出す",
  "pdf-to-word": "ワード 編集",
  "pdf-signature": "サイン 署名 はんこ",
  "net-income": "給料 年収 月収 税金 社会保険",
  "takehome-reverse": "希望年収 逆算 転職",
  "percentage-calculator": "割合 何パーセント 割引 増加率 百分率",
  "tax-calculator": "税込 税抜 10% 8%",
  "date-calculator": "何日 日数 何日後 期限",
  "age-calculator": "何歳 年齢 学年",
  "wareki-converter": "令和 平成 昭和 和暦 西暦",
  "invoice-generator": "請求 インボイス 適格",
  "estimate-generator": "見積 お見積り",
  "receipt-generator": "領収 レシート",
  "resume-builder": "履歴書 職歴 転職",
  "ai-keigo": "敬語 丁寧 ビジネスメール 言い換え",
  "ai-email": "メール 文面 ビジネス",
  "koden-maker": "香典 葬儀 お通夜 表書き",
  "shugi-maker": "ご祝儀 結婚式 表書き",
  "noshi-maker": "のし お中元 お歳暮 熨斗",
  "qr-generator": "qr バーコード",
  "wifi-qr": "wifi パスワード 共有",
  "password-generator": "パスワード 作る ランダム",
  "word-counter": "文字数 数える",
  "speed-test": "回線 速度 遅い ネット",
  "furusato-simulator": "ふるさと納税 上限 控除",
  "video-compress": "動画 軽く 小さく mp4",
};

export function toSearchEntries(tools: ToolItem[]): SearchEntry[] {
  return [
    ...WORKSPACE_ENTRIES,
    ...tools.map((t) => ({ id: t.id, title: t.title, description: t.description, href: t.href, category: t.category, keywords: KEYWORDS[t.id] })),
  ];
}

/** 全角→半角、カタカナ→ひらがな、小文字、矢印・記号のゆれをそろえる */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    // カタカナで書かれやすいファイル形式名を英字にそろえる
    .replace(/わーど/g, "word").replace(/えくせる/g, "excel").replace(/ぴーでぃーえふ/g, "pdf").replace(/じぇいぺぐ/g, "jpg")
    .replace(/[→⇒＞>]/g, " ")
    .replace(/[・、。,.!?！？「」（）()]/g, " ");
}

function tokens(q: string): string[] {
  return normalize(q).split(/\s+/).filter(Boolean);
}

/**
 * 語を探す。区切りがない入力（「pdfくっつける」）にも対応するため、
 * 英字と日本語の境目でも分ける
 */
function splitQuery(q: string): string[] {
  return tokens(q).flatMap((t) => t.split(/(?<=[a-z0-9])(?=[^a-z0-9])|(?<=[^a-z0-9])(?=[a-z0-9])/)).filter(Boolean);
}

const KANA = /[ぁ-ゖー]/;

/** 「ぱすわーど」の中の「わーど」のように、かな語の途中に一致したか */
function insideKanaWord(text: string, at: number, w: string) {
  // 「ぱすword」（パスワード）の中の word のように、英字に置き換えた語も対象
  return (KANA.test(w[0]) || /[a-z]/.test(w[0])) && KANA.test(text[at - 1]);
}

export interface SearchHit {
  entry: SearchEntry;
  score: number;
}

export function searchTools(entries: SearchEntry[], query: string, limit = 6): SearchHit[] {
  const words = splitQuery(query);
  if (!words.length) return [];
  const scored = entries.map((entry) => {
    const title = normalize(entry.title);
    const extra = normalize(`${entry.keywords ?? ""} ${entry.category}`);
    const desc = normalize(entry.description);
    let score = 0;
    let matched = 0;
    const extraWords = extra.split(/\s+/);
    for (const w of words) {
      let s = 0;
      const at = title.indexOf(w);
      if (at === 0) s = 12;
      else if (at > 0) s = insideKanaWord(title, at, w) ? 4 : 10;
      else if (extraWords.includes(w)) s = 11;
      else if (extra.includes(w)) s = 6;
      else if (desc.includes(w)) s = 3;
      if (s) matched++;
      score += s;
    }
    // すべての語を含むものを上に
    if (matched === words.length) score += 20;
    // 入力した順に名前に並んでいれば少し上に（「ワード PDF」→ Word→PDF変換）
    const pos = words.map((w) => title.indexOf(w));
    if (words.length > 1 && pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1]))) score += 3;
    return { entry, score, matched };
  });
  const all = scored.filter((x) => x.matched === words.length);
  const pool = all.length ? all : scored.filter((x) => x.matched > 0);
  return pool
    .sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length)
    .slice(0, limit)
    .map(({ entry, score }) => ({ entry, score }));
}
