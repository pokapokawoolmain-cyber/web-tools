"use client";
import { useState, useMemo, useCallback, useRef, useEffect, type ReactElement } from "react";
import { Copy, Check, Trash2, Eye, Edit3 } from "lucide-react";
import Link from "next/link";

function formatForNote(raw: string): string {
  if (!raw.trim()) return "";
  let t = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove heading symbols, add blank lines around headings
  t = t.replace(/^#{1,6} (.+)$/gm, (_, heading) => `\n${heading}\n`);
  // Remove bold/italic
  t = t.replace(/\*\*(.+?)\*\*/g, "$1");
  t = t.replace(/\*(.+?)\*/g, "$1");
  t = t.replace(/__(.+?)__/g, "$1");
  t = t.replace(/_(.+?)_/g, "$1");
  // Remove inline code
  t = t.replace(/`(.+?)`/g, "$1");
  // Remove code blocks
  t = t.replace(/```[\s\S]+?```/g, "");
  // Convert bullet points
  t = t.replace(/^[\s]*[-*+] /gm, "・");
  // Convert numbered lists → 番号. 形式
  t = t.replace(/^[\s]*(\d+)\. /gm, "$1. ");
  // Collapse 3+ blank lines to 2
  t = t.replace(/\n{3,}/g, "\n\n");
  // Ensure blank line before bullet groups
  t = t.replace(/([^\n])\n(・)/g, "$1\n\n$2");
  // Remove horizontal rules
  t = t.replace(/^[-*_]{3,}$/gm, "");

  return t.trim();
}

function renderNotePreview(text: string): ReactElement[] {
  const lines = text.split("\n");
  const elements: ReactElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line === "") {
      elements.push(<div key={i} className="h-4" />);
    } else if (line.startsWith("・")) {
      // Collect consecutive bullet lines
      const bullets: string[] = [];
      while (i < lines.length && lines[i].startsWith("・")) {
        bullets.push(lines[i].slice(1));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-1.5 text-[15px] text-slate-800 dark:text-zinc-200">
              <span className="text-slate-400 mt-0.5 flex-shrink-0">・</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else {
      // Determine if it looks like a heading (short, standalone line)
      const isHeading = line.length < 40 && !line.endsWith("。") && !line.endsWith(".");
      if (isHeading && lines[i - 1] === "" && (lines[i + 1] === "" || lines[i + 1] === undefined)) {
        elements.push(
          <h2 key={i} className="text-[18px] font-bold text-slate-900 dark:text-white my-3 pb-1 border-b border-slate-100 dark:border-zinc-800">
            {line}
          </h2>
        );
      } else {
        elements.push(
          <p key={i} className="text-[15px] text-slate-800 dark:text-zinc-200 leading-[1.85] my-1">
            {line}
          </p>
        );
      }
    }
    i++;
  }
  return elements;
}

export function NoteFormat() {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const output = useMemo(() => formatForNote(input), [input]);
  const wordCount = useMemo(() => output.replace(/\s/g, "").length, [output]);
  const headingCount = useMemo(() => {
    const origLines = input.split("\n");
    return origLines.filter((l) => /^#{1,6} /.test(l)).length;
  }, [input]);

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

  return (
    <div className="space-y-5">
      {/* Stats row */}
      {input.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "文字数", value: wordCount },
            { label: "検出見出し", value: `${headingCount}個` },
            { label: "整形後行数", value: `${output.split("\n").length}行` },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 px-3 py-2.5 text-center">
              <p className="text-[11px] text-slate-400 mb-0.5">{s.label}</p>
              <p className="text-[17px] font-bold text-slate-800 dark:text-zinc-200">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">
            AI文章を貼り付け
            <span className="ml-2 text-[11px] font-normal text-slate-400">{input.length}文字</span>
          </span>
          <button onClick={() => setInput("")} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"ChatGPTやAIの出力をここに貼り付けてください...\n\nMarkdown記法（# 見出し・**太字**・- 箇条書き）も自動で整形します。"}
          className="w-full min-h-[200px] p-4 text-[14px] text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-zinc-600"
          style={{ height: "280px" }}
        />
      </div>

      {/* Output / Preview */}
      {output && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-violet-200 dark:border-violet-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  tab === "edit"
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> 整形後テキスト
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  tab === "preview"
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> note風プレビュー
              </button>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                copied ? "bg-green-500 text-white" : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "コピー済み" : "コピー"}
            </button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {tab === "edit" ? (
              <pre className="p-4 text-[14px] text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                {output}
              </pre>
            ) : (
              <div className="p-6 max-w-2xl mx-auto">
                {renderNotePreview(output)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      {output && (
        <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900/40 px-4 py-3">
          <span className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
            ✅ note向けに整形完了！
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${
              copied ? "bg-green-500 text-white" : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "コピー済み！" : "テキストをコピー"}
          </button>
        </div>
      )}

      {/* Related */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { href: "/tools/chatgpt-format", emoji: "✨", label: "ChatGPT整形", desc: "複数媒体に対応" },
            { href: "/tools/ai-humanize", emoji: "🤖", label: "AI文章自然化", desc: "AIっぽさを除去" },
            { href: "/tools/word-counter", emoji: "✍️", label: "文字数カウント", desc: "詳細な文字数" },
          ].map((t) => (
            <Link key={t.href} href={t.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 hover:border-violet-300 dark:hover:border-violet-600 transition-colors group">
              <span className="text-xl">{t.emoji}</span>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-violet-600 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
