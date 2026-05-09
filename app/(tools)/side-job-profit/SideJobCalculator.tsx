"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";

export function SideJobCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState(50);
  const [expenses, setExpenses]           = useState(10);
  const [mainSalary, setMainSalary]       = useState(400);

  const result = useMemo(() => {
    const income = (annualRevenue - expenses) * 10000;
    const needsDeclaration = income > 200000;
    // 本業年収を加味した合算所得で税率を算出
    const totalIncome = mainSalary * 10000 + income;
    const marginalRate = totalIncome <= 330_0000 ? 0.1
      : totalIncome <= 695_0000 ? 0.2
      : totalIncome <= 900_0000 ? 0.23
      : totalIncome <= 1800_0000 ? 0.33
      : 0.4;
    const incomeTax   = Math.max(0, income * marginalRate * 0.8);
    const residentTax = Math.max(0, income * 0.1);
    const netProfit   = income - incomeTax - residentTax;
    const effectiveRate = income > 0 ? ((incomeTax + residentTax) / income) * 100 : 0;
    return { income, incomeTax, residentTax, netProfit, effectiveRate, needsDeclaration };
  }, [annualRevenue, expenses, mainSalary]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">収入を入力</h2>

        <SliderInput
          id="revenue"
          label="副業の年間売上"
          value={annualRevenue}
          onChange={setAnnualRevenue}
          min={0}
          max={1000}
          step={5}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />
        <SliderInput
          id="expenses"
          label="年間経費"
          value={expenses}
          onChange={setExpenses}
          min={0}
          max={500}
          step={5}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />
        <SliderInput
          id="main-salary"
          label="本業の年収"
          value={mainSalary}
          onChange={setMainSalary}
          min={0}
          max={3000}
          step={50}
          unit="万円"
          formatValue={(v) => `${v.toLocaleString()}万円`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>

        <div className={`rounded-xl p-4 text-sm font-medium border ${
          result.needsDeclaration
            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
            : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
        }`}>
          {result.needsDeclaration
            ? "⚠️ 副業所得が20万円を超えているため、確定申告が必要な可能性があります"
            : "✅ 副業所得が20万円以下のため、確定申告不要な場合があります"}
        </div>

        <ResultCard
          label="実質手取り（推定）"
          value={`${Math.round(result.netProfit / 10000).toLocaleString()}万円`}
          subValue="（年間）"
          highlight
        />
        <div className="grid grid-cols-2 gap-3">
          <ResultCard label="副業所得" value={`${Math.round(result.income / 10000)}万円`} subValue="売上 − 経費" />
          <ResultCard label="実効税率（目安）" value={`${result.effectiveRate.toFixed(1)}%`} />
          <ResultCard label="所得税（推定）" value={`${Math.round(result.incomeTax / 10000).toLocaleString()}万円`} />
          <ResultCard label="住民税（推定）" value={`${Math.round(result.residentTax / 10000).toLocaleString()}万円`} />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 参考値です。実際の税額は各種控除により異なります。正確な計算は税理士にご相談ください。
      </p>
    </div>
  );
}
