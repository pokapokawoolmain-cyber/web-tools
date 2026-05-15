import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-500")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収500万 手取り", "年収500万 月収", "年収500万 税金 いくら", "年収500万 社会保険料", "500万 手取り 独身"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収500万円の手取りは<strong>約393万円（月32.8万円）</strong>が目安です。給与から引かれる社会保険料・所得税・住民税の内訳と、もう少し手取りを増やすための節税方法を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収500万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "500万円"],
              ["手取り年収（概算）", "約393万円"],
              ["月額手取り（概算）", "約32.8万円"],
              ["控除合計", "約107万円"],
              ["手取り率", "約78.6%"],
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
        ※独身・会社員・東京都在住・ボーナス2ヶ月分想定の概算値です。加入する健康保険組合・家族構成により異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の内訳（年収500万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約25万円", "約2.1万円"],
              ["厚生年金保険料", "約46万円", "約3.8万円"],
              ["雇用保険料", "約3万円", "約0.3万円"],
              ["社会保険料 合計", "約74万円", "約6.2万円"],
              ["所得税", "約13万円", "約1.1万円"],
              ["住民税", "約20万円", "約1.7万円"],
              ["控除 合計", "約107万円", "約8.9万円"],
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
      <h2>月手取り32.8万円の生活費シミュレーション</h2>

      <h3>東京で一人暮らしの場合</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額目安</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["家賃（東京・1K〜1LDK）", "8〜12万円"],
              ["食費", "4〜5万円"],
              ["光熱費・通信費", "2〜2.5万円"],
              ["交通費", "0〜1万円（会社支給の場合0）"],
              ["保険・サブスク等", "1〜2万円"],
              ["固定費 合計", "15〜22万円"],
              ["残り（貯蓄・趣味・交際費）", "10〜17万円"],
            ].map(([item, cost], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        家賃が高い東京でも毎月10〜17万円の余裕を作れる水準です。新NISAの積立（月3〜5万円）と生活費のバランスが十分取れます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収500万円は日本の平均と比べてどのくらい？</h2>
      <p>
        国税庁の民間給与実態統計調査（2022年）によると、日本の給与所得者の平均年収は約458万円です。年収500万円はこの平均を少し上回る水準で、30代正社員の中では標準的なレンジに位置します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収500万円から手取りを増やす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>iDeCo（個人型確定拠出年金）</strong>：会社員の場合、月2.3万円（年27.6万円）まで掛金が全額所得控除。年収500万円なら年間約5〜6万円の節税効果。
        </li>
        <li>
          <strong>ふるさと納税</strong>：年収500万・独身の場合の寄附上限の目安は約6万円。実質2,000円の自己負担で地域の特産品がもらえます。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で上限額を確認できます。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：マイホーム購入を検討している場合、最大13年間ローン残高の0.7%が税額控除されます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-400">年収400万円の手取り</Link>：約318万円（月26.5万円）— 年収500万より75万円少ない</li>
        <li>年収500万円の手取り：<strong>約393万円（月32.8万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）— 年収500万より69万円多い</li>
      </ul>
      <p>
        年収を100万円上げても手取りは約70〜75万円しか増えません。昇給が「思ったほど生活が変わらない」と感じるのはこの仕組みが原因です。
      </p>

      <p>
        年収全体の手取り一覧は<Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>でまとめて確認できます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
    </BlogLayout>
  );
}
