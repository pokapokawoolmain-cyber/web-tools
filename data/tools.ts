export type ToolCategory =
  | "お金・投資"
  | "計算ツール"
  | "画像・PDF"
  | "生活・副業"
  | "テキスト・Web"
  | "学生向け"
  | "仕事・副業"
  | "ビジネス・契約書"
  | "AI文章ツール"
  | "冠婚葬祭・文書"
  | "カラーツール"
  | "建設・リフォーム"
  | "飲食店";

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
  /** 直近で新設・更新した日（YYYY-MM-DD）。「最近の更新」の並び替えに使う */
  updatedAt?: string;
};

export const TOOLS: ToolItem[] = [
  // お金・投資
  { id: "fire-simulator", title: "FIREシミュレーター", description: "資産・生活費・運用利回りを入力するだけ。FIRE達成までの年数と必要資産額を即計算。", href: "/tools/fire-simulator", emoji: "🔥", category: "お金・投資", isPopular: true },
  { id: "nisa-calculator", title: "新NISA積立計算", description: "毎月の積立額と運用期間を入力。複利効果で将来いくらになるかを可視化します。", href: "/tools/nisa-calculator", emoji: "📈", category: "お金・投資", isNew: true },
  { id: "mortgage-calculator", title: "住宅ローンシミュレーター", description: "借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算。", href: "/tools/mortgage-calculator", emoji: "🏠", category: "お金・投資", isPopular: true },
  { id: "net-income", title: "手取り計算", description: "年収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。", href: "/tools/net-income", emoji: "💴", category: "お金・投資", isNew: true },
  { id: "takehome-reverse", title: "手取り逆算シミュレーター", description: "欲しい月の手取り額から必要な額面年収を逆算。転職・昇給交渉の希望年収決めに。", href: "/tools/takehome-reverse", emoji: "🔄", category: "お金・投資", isNew: true },
  { id: "bonus-takehome", title: "ボーナス手取り計算", description: "賞与額と前月の給与を入力するだけでボーナスの手取り額を自動計算。社会保険料・源泉所得税の内訳も確認。", href: "/tools/bonus-takehome", emoji: "💰", category: "お金・投資", isNew: true },
  { id: "nenshu-kabe", title: "年収の壁シミュレーター", description: "パート・アルバイトの年収から超える壁・社会保険加入の要否を判定。106万円撤廃など2026年制度対応。", href: "/tools/nenshu-kabe", emoji: "🚧", category: "お金・投資", isNew: true },
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
  { id: "word-to-pdf", title: "Word→PDF変換", seoTitle: "WordをPDFに変換｜.docxを無料でPDF化【登録不要・ブラウザ完結】", description: "WordファイルをPDFに変換。.docxをアップロードするだけで即変換。用紙サイズ・フォントサイズを選んでブラウザから直接保存。ファイルはサーバーに送信されません。", href: "/tools/word-to-pdf", emoji: "📄", category: "画像・PDF", isNew: true },
  { id: "excel-to-pdf", title: "Excel→PDF変換", seoTitle: "ExcelをPDFに変換｜.xlsx/.csvを無料でPDF化【登録不要・ブラウザ完結】", description: "ExcelファイルをPDFに変換。.xlsx・.xls・.csvをアップロードするだけで即変換。シート選択・用紙向き・フォントサイズを選んでブラウザから保存。ファイルはサーバーに送信されません。", href: "/tools/excel-to-pdf", emoji: "📊", category: "画像・PDF", isNew: true },
  { id: "favicon-generator", title: "ファビコン作成ツール", seoTitle: "ファビコン作成ツール｜favicon.icoを無料生成【ブラウザ完結】", description: "テキスト・絵文字・画像からfavicon.icoを無料作成。16〜64pxのマルチサイズICOとPNG 256pxをブラウザ完結でダウンロード。登録不要。", href: "/tools/favicon-generator", emoji: "🌐", category: "画像・PDF", isNew: true },
  // 生活・副業
  { id: "speed-test", title: "インターネット速度テスト", seoTitle: "スピードテスト｜回線速度・Pingを測定し20段階で実用診断【無料】", description: "ダウンロード・アップロード速度をブラウザで実測。動画・ゲーム・4K/8Kなど何が快適かを20段階で診断。10Gbps級対応。", href: "/tools/speed-test", emoji: "🚀", category: "生活・副業", isNew: true, isPopular: true },
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
  { id: "hanko-generator", title: "電子印鑑メーカー", seoTitle: "電子印鑑作成ツール｜PNG・透過対応【無料】", description: "電子印鑑（デジタルはんこ）を無料で作成。円形・角印・縦書き対応。透過PNG・SVG保存でPDFや書類にすぐ使える。", href: "/tools/hanko-generator", emoji: "🔴", category: "ビジネス・契約書", isNew: true, isPopular: true },
  { id: "pdf-signature", title: "PDF電子署名ツール", seoTitle: "PDF電子署名ツール｜契約書にサイン可能【無料】", description: "PDFに手書き署名・テキスト・印鑑を追加してPDFで保存。契約書・NDA・見積書への署名に。ブラウザ完結・登録不要。", href: "/tools/pdf-signature", emoji: "✍️", category: "ビジネス・契約書", isNew: true, isPopular: true },
  { id: "receipt-generator", title: "領収書作成ツール", seoTitle: "領収書作成ツール｜PDF保存・印刷対応【登録不要】", description: "領収書を無料で作成。インボイス登録番号・消費税表示・収入印紙目安対応。PDF保存・印刷。ブラウザ完結。", href: "/tools/receipt-generator", emoji: "🧾", category: "ビジネス・契約書", isNew: true },
  // AI文章ツール
  { id: "ai-email", title: "AIメール作成", seoTitle: "AIメール作成｜ビジネスメールを用途・相手別に自動作成【無料】", description: "依頼・お礼・日程調整など、ビジネスメールの文面を用途と相手を選ぶだけで自動作成。件名から署名までまとめて下書き。", href: "/tools/ai-email", emoji: "✉️", category: "AI文章ツール", isNew: true, isPopular: true },
  { id: "ai-keigo", title: "AI敬語変換", seoTitle: "AI敬語変換｜くだけた文章をビジネス敬語に自動変換【無料】", description: "「了解です」などのカジュアルな表現を、ビジネスで使える丁寧な敬語に自動変換。社外・社内のトーンも選べます。", href: "/tools/ai-keigo", emoji: "🙇", category: "AI文章ツール", isNew: true, isPopular: true },
  { id: "ai-apology", title: "AI謝罪文作成", seoTitle: "AI謝罪文作成｜お詫びメール・謝罪文を自動作成【無料】", description: "納期遅延・ミス・クレーム対応など、状況を入力するだけで謝罪文を自動作成。原因と再発防止まで含んだ文面を下書き。", href: "/tools/ai-apology", emoji: "🙏", category: "AI文章ツール", isNew: true },
  { id: "ai-decline", title: "AI断り文作成", seoTitle: "AI断り文作成｜角が立たない丁寧な断り方を自動作成【無料】", description: "誘い・依頼・提案を、相手の気分を害さずに丁寧に断る文面を自動作成。感謝＋理由＋代替案の型で下書き。", href: "/tools/ai-decline", emoji: "🙅", category: "AI文章ツール", isNew: true },
  { id: "ai-inquiry", title: "AI問い合わせ文作成", seoTitle: "AI問い合わせ文作成｜企業・店舗・役所への問い合わせメールを自動作成【無料】", description: "商品・在庫・予約・不具合・請求など、企業や店舗への問い合わせメールを自動作成。用件を入力するだけで丁寧な文面を下書き。", href: "/tools/ai-inquiry", emoji: "📮", category: "AI文章ツール", isNew: true },
  { id: "prompt-builder", title: "ChatGPTプロンプト作成補助", seoTitle: "ChatGPTプロンプト作成補助｜役割・出力形式を整えたプロンプトを自動生成【無料】", description: "やりたいことを入力するだけで、役割・出力形式・条件を整えた精度の高いプロンプトを自動生成。ChatGPT・Claude・Geminiに使えます。", href: "/tools/prompt-builder", emoji: "⌨️", category: "AI文章ツール", isNew: true, isPopular: true },
  { id: "chatgpt-format", title: "ChatGPT改行整形", seoTitle: "ChatGPT改行整形ツール｜AI文章をnote・ブログ・X向けに自動整形", description: "ChatGPTやAIの出力文章を一瞬で見やすく整形。note・ブログ・X・LINE・Discord向けに自動調整。コピペで崩れる問題を解決。", href: "/tools/chatgpt-format", emoji: "✨", category: "AI文章ツール", isNew: true, isPopular: true },
  { id: "ai-humanize", title: "AI文章自然化", seoTitle: "AI文章自然化ツール｜AIっぽい文章を人間らしく自動変換", description: "「AIっぽい」と感じさせる文章を自然な日本語に変換。語尾の繰り返し・固い言い回し・不自然な構造を自動修正。AI感スコア表示付き。", href: "/tools/ai-humanize", emoji: "🤖", category: "AI文章ツール", isNew: true, isPopular: true },
  { id: "x-post-preview", title: "X投稿プレビュー", seoTitle: "X投稿プレビュー・改行シミュレーター｜実際の表示を確認", description: "X（旧Twitter）投稿の実際の表示をプレビュー。改行・文字数・ハッシュタグの見え方をポスト前に確認。スマホ表示も再現。", href: "/tools/x-post-preview", emoji: "𝕏", category: "AI文章ツール", isNew: true },
  { id: "note-format", title: "note記事整形", seoTitle: "note記事整形ツール｜AI文章をnote向けに自動整形", description: "ChatGPTやAIの出力をnote投稿に最適化。見出し自動検出・適切な空白調整・読みやすさ向上。note風プレビュー付き。", href: "/tools/note-format", emoji: "📝", category: "AI文章ツール", isNew: true },
  // 冠婚葬祭・文書
  { id: "noshi-maker", title: "のし紙作成ツール", seoTitle: "のし紙作成ツール｜無料・印刷対応【登録不要】", description: "御祝・内祝・御歳暮・御中元など用途別のし紙を無料で作成。水引・名入れ対応。A4印刷・コンビニ印刷対応。", href: "/tools/noshi-maker", emoji: "🎀", category: "冠婚葬祭・文書", isNew: true, isPopular: true },
  { id: "koden-maker", title: "香典袋表書きメーカー", seoTitle: "香典袋表書きメーカー｜宗派別・無料印刷対応", description: "御霊前・御仏前・御香典など宗派別に表書きを作成。毛筆風フォント・PDF保存・スマホ完結。", href: "/tools/koden-maker", emoji: "🕯️", category: "冠婚葬祭・文書", isNew: true, isPopular: true },
  { id: "shugi-maker", title: "祝儀袋表書きメーカー", seoTitle: "祝儀袋表書きメーカー｜寿・御結婚御祝・連名対応【無料】", description: "寿・御結婚御祝・御出産御祝など慶事の表書きを作成。毛筆風フォント・連名対応・印刷OK。ご祝儀相場表付き。", href: "/tools/shugi-maker", emoji: "🎊", category: "冠婚葬祭・文書", isNew: true },
  { id: "houyou-calculator", title: "四十九日・法要日程 計算", seoTitle: "四十九日・法要日程 自動計算｜命日から忌日・年忌を算出【無料】", description: "命日を入力するだけで四十九日・一周忌・三回忌などの法要日程を自動計算。日付と曜日を一覧表示。", href: "/tools/houyou-calculator", emoji: "🪷", category: "冠婚葬祭・文書", isNew: true },
  { id: "resignation-letter", title: "退職届ジェネレーター", seoTitle: "退職届ジェネレーター｜パワハラ対応・PDF保存【無料】", description: "退職届を無料で作成。一身上の都合・パワハラ・体調不良・契約満了など理由別テンプレ。A4印刷・PDF対応。", href: "/tools/resignation-letter", emoji: "📄", category: "冠婚葬祭・文書", isNew: true },
  { id: "fax-cover", title: "送付状作成ツール", seoTitle: "送付状作成ツール｜FAX送付状を無料で作成【登録不要】", description: "FAX送付状・書類送付状を無料で自動作成。日付・宛先・件名・枚数を入力するだけでPDF保存・印刷できます。", href: "/tools/fax-cover", emoji: "📠", category: "冠婚葬祭・文書", isNew: true },
  // カラーツール
  { id: "hex-rgb-converter", title: "カラーコード変換", seoTitle: "HEX・RGB・HSL変換ツール｜カラーコード変換【無料】", description: "HEX・RGB・HSLカラーコードを即変換。カラーピッカー・CSS変数コピー・日本の伝統色辞書付き。デザイン・コーディング作業に。", href: "/tools/hex-rgb-converter", emoji: "🎨", category: "カラーツール", isNew: true, isPopular: true },
  { id: "color-palette", title: "カラーパレット生成", seoTitle: "カラーパレット生成ツール｜補色・類似色・トライアド【無料】", description: "ベースカラーから補色・類似色・トライアドなど5種類の配色パターンを自動生成。CSS変数でまとめてコピー可能。", href: "/tools/color-palette", emoji: "🖌️", category: "カラーツール", isNew: true },
  { id: "gradient-generator", title: "グラデーション生成", seoTitle: "CSSグラデーション生成ツール｜linear・radial【無料】", description: "linear・radial・conicグラデーションをビジュアル設定してCSS出力。プリセット20種以上・コピーボタン付き。", href: "/tools/gradient-generator", emoji: "🌈", category: "カラーツール", isNew: true },
  { id: "contrast-checker", title: "コントラストチェッカー", seoTitle: "WCAGコントラスト比チェッカー｜AA/AAA判定【無料】", description: "前景色・背景色のコントラスト比をリアルタイム計算。WCAG 2.1 AA/AAAの合否判定付き。Webアクセシビリティ対応に。", href: "/tools/contrast-checker", emoji: "👁️", category: "カラーツール", isNew: true },
  // 建設・リフォーム
  { id: "construction-estimate", title: "工事見積書作成", seoTitle: "工事見積書作成ツール｜建設・リフォーム対応【無料】", description: "工事種別・材料費・労務費・諸経費を入力して工事見積書をPDF出力。インボイス対応。登録不要・ブラウザ完結。", href: "/tools/construction-estimate", emoji: "📋", category: "建設・リフォーム", isNew: true },
  { id: "gross-profit-calculator", title: "原価率・粗利率計算", seoTitle: "原価率・粗利率計算ツール｜建設業・リフォーム業向け【無料】", description: "売上・原価を入力するだけで原価率・粗利率・粗利額を即計算。目標粗利率から逆算した見積金額も算出。", href: "/tools/gross-profit-calculator", emoji: "📊", category: "建設・リフォーム", isNew: true },
  { id: "exterior-paint-calculator", title: "外壁塗装面積計算", seoTitle: "外壁塗装面積計算ツール｜坪数・延床面積対応【無料】", description: "建物の形状・坪数・階数を入力して外壁塗装面積を自動計算。塗料使用量・工事費目安も算出。", href: "/tools/exterior-paint-calculator", emoji: "🏠", category: "建設・リフォーム", isNew: true },
  { id: "neighbor-greeting", title: "近隣挨拶文メーカー", seoTitle: "工事近隣挨拶文メーカー｜建設・リフォーム向け【無料】", description: "工事名・期間・会社名を入力して近隣への挨拶文を自動生成。騒音・振動・駐車など状況別テンプレート対応。", href: "/tools/neighbor-greeting", emoji: "📝", category: "建設・リフォーム", isNew: true },
  { id: "construction-photo-pdf", title: "工事写真帳作成", seoTitle: "工事写真帳作成ツール｜施工前・中・後をA4 PDFに整理【無料】", description: "施工前・施工中・施工後の工事写真に工程区分・コメントを付けてA4 PDF形式の写真帳を作成。外壁塗装・リフォーム完了報告に。", href: "/tools/construction-photo-pdf", emoji: "📸", category: "建設・リフォーム", isNew: true },
  { id: "construction-report", title: "工事完了報告書作成", seoTitle: "工事完了報告書作成ツール｜建設・リフォーム向け【無料】", description: "工事名・施主情報・施工内容・使用材料・工事保証を入力して完了報告書をPDF出力。建設業許可番号対応。", href: "/tools/construction-report", emoji: "📋", category: "建設・リフォーム", isNew: true },
  { id: "construction-contract", title: "工事請負契約書作成", seoTitle: "工事請負契約書作成ツール｜建設・リフォーム向け【無料】", description: "発注者・請負者情報、工事金額・支払条件・契約不適合責任を入力して工事請負契約書をPDF出力。着手金計算対応。", href: "/tools/construction-contract", emoji: "📑", category: "建設・リフォーム", isNew: true },

  // 飲食店
  { id: "food-cost-calculator", title: "原価率計算ツール", seoTitle: "原価率計算ツール｜飲食店・カフェ向け食材原価・粗利計算【無料】", description: "食材費・販売価格を入力して原価率・粗利率・粗利額を即計算。歩留まり・ロス率・複数食材に対応。目標原価率との差も表示。", href: "/tools/food-cost-calculator", emoji: "🍽️", category: "飲食店", isNew: true },
  { id: "menu-price-calculator", title: "メニュー価格シミュレーター", seoTitle: "メニュー価格シミュレーター｜原価から販売価格を逆算【無料】", description: "食材費と目標原価率から適正販売価格を逆算。税込・税抜・端数調整に対応。ランチ/ディナー/テイクアウト別シミュレーション。", href: "/tools/menu-price-calculator", emoji: "💴", category: "飲食店", isNew: true },
  { id: "restaurant-menu-maker", title: "メニュー表作成ツール", seoTitle: "メニュー表作成ツール｜飲食店・カフェ向けA4印刷対応【無料】", description: "カテゴリ・メニュー名・価格・説明・アレルギー情報を入力してA4メニュー表をPDF保存・印刷。カフェ風・居酒屋風テーマ対応。", href: "/tools/restaurant-menu-maker", emoji: "📋", category: "飲食店", isNew: true },
  { id: "review-reply-generator", title: "Google口コミ返信文メーカー", seoTitle: "Google口コミ返信文メーカー｜飲食店向け無料自動生成", description: "高評価・低評価・クレームなど状況別に、そのままコピーできる自然な口コミ返信文を生成。丁寧・カジュアル・店主らしい文体を選択可。", href: "/tools/review-reply-generator", emoji: "⭐", category: "飲食店", isNew: true },
  { id: "restaurant-pop-generator", title: "POP・店内案内文メーカー", seoTitle: "POP・店内案内文メーカー｜飲食店向け無料自動生成", description: "本日のおすすめ・期間限定・臨時休業・予約案内など、店内掲示やSNSにそのまま使える案内文を自動生成。コピー・PDF保存対応。", href: "/tools/restaurant-pop-generator", emoji: "📢", category: "飲食店", isNew: true },
];

