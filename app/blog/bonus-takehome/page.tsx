import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("bonus-takehome")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ボーナス 手取り", "賞与 手取り 計算", "ボーナス 税金 いくら", "賞与 社会保険料", "ボーナス 手取り 早見表"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        ボーナス（賞与）は給与と同様に<strong>社会保険料・所得税</strong>が控除されます。支給額100万円でも手取りは75〜78万円程度になるのが一般的です。支給額別の手取り目安と計算方法を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">年収・手取りを正確に計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">ボーナス含む年収ベースで手取りを計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>ボーナス支給額別 手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">支給額（額面）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">社会保険料（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">所得税（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り（概算）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["20万円", "約3万円", "約1.2万円", "約15.8万円"],
              ["30万円", "約4.5万円", "約1.8万円", "約23.7万円"],
              ["50万円", "約7.5万円", "約3万円", "約39.5万円"],
              ["70万円", "約10.5万円", "約5.6万円", "約53.9万円"],
              ["100万円", "約15万円", "約8〜10万円", "約75〜77万円"],
              ["150万円", "約22.5万円", "約13〜16万円", "約111.5〜114.5万円"],
            ].map(([amount, social, tax, takehome], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-rose-600 dark:text-rose-400">{social}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-rose-600 dark:text-rose-400">{tax}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{takehome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※前月給与約30万円（社保控除後）・協会けんぽ・東京都在住の概算値。健保組合・前月給与額によって所得税率が異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ボーナスの控除の仕組み</h2>

      <h3>社会保険料</h3>
      <p>
        社会保険料（健康保険・厚生年金・雇用保険）はボーナス支給額に料率をかけて計算されます。個人負担分の合計は<strong>支給額の約14〜15%</strong>が目安です。
      </p>

      <h3>所得税（賞与に対する源泉徴収）</h3>
      <p>
        ボーナスの所得税は「前月の給与（社保控除後）」をもとに、国税庁の賞与に対する源泉徴収税額の算出率表から税率を求めます。前月給与が多いほど税率が高くなる仕組みです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年末調整で戻ってくる場合がある</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        源泉徴収は概算のため、年末調整で精算が行われます。扶養控除・生命保険料控除などの各種控除が多い場合、年末調整で還付を受けられることがあります。逆に過少徴収の場合は追加徴収になります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-500">年収500万円の手取り詳細（ボーナス込み）</Link></li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り詳細（ボーナス込み）</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。前月給与額・加入する健康保険組合・各種控除の状況により実際の手取りは異なります。
      </div>
    </BlogLayout>
  );
}
