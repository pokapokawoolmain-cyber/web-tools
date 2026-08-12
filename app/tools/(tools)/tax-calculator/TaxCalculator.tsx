"use client";

import { useState, useMemo } from "react";
import { CopyResultButton } from "@/components/ui/CopyResultButton";

type Mode = "toIncluded" | "toExcluded";

export function TaxCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(10);
  const [mode, setMode] = useState<Mode>("toIncluded");
  const [rounding, setRounding] = useState<"floor" | "round" | "ceil">("floor");

  const result = useMemo(() => {
    const round = (v: number) =>
      rounding === "floor" ? Math.floor(v) : rounding === "ceil" ? Math.ceil(v) : Math.round(v);
    const r = rate / 100;
    if (mode === "toIncluded") {
      const tax = round(amount * r);
      return { excluded: amount, tax, included: amount + tax };
    } else {
      // 税込 → 税抜
      const excluded = round(amount / (1 + r));
      return { excluded, tax: amount - excluded, included: amount };
    }
  }, [amount, rate, mode, rounding]);

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 変換方向 */}
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
        {([["toIncluded", "税抜 → 税込"], ["toExcluded", "税込 → 税抜"]] as const).map(([v, label]) => (
          <button key={v} onClick={() => setMode(v)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === v ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* 金額入力 */}
      <label className="block">
        <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">
          {mode === "toIncluded" ? "税抜価格" : "税込価格"}
        </span>
        <div className="mt-1.5 flex items-center gap-2">
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-xl text-right" />
          <span className="text-slate-500 dark:text-zinc-400">円</span>
        </div>
      </label>

      {/* 税率 */}
      <div>
        <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">消費税率</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {[10, 8].map((r) => (
            <button key={r} onClick={() => setRate(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${rate === r ? "bg-violet-600 border-violet-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-violet-400"}`}>
              {r}%
            </button>
          ))}
          <div className="flex items-center gap-1">
            <input type="number" min={0} max={100} value={rate} onChange={(e) => setRate(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
              className="w-16 px-2 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-center" aria-label="任意の税率" />
            <span className="text-slate-500 dark:text-zinc-400 text-sm">%</span>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">8%は酒類を除く飲食料品・定期購読の新聞などの軽減税率です。</p>
      </div>

      {/* 端数処理 */}
      <div>
        <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">消費税額の端数処理</span>
        <div className="mt-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
          {([["floor", "切り捨て"], ["round", "四捨五入"], ["ceil", "切り上げ"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setRounding(v)}
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${rounding === v ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 結果 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">
          {mode === "toIncluded" ? "税込価格" : "税抜価格"}
        </p>
        <p className="text-[44px] leading-none font-bold text-slate-900 dark:text-white">
          {fmt(mode === "toIncluded" ? result.included : result.excluded)}
        </p>
        <div className="mt-5">
          <CopyResultButton text={`${mode === "toIncluded" ? `税抜${fmt(result.excluded)}→税込${fmt(result.included)}` : `税込${fmt(result.included)}→税抜${fmt(result.excluded)}`}（消費税${rate}%：${fmt(result.tax)}）｜https://www.toolboxjp.com/tools/tax-calculator`} />
        </div>
      </div>

      {/* 内訳 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
        <div className="flex items-center px-5 py-[14px]">
          <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">税抜価格</span>
          <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.excluded)}</span>
        </div>
        <div className="flex items-center px-5 py-[14px]">
          <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">消費税（{rate}%）</span>
          <span className="text-[15px] font-medium text-violet-600 dark:text-violet-400">＋{fmt(result.tax)}</span>
        </div>
        <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
          <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">税込価格</span>
          <span className="text-[15px] font-bold text-blue-500">{fmt(result.included)}</span>
        </div>
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 消費税の端数処理（切り捨て・四捨五入・切り上げ）は事業者ごとに決められます。取引先の請求書に合わせて選んでください。
      </p>
    </div>
  );
}
