"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type TaxRate = "10" | "8";
type RoundingMode = "none" | "round10" | "round50" | "round100" | "common";

const COMMON_PRICES = [
  380, 480, 500, 580, 600, 680, 780, 800, 880, 900, 980, 1000, 1080, 1180,
  1280, 1380, 1480, 1580, 1680, 1780, 1880, 1980, 2200, 2500, 2800, 3000,
  3500, 4000, 4500, 5000,
];

function applyRounding(price: number, mode: RoundingMode): number {
  switch (mode) {
    case "none":
      return price;
    case "round10":
      return Math.ceil(price / 10) * 10;
    case "round50":
      return Math.ceil(price / 50) * 50;
    case "round100":
      return Math.ceil(price / 100) * 100;
    case "common": {
      // 切り上げ方向で最も近いcommon price
      const candidates = COMMON_PRICES.filter((p) => p >= price);
      if (candidates.length === 0) return COMMON_PRICES[COMMON_PRICES.length - 1];
      return candidates[0];
    }
    default:
      return price;
  }
}

interface RoundingOption {
  mode: RoundingMode;
  label: string;
  taxInPrice: number;
  taxExPrice: number;
  costRate: number;
  grossProfit: number;
}

interface CalcResult {
  rawTaxExPrice: number;
  rawTaxInPrice: number;
  selectedTaxInPrice: number;
  selectedCostRate: number;
  selectedGrossProfit: number;
  options: RoundingOption[];
  // 値上げ比較
  currentCostRate: number | null;
  priceIncrease: number | null;
  profitImprovement: number | null;
}

