import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { AiHumanize } from "./AiHumanize";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "AI文章自然化ツール",
  "AIっぽい文章を人間らしく自動変換。語尾の繰り返し・固い言い回し・不自然な構造を自動修正。AI感スコア表示付き。",
  "ai-humanize",
  ["AIっぽい文章 修正", "ChatGPT バレる", "AI文章 自然化", "AI感 なくす", "AI文章 人間らしく"]
);

export default function AiHumanizePage() {
  return (
    <ToolLayout
      title="AI文章自然化ツール"
      description="「AIっぽい」と感じさせる文章パターンを検出して自動変換。語尾の均一化・固い言い回し・段落冒頭の繰り返しを修正します。"
      icon="🤖"
      slug="ai-humanize"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">AI文章が「バレる」パターン</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>段落の冒頭が「まず」「次に」「また」「さらに」「最後に」で統一されている</li>
            <li>「〜することができます」「〜という点で」などの冗長表現の多用</li>
            <li>すべての文末が「〜です。〜ます。」で統一されている</li>
            <li>「非常に」「極めて」「重要な」などの強調語の過剰使用</li>
            <li>一文が長く、接続詞で繋ぎすぎる構造</li>
          </ul>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">各モードの違い</h2>
          <p><strong>ビジネス</strong>：丁寧語を維持しながら冗長表現を圧縮。「することができます→できます」など。</p>
          <p><strong>SNS</strong>：口語調に変換。短い文・体言止めを多用してテンポよく読めるよう調整。</p>
          <p><strong>ブログ</strong>：親しみやすい文体。読者への語りかけ表現を追加。</p>
        </div>
      }
    >
      <AiHumanize />
    </ToolLayout>
  );
}
