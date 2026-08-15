import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { BmiCalculator } from "./BmiCalculator";

export const metadata: Metadata = generateMeta({
  title: "BMI計算【無料】身長と体重で肥満度と標準体重をすぐ判定",
  description:
    "身長と体重を入れるだけでBMI（体格指数）と肥満度を自動判定。日本肥満学会の基準による区分、BMI22の標準体重、普通体重の範囲も表示します。ダイエットや健康管理の目安に。登録不要・スマホ対応・無料。",
  path: "/tools/bmi-calculator",
  keywords: [
    "bmi 計算",
    "bmi 計算 男性 女性",
    "肥満度 計算",
    "標準体重 計算",
    "適正体重 計算",
    "bmi 標準",
    "bmi 25 以上",
    "体格指数 計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "BMI計算", icon: "⚖️", desc: "身長と体重で肥満度と標準体重を判定" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "BMIはどうやって計算しますか？", acceptedAnswer: { "@type": "Answer", text: "BMI ＝ 体重(kg) ÷ 身長(m) ÷ 身長(m) で求めます。例えば身長170cm・体重65kgなら、65 ÷ 1.7 ÷ 1.7 ＝ 約22.5 です。このツールに身長と体重を入れると自動で計算します。" } },
    { "@type": "Question", name: "BMIはいくつが標準（普通体重）ですか？", acceptedAnswer: { "@type": "Answer", text: "日本肥満学会の基準では、BMI18.5以上25未満が「普通体重」です。18.5未満は低体重、25以上は肥満と判定されます。最も病気になりにくいとされるのはBMI22で、これを標準体重の基準に使います。" } },
    { "@type": "Question", name: "男性と女性でBMIの基準は違いますか？", acceptedAnswer: { "@type": "Answer", text: "BMIの判定基準（18.5・25など）は男女共通です。ただし同じBMIでも体脂肪率や筋肉量は個人差が大きいため、数値はあくまで目安として捉えてください。" } },
    { "@type": "Question", name: "BMIが標準でも安心してよいですか？", acceptedAnswer: { "@type": "Answer", text: "BMIは身長と体重だけの指標で、体脂肪の量や付き方（内臓脂肪など）は反映されません。BMIが標準でも体脂肪が多い「隠れ肥満」もあります。腹囲や体組成計もあわせて確認し、気になる場合は医療機関にご相談ください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">BMIとは</h2>
      <p>
        BMI（Body Mass Index・体格指数）は、身長と体重から算出する<strong>肥満度の国際的な指標</strong>です。
        計算式は <strong>BMI ＝ 体重(kg) ÷ 身長(m)²</strong>。手軽に求められるため、健康診断やダイエットの目安として世界中で使われています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">BMIの判定基準（日本肥満学会）</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">BMI</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">判定</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["18.5未満", "低体重（やせ）"],
              ["18.5〜25未満", "普通体重"],
              ["25〜30未満", "肥満（1度）"],
              ["30〜35未満", "肥満（2度）"],
              ["35〜40未満", "肥満（3度）"],
              ["40以上", "肥満（4度）"],
            ].map(([b, j], i) => (
              <tr key={b as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold">{b}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{j}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        WHO（世界保健機関）では25以上を「過体重」、30以上を「肥満」としており、日本の基準はやや厳しめです。これは日本人が欧米人よりも低いBMIで生活習慣病を発症しやすいためとされています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">標準体重と適正体重</h2>
      <p>
        統計的に最も病気になりにくいとされるのが<strong>BMI22</strong>で、これを基準にした体重を「標準体重」と呼びます。
        標準体重 ＝ 身長(m)² × 22 で計算できます。18.5〜25未満に収まる範囲が「普通体重」で、この中であれば大きな問題は少ないと考えられています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">BMIを使うときの注意点</h2>
      <ul className="space-y-1.5">
        <li>・<strong>筋肉量は反映されない：</strong>アスリートは筋肉が重いためBMIが高く出ますが、肥満とは限りません。</li>
        <li>・<strong>体脂肪の付き方は分からない：</strong>内臓脂肪が多い「隠れ肥満」はBMIでは見抜けません。腹囲もあわせて確認を。</li>
        <li>・<strong>子ども・高齢者・妊娠中は当てはまらない：</strong>成長期や妊娠中は別の基準で評価します。</li>
        <li>・<strong>急激な減量は避ける：</strong>健康的な減量ペースは1か月に体重の5%以内が目安とされます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・割合や増減を計算する <Link href="/tools/percentage-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">パーセント計算機</Link></li>
        <li>・年齢を計算する <Link href="/tools/age-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">年齢計算</Link></li>
      </ul>
    </section>

    <p className="text-[12px] text-slate-400 dark:text-zinc-500 leading-relaxed">
      ※ 本ツールの判定は日本肥満学会の基準に基づく一般的な目安です。健康状態の評価や減量方針については、医師・管理栄養士などの専門家にご相談ください。
    </p>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="BMI計算"
        description="身長と体重からBMIと肥満度を判定。日本肥満学会の区分、BMI22の標準体重、普通体重の範囲も表示。健康管理の目安に。"
        icon="⚖️"
        slug="bmi-calculator"
        seoContent={seoContent}
      >
        <BmiCalculator />
      </ToolLayout>
    </>
  );
}
