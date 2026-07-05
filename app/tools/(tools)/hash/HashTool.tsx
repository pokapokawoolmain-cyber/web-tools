"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function digest(text: string, algo: Algo): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function HashRow({ algo, value }: { algo: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
        <span className="text-[12px] font-bold text-slate-600 dark:text-zinc-300">{algo}</span>
        <button onClick={async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ } }}
          className="inline-flex items-center gap-1 text-[12px] text-slate-500 dark:text-zinc-400">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "コピー済み" : "コピー"}
        </button>
      </div>
      <p className="px-4 py-2.5 text-[12px] font-mono break-all text-slate-800 dark:text-zinc-100">{value}</p>
    </div>
  );
}

export function HashTool() {
  const [input, setInput] = useState("");
  const [algos, setAlgos] = useState<Algo[]>(["SHA-256"]);
  const [results, setResults] = useState<{ algo: Algo; value: string }[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!input) { setResults([]); return; }
      const out = await Promise.all(algos.map(async (a) => ({ algo: a, value: await digest(input, a) })));
      if (active) setResults(out);
    })();
    return () => { active = false; };
  }, [input, algos]);

  const toggle = (a: Algo) => setAlgos((prev) => prev.includes(a) ? (prev.length > 1 ? prev.filter((x) => x !== a) : prev) : [...prev, a]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">ハッシュにする文字列</label>
        <button onClick={() => setInput("ToolBox 2026")} className="text-[12px] text-sky-600 dark:text-sky-400 hover:underline">サンプルを入れる</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} spellCheck={false} placeholder="ここに文字列を入力するとリアルタイムでハッシュ化されます"
        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[14px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y" />

      <div className="flex flex-wrap gap-2">
        {ALGOS.map((a) => (
          <button key={a} onClick={() => toggle(a)}
            className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${algos.includes(a) ? "bg-sky-50 dark:bg-sky-950/30 border-sky-400 text-sky-600 dark:text-sky-400" : "border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400"}`}>
            {a}
          </button>
        ))}
        {input && <button onClick={() => setInput("")} className="text-[12px] px-3 py-1.5 rounded-full text-slate-500 dark:text-zinc-400 ml-auto">クリア</button>}
      </div>

      {results.length > 0 ? (
        <div className="space-y-2">
          {results.map((r) => <HashRow key={r.algo} algo={r.algo} value={r.value} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 py-8 text-center text-[13px] text-slate-400 dark:text-zinc-600">
          文字列を入力するとハッシュ値が表示されます。
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center leading-relaxed">
        MD5はブラウザ標準に含まれないため未対応です。改ざん検知・整合性確認にはSHA-256以上を推奨します。処理はブラウザ内で完結します。
      </p>
    </div>
  );
}
