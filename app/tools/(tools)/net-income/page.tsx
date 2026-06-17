import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateMeta } from "@/lib/seo";
import { calcTakehome } from "@/lib/takehome";
import { NetIncome } from "./NetIncome";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "手取り計算｜年収・月収から手取りをシミュレーション【無料】",
  description:
    "年収・月収を入力するだけで手取り額を計算。社会保険料・所得税・住民税の内訳、年収別の手取り早見表、手取りを増やす方法まで解説。無料・登録不要・スマホ対応。",
  path: "/tools/net-income",
  keywords: [
    "年収 計算", "手取り 計算", "手取り シミュレーション", "額面 手取り 換算",
    "月収 手取り", "収入 手取り 計算", "手取り 計算 ツール",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "手取り計算", icon: "💴", desc: "年収・月収から手取りを計算。税金の内訳つき。" }).toString()}`,
});

const fmtMan = (yen: number) => `${Math.round(yen / 10000)}万円`;
const fmtManTenth = (yen: number) => `${(Math.round(yen / 1000) / 10).toFixed(1)}万円`;

const INCOME_MAN = [300, 400, 500, 600, 700, 800, 900, 1000];
const TABLE = INCOME_MAN.map((man) => {
  const annual = man * 10000;
  const r = calcTakehome(annual);
  return {
    man,
    slug: `takehome-${man}`,
    annualNet: fmtMan(r.annualNet),
    monthlyNet: fmtManTenth(r.monthlyNet),
    rate: Math.round((r.annualNet / annual) * 100),
  };
});

// 解説ブロック共通: 小見出しラベル＋白カード（ツール本体と同じ視覚言語）
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">{label}</p>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="net-income" title="手取り計算" description="年収・月収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。" />
      <NetIncome />

      {/* ── 解説（ツール本体と同じ slate 背景・白カードで一体化）─────── */}
      <div className="bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pb-20 space-y-6">

          <Block label="額面と手取りの違い">
            <p>
              「年収」は税金や社会保険料が引かれる前の<strong className="text-slate-800 dark:text-zinc-200">額面</strong>です。実際に振り込まれる<strong className="text-slate-800 dark:text-zinc-200">手取り</strong>は、額面から社会保険料・所得税・住民税を差し引いた金額になります。手取りは額面のおおよそ<strong className="text-slate-800 dark:text-zinc-200">75〜85%</strong>で、年収が上がるほど税率が上がり手取り率は下がります。
            </p>
          </Block>

          <Block label="手取りの計算方法">
            <p className="mb-3">このツールは次の式で手取りを概算しています。</p>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-[13px] font-medium text-slate-800 dark:text-zinc-200 mb-4">
              手取り ＝ 年収 −（社会保険料 ＋ 所得税 ＋ 住民税）
            </div>
            <ul className="space-y-2.5">
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">社会保険料</span>：健康保険・厚生年金・雇用保険など。会社員はおおむね額面の14〜15%。
                <Link href="/blog/shakai-hoken-guide" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">計算方法を見る</Link>
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">所得税</span>：課税所得に応じた5〜45%の累進課税（復興特別所得税を含む）。
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">住民税</span>：課税所得のおおむね10%（前年の所得をもとに翌年課税）。
                <Link href="/blog/jumin-zei-guide" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">計算方法を見る</Link>
              </li>
            </ul>
          </Block>

          <Block label="年収別の手取り早見表">
            <p className="mb-4">独身・基礎控除のみで計算した、年収別の手取りの目安です。各年収の詳しい内訳は個別ページで確認できます。</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                    <th className="text-left font-medium py-2 px-1">年収</th>
                    <th className="text-right font-medium py-2 px-1">年手取り</th>
                    <th className="text-right font-medium py-2 px-1">月手取り</th>
                    <th className="text-right font-medium py-2 px-1">手取り率</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.man} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0">
                      <td className="py-2.5 px-1">
                        <Link href={`/blog/${row.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">{row.man}万円</Link>
                      </td>
                      <td className="py-2.5 px-1 text-right font-medium text-slate-800 dark:text-zinc-200">{row.annualNet}</td>
                      <td className="py-2.5 px-1 text-right">{row.monthlyNet}</td>
                      <td className="py-2.5 px-1 text-right text-slate-400 dark:text-zinc-500">約{row.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px]">
              月収から調べたい場合や年収300〜1000万円をまとめて比較したい場合は
              <Link href="/salary" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">手取り早見表（年収・月収別）</Link>
              をご覧ください。
            </p>
          </Block>

          <Block label="手取りを増やすには">
            <p className="mb-3">税率は自分で下げられませんが、所得控除を活用すると課税所得が下がり、結果的に手取りを増やせます。</p>
            <ul className="space-y-2.5">
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">iDeCo・NISA</span>：iDeCoの掛金は全額所得控除。NISAは運用益が非課税。
                <Link href="/tools/nisa-calculator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">積立シミュレーション</Link>
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">ふるさと納税</span>：実質2,000円で返礼品。控除上限は年収・家族構成で変わります。
                <Link href="/tools/furusato-simulator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">控除上限を計算</Link>
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">生命保険料控除・医療費控除</span>：年末調整や確定申告で漏れなく申告する。
              </li>
            </ul>
          </Block>

          <Block label="よくある質問">
            <dl className="space-y-4">
              {[
                { q: "手取りは額面の何割くらいですか？", a: "年収300万円台ではおおむね8割前後、年収が上がるほど税率が上がるため、年収1000万円では約7割まで下がります。上の早見表で年収ごとの目安を確認できます。" },
                { q: "額面から手取りを逆算できますか？", a: "年収を入力すると手取りが表示されるため、希望する手取りに近づく額面をスライダーで調整しながら逆算できます。月収ベースでも試算できます。" },
                { q: "配偶者控除や扶養控除は反映されますか？", a: "本ツールは独身・基礎控除のみの概算です。配偶者控除・扶養控除・各種保険料控除がある場合、実際の手取りはこれより多くなることがあります。" },
                { q: "入力したデータは送信されますか？", a: "計算はすべてブラウザ内で完結します。入力した年収などのデータが外部へ送信されることはありません。" },
              ].map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 本ツールの計算は概算です。正確な税額・社会保険料は、お住まいの自治体や加入する健康保険組合により異なります。
            </p>
          </Block>

          <RelatedTools toolId="net-income" />
          <RelatedArticles toolId="net-income" />
        </div>
      </div>
    </>
  );
}
