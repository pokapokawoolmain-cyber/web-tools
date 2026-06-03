"use client";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

// ─── カラー変換ユーティリティ ──────────────────────────────
function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
    case gn: h = ((bn - rn) / d + 2) / 6; break;
    case bn: h = ((rn - gn) / d + 4) / 6; break;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255);
  };
  return rgbToHex(f(0), f(8), f(4));
}

// ─── パレット生成 ─────────────────────────────────────────
type PaletteColor = { hex: string; label: string };

function generatePalette(baseHex: string, type: string): PaletteColor[] {
  const rgb = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  switch (type) {
    case "complement":
      return [
        { hex: baseHex, label: "ベース" },
        { hex: hslToHex((h + 30) % 360, s, l), label: "ベース+30°" },
        { hex: hslToHex((h + 180) % 360, s, l), label: "補色" },
        { hex: hslToHex((h + 210) % 360, s, l), label: "補色+30°" },
        { hex: hslToHex(h, s, Math.max(20, l - 20)), label: "ベース（暗）" },
      ];
    case "analogous":
      return [
        { hex: hslToHex((h - 60 + 360) % 360, s, l), label: "-60°" },
        { hex: hslToHex((h - 30 + 360) % 360, s, l), label: "-30°" },
        { hex: baseHex, label: "ベース" },
        { hex: hslToHex((h + 30) % 360, s, l), label: "+30°" },
        { hex: hslToHex((h + 60) % 360, s, l), label: "+60°" },
      ];
    case "triadic":
      return [
        { hex: baseHex, label: "ベース" },
        { hex: hslToHex((h + 120) % 360, s, l), label: "+120°" },
        { hex: hslToHex((h + 240) % 360, s, l), label: "+240°" },
        { hex: hslToHex(h, Math.max(20, s - 20), l), label: "ベース（淡）" },
        { hex: hslToHex((h + 120) % 360, Math.max(20, s - 20), l), label: "+120°（淡）" },
      ];
    case "split":
      return [
        { hex: baseHex, label: "ベース" },
        { hex: hslToHex((h + 150) % 360, s, l), label: "+150°" },
        { hex: hslToHex((h + 210) % 360, s, l), label: "+210°" },
        { hex: hslToHex(h, Math.max(20, s - 30), Math.min(90, l + 20)), label: "ライト" },
        { hex: hslToHex(h, s, Math.max(10, l - 30)), label: "ダーク" },
      ];
    case "monochromatic":
      return [10, 25, 40, 60, 75].map(lightness => ({
        hex: hslToHex(h, s, lightness),
        label: `L:${lightness}%`,
      }));
    default:
      return [];
  }
}

// ─── パレットタイプ定義 ────────────────────────────────────
const PALETTE_TYPES = [
  { id: "complement", label: "補色",   desc: "対角線上の色でメリハリ" },
  { id: "analogous",  label: "類似色", desc: "隣り合う色で統一感" },
  { id: "triadic",    label: "トライアド", desc: "3色バランス配色" },
  { id: "split",      label: "分裂補色", desc: "柔らかい補色対比" },
  { id: "monochromatic", label: "モノクロ", desc: "明度違いの5段階" },
];

// ─── コピーボタン ───────────────────────────────────────────
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 transition-colors"
    >
      {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
      {label ?? (copied ? "コピー済み" : "コピー")}
    </button>
  );
}

export function ColorPalette() {
  const [baseHex, setBaseHex] = useState("#667EEA");
  const [activeType, setActiveType] = useState("analogous");

  const palette = generatePalette(baseHex, activeType);

  const handleHexInput = useCallback((val: string) => {
    const v = val.startsWith("#") ? val.toUpperCase() : ("#" + val).toUpperCase();
    setBaseHex(v);
  }, []);

  const cssVars = palette
    .map((c, i) => `--color-${i + 1}: ${c.hex};`)
    .join("\n");

  const textClass = (hex: string) => {
    const rgb = hexToRgb(hex);
    const l = rgbToHsl(rgb.r, rgb.g, rgb.b).l;
    return l > 50 ? "text-slate-800" : "text-white";
  };

  return (
    <div className="space-y-6">
      {/* ベースカラー選択 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div>
          <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1">ベースカラー</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={baseHex.length === 7 ? baseHex : "#667eea"}
              onChange={e => setBaseHex(e.target.value.toUpperCase())}
              className="w-12 h-10 rounded-lg border border-slate-300 dark:border-zinc-600 cursor-pointer p-0.5 bg-white dark:bg-zinc-800"
            />
            <input
              type="text"
              value={baseHex}
              maxLength={7}
              onChange={e => handleHexInput(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-600 text-[13px] font-mono uppercase bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>
        <div
          className="w-20 h-10 rounded-xl border border-slate-200 dark:border-zinc-700 flex-shrink-0"
          style={{ backgroundColor: baseHex.length === 7 ? baseHex : "#667eea" }}
        />
      </div>

      {/* パレットタイプ選択 */}
      <div>
        <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-2">配色パターン</label>
        <div className="flex flex-wrap gap-2">
          {PALETTE_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border transition-all ${
                activeType === t.id
                  ? "bg-pink-500 text-white border-pink-500 shadow-md"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-pink-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
          {PALETTE_TYPES.find(t => t.id === activeType)?.desc}
        </p>
      </div>

      {/* パレット表示 */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700">
        <div className="flex h-24">
          {palette.map((c, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {palette.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-[9px] font-bold"
                style={{ backgroundColor: c.hex }}
              >
                <span className={textClass(c.hex)}>{i + 1}</span>
              </div>
              <code className="text-[13px] font-mono text-slate-800 dark:text-zinc-200 flex-shrink-0 w-20">{c.hex}</code>
              <span className="text-[12px] text-slate-500 dark:text-zinc-400 flex-1">{c.label}</span>
              <CopyBtn text={c.hex} />
            </div>
          ))}
        </div>
      </div>

      {/* CSS変数まとめコピー */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300">CSS変数としてコピー</h3>
          <CopyBtn text={cssVars} label="全色コピー" />
        </div>
        <pre className="text-[12px] font-mono text-slate-600 dark:text-zinc-400 whitespace-pre-wrap">{cssVars}</pre>
      </div>

      {/* 使い方ヒント */}
      <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 rounded-2xl p-4">
        <p className="text-[12px] text-pink-700 dark:text-pink-300">
          💡 <strong>活用ヒント：</strong>上のCSS変数をCSSの <code className="font-mono">:root &#123;&#125;</code> に貼り付けると、プロジェクト全体でカラーを一元管理できます。
        </p>
      </div>
    </div>
  );
}
