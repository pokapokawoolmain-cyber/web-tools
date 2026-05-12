import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("side-job-tax-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["副業 税金 いくら", "副業 確定申告 必要", "副業 20万円 ルール", "副業 経費 認められる", "副業 所得税 計算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        副業で稼いだお金にはどのくらい税金がかかるのか、確定申告はいつ必要になるのか——これを理解しておくことで、税務署からの追徴課税や無申告加算税を防げます。
      </p>

      <h2>副業の確定申告が必要になるケース</h2>
      <p>
        給与所得者（会社員・パート）の場合、副業などによる「所得」（収入から経費を引いた金額）が年間20万円を超えると確定申告が必要です。
      </p>
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-4 border border-amber-200 dark:border-amber-800">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">「売上20万円」ではなく「所得20万円」がポイント</p>
        <p className="text-[14px] text-amber-700 dark:text-amber-400">
          確定申告の要否は「所得（売上−経費）」で判断します。売上が30万円でも経費が15万円あれば所得は15万円となり、申告不要です。経費の計上は重要です。
        </p>
      </div>

      <h2>副業の税率（所得税）</h2>
      <p>
        副業所得は本業の給与所得と合算して課税されます。課税所得の金額に応じて税率が段階的に上がります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">課税所得</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">所得税率</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">住民税（一律）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["〜195万円", "5%", "10%"],
              ["195〜330万円", "10%", "10%"],
              ["330〜695万円", "20%", "10%"],
              ["695〜900万円", "23%", "10%"],
              ["900〜1,800万円", "33%", "10%"],
            ].map(([income, tax, local], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{tax}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{local}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>副業で経費として認められるもの</h2>
      <ul>
        <li><strong>機材・設備費</strong>：PC、カメラ、マイク等（副業専用または業務比率で按分）</li>
        <li><strong>通信費</strong>：インターネット代（在宅副業の場合、業務比率で按分）</li>
        <li><strong>交通費</strong>：副業先への移動費（実費）</li>
        <li><strong>書籍・研修費</strong>：副業に必要な知識習得のための費用</li>
        <li><strong>ソフトウェア・サービス費</strong>：副業に使うサブスクリプション費用</li>
      </ul>
      <p>
        プライベートと兼用のものは「業務使用割合」に応じた按分が必要です。根拠となる記録（利用ログ・領収書）を保管しておきましょう。
      </p>

      <h2>フリマ・ハンドメイド販売の扱い</h2>
      <p>
        メルカリやヤフオクでの不用品の売却は原則非課税です（生活に必要な物品の売却）。ただし転売目的の仕入れ→販売や、継続的なハンドメイド販売は事業所得・雑所得として課税対象になります。
      </p>

      <h2>副業収入の手取り計算</h2>
      <p>
        副業所得がいくらになるか、経費を差し引いた手取り額を確認したい場合は<Link href="/tools/side-job-profit">副業収入計算ツール</Link>を活用してみてください。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">注意事項</strong>
        この記事は一般的な情報提供を目的としています。税務の個別判断については税理士にご相談ください。税制は毎年改正されることがあります。
      </div>
    </BlogLayout>
  );
}
