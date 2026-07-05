"use client";

// 色覚シミュレーター
// パレットの色が各色覚型でどう見えるかを並べて表示し、
// 区別しにくくなる組み合わせを警告する。

import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import {
  normalizeHex, simulateColorBlind, contrastRatio,
  CVD_LABELS, type ColorBlindType,
} from "@/lib/color";

const TYPES: ColorBlindType[] = ["deuteranopia", "protanopia", "tritanopia", "achromatopsia"];

const PRESETS: { label: string; colors: string[] }[] = [
  { label: "信号・グラフ", colors: ["#E53935", "#43A047", "#FDD835"] },
  { label: "赤緑の注意", colors: ["#D32F2F", "#388E3C", "#1976D2"] },
  { label: "UIカラー", colors: ["#1D9BF0", "#06C755", "#F4511E", "#9C27B0"] },
];

export function ColorBlindSimulator() {
  const [colors, setColors] = useState<string[]>(["#E53935", "#43A047", "#FDD835"]);

  const valid = colors.map((c) => normalizeHex(c) ?? "#000000");
  const update = (i: number, v: string) => setColors((p) => p.map((c, idx) => (idx === i ? v : c)));
  const add = () => colors.length < 6 && setColors((p) => [...p, "#1976D2"]);
  const remove = (i: number) => colors.length > 2 && setColors((p) => p.filter((_, idx) => idx !== i));

  // 各色覚型で「見分けにくくなる」ペアを検出（変換後コントラスト比が1.3未満）
  const warnings = useMemo(() => {
    const result: { type: ColorBlindType; pairs: [string, string][] }[] = [];
    for (const type of TYPES) {
      const sim = valid.map((c) => simulateColorBlind(c, type));
      const pairs: [string, string][] = [];
      for (let i = 0; i < sim.length; i++) {
        for (let j = i + 1; j < sim.length; j++) {
          if ((contrastRatio(sim[i], sim[j]) ?? 1) < 1.25) pairs.push([valid[i], valid[j]]);
        }
      }
      if (pairs.length) result.push({ type, pairs });
    }
    return result;
  }, [valid]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">確認する色（2〜6色）</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setColors(p.colors)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300">
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 p-1.5">
              <input type="color" value={valid[i]} onChange={(e) => update(i, e.target.value)} aria-label={`色${i + 1}`}
                className="w-9 h-9 rounded-lg cursor-pointer bg-transparent p-0.5" />
              <input type="text" value={c} onChange={(e) => update(i, e.target.value)}
                className="w-[86px] h-9 px-2 rounded-lg border-0 bg-transparent text-slate-900 dark:text-white text-[13px] font-mono focus:outline-none" />
              {colors.length > 2 && (
                <button onClick={() => remove(i)} aria-label="削除" className="p-1 text-slate-400 hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
          ))}
          {colors.length < 6 && (
            <button onClick={add} className="flex items-center gap-1 h-[52px] px-3 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-slate-400 hover:text-slate-600 text-[13px]">
              <Plus className="w-4 h-4" />色を追加
            </button>
          )}
        </div>
      </div>

      {/* 見え方の比較 */}
      <div className="space-y-3">
        {/* 通常 */}
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <p className="px-4 py-2 text-[12px] font-semibold text-slate-600 dark:text-zinc-300 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
            通常の見え方（一般色覚）
          </p>
          <div className="flex">
            {valid.map((c, i) => (
              <span key={i} className="flex-1 h-14" style={{ background: c }} title={c} />
            ))}
          </div>
        </div>
        {/* 各型 */}
        {TYPES.map((type) => {
          const info = CVD_LABELS[type];
          return (
            <div key={type} className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              <p className="px-4 py-2 text-[12px] font-semibold text-slate-600 dark:text-zinc-300 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
                {info.label} <span className="font-normal text-slate-400 dark:text-zinc-500">— {info.desc}</span>
              </p>
              <div className="flex">
                {valid.map((c, i) => (
                  <span key={i} className="flex-1 h-14" style={{ background: simulateColorBlind(c, type) }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 警告 */}
      {warnings.length > 0 ? (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
          <p className="text-[13px] font-bold text-amber-800 dark:text-amber-300 mb-2">⚠️ 見分けにくくなる組み合わせがあります</p>
          <ul className="space-y-1.5 text-[12px] text-amber-700 dark:text-amber-400">
            {warnings.map((w) => (
              <li key={w.type} className="flex items-start gap-2">
                <span className="font-semibold shrink-0">{CVD_LABELS[w.type].label}：</span>
                <span className="flex flex-wrap gap-1.5">
                  {w.pairs.map(([a, b], i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm border border-black/10" style={{ background: a }} />
                      <span className="w-3 h-3 rounded-sm border border-black/10" style={{ background: b }} />
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-2">
            色だけで情報を区別せず、アイコン・テキスト・模様・位置などを併用すると伝わりやすくなります。
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3 text-[13px] text-emerald-700 dark:text-emerald-400">
          ✅ 主要な色覚型でも、登録した色は概ね見分けられます。
        </div>
      )}
    </div>
  );
}
