import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-2026")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["手取り早見表 2026", "年収 手取り 2026", "手取り一覧 最新", "年収別 手取り", "月収 手取り 換算"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        2026年版の手取り早見表です。年収200〜1,000万円の手取り年収・月収換算・手取り率を一覧でまとめました。2026年分（令和8年分）の基礎控除・給与所得控除の引き上げを反映した概算値です。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して正確な手取り額を無料で計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>2026年版・年収別手取り早見表（独身・会社員）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月収換算</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り率</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["200万円", "約165万円", "約13.8万円", "約82.7%"],
              ["250万円", "約203万円", "約16.9万円", "約81.3%"],
              ["300万円", "約242万円", "約20.1万円", "約80.6%"],
              ["350万円", "約280万円", "約23.4万円", "約80.1%"],
              ["400万円", "約318万円", "約26.5万円", "約79.5%"],
              ["450万円", "約356万円", "約29.7万円", "約79.1%"],
              ["500万円", "約394万円", "約32.8万円", "約78.7%"],
              ["550万円", "約431万円", "約35.9万円", "約78.3%"],
              ["600万円", "約467万円", "約38.9万円", "約77.8%"],
              ["700万円", "約532万円", "約44.3万円", "約76.0%"],
              ["800万円", "約596万円", "約49.6万円", "約74.5%"],
              ["900万円", "約662万円", "約55.2万円", "約73.6%"],
              ["1000万円", "約728万円", "約60.6万円", "約72.8%"],
            ].map(([income, takehome, monthly, rate], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・会社員・基礎控除のみ、協会けんぽの料率（健康保険4.955%・厚生年金9.15%・雇用保険0.55%）で計算した概算値です。賞与の有無で年額はほぼ変わりませんが、加入する健康保険組合・家族構成によって実際の手取りは異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>2026年の手取りに影響する主な変更点</h2>
      <ul className="space-y-2">
        <li>
          <strong>所得税の基礎控除の引き上げ（2026年分）</strong>：合計所得489万円以下は104万円（2025年分は最大95万円、2024年分までは48万円）、489万〜655万円は67万円、655万〜2,350万円は62万円になりました。改正は2026年12月1日施行のため、増えた分は年末調整でまとめて精算されます。
        </li>
        <li>
          <strong>給与所得控除の最低保障額の引き上げ（2026年分）</strong>：65万円から74万円（恒久措置の69万円＋2026・2027年分の特例5万円）になり、所得税がかかり始める年収は178万円になりました。
        </li>
        <li>
          <strong>厚生年金の標準報酬月額の上限引き上げ（2027年9月〜）</strong>：2025年成立の年金制度改正法により、上限65万円が2027年9月に68万円、2028年9月に71万円、2029年9月に75万円へ段階的に引き上げられる予定です。月給がおおむね66.5万円以上の人は保険料が増えます（2026年の手取りには影響しません）。
        </li>
        <li>
          <strong>社会保険の適用拡大（パート・アルバイト）</strong>：従業員51人以上の企業で週20時間以上・月額賃金8.8万円以上のパートに社会保険が適用されています。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>手取りを増やす主な方法</h2>
      <ul className="space-y-2">
        <li><strong>ふるさと納税</strong>：<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で上限額を確認し、実質2,000円の自己負担で節税できます。</li>
        <li><strong>iDeCo</strong>：掛金が全額所得控除。年収・拠出額によっては年間数万円の節税効果があります。</li>
        <li><strong>新NISA</strong>：運用益・配当が非課税。<Link href="/tools/nisa-calculator">NISAシミュレーター</Link>で長期積立の試算ができます。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別の詳細記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-400">年収400万円の手取り詳細</Link>：約318万円（月26.5万円）</li>
        <li><Link href="/blog/takehome-500">年収500万円の手取り詳細</Link>：約394万円（月32.8万円）</li>
        <li><Link href="/blog/takehome-600">年収600万円の手取り詳細</Link>：約467万円（月38.9万円）</li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link>：さらに広い年収帯をカバー</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。加入する健康保険組合・家族構成・各種控除の状況により実際の手取りは異なります。
      </div>
    </BlogLayout>
  );
}
