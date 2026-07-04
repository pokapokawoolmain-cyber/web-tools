"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";

type WallStatus = {
  label: string;
  amount: number;
  desc: string;
  over: boolean;
};

export function NenshuKabe() {
  const [income, setIncome] = useState(1200000); // 年収（円）
  const [isDependent, setIsDependent] = useState(true); // 配偶者等の扶養に入っているか
  const [bigCompany, setBigCompany] = useState(true); // 従業員51人以上

  const result = useMemo(() => {
    const man = income / 10000;

    // 各壁の判定（2026年7月時点の制度）
    const walls: WallStatus[] = [
      { label: "100万円の壁", amount: 100, desc: "住民税が発生し始めるライン（自治体により93〜100万円）", over: man > 100 },
      { label: "106万円の壁", amount: 106, desc: "社会保険加入の賃金要件（2026年10月に撤廃予定→週20時間以上で判定へ）", over: man > 106 },
      { label: "123万円の壁", amount: 123, desc: "本人の所得税がかかり始める基礎控除等のライン", over: man > 123 },
      { label: "130万円の壁", amount: 130, desc: "配偶者等の社会保険上の扶養から外れるライン（2026年4月から労働契約ベースで判定）", over: man > 130 },
      { label: "136万円の壁", amount: 136, desc: "配偶者控除（満額38万円）を受けられる配偶者の所得ライン", over: man > 136 },
      { label: "160万円の壁", amount: 160, desc: "所得税の課税が本格化。給与所得控除等の目安", over: man > 160 },
      { label: "169万円の壁", amount: 169, desc: "配偶者特別控除の満額（38万円）を受けられる上限", over: man > 169 },
      { label: "178万円の壁", amount: 178, desc: "所得税の非課税ライン（基礎控除引き上げ後・2026年改正）", over: man > 178 },
    ];

    // 社会保険加入の要否（概算判定）
    let shakaiHoken = false;
    let shakaiReason = "";
    if (!isDependent) {
      shakaiHoken = true;
      shakaiReason = "扶養に入っていないため、ご自身で社会保険（または国民健康保険・国民年金）に加入します。";
    } else if (bigCompany && man >= 106) {
      shakaiHoken = true;
      shakaiReason = "従業員51人以上の勤務先で月額賃金の要件（年106万円目安）を超えるため、勤務先の社会保険に加入します。※106万円の壁は2026年10月に撤廃され、以降は週20時間以上勤務で加入となる見込みです。";
    } else if (man >= 130) {
      shakaiHoken = true;
      shakaiReason = "年収130万円を超えるため、配偶者等の扶養から外れ、ご自身で社会保険に加入します。";
    } else {
      shakaiReason = "現在の年収では配偶者等の社会保険の扶養内にとどまれる見込みです。";
    }

    return { walls, shakaiHoken, shakaiReason };
  }, [income, isDependent, bigCompany]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <SliderInput
          id="income"
          label="年収の見込み"
          value={income / 10000}
          onChange={(v) => setIncome(v * 10000)}
          min={50}
          max={250}
          step={1}
          unit="万円"
          formatValue={(v) => `${v}万`}
        />

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">配偶者・親などの扶養に入っている？</p>
          <div className="flex gap-2">
            {[["扶養に入っている", true], ["扶養に入っていない", false]].map(([label, val]) => (
              <button
                key={String(val)}
                onClick={() => setIsDependent(val as boolean)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                  isDependent === val
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">勤務先の従業員数</p>
          <div className="flex gap-2">
            {[["51人以上", true], ["50人以下", false]].map(([label, val]) => (
              <button
                key={String(val)}
                onClick={() => setBigCompany(val as boolean)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                  bigCompany === val
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 社会保険判定 */}
      <div
        className={`rounded-2xl border p-5 ${
          result.shakaiHoken
            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50"
            : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
        }`}
      >
        <p className={`text-sm font-bold mb-1 ${result.shakaiHoken ? "text-amber-800 dark:text-amber-300" : "text-emerald-800 dark:text-emerald-300"}`}>
          {result.shakaiHoken ? "⚠️ 社会保険への加入が必要になる見込み" : "✅ 社会保険の扶養内にとどまれる見込み"}
        </p>
        <p className={`text-[13px] leading-relaxed ${result.shakaiHoken ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
          {result.shakaiReason}
        </p>
      </div>

      {/* 壁の一覧 */}
      <section>
        <h2 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">あなたが超える壁・超えない壁</h2>
        <div className="space-y-2">
          {result.walls.map((w) => (
            <div
              key={w.label}
              className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                w.over
                  ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700"
              }`}
            >
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                w.over ? "bg-rose-500 text-white" : "bg-slate-200 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"
              }`}>
                {w.over ? "超" : "内"}
              </span>
              <div>
                <p className={`text-sm font-semibold ${w.over ? "text-rose-700 dark:text-rose-300" : "text-slate-800 dark:text-zinc-200"}`}>
                  {w.label}
                  <span className="ml-2 text-[11px] font-normal text-slate-400">{w.over ? "超えています" : "超えていません"}</span>
                </p>
                <p className="text-[12px] text-slate-500 dark:text-zinc-500 leading-relaxed mt-0.5">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 dark:text-zinc-600 text-center leading-relaxed">
        ※ 2026年7月時点の制度に基づく概算判定です。年収の壁は税制改正で流動的であり、実際の適用は勤務先・自治体・加入状況により異なります。
      </p>
    </div>
  );
}
