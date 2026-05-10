import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ResumeBuilder } from "./ResumeBuilder";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "職務経歴書作成ツール",
  "フォームを埋めるだけで職務経歴書の文章が完成。自己PR・スキル・経歴をそのままコピー可能。",
  "resume-builder",
  ["履歴書作成", "職務経歴書", "転職", "自己PR", "スキルシート", "無料"]
);

export default function ResumeBuilderPage() {
  return (
    <ToolLayout
      title="職務経歴書作成ツール"
      description="フォームを埋めるだけで職務経歴書の文章が完成。コピーしてそのまま使えます。"
      icon="📄"
      slug="resume-builder"
    >
      <ResumeBuilder />
    </ToolLayout>
  );
}
