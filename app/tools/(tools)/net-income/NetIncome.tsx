"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { calcTakehome } from "@/lib/takehome";

export function NetIncome() {
  const [income, setIncome] = useState(5000000);
  const [showMonthly, setShowMonthly] = useState(true);

  const result = useMemo(() => calcTakehome(income), [income]);

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  const formatMonthly = (v: number) => {
    const man = Math.floor(v / 10000);
    const sen = Math.floor((v % 10000) / 1000);
    if (sen === 0) return `¥${man}万円`;
    return `¥${man}万${sen}千円`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">手取り計算</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">年収から月間・年間の手取り額を計算します</p>
        </div>

        {/* Toggle */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">表示切替</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {(["月収", "年収"] as const).map(o => (
              <button
                key={o}
                onClick={() => setShowMonthly(o === "月収")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  (o === "月収") === showMonthly
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </section>

        {/* Slider */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">年収</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            <SliderInput
              id="income"
              label="年収"
              value={income / 10000}
              onChange={v => setIncome(v * 10000)}
              min={100}
              max={3000}
              step={10}
              unit="万円"
              formatValue={v => `${v}万`}
            />
          </div>
        </section>

        {/* Main Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">
            {showMonthly ? "月手取り（概算）" : "年間手取り（概算）"}
          </p>
          <p className="text-[48px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {showMonthly ? formatMonthly(result.monthlyNet) : fmt(result.annualNet)}
          </p>
        </div>

        {/* Details */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">内訳（年間）</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">年収</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(income)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">社会保険料</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.socialInsurance)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">所得税（復興税込）</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.incomeTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">住民税</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.residenceTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">年間手取り</span>
              <span className="text-[15px] font-bold text-blue-500">{fmt(result.annualNet)}</span>
            </div>
          </div>
        </section>

        {/* Note */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1">
          ※ 独身・基礎控除のみで計算した概算値です。配偶者控除・扶養控除等は含まれません。
        </p>

        {/* Related Tools */}
        <RelatedTools toolId="net-income" />
      </div>
    </div>
  );
}
