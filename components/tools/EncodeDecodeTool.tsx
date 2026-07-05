"use client";

// エンコード/デコード系の共通コンポーネント（Base64・URL 等）
import { useState } from "react";
import { Copy, Check, Eraser, ArrowRightLeft } from "lucide-react";

type Props = {
  encode: (s: string, variant: string) => string;
  decode: (s: string, variant: string) => string;
  sample: string;
  /** URLセーフ等のオプション（任意） */
  variants?: { value: string; label: string }[];
  encodeLabel?: string;
  decodeLabel?: string;
};

export function EncodeDecodeTool({
  encode, decode, sample, variants, encodeLabel = "エンコード", decodeLabel = "デコード",
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [variant, setVariant] = useState(variants?.[0]?.value ?? "");

  const run = (mode: "enc" | "dec") => {
    setError(null); setCopied(false);
    if (!input) { setOutput(""); setError("文字列を入力してください。"); return; }
    try {
      setOutput(mode === "enc" ? encode(input, variant) : decode(input, variant));
    } catch {
      setOutput("");
      setError(mode === "dec" ? "デコードに失敗しました。入力が正しい形式か確認してください。" : "エンコードに失敗しました。");
    }
  };
  const swap = () => { setInput(output); setOutput(input); setError(null); };
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ } };
  const clear = () => { setInput(""); setOutput(""); setError(null); setCopied(false); };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300">入力</label>
        <button onClick={() => setInput(sample)} className="text-[12px] text-sky-600 dark:text-sky-400 hover:underline">サンプルを入れる</button>
      </div>
      <textarea
        value={input} onChange={(e) => setInput(e.target.value)} rows={4} spellCheck={false}
        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[13px] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y"
      />

      {variants && (
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-zinc-400">
          <span>形式</span>
          <select value={variant} onChange={(e) => setVariant(e.target.value)} className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-slate-700 dark:text-zinc-200">
            {variants.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => run("enc")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-all min-h-[44px]">{encodeLabel}</button>
        <button onClick={() => run("dec")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-slate-300 text-[14px] min-h-[44px]">{decodeLabel}</button>
        <button onClick={swap} disabled={!output} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-700 disabled:opacity-40 text-[13px] min-h-[44px]"><ArrowRightLeft className="w-4 h-4" />入替</button>
        <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-700 text-[13px] min-h-[44px] ml-auto"><Eraser className="w-4 h-4" />クリア</button>
      </div>

      {error && <p className="text-[13px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl px-4 py-3">{error}</p>}

      {output && (
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
            <span className="text-[12px] font-semibold text-slate-600 dark:text-zinc-300">結果</span>
            <button onClick={copy} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${copied ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-600" : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"}`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "コピー済み" : "コピー"}
            </button>
          </div>
          <pre className="px-4 py-3 text-[13px] font-mono leading-relaxed text-slate-800 dark:text-zinc-100 whitespace-pre-wrap break-all overflow-x-auto max-h-[360px]">{output}</pre>
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center">処理はブラウザ内で完結し、入力内容は外部に送信されません。</p>
    </div>
  );
}
