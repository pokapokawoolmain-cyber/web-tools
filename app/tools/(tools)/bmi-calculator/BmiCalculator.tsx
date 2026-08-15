"use client";

import { useState, useMemo } from "react";

// 日本肥満学会（JASSO）の区分
function judge(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "低体重（やせ）", color: "#38bdf8" };
  if (bmi < 25) return { label: "普通体重", color: "#22c55e" };
  if (bmi < 30) return { label: "肥満（1度）", color: "#facc15" };
  if (bmi < 35) return { label: "肥満（2度）", color: "#fb923c" };
  if (bmi < 40) return { label: "肥満（3度）", color: "#f87171" };
  return { label: "肥満（4度）", color: "#ef4444" };
}

export function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");

  const r = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!(h > 0) || !(w > 0)) return null;
    const bmi = w / (h * h);
    const standard = 22 * h * h; // BMI22の標準体重
    const idealMin = 18.5 * h * h;
    const idealMax = 25 * h * h;
    return {
      bmi,
      judge: judge(bmi),
      standard,
      idealMin,
      idealMax,
      diff: w - standard,
    };
  }, [height, weight]);

  // メーターの位置（BMI15〜40を0〜100%に）
  const pct = r ? Math.max(0, Math.min(100, ((r.bmi - 15) / (40 - 15)) * 100)) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        身長と体重を入れると、BMI（体格指数）と判定、BMI22の標準体重、普通体重の範囲を表示します。健康状態の大まかな目安としてご利用ください。
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">身長（cm）</span>
          <input type="number" inputMode="decimal" min={0} value={height} onChange={(e) => setHeight(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">体重（kg）</span>
          <input type="number" inputMode="decimal" min={0} value={weight} onChange={(e) => setWeight(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
      </div>

      {r && (
        <>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">あなたのBMI</p>
            <p className="text-[52px] leading-none font-bold text-slate-900 dark:text-white">{r.bmi.toFixed(1)}</p>
            <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-[13px] font-semibold text-white" style={{ background: r.judge.color }}>
              {r.judge.label}
            </span>

            {/* メーター */}
            <div className="mt-6">
              <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg,#38bdf8 0%,#22c55e 25%,#facc15 55%,#fb923c 75%,#ef4444 100%)" }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-700 dark:border-white shadow" style={{ left: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[14px] text-slate-600 dark:text-slate-400">標準体重（BMI22）</span>
              <span className="text-[15px] font-mono font-semibold text-slate-900 dark:text-white">{r.standard.toFixed(1)} kg</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[14px] text-slate-600 dark:text-slate-400">普通体重の範囲</span>
              <span className="text-[15px] font-mono font-semibold text-slate-900 dark:text-white">{r.idealMin.toFixed(1)}〜{r.idealMax.toFixed(1)} kg</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[14px] text-slate-600 dark:text-slate-400">標準体重との差</span>
              <span className={`text-[15px] font-mono font-semibold ${r.diff > 0 ? "text-orange-500" : "text-emerald-500"}`}>
                {r.diff >= 0 ? "+" : ""}{r.diff.toFixed(1)} kg
              </span>
            </div>
          </div>
        </>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 leading-relaxed">
        ※ BMIは身長と体重だけから算出する体格の目安で、筋肉量・体脂肪率・年齢・妊娠中などは反映されません。判定は日本肥満学会の基準によります。健康や減量に関する判断は、医師や専門家にご相談ください。
      </p>
    </div>
  );
}
