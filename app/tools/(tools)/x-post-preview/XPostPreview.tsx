"use client";
import { useState, useMemo, useCallback } from "react";
import { Copy, Check, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";

const MAX_CHARS = 280; // X standard (Japanese counts as 1 char)

function countXChars(text: string): number {
  // URLs count as 23 chars
  const withoutUrls = text.replace(/https?:\/\/\S+/g, "");
  const urlCount = (text.match(/https?:\/\/\S+/g) || []).length;
  return withoutUrls.length + urlCount * 23;
}

function renderXText(text: string) {
  // Highlight hashtags and mentions
  const parts = text.split(/(#[\w぀-鿿゠-ヿ]+|@\w+|https?:\/\/\S+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("#") || part.startsWith("@")) {
      return <span key={i} className="text-sky-500 dark:text-sky-400">{part}</span>;
    }
    if (part.startsWith("http")) {
      return <span key={i} className="text-sky-500 dark:text-sky-400 underline">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

const TEMPLATES = [
  { label: "告知系", text: "【お知らせ】\n\n○○をリリースしました！\n\n✅ 特徴1\n✅ 特徴2\n✅ 特徴3\n\n詳細はこちら👇\nhttps://example.com\n\n#ツール #無料" },
  { label: "学び系", text: "○○について3つの発見\n\n①\n\n②\n\n③\n\nまとめると、〇〇が大切\n\n参考になったらRT・いいねお願いします🙏" },
  { label: "共感系", text: "○○あるある\n\n・あるある1\n・あるある2\n・あるある3\n\n全部あてはまる人いる？🤣\n\n#あるある" },
];

export function XPostPreview() {
  const [text, setText] = useState("");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [copied, setCopied] = useState(false);

  const charCount = useMemo(() => countXChars(text), [text]);
  const remaining = MAX_CHARS - charCount;
  const isOverLimit = remaining < 0;
  const isWarning = remaining >= 0 && remaining < 20;

  const hashtagCount = useMemo(() => (text.match(/#[\w぀-鿿゠-ヿ]+/g) || []).length, [text]);
  const lineCount = useMemo(() => text.split("\n").length, [text]);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div className="space-y-5">
      {/* Device toggle */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-slate-400 font-medium">プレビュー:</span>
        <button
          onClick={() => setDevice("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
            device === "mobile"
              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> スマホ
        </button>
        <button
          onClick={() => setDevice("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
            device === "desktop"
              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" /> PC
        </button>
      </div>

      {/* Templates */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[12px] text-slate-400 font-medium self-center">テンプレ:</span>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.label}
            onClick={() => setText(tpl.text)}
            className="text-[12px] px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">投稿テキスト</span>
          <div className="flex items-center gap-3">
            <span className={`text-[13px] font-bold tabular-nums ${isOverLimit ? "text-red-500" : isWarning ? "text-amber-500" : "text-slate-400"}`}>
              {charCount}/{MAX_CHARS}
            </span>
            <button onClick={handleCopy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              copied ? "bg-green-500 text-white" : text ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-700" : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
            }`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "コピー済み" : "コピー"}
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="投稿したいテキストをここに入力..."
          className="w-full min-h-[160px] p-4 text-[14px] text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-zinc-600"
          style={{ height: "200px" }}
        />
        {/* Char indicator bar */}
        <div className="h-1 bg-slate-100 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-200 ${isOverLimit ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-violet-500"}`}
            style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "文字数", value: charCount, max: MAX_CHARS, unit: "" },
          { label: "行数", value: lineCount, max: null, unit: "行" },
          { label: "ハッシュタグ", value: hashtagCount, max: null, unit: "個" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 px-3 py-2.5 text-center">
            <p className="text-[11px] text-slate-400 mb-1">{s.label}</p>
            <p className={`text-[18px] font-bold ${s.max && charCount > s.max ? "text-red-500" : "text-slate-800 dark:text-zinc-200"}`}>
              {s.value}<span className="text-[12px] font-normal text-slate-400 ml-0.5">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* X Preview */}
      {text && (
        <div>
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            投稿プレビュー（{device === "mobile" ? "スマホ" : "PC"}表示）
          </p>
          <div className={`mx-auto ${device === "mobile" ? "max-w-[375px]" : "max-w-full"}`}>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 shadow-sm">
              {/* X post header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">T</div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-none">ToolBoxJP</p>
                  <p className="text-[13px] text-slate-400">@toolboxjp</p>
                </div>
              </div>
              {/* Post body */}
              <div className={`text-[15px] leading-normal whitespace-pre-wrap ${isOverLimit ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                {renderXText(text)}
              </div>
              {isOverLimit && (
                <p className="text-[12px] text-red-500 mt-2 font-medium">⚠️ 文字数が{-remaining}文字オーバーしています</p>
              )}
              {/* Post footer */}
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                {[["💬","0"],["🔁","0"],["❤️","0"],["📊","0"]].map(([icon, val]) => (
                  <span key={icon} className="flex items-center gap-1 text-[13px] text-slate-400">
                    {icon} <span>{val}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { href: "/tools/chatgpt-format", emoji: "✨", label: "ChatGPT整形", desc: "X向けに整形" },
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
