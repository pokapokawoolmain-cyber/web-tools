import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { calcRequiredIncome } from "@/lib/takehome";
import { TakehomeReverse } from "./TakehomeReverse";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "手取り逆算シミュレーター｜月の手取りから必要な年収を計算【無料】",
  description:
    "「月の手取り30万円が欲しい」から必要な額面年収を逆算。手取り20万〜65万円の必要年収早見表付き。社会保険料・所得税・住民税を考慮した概算を無料・登録不要で即計算。",
  path: "/tools/takehome-reverse",
  keywords: [
    "手取り 逆算", "手取り 30万 年収", "手取り 38万 年収", "手取り 40万 年収",
    "月収 手取り 逆算", "手取りから年収 計算", "手取り 額面 逆算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "手取り逆算シミュレーター", icon: "🔄", desc: "欲しい手取りから必要な年収を逆算。" }).toString()}`,
});

const fmtMan = (yen: number) => `約${Math.round(yen / 10000)}万円`;

// 月手取り別・必要年収の早見表（calcRequiredIncome から自動算出 = ツールと常に一致）
const MONTHLY_MAN = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65];
const TABLE = MONTHLY_MAN.map((man) => {
  const required = calcRequiredIncome(man * 10000 * 12);
  return {
    man,
    required: fmtMan(required),
    requiredMonthly: fmtMan(required / 12),
  };
});

const req = (man: number) => fmtMan(calcRequiredIncome(man * 10000 * 12));

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "月の手取り30万円に必要な年収はいくらですか？", acceptedAnswer: { "@type": "Answer", text: `月の手取り30万円（年間360万円）を得るには、額面年収${req(30)}が必要です（独身・基礎控除のみの概算）。社会保険料・所得税・住民税を差し引いた後の手取りベースで計算しています。` } },
    { "@type": "Question", name: "月の手取り38万円に必要な年収はいくらですか？", acceptedAnswer: { "@type": "Answer", text: `月の手取り38万円（年間456万円）を得るには、額面年収${req(38)}が必要です（独身・基礎控除のみの概算）。` } },
    { "@type": "Question", name: "月の手取り41万円に必要な年収はいくらですか？", acceptedAnswer: { "@type": "Answer", text: `月の手取り41万円（年間492万円）を得るには、額面年収${req(41)}が必要です（独身・基礎控除のみの概算）。` } },
    { "@type": "Question", name: "月の手取り46万円に必要な年収はいくらですか？", acceptedAnswer: { "@type": "Answer", text: `月の手取り46万円（年間552万円）を得るには、額面年収${req(46)}が必要です（独身・基礎控除のみの概算）。` } },
    { "@type": "Question", name: "手取りから年収を逆算する計算方法は？", acceptedAnswer: { "@type": "Answer", text: "手取り＝額面−（社会保険料＋所得税＋住民税）の関係を使い、目標の手取りになる額面年収を探索して逆算します。本ツールでは会社員・独身・基礎控除のみを前提とした概算値を表示します。" } },
    { "@type": "Question", name: "入力したデータは送信されますか？", acceptedAnswer: { "@type": "Answer", text: "計算はすべてブラウザ内で完結します。入力した金額などのデータが外部へ送信されることはありません。" } },
  ],
};

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
      <ToolJsonLd slug="takehome-reverse" title="手取り逆算シミュレーター" description="欲しい月の手取り額から必要な額面年収を逆算。社会保険料・所得税・住民税を考慮した概算を即計算。" />
      <JsonLd data={faqSchema} />
      <TakehomeReverse />

      {/* ── 解説（ツール本体と同じ slate 背景・白カードで一体化）─────── */}
      <div className="bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pb-20 space-y-6">

          <Block label="このツールでわかること">
            <p>
              一般的な手取り計算は「年収→手取り」の一方向ですが、転職・昇給交渉・ライフプランの場面で本当に知りたいのは<strong className="text-slate-800 dark:text-zinc-200">「欲しい手取りに対して、いくらの年収（額面）が必要か」</strong>です。本ツールは目標の月手取りを動かすだけで、必要な額面年収と税金・社会保険料の内訳を逆算します。
            </p>
          </Block>

          <Block label="月手取り別・必要年収の早見表">
            <p className="mb-4">独身・基礎控除のみで計算した、月の手取り額ごとに必要な額面年収の目安です。</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                    <th className="text-left font-medium py-2 px-1">月の手取り</th>
                    <th className="text-right font-medium py-2 px-1">必要な額面年収</th>
                    <th className="text-right font-medium py-2 px-1">月額面換算</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.man} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0">
                      <td className="py-2.5 px-1 font-medium text-slate-800 dark:text-zinc-200">{row.man}万円</td>
                      <td className="py-2.5 px-1 text-right font-medium text-blue-600 dark:text-blue-400">{row.required}</td>
                      <td className="py-2.5 px-1 text-right text-slate-400 dark:text-zinc-500">{row.requiredMonthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px]">
              年収から手取りを知りたい場合は
              <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">手取り計算ツール</Link>
              、年収別の一覧は
              <Link href="/salary" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">手取り早見表</Link>
              をご覧ください。
            </p>
          </Block>

          <Block label="逆算のしくみ">
            <p className="mb-3">手取りと額面には次の関係があります。</p>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-[13px] font-medium text-slate-800 dark:text-zinc-200 mb-4">
              手取り ＝ 額面年収 −（社会保険料 ＋ 所得税 ＋ 住民税）
            </div>
            <p>
              税金・社会保険料は年収に応じて変わるため、単純な割り算では逆算できません。本ツールは目標の手取りに一致する額面年収を数値探索で求めています。手取り率は年収300万円台で約8割、年収1000万円で約7割まで下がるため、<strong className="text-slate-800 dark:text-zinc-200">手取りを月5万円増やすには額面で月7〜8万円の昇給が必要</strong>になるのが一般的です。
            </p>
          </Block>

          <Block label="転職・昇給交渉での使い方">
            <ul className="space-y-2.5">
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">転職の希望年収を決める</span>：生活に必要な月の手取りから逆算した額面年収を「希望年収」として提示すると、入社後のギャップを防げます。
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">家計・住宅ローンの計画</span>：毎月の返済額と生活費から必要な手取りを決め、そこから必要年収を確認できます。
                <Link href="/tools/mortgage-calculator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">住宅ローンシミュレーター</Link>
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">節税で手取りを増やす</span>：同じ額面でも
                <Link href="/tools/furusato-simulator" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">ふるさと納税</Link>
                やiDeCoの活用で実質的な手取りを増やせます。
              </li>
            </ul>
          </Block>

          <Block label="よくある質問">
            <dl className="space-y-4">
              {[
                { q: "ボーナスがある場合はどう考えればいいですか？", a: "本ツールの計算は年収ベースのため、ボーナスの有無に関わらず「必要な額面年収」は同じです。月々の給与に換算する場合は、ボーナス分を差し引いて12分割してください。" },
                { q: "配偶者控除や扶養控除は反映されますか？", a: "本ツールは独身・基礎控除のみの概算です。配偶者控除・扶養控除がある場合、同じ手取りでも必要な額面年収は少なくなります。" },
                { q: "手取り30万円に必要な年収は？", a: `額面年収${req(30)}が目安です（独身・基礎控除のみ）。上の早見表で他の金額も確認できます。` },
                { q: "入力したデータは送信されますか？", a: "計算はすべてブラウザ内で完結します。入力した金額が外部へ送信されることはありません。" },
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

          <RelatedTools toolId="takehome-reverse" />
          <RelatedArticles toolId="takehome-reverse" />
        </div>
      </div>
    </>
  );
}
