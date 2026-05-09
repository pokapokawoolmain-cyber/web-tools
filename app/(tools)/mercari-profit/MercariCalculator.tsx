"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";

const MERCARI_FEE_RATE = 0.1;

export function MercariCalculator() {
  const [sellPrice, setSellPrice]     = useState(3000);
  const [buyPrice, setBuyPrice]       = useState(1000);
  const [shippingFee, setShippingFee] = useState(200);
  const [packagingFee, setPackagingFee] = useState(50);

  const result = useMemo(() => {
    const fee = Math.floor(sellPrice * MERCARI_FEE_RATE);
    const totalCost = buyPrice + shippingFee + packagingFee + fee;
    const profit = sellPrice - totalCost;
    const profitRate = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
    return { fee, totalCost, profit, profitRate };
  }, [sellPrice, buyPrice, shippingFee, packagingFee]);

  const profitColor =
    result.profit >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-500 dark:text-red-400";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">金額を入力</h2>

        <SliderInput
          id="sell-price"
          label="販売価格"
          value={sellPrice}
          onChange={setSellPrice}
          min={0}
          max={100000}
          step={100}
          unit="円"
          formatValue={(v) => `${v.toLocaleString()}円`}
        />
        <SliderInput
          id="buy-price"
          label="仕入れ価格（0でもOK）"
          value={buyPrice}
          onChange={setBuyPrice}
          min={0}
          max={80000}
          step={100}
          unit="円"
          formatValue={(v) => `${v.toLocaleString()}円`}
        />
        <SliderInput
          id="shipping"
          label="送料（出品者負担の場合）"
          value={shippingFee}
          onChange={setShippingFee}
          min={0}
          max={5000}
          step={10}
          unit="円"
          formatValue={(v) => `${v.toLocaleString()}円`}
        />
        <SliderInput
          id="packaging"
          label="梱包費"
          value={packagingFee}
          onChange={setPackagingFee}
          min={0}
          max={1000}
          step={10}
          unit="円"
          formatValue={(v) => `${v.toLocaleString()}円`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>

        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 text-sm space-y-2 border border-slate-200 dark:border-zinc-700">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">販売価格</span>
            <span className="font-medium">{sellPrice.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between text-red-500 dark:text-red-400">
            <span>− メルカリ手数料（10%）</span>
            <span>{result.fee.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between text-red-500 dark:text-red-400">
            <span>− 仕入れ・送料・梱包費</span>
            <span>{(buyPrice + shippingFee + packagingFee).toLocaleString()}円</span>
          </div>
          <div className="border-t border-slate-200 dark:border-zinc-700 pt-2 flex justify-between font-bold text-base">
            <span className="text-slate-900 dark:text-white">実質利益</span>
            <span className={profitColor}>{result.profit.toLocaleString()}円</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="実質利益"
            value={`${result.profit >= 0 ? "+" : ""}${result.profit.toLocaleString()}円`}
            highlight
          />
          <ResultCard
            label="利益率"
            value={`${result.profitRate.toFixed(1)}%`}
            subValue={result.profitRate >= 20 ? "✅ 優良" : result.profitRate >= 0 ? "⚠️ 要検討" : "❌ 赤字"}
          />
        </div>
      </div>
    </div>
  );
}
