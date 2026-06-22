"use client";
import { useState, useMemo } from "react";

type Mode = "from-cost" | "from-target";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

export function GrossProfitCalculator() {
  const [mode, setMode] = useState<Mode>("from-cost");

  // mode: from-cost
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");

  // mode: from-target
  const [targetMargin, setTargetMargin] = useState("30");
  const [costForTarget, setCostForTarget] = useState("");

  const result = useMemo(() => {
    const rev = parseFloat(revenue.replace(/,/g, "")) || 0;
    const c = parseFloat(cost.replace(/,/g, "")) || 0;
    if (rev <= 0 || c < 0) return null;
    const grossProfit = rev - c;
    const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const costRate = rev > 0 ? (c / rev) * 100 : 0;
    return { rev, c, grossProfit, grossMargin, costRate };
  }, [revenue, cost]);

  const targetResult = useMemo(() => {
    const c = parseFloat(costForTarget.replace(/,/g, "")) || 0;
    const margin = parseFloat(targetMargin) || 0;
    if (c <= 0 || margin <= 0 || margin >= 100) return null;
    const requiredRevenue = c / (1 - margin / 100);
    const grossProfit = requiredRevenue - c;
    return { c, requiredRevenue, grossProfit, margin };
  }, [costForTarget, targetMargin]);

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-[15px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* モード切替 */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800">
        {(["from-cost", "from-target"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
              mode === m
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-zinc-400"
            }`}
          >
            {m === "from-cost" ? "売上・原価から計算" : "目標粗利率から逆算"}
          </button>
        ))}
      </div>

      {mode === "from-cost" ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">売上金額（税抜）</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="1,500,000"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">原価合計（材料費＋労務費＋外注費）</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cost}
                  onChange={(e) => setCost(e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="900,000"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">計算結果</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-zinc-800">
                <div className="px-4 py-5 text-center">
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-1">粗利額</p>
                  <p className={`text-xl font-bold ${result.grossProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                    ¥{fmt(result.grossProfit)}
                  </p>
                </div>
                <div className="px-4 py-5 text-center">
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-1">粗利率</p>
                  <p className={`text-xl font-bold ${result.grossMargin >= 30 ? "text-emerald-600 dark:text-emerald-400" : result.grossMargin >= 20 ? "text-amber-500" : "text-red-500"}`}>
                    {result.grossMargin.toFixed(1)}%
                  </p>
                </div>
                <div className="px-4 py-5 text-center">
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-1">原価率</p>
                  <p className="text-xl font-bold text-slate-700 dark:text-zinc-300">
                    {result.costRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 bg-slate-50 dark:bg-zinc-800/50 space-y-2 text-[13px]">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>売上</span><span>¥{fmt(result.rev)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>原価</span><span>¥{fmt(result.c)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-800 dark:text-zinc-200 border-t border-slate-200 dark:border-zinc-700 pt-2 mt-2">
                  <span>粗利</span><span>¥{fmt(result.grossProfit)}</span>
                </div>
              </div>
              {/* 判定ガイド */}
              <div className={`px-5 py-3 text-[13px] font-medium ${
                result.grossMargin >= 30
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                  : result.grossMargin >= 20
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
              }`}>
                {result.grossMargin >= 35
                  ? "✅ 粗利率35%以上：建設業の優良ライン。諸経費・間接費を差し引いても十分な利益が見込めます。"
                  : result.grossMargin >= 30
                  ? "✅ 粗利率30%以上：建設業の一般的な目安ライン。"
                  : result.grossMargin >= 20
                  ? "⚠️ 粗利率20〜30%：諸経費・間接費次第では最終利益が圧迫されます。見積の見直しを検討してください。"
                  : result.grossMargin >= 0
                  ? "🔴 粗利率20%未満：間接費・一般管理費を考えると赤字になる可能性が高いです。要見直し。"
                  : "🔴 粗利がマイナスです。原価が売上を超えています。"}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">原価合計（材料費＋労務費＋外注費）</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={costForTarget}
                  onChange={(e) => setCostForTarget(e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="900,000"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">
                目標粗利率：<span className="text-blue-600 dark:text-blue-400 font-bold">{targetMargin}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>5%</span><span>20%（最低ライン）</span><span>30%（標準）</span><span>60%</span>
              </div>
            </div>
          </div>

          {targetResult && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">必要売上金額</p>
              </div>
              <div className="px-5 py-6 text-center">
                <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-1">粗利率{targetResult.margin}%を達成するための見積金額</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">¥{fmt(targetResult.requiredRevenue)}</p>
              </div>
              <div className="px-5 pb-5 space-y-2 text-[13px]">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>原価</span><span>¥{fmt(targetResult.c)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>粗利額</span><span>¥{fmt(targetResult.grossProfit)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-800 dark:text-zinc-200 border-t border-slate-200 dark:border-zinc-700 pt-2 mt-2">
                  <span>必要見積金額（税抜）</span><span>¥{fmt(targetResult.requiredRevenue)}</span>
                </div>
              </div>
              <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950/30 text-[13px] text-blue-700 dark:text-blue-400">
                💡 税込金額（10%）：¥{fmt(targetResult.requiredRevenue * 1.1)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 建設業の粗利率目安 */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-5">
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200 mb-3">建設業の粗利率目安</h3>
        <div className="space-y-2 text-[13px]">
          {[
            { label: "新築工事（一般）", range: "25〜35%", level: "normal" },
            { label: "リフォーム工事", range: "30〜45%", level: "good" },
            { label: "外壁塗装", range: "35〜50%", level: "good" },
            { label: "設備工事（電気・水道）", range: "25〜40%", level: "normal" },
            { label: "外構工事", range: "30〜45%", level: "good" },
            { label: "解体工事", range: "20〜35%", level: "normal" },
          ].map(({ label, range, level }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-zinc-400">{label}</span>
              <span className={`font-semibold ${level === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-zinc-300"}`}>{range}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-3">※粗利率は工種・地域・受注規模により大きく異なります。諸経費・一般管理費（通常10〜15%）を控除した営業利益は粗利率からさらに低下します。</p>
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-600 text-center">
        ✅ 入力データはサーバーに送信されません。ブラウザ内で完結します。
      </p>
    </div>
  );
}
