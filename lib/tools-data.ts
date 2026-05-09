// ========================================
// ツール一覧データ
// 新しいツールを追加するときはここに追記するだけ
// ========================================
import type { Tool } from "@/types";

export const tools: Tool[] = [
  {
    id: "fire-simulator",
    title: "FIREシミュレーター",
    description: "資産・生活費・運用利回りを入力するだけ。FIRE達成までの年数と必要資産額を即計算。",
    href: "/fire-simulator",
    icon: "🔥",
    category: "finance",
    isPopular: true,
    keywords: ["FIRE", "早期退職", "経済的自由", "資産運用", "シミュレーター"],
  },
  {
    id: "nisa-calculator",
    title: "新NISA積立計算",
    description: "毎月の積立額と運用期間を入力。複利効果で将来いくらになるかを可視化します。",
    href: "/nisa-calculator",
    icon: "📈",
    category: "finance",
    isNew: true,
    keywords: ["新NISA", "積立投資", "複利計算", "資産形成", "投資シミュレーション"],
  },
  {
    id: "mercari-profit",
    title: "メルカリ利益計算",
    description: "販売価格・送料・手数料を入力。手取り利益と利益率を瞬時に計算します。",
    href: "/mercari-profit",
    icon: "🛍️",
    category: "calc",
    isPopular: true,
    keywords: ["メルカリ", "利益計算", "手数料", "フリマ", "副業"],
  },
  {
    id: "side-job-profit",
    title: "副業利益・税金計算",
    description: "副業収入から経費・税金を差し引いた実質手取りを計算。確定申告の目安も確認。",
    href: "/side-job-profit",
    icon: "💼",
    category: "finance",
    keywords: ["副業", "税金計算", "確定申告", "所得税", "手取り"],
  },
  {
    id: "gas-calculator",
    title: "ガソリン代計算",
    description: "走行距離・燃費・ガソリン単価を入力。往復・月間のガソリン代をリアルタイム計算。",
    href: "/gas-calculator",
    icon: "⛽",
    category: "calc",
    keywords: ["ガソリン代", "燃費計算", "交通費", "カーライフ"],
  },
  {
    id: "heic-to-jpg",
    title: "HEIC→JPG変換",
    description: "iPhoneの写真（HEIC）をJPGに変換。ブラウザ完結でアップロード不要、プライバシー安全。",
    href: "/heic-to-jpg",
    icon: "🖼️",
    category: "image",
    keywords: ["HEIC", "JPG変換", "iPhone写真", "画像変換", "無料"],
  },
  {
    id: "image-compress",
    title: "画像圧縮ツール",
    description: "JPG・PNG・WebPを高品質のまま圧縮。サイト表示速度改善・SNS投稿に最適。",
    href: "/image-compress",
    icon: "🗜️",
    category: "image",
    keywords: ["画像圧縮", "ファイルサイズ削減", "WebP変換", "無料"],
  },
  {
    id: "image-resize",
    title: "画像リサイズ・アスペクト比変換",
    description: "画像のサイズ変更・比率変換をブラウザで完結。16:9・1:1など主要比率とSNSサイズプリセット対応。",
    href: "/image-resize",
    icon: "✂️",
    category: "image",
    isNew: true,
    keywords: ["画像リサイズ", "アスペクト比変換", "画像サイズ変更", "16:9", "正方形", "無料"],
  },
  // ── 追加10ツール ─────────────────────────────
  {
    id: "mortgage-calculator",
    title: "住宅ローンシミュレーター",
    description: "借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算。",
    href: "/mortgage-calculator",
    icon: "🏠",
    category: "finance",
    isPopular: true,
    keywords: ["住宅ローン計算", "ローン返済シミュレーション", "毎月返済額", "総返済額"],
  },
  {
    id: "point-simulator",
    title: "ポイント還元シミュレーター",
    description: "PayPay・楽天・クレカなど主要サービスの還元率を比較。年間獲得ポイントを計算。",
    href: "/point-simulator",
    icon: "💳",
    category: "lifestyle",
    isNew: true,
    keywords: ["ポイント還元計算", "クレカ還元率", "PayPay", "楽天ポイント"],
  },
  {
    id: "furusato-simulator",
    title: "ふるさと納税シミュレーター",
    description: "年収と家族構成を選ぶだけで控除上限額を即計算。2,000円負担で最大限活用。",
    href: "/furusato-simulator",
    icon: "🎁",
    category: "lifestyle",
    isPopular: true,
    keywords: ["ふるさと納税 シミュレーション", "控除額計算", "控除上限", "年収"],
  },
  {
    id: "resume-builder",
    title: "履歴書・職務経歴書作成",
    description: "フォームを埋めるだけで職務経歴書のテキストが完成。そのままコピー・印刷OK。",
    href: "/resume-builder",
    icon: "📄",
    category: "text",
    keywords: ["履歴書作成", "職務経歴書", "転職", "自己PR"],
  },
  {
    id: "short-link",
    title: "URL短縮 & QR生成",
    description: "長いURLをコンパクトに整形し、QRコードも同時生成。コピーもダウンロードも簡単。",
    href: "/short-link",
    icon: "🔗",
    category: "text",
    keywords: ["URL短縮", "短縮リンク", "QRコード生成"],
  },
  {
    id: "qr-generator",
    title: "QRコード生成",
    description: "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。",
    href: "/qr-generator",
    icon: "📱",
    category: "text",
    isPopular: true,
    keywords: ["QRコード作成", "QR生成", "URL QR", "無料"],
  },
  {
    id: "password-generator",
    title: "パスワード生成",
    description: "長さ・記号・数字を自由に設定。強度メーター付きの安全なパスワードを即生成。",
    href: "/password-generator",
    icon: "🔐",
    category: "text",
    keywords: ["パスワード生成", "安全パスワード", "ランダムパスワード", "セキュリティ"],
  },
  {
    id: "word-counter",
    title: "文字数カウント",
    description: "入力した瞬間にリアルタイムで文字数・行数・単語数を計測。Twitter・履歴書に便利。",
    href: "/word-counter",
    icon: "✍️",
    category: "text",
    isPopular: true,
    keywords: ["文字数カウント", "文字数チェッカー", "文字数制限", "Twitter文字数"],
  },
  {
    id: "markdown-editor",
    title: "Markdownエディタ",
    description: "左に書いて右でプレビュー。GitHub対応MDをそのままコピー・ダウンロード。",
    href: "/markdown-editor",
    icon: "📝",
    category: "text",
    keywords: ["Markdownエディタ", "Markdown変換", "マークダウン", "プレビュー"],
  },
  {
    id: "youtube-tools",
    title: "YouTube SEOツール",
    description: "タイトル文字数・ハッシュタグ最適化・サムネ比率確認をまとめてチェック。",
    href: "/youtube-tools",
    icon: "🎥",
    category: "lifestyle",
    keywords: ["YouTube SEO", "YouTubeタイトル", "ハッシュタグ", "サムネイル"],
  },
];

/** カテゴリ表示名マッピング */
export const categoryLabels: Record<Tool["category"], string> = {
  finance: "お金・投資",
  image: "画像変換",
  pdf: "PDF",
  calc: "計算ツール",
  text: "テキスト・Web",
  lifestyle: "生活・副業",
};

/** カテゴリ別にツールをグルーピング */
export function getToolsByCategory() {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

/** IDでツールを取得 */
export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
