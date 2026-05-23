import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ResignationLetter } from "./ResignationLetter";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "退職届ジェネレーター",
  "退職届を無料で作成。一身上の都合・パワハラ・体調不良・契約満了など理由別テンプレ。A4印刷・PDF対応。",
  "resignation-letter",
  ["退職届 テンプレ 無料", "退職届 パワハラ 書き方", "退職届 PDF 印刷", "退職届 書き方 例文", "退職届 一身上の都合"]
);

export default function ResignationLetterPage() {
  return (
    <ToolLayout
      title="退職届ジェネレーター"
      description="退職届を無料で作成。一身上の都合・パワハラ・体調不良など理由別テンプレート対応。A4印刷・PDF保存。"
      icon="📄"
      slug="resignation-letter"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">退職届と退職願の違い</h2>
          <p><strong>退職願</strong>：会社に退職を「お願い」する書類。会社に承認を求める意味合いがあり、会社が受理する前であれば撤回できる。</p>
          <p><strong>退職届</strong>：退職の意思を「届け出る」書類。民法上、提出から2週間後に退職が成立（会社の承認は不要）。撤回は原則できない。</p>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
            <p className="text-[13px] font-semibold text-amber-800 dark:text-amber-300">⚠️ パワハラの場合の注意点</p>
            <p className="text-[13px] text-amber-700 dark:text-amber-400 mt-1">退職届の理由欄に「一身上の都合」と書くのが一般的です。パワハラを理由として記載したい場合は、証拠を保全したうえで労働組合・弁護士への相談も検討してください。</p>
          </div>
        </div>
      }
    >
      <ResignationLetter />
    </ToolLayout>
  );
}
