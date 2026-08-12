import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { calcResidentTax } from "@/lib/resident-tax";
import { ResidentTax } from "./ResidentTax";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "住民税の目安計算｜年収から住民税がいくらか自動計算【無料】",
  description:
    "年収と扶養人数を入力するだけで、1年間に納める住民税のおおよその目安を計算。所得割・均等割の内訳、月あたりの金額、年収別の住民税早見表、6月から引かれる理由まで解説。無料・登録不要・スマホ対応。",
  path: "/tools/resident-tax",
  keywords: [
    "住民税 計算",
    "住民税 目安",
    "住民税 いくら",
    "年収 住民税",
    "住民税 月いくら",
    "住民税 シミュレーション",
    "住民税 早見表",
    "住民税 6月",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "住民税の目安計算", icon: "🧾", desc: "年収から住民税の目安を計算。内訳つき。" }).toString()}`,
});

const fmtYen = (yen: number) => `¥${yen.toLocaleString()}`;

const INCOME_MAN = [200, 300, 400, 500, 600, 700, 800, 1000];
const TABLE = INCOME_MAN.map((man) => {
  const r = calcResidentTax(man * 10000, 0);
  return {
    man,
    total: r.isExempt ? "非課税の目安" : fmtYen(r.total),
    monthly: r.isExempt ? "—" : fmtYen(r.monthly),
    rate: r.isExempt ? "—" : `約${((r.total / (man * 10000)) * 100).toFixed(1)}%`,
  };
});

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "住民税はなぜ6月から引かれるのですか？", acceptedAnswer: { "@type": "Answer", text: "住民税は前年（1〜12月）の所得をもとに計算され、その金額を翌年の6月から翌々年5月までの12回に分けて納めるためです。会社員は6月支給分の給与から新しい年度の住民税が天引きされ始めます。前年に所得がなかった新社会人は、入社2年目の6月から住民税が引かれ始めるのが一般的です。" } },
    { "@type": "Question", name: "住民税は年収のどれくらいですか？", acceptedAnswer: { "@type": "Answer", text: "住民税の所得割は課税所得の約10%（市区町村民税6%＋都道府県民税4%）で、これに定額の均等割（目安5,000円）が加わります。年収に対する割合はおおむね年収300万円で約3〜4%、年収600万円で約5〜6%が目安です。扶養家族が多いほど課税所得が下がり、住民税も安くなります。" } },
    { "@type": "Question", name: "所得割と均等割の違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "所得割は所得の大きさに応じてかかる部分で、課税所得の約10%です。均等割は所得にかかわらず定額でかかる部分で、標準では年5,000円（市区町村民税3,500円＋都道府県民税1,500円、うち森林環境税1,000円を含む）です。合計が1年間の住民税になります。" } },
    { "@type": "Question", name: "住民税が非課税になるのはどんな場合ですか？", acceptedAnswer: { "@type": "Answer", text: "所得が一定以下の場合、住民税は非課税になります。単身の場合は給与収入がおおむね100万円以下が目安で、扶養家族がいる場合は基準額が上がります。非課税限度額は自治体によって多少異なります。" } },
    { "@type": "Question", name: "この計算結果はそのまま使えますか？", acceptedAnswer: { "@type": "Answer", text: "本ツールは会社員・給与所得のみを想定した概算の目安です。医療費控除・生命保険料控除・住宅ローン控除などがある場合や、自治体独自の制度がある場合は実際の税額と異なります。正確な金額は自治体から届く住民税決定通知書や勤務先でご確認ください。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="resident-tax" title="住民税の目安計算" description="年収と扶養人数から、1年間に納める住民税のおおよその目安を計算。所得割・均等割の内訳つき。" />
      <JsonLd data={faqSchema} />
      <ResidentTax />

      <div className="bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pb-20 space-y-6">

          <Block label="住民税とは">
            <p>
              住民税は、住んでいる都道府県と市区町村に納める税金です。行政サービス（教育・福祉・ごみ処理など）の財源になります。
              金額は<strong className="text-slate-800 dark:text-zinc-200">所得割</strong>（所得に応じてかかる部分）と
              <strong className="text-slate-800 dark:text-zinc-200">均等割</strong>（所得にかかわらず定額の部分）を合計して決まります。
            </p>
          </Block>

          <Block label="なぜ6月から引かれるのか">
            <p className="mb-3">
              住民税は<strong className="text-slate-800 dark:text-zinc-200">前年の所得</strong>をもとに計算される「後払い」の税金です。
              計算された1年分の住民税を、翌年6月から翌々年5月までの12回に分けて納めます。
            </p>
            <ul className="space-y-2">
              <li>・会社員は毎年6月の給与から、新しい年度の住民税が天引きされ始めます（特別徴収）。</li>
              <li>・新社会人は入社1年目に前年の所得がないことが多く、住民税が引かれ始めるのは<strong className="text-slate-800 dark:text-zinc-200">2年目の6月から</strong>が一般的です。</li>
              <li>・退職して収入が下がっても、前年の所得を基準に課税されるため、負担が重く感じられることがあります。</li>
            </ul>
          </Block>

          <Block label="計算のしくみ">
            <p className="mb-3">このツールは次の考え方で住民税を概算しています。</p>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-[13px] font-medium text-slate-800 dark:text-zinc-200 mb-4 leading-relaxed">
              課税所得 ＝ 給与所得 −（社会保険料 ＋ 基礎控除43万円 ＋ 扶養控除33万円×人数）<br />
              住民税 ＝ 課税所得 × 約10%（所得割）＋ 5,000円（均等割）
            </div>
            <p>
              所得税とは控除額が異なる点に注意が必要です。住民税の基礎控除は43万円（所得税は48万円）、扶養控除は33万円（所得税は38万円）です。
              手取り全体を知りたい場合は
              <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">手取り計算</Link>
              もあわせてご利用ください。
            </p>
          </Block>

          <Block label="年収別の住民税の目安（早見表）">
            <p className="mb-4">独身・扶養なしで計算した、年収別の住民税（年間）の目安です。扶養家族がいる場合はこれより安くなります。</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                    <th className="text-left font-medium py-2 px-1">年収</th>
                    <th className="text-right font-medium py-2 px-1">住民税（年）</th>
                    <th className="text-right font-medium py-2 px-1">月あたり</th>
                    <th className="text-right font-medium py-2 px-1">対年収</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.man} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0">
                      <td className="py-2.5 px-1 font-medium text-slate-700 dark:text-zinc-300">{row.man}万円</td>
                      <td className="py-2.5 px-1 text-right font-medium text-slate-800 dark:text-zinc-200">{row.total}</td>
                      <td className="py-2.5 px-1 text-right">{row.monthly}</td>
                      <td className="py-2.5 px-1 text-right text-slate-400 dark:text-zinc-500">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 概算の目安です。均等割5,000円を含みます。実際の税額は自治体や各種控除により異なります。
            </p>
          </Block>

          <Block label="住民税を抑えるには">
            <p className="mb-3">住民税は所得控除を活用して課税所得を下げると、結果的に負担を抑えられます。</p>
            <ul className="space-y-2.5">
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">ふるさと納税</span>：実質2,000円の負担で寄付でき、住民税・所得税から控除されます。
                <Link href="/tools/furusato-simulator" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">控除上限を計算</Link>
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">iDeCo</span>：掛金が全額所得控除になり、所得税・住民税ともに軽くなります。
              </li>
              <li>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">医療費控除・生命保険料控除</span>：年末調整や確定申告で忘れずに申告する。
              </li>
            </ul>
          </Block>

          <Block label="よくある質問">
            <dl className="space-y-4">
              {[
                { q: "住民税はなぜ6月から引かれるのですか？", a: "前年（1〜12月）の所得をもとに計算し、翌年6月から翌々年5月までの12回に分けて納めるためです。新社会人は前年に所得がないことが多く、2年目の6月から引かれ始めるのが一般的です。" },
                { q: "住民税は年収のどれくらいですか？", a: "所得割が課税所得の約10%、これに均等割（目安5,000円）が加わります。対年収ではおおむね年収300万円で約3〜4%、600万円で約5〜6%が目安です。扶養が多いほど安くなります。" },
                { q: "所得割と均等割の違いは何ですか？", a: "所得割は所得に応じてかかる約10%の部分、均等割は所得にかかわらず定額でかかる年5,000円（森林環境税1,000円を含む標準額）の部分です。" },
                { q: "住民税が非課税になるのはどんな場合ですか？", a: "所得が一定以下だと非課税になります。単身なら給与収入100万円以下が目安で、扶養家族がいると基準額が上がります。基準は自治体で多少異なります。" },
                { q: "この計算結果はそのまま使えますか？", a: "会社員・給与所得のみを想定した概算の目安です。各種控除や自治体独自の制度がある場合は実際と異なります。正確な金額は住民税決定通知書や勤務先でご確認ください。" },
              ].map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 本ツールの計算は概算です。正確な税額は、お住まいの自治体から届く住民税決定通知書でご確認ください。
            </p>
          </Block>

          <RelatedTools toolId="resident-tax" />
          <RelatedArticles toolId="resident-tax" />
        </div>
      </div>
    </>
  );
}
