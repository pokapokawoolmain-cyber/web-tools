"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, Pencil, Plus } from "lucide-react";
import { formatEventDate } from "@/lib/goods/format";
import type { GoodsEvent } from "@/lib/goods/types";
import { btn } from "@/lib/goods/ui";
import { ShareButton } from "./ShareSheet";

export function EventHeader({ event, isOwner, fromCache = false }: { event: GoodsEvent; isOwner: boolean; fromCache?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const date = formatEventDate(event.startDate, event.endDate);
  const longDesc = (event.description?.length ?? 0) > 80 || (event.description?.split("\n").length ?? 0) > 2;

  return (
    <header>
      <Link
        href="/mochico/events"
        className="-ml-2 inline-flex min-h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        マイイベント
      </Link>

      {event.coverUrl && (
        <div className="mt-2 aspect-[5/2] w-full overflow-hidden rounded-2xl bg-slate-200 sm:aspect-[4/1] dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- 署名付きURL */}
          <img src={event.coverUrl} alt="" className="h-full w-full object-cover" fetchPriority="high" />
        </div>
      )}

      <div className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {!isOwner && (
            <p className="mb-1 inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-bold text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
              共有されたリスト
            </p>
          )}
          <h1 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl dark:text-white">{event.title}</h1>
          {date && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {date}
            </p>
          )}
        </div>
        {isOwner && !fromCache && (
          <div className="flex shrink-0 gap-2">
            <ShareButton eventId={event.id} eventTitle={event.title} />
            <Link href={`/mochico/events/${event.id}/edit`} className={`${btn.ghost} shrink-0 border border-slate-200 dark:border-zinc-800`} aria-label="イベントを編集">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">編集</span>
            </Link>
          </div>
        )}
      </div>

      {event.preserved && (
        <p role="status" className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:bg-zinc-900 dark:text-slate-300">
          このリストの作成者は退会しています。グッズの追加・編集は行われませんが、自分の取得状況はこれまでどおり記録できます。
        </p>
      )}

      {event.description && (
        <div className="mt-2">
          <p className={`whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300 ${!expanded && longDesc ? "line-clamp-2" : ""}`}>
            {event.description}
          </p>
          {longDesc && (
            <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="mt-1 min-h-9 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
              {expanded ? "閉じる" : "もっと見る"}
            </button>
          )}
        </div>
      )}

      {isOwner && !fromCache && (
        <div className="mt-3 hidden sm:block">
          <Link href={`/mochico/events/${event.id}/items/new`} className={btn.primary}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            グッズを登録
          </Link>
        </div>
      )}
    </header>
  );
}
