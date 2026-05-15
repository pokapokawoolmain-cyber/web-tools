import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("fire-monthly-5man")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["月5万 FIRE", "積立 FIRE シミュレーション", "月5万積立 何年", "FIRE 必要年数", "積立投資 FIRE 達成"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        <strong>月5万円</strong>の積立投資でFIREを目指す場合、<strong>年利・目標資産額・生活費の水準</strong>によって必要な年数が大きく変わります。複数のシナリオでシミュレーション結果を解説します。
      </p>
      <p className="text-[13px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 my-4">
        投資はリスクを伴います。将来の運用益を保証するものではありません。余裕資金での運用をご検討ください。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">FIREシミュレーターで自分の条件を試算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">目標資産額・積立額・年利を入力して達成年数を確認できます。</p>
        <Link href="/tools/fire-simulator" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          FIREシミュレーターを使う（無料）→
        </Link>
      </div>

      <h2>月5万円積立でFIREに必要な年数（シナリオ別）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">FIRE目標（生活費）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">必要資産額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利3%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年利7%</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月15万円", "4,500万円", "約44年", "約36年", "約29年"],
              ["月20万円", "6,000万円", "約51年", "約40年", "約32年"],
              ["月25万円", "7,500万円", "約57年", "約44年", "約34年"],
              ["月30万円", "9,000万円", "約62年", "約48年", "約37年"],
            ].map(([goal, assets, r3, r5, r7], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{goal}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{assets}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{r3}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{r5}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-700 dark:text-green-400">{r7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※必要資産額は年間生活費×25倍（4%ルール目安）で算出。税金・社会保険料・インフレは考慮していません。過去の実績が将来の運用成果を保証するものではありません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月5万円積立でのFIRE達成を早める方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>積立額を増やす</strong>：月5万→月10万に倍増すると必要年数が大幅に短縮されます。収入増・支出削減の両輪で積立額を増やしましょう。
        </li>
        <li>
          <strong>新NISAを最大活用する</strong>：年間最大360万円（月30万円）まで非課税で運用できます。<Link href="/tools/nisa-calculator">NISAシミュレーター</Link>で非課税効果を試算できます。
        </li>
        <li>
          <strong>生活費の目標を下げる</strong>：FIRE後の生活費を月20万→15万円にするだけで必要資産額が1,500万円減ります。
        </li>
        <li>
          <strong>サイドFIREも選択肢に</strong>：資産からの収入＋週数日の仕事を組み合わせるサイドFIREなら、必要資産額をさらに低く設定できます。
        </li>
      </ul>

      <h2>月5万円積立の資産推移（年利5%想定）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立年数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">積立元本</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">運用後の資産（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["10年", "600万円", "約779万円"],
              ["20年", "1,200万円", "約2,055万円"],
              ["30年", "1,800万円", "約4,159万円"],
              ["35年", "2,100万円", "約5,810万円"],
              ["40年", "2,400万円", "約7,619万円"],
            ].map(([years, principal, assets], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{years}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{principal}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{assets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※年利5%・複利計算の試算値。実際の運用成果は市場状況により異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/fire-how-much-needed">FIREに必要な資産額はいくら？</Link></li>
        <li><Link href="/blog/fire-4percent-rule">FIRE達成後の4%ルールとは？</Link></li>
        <li><Link href="/blog/nisa-fire-strategy">新NISAでFIREを目指す戦略</Link></li>
        <li><Link href="/blog/nisa-monthly-simulation">新NISAの積立シミュレーション</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の試算値は一定の前提条件に基づく参考値です。投資はリスクを伴い、元本が保証されるものではありません。投資判断は自己責任で行い、必要に応じて専門家にご相談ください。
      </div>
    </BlogLayout>
  );
}
