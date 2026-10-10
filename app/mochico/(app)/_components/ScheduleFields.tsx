"use client";
// ============================================================
// 予約・販売スケジュールの入力欄（イベント・グッズ共通）
//   * 各項目: 日付（必須ではない）＋ 時刻（空欄 = 日付のみ）＋ クリア
//   * iPhone Safari の日付欄は一度入れると空に戻しにくいため、必ずクリアボタンを付ける
//   * 日付欄は既存のはみ出し対策（field.dateInput）を使い、項目は縦に並べる
// ============================================================
import { X } from "lucide-react";
import type { Schedule } from "@/lib/goods/schedule";
import { field } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";

type DateKey = "reserveStartDate" | "reserveEndDate" | "saleStartDate";
type TimeKey = "reserveStartTime" | "reserveEndTime" | "saleStartTime";

const ROWS: { label: string; date: DateKey; time: TimeKey; hint?: string }[] = [
  { label: "予約開始", date: "reserveStartDate", time: "reserveStartTime" },
  { label: "予約締切", date: "reserveEndDate", time: "reserveEndTime", hint: "時刻を空欄にすると、その日の 23:59 まで受付" },
  { label: "販売開始", date: "saleStartDate", time: "saleStartTime" },
];

export function ScheduleFields({
  idPrefix,
  value,
  onChange,
  disabled,
  error,
}: {
  idPrefix: string;
  value: Schedule;
  onChange: (next: Schedule) => void;
  disabled?: boolean;
  error?: string;
}) {
  const set = (patch: Partial<Schedule>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-4">
      {ROWS.map((r) => {
        const date = value[r.date] ?? "";
        const time = value[r.time] ?? "";
        const invalid = !!error && r.date === "reserveEndDate";
        return (
          <div key={r.date}>
            <span id={`${idPrefix}-${r.date}-label`} className={field.label}>
              {r.label}
            </span>
            {/* 幅が足りないとき（320px など）は時刻とクリアを次の行へ折り返す。日付も時刻も切れないようにする */}
            <div className="flex flex-wrap items-end gap-x-2">
              <div className="min-w-[9.75rem] flex-1 basis-[9.75rem]">
                <input
                  id={`${idPrefix}-${r.date}`}
                  type="date"
                  value={date}
                  disabled={disabled}
                  aria-label={`${r.label}の日付`}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? `${idPrefix}-schedule-err` : undefined}
                  onChange={(e) => set({ [r.date]: e.target.value || null, ...(e.target.value ? {} : { [r.time]: null }) } as Partial<Schedule>)}
                  className={field.dateInput}
                />
              </div>
              <div className="w-[7rem] shrink-0">
                <input
                  id={`${idPrefix}-${r.time}`}
                  type="time"
                  value={time}
                  disabled={disabled || !date}
                  aria-label={`${r.label}の時刻（任意）`}
                  onChange={(e) => set({ [r.time]: e.target.value || null } as Partial<Schedule>)}
                  className={cn(field.dateInput, "disabled:opacity-50")}
                />
              </div>
              <button
                type="button"
                disabled={disabled || (!date && !time)}
                onClick={() => set({ [r.date]: null, [r.time]: null } as Partial<Schedule>)}
                aria-label={`${r.label}をクリア`}
                className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {r.hint && <p className={field.hint}>{r.hint}</p>}
          </div>
        );
      })}
      {error && (
        <p id={`${idPrefix}-schedule-err`} role="alert" className={field.error}>
          {error}
        </p>
      )}
      <p className={field.hint}>日時はすべて日本時間です。時刻は空欄でもかまいません。</p>
    </div>
  );
}
