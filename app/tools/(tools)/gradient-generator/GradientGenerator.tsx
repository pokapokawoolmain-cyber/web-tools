"use client";
import { useState, useCallback } from "react";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

// ─── プリセット ───────────────────────────────────────────
const PRESETS = [
  { name: "サンセット",   css: "linear-gradient(135deg, #ff6b6b, #feca57)" },
  { name: "オーシャン",   css: "linear-gradient(135deg, #667eea, #764ba2)" },
  { name: "フォレスト",   css: "linear-gradient(135deg, #134e5e, #71b280)" },
  { name: "ピーチ",       css: "linear-gradient(135deg, #fd746c, #ff9068)" },
  { name: "パープル",     css: "linear-gradient(135deg, #c471ed, #f64f59)" },
  { name: "ミント",       css: "linear-gradient(135deg, #00b09b, #96c93d)" },
  { name: "ゴールド",     css: "linear-gradient(135deg, #f7971e, #ffd200)" },
  { name: "ナイト",       css: "linear-gradient(135deg, #2c3e50, #3498db)" },
  { name: "チェリー",     css: "linear-gradient(135deg, #eb3349, #f45c43)" },
  { name: "スカイ",       css: "linear-gradient(135deg, #00c6ff, #0072ff)" },
  { name: "ラベンダー",   css: "linear-gradient(135deg, #a18cd1, #fbc2eb)" },
  { name: "コーラル",     css: "linear-gradient(135deg, #f093fb, #f5576c)" },
  { name: "エメラルド",   css: "linear-gradient(135deg, #0ba360, #3cba92)" },
  { name: "マルチ",       css: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)" },
  { name: "ロゼ",         css: "linear-gradient(135deg, #ffecd2, #fcb69f)" },
  { name: "スモーキー",   css: "linear-gradient(135deg, #e2ebf0, #cfd9df)" },
  { name: "モノトーン",   css: "linear-gradient(135deg, #2d3436, #636e72)" },
  { name: "ドーン",       css: "linear-gradient(135deg, #fddb92, #d1fdff)" },
  { name: "パステル",     css: "linear-gradient(135deg, #a1c4fd, #c2e9fb)" },
  { name: "ビビッド",     css: "linear-gradient(135deg, #ff0099, #493240)" },
];

type ColorStop = { color: string; position: number };
type GradientType = "linear" | "radial" | "conic";

function buildCss(type: GradientType, angle: number, stops: ColorStop[]): string {
  const stopsStr = stops
    .map(s => `${s.color} ${s.position}%`)
    .join(", ");
  switch (type) {
    case "linear": return `linear-gradient(${angle}deg, ${stopsStr})`;
    case "radial":  return `radial-gradient(circle, ${stopsStr})`;
    case "conic":   return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 transition-colors"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
      {copied ? "コピー済み" : "CSSをコピー"}
    </button>
  );
}

export function GradientGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#667EEA", position: 0 },
    { color: "#764BA2", position: 100 },
  ]);

  const gradientCss = buildCss(type, angle, stops);
  const fullCss = `background: ${gradientCss};`;

  const addStop = useCallback(() => {
    if (stops.length >= 5) return;
    const mid = Math.round((stops[stops.length - 1].position + stops[0].position) / 2);
    setStops(prev => [...prev, { color: "#AAAAAA", position: mid }].sort((a, b) => a.position - b.position));
  }, [stops]);

  const removeStop = useCallback((idx: number) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, i) => i !== idx));
  }, [stops.length]);

  const updateStop = useCallback((idx: number, field: keyof ColorStop, value: string | number) => {
    setStops(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }, []);

  const applyPreset = useCallback((css: string) => {
    // parse preset CSS to set state
    const linearMatch = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
    if (linearMatch) {
      setType("linear");
      setAngle(Number(linearMatch[1]));
      const stopStrs = linearMatch[2].split(",").map(s => s.trim());
      const parsed: ColorStop[] = stopStrs.map((s, i) => {
        const parts = s.split(" ");
        const color = parts[0];
        const pos = parts[1] ? parseInt(parts[1]) : Math.round((i / (stopStrs.length - 1)) * 100);
        return { color, position: pos };
      });
      setStops(parsed);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* プレビュー */}
      <div
        className="w-full h-36 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-inner"
        style={{ background: gradientCss }}
      />

      {/* グラデーションタイプ */}
      <div>
        <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-2">グラデーションタイプ</label>
        <div className="flex gap-2">
          {(["linear", "radial", "conic"] as GradientType[]).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                type === t
                  ? "bg-violet-500 text-white border-violet-500"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-violet-400"
              }`}
            >
              {t === "linear" ? "Linear" : t === "radial" ? "Radial" : "Conic"}
            </button>
          ))}
        </div>
      </div>

      {/* 角度スライダー */}
      {(type === "linear" || type === "conic") && (
        <div>
          <label className="block text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1">
            角度: <span className="text-slate-800 dark:text-zinc-200 font-mono">{angle}°</span>
          </label>
          <input
            type="range" min={0} max={360} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
          </div>
        </div>
      )}

      {/* カラーストップ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400">カラーストップ</label>
          {stops.length < 5 && (
            <button
              onClick={addStop}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors"
            >
              <Plus size={11} />追加
            </button>
          )}
        </div>
        <div className="space-y-2">
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 rounded-xl p-2 border border-slate-200 dark:border-zinc-700">
              <input
                type="color"
                value={stop.color.length === 7 ? stop.color : "#667eea"}
                onChange={e => updateStop(i, "color", e.target.value.toUpperCase())}
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-600 cursor-pointer p-0.5 bg-white dark:bg-zinc-800 flex-shrink-0"
              />
              <input
                type="text"
                value={stop.color}
                maxLength={7}
                onChange={e => updateStop(i, "color", e.target.value.toUpperCase())}
                className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-[12px] font-mono uppercase bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
              <span className="text-[11px] text-slate-400 flex-shrink-0">{stop.position}%</span>
              <input
                type="range" min={0} max={100} value={stop.position}
                onChange={e => updateStop(i, "position", Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS出力 */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-700 dark:text-zinc-300">CSS出力</h3>
          <CopyButton text={fullCss} />
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-slate-200 dark:border-zinc-700">
          <code className="text-[12px] font-mono text-slate-600 dark:text-zinc-400 break-all">{fullCss}</code>
        </div>
      </div>

      {/* プリセット */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200 mb-3">🌈 プリセット（20種）</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.css)}
              className="group flex flex-col items-center gap-1 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-md"
              title={preset.name}
            >
              <div
                className="w-full h-8 rounded-lg"
                style={{ background: preset.css }}
              />
              <span className="text-[9px] font-medium text-slate-600 dark:text-zinc-400 text-center">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
