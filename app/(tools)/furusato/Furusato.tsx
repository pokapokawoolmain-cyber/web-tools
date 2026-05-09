"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { RelatedTools } from "@/components/tools/RelatedTools";

function calcSalaryDeduction(income: number): number {
  if (income <= 1625000) return 550000;
  if (income <= 1800000) return income * 0.4 - 100000;
  if (income <= 3600000) return income * 0.3 + 80000;
  if (income <= 6600000) return income * 0.2 + 440000;
  if (income <= 8500000) return income * 0.1 + 1100000;
  return 1950000;
}

function getIncomeTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 1950000) return 0.05;
  if (taxableIncome <= 3300000) return 0.10;
  if (taxableIncome <= 6950000) return 0.20;
  if (taxableIncome <= 9000000) return 0.23;
  if (taxableIncome <= 18000000) return 0.33;
  return 0.40;
}

export function Furusato() {
  const [income, setIncome] = useState(5000000);
  const [dependents, setDependents] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);

  const result = useMemo(() => {
    const salaryDeduction = calcSalaryDeduction(income);
    const netIncome = income - salaryDeduction;
    const socialInsurance = income * 0.145;
    const basicDeduction = 480000;
    const spouseDeduction = hasSpouse ? 380000 : 0;
    const dependentDeduction = dependents * 380000;

    const taxableIncome = Math.max(0, netIncome - socialInsurance - basicDeduction - spouseDeduction - dependentDeduction);
    const residenceTaxableIncome = Math.max(0, netIncome - socialInsurance - 430000 - spouseDeduction - dependentDeduction);

    const residenceTax = residenceTaxableIncome * 0.10;
    const incomeTaxRate = getIncomeTaxRate(taxableIncome);

    const limitRaw = (residenceTax * 0.20) / (0.90 - incomeTaxRate * 1.021) + 2000;
    const limit = Math.floor(limitRaw / 1000) * 1000;
    const recommended = Math.floor((limit * 0.9) / 1000) * 1000;

    return { limit, recommended, residenceTax: Math.round(residenceTax), incomeTaxRate };
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
          ※ 概算値です。正確な金額は税務署または各自治体にご確認ください。
        </p>

        {/* Related Tools */}
        <RelatedTools currentId="furusato" category="lifestyle" />
      </div>
    </div>
  );
}
