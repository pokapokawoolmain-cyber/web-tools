"use client";
// ブラウザ用 Supabase クライアント（anon key + ユーザーのセッション Cookie）。
// 権限はすべて RLS で決まる。UI の表示制御をセキュリティとして扱わない。
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { goodsSupabaseEnv } from "../env";

let client: SupabaseClient | null = null;

export function goodsBrowserClient(): SupabaseClient {
  if (client) return client;
  const { url, anonKey } = goodsSupabaseEnv();
  client = createBrowserClient(url, anonKey);
  return client;
}
