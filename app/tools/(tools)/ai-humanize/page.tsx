import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiHumanize } from "./AiHumanize";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "AI文章を自然な日本語に変換【無料】AIっぽさを自動修正｜AI感スコア付き",
  description: "ChatGPTなどのAIが書いた文章の「AIっぽさ」を検出し、自然な日本語へ自動修正。語尾の単調さ・固い言い回し・機械的な接続詞を直します。AI感スコアで改善度も確認。無料・ブラウザ完結。",
  path: "/tools/ai-humanize",
  keywords: ["AI 文章 自然に","AIっぽい 文章 直す","ChatGPT 文章 人間らしく","AI 文章 バレない","AI文章 リライト 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "AI文章を自然な日本語に変換", icon: "🤖", desc: "AIっぽい文章を自然な日本語へ" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "どんな「AIっぽさ」を修正しますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "「〜することができます」などの冗長表現、段落頭の「まず・次に・また」の繰り返し、均一な語尾、機械的な箇条書き癖などを検出し、自然な日本語に置き換えます。"
    }
  },
  {
    "@type": "Question",
    "name": "AI検出ツールを回避できますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "本ツールの目的は読者にとって自然で読みやすい文章にすることです。文体の機械的な特徴は減りますが、検出回避を保証するものではありません。学校や職場のルールに従ってご利用ください。"
    }
  },
  {
    "@type": "Question",
    "name": "文章の意味は変わりませんか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "意味を保ったまま表現だけを調整します。ただし自動処理のため、変換後は必ず全体を読み直し、意図と異なる箇所がないか確認してください。"
    }
  },
  {
    "@type": "Question",
    "name": "入力した文章は外部に送信されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "いいえ。処理はすべてブラウザ内で完結し、文章が外部サーバーに送信されることはありません。"
    }
  }
],
};


export default function AiHumanizePage() {
  return (
    <>
    <JsonLd data={faqSchema} />
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

    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. どんな「AIっぽさ」を修正しますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 「〜することができます」などの冗長表現、段落頭の「まず・次に・また」の繰り返し、均一な語尾、機械的な箇条書き癖などを検出し、自然な日本語に置き換えます。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. AI検出ツールを回避できますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 本ツールの目的は読者にとって自然で読みやすい文章にすることです。文体の機械的な特徴は減りますが、検出回避を保証するものではありません。学校や職場のルールに従ってご利用ください。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 文章の意味は変わりませんか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 意味を保ったまま表現だけを調整します。ただし自動処理のため、変換後は必ず全体を読み直し、意図と異なる箇所がないか確認してください。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 入力した文章は外部に送信されますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. いいえ。処理はすべてブラウザ内で完結し、文章が外部サーバーに送信されることはありません。</p>
        </div>
      </div>
    </section>

    </ToolLayout>
    </>
  );
}
