// ========================================
// カテゴリTOPページ 設定ファイル
// ここだけ編集すれば新カテゴリを追加可能
// ========================================

export type CategoryFaq = { q: string; a: string };

// ブログ記事は data/blogs.ts で一元管理。CategoryConfig には含まない

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
  // relatedBlogs は data/blogs.ts で一元管理 → getBlogsByCategory() で取得
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
};

// ─────────────────────────────────────────────────────────────────────────────
// ビジネス・契約書カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const BUSINESS_CATEGORY: CategoryConfig = {
  slug: "business",
  name: "ビジネス・契約書",
  nameEn: "Business & Contracts",
  tagline: "無料ビジネス書類ツール集｜契約書・請求書・退職届",
  description: "業務委託契約書・NDA・請求書・見積書・退職届・内容証明を無料で作成。登録不要・ブラウザ完結・PDF保存対応。",
  longDescription: "フリーランス・個人事業主・会社員に必要なビジネス書類をすべてブラウザで無料作成。アプリ不要・登録不要で、作成した書類はそのままPDF保存・印刷して使用できます。",
  icon: "📋",
  gradientFrom: "from-blue-600",
  gradientTo: "to-indigo-600",
  gradientLight: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
  accentColor: "text-blue-600 dark:text-blue-400",
  accentBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  title: "無料ビジネス書類ツール集｜契約書・請求書・退職届【登録不要】",
  keywords: ["業務委託契約書 無料", "請求書 作成 無料", "NDA テンプレ 無料", "退職届 テンプレ", "見積書 無料", "内容証明 テンプレ"],
  popularToolIds: ["invoice-generator", "business-contract-generator", "resignation-letter-generator", "hanko-generator", "pdf-signature"],
  allToolIds: ["business-contract-generator", "nda-generator", "invoice-generator", "estimate-generator", "resignation-letter-generator", "certified-letter-generator", "hanko-generator", "pdf-signature", "receipt-generator"],
  stats: [
    { label: "ビジネスツール数", value: "9種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "PDF保存", value: "対応" },
  ],
  faqs: [
    { q: "作成した書類は法的効力がありますか？", a: "本ツールで作成した書類はひな形・参考資料としてご利用ください。実際の契約締結・法的手続きにあたっては、弁護士・司法書士などの専門家にご相談されることをお勧めします。" },
    { q: "作成した書類はどうやって保存しますか？", a: "「PDFで保存・印刷」ボタンをクリックするとブラウザの印刷ダイアログが開きます。「PDFに保存」を選択することでPDF形式で保存できます。" },
    { q: "入力した内容はサーバーに送信されますか？", a: "すべての処理はブラウザ内で完結します。入力した情報が外部サーバーに送信されることは一切ありません。" },
    { q: "スマホからも使えますか？", a: "はい。スマートフォン・タブレットのブラウザからご利用いただけます。ただし印刷・PDF保存はPCからの利用を推奨します。" },
    { q: "商用利用はできますか？", a: "無料でご利用いただけます。ただし、作成した書類の内容・効力については責任を負いかねます。重要な書類については専門家にご確認ください。" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// AI文章ツールカテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const AI_CATEGORY: CategoryConfig = {
  slug: "ai",
  name: "AI文章ツール",
  nameEn: "AI Text Tools",
  tagline: "AI文章ツール集｜整形・自然化・X投稿・note最適化",
  description:
    "ChatGPTやClaudeの出力文章を整形・自然化・SNS最適化できる無料ツール集。登録不要・ブラウザ完結・スマホ対応。",
  longDescription:
    "AIが生成した文章をそのまま使うと「AIっぽい」と言われる。ToolBoxJPのAI文章ツールなら、ChatGPT出力をnote・ブログ・X・LINEに最適化したり、AI感を自然な日本語に変換したりできます。すべてブラウザ完結・無料・登録不要。",
  icon: "🤖",
  gradientFrom: "from-violet-500",
  gradientTo: "to-fuchsia-600",
  gradientLight: "from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/20",
  accentColor: "text-violet-600 dark:text-violet-400",
  accentBg: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
  title: "無料AI文章ツール集｜整形・自然化・X投稿・note最適化【登録不要】",
  keywords: ["ChatGPT 改行 整形", "AI文章 自然化", "AIっぽい 文章 修正", "X 改行 シミュレーター", "note 整形 AI"],
  popularToolIds: ["chatgpt-format", "ai-humanize", "x-post-preview", "note-format"],
  allToolIds: ["chatgpt-format", "ai-humanize", "x-post-preview", "note-format"],
  stats: [
    { label: "AIツール数", value: "4種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "処理場所", value: "ブラウザ完結" },
  ],
  faqs: [
    { q: "ChatGPTの文章をnoteに貼り付けると崩れるのはなぜですか？", a: "ChatGPTはMarkdown形式で出力するため、noteの入力欄にそのまま貼ると改行・記号が崩れます。ChatGPT改行整形ツールを使うと、note向けのフォーマットに自動変換できます。" },
    { q: "AI文章は本当に「バレる」のですか？", a: "はい。「ます/です」の語尾が均一、段落冒頭の「まず/次に/また」の繰り返し、「〜することができます」などの固い表現がAI文章の特徴です。AI文章自然化ツールで自動修正できます。" },
    { q: "X（旧Twitter）の改行はどう確認しますか？", a: "X投稿プレビューツールを使うと、実際の投稿に近い見た目で改行・文字数・ハッシュタグの表示を確認できます。投稿前のチェックに便利です。" },
    { q: "処理した文章はサーバーに送信されますか？", a: "すべての処理はブラウザ内で完結します。入力した文章が外部サーバーに送信されることは一切ありません。機密性の高い文章も安心してご利用いただけます。" },
    { q: "スマホから使えますか？", a: "はい。iPhoneもAndroidもブラウザ（Safari・Chrome等）から利用できます。アプリのインストールは不要です。" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// エクスポート
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  pdf: PDF_CATEGORY,
  image: IMAGE_CATEGORY,
  money: MONEY_CATEGORY,
  business: BUSINESS_CATEGORY,
  ai: AI_CATEGORY,
};

export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIGS[slug];
}

/** ツールID からそのカテゴリTOP設定を返す。未登録の場合は undefined */
export function getCategoryForTool(toolId: string): CategoryConfig | undefined {
  return Object.values(CATEGORY_CONFIGS).find(
    (c) => c.allToolIds.includes(toolId)
  );
}

/** 全カテゴリ設定の配列 */
export const ALL_CATEGORIES = Object.values(CATEGORY_CONFIGS);
