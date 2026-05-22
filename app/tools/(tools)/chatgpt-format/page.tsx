import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ChatGptFormat } from "./ChatGptFormat";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "ChatGPT改行整形ツール",
  "ChatGPTやAIの出力文章をnote・ブログ・X・LINE・Discord向けに自動整形。改行崩れ・コピペ問題を一瞬で解決。",
  "chatgpt-format",
  ["ChatGPT 改行 整形", "AI文章 見づらい", "ChatGPT コピペ 崩れる", "ChatGPT note 貼り付け", "AI文章 整形 無料"]
);

export default function ChatGptFormatPage() {
  return (
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
    </ToolLayout>
  );
}
