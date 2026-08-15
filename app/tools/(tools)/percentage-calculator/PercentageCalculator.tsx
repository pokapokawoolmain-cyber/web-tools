"use client";

import { useState } from "react";

type Mode = "ofValue" | "whatPercent" | "change" | "addSub";

const MODES: { id: Mode; label: string }[] = [
  { id: "ofValue", label: "◯の△%はいくつ" },
  { id: "whatPercent", label: "◯は△の何%" },
  { id: "addSub", label: "◯を△%増減" },
  { id: "change", label: "◯→△の増減率" },
];

const fmt = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  return (Math.round(n * 1000) / 1000).toLocaleString();
};

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("ofValue");
  const [a, setA] = useState("2000");
  const [b, setB] = useState("15");

  const A = Number(a);
  const B = Number(b);
  const valid = a.trim() !== "" && b.trim() !== "" && Number.isFinite(A) && Number.isFinite(B);

  let result = "";
  let expr = "";
  if (valid) {
    if (mode === "ofValue") {
      result = fmt((A * B) / 100);
      expr = `${fmt(A)} の ${fmt(B)}% = ${result}`;
    } else if (mode === "whatPercent") {
      result = B !== 0 ? fmt((A / B) * 100) + "%" : "—";
      expr = `${fmt(A)} は ${fmt(B)} の ${result}`;
    } else if (mode === "addSub") {
      const inc = A * (1 + B / 100);
      const dec = A * (1 - B / 100);
      expr = `${fmt(A)} の ${fmt(B)}%増 = ${fmt(inc)} ／ ${fmt(B)}%減 = ${fmt(dec)}`;
      result = fmt(inc);
    } else {
      result = A !== 0 ? fmt(((B - A) / A) * 100) + "%" : "—";
      expr = `${fmt(A)} → ${fmt(B)} は ${result}${A !== 0 && B >= A ? "（増加）" : A !== 0 ? "（減少）" : ""}`;
    }
  }

  const labels: Record<Mode, [string, string]> = {
    ofValue: ["もとの数（◯）", "割合（△%）"],
    whatPercent: ["対象（◯）", "全体（△）"],
    addSub: ["もとの数（◯）", "増減する割合（△%）"],
    change: ["変化前（◯）", "変化後（△）"],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        目的に合わせてモードを選び、2つの数を入れるだけ。割引後の値段、達成率、前年比、〇%増減などをすぐ計算できます。
      </div>

      {/* モード選択 */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
              mode === m.id ? "bg-violet-600 border-violet-600 text-white" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-violet-400"}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* 入力 */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">{labels[mode][0]}</span>
          <input type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">{labels[mode][1]}</span>
          <input type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono text-lg" />
        </label>
      </div>

      {/* 結果 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">答え</p>
        <p className="text-[44px] leading-none font-bold text-slate-900 dark:text-white break-all">{valid ? result : "—"}</p>
        {valid && <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">{expr}</p>}
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 計算はすべてブラウザ内で行われます。小数第3位までを表示（それ以下は四捨五入）します。
      </p>
    </div>
  );
}
