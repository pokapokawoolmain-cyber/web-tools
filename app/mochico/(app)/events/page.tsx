import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { getMyEvents, requireUser } from "@/lib/goods/data";
import { formatEventDate, progressPercent } from "@/lib/goods/format";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ProgressBar } from "../_components/ProgressBar";
import { StateMessage } from "../_components/StateMessage";
import { HomeScreenPrompt } from "../_components/HomeScreenPrompt";
import { AppMascot } from "@/components/mochico/MascotColorContext";


export const metadata: Metadata = { title: "マイイベント" };

export default async function MyEventsPage() {
  const { supabase, user } = await requireUser("/mochico/events");
  const events = await getMyEvents(supabase);

  if (events.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <HomeScreenPrompt userId={user.id} />
        </div>
        <StateMessage
        plainIcon
        icon={<AppMascot size={72} state="peek" />}
        title="最初のイベントを作りましょう"
        action={{ href: "/mochico/events/new", label: "イベントを作成" }}
      >
        ライブやイベントを作って、グッズの写真と価格を登録すると、取得状況を一覧で管理できます。
        </StateMessage>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <HomeScreenPrompt userId={user.id} />
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">マイイベント</h1>
        <Link href="/mochico/events/new" className={cn(btn.primary, "hidden sm:inline-flex")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          イベントを作成
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => {
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
                      {date}
                    </p>
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

      {/* スマホ: 親指の届く位置に作成ボタン */}
      <Link
        href="/mochico/events/new"
        className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 sm:hidden"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        aria-label="イベントを作成"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </Link>
    </div>
  );
}
