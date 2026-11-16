// ============================================================
// Mochico のグッズ テンプレート（記事のグッズを、そのまま自分のリストにする）
//
// - テンプレートはコードに持つ（データベースには置かない）。作成は本人のアカウントで、
//   いつものイベント・カテゴリ・グッズの作成と同じ仕組みを使う
// - 公式の商品画像・ロゴは使わない。名前・価格・カテゴリと、確認日・出典だけ
// - 価格は各公式サイトで確認したもの（確認日を checkedAt に書く）
// ============================================================
import { JF2027_ITEMS } from "./templates-jf2027";

export interface TemplateItem {
  name: string;
  /** 税込の価格（円） */
  price: number | null;
  /** Mochico のカテゴリ名（30文字まで） */
  category: string;
  /** 補足（色・購入上限など）。グッズの説明に入る */
  note?: string;
  /** ランダム商品（缶バッジのくじなど）。絵柄は分からないため通常のグッズとして作る */
  random?: boolean;
}

export interface GoodsTemplate {
  id: string;
  /** テンプレートページの見出し */
  title: string;
  /** 作成するイベントの名前（100文字まで） */
  eventTitle: string;
  lead: string;
  startDate?: string;
  endDate?: string;
  source: { label: string; url: string };
  checkedAt: string;
  /** 全商品ではない場合の注意 */
  coverage: string;
  /** 最初からすべて選んでおくか（商品が多いものは作品を選んでもらう） */
  selectAll: boolean;
  /** 関連する記事 */
  articleHref?: string;
  items: TemplateItem[];
}

const GHOST: GoodsTemplate = {
  id: "yonezu-ghost-2026",
  title: "米津玄師 2026 TOUR / GHOST ツアーグッズ",
  eventTitle: "米津玄師 2026 TOUR / GHOST",
  lead: "ツアーグッズ全20点（色違いは1つにまとめ、ショッピングバッグは除く）の名前と価格を、そのまま自分の買い物リストにできます。",
  startDate: "2026-11-06",
  endDate: "2026-12-17",
  source: { label: "REISSUE RECORDS「GOODS / GHOST」", url: "https://reissuerecords.net/goods/" },
  checkedAt: "2026-11-16",
  coverage: "公式ページに載っている販売グッズ全点です（色違いは1つにまとめています）。",
  selectAll: true,
  articleHref: "/blog/yonezu-ghost-tour-goods",
  items: [
    { name: "GHOST ジャケット", price: 15000, category: "アパレル", note: "カラー：BLACK" },
    { name: "ボルゾイ ジップフーディ", price: 12000, category: "アパレル", note: "カラー：BLACK" },
    { name: "ボルゾイ スウェット", price: 8800, category: "アパレル", note: "カラー：WASHED BLACK" },
    { name: "GHOST ゲームシャツ", price: 7800, category: "アパレル", note: "カラー：BLACK / WHITE" },
    { name: "IRIS OUT - T", price: 5500, category: "アパレル", note: "カラー：WASHED BLACK" },
    { name: "JANE DOE - T", price: 5500, category: "アパレル", note: "カラー：WASHED BLACK" },
    { name: "ボルゾイ T", price: 5000, category: "アパレル", note: "カラー：OFF WHITE" },
    { name: "GHOST ストール", price: 6500, category: "バッグ・小物" },
    { name: "GHOST グローブ", price: 6500, category: "バッグ・小物", note: "カラー：BLACK" },
    { name: "GHOST ベルトバッグ", price: 4800, category: "バッグ・小物", note: "カラー：BLACK" },
    { name: "GHOST バケットバッグ", price: 4800, category: "バッグ・小物", note: "カラー：BLUE" },
    { name: "GHOST キャップ", price: 4500, category: "バッグ・小物", note: "カラー：BLACK / NAVY" },
    { name: "GHOST チェーンクラッチ", price: 3500, category: "バッグ・小物", note: "カラー：BLACK" },
    { name: "GHOST タオル", price: 2500, category: "バッグ・小物" },
    { name: "GHOST キーポーチ", price: 1800, category: "バッグ・小物", note: "カラー：BLACK / BLUE / ORANGE" },
    { name: "GHOST コード ブレスレット", price: 1400, category: "バッグ・小物" },
    { name: "リイシューねこちゃん チャーム", price: 2800, category: "キャラクター", note: "カラー：PASTEL LILAC / ORANGE SHERBET / PASTEL BLUE" },
    { name: "とんがりくん キーリング", price: 2200, category: "キャラクター", note: "カラー：WHITE / GRAY / AURORA" },
    { name: "ティースくん ぷっくりシール", price: 700, category: "キャラクター" },
    { name: "リイシューオールスターズ / CANDY COLOR（ガチャガチャ）", price: 700, category: "キャラクター", note: "1回の価格。1回の並びにつき6回まで", random: true },
  ],
};

