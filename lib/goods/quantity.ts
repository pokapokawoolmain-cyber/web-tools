// ============================================================
// 所持数量のルール（UI・保存・テストで共通に使う純粋関数）
//   * 数量は 0〜9999 の整数。0 = 未所持、1 以上 = 所持（取得済み）
//   * 通常商品はグッズ単位、ランダム商品は絵柄ごとに数量を持つ
//   * 商品の合計数量 = 絵柄の数量の合計。商品の「取得済み」= 合計が1以上
// ============================================================
import { qtyKey, type GoodsItem, type Quantities } from "./types";

export const MAX_QUANTITY = 9999;

/** 入力を数量として解釈する。整数 0〜9999 以外（負数・小数・文字・空）は null */
export function parseQuantity(input: string | number): number | null {
  const s = typeof input === "number" ? String(input) : input.normalize("NFKC").trim();
  if (!/^\d{1,4}$/.test(s)) return null;
  const n = Number(s);
  return Number.isInteger(n) && n >= 0 && n <= MAX_QUANTITY ? n : null;
}

/** 範囲内に丸める（＋／− ボタン用） */
export const clampQuantity = (n: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(n)));

export function itemTotal(item: GoodsItem, q: Quantities): number {
  if (item.kind === "random") return item.variants.reduce((sum, v) => sum + (q[qtyKey(item.id, v.id)] ?? 0), 0);
  return q[item.id] ?? 0;
}

export const itemOwned = (item: GoodsItem, q: Quantities) => itemTotal(item, q) > 0;

/** ランダム商品で、1個以上持っている絵柄の数 */
export function ownedVariantCount(item: GoodsItem, q: Quantities): number {
  return item.variants.filter((v) => (q[qtyKey(item.id, v.id)] ?? 0) > 0).length;
}
