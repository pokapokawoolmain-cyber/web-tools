"use client";
// 所持数の −／数値／＋。数値は直接入力もできる（0〜9999 の整数だけ確定。それ以外は元に戻す）
import { useEffect, useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY, clampQuantity, parseQuantity } from "@/lib/goods/quantity";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  /** 読み上げ用（例: 「缶バッジ A の所持数」） */
  label: string;
  size?: "md" | "sm";
}

export function QuantityStepper({ value, onChange, disabled, label, size = "md" }: Props) {
  const id = useId();
  const [text, setText] = useState(String(value));
  const [invalid, setInvalid] = useState(false);
  // 外からの値（保存失敗で戻った等）に追従する
  useEffect(() => {
    setText(String(value));
    setInvalid(false);
  }, [value]);

  function commit(raw: string) {
    const n = parseQuantity(raw);
    if (n === null) {
      setInvalid(true);
      setText(String(value));
      return;
    }
    setInvalid(false);
    if (n !== value) onChange(n);
  }

  const h = size === "md" ? "h-11 w-11" : "h-10 w-10";
  const btnCls = cn(
    h,
    "flex shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-slate-200"
  );
  return (
    <div className="flex flex-col items-end">
      <div role="group" aria-label={label} className="flex items-center gap-1.5">
        <button type="button" className={btnCls} disabled={disabled || value <= 0} onClick={() => onChange(clampQuantity(value - 1))} aria-label={`${label}を1減らす`}>
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          aria-label={label}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : undefined}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-14 min-w-0 rounded-xl border bg-white text-center text-base font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/40 dark:bg-zinc-900 dark:text-white",
            size === "md" ? "h-11" : "h-10",
            invalid ? "border-red-500" : value > 0 ? "border-pink-400 dark:border-pink-500" : "border-slate-300 dark:border-zinc-600"
          )}
        />
        <button
          type="button"
          className={btnCls}
          disabled={disabled || value >= MAX_QUANTITY}
          onClick={() => onChange(clampQuantity(value + 1))}
          aria-label={`${label}を1増やす`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {invalid && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          0〜{MAX_QUANTITY} の整数で入力してください
        </p>
      )}
    </div>
  );
}
