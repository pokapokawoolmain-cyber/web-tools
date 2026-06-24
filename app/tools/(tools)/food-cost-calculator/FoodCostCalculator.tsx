"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Unit = "g" | "ml" | "個" | "枚" | "本";
type TaxRate = "10" | "8";
type PriceDisplay = "tax_in" | "tax_out";

interface Ingredient {
  id: string;
  name: string;
  purchasePrice: string;
  purchaseAmount: string;
  unit: Unit;
  usageAmount: string;
  yield: string;
}

interface IngredientCost {
  id: string;
  name: string;
  cost: number;
}

interface CalcResult {
  totalCost: number;
  taxExcludedPrice: number;
  costRate: number;
  grossProfit: number;
  grossProfitRate: number;
  targetDiff: number;
  requiredPriceTaxEx: number;
  requiredPriceTaxIn: number;
  priceDiff: number;
  ingredientCosts: IngredientCost[];
}

const UNITS: Unit[] = ["g", "ml", "個", "枚", "本"];

function newIngredient(): Ingredient {
  return {
    id: crypto.randomUUID(),
    name: "",
    purchasePrice: "",
    purchaseAmount: "",
    unit: "g",
    usageAmount: "",
    yield: "100",
  };
}

const initialIngredients: Ingredient[] = [newIngredient(), newIngredient(), newIngredient()];

