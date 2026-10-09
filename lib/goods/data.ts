import "server-only";
// ============================================================
// /goods のサーバー側データ取得
//
// すべてユーザー本人のセッションで Supabase に接続する（RLS がそのまま効く）。
// 「読めない」＝「存在しない」として扱い、他人のイベントの存在を匂わせない。
// ============================================================
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { goodsServerClient } from "./supabase/server";
import { GOODS_BUCKET } from "./env";
import { qtyKey, type GoodsCategory, type GoodsEvent, type GoodsItem, type GoodsKind, type MyEventSummary, type Quantities } from "./types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: string) => UUID_RE.test(v);

/** 署名URLの有効期限（秒）。一覧を開いたまま放置しても切れにくい長さ */
const SIGNED_URL_TTL = 60 * 60 * 6;

export async function getSessionUser(): Promise<{ supabase: SupabaseClient; user: User | null }> {
  const supabase = await goodsServerClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user ?? null };
}

/** 未ログインならログイン画面へ（戻り先付き） */
export async function requireUser(nextPath: string) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect(`/mochico/login?next=${encodeURIComponent(nextPath)}`);
  return { supabase, user };
}

async function signPaths(supabase: SupabaseClient, paths: (string | null)[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths.filter((p): p is string => !!p))];
  const map = new Map<string, string>();
  if (unique.length === 0) return map;
  // 1回のリクエストでまとめて署名する（100商品でも往復は1回）
  const { data, error } = await supabase.storage.from(GOODS_BUCKET).createSignedUrls(unique, SIGNED_URL_TTL);
  if (error || !data) return map; // 画像が出なくても一覧自体は表示する（Image missing 表示へ）
  for (const row of data) {
    if (row.path && row.signedUrl && !row.error) map.set(row.path, row.signedUrl);
  }
  return map;
}

interface EventRow {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_image_path: string | null;
  deleted_at: string | null;
  preserved_at: string | null;
}

function toEvent(row: EventRow, coverUrl: string | null): GoodsEvent {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    coverImagePath: row.cover_image_path,
    coverUrl,
    deletedAt: row.deleted_at,
    preserved: !!row.preserved_at,
  };
}

export async function getMyEvents(supabase: SupabaseClient): Promise<MyEventSummary[]> {
  const { data, error } = await supabase.rpc("goods_my_events");
  if (error) throw new Error("failed to load events");
  const rows = (data ?? []) as {
    id: string;
    title: string;
    start_date: string | null;
    end_date: string | null;
    cover_image_path: string | null;
    role: "owner" | "member";
    total_count: number;
    owned_count: number;
    deleted: boolean;
    preserved: boolean;
  }[];
  // カバーは一覧ではサムネ版を使う
  const urls = await signPaths(supabase, rows.map((r) => thumbOf(r.cover_image_path)));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    startDate: r.start_date,
    endDate: r.end_date,
    coverUrl: r.cover_image_path ? urls.get(thumbOf(r.cover_image_path)!) ?? null : null,
    role: r.role,
    total: Number(r.total_count),
    owned: Number(r.owned_count),
    deleted: r.deleted,
    preserved: r.preserved,
  }));
}

/** full 画像のパスからサムネのパスを導く（アップロード時の命名規約） */
export function thumbOf(path: string | null): string | null {
  if (!path) return null;
  return path.replace(/-full\.(webp|jpg)$/, "-thumb.$1");
}

export interface EventDetail {
  event: GoodsEvent;
  goods: GoodsItem[];
  categories: GoodsCategory[];
  quantities: Quantities;
  isOwner: boolean;
}

const GOODS_COLUMNS = "id, event_id, name, price, description, image_path, thumb_path, category, category_id, kind, sort_order";

interface GoodsRow {
  id: string;
  event_id: string;
  name: string;
  price: number | null;
  description: string | null;
  image_path: string | null;
  thumb_path: string | null;
  category: string | null;
  category_id: string | null;
  kind: string;
  sort_order: number;
}
interface ImageRow { id: string; goods_id: string; image_path: string; thumb_path: string; sort_order: number }
interface VariantRow { id: string; goods_id: string; name: string; image_path: string | null; thumb_path: string | null; sort_order: number }

