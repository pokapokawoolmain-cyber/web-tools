"use client";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

// ─── コントラスト計算 ──────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG 2.1 判定
type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail";
function wcagLevel(ratio: number, isLargeText: boolean): WcagLevel {
  if (isLargeText) {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AAA"; // large text AAA is 4.5:1
    if (ratio >= 3) return "AA";
    return "Fail";
  } else {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    if (ratio >= 3) return "AA Large";
    return "Fail";
  }
}

function levelColor(level: WcagLevel): string {
  switch (level) {
    case "AAA": return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "AA": return "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "AA Large": return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "Fail": return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
  }
}

function levelIcon(level: WcagLevel): string {
  switch (level) {
    case "AAA": return "✅";
    case "AA": return "✅";
    case "AA Large": return "⚠️";
    case "Fail": return "❌";
  }
}

// ─── サンプルペア ────────────────────────────────────────────
const SAMPLE_PAIRS = [
  { name: "白地に黒", fg: "#000000", bg: "#FFFFFF" },
  { name: "黒地に白", fg: "#FFFFFF", bg: "#000000" },
  { name: "白地に青", fg: "#1D4ED8", bg: "#FFFFFF" },
  { name: "白地に赤", fg: "#DC2626", bg: "#FFFFFF" },
  { name: "白地に緑", fg: "#16A34A", bg: "#FFFFFF" },
  { name: "ダークモード", fg: "#E4E4E7", bg: "#18181B" },
];

// ─── ColorInput ─────────────────────────────────────────────
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isValid = hexToRgb(value) !== null;
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isValid ? value : "#cccccc"}
          onChange={e => onChange(e.target.value.toUpperCase())}
          className="w-11 h-10 rounded-lg border border-slate-300 dark:border-zinc-600 cursor-pointer p-0.5 bg-white dark:bg-zinc-800 flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={e => {
            const v = e.target.value.toUpperCase();
            onChange(v.startsWith("#") ? v : "#" + v);
          }}
          className={`flex-1 px-3 py-2 rounded-xl border text-[14px] font-mono uppercase bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 ${
            !isValid && value.length > 1
              ? "border-red-400 focus:ring-red-300"
              : "border-slate-300 dark:border-zinc-600 focus:ring-violet-300"
          }`}
        />
        <div
          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-zinc-700 flex-shrink-0"
          style={{ backgroundColor: isValid ? value : "#cccccc" }}
        />
      </div>
    </div>
  );
}

// ─── CopyButton ─────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
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
      {copied ? "コピー済み" : "コピー"}
    </button>
  );
}

