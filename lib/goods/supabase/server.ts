import "server-only";
// サーバー（Server Component / Route Handler）用 Supabase クライアント。
// ユーザーのセッション Cookie で接続するため、RLS がそのまま効く。
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { goodsSupabaseEnv } from "../env";
import { fetchWithTimeout } from "./fetch";

export async function goodsServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = goodsSupabaseEnv();
  return createServerClient(url, anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Server Component からは Cookie を書けない。セッション更新は middleware が担う。
        }
      },
    },
  });
}