export const CATEGORIES: ToolCategory[] = [
  "お金・投資", "計算ツール", "画像・PDF", "生活・副業", "テキスト・Web", "学生向け", "仕事・副業", "ビジネス・契約書", "AI文章ツール", "冠婚葬祭・文書", "カラーツール", "建設・リフォーム", "飲食店"
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

// 直近で新設・更新したツールIDと更新日（YYYY-MM-DD）。
// リリースノートと連動。「最近の更新」の表示に使う。
export const TOOL_UPDATED_AT: Record<string, string> = {
  "ai-email": "2026-07-06",
  "ai-keigo": "2026-07-06",
  "prompt-builder": "2026-07-06",
  "speed-test": "2026-07-05",
  "bonus-takehome": "2026-07-05",
  "nenshu-kabe": "2026-07-05",
  "shugi-maker": "2026-07-05",
  "houyou-calculator": "2026-07-05",
  "koden-maker": "2026-07-05",
  "neighbor-greeting": "2026-07-05",
  "takehome-reverse": "2026-07-03",
  "image-resize": "2026-07-03",
  "pdf-to-jpg": "2026-07-01",
  "exterior-paint-calculator": "2026-07-01",
};

/** updatedAt が新しい順にツールを返す（最大 limit 件） */
export function getRecentlyUpdatedTools(limit = 6): (ToolItem & { updatedAt: string })[] {
  return Object.entries(TOOL_UPDATED_AT)
    .map(([id, updatedAt]) => {
      const tool = TOOLS.find(t => t.id === id);
      return tool ? { ...tool, updatedAt } : null;
    })
    .filter((t): t is ToolItem & { updatedAt: string } => t !== null)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
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
  "AI文章ツール": "ai",
  "冠婚葬祭・文書": "ceremony",
  "カラーツール": "color",
  "建設・リフォーム": "construction",
  "飲食店": "restaurant",
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
