"use client";
// ========================================
// FIREシミュレーター 計算ロジック + UI
// Client Componentとして分離（SEO対応のため）
// ========================================
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { NumberInput } from "@/components/ui/NumberInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { formatJPY, formatPercent } from "@/lib/utils";

// 現在の資産内訳
type AssetBreakdown = {
  cash: number;       // 現金・預金
  stocks: number;     // 株式・投資信託
  other: number;      // 不動産・その他
};

// 資産内訳の1行コンポーネント
function AssetRow({
  label,
  id,
  value,
  onChange,
  helpText,
}: {
  label: string;
  id: string;
  value: number;
  onChange: (v: number) => void;
  helpText?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <NumberInput
          id={id}
          label={label}
          value={value}
          onChange={onChange}
          min={0}
          step={10}
          unit="万円"
          helpText={helpText}
        />
      </div>
    </div>
  );
}

export function FireSimulator() {
  // --- 現在の資産（カテゴリ別） ---
  const [assets, setAssets] = useState<AssetBreakdown>({
    cash: 200,    // 現金・預金
    stocks: 300,  // 株式・投資信託
    other: 0,     // 不動産・その他
  });

  // --- その他の入力値 ---
  const [monthlySaving, setMonthlySaving] = useState(10);  // 毎月の積立（万円）
  const [annualExpense, setAnnualExpense] = useState(300); // 年間生活費（万円）
  const [annualReturn, setAnnualReturn] = useState(5);     // 年利（%）
  const [withdrawalRate, setWithdrawalRate] = useState(4); // 取り崩し率（%）

  // 資産合計
  const totalAssets = assets.cash + assets.stocks + assets.other;

  const setAsset = (key: keyof AssetBreakdown) => (v: number) =>
    setAssets((prev) => ({ ...prev, [key]: v }));

  // --- 計算 ---
  const result = useMemo(() => {
    const fireTarget = (annualExpense * 100) / withdrawalRate; // 万円

    let current = totalAssets;
    let years = 0;
    while (current < fireTarget && years < 100) {
      current = current * (1 + annualReturn / 100) + monthlySaving * 12;
      years++;
    }

    const monthlyIncome = (fireTarget * (withdrawalRate / 100)) / 12;

    return {
      fireTarget,
      yearsToFire: years >= 100 ? null : years,
      monthlyIncome,
      gap: Math.max(0, fireTarget - totalAssets),
    };
  }, [totalAssets, monthlySaving, annualExpense, annualReturn, withdrawalRate]);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ① 現在の資産（詳細入力） */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">
            現在の資産
          </h2>
          {/* 合計バッジ */}
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">合計</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {totalAssets.toLocaleString()}
              <span className="text-xs font-normal ml-0.5">万円</span>
            </span>
          </div>
        </div>

        <div className="space-y-4 pl-2 border-l-2 border-slate-200 dark:border-zinc-700">
          <AssetRow
            id="cash"
            label="現金・預金"
            value={assets.cash}
            onChange={setAsset("cash")}
            helpText="銀行口座・財布の現金"
          />
          <AssetRow
            id="stocks"
            label="株式・投資信託・iDeCo"
            value={assets.stocks}
            onChange={setAsset("stocks")}
            helpText="評価額ベースで入力"
          />
          <AssetRow
            id="other"
            label="不動産・その他"
            value={assets.other}
            onChange={setAsset("other")}
            helpText="売却可能資産の概算"
          />
        </div>
      </div>

      {/* ② 積立・生活費・運用条件 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">
          積立・運用条件
        </h2>

        <SliderInput
          id="monthly-saving"
          label="毎月の積立額"
          value={monthlySaving}
          onChange={setMonthlySaving}
          min={0}
          max={200}
          step={1}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />

        <SliderInput
          id="annual-expense"
          label="年間生活費"
          value={annualExpense}
          onChange={setAnnualExpense}
          min={50}
          max={2000}
          step={10}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />

        <SliderInput
          id="annual-return"
          label="想定年利（運用利回り）"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={0}
          max={20}
          step={0.1}
          unit="%"
          formatValue={(v) => `${v}%`}
        />

        <SliderInput
          id="withdrawal-rate"
          label="年間取り崩し率"
          value={withdrawalRate}
          onChange={setWithdrawalRate}
          min={1}
          max={8}
          step={0.1}
          unit="%"
          formatValue={(v) => `${v}%`}
        />
      </div>

      {/* 計算結果 */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">
          計算結果
        </h2>

        <ResultCard
          label="FIRE達成まで"
          value={
            result.yearsToFire === null
              ? "100年以内に達成困難"
              : result.yearsToFire === 0
              ? "すでにFIRE可能！"
              : `約 ${result.yearsToFire} 年後`
          }
          subValue={
            result.yearsToFire !== null && result.yearsToFire > 0
              ? `${new Date().getFullYear() + result.yearsToFire}年頃`
              : undefined
          }
          highlight
        />

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="FIRE目標資産"
            value={formatJPY(result.fireTarget * 10000)}
            subValue={`（年間生活費の${Math.round(100 / withdrawalRate)}倍）`}
          />
          <ResultCard
            label="現在との差額"
            value={formatJPY(result.gap * 10000)}
            subValue="まだ必要な資産"
          />
          <ResultCard
            label="FIRE後の月収入"
            value={formatJPY(result.monthlyIncome * 10000)}
            subValue={`（年利${formatPercent(withdrawalRate)}取り崩し）`}
          />
          <ResultCard
            label="現在の資産合計"
            value={formatJPY(totalAssets * 10000)}
            subValue={`現金${assets.cash}万 / 投資${assets.stocks}万 / 他${assets.other}万`}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 本シミュレーターは参考値です。実際の運用成績は変動します。投資は自己責任でお願いします。
      </p>
    </div>
  );
}
