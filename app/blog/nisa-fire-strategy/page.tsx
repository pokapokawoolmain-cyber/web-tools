import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("nisa-fire-strategy")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["新NISA FIRE 戦略", "NISA 1800万 FIRE", "新NISA 取り崩し", "NISA FIRE 方法", "NISA 生涯枠 活用"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        新NISAの生涯投資枠<strong>1,800万円</strong>は非課税で運用できる強力な制度です。FIREを目指す場合、この非課税枠をどう活用するかが資産形成の鍵になります。
      </p>
      <p className="text-[13px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 my-4">
        投資はリスクを伴います。将来の運用益を保証するものではありません。余裕資金での運用をご検討ください。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">新NISAの運用シミュレーション</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">積立金額・期間・年利を入力して将来の資産額を試算できます。</p>
        <Link href="/tools/nisa-calculator" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          NISAシミュレーターを使う（無料）→
        </Link>
      </div>

      <h2>新NISAの基本スペック（FIRE戦略向け整理）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["年間上限", "360万円（つみたて枠120万円＋成長枠240万円）"],
              ["生涯非課税枠", "1,800万円"],
              ["非課税期間", "無期限"],
              ["売却後の再利用", "翌年以降に枠が復活（年間上限内）"],
              ["取り崩し時の税金", "NISA口座内の売却益・配当は非課税"],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 font-medium text-slate-700 dark:text-zinc-300 w-1/3">{label}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAで1,800万円の枠を埋めるには何年かかる？</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月積立額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">枠を埋めるまでの年数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">30年後の資産（年利5%想定）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月5万円（年60万円）", "30年", "約4,159万円"],
              ["月10万円（年120万円）", "15年", "約2,657万円"],
              ["月20万円（年240万円）", "約7.5年", "約2,096万円"],
              ["月30万円（年360万円・上限）", "5年", "約1,984万円"],
            ].map(([amount, years, assets], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{years}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{assets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※30年後の資産は開始時から30年間月積立を続けた場合の概算。「枠を埋めた後の余剰資金は特定口座」として計算には含めていません。過去の実績が将来の運用成果を保証するものではありません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAとiDeCoの使い分け（FIRE戦略）</h2>
      <p>
        FIREを目指す場合、新NISAとiDeCoには役割の違いがあります：
      </p>
      <ul className="space-y-2">
        <li><strong>新NISA</strong>：いつでも引き出せる。FIRE後の生活費として取り崩す主力口座に適しています。</li>
        <li><strong>iDeCo</strong>：60歳まで引き出し不可だが掛金全額が所得控除。現役期間の節税効果が高く、老後資金の柱になります。</li>
      </ul>
      <p>
        早期FIRE（50代以前）を目指す場合、FIRE後〜60歳までの生活費はNISAや特定口座でカバーし、iDeCoは60歳以降の老後資金として位置づけるのが一般的な戦略です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新NISAでの取り崩し方（FIRE後）</h2>
      <p>
        FIRE後は毎年の生活費相当分をNISA口座から売却して現金化します。NISA口座内の売却益・配当は非課税のため、特定口座と比べて手取りが約20%多くなります。ただし「売りすぎ」に注意が必要で、残った資産を引き続き運用することで長期的な資産寿命を延ばせます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/fire-how-much-needed">FIREに必要な資産額はいくら？</Link></li>
        <li><Link href="/blog/fire-4percent-rule">FIRE達成後の4%ルールとは？</Link></li>
        <li><Link href="/blog/fire-monthly-5man">月5万円の積立でFIREは可能？</Link></li>
        <li><Link href="/blog/nisa-ideco-compare">新NISAとiDeCoの違いを比較</Link></li>
        <li><Link href="/blog/nisa-monthly-simulation">新NISAの積立シミュレーション</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事は一般的な情報提供を目的としており、投資助言ではありません。投資はリスクを伴い、元本が保証されるものではありません。投資判断は自己責任で行い、必要に応じて専門家にご相談ください。
      </div>
    </BlogLayout>
  );
}
