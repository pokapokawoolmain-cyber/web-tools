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
    "pdf-password", "pdf-metadata-remover", "word-to-pdf", "excel-to-pdf",
  ],
  stats: [
    { label: "PDFツール数", value: "13種類" },
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
    "favicon-generator",
  ],
  stats: [
    { label: "画像ツール数", value: "6種類" },
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
  tagline: "お金・投資の無料ツール｜FIRE・NISA・手取り・住宅ローン計算",
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
  title: "お金・投資の無料ツール集｜FIRE・NISA・手取り・住宅ローン計算",
  keywords: ["FIRE シミュレーター 無料", "新NISA 計算 無料", "手取り 計算", "住宅ローン シミュレーション", "ふるさと納税 上限 計算"],
  popularToolIds: ["fire-simulator", "nisa-calculator", "net-income", "mortgage-calculator", "furusato-simulator"],
  allToolIds: [
    "fire-simulator", "nisa-calculator", "net-income", "takehome-reverse", "bonus-takehome",
    "nenshu-kabe", "mortgage-calculator",
    "furusato-simulator", "furusato",
    "mercari-profit", "gas-calculator", "shift-salary", "point-simulator", "side-job-profit",
  ],
  stats: [
    { label: "計算ツール数", value: "11種類" },
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
  allToolIds: ["business-contract-generator", "nda-generator", "invoice-generator", "estimate-generator", "resignation-letter-generator", "certified-letter-generator", "hanko-generator", "pdf-signature", "receipt-generator", "resume-builder"],
  stats: [
    { label: "ビジネスツール数", value: "10種類" },
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
// 冠婚葬祭・文書カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const CEREMONY_CATEGORY: CategoryConfig = {
  slug: "ceremony",
  name: "冠婚葬祭・文書",
  nameEn: "Ceremony & Documents",
  tagline: "のし紙・香典袋・退職届・送付状を無料作成",
  description:
    "のし紙・香典袋表書き・退職届・送付状を無料で作成できるWebツール集。テンプレートを選んで印刷するだけ。登録不要・スマホ対応。",
  longDescription:
    "冠婚葬祭の書類からビジネス文書まで、日本の生活に必要な書類をすべてブラウザで無料作成。アプリ不要・登録不要で、作成した書類はそのままPDF保存・印刷して使えます。",
  icon: "🎀",
  gradientFrom: "from-rose-400",
  gradientTo: "to-pink-600",
  gradientLight: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20",
  accentColor: "text-rose-600 dark:text-rose-400",
  accentBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
  title: "のし紙・香典袋・退職届を無料作成｜冠婚葬祭・文書ツール集【登録不要】",
  keywords: ["のし紙 作成 無料", "香典袋 表書き 印刷", "退職届 テンプレ 無料", "送付状 作成 無料", "のし テンプレート 印刷"],
  popularToolIds: ["noshi-maker", "koden-maker", "shugi-maker", "houyou-calculator"],
  allToolIds: ["noshi-maker", "koden-maker", "shugi-maker", "houyou-calculator", "resignation-letter", "fax-cover"],
  stats: [
    { label: "冠婚葬祭ツール数", value: "4種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "PDF保存・印刷", value: "対応" },
  ],
  faqs: [
    { q: "のし紙を無料で印刷できますか？", a: "はい。のし紙作成ツールで表書き・水引・名前を設定してPDF保存し、A4用紙に印刷できます。コンビニのネットプリントにも対応しています。" },
    { q: "香典袋の表書きはどう書けばいいですか？", a: "宗派によって異なります。仏式は「御霊前」（四十九日以降は「御仏前」）、神式は「御霊前」「玉串料」、キリスト教は「御花料」が一般的です。香典袋表書きメーカーで宗派を選ぶと適切な表書きが選べます。" },
    { q: "退職届はパワハラを理由にできますか？", a: "退職届の「理由」欄に具体的な内容を書く必要はありません。一般的には「一身上の都合により」で問題ありません。ただしパワハラを記録する目的で詳細を残したい場合は弁護士への相談も検討してください。" },
    { q: "送付状（FAX送付状）はどんな場面で使いますか？", a: "書類をFAXや郵送で送る際に先頭に添付します。宛先・差出人・送付枚数・件名などを記載することで、受け取り側が書類の内容をすぐに確認できます。" },
    { q: "作成した書類はサーバーに送信されますか？", a: "すべての処理はブラウザ内で完結します。入力した個人情報・会社名などが外部に送信されることは一切ありません。" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// カラーツールカテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_CATEGORY: CategoryConfig = {
  slug: "color",
  name: "カラーツール",
  nameEn: "Color Tools",
  tagline: "無料カラーツール集｜HEX変換・パレット生成・グラデーション・コントラスト",
  description:
    "HEX/RGB/HSL変換・カラーパレット生成・CSSグラデーション生成・WCAGコントラスト比チェックを無料で使えるWebツール集。登録不要・スマホ対応・ブラウザ完結。",
  longDescription:
    "Webデザイン・コーディングに必要なカラーツールをすべてブラウザで無料利用。HEX↔RGB↔HSL相互変換・補色/類似色パレット自動生成・CSSグラデーション出力・WCAG AA/AAA準拠コントラスト比チェック。デザイナーにも開発者にも役立つツール集です。",
  icon: "🎨",
  gradientFrom: "from-pink-500",
  gradientTo: "to-violet-600",
  gradientLight: "from-pink-50 to-violet-50 dark:from-pink-950/30 dark:to-violet-950/20",
  accentColor: "text-pink-600 dark:text-pink-400",
  accentBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300",
  title: "無料カラーツール集｜HEX変換・パレット生成・グラデーション【登録不要】",
  keywords: ["カラーコード 変換 無料", "hex rgb 変換", "カラーパレット 生成 無料", "cssグラデーション 生成", "コントラスト比 チェック WCAG"],
  popularToolIds: ["hex-rgb-converter", "contrast-checker", "color-palette", "gradient-generator"],
  allToolIds: ["hex-rgb-converter", "color-palette", "gradient-generator", "contrast-checker"],
  stats: [
    { label: "カラーツール数", value: "4種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "処理場所", value: "ブラウザ完結" },
  ],
  faqs: [
    { q: "HEXカラーコードとRGBの違いは何ですか？", a: "HEX（例：#FF6B35）は16進数表記で、RGBは赤・緑・青の各成分を0〜255の10進数で表します。どちらも同じ色を表現する方法で、Webデザインではどちらも広く使われます。相互変換はカラーコード変換ツールで即座に行えます。" },
    { q: "カラーパレット生成ツールはどう使いますか？", a: "ベースカラーをカラーピッカーまたはHEXコードで入力すると、補色・類似色・トライアドなど5種類の配色パターンが自動生成されます。生成されたパレットはCSS変数としてまとめてコピーできます。" },
    { q: "CSSグラデーションのコードをそのままコピーできますか？", a: "はい。グラデーション生成ツールで設定した内容はリアルタイムでCSSコードに変換されます。「コピー」ボタンを押すだけでそのままCSSファイルに貼り付けられます。" },
    { q: "WCAGのコントラスト比とは何ですか？", a: "WCAG（Webコンテンツアクセシビリティガイドライン）では、テキストと背景色のコントラスト比を規定しています。通常テキストは4.5:1（AA）以上、大きなテキストは3:1以上が推奨されています。コントラストチェッカーで即座に確認できます。" },
    { q: "スマホからも使えますか？", a: "はい。iPhone・Androidのブラウザからすべてのカラーツールをご利用いただけます。アプリのインストールは不要です。" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 建設・リフォームカテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const CONSTRUCTION_CATEGORY: CategoryConfig = {
  slug: "industry/construction",
  name: "建設・リフォーム業向けツール",
  nameEn: "Construction Tools",
  tagline: "建設・リフォーム業向け無料ツール集",
  description:
    "工事見積書・工事写真帳・完了報告書・請負契約書・原価率計算・外壁塗装面積計算など、建設・リフォーム業の実務で使えるツールを無料提供。登録不要・ブラウザ完結・スマホ対応。",
  longDescription:
    "建設・リフォーム業の現場で即使えるツール集。見積から契約・施工・完了報告まで、業務フロー全体をカバーします。ブラウザ内完結でデータが外部に送信されないため、顧客情報・工事情報も安心して入力できます。",
  icon: "🏗️",
  gradientFrom: "from-amber-500",
  gradientTo: "to-orange-500",
  gradientLight: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
  accentColor: "text-amber-600 dark:text-amber-400",
  accentBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
  title: "建設・リフォーム業向け無料ツール集｜工事見積書・写真帳・契約書",
  keywords: [
    "建設業 ツール 無料", "リフォーム 見積書 作成", "工事見積書 無料",
    "工事写真帳 作成", "工事請負契約書 無料", "外壁塗装 面積 計算",
  ],
  popularToolIds: [
    "construction-photo-pdf",
    "construction-estimate",
    "construction-report",
    "construction-contract",
    "gross-profit-calculator",
  ],
  allToolIds: [
    "construction-estimate",
    "gross-profit-calculator",
    "exterior-paint-calculator",
    "neighbor-greeting",
    "construction-photo-pdf",
    "construction-report",
    "construction-contract",
  ],
  stats: [
    { label: "専用ツール数", value: "7種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "データ送信", value: "なし（ブラウザ完結）" },
  ],
  faqs: [
    { q: "建設業の工事見積書を無料で作成できますか？", a: "はい。工事見積書作成ツールで工事明細・諸経費・消費税を入力してPDF出力できます。施工会社情報は自動保存されます。" },
    { q: "工事写真をまとめてPDFにできますか？", a: "はい。工事写真帳作成ツールで施工前・施工中・施工後の写真に工程区分・コメントを付けてA4 PDFを作成できます。" },
    { q: "工事請負契約書も作成できますか？", a: "はい。工事請負契約書作成ツールで発注者・請負者情報・工事金額・支払条件・保証を入力してPDF出力できます。" },
    { q: "スマホからも使えますか？", a: "はい。すべてのツールはスマートフォン・タブレット対応のレスポンシブデザインです。現場での確認にも活用できます。" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 飲食店カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const RESTAURANT_CATEGORY: CategoryConfig = {
  slug: "industry/restaurant",
  name: "飲食店向けツール",
  nameEn: "Restaurant Tools",
  tagline: "飲食店・カフェ・居酒屋向け無料ツール集",
  description:
    "原価率計算・メニュー価格決め・メニュー表作成・口コミ返信・POP作成・人件費計算など、飲食店の日常業務で使えるツールを無料提供。登録不要・ブラウザ完結・スマホ対応。",
  longDescription:
    "飲食店・カフェ・居酒屋・キッチンカーの店舗運営で即使えるツール集。原価管理からメニュー表作成、集客・口コミ対応まで業務全体をカバーします。データは外部に送信されないため、レシピや価格情報も安心して入力できます。",
  icon: "🍽️",
  gradientFrom: "from-orange-500",
  gradientTo: "to-red-500",
  gradientLight: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20",
  accentColor: "text-orange-600 dark:text-orange-400",
  accentBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300",
  title: "飲食店向け無料ツール集｜原価率計算・メニュー表作成・口コミ返信",
  keywords: [
    "飲食店 原価率 計算", "メニュー 価格 決め方", "メニュー表 作成 無料",
    "Google口コミ 返信 飲食店", "飲食店 POP 作成", "飲食店 補助金",
  ],
  popularToolIds: [
    "food-cost-calculator",
    "menu-price-calculator",
    "restaurant-menu-maker",
    "review-reply-generator",
    "restaurant-pop-generator",
  ],
  allToolIds: [
    "food-cost-calculator",
    "menu-price-calculator",
    "restaurant-menu-maker",
    "review-reply-generator",
    "restaurant-pop-generator",
  ],
  stats: [
    { label: "専用ツール数", value: "5種類" },
    { label: "利用料金", value: "完全無料" },
    { label: "登録・インストール", value: "不要" },
    { label: "データ送信", value: "なし（ブラウザ完結）" },
  ],
  faqs: [
    { q: "原価率の目安はどれくらいですか？", a: "飲食業界全般では原価率30〜35%が目安とされています。ただし業態により異なり、ラーメン店・居酒屋は25〜30%、カフェ・スイーツ系は30〜40%、高級レストランは35〜45%程度が一般的です。" },
    { q: "メニュー価格はどうやって決めればいいですか？", a: "食材費（原価）÷目標原価率で算出した価格を基準に、競合の相場・客層・立地・提供価値を考慮して最終決定します。ただし端数（xxxx円→xxx0円・xxx8円など）は印象に影響するため、心理的価格設定も重要です。" },
    { q: "Google口コミへの返信は必ずしたほうがいいですか？", a: "はい、すべての口コミへの返信を推奨します。高評価には感謝と再来店への誘導を、低評価には真摯な謝意と改善の姿勢を示すことで、閲覧者への信頼性が高まります。返信時は個人情報に触れず、過度な謝罪や反論も避けましょう。" },
    { q: "スマホから使えますか？", a: "はい。すべてのツールはスマートフォン対応です。仕込み中の計算や営業中の口コミ確認など、現場での利用を想定した設計になっています。" },
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
  ceremony: CEREMONY_CATEGORY,
  color: COLOR_CATEGORY,
  construction: CONSTRUCTION_CATEGORY,
  restaurant: RESTAURANT_CATEGORY,
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