export function FoodCostCalculator() {
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [taxRate, setTaxRate] = useState<TaxRate>("10");
  const [priceDisplay, setPriceDisplay] = useState<PriceDisplay>("tax_in");
  const [targetCostRate, setTargetCostRate] = useState<string>("30");
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const updateIngredient = useCallback(
    (id: string, field: keyof Ingredient, value: string) => {
      setIngredients((prev) =>
        prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
      );
    },
    []
  );

  const addIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, newIngredient()]);
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  }, []);

  const result = useMemo<CalcResult | null>(() => {
    const taxRateNum = Number(taxRate) / 100;
    const sellingPriceNum = parseFloat(sellingPrice);

    if (!sellingPriceNum || sellingPriceNum <= 0) return null;

    // 税抜販売価格
    const taxExcludedPrice =
      priceDisplay === "tax_out"
        ? sellingPriceNum
        : sellingPriceNum / (1 + taxRateNum);

    // 各食材の原価計算
    const ingredientCosts: IngredientCost[] = [];
    for (const ing of ingredients) {
      const purchasePrice = parseFloat(ing.purchasePrice);
      const purchaseAmount = parseFloat(ing.purchaseAmount);
      const usageAmount = parseFloat(ing.usageAmount);
      const yieldRate = parseFloat(ing.yield) / 100;

      if (
        purchasePrice > 0 &&
        purchaseAmount > 0 &&
        usageAmount > 0 &&
        yieldRate > 0
      ) {
        const cost = (purchasePrice / purchaseAmount) * (usageAmount / yieldRate);
        ingredientCosts.push({
          id: ing.id,
          name: ing.name || "食材",
          cost,
        });
      }
    }

    const totalCost = ingredientCosts.reduce((sum, ic) => sum + ic.cost, 0);

    if (totalCost <= 0) return null;

    const costRate = (totalCost / taxExcludedPrice) * 100;
    const grossProfit = taxExcludedPrice - totalCost;
    const grossProfitRate = (grossProfit / taxExcludedPrice) * 100;

    const targetCostRateNum = parseFloat(targetCostRate);
    const targetDiff = costRate - targetCostRateNum;

    const requiredPriceTaxEx =
      targetCostRateNum > 0 ? totalCost / (targetCostRateNum / 100) : 0;
    const requiredPriceTaxIn = requiredPriceTaxEx * (1 + taxRateNum);

    const currentTaxInPrice =
      priceDisplay === "tax_in" ? sellingPriceNum : sellingPriceNum * (1 + taxRateNum);
    const priceDiff = requiredPriceTaxIn - currentTaxInPrice;

    return {
      totalCost,
      taxExcludedPrice,
      costRate,
      grossProfit,
      grossProfitRate,
      targetDiff,
      requiredPriceTaxEx,
      requiredPriceTaxIn,
      priceDiff,
      ingredientCosts,
    };
  }, [sellingPrice, taxRate, priceDisplay, targetCostRate, ingredients]);

  const costRateColor = (rate: number) => {
    if (rate <= 30) return "text-green-600 dark:text-green-400";
    if (rate <= 35) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const costRateBg = (rate: number) => {
    if (rate <= 30) return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
    if (rate <= 35) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
  };

  const fmt = (n: number, decimals = 0) =>
    n.toLocaleString("ja-JP", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左: 設定パネル */}
      <div className="space-y-4">
        {/* 販売価格カード */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">販売価格</h3>

          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              販売価格（円）
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="例: 980"
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 税込/税抜トグル */}
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
              上記価格の種別
            </label>
            <div className="flex rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {(
                [
                  { value: "tax_in", label: "税込" },
                  { value: "tax_out", label: "税抜" },
                ] as { value: PriceDisplay; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPriceDisplay(value)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    priceDisplay === value
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 税率選択 */}
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
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 目標原価率カード */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">目標原価率</h3>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={15}
              max={50}
              step={1}
              value={targetCostRate}
              onChange={(e) => setTargetCostRate(e.target.value)}
              className="flex-1 accent-orange-500"
            />
            <div className="relative">
              <input
                type="number"
                value={targetCostRate}
                onChange={(e) => setTargetCostRate(e.target.value)}
                min={15}
                max={50}
                className="w-20 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-slate-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                %
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>15%</span>
            <span>50%</span>
          </div>
        </div>

        {/* 食材リストカード */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">食材リスト</h3>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div
                key={ing.id}
                className="bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    食材 {idx + 1}
                  </span>
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* 食材名 */}
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                  placeholder="食材名（例: 豚バラ肉）"
                  className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* 仕入れ情報 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">仕入価格(円)</label>
                    <input
                      type="number"
                      value={ing.purchasePrice}
                      onChange={(e) => updateIngredient(ing.id, "purchasePrice", e.target.value)}
                      placeholder="500"
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">仕入量</label>
                    <input
                      type="number"
                      value={ing.purchaseAmount}
                      onChange={(e) => updateIngredient(ing.id, "purchaseAmount", e.target.value)}
                      placeholder="1000"
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">単位</label>
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 使用量・歩留まり */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">
                      1食使用量({ing.unit})
                    </label>
                    <input
                      type="number"
                      value={ing.usageAmount}
                      onChange={(e) => updateIngredient(ing.id, "usageAmount", e.target.value)}
                      placeholder="120"
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">歩留まり(%)</label>
                    <input
                      type="number"
                      value={ing.yield}
                      onChange={(e) => updateIngredient(ing.id, "yield", e.target.value)}
                      placeholder="100"
                      min={1}
                      max={100}
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addIngredient}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            食材を追加
          </button>
        </div>
      </div>

      {/* 右: 計算結果 */}
      <div className="space-y-4">
        {result ? (
          <>
            {/* メイン結果カード */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-5 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">計算結果</h3>

              {/* 合計原価 */}
              <div className="text-center py-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">合計原価</div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white">
                  ¥{fmt(result.totalCost, 1)}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  税抜販売価格 ¥{fmt(result.taxExcludedPrice, 0)}
                </div>
              </div>

              {/* 原価率 */}
              <div className={`rounded-xl border p-4 text-center ${costRateBg(result.costRate)}`}>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">原価率</div>
                <div className={`text-3xl font-bold ${costRateColor(result.costRate)}`}>
                  {fmt(result.costRate, 1)}%
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {result.costRate <= 30
                    ? "目標範囲内です"
                    : result.costRate <= 35
                    ? "やや高めです"
                    : "原価率が高すぎます"}
                </div>
              </div>

              {/* 粗利 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 mb-1">粗利額</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    ¥{fmt(result.grossProfit, 0)}
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 mb-1">粗利率</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {fmt(result.grossProfitRate, 1)}%
                  </div>
                </div>
              </div>

              {/* 目標との比較 */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">目標原価率との差</span>
                  <span
                    className={`text-sm font-bold ${
                      result.targetDiff <= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {result.targetDiff > 0 ? "+" : ""}
                    {fmt(result.targetDiff, 1)}%
                  </span>
                </div>
                <div className="border-t border-slate-100 dark:border-zinc-800 pt-2">
                  <div className="text-[10px] text-slate-400 mb-1">目標達成に必要な販売価格</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ¥{fmt(result.requiredPriceTaxIn, 0)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">税込</span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        result.priceDiff <= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {result.priceDiff > 0
                        ? `現在より +¥${fmt(result.priceDiff, 0)} 値上げ必要`
                        : `現在価格で達成済み`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 食材別原価内訳 */}
            {result.ingredientCosts.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
                <button
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>食材別原価内訳</span>
                  {showBreakdown ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>

                {showBreakdown && (
                  <div className="mt-3 space-y-2">
                    {result.ingredientCosts.map((ic) => (
                      <div key={ic.id} className="flex justify-between items-center">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{ic.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (ic.cost / result.totalCost) * 100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-900 dark:text-white w-16 text-right">
                            ¥{fmt(ic.cost, 1)}
                          </span>
                          <span className="text-[10px] text-slate-400 w-10 text-right">
                            {fmt((ic.cost / result.totalCost) * 100, 0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 dark:border-zinc-800 pt-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">合計</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ¥{fmt(result.totalCost, 1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              販売価格と食材情報を入力すると
              <br />
              原価率・粗利が自動計算されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
