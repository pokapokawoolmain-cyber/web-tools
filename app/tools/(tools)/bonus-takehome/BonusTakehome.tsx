"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import { calcBonusTakehome } from "@/lib/takehome";

export function BonusTakehome() {
  const [bonus, setBonus] = useState(500000); // 賞与額（円）
  const [prevSalary, setPrevSalary] = useState(300000); // 前月の給与（社保控除後・円）
  const [dependents, setDependents] = useState(0);
  const [isOver40, setIsOver40] = useState(false);

  const result = useMemo(
    () => calcBonusTakehome(bonus, prevSalary, dependents, isOver40),
    [bonus, prevSalary, dependents, isOver40],
  );

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">ボーナス手取り計算</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">賞与額から社会保険料・源泉所得税を引いた手取りを計算します</p>
        </div>

        {/* Sliders */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">賞与・前月給与</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 space-y-6">
            <SliderInput
              id="bonus"
              label="賞与額（額面）"
              value={bonus / 10000}
              onChange={v => setBonus(v * 10000)}
              min={10}
              max={300}
              step={1}
              unit="万円"
              formatValue={v => `${v}万`}
            />
            <SliderInput
              id="prev-salary"
              label="前月の給与（社会保険料控除後）"
              value={prevSalary / 10000}
              onChange={v => setPrevSalary(v * 10000)}
              min={15}
              max={100}
              step={1}
              unit="万円"
              formatValue={v => `${v}万`}
            />
          </div>
        </section>

        {/* Dependents toggle */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">扶養親族の数</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {([0, 1, 2, 3] as const).map(n => (
              <button
                key={n}
                onClick={() => setDependents(n)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  dependents === n
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {n}人
              </button>
            ))}
          </div>
        </section>

        {/* Age toggle */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">年齢（介護保険）</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {(["40歳未満", "40歳以上"] as const).map(o => (
              <button
                key={o}
                onClick={() => setIsOver40(o === "40歳以上")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  (o === "40歳以上") === isOver40
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </section>

        {/* Main Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">ボーナスの手取り（概算）</p>
          <p className="text-[48px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {fmt(result.net)}
          </p>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-3">
            額面に対する手取り率 <span className="font-semibold text-blue-500">{result.netRate}%</span>
          </p>
          <div className="mt-4">
            <CopyResultButton text={`賞与${(bonus / 10000).toLocaleString()}万円の手取り: ${fmt(result.net)}（手取り率${result.netRate}%）｜健康保険${fmt(result.healthInsurance)}・厚生年金${fmt(result.pension)}・雇用保険${fmt(result.employmentInsurance)}・所得税${fmt(result.incomeTax)}（税率${result.taxRate}%）｜https://www.toolboxjp.com/tools/bonus-takehome`} />
          </div>
        </div>

        {/* Details */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">内訳</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">賞与額（額面）</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(bonus)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">
                健康保険料{isOver40 ? "（介護保険込）" : ""}
              </span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.healthInsurance)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">厚生年金保険料</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.pension)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">雇用保険料</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.employmentInsurance)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">
                源泉所得税（税率{result.taxRate}%）
              </span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(result.incomeTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">手取り額</span>
              <span className="text-[15px] font-bold text-blue-500">{fmt(result.net)}</span>
            </div>
          </div>
        </section>

        {/* Note */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1">
          ※ 協会けんぽ・本人負担・扶養控除等申告書提出済み（甲欄）を前提とした概算です。健康保険組合や都道府県により料率は異なります。住民税はボーナスからは天引きされません。
        </p>
      </div>
    </div>
  );
}
