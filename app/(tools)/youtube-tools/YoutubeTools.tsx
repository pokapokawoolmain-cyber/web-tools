"use client";
import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

// YouTube タイトルの最適文字数：57〜70文字（検索結果で切れない長さ）
const TITLE_OPTIMAL_MIN = 40;
const TITLE_OPTIMAL_MAX = 70;
const TITLE_HARD_MAX    = 100;

// ハッシュタグの最適数
const HASHTAG_OPTIMAL_MIN = 3;
const HASHTAG_OPTIMAL_MAX = 5;
const HASHTAG_HARD_MAX    = 15;

// 説明文の最適文字数（最初の3行が検索に表示される）
const DESC_ABOVE_FOLD = 150;
const DESC_OPTIMAL    = 500;

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function YoutubeTools() {
  const [title, setTitle]     = useState("");
  const [description, setDesc] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags]       = useState<string[]>([]);

  // ハッシュタグ追加
  const addTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, "");
    if (cleaned && !tags.includes(cleaned) && tags.length < HASHTAG_HARD_MAX) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  // タイトル分析
  const titleAnalysis = useMemo(() => {
    const len = title.length;
    let score = 0;
    const tips: string[] = [];

    if (len >= TITLE_OPTIMAL_MIN && len <= TITLE_OPTIMAL_MAX) { score += 40; }
    else if (len > 0 && len < TITLE_OPTIMAL_MIN) { tips.push(`タイトルを${TITLE_OPTIMAL_MIN}文字以上にするとSEO効果が高まります`); score += 20; }
    else if (len > TITLE_OPTIMAL_MAX && len <= TITLE_HARD_MAX) { tips.push("タイトルが長すぎると検索結果で途中で切れます"); score += 25; }
    else if (len > TITLE_HARD_MAX) { tips.push("タイトルが非常に長すぎます。100文字以内にしましょう"); score += 10; }

    if (/[【】「」\[\]【】]/.test(title)) { score += 10; }
    else { tips.push("【 】や「 」などで重要キーワードを囲むと目立ちます"); }

    if (/[！？!?]/.test(title)) { score += 10; }
    if (len > 0 && /\d/.test(title)) { score += 10; tips.push(""); }
    else if (len > 0) { tips.push("数字を含めると具体性が増しクリック率が上がります（例: 5つの方法）"); }

    return { len, score, tips: tips.filter(Boolean) };
  }, [title]);

  // 説明文分析
  const descAnalysis = useMemo(() => {
    const len = description.length;
    const preview = description.slice(0, DESC_ABOVE_FOLD);
    const hashTagsInDesc = (description.match(/#\S+/g) ?? []).length;

    return { len, preview, hashTagsInDesc };
  }, [description]);

  // ハッシュタグ文字列
  const hashtagString = tags.map((t) => `#${t}`).join(" ");
  const { copied: tagsCopied, copy: copyTags } = useCopy(hashtagString);

  const textareaClass = "w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ① タイトル チェッカー */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">🎯 タイトルチェッカー</h2>
        <div className="space-y-1.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={textareaClass.replace("resize-none", "")}
            placeholder="【永久保存版】初心者でもできるYouTube SEO完全攻略ガイド2024"
            maxLength={150}
          />
        </div>

        {/* 文字数バー */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">文字数: <span className="font-bold text-slate-900 dark:text-white">{titleAnalysis.len}</span></span>
            <span className={
              titleAnalysis.len >= TITLE_OPTIMAL_MIN && titleAnalysis.len <= TITLE_OPTIMAL_MAX
                ? "text-emerald-500 font-semibold" : "text-slate-400"
            }>
              最適: {TITLE_OPTIMAL_MIN}〜{TITLE_OPTIMAL_MAX}文字
            </span>
          </div>
          <div className="relative h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                titleAnalysis.len === 0 ? "bg-slate-300" :
                titleAnalysis.len <= TITLE_OPTIMAL_MAX ? "bg-emerald-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, (titleAnalysis.len / TITLE_HARD_MAX) * 100)}%` }}
            />
            {/* 最適ゾーンマーカー */}
            <div
              className="absolute top-0 h-full bg-emerald-200 dark:bg-emerald-900/30 pointer-events-none"
              style={{
                left: `${(TITLE_OPTIMAL_MIN / TITLE_HARD_MAX) * 100}%`,
                width: `${((TITLE_OPTIMAL_MAX - TITLE_OPTIMAL_MIN) / TITLE_HARD_MAX) * 100}%`,
                opacity: 0.5,
              }}
            />
          </div>
        </div>

        {/* SEOスコア */}
        {title.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">SEOスコア</span>
              <span className={`font-bold text-sm ${
                titleAnalysis.score >= 70 ? "text-emerald-500" :
                titleAnalysis.score >= 50 ? "text-yellow-500" : "text-red-500"
              }`}>{titleAnalysis.score}/100</span>
            </div>
            <ScoreBar score={titleAnalysis.score} />

            {titleAnalysis.tips.length > 0 && (
              <div className="space-y-1.5">
                {titleAnalysis.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                    <span className="flex-shrink-0">💡</span>{tip}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ② ハッシュタグ ツール */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white"># ハッシュタグ管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            className={`${textareaClass.replace("resize-none", "")} flex-1`}
            placeholder="YouTubeマーケティング（Enterで追加）"
          />
          <button onClick={addTag} className="btn-primary flex-shrink-0">追加</button>
        </div>

        {/* タグ一覧 */}
        {tags.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <div key={t}
                  className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 text-sm">
                  <span>#{t}</span>
                  <button onClick={() => removeTag(t)} className="text-blue-400 hover:text-red-500 text-xs">✕</button>
                </div>
              ))}
            </div>

            {/* 最適数チェック */}
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${
                tags.length >= HASHTAG_OPTIMAL_MIN && tags.length <= HASHTAG_OPTIMAL_MAX
                  ? "text-emerald-500" : "text-amber-500"
              }`}>
                {tags.length}個 / 推奨: {HASHTAG_OPTIMAL_MIN}〜{HASHTAG_OPTIMAL_MAX}個
              </span>
              <button onClick={copyTags}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                {tagsCopied ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5" />}
                全コピー
              </button>
            </div>
          </>
        )}
      </div>

      {/* ③ 説明文 チェッカー */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">📋 説明文チェッカー</h2>
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          className={textareaClass}
          rows={5}
          placeholder={`動画の説明文を入力してください。\n最初の${DESC_ABOVE_FOLD}文字が検索結果に表示されます。\n\n重要なキーワードや自己紹介を最初に書きましょう。`}
        />
        {description.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">合計文字数: <span className="font-bold text-slate-900 dark:text-white">{descAnalysis.len}</span></span>
              <span className={descAnalysis.len >= DESC_OPTIMAL ? "text-emerald-500" : "text-amber-500"}>
                推奨: {DESC_OPTIMAL}文字以上
              </span>
            </div>
            <ScoreBar score={descAnalysis.len} max={DESC_OPTIMAL} />
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3 space-y-1">
              <p className="font-semibold text-blue-700 dark:text-blue-400">検索結果に表示される冒頭（約{DESC_ABOVE_FOLD}文字）:</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{descAnalysis.preview}
                {description.length > DESC_ABOVE_FOLD && <span className="text-slate-400">...</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ④ サムネイル比率チェッカー */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">🖼️ サムネイル比率ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "YouTube標準", w: 1280, h: 720, ratio: "16:9", ok: true },
            { label: "ショート動画",  w: 1080, h: 1920, ratio: "9:16", ok: true },
            { label: "正方形（非推奨）", w: 1080, h: 1080, ratio: "1:1", ok: false },
          ].map((spec) => (
            <div key={spec.label} className={`rounded-xl border p-4 ${
              spec.ok
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span>{spec.ok ? "✅" : "⚠️"}</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{spec.label}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {spec.w} × {spec.h}px｜{spec.ratio}
              </p>
              {/* ビジュアル比率プレビュー */}
              <div className="mt-2 flex items-center">
                <div
                  className={`rounded border-2 ${spec.ok ? "border-emerald-400" : "border-slate-300"}`}
                  style={{
                    width:  `${Math.min(60, 60 * (spec.w / spec.h))}px`,
                    height: `${Math.min(60, 60 * (spec.h / spec.w))}px`,
                    background: spec.ok ? "linear-gradient(135deg,#d1fae5,#6ee7b7)" : "#e2e8f0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          💡 最小サイズは 640×360px。ファイルサイズは 2MB 以下（JPG / PNG 推奨）
        </p>
      </div>
    </div>
  );
}
