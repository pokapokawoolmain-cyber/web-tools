import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { TakehomeClusterNav } from "../_components/TakehomeClusterNav";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-900")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収900万 手取り いくら", "年収900万 月収 手取り 計算", "900万 手取り 独身 共働き 比較", "年収900万 税金 社会保険料", "年収900万 節税 ふるさと納税"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収900万円の手取りは<strong>約653万円（月54.4万円）</strong>が目安です。控除合計247万円の内訳と、iDeCo・ふるさと納税で年10万円超の節税を実現するシミュレーションを解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収900万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "900万円"],
              ["手取り年収（概算）", "約653万円"],
              ["月額手取り（概算）", "約54.4万円"],
              ["控除合計", "約247万円"],
              ["手取り率", "約72.6%"],
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
      <h2>控除の内訳（年収900万円・独身の場合）</h2>
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
              ["健康保険料（本人負担分）", "約43万円", "約3.6万円"],
              ["厚生年金保険料", "約65万円", "約5.4万円"],
              ["雇用保険料", "約5万円", "約0.4万円"],
              ["社会保険料 合計", "約113万円", "約9.4万円"],
              ["所得税", "約85万円", "約7.1万円"],
              ["住民税", "約49万円", "約4.1万円"],
              ["控除 合計", "約247万円", "約20.6万円"],
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
        年収900万円では<strong>所得税が85万円</strong>と高水準です。課税所得が695万円超の部分には所得税率23%が適用されるため、節税対策の費用対効果が非常に高い年収帯です。
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
              ["独身", "約653万円", "基準"],
              ["配偶者あり（専業主婦/夫）", "約668万円", "+約15万円"],
              ["配偶者あり＋子1人（16歳未満）", "約668万円", "+約15万円"],
              ["配偶者あり＋子1人（16〜18歳）", "約680万円", "+約27万円"],
              ["配偶者あり＋子2人（扶養）", "約693万円", "+約40万円"],
            ].map(([family, takehome, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{family}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収800万〜1000万円の手取り比較</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月手取り</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り率</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["700万円", "約528万円", "約44万円", "約75.4%"],
              ["800万円", "約589万円", "約49.1万円", "約73.6%"],
              ["900万円", "約653万円", "約54.4万円", "約72.6%", true],
              ["1000万円", "約722万円", "約60.2万円", "約72.2%"],
            ].map(([income, takehome, monthly, rate, isCurrent], i) => (
              <tr key={i} className={isCurrent ? "bg-blue-50 dark:bg-blue-950/30" : i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium ${isCurrent ? "text-blue-700 dark:text-blue-300" : ""}`}>{income}{isCurrent ? " ◀ この記事" : ""}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        年収が100万円上がるごとに、手取りは約64〜70万円増加します。額面差100万円のうち約3割が税金・保険料として引かれる計算です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収900万円の節税シミュレーション</h2>

      <h3>① iDeCo（イデコ）で節税する</h3>
      <p>
        会社員の場合、iDeCoの掛金は月最大2.3万円（年27.6万円）まで全額所得控除になります。年収900万円（所得税率20%・住民税10%）なら年間<strong>約8.3万円の節税</strong>が見込めます。
      </p>

      <h3>② ふるさと納税で返礼品をもらいながら節税</h3>
      <p>
        年収900万円・独身の場合、ふるさと納税の目安上限は<strong>約17〜18万円</strong>。自己負担2,000円で地域の特産品がもらえます。
        <Link href="/blog/furusato-limit-by-income" className="text-blue-600 dark:text-blue-400 hover:underline">年収別の上限額早見表はこちら</Link>で確認できます。
      </p>

      <h3>③ 生命保険料控除の活用</h3>
      <p>
        生命保険・医療保険・個人年金の保険料は最大合計12万円まで所得控除できます。年収900万円では所得税・住民税合わせて最大<strong>約3.6万円の節税</strong>効果があります。
      </p>

      <div className="my-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-[13px] text-green-800 dark:text-green-300">
        <strong className="block mb-1">💰 節税合計シミュレーション（年収900万・独身の場合）</strong>
        <ul className="space-y-1 mt-2">
          <li>iDeCo最大活用：約8.3万円節税</li>
          <li>ふるさと納税（上限17万円）：約17万円分の返礼品（実質節税）</li>
          <li>生命保険料控除最大化：約3.6万円節税</li>
          <li className="font-semibold border-t border-green-300 dark:border-green-700 pt-1 mt-1">合計：現金節税11.9万円＋返礼品17万円分</li>
        </ul>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収900万円の生活レベル・資産形成シミュレーション</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目安（月）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月手取り", "約54.4万円", "年653万円"],
              ["家賃", "約12〜18万円", "手取りの22〜33%が目安"],
              ["食費・外食", "約5〜8万円", "外食頻度が高い傾向"],
              ["光熱費・通信費", "約3〜4万円", ""],
              ["交通費・自動車", "約2〜5万円", "マイカー保有の場合"],
              ["教育費（子あり）", "約3〜10万円", "習い事・塾費用"],
              ["iDeCo・投資積立", "約3〜10万円", "資産形成"],
              ["可処分（貯蓄・娯楽）", "約5〜20万円", "ライフスタイルによる"],
            ].map(([item, amount, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px] text-slate-500 dark:text-zinc-500">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-800">年収800万円の手取りは月49.1万円</Link></li>
        <li><Link href="/blog/takehome-1000">年収1000万円の手取りは月60.2万円</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表2026年版（年収300〜1000万円一覧）</Link></li>
        <li><Link href="/blog/furusato-limit-by-income">年収別ふるさと納税の上限額早見表</Link></li>
        <li><Link href="/blog/shakai-hoken-guide">社会保険料の計算方法【年収別早見表・2026年版】</Link></li>
      </ul>

      <TakehomeClusterNav current={900} />
    </BlogLayout>
  );
}
