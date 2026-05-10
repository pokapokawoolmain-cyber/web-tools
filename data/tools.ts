export type ToolCategory =
  | "お金・投資"
  | "計算ツール"
  | "画像・PDF"
  | "生活・副業"
  | "テキスト・Web"
  | "学生向け"
  | "仕事・副業";

export type ToolItem = {
  id: string;
  title: string;
  seoTitle?: string;
  description: string;
  href: string;
  emoji: string;
  category: ToolCategory;
  isPopular?: boolean;
  isNew?: boolean;
};

export const TOOLS: ToolItem[] = [
  // お金・投資
  { id: "fire-simulator", title: "FIREシミュレーター", description: "資産・生活費・運用利回りを入力するだけ。FIRE達成までの年数と必要資産額を即計算。", href: "/fire-simulator", emoji: "🔥", category: "お金・投資", isPopular: true },
  { id: "nisa-calculator", title: "新NISA積立計算", description: "毎月の積立額と運用期間を入力。複利効果で将来いくらになるかを可視化します。", href: "/nisa-calculator", emoji: "📈", category: "お金・投資", isNew: true },
  { id: "mortgage-calculator", title: "住宅ローンシミュレーター", description: "借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算。", href: "/mortgage-calculator", emoji: "🏠", category: "お金・投資", isPopular: true },
  { id: "net-income", title: "手取り計算", description: "年収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。", href: "/net-income", emoji: "💴", category: "お金・投資", isNew: true },
  { id: "furusato-simulator", title: "ふるさと納税シミュレーター", description: "年収と家族構成を選ぶだけで控除上限額を即計算。2,000円負担で最大限活用。", href: "/furusato-simulator", emoji: "🎁", category: "お金・投資", isPopular: true },
  { id: "furusato", title: "ふるさと納税（詳細版）", description: "年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。推奨寄付額もわかる。", href: "/furusato", emoji: "🎁", category: "お金・投資", isNew: true },
  // 計算ツール
  { id: "mercari-profit", title: "メルカリ利益計算", description: "販売価格・送料・手数料を入力。手取り利益と利益率を瞬時に計算します。", href: "/mercari-profit", emoji: "🛍️", category: "計算ツール", isPopular: true },
  { id: "gas-calculator", title: "ガソリン代計算", description: "走行距離・燃費・ガソリン単価を入力。往復・月間のガソリン代をリアルタイム計算。", href: "/gas-calculator", emoji: "⛽", category: "計算ツール" },
  { id: "shift-salary", title: "シフト給与計算", description: "時給・勤務時間・深夜時間・勤務日数を入力して月収を計算。深夜割増・交通費も対応。", href: "/shift-salary", emoji: "⏰", category: "計算ツール", isNew: true },
  { id: "point-simulator", title: "ポイント還元シミュレーター", description: "PayPay・楽天・クレカなど主要サービスの還元率を比較。年間獲得ポイントを計算。", href: "/point-simulator", emoji: "💳", category: "計算ツール" },
  // 画像・PDF
  { id: "heic-to-jpg", title: "HEIC→JPG変換", description: "iPhoneの写真（HEIC）をJPGに変換。ブラウザ完結でアップロード不要、プライバシー安全。", href: "/heic-to-jpg", emoji: "🖼️", category: "画像・PDF" },
  { id: "image-compress", title: "画像圧縮ツール", description: "JPG・PNG・WebPを高品質のまま圧縮。サイト表示速度改善・SNS投稿に最適。", href: "/image-compress", emoji: "🗜️", category: "画像・PDF" },
  { id: "video-compress", title: "動画圧縮ツール", description: "MP4・MOV・AVI・MKVなどの動画をブラウザで圧縮。品質・解像度を自由に設定。", href: "/video-compress", emoji: "🎬", category: "画像・PDF", isNew: true },
  { id: "image-resize", title: "画像リサイズ・アスペクト比変換", description: "画像のサイズ変更・比率変換をブラウザで完結。16:9・1:1など主要比率とSNSサイズプリセット対応。", href: "/image-resize", emoji: "✂️", category: "画像・PDF", isNew: true },
  { id: "id-photo", title: "証明写真作成", seoTitle: "証明写真作成ツール｜履歴書・コンビニ印刷対応", description: "履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を自動作成。L判4枚配置のコンビニ印刷モード搭載。", href: "/id-photo", emoji: "📸", category: "画像・PDF", isNew: true },
  // 生活・副業
  { id: "side-job-profit", title: "副業利益・税金計算", description: "副業収入から経費・税金を差し引いた実質手取りを計算。確定申告の目安も確認。", href: "/side-job-profit", emoji: "💼", category: "生活・副業" },
  { id: "youtube-tools", title: "YouTube SEOツール", description: "タイトル文字数・ハッシュタグ最適化・サムネ比率確認をまとめてチェック。", href: "/youtube-tools", emoji: "🎥", category: "生活・副業" },
  { id: "sns-links", title: "SNSリンクまとめ", description: "X・Instagram・TikTok・YouTubeなど複数のSNSリンクをまとめた共有ページを即生成。", href: "/sns-links", emoji: "🔗", category: "生活・副業", isNew: true },
  // テキスト・Web
  { id: "word-counter", title: "文字数カウント", description: "入力した瞬間にリアルタイムで文字数・行数・単語数を計測。Twitter・履歴書に便利。", href: "/word-counter", emoji: "✍️", category: "テキスト・Web", isPopular: true },
  { id: "markdown-editor", title: "Markdownエディタ", description: "左に書いて右でプレビュー。GitHub対応MDをそのままコピー・ダウンロード。", href: "/markdown-editor", emoji: "📝", category: "テキスト・Web" },
  { id: "password-generator", title: "パスワード生成", description: "長さ・記号・数字を自由に設定。強度メーター付きの安全なパスワードを即生成。", href: "/password-generator", emoji: "🔐", category: "テキスト・Web" },
  { id: "qr-generator", title: "QRコード生成", description: "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。", href: "/qr-generator", emoji: "📱", category: "テキスト・Web", isPopular: true },
  { id: "wifi-qr", title: "Wi-Fi QRコード生成", description: "SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。スキャンするだけで簡単接続。", href: "/wifi-qr", emoji: "📶", category: "テキスト・Web", isNew: true },
  { id: "short-link", title: "URL短縮 & QR生成", description: "長いURLをコンパクトに整形し、QRコードも同時生成。コピーもダウンロードも簡単。", href: "/short-link", emoji: "🔗", category: "テキスト・Web" },
  // 学生向け
  { id: "gpa", title: "GPA計算", description: "科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。", href: "/gpa", emoji: "🎓", category: "学生向け", isNew: true },
  // 仕事・副業
  { id: "resume-builder", title: "履歴書・職務経歴書作成", description: "フォームを埋めるだけで職務経歴書のテキストが完成。そのままコピー・印刷OK。", href: "/resume-builder", emoji: "📄", category: "仕事・副業" },
];

export const CATEGORIES: ToolCategory[] = [
  "お金・投資", "計算ツール", "画像・PDF", "生活・副業", "テキスト・Web", "学生向け", "仕事・副業"
];

export function getToolsByCategory() {
  const result: Partial<Record<ToolCategory, ToolItem[]>> = {};
  for (const cat of CATEGORIES) {
    const items = TOOLS.filter(t => t.category === cat);
    if (items.length) result[cat] = items;
  }
  return result as Record<ToolCategory, ToolItem[]>;
}

export function getToolById(id: string): ToolItem | undefined {
  return TOOLS.find(t => t.id === id);
}

export function getPopularTools(): ToolItem[] {
  return TOOLS.filter(t => t.isPopular);
}

export function getNewTools(): ToolItem[] {
  return TOOLS.filter(t => t.isNew);
}
