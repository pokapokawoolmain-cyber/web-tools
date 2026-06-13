"use client";
import { useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  /** When provided a reset button appears whenever value ≠ defaultValue */
  defaultValue?: number;
}

/**
 * Accessible slider with:
 * - Pointer Events API + setPointerCapture for reliable mobile drag
 * - touchAction:"none" so the track doesn't also scroll the page
 * - 44 px tall touch target with thin (6 px) visual track inside
 * - Blue filled track showing current position
 * - Inline number input for precise entry
 * - Optional reset-to-default button (RotateCcw icon)
 * - Full keyboard support (Arrow / Page / Home / End)
 */
export function SliderRow({
  label, min, max, step = 1, value, onChange, unit = "", defaultValue,
}: SliderRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  /** Round raw value to nearest step, then clamp to [min, max] */
  const clamp = useCallback(
    (v: number): number => {
      const stepped = Math.round((v - min) / step) * step + min;
      const clamped = Math.max(min, Math.min(max, stepped));
      // Avoid floating-point artifacts like 0.30000000004
      const places = step < 1 ? (String(step).split(".")[1]?.length ?? 2) : 0;
      return parseFloat(clamped.toFixed(places));
    },
    [min, max, step],
  );

  const fromClientX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const { left, width } = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
      return clamp(min + ratio * (max - min));
    },
    [min, max, value, clamp],
  );

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    trackRef.current?.setPointerCapture(e.pointerId);
    dragging.current = true;
    onChange(fromClientX(e.clientX));
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) onChange(fromClientX(e.clientX));
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    onChange(fromClientX(e.clientX));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const big = Math.max(step, Math.round((max - min) / 10 / step) * step);
    switch (e.key) {
      case "ArrowRight": case "ArrowUp":
        e.preventDefault(); onChange(clamp(value + step)); break;
      case "ArrowLeft": case "ArrowDown":
        e.preventDefault(); onChange(clamp(value - step)); break;
      case "PageUp":
        e.preventDefault(); onChange(clamp(value + big)); break;
      case "PageDown":
        e.preventDefault(); onChange(clamp(value - big)); break;
      case "Home":
        e.preventDefault(); onChange(min); break;
      case "End":
        e.preventDefault(); onChange(max); break;
    }
  };

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div>
      {/* Label row: name (left) + number input + unit + optional reset (right) */}
      <div className="flex items-center justify-between text-xs mb-0.5">
        <span className="font-medium text-slate-600 dark:text-zinc-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => {
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) onChange(clamp(n));
            }}
            className="w-14 text-right rounded border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 py-0.5 px-1.5"
          />
          {unit && (
            <span className="text-slate-400 w-4 flex-shrink-0 text-left">{unit}</span>
          )}
          {defaultValue !== undefined && value !== defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              title="初期値へ戻す"
              aria-label="初期値へ戻す"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 44 px tall touch target — thin 6 px visual track inside */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="relative flex items-center cursor-pointer select-none rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        style={{ height: 44, touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        {/* Background track */}
        <div className="absolute inset-x-0 h-1.5 bg-slate-200 dark:bg-zinc-600 rounded-full" />
        {/* Filled portion */}
        <div
          className="absolute h-1.5 bg-blue-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white dark:bg-zinc-100 border-2 border-blue-500 shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
    </div>
  );
}
