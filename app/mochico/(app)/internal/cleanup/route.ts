// cleanup の定期実行用エンドポイント
//   本番は Vercel Cron（vercel.json の crons・日次）が GET で呼ぶ。Vercel は CRON_SECRET を
//   Authorization: Bearer <CRON_SECRET> として送るため、CRON_SECRET には GOODS_CLEANUP_SECRET と同じ値を設定する。
//   GOODS_CLEANUP_SECRET が未設定（または32文字未満）なら存在しないものとして 404。
//   Authorization: Bearer <GOODS_CLEANUP_SECRET> が一致した場合のみ実行。
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runOrphanCleanup } from "@/lib/goods/account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: NextRequest) {
  const secret = process.env.GOODS_CLEANUP_SECRET;
  if (!secret || secret.length < 32) return new NextResponse(null, { status: 404 });
  const given = Buffer.from(request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "");
  const want = Buffer.from(secret);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return new NextResponse(null, { status: 404 });
  try {
    const r = await runOrphanCleanup();
    return NextResponse.json({ ok: true, deletedEvents: r.deletedEventIds.length, orphanFolders: r.orphanStorageEventIds.length, removedImages: r.removedImages });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
