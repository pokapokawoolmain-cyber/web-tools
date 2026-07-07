import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { MercariCalculator } from "./MercariCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "メルカリ利益計算ツール【無料】販売手数料10%・送料を引いた手取りを即計算",
  description:
    "メルカリの販売価格を入力するだけで、販売手数料10%・送料・仕入れ値を引いた実質利益（手取り）を自動計算。振込手数料200円や梱包材コストの目安も解説。無料・登録不要・スマホ対応。",
  path: "/tools/mercari-profit",
  keywords: [
    "メルカリ 利益計算",
    "メルカリ 手数料 計算",
    "メルカリ 手取り 計算",
    "メルカリ 販売手数料 10%",
    "メルカリ 送料 利益",
    "フリマ 利益 計算ツール",
    "せどり 利益計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({
    title: "メルカリ利益計算",
    icon: "🛍️",
    desc: "手数料10%・送料を引いた手取りを即計算",
  }).toString()}`,
});

const faqs = [
  {
    q: "メルカリの販売手数料はいくらですか？",
    a: "メルカリの販売手数料は販売価格（送料込みの出品価格）の10%です。例えば3,000円で売れた場合、手数料は300円です。送料出品者負担の場合はここからさらに送料が引かれるため、実際の手取りは思ったより少なくなることに注意しましょう。",
  },
  {
    q: "売上金を銀行口座に振り込むときの手数料は？",
    a: "メルカリの振込手数料は1回あたり200円です（振込金額にかかわらず一律）。少額ごとに何度も振り込むと手数料がかさむため、売上金をある程度まとめてから振込申請するか、メルペイとしてそのまま買い物に使うと手数料を節約できます。",
  },
  {
    q: "梱包材のコストも利益計算に入れるべきですか？",
    a: "はい。封筒・OPP袋・緩衝材（プチプチ）・宅配ビニール袋などの梱包材は1件あたり10〜50円程度かかります。薄利の商品ではこのコストが利益を大きく圧迫するため、本ツールの仕入れ値（コスト）に梱包材費も含めて計算するのがおすすめです。",
  },
  {
    q: "送料はどのくらいかかりますか？",
    a: "らくらくメルカリ便のネコポスは210円、宅急便コンパクトは450円＋専用箱70円、宅急便60サイズは750円です。ゆうゆうメルカリ便のゆうパケットは230円、ゆうパケットポストは215円＋発送用シール等の費用がかかります（2025年時点）。商品サイズに合った最安の発送方法を選ぶことが利益確保のポイントです。",
  },
  {
    q: "メルカリの利益に税金はかかりますか？",
    a: "不要になった生活用品（衣類・日用品など）の売却は原則非課税です。ただし営利目的の転売（せどり）や、給与所得者で年間の雑所得が20万円を超える場合は確定申告が必要になることがあります。継続的に販売している方は帳簿として利益を記録しておきましょう。",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      メルカリの手数料について
    </h2>
    <p>
      メルカリの販売手数料は販売価格の10%です。さらに送料・仕入れ値・梱包費などのコストを引いた金額が実際の利益になります。本ツールはこれらを自動計算します。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      利益率の目安
    </h3>
    <p>
      メルカリで利益率20〜30%以上を確保できれば収益性が高いとされています。送料や梱包費も忘れずに計算しましょう。
    </p>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      よくある質問
    </h2>
    <div className="not-prose space-y-3">
      {faqs.map((faq) => (
        <div
          key={faq.q}
          className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4"
        >
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function MercariProfitPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="メルカリ利益計算"
        description="販売価格・仕入れ価格・送料を入力するだけ。手数料10%を引いた実質手取りを計算します。"
        icon="🛍️"
        slug="mercari-profit"
        seoContent={seoContent}
      >
        <MercariCalculator />
      </ToolLayout>
    </>
  );
}
