// ============================================================
// 旧URL /goods（開発時の仮名称）→ Mochico への恒久リダイレクト（段階移行）
//   /goods → /mochico/app、/goods/<path> → /mochico/<path>（クエリは維持）
//   /goods/s/<token> も /mochico/s/<token> へ。転送先の入口がトークンを HttpOnly Cookie に移し、
//   トークンを含まない URL へ再リダイレクトする（Phase 2 の設計をそのまま使う）。
//   この応答は HTML を返さないため、計測スクリプトがトークン入り URL を記録することはない。
// ============================================================
import type { NextRequest } from "next/server";

function target(request: NextRequest, path: string[] | undefined): string {
  const rest = (path ?? []).map(encodeURIComponent).join("/");
  const dest = rest ? `/mochico/${rest}` : "/mochico/app";
  return dest + request.nextUrl.search;
}

function redirect(request: NextRequest, path: string[] | undefined) {
  return new Response(null, {
    status: 308,
    headers: { Location: target(request, path), "Referrer-Policy": "no-referrer", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

type Ctx = { params: Promise<{ path?: string[] }> };
export async function GET(request: NextRequest, { params }: Ctx) {
  return redirect(request, (await params).path);
}
export async function POST(request: NextRequest, { params }: Ctx) {
  return redirect(request, (await params).path);
}
