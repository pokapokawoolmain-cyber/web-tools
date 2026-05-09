"use client";
// ========================================
// スライダー入力コンポーネント
// スライダー + 直接入力テキストボックスのコンボ
// ========================================
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type SliderInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  // formatValue: スライダー下のmin/max表示用
  formatValue?: (value: number) => string;
  className?: string;
};

export function SliderInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  className,
}: SliderInputProps) {
  // テキストボックスの表示値（入力中は文字列として保持）
  const [inputText, setInputText] = useState(String(value));

  // 外部からvalueが変わったときにテキストボックスを同期
  useEffect(() => {
    setInputText(String(value));
  }, [value]);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  };

  // フォーカスを外れたとき範囲内に丸める
  const handleBlur = () => {
    const parsed = parseFloat(inputText);
    const clamped = isNaN(parsed) ? value : clamp(parsed);
    onChange(clamped);
    setInputText(String(clamped));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* ラベル + 直接入力フィールド */}
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1"
        >
          {label}
        </label>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <input
            type="number"
            value={inputText}
            min={min}
            max={max}
            step={step}
            onChange={handleTextChange}
            onBlur={handleBlur}
            inputMode="decimal"
            className="w-24 text-right text-sm font-bold text-blue-600 dark:text-blue-400
              bg-blue-50 dark:bg-blue-950/30
              border border-blue-200 dark:border-blue-800
              rounded-lg px-2 py-1 tabular-nums
              focus:outline-none focus:ring-2 focus:ring-blue-400
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="text-sm text-slate-500 dark:text-slate-400 w-fit">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* スライダー */}
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`,
        }}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          dark:[&::-webkit-slider-runnable-track]:bg-zinc-700
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-blue-500
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer"
      />

      {/* min / max 目安表示 */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>{formatValue ? formatValue(min) : `${min}${unit}`}</span>
        <span>{formatValue ? formatValue(max) : `${max}${unit}`}</span>
      </div>
    </div>
  );
}
