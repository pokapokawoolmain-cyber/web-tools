"use client";

// ブランドカラー×文字色自動提案
// 背景色を選ぶと、読みやすい文字色候補・WCAG判定・アクセントを即時提案。

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import {
  hexToRgb, rgbToHex, normalizeHex, contrastRatio, wcag,
  bestTextColor, adjustLightness, rotateHue, toRgbString, toTailwind,
} from "@/lib/color";

const PRESETS: { label: string; color: string }[] = [
  { label: "X（ブルー）", color: "#1D9BF0" },
  { label: "LINE", color: "#06C755" },
  { label: "楽天", color: "#BF0000" },
  { label: "コーポレート紺", color: "#0F3D6E" },
  { label: "エコグリーン", color: "#2E7D32" },
  { label: "サンセット", color: "#F4511E" },
  { label: "パステル紫", color: "#B39DDB" },
  { label: "背景グレー", color: "#F5F5F5" },
];

function CopyChip({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
      }}
      className="inline-flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors text-left"
    >
      <span className="text-[11px] text-slate-400 dark:text-zinc-500 w-14 shrink-0">{label}</span>
      <span className="text-[12px] font-mono text-slate-700 dark:text-zinc-200 flex-1">{value}</span>
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ok ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600"}`}>
      {label} {ok ? "○" : "×"}
    </span>
  );
}

export function BrandColorText() {
  const [bg, setBg] = useState("#0F3D6E");

  const norm = normalizeHex(bg) ?? "#0F3D6E";
  const rgb = hexToRgb(norm)!;

  const recommended = bestTextColor(norm);

  // 文字色候補（明度調整で黒/白と重複する場合は除外）
  const candidates = useMemo(() => {
    const list = [
      { name: "白", hex: "#FFFFFF" },
      { name: "黒", hex: "#000000" },
      { name: "明るいトーン", hex: adjustLightness(norm, 45) },
      { name: "暗いトーン", hex: adjustLightness(norm, -45) },
    ];
    const seen = new Set<string>();
    const deduped = list.filter((c) => {
      if (seen.has(c.hex)) return false;
      seen.add(c.hex);
      return true;
    });
    return deduped.map((c) => {
      const ratio = contrastRatio(norm, c.hex) ?? 1;
      return { ...c, ...wcag(ratio) };
    }).sort((a, b) => b.ratio - a.ratio);
  }, [norm]);

  // アクセント候補
  const accents = useMemo(() => [
    { name: "補色", hex: rotateHue(norm, 180) },
    { name: "類似色", hex: rotateHue(norm, 30) },
    { name: "類似色", hex: rotateHue(norm, -30) },
  ], [norm]);

  const textColor = recommended;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 sm:p-6 space-y-4">
        <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">ブランドカラー（背景色）を選ぶ</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={norm}
            onChange={(e) => setBg(e.target.value)}
            aria-label="カラーピッカー"
            className="w-14 h-14 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer bg-transparent p-1"
          />
          <input
            type="text"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            placeholder="#0F3D6E"
            className="flex-1 h-12 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[15px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setBg(p.color)}
              className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-700 text-[12px] text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors"
            >
              <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ライブプレビュー */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700">
        <div className="px-5 py-8 sm:py-10" style={{ background: norm, color: textColor }}>
          <p className="text-[12px] opacity-70 mb-1">おすすめの文字色: {textColor}</p>
          <h3 className="text-[22px] sm:text-[26px] font-bold mb-2">見出しテキストの見え方</h3>
          <p className="text-[14px] leading-relaxed opacity-90 mb-5">
            この背景色に対して自動で選んだ文字色でのプレビューです。本文がストレスなく読めるかを確認できます。
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-5 py-2.5 rounded-full text-[14px] font-bold" style={{ background: textColor, color: norm }}>
              ボタン
            </span>
            <span className="inline-flex items-center px-5 py-2.5 rounded-full text-[14px] font-semibold border" style={{ borderColor: textColor, color: textColor }}>
              枠線ボタン
            </span>
          </div>
        </div>
      </div>

      {/* コピー */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <CopyChip label="HEX" value={norm} />
        <CopyChip label="RGB" value={toRgbString(rgb)} />
        <CopyChip label="CSS" value={`background: ${norm}; color: ${textColor};`} />
        <CopyChip label="Tailwind" value={`${toTailwind(norm, "bg")} ${toTailwind(rgbToHex(hexToRgb(textColor)!), "text")}`} />
      </div>

      {/* 文字色候補＋WCAG */}
      <section>
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3">文字色の候補と読みやすさ（WCAG判定）</h2>
        <div className="space-y-2">
          {candidates.map((c) => (
            <div key={`${c.name}-${c.hex}`} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-zinc-700 p-3">
              <span className="w-10 h-10 rounded-lg border border-black/10 shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ background: norm, color: c.hex }}>Aa</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-200">{c.name} <span className="font-mono text-slate-400 text-[11px]">{c.hex}</span></p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">コントラスト比 {c.ratio.toFixed(2)}:1</p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end shrink-0">
                <Badge ok={c.aa} label="AA" />
                <Badge ok={c.aaa} label="AAA" />
                <Badge ok={c.aaLarge} label="大AA" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
          本文には「AA○」以上（コントラスト比4.5:1以上）、見出しなど大きな文字は「大AA○」（3:1以上）を目安にしてください。
        </p>
      </section>

      {/* アクセント */}
      <section>
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3">相性のよいアクセントカラー</h2>
        <div className="grid grid-cols-3 gap-2">
          {accents.map((a, i) => (
            <button
              key={i}
              onClick={() => setBg(a.hex)}
              className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors"
            >
              <span className="block h-12" style={{ background: a.hex }} />
              <span className="block px-2 py-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                {a.name}<br /><span className="font-mono">{a.hex}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">タップするとその色を背景色として読み込みます。</p>
      </section>
    </div>
  );
}
