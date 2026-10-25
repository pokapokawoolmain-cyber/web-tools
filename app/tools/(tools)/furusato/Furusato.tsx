"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { calcFurusatoLimit } from "@/lib/furusato";

export function Furusato() {
  const [income, setIncome] = useState(5000000);
  const [dependents, setDependents] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);

  const result = useMemo(() => {
    // 令和8年分の所得税・令和9年度分の住民税で計算（lib/furusato.ts）。扶養は16歳以上の一般扶養として扱う
    const r = calcFurusatoLimit({ income, hasSpouse, generalDependents: dependents });
    const limit = r.limit;
    const recommended = Math.floor((limit * 0.9) / 1000) * 1000;
    return { limit, recommended, residenceTax: r.residentIncomeLevy, incomeTaxRate: r.incomeTaxRate };
  }, [income, dependents, hasSpouse]);

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">ふるさと納税シミュレーター</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">控除上限額を詳細計算。年収・家族構成を入力するだけ。</p>
        </div>

        {/* Spouse Segmented Control */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">配偶者</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {(["なし", "あり"] as const).map(o => (
              <button
                key={o}
                onClick={() => setHasSpouse(o === "あり")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  (o === "あり") === hasSpouse
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </section>

        {/* Sliders */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">収入・家族構成</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 space-y-6">
            <SliderInput
              id="income"
              label="年収"
              value={income / 10000}
              onChange={v => setIncome(v * 10000)}
              min={0}
              max={3000}
              step={10}
              unit="万円"
              formatValue={v => `${v}万`}
            />
            <SliderInput
              id="dependents"
              label="扶養人数（配偶者除く）"
              value={dependents}
              onChange={setDependents}
              min={0}
              max={5}
              step={1}
              unit="人"
              formatValue={v => `${v}人`}
            />
          </div>
        </section>

        {/* Main Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">控除上限の目安</p>
          <p className="text-[52px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {fmt(result.limit)}
          </p>
        </div>

        {/* Details */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">内訳</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">推奨寄付額（上限の90%）</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.recommended)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">実質自己負担</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">¥2,000</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">住民税（概算）</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.residenceTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">適用所得税率</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{(result.incomeTaxRate * 100).toFixed(0)}%</span>
            </div>
          </div>
        </section>

        {/* Note */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1">
          ※ 2026年分の所得税・2027年度分の住民税で計算した概算値です。扶養人数は16歳以上の扶養親族の人数です（15歳以下の子は扶養控除の対象外）。正確な金額は税務署または各自治体にご確認ください。
        </p>

        {/* Related Tools */}
        <RelatedTools toolId="furusato" />
      </div>
    </div>
  );
}
