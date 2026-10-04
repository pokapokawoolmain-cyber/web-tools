// ============================================================
// 認証コールバック
//   * ?code=...                 Google ログイン（PKCE）
//   * ?token_hash=...&type=email  メール内リンク
// 遷移先は /goods 配下の相対パスのみ許可（オープンリダイレクト防止）。
// ============================================================
import type { NextRequest } from "next/server";
import { redirectTo } from "@/lib/goods/http";
import type { EmailOtpType } from "@supabase/supabase-js";
import { goodsServerClient } from "@/lib/goods/supabase/server";
import { safeNextPath } from "@/lib/goods/validation";

const EMAIL_TYPES: EmailOtpType[] = ["email", "magiclink", "signup"];

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNextPath(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const supabase = await goodsServerClient();

  let ok = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type && EMAIL_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    ok = !error;
  }

  // 相対パスでリダイレクト（`next` は safeNextPath で /goods 配下の相対パスに限定済み）
  return redirectTo(ok ? next : `/mochico/login?error=link&next=${encodeURIComponent(next)}`, 302);
}
