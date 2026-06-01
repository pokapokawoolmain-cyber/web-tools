import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("furusato-limit-by-income")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ふるさと納税 上限 年収 早見表", "ふるさと納税 いくらまで 年収別 一覧", "ふるさと納税 限度額 計算 独身", "ふるさと納税 共働き 夫婦 上限", "ふるさと納税 超えたら どうなる"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「年収〇〇万円のふるさと納税上限はいくら？」——自己負担2,000円で済む限度額は年収・家族構成によって大きく変わります。年収300万〜1,500万円を一覧表で解説します。
      </p>

      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-5 my-6 border border-green-200 dark:border-green-800">
        <strong className="text-green-800 dark:text-green-300 block mb-1">正確な上限額をシミュレーション</strong>
        <p className="text-[14px] text-green-700 dark:text-green-400 mb-3">年収・家族構成を入力して、ふるさと納税の正確な上限額を計算できます。</p>
        <Link href="/tools/furusato" className="inline-block bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          ふるさと納税シミュレーターを使う（無料）→
        </Link>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別ふるさと納税上限額早見表（独身・独身相当）</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収（額面）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">上限額目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月換算</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["300万円", "約2.8万円", "約2,300円/月"],
              ["350万円", "約3.4万円", "約2,800円/月"],
              ["400万円", "約4.2万円", "約3,500円/月"],
              ["450万円", "約5.2万円", "約4,300円/月"],
              ["500万円", "約6.1万円", "約5,100円/月"],
              ["550万円", "約6.9万円", "約5,800円/月"],
              ["600万円", "約7.7万円", "約6,400円/月"],
              ["700万円", "約10.8万円", "約9,000円/月"],
              ["800万円", "約13.0万円", "約10,800円/月"],
              ["900万円", "約15.2万円", "約12,700円/月"],
              ["1,000万円", "約17.6万円", "約14,700円/月"],
              ["1,200万円", "約24.0万円", "約20,000円/月"],
              ["1,500万円", "約38.5万円", "約32,100円/月"],
            ].map(([income, limit, monthly], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400 font-medium">{limit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・給与所得者・社会保険料は標準的な金額を想定した概算値です。他の所得控除（iDeCo・住宅ローン等）がある場合は上限が下がります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>家族構成別の上限額（年収500万円の場合）</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">上限額目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["独身", "約6.1万円", "基準"],
              ["共働き（配偶者の収入あり）", "約6.1万円", "ほぼ同じ"],
              ["配偶者あり（専業主婦/夫）", "約4.6万円", "−1.5万円"],
              ["配偶者あり＋子1人（高校生）", "約3.3万円", "−2.8万円"],
              ["配偶者あり＋子2人（大学・高校）", "約1.6万円", "−4.5万円"],
            ].map(([family, limit, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{family}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400 font-medium">{limit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-rose-500 dark:text-rose-400">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[13px] text-amber-800 dark:text-amber-300">
        <strong className="block mb-1">⚠️ 扶養家族がいると上限が大幅に下がる理由</strong>
        <p>扶養控除・配偶者控除によって住民税の課税所得が減るため、ふるさと納税の上限となる「住民税所得割額」が下がります。家族がいる場合は必ずシミュレーターで正確な上限を確認してください。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>共働き夫婦の上限額（年収別）</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">夫の年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">妻の年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">夫の上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">妻の上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">合計上限</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["500万円", "300万円", "約6.1万円", "約2.8万円", "約8.9万円"],
              ["600万円", "400万円", "約7.7万円", "約4.2万円", "約11.9万円"],
              ["700万円", "500万円", "約10.8万円", "約6.1万円", "約16.9万円"],
              ["800万円", "600万円", "約13.0万円", "約7.7万円", "約20.7万円"],
              ["1,000万円", "600万円", "約17.6万円", "約7.7万円", "約25.3万円"],
            ].map(([husband, wife, hlimit, wlimit, total], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{husband}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{wife}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{hlimit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{wlimit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-green-600 dark:text-green-400">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        共働きの場合、夫と妻それぞれが個別に上限額を持ちます。合算すると大きな節税効果になります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ふるさと納税の上限額が下がる「落とし穴」</h2>

      <ul className="space-y-2">
        <li><strong>iDeCoを掛けている</strong>：iDeCoの掛金は所得控除されるため課税所得が下がり、ふるさと納税の上限も下がります。</li>
        <li><strong>住宅ローン控除を受けている</strong>：住宅ローン控除（税額控除）は住民税を直接減らすため、ふるさと納税で控除できる住民税が減ります。目安として住宅ローン控除額分だけ上限が下がります。</li>
        <li><strong>医療費控除・雑損控除を申告している</strong>：確定申告で追加控除を受けると所得が下がり、上限が下がります。</li>
        <li><strong>副業・不動産収入がある</strong>：他の所得がある場合は総合課税で計算されるため上限が変わります。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>上限を超えたらどうなる？</h2>

      <p>
        ふるさと納税の上限を超えて寄付した場合、超過分は所得税・住民税から控除されません。つまり<strong>自己負担が2,000円を大幅に超えてしまいます</strong>。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">状況</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">実際の自己負担</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["上限内（例：上限10万円で10万円寄付）", "2,000円（正常）"],
              ["上限超過（上限10万円で15万円寄付）", "2,000円 + 超過5万円 = 52,000円"],
              ["大幅超過（上限10万円で30万円寄付）", "2,000円 + 超過20万円 = 202,000円"],
            ].map(([situation, burden], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{situation}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium ${i === 0 ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>{burden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ワンストップ特例 vs 確定申告：どちらを選ぶ？</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">条件</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手続き</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ワンストップ特例", "給与所得者・年間5自治体以内・確定申告不要", "各自治体に申請書を郵送するだけ"],
              ["確定申告", "6自治体以上・医療費控除併用・副業あり等", "翌年2〜3月に確定申告書を提出"],
            ].map(([method, condition, procedure], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{condition}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{procedure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール・記事</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/furusato">ふるさと納税シミュレーター</Link>：年収・家族構成から正確な上限額を計算。</li>
        <li><Link href="/blog/furusato-nozei-guide">ふるさと納税の仕組みと年収別控除上限額【最新版】</Link></li>
        <li><Link href="/blog/furusato-nozei-howto">ふるさと納税のやり方【2026年版・申請手順】</Link></li>
        <li><Link href="/blog/nencho-guide">年末調整の書き方2026年完全ガイド</Link></li>
        <li><Link href="/blog/takehome-1000">年収1000万円の手取りと節税シミュレーション</Link></li>
      </ul>

    </BlogLayout>
  );
}
