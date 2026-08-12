"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import { calcResidentTax } from "@/lib/resident-tax";

export function ResidentTax() {
  const [income, setIncome] = useState(4000000);
  const [dependents, setDependents] = useState(0);
  const [manualSI, setManualSI] = useState(false);
  const [siInput, setSiInput] = useState(580000);
  const [showMonthly, setShowMonthly] = useState(false);

  const result = useMemo(
    () => calcResidentTax(income, dependents, manualSI ? siInput : undefined),
    [income, dependents, manualSI, siInput]
  );

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">住民税の目安計算</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">
            年収と扶養人数から、1年間に納める住民税のおおよその目安を計算します
          </p>
        </div>

        {/* 使い方（最初に表示） */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
          年収のスライダーを動かし、扶養している家族の人数を選ぶだけです。住民税は前年の所得をもとに計算され、
          その年の6月から翌年5月にかけて給与から引かれます（自分で納める普通徴収もあります）。
        </div>

        {/* 年収スライダー */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">年収（額面）</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            <SliderInput
              id="income"
              label="年収"
              value={income / 10000}
              onChange={(v) => setIncome(v * 10000)}
              min={100}
              max={2000}
              step={10}
              unit="万円"
              formatValue={(v) => `${v}万`}
            />
          </div>
        </section>

        {/* 扶養人数 */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">扶養している家族の人数</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setDependents(n)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  n === dependents
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {n === 4 ? "4人+" : `${n}人`}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-2">
            配偶者・16歳以上の子など、扶養控除の対象になる家族の人数（一般扶養として概算）。
          </p>
        </section>

        {/* 社会保険料（任意で手入力） */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">社会保険料</p>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={manualSI}
                onChange={(e) => setManualSI(e.target.checked)}
                className="accent-blue-500"
              />
              手入力する
            </label>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            {manualSI ? (
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-slate-500 dark:text-zinc-400">年間</span>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={siInput}
                  onChange={(e) => setSiInput(Math.max(0, Number(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-right"
                />
                <span className="text-[14px] text-slate-500 dark:text-zinc-400">円</span>
              </div>
            ) : (
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">
                自動概算：<span className="font-semibold text-slate-800 dark:text-zinc-200">{fmt(result.socialInsurance)}</span>
                <span className="text-[12px] text-slate-400 dark:text-zinc-500 ml-2">（年収の約14.5%）</span>
              </p>
            )}
          </div>
        </section>

        {/* メイン結果 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <div className="inline-flex bg-slate-100 dark:bg-zinc-800 rounded-lg p-1 mb-5">
            {(["年額", "月額"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setShowMonthly(o === "月額")}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                  (o === "月額") === showMonthly
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">
            {showMonthly ? "住民税の目安（月あたり）" : "住民税の目安（年間）"}
          </p>
          {result.isExempt ? (
            <>
              <p className="text-[32px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
                非課税の目安
              </p>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
                この年収・扶養人数では住民税がかからない可能性があります（自治体により基準は異なります）。
              </p>
            </>
          ) : (
            <p className="text-[48px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
              {fmt(showMonthly ? result.monthly : result.total)}
            </p>
          )}
          <div className="mt-5">
            <CopyResultButton
              text={`年収${(income / 10000).toLocaleString()}万円・扶養${dependents}人の住民税目安: 年間${fmt(result.total)}（月${fmt(result.monthly)}）｜所得割${fmt(result.incomeLevy)}＋均等割${fmt(result.perCapitaLevy)}｜https://www.toolboxjp.com/tools/resident-tax`}
            />
          </div>
        </div>

        {/* 内訳 */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">内訳（年間の目安）</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">給与所得（給与所得控除後）</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.employmentIncome)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">住民税の課税所得</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.taxableIncome)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">所得割（課税所得の約10%）</span>
              <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-200">{fmt(result.incomeLevy)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">均等割（定額）</span>
              <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-200">{fmt(result.perCapitaLevy)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">住民税の目安（年間）</span>
              <span className="text-[15px] font-bold text-blue-500">{fmt(result.total)}</span>
            </div>
          </div>
        </section>

        {/* 注記 */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1 leading-relaxed">
          ※ 会社員・給与所得のみ・基礎控除＋社会保険料控除＋扶養控除のみを想定した概算の目安です。均等割は森林環境税を含む標準的な5,000円で計算しています。実際の税額は自治体・各種控除・所得の種類により異なります。正確な金額はお住まいの市区町村や勤務先にご確認ください。
        </p>
      </div>
    </div>
  );
}
