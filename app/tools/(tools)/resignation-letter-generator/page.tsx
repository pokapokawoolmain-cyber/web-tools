import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ResignationLetterGenerator } from "./ResignationLetterGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "退職届作成ツール",
  "退職届・退職願を無料で作成。一身上の都合など理由別テンプレ対応。A4印刷最適化済み。そのまま提出可能。",
  "resignation-letter-generator",
  ["退職届 テンプレ", "退職届 書き方", "退職願 無料", "一身上の都合", "退職届 印刷"]
);

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">退職届と退職願の違い</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        「退職願」は会社に退職を願い出る書類、「退職届」は退職することを正式に通知する書類です。撤回が原則できないのは退職届で、退職意思が固まったら退職届を提出するのが一般的です。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 提出前にご確認ください</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">就業規則で書式・提出方法が指定されている場合があります。会社のルールをご確認の上ご利用ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="退職届作成ツール"
      description="退職届・退職願を無料で作成。理由別テンプレート対応。A4印刷最適化済み。そのまま提出可能。"
      icon="✉️"
      slug="resignation-letter-generator"
      seoContent={seoContent}
    >
      <ResignationLetterGenerator />
    </ToolLayout>
  );
}
