// ========================================
// カテゴリTOPページ 設定ファイル
// ここだけ編集すれば新カテゴリを追加可能
// ========================================

export type CategoryFaq = { q: string; a: string };

export type CategoryBlogPost = {
  slug: string;
  title: string;
  description: string;
};

export type CategoryConfig = {
  slug: string;
  name: string;           // 表示名
  nameEn: string;         // 英語名（URLなど）
  tagline: string;        // キャッチコピー
  description: string;    // SEO description
  longDescription: string; // ページ内説明文
  icon: string;           // emoji
  // グラデーション (Tailwind クラス)
  gradientFrom: string;
  gradientTo: string;
  gradientLight: string;  // 薄い背景色
  accentColor: string;    // テキスト強調色
  accentBg: string;       // バッジ背景
  // SEO
  title: string;          // <title>タグ
  keywords: string[];
  // コンテンツ
  popularToolIds: string[];   // 人気ツール（上部フィーチャー）
  allToolIds: string[];       // 全ツール（下部一覧）
  faqs: CategoryFaq[];
  relatedBlogs: CategoryBlogPost[];
  stats: { label: string; value: string }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// PDF カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const PDF_CATEGORY: CategoryConfig = {
  slug: "pdf",
  name: "PDFツール",
  nameEn: "PDF Tools",
  tagline: "無料PDFツール集｜結合・分割・圧縮・変換",
  description:
    "PDF結合・分割・圧縮・回転・変換などを無料で使えるWebツール集。登録不要・スマホ対応・ブラウザ完結。ファイルが外部に送信されない安心設計。",
  longDescription:
    "PDFの編集・変換・圧縮をすべてブラウザで完結。アプリのインストール不要で、iPhone・Android・PCどこからでも無料で使えます。ファイルはサーバーに送信されないため、機密書類も安心。",
  icon: "📄",
  gradientFrom: "from-rose-500",
  gradientTo: "to-orange-500",
  gradientLight: "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20",
  accentColor: "text-rose-600 dark:text-rose-400",
  accentBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
  title: "無料PDFツール集｜結合・分割・圧縮・変換【登録不要】",
  keywords: ["PDF 結合 無料", "PDF 分割 無料", "PDF 圧縮 無料", "PDF 変換 無料", "PDF ブラウザ 無料", "PDF スマホ"],
  popularToolIds: ["pdf-merge", "pdf-compress", "pdf-split", "jpg-to-pdf", "pdf-to-jpg"],
  allToolIds: [
    "pdf-merge", "pdf-split", "pdf-compress", "pdf-to-jpg", "jpg-to-pdf",
    "pdf-rotate", "pdf-watermark", "pdf-delete-pages", "pdf-reorder",
    "pdf-password", "pdf-metadata-remover",
  ],
  stats: [
    { label: "PDFツール数", value: "11種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "ファイル送信", value: "なし（ブラウザ完結）" },
  ],
  faqs: [
    { q: "PDFツールは完全無料ですか？", a: "はい、すべてのPDFツールは完全無料でご利用いただけます。登録・ログイン・クレジットカード情報の入力は一切不要です。" },
    { q: "スマホ（iPhone・Android）から使えますか？", a: "はい。Safari・Chromeなどのブラウザから直接アクセスしてご利用いただけます。アプリのインストールは不要です。" },
    { q: "アップロードしたPDFは安全ですか？", a: "すべての処理はブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。機密書類や個人情報を含むPDFも安心してご利用いただけます。" },
    { q: "ファイルサイズの上限はありますか？", a: "ブラウザのメモリに依存しますが、PCでは数百MB、スマホでは数十MBが目安です。大きなファイルはPCでの操作を推奨します。" },
    { q: "複数のPDFを一度に処理できますか？", a: "PDF結合・JPG→PDFなど一部のツールでは複数ファイルのアップロードに対応しています。各ツールの説明をご確認ください。" },
  ],
  relatedBlogs: [
    { slug: "pdf-merge-guide", title: "PDFをスマホで結合する方法", description: "アプリ不要・ブラウザ完結でPDFを無料で結合する手順を解説" },
    { slug: "pdf-compress-guide", title: "PDFを圧縮・軽量化する方法", description: "メール添付に最適なPDF圧縮の方法と圧縮率の目安" },
    { slug: "pdf-split-guide", title: "PDFの特定ページだけ取り出す方法", description: "必要なページだけ抽出・分割する手順を解説" },
    { slug: "iphone-pdf-guide", title: "iPhoneだけでPDFを操作する方法", description: "Safari完結でできるPDF操作のすべて" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 画像カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const IMAGE_CATEGORY: CategoryConfig = {
  slug: "image",
  name: "画像ツール",
  nameEn: "Image Tools",
  tagline: "無料画像ツール集｜圧縮・変換・リサイズ・証明写真",
  description:
    "画像圧縮・HEIC変換・リサイズ・証明写真作成・動画圧縮などを無料で使えるWebツール集。登録不要・スマホ対応・ブラウザ完結。",
  longDescription:
    "iPhoneのHEIC変換、画像圧縮、証明写真作成、動画圧縮など画像・動画に関するツールをすべて無料でブラウザから利用できます。ファイルはデバイス上で処理されるためプライバシーも安心。",
  icon: "🖼️",
  gradientFrom: "from-violet-500",
  gradientTo: "to-purple-600",
  gradientLight: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20",
  accentColor: "text-violet-600 dark:text-violet-400",
  accentBg: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
  title: "無料画像ツール集｜圧縮・HEIC変換・リサイズ・証明写真【登録不要】",
  keywords: ["画像圧縮 無料", "HEIC JPG 変換 無料", "画像リサイズ 無料", "証明写真 無料 スマホ", "動画圧縮 無料"],
  popularToolIds: ["image-compress", "heic-to-jpg", "id-photo", "image-resize", "video-compress"],
  allToolIds: [
    "image-compress", "heic-to-jpg", "id-photo", "image-resize", "video-compress",
  ],
  stats: [
    { label: "画像ツール数", value: "5種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "対応形式", value: "JPG・PNG・HEIC・MP4他" },
    { label: "ファイル送信", value: "なし（ブラウザ完結）" },
  ],
  faqs: [
    { q: "iPhoneのHEIC写真をJPGに変換できますか？", a: "はい。HEIC→JPG変換ツールにiPhoneで撮影したHEICファイルをアップロードするだけでJPGに変換できます。Windowsでも開ける形式に変換されます。" },
    { q: "画像を圧縮すると画質は落ちますか？", a: "圧縮率によりますが、通常の使用（SNS投稿・メール送信など）では視覚的な劣化はほぼわかりません。圧縮前後を比較しながら最適な設定を選べます。" },
    { q: "証明写真はコンビニで印刷できますか？", a: "はい。証明写真作成ツールにはL判4面配置（コンビニ印刷モード）が搭載されています。セブン-イレブン・ローソン・ファミリーマートで印刷できる形式で出力できます。" },
    { q: "動画圧縮で対応しているフォーマットは？", a: "MP4・MOV（iPhone動画）・AVI・MKVなど主要な動画形式に対応しています。解像度・品質を自由に調整してファイルサイズを小さくできます。" },
    { q: "ファイルはサーバーにアップロードされますか？", a: "すべての処理はブラウザ内で完結します。画像・動画ファイルが外部に送信されることは一切ありません。" },
  ],
  relatedBlogs: [
    { slug: "image-compress-guide", title: "画像を軽くする方法", description: "JPG・PNG画像の圧縮ガイド。SNS・メール添付の最適サイズも解説" },
    { slug: "heic-jpg-guide", title: "HEIC→JPG変換の方法", description: "iPhoneのHEIC写真をWindowsで開けるJPGに変換する手順" },
    { slug: "video-compress-guide", title: "動画の容量を小さくする方法", description: "MP4・MOVをLINEで送れるサイズに圧縮する方法" },
    { slug: "id-photo-smartphone", title: "スマホで証明写真を作る方法", description: "コンビニ印刷対応の証明写真をスマホだけで作る手順" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// お金・投資カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const MONEY_CATEGORY: CategoryConfig = {
  slug: "money",
  name: "お金・投資ツール",
  nameEn: "Money & Finance Tools",
  tagline: "無料お金ツール集｜FIRE・NISA・手取り・住宅ローン計算",
  description:
    "FIREシミュレーター・新NISA計算・手取り計算・住宅ローン・ふるさと納税シミュレーターなど、お金に関するツールを無料で使えるWebツール集。",
  longDescription:
    "FIREまでの年数・新NISAの運用シミュレーション・年収別の手取り計算・住宅ローンの返済額計算など、お金に関するすべての計算をブラウザで即完結。登録不要・完全無料です。",
  icon: "💰",
  gradientFrom: "from-emerald-500",
  gradientTo: "to-teal-600",
  gradientLight: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
  accentColor: "text-emerald-600 dark:text-emerald-400",
  accentBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
  title: "無料お金・投資ツール集｜FIRE・NISA・手取り・住宅ローン計算",
  keywords: ["FIRE シミュレーター 無料", "新NISA 計算 無料", "手取り 計算", "住宅ローン シミュレーション", "ふるさと納税 上限 計算"],
  popularToolIds: ["fire-simulator", "nisa-calculator", "net-income", "mortgage-calculator", "furusato-simulator"],
  allToolIds: [
    "fire-simulator", "nisa-calculator", "net-income", "mortgage-calculator",
    "furusato-simulator", "furusato",
  ],
  stats: [
    { label: "お金ツール数", value: "6種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・ログイン", value: "不要" },
    { label: "計算速度", value: "リアルタイム" },
  ],
  faqs: [
    { q: "FIREシミュレーターはどう使いますか？", a: "現在の資産・毎月の積立額・想定運用利回り・目標月間生活費を入力するだけです。FIRE達成までの年数と必要資産額をリアルタイムで計算します。" },
    { q: "新NISAの非課税メリットはどのくらいですか？", a: "月5万円・年利5%・20年間の場合、課税口座なら運用益約1,225万円に約249万円の税金がかかります。NISAなら全額手元に残ります。" },
    { q: "手取り計算の精度はどのくらいですか？", a: "独身・会社員・東京都在住の標準的な条件での概算値です。加入する健康保険組合・家族構成・各種控除によって実際の手取りは異なります。目安としてご活用ください。" },
    { q: "住宅ローンシミュレーターで変動金利と固定金利を比較できますか？", a: "はい。金利を自由に設定できるため、変動金利（0.5%前後）と固定金利（1〜2%）の両方を入力して返済額を比較できます。" },
    { q: "ふるさと納税の控除上限額はどうやって調べますか？", a: "年収と家族構成を入力するだけで控除上限額の目安を計算できます。ワンストップ特例と確定申告の使い分けについても確認できます。" },
  ],
  relatedBlogs: [
    { slug: "fire-how-much-needed", title: "FIREに必要な資産はいくら？", description: "年収・生活費別シミュレーション。4%ルールと日本での現実的なFIRE戦略" },
    { slug: "nisa-monthly-simulation", title: "新NISA積立シミュレーション", description: "月3万・5万・10万×10〜30年の全パターン早見表" },
    { slug: "salary-takehome-table", title: "手取り早見表2026年版", description: "年収300〜1500万円の月収換算・税金内訳を一覧で確認" },
    { slug: "mortgage-simulation-guide", title: "住宅ローンシミュレーションガイド", description: "借入額・金利別の月返済額と総返済額の早見表" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// エクスポート
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  pdf: PDF_CATEGORY,
  image: IMAGE_CATEGORY,
  money: MONEY_CATEGORY,
};

export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIGS[slug];
}
