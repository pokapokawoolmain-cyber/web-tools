import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("investment-beginner-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["積立投資 始め方 初心者", "新NISA 20代 30代", "インデックスファンド 始め方", "月3万円 積立 資産形成", "投資信託 初心者 おすすめ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「投資は難しそう」「損するのが怖い」——そう感じている人でも、長期の積立投資はシンプルで始めやすい方法です。20代・30代から始めた場合の具体的な資産の積み上がり方を解説します。
      </p>

      <h2>積立投資が初心者に向いている理由</h2>
      <ul>
        <li><strong>毎月決まった額を買い続けるだけ</strong>：タイミングを読む必要がない</li>
        <li><strong>少額から始められる</strong>：月100円〜対応の証券会社もある</li>
        <li><strong>時間が味方になる</strong>：長く続けるほど複利の恩恵が大きくなる</li>
        <li><strong>分散投資でリスクを抑えられる</strong>：1本のファンドで世界中に投資できる</li>
      </ul>

      <h2>早く始めるほど差が大きい理由</h2>
      <p>
        月3万円、年利5%で積み立てた場合の資産額は以下の通りです。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">開始年齢</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">65歳時の資産額（目安）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["20歳", "45年", "約5,795万円"],
              ["25歳", "40年", "約4,566万円"],
              ["30歳", "35年", "約3,576万円"],
              ["35歳", "30年", "約2,496万円"],
            ].map(([age, period, amount], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{age}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{period}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※年利5%複利で計算した概算値です。実際の運用成績は変動します。
      </p>

      <h2>最初に買うべき投資信託</h2>
      <p>
        投資初心者が最初に選ぶべきは<strong>全世界株式インデックスファンド</strong>です。
      </p>
      <ul>
        <li>1本で米国・欧州・アジア等の世界中の株式に分散投資できる</li>
        <li>信託報酬（コスト）が0.1〜0.2%程度と非常に安い</li>
        <li>長期的に見て市場平均のリターンを得られる</li>
        <li>運用方針がシンプルで理解しやすい</li>
      </ul>
      <p>
        特定の商品名は時代によって変わるため、「全世界株式」「信託報酬0.2%以下」の条件で各証券会社のNISAラインナップから選ぶのがよいでしょう。
      </p>

      <h2>新NISAを使った始め方</h2>
      <ol>
        <li><strong>証券口座を開設する</strong>：ネット証券（楽天・SBI等）はスマホから開設できる</li>
        <li><strong>新NISAの「つみたて投資枠」を選ぶ</strong>：年間120万円まで非課税で積立可能</li>
        <li><strong>投資信託を選んで積立設定</strong>：毎月自動で購入される設定にする</li>
        <li><strong>あとは放置する</strong>：相場の上下に一喜一憂せず続けることが大切</li>
      </ol>

      <h2>積立シミュレーションで確認する</h2>
      <p>
        自分の毎月の積立額・期間・利回りで将来の資産額を計算したい場合は<Link href="/tools/nisa-calculator">NISAシミュレーターツール</Link>で試算できます。早期リタイアを目指す場合の目標資産額の計算は<Link href="/tools/fire-simulator">FIREシミュレーター</Link>も活用してみてください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">注意事項</strong>
        この記事は一般的な情報提供を目的としています。投資には元本割れのリスクがあります。投資判断は自己責任で行い、必要に応じてファイナンシャルプランナーに相談することをお勧めします。
      </div>
    </BlogLayout>
  );
}
