// CEO Dashboard 向けの集計エンドポイント（サーバー間専用）
//   返すのは mochico_dashboard_stats() の集計値だけ（件数・日別件数）。個人情報・共有トークンは含まない。
//   MOCHICO_STATS_SECRET が未設定（または32文字未満）なら存在しないものとして 404。
//   Authorization: Bearer <MOCHICO_STATS_SECRET> が一致した場合のみ応答する（cleanup と同じ方式）。
//   service role key は Mochico 側のサーバーから外に出ない（CEO Dashboard はこの秘密値だけを持つ）。
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { goodsAdminClient } from "@/lib/goods/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow" };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function authorized(request: NextRequest): boolean {
  const secret = process.env.MOCHICO_STATS_SECRET;
  if (!secret || secret.length < 32) return false;
  const given = Buffer.from(request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "");
  const want = Buffer.from(secret);
  return given.length === want.length && timingSafeEqual(given, want);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return new NextResponse(null, { status: 404, headers: NO_STORE });

  // 日別系列の開始日（JST の日付）。形式が不正なら関数の既定（直近90日）に任せる。
  const from = request.nextUrl.searchParams.get("from");
  const pFrom = from && DATE_RE.test(from) ? from : null;

  try {
    const { data, error } = await goodsAdminClient().rpc("mochico_dashboard_stats", { p_from: pFrom });
    if (error || !data) {
      // エラー本文は返さない・記録しない（クエリ内容を外へ出さない）。コードだけ残す。
      console.error("[mochico-stats] rpc failed", error?.code ?? "no_data");
      return NextResponse.json({ ok: false }, { status: 502, headers: NO_STORE });
    }
    return NextResponse.json({ ok: true, stats: data }, { headers: NO_STORE });
  } catch {
    console.error("[mochico-stats] unexpected failure");
    return NextResponse.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
