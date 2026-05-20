export type ToolCategory =
  | "お金・投資"
  | "計算ツール"
  | "画像・PDF"
  | "生活・副業"
  | "テキスト・Web"
  | "学生向け"
  | "仕事・副業"
  | "ビジネス・契約書";

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
  { id: "fire-simulator", title: "FIREシミュレーター", description: "資産・生活費・運用利回りを入力するだけ。FIRE達成までの年数と必要資産額を即計算。", href: "/tools/fire-simulator", emoji: "🔥", category: "お金・投資", isPopular: true },
  { id: "nisa-calculator", title: "新NISA積立計算", description: "毎月の積立額と運用期間を入力。複利効果で将来いくらになるかを可視化します。", href: "/tools/nisa-calculator", emoji: "📈", category: "お金・投資", isNew: true },
  { id: "mortgage-calculator", title: "住宅ローンシミュレーター", description: "借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算。", href: "/tools/mortgage-calculator", emoji: "🏠", category: "お金・投資", isPopular: true },
  { id: "net-income", title: "手取り計算", description: "年収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。", href: "/tools/net-income", emoji: "💴", category: "お金・投資", isNew: true },
  { id: "furusato-simulator", title: "ふるさと納税シミュレーター", description: "年収と家族構成を選ぶだけで控除上限額を即計算。2,000円負担で最大限活用。", href: "/tools/furusato-simulator", emoji: "🎁", category: "お金・投資", isPopular: true },
  { id: "furusato", title: "ふるさと納税（詳細版）", description: "年収・扶養人数・配偶者の有無を入力して控除上限額を精密計算。推奨寄付額もわかる。", href: "/tools/furusato", emoji: "🎁", category: "お金・投資", isNew: true },
  // 計算ツール
  { id: "mercari-profit", title: "メルカリ利益計算", description: "販売価格・送料・手数料を入力。手取り利益と利益率を瞬時に計算します。", href: "/tools/mercari-profit", emoji: "🛍️", category: "計算ツール", isPopular: true },
  { id: "gas-calculator", title: "ガソリン代計算", description: "走行距離・燃費・ガソリン単価を入力。往復・月間のガソリン代をリアルタイム計算。", href: "/tools/gas-calculator", emoji: "⛽", category: "計算ツール" },
  { id: "shift-salary", title: "シフト給与計算", description: "時給・勤務時間・深夜時間・勤務日数を入力して月収を計算。深夜割増・交通費も対応。", href: "/tools/shift-salary", emoji: "⏰", category: "計算ツール", isNew: true },
  { id: "point-simulator", title: "ポイント還元シミュレーター", description: "PayPay・楽天・クレカなど主要サービスの還元率を比較。年間獲得ポイントを計算。", href: "/tools/point-simulator", emoji: "💳", category: "計算ツール" },
  // 画像・PDF
  { id: "heic-to-jpg", title: "HEIC→JPG変換", description: "iPhoneの写真（HEIC）をJPGに変換。ブラウザ完結でアップロード不要、プライバシー安全。", href: "/tools/heic-to-jpg", emoji: "🖼️", category: "画像・PDF" },
  { id: "image-compress", title: "画像圧縮ツール", description: "JPG・PNG・WebPを高品質のまま圧縮。サイト表示速度改善・SNS投稿に最適。", href: "/tools/image-compress", emoji: "🗜️", category: "画像・PDF" },
  { id: "video-compress", title: "動画圧縮ツール", description: "MP4・MOV・AVI・MKVなどの動画をブラウザで圧縮。品質・解像度を自由に設定。", href: "/tools/video-compress", emoji: "🎬", category: "画像・PDF", isNew: true },
  { id: "image-resize", title: "画像リサイズ・アスペクト比変換", description: "画像のサイズ変更・比率変換をブラウザで完結。16:9・1:1など主要比率とSNSサイズプリセット対応。", href: "/tools/image-resize", emoji: "✂️", category: "画像・PDF", isNew: true },
  { id: "id-photo", title: "証明写真作成", seoTitle: "証明写真作成ツール｜履歴書・コンビニ印刷対応", description: "履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を自動作成。L判4枚配置のコンビニ印刷モード搭載。", href: "/tools/id-photo", emoji: "📸", category: "画像・PDF", isNew: true },
  { id: "pdf-merge", title: "PDF結合", seoTitle: "PDF結合ツール｜複数PDFを無料でまとめる【登録不要】", description: "複数のPDFファイルをブラウザ上で簡単に結合。ドラッグで順番変更・登録不要・スマホ対応。", href: "/tools/pdf-merge", emoji: "📎", category: "画像・PDF", isNew: true },
  { id: "pdf-split", title: "PDF分割", seoTitle: "PDF分割ツール｜ページ抽出・分割を無料で実行", description: "PDFをページごとに分割。必要なページだけ抽出して保存できます。登録不要・ブラウザ完結。", href: "/tools/pdf-split", emoji: "✂️", category: "画像・PDF", isNew: true },
  { id: "pdf-compress", title: "PDF圧縮", seoTitle: "PDF圧縮ツール｜ファイルサイズを無料で軽量化", description: "PDFファイルをブラウザ上で圧縮。メール添付やアップロード向けに軽量化できます。", href: "/tools/pdf-compress", emoji: "🗜️", category: "画像・PDF", isNew: true },
  { id: "jpg-to-pdf", title: "JPG→PDF変換", seoTitle: "JPGをPDFに変換｜画像をまとめてPDF化【無料】", description: "JPGやPNG画像をまとめてPDFへ変換。ドラッグで順番変更・スマホ・PC両対応。", href: "/tools/jpg-to-pdf", emoji: "🖼️", category: "画像・PDF", isNew: true },
  { id: "pdf-to-jpg", title: "PDF→JPG変換", seoTitle: "PDFをJPGに変換｜PDFページを画像保存【無料】", description: "PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。", href: "/tools/pdf-to-jpg", emoji: "📄", category: "画像・PDF", isNew: true },
  { id: "pdf-rotate", title: "PDF回転", seoTitle: "PDFページ回転ツール｜横向きを縦に修正【無料】", description: "PDFのページを90°・180°・270°回転。スキャンで横になったPDFを簡単修正。全ページ・指定ページ対応。", href: "/tools/pdf-rotate", emoji: "🔄", category: "画像・PDF", isNew: true },
  { id: "pdf-watermark", title: "PDF透かし", seoTitle: "PDF透かし（ウォーターマーク）追加ツール【無料】", description: "PDFに「社外秘」「CONFIDENTIAL」「DRAFT」などのテキスト透かしを追加。色・透明度・サイズを自由設定。", href: "/tools/pdf-watermark", emoji: "🔏", category: "画像・PDF", isNew: true },
  { id: "pdf-delete-pages", title: "PDFページ削除", seoTitle: "PDFページ削除ツール｜不要なページを無料で削除", description: "PDFから不要なページを選んで削除。複数選択・一括削除・反転選択に対応。登録不要・ブラウザ完結。", href: "/tools/pdf-delete-pages", emoji: "🗑️", category: "画像・PDF", isNew: true },
  { id: "pdf-reorder", title: "PDF並び替え", seoTitle: "PDF並び替えツール｜ページ順番を無料で変更", description: "PDFのページ順をドラッグ操作で並び替え。スマホは上下ボタンにも対応。サムネイルで確認しながら操作。", href: "/tools/pdf-reorder", emoji: "↕️", category: "画像・PDF", isNew: true },
  { id: "pdf-password", title: "PDFパスワード設定", seoTitle: "PDFパスワード設定ツール｜PDFに無料でロックを追加", description: "PDFにAES-256暗号化でパスワード保護を追加。ブラウザ完結・登録不要・無料。設定したパスワードで解除も可能。", href: "/tools/pdf-password", emoji: "🔐", category: "画像・PDF", isNew: true },
  { id: "pdf-metadata-remover", title: "PDFメタデータ削除", seoTitle: "PDFメタデータ削除ツール｜作成者・日付を無料で消去", description: "PDFに埋め込まれた作成者・作成日・使用ソフト名などのメタデータを削除。共有前のプライバシー保護に。", href: "/tools/pdf-metadata-remover", emoji: "🧹", category: "画像・PDF", isNew: true },
  // 生活・副業
  { id: "side-job-profit", title: "副業利益・税金計算", description: "副業収入から経費・税金を差し引いた実質手取りを計算。確定申告の目安も確認。", href: "/tools/side-job-profit", emoji: "💼", category: "生活・副業" },
  { id: "youtube-tools", title: "YouTube SEOツール", description: "タイトル文字数・ハッシュタグ最適化・サムネ比率確認をまとめてチェック。", href: "/tools/youtube-tools", emoji: "🎥", category: "生活・副業" },
  { id: "sns-links", title: "SNSリンクまとめ", description: "X・Instagram・TikTok・YouTubeなど複数のSNSリンクをまとめた共有ページを即生成。", href: "/tools/sns-links", emoji: "🔗", category: "生活・副業", isNew: true },
  // テキスト・Web
  { id: "word-counter", title: "文字数カウント", description: "入力した瞬間にリアルタイムで文字数・行数・単語数を計測。Twitter・履歴書に便利。", href: "/tools/word-counter", emoji: "✍️", category: "テキスト・Web", isPopular: true },
  { id: "markdown-editor", title: "Markdownエディタ", description: "左に書いて右でプレビュー。GitHub対応MDをそのままコピー・ダウンロード。", href: "/tools/markdown-editor", emoji: "📝", category: "テキスト・Web" },
  { id: "password-generator", title: "パスワード生成", description: "長さ・記号・数字を自由に設定。強度メーター付きの安全なパスワードを即生成。", href: "/tools/password-generator", emoji: "🔐", category: "テキスト・Web" },
  { id: "qr-generator", title: "QRコード生成", description: "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。", href: "/tools/qr-generator", emoji: "📱", category: "テキスト・Web", isPopular: true },
  { id: "wifi-qr", title: "Wi-Fi QRコード生成", description: "SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。スキャンするだけで簡単接続。", href: "/tools/wifi-qr", emoji: "📶", category: "テキスト・Web", isNew: true },
  { id: "short-link", title: "URL短縮 & QR生成", description: "長いURLをコンパクトに整形し、QRコードも同時生成。コピーもダウンロードも簡単。", href: "/tools/short-link", emoji: "🔗", category: "テキスト・Web" },
  // 学生向け
  { id: "gpa", title: "GPA計算", description: "科目・単位数・成績を入力してGPAを即計算。大学の累積GPAをリアルタイムで確認。", href: "/tools/gpa", emoji: "🎓", category: "学生向け", isNew: true },
  // 仕事・副業
  { id: "resume-builder", title: "履歴書・職務経歴書作成", description: "フォームを埋めるだけで職務経歴書のテキストが完成。そのままコピー・印刷OK。", href: "/tools/resume-builder", emoji: "📄", category: "仕事・副業" },
  // ビジネス・契約書
  { id: "business-contract-generator", title: "業務委託契約書作成", seoTitle: "業務委託契約書作成ツール｜無料テンプレート【登録不要】", description: "業務委託契約書を無料で作成。Web制作・動画編集・システム開発など業種別テンプレート対応。PDF保存・印刷・コピー機能付き。", href: "/tools/business-contract-generator", emoji: "📋", category: "ビジネス・契約書", isNew: true },
  { id: "nda-generator", title: "NDA（秘密保持契約書）作成", seoTitle: "NDA・秘密保持契約書作成ツール｜無料テンプレート", description: "NDA（秘密保持契約書）を無料で作成。正式な契約書フォーマットで自動生成。PDF保存・印刷対応。登録不要。", href: "/tools/nda-generator", emoji: "🤝", category: "ビジネス・契約書", isNew: true },
  { id: "invoice-generator", title: "請求書作成ツール", seoTitle: "請求書作成ツール｜無料・PDF保存対応【登録不要】", description: "請求書を無料で作成。明細行の追加・消費税計算・インボイス番号対応。PDF保存・印刷。ブラウザ完結。", href: "/tools/invoice-generator", emoji: "🧾", category: "ビジネス・契約書", isNew: true, isPopular: true },
  { id: "estimate-generator", title: "見積書作成ツール", seoTitle: "見積書作成ツール｜無料・PDF保存対応【登録不要】", description: "見積書を無料で作成。明細行追加・消費税計算・有効期限・承認欄付き。PDF保存・印刷対応。", href: "/tools/estimate-generator", emoji: "📊", category: "ビジネス・契約書", isNew: true },
  { id: "resignation-letter-generator", title: "退職届作成ツール", seoTitle: "退職届作成ツール｜そのまま提出できるテンプレート", description: "退職届・退職願を無料で作成。一身上の都合など理由別テンプレート対応。A4印刷最適化済み。そのまま提出可能。", href: "/tools/resignation-letter-generator", emoji: "✉️", category: "ビジネス・契約書", isNew: true },
  { id: "certified-letter-generator", title: "内容証明テンプレ作成", seoTitle: "内容証明テンプレート作成ツール｜無料・文字数ガイド付き", description: "内容証明郵便のテンプレートを無料で作成。日本郵便の書式ルール（1行26文字・20行）に対応した文字数ガイド付き。", href: "/tools/certified-letter-generator", emoji: "📮", category: "ビジネス・契約書", isNew: true },
];

export const CATEGORIES: ToolCategory[] = [
  "お金・投資", "計算ツール", "画像・PDF", "生活・副業", "テキスト・Web", "学生向け", "仕事・副業", "ビジネス・契約書"
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

export const CATEGORY_SLUGS: Record<ToolCategory, string> = {
  "お金・投資": "finance",
  "計算ツール": "calculator",
  "画像・PDF": "image",
  "生活・副業": "lifestyle",
  "テキスト・Web": "text",
  "学生向け": "student",
  "仕事・副業": "work",
  "ビジネス・契約書": "business",
};

export function getToolsByCategorySlug(slug: string): ToolItem[] | null {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  if (!entry) return null;
  return TOOLS.filter(t => t.category === entry[0] as ToolCategory);
}

export function getCategoryNameBySlug(slug: string): ToolCategory | null {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  return entry ? entry[0] as ToolCategory : null;
}
