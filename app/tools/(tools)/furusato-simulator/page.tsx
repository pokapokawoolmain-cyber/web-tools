import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { FurusatoSimulator } from "./FurusatoSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "ふるさと納税シミュレーター【2026年版】年収別・家族構成別の控除上限額を無料で即計算",
  description: "年収と家族構成を選ぶだけでふるさと納税の控除上限額（限度額）を即計算。年収300万〜2000万の早見表付き。ワンストップ特例・確定申告の違いも解説。登録不要・完全無料。",
  path: "/tools/furusato-simulator",
  keywords: [
    "ふるさと納税 シミュレーション",
    "ふるさと納税 限度額",
    "ふるさと納税 控除上限額",
    "ふるさと納税 年収 計算",
    "ふるさと納税 いくら",
    "ふるさと納税 シミュレーター 2026",
    "ふるさと納税 上限 計算",
    "ふるさと納税 家族構成",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ふるさと納税の控除上限額はどうやって計算しますか？",
      acceptedAnswer: { "@type": "Answer", text: "住民税所得割額 × 20% ÷（1 − 0.1 − 所得税率 × 1.021）+ 2,000円で算出します。年収と家族構成から住民税所得割額が決まるため、上のシミュレーターで素早く計算できます。" },
    },
    {
      "@type": "Question",
      name: "ワンストップ特例と確定申告はどちらがお得ですか？",
      acceptedAnswer: { "@type": "Answer", text: "控除総額はどちらも同じです。寄附先が5自治体以内なら確定申告不要のワンストップ特例が便利です。6自治体以上への寄附や、医療費控除・住宅ローン控除などで確定申告が必要な場合は確定申告でまとめて申請します。" },
    },
    {
      "@type": "Question",
      name: "年収500万円（独身）の場合、いくらまで寄附できますか？",
      acceptedAnswer: { "@type": "Answer", text: "年収500万円・独身の場合、控除上限額の目安は約61,000円です。2,000円を超えた分（約59,000円）が所得税・住民税から控除されます。" },
    },
    {
      "@type": "Question",
      name: "上限を超えて寄附するとどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "控除上限額を超えた分は控除されず、実質的な自己負担になります。返礼品目的であれば上限内に収めるのが原則です。" },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除を使っている場合、ふるさと納税はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "住宅ローン控除によって住民税が大幅に減少している場合、ふるさと納税の控除上限額も下がります。住宅ローン控除が住民税から引ききれていない場合は、ふるさと納税との二重控除が難しくなります。" },
    },
  ],
};

// 年収別・家族構成別 控除上限額の目安（総務省公表・独身/配偶者のみ/配偶者+子1人）
const FURUSATO_TABLE = [
  { income: "200万円", single: "約15,000円", married: "—",        withChild: "—" },
  { income: "300万円", single: "約28,000円", married: "約19,000円", withChild: "—" },
  { income: "400万円", single: "約42,000円", married: "約33,000円", withChild: "約29,000円" },
  { income: "500万円", single: "約61,000円", married: "約49,000円", withChild: "約40,000円" },
  { income: "600万円", single: "約77,000円", married: "約69,000円", withChild: "約60,000円" },
  { income: "700万円", single: "約108,000円", married: "約86,000円", withChild: "約78,000円" },
  { income: "800万円", single: "約129,000円", married: "約120,000円", withChild: "約111,000円" },
  { income: "1,000万円", single: "約176,000円", married: "約166,000円", withChild: "約157,000円" },
  { income: "1,200万円", single: "約247,000円", married: "約237,000円", withChild: "約229,000円" },
  { income: "1,500万円", single: "約395,000円", married: "約395,000円", withChild: "約377,000円" },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ふるさと納税 年収別・家族構成別 控除上限額早見表（2026年版）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        下の早見表は独身・配偶者のみ（専業主婦）・配偶者＋子1人（高校生以下）の場合の目安です。社会保険料や各種控除の状況により実際の上限は異なるため、上のシミュレーターで個別に計算してください。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">独身・共働き</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">配偶者のみ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">配偶者＋子1人</th>
            </tr>
          </thead>
          <tbody>
            {FURUSATO_TABLE.map(({ income, single, married, withChild }, i) => (
              <tr key={income} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{single}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{married}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{withChild}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">
        ※ 給与所得者・社会保険料控除・基礎控除のみ適用の概算です。住宅ローン控除・医療費控除・iDeCoなどがある場合は上限額が変わります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ふるさと納税の仕組みと控除上限額の計算方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        ふるさと納税は、応援したい自治体に寄附することで、<strong className="text-slate-700 dark:text-zinc-300">寄附額から2,000円を差し引いた全額が所得税・住民税から控除</strong>される制度です。実質2,000円の自己負担で地域の返礼品が受け取れます。
      </p>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-3 text-sm font-mono">
        控除上限額 ＝ 住民税所得割額 × 20% ÷（1 − 0.1 − 所得税率 × 1.021）＋ 2,000円
      </div>
      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
        <li><strong className="text-slate-700 dark:text-zinc-300">住民税所得割額</strong>：課税所得 × 10%。家族構成の違いで課税所得が変わるため、上限額も変わります。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">上限を超えた寄附</strong>：超過分は控除されず実質的な持ち出しになります。早見表を参考に上限の90〜95%を目安に寄附するのが安全です。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ワンストップ特例 vs 確定申告</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">ワンストップ特例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">確定申告</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["申請方法", "自治体に申請書を郵送", "確定申告書に記載"],
              ["対応自治体数", "5自治体まで", "無制限"],
              ["控除の反映先", "住民税のみ", "所得税＋住民税"],
              ["控除総額", "同じ", "同じ"],
              ["こんな人向け", "会社員・副業なし・5自治体以内", "個人事業主・6自治体以上・医療費控除あり"],
            ].map(([item, oneStop, kakutei], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400">{oneStop}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{kakutei}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          {
            q: "控除上限額の計算に源泉徴収票は必要ですか？",
            a: "上のシミュレーターは年収と家族構成を入力するだけで概算が出ます。より正確な金額を知りたい場合は、源泉徴収票の「給与所得控除後の金額」と「所得控除の合計額」を使って計算すると精度が上がります。",
          },
          {
            q: "住宅ローン控除を使っている場合、上限はどう変わりますか？",
            a: "住宅ローン控除によって住民税が大幅に減少している場合、ふるさと納税の控除上限額も下がります。住宅ローン控除の住民税控除上限は「住民税所得割額の7%・最大136,500円」です。この上限に達している場合、ふるさと納税の効果が限定的になることがあります。",
          },
          {
            q: "iDeCoをやっている場合、上限はどうなりますか？",
            a: "iDeCoの掛金は全額所得控除になるため、課税所得が下がり、ふるさと納税の控除上限額がやや減少します。iDeCoの節税効果の方が大きい場合が多いので、両方を活用するのが一般的です。",
          },
          {
            q: "上限を超えて寄附したらどうなりますか？",
            a: "控除上限額を超えた分は税金から控除されず、全額自己負担になります。返礼品目当てであれば上限内に収めましょう。超えた分を「ふるさとへの純粋な寄附」として考える場合は問題ありません。",
          },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function FurusatoSimulatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ふるさと納税シミュレーター"
        description="年収と家族構成を選ぶだけで控除上限額（限度額）を即計算。年収別早見表・ワンストップ特例の解説付き。登録不要・完全無料。"
        icon="🎁"
        slug="furusato-simulator"
        seoContent={seoContent}
      >
        <FurusatoSimulator />
      </ToolLayout>
    </>
  );
}
