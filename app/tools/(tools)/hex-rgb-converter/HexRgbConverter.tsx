"use client";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

// ─── カラー変換ユーティリティ ──────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

// ─── 日本の伝統色 ──────────────────────────────────────────
const TRADITIONAL_COLORS = [
  { name: "弁柄色", hex: "#9F2337" },
  { name: "紅梅色", hex: "#E5516B" },
  { name: "珊瑚色", hex: "#F08080" },
  { name: "朱色",   hex: "#E8552E" },
  { name: "柿色",   hex: "#F4693A" },
  { name: "山吹色", hex: "#F6AE2D" },
  { name: "黄檗色", hex: "#EFDF5C" },
  { name: "若草色", hex: "#A5CC42" },
  { name: "萌葱色", hex: "#1A7A4A" },
  { name: "青竹色", hex: "#70B89A" },
  { name: "水色",   hex: "#88C5DA" },
  { name: "縹色",   hex: "#3975A8" },
  { name: "藍色",   hex: "#1E3B6E" },
  { name: "紫苑色", hex: "#8B7BAB" },
  { name: "藤色",   hex: "#B29EC4" },
  { name: "江戸紫", hex: "#5C2D84" },
  { name: "鶯色",   hex: "#7F7B37" },
  { name: "薄桜",   hex: "#FEEEED" },
  { name: "桜色",   hex: "#FEE3E2" },
  { name: "墨色",   hex: "#4A4A4A" },
];

// ─── コピーボタン ───────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] font-medium transition-colors bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {copied ? "コピー済み" : "コピー"}
    </button>
  );
}

// ─── メインコンポーネント ────────────────────────────────────
export function HexRgbConverter() {
  const [hex, setHex] = useState("#FF6B35");
  const [r, setR] = useState(255);
  const [g, setG] = useState(107);
  const [b, setB] = useState(53);
  const [h, setH] = useState(18);
  const [s, setS] = useState(100);
  const [l, setL] = useState(60);
  const [hexError, setHexError] = useState(false);

  const updateFromHex = useCallback((value: string) => {
    const clean = value.startsWith("#") ? value : "#" + value;
    setHex(clean.toUpperCase());
    const rgb = hexToRgb(clean);
    if (rgb) {
      setR(rgb.r); setG(rgb.g); setB(rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h); setS(hsl.s); setL(hsl.l);
      setHexError(false);
    } else {
      setHexError(clean.replace("#", "").length > 0);
    }
  }, []);

  const updateFromRgb = useCallback((nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    const newHex = rgbToHex(nr, ng, nb);
    setHex(newHex);
    const hsl = rgbToHsl(nr, ng, nb);
    setH(hsl.h); setS(hsl.s); setL(hsl.l);
    setHexError(false);
  }, []);

  const updateFromHsl = useCallback((nh: number, ns: number, nl: number) => {
    setH(nh); setS(ns); setL(nl);
    const rgb = hslToRgb(nh, ns, nl);
    setR(rgb.r); setG(rgb.g); setB(rgb.b);
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHex(newHex);
    setHexError(false);
  }, []);

  const validHex = !hexError && hex.length === 7;
  const currentColor = validHex ? hex : "#cccccc";

  const cssRgb = `rgb(${r}, ${g}, ${b})`;
  const cssHsl = `hsl(${h}, ${s}%, ${l}%)`;
  const cssVar = `--color: ${hex};`;
  const cssRgbVar = `--color-rgb: ${r}, ${g}, ${b};`;

  return (
    <div className="space-y-6">
      {/* カラーピッカー + プレビュー */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 大プレビュー */}
        <div
          className="w-full sm:w-48 h-32 rounded-2xl border border-slate-200 dark:border-zinc-700 flex-shrink-0 shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
        {/* ピッカー + HEX */}
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1">カラーピッカー</label>
            <input
              type="color"
              value={validHex ? hex : "#cccccc"}
              onChange={e => updateFromHex(e.target.value)}
              className="w-16 h-10 rounded-lg border border-slate-300 dark:border-zinc-600 cursor-pointer p-0.5 bg-white dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1">HEX</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hex}
                maxLength={7}
                onChange={e => updateFromHex(e.target.value)}
                placeholder="#FF6B35"
                className={`flex-1 px-3 py-2 rounded-xl border text-[14px] font-mono uppercase bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 ${hexError ? "border-red-400 focus:ring-red-300" : "border-slate-300 dark:border-zinc-600 focus:ring-pink-300"}`}
              />
              <CopyButton text={hex} />
            </div>
            {hexError && <p className="text-[11px] text-red-500 mt-1">有効なHEXカラーコードを入力してください（例: #FF6B35）</p>}
          </div>
        </div>
      </div>

      {/* RGB */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300">RGB</h3>
          <CopyButton text={cssRgb} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "R（赤）", value: r, color: "text-red-500", setter: (v: number) => updateFromRgb(v, g, b) },
            { label: "G（緑）", value: g, color: "text-emerald-500", setter: (v: number) => updateFromRgb(r, v, b) },
            { label: "B（青）", value: b, color: "text-blue-500", setter: (v: number) => updateFromRgb(r, g, v) },
          ].map(({ label, value, color, setter }) => (
            <div key={label}>
              <label className={`block text-[11px] font-semibold ${color} mb-1`}>{label}</label>
              <input
                type="number"
                min={0} max={255}
                value={value}
                onChange={e => setter(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] font-mono text-center bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          ))}
        </div>
        <p className="text-[12px] font-mono text-slate-500 dark:text-zinc-400">{cssRgb}</p>
      </div>

      {/* HSL */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300">HSL</h3>
          <CopyButton text={cssHsl} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "H（色相）", value: h, max: 360, unit: "°", setter: (v: number) => updateFromHsl(v, s, l) },
            { label: "S（彩度）", value: s, max: 100, unit: "%", setter: (v: number) => updateFromHsl(h, v, l) },
            { label: "L（明度）", value: l, max: 100, unit: "%", setter: (v: number) => updateFromHsl(h, s, v) },
          ].map(({ label, value, max, unit, setter }) => (
            <div key={label}>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">{label}</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min={0} max={max}
                  value={value}
                  onChange={e => setter(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] font-mono text-center bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <span className="text-[11px] text-slate-400 ml-1">{unit}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] font-mono text-slate-500 dark:text-zinc-400">{cssHsl}</p>
      </div>

      {/* CSS変数出力 */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-2">
        <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300">CSS変数出力</h3>
        <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-zinc-700">
          <code className="text-[12px] font-mono text-slate-600 dark:text-zinc-400 truncate">{cssVar}</code>
          <CopyButton text={cssVar} />
        </div>
        <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-zinc-700">
          <code className="text-[12px] font-mono text-slate-600 dark:text-zinc-400 truncate">{cssRgbVar}</code>
          <CopyButton text={cssRgbVar} />
        </div>
      </div>

      {/* 日本の伝統色 */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200 mb-3">🗾 日本の伝統色</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {TRADITIONAL_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => updateFromHex(color.hex)}
              className="group flex flex-col items-center gap-1 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all hover:shadow-md"
              title={`${color.name} ${color.hex}`}
            >
              <div
                className="w-full h-8 rounded-lg"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[9px] font-medium text-slate-600 dark:text-zinc-400 text-center leading-tight">{color.name}</span>
              <span className="text-[8px] font-mono text-slate-400 dark:text-zinc-500">{color.hex}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
