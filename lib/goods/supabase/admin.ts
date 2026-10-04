import "server-only";
// ============================================================
// service role クライアント（サーバー専用）
//
// 用途は2つだけ:
//   1. goods_get_shared_catalog（service_role にしか実行権限がない）の呼び出し
//   2. 共有カタログ画像の署名URL発行（匿名ユーザーは Storage を読めないため）
// それ以外のデータアクセスには使わない（通常はユーザー本人のセッション + RLS）。
// `server-only` により、クライアントから import するとビルドが失敗する。
// ============================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fetchWithTimeout } from "./fetch";

let cached: SupabaseClient | null = null;

export function goodsAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL;
  const key = process.env.GOODS_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("GOODS_SUPABASE_SERVICE_ROLE_KEY が未設定です（共有機能に必要）。");
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout },
  });
  return cached;
}
