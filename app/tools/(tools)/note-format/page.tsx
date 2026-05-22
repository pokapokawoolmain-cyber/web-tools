import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { NoteFormat } from "./NoteFormat";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "note記事整形ツール",
  "ChatGPTやAIの出力をnote投稿に最適化。見出し自動検出・適切な空白調整・読みやすさ向上。note風プレビュー付き。",
  "note-format",
  ["note 整形", "note 改行", "note 見やすい書き方", "note AI 貼り付け", "ChatGPT note 整形"]
);

export default function NoteFormatPage() {
  return (
    <ToolLayout
      title="note記事整形ツール"
      description="ChatGPTやAIの出力をnote向けに自動整形。見出し検出・空白調整・読みやすさを向上させます。"
      icon="📝"
      slug="note-format"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">noteでAI文章が崩れる原因</h2>
          <p>ChatGPTはMarkdown記法（#・**・-など）で出力します。noteはMarkdown記法に完全対応していないため、そのまま貼り付けると記号が文字として残り崩れます。本ツールはnoteに最適化したフォーマットに自動変換します。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">整形で行うこと</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Markdownの見出し記号（#）を除去し、前後に適切な空白を追加</li>
            <li>太字記号（**）を除去</li>
            <li>箇条書き記号（-・*）を「・」に変換</li>
            <li>3行以上の連続した空行を2行に圧縮</li>
            <li>コードブロック（` ` `）のバッククォートを除去</li>
          </ul>
        </div>
      }
    >
      <NoteFormat />
    </ToolLayout>
  );
}
