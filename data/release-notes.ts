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