/** 画像・絵柄の行をグッズに組み立てる。署名URLは渡された分だけ（一覧ではサムネのみ） */
function toItems(rows: GoodsRow[], images: ImageRow[], variants: VariantRow[], urls: Map<string, string>): GoodsItem[] {
  const imgBy = new Map<string, ImageRow[]>();
  for (const i of images) imgBy.set(i.goods_id, [...(imgBy.get(i.goods_id) ?? []), i]);
  const varBy = new Map<string, VariantRow[]>();
  for (const v of variants) varBy.set(v.goods_id, [...(varBy.get(v.goods_id) ?? []), v]);
  return rows.map((g) => ({
    id: g.id,
    eventId: g.event_id,
    name: g.name,
    price: g.price,
    description: g.description,
    imagePath: g.image_path,
    thumbPath: g.thumb_path,
    category: g.category,
    categoryId: g.category_id,
    kind: (g.kind === "random" ? "random" : "normal") as GoodsKind,
    sortOrder: g.sort_order,
    thumbUrl: g.thumb_path ? urls.get(g.thumb_path) ?? null : null,
    imageUrl: null, // 詳細画像は開いたときにクライアントで署名する（一覧で原寸を読まない）
    images: (imgBy.get(g.id) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ id: i.id, imagePath: i.image_path, thumbPath: i.thumb_path, sortOrder: i.sort_order, thumbUrl: urls.get(i.thumb_path) ?? null })),
    variants: (g.kind === "random" ? varBy.get(g.id) ?? [] : [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((v) => ({
        id: v.id,
        name: v.name,
        imagePath: v.image_path,
        thumbPath: v.thumb_path,
        sortOrder: v.sort_order,
        thumbUrl: v.thumb_path ? urls.get(v.thumb_path) ?? null : null,
      })),
  }));
}

async function loadCatalogParts(supabase: SupabaseClient, eventId: string, goodsIds: string[]) {
  if (goodsIds.length === 0) return { images: [] as ImageRow[], variants: [] as VariantRow[] };
  const [{ data: images, error: iErr }, { data: variants, error: vErr }] = await Promise.all([
    supabase.from("goods_images").select("id, goods_id, image_path, thumb_path, sort_order").eq("event_id", eventId).order("sort_order"),
    supabase.from("goods_variants").select("id, goods_id, name, image_path, thumb_path, sort_order").eq("event_id", eventId).order("sort_order"),
  ]);
  if (iErr || vErr) throw new Error("failed to load goods details");
  return { images: (images ?? []) as ImageRow[], variants: (variants ?? []) as VariantRow[] };
}

export async function getEventCategoryList(supabase: SupabaseClient, eventId: string): Promise<GoodsCategory[]> {
  const { data, error } = await supabase.from("goods_categories").select("id, name, sort_order").eq("event_id", eventId).order("sort_order").order("name");
  if (error) throw new Error("failed to load categories");
  return (data ?? []).map((c) => ({ id: c.id, name: c.name, sortOrder: c.sort_order }));
}

