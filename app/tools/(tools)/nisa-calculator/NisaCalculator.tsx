"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import { formatJPY, calcFutureValueMonthly } from "@/lib/utils";

export function NisaCalculator() {
  const [monthly, setMonthly] = useState(3);       // 毎月の積立（万円）
  const [years, setYears] = useState(20);           // 積立期間（年）
  const [annualReturn, setAnnualReturn] = useState(5); // 年利（%）

  const result = useMemo(() => {
    const monthlyYen = monthly * 10000;
    const futureValue = calcFutureValueMonthly(monthlyYen, annualReturn, years);
    const principal = monthlyYen * years * 12;
    const profit = futureValue - principal;
    const roi = (profit / principal) * 100;

    return { futureValue, principal, profit, roi };
  }, [monthly, years, annualReturn]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">積立条件を入力</h2>

        <SliderInput
          id="monthly"
          label="毎月の積立額"
          value={monthly}
          onChange={setMonthly}
          min={1}
          max={30}
          step={1}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />

        <SliderInput
          id="years"
          label="積立期間"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          step={1}
          unit="年"
          formatValue={(v) => `${v}年`}
        />

        <SliderInput
          id="return"
          label="想定年利"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={0.1}
          max={20}
          step={0.1}
          unit="%"
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>

        {/* years の値がそのままラベルに反映される */}
        <ResultCard
          label={`${years}年後（${new Date().getFullYear() + years}年）の資産額`}
          value={formatJPY(result.futureValue)}
          subValue={`毎月${monthly}万円 × ${years}年 × 年利${annualReturn}%`}
          highlight
        />

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="元本合計"
            value={formatJPY(result.principal)}
            subValue={`${monthly}万円 × ${years * 12}ヶ月`}
          />
          <ResultCard
            label="運用益（非課税）"
            value={formatJPY(result.profit)}
            subValue={`利益率 +${result.roi.toFixed(0)}%`}
          />
        </div>

        <div className="text-center">
          <CopyResultButton text={`新NISA: 毎月${monthly}万円×${years}年（年利${annualReturn}%）→ ${formatJPY(result.futureValue)}（元本${formatJPY(result.principal)}・運用益${formatJPY(result.profit)}）｜https://www.toolboxjp.com/tools/nisa-calculator`} />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 本シミュレーターは参考値です。実際の運用成績は変動します。
      </p>
    </div>
  );
}
