"use client";

import { useState, useMemo } from "react";

// 忌日法要（命日を1日目と数える。四十九日 = 命日 + 48日）
const KICHI = [
  { name: "初七日", days: 6, note: "近年は葬儀当日に繰り上げて行うことが多い" },
  { name: "二七日（ふたなのか）", days: 13, note: "" },
  { name: "三七日（みなのか）", days: 20, note: "" },
  { name: "四七日（よなのか）", days: 27, note: "" },
  { name: "五七日（いつなのか）", days: 34, note: "三十五日。地域により忌明けとする場合も" },
  { name: "六七日（むなのか）", days: 41, note: "" },
  { name: "四十九日（七七日）", days: 48, note: "忌明け。納骨を行うことが多い最重要の法要", highlight: true },
  { name: "百箇日", days: 99, note: "" },
];

// 年忌法要（一周忌 = 満1年後。三回忌以降 = 回忌数 − 1 年後）
const NENKI = [
  { name: "一周忌", years: 1, note: "満1年目の祥月命日。親族・知人を招いて営む", highlight: true },
  { name: "三回忌", years: 2, note: "満2年目。以降は親族中心で" },
  { name: "七回忌", years: 6, note: "" },
  { name: "十三回忌", years: 12, note: "" },
  { name: "十七回忌", years: 16, note: "" },
  { name: "二十三回忌", years: 22, note: "" },
  { name: "二十七回忌", years: 26, note: "" },
  { name: "三十三回忌", years: 32, note: "弔い上げ（最後の法要）とすることが多い" },
  { name: "五十回忌", years: 49, note: "" },
];

const WD = ["日", "月", "火", "水", "木", "金", "土"];

function fmt(d: Date): { date: string; wd: string; isWeekend: boolean } {
  const wd = d.getDay();
  return {
    date: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`,
    wd: WD[wd],
    isWeekend: wd === 0 || wd === 6,
  };
}

export function HouyouCalculator() {
  const [deathDate, setDeathDate] = useState("");

  const result = useMemo(() => {
    if (!deathDate) return null;
    const base = new Date(deathDate + "T00:00:00");
    if (isNaN(base.getTime())) return null;

    const kichi = KICHI.map((k) => {
      const d = new Date(base);
      d.setDate(d.getDate() + k.days);
      return { ...k, ...fmt(d) };
    });
    const nenki = NENKI.map((n) => {
      const d = new Date(base);
      d.setFullYear(d.getFullYear() + n.years);
      return { ...n, ...fmt(d) };
    });
    return { kichi, nenki };
  }, [deathDate]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <label htmlFor="deathDate" className="block font-bold text-slate-900 dark:text-white text-sm">
          命日（ご逝去日）を入力
        </label>
        <input
          id="deathDate"
          type="date"
          value={deathDate}
          onChange={(e) => setDeathDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="text-xs text-slate-400 dark:text-zinc-500">
          ※ 忌日は命日を1日目と数えます（四十九日 ＝ 命日を含めて49日目）。関西の一部では命日の前日から数える風習もあります。
        </p>
      </div>

      {!result ? (
        <div className="text-center py-12 text-slate-400 dark:text-zinc-600 text-sm">
          命日を入力すると、忌日法要・年忌法要の日程が表示されます。
        </div>
      ) : (
        <>
          {/* 忌日法要 */}
          <section>
            <h2 className="font-bold text-slate-900 dark:text-white mb-3">忌日法要（四十九日まで）</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                    <th className="text-left font-medium px-4 py-2.5">法要</th>
                    <th className="text-left font-medium px-4 py-2.5">日付</th>
                    <th className="text-left font-medium px-4 py-2.5 hidden sm:table-cell">備考</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {result.kichi.map((k) => (
                    <tr key={k.name} className={k.highlight ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}>
                      <td className={`px-4 py-3 font-medium ${k.highlight ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-zinc-200"}`}>
                        {k.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                        {k.date}（{k.wd}）
                        {k.isWeekend && <span className="ml-1 text-[11px] text-rose-500">土日</span>}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-zinc-500 hidden sm:table-cell">{k.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 年忌法要 */}
          <section>
            <h2 className="font-bold text-slate-900 dark:text-white mb-3">年忌法要（一周忌以降）</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                    <th className="text-left font-medium px-4 py-2.5">法要</th>
                    <th className="text-left font-medium px-4 py-2.5">日付</th>
                    <th className="text-left font-medium px-4 py-2.5 hidden sm:table-cell">備考</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {result.nenki.map((n) => (
                    <tr key={n.name} className={n.highlight ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}>
                      <td className={`px-4 py-3 font-medium ${n.highlight ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-zinc-200"}`}>
                        {n.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                        {n.date}（{n.wd}）
                        {n.isWeekend && <span className="ml-1 text-[11px] text-rose-500">土日</span>}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-zinc-500 hidden sm:table-cell">{n.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 text-[13px] text-amber-800 dark:text-amber-300">
            法要は算出日ちょうどではなく、参列者が集まりやすい<strong>直前の土曜・日曜</strong>に繰り上げて営むのが一般的です。菩提寺・参列者と早めに日程を調整してください。
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 dark:text-zinc-600 text-center">
        ※ 宗派・地域により数え方や営む法要が異なります。菩提寺にご確認ください。
      </p>
    </div>
  );
}
