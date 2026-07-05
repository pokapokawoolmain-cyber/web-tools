"use client";

import { useState } from "react";
import { Copy, Check, Eraser, FileJson, Minimize2 } from "lucide-react";

const SAMPLE = `{"name":"ToolBox","tags":["pdf","image","dev"],"free":true,"stats":{"tools":85,"users":12000},"note":"日本語も扱えます"}`;

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const process = (mode: "format" | "minify") => {
    setError(null);
    setCopied(false);
    const src = input.trim();
    if (!src) { setOutput(""); setError("JSONを入力してください。"); return; }
    try {
      const parsed = JSON.parse(src);
      setOutput(mode === "format" ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed));
    } catch (e) {
      setOutput("");
      const msg = e instanceof Error ? e.message : String(e);
      // 位置情報を日本語化
      const posMatch = msg.match(/position (\d+)/);
      const pos = posMatch ? `（${posMatch[1]}文字目付近）` : "";
      setError(`JSONの構文エラーです${pos}: ${msg}`);
    }
  };

  const copy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };
  const clear = () => { setInput(""); setOutput(""); setError(null); setCopied(false); };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">JSON入力</label>
        <button onClick={() => setInput(SAMPLE)} className="text-[12px] text-sky-600 dark:text-sky-400 hover:underline">サンプルを入れる</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        rows={7}
        spellCheck={false}
        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[13px] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => process("format")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-all min-h-[44px]">
          <FileJson className="w-4 h-4" />整形する
        </button>
        <button onClick={() => process("minify")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-slate-300 text-[14px] min-h-[44px]">
          <Minimize2 className="w-4 h-4" />圧縮する
        </button>
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-zinc-400">
          <span>インデント</span>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-slate-700 dark:text-zinc-200">
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </div>
        <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-700 text-[13px] min-h-[44px] ml-auto">
          <Eraser className="w-4 h-4" />クリア
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl px-4 py-3">{error}</p>
      )}

      {output && (
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
            <span className="text-[12px] font-semibold text-slate-600 dark:text-zinc-300">結果</span>
            <button onClick={copy} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${copied ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-600" : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"}`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "コピー済み" : "コピー"}
            </button>
          </div>
          <pre className="px-4 py-3 text-[13px] font-mono leading-relaxed text-slate-800 dark:text-zinc-100 whitespace-pre-wrap overflow-x-auto max-h-[400px]">{output}</pre>
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center">入力したJSONはブラウザ内でのみ処理され、外部に送信されません。</p>
    </div>
  );
}
