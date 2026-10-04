// ============================================================
// middleware は Mochico アプリ本体の画面でだけ動く（セッション更新）。
// 公開 LP（/mochico）・アイコン・OG 画像・マニフェスト・ToolBox の既存ページには一切介入しない。
// ============================================================
import type { NextRequest } from "next/server";
import { refreshGoodsSession } from "@/lib/goods/supabase/middleware";

export async function middleware(request: NextRequest) {
  return refreshGoodsSession(request);
}

export const config = {
  matcher: ["/mochico/(app|events|settings|login|auth|s|account)", "/mochico/(app|events|settings|login|auth|s|account)/:path*"],
};
