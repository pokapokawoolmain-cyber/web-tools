import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { calcSocialInsuranceBreakdown, calcTakehome } from "@/lib/takehome";

const post = getBlogPost("shakai-hoken-guide")!;

// 年収別の社会保険料（40歳未満・本人負担）。lib/takehome の計算（令和8年度の料率）から自動算出し、手取り計算ツールと常に一致させる
const man = (yen: number) => `約${Math.round(yen / 10000)}万円`;
const SI_TABLE = [300, 400, 500, 600, 700, 800, 1000].map((m) => {
  const b = calcSocialInsuranceBreakdown(m * 10000);
  return [`${m}万円`, man(b.health), man(b.pension), man(b.total)];
});
const tk = (m: number) => calcTakehome(m * 10000);
const takehomeFaq = `目安は年収400万円で${man(tk(400).annualNet)}（月${(Math.round(tk(400).monthlyNet / 1000) / 10).toFixed(1)}万円）、年収500万円で${man(tk(500).annualNet)}、年収600万円で${man(tk(600).annualNet)}です（独身・2026年分の税制と令和8年度の保険料率による概算）。`;

export const metadata: Metadata = generateMeta({
  title: "社会保険料はいくら？月収別早見表＆自動計算ツール【2026年度】給与から引かれる額がすぐわかる",
  description: "社会保険料は給与の約14〜15%。月収30万円なら約4.4万円が引かれ、年収400万なら月の手取り約26.5万円。月収別早見表と自動計算ツールで、あなたの給与から引かれる額と手取りが今すぐわかります。",
  path: `/blog/${post.slug}`,
  keywords: ["社会保険料 計算方法 わかりやすく", "社会保険料 年収400万", "標準報酬月額 計算 例", "社会保険料 130万の壁 2026", "健康保険 厚生年金 いくら引かれる"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "社会保険料は給料からいくら引かれますか？",
      acceptedAnswer: { "@type": "Answer", text: "会社員の場合、給与の約14〜15%が社会保険料（健康保険・厚生年金・雇用保険・介護保険）として控除されます。例えば月収30万円なら約4〜4.5万円が社会保険料として引かれます。会社が同額を負担しており、合計では月収の約28〜30%に相当します。" },
    },
    {
      "@type": "Question",
      name: "社会保険料の130万円の壁とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収130万円以上になると、配偶者の扶養から外れて自分で社会保険に加入（または国民健康保険に加入）する必要が生じます。これにより年間20〜30万円程度の負担増になるため、「130万円の壁」と呼ばれています。2022年からは年収106万円以上でも一定条件を満たすと扶養が外れる「106万円の壁」も存在します。" },
    },
    {
      "@type": "Question",
      name: "標準報酬月額とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "標準報酬月額とは、社会保険料の計算に使われる給与の基準額です。実際の月給を一定の等級（1〜50等級）に当てはめ、その等級に対応した保険料率をかけて社会保険料を計算します。毎年4〜6月の給与を平均した「定時決定」で見直されます。" },
    },
    {
      "@type": "Question",
      name: "年収別の手取りはいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: `社会保険料と税金を引いた手取りの${takehomeFaq}年収200万〜1500万円の詳しい金額は当サイトの「手取り早見表（/salary）」で確認できます。` },
    },
    {
      "@type": "Question",
      name: "フリーランス（個人事業主）の社会保険料はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "フリーランスは国民健康保険と国民年金に加入します。国民年金は令和8年度で月17,920円（年間約21.5万円）の定額です。国民健康保険は前年の所得に応じて変わり、年収400万円では年間40〜50万円程度になることが多いです。会社員と比べて国民年金は手取り額が低いため、iDeCoで補うのが一般的な節税策です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収400万円の社会保険料は約<strong>58〜60万円</strong>。健康保険・厚生年金・雇用保険の3種類で構成され、手取りに最も大きな影響を与えます。計算方法・標準報酬月額の仕組み・130万円の壁まで解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">あなたの社会保険料と手取りを自動計算ツールで今すぐ確認</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力するだけで、社会保険料・所得税・住民税をすべて含めた手取り額がその場でわかります。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          自動計算ツールで今すぐ確認（無料）→
        </Link>
      </div>

      <h2>社会保険料の種類と計算方法</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">保険料率（労働者負担）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">計算方法</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["健康保険料", "約4.9%（協会けんぽ東京 9.85% の半分。組合により異なる）", "標準報酬月額 × 保険料率 ÷ 2"],
              ["子ども・子育て支援金", "0.115%（2026年4月分から）", "標準報酬月額 × 0.23% ÷ 2"],
              ["厚生年金保険料", "9.15%", "標準報酬月額 × 18.3% ÷ 2"],
              ["雇用保険料", "0.5%（2026年度・一般の事業）", "月給（賞与含む） × 0.5%"],
              ["介護保険料（40〜64歳）", "0.81%（協会けんぽ 1.62% の半分）", "標準報酬月額 × 保険料率 ÷ 2"],
            ].map(([type, rate, method], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400 text-xs">{method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※料率は2026年度（令和8年度）のものです。健康保険料率は加入する健康保険によって異なります（協会けんぽ東京支部：9.85%、組合健保は独自の料率）。子ども・子育て支援金は2026年4月分から健康保険料と一緒に徴収されています。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>標準報酬月額とは</h2>
      <p>
        社会保険料は実際の給与ではなく「<strong>標準報酬月額</strong>」をもとに計算されます。月給（通勤手当含む）を1〜32等級に区分した金額です。
      </p>
      <ul className="space-y-2">
        <li><strong>定時決定</strong>：毎年4〜6月の平均給与をもとに9月から翌年8月の保険料が決まる</li>
        <li><strong>随時改定</strong>：昇給・降給などで月給が2等級以上変わった場合に改定される</li>
        <li>通勤手当・残業代・住宅手当なども月給に含めて計算するため、残業が多い月は保険料が上がる場合がある</li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 my-6 border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">具体例：月収30万円（39歳・協会けんぽ東京・2026年度）の社会保険料を計算してみる</strong>
        <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-3">標準報酬月額30万円のケースを、実際の料率で1つずつ計算すると次のようになります（いずれも労働者負担分）。</p>
        <ul className="space-y-1.5 text-[14px]">
          <li><strong>健康保険料</strong>：30万円 × 9.85% ÷ 2 ＝ <strong>14,775円</strong>／月</li>
          <li><strong>子ども・子育て支援金</strong>：30万円 × 0.23% ÷ 2 ＝ <strong>345円</strong>／月</li>
          <li><strong>厚生年金保険料</strong>：30万円 × 18.3% ÷ 2 ＝ <strong>27,450円</strong>／月</li>
          <li><strong>雇用保険料</strong>：30万円 × 0.5% ＝ <strong>1,500円</strong>／月</li>
          <li className="pt-1.5 border-t border-amber-200 dark:border-amber-800"><strong>合計</strong>：月 約<strong className="text-amber-700 dark:text-amber-400">44,070円</strong> → 年間 約<strong className="text-amber-700 dark:text-amber-400">53万円</strong></li>
        </ul>
        <p className="text-[13px] text-slate-500 dark:text-zinc-500 mt-3">※40〜64歳はこれに介護保険料（1.62%の折半＝0.81%）が加わり、月あたり2,430円増えます。賞与からも同じ料率で控除されます。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別・社会保険料早見表（会社員・40歳未満）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">健康保険料＋支援金（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">厚生年金（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">合計社会保険料</th>
            </tr>
          </thead>
          <tbody>
            {SI_TABLE.map(([income, health, pension, total], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{health}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pension}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※協会けんぽ東京都（2026年）・独身・雇用保険含む・40歳未満の概算。会社が同額を負担しているため、実際のコストは2倍です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>106万円の壁・130万円の壁とは</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収の壁</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">条件</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">超えると何が起きるか</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["106万円の壁（2026年10月撤廃）", "従来は従業員51人以上の会社・週20時間以上・月額賃金8.8万円以上で加入", "賃金要件（月8.8万円）は2026年10月1日に撤廃。従業員51人以上の勤務先では、週20時間以上働けば年収にかかわらず社会保険に加入"],
              ["130万円の壁", "配偶者の扶養に入っている場合", "扶養から外れ、自分で社会保険に加入する必要がある。年収130万円を少し超えると手取りが大幅減"],
              ["169万円の壁", "配偶者特別控除の満額ライン（2026年分・配偶者の給与収入）", "超えると配偶者特別控除（38万円）が段階的に減り、世帯の税負担が増え始める"],
            ].map(([wall, condition, result], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-bold text-orange-600 dark:text-orange-400">{wall}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs">{condition}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs">{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>社会保険料を節約できる？</h2>
      <p>
        社会保険料は法定の料率で決まるため、会社員が自分で保険料率を下げることはできません。ただし以下のポイントで影響を最小化できます。
      </p>
      <ul className="space-y-2">
        <li><strong>4〜6月の残業を減らす</strong>：定時決定は4〜6月の月給平均で決まるため、この期間の残業代が少ないと年間の社会保険料が下がる場合がある</li>
        <li><strong>iDeCo加入</strong>：社会保険料は減らせないが、iDeCoの掛金が所得控除になり所得税・住民税を軽減できる</li>
        <li><strong>社会保険料控除の申告</strong>：年末調整で国民年金を別途支払っている場合は控除を漏れなく申告する</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事・ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/salary">年収別の手取り早見表（300〜1000万円・カテゴリ一覧）</Link></li>
        <li><Link href="/blog/jumin-zei-guide">住民税の計算方法【年収別早見表】</Link></li>
        <li><Link href="/salary">手取り早見表【2026年版・年収200万〜1500万円】</Link></li>
        <li><Link href="/salary#nenshu-500">年収500万円の手取りと税金の内訳（手取り早見表）</Link></li>
        <li><Link href="/salary#nenshu-400">年収400万円の手取りと税金の内訳（手取り早見表）</Link></li>
        <li><Link href="/tools/net-income">手取り計算ツール（社会保険料込みで即計算）</Link></li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある質問</h2>
      <dl className="space-y-4">
        {[
          { q: "社会保険料は給料からいくら引かれますか？", a: "給与の約14〜15%が社会保険料として引かれます。月収30万円なら約4〜4.5万円。会社も同額を負担しているため、合計では月収の約28〜30%に相当します。" },
          { q: "社会保険料の130万円の壁とは？", a: "年収130万円以上になると配偶者の扶養から外れ、自分で社会保険または国民健康保険に加入が必要になります。年間20〜30万円程度の負担増になります。" },
          { q: "標準報酬月額とはなんですか？", a: "社会保険料の計算に使う「基準となる給与額」です。実際の月給を50等級の区分に当てはめて計算します。毎年4〜6月の給与平均で決まります。" },
          { q: "年収別の手取りはいくらですか？", a: `${takehomeFaq}年収200〜1500万円の詳細は手取り早見表で確認できます。` },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
            <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
              <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{q}
            </dt>
            <dd className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
              <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{a}
            </dd>
          </div>
        ))}
      </dl>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は協会けんぽ東京都の2026年保険料率に基づく概算です。加入する健康保険組合・標準報酬月額等により実際の社会保険料は異なります。
      </div>
    </BlogLayout>
    </>
  );
}
