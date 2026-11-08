"use client";
import { useEffect, useState } from "react";
import { detectPlatform, PRINT_STEPS, type PrintPlatform } from "@/lib/print-save";

const TONES = {
  blue: {
    heading: "text-blue-700 dark:text-blue-300",
    step: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200",
    on: "bg-blue-600 border-blue-600 text-white",
    off: "bg-white dark:bg-zinc-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  },
  green: {
    heading: "text-green-700 dark:text-green-300",
    step: "text-green-600 dark:text-green-400",
    badge: "bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200",
    on: "bg-green-600 border-green-600 text-white",
    off: "bg-white dark:bg-zinc-800 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
  },
} as const;

// 「PDFとして保存」の手順。使っている端末の手順を先に出し、ほかの端末にも切り替えられる
export function PrintSaveGuide({ tone = "blue" }: { tone?: keyof typeof TONES }) {
  const [platform, setPlatform] = useState<PrintPlatform>("desktop");
  useEffect(() => setPlatform(detectPlatform()), []);
  const t = TONES[tone];

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className={`text-[12px] font-semibold ${t.heading}`}>保存のしかた</p>
        <div role="tablist" aria-label="端末を選ぶ" className="flex gap-1">
          {(Object.keys(PRINT_STEPS) as PrintPlatform[]).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={p === platform}
              onClick={() => setPlatform(p)}
              className={`text-[11px] px-2.5 py-1 min-h-[32px] rounded-full border transition-colors ${p === platform ? t.on : t.off}`}
            >
              {PRINT_STEPS[p].label}
            </button>
          ))}
        </div>
      </div>
      <ol className="space-y-1.5" role="tabpanel">
        {PRINT_STEPS[platform].steps.map((step, i) => (
          <li key={i} className={`flex items-start gap-2 text-[12px] ${t.step}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${t.badge}`}>
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
