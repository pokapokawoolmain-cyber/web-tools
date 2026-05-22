"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import Link from "next/link";

type Mode = "note" | "blog" | "x" | "line" | "discord";

const MODES: { id: Mode; label: string; emoji: string; desc: string }[] = [
  { id: "note", label: "note", emoji: "📓", desc: "note.com向け" },
  { id: "blog", label: "ブログ", emoji: "✍️", desc: "WordPress/はてな向け" },
  { id: "x", label: "X", emoji: "𝕏", desc: "X（旧Twitter）向け" },
  { id: "line", label: "LINE", emoji: "💬", desc: "LINE・チャット向け" },
  { id: "discord", label: "Discord", emoji: "🎮", desc: "Discord向け" },
];

function formatText(raw: string, mode: Mode): string {
  if (!raw.trim()) return "";
  let text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (mode === "note") {
    // Remove markdown heading symbols but keep text, add blank line after headings
    text = text.replace(/^#{1,6} (.+)$/gm, "\n$1\n");
    // Convert **bold** to text (note handles its own bold)
    text = text.replace(/\*\*(.+?)\*\*/g, "$1");
    text = text.replace(/\*(.+?)\*/g, "$1");
    // Remove backtick code
    text = text.replace(/`(.+?)`/g, "$1");
    // Normalize bullet points
    text = text.replace(/^[-*•] /gm, "・");
    // Remove 3+ blank lines → 2
    text = text.replace(/\n{3,}/g, "\n\n");
    // Ensure space before bullet lists
    text = text.replace(/([^\n])\n(・)/g, "$1\n\n$2");
  } else if (mode === "blog") {
    // Keep heading structure but clean up markdown
    text = text.replace(/^# (.+)$/gm, "\n▍$1\n");
    text = text.replace(/^## (.+)$/gm, "\n■ $1\n");
    text = text.replace(/^### (.+)$/gm, "\n◆ $1\n");
    text = text.replace(/\*\*(.+?)\*\*/g, "【$1】");
    text = text.replace(/\*(.+?)\*/g, "$1");
    text = text.replace(/`(.+?)`/g, "$1");
    text = text.replace(/^[-*] /gm, "・");
    text = text.replace(/\n{3,}/g, "\n\n");
  } else if (mode === "x") {
    // X: Remove all markdown, keep clean text, shorten
    text = text.replace(/^#{1,6} (.+)$/gm, "【$1】");
    text = text.replace(/\*\*(.+?)\*\*/g, "$1");
    text = text.replace(/\*(.+?)\*/g, "$1");
    text = text.replace(/`(.+?)`/g, "$1");
    text = text.replace(/^[-*•] /gm, "・");
    // Remove extra blank lines
    text = text.replace(/\n{3,}/g, "\n\n");
    text = text.trim();
  } else if (mode === "line") {
    // LINE: Very clean, no markdown, short paragraphs
    text = text.replace(/^#{1,6} (.+)$/gm, "▶ $1");
    text = text.replace(/\*\*(.+?)\*\*/g, "【$1】");
    text = text.replace(/\*(.+?)\*/g, "$1");
    text = text.replace(/`(.+?)`/g, "$1");
    text = text.replace(/^[-*•] /gm, "・");
    text = text.replace(/\n{3,}/g, "\n\n");
  } else if (mode === "discord") {
    // Discord: Keep **bold**, convert # to **bold**
    text = text.replace(/^# (.+)$/gm, "**$1**");
    text = text.replace(/^## (.+)$/gm, "**__$1__**");
    text = text.replace(/^### (.+)$/gm, "__$1__");
    // Keep existing ** bold
    text = text.replace(/^[-*•] /gm, "• ");
    text = text.replace(/\n{3,}/g, "\n\n");
  }

  return text.trim();
}

function charCount(text: string): number {
  return text.length;
}

export function ChatGptFormat() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("note");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"split" | "before" | "after">("split");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const output = useMemo(() => formatText(input, mode), [input, mode]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(Math.max(el.scrollHeight, 200), 600) + "px";
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          整形モードを選択
        </p>
        <div className="grid grid-cols-5 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center transition-all ${
                mode === m.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                  : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-lg leading-none">{m.emoji}</span>
              <span className="text-[11px] font-semibold leading-none">{m.label}</span>
            </button>
          ))}
        </div>
        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2 text-center">
          {currentMode.desc}向けに最適化
        </p>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-slate-400 font-medium">表示:</span>
        {(["split", "before", "after"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-[12px] px-3 py-1 rounded-full transition-all ${
              view === v
                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            {v === "split" ? "並列表示" : v === "before" ? "整形前" : "整形後"}
          </button>
        ))}
      </div>

      {/* Main panels */}
      <div className={`grid gap-4 ${view === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Input */}
        {(view === "split" || view === "before") && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">
                整形前
                <span className="ml-2 text-[11px] font-normal text-slate-400">{charCount(input).toLocaleString()}文字</span>
              </span>
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                title="クリア"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ChatGPTやAIの出力をここに貼り付けてください..."
              className="w-full min-h-[200px] p-4 text-[14px] text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-zinc-600"
              style={{ height: "300px" }}
            />
          </div>
        )}

        {/* Output */}
        {(view === "split" || view === "after") && (
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl border-2 overflow-hidden transition-colors ${
            output ? "border-violet-200 dark:border-violet-800/50" : "border-slate-200 dark:border-zinc-700"
          }`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">
                整形後（{currentMode.label}向け）
                <span className="ml-2 text-[11px] font-normal text-slate-400">{charCount(output).toLocaleString()}文字</span>
              </span>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : output
                    ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "コピー済み" : "コピー"}
              </button>
            </div>
            <div className="p-4 min-h-[200px]" style={{ height: "300px", overflowY: "auto" }}>
              {output ? (
                <pre className="text-[14px] text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {output}
                </pre>
              ) : (
                <p className="text-slate-300 dark:text-zinc-600 text-[14px]">
                  左に文章を入力すると整形結果がここに表示されます
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick action */}
      {output && (
        <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-violet-500 text-lg">✅</span>
            <span className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
              {currentMode.label}向けに整形完了！
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-violet-600 text-white hover:bg-violet-700 active:scale-95"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "コピー済み！" : "ワンタップコピー"}
          </button>
        </div>
      )}

      {/* Related tools */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          関連ツール
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { href: "/tools/ai-humanize", emoji: "🤖", label: "AI文章自然化", desc: "AIっぽさを除去" },
            { href: "/tools/note-format", emoji: "📝", label: "note整形", desc: "note専用整形" },
            { href: "/tools/x-post-preview", emoji: "𝕏", label: "X投稿プレビュー", desc: "改行を確認" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 hover:border-violet-300 dark:hover:border-violet-600 transition-colors group"
            >
              <span className="text-xl">{t.emoji}</span>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
