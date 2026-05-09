"use client";
// ========================================
// 数値入力コンポーネント（ツール共通）
// ラベル・単位・ヘルプテキストをセット
// ========================================
import { cn } from "@/lib/utils";

type NumberInputProps = {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;        // 入力欄の右側に表示（例: "万円", "%"）
  helpText?: string;    // ラベル下の補足テキスト
  className?: string;
};

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  helpText,
  className,
}: NumberInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {helpText && (
        <p className="text-xs text-slate-400 dark:text-slate-500">{helpText}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-base flex-1"
          inputMode="numeric"    // スマホで数字キーボードを表示
        />
        {unit && (
          <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
