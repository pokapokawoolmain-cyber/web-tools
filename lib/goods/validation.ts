// 入力検証（DB の CHECK 制約と同じ上限。DB が最終防衛線、ここは親切な事前案内）

export const LIMITS = {
  eventTitle: 100,
  eventDescription: 2000,
  goodsName: 100,
  goodsDescription: 1000,
  category: 30,
  displayName: 40,
  priceMax: 10_000_000,
} as const;

export type FieldErrors = Record<string, string>;

export interface EventInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function validateEvent(v: EventInput): FieldErrors {
  const e: FieldErrors = {};
  const title = v.title.trim();
  if (!title) e.title = "イベント名を入力してください";
  else if (title.length > LIMITS.eventTitle) e.title = `イベント名は${LIMITS.eventTitle}文字以内で入力してください`;
  if (v.description.length > LIMITS.eventDescription) e.description = `概要は${LIMITS.eventDescription}文字以内で入力してください`;
  if (v.startDate && v.endDate && v.endDate < v.startDate) e.endDate = "終了日は開始日以降の日付にしてください";
  return e;
}

export interface GoodsInput {
  name: string;
  price: string;
  category: string;
  description: string;
}

/** 全角数字・カンマ・円記号を許容して整数に。空なら null、不正なら NaN */
export function parsePrice(raw: string): number | null {
  const s = raw
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[,，¥￥円\s]/g, "");
  if (s === "") return null;
  if (!/^\d+$/.test(s)) return Number.NaN;
  return Number(s);
}

export function validateGoods(v: GoodsInput): FieldErrors {
  const e: FieldErrors = {};
  const name = v.name.trim();
  if (!name) e.name = "商品名を入力してください";
  else if (name.length > LIMITS.goodsName) e.name = `商品名は${LIMITS.goodsName}文字以内で入力してください`;
  const price = parsePrice(v.price);
  if (Number.isNaN(price)) e.price = "価格は数字で入力してください（例: 3500）";
  else if (price !== null && price > LIMITS.priceMax) e.price = "価格が大きすぎます";
  if (v.category.trim().length > LIMITS.category) e.category = `カテゴリは${LIMITS.category}文字以内で入力してください`;
  if (v.description.length > LIMITS.goodsDescription) e.description = `概要は${LIMITS.goodsDescription}文字以内で入力してください`;
  return e;
}

/** ログイン後の遷移先。オープンリダイレクトを防ぐため /goods 配下の相対パスのみ許可 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/mochico/events";
  if (!(next === "/mochico" || next.startsWith("/mochico/")) || next.startsWith("//") || next.includes("\\")) return "/mochico/events";
  return next;
}

/** Supabase / PostgREST のエラーをユーザー向け文言へ。内部情報は出さない */
export function friendlyDbError(err: { code?: string; message?: string; hint?: string } | null | undefined): string {
  if (!err) return "処理に失敗しました。";
  if (err.hint === "goods_event_limit") return "イベント数の上限（300件）に達しています。";
  if (err.hint === "goods_goods_limit") return "1イベントあたりのグッズ数の上限（1000件）に達しています。";
  if (err.code === "42501") return "この操作を行う権限がありません。";
  if (err.code === "23514") return "入力内容に誤りがあります。文字数や日付を確認してください。";
  if (err.message && /fetch|network|Failed to fetch/i.test(err.message)) return "通信できませんでした。電波の良い場所でもう一度お試しください。";
  return "処理に失敗しました。時間をおいてもう一度お試しください。";
}
