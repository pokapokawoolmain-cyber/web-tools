// ========================================
// リリースノート（更新履歴）の単一データソース
// /release-notes ページとトップページ「最近の更新」で共用する。
// 実際の開発履歴に基づく。tool を指定するとツールページへリンクする。
// ========================================

export type ReleaseType = "NEW" | "UPDATE" | "FIX";

export type ReleaseNote = {
  /** YYYY-MM-DD */
  date: string;
  type: ReleaseType;
  /** 対象ツール名（任意・複数可） */
  target?: string;
  /** 対象ツール/ページへのリンク（任意） */
  href?: string;
  /** 見出し */
  title: string;
  /** 変更内容の説明 */
  body: string;
};

// 新しい順に並べる
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    date: "2026-08-19",
    type: "NEW",
    target: "画像一括変換",
    href: "/tools/image-converter",
    title: "画像一括変換を公開（看板ツール）",
    body: "JPG・PNG・WebP・AVIFをブラウザ内でまとめて変換できる大型ツールを公開しました。20枚以上の一括変換に対応し、同時処理数を抑えたキュー方式でスマホでも固まりません。用途別プリセット、変換前後のサイズ比較、ZIP一括ダウンロードに対応。画像はサーバーに送信されず、すべて端末内で処理されます。",
  },
  {
    date: "2026-08-15",
    type: "NEW",
    target: "PDF→Excel・PDF→Word変換",
    href: "/tools/pdf-to-excel",
    title: "PDFをExcel・Wordに変換するツールを追加",
    body: "PDFの表を読み取ってExcel（.xlsx）に書き出す変換と、PDFの文章を読み取ってWordで編集できる文書（.doc）に変換するツールを追加しました。いずれも処理はすべてブラウザ内で完結し、ファイルはサーバーに送信されません。文字ベースのPDFが対象です。",
  },
  {
    date: "2026-08-14",
    type: "NEW",
    target: "割り勘・BMI・パーセント計算機",
    href: "/tools/warikan-calculator",
    title: "定番の計算ツールを3つ追加",
    body: "飲み会の割り勘計算機（端数の丸め・傾斜配分対応）、身長体重から肥満度を判定するBMI計算、割引や増減率を求めるパーセント計算機を追加しました。使い方の解説や早見表、間違えやすいポイントもあわせて掲載しています。すべてブラウザ内で完結します。",
  },
  {
    date: "2026-08-14",
    type: "NEW",
    target: "Webカメラ・スピーカー・ドット抜け・解像度・リフレッシュレート",
    href: "/tools/webcam-test",
    title: "デバイス診断ツールを5種追加",
    body: "Webカメラテスト、スピーカーテスト（左右L/R）、ドット抜けチェッカー、画面解像度チェッカー、リフレッシュレート測定を追加しました。キーボード・マウス・マイク・回線速度とあわせて、パソコン・スマホの動作確認をブラウザだけで一通り行えます。カメラや音声は録画・保存・送信されません。",
  },
  {
    date: "2026-08-14",
    type: "NEW",
    target: "キーボード・マウス・マイクテスト",
    href: "/tools/keyboard-test",
    title: "デバイス診断ツールを3種追加",
    body: "キーボード・マウス・マイクがブラウザだけで正常に動作するかを確認できる診断ツールを追加しました。キーボードは押したキーが光って反応しないキーを、マウスは各ボタンの反応を、マイクは音量メーターと波形で入力を確認できます。すべてブラウザ内で完結し、入力内容や音声は外部に送信されません。",
  },
  {
    date: "2026-08-12",
    type: "NEW",
    target: "計算ツール",
    href: "/tools/age-calculator",
    title: "定番の計算ツールを4つ追加",
    body: "年齢計算（満年齢・数え年・干支）、日数・日付計算（2つの日付の差／○日後）、消費税計算（税込⇔税抜・10%/8%）、西暦・和暦変換（令和・平成・昭和⇔西暦）を追加しました。いずれもブラウザ内で完結し、入力したデータは外部に送信されません。",
  },
  {
    date: "2026-08-12",
    type: "NEW",
    target: "住民税の目安計算",
    href: "/tools/resident-tax",
    title: "住民税の目安計算ツールを追加",
    body: "年収と扶養人数を入れるだけで、1年間に納める住民税のおおよその目安を計算できるツールを追加しました。所得割・均等割の内訳や月あたりの金額、年収別の早見表に加え、住民税が6月から引かれる理由もあわせて解説しています。",
  },
  {
    date: "2026-08-12",
    type: "NEW",
    target: "アスペクト比計算機",
    href: "/tools/aspect-ratio",
    title: "アスペクト比計算機を追加",
    body: "16:9・4:3などの比率から幅・高さを自動計算し、逆に幅と高さから最も簡単な整数比も算出できるツールを追加しました。FHD・4K・OGP・縦動画などの解像度プリセットに対応し、動画・SNS・スライド・Web制作のサイズ決めに使えます。",
  },
  {
    date: "2026-07-07",
    type: "UPDATE",
    title: "全95ツールのSEOを総点検",
    body: "各ツールのページタイトルと説明文を検索キーワードに合わせて個別に見直し、すべてのツールに「よくある質問」を追加しました。カテゴリのアイコンもツールと同じガラス風デザインに統一しています。",
    href: "/tools",
  },
  {
    date: "2026-07-06",
    type: "NEW",
    target: "開発者ツール",
    href: "/dev",
    title: "開発者ツールカテゴリを新設（6ツール）",
    body: "JSON整形・圧縮、Base64・URLのエンコード／デコード、UUID生成、SHA系ハッシュ生成、Unixタイムスタンプ変換を追加しました。すべてブラウザ内で処理され、入力したデータは外部に送信されません。",
  },
  {
    date: "2026-07-06",
    type: "NEW",
    target: "配色・デザインツール",
    href: "/tools/brand-color-text",
    title: "カラーツールを4つ追加",
    body: "背景色に合う文字色を提案するツール、配色全体のコントラストを一括判定する配色アクセシビリティチェッカー、色覚シミュレーター、SNS・Webのブランドカラー一覧を追加しました。WCAG基準の判定やコピー機能に対応しています。",
  },
  {
    date: "2026-07-06",
    type: "NEW",
    target: "AIメール作成ほか",
    href: "/tools/ai-email",
    title: "AI文章ツールを6つ追加",
    body: "ビジネスメール・敬語変換・謝罪文・断り文・問い合わせ文の作成と、ChatGPT用のプロンプト作成補助を追加しました。用途や相手を選んで入力するだけで、そのまま使える下書きを作成できます。",
  },
  {
    date: "2026-07-05",
    type: "NEW",
    target: "インターネット速度テスト",
    href: "/tools/speed-test",
    title: "回線速度テストを追加しました",
    body: "ダウンロード・アップロード速度に加えてPingやジッターも測定し、その速度で動画視聴やオンラインゲーム、4K/8Kが快適かどうかを20段階で診断します。車のメーター風の表示で、10Gbps級の高速回線にも対応しています。",
  },
  {
    date: "2026-07-05",
    type: "UPDATE",
    title: "全ツールに専用アイコンとファビコンを設定",
    body: "ツールごとにカテゴリ色のアイコンを用意し、ブラウザのタブに表示されるファビコンもツール別に切り替わるようにしました。一覧やタブでツールを見分けやすくなっています。",
  },
  {
    date: "2026-07-05",
    type: "NEW",
    target: "ボーナス手取り計算",
    href: "/tools/bonus-takehome",
    title: "ボーナスの手取り計算ツールを追加",
    body: "賞与額と前月の給与を入力するだけで、社会保険料と源泉所得税を差し引いたボーナスの手取り額を計算します。国税庁の算出率表に基づいて計算しています。",
  },
  {
    date: "2026-07-05",
    type: "NEW",
    target: "年収の壁シミュレーター",
    href: "/tools/nenshu-kabe",
    title: "年収の壁シミュレーターを追加",
    body: "パート・アルバイトの年収から、106万円・130万円・178万円などの壁を超えるかどうかと、社会保険への加入要否を判定します。2026年の制度改正（106万円の壁の撤廃など）に対応しています。",
  },
  {
    date: "2026-07-05",
    type: "NEW",
    target: "祝儀袋・四十九日ほか",
    href: "/tools/shugi-maker",
    title: "冠婚葬祭ツールを2つ追加",
    body: "祝儀袋の表書きメーカーと、命日から法要の日程を計算する四十九日計算ツールを追加しました。香典袋メーカーには金額相場表とお布施の表書きも加えています。",
  },
  {
    date: "2026-07-05",
    type: "UPDATE",
    target: "工事近隣挨拶文メーカー",
    href: "/tools/neighbor-greeting",
    title: "工事の挨拶文にWord出力と工事種別を追加",
    body: "作成した挨拶文をWord形式でダウンロードできるようにしました。工事の種別も解体・新築・外壁塗装・マンション大規模修繕など8種類に拡充しています。",
  },
  {
    date: "2026-07-03",
    type: "NEW",
    target: "手取り逆算シミュレーター",
    href: "/tools/takehome-reverse",
    title: "手取りから必要年収を逆算するツールを追加",
    body: "「毎月これだけ手取りが欲しい」という金額から、必要な額面年収を逆算します。転職や昇給交渉で希望年収を決めるときに使えます。",
  },
  {
    date: "2026-07-03",
    type: "UPDATE",
    target: "画像リサイズ・アスペクト比変換",
    href: "/tools/image-resize",
    title: "画像の中央切り抜きに対応",
    body: "アスペクト比を変えるときに、画像を引き伸ばさず中央を切り抜くモードを追加しました。SNS用の正方形やサムネイル作成がきれいに仕上がります。",
  },
  {
    date: "2026-07-03",
    type: "UPDATE",
    title: "トップページのデザインを刷新",
    body: "ダークモードを基調に、スクロールに合わせて実画面のプレビューが切り替わる構成へ更新しました。スマートフォンでも見やすいレイアウトに調整しています。",
    href: "/",
  },
  {
    date: "2026-07-01",
    type: "UPDATE",
    target: "PDF→JPG変換 ほか",
    href: "/tools/pdf-to-jpg",
    title: "主要ツールの解説とタイトルを強化",
    body: "PDF→JPG変換・外壁塗装費用計算・パスワード生成・FIREシミュレーターなど、検索でよく使われるツールの説明とページタイトルを見直し、使い方や早見表を追加しました。",
  },
  {
    date: "2026-07-01",
    type: "FIX",
    title: "計算結果や表記の誤りを修正",
    body: "手取り計算の住民税や、外壁塗装の面積表示、記事内の年号など、数値と表記の誤りをまとめて修正しました。",
  },
  {
    date: "2026-06-04",
    type: "NEW",
    target: "カラーツール",
    href: "/color",
    title: "カラーツールカテゴリを追加（4ツール）",
    body: "HEX・RGB・HSL変換、カラーパレット生成、CSSグラデーション生成、コントラストチェッカーを追加しました。あわせて配色に関するブログ記事も公開しています。",
  },
  {
    date: "2025-12-20",
    type: "NEW",
    target: "冠婚葬祭・文書",
    href: "/ceremony",
    title: "冠婚葬祭・文書カテゴリを追加",
    body: "のし紙作成・香典袋作成など、冠婚葬祭に特化したツールを新カテゴリとして追加しました。",
  },
  {
    date: "2025-12-01",
    type: "NEW",
    target: "AI文章ツール",
    href: "/ai",
    title: "AI文章ツールカテゴリを追加",
    body: "ChatGPT整形・AI文章の自然化・X投稿プレビューなど、AI活用に特化したツールを追加しました。",
  },
  {
    date: "2025-11-15",
    type: "NEW",
    target: "ビジネス・契約書",
    href: "/business",
    title: "ビジネス書類カテゴリを追加",
    body: "業務委託契約書・NDA・請求書・見積書・退職届など、各種ビジネス書類の作成ツールを追加しました。",
  },
  {
    date: "2025-11-01",
    type: "NEW",
    title: "ToolBox サービス開始",
    body: "FIRE計算・NISA積立・PDF結合・画像圧縮など、主要ツールをそろえて公開しました。「すぐ使える・登録不要・ブラウザ完結」をコンセプトに開発しています。",
    href: "/",
  },
];

/** 直近 n 件のリリースノートを返す */
export function getRecentReleaseNotes(n: number): ReleaseNote[] {
  return RELEASE_NOTES.slice(0, n);
}

export const RELEASE_TYPE_STYLE: Record<ReleaseType, { label: string; className: string }> = {
  NEW: {
    label: "NEW",
    className: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  UPDATE: {
    label: "UPDATE",
    className: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  FIX: {
    label: "FIX",
    className: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
};

export function formatReleaseDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
