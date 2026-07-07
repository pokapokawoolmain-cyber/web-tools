import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResignationLetterGenerator } from "./ResignationLetterGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "退職届・退職願 作成ツール【無料】フォーム入力で正式な書式が完成｜PDF・印刷対応",
  description: "退職届・退職願を正式な縦書き書式で自動作成。退職日・提出日・宛名を入力するだけで、そのまま提出できる書面をPDF保存・印刷できます。書き方の解説付き。無料・登録不要。",
  path: "/tools/resignation-letter-generator",
  keywords: ["退職届 作成","退職願 テンプレート 無料","退職届 書き方 縦書き","退職届 PDF","退職願 フォーマット"],
  ogImage: `/api/og?${new URLSearchParams({ title: "退職届・退職願 作成ツール", icon: "📄", desc: "退職届・退職願を正式書式で作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "退職届と退職願の違いは何ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "退職願は「退職させてください」というお願い（撤回の余地あり）、退職届は「退職します」という確定的な意思表示です。円満退職ではまず退職願を出し、承認後に退職届を出すのが丁寧な流れです。"
    }
  },
  {
    "@type": "Question",
    "name": "提出はいつまでにすればいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "民法上は退職日の2週間前までの申し出で退職できますが、就業規則で「1か月前まで」等と定められていることが多く、引き継ぎを考えると1〜2か月前の提出が円満です。"
    }
  },
  {
    "@type": "Question",
    "name": "手書きでないとダメですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "法的にはパソコン作成でも有効です。慣習的に手書きを求める会社もあるため、本ツールで文面を作成し、必要に応じて手書きで清書する使い方もできます。"
    }
  },
  {
    "@type": "Question",
    "name": "理由は正直に書くべきですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "自己都合退職の場合、理由は「一身上の都合」と書くのが慣例です。具体的な不満や転職先を書く必要はありません。"
    }
  }
],
};


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
  
    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 退職届と退職願の違いは何ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 退職願は「退職させてください」というお願い（撤回の余地あり）、退職届は「退職します」という確定的な意思表示です。円満退職ではまず退職願を出し、承認後に退職届を出すのが丁寧な流れです。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 提出はいつまでにすればいいですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 民法上は退職日の2週間前までの申し出で退職できますが、就業規則で「1か月前まで」等と定められていることが多く、引き継ぎを考えると1〜2か月前の提出が円満です。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 手書きでないとダメですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 法的にはパソコン作成でも有効です。慣習的に手書きを求める会社もあるため、本ツールで文面を作成し、必要に応じて手書きで清書する使い方もできます。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 理由は正直に書くべきですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 自己都合退職の場合、理由は「一身上の都合」と書くのが慣例です。具体的な不満や転職先を書く必要はありません。</p>
        </div>
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="退職届作成ツール"
      description="退職届・退職願を無料で作成。理由別テンプレート対応。A4印刷最適化済み。そのまま提出可能。"
      icon="✉️"
      slug="resignation-letter-generator"
      seoContent={seoContent}
    >
      <ResignationLetterGenerator />
    </ToolLayout>
    </>
  );
}
