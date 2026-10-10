"use client";
// マイイベントの一覧（並び替え: 従来の順 / 予約期限が近い順）
import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatEventDate, progressPercent } from "@/lib/goods/format";
import { compareDeadline, EMPTY_SCHEDULE, hasReservation } from "@/lib/goods/schedule";
import type { MyEventSummary } from "@/lib/goods/types";
import { ProgressBar } from "./ProgressBar";
import { ScheduleLine, useNow } from "./ScheduleInfo";

type EventSort = "default" | "deadline";

export function EventList({ events }: { events: MyEventSummary[] }) {
  const now = useNow();
  const [sort, setSort] = useState<EventSort>("default");
  // 予約期間が設定されたイベントが1つも無ければ、並び替えは出さない（不要な操作を増やさない）
  const anySchedule = events.some((e) => hasReservation(e.schedule ?? EMPTY_SCHEDULE));
  const sorted = useMemo(
    () => (sort === "deadline" ? [...events].sort((a, b) => compareDeadline(a.schedule ?? EMPTY_SCHEDULE, b.schedule ?? EMPTY_SCHEDULE, now)) : events),
    [events, sort, now]
  );
  return (
    <>
      {anySchedule && (
        <div className="mb-3 flex justify-end">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            並び替え
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as EventSort)}
              aria-label="イベントの並び替え"
              className="h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-sm font-bold text-slate-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100"
            >
              <option value="default">新しい順</option>
              <option value="deadline">予約期限が近い順</option>
            </select>
          </label>
        </div>
      )}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((ev) => {
            const date = formatEventDate(ev.startDate, ev.endDate);
            const pct = progressPercent(ev.owned, ev.total);
            const done = ev.total > 0 && ev.owned === ev.total;
            return (
              <li key={ev.id}>
                <Link
                  href={`/mochico/events/${ev.id}`}
                  className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    {ev.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- 署名付きURLのサムネ（最適化済み）を直接表示
                      <img src={ev.coverUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-fuchsia-100 text-2xl dark:from-pink-950/60 dark:to-fuchsia-950/60" aria-hidden="true">
                        🎤
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start gap-2">
                      <h2 className="line-clamp-2 flex-1 text-[15px] font-bold leading-snug text-slate-900 dark:text-white">{ev.title}</h2>
                      {ev.deleted ? (
                        <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          削除済み
                        </span>
                      ) : ev.preserved ? (
                        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                          作成者退会
                        </span>
                      ) : (
                        ev.role === "member" && (
                          <span className="shrink-0 rounded-md bg-pink-50 px-1.5 py-0.5 text-[11px] font-bold text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
                            共有
                          </span>
                        )
                      )}
                    </div>
                    {date && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">開催日</span>
                        {date}
                      </p>
                    )}
                    {/* 予約・販売（D3: イベント自身の設定だけ。グッズ個別の設定はイベントの期間として表示しない） */}
                    <ScheduleLine schedule={ev.schedule} compact className="mt-1" />
                    {ev.goodsScheduleCount > 0 && (
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">個別の予約期限あり（{ev.goodsScheduleCount}件）</p>
                    )}
                    <div className="mt-auto pt-2">
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {ev.owned} / {ev.total}
                          <span className="ml-1 font-normal text-slate-500 dark:text-slate-400">取得</span>
                        </span>
                        <span className={done ? "font-bold text-pink-600 dark:text-pink-400" : "text-slate-500 dark:text-slate-400"}>
                          {done ? "コンプリート！" : `${pct}%`}
                        </span>
                      </div>
                      <ProgressBar owned={ev.owned} total={ev.total} size="sm" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
    </>
  );
}
