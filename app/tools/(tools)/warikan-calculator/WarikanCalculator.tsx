"use client";

import { useState, useMemo } from "react";

const ROUND_UNITS = [
  { label: "1円（端数そのまま）", value: 1 },
  { label: "10円単位", value: 10 },
  { label: "100円単位", value: 100 },
  { label: "500円単位", value: 500 },
];

export function WarikanCalculator() {
  const [total, setTotal] = useState("20000");
  const [people, setPeople] = useState("5");
  const [unit, setUnit] = useState(100);
  const [tilt, setTilt] = useState(false);
  const [heavyCount, setHeavyCount] = useState("1");
  const [heavyExtra, setHeavyExtra] = useState("1000");

  const r = useMemo(() => {
    const T = Math.max(0, Math.round(Number(total) || 0));
    const N = Math.max(1, Math.floor(Number(people) || 1));
    const roundUp = (v: number) => Math.ceil(v / unit) * unit;

    if (!tilt) {
      const per = roundUp(T / N);
      const collected = per * N;
      return {
        mode: "even" as const,
        per,
        collected,
        diff: collected - T,
        N,
      };
    }

    // 傾斜: 多めに払う人 heavyN が +extra を負担、残りで均等
    const heavyN = Math.min(N, Math.max(0, Math.floor(Number(heavyCount) || 0)));
    const extra = Math.max(0, Math.round(Number(heavyExtra) || 0));
    const lightN = N - heavyN;
    const heavyTotal = heavyN * extra;
    const remain = Math.max(0, T - heavyTotal);
    const lightPer = lightN > 0 ? roundUp(remain / lightN) : 0;
    const heavyPer = lightN > 0 ? lightPer + extra : roundUp(T / Math.max(1, heavyN));
    const collected = heavyPer * heavyN + lightPer * lightN;
    return {
      mode: "tilt" as const,
      heavyN, lightN, heavyPer, lightPer,
      collected,
      diff: collected - T,
      N,
    };
  }, [total, people, unit, tilt, heavyCount, heavyExtra]);

  const yen = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        合計金額と人数を入れるだけで、1人あたりの金額と集金の過不足がわかります。端数を100円単位などで丸め、上司や年上が多めに払う「傾斜配分」にも対応します。
      </div>

      {/* 入力 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">合計金額（円）</span>
          <input type="number" inputMode="numeric" min={0} value={total} onChange={(e) => setTotal(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">人数</span>
          <input type="number" inputMode="numeric" min={1} value={people} onChange={(e) => setPeople(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
      </div>

      <div>
        <span className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">1人あたりの丸め</span>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROUND_UNITS.map((u) => (
            <button key={u.value} onClick={() => setUnit(u.value)}
              className={`py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                unit === u.value ? "bg-violet-600 border-violet-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-violet-400"}`}>
              {u.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1.5">端数は集めやすいよう切り上げます。差額は幹事の調整分として表示します。</p>
      </div>

      {/* 傾斜 */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={tilt} onChange={(e) => setTilt(e.target.checked)} className="accent-violet-600" />
          <span className="text-[14px] font-medium text-slate-700 dark:text-zinc-200">傾斜配分（一部の人が多めに払う）</span>
        </label>
        {tilt && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[12px] text-slate-500 dark:text-zinc-400">多めに払う人数</span>
              <input type="number" min={0} value={heavyCount} onChange={(e) => setHeavyCount(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono" />
            </label>
            <label className="block">
              <span className="text-[12px] text-slate-500 dark:text-zinc-400">1人あたりの上乗せ額（円）</span>
              <input type="number" min={0} step={500} value={heavyExtra} onChange={(e) => setHeavyExtra(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono" />
            </label>
          </div>
        )}
      </div>

      {/* 結果 */}
      {r.mode === "even" ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">1人あたり</p>
          <p className="text-[48px] leading-none font-bold text-slate-900 dark:text-white">{yen(r.per)}</p>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
            集金合計 {yen(r.collected)}（実費との差 {r.diff >= 0 ? "+" : ""}{yen(r.diff)}）
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 text-center">
            <p className="text-[12px] text-slate-400 dark:text-zinc-500">多めに払う人（{r.heavyN}人）</p>
            <p className="text-[28px] font-bold text-slate-900 dark:text-white mt-1">{yen(r.heavyPer)}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 text-center">
            <p className="text-[12px] text-slate-400 dark:text-zinc-500">その他の人（{r.lightN}人）</p>
            <p className="text-[28px] font-bold text-slate-900 dark:text-white mt-1">{yen(r.lightPer)}</p>
          </div>
          <div className="col-span-2 text-center text-[13px] text-slate-500 dark:text-zinc-400">
            集金合計 {yen(r.collected)}（実費との差 {r.diff >= 0 ? "+" : ""}{yen(r.diff)}）
          </div>
        </div>
      )}

      {r.diff !== 0 && (
        <p className="text-[13px] text-center text-slate-500 dark:text-zinc-400">
          {r.diff > 0
            ? `集めすぎ分 ${yen(r.diff)} は幹事が受け取るか、次回に繰り越すとスマートです。`
            : `不足分 ${yen(-r.diff)} は幹事が負担する形になります。`}
        </p>
      )}
    </div>
  );
}
