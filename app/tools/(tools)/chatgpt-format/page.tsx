import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ChatGptFormat } from "./ChatGptFormat";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "ChatGPT改行整形ツール【無料】コピペで崩れたAI文章をnote・X・ブログ向けに一発整形",
  description: "ChatGPTの出力をコピペすると崩れる改行・記号・Markdownを自動整形。note・ブログ・X・LINE・Discord向けのフォーマットに一発変換できます。無料・登録不要・ブラウザ完結。",
  path: "/tools/chatgpt-format",
  keywords: ["ChatGPT 改行 整形","ChatGPT コピペ 崩れる","AI 文章 整形","ChatGPT note 貼り付け","マークダウン 除去 ツール"],
  ogImage: `/api/og?${new URLSearchParams({ title: "ChatGPT改行整形ツール", icon: "✨", desc: "AI出力をコピペ用に一発整形" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "なぜChatGPTの文章はコピペすると崩れるのですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "ChatGPTはMarkdown形式（**太字**や# 見出しなど）で出力するためです。Markdownに対応していないnoteやメールに貼ると記号がそのまま表示されます。本ツールが記号を除去・変換して整えます。"
    }
  },
  {
    "@type": "Question",
    "name": "どの投稿先に対応していますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "note・ブログ（WordPress等）・X(Twitter)・LINE・Discord向けの整形プリセットを用意しています。それぞれ改行幅や記号の扱いを最適化します。"
    }
  },
  {
    "@type": "Question",
    "name": "表や箇条書きはどうなりますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "箇条書きは「・」形式に変換します。Markdownの表は崩れやすいため、投稿先が表に対応していない場合はテキストへの書き換えをおすすめします。"
    }
  },
  {
    "@type": "Question",
    "name": "文章は外部に送信されますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "いいえ。整形処理はブラウザ内で完結し、入力した文章が外部に送信されることはありません。"
    }
  }
],
};


export default function ChatGptFormatPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="ChatGPT改行整形ツール"
      description="ChatGPTやAIの出力をnote・ブログ・X・LINE・Discord向けに自動整形。コピペで崩れる問題を瞬時に解決。"
      icon="✨"
      slug="chatgpt-format"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">ChatGPTのコピペが崩れる理由</h2>
          <p>ChatGPTはMarkdown記法（# 見出し・** 太字・- 箇条書きなど）で出力します。noteやブログの通常の入力欄はMarkdownを解釈しないため、そのまま貼り付けると記号が文字として表示されて崩れます。本ツールは各プラットフォームに適した形式に自動変換します。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">対応プラットフォーム</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>note</strong>：見出し・箇条書きをnote形式に最適化。不要なMarkdown記号を除去。</li>
            <li><strong>ブログ</strong>：WordPress・はてなブログ向けに段落・見出しを整理。</li>
            <li><strong>X（旧Twitter）</strong>：改行を最適化、Markdown記号を除去してポスト向けに圧縮。</li>
            <li><strong>LINE</strong>：太字を【】に変換、段落を短くしてLINE向けに最適化。</li>
            <li><strong>Discord</strong>：Discord Markdown対応の整形（太字・引用符を維持）。</li>
          </ul>
        </div>
      }
    >
      <ChatGptFormat />

    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. なぜChatGPTの文章はコピペすると崩れるのですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. ChatGPTはMarkdown形式（**太字**や# 見出しなど）で出力するためです。Markdownに対応していないnoteやメールに貼ると記号がそのまま表示されます。本ツールが記号を除去・変換して整えます。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. どの投稿先に対応していますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. note・ブログ（WordPress等）・X(Twitter)・LINE・Discord向けの整形プリセットを用意しています。それぞれ改行幅や記号の扱いを最適化します。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 表や箇条書きはどうなりますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 箇条書きは「・」形式に変換します。Markdownの表は崩れやすいため、投稿先が表に対応していない場合はテキストへの書き換えをおすすめします。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 文章は外部に送信されますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. いいえ。整形処理はブラウザ内で完結し、入力した文章が外部に送信されることはありません。</p>
        </div>
      </div>
    </section>

    </ToolLayout>
    </>
  );
}
