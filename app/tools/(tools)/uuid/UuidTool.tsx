"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

function genUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // フォールバック
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function format(uuid: string, opts: { upper: boolean; noHyphen: boolean; braces: boolean }): string {
  let out = uuid;
  if (opts.noHyphen) out = out.replace(/-/g, "");
  if (opts.upper) out = out.toUpperCase();
  if (opts.braces) out = `{${out}}`;
  return out;
}

export function UuidTool() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [noHyphen, setNoHyphen] = useState(false);
  const [braces, setBraces] = useState(false);
  const [list, setList] = useState<string[]>(() => Array.from({ length: 5 }, genUuid));
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regen = useCallback(() => {
    setList(Array.from({ length: Math.min(100, Math.max(1, count)) }, genUuid));
    setCopiedAll(false); setCopiedIdx(null);
  }, [count]);

  const formatted = list.map((u) => format(u, { upper, noHyphen, braces }));

  const copyAll = async () => { try { await navigator.clipboard.writeText(formatted.join("\n")); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); } catch { /* noop */ } };
  const copyOne = async (i: number) => { try { await navigator.clipboard.writeText(formatted[i]); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 1500); } catch { /* noop */ } };

  const Toggle = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <button onClick={() => set(!on)} className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${on ? "bg-sky-50 dark:bg-sky-950/30 border-sky-400 text-sky-600 dark:text-sky-400" : "border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400"}`}>{label}</button>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">生成数</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 h-10 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <span className="text-[12px] text-slate-400">（1〜100）</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Toggle on={upper} set={setUpper} label="大文字" />
          <Toggle on={noHyphen} set={setNoHyphen} label="ハイフンなし" />
          <Toggle on={braces} set={setBraces} label="波括弧 {} 付き" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={regen} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-all min-h-[44px]">
            <RefreshCw className="w-4 h-4" />生成する
          </button>
          <button onClick={copyAll} className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[14px] min-h-[44px] transition-all ${copiedAll ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"}`}>
            {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copiedAll ? "全部コピー済み" : "全部コピー"}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {formatted.map((u, i) => (
          <button key={i} onClick={() => copyOne(i)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors group">
            <span className="text-[13px] font-mono text-slate-800 dark:text-zinc-100 break-all text-left">{u}</span>
            {copiedIdx === i ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <Copy className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center">UUID v4（ランダム）をブラウザ内で生成します。生成された値は外部に送信されません。</p>
    </div>
  );
}
