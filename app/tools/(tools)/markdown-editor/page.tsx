import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { MarkdownEditor } from "./MarkdownEditor";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "Markdownエディタ",
  "左に書いて右でプレビュー。GitHub対応Markdownをリアルタイムプレビュー。コピー・ダウンロード対応。",
  "markdown-editor",
  ["Markdownエディタ", "Markdown変換", "マークダウン", "プレビュー", "GitHub Markdown", "無料"]
);

export default function MarkdownEditorPage() {
  return (
    <ToolLayout
      title="Markdownエディタ"
      description="左に書いて右でプレビュー。GitHub対応MDをリアルタイム確認・コピー・ダウンロード。"
      icon="📝"
      slug="markdown-editor"
    >
      <MarkdownEditor />
    </ToolLayout>
  );
}
