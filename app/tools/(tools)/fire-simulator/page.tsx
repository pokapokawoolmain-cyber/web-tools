// ========================================
// FIREシミュレーターページ
// SEO: "FIRE シミュレーター" "FIRE 計算" で上位狙い
// ========================================
import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { FireSimulator } from "./FireSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "FIREシミュレーター【無料・2026年版】必要資産額・達成年数を4%ルールで計算",
  description: "現在の資産・毎月の積立・年間生活費を入力するだけでFIRE達成年数と必要資産額を計算。4%ルールによる早期退職シミュレーション。年間生活費300万→7,500万円、400万→1億円の早見表付き。完全無料。",
  path: "/tools/fire-simulator",
  keywords: [
    "FIRE シミュレーション",
    "FIRE 必要資産額 計算",
    "早期退職 計算",
    "4%ルール 計算",
    "FIRE 何年 計算",
    "セミリタイア 資産 計算",
    "経済的自由 シミュレーター",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "FIREに必要な資産額の計算方法は？",
      acceptedAnswer: { "@type": "Answer", text: "年間生活費 ÷ 4%（0.04）が基本の計算式です。年間生活費が300万円なら7,500万円、400万円なら1億円が目安です。このシミュレーターに現在の資産額・積立額・生活費を入力することで、達成までの年数を自動計算できます。" },
    },
    {
      "@type": "Question",
      name: "4%ルールは日本でも使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "参考程度には使えますが、4%ルールは米国株を前提とした研究です。日本では税制・社会保険料・物価変動を考慮し、3〜3.5%で計算するほうが安全とされています。" },
    },
    {
      "@type": "Question",
      name: "FIRE後も運用しながら生活費を取り崩すイメージは？",
      acceptedAnswer: { "@type": "Answer", text: "例えば資産8,000万円・運用利回り4%の場合、年間320万円を取り崩し続けても元本が維持できる計算になります。ただし運用成績は変動するため、生活費を抑えてバッファを持つことが重要です。" },
    },
    {
      "@type": "Question",
      name: "セミFIREと完全FIREの違いは？",
      acceptedAnswer: { "@type": "Answer", text: "完全FIREは仕事を完全に辞めて資産だけで生活する状態です。セミFIREは副業・パートなど小さな収入を維持しながら生活費の一部を補う形で、必要資産額を大幅に減らせます。" },
    },
    {
      "@type": "Question",
      name: "このシミュレーターは無料で使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "完全無料・登録不要でご利用いただけます。ブラウザ上で動作するため、アプリのインストールも不要です。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      FIREシミュレーターの使い方
    </h2>
    <p>
      FIREとは「Financial Independence, Retire Early（経済的自立と早期退職）」の略です。本ツールでは、現在の資産額・毎月の積立金額・年間生活費・運用利回りを入力するだけで、FIRE達成までの年数と必要資産額を計算できます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      4%ルールとは？
    </h3>
    <p>
      「年間生活費の25倍の資産があれば、毎年4%ずつ取り崩しても資産が尽きない」という米国のトリニティ研究をもとにした考え方です。例えば年間生活費が300万円なら7,500万円、400万円なら1億円がFIREの目安です。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      必要資産額の早見表（生活費×取り崩し率）
    </h3>
    <p>生活費と取り崩し率の組み合わせで、必要資産額は大きく変わります。</p>
    <div className="overflow-x-auto not-prose my-3">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年間生活費</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">取り崩し率3.5%</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">取り崩し率4.0%</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">取り崩し率4.5%</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["200万円（月17万円）", "約5,700万円", "約5,000万円", "約4,400万円"],
            ["240万円（月20万円）", "約6,900万円", "約6,000万円", "約5,300万円"],
            ["300万円（月25万円）", "約8,600万円", "約7,500万円", "約6,700万円"],
            ["360万円（月30万円）", "約1.03億円", "約9,000万円", "約8,000万円"],
            ["400万円（月33万円）", "約1.14億円", "約1.0億円", "約8,900万円"],
            ["480万円（月40万円）", "約1.37億円", "約1.2億円", "約1.07億円"],
          ].map(([expenses, r35, r40, r45], i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-[13px]">{expenses}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{r35}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium text-[13px]">{r40}</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{r45}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-[12px] text-slate-500 dark:text-zinc-500">
      ※ 4%ルールは米国のトリニティ研究をもとにした目安です。日本では物価・税制を考慮して3.5%で計算することを推奨する専門家もいます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      新NISAとFIREの組み合わせ
    </h3>
    <p>
      FIRE達成後の資産取り崩しを少しでも遅らせるには、現役時代から新NISAを最大活用して非課税で資産を増やすことが有効です。
      <Link href="/tools/nisa-calculator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">新NISA積立計算ツール</Link>
      で毎月の積立がどれだけ増えるか確認しながら、FIREプランを立てましょう。
    </p>
    <p>
      FIREの考え方や年収・生活費別のシミュレーション結果を詳しく知りたい方は
      <Link href="/blog/fire-how-much-needed" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">FIREに必要な資産はいくら？</Link>
      の記事も参考にしてください。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      注意点
    </h3>
    <p>
      本シミュレーターは参考値です。実際の運用成績は変動し、インフレや税金の影響を受けます。投資判断は自己責任でお願いします。
    </p>
  </div>
);

export default function FireSimulatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="FIREシミュレーター"
        description="現在の資産・積立額・生活費を入力するだけ。FIRE達成年数と必要資産額を即計算します。"
        icon="🔥"
        slug="fire-simulator"
        seoContent={seoContent}
      >
        <FireSimulator />
      </ToolLayout>
    </>
  );
}
