import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BusinessContractGenerator } from "./BusinessContractGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "業務委託契約書の雛形作成【無料】フリーランス向けテンプレートをフォーム入力で完成",
  description:
    "業務委託契約書を無料で作成。Web制作・動画編集・システム開発などのテンプレートを選び、フォーム入力するだけで完成。PDF保存・印刷対応。登録不要・ブラウザ完結。",
  path: "/tools/business-contract-generator",
  keywords: [
    "業務委託契約書 雛形",
    "業務委託契約書 テンプレート 無料",
    "フリーランス 契約書",
    "業務委託 契約書 作成",
    "準委任 請負 違い",
    "業務委託契約書 ひな形",
    "契約書 作成 無料",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "業務委託契約書作成ツール", icon: "📋", desc: "テンプレート選択＋フォーム入力で契約書を無料作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "業務委託契約書に印紙税はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "業務委託契約書は原則として印紙税の対象外ですが、請負契約として認定される場合は必要になることがあります。税理士にご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "電子契約でも有効ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "電子文書も法的に有効ですが、電子署名の方法によって効力が異なります。重要な契約は電子契約サービスの利用を検討してください。",
      },
    },
    {
      "@type": "Question",
      name: "自分で作った業務委託契約書でも法的に有効ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "契約は当事者双方の合意があれば成立するため、自分で作成した契約書でも法的に有効です。ただし、報酬・納期・著作権の帰属・契約解除の条件など重要な条項に漏れがあるとトラブルの原因になります。高額な取引や複雑な案件では弁護士のリーガルチェックをおすすめします。",
      },
    },
    {
      "@type": "Question",
      name: "準委任契約と請負契約の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "請負契約は「成果物の完成」に対して報酬を支払う契約で、受注者は完成責任（契約不適合責任）を負います。準委任契約は「業務の遂行」自体に対して報酬を支払う契約で、完成義務はありません。システム開発の要件定義やコンサルティングは準委任、Webサイト制作や動画納品は請負とされることが多いです。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">業務委託契約書とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        業務委託契約書は、発注者（クライアント）と受注者（フリーランス・外注先）が業務内容・報酬・納期・権利関係などを明確にするための書類です。口頭契約のトラブルを防ぎ、双方の権利を守る重要な書類です。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 印紙税はかかりますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 業務委託契約書は原則として印紙税の対象外ですが、請負契約として認定される場合は必要になることがあります。税理士にご確認ください。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 電子契約でも有効ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 電子文書も法的に有効ですが、電子署名の方法によって効力が異なります。重要な契約は電子契約サービスの利用を検討してください。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 自分で作った業務委託契約書でも法的に有効ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 契約は当事者双方の合意があれば成立するため、自分で作成した契約書でも法的に有効です。ただし、報酬・納期・著作権の帰属・契約解除の条件など重要な条項に漏れがあるとトラブルの原因になります。高額な取引や複雑な案件では弁護士のリーガルチェックをおすすめします。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 準委任契約と請負契約の違いは何ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 請負契約は「成果物の完成」に対して報酬を支払う契約で、受注者は完成責任（契約不適合責任）を負います。準委任契約は「業務の遂行」自体に対して報酬を支払う契約で、完成義務はありません。システム開発の要件定義やコンサルティングは準委任、Webサイト制作や動画納品は請負とされることが多いです。</p></div>
      </div>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールで作成した書類はひな形です。実際の契約締結にあたっては弁護士等の専門家にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="業務委託契約書作成ツール"
        description="テンプレートを選んで入力するだけで業務委託契約書を無料作成。PDF保存・印刷対応。登録不要・ブラウザ完結。"
        icon="📋"
        slug="business-contract-generator"
        seoContent={seoContent}
      >
        <BusinessContractGenerator />
      </ToolLayout>
    </>
  );
}
