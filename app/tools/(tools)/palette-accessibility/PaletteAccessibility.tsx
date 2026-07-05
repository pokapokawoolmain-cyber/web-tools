"use client";

// 配色アクセシビリティチェッカー
// パレット（複数色）の全組み合わせをWCAG判定し、行列で表示。

import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { normalizeHex, contrastRatio, wcag } from "@/lib/color";

const PRESETS: { label: string; colors: string[] }[] = [
  { label: "コーポレート", colors: ["#0F3D6E", "#1D9BF0", "#F5F5F5", "#1A1A1A"] },
  { label: "ナチュラル", colors: ["#2E7D32", "#A5D6A7", "#FFFFFF", "#3E2723"] },
  { label: "ビビッド", colors: ["#F4511E", "#FFC107", "#212121", "#FFFFFF"] },
];

function cellStyle(ratio: number) {
  const w = wcag(ratio);
  if (w.aaa) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  if (w.aa) return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300";
  if (w.aaLarge) return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
}
function cellLabel(ratio: number) {
  const w = wcag(ratio);
  if (w.aaa) return "AAA";
  if (w.aa) return "AA";
  if (w.aaLarge) return "大字";
  return "不可";
}

export function PaletteAccessibility() {
  const [colors, setColors] = useState<string[]>(["#0F3D6E", "#1D9BF0", "#F5F5F5", "#1A1A1A"]);

  const valid = colors.map((c) => normalizeHex(c) ?? "#000000");

  const update = (i: number, v: string) => setColors((p) => p.map((c, idx) => (idx === i ? v : c)));
  const add = () => colors.length < 6 && setColors((p) => [...p, "#888888"]);
  const remove = (i: number) => colors.length > 2 && setColors((p) => p.filter((_, idx) => idx !== i));

  // 安全な組み合わせ数
  const summary = useMemo(() => {
    let aa = 0, total = 0;
    for (let i = 0; i < valid.length; i++) {
      for (let j = 0; j < valid.length; j++) {
        if (i === j) continue;
        total++;
        if ((contrastRatio(valid[i], valid[j]) ?? 1) >= 4.5) aa++;
      }
    }
    return { aa, total: total / 2 };
  }, [valid]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 色の入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">配色（2〜6色）</p>
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
                <button onClick={() => remove(i)} aria-label="削除" className="p-1 text-slate-400 hover:text-rose-500">
                  <X className="w-3.5 h-3.5" />
                </button>
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

      {/* サマリー */}
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 px-4 py-3 text-[13px] text-slate-600 dark:text-zinc-300">
        本文に使える（AA 4.5:1以上）組み合わせは <strong className="text-slate-900 dark:text-white">{summary.aa} / {summary.total * 2}</strong> 通りです。
      </div>

      {/* コントラスト行列 */}
      <div className="overflow-x-auto -mx-1">
        <table className="border-separate border-spacing-1 mx-auto">
          <thead>
            <tr>
              <th className="w-12" />
              {valid.map((c, i) => (
                <th key={i} className="p-0">
                  <span className="block w-12 h-8 rounded-md border border-black/10 mx-auto" style={{ background: c }} title={`背景 ${c}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {valid.map((fg, r) => (
              <tr key={r}>
                <th className="p-0">
                  <span className="block w-12 h-10 rounded-md border border-black/10" style={{ background: fg }} title={`文字 ${fg}`} />
                </th>
                {valid.map((bg, c) => {
                  if (r === c) return <td key={c} className="w-12 h-10 rounded-md bg-slate-100 dark:bg-zinc-800" />;
                  const ratio = contrastRatio(fg, bg) ?? 1;
                  return (
                    <td key={c} className={`w-12 h-10 rounded-md text-center align-middle ${cellStyle(ratio)}`}>
                      <span className="block text-[10px] font-bold leading-none">{cellLabel(ratio)}</span>
                      <span className="block text-[9px] leading-tight mt-0.5">{ratio.toFixed(1)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500 text-center">
        縦＝文字色、横＝背景色。<span className="text-emerald-600 dark:text-emerald-400">AAA</span>／<span className="text-cyan-600 dark:text-cyan-400">AA</span>（本文OK）／<span className="text-amber-600 dark:text-amber-400">大字</span>（大きな文字のみ）／<span className="text-rose-500">不可</span>。数字はコントラスト比。
      </p>
    </div>
  );
}