const JF2027: GoodsTemplate = {
  id: "jump-festa-2027",
  title: "ジャンプフェスタ2027 JF公式ショップ",
  eventTitle: "ジャンプフェスタ2027",
  lead: "JF公式ショップの全109点から、好きな作品のグッズだけを選んで自分の買い物リストにできます。",
  startDate: "2026-12-19",
  endDate: "2026-12-20",
  source: { label: "ジャンプフェスタ2027「JF公式ショップ」", url: "https://www.jumpfesta.com/market/shop/" },
  checkedAt: "2026-11-16",
  coverage: "JF公式ショップのページに載っている全109点です。続報で商品が増える場合があります。",
  selectAll: false,
  articleHref: "/blog/jump-festa-2027-goods",
  items: JF2027_ITEMS,
};

const DISNEY_XMAS: GoodsTemplate = {
  id: "disney-christmas-2026",
  title: "ディズニー・クリスマス 2026 のグッズ（ぬいぐるみ・バッグ）",
  eventTitle: "ディズニー・クリスマス 2026",
  lead: "東京ディズニーリゾートのクリスマスグッズのうち、ぬいぐるみ・ぬいぐるみバッジ・バッグなど20点を、そのまま自分のリストにできます。",
  startDate: "2026-11-10",
  endDate: "2026-12-25",
  source: { label: "東京ディズニーリゾート公式サイト「おすすめグッズ」", url: "https://www.tokyodisneyresort.jp/treasure/christmas2026/tdl/" },
  checkedAt: "2026-11-16",
  coverage: "公式サイトの商品ページで価格を確認できた20点です。クリスマスグッズの全商品ではありません。足りないものはリストを作ったあとに自分で追加できます。",
  selectAll: true,
  items: [
    { name: "ぬいぐるみ（リルリンリン）", price: 4500, category: "リルリンリン" },
    { name: "ぬいぐるみバッジ（リルリンリン・グリーンの衣装）", price: 2500, category: "リルリンリン" },
    { name: "ぬいぐるみバッジ（リルリンリン・ピンクの衣装）", price: 2500, category: "リルリンリン" },
    { name: "ぬいぐるみバッジ（リルリンリン・ジュビリーブルー／東京ディズニーシー25周年）", price: 2800, category: "リルリンリン" },
    { name: "ぬいぐるみチャーム（リルリンリン）", price: 1400, category: "リルリンリン", note: "どれが出るかはお楽しみ", random: true },
    { name: "ぬいぐるみチャームセット（リルリンリン）", price: 8400, category: "リルリンリン" },
    { name: "トートバッグ（リルリンリン）", price: 4800, category: "リルリンリン" },
    { name: "ショルダーバッグ（リルリンリン）", price: 3600, category: "リルリンリン" },
    { name: "ポーチ（リルリンリン）", price: 3200, category: "リルリンリン" },
    { name: "ぬいぐるみ（ミッキーマウス・クリスマスの衣装）", price: 5500, category: "ミッキー＆フレンズ" },
    { name: "ぬいぐるみ（ミニーマウス・クリスマスの衣装）", price: 5500, category: "ミッキー＆フレンズ" },
    { name: "ぬいぐるみバッジ（ミッキーマウス・クリスマスの衣装）", price: 2800, category: "ミッキー＆フレンズ" },
    { name: "ぬいぐるみバッジ（ミニーマウス・クリスマスの衣装）", price: 2800, category: "ミッキー＆フレンズ" },
    { name: "トートバッグ（クリスマスのモチーフとチェック柄）", price: 3400, category: "そのほか" },
    { name: "ぬいぐるみバッジ（ミッキーマウス・トイズ・ワンダラス・クリスマス！）", price: 2800, category: "パレード" },
    { name: "ぬいぐるみバッジ（ミニーマウス・トイズ・ワンダラス・クリスマス！）", price: 2800, category: "パレード" },
    { name: "ぬいぐるみバッジ（ドナルドダック・トイズ・ワンダラス・クリスマス！）", price: 2800, category: "パレード" },
    { name: "ぬいぐるみバッジ（デイジーダック・トイズ・ワンダラス・クリスマス！）", price: 2800, category: "パレード" },
    { name: "ぬいぐるみバッジ（リーナ・ベル・クリスマスのコスチューム）", price: 3500, category: "ダッフィー＆フレンズ" },
    { name: "ぬいぐるみ（シェリーメイ・サンタ帽）", price: 6800, category: "ダッフィー＆フレンズ" },
  ],
};

export const GOODS_TEMPLATES: GoodsTemplate[] = [GHOST, JF2027, DISNEY_XMAS];

export function getTemplate(id: string): GoodsTemplate | undefined {
  return GOODS_TEMPLATES.find((t) => t.id === id);
}

/** 選んだ番号（"0,3,5"）を読み、範囲外・重複を除く。空なら null */
export function parsePick(pick: string | undefined, total: number): number[] | null {
  if (!pick) return null;
  const idx = [...new Set(pick.split(",").map((s) => Number(s)).filter((n) => Number.isInteger(n) && n >= 0 && n < total))].sort((a, b) => a - b);
  return idx.length ? idx : null;
}

export function sumPrice(items: TemplateItem[]): number {
  return items.reduce((s, it) => s + (it.price ?? 0), 0);
}
