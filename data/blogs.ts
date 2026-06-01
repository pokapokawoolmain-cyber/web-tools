// ========================================
// ブログ記事 統合レジストリ
// カテゴリTOPページや内部リンクの単一ソース
// blog-posts.ts（BlogLayout用）とは別管理
// ========================================

export type BlogCategory =
  | "pdf"
  | "image"
  | "money"
  | "calculator"
  | "text"
  | "student"
  | "lifestyle"
  | "business"
  | "ai"
  | "ceremony";

export type BlogEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  tags: string[];
  relatedToolIds: string[];
  isPopular?: boolean;    // 人気記事バッジ
  isFeatured?: boolean;   // カテゴリTOPに優先表示
};

// ─────────────────────────────────────────────────────────────────────────────
// PDF カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const PDF_BLOGS: BlogEntry[] = [
  {
    slug: "pdf-merge-guide",
    title: "PDFをスマホで結合する方法【無料・アプリ不要・ブラウザ完結】",
    description: "iPhoneやAndroidからアプリなしでPDFを無料で結合できます。ドラッグで順番変更、スマホ完結の手順を解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF結合", "スマホ", "iPhone", "Android", "無料"],
    relatedToolIds: ["pdf-merge"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "pdf-compress-guide",
    title: "PDFを圧縮・軽量化する方法【無料・登録不要・ブラウザ完結】",
    description: "PDFのファイルサイズが大きすぎてメール送信できない問題を解決。圧縮率の目安と手順を解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF圧縮", "ファイルサイズ", "メール添付", "軽量化"],
    relatedToolIds: ["pdf-compress"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "pdf-split-guide",
    title: "PDFの特定ページだけ取り出す・分割する方法【無料・スマホ対応】",
    description: "PDFから必要なページだけ抽出・分割する手順を解説。100ページの資料から3ページだけ保存したい場合に。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF分割", "ページ抽出", "スマホ"],
    relatedToolIds: ["pdf-split"],
    isFeatured: true,
  },
  {
    slug: "jpg-to-pdf-guide",
    title: "写真・画像をPDFにまとめる方法【スマホ撮影OK・無料・登録不要】",
    description: "複数枚の写真や画像を1つのPDFにまとめる方法。領収書の整理・スキャン書類の管理に役立ちます。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["JPG→PDF", "画像変換", "複数枚"],
    relatedToolIds: ["jpg-to-pdf"],
    isFeatured: true,
  },
  {
    slug: "pdf-to-jpg-guide",
    title: "PDFを画像（JPG）に変換する方法【スマホ・PC・無料】",
    description: "PDFのページを画像として保存する方法。プレゼン資料をSNSに投稿したい場合にも役立ちます。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF→JPG", "画像変換", "SNS"],
    relatedToolIds: ["pdf-to-jpg"],
  },
  {
    slug: "pdf-rotate-guide",
    title: "PDFが横向きになったのを直す方法【回転・無料・スマホ対応】",
    description: "スキャンして横向きになったPDFを90°・180°回転して修正する手順。全ページ・指定ページ対応。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF回転", "横向き修正", "スキャン"],
    relatedToolIds: ["pdf-rotate"],
  },
  {
    slug: "pdf-password-guide",
    title: "PDFにパスワードをかける方法【無料・ブラウザ完結・登録不要】",
    description: "PDFにAES-256暗号化でパスワード保護を追加する方法。機密書類の安全な共有に。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDFパスワード", "暗号化", "セキュリティ"],
    relatedToolIds: ["pdf-password"],
  },
  {
    slug: "iphone-pdf-guide",
    title: "iPhoneでPDFを編集・加工する方法まとめ【アプリ不要・無料】",
    description: "iPhoneだけでできるPDF操作のすべて。結合・分割・圧縮・回転をSafariから完結させる方法。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["iPhone", "PDF編集", "Safari", "スマホ"],
    relatedToolIds: ["pdf-merge", "pdf-split", "pdf-compress"],
    isPopular: true,
  },
  {
    slug: "pdf-watermark-guide",
    title: "PDFに「社外秘」「DRAFT」などの透かしを入れる方法【無料・登録不要】",
    description: "PDFにテキスト透かしを追加する方法。透明度・色・位置を自由設定。機密書類の管理に。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF透かし", "ウォーターマーク", "社外秘"],
    relatedToolIds: ["pdf-watermark"],
  },
  {
    slug: "pdf-privacy-guide",
    title: "PDFに含まれる個人情報・メタデータを削除する方法【プライバシー保護】",
    description: "PDFに隠れた作成者名・日付・使用ソフト情報などのメタデータを削除する方法。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDFメタデータ", "プライバシー", "個人情報"],
    relatedToolIds: ["pdf-metadata-remover"],
  },
  {
    slug: "pdf-reorder-guide",
    title: "PDFのページ順を並び替える方法【ドラッグ操作・スマホ対応・無料】",
    description: "PDFのページ順序を間違えて作成してしまった場合の修正方法。ドラッグ操作・スマホ上下ボタン対応。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF並び替え", "ページ順", "スマホ"],
    relatedToolIds: ["pdf-reorder"],
  },
  {
    slug: "iphone-pdf-merge",
    title: "iPhoneでPDFを結合する方法【無料・アプリ不要・Safari完結】",
    description: "iPhoneのSafariだけでPDFを無料で結合する3ステップ。アプリのインストールは不要。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["iPhone", "PDF結合", "Safari"],
    relatedToolIds: ["pdf-merge"],
  },
  {
    slug: "pdf-compress-tips",
    title: "PDFを軽くする5つのコツ【メール添付・アップロードに最適化】",
    description: "PDFのファイルサイズを小さくする実践的な方法を解説。画像解像度の調整・不要ページの削除なども。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["PDF圧縮", "ファイルサイズ", "最適化"],
    relatedToolIds: ["pdf-compress"],
  },
  {
    slug: "pdf-edit-smartphone",
    title: "スマホでPDFを編集する方法【ページ削除・回転・並び替えをブラウザで】",
    description: "スマートフォンだけでPDFのページ削除・回転・並び替えをする手順。Android・iPhone両対応。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["スマホ", "PDF編集", "Android", "iPhone"],
    relatedToolIds: ["pdf-delete-pages", "pdf-rotate", "pdf-reorder"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 画像カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const IMAGE_BLOGS: BlogEntry[] = [
  {
    slug: "heic-jpg-guide",
    title: "HEICをJPGに変換する方法【iPhone写真・無料・ブラウザ完結】",
    description: "iPhoneのHEIC写真をWindowsでも開けるJPGに変換する手順。アプリ不要・ブラウザ完結。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["HEIC", "JPG変換", "iPhone", "Windows"],
    relatedToolIds: ["heic-to-jpg"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "image-compress-guide",
    title: "画像を軽くする方法【無料・アプリ不要】JPG・PNGのサイズを小さくする手順",
    description: "JPG・PNG画像のファイルサイズを小さくする方法。SNS投稿・メール添付・サイト表示速度改善に。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["画像圧縮", "JPG", "PNG", "ファイルサイズ"],
    relatedToolIds: ["image-compress"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "id-photo-smartphone",
    title: "スマホで証明写真を作る方法【無料・コンビニ印刷対応・履歴書OK】",
    description: "スマホで撮影した写真から証明写真を無料で作成。コンビニ印刷用L判4面配置にも対応。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["証明写真", "スマホ", "コンビニ印刷", "履歴書"],
    relatedToolIds: ["id-photo"],
    isFeatured: true,
  },
  {
    slug: "video-compress-guide",
    title: "動画の容量を小さくする方法【無料・スマホ対応】MP4・MOVをLINEで送れるサイズに",
    description: "スマホで撮影した動画をLINEで送れるサイズに圧縮する方法。MP4・MOV対応・アプリ不要。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-16",
    category: "image",
    tags: ["動画圧縮", "MP4", "MOV", "LINE", "スマホ"],
    relatedToolIds: ["video-compress"],
    isFeatured: true,
  },
  {
    slug: "heic-what-is",
    title: "HEICとは？JPGと何が違う？iPhoneの写真形式を徹底解説",
    description: "iPhoneで撮影した写真がHEICになる理由とJPGとの違い。Windowsで開けない問題の解決方法も。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["HEIC", "iPhone", "写真形式", "JPG"],
    relatedToolIds: ["heic-to-jpg"],
  },
  {
    slug: "id-photo-convenience",
    title: "コンビニで証明写真を印刷する方法【スマホで撮影→L判→切り取り】",
    description: "セブン・ローソン・ファミマのマルチコピー機で証明写真を印刷する手順と料金。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["証明写真", "コンビニ印刷", "マルチコピー機"],
    relatedToolIds: ["id-photo"],
  },
  {
    slug: "id-photo-size-guide",
    title: "証明写真のサイズ一覧【履歴書・パスポート・マイナンバー・運転免許】",
    description: "用途別の証明写真サイズ（縦・横mm）を一覧表で確認。履歴書・パスポート・マイナンバーなど。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["証明写真", "サイズ", "パスポート", "マイナンバー"],
    relatedToolIds: ["id-photo"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// お金・投資カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const MONEY_BLOGS: BlogEntry[] = [
  {
    slug: "nisa-monthly-simulation",
    title: "新NISA積立シミュレーション｜月3万・5万・10万×10〜30年の全パターン早見表",
    description: "月5万円×30年で約4,160万円。月3万・5万・10万×10・20・30年の全パターンを一覧表で確認。",
    publishedAt: "2026-05-10",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["新NISA", "積立投資", "シミュレーション", "複利"],
    relatedToolIds: ["nisa-calculator"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "salary-takehome-table",
    title: "手取り早見表2026年版｜年収300〜1500万円の月収換算・税金内訳を一覧で確認",
    description: "年収500万→月32.8万、600万→月38.5万。年収300〜1500万円の手取りを一覧表でサッと確認。",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-16",
    category: "money",
    tags: ["手取り", "年収", "税金", "社会保険料"],
    relatedToolIds: ["net-income"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "fire-how-much-needed",
    title: "FIREに必要な資産はいくら？年収・生活費別にシミュレーションしてみた",
    description: "FIRE達成には何億必要？年収300〜800万円・生活費別のシミュレーション結果。4%ルールの限界も。",
    publishedAt: "2026-05-10",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["FIRE", "資産形成", "4%ルール", "シミュレーション"],
    relatedToolIds: ["fire-simulator"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "furusato-nozei-guide",
    title: "ふるさと納税の仕組みと年収別控除上限額【最新版・早見表付き】",
    description: "ふるさと納税の控除の仕組みをわかりやすく解説。年収300〜1500万円の上限額早見表付き。",
    publishedAt: "2026-05-11",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["ふるさと納税", "控除上限", "節税", "確定申告"],
    relatedToolIds: ["furusato-simulator"],
    isFeatured: true,
  },
  {
    slug: "mortgage-simulation-guide",
    title: "住宅ローンの月返済額・総返済額シミュレーション【借入額・金利別早見表】",
    description: "借入3000万・4000万・5000万円×変動・固定金利別の月返済額と総返済額を一覧で確認。",
    publishedAt: "2026-05-11",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["住宅ローン", "返済額", "金利", "シミュレーション"],
    relatedToolIds: ["mortgage-calculator"],
    isFeatured: true,
  },
  {
    slug: "takehome-500",
    title: "年収500万円の手取りは月32.8万円（年393万）｜税金内訳・ボーナス計算",
    description: "年収500万円の手取りは約393万円。所得税・住民税・社会保険料の詳しい内訳と節税方法を解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-17",
    category: "money",
    tags: ["手取り", "年収500万", "税金内訳", "節税"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-600",
    title: "年収600万円の手取りは月38.5万円（年462万）｜独身・既婚別に解説",
    description: "年収600万円の手取りは約462万円。独身・家族持ちのケース別手取り比較。節税方法も解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-17",
    category: "money",
    tags: ["手取り", "年収600万", "家族構成", "節税"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-400",
    title: "年収400万の手取りは月26.5万円（年318万）｜税金内訳・生活費シミュレーション",
    description: "年収400万円の手取りは年間約318万円。生活費シミュレーション・節税方法付き。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-16",
    category: "money",
    tags: ["手取り", "年収400万", "生活費"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-300",
    title: "年収300万円の手取りは月20.3万円（年243万）｜税金内訳・生活レベル解説",
    description: "年収300万円の手取りは年間約243万円。一人暮らし・節税の生活シミュレーション付き。",
    publishedAt: "2026-05-17",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["手取り", "年収300万", "生活レベル"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-700",
    title: "年収700万円の手取りは月44万円（年528万）｜税金内訳・生活レベル解説",
    description: "年収700万円の手取りは年間約528万円。家族構成別の比較とFIRE積立シミュレーション付き。",
    publishedAt: "2026-05-17",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["手取り", "年収700万", "FIRE"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-800",
    title: "年収800万円の手取りは月49.1万円（年589万）｜税金・控除内訳を解説",
    description: "年収800万円の手取りは年間約589万円。所得税65万の内訳と節税・NISA積立戦略。",
    publishedAt: "2026-05-17",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["手取り", "年収800万", "節税", "NISA"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "nisa-ideco-compare",
    title: "新NISAとiDeCoの違いを比較【どっちを優先すべき？徹底解説】",
    description: "新NISAとiDeCoの非課税メリット・引き出し制限・節税効果を比較。優先順位の考え方も解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["新NISA", "iDeCo", "節税", "比較"],
    relatedToolIds: ["nisa-calculator"],
  },
  {
    slug: "fire-4percent-rule",
    title: "FIRE達成後の「4%ルール」とは？【資産を減らさない取り崩し戦略】",
    description: "FIREの根拠となる4%ルールの仕組みと日本での適用。資産取り崩しシミュレーション付き。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["FIRE", "4%ルール", "取り崩し", "資産運用"],
    relatedToolIds: ["fire-simulator"],
  },
  {
    slug: "nisa-fire-strategy",
    title: "新NISAでFIREを目指す戦略【非課税枠1800万円の活用法】",
    description: "新NISAの生涯非課税枠1,800万円をフル活用してFIREを目指す戦略。FIRE後の取り崩し方法も。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["新NISA", "FIRE", "非課税枠", "資産形成"],
    relatedToolIds: ["nisa-calculator", "fire-simulator"],
  },
  {
    slug: "jumin-zei-guide",
    title: "住民税の計算方法【年収別早見表・新卒2年目から天引き・控除の仕組み】",
    description: "年収400万の住民税は約16万円。年収別の住民税額早見表と新卒2年目に手取りが減る理由。",
    publishedAt: "2026-05-15",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["住民税", "税金", "新卒", "年収別"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "shakai-hoken-guide",
    title: "社会保険料の計算方法【標準報酬月額・年収別早見表・2026年版】",
    description: "年収400万の社会保険料は約58万円。標準報酬月額の仕組み・106万・130万円の壁も解説。",
    publishedAt: "2026-05-15",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["社会保険料", "標準報酬月額", "106万の壁", "130万の壁"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "furusato-nozei-howto",
    title: "ふるさと納税のやり方【2026年版・申請手順・ワンストップ特例・確定申告】",
    description: "ふるさと納税の手順をステップごとに解説。ワンストップ特例と確定申告の使い分けも。",
    publishedAt: "2026-05-15",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["ふるさと納税", "ワンストップ特例", "確定申告", "手順"],
    relatedToolIds: ["furusato-simulator"],
  },
  {
    slug: "takehome-900",
    title: "年収900万円の手取りは月54.4万円（年653万）｜税金内訳・節税シミュレーション",
    description: "年収900万円の手取りは年間約653万円・月54.4万円。控除247万円の内訳と節税効果を解説。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["年収900万", "手取り", "税金", "節税", "所得税"],
    relatedToolIds: ["net-income"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "takehome-1000",
    title: "年収1000万円の手取りは月60.2万円（年722万）｜税金・社会保険の全内訳",
    description: "年収1000万円の手取りは年間約722万円・月60.2万円。控除278万円の内訳と節税戦略を解説。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["年収1000万", "手取り", "税金", "節税", "所得税"],
    relatedToolIds: ["net-income"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "nencho-guide",
    title: "年末調整の書き方2026年完全ガイド｜扶養控除・保険料控除の記入例付き",
    description: "2026年の年末調整書類の書き方を記入例付きで解説。扶養・基礎・保険料控除申告書の全3種類を網羅。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["年末調整", "扶養控除", "保険料控除", "書き方", "確定申告"],
    relatedToolIds: ["net-income"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "furusato-limit-by-income",
    title: "年収別ふるさと納税の上限額早見表【300万〜1500万円・独身・共働き対応】",
    description: "年収300万〜1500万円のふるさと納税上限額を一覧表で解説。独身・共働き・扶養あり3パターン対応。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["ふるさと納税", "上限額", "年収別", "早見表", "節税"],
    relatedToolIds: ["furusato-simulator"],
    isPopular: true,
    isFeatured: false,
  },
  {
    slug: "image-resize-guide",
    title: "画像のサイズ（縦横）を変更する方法【無料・スマホ対応・登録不要】",
    description: "画像の縦横ピクセルを自由に変更するリサイズ方法。ブログ・SNS・メール添付に最適なサイズへ変換。圧縮との違いも解説。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["画像リサイズ", "サイズ変更", "スマホ", "無料", "ブラウザ"],
    relatedToolIds: ["image-resize"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "line-photo-size-guide",
    title: "LINEで写真・動画が送れない原因と解決方法【容量オーバー対応】",
    description: "LINEで「ファイルサイズが大きすぎます」と表示されたときの解決手順。画像・動画圧縮で1分対応。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "image",
    tags: ["LINE", "写真", "動画", "容量", "圧縮"],
    relatedToolIds: ["image-compress", "video-compress"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "android-pdf-guide",
    title: "Androidスマホで写真・書類を複数まとめてPDFにする方法【無料】",
    description: "Androidスマホで複数写真をPDF化する手順。アプリ不要・ブラウザ完結。確定申告書類・領収書整理に。",
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["Android", "PDF", "写真", "書類", "スマホ"],
    relatedToolIds: ["jpg-to-pdf", "pdf-merge"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "mercari-fees-guide",
    title: "メルカリの手数料は10%｜売値別・手取り早見表と送料比較",
    description: "メルカリの手数料は一律10%。売値別の手取り早見表、らくらく便・ゆうゆう便の送料比較。",
    publishedAt: "2026-05-11",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["メルカリ", "手数料", "送料", "手取り"],
    relatedToolIds: ["mercari-profit"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// その他カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const OTHER_BLOGS: BlogEntry[] = [
  {
    slug: "qr-create-guide",
    title: "QRコードを無料で作る方法【ブラウザ30秒・登録不要・PNG保存】",
    description: "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG保存対応。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "text",
    tags: ["QRコード", "無料", "URL"],
    relatedToolIds: ["qr-generator"],
  },
  {
    slug: "wifi-qr-guide",
    title: "Wi-FiのQRコードを作る方法【お店・カフェ・自宅のゲスト接続に】",
    description: "SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "text",
    tags: ["Wi-Fi", "QRコード", "ゲスト接続"],
    relatedToolIds: ["wifi-qr"],
  },
  {
    slug: "url-shorten-guide",
    title: "URLを短縮する方法【QRコード同時生成・コピー簡単・無料】",
    description: "長いURLを短くコンパクトに整形。SNS投稿・名刺掲載に便利。QRコードも同時生成。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "text",
    tags: ["URL短縮", "QRコード", "SNS"],
    relatedToolIds: ["short-link"],
  },
  {
    slug: "word-count-guide",
    title: "文字数カウントの使い方【Twitter・履歴書・レポート・LINEに役立つ】",
    description: "リアルタイムで文字数・行数・単語数を計測。Twitter・履歴書の文字数制限対策に。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "text",
    tags: ["文字数カウント", "Twitter", "履歴書"],
    relatedToolIds: ["word-counter"],
  },
  {
    slug: "gpa-calculation-guide",
    title: "GPAとは？平均・計算方法・就活での目安【3.0のレベルと効率的な上げ方】",
    description: "GPAの計算方法と就職活動での目安。3.0・3.5・4.0の評価レベルと効率的な上げ方。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-16",
    category: "student",
    tags: ["GPA", "就活", "大学", "成績"],
    relatedToolIds: ["gpa"],
  },
  {
    slug: "resume-writing-guide",
    title: "履歴書・職務経歴書の書き方完全ガイド【テンプレート・証明写真サイズも】",
    description: "履歴書・職務経歴書の書き方を項目ごとに解説。証明写真サイズや提出方法も。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "student",
    tags: ["履歴書", "職務経歴書", "就活", "証明写真"],
    relatedToolIds: ["resume-builder", "id-photo"],
  },
  {
    slug: "shift-salary-guide",
    title: "アルバイト・パートの月収・時給計算方法【深夜割増・シフト対応】",
    description: "時給・勤務時間・深夜時間から月収を計算する方法。深夜割増の計算方法も解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "calculator",
    tags: ["アルバイト", "時給計算", "月収", "深夜割増"],
    relatedToolIds: ["shift-salary"],
  },
  {
    slug: "gas-cost-guide",
    title: "ガソリン代の計算方法【通勤・ドライブの費用を正確に把握する】",
    description: "走行距離・燃費・ガソリン単価からガソリン代を計算する方法。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "calculator",
    tags: ["ガソリン代", "通勤", "燃費"],
    relatedToolIds: ["gas-calculator"],
  },
  {
    slug: "point-return-guide",
    title: "ポイント還元率の高いキャッシュレス決済はどれ？PayPay・楽天・クレカ比較",
    description: "PayPay・楽天Pay・各種クレジットカードのポイント還元率を比較。年間獲得ポイントの目安も。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "calculator",
    tags: ["ポイント還元", "PayPay", "楽天", "クレカ"],
    relatedToolIds: ["point-simulator"],
  },
  {
    slug: "side-job-tax-guide",
    title: "副業の税金はいくら？確定申告が必要なケースと計算方法",
    description: "副業収入から経費・税金を差し引いた実質手取りの計算方法。確定申告が必要になるラインも解説。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "lifestyle",
    tags: ["副業", "税金", "確定申告", "手取り"],
    relatedToolIds: ["side-job-profit"],
  },
  {
    slug: "investment-beginner-guide",
    title: "20代・30代から始める積立投資の基本【新NISAで資産形成する方法】",
    description: "投資初心者向けの積立投資入門。新NISAの活用方法と具体的な始め方。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["積立投資", "新NISA", "投資初心者", "資産形成"],
    relatedToolIds: ["nisa-calculator"],
  },
  {
    slug: "fire-monthly-5man",
    title: "月5万円の積立でFIREは可能？【シミュレーションと必要年数の目安】",
    description: "月5万円を年利5%で積み立てた場合のFIRE達成年数。生活費別の必要資産額シミュレーション。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["FIRE", "月5万", "積立投資", "シミュレーション"],
    relatedToolIds: ["fire-simulator"],
  },
  {
    slug: "takehome-2026",
    title: "手取り早見表2026年版【年収200〜1000万円・月収換算付き】",
    description: "2026年最新の手取り早見表。年収200〜1000万円の手取り・月収・税負担を一覧で早引き。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["手取り", "2026年", "早見表"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "takehome-20s",
    title: "20代の平均手取りはいくら？【年齢・職種・都市別の実態】",
    description: "20代前半・後半の平均手取り額と生活費の実態。新卒〜20代後半の年収推移も。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["20代", "平均手取り", "新卒", "年収"],
    relatedToolIds: ["net-income"],
  },
  {
    slug: "bonus-takehome",
    title: "ボーナスの手取りはいくら？【支給額別の控除早見表・計算方法】",
    description: "ボーナス支給額から実際の手取りを計算する方法。100万〜50万円の支給額別控除早見表。",
    publishedAt: "2026-05-12",
    updatedAt: "2026-06-02",
    category: "money",
    tags: ["ボーナス", "手取り", "税金", "社会保険料"],
    relatedToolIds: ["net-income"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI文章ツールカテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const AI_BLOGS: BlogEntry[] = [
  {
    slug: "chatgpt-format-guide",
    title: "ChatGPTのコピペが崩れる問題を解決｜noteやブログへの正しい貼り付け方",
    description: "ChatGPTの文章をコピーするとnoteやブログで改行が崩れる問題の原因と、ワンクリックで整形する方法を解説。",
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-02",
    category: "ai",
    tags: ["ChatGPT", "改行", "note", "ブログ", "整形"],
    relatedToolIds: ["chatgpt-format", "note-format"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "ai-text-natural-guide",
    title: "AI文章が「バレる」理由と自然化する方法｜ChatGPT・Claude対応",
    description: "AIが書いた文章の特徴パターンと、読者にバレずに自然な日本語に変換するテクニックを解説。",
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-02",
    category: "ai",
    tags: ["AI文章", "自然化", "ChatGPT", "文章術"],
    relatedToolIds: ["ai-humanize"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "x-post-format-guide",
    title: "X（旧Twitter）投稿の改行テクニック｜バズる投稿の書き方",
    description: "X投稿で改行が反映される条件と、スマホで見やすい改行の入れ方、文字数の数え方を解説。",
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-02",
    category: "ai",
    tags: ["X", "Twitter", "改行", "投稿", "SNS"],
    relatedToolIds: ["x-post-preview"],
    isFeatured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 冠婚葬祭・文書カテゴリ
// ─────────────────────────────────────────────────────────────────────────────
const CEREMONY_BLOGS: BlogEntry[] = [
  {
    slug: "noshi-paper-guide",
    title: "のし紙の書き方・選び方完全ガイド｜無料で印刷する方法",
    description: "のし紙の表書き・水引の種類・名前の書き方を用途別に解説。御祝・内祝・御歳暮など場面別の選び方と無料印刷方法。",
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-02",
    category: "ceremony",
    tags: ["のし紙", "御祝", "内祝", "水引", "冠婚葬祭"],
    relatedToolIds: ["noshi-maker"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "koden-writing-guide",
    title: "香典袋の書き方｜表書き・名前・金額の正しいマナー",
    description: "香典袋の表書きの選び方、名前・金額の書き方、宗派別のマナーをわかりやすく解説。御霊前・御仏前の使い分けも。",
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-02",
    category: "ceremony",
    tags: ["香典袋", "御霊前", "御仏前", "冠婚葬祭", "マナー"],
    relatedToolIds: ["koden-maker"],
    isPopular: true,
    isFeatured: true,
  },
  {
    slug: "estimate-guide",
    title: "見積書を無料で作成・PDF出力する方法【テンプレート不要・スマホ対応】",
    description: "見積書をブラウザだけで無料作成してPDF出力する手順を解説。Excelテンプレート不要・登録不要。フリーランス・個人事業主・副業の請求前に使える。",
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    category: "business",
    tags: ["見積書", "作成", "フリーランス", "個人事業主", "PDF"],
    relatedToolIds: ["estimate-generator"],
    isPopular: false,
    isFeatured: true,
  },
  {
    slug: "hanko-create-guide",
    title: "電子はんこ・デジタル印鑑を無料で作る方法【PNG透過・Word貼り付け対応】",
    description: "電子はんこ（デジタル印鑑）をブラウザで無料作成してPNG画像をダウンロードする手順。Word・Excel・PDF書類に貼り付け可能。登録不要・アプリ不要。",
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    category: "business",
    tags: ["電子はんこ", "デジタル印鑑", "Word", "透過PNG", "書類"],
    relatedToolIds: ["hanko-generator"],
    isPopular: false,
    isFeatured: true,
  },
  {
    slug: "tax-docs-pdf-guide",
    title: "確定申告の書類をスマホでPDFにまとめる方法【e-Tax・郵送提出対応】",
    description: "確定申告の領収書・医療費明細・源泉徴収票などをスマホ撮影してPDFにまとめる手順。e-Tax添付・郵送提出に対応。アプリ不要・無料・Android/iPhone対応。",
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    category: "pdf",
    tags: ["確定申告", "PDF", "領収書", "e-Tax", "スマホ"],
    relatedToolIds: ["jpg-to-pdf", "pdf-merge"],
    isPopular: false,
    isFeatured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 統合 & エクスポート
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_BLOGS: BlogEntry[] = [
  ...PDF_BLOGS,
  ...IMAGE_BLOGS,
  ...MONEY_BLOGS,
  ...OTHER_BLOGS,
  ...AI_BLOGS,
  ...CEREMONY_BLOGS,
];

/** ビジネス・文書カテゴリのエントリを返す（CEREMONY_BLOGSに統合済み） */
export function getBusinessBlogs(): BlogEntry[] {
  return ALL_BLOGS.filter((b) => b.category === "business");
}

/** カテゴリスラッグで記事を絞り込む */
export function getBlogsByCategory(category: BlogCategory): BlogEntry[] {
  return ALL_BLOGS.filter((b) => b.category === category);
}

/** カテゴリTOPに表示するフィーチャード記事（isFeatured=true）を返す */
export function getFeaturedBlogsByCategory(category: BlogCategory): BlogEntry[] {
  return ALL_BLOGS.filter((b) => b.category === category && b.isFeatured);
}

/** スラッグで1件取得 */
export function getBlogEntry(slug: string): BlogEntry | undefined {
  return ALL_BLOGS.find((b) => b.slug === slug);
}

/** ツールIDに関連する記事を返す */
export function getBlogsByToolId(toolId: string): BlogEntry[] {
  return ALL_BLOGS.filter((b) => b.relatedToolIds.includes(toolId));
}

/** 人気記事を返す */
export function getPopularBlogs(): BlogEntry[] {
  return ALL_BLOGS.filter((b) => b.isPopular);
}
