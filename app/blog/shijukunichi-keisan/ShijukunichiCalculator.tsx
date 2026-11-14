"use client";

// 記事内の小さな計算機：命日を入れると四十九日・その前の土日・数え方の違い・注意点を出す
import { useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatJpDate, memorialPlan } from "@/lib/memorial-dates";

export function ShijukunichiCalculator() {
  const [death, setDeath] = useState("");
  const plan = death ? memorialPlan(death) : null;

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 p-5">
      <label htmlFor="shijukunichi-death" className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
        <CalendarDays className="w-5 h-5 text-slate-500" aria-hidden />
        命日を入れると、四十九日がすぐ分かります
      </label>
      <input
        id="shijukunichi-death"
        type="date"
        value={death}
        onChange={(e) => setDeath(e.target.value)}
        className="mt-3 w-full sm:w-64 px-3 py-2 min-h-[48px] rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-[16px]"
      />

      <div aria-live="polite">
        {plan && (
          <dl className="mt-4 grid gap-3 text-[14px]">
            <div className="rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 p-4">
              <dt className="text-[12px] text-slate-500 dark:text-zinc-400">四十九日（命日を1日目と数える一般的な数え方）</dt>
              <dd className="text-[20px] font-bold text-slate-900 dark:text-white mt-0.5">{formatJpDate(plan.day49)}</dd>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 p-4">
              <dt className="text-[12px] text-slate-500 dark:text-zinc-400">その日以前の土曜・日曜（法要を前倒しする場合の候補）</dt>
              <dd className="font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">
                {formatJpDate(plan.weekendBefore.sat, false)}・{formatJpDate(plan.weekendBefore.sun, false)}
              </dd>
            </div>
            {(plan.spansThreeMonths || plan.newYearOverlap) && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-amber-900 dark:text-amber-200">
                <dt className="font-semibold">日程を決める前に確認したいこと</dt>
                <dd className="mt-1 space-y-1">
                  {plan.spansThreeMonths && <p>命日の月から数えて3か月目にかかります（いわゆる「三月越し」）。気にするかどうかは地域や家によって違うため、お寺や親族に相談すると安心です。</p>}
                  {plan.newYearOverlap && <p>年末年始（12月29日〜1月3日）に重なります。お寺や会場の予定が限られることがあるため、早めに相談しましょう。</p>}
                </dd>
              </div>
            )}
          </dl>
        )}
        {plan && (
          <p className="mt-3 text-[12px] text-slate-500 dark:text-zinc-400">
            百箇日は {formatJpDate(plan.day100)}。一周忌・三回忌などは
            <Link href="/tools/houyou-calculator" className="text-blue-600 dark:text-blue-400 underline">法要日程計算ツール</Link>
            でまとめて確認できます。
          </p>
        )}
      </div>
    </div>
  );
}
