"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { RelatedTools } from "@/components/tools/RelatedTools";

export function ShiftSalary() {
  const [hourlyRate, setHourlyRate] = useState(1000);
  const [dailyHours, setDailyHours] = useState(6);
  const [nightHours, setNightHours] = useState(0);
  const [workDays, setWorkDays] = useState(20);
  const [transport, setTransport] = useState(0);

  const result = useMemo(() => {
    const regularHours = Math.max(0, dailyHours - nightHours);
    const dailyRegular = hourlyRate * regularHours;
    const dailyNight = hourlyRate * 1.25 * nightHours;
    const dailyTransport = transport;
    const dailyGross = dailyRegular + dailyNight + dailyTransport;
    const monthlyGross = dailyGross * workDays;
    const nightAllowanceTotal = dailyNight * workDays;
    const transportTotal = dailyTransport * workDays;
    const dailyPay = dailyRegular + dailyNight;

    return {
      monthlyGross: Math.round(monthlyGross),
      dailyPay: Math.round(dailyPay),
      nightAllowanceTotal: Math.round(nightAllowanceTotal),
      transportTotal: Math.round(transportTotal),
    };
  }, [hourlyRate, dailyHours, nightHours, workDays, transport]);

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">シフト給与計算</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">アルバイト・パートの月収を計算します</p>
        </div>

        {/* Sliders */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">勤務条件</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 space-y-6">
            <SliderInput
              id="hourly-rate"
              label="時給"
              value={hourlyRate}
              onChange={setHourlyRate}
              min={800}
              max={3000}
              step={10}
              unit="円"
              formatValue={v => `${v}円`}
            />
            <SliderInput
              id="daily-hours"
              label="1日の勤務時間"
              value={dailyHours}
              onChange={setDailyHours}
              min={1}
              max={12}
              step={0.5}
              unit="時間"
              formatValue={v => `${v}h`}
            />
            <SliderInput
              id="night-hours"
              label="うち深夜時間（22〜5時）"
              value={nightHours}
              onChange={v => setNightHours(Math.min(v, dailyHours))}
              min={0}
              max={8}
              step={0.5}
              unit="時間"
              formatValue={v => `${v}h`}
            />
            <SliderInput
              id="work-days"
              label="月の勤務日数"
              value={workDays}
              onChange={setWorkDays}
              min={1}
              max={31}
              step={1}
              unit="日"
              formatValue={v => `${v}日`}
            />
            <SliderInput
              id="transport"
              label="交通費（日額）"
              value={transport}
              onChange={setTransport}
              min={0}
              max={1000}
              step={10}
              unit="円"
              formatValue={v => `${v}円`}
            />
          </div>
        </section>

        {/* Main Result */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 text-center">
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-2 tracking-wide">月収見込み（交通費込み）</p>
          <p className="text-[52px] font-semibold text-slate-900 dark:text-white tracking-tight leading-none">
            {fmt(result.monthlyGross)}
          </p>
        </div>

        {/* Breakdown */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">内訳</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px]">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">日給（深夜手当込み）</span>
              <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.dailyPay)}</span>
            </div>
            {nightHours > 0 && (
              <div className="flex items-center px-5 py-[14px]">
                <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">深夜割増手当（月計）</span>
                <span className="text-[15px] font-medium text-amber-500">{fmt(result.nightAllowanceTotal)}</span>
              </div>
            )}
            {transport > 0 && (
              <div className="flex items-center px-5 py-[14px]">
                <span className="text-[15px] text-slate-600 dark:text-slate-400 flex-1">交通費（月計）</span>
                <span className="text-[15px] font-medium text-slate-900 dark:text-white">{fmt(result.transportTotal)}</span>
              </div>
            )}
            <div className="flex items-center px-5 py-[14px] bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white flex-1">月収合計</span>
              <span className="text-[15px] font-bold text-blue-500">{fmt(result.monthlyGross)}</span>
            </div>
          </div>
        </section>

        {/* Note */}
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 px-1">
          ※ 税金・社会保険料控除前の総支給額です。深夜手当は25%増しで計算。
        </p>

        {/* Related Tools */}
        <RelatedTools currentId="shift-salary" category="calc" />
      </div>
    </div>
  );
}
