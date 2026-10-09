// ============================================================
// グッズの検索・絞り込み・並び替え（クライアント側。1イベント最大1000件）
//   * 商品名の部分一致。全角/半角・大文字/小文字・ひらがな/カタカナの違いを無視する
//   * 所持（すべて/未取得/取得済み）× カテゴリ × 並び替え は併用できる
//   * 取得率はイベント全体で計算する（ここでは扱わない）
// ============================================================
import { itemOwned } from "./quantity";
import type { GoodsItem, Quantities } from "./types";

export type OwnFilter = "all" | "owned" | "unowned";
export type SortKey = "registered" | "name" | "price-asc" | "price-desc";
/** "all" = すべて、"none" = 未分類、それ以外はカテゴリ ID */
export type CategoryFilter = string;

export const SORT_LABELS: Record<SortKey, string> = {
  registered: "登録順",
  name: "名前順",
  "price-asc": "価格の安い順",
  "price-desc": "価格の高い順",
};

/** 比較用に正規化: NFKC（全角英数→半角など）→ 小文字 → カタカナをひらがなへ */
export function normalizeForSearch(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, " ")
    .trim();
}

const collator = typeof Intl !== "undefined" ? new Intl.Collator("ja", { numeric: true, sensitivity: "base" }) : null;

export interface QueryOptions {
  text: string;
  own: OwnFilter;
  category: CategoryFilter;
  sort: SortKey;
  /** 絞り込み中に状態を変えたカードを、条件を変えるまで残す（急に消えると迷子になる） */
  sticky?: Set<string>;
}

export function queryGoods(goods: GoodsItem[], q: Quantities, opt: QueryOptions): GoodsItem[] {
  const words = normalizeForSearch(opt.text).split(" ").filter(Boolean);
  const out = goods.filter((g) => {
    if (opt.category === "none" ? g.categoryId !== null : opt.category !== "all" && g.categoryId !== opt.category) return false;
    if (words.length) {
      const name = normalizeForSearch(g.name);
      if (!words.every((w) => name.includes(w))) return false;
    }
    if (opt.own !== "all" && !opt.sticky?.has(g.id)) {
      const owned = itemOwned(g, q);
      if (opt.own === "owned" ? !owned : owned) return false;
    }
    return true;
  });
  if (opt.sort === "registered") return out; // 既に登録順（sort_order → created_at）で並んでいる
  const byName = (a: GoodsItem, b: GoodsItem) => (collator ? collator.compare(a.name, b.name) : a.name.localeCompare(b.name));
  return [...out].sort((a, b) => {
    if (opt.sort === "name") return byName(a, b);
    // 価格未定は常に最後
    if (a.price === null && b.price === null) return byName(a, b);
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    const d = opt.sort === "price-asc" ? a.price - b.price : b.price - a.price;
    return d !== 0 ? d : byName(a, b);
  });
}
