"use client";

import { useState, useMemo } from "react";

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtJP(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEK[d.getDay()]}）`;
}

export function DateCalculator() {
  const today = new Date();
  const [mode, setMode] = useState<"diff" | "shift">("diff");

  // 差モード
  const [from, setFrom] = useState(ymd(today));
  const [to, setTo] = useState(ymd(today));
  const [includeEnd, setIncludeEnd] = useState(false);

  // 加減モード
  const [origin, setOrigin] = useState(ymd(today));
  const [amount, setAmount] = useState(100);
  const [dir, setDir] = useState<"after" | "before">("after");
  const [unit, setUnit] = useState<"day" | "week" | "month" | "year">("day");

  const diff = useMemo(() => {
    const a = new Date(from + "T00:00:00");
    const b = new Date(to + "T00:00:00");
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const days = Math.round((b.getTime() - a.getTime()) / 86400000);
    const abs = Math.abs(days) + (includeEnd ? 1 : 0);
    // 年月日での内訳（概算）
    let y = b.getFullYear() - a.getFullYear();
    let m = b.getMonth() - a.getMonth();
    let d = b.getDate() - a.getDate();
    if (d < 0) { m -= 1; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y -= 1; m += 12; }
    return { days, abs, y: Math.abs(y), m: Math.abs(m), d: Math.abs(d) };
  }, [from, to, includeEnd]);

  const shifted = useMemo(() => {
    const o = new Date(origin + "T00:00:00");
    if (isNaN(o.getTime())) return null;
    const sign = dir === "after" ? 1 : -1;
    const n = sign * amount;
    const r = new Date(o);
    if (unit === "day") r.setDate(r.getDate() + n);
    else if (unit === "week") r.setDate(r.getDate() + n * 7);
    else if (unit === "month") r.setMonth(r.getMonth() + n);
    else r.setFullYear(r.getFullYear() + n);
    return r;
  }, [origin, amount, dir, unit]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* モード切替 */}
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
        {([["diff", "2つの日付の差"], ["shift", "○日後・○日前"]] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === v ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "diff" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">開始日</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100" />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">終了日</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100" />
            </label>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-zinc-400 px-1">
            <input type="checkbox" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} className="accent-violet-500" />
            初日を含めて数える（両端を含む）
          </label>

          {diff && (
            <>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
                <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">日数</p>
                <p className="text-[52px] leading-none font-bold text-slate-900 dark:text-white">
                  {diff.abs.toLocaleString()}<span className="text-2xl font-semibold ml-1">日</span>
                </p>
                <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
                  約 {diff.y}年 {diff.m}か月 {diff.d}日
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "週", value: `${(diff.abs / 7).toFixed(1)}週` },
                  { label: "月（概算）", value: `${(diff.abs / 30.44).toFixed(1)}か月` },
                  { label: "年（概算）", value: `${(diff.abs / 365.25).toFixed(2)}年` },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3 text-center">
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">{c.label}</p>
                    <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">{c.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <label className="block">
            <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">基準日</span>
            <input type="date" value={origin} onChange={(e) => setOrigin(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100" />
          </label>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">数量</span>
              <input type="number" min={0} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1.5 w-24 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono" />
            </label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
              <option value="day">日</option>
              <option value="week">週</option>
              <option value="month">か月</option>
              <option value="year">年</option>
            </select>
            <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
              {([["after", "後"], ["before", "前"]] as const).map(([v, label]) => (
                <button key={v} onClick={() => setDir(v)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${dir === v ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {shifted && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
              <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2">
                {amount}{unit === "day" ? "日" : unit === "week" ? "週" : unit === "month" ? "か月" : "年"}{dir === "after" ? "後" : "前"}の日付
              </p>
              <p className="text-[32px] leading-tight font-bold text-slate-900 dark:text-white">{fmtJP(shifted)}</p>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">{ymd(shifted)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