// ─── メインコンポーネント ────────────────────────────────────
export function ContrastChecker() {
  const [fg, setFg] = useState("#1E3A8A");
  const [bg, setBg] = useState("#FFFFFF");
  const [isLargeText, setIsLargeText] = useState(false);

  const ratio = contrastRatio(fg, bg);
  const fgValid = hexToRgb(fg) !== null;
  const bgValid = hexToRgb(bg) !== null;
  const bothValid = fgValid && bgValid;

  const level = ratio !== null ? wcagLevel(ratio, isLargeText) : null;

  const handleSwap = useCallback(() => {
    setFg(bg);
    setBg(fg);
  }, [fg, bg]);

  const handleSamplePair = useCallback((pair: typeof SAMPLE_PAIRS[0]) => {
    setFg(pair.fg);
    setBg(pair.bg);
  }, []);

  const ratioText = ratio !== null ? ratio.toFixed(2) + ":1" : "—";

  return (
    <div className="space-y-6">
      {/* カラー入力 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorInput label="文字色（Foreground）" value={fg} onChange={setFg} />
        <ColorInput label="背景色（Background）" value={bg} onChange={setBg} />
      </div>

      {/* スワップボタン */}
      <div className="flex justify-center">
        <button
          onClick={handleSwap}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-violet-400 dark:hover:border-violet-500 text-slate-600 dark:text-zinc-400 transition-all"
        >
          ⇅ 文字色と背景色を入れ替え
        </button>
      </div>

      {/* テキストタイプ */}
      <div className="flex items-center gap-3">
        <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400">テキストサイズ：</label>
        <div className="flex gap-2">
          {[
            { label: "通常テキスト（18px未満）", value: false },
            { label: "大きなテキスト（18px以上 / 太字14px以上）", value: true },
          ].map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => setIsLargeText(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                isLargeText === opt.value
                  ? "bg-violet-500 text-white border-violet-500"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-violet-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* プレビュー */}
      {bothValid && (
        <div
          className="rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 space-y-3"
          style={{ backgroundColor: bg }}
        >
          <p
            className={`font-bold ${isLargeText ? "text-[24px]" : "text-[16px]"}`}
            style={{ color: fg }}
          >
            {isLargeText ? "大きなテキストサンプル（24px）" : "通常テキストサンプル（16px）"}
          </p>
          <p
            className={`${isLargeText ? "text-[18px]" : "text-[14px]"}`}
            style={{ color: fg }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="text-[12px]"
            style={{ color: fg }}
          >
            小さなテキスト（12px）— アクセシビリティには要注意
          </p>
          <p
            className="text-[11px] mt-2"
            style={{ color: fg, opacity: 0.6 }}
          >
            {fg} / {bg}
          </p>
        </div>
      )}

      {/* 結果カード */}
      {bothValid && ratio !== null && level !== null && (
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-5 space-y-4">
          {/* コントラスト比 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mb-0.5">コントラスト比</p>
              <p className="text-[36px] font-black text-slate-800 dark:text-zinc-100 leading-none">{ratioText}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-bold border ${levelColor(level)}`}>
                {levelIcon(level)} WCAG {level}
              </span>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                {isLargeText ? "大きなテキスト基準" : "通常テキスト基準"}
              </p>
            </div>
          </div>

          {/* WCAG基準一覧 */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "AA（通常）", required: 4.5, pass: ratio >= 4.5 },
              { label: "AA（大文字）", required: 3, pass: ratio >= 3 },
              { label: "AAA（最高）", required: 7, pass: ratio >= 7 },
            ].map(item => (
              <div
                key={item.label}
                className={`rounded-xl p-3 text-center border ${
                  item.pass
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                }`}
              >
                <p className={`text-[11px] font-medium mb-1 ${item.pass ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {item.label}
                </p>
                <p className={`text-[10px] ${item.pass ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}>
                  {item.pass ? "✅ 合格" : `❌ 要${item.required}:1以上`}
                </p>
              </div>
            ))}
          </div>

          {/* コピー */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-zinc-700">
            <code className="text-[12px] font-mono text-slate-600 dark:text-zinc-400">
              {`color: ${fg}; background-color: ${bg}; /* ${ratioText} */`}
            </code>
            <CopyButton text={`color: ${fg}; background-color: ${bg}; /* contrast: ${ratioText} */`} />
          </div>
        </div>
      )}

      {/* サンプルペア */}
      <div>
        <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300 mb-3">よく使われる配色パターン</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SAMPLE_PAIRS.map(pair => {
            const r = contrastRatio(pair.fg, pair.bg);
            const lv = r !== null ? wcagLevel(r, false) : null;
            return (
              <button
                key={pair.name}
                onClick={() => handleSamplePair(pair)}
                className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 bg-white dark:bg-zinc-900 transition-all hover:shadow-md text-left"
              >
                <div
                  className="w-full h-8 rounded-lg flex items-center justify-center text-[12px] font-bold"
                  style={{ backgroundColor: pair.bg, color: pair.fg }}
                >
                  Aa
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-zinc-400">{pair.name}</span>
                {r !== null && lv !== null && (
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${levelColor(lv)}`}>
                    {r.toFixed(1)}:1 · {lv}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* WCAG説明 */}
      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 rounded-2xl p-4 space-y-2">
        <h3 className="text-[13px] font-bold text-violet-800 dark:text-violet-300">WCAG 2.1 コントラスト基準について</h3>
        <ul className="space-y-1 text-[12px] text-violet-700 dark:text-violet-400">
          <li>• <strong>AA（通常テキスト）：4.5:1以上</strong> — ほとんどのWebサイトが目指す基準</li>
          <li>• <strong>AA（大文字/18px以上）：3:1以上</strong> — 見出し・大きなテキスト向け</li>
          <li>• <strong>AAA（最高基準）：7:1以上</strong> — 最も高いアクセシビリティレベル</li>
          <li>• 「大きなテキスト」= 通常体18px以上、または太字14px以上</li>
        </ul>
      </div>
    </div>
  );
}
