import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("shakai-hoken-guide")!;

export const metadata: Metadata = generateMeta({
  title: "社会保険料の計算方法【2026年最新版】年収別早見表・標準報酬月額わかりやすく解説",
  description: "年収300〜1000万円の社会保険料を早見表で確認。年収400万なら年間約58万円。健康保険・厚生年金・雇用保険の計算方法、標準報酬月額の仕組み、106万・130万の壁、節約のポイントまでわかりやすく解説。",
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
      name: "フリーランス（個人事業主）の社会保険料はどうなりますか？",
      acceptedAnswer: { "@type": "Answer", text: "フリーランスは国民健康保険と国民年金に加入します。国民年金は2024年度で月16,980円（年間約20万円）定額です。国民健康保険は前年の所得に応じて変わり、年収400万円では年間40〜50万円程度になることが多いです。会社員と比べて国民年金は手取り額が低いため、iDeCoで補うのが一般的な節税策です。" },
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
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">社会保険料込みで正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して社会保険料・所得税・住民税をすべて含めた手取りを計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
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
              ["健康保険料", "約5%（組合により異なる）", "標準報酬月額 × 保険料率 ÷ 2"],
              ["厚生年金保険料", "9.15%", "標準報酬月額 × 18.3% ÷ 2"],
              ["雇用保険料", "0.6%", "月給（賞与含む） × 0.6%"],
              ["介護保険料（40歳以上）", "約0.9%", "標準報酬月額 × 保険料率 ÷ 2"],
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
        ※健康保険料率は加入する健康保険組合によって異なります（協会けんぽ東京都：約10%、大企業の組合健保はこれより低い場合あり）。
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
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">具体例：月収30万円（39歳・協会けんぽ東京）の社会保険料を計算してみる</strong>
        <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-3">標準報酬月額30万円のケースを、実際の料率で1つずつ計算すると次のようになります（いずれも労働者負担分）。</p>
        <ul className="space-y-1.5 text-[14px]">
          <li><strong>健康保険料</strong>：30万円 × 9.98% ÷ 2 ＝ 約<strong>14,970円</strong>／月</li>
          <li><strong>厚生年金保険料</strong>：30万円 × 18.3% ÷ 2 ＝ 約<strong>27,450円</strong>／月</li>
          <li><strong>雇用保険料</strong>：30万円 × 0.6% ＝ 約<strong>1,800円</strong>／月</li>
          <li className="pt-1.5 border-t border-amber-200 dark:border-amber-800"><strong>合計</strong>：月 約<strong className="text-amber-700 dark:text-amber-400">44,220円</strong> → 年間 約<strong className="text-amber-700 dark:text-amber-400">53万円</strong></li>
        </ul>
        <p className="text-[13px] text-slate-500 dark:text-zinc-500 mt-3">※40歳以上はこれに介護保険料（約0.9%・折半）が加わり、月あたり約1,350円増えます。賞与からも同じ料率で控除されます。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別・社会保険料早見表（会社員・40歳未満）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">健康保険料（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">厚生年金（年）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">合計社会保険料</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["300万円", "約15万円", "約27万円", "約43万円"],
              ["400万円", "約20万円", "約36万円", "約58万円"],
              ["500万円", "約25万円", "約45万円", "約74万円"],
              ["600万円", "約30万円", "約54万円", "約88万円"],
              ["700万円", "約35万円", "約60万円", "約99万円"],
              ["800万円", "約39万円", "約66万円", "約108万円"],
              ["1000万円", "約46万円", "約70万円", "約120万円"],
            ].map(([income, health, pension, total], i) => (
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
              ["106万円の壁", "従業員51人以上の会社・週20時間以上勤務・月額賃金8.8万円以上", "社会保険（健康保険＋厚生年金）の加入義務が発生。手取りが年間15〜20万円減ることも"],
              ["130万円の壁", "配偶者の扶養に入っている場合", "扶養から外れ、自分で社会保険に加入する必要がある。年収130万円を少し超えると手取りが大幅減"],
              ["150万円の壁", "配偶者控除の減額ライン", "配偶者の税負担が増え始める（世帯収入に影響）"],
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
        <li><Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link></li>
        <li><Link href="/blog/takehome-500">年収500万円の手取り詳細</Link></li>
        <li><Link href="/blog/takehome-400">年収400万円の手取り詳細</Link></li>
        <li><Link href="/tools/net-income">手取り計算ツール（社会保険料込みで即計算）</Link></li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある質問</h2>
      <dl className="space-y-4">
        {[
          { q: "社会保険料は給料からいくら引かれますか？", a: "給与の約14〜15%が社会保険料として引かれます。月収30万円なら約4〜4.5万円。会社も同額を負担しているため、合計では月収の約28〜30%に相当します。" },
          { q: "社会保険料の130万円の壁とは？", a: "年収130万円以上になると配偶者の扶養から外れ、自分で社会保険または国民健康保険に加入が必要になります。年間20〜30万円程度の負担増になります。" },
          { q: "標準報酬月額とはなんですか？", a: "社会保険料の計算に使う「基準となる給与額」です。実際の月給を50等級の区分に当てはめて計算します。毎年4〜6月の給与平均で決まります。" },
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
