import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("point-return-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ポイント 還元率 比較", "PayPay 楽天 どっちがお得", "クレジットカード 還元率 高い", "キャッシュレス ポイント 貯まる", "年間 ポイント 計算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        キャッシュレス決済の選択肢が増えた今、どれを使えばポイントが最も貯まるか迷っている人は多いです。日常的な支出でのポイント還元率を比較してみました。
      </p>

      <h2>主なキャッシュレス決済の還元率比較</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">決済方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">通常還元率</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["PayPay", "0.5〜1%", "キャンペーン時に高還元、加盟店が多い"],
              ["楽天Pay", "1%（楽天カード払い）", "楽天市場利用でポイント倍増"],
              ["d払い", "0.5%", "dポイント加盟店でさらに加算"],
              ["au PAY", "0.5%", "Pontaポイントが貯まる"],
              ["クレジットカード（1%）", "1%", "ほぼ全店舗で安定した還元率"],
              ["クレジットカード（1.5%〜）", "1.5〜3%", "年会費ありで高還元のカードも"],
            ].map(([method, rate, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400 text-[12px]">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>月5万円の支出で年間どのくらい差が出るか</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">還元率</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月5万円で年間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月10万円で年間</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["0.5%", "3,000ポイント", "6,000ポイント"],
              ["1%", "6,000ポイント", "12,000ポイント"],
              ["1.5%", "9,000ポイント", "18,000ポイント"],
              ["3%", "18,000ポイント", "36,000ポイント"],
            ].map(([rate, pt5, pt10], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt5}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{pt10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>どのキャッシュレス決済を選ぶべきか</h2>

      <h3>楽天経済圏をよく使う人</h3>
      <p>
        楽天市場・楽天トラベルなどをよく利用するなら楽天カード＋楽天Payが有利です。SPU（スーパーポイントアッププログラム）でポイント倍率が上がります。
      </p>

      <h3>Yahoo！ショッピングをよく使う人</h3>
      <p>
        PayPayカードとPayPayを組み合わせることでPayPayポイントが効率よく貯まります。ヤフーショッピング5%＋各種クーポンで高還元になる場合があります。
      </p>

      <h3>特定のサービスに縛られたくない人</h3>
      <p>
        汎用性の高い年会費無料のクレジットカード（還元率1%）が安定しています。Amazon・楽天・公共料金・コンビニどこでも使えて、ポイントの失効リスクも低いです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ポイント還元シミュレーション</h2>
      <p>
        実際の年間支出額と還元率を入力して、年間どのくらいポイントが貯まるかシミュレーションできます。<Link href="/tools/point-simulator">ポイント還元シミュレーターツール</Link>を使ってみてください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">注意事項</strong>
        各サービスの還元率・キャンペーンは変更になる場合があります。最新の情報は各サービスの公式サイトでご確認ください。
      </div>
    </BlogLayout>
  );
}
