import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { FurusatoSimulator } from "./FurusatoSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { calcFurusatoLimit } from "@/lib/furusato";

export const metadata: Metadata = generateMeta({
  title: "ふるさと納税シミュレーター【2026年版】年収別・家族構成別の控除上限額を無料で即計算",
  description: "年収と家族構成を選ぶだけでふるさと納税の控除上限額（限度額）を即計算。年収300万〜2000万の早見表付き。ワンストップ特例・確定申告の違いも解説。登録不要・完全無料。",
  path: "/tools/furusato-simulator",
  ogImage: `/api/og?${new URLSearchParams({ title: "ふるさと納税シミュレーター", icon: "🎁", desc: "年収と家族構成を選ぶだけで控除上限額を即計算" }).toString()}`,
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
      acceptedAnswer: { "@type": "Answer", text: `年収500万円・独身の場合、控除上限額の目安は約${calcFurusatoLimit({ income: 5000000, hasSpouse: false, generalDependents: 0 }).limit.toLocaleString()}円です（2026年分の税制で計算）。2,000円を超えた分が所得税・住民税から控除されます。` },
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

// 年収別・家族構成別 控除上限額の目安。シミュレーターと同じ計算（lib/furusato.ts・令和8年分の税制）で生成する
const yen = (v: number) => (v > 0 ? `約${v.toLocaleString()}円` : "—");
const limitOf = (income: number, hasSpouse: boolean, generalDependents: number) =>
  calcFurusatoLimit({ income: income * 10000, hasSpouse, generalDependents }).limit;
const FURUSATO_TABLE = [200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1500].map((man) => ({
  income: `${man.toLocaleString()}万円`,
  single: yen(limitOf(man, false, 0)),
  married: yen(limitOf(man, true, 0)),
  withChild: yen(limitOf(man, true, 1)),
}));
// 共働き夫婦（それぞれ会社員・扶養なし）の上限額
const COUPLE_TABLE = [
  [400, 300], [500, 300], [500, 500], [600, 400], [700, 500], [800, 600], [1000, 600],
].map(([a, b]) => ({ a, b, la: limitOf(a, false, 0), lb: limitOf(b, false, 0) }));


const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ふるさと納税 年収別・家族構成別 控除上限額早見表（2026年版）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        下の早見表は独身・配偶者のみ（専業主婦）・配偶者＋子1人（高校生）の場合の目安で、上のシミュレーターと同じ計算式で出しています。2026年分は所得税の基礎控除が引き上げられ、所得税率が下がる年収帯では総務省の目安表（旧税制ベース）より上限額がやや低くなります。中学生以下の子は扶養控除の対象外のため、上限額は子なしと同じです。社会保険料や各種控除の状況により実際の上限は異なるため、上のシミュレーターで個別に計算してください。
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
        ※ 給与所得者・社会保険料控除・基礎控除・配偶者控除・扶養控除のみ適用の概算です（所得税は2026年分、住民税は同じ所得にかかる2027年度分）。住宅ローン控除・医療費控除・iDeCoなどがある場合は上限額が変わります。
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
        <li><strong className="text-slate-700 dark:text-zinc-300">住民税所得割額</strong>：住民税の課税所得 × 10% − 調整控除。住民税の課税所得は所得税と別に、住民税の基礎控除43万円などを引いて求めます。家族構成の違いで課税所得が変わるため、上限額も変わります。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">上限を超えた寄附</strong>：超過分は控除されず実質的な持ち出しになります。早見表を参考に上限の90〜95%を目安に寄附するのが安全です。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ふるさと納税の手順（5ステップ）</h2>
      <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-3 list-decimal list-inside">
        <li><strong className="text-slate-700 dark:text-zinc-300">控除上限額を確認する</strong>：上のシミュレーターで年収・家族構成から目安を出します。上限を超えた分は自己負担になります。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">寄附先と返礼品を選ぶ</strong>：ふるさと納税のポータルサイトや自治体のサイトから選びます。複数の自治体に分けて寄附できます（ワンストップ特例は5自治体まで）。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">12月31日までに寄附を完了する</strong>：その年の控除にするには、年内に決済まで終える必要があります。年末は混み合うため余裕をもって手続きします。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">ワンストップ特例の申請（会社員など・確定申告をしない人）</strong>：寄附した自治体ごとに申請書とマイナンバー確認書類を<strong className="text-slate-700 dark:text-zinc-300">翌年1月10日（必着）</strong>までに提出します。間に合わなかった場合や6自治体以上に寄附した場合は確定申告をします。</li>
        <li><strong className="text-slate-700 dark:text-zinc-300">翌年6月以降に住民税が安くなる</strong>：ワンストップ特例なら翌年6月から翌々年5月の住民税が減ります。住民税決定通知書で控除額を確認できます。</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">共働き夫婦の上限額（年収別）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">共働きの場合は、夫婦それぞれが自分の年収で上限額を計算し、それぞれの名義で寄附します。2人分を合算した金額を1人の名義で寄附しても、控除は寄附した人の上限までです。</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">夫の年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">妻の年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">夫の上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">妻の上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">世帯の合計</th>
            </tr>
          </thead>
          <tbody>
            {COUPLE_TABLE.map((r, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{r.a}万円</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{r.b}万円</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{yen(r.la)}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{yen(r.lb)}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{yen(r.la + r.lb)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">※ 夫婦ともに会社員・扶養なしとして計算した目安です。子どもを扶養に入れている側は上限が下がります。</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">上限額が下がるケースと、上限を超えたとき</h2>
      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
        <li>・<strong className="text-slate-700 dark:text-zinc-300">iDeCo に加入している</strong>：掛金が所得控除になり課税所得が下がるため、上限も下がります。</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">住宅ローン控除を受けている</strong>：住民税から引ききれない分があると、ふるさと納税で控除できる住民税が減ります。</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">医療費控除などを確定申告する</strong>：所得が下がる分、上限も下がります。</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">副業・不動産などの所得がある</strong>：所得が増える分、上限は上がります。給与だけの前提のこの計算より高くなるため、確定申告の数字で確認してください。</li>
      </ul>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">上限を超えた分は控除されず、そのまま自己負担になります。例えば上限10万円の人が15万円を寄附すると、自己負担は2,000円ではなく約5万2,000円です。迷ったら上限の8〜9割にとどめるのが安全です。</p>
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
