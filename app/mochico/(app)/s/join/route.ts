// 「自分の管理に追加」: Cookie のトークンでサーバー側から参加 RPC を呼ぶ（POST のみ・Origin 検証）
//   event / goods はコピーしない。event_memberships に本人の1行を作るだけ（重複は DB が防ぐ）。
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { goodsServerClient } from "@/lib/goods/supabase/server";
import { SHARE_COOKIE, SHARE_COOKIE_PATH, isShareTokenFormat } from "@/lib/goods/share";
import { isSameOrigin } from "@/lib/goods/http";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const store = await cookies();
  const token = store.get(SHARE_COOKIE)?.value;
  if (!isShareTokenFormat(token)) return NextResponse.json({ status: "invalid" }, { status: 400 });

  const supabase = await goodsServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ status: "login_required" }, { status: 401 });

  const { data, error } = await supabase.rpc("goods_join_via_share", { p_token: token });
  if (error || !data) return NextResponse.json({ status: "error" }, { status: 500 });
  const result = data as { status: string; event_id?: string };

  const res = NextResponse.json(
    { status: result.status, eventId: result.event_id ?? null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
  // 参加できた（または既に参加済み）ならトークンはもう不要
  if (["joined", "already", "owner"].includes(result.status)) {
    res.cookies.set(SHARE_COOKIE, "", { path: SHARE_COOKIE_PATH, maxAge: 0 });
  }
  return res;
}
