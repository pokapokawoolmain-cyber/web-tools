import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateMeta } from "@/lib/seo";
import { NetIncome } from "./NetIncome";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "手取り計算｜年収・月収から手取りをシミュレーション【無料】",
  description:
    "年収・月収を入力するだけで手取り額を計算。社会保険料・所得税・住民税の内訳、額面から手取りへの換算、年収別の手取り早見表も確認できます。無料・登録不要・スマホ対応。",
  path: "/tools/net-income",
  keywords: [
    "年収 計算", "手取り 計算", "手取り シミュレーション", "額面 手取り 換算",
    "手取り 額面 逆算", "月収 手取り", "収入 手取り 計算", "手取り 計算 ツール",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "手取り計算", icon: "💴", desc: "年収・月収から手取りを計算。税金の内訳つき。" }).toString()}`,
});

// 年収→手取りの目安（独身・基礎控除のみの概算。各年収の詳細記事へ内部リンク）
const TAKEHOME_ROWS: [string, string, string, string][] = [
  ["年収300万円", "約243万円", "約20.3万円", "takehome-300"],
  ["年収400万円", "約318万円", "約26.5万円", "takehome-400"],
  ["年収500万円", "約393万円", "約32.8万円", "takehome-500"],
  ["年収600万円", "約462万円", "約38.5万円", "takehome-600"],
  ["年収700万円", "約528万円", "約44.0万円", "takehome-700"],
  ["年収800万円", "約589万円", "約49.1万円", "takehome-800"],
  ["年収900万円", "約653万円", "約54.4万円", "takehome-900"],
  ["年収1000万円", "約722万円", "約60.2万円", "takehome-1000"],
];

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="net-income" title="手取り計算" description="年収・月収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。" />
      <NetIncome />

      {/* ── 解説（SEO・利用者の判断材料）─────────────────────── */}
      <section className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-[15px] text-slate-600 dark:text-zinc-400 leading-relaxed">

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">年収（額面）と手取りの違い</h2>
            <p>
              「年収」は税金や社会保険料が引かれる前の<strong>額面</strong>の金額です。実際に口座へ振り込まれる<strong>手取り</strong>は、額面から社会保険料・所得税・住民税を差し引いた残りになります。一般的に手取りは額面の<strong>約75〜85%</strong>で、年収が高いほど税率が上がるため手取り率は下がっていきます。
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">手取りの計算方法</h2>
            <p className="mb-3">このツールは、次の式で手取りを概算します。</p>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 px-5 py-4 text-[14px] font-medium text-slate-800 dark:text-zinc-200">
              手取り ＝ 年収 −（社会保険料 ＋ 所得税 ＋ 住民税）
            </div>
            <ul className="mt-4 space-y-2 list-disc list-outside ml-5">
              <li><strong>社会保険料</strong>：健康保険・厚生年金・雇用保険など。会社員の場合おおむね額面の14〜15%が目安です。</li>
              <li><strong>所得税</strong>：課税所得に応じて5〜45%の累進課税（復興特別所得税を含む）。</li>
              <li><strong>住民税</strong>：課税所得のおおむね10%（前年所得をもとに翌年課税）。</li>
            </ul>
            <p className="mt-3">
              社会保険料・所得税・住民税それぞれの仕組みは
              <Link href="/blog/shakai-hoken-guide" className="text-blue-600 dark:text-blue-400 hover:underline">社会保険料の計算方法</Link>
              ・
              <Link href="/blog/jumin-zei-guide" className="text-blue-600 dark:text-blue-400 hover:underline">住民税の計算方法</Link>
              で詳しく解説しています。
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">年収別の手取り早見表</h2>
            <p className="mb-3">独身・基礎控除のみで計算した、年収別のおおよその手取り（年間・月換算）の目安です。各年収の詳しい内訳は個別ページで確認できます。</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年収（額面）</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年間手取り</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">月換算</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {TAKEHOME_ROWS.map(([income, annual, monthly, slug], i) => (
                    <tr key={slug} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{income}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{annual}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{monthly}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">
                        <Link href={`/blog/${slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">内訳を見る</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
              年収300〜1000万円をまとめて比較したい場合は
              <Link href="/salary" className="text-blue-600 dark:text-blue-400 hover:underline">手取り年収早見表</Link>
              をご覧ください。
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">月収から手取りを計算する</h2>
            <p>
              入力欄の上部で「月収」に切り替えると、月収ベースで手取りを試算できます。月収（額面）に12を掛けた年収換算をもとに、社会保険料・所得税・住民税を差し引いた月の手取りを表示します。賞与（ボーナス）は含まないため、賞与込みの年収で見たい場合は「年収」で入力してください。
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-800 dark:text-zinc-200">手取りは額面の何割くらいですか？</p>
                <p>年収300万円台ではおおむね8割前後、年収が上がるほど税率が上がるため、年収1000万円では7割程度まで下がります。本ツールの早見表で年収ごとの目安を確認できます。</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-zinc-200">額面から手取りを逆算できますか？</p>
                <p>年収（額面）を入力すると手取りが表示されるため、希望する手取りに近づく額面をスライダーで調整しながら逆算できます。</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-zinc-200">配偶者控除や扶養控除は反映されますか？</p>
                <p>本ツールは独身・基礎控除のみの概算です。配偶者控除・扶養控除・各種保険料控除がある場合は、実際の手取りはこれより多くなることがあります。</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-zinc-200">入力したデータは送信されますか？</p>
                <p>計算はすべてブラウザ内で完結します。入力した年収などのデータが外部へ送信されることはありません。</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <RelatedArticles toolId="net-income" />
        </div>
      </div>
    </>
  );
}
