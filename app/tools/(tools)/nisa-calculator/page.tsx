import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { NisaCalculator } from "./NisaCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateToolMeta(
  "新NISA積立計算",
  "毎月の積立額・運用期間・利回りを入力するだけで将来の資産額を計算。複利効果を可視化。",
  "nisa-calculator",
  ["新NISA", "積立NISA", "複利計算", "資産形成", "投資シミュレーション", "つみたて"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "新NISAの年間投資上限はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年間360万円（つみたて投資枠120万円＋成長投資枠240万円）です。生涯投資上限は1,800万円で、売却すると翌年以降に枠が復活します。" },
    },
    {
      "@type": "Question",
      name: "利回り何%で計算するのが現実的ですか？",
      acceptedAnswer: { "@type": "Answer", text: "全世界株式・S&P500インデックスファンドの過去実績は年率5〜7%程度です。保守的に見るなら3〜4%、標準的なシナリオなら5%で試算するのが一般的です。" },
    },
    {
      "@type": "Question",
      name: "月5万円を30年積み立てるといくらになりますか？",
      acceptedAnswer: { "@type": "Answer", text: "利回り5%の場合、元本1,800万円が約4,161万円になります。非課税のNISA口座なら運用益約2,361万円がそのまま手元に残ります。" },
    },
    {
      "@type": "Question",
      name: "新NISAの非課税メリットは具体的にどのくらいですか？",
      acceptedAnswer: { "@type": "Answer", text: "課税口座では運用益に約20%の税金がかかります。月5万円・5%・20年なら運用益約1,225万円に対して約249万円が課税されますが、NISAなら全額非課税です。" },
    },
    {
      "@type": "Question",
      name: "このシミュレーターは無料で使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要でご利用いただけます。複数のシナリオを切り替えながら何度でも試算できます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      新NISA積立計算の使い方
    </h2>
    <p>
      新NISAは2024年から始まった非課税投資制度です。年間360万円まで投資でき、運用益がすべて非課税になります。本ツールでは毎月の積立額・運用年数・利回りを入力して将来の資産額を計算できます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      複利の力
    </h3>
    <p>
      毎月3万円を年利5%で20年積み立てると、元本720万円が約1,233万円になります。複利は「利息にも利息がつく」仕組みで、長期投資ほど効果が大きくなります。30年に延ばすと元本1,080万円が約2,496万円まで成長します。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      積立額ごとの目安
    </h3>
    <p>
      月3万円・利回り5%・30年で約2,496万円、月5万円なら約4,161万円、月10万円なら約8,322万円が目安です。早く始めるほど複利の恩恵が大きく、10年の差が資産額を数百万〜1,000万円以上変えることがあります。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      FIREとNISAの組み合わせ
    </h3>
    <p>
      NISAで積み上げた資産はFIRE（早期退職）の原資にもなります。
      <Link href="/tools/fire-simulator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">FIREシミュレーター</Link>
      と組み合わせることで、「いつ仕事を辞められるか」を具体的に試算できます。
    </p>
    <p>
      積立額ごとの詳しいシミュレーション結果は
      <Link href="/blog/nisa-monthly-simulation" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">新NISAを毎月いくら積み立てると何年後にいくらになる？</Link>
      の記事でも確認できます。
    </p>
  </div>
);

export default function NisaCalculatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="新NISA積立計算"
        description="毎月の積立額と運用期間を入力するだけ。複利効果で将来いくらになるかを可視化します。"
        icon="📈"
        slug="nisa-calculator"
        seoContent={seoContent}
      >
        <NisaCalculator />
      </ToolLayout>
    </>
  );
}