export function MenuPriceCalculator() {
  const [ingredientCost, setIngredientCost] = useState<string>("");
  const [targetCostRate, setTargetCostRate] = useState<string>("30");
  const [taxRate, setTaxRate] = useState<TaxRate>("10");
  const [roundingMode, setRoundingMode] = useState<RoundingMode>("common");
  const [showComparison, setShowComparison] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [monthlySales, setMonthlySales] = useState<string>("100");

  const result = useMemo<CalcResult | null>(() => {
    const cost = parseFloat(ingredientCost);
    const target = parseFloat(targetCostRate);
    const taxRateNum = Number(taxRate) / 100;

    if (!cost || cost <= 0 || !target || target <= 0) return null;

    const rawTaxExPrice = cost / (target / 100);
    const rawTaxInPrice = rawTaxExPrice * (1 + taxRateNum);

    const roundingModes: RoundingMode[] = ["none", "round10", "round50", "round100", "common"];
    const options: RoundingOption[] = roundingModes.map((mode) => {
      const taxInPrice = applyRounding(rawTaxInPrice, mode);
      const taxExPrice = taxInPrice / (1 + taxRateNum);
      const costRate = (cost / taxExPrice) * 100;
      const grossProfit = taxExPrice - cost;
      return {
        mode,
        label:
          mode === "none"
            ? "端数なし"
            : mode === "round10"
            ? "10円単位"
            : mode === "round50"
            ? "50円単位"
            : mode === "round100"
            ? "100円単位"
            : "飲食店価格",
        taxInPrice,
        taxExPrice,
        costRate,
        grossProfit,
      };
    });

    const selectedOption = options.find((o) => o.mode === roundingMode) ?? options[0];

    // 値上げ比較
    const currentPriceNum = parseFloat(currentPrice);
    const monthlySalesNum = parseFloat(monthlySales) || 100;
    let currentCostRate: number | null = null;
    let priceIncrease: number | null = null;
    let profitImprovement: number | null = null;

    if (currentPriceNum && currentPriceNum > 0) {
      const currentTaxExPrice = currentPriceNum / (1 + taxRateNum);
      currentCostRate = (cost / currentTaxExPrice) * 100;
      priceIncrease = selectedOption.taxInPrice - currentPriceNum;
      profitImprovement = priceIncrease * monthlySalesNum;
    }

    return {
      rawTaxExPrice,
      rawTaxInPrice,
      selectedTaxInPrice: selectedOption.taxInPrice,
      selectedCostRate: selectedOption.costRate,
      selectedGrossProfit: selectedOption.grossProfit,
      options,
      currentCostRate,
      priceIncrease,
      profitImprovement,
    };
  }, [ingredientCost, targetCostRate, taxRate, roundingMode, currentPrice, monthlySales]);

  const fmt = (n: number, decimals = 0) =>
    n.toLocaleString("ja-JP", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const costRateColor = (rate: number) => {
    if (rate <= 30) return "text-green-600 dark:text-green-400";
    if (rate <= 35) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 入力セクション */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">条件を入力</h3>

        {/* 食材費 */}
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
            食材費合計（円）
          </label>
          <input
            type="number"
            value={ingredientCost}
            onChange={(e) => setIngredientCost(e.target.value)}
            placeholder="例: 280"
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* 目標原価率 */}
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
            目標原価率: <span className="font-semibold text-slate-700 dark:text-slate-300">{targetCostRate}%</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={15}
              max={50}
              step={1}
              value={targetCostRate}
              onChange={(e) => setTargetCostRate(e.target.value)}
              className="flex-1 accent-emerald-500"
            />
            <input
              type="number"
              value={targetCostRate}
              onChange={(e) => setTargetCostRate(e.target.value)}
              min={15}
              max={50}
              className="w-20 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-slate-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
            <span>15%</span>
            <span>50%</span>
          </div>
        </div>

        {/* 税率 */}
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">消費税率</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            {(
              [
                { value: "10", label: "10%（標準）" },
                { value: "8", label: "8%（軽減）" },
              ] as { value: TaxRate; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTaxRate(value)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  taxRate === value
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-750"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 端数調整 */}
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">端数調整</label>
          <div className="grid grid-cols-5 gap-1">
            {(
              [
                { value: "none", label: "なし" },
                { value: "round10", label: "10円" },
                { value: "round50", label: "50円" },
                { value: "round100", label: "100円" },
                { value: "common", label: "飲食店" },
              ] as { value: RoundingMode; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setRoundingMode(value)}
                className={`py-2 text-xs font-medium rounded-lg transition-colors ${
                  roundingMode === value
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 結果ハイライトカード */}
      {result ? (
        <>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">推奨販売価格</h3>

            <div className="text-center py-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {roundingMode === "none"
                  ? "端数なし"
                  : roundingMode === "round10"
                  ? "10円単位に丸め"
                  : roundingMode === "round50"
                  ? "50円単位に丸め"
                  : roundingMode === "round100"
                  ? "100円単位に丸め"
                  : "飲食店価格に丸め"}{" "}
                （税込）
              </div>
              <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">
                ¥{fmt(result.selectedTaxInPrice)}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                税抜 ¥{fmt(result.selectedTaxInPrice / (1 + Number(taxRate) / 100), 0)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 mb-1">実際の原価率</div>
                <div className={`text-xl font-bold ${costRateColor(result.selectedCostRate)}`}>
                  {fmt(result.selectedCostRate, 1)}%
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 mb-1">1食あたり粗利</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  ¥{fmt(result.selectedGrossProfit, 0)}
                </div>
              </div>
            </div>
          </div>

          {/* 端数別比較表 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              端数調整別 比較表
            </h3>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800">
                    <th className="text-left p-2 text-slate-500 dark:text-slate-400 font-medium rounded-tl-lg">
                      端数設定
                    </th>
                    <th className="text-right p-2 text-slate-500 dark:text-slate-400 font-medium">
                      税込価格
                    </th>
                    <th className="text-right p-2 text-slate-500 dark:text-slate-400 font-medium">
                      原価率
                    </th>
                    <th className="text-right p-2 text-slate-500 dark:text-slate-400 font-medium rounded-tr-lg">
                      粗利額
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.options.map((opt) => (
                    <tr
                      key={opt.mode}
                      onClick={() => setRoundingMode(opt.mode)}
                      className={`border-t border-slate-100 dark:border-zinc-800 cursor-pointer transition-colors ${
                        roundingMode === opt.mode
                          ? "bg-emerald-50 dark:bg-emerald-950/20"
                          : "hover:bg-slate-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <td className="p-2 font-medium text-slate-700 dark:text-slate-300">
                        {opt.label}
                        {roundingMode === opt.mode && (
                          <span className="ml-1 text-[9px] bg-emerald-500 text-white rounded px-1 py-0.5">
                            選択中
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono text-slate-900 dark:text-white">
                        ¥{fmt(opt.taxInPrice)}
                      </td>
                      <td className={`p-2 text-right font-mono ${costRateColor(opt.costRate)}`}>
                        {fmt(opt.costRate, 1)}%
                      </td>
                      <td className="p-2 text-right font-mono text-slate-900 dark:text-white">
                        ¥{fmt(opt.grossProfit, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 値上げ前後比較 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            <button
              onClick={() => setShowComparison((v) => !v)}
              className="w-full flex items-center justify-between p-5 text-sm font-bold text-slate-900 dark:text-white"
            >
              <span>値上げ前後の比較</span>
              {showComparison ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </button>

            {showComparison && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-zinc-800 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      現在の価格（税込・円）
                    </label>
                    <input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      placeholder="例: 880"
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      月間販売数（食）
                    </label>
                    <input
                      type="number"
                      value={monthlySales}
                      onChange={(e) => setMonthlySales(e.target.value)}
                      placeholder="100"
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {result.currentCostRate !== null &&
                result.priceIncrease !== null &&
                result.profitImprovement !== null ? (
                  <div className="space-y-3">
                    {/* 比較テーブル */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div />
                      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg py-1.5 font-semibold text-slate-600 dark:text-slate-400">
                        現在
                      </div>
                      <div className="bg-emerald-100 dark:bg-emerald-950/30 rounded-lg py-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                        新価格
                      </div>

                      <div className="text-left text-slate-500 dark:text-slate-400 flex items-center">
                        価格（税込）
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-900 rounded-lg py-2 font-mono font-bold text-slate-900 dark:text-white">
                        ¥{fmt(parseFloat(currentPrice))}
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg py-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        ¥{fmt(result.selectedTaxInPrice)}
                      </div>

                      <div className="text-left text-slate-500 dark:text-slate-400 flex items-center">
                        原価率
                      </div>
                      <div
                        className={`bg-slate-50 dark:bg-zinc-900 rounded-lg py-2 font-mono font-bold ${costRateColor(result.currentCostRate)}`}
                      >
                        {fmt(result.currentCostRate, 1)}%
                      </div>
                      <div
                        className={`bg-emerald-50 dark:bg-emerald-950/20 rounded-lg py-2 font-mono font-bold ${costRateColor(result.selectedCostRate)}`}
                      >
                        {fmt(result.selectedCostRate, 1)}%
                      </div>
                    </div>

                    {/* 改善効果 */}
                    <div
                      className={`rounded-xl p-4 ${
                        result.priceIncrease > 0
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        月間利益改善効果（{fmt(parseFloat(monthlySales) || 100)}食販売時）
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          result.profitImprovement >= 0
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {result.profitImprovement >= 0 ? "+" : ""}
                        ¥{fmt(result.profitImprovement)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        1食あたり{" "}
                        {result.priceIncrease >= 0 ? "+" : ""}
                        ¥{fmt(result.priceIncrease)} の値{result.priceIncrease >= 0 ? "上げ" : "下げ"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
                    現在の価格を入力すると比較が表示されます
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
          <div className="text-4xl mb-3">💴</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            食材費と目標原価率を入力すると
            <br />
            適正価格が逆算されます
          </p>
        </div>
      )}
    </div>
  );
}
