import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { calcBonusTakehome, SOCIAL_INSURANCE_RATES as R, SOCIAL_INSURANCE_YEAR_LABEL } from "@/lib/takehome";
import { BonusTakehome } from "./BonusTakehome";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "ボーナス手取り計算【2026年冬】賞与の計算方法と税金・社会保険料を自動計算",
  description:
    "賞与額と前月の給与を入力するだけでボーナスの手取り額を自動計算。健康保険・厚生年金・雇用保険・源泉所得税の内訳、賞与額別の手取り早見表つき。無料・登録不要・スマホ対応。",
  path: "/tools/bonus-takehome",
  keywords: [
    "ボーナス 手取り 計算", "賞与 手取り", "ボーナス 100万 手取り", "賞与 税金 計算",
    "ボーナス 手取り 計算 ツール", "夏 ボーナス 手取り", "賞与 社会保険料 計算",
    "ボーナス 所得税 計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "ボーナス手取り計算", icon: "💰", desc: "賞与から引かれる税金・社会保険料を自動計算。" }).toString()}`,
});

const fmtManTenth = (yen: number) => `約${(Math.round(yen / 1000) / 10).toFixed(1)}万円`;

// 賞与額別の手取り早見表（前月給与30万円・扶養0人・40歳未満、calcBonusTakehome から自動算出 = ツールと常に一致）
const BONUS_MAN = [30, 40, 50, 60, 70, 80, 100, 150];
const PREV_SALARY = 300000;
const TABLE = BONUS_MAN.map((man) => {
  const r = calcBonusTakehome(man * 10000, PREV_SALARY, 0, false);
  return {
    man,
    net: fmtManTenth(r.net),
    deduction: fmtManTenth(man * 10000 - r.net),
    rate: r.netRate,
  };
});

const net100 = calcBonusTakehome(1000000, PREV_SALARY, 0, false);

// 計算方法の例（賞与50万円・前月給与30万円・扶養0人・40歳未満）。calcBonusTakehome の結果をそのまま表示するので、ツールと常に一致する
const EX_BONUS = 500000;
const ex = calcBonusTakehome(EX_BONUS, PREV_SALARY, 0, false);
const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
const pct = (r: number) => `${Math.round(r * 100000) / 1000}%`;
const EX_STEPS: { label: string; formula: string; value: string }[] = [
  { label: "1. 標準賞与額", formula: "賞与額の1,000円未満を切り捨て", value: yen(Math.floor(EX_BONUS / 1000) * 1000) },
  { label: "2. 健康保険料", formula: `標準賞与額 × ${pct(R.health)}`, value: yen(ex.healthInsurance) },
  { label: "3. 子ども・子育て支援金", formula: `標準賞与額 × ${pct(R.childSupport)}`, value: yen(ex.childSupport) },
  { label: "4. 厚生年金保険料", formula: `標準賞与額 × ${pct(R.pension)}`, value: yen(ex.pension) },
  { label: "5. 雇用保険料", formula: `賞与額 × ${pct(R.employment)}`, value: yen(ex.employmentInsurance) },
  { label: "6. 社会保険料の合計", formula: "2〜5の合計", value: yen(ex.socialInsurance) },
  { label: "7. 源泉所得税", formula: `（賞与額 − 社会保険料）× ${ex.taxRate}%`, value: yen(ex.incomeTax) },
  { label: "8. 手取り", formula: "賞与額 − 社会保険料 − 源泉所得税", value: yen(ex.net) },
];

