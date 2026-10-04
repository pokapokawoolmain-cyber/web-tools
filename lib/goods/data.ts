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
import type { GoodsEvent, GoodsItem, MyEventSummary, OwnershipStatus } from "./types";

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
  statuses: Record<string, OwnershipStatus>;
  isOwner: boolean;
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
      .select("id, event_id, name, price, description, image_path, thumb_path, category, sort_order")
      .eq("event_id", eventId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  // 通信・DB障害は「見つからない」と区別する（404 ではなくエラー画面 → 前回データ表示へ）
  if (evErr) throw new Error("failed to load event");
  if (!ev) return null;
  if (gErr) throw new Error("failed to load goods");

  const goodsIds = (goodsRows ?? []).map((g) => g.id);
  // 自分の所持状態だけ（RLS でも他人の行は返らないが、明示的に絞る）
  const { data: owns, error: oErr } = goodsIds.length
    ? await supabase.from("ownerships").select("goods_id, status").eq("user_id", userId).in("goods_id", goodsIds)
    : { data: [], error: null };
  if (oErr) throw new Error("failed to load ownerships");

  const urls = await signPaths(supabase, [
    thumbOf(ev.cover_image_path),
    ev.cover_image_path,
    ...(goodsRows ?? []).map((g) => g.thumb_path),
  ]);

  const statuses: Record<string, OwnershipStatus> = {};
  for (const o of owns ?? []) statuses[o.goods_id] = o.status === "owned" ? "owned" : "unowned";

  return {
    event: toEvent(ev as EventRow, ev.cover_image_path ? urls.get(ev.cover_image_path) ?? null : null),
    goods: (goodsRows ?? []).map((g) => ({
      id: g.id,
      eventId: g.event_id,
      name: g.name,
      price: g.price,
      description: g.description,
      imagePath: g.image_path,
      thumbPath: g.thumb_path,
      category: g.category,
      sortOrder: g.sort_order,
      thumbUrl: g.thumb_path ? urls.get(g.thumb_path) ?? null : null,
      imageUrl: null, // 詳細画像は開いたときにクライアントで署名する（一覧で原寸を読まない）
    })),
    statuses,
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
    .select("id, event_id, name, price, description, image_path, thumb_path, category, sort_order")
    .eq("id", goodsId)
    .eq("event_id", eventId)
    .is("deleted_at", null)
    .maybeSingle();
  if (gErr) throw new Error("failed to load goods");
  if (!g) return null;
  const urls = await signPaths(supabase, [g.thumb_path]);
  const item: GoodsItem = {
    id: g.id,
    eventId: g.event_id,
    name: g.name,
    price: g.price,
    description: g.description,
    imagePath: g.image_path,
    thumbPath: g.thumb_path,
    category: g.category,
    sortOrder: g.sort_order,
    thumbUrl: g.thumb_path ? urls.get(g.thumb_path) ?? null : null,
    imageUrl: null,
  };
  return item;
}

/** イベント内の既存カテゴリ（入力補完用） */
export async function getEventCategories(supabase: SupabaseClient, eventId: string): Promise<string[]> {
  const { data } = await supabase.from("goods").select("category").eq("event_id", eventId).is("deleted_at", null).not("category", "is", null);
  return [...new Set((data ?? []).map((r) => r.category as string))].slice(0, 30);
}
