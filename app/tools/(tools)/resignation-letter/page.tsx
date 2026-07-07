import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResignationLetter } from "./ResignationLetter";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "退職届テンプレート【無料】理由別の文例で作成｜体調不良・パワハラ・契約満了対応",
  description: "退職届を理由別テンプレート（一身上の都合・体調不良・パワハラ・契約期間満了）で無料作成。日付と名前を入れるだけで正式な書式が完成し、PDF保存・印刷できます。登録不要。",
  path: "/tools/resignation-letter",
  keywords: ["退職届 テンプレート 無料","退職届 例文","退職届 パワハラ 書き方","退職届 体調不良","退職届 ダウンロード"],
  ogImage: `/api/og?${new URLSearchParams({ title: "退職届テンプレート", icon: "📄", desc: "理由別テンプレートで退職届を作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "退職届と退職願はどちらを出すべきですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "まだ退職の承認を得ていない段階では「退職願」、退職日が確定した後の正式提出には「退職届」を使います。本ツールはどちらの書式にも対応しています。"
    }
  },
  {
    "@type": "Question",
    "name": "パワハラが理由でも「一身上の都合」と書くのですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "会社都合退職として扱ってほしい場合は「一身上の都合」と書かず、具体的な理由（ハラスメント等）を明記する選択肢があります。失業給付の条件に関わるため、ハローワークへの相談も検討してください。本ツールには理由別のテンプレートがあります。"
    }
  },
  {
    "@type": "Question",
    "name": "封筒はどうすればいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "白無地の封筒（郵便番号枠なし）に「退職届」と表書きし、裏面左下に所属と氏名を書きます。書面は三つ折りにして入れるのが一般的です。"
    }
  },
  {
    "@type": "Question",
    "name": "提出後に撤回できますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "退職届は受理されると撤回が難しくなります。迷いがある段階では退職願にとどめ、上司との面談を先に行うのが安全です。"
    }
  }
],
};


export default function ResignationLetterPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
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

    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 退職届と退職願はどちらを出すべきですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. まだ退職の承認を得ていない段階では「退職願」、退職日が確定した後の正式提出には「退職届」を使います。本ツールはどちらの書式にも対応しています。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. パワハラが理由でも「一身上の都合」と書くのですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 会社都合退職として扱ってほしい場合は「一身上の都合」と書かず、具体的な理由（ハラスメント等）を明記する選択肢があります。失業給付の条件に関わるため、ハローワークへの相談も検討してください。本ツールには理由別のテンプレートがあります。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 封筒はどうすればいいですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 白無地の封筒（郵便番号枠なし）に「退職届」と表書きし、裏面左下に所属と氏名を書きます。書面は三つ折りにして入れるのが一般的です。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 提出後に撤回できますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 退職届は受理されると撤回が難しくなります。迷いがある段階では退職願にとどめ、上司との面談を先に行うのが安全です。</p>
        </div>
      </div>
    </section>

    </ToolLayout>
    </>
  );
}
