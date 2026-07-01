import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { NisaCalculator } from "./NisaCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { calcFutureValueMonthly } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "新NISA積立シミュレーション【2026年版】毎月3万・5万・10万を10年・20年・30年積み立てると？",
  description:
    "毎月の積立額・運用期間・利回りを入力するだけで将来の資産額を計算。月3万・5万・10万を10〜30年積み立てた場合の早見表つき。利回り3%・5%・7%別比較、新NISAの生涯1800万円枠の活用法も解説。無料・登録不要。",
  path: "/tools/nisa-calculator",
  keywords: [
    "新NISA 積立 計算", "nisa 積立 シミュレーション", "新nisa 毎月 いくら",
    "新NISA 20年後 シミュレーション", "積立NISA 複利計算", "新NISA 1800万 いくら",
    "新nisa シミュレーション 2026", "つみたて nisa 計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "新NISA積立シミュレーション", icon: "📈", desc: "毎月いくらで将来いくら？複利を可視化。" }).toString()}`,
});

// 積立早見表（年利5%・ツールと同一の複利関数で算出）
const NISA_TABLE = [30000, 50000, 100000].map((monthly) => ({
  monthly,
  rows: [10, 20, 30].map((years) => ({
    years,
    future: Math.round(calcFutureValueMonthly(monthly, 5, years) / 10000),
    principal: Math.round((monthly * 12 * years) / 10000),
  })),
}));

// 利回り別比較表（月5万円固定）
const RATE_TABLE = [3, 5, 7].map((rate) => ({
  rate,
  rows: [10, 20, 30].map((years) => ({
    years,
    future: Math.round(calcFutureValueMonthly(50000, rate, years) / 10000),
    principal: Math.round((50000 * 12 * years) / 10000),
  })),
}));

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
      毎月3万円を年利5%で20年積み立てると、元本720万円が約1,238万円になります。複利は「利息にも利息がつく」仕組みで、長期投資ほど効果が大きくなります。30年に延ばすと元本1,080万円が約2,507万円まで成長します。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      毎月いくらで将来いくら？積立シミュレーション早見表
    </h3>
    <p>年利5%で運用した場合の将来資産額の目安です（カッコ内は積み立てた元本）。本ツールと同じ計算式で算出しています。</p>
    <div className="overflow-x-auto not-prose my-3">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">毎月の積立額</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">10年後</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">20年後</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">30年後</th>
          </tr>
        </thead>
        <tbody>
          {NISA_TABLE.map(({ monthly, rows }, i) => (
            <tr key={monthly} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">月{monthly / 10000}万円</td>
              {rows.map((r) => (
                <td key={r.years} className="border border-slate-200 dark:border-zinc-700 px-3 py-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">約{r.future.toLocaleString()}万円</span>
                  <span className="block text-[11px] text-slate-400 dark:text-zinc-500">（元本{r.principal.toLocaleString()}万）</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p>
      月3万円・30年で約2,507万円、月5万円なら約4,179万円、月10万円なら約8,357万円が目安です。早く始めるほど複利の恩恵が大きく、10年の差が資産額を数百万〜1,000万円以上変えることがあります（年利は過去実績をもとにした仮定で、運用成果を保証するものではありません）。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      利回り別の比較：3%・5%・7%（月5万円の場合）
    </h3>
    <p>同じ月5万円でも、利回りによって将来の資産額は大きく変わります。インデックス投資の参考値として3%・5%・7%のシナリオを比較してください。</p>
    <div className="overflow-x-auto not-prose my-3">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-zinc-800">
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">想定利回り</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">10年後</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">20年後</th>
            <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">30年後</th>
          </tr>
        </thead>
        <tbody>
          {RATE_TABLE.map(({ rate, rows }, i) => (
            <tr key={rate} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
              <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">年利{rate}%</td>
              {rows.map((r) => (
                <td key={r.years} className="border border-slate-200 dark:border-zinc-700 px-3 py-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">約{r.future.toLocaleString()}万円</span>
                  <span className="block text-[11px] text-slate-400 dark:text-zinc-500">（元本{r.principal.toLocaleString()}万）</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-[12px] text-slate-500 dark:text-zinc-500">
      ※ 保守的シナリオは3%（債券・バランス型）、標準は5%（全世界株式インデックス相当）、楽観的シナリオは7%（米国株インデックス長期平均）が目安です。過去実績であり将来を保証するものではありません。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      新NISAの生涯1,800万円枠を使い切るには？
    </h3>
    <p>
      新NISAの生涯非課税投資枠は1,800万円（成長投資枠は1,200万円が上限）。月10万円で積み立てると15年で枠を使い切ります。月5万円なら30年、月3万円なら50年かかる計算です。
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
