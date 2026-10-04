import "server-only";
// ============================================================
// 共有リンク（サーバー側）
//
// トークンの扱い:
//   /mochico/s/<token> へのアクセスはページを描画せず、トークンを HttpOnly Cookie に移して
//   /mochico/s/view へリダイレクトする。ブラウザに表示される URL・アクセス解析（GA4 / Vercel
//   Analytics の page_view）・Referer・ログイン後の戻り先にトークンが乗らないようにするため。
//   トークンはログにも出さない。
// ============================================================
import { GOODS_BUCKET } from "./env";
import { goodsAdminClient } from "./supabase/admin";

export const SHARE_COOKIE = "goods_share";
export const SHARE_COOKIE_PATH = "/mochico/s";
export const SHARE_COOKIE_MAX_AGE = 60 * 60; // 1時間（参加・閲覧の導線に必要な間だけ）

const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
export const isShareTokenFormat = (t: string | undefined | null): t is string => !!t && TOKEN_RE.test(t);

export type ShareStatus = "ok" | "invalid" | "revoked" | "expired" | "unavailable" | "error";

export interface SharedGoods {
  key: string;
  name: string;
  price: number | null;
  description: string | null;
  category: string | null;
  thumbUrl: string | null;
  imageUrl: string | null;
  hasImage: boolean;
}

export interface SharedCatalog {
  status: "ok";
  event: { title: string; description: string | null; startDate: string | null; endDate: string | null; coverUrl: string | null };
  goods: SharedGoods[];
}

const SIGNED_TTL = 60 * 60;

/** トークンを検証し、そのイベントのカタログだけを返す。失敗理由は粗い区分のみ返す */
export async function getSharedCatalog(token: string): Promise<SharedCatalog | { status: Exclude<ShareStatus, "ok"> }> {
  if (!isShareTokenFormat(token)) return { status: "invalid" };
  const admin = goodsAdminClient();
  const { data, error } = await admin.rpc("goods_get_shared_catalog", { p_token: token });
  if (error || !data) return { status: "error" };
  const res = data as {
    status: ShareStatus;
    event?: { title: string; description: string | null; start_date: string | null; end_date: string | null; cover_path: string | null };
    goods?: { key: string; name: string; price: number | null; description: string | null; category: string | null; image_path: string | null; thumb_path: string | null }[];
  };
  if (res.status !== "ok" || !res.event) return { status: (res.status === "ok" ? "error" : res.status) as Exclude<ShareStatus, "ok"> };

  const goods = res.goods ?? [];
  // 画像は1回の呼び出しでまとめて署名する（150商品でも往復1回 = N+1 にしない）
  const paths = [res.event.cover_path, ...goods.flatMap((g) => [g.thumb_path, g.image_path])].filter((p): p is string => !!p);
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await admin.storage.from(GOODS_BUCKET).createSignedUrls([...new Set(paths)], SIGNED_TTL);
    for (const u of urls ?? []) if (u.path && u.signedUrl && !u.error) signed.set(u.path, u.signedUrl);
  }
  const url = (p: string | null) => (p ? signed.get(p) ?? null : null);

  return {
    status: "ok",
    event: {
      title: res.event.title,
      description: res.event.description,
      startDate: res.event.start_date,
      endDate: res.event.end_date,
      coverUrl: url(res.event.cover_path),
    },
    goods: goods.map((g) => ({
      key: g.key,
      name: g.name,
      price: g.price,
      description: g.description,
      category: g.category,
      thumbUrl: url(g.thumb_path),
      imageUrl: url(g.image_path),
      hasImage: !!g.image_path,
    })),
  };
}
