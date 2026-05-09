"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";

type Card = {
  id: string;
  name: string;
  rate: number;          // 基本還元率（%）
  bonusNote?: string;    // ボーナス条件メモ
  color: string;         // テーマ色
  emoji: string;
};

const CARDS: Card[] = [
  { id: "paypay",   name: "PayPay",        rate: 1.0,  bonusNote: "PayPayカード利用時", color: "bg-red-500",    emoji: "🔴" },
  { id: "rakuten",  name: "楽天カード",    rate: 1.0,  bonusNote: "楽天市場+3%等",      color: "bg-red-600",    emoji: "🛒" },
  { id: "dpointd",  name: "dカード",       rate: 1.0,  bonusNote: "dポイントクラブ",     color: "bg-rose-500",   emoji: "📱" },
  { id: "aupay",    name: "au PAY",        rate: 0.5,  bonusNote: "Pontaポイント",       color: "bg-orange-500", emoji: "🟠" },
  { id: "suica",    name: "Suica/JRE",    rate: 0.5,  bonusNote: "JRE POINT",           color: "bg-sky-500",    emoji: "🚃" },
  { id: "amazon",   name: "Amazonカード",  rate: 1.0,  bonusNote: "Amazon購入+0.5%",     color: "bg-yellow-600", emoji: "📦" },
  { id: "visa3",    name: "高還元カード",   rate: 3.0,  bonusNote: "リクルート/三井住友等", color: "bg-blue-500",  emoji: "💙" },
  { id: "custom",   name: "カスタム",       rate: 2.0,  bonusNote: "自分で設定",          color: "bg-purple-500", emoji: "⚙️" },
];

export function PointSimulator() {
  const [monthly, setMonthly] = useState(5);         // 月間利用額（万円）
  const [customRate, setCustomRate] = useState(2.0); // カスタム還元率

  const results = useMemo(() =>
    CARDS.map((card) => {
      const rate = card.id === "custom" ? customRate : card.rate;
      const monthlyPoints = Math.floor((monthly * 10000) * (rate / 100));
      const annualPoints = monthlyPoints * 12;
      const annualYen = annualPoints; // 1pt≒1円
      return { ...card, rate, monthlyPoints, annualPoints, annualYen };
    }).sort((a, b) => b.annualPoints - a.annualPoints),
  [monthly, customRate]);

  const best = results[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">月間利用額を入力</h2>
        <SliderInput
          id="monthly"
          label="クレカ・電子マネーの月間利用額"
          value={monthly}
          onChange={setMonthly}
          min={1}
          max={100}
          step={1}
          unit="万円"
          formatValue={(v) => `${v}万円`}
        />
        <SliderInput
          id="custom-rate"
          label="カスタム還元率"
          value={customRate}
          onChange={setCustomRate}
          min={0.1}
          max={10}
          step={0.1}
          unit="%"
          formatValue={(v) => `${v}%`}
        />
      </div>

      {/* トップ結果 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">最大獲得</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {best.annualPoints.toLocaleString()}pt/年
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {best.emoji} {best.name}（還元率 {best.rate}%）— 月 {best.monthlyPoints.toLocaleString()}pt
        </p>
      </div>

      {/* 比較テーブル */}
      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 dark:text-white">サービス別比較</h2>
        {results.map((card, i) => {
          const pct = best.annualPoints > 0 ? (card.annualPoints / best.annualPoints) * 100 : 0;
          return (
            <div
              key={card.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <span className="text-xs font-bold text-amber-500">👑 No.1</span>}
                  <span className="font-medium text-slate-900 dark:text-white text-sm">
                    {card.emoji} {card.name}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">— {card.bonusNote}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {card.annualPoints.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">pt/年</span>
                  </span>
                </div>
              </div>
              {/* バー */}
              <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${card.color} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                還元率 {card.id === "custom" ? customRate : card.rate}% ／ 月 {card.monthlyPoints.toLocaleString()}pt
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ※ 基本還元率を元にした参考値です。キャンペーン・条件により異なります。
      </p>
    </div>
  );
}
