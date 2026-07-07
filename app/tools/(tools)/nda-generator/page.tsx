import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { NdaGenerator } from "./NdaGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "NDA（秘密保持契約書）作成【無料】雛形をフォーム入力で完成｜Word不要・PDF保存",
  description: "NDA（秘密保持契約書）の雛形をフォーム入力だけで作成。開示目的・秘密情報の範囲・有効期間を選ぶだけで、実務で使える契約書をPDF保存できます。フリーランス・企業間取引に。無料・登録不要。",
  path: "/tools/nda-generator",
  keywords: ["NDA 雛形 無料","秘密保持契約書 テンプレート","NDA 作成","秘密保持契約 ひな形 ダウンロード","機密保持契約書 無料"],
  ogImage: `/api/og?${new URLSearchParams({ title: "NDA（秘密保持契約書）作成", icon: "🤝", desc: "NDAをフォーム入力で作成・PDF保存" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "作成したNDAに法的効力はありますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "NDAは当事者双方の合意があれば書面として有効です。ただし本ツールの雛形は一般的な取引を想定したものです。高額な取引や特殊な秘密情報を扱う場合は、弁護士のリーガルチェックをおすすめします。"
    }
  },
  {
    "@type": "Question",
    "name": "収入印紙は必要ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "NDA（秘密保持契約書）は印紙税の課税文書に該当しないため、収入印紙は不要です。"
    }
  },
  {
    "@type": "Question",
    "name": "電子契約でも使えますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "使えます。PDF保存した契約書を電子契約サービスにアップロードするか、双方がメールで合意の意思表示をする方法でも契約は成立します。"
    }
  },
  {
    "@type": "Question",
    "name": "有効期間はどのくらいに設定すべきですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "実務では契約終了後3〜5年の秘密保持義務を設定するのが一般的です。技術情報など長期の保護が必要な場合は期間を延ばすか、無期限とする例もあります。"
    }
  }
],
};


const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">NDA（秘密保持契約書）とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        NDA（Non-Disclosure Agreement・秘密保持契約書）は、業務上知り得た秘密情報を第三者に開示・漏洩しないことを約束する契約書です。新規取引・業務委託・M&A・採用面接などさまざまな場面で締結されます。
      </p>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。実際の契約締結にあたっては弁護士等の専門家にご相談ください。</p>
    </div>
  
    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 作成したNDAに法的効力はありますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. NDAは当事者双方の合意があれば書面として有効です。ただし本ツールの雛形は一般的な取引を想定したものです。高額な取引や特殊な秘密情報を扱う場合は、弁護士のリーガルチェックをおすすめします。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 収入印紙は必要ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. NDA（秘密保持契約書）は印紙税の課税文書に該当しないため、収入印紙は不要です。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 電子契約でも使えますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 使えます。PDF保存した契約書を電子契約サービスにアップロードするか、双方がメールで合意の意思表示をする方法でも契約は成立します。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 有効期間はどのくらいに設定すべきですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 実務では契約終了後3〜5年の秘密保持義務を設定するのが一般的です。技術情報など長期の保護が必要な場合は期間を延ばすか、無期限とする例もあります。</p>
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
      title="NDA（秘密保持契約書）作成ツール"
      description="正式なNDAフォーマットで秘密保持契約書を無料作成。PDF保存・印刷対応。登録不要・ブラウザ完結。"
      icon="🤝"
      slug="nda-generator"
      seoContent={seoContent}
    >
      <NdaGenerator />
    </ToolLayout>
    </>
  );
}
