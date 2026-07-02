"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import { calcTakehome, calcRequiredIncome } from "@/lib/takehome";

export function TakehomeReverse() {
  const [monthlyNet, setMonthlyNet] = useState(300000);

  const { requiredIncome, detail } = useMemo(() => {
    const required = calcRequiredIncome(monthlyNet * 12);
    return { requiredIncome: required, detail: calcTakehome(required) };
  }, [monthlyNet]);

  const fmt = (v: number) => `¥${v.toLocaleString()}`;
  const fmtMan = (v: number) => `${(Math.round(v / 1000) / 10).toFixed(1)}万円`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">手取り逆算シミュレーター</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">欲しい月の手取り額から、必要な額面年収を逆算します</p>
        </div>

        {/* Slider */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">希望する月の手取り</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            <SliderInput
              id="monthlyNet"
              label="月の手取り"
              value={monthlyNet / 10000}
              onChange={v => setMonthlyNet(v * 10000)}
              min={15}
              max={100}
              step={1}
              unit="万円"
              formatValue={v => `${v}万`}
            />
          </div>
        </section>

        {/* Main Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">
            必要な額面年収（概算）
          </p>
          <p className="text-[48px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {fmtMan(requiredIncome)}
          </p>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-3">
            月の額面に換算すると約{fmtMan(requiredIncome / 12)}（ボーナスなし・12分割の場合）
          </p>
          <div className="mt-4">
            <CopyResultButton text={`月の手取り${monthlyNet / 10000}万円に必要な額面年収: ${fmtMan(requiredIncome)}（月額面 約${fmtMan(requiredIncome / 12)}）｜https://www.toolboxjp.com/tools/takehome-reverse`} />
          </div>
        </div>

        {/* Details */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">この年収のときの内訳（年間）</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">額面年収</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(requiredIncome)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">社会保険料</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(detail.socialInsurance)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">所得税（復興税込）</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(detail.incomeTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">住民税</span>
              <span className="text-[15px] font-medium text-red-500">－{fmt(detail.residenceTax)}</span>
            </div>
            <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">年間手取り</span>
              <span className="text-[15px] font-bold text-blue-500">{fmt(detail.annualNet)}（月{fmtMan(detail.monthlyNet)}）</span>
            </div>
          </div>
        </section>

        {/* Note */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1">
          ※ 独身・基礎控除のみで計算した概算値です。配偶者控除・扶養控除等は含まれません。賞与がある場合も年収ベースでは同じ計算になります。
        </p>
      </div>
    </div>
  );
}