/** 見えないイベントは null（404 と同じ扱い） */
export async function getEventDetail(supabase: SupabaseClient, userId: string, eventId: string): Promise<EventDetail | null> {
  if (!isUuid(eventId)) return null;

  const [{ data: ev, error: evErr }, { data: goodsRows, error: gErr }] = await Promise.all([
    supabase
      .from("events")
      .select("id, owner_id, title, description, start_date, end_date, cover_image_path, deleted_at, preserved_at")
      .eq("id", eventId)
      .maybeSingle(),
    supabase
      .from("goods")
      .select(GOODS_COLUMNS)
      .eq("event_id", eventId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  // 通信・DB障害は「見つからない」と区別する（404 ではなくエラー画面 → 前回データ表示へ）
  if (evErr) throw new Error("failed to load event");
  if (!ev) return null;
  if (gErr) throw new Error("failed to load goods");

  const rows = (goodsRows ?? []) as GoodsRow[];
  const goodsIds = rows.map((g) => g.id);
  const [parts, categories, { data: owns, error: oErr }] = await Promise.all([
    loadCatalogParts(supabase, eventId, goodsIds),
    getEventCategoryList(supabase, eventId),
    // 自分の所持数量だけ（RLS でも他人の行は返らないが、明示的に絞る）
    goodsIds.length
      ? supabase.from("ownerships").select("goods_id, variant_id, quantity").eq("user_id", userId).in("goods_id", goodsIds)
      : Promise.resolve({ data: [] as { goods_id: string; variant_id: string | null; quantity: number }[], error: null }),
  ]);
  if (oErr) throw new Error("failed to load ownerships");

  // 一覧で使うのはカバーと各グッズの代表サムネだけ。ギャラリー・絵柄の画像は開いたときに署名する
  const urls = await signPaths(supabase, [thumbOf(ev.cover_image_path), ev.cover_image_path, ...rows.map((g) => g.thumb_path)]);

  const quantities: Quantities = {};
  for (const o of owns ?? []) if (o.quantity > 0) quantities[qtyKey(o.goods_id, o.variant_id)] = o.quantity;

  return {
    event: toEvent(ev as EventRow, ev.cover_image_path ? urls.get(ev.cover_image_path) ?? null : null),
    goods: toItems(rows, parts.images, parts.variants, urls),
    categories,
    quantities,
    isOwner: ev.owner_id === userId,
  };
}

/** 編集画面用: オーナーのイベントだけ返す */
export async function getOwnedEvent(supabase: SupabaseClient, userId: string, eventId: string) {
  if (!isUuid(eventId)) return { event: null, forbidden: false };
  const { data: ev, error: evErr } = await supabase
    .from("events")
    .select("id, owner_id, title, description, start_date, end_date, cover_image_path, deleted_at, preserved_at")
    .eq("id", eventId)
    .maybeSingle();
  if (evErr) throw new Error("failed to load event");
  if (!ev || ev.deleted_at) return { event: null, forbidden: false };
  if (ev.owner_id !== userId) return { event: null, forbidden: true };
  const urls = await signPaths(supabase, [thumbOf(ev.cover_image_path)]);
  const thumb = thumbOf(ev.cover_image_path);
  return { event: toEvent(ev as EventRow, thumb ? urls.get(thumb) ?? null : null), forbidden: false };
}

export async function getGoodsForEdit(supabase: SupabaseClient, eventId: string, goodsId: string) {
  if (!isUuid(goodsId)) return null;
  const { data: g, error: gErr } = await supabase
    .from("goods")
    .select(GOODS_COLUMNS)
    .eq("id", goodsId)
    .eq("event_id", eventId)
    .is("deleted_at", null)
    .maybeSingle();
  if (gErr) throw new Error("failed to load goods");
  if (!g) return null;
  const [{ data: images, error: iErr }, { data: variants, error: vErr }] = await Promise.all([
    supabase.from("goods_images").select("id, goods_id, image_path, thumb_path, sort_order").eq("goods_id", goodsId).order("sort_order"),
    supabase.from("goods_variants").select("id, goods_id, name, image_path, thumb_path, sort_order").eq("goods_id", goodsId).order("sort_order"),
  ]);
  if (iErr || vErr) throw new Error("failed to load goods details");
  // 編集画面では、このグッズの画像・絵柄のサムネをすべて署名する
  const urls = await signPaths(supabase, [
    (g as GoodsRow).thumb_path,
    ...(images ?? []).map((i) => i.thumb_path),
    ...(variants ?? []).map((v) => v.thumb_path),
  ]);
  return toItems([g as GoodsRow], (images ?? []) as ImageRow[], (variants ?? []) as VariantRow[], urls)[0];
}

/** イベント内のカテゴリ名（入力補完用・後方互換） */
export async function getEventCategories(supabase: SupabaseClient, eventId: string): Promise<string[]> {
  return (await getEventCategoryList(supabase, eventId)).map((c) => c.name);
}
