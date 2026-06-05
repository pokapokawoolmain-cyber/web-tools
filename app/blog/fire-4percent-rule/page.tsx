import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("fire-4percent-rule")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["4%ルール FIRE", "FIRE 取り崩し", "トリニティスタディ", "資産取り崩し 方法", "FIRE 日本 注意点"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        FIREシミュレーターを作るにあたって4%ルールを改めて調べたとき、「日本でそのまま使うと思ったより危ない」と気づきました。米国の研究をそのまま当てはめると社会保険料・税制・為替の3つで試算がズレます。「1億円あれば年400万円生活できる」は正しいですが、国民健康保険料だけで年30〜50万円かかることが抜け落ちていることが多い。この記事では4%ルールの仕組みと、日本でFIREを目指すときに知っておくべき現実をまとめました。
      </p>
      <p className="text-[13px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 my-4">
        投資はリスクを伴います。4%ルールは過去の米国市場データに基づく推計であり、将来の資産枯渇を防ぐことを保証するものではありません。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">FIRE必要資産額を試算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">生活費・運用利回りを入力してFIRE達成に必要な資産額を計算できます。</p>
        <Link href="/tools/fire-simulator" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          FIREシミュレーターを使う（無料）→
        </Link>
      </div>

      <h2>4%ルールとは何か</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        1990年代の米国研究（トリニティスタディ）に基づく考え方で、株式・債券を組み合わせたポートフォリオから毎年資産の4%を取り崩した場合、過去30年間の市場データで資産が枯渇しないケースが多かったというものです。
      </p>
      <p>
        1億円の資産なら年400万円（月約33万円）、6,000万円なら年240万円（月20万円）が取り崩しの目安となります。
      </p>

      <h2>4%ルールに基づく必要資産額の早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月の生活費</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間生活費</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">必要資産額（×25倍）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">3%ルール（×33倍）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["10万円", "120万円", "3,000万円", "3,960万円"],
              ["15万円", "180万円", "4,500万円", "5,940万円"],
              ["20万円", "240万円", "6,000万円", "7,920万円"],
              ["25万円", "300万円", "7,500万円", "9,900万円"],
              ["30万円", "360万円", "9,000万円", "1億1,880万円"],
            ].map(([monthly, annual, r4, r3], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{annual}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{r4}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{r3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※税金・社会保険料は含まれていません。日本でのFIREでは実際の生活費に加えて国民健康保険料・国民年金保険料がかかります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>日本でFIREする場合の注意点</h2>

      <h3>社会保険料の負担</h3>
      <p>
        FIRE後は会社の健康保険から外れ、国民健康保険・国民年金に加入します。前年の所得（配当・譲渡益等）に基づいて計算されるため、資産収入がある場合は年間数十万円の保険料がかかります。生活費の試算に含めることが必要です。
      </p>

      <h3>シークエンス・オブ・リターンズリスク</h3>
      <p>
        FIRE直後に大きな下落が起きると資産回復が難しくなるリスクがあります。対策として、生活費2〜3年分を現金で保有する「バケツ戦略」や、暴落時に支出を一時的に削減するフレキシブルな対応が重要です。
      </p>

      <h3>長寿リスク</h3>
      <p>
        4%ルールは30年間の試算です。早期FIRE（40代以前）の場合、50〜60年以上の期間をカバーする必要があるため、取り崩し率を3〜3.5%に抑える保守的な設計が有効です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/fire-how-much-needed">FIREに必要な資産額はいくら？</Link></li>
        <li><Link href="/blog/fire-monthly-5man">月5万円の積立でFIREは可能？</Link></li>
        <li><Link href="/blog/nisa-fire-strategy">新NISAでFIREを目指す戦略</Link></li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 4%ルールを調べて変わった自分の考え方</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          計算してみて一番驚いたのは「40代でFIREした場合、4%ルールの30年試算ではギリギリ足りない可能性がある」という点でした。40歳でFIREすると85歳まで45年必要で、4%ルールの前提（30年）を超えます。個人的には日本でのFIREは3〜3.5%で試算するほうが安全マージンがあると思っています。あとは支出の削減にも限界があるので、副収入の柱をひとつ残す「サイドFIRE」も現実的な選択肢だと感じています。
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事は一般的な情報提供を目的としており、投資助言ではありません。投資はリスクを伴い、元本が保証されるものではありません。投資判断は自己責任で行い、必要に応じて専門家にご相談ください。
      </div>
    </BlogLayout>
  );
}
