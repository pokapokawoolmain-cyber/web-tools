import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { MortgageCalculator } from "./MortgageCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "住宅ローンシミュレーター【無料】毎月の返済額・総返済額・利息を即計算",
  description: "借入額・金利・返済期間を入力するだけで、毎月の返済額・総返済額・利息合計を即計算。変動金利と固定金利の比較や、ボーナス返済なしの計画づくりに。無料・登録不要・スマホ対応。",
  path: "/tools/mortgage-calculator",
  keywords: ["住宅ローン シミュレーション","住宅ローン 計算 無料","住宅ローン 毎月 返済額","住宅ローン 金利 比較 計算","借入可能額 目安"],
  ogImage: `/api/og?${new URLSearchParams({ title: "住宅ローンシミュレーター", icon: "🏠", desc: "毎月返済額・総返済額・利息を即計算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "毎月の返済額はどう計算されていますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "元利均等返済（毎月の返済額が一定になる方式）で計算しています。借入額・年利・返済期間から、金利を含めた毎月の支払額と総返済額を算出します。"
    }
  },
  {
    "@type": "Question",
    "name": "変動金利と固定金利はどちらがいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "変動金利（現在0.3〜0.6%台）は当初の返済額が少ない一方、金利上昇リスクがあります。固定金利（1〜2%台）は返済額が確定する安心感があります。両方の金利で計算して差額を確認するのがおすすめです。"
    }
  },
  {
    "@type": "Question",
    "name": "年収に対して借入額はいくらまでが安全ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "年間返済額が年収の20〜25%以内（返済負担率）に収まるのが無理のない目安です。金融機関の審査上限（30〜35%）まで借りると家計が硬直しやすいため注意してください。"
    }
  },
  {
    "@type": "Question",
    "name": "このシミュレーションに含まれない費用はありますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "固定資産税・火災保険・修繕費・管理費（マンション）・登記や事務手数料などの諸費用は含まれません。物件価格の5〜10%程度の諸費用を別途見込んでください。"
    }
  }
],
};


const seoContent = (
  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">住宅ローンシミュレーターの使い方</h2>
    <p>借入金額・年利・返済期間を入力すると、元利均等返済方式での毎月返済額・総返済額・利息合計を自動計算します。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">元利均等返済とは？</h3>
    <p>毎月の返済額が一定になる最も一般的な返済方式です。返済初期は利息の割合が高く、後半になるほど元本が多く減っていきます。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">繰り上げ返済の効果</h3>
    <p>ローン残高が多い初期に繰り上げ返済を行うことで、利息を大幅に減らせます。本ツールで試算してから金融機関に相談しましょう。</p>
  
    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 毎月の返済額はどう計算されていますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 元利均等返済（毎月の返済額が一定になる方式）で計算しています。借入額・年利・返済期間から、金利を含めた毎月の支払額と総返済額を算出します。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 変動金利と固定金利はどちらがいいですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 変動金利（現在0.3〜0.6%台）は当初の返済額が少ない一方、金利上昇リスクがあります。固定金利（1〜2%台）は返済額が確定する安心感があります。両方の金利で計算して差額を確認するのがおすすめです。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 年収に対して借入額はいくらまでが安全ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 年間返済額が年収の20〜25%以内（返済負担率）に収まるのが無理のない目安です。金融機関の審査上限（30〜35%）まで借りると家計が硬直しやすいため注意してください。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. このシミュレーションに含まれない費用はありますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 固定資産税・火災保険・修繕費・管理費（マンション）・登記や事務手数料などの諸費用は含まれません。物件価格の5〜10%程度の諸費用を別途見込んでください。</p>
        </div>
      </div>
    </section>
  </div>
);

export default function MortgageCalculatorPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="住宅ローンシミュレーター"
      description="借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算します。"
      icon="🏠"
      slug="mortgage-calculator"
      seoContent={seoContent}
    >
      <MortgageCalculator />
    </ToolLayout>
    </>
  );
}
