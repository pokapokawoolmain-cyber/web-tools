import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { TakehomeClusterNav } from "../_components/TakehomeClusterNav";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-600")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収600万 手取り", "年収600万 月収", "年収600万 税金", "600万 手取り 独身", "年収600万 共働き"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収600万円の手取りは<strong>約462万円（月38.5万円）</strong>が目安です。「年収600万あるのに生活がそんなに楽じゃない」という声もありますが、その理由は138万円分の税金・社会保険料にあります。内訳と節税方法を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収600万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "600万円"],
              ["手取り年収（概算）", "約462万円"],
              ["月額手取り（概算）", "約38.5万円"],
              ["控除合計", "約138万円"],
              ["手取り率", "約77%"],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 font-medium text-slate-700 dark:text-zinc-300 w-1/2">{label}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・会社員・東京都在住・ボーナス2ヶ月分想定の概算値です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の内訳（年収600万円・独身の場合）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額換算</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["健康保険料（本人負担分）", "約30万円", "約2.5万円"],
              ["厚生年金保険料", "約55万円", "約4.6万円"],
              ["雇用保険料", "約3.6万円", "約0.3万円"],
              ["社会保険料 合計", "約88万円", "約7.3万円"],
              ["所得税", "約23万円", "約1.9万円"],
              ["住民税", "約27万円", "約2.3万円"],
              ["控除 合計", "約138万円", "約11.5万円"],
            ].map(([type, annual, monthly], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium" : ""}`}>{type}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium text-rose-600 dark:text-rose-400" : ""}`}>{annual}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>家族構成による手取りの変化</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["独身", "約462万円", "—"],
              ["配偶者あり（専業主婦・収入なし）", "約476万円", "+約14万円"],
              ["配偶者＋子ども1人（16歳未満）", "約476万円", "+約14万円"],
              ["配偶者＋子ども1人（高校生）", "約484万円", "+約22万円"],
            ].map(([family, income, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{family}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-700 dark:text-green-400">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        配偶者控除（38万円）が適用されると所得税・住民税が合わせて約14万円減ります。子どもが16歳以上（高校生）になると扶養控除も加算され、さらに手取りが増えます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収600万円から手取りをさらに増やす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：年収600万・独身の場合の寄附上限の目安は約7.7万円。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で正確な上限を確認できます。
        </li>
        <li>
          <strong>iDeCo</strong>：月2.3万円（年27.6万円）まで全額所得控除。年収600万円なら年間約6〜8万円の節税効果が見込めます。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：マイホーム購入時に最大13年間、年末ローン残高の0.7%が税額から直接控除されます。
        </li>
      </ul>
      <p>
        具体的にいくら節税できるか試算したい場合は<Link href="/tools/fire-simulator">FIREシミュレーター</Link>で資産形成計画も立てられます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収600万円からのFIRE・資産形成シミュレーション</h2>
      <p>
        月手取り38.5万円から生活費を引いた余剰を積み立てると、長期的な資産形成が加速します。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月の積立額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">20年後（年利5%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">30年後（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月5万円", "約2,055万円", "約4,161万円"],
              ["月8万円", "約3,288万円", "約6,658万円"],
              ["月10万円", "約4,110万円", "約8,322万円"],
            ].map(([amount, y20, y30], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y20}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y30}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        新NISAの年間上限360万円（つみたて枠120万円＋成長枠240万円）を最大活用すると、運用益が全額非課税になります。<Link href="/blog/nisa-monthly-simulation">新NISA積立シミュレーション</Link>で全パターンを確認できます。FIREを目指す場合は<Link href="/tools/fire-simulator">FIREシミュレーター</Link>で達成年数を試算しましょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-400">年収400万円の手取り</Link>：約318万円（月26.5万円）</li>
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）</li>
        <li>年収600万円の手取り：<strong>約462万円（月38.5万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-700">年収700万円の手取り</Link>：約528万円（月44万円）</li>
        <li><Link href="/blog/takehome-800">年収800万円の手取り</Link>：約589万円（月49.1万円）</li>
      </ul>
      <p>
        全年収の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>で確認できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
      <TakehomeClusterNav current={600} />
    </BlogLayout>
  );
}
