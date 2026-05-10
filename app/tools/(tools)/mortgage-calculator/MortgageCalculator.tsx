"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { formatJPY } from "@/lib/utils";

// 元利均等返済の月々返済額計算
// M = P * r * (1+r)^n / ((1+r)^n - 1)
function calcMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// 返済比率の目安
function repaymentRatioLabel(ratio: number): string {
  if (ratio <= 20) return "✅ 余裕あり";
  if (ratio <= 25) return "🟡 標準的";
  if (ratio <= 35) return "⚠️ やや高め";
  return "❌ 注意が必要";
}

export function MortgageCalculator() {
  const [principal, setPrincipal] = useState(3000);   // 借入金額（万円）
  const [annualRate, setAnnualRate] = useState(0.5);  // 年利（%）
  const [years, setYears] = useState(35);              // 返済期間（年）
  const [annualIncome, setAnnualIncome] = useState(500); // 年収（万円・返済比率用）

  const result = useMemo(() => {
    const monthly = calcMonthlyPayment(principal * 10000, annualRate, years);
    const total = monthly * years * 12;
    const interest = total - principal * 10000;
    const ratio = (monthly * 12) / (annualIncome * 10000) * 100;

    // 年ごとの残高推移（グラフ用に5年刻み）
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const schedule: { year: number; balance: number; paidPrincipal: number }[] = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.floor(years / 8))) {
      const paid = y * 12;
      let balance: number;
      if (annualRate === 0) {
        balance = Math.max(0, principal * 10000 - (principal * 10000 / n) * paid);
      } else {
        balance = Math.max(0, principal * 10000 * (Math.pow(1 + r, n) - Math.pow(1 + r, paid)) / (Math.pow(1 + r, n) - 1));
      }
      schedule.push({ year: y, balance, paidPrincipal: principal * 10000 - balance });
    }

    return { monthly, total, interest, ratio, schedule };
  }, [principal, annualRate, years, annualIncome]);

  const maxBalance = principal * 10000;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">ローン条件を入力</h2>
        <SliderInput
          id="principal"
          label="借入金額"
          value={principal}
          onChange={setPrincipal}
          min={100}
          max={10000}
          step={100}
          unit="万円"
          formatValue={(v) => `${v.toLocaleString()}万円`}
        />
        <SliderInput
          id="rate"
          label="年利（金利）"
          value={annualRate}
          onChange={setAnnualRate}
          min={0.1}
          max={5}
          step={0.05}
          unit="%"
          formatValue={(v) => `${v.toFixed(2)}%`}
        />
        <SliderInput
          id="years"
          label="返済期間"
          value={years}
          onChange={setYears}
          min={5}
          max={50}
          step={1}
          unit="年"
          formatValue={(v) => `${v}年`}
        />
        <SliderInput
          id="income"
          label="年収（返済比率の確認用）"
          value={annualIncome}
          onChange={setAnnualIncome}
          min={200}
          max={3000}
          step={50}
          unit="万円"
          formatValue={(v) => `${v.toLocaleString()}万円`}
        />
      </div>

      {/* 結果 */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>
        <ResultCard
          label="毎月の返済額"
          value={formatJPY(result.monthly)}
          subValue={`年間 ${formatJPY(result.monthly * 12)}`}
          highlight
        />
        <div className="grid grid-cols-2 gap-3">
          <ResultCard label="総返済額" value={formatJPY(result.total)} />
          <ResultCard
            label="利息合計"
            value={formatJPY(result.interest)}
            subValue={`借入額の${((result.interest / (principal * 10000)) * 100).toFixed(0)}%`}
          />
          <ResultCard
            label="返済負担率"
            value={`${result.ratio.toFixed(1)}%`}
            subValue={repaymentRatioLabel(result.ratio)}
          />
          <ResultCard
            label="元本 / 利息"
            value={`${Math.round((principal * 10000 / result.total) * 100)}% / ${Math.round((result.interest / result.total) * 100)}%`}
            subValue="総返済に占める割合"
          />
        </div>
      </div>

      {/* 残高推移グラフ（SVG） */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">残高推移</h2>
        <div className="space-y-2">
          {result.schedule.map(({ year, balance, paidPrincipal }) => {
            const balancePct = (balance / maxBalance) * 100;
            const paidPct = (paidPrincipal / maxBalance) * 100;
            return (
              <div key={year} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-right text-slate-400 flex-shrink-0">{year}年</span>
                <div className="flex-1 h-5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  {/* 返済済み（元本）*/}
                  <div
                    className="h-full bg-blue-400 dark:bg-blue-500 rounded-l-full transition-all"
                    style={{ width: `${paidPct}%` }}
                  />
                  {/* 残高 */}
                  <div
                    className="h-full bg-slate-300 dark:bg-zinc-600 transition-all"
                    style={{ width: `${balancePct}%` }}
                  />
                </div>
                <span className="w-24 text-right text-slate-500 dark:text-slate-400 flex-shrink-0 tabular-nums">
                  {balance > 0 ? `残 ${Math.round(balance / 10000)}万` : "完済"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block" />返済済元本</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300 dark:bg-zinc-600 inline-block" />残高</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 元利均等返済方式の参考値です。実際の返済額は金融機関により異なります。
      </p>
    </div>
  );
}
