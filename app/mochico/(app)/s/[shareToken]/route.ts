// ============================================================
// 共有URL /mochico/s/<token> の入口
//
// ページを描画せず、トークンを HttpOnly Cookie に移して /mochico/s/view へ 303 リダイレクトする。
//   * この応答には HTML もスクリプトも無い → アクセス解析がトークン入り URL を記録しない
//   * 以降の画面（閲覧・ログイン・参加）の URL にトークンが出ない
// トークンの正否はここでは判定しない（/mochico/s/view でサーバー側検証）。ログにも出さない。
// ============================================================
import type { NextRequest } from "next/server";
import { redirectTo } from "@/lib/goods/http";
import { SHARE_COOKIE, SHARE_COOKIE_MAX_AGE, SHARE_COOKIE_PATH, isShareTokenFormat } from "@/lib/goods/share";

export async function GET(request: NextRequest, { params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const res = redirectTo("/mochico/s/view");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.cookies.set(SHARE_COOKIE, isShareTokenFormat(shareToken) ? shareToken : "invalid", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: SHARE_COOKIE_PATH,
    maxAge: SHARE_COOKIE_MAX_AGE,
  });
  return res;
}
