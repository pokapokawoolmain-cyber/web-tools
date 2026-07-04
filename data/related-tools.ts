// ========================================
// 関連ツール自動回遊システム
// ツールIDごとに関連するツールIDを定義
// ========================================

export const RELATED_TOOLS_MAP: Record<string, string[]> = {
  // ── ビジネス・契約書 ──────────────────────────────────────────
  "invoice-generator":            ["receipt-generator", "estimate-generator", "hanko-generator", "pdf-signature", "business-contract-generator"],
  "receipt-generator":            ["invoice-generator", "estimate-generator", "hanko-generator", "pdf-signature"],
  "estimate-generator":           ["invoice-generator", "receipt-generator", "business-contract-generator", "pdf-signature"],
  "business-contract-generator":  ["nda-generator", "pdf-signature", "hanko-generator", "invoice-generator"],
  "nda-generator":                ["business-contract-generator", "pdf-signature", "hanko-generator", "certified-letter-generator"],
  "resignation-letter-generator": ["certified-letter-generator", "pdf-signature", "hanko-generator"],
  "certified-letter-generator":   ["resignation-letter-generator", "pdf-signature", "word-counter"],
  "hanko-generator":              ["pdf-signature", "invoice-generator", "receipt-generator", "business-contract-generator"],
  "pdf-signature":                ["hanko-generator", "invoice-generator", "receipt-generator", "business-contract-generator", "nda-generator", "pdf-merge"],

  // ── PDF ───────────────────────────────────────────────────────
  "pdf-merge":         ["pdf-split", "pdf-compress", "pdf-rotate", "pdf-signature", "pdf-watermark"],
  "pdf-split":         ["pdf-merge", "pdf-delete-pages", "pdf-reorder", "pdf-compress"],
  "pdf-compress":      ["pdf-merge", "pdf-split", "pdf-to-jpg", "jpg-to-pdf"],
  "pdf-to-jpg":        ["jpg-to-pdf", "image-compress", "pdf-compress", "pdf-merge"],
  "jpg-to-pdf":        ["pdf-to-jpg", "image-compress", "pdf-merge", "pdf-compress"],
  "pdf-rotate":        ["pdf-merge", "pdf-reorder", "pdf-delete-pages"],
  "pdf-watermark":     ["pdf-merge", "pdf-password", "pdf-metadata-remover", "pdf-signature"],
  "pdf-delete-pages":  ["pdf-split", "pdf-reorder", "pdf-merge"],
  "pdf-reorder":       ["pdf-merge", "pdf-delete-pages", "pdf-split"],
  "pdf-password":      ["pdf-watermark", "pdf-metadata-remover", "pdf-merge"],
  "pdf-metadata-remover": ["pdf-password", "pdf-watermark"],

  // ── 画像 ──────────────────────────────────────────────────────
  "image-compress": ["image-resize", "heic-to-jpg", "jpg-to-pdf"],
  "image-resize":   ["image-compress", "id-photo", "heic-to-jpg"],
  "heic-to-jpg":    ["image-compress", "image-resize", "jpg-to-pdf"],
  "id-photo":       ["image-compress", "image-resize"],
  "video-compress": ["image-compress", "image-resize"],

  // ── お金・投資 ────────────────────────────────────────────────
  "fire-simulator":     ["nisa-calculator", "net-income", "mortgage-calculator"],
  "nisa-calculator":    ["fire-simulator", "net-income", "furusato-simulator"],
  "mortgage-calculator":["takehome-reverse", "fire-simulator", "net-income", "furusato-simulator"],
  "net-income":         ["takehome-reverse", "bonus-takehome", "nenshu-kabe", "fire-simulator"],
  "takehome-reverse":   ["net-income", "bonus-takehome", "mortgage-calculator", "nisa-calculator"],
  "bonus-takehome":     ["net-income", "takehome-reverse", "nenshu-kabe", "furusato-simulator"],
  "nenshu-kabe":        ["net-income", "bonus-takehome", "takehome-reverse", "furusato-simulator"],
  "furusato-simulator": ["furusato", "net-income", "fire-simulator", "nisa-calculator"],
  "furusato":           ["furusato-simulator", "net-income"],

  // ── テキスト・Web ─────────────────────────────────────────────
  "word-counter":      ["markdown-editor", "resume-builder", "certified-letter-generator"],
  "markdown-editor":   ["word-counter"],
  "qr-generator":      ["wifi-qr", "short-link"],
  "wifi-qr":           ["qr-generator", "short-link"],
  "short-link":        ["qr-generator", "wifi-qr"],
  "password-generator":["word-counter"],

  // ── 計算・生活 ────────────────────────────────────────────────
  "mercari-profit":  ["side-job-profit", "point-simulator", "gas-calculator"],
  "gas-calculator":  ["mercari-profit", "shift-salary"],
  "shift-salary":    ["net-income", "gas-calculator"],
  "side-job-profit": ["mercari-profit", "net-income"],
  "point-simulator": ["mercari-profit", "net-income", "furusato-simulator"],
  "gpa":             ["word-counter"],
  "resume-builder":  ["word-counter", "resignation-letter-generator"],
  "youtube-tools":   ["word-counter", "sns-links"],
  "sns-links":       ["qr-generator", "youtube-tools"],

  // ── 冠婚葬祭・文書 ────────────────────────────────────────────
  "koden-maker":       ["houyou-calculator", "noshi-maker", "shugi-maker"],
  "shugi-maker":       ["noshi-maker", "koden-maker"],
  "houyou-calculator": ["koden-maker", "noshi-maker"],
  "noshi-maker":       ["shugi-maker", "koden-maker"],
};

/** toolId に関連するツールIDを最大 limit 件返す */
export function getRelatedToolIds(toolId: string, limit = 4): string[] {
  return (RELATED_TOOLS_MAP[toolId] ?? []).slice(0, limit);
}
