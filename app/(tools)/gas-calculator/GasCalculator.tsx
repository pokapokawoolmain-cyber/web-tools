"use client";
import { useState, useMemo } from "react";
import { SliderInput } from "@/components/ui/SliderInput";
import { ResultCard } from "@/components/ui/ResultCard";

export function GasCalculator() {
  const [distance, setDistance] = useState(20);
  const [fuelEff, setFuelEff]   = useState(15);
  const [gasPrice, setGasPrice] = useState(175);
  const [trips, setTrips]       = useState(20);

  const result = useMemo(() => {
    if (fuelEff === 0) return null;
    const oneWay   = (distance / fuelEff) * gasPrice;
    const roundTrip = oneWay * 2;
    const monthly  = roundTrip * trips;
    const annual   = monthly * 12;
    const perKm    = gasPrice / fuelEff;
    return { oneWay, roundTrip, monthly, annual, perKm };
  }, [distance, fuelEff, gasPrice, trips]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <h2 className="font-bold text-slate-900 dark:text-white">条件を入力</h2>

        <SliderInput
          id="distance"
          label="片道の距離"
          value={distance}
          onChange={setDistance}
          min={0.5}
          max={500}
          step={0.5}
          unit="km"
          formatValue={(v) => `${v}km`}
        />
        <SliderInput
          id="fuel-eff"
          label="燃費"
          value={fuelEff}
          onChange={setFuelEff}
          min={1}
          max={40}
          step={0.5}
          unit="km/L"
          formatValue={(v) => `${v}km/L`}
        />
        <SliderInput
          id="gas-price"
          label="ガソリン価格"
          value={gasPrice}
          onChange={setGasPrice}
          min={100}
          max={300}
          step={1}
          unit="円/L"
          formatValue={(v) => `${v}円/L`}
        />
        <SliderInput
          id="trips"
          label="月間の往復回数"
          value={trips}
          onChange={setTrips}
          min={1}
          max={31}
          step={1}
          unit="回"
          formatValue={(v) => `${v}回`}
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
            <ResultCard label="片道" value={`${Math.round(result.oneWay).toLocaleString()}円`} />
            <ResultCard label="1往復" value={`${Math.round(result.roundTrip).toLocaleString()}円`} />
            <ResultCard label="年間合計" value={`${Math.round(result.annual).toLocaleString()}円`} />
            <ResultCard label="1kmあたり" value={`${result.perKm.toFixed(1)}円/km`} />
          </div>
        </div>
      )}
    </div>
  );
}
