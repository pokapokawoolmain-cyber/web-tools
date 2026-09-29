// ============================================================
// POST /api/sns-starter-kit/reservations — 先行予約の登録
//
// これは購入・予約金・前金ではない。販売開始時の案内先を登録するだけ。
// 応答は ReservationApiResponse の形に固定し、入力値や内部エラーを返さない。
// ============================================================
import { NextResponse, type NextRequest } from "next/server";
import { validateReservationInput, type ReservationApiResponse } from "@/lib/sns-starter-kit/reservation";
import { forcedFailureForQa, getReservationStore } from "@/lib/sns-starter-kit/reservation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;

// ── 簡易レート制限（インスタンス単位のベストエフォート） ───────────
// 同一IPから 10分間に 8回まで。本格的な防御ではなく、連打・単純なスクリプトの抑止。
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // メモリ保護
  return recent.length > MAX_PER_WINDOW;
}

function reply(body: ReservationApiResponse, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  // 同一オリジン以外からの送信は受け付けない（Origin が無いクライアントは許容）
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return reply({ result: "error" }, 403);
  }

  // Vercel では x-real-ip / x-forwarded-for をプラットフォームが設定する（クライアントの自己申告値ではない）
  const ip =
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (rateLimited(ip)) return reply({ result: "rate_limited" }, 429);

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return reply({ result: "error" }, 413);
    raw = JSON.parse(text);
  } catch {
    return reply({ result: "error" }, 400);
  }

  // ボット対策のおとり欄（画面には表示しない）。値が入っていたら保存せず成功扱いにする。
  if (raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).website === "string" && (raw as Record<string, string>).website !== "") {
    return reply({ result: "reserved" }, 200);
  }

  const parsed = validateReservationInput(raw);
  if (!parsed.ok) return reply({ result: "invalid", errors: parsed.errors }, 422);

  const store = getReservationStore();
  if (!store) return reply({ result: "unavailable" }, 503);

  if (forcedFailureForQa()) return reply({ result: "error" }, 500);

  try {
    // 新規でも登録済みでも同じ応答・同じステータスを返す（メールアドレスの登録有無を漏らさない）。
    // 登録済みの場合は保存を行わない（DBの一意制約で重複行は作られない）。
    await store.save(parsed.value);
    return reply({ result: "reserved" }, 200);
  } catch (e) {
    console.error("[sns-starter-kit] reservation save failed:", e instanceof Error ? e.message : "unknown");
    return reply({ result: "error" }, 500);
  }
}
