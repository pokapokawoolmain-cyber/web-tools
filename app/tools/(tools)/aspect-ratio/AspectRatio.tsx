"use client";

import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";

// ── 比率プリセット ─────────────────────────────────────────────
const RATIO_PRESETS: { label: string; w: number; h: number; note: string }[] = [
  { label: "16:9", w: 16, h: 9, note: "動画・YouTube・ワイド画面" },
  { label: "4:3", w: 4, h: 3, note: "旧テレビ・スライド標準" },
  { label: "1:1", w: 1, h: 1, note: "正方形・Instagram投稿" },
  { label: "3:2", w: 3, h: 2, note: "一眼レフ写真・L判" },
  { label: "21:9", w: 21, h: 9, note: "ウルトラワイド・シネマ" },
  { label: "9:16", w: 9, h: 16, note: "縦動画・ストーリー・Reels" },
  { label: "2:3", w: 2, h: 3, note: "ポスター・縦写真" },
  { label: "3:4", w: 3, h: 4, note: "縦・スマホ写真" },
];

// ── 解像度プリセット ───────────────────────────────────────────
const RES_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "1920×1080 (FHD)", w: 1920, h: 1080 },
  { label: "1280×720 (HD)", w: 1280, h: 720 },
  { label: "3840×2160 (4K)", w: 3840, h: 2160 },
  { label: "1080×1080 (SNS正方形)", w: 1080, h: 1080 },
  { label: "1080×1920 (縦動画)", w: 1080, h: 1920 },
  { label: "1200×630 (OGP)", w: 1200, h: 630 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function CopyBtn({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-[12px] font-medium text-slate-600 dark:text-zinc-300 hover:border-violet-400 dark:hover:border-violet-500 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
      {copied ? "コピー済み" : label ?? "コピー"}
    </button>
  );
}

const numOrNull = (s: string): number | null => {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function AspectRatio() {
  // 比率 → 寸法
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [driver, setDriver] = useState<"w" | "h">("w"); // どちらの入力を基準にするか

  const applyRatio = (w: number, h: number, keep: "w" | "h") => {
    setRatioW(w);
    setRatioH(h);
    if (keep === "w") {
      const wv = numOrNull(width);
      if (wv !== null) setHeight(String(Math.round((wv * h) / w)));
    } else {
      const hv = numOrNull(height);
      if (hv !== null) setWidth(String(Math.round((hv * w) / h)));
    }
  };

  const onWidth = (v: string) => {
    setWidth(v);
    setDriver("w");
    const wv = numOrNull(v);
    if (wv !== null) setHeight(String(Math.round((wv * ratioH) / ratioW)));
  };
  const onHeight = (v: string) => {
    setHeight(v);
    setDriver("h");
    const hv = numOrNull(v);
    if (hv !== null) setWidth(String(Math.round((hv * ratioW) / ratioH)));
  };

  // 寸法 → 比率
  const [dw, setDw] = useState("1920");
  const [dh, setDh] = useState("1280");
  const dwv = numOrNull(dw);
  const dhv = numOrNull(dh);
  let simplified = "";
  let decimal = "";
  if (dwv !== null && dhv !== null) {
    const g = gcd(dwv, dhv);
    simplified = `${Math.round(dwv / g)}:${Math.round(dhv / g)}`;
    decimal = (dwv / dhv).toFixed(3);
  }
  // 近い標準比率
  const closest =
    dwv !== null && dhv !== null
      ? RATIO_PRESETS.reduce(
          (best, p) => {
            const diff = Math.abs(p.w / p.h - dwv / dhv);
            return diff < best.diff ? { label: p.label, diff } : best;
          },
          { label: "", diff: Infinity }
        )
      : { label: "", diff: Infinity };

  const previewW = 260;
  const previewH = Math.min(200, Math.round((previewW * ratioH) / ratioW));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 比率 → 寸法 ── */}
      <section className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">比率から寸法を計算</h2>
        <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-4">
          比率を選んで幅か高さを入力すると、もう一方が自動計算されます。
        </p>

        {/* 比率プリセット */}
        <div className="flex flex-wrap gap-2 mb-5">
          {RATIO_PRESETS.map((p) => {
            const active = p.w === ratioW && p.h === ratioH;
            return (
              <button
                key={p.label}
                onClick={() => applyRatio(p.w, p.h, driver)}
                title={p.note}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors ${
                  active
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-violet-400"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* カスタム比率 */}
        <div className="flex items-center gap-2 mb-5 text-[13px]">
          <span className="text-slate-500 dark:text-zinc-400">カスタム比率</span>
          <input
            type="number"
            min={1}
            value={ratioW}
            onChange={(e) => applyRatio(Math.max(1, Number(e.target.value) || 1), ratioH, driver)}
            className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center text-slate-800 dark:text-zinc-100"
            aria-label="比率の幅"
          />
          <span className="text-slate-400 font-bold">:</span>
          <input
            type="number"
            min={1}
            value={ratioH}
            onChange={(e) => applyRatio(ratioW, Math.max(1, Number(e.target.value) || 1), driver)}
            className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center text-slate-800 dark:text-zinc-100"
            aria-label="比率の高さ"
          />
        </div>

        {/* 幅・高さ入力 */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
          <label className="block">
            <span className="text-[12px] text-slate-500 dark:text-zinc-400">幅（px）</span>
            <input
              type="number"
              min={1}
              value={width}
              onChange={(e) => onWidth(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg"
            />
          </label>
          <div className="hidden sm:flex items-center justify-center pb-3 text-slate-300 dark:text-zinc-600">
            <ArrowRight className="w-5 h-5" />
          </div>
          <label className="block">
            <span className="text-[12px] text-slate-500 dark:text-zinc-400">高さ（px）</span>
            <input
              type="number"
              min={1}
              value={height}
              onChange={(e) => onHeight(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg"
            />
          </label>
        </div>

        {/* プレビュー + コピー */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="shrink-0 flex items-center justify-center" style={{ width: previewW, height: 200 }}>
            <div
              className="rounded-lg border-2 border-violet-400/60 bg-violet-500/10 flex items-center justify-center text-[12px] font-mono text-violet-600 dark:text-violet-300"
              style={{ width: previewW, height: previewH }}
            >
              {ratioW}:{ratioH}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CopyBtn value={`${numOrNull(width) ?? ""}x${numOrNull(height) ?? ""}`} label={`${width}×${height} をコピー`} />
            <CopyBtn value={String(numOrNull(width) ?? "")} label="幅" />
            <CopyBtn value={String(numOrNull(height) ?? "")} label="高さ" />
          </div>
        </div>

        {/* 解像度プリセット */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-2">よく使うサイズを入れる</p>
          <div className="flex flex-wrap gap-2">
            {RES_PRESETS.map((r) => (
              <button
                key={r.label}
                onClick={() => {
                  setWidth(String(r.w));
                  setHeight(String(r.h));
                  const g = gcd(r.w, r.h);
                  setRatioW(Math.round(r.w / g));
                  setRatioH(Math.round(r.h / g));
                }}
                className="px-2.5 py-1 rounded-lg text-[12px] bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-violet-400 transition-colors"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 寸法 → 比率 ── */}
      <section className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">寸法から比率を計算</h2>
        <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-4">
          幅と高さを入力すると、最も簡単な整数比に約分して表示します。
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-[12px] text-slate-500 dark:text-zinc-400">幅</span>
            <input
              type="number"
              min={1}
              value={dw}
              onChange={(e) => setDw(e.target.value)}
              className="mt-1 w-28 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono"
            />
          </label>
          <span className="pb-3 text-slate-400 font-bold">×</span>
          <label className="block">
            <span className="text-[12px] text-slate-500 dark:text-zinc-400">高さ</span>
            <input
              type="number"
              min={1}
              value={dh}
              onChange={(e) => setDh(e.target.value)}
              className="mt-1 w-28 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono"
            />
          </label>
        </div>

        {simplified && (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">アスペクト比</p>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-300 font-mono">{simplified}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">小数比（幅÷高さ）</p>
              <p className="text-2xl font-bold text-slate-700 dark:text-zinc-200 font-mono">{decimal}</p>
            </div>
            {closest.label && (
              <div>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">近い標準比率</p>
                <p className="text-lg font-semibold text-slate-600 dark:text-zinc-300 font-mono">
                  {closest.label}
                  {closest.diff > 0.001 && <span className="text-[11px] text-slate-400 ml-1">に近い</span>}
                </p>
              </div>
            )}
            <CopyBtn value={simplified} label={`${simplified} をコピー`} />
          </div>
        )}
      </section>
    </div>
  );
}
