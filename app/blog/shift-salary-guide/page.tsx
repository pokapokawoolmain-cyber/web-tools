import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("shift-salary-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["アルバイト 給与計算 方法", "深夜 割増賃金 計算", "パート 扶養 収入 上限", "シフト 月収 計算", "バイト 手取り 計算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        シフト制のアルバイト・パートは毎月の出勤日数が変わるため、月収を正確に把握するのが難しいです。深夜割増・交通費・扶養の壁なども含めて計算方法を解説します。
      </p>

      <h2>基本的な給与計算式</h2>
      <p>
        アルバイト・パートの基本給与は以下の計算式で求められます。
      </p>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 font-mono text-sm">
        月給 ＝ 時給 × 勤務時間数（通常）＋ 時給 × 1.25 × 深夜時間数
      </div>

      <h2>深夜割増賃金の計算</h2>
      <p>
        22時〜翌5時の労働は、労働基準法により通常の25%増しの賃金が義務づけられています。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">時給</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">深夜割増後（×1.25）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月20時間深夜で働いた場合の割増分</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1,000円", "1,250円", "5,000円追加"],
              ["1,100円", "1,375円", "5,500円追加"],
              ["1,200円", "1,500円", "6,000円追加"],
              ["1,500円", "1,875円", "7,500円追加"],
            ].map(([wage, night, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{wage}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{night}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>扶養の壁となる年収ライン</h2>
      <p>
        扶養家族として給与所得のある人は、以下の年収ラインを超えると扶養から外れたり、税負担が増えたりします。
      </p>
      <ul>
        <li><strong>103万円の壁</strong>：超えると所得税が発生する（親・配偶者の扶養控除にも影響）</li>
        <li><strong>106万円の壁</strong>：週20時間以上・51人以上企業等の条件に当てはまると社会保険加入が必要</li>
        <li><strong>130万円の壁</strong>：ほとんどの場合、被扶養者として親・配偶者の社会保険から外れる</li>
        <li><strong>150万円の壁</strong>：配偶者特別控除が満額（38万円）から段階的に減少し始める</li>
      </ul>
      <p>
        103万円・130万円ちょうどで抑えたいなら、年間の勤務時間の管理が重要です。<Link href="/tools/shift-salary">シフト給与計算ツール</Link>で月収の見通しを立てながら調整してみてください。
      </p>

      <h2>手取り額の計算</h2>
      <p>
        総支給から天引きされる主なものは以下です。
      </p>
      <ul>
        <li><strong>所得税</strong>：給与所得控除後の所得に対して課税</li>
        <li><strong>住民税</strong>：前年の所得をもとに翌年6月〜（年収100万円以下は非課税の場合が多い）</li>
        <li><strong>社会保険料</strong>：一定条件を超えると健康保険・厚生年金が天引き</li>
      </ul>

      <h2>交通費の扱い</h2>
      <p>
        交通費は月15万円まで所得税が非課税です。ただし会社が交通費を支給するかどうかは義務ではなく、勤務先の規定次第です。採用時に確認しておきましょう。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">シフト給与計算ツール</strong>
        <Link href="/tools/shift-salary" className="text-blue-600 dark:text-blue-400 hover:underline">シフト給与計算ツール</Link>では、時給・勤務日数・深夜時間を入力するだけで月収と手取りの目安を自動計算できます。
      </div>
    </BlogLayout>
  );
}
