"use client";
// ============================================================
// 予約・販売スケジュールの表示（未設定なら何も出さない）
//   * 予約: 予約前 / 受付中（残り日数・時間）/ 予約終了。色だけでなくアイコンと文字で区別する
//   * 販売開始は予約とは別の行
//   * 残り時間は 1 分ごとに更新。サーバー描画との差（数秒〜数分）は表示の文字だけなので hydration の警告を抑える
// ============================================================
import { useEffect, useState } from "react";
import { Clock, ShoppingBag } from "lucide-react";
import { EMPTY_SCHEDULE, reservationSummary, saleSummary, type Schedule } from "@/lib/goods/schedule";
import { cn } from "@/lib/utils";

export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const TONE = {
  open: "text-pink-700 dark:text-pink-300",
  urgent: "text-red-700 dark:text-red-300",
  before: "text-blue-700 dark:text-blue-300",
  closed: "text-slate-500 dark:text-slate-400",
} as const;

/** 一行の表示（イベント一覧・グッズのカード用）。予約が未設定なら販売開始、どちらも無ければ何も出さない */
export function ScheduleLine({ schedule, className, compact }: { schedule: Schedule | undefined; className?: string; compact?: boolean }) {
  const now = useNow();
  const s = schedule ?? EMPTY_SCHEDULE;
  const r = reservationSummary(s, now);
  if (r) {
    const tone = r.state === "open" ? (r.urgent ? TONE.urgent : TONE.open) : r.state === "before" ? TONE.before : TONE.closed;
    return (
      <span className={cn("flex min-w-0 items-center gap-1 text-xs font-bold", tone, className)} data-schedule-state={r.state}>
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate" suppressHydrationWarning>
          {r.label}
          {!compact && r.detail && <span className="font-medium">（{r.detail}）</span>}
        </span>
      </span>
    );
  }
  const sale = saleSummary(s, now);
  if (!sale) return null;
  return (
    <span className={cn("flex min-w-0 items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300", className)} data-schedule-state="sale">
      <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate" suppressHydrationWarning>{sale}</span>
    </span>
  );
}

/** 詳しい表示（イベントの見出し・商品詳細用）。予約と販売開始を別の行で */
export function ScheduleDetail({ schedule, source, className }: { schedule: Schedule | undefined; source?: "event" | "own"; className?: string }) {
  const now = useNow();
  const s = schedule ?? EMPTY_SCHEDULE;
  const r = reservationSummary(s, now);
  const sale = saleSummary(s, now);
  if (!r && !sale) return null;
  const tone = r ? (r.state === "open" ? (r.urgent ? TONE.urgent : TONE.open) : r.state === "before" ? TONE.before : TONE.closed) : "";
  return (
    <div className={cn("space-y-1", className)} data-testid="schedule-detail">
      {r && (
        <p className={cn("flex items-start gap-1.5 text-sm font-bold", tone)} data-schedule-state={r.state}>
          <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span suppressHydrationWarning>
            {r.label}
            {r.detail && <span className="block text-xs font-medium sm:inline sm:pl-1">{r.detail}</span>}
          </span>
        </p>
      )}
      {sale && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span suppressHydrationWarning>{sale}</span>
        </p>
      )}
      {source && <p className="text-xs text-slate-500 dark:text-slate-400">{source === "own" ? "このグッズだけの設定" : "イベントの設定"}</p>}
    </div>
  );
}
