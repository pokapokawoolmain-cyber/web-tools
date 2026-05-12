import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("gas-cost-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ガソリン代 計算式", "通勤 ガソリン代 計算", "燃費 計算 方法", "ガソリン代 経費 申請", "ガソリン 節約 方法"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        ガソリン代は日々の生活費の中で見えにくい出費のひとつです。通勤・仕事・ドライブにかかるガソリン代を正確に把握しておくと、節約や経費申請の際に役立ちます。
      </p>

      <h2>ガソリン代の基本計算式</h2>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 font-mono text-sm">
        ガソリン代 ＝ 走行距離（km）÷ 燃費（km/L）× ガソリン単価（円/L）
      </div>
      <p>
        例：往復40kmの通勤・燃費15km/L・ガソリン単価165円/Lの場合
      </p>
      <p className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-3 text-sm font-mono">
        40 ÷ 15 × 165 ＝ 約440円（1日あたり）
      </p>
      <p>
        月20日出勤すると月間8,800円になります。
      </p>

      <h2>燃費の計算方法</h2>
      <p>
        燃費は給油時に計算できます。
      </p>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 font-mono text-sm">
        燃費（km/L）＝ 前回給油からの走行距離（km）÷ 今回の給油量（L）
      </div>
      <p>
        例：280km走行して18L給油した場合：280 ÷ 18 ≈ 15.6km/L
      </p>

      <h2>車種別の燃費目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">車種</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">燃費目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月100km走行の燃料費（@165円）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ハイブリッド車", "20〜30km/L", "約550〜825円"],
              ["コンパクトカー", "15〜20km/L", "約825〜1,100円"],
              ["SUV・ミニバン", "10〜15km/L", "約1,100〜1,650円"],
              ["軽自動車", "18〜25km/L", "約660〜917円"],
            ].map(([type, fuel, cost], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{fuel}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>通勤のガソリン代を経費申請する方法</h2>
      <p>
        会社にマイカー通勤のガソリン代を申請する場合は、以下の方法が一般的です。
      </p>
      <ul>
        <li><strong>実費計算</strong>：通勤距離×2（往復）×出勤日数÷燃費×ガソリン単価</li>
        <li><strong>1kmあたり単価</strong>：会社が定めた単価（例：15円/km）×月間走行距離</li>
      </ul>
      <p>
        <Link href="/tools/gas-calculator">ガソリン代計算ツール</Link>で正確な金額を算出してから経費申請書類を作成すると、スムーズに手続きできます。
      </p>

      <h2>ガソリン代を節約するコツ</h2>
      <ul>
        <li><strong>エコ運転</strong>：急加速・急ブレーキを避けることで燃費が10〜20%改善する場合がある</li>
        <li><strong>タイヤ空気圧の管理</strong>：適切な空気圧に保つことで燃費悪化を防ぐ</li>
        <li><strong>アイドリングストップ</strong>：信号待ちや停車中のエンジン停止</li>
        <li><strong>安いガソリンスタンドを使う</strong>：ガソリン価格比較サービスを活用する</li>
        <li><strong>クレジットカードのリッター割引</strong>：提携カードで1〜5円/Lの割引を受けられる場合がある</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">ガソリン代計算ツール</strong>
        <Link href="/tools/gas-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">ガソリン代計算ツール</Link>では走行距離・燃費・ガソリン単価を入力するだけで、片道・往復・月間コストを自動計算できます。
      </div>
    </BlogLayout>
  );
}
