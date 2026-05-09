"use client";
import { useState, useMemo } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import { ResultCard } from "@/components/ui/ResultCard";

export function GasCalculator() {
  const [distance, setDistance] = useState(20);    // 走行距離（km）
  const [fuelEff, setFuelEff] = useState(15);      // 燃費（km/L）
  const [gasPrice, setGasPrice] = useState(175);   // ガソリン価格（円/L）
  const [trips, setTrips] = useState(20);          // 月の往復回数

  const result = useMemo(() => {
    if (fuelEff === 0) return null;
    const oneWay = (distance / fuelEff) * gasPrice;
    const roundTrip = oneWay * 2;
    const monthly = roundTrip * trips;
    const annual = monthly * 12;
    const perKm = gasPrice / fuelEff;

    return { oneWay, roundTrip, monthly, annual, perKm };
  }, [distance, fuelEff, gasPrice, trips]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="font-bold text-slate-900 dark:text-white">条件を入力</h2>

        <NumberInput
          id="distance"
          label="片道の距離"
          value={distance}
          onChange={setDistance}
          min={0.1}
          step={0.5}
          unit="km"
        />
        <NumberInput
          id="fuel-eff"
          label="燃費"
          value={fuelEff}
          onChange={setFuelEff}
          min={1}
          step={0.5}
          unit="km/L"
          helpText="カタログ値の約80%が実燃費の目安"
        />
        <NumberInput
          id="gas-price"
          label="ガソリン価格"
          value={gasPrice}
          onChange={setGasPrice}
          min={100}
          step={1}
          unit="円/L"
        />
        <NumberInput
          id="trips"
          label="月間の往復回数"
          value={trips}
          onChange={setTrips}
          min={1}
          step={1}
          unit="回"
          helpText="通勤なら出勤日数（例: 20日）"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white">計算結果</h2>
          <ResultCard
            label="月間ガソリン代"
            value={`${Math.round(result.monthly).toLocaleString()}円`}
            highlight
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              label="片道"
              value={`${Math.round(result.oneWay).toLocaleString()}円`}
            />
            <ResultCard
              label="1往復"
              value={`${Math.round(result.roundTrip).toLocaleString()}円`}
            />
            <ResultCard
              label="年間合計"
              value={`${Math.round(result.annual).toLocaleString()}円`}
            />
            <ResultCard
              label="1kmあたりのコスト"
              value={`${result.perKm.toFixed(1)}円/km`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
