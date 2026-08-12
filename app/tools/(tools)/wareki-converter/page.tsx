import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { WarekiConverter } from "./WarekiConverter";

export const metadata: Metadata = generateMeta({
  title: "西暦・和暦変換【無料】令和・平成・昭和⇔西暦をすぐ変換",
  description:
    "西暦から和暦（令和・平成・昭和・大正・明治）、和暦から西暦へワンタップで相互変換。履歴書・公的書類の年号記入や生まれ年の確認に。元号の対応早見表つき。無料・登録不要・スマホ対応。",
  path: "/tools/wareki-converter",
  keywords: [
    "西暦 和暦 変換",
    "和暦 西暦 変換",
    "令和 西暦",
    "平成 西暦",
    "昭和 西暦",
    "元号 変換",
    "西暦 年号 早見表",
    "令和 何年",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "西暦・和暦変換", icon: "📆", desc: "令和・平成・昭和⇔西暦をすぐ変換" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "今年（令和）は西暦何年ですか？", acceptedAnswer: { "@type": "Answer", text: "令和は2019年5月1日に始まりました。令和の年に2018を足すと西暦になります（令和6年＝2024年）。逆に西暦から2018を引くと令和の年です。" } },
    { "@type": "Question", name: "平成・昭和は西暦に直すとどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "平成は西暦から1988を引いた数（平成31年＝2019年まで）、昭和は西暦から1925を引いた数（昭和64年＝1989年まで）です。逆に足せば西暦に戻せます。" } },
    { "@type": "Question", name: "改元があった年はどちらの元号になりますか？", acceptedAnswer: { "@type": "Answer", text: "改元日の前後で元号が変わります。例えば2019年は4月30日までが平成31年、5月1日からが令和元年です。正確には月日で判断してください。" } },
    { "@type": "Question", name: "履歴書は西暦と和暦どちらで書くべきですか？", acceptedAnswer: { "@type": "Answer", text: "どちらでも構いませんが、書類全体で統一するのが基本です。指定がある場合はそれに従い、なければ西暦か和暦のどちらかにそろえて記入してください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">西暦・和暦変換ツールの使い方</h2>
      <p>
        変換方向（西暦→和暦／和暦→西暦）を選び、年を入力するだけで即座に変換します。
        履歴書や公的書類の年号記入、生まれ年の確認、書類の年月日の統一などに使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">元号と西暦の対応早見表</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">元号</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">期間</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">西暦への換算</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["令和", "2019年5月1日〜", "＋2018（令和6年＝2024年）"],
              ["平成", "1989年1月8日〜2019年4月30日", "＋1988（平成31年＝2019年）"],
              ["昭和", "1926年12月25日〜1989年1月7日", "＋1925（昭和64年＝1989年）"],
              ["大正", "1912年7月30日〜1926年12月25日", "＋1911（大正15年＝1926年）"],
              ["明治", "1868年〜1912年7月30日", "＋1867（明治45年＝1912年）"],
            ].map(([era, period, calc], i) => (
              <tr key={era} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-semibold text-violet-600 dark:text-violet-300">{era}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[12px]">{period}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[12px]">{calc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・生年月日から年齢・干支を求める <Link href="/tools/age-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">年齢計算</Link></li>
        <li>・2つの日付の差や○日後を求める <Link href="/tools/date-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">日数・日付計算</Link></li>
        <li>・履歴書用の証明写真を作る <Link href="/tools/id-photo" className="text-violet-600 dark:text-violet-400 hover:underline">証明写真作成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="西暦・和暦変換"
        description="西暦から令和・平成・昭和・大正・明治へ、和暦から西暦へワンタップで相互変換。元号対応の早見表つき。"
        icon="📆"
        slug="wareki-converter"
        seoContent={seoContent}
      >
        <WarekiConverter />
      </ToolLayout>
    </>
  );
}
