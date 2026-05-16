import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-700")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収700万 手取り", "年収700万 月収", "年収700万 税金", "700万 手取り 独身", "年収700万 生活レベル"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収700万円の手取りは<strong>約528万円（月44万円）</strong>が目安です。給与から引かれる172万円の内訳と、独身・家族持ちの生活シミュレーション、FIRE達成に向けた積立戦略を解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収700万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "700万円"],
              ["手取り年収（概算）", "約528万円"],
              ["月額手取り（概算）", "約44万円"],
              ["控除合計", "約172万円"],
              ["手取り率", "約75.4%"],
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
      <h2>控除の内訳（年収700万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約35万円", "約2.9万円"],
              ["厚生年金保険料", "約60万円", "約5万円"],
              ["雇用保険料", "約4万円", "約0.3万円"],
              ["社会保険料 合計", "約99万円", "約8.3万円"],
              ["所得税", "約33万円", "約2.8万円"],
              ["住民税", "約40万円", "約3.3万円"],
              ["控除 合計", "約172万円", "約14.3万円"],
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
      <p>
        年収700万円では所得税と住民税を合わせて<strong>約73万円</strong>の税負担があります。年収500万円（約33万円）から約40万円増えます。所得税の限界税率は23%です。
      </p>

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
              ["独身", "約528万円", "—"],
              ["配偶者あり（専業主婦・収入なし）", "約545万円", "+約17万円"],
              ["配偶者＋子ども1人（16歳未満）", "約545万円", "+約17万円"],
              ["配偶者＋子ども1人（高校生以上）", "約554万円", "+約26万円"],
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

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月手取り44万円の生活費シミュレーション</h2>
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
              ["家賃（東京・1LDK〜2LDK）", "10〜15万円"],
              ["食費", "5〜7万円"],
              ["光熱費・通信費", "2〜3万円"],
              ["保険・交通費等", "2〜3万円"],
              ["固定費 合計", "19〜28万円"],
              ["残り（貯蓄・趣味・投資）", "16〜25万円"],
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
        東京で一人暮らしでも毎月16〜25万円の余裕があります。新NISAの積立（月10万円）と十分な生活費・貯蓄を同時に確保できる水準です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収700万円からのFIRE・資産形成シミュレーション</h2>
      <p>
        月44万円の手取りはFIREを目指すうえで有利な水準です。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月の積立額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">15年後（年利5%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">20年後（年利5%）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月10万円", "約2,655万円", "約4,110万円"],
              ["月15万円", "約3,982万円", "約6,166万円"],
              ["月20万円", "約5,310万円", "約8,221万円"],
            ].map(([amount, y15, y20], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y15}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{y20}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        月15〜20万円を積み立てると15〜20年でFIRE圏内の4,000〜6,000万円に届きます。新NISAの生涯非課税枠1,800万円（年360万円・月30万円が上限）を先に使い切る戦略が有効です。詳しくは<Link href="/blog/nisa-monthly-simulation">新NISA積立シミュレーション</Link>と<Link href="/tools/fire-simulator">FIREシミュレーター</Link>をご利用ください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収700万円から手取りを増やす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：年収700万・独身の場合の寄附上限の目安は約10〜11万円。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で正確な上限を確認できます。
        </li>
        <li>
          <strong>iDeCo</strong>：月2.3万円（年27.6万円）まで全額所得控除。年収700万円の限界税率23%なら年間約6〜7万円の節税効果です。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：マイホーム購入時に最大13年間、年末ローン残高の0.7%が税額から直接控除されます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>他の年収との手取り比較</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-500">年収500万円の手取り</Link>：約393万円（月32.8万円）</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り</Link>：約462万円（月38.5万円）</li>
        <li>年収700万円の手取り：<strong>約528万円（月44万円）← このページ</strong></li>
        <li><Link href="/blog/takehome-800">年収800万円の手取り</Link>：約589万円（月49.1万円）— 年収700万より61万円多い</li>
      </ul>
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
