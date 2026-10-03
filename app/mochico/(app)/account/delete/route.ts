// 退会（POST のみ・同一オリジン・本人のセッション必須）
//   本人のアカウントだけを削除する（他人の userId は受け取らない）。
import { NextResponse, type NextRequest } from "next/server";
import { goodsServerClient } from "@/lib/goods/supabase/server";
import { deleteAccount } from "@/lib/goods/account";
import { isSameOrigin } from "@/lib/goods/http";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  const supabase = await goodsServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ ok: false, reason: "login_required" }, { status: 401 });

  try {
    await deleteAccount(data.user.id);
  } catch {
    // 内部情報は返さない。もう一度実行すれば続きから完了する
    return NextResponse.json({ ok: false, reason: "failed" }, { status: 500 });
  }
  // セッション Cookie を消す（ユーザーは既に存在しないため、ローカルのセッション破棄のみ）
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}
