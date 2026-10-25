"use client";

import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { CopyResultButton } from "@/components/ui/CopyResultButton";
import {
  calcInvoiceTax,
  DEEMED_PURCHASE_RATES,
  NON_INVOICE_CREDIT_RATES,
  REDUCED_SPECIAL_DEADLINE,
  TAX_YEARS,
  type BusinessCategory,
  type TaxYear,
} from "@/lib/invoice-tax-simulator";

const CATEGORY_KEYS = Object.keys(DEEMED_PURCHASE_RATES) as BusinessCategory[];

export function InvoiceTaxSimulator() {
  const [sales, setSales] = useState(6000000);
  const [category, setCategory] = useState<BusinessCategory>("service");
  const [purchases, setPurchases] = useState(1500000);
  const [taxRate, setTaxRate] = useState<0.1 | 0.08>(0.1);
  const [taxYear, setTaxYear] = useState<TaxYear>(2027);
  const [entity, setEntity] = useState<"individual" | "corporation">("individual");
  const [nonInvoice, setNonInvoice] = useState(0);
  const nonInvoiceClamped = Math.min(nonInvoice, purchases);

  const result = useMemo(
    () =>
      calcInvoiceTax({
        salesTaxIncluded: sales,
        taxRate,
        category,
        purchasesTaxIncluded: purchases,
        nonInvoicePurchasesTaxIncluded: nonInvoiceClamped,
        taxYear,
        entity,
      }),
    [sales, taxRate, category, purchases, nonInvoiceClamped, taxYear, entity]
  );

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  const specialNote =
    result.specialLabel === "2割特例"
      ? `${REDUCED_SPECIAL_DEADLINE}を含む課税期間まで`
      : "個人事業主のみ・2027年分と2028年分の申告で使える";

  const optionRows = [
    ...(result.reducedSpecialTax !== null && result.specialLabel
      ? [
          {
            key: "reduced" as const,
            label: result.specialLabel,
            note: specialNote,
            value: result.reducedSpecialTax,
          },
        ]
      : []),
    {
      key: "simplified" as const,
      label: "簡易課税",
      note: DEEMED_PURCHASE_RATES[category].label,
      value: result.simplifiedTax,
    },
    {
      key: "general" as const,
      label: "本則課税（一般課税）",
      note:
        nonInvoiceClamped > 0
          ? `実額の仕入税額を控除（インボイスのない仕入れは${NON_INVOICE_CREDIT_RATES[taxYear].label}）`
          : "実額の仕入税額を控除",
      value: result.generalTax,
    },
  ];

  const resultText = `【インボイス税額シミュレーション（${taxYear}年分）】
課税売上高（税込）：${fmt(sales)}
事業区分：${DEEMED_PURCHASE_RATES[category].label}
課税仕入・経費（税込）：${fmt(purchases)}（うちインボイスなし：${fmt(nonInvoiceClamped)}）
---
${optionRows.map((r) => `${r.label}：${fmt(r.value)}`).join("\n")}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            インボイス税額シミュレーター
          </h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">
            2割特例・3割特例・簡易課税・本則課税で、消費税の納税額を年分ごとに比較できます
          </p>
        </div>

        {/* 使い方 */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-4 text-[13px] text-amber-800 dark:text-amber-300 leading-relaxed">
          「2割特例」は<strong>{REDUCED_SPECIAL_DEADLINE}を含む課税期間まで</strong>で終わります。
          個人事業主は2027年分・2028年分に限り<strong>「3割特例」</strong>（納税額＝売上の消費税の30%）が使えます。
          また2026年10月から、免税事業者などインボイスのない仕入れの控除割合が80%から<strong>70%</strong>に下がりました。年分を選んで比較しましょう。
        </div>

        {/* 申告する年分・事業者の種類 */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">申告する年分</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 grid grid-cols-5 gap-1">
            {TAX_YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setTaxYear(y)}
                className={`py-2 text-[13px] font-medium rounded-lg transition-all ${
                  y === taxYear ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex mt-2">
            {[
              { v: "individual" as const, label: "個人事業主" },
              { v: "corporation" as const, label: "法人" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setEntity(t.v)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  t.v === entity ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-2 leading-relaxed">
            {entity === "corporation"
              ? "法人は3割特例の対象外です。2割特例は2026年9月30日を含む事業年度まで使えます（2026年を選ぶと表示）。"
              : "個人事業主は1〜12月の暦年が1つの課税期間です。2割特例・3割特例は、基準期間（2年前）の課税売上高が1,000万円以下で、インボイス登録をきっかけに課税事業者になった方が対象です。"}
          </p>
        </section>

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
            仕入・外注費・消耗品・通信費など、課税取引の合計額の目安です。
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 mt-3">
            <SliderInput
              id="non-invoice"
              label="うちインボイスのない仕入れ（免税事業者など）"
              value={nonInvoiceClamped / 10000}
              onChange={(v) => setNonInvoice(v * 10000)}
              min={0}
              max={Math.max(0, purchases / 10000)}
              step={5}
              unit="万円"
              formatValue={(v) => `${v}万`}
            />
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1 mt-2">
            インボイスのない相手からの仕入れは、{taxYear}年分は{NON_INVOICE_CREDIT_RATES[taxYear].label}だけ控除できます（2031年10月以降は0%）。
          </p>
        </section>

        {/* 結果 */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{taxYear}年分の比較結果</p>
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
            ※ 概算の目安です。簡易課税を選ぶには原則として課税期間の開始前日までに「消費税簡易課税制度選択届出書」の提出が必要ですが、2割特例・3割特例を使った翌年分は、その年分の申告期限までの提出で簡易課税を選べます。インボイスのない仕入れの割合は、年の途中で切り替わる年は1年間均等に仕入れた場合の平均で計算しています。実際の納税額・届出の要否は税務署または税理士にご確認ください。
          </p>
        </section>
      </div>
    </div>
  );
}
