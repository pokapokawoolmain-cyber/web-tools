// middleware 用: アクセスのたびにセッションを検証・更新し、Cookie を書き戻す。
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { fetchWithTimeout } from "./fetch";

export async function refreshGoodsSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // getUser() は Auth サーバーでトークンを検証する（Cookie の自己申告を信用しない）
  await supabase.auth.getUser();
  return response;
}
