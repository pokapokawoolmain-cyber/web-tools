"use client";
import { useState, useMemo } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import { ResultCard } from "@/components/ui/ResultCard";

// 簡易的な所得税計算（参考値）
function calcIncomeTax(income: number): number {
  if (income <= 195_0000) return income * 0.05;
  if (income <= 330_0000) return income * 0.1 - 97500;
  if (income <= 695_0000) return income * 0.2 - 427500;
  if (income <= 900_0000) return income * 0.23 - 636000;
  if (income <= 1800_0000) return income * 0.33 - 1536000;
  return income * 0.4 - 2796000;
}

export function SideJobCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState(50); // 年間売上（万円）
  const [expenses, setExpenses] = useState(10);           // 年間経費（万円）
  const [mainSalary, setMainSalary] = useState(400);      // 本業年収（万円）

  const result = useMemo(() => {
    const income = (annualRevenue - expenses) * 10000; // 副業所得（円）
    const needsDeclaration = income > 200000; // 20万円超で確定申告必要

    const incomeTax = calcIncomeTax(income) * 0.8; // 簡易計算（控除考慮）
    const residentTax = income * 0.1; // 住民税10%

    const netProfit = income - incomeTax - residentTax;
    const effectiveRate = income > 0 ? ((incomeTax + residentTax) / income) * 100 : 0;

    return {
      income,
      incomeTax,
      residentTax,
      netProfit,
      effectiveRate,
      needsDeclaration,
    };
  }, [annualRevenue, expenses]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="font-bold text-slate-900 dark:text-white">収入を入力</h2>

        <NumberInput
          id="revenue"
          label="副業の年間売上"
          value={annualRevenue}
          onChange={setAnnualRevenue}
          min={0}
          unit="万円"
        />
        <NumberInput
          id="expenses"
          label="年間経費"
          value={expenses}
          onChange={setExpenses}
          min={0}
          unit="万円"
          helpText="PC・通信費・書籍・交通費など"
        />
        <NumberInput
          id="main-salary"
          label="本業の年収（目安）"
          value={mainSalary}
          onChange={setMainSalary}
          min={0}
          unit="万円"
          helpText="税率の参考計算に使用します"
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>

        {/* 確定申告アラート */}
        <div
          className={`rounded-xl p-4 text-sm font-medium border ${
            result.needsDeclaration
              ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
              : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {result.needsDeclaration
            ? "⚠️ 副業所得が20万円を超えているため、確定申告が必要な可能性があります"
            : "✅ 副業所得が20万円以下のため、確定申告不要な場合があります"}
        </div>

        <ResultCard
          label="実質手取り（推定）"
          value={`${Math.round(result.netProfit / 10000).toLocaleString()}万円`}
          subValue={`（年間）`}
          highlight
        />

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="副業所得"
            value={`${Math.round(result.income / 10000)}万円`}
            subValue="売上 − 経費"
          />
          <ResultCard
            label="実効税率（目安）"
            value={`${result.effectiveRate.toFixed(1)}%`}
          />
          <ResultCard
            label="所得税（推定）"
            value={`${Math.round(result.incomeTax / 10000).toLocaleString()}万円`}
          />
          <ResultCard
            label="住民税（推定）"
            value={`${Math.round(result.residentTax / 10000).toLocaleString()}万円`}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 本計算は簡易的な参考値です。実際の税額は各種控除により異なります。正確な計算は税理士にご相談ください。
      </p>
    </div>
  );
}
