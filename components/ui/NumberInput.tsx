"use client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  className?: string;
};

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  unit,
  helpText,
  className,
}: NumberInputProps) {
  const [text, setText] = useState(String(value));
  const isFocused = useRef(false);

  // 外部から value が変わった場合（親リセット等）はフォーカス外でのみ同期
  useEffect(() => {
    if (!isFocused.current) {
      setText(String(value));
    }
  }, [value]);

  const clamp = (n: number) => {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 数字のみ許可（整数）
    const raw = e.target.value.replace(/[^\d]/g, "");
    setText(raw);
    if (raw !== "") {
      onChange(clamp(Number(raw)));
    }
  };

  const handleBlur = () => {
    isFocused.current = false;
    const n = text === "" ? (min ?? 0) : Number(text);
    const final = clamp(isNaN(n) ? (min ?? 0) : n);
    onChange(final);
    setText(String(final));
  };

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
          type="text"
          inputMode="numeric"
          value={text}
          onChange={handleChange}
          onFocus={() => { isFocused.current = true; }}
          onBlur={handleBlur}
          className="input-base flex-1"
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
