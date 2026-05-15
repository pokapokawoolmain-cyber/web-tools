import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-20s")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["20代 平均手取り", "20代 年収 平均", "新卒 手取り", "20代 貯金 目安", "20代 一人暮らし 手取り"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        20代の平均手取りは<strong>月18〜22万円前後</strong>が目安です。新卒から20代後半にかけて年収が上がるにつれ、手取りも段階的に増えていきます。年齢・職種・都市別の実態と、貯蓄の目安を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の手取りを正確に計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して正確な手取り額を無料で計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>20代の年齢・年収別 手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年齢・状況</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目安年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月手取り</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["新卒（22〜23歳）", "約220〜240万円", "約185〜200万円", "約15.4〜16.7万円"],
              ["20代前半（24〜25歳）", "約260〜310万円", "約215〜255万円", "約17.9〜21.3万円"],
              ["20代後半（26〜29歳）", "約310〜400万円", "約255〜318万円", "約21.3〜26.5万円"],
              ["20代・IT/金融系", "約350〜550万円", "約280〜427万円", "約23.3〜35.6万円"],
              ["20代平均（全職種）", "約277万円", "約230万円", "約19.2万円"],
            ].map(([age, income, takehome, monthly], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{age}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※国税庁「民間給与実態統計調査」・厚労省「賃金構造基本統計調査」をもとにした概算。独身・会社員・ボーナス2ヶ月想定。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新卒1年目の注意点：住民税は2年目から</h2>
      <p>
        新卒1年目は住民税（前年所得に課税）がかかりません。しかし2年目の6月から住民税が天引きされ始め、手取りが<strong>月1〜1.5万円減る</strong>ことがあります。2年目のギャップに驚かないよう事前に把握しておきましょう。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>20代の一人暮らし 生活費シミュレーション</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">地方都市</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">東京</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["家賃", "4〜6万円", "7〜10万円"],
              ["食費", "3〜4万円", "4〜5万円"],
              ["光熱費・通信費", "1.5〜2万円", "1.5〜2万円"],
              ["交通費（自己負担分）", "0〜1万円", "0〜1万円"],
              ["固定費 合計", "約8.5〜13万円", "約12.5〜18万円"],
              ["残り（貯蓄・娯楽費）", "約6〜10万円", "約1〜6万円"],
            ].map(([item, rural, tokyo], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{rural}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{tokyo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※手取り月20万円・独身一人暮らしでの目安。交通費は会社支給の場合を除く。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>20代での貯蓄目標と手取りアップ戦略</h2>
      <ul className="space-y-2">
        <li>
          <strong>先取り貯蓄</strong>：給与振込日に自動で貯蓄口座に振り替えると続けやすいです。手取りの10〜20%が目安。
        </li>
        <li>
          <strong>新NISA積立</strong>：月1〜3万円からでも長期複利の効果が大きいです。<Link href="/tools/nisa-calculator">NISAシミュレーター</Link>で将来の資産を試算できます。
        </li>
        <li>
          <strong>ふるさと納税</strong>：年収270万円以上から実質的な節税メリットが生まれます。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で上限額を確認しましょう。
        </li>
        <li>
          <strong>キャリアアップ</strong>：20代は昇給・転職による収入増が最も手取りを増やす効果的な方法です。年収100万円の増加で手取りは約70〜75万円増えます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-400">年収400万円の手取り詳細</Link></li>
        <li><Link href="/blog/takehome-2026">手取り早見表2026年版（年収200〜1000万円）</Link></li>
        <li><Link href="/blog/nisa-monthly-simulation">新NISAの積立シミュレーション</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は公的統計・現行の税率・社会保険料率に基づく概算です。勤務先・地域・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
    </BlogLayout>
  );
}
