"use client";
import { useState, useMemo } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

// よく使う文字数制限の目安
const LIMITS = [
  { name: "Twitter/X", limit: 140, color: "bg-sky-500" },
  { name: "Instagram", limit: 2200, color: "bg-pink-500" },
  { name: "履歴書 自己PR", limit: 300, color: "bg-blue-500" },
  { name: "メール件名", limit: 50, color: "bg-amber-500" },
];

export function WordCounter() {
  const [text, setText] = useState("");
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const allChars   = text.length;
    const noSpaces   = text.replace(/[\s　]/g, "").length;
    const lines      = text === "" ? 0 : text.split("\n").length;
    const words      = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const bytes      = new TextEncoder().encode(text).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const displayed  = excludeSpaces ? noSpaces : allChars;

    return { allChars, noSpaces, lines, words, bytes, paragraphs, displayed };
  }, [text, excludeSpaces]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* テキストエリア */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">テキストを入力</span>
          <div className="flex gap-2">
            <button onClick={copy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
              {copied ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={() => setText("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここにテキストを貼り付けるか入力してください..."
          className="w-full h-52 p-4 text-sm text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-slate-600"
        />
      </div>

      {/* スペース設定 */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setExcludeSpaces(!excludeSpaces)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            excludeSpaces ? "bg-blue-500 border-blue-500" : "border-slate-300 dark:border-zinc-600"
          }`}
        >
          {excludeSpaces && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          スペース・改行を除いた文字数を表示
        </span>
      </label>

      {/* メインカウント */}
      <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200 dark:border-blue-800">
        <p className="text-7xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {stats.displayed.toLocaleString()}
        </p>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          {excludeSpaces ? "文字数（スペース除く）" : "文字数（全角・半角含む）"}
        </p>
      </div>

      {/* 詳細統計 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "全文字数",        value: stats.allChars.toLocaleString() },
          { label: "スペース除く",    value: stats.noSpaces.toLocaleString() },
          { label: "行数",            value: stats.lines.toLocaleString() },
          { label: "単語数",          value: stats.words.toLocaleString() },
          { label: "段落数",          value: stats.paragraphs.toLocaleString() },
          { label: "バイト数",        value: `${stats.bytes.toLocaleString()} B` },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-3 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 制限チェッカー */}
      {text.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">制限チェッカー</h2>
          {LIMITS.map((lim) => {
            const pct = Math.min(100, (stats.allChars / lim.limit) * 100);
            const over = stats.allChars > lim.limit;
            return (
              <div key={lim.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{lim.name}</span>
                  <span className={over ? "text-red-500 font-semibold" : "text-slate-500"}>
                    {stats.allChars} / {lim.limit}
                    {over ? " ⚠️ 超過" : " ✅"}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-500" : lim.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