// 解説ブロック共通: 小見出しラベル＋白カード（ツール本体と同じ視覚言語）
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">{label}</p>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "ボーナス100万円の手取りはいくらですか？", acceptedAnswer: { "@type": "Answer", text: `前月の給与（社会保険料控除後）30万円・扶養0人・40歳未満の場合、賞与100万円の手取りは${fmtManTenth(net100.net)}（手取り率約${Math.round(net100.netRate)}%）です。社会保険料と源泉所得税が差し引かれます。前月給与や扶養人数によって変わるため、本ツールでご自身の条件で計算できます。` } },
    { "@type": "Question", name: "ボーナスの税金はなぜ高く感じるのですか？", acceptedAnswer: { "@type": "Answer", text: "賞与の源泉徴収税率は「前月の給与額」をもとに決まるため、月給が高い人ほど高い税率が適用されます。また金額が大きいぶん引かれる額も大きく見えますが、税率自体は月給とほぼ同水準で、払いすぎた分は年末調整で精算されます。" } },
    { "@type": "Question", name: "ボーナスから住民税は引かれますか？", acceptedAnswer: { "@type": "Answer", text: "住民税はボーナスからは天引きされません。住民税は前年の所得（賞与含む）をもとに計算され、毎月の給与から12回に分けて徴収されます。ボーナスから引かれるのは社会保険料と源泉所得税のみです。" } },
    { "@type": "Question", name: "ボーナスの手取りの計算方法は？", acceptedAnswer: { "@type": "Answer", text: "手取り＝賞与額−社会保険料−源泉所得税です。社会保険料は標準賞与額（1,000円未満切捨て）に健康保険・厚生年金・雇用保険の料率を掛けて計算し、源泉所得税は社会保険料控除後の賞与額に、前月給与と扶養人数で決まる税率（国税庁の算出率表）を掛けて計算します。" } },
    { "@type": "Question", name: "ボーナスが年2回の場合はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "夏・冬それぞれの賞与額と、支給前月の給与額で個別に計算してください。社会保険料は支給ごとに標準賞与額で計算されます（健康保険は年度累計573万円が上限）。年2回の合計手取りは、各回の計算結果を足し合わせれば求められます。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="bonus-takehome" title="ボーナス手取り計算" description="賞与額と前月の給与を入力するだけでボーナスの手取り額を自動計算。健康保険・厚生年金・雇用保険・源泉所得税の内訳も確認。" />
      <JsonLd data={faqSchema} />
      <BonusTakehome />

      {/* ── 解説（ツール本体と同じ slate 背景・白カードで一体化）─────── */}
      <div className="bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pb-20 space-y-6">

          <Block label="ボーナス手取り早見表">
            <p className="mb-4">前月の給与（社会保険料控除後）30万円・扶養0人・40歳未満で計算した、賞与額別の手取りの目安です。ツール本体と同じ計算式で算出しています。</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                    <th className="text-left font-medium py-2 px-1">賞与額</th>
                    <th className="text-right font-medium py-2 px-1">手取り</th>
                    <th className="text-right font-medium py-2 px-1">引かれる額</th>
                    <th className="text-right font-medium py-2 px-1">手取り率</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.man} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0">
                      <td className="py-2.5 px-1 font-medium text-slate-800 dark:text-zinc-200">{row.man}万円</td>
                      <td className="py-2.5 px-1 text-right font-medium text-slate-800 dark:text-zinc-200">{row.net}</td>
                      <td className="py-2.5 px-1 text-right text-red-500">{row.deduction}</td>
                      <td className="py-2.5 px-1 text-right text-slate-400 dark:text-zinc-500">約{row.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 前月給与や扶養人数が異なると源泉所得税率が変わります。上のツールでご自身の条件に合わせて計算してください。
            </p>
          </Block>

          <Block label="ボーナス手取りの計算方法（計算例）">
            <p className="mb-4">賞与50万円・前月の給与（社会保険料控除後）30万円・扶養0人・40歳未満の場合の計算の手順です。数字はツール本体と同じ計算で出しています。</p>
            <ol className="space-y-2.5">
              {EX_STEPS.map((s) => (
                <li key={s.label} className="flex items-start justify-between gap-3 border-b border-slate-50 dark:border-zinc-800/50 last:border-0 pb-2.5 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-zinc-300">{s.label}</p>
                    <p className="text-[12px] text-slate-400 dark:text-zinc-500">{s.formula}</p>
                  </div>
                  <p className="font-medium text-slate-800 dark:text-zinc-200 whitespace-nowrap">{s.value}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 源泉所得税の税率（{ex.taxRate}%）は、前月の給与と扶養親族の数から国税庁「賞与に対する源泉徴収税額の算出率の表」で決まります。前月の給与が上がると税率も上がることがあります。保険料率は協会けんぽ東京支部・{SOCIAL_INSURANCE_YEAR_LABEL}の本人負担の目安です。
            </p>
          </Block>

          <Block label="ボーナスの手取りはなぜ少ない？">
            <p className="mb-3">
              ボーナス（賞与）からは<strong className="text-slate-800 dark:text-zinc-200">社会保険料</strong>と<strong className="text-slate-800 dark:text-zinc-200">源泉所得税</strong>が差し引かれ、手取りは額面のおおよそ<strong className="text-slate-800 dark:text-zinc-200">75〜85%</strong>になります。
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-[13px] font-medium text-slate-800 dark:text-zinc-200 mb-4">
              手取り ＝ 賞与額 −（社会保険料 ＋ 源泉所得税）
            </div>
            <ul className="space-y-2.5">
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">社会保険料</span>：標準賞与額（賞与額の1,000円未満切捨て）に、健康保険 4.925%・子ども・子育て支援金 0.115%・厚生年金 9.15%・雇用保険 0.5%（協会けんぽ東京支部・令和8年度・本人負担の目安）を掛けた合計。40〜64歳は介護保険 0.81%が加わります。子ども・子育て支援金は2026年4月分から始まった新しい負担で、賞与にもかかります。
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">源泉所得税</span>：社会保険料を引いた後の賞与額に、<strong className="text-slate-800 dark:text-zinc-200">前月の給与額（社会保険料控除後）と扶養親族の数</strong>で決まる税率（0〜45.945%）を掛けて計算します。国税庁「賞与に対する源泉徴収税額の算出率の表」に基づく仕組みで、月給が高い人ほど賞与の税率も高くなります。
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">住民税は引かれない</span>：住民税は前年の所得をもとに毎月の給与から天引きされるため、ボーナスからは引かれません。そのぶん毎月の給与の手取り率よりボーナスの手取り率はやや高めになります。
              </li>
            </ul>
            <p className="mt-4">
              源泉所得税はあくまで「仮払い」で、取りすぎ・不足分は<strong className="text-slate-800 dark:text-zinc-200">年末調整</strong>で精算されます。前月の給与がたまたま高かった月の翌月に賞与が出ると税率が高くなりますが、最終的な年間の所得税額は変わりません。
            </p>
          </Block>

          <Block label="年間の手取りも確認する">
            <p>
              ボーナスを含めた年収ベースの手取りは
              <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">手取り計算ツール</Link>
              で、欲しい手取りから必要な年収を逆算したい場合は
              <Link href="/tools/takehome-reverse" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">手取り逆算シミュレーター</Link>
              で確認できます。
            </p>
          </Block>

          <Block label="よくある質問">
            <dl className="space-y-4">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name}>
                  <dt className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">{item.name}</dt>
                  <dd>{item.acceptedAnswer.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 本ツールの計算は概算です。健康保険の料率は都道府県・健康保険組合により異なり、源泉所得税率の区分（扶養1〜3人の一部）は国税庁の算出率表に基づく概算値を用いています。計算はすべてブラウザ内で完結し、入力データが外部へ送信されることはありません。
            </p>
          </Block>

          <RelatedTools toolId="bonus-takehome" />
          <RelatedArticles toolId="bonus-takehome" />
        </div>
      </div>
    </>
  );
}
