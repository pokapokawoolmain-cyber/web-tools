// ============================================================
// Mochico 公開 LP の文言・デモデータ
//   * 載せるのは実装済みの機能だけ（未実装・架空の機能を書かない）
//   * デモデータは LP 専用（実ユーザーのデータは使わない）
// ============================================================
export const BRAND = {
  name: "Mochico",
  kana: "モチコ",
  title: "Mochico（モチコ）｜推しグッズを見やすく管理・共有",
  description:
    "Mochico（モチコ）は、ライブやイベントのグッズを写真つきで見やすく一覧にして、持っているものをタップで管理できる推し活向けのグッズ管理アプリ。リストは共有でき、「持ってる」はあなただけの情報です。",
  catch: "リストはみんなで。持ってるものは、自分だけ。",
  path: "/mochico",
};

export type DemoIcon = "shirt" | "light" | "towel" | "stand" | "badge" | "bag" | "key" | "book" | "hoodie" | "sticker" | "camera" | "gift";

export interface DemoGoods {
  id: string;
  name: string;
  price: number;
  category?: string;
  icon: DemoIcon;
  tone: "lav" | "pink" | "blue" | "mint" | "peach" | "sky";
}

/** 17点のうち、LP で見せる6点（全体は 17 点のイベントという設定） */
export const DEMO_TOTAL = 17;
export const DEMO_GOODS: DemoGoods[] = [
  { id: "tee", name: "ツアーTシャツ", price: 4500, category: "アパレル", icon: "shirt", tone: "lav" },
  { id: "light", name: "ペンライト", price: 3800, category: "ライト", icon: "light", tone: "blue" },
  { id: "towel", name: "マフラータオル", price: 2500, category: "タオル", icon: "towel", tone: "pink" },
  { id: "stand", name: "アクリルスタンド", price: 2000, category: "アクスタ", icon: "stand", tone: "peach" },
  { id: "badge", name: "ランダム缶バッジ", price: 500, category: "ランダム", icon: "badge", tone: "mint" },
  { id: "bag", name: "トートバッグ", price: 3000, category: "バッグ", icon: "bag", tone: "sky" },
];
/** 表示外の 11 点のうち、最初から持っている数（5 / 17 から始まる） */
export const DEMO_OWNED_HIDDEN = 3;
export const DEMO_OWNED_INITIAL = ["light", "stand"];

/** 共有の説明用：同じリストを使う3人（数字は説明用。実際のアプリでは他人の取得状況は見えない） */
export const SHARE_USERS = [
  { id: "a", label: "Aさん", color: "purple", owned: ["light", "stand", "tee"], count: 5 },
  { id: "b", label: "Bさん", color: "cyan", owned: ["light", "towel", "badge", "bag", "tee"], count: 11 },
  { id: "c", label: "Cさん", color: "pink", owned: ["badge"], count: 2 },
] as const;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "アプリのダウンロードは必要ですか？",
    a: "必要ありません。Mochicoはブラウザで使えるWebアプリです。スマートフォンのホーム画面に追加すると、次からはアプリのようにアイコンから開けます。",
  },
  {
    q: "リストを共有すると、自分が持っているグッズも相手に見えますか？",
    a: "見えません。共有されるのはイベントとグッズの一覧（写真・名前・価格など）だけです。「持ってる」「持ってない」の状態は一人ひとり別々に保存され、リストを作った人にも見えません。",
  },
  {
    q: "共有されたリストのグッズを、自分で追加・編集できますか？",
    a: "グッズの追加や編集ができるのは、リストを作った人だけです。作った人がグッズを追加・修正すると、共有されている人のリストにもそのまま反映されます。",
  },
  {
    q: "グッズの重複購入を防ぐには、どう使えばいいですか？",
    a: "買ったその場で「持ってる」をタップしておくのがおすすめです。物販の列や通販の注文前に一覧を見れば、持っているものと持っていないものが写真つきでひと目で分かります。",
  },
  {
    q: "登録した写真やデータは、機種変更すると消えますか？",
    a: "消えません。データはアカウントに保存されるため、別のスマートフォンからログインしても同じリストを使えます。写真はアップロード前に自動で縮小され、撮影場所などの位置情報は保存されません。",
  },
  {
    q: "どうやってログインしますか？",
    a: "メールアドレスを入力すると届く6桁のコードでログインします。パスワードを覚える必要はありません。",
  },
  {
    q: "共有リストの作成者が退会したら、追加したリストはどうなりますか？",
    a: "すでに自分の管理に追加しているリストは、そのまま使い続けられます。作成者の情報は消え、グッズの追加・編集ができない読み取り専用のリストになります。自分の取得状況はこれまでどおり記録できます。",
  },
];
