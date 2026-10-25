"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";

import { calcFurusatoLimit } from "@/lib/furusato";

// ふるさと納税 控除上限の計算は lib/furusato.ts（令和8年分の税制）に集約。
// 計算式: (住民税所得割額 × 0.2) / (0.9 - 所得税率 × 1.021) + 2000

type FamilyType = "single" | "spouse" | "spouse_child1" | "spouse_child2" | "child1" | "child2";

/** 子は扶養控除の対象となる16〜18歳（高校生）を想定。15歳以下の子は扶養控除がないため「独身・共働き」と同じ */
const FAMILY_OPTIONS: { value: FamilyType; label: string; hasSpouse: boolean; children: number }[] = [
  { value: "single",        label: "独身・共働き",                 hasSpouse: false, children: 0 },
  { value: "spouse",        label: "配偶者（専業主婦/夫）",        hasSpouse: true,  children: 0 },
  { value: "spouse_child1", label: "配偶者 + 子1人（高校生）",     hasSpouse: true,  children: 1 },
  { value: "spouse_child2", label: "配偶者 + 子2人（高校生）",     hasSpouse: true,  children: 2 },
  { value: "child1",        label: "共働き + 子1人（高校生・自分の扶養）", hasSpouse: false, children: 1 },
  { value: "child2",        label: "共働き + 子2人（高校生・自分の扶養）", hasSpouse: false, children: 2 },
];

export function FurusatoSimulator() {
  const [salary, setSalary] = useState(500);           // 年収（万円）
  const [family, setFamily] = useState<FamilyType>("single");

  const result = useMemo(() => {
    const opt = FAMILY_OPTIONS.find((o) => o.value === family)!;
    const { limit, incomeTaxRate } = calcFurusatoLimit({
      income: salary * 10000,
      hasSpouse: opt.hasSpouse,
      generalDependents: opt.children,
    });
    // 実質負担 2,000円
    const netBenefit = Math.max(0, limit - 2000);
    return { limit, netBenefit, taxRate: incomeTaxRate };
  }, [salary, family]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">あなたの状況を選択</h2>

        <SliderInput
          id="salary"
          label="給与年収"
          value={salary}
          onChange={setSalary}
          min={150}
          max={3000}
          step={50}
          unit="万円"
          formatValue={(v) => `${v.toLocaleString()}万円`}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            家族構成
          </label>
          <div className="grid grid-cols-1 gap-2">
            {FAMILY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFamily(opt.value)}
                className={`px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                  family === opt.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold"
                    : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 結果 */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>

        <ResultCard
          label="控除上限額（目安）"
          value={`${result.limit.toLocaleString()}円`}
          subValue={`この金額まで寄附すると税金から控除されます`}
          highlight
        />

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="実質負担額"
            value="2,000円"
            subValue="いくら寄附しても自己負担はこれだけ"
          />
          <ResultCard
            label="お得になる金額"
            value={`${result.netBenefit.toLocaleString()}円`}
            subValue="控除上限まで寄附した場合"
          />
        </div>

        {/* アドバイス */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">💡 活用のコツ</p>
          <ul className="text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
            <li>上限の80〜90%を目安に寄附するのが安全</li>
            <li>5自治体以内ならワンストップ特例で確定申告不要</li>
            <li>12月末まで寄附すれば今年分の控除に算入可能</li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 2026年分の所得税・2027年度分の住民税で計算した、給与所得のみを前提とした参考値です。中学生以下の子は扶養控除の対象外のため上限額に影響しません。住宅ローン控除・医療費控除・iDeCo・副業収入がある場合は上限額が変わります。
      </p>
    </div>
  );
}
