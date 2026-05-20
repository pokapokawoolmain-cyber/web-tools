import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { CertifiedLetterGenerator } from "./CertifiedLetterGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "内容証明テンプレ作成ツール",
  "内容証明郵便のテンプレートを無料で作成。日本郵便の書式ルール（1行26文字・20行）に対応した文字数ガイド付き。",
  "certified-letter-generator",
  ["内容証明 テンプレ", "内容証明郵便 書き方", "内容証明 無料", "内容証明 文字数", "内容証明 雛形"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">内容証明郵便とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        内容証明郵便は、いつ・誰が・誰に対して・どのような内容の文書を送ったかを日本郵便が証明する制度です。書式は「1行26文字以内、1枚20行以内」「縦書きの場合は20文字×26行」など決まりがあります。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールはテンプレート作成補助です。法的トラブル対応の重要文書については弁護士・行政書士にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="内容証明テンプレ作成ツール"
      description="内容証明郵便のテンプレートを無料で作成。1行26文字・1枚20行の書式ルールに対応した文字数ガイド付き。"
      icon="📮"
      slug="certified-letter-generator"
      seoContent={seoContent}
    >
      <CertifiedLetterGenerator />
    </ToolLayout>
  );
}
