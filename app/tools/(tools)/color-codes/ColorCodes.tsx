"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { hexToRgb, toRgbString } from "@/lib/color";
import { COLOR_GROUPS } from "./color-data";

function Swatch({ name, hex, note }: { name: string; hex: string; note?: string }) {
  const [copied, setCopied] = useState<"hex" | "rgb" | null>(null);
  const rgb = hexToRgb(hex);
  const copy = async (kind: "hex" | "rgb") => {
    const val = kind === "hex" ? hex : rgb ? toRgbString(rgb) : hex;
    try { await navigator.clipboard.writeText(val); setCopied(kind); setTimeout(() => setCopied(null), 1500); } catch { /* noop */ }
  };
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
      <div className="h-16" style={{ background: hex }} />
      <div className="p-3">
        <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-100 leading-tight">{name}</p>
        {note && <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-tight">{note}</p>}
        <div className="flex gap-1.5 mt-2">
          <button onClick={() => copy("hex")}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-[11px] font-mono text-slate-600 dark:text-zinc-300 hover:border-slate-300 transition-colors">
            {copied === "hex" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
            {hex}
          </button>
          <button onClick={() => copy("rgb")} aria-label="RGBをコピー"
            className="inline-flex items-center justify-center px-2 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 hover:border-slate-300 transition-colors">
            {copied === "rgb" ? <Check className="w-3 h-3 text-emerald-500" /> : "RGB"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ColorCodes() {
  return (
    <div className="space-y-8 animate-fade-in">
      {COLOR_GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">{group.title}</h2>
          <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-3">{group.desc}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.colors.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </section>
      ))}
      <p className="text-[11px] text-slate-400 dark:text-zinc-600 leading-relaxed">
        ※ ブランドカラーは各社の公開情報や実際の表示に基づく参考値です。正式なブランドガイドラインがある場合はそちらを優先してください。商標・ロゴの利用は各社の規約に従ってください。
      </p>
    </div>
  );
}
