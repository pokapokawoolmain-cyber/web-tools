"use client";

import { useState, useMemo } from "react";
import { ERAS, toWareki, fromWareki } from "@/lib/wareki";

export function WarekiConverter() {
  const nowY = new Date().getFullYear();
  const [mode, setMode] = useState<"seireki" | "wareki">("seireki");

  // 西暦 → 和暦
  const [year, setYear] = useState(nowY);

  // 和暦 → 西暦
  const [era, setEra] = useState("令和");
  const [eraYear, setEraYear] = useState(1);

  const toW = useMemo(() => {
    // 年の途中の改元も考慮できるよう、年末(12/31)基準で判定しつつ、その年に該当する元号を返す
    const w = toWareki(year, 12, 31);
    return w;
  }, [year]);

  const toS = useMemo(() => {
    const s = fromWareki(era, eraYear);
    return s;
  }, [era, eraYear]);

  const maxYearFor = (name: string) => {
    const idx = ERAS.findIndex((e) => e.name === name);
    if (idx <= 0) return nowY - ERAS[idx].startY + 1; // 最新元号
    const next = ERAS[idx - 1];
    const cur = ERAS[idx];
    return next.startY - cur.startY + 1;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
        {([["seireki", "西暦 → 和暦"], ["wareki", "和暦 → 西暦"]] as const).map(([v, label]) => (
          <button key={v} onClick={() => setMode(v)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === v ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === "seireki" ? (
        <>
          <label className="block">
            <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">西暦（年）</span>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="number" min={1868} max={2100} value={year}
                onChange={(e) => setYear(Math.min(2100, Math.max(1868, Number(e.target.value) || nowY)))}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-xl text-right" />
              <span className="text-slate-500 dark:text-zinc-400">年</span>
            </div>
          </label>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">和暦</p>
            <p className="text-[44px] leading-none font-bold text-slate-900 dark:text-white">
              {toW ? toW.text : "明治より前"}
            </p>
            {toW && (
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
                {toW.initial}{toW.yearInEra}・{year}年
              </p>
            )}
          </div>
          {year >= 1912 && year <= 1989 && (
            <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
              ※ {year}年は改元のあった年の可能性があります。改元日の前後で元号が変わるため、正確には月日で判断してください。
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">元号</span>
              <select value={era} onChange={(e) => { setEra(e.target.value); setEraYear(1); }}
                className="mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
                {ERAS.map((e) => <option key={e.name} value={e.name}>{e.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">年（元年＝1）</span>
              <input type="number" min={1} max={maxYearFor(era)} value={eraYear}
                onChange={(e) => setEraYear(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1.5 w-28 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-right" />
            </label>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">西暦</p>
            <p className="text-[44px] leading-none font-bold text-slate-900 dark:text-white">
              {toS ? `${toS}年` : "—"}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
              {era}{eraYear === 1 ? "元" : eraYear}年
            </p>
          </div>
        </>
      )}
    </div>
  );
}
