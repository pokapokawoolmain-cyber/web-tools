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
  "pdf-to-jpg":        ["jpg-to-pdf", "pdf-to-word", "pdf-to-excel", "pdf-compress"],
  "pdf-to-excel":      ["pdf-to-word", "excel-to-pdf", "pdf-to-jpg", "pdf-compress"],
  "pdf-to-word":       ["pdf-to-excel", "word-to-pdf", "pdf-to-jpg", "pdf-merge"],
  "excel-to-pdf":      ["pdf-to-excel", "word-to-pdf", "pdf-merge", "pdf-compress"],
  "word-to-pdf":       ["pdf-to-word", "excel-to-pdf", "pdf-merge", "pdf-compress"],
  "jpg-to-pdf":        ["pdf-to-jpg", "image-compress", "pdf-merge", "pdf-compress"],
  "pdf-rotate":        ["pdf-merge", "pdf-reorder", "pdf-delete-pages"],
  "pdf-watermark":     ["pdf-merge", "pdf-password", "pdf-metadata-remover", "pdf-signature"],
  "pdf-delete-pages":  ["pdf-split", "pdf-reorder", "pdf-merge"],
  "pdf-reorder":       ["pdf-merge", "pdf-delete-pages", "pdf-split"],
  "pdf-password":      ["pdf-watermark", "pdf-metadata-remover", "pdf-merge"],
  "pdf-metadata-remover": ["pdf-password", "pdf-watermark"],

  // ── 画像 ──────────────────────────────────────────────────────
  "image-converter": ["image-compress", "heic-to-jpg", "image-resize", "favicon-generator"],
  "image-compress": ["image-converter", "image-resize", "heic-to-jpg", "jpg-to-pdf"],
  "image-resize":   ["image-converter", "aspect-ratio", "image-compress", "heic-to-jpg"],
  "aspect-ratio":   ["image-resize", "image-converter", "image-compress"],
  "heic-to-jpg":    ["image-converter", "image-compress", "image-resize"],
  "id-photo":       ["image-compress", "image-resize"],
  "favicon-generator": ["image-compress", "image-resize", "aspect-ratio"],
  "video-compress": ["image-compress", "image-resize"],

  // ── お金・投資 ────────────────────────────────────────────────
  "fire-simulator":     ["nisa-calculator", "net-income", "mortgage-calculator"],
  "nisa-calculator":    ["fire-simulator", "net-income", "furusato-simulator"],
  "mortgage-calculator":["takehome-reverse", "fire-simulator", "net-income", "furusato-simulator"],
  "net-income":         ["resident-tax", "takehome-reverse", "bonus-takehome", "nenshu-kabe"],
  "resident-tax":       ["net-income", "furusato-simulator", "bonus-takehome", "nenshu-kabe"],
  "takehome-reverse":   ["net-income", "bonus-takehome", "mortgage-calculator", "nisa-calculator"],
  "bonus-takehome":     ["net-income", "takehome-reverse", "nenshu-kabe", "furusato-simulator"],
  "nenshu-kabe":        ["net-income", "bonus-takehome", "takehome-reverse", "furusato-simulator"],
  "furusato-simulator": ["furusato", "net-income", "fire-simulator", "nisa-calculator"],
  "furusato":           ["furusato-simulator", "net-income"],

  // ── AI文章ツール ─────────────────────────────────────────────
  "ai-email":        ["ai-keigo", "ai-decline", "ai-apology", "ai-inquiry"],
  "ai-keigo":        ["ai-email", "ai-humanize", "ai-apology", "ai-inquiry"],
  "ai-apology":      ["ai-email", "ai-decline", "ai-keigo"],
  "ai-decline":      ["ai-email", "ai-apology", "ai-keigo"],
  "ai-inquiry":      ["ai-email", "ai-keigo", "ai-decline"],
  "prompt-builder":  ["chatgpt-format", "ai-humanize", "ai-email"],
  "chatgpt-format":  ["ai-humanize", "prompt-builder", "note-format", "x-post-preview"],
  "ai-humanize":     ["chatgpt-format", "ai-keigo", "prompt-builder", "note-format"],
  "x-post-preview":  ["chatgpt-format", "note-format", "ai-humanize"],
  "note-format":     ["chatgpt-format", "ai-humanize", "x-post-preview"],

  // ── テキスト・Web ─────────────────────────────────────────────
  "word-counter":      ["markdown-editor", "resume-builder", "certified-letter-generator"],
  "markdown-editor":   ["word-counter"],
  "qr-generator":      ["wifi-qr", "short-link"],
  "wifi-qr":           ["speed-test", "qr-generator", "short-link"],
  "short-link":        ["qr-generator", "wifi-qr"],
  "password-generator":["word-counter"],

  // ── 計算・生活 ────────────────────────────────────────────────
  "mercari-profit":  ["side-job-profit", "point-simulator", "gas-calculator"],
  "gas-calculator":  ["mercari-profit", "shift-salary"],
  "shift-salary":    ["net-income", "gas-calculator"],
  "warikan-calculator":    ["percentage-calculator", "tax-calculator", "shugi-maker"],
  "bmi-calculator":        ["percentage-calculator", "age-calculator", "warikan-calculator"],
  "percentage-calculator": ["tax-calculator", "warikan-calculator", "bmi-calculator"],
  "keyboard-test":    ["mouse-test", "mic-test", "webcam-test"],
  "mouse-test":       ["keyboard-test", "screen-resolution", "refresh-rate"],
  "mic-test":         ["speaker-test", "webcam-test", "keyboard-test"],
  "webcam-test":      ["mic-test", "speaker-test", "screen-resolution"],
  "speaker-test":     ["mic-test", "webcam-test", "keyboard-test"],
  "dead-pixel-test":  ["screen-resolution", "refresh-rate", "webcam-test"],
  "screen-resolution":["dead-pixel-test", "refresh-rate", "aspect-ratio"],
  "refresh-rate":     ["screen-resolution", "dead-pixel-test", "speed-test"],
  "side-job-profit": ["mercari-profit", "net-income"],
  "point-simulator": ["mercari-profit", "net-income", "furusato-simulator"],
  "age-calculator":  ["wareki-converter", "date-calculator", "houyou-calculator"],
  "date-calculator": ["age-calculator", "wareki-converter", "houyou-calculator"],
  "tax-calculator":  ["invoice-generator", "estimate-generator", "gross-profit-calculator"],
  "wareki-converter":["age-calculator", "date-calculator", "id-photo"],
  "gpa":             ["word-counter"],
  "resume-builder":  ["id-photo", "word-to-pdf", "word-counter", "resignation-letter-generator"],
  "youtube-tools":   ["word-counter", "sns-links"],
  "sns-links":       ["qr-generator", "youtube-tools"],

  // ── 生活便利 ──────────────────────────────────────────────
  "speed-test":  ["keyboard-test", "mouse-test", "mic-test", "wifi-qr"],

  // ── 冠婚葬祭・文書 ────────────────────────────────────────────
  "koden-maker":       ["houyou-calculator", "noshi-maker", "shugi-maker"],
  "shugi-maker":       ["noshi-maker", "koden-maker"],
  "houyou-calculator": ["koden-maker", "noshi-maker"],
  "noshi-maker":       ["shugi-maker", "koden-maker"],

  // ── カラー・デザイン ──────────────────────────────────────────
  "hex-rgb-converter":     ["color-palette", "color-codes", "brand-color-text", "gradient-generator"],
  "color-palette":         ["hex-rgb-converter", "palette-accessibility", "gradient-generator", "brand-color-text"],
  "gradient-generator":    ["color-palette", "hex-rgb-converter", "color-codes", "contrast-checker"],
  "contrast-checker":      ["brand-color-text", "palette-accessibility", "color-blind-simulator", "hex-rgb-converter"],
  "brand-color-text":      ["contrast-checker", "palette-accessibility", "color-codes", "color-blind-simulator"],
  "palette-accessibility": ["contrast-checker", "brand-color-text", "color-blind-simulator", "color-palette"],
  "color-blind-simulator": ["contrast-checker", "palette-accessibility", "brand-color-text", "color-palette"],
  "color-codes":           ["brand-color-text", "hex-rgb-converter", "color-palette", "palette-accessibility"],

  // ── 建設・リフォーム ──────────────────────────────────────────
  "neighbor-greeting":         ["construction-estimate", "exterior-paint-calculator", "construction-photo-pdf", "construction-report"],
  "construction-estimate":     ["neighbor-greeting", "gross-profit-calculator", "construction-contract", "exterior-paint-calculator"],
  "exterior-paint-calculator": ["construction-estimate", "neighbor-greeting", "gross-profit-calculator", "construction-photo-pdf"],
  "gross-profit-calculator":   ["food-cost-calculator", "construction-estimate", "menu-price-calculator", "exterior-paint-calculator"],

  // ── 飲食店 ────────────────────────────────────────────────────
  "food-cost-calculator":      ["gross-profit-calculator", "menu-price-calculator", "restaurant-menu-maker", "restaurant-pop-generator"],
  "menu-price-calculator":     ["food-cost-calculator", "gross-profit-calculator", "restaurant-menu-maker", "restaurant-pop-generator"],
  "restaurant-menu-maker":     ["menu-price-calculator", "food-cost-calculator", "restaurant-pop-generator", "review-reply-generator"],
  "restaurant-pop-generator":  ["restaurant-menu-maker", "menu-price-calculator", "food-cost-calculator", "review-reply-generator"],
  "review-reply-generator":    ["restaurant-menu-maker", "restaurant-pop-generator", "food-cost-calculator", "menu-price-calculator"],
  "construction-photo-pdf":    ["construction-report", "neighbor-greeting", "construction-estimate", "pdf-merge"],
  "construction-report":       ["construction-photo-pdf", "neighbor-greeting", "construction-estimate", "pdf-merge"],
  "construction-contract":     ["construction-estimate", "gross-profit-calculator", "nda-generator", "neighbor-greeting"],

  // ── 開発者ツール ──────────────────────────────────────────────
  "json-formatter": ["base64", "url-encode", "unix-time", "hash"],
  "base64":         ["url-encode", "hash", "json-formatter", "uuid"],
  "url-encode":     ["base64", "json-formatter", "qr-generator", "uuid"],
  "uuid":           ["hash", "password-generator", "base64", "json-formatter"],
  "unix-time":      ["json-formatter", "base64", "hash", "url-encode"],
  "hash":           ["base64", "uuid", "password-generator", "json-formatter"],
};

/** toolId に関連するツールIDを最大 limit 件返す */
export function getRelatedToolIds(toolId: string, limit = 4): string[] {
  return (RELATED_TOOLS_MAP[toolId] ?? []).slice(0, limit);
}
