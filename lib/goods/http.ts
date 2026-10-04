// リダイレクト・Origin 検証の共通処理
//
// request.nextUrl.origin は `next start -H 0.0.0.0` 等の環境で "http://0.0.0.0:3300" になり、
// ブラウザが実際に開いているホストと食い違う。そのため:
//   * リダイレクトは相対パスの Location で返す（ブラウザが今のホストを基準に解決する）
//   * Origin 検証はリクエストの Host ヘッダーと比較する
import { NextResponse, type NextRequest } from "next/server";

export function redirectTo(path: string, status: 302 | 303 | 307 = 303): NextResponse {
  return new NextResponse(null, { status, headers: { Location: path } });
}

/** 同一オリジンからのリクエストか（Origin ヘッダーが無い場合は許可: 同一オリジンのフォーム POST 等） */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}
