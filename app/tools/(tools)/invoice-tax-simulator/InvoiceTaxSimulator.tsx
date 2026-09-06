"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import {
  calcInvoiceTax,
  DEEMED_PURCHASE_RATES,
  REDUCED_SPECIAL_DEADLINE,
  type BusinessCategory,
} from "@/lib/invoice-tax-simulator";

const CATEGORY_KEYS = Object.keys(DEEMED_PURCHASE_RATES) as BusinessCategory[];

export function InvoiceTaxSimulator() {
  const [sales, setSales] = useState(6000000);
  const [category, setCategory] = useState<BusinessCategory>("service");
  const [purchases, setPurchases] = useState(1500000);
  const [taxRate, setTaxRate] = useState<0.1 | 0.08>(0.1);

  const result = useMemo(
    () => calcInvoiceTax({ salesTaxIncluded: sales, taxRate, category, purchasesTaxIncluded: purchases }),
    [sales, taxRate, category, purchases]
  );

  const fmt = (v: number) => `¥${v.toLocaleString()}`;
  const stillEligible = true; // 表示上は常時「期限」を明示する方針（判定はユーザーの課税期間依存のため）

  const optionRows = [
    {
      key: "reduced" as const,
      label: "2割特例",
      note: `〜${REDUCED_SPECIAL_DEADLINE}を含む課税期間まで`,
      value: result.reducedSpecialTax,
      available: stillEligible,
    },
    {
      key: "simplified" as const,
      label: "簡易課税",
      note: DEEMED_PURCHASE_RATES[category].label,
      value: result.simplifiedTax,
      available: true,
    },
    {
      key: "general" as const,
      label: "本則課税（一般課税）",
      note: "実額の仕入税額を控除",
      value: result.generalTax,
      available: true,
    },
  ];

  const resultText = `【インボイス税額シミュレーション】
課税売上高（税込）：${fmt(sales)}
事業区分：${DEEMED_PURCHASE_RATES[category].label}
課税仕入・経費（税込）：${fmt(purchases)}
---
2割特例：${fmt(result.reducedSpecialTax)}（${REDUCED_SPECIAL_DEADLINE}を含む課税期間まで）
簡易課税：${fmt(result.simplifiedTax)}
本則課税：${fmt(result.generalTax)}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            インボイス税額シミュレーター
          </h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">
            2割特例・簡易課税・本則課税の3方式で、消費税の納税額を比較できます
          </p>
        </div>

        {/* 使い方 */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-4 text-[13px] text-amber-800 dark:text-amber-300 leading-relaxed">
          「2割特例」は<strong>{REDUCED_SPECIAL_DEADLINE}を含む課税期間まで</strong>の時限措置です。
          それ以降は簡易課税か本則課税のどちらかを選ぶ必要があります。売上・経費・業種を入力して、どちらが有利か確認しましょう。
        </div>

        {/* 課税売上高 */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
            年間の課税売上高（税込）
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            <SliderInput
              id="sales"
              label="課税売上高"
              value={sales / 10000}
              onChange={(v) => setSales(v * 10000)}
              min={100}
              max={1000}
              step={10}
              unit="万円"
              formatValue={(v) => `${v}万`}
            />
          </div>
        </section>

        {/* 税率 */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">適用する消費税率</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {[
              { v: 0.1 as const, label: "標準税率 10%" },
              { v: 0.08 as const, label: "軽減税率 8%" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setTaxRate(t.v)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  t.v === taxRate ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* 事業区分（簡易課税用） */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
            事業区分（簡易課税のみなし仕入率）
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 space-y-2">
            {CATEGORY_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-all ${
                  category === k
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{DEEMED_PURCHASE_RATES[k].label}</span>
                  <span className="text-[12px] opacity-80">みなし仕入率 {Math.round(DEEMED_PURCHASE_RATES[k].rate * 100)}%</span>
                </div>
                <p className={`text-[11px] mt-0.5 ${category === k ? "opacity-80" : "text-slate-400 dark:text-zinc-500"}`}>
                  {DEEMED_PURCHASE_RATES[k].kind}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 課税仕入（本則課税用） */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
            年間の課税仕入・経費（税込・本則課税の計算に使用）
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5">
            <SliderInput
              id="purchases"
              label="課税仕入・経費"
              value={purchases / 10000}
              onChange={(v) => setPurchases(v * 10000)}
              min={0}
              max={500}
              step={5}
              unit="万円"
              formatValue={(v) => `${v}万`}
            />
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-2">
            仕入・外注費・消耗品・通信費など、インボイス（適格請求書）の交付を受けた課税取引の合計額の目安です。
          </p>
        </section>

        {/* 結果 */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">3方式の比較結果</p>
            <CopyResultButton text={resultText} />
          </div>
          <div className="space-y-2.5">
            {optionRows.map((row) => (
              <div
                key={row.key}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  result.cheapest === row.key
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-transparent bg-white dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">{row.label}</p>
                    {result.cheapest === row.key && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">最も有利</span>
                    )}
                  </div>
                  <p className="text-[20px] font-bold text-slate-900 dark:text-white tabular-nums">{fmt(row.value)}</p>
                </div>
                <p className="text-[12px] text-slate-400 dark:text-zinc-500">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-3 leading-relaxed">
            ※ 概算の目安です。簡易課税・本則課税のどちらを選ぶかは、事前に「消費税簡易課税制度選択届出書」の提出が必要な場合があります。実際の納税額・届出の要否は税務署または税理士にご確認ください。
          </p>
        </section>
      </div>
    </div>
  );
}
