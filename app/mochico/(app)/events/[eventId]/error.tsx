"use client";
// イベント詳細の読み込み失敗。オフラインなら IndexedDB の前回表示データを読み取り専用で出す。
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, WifiOff } from "lucide-react";
import { loadSnapshot, type EventSnapshot } from "@/lib/goods/cache/idb";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { btn } from "@/lib/goods/ui";
import { EventHeader } from "../../_components/EventHeader";
import { GoodsBoard } from "../../_components/GoodsBoard";

export default function EventError({ reset }: { error: Error; reset: () => void }) {
  const { eventId } = useParams<{ eventId: string }>();
  const [snap, setSnap] = useState<EventSnapshot | null | undefined>(undefined);
  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  useEffect(() => {
    // 端末内に保存されているセッション（通信不要）から本人を特定し、本人のスナップショットだけを出す。
    // 共有イベントは同じイベントIDで複数ユーザーのキャッシュがあり得るため、他人の取得状況を出さない。
    (async () => {
      try {
        const { data } = await goodsBrowserClient().auth.getSession();
        const uid = data.session?.user.id;
        setSnap(uid ? (await loadSnapshot(uid, eventId)) ?? null : null);
      } catch {
        setSnap(null);
      }
    })();
  }, [eventId]);

  useEffect(() => {
    const onOnline = () => reset();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [reset]);

  if (snap === undefined) return null;

  if (snap) {
    const saved = new Date(snap.savedAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    return (
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div role="status" className="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">
            {offline ? "オフラインのため" : "読み込みに失敗したため"}、{saved} 時点の内容を表示しています（閲覧のみ）。
          </span>
          <button type="button" onClick={reset} className="shrink-0 font-bold underline">
            再読み込み
          </button>
        </div>
        <EventHeader event={snap.event} isOwner={snap.isOwner} fromCache />
        <GoodsBoard userId={snap.userId} event={snap.event} goods={snap.goods} initialStatuses={snap.statuses} isOwner={snap.isOwner} fromCache />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" aria-hidden="true">
        {offline ? <WifiOff className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
      </div>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{offline ? "オフラインです" : "読み込みに失敗しました"}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">通信が戻ったら、もう一度お試しください。</p>
      <button type="button" onClick={reset} className={`${btn.primary} mt-7`}>
        再読み込み
      </button>
    </div>
  );
}
