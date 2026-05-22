"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";

type Mode = "business" | "sns" | "blog";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "business", label: "ビジネス", emoji: "💼" },
  { id: "sns", label: "SNS", emoji: "📱" },
  { id: "blog", label: "ブログ", emoji: "✍️" },
];

// AI文章のパターン（スコアリング用）
const AI_PATTERNS = [
  /^(まず|次に|また|さらに|そして|最後に|続いて|加えて)[、,]/m,
  /することができます/g,
  /という点(で|から|において)/g,
  /を踏まえると/g,
  /を考慮すると/g,
  /非常に|極めて|とても重要/g,
  /〜ということです/g,
  /ご理解いただけると思います/g,
  /ということが言えます/g,
  /重要なポイント(は|として)/g,
];

function calcAiScore(text: string): number {
  if (!text.trim()) return 0;
  const per100 = text.length / 100;
  let hits = 0;
  for (const pat of AI_PATTERNS) {
    const matches = text.match(pat);
    if (matches) hits += matches.length;
  }
  // Normalize: 0-100 score, higher = more AI-like
  const raw = Math.min(hits / Math.max(per100, 0.5), 3);
  return Math.min(Math.round((raw / 3) * 100), 100);
}

function humanize(text: string, mode: Mode): string {
  if (!text.trim()) return "";
  let t = text;

  // Universal: Remove/replace common AI patterns
  t = t.replace(/することができます/g, "できます");
  t = t.replace(/することが可能です/g, "可能です");
  t = t.replace(/という点において/g, "点で");
  t = t.replace(/という観点から/g, "の観点から");
  t = t.replace(/を踏まえると/g, "から考えると");
  t = t.replace(/を考慮すると/g, "を考えると");
  t = t.replace(/ということが言えます/g, "と言えます");
  t = t.replace(/ということです/g, "ということです");
  t = t.replace(/ご理解いただけると思います/g, "わかっていただけると思います");
  t = t.replace(/重要なポイントは/g, "ポイントは");
  t = t.replace(/重要なポイントとして/g, "大切なこととして");
  t = t.replace(/最終的には/g, "結局");
  t = t.replace(/また、/g, "それから、");

  if (mode === "business") {
    // Slightly more formal, but less robotic
    t = t.replace(/非常に/g, "大変");
    t = t.replace(/極めて/g, "かなり");
    t = t.replace(/しております/g, "しています");
    t = t.replace(/させていただきます/g, "します");
  } else if (mode === "sns") {
    // Casual, short, punchy
    t = t.replace(/ます。/g, "！");
    t = t.replace(/です。/g, "。");
    t = t.replace(/非常に/g, "すごく");
    t = t.replace(/極めて/g, "めちゃくちゃ");
    t = t.replace(/また、/g, "あと、");
    t = t.replace(/なお、/g, "ちなみに、");
    t = t.replace(/しています/g, "してる");
    t = t.replace(/ください/g, "くださいね");
  } else if (mode === "blog") {
    // Friendly, approachable
    t = t.replace(/非常に/g, "とても");
    t = t.replace(/極めて/g, "かなり");
    t = t.replace(/なお、/g, "ちなみに、");
    t = t.replace(/しております/g, "しています");
    t = t.replace(/させていただきます/g, "させてもらいます");
  }

  return t.trim();
}

// Highlight changed parts (simple diff by line)
function getChangedLines(original: string, humanized: string): Set<number> {
  const origLines = original.split("\n");
  const humanLines = humanized.split("\n");
  const changed = new Set<number>();
  humanLines.forEach((line, i) => {
    if (origLines[i] !== line) changed.add(i);
  });
  return changed;
}

export function AiHumanize() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("business");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const aiScore = useMemo(() => calcAiScore(input), [input]);
  const output = useMemo(() => humanize(input, mode), [input, mode]);
  const naturalScore = useMemo(() => Math.max(0, 100 - aiScore), [aiScore]);
  const changedLines = useMemo(() => getChangedLines(input, output), [input, output]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(Math.max(el.scrollHeight, 180), 500) + "px";
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const scoreColor = aiScore >= 70 ? "text-red-500" : aiScore >= 40 ? "text-amber-500" : "text-green-500";
  const scoreBg = aiScore >= 70 ? "bg-red-500" : aiScore >= 40 ? "bg-amber-500" : "bg-green-500";
  const scoreLabel = aiScore >= 70 ? "AIっぽい" : aiScore >= 40 ? "やや気になる" : "自然な文章";

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          変換モード
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                mode === m.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                  : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI感スコア */}
      {input.length > 50 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${scoreColor}`} />
              <span className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">AI感スコア</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[20px] font-bold ${scoreColor}`}>{aiScore}</span>
              <span className="text-[12px] text-slate-400">/100</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                aiScore >= 70 ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400" :
                aiScore >= 40 ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400"
              }`}>{scoreLabel}</span>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scoreBg}`}
              style={{ width: `${aiScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>自然</span>
            <span>AIっぽい</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">
            AI文章を貼り付け
            <span className="ml-2 text-[11px] font-normal text-slate-400">{input.length}文字</span>
          </span>
          <button
            onClick={() => setInput("")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ChatGPTやAIが生成した文章をここに貼り付けてください..."
          className="w-full min-h-[180px] p-4 text-[14px] text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-zinc-600"
          style={{ height: "260px" }}
        />
      </div>

      {/* Output */}
      {output && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-violet-200 dark:border-violet-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">
                自然化後
              </span>
              {changedLines.size > 0 && (
                <span className="text-[11px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full font-medium">
                  {changedLines.size}箇所修正
                </span>
              )}
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
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {output.split("\n").map((line, i) => (
              <div
                key={i}
                className={`text-[14px] leading-relaxed ${
                  changedLines.has(i)
                    ? "bg-violet-50 dark:bg-violet-950/20 -mx-4 px-4 border-l-2 border-violet-400"
                    : ""
                }`}
              >
                <span className={changedLines.has(i) ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-zinc-300"}>
                  {line || " "}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Natural score after */}
      {output && (
        <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-lg">✅</span>
            <span className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
              自然度スコア: <strong>{naturalScore}/100</strong>
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${
              copied ? "bg-green-500 text-white" : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "コピー済み！" : "コピー"}
          </button>
        </div>
      )}

      {/* Related tools */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { href: "/tools/chatgpt-format", emoji: "✨", label: "ChatGPT整形", desc: "改行・フォーマット" },
            { href: "/tools/note-format", emoji: "📝", label: "note整形", desc: "note専用整形" },
            { href: "/tools/x-post-preview", emoji: "𝕏", label: "X投稿プレビュー", desc: "改行を確認" },
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
