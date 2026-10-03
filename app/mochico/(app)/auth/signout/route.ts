// ログアウト（POST のみ。GET で踏ませてログアウトさせる CSRF を避ける）
import { NextResponse, type NextRequest } from "next/server";
import { goodsServerClient } from "@/lib/goods/supabase/server";
import { isSameOrigin, redirectTo } from "@/lib/goods/http";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return new NextResponse("forbidden", { status: 403 });
  }
  const supabase = await goodsServerClient();
  await supabase.auth.signOut();
  return redirectTo("/mochico/login?signedout=1");
}
