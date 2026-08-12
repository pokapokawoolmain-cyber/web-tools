import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { TaxCalculator } from "./TaxCalculator";

export const metadata: Metadata = generateMeta({
  title: "消費税計算【無料】税込・税抜をワンタップ変換｜10%・8%対応",
  description:
    "金額を入力するだけで税抜→税込・税込→税抜を自動計算。消費税10%・軽減税率8%・任意の税率に対応し、消費税額の内訳も表示。切り捨て・四捨五入・切り上げの端数処理も選べます。無料・登録不要・スマホ対応。",
  path: "/tools/tax-calculator",
  keywords: [
    "消費税 計算",
    "税込 計算",
    "税抜 計算",
    "税込 税抜 変換",
    "消費税 10% 計算",
    "軽減税率 8% 計算",
    "税抜 から 税込",
    "税込 から 税抜",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "消費税計算", icon: "🧮", desc: "税込・税抜をワンタップ変換。10%/8%対応" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "税抜から税込はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "税込価格 ＝ 税抜価格 ×（1＋税率）で求めます。消費税10%なら税抜価格に1.1を掛けます。例えば税抜1,000円は税込1,100円です。" } },
    { "@type": "Question", name: "税込から税抜はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "税抜価格 ＝ 税込価格 ÷（1＋税率）で求めます。消費税10%なら税込価格を1.1で割ります。例えば税込1,100円は税抜1,000円です。" } },
    { "@type": "Question", name: "8%（軽減税率）はどんな商品に使いますか？", acceptedAnswer: { "@type": "Answer", text: "酒類・外食を除く飲食料品と、週2回以上発行される定期購読の新聞などが軽減税率8%の対象です。それ以外は標準税率10%です。" } },
    { "@type": "Question", name: "消費税の端数はどう処理すればいいですか？", acceptedAnswer: { "@type": "Answer", text: "1円未満の端数の処理方法（切り捨て・四捨五入・切り上げ）は事業者が任意に決められます。取引先やレジの設定に合わせて選んでください。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">消費税計算ツールの使い方</h2>
      <p>
        変換方向（税抜→税込／税込→税抜）を選び、金額を入力するだけで、税込・税抜・消費税額が同時に表示されます。
        税率は10%・軽減税率8%のほか、任意の税率も指定できます。消費税額の端数処理も切り替えられるので、請求書や見積書の金額合わせにそのまま使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">税込・税抜の計算式</h2>
      <ul className="space-y-1.5">
        <li>・<strong>税抜 → 税込：</strong>税込 ＝ 税抜 ×（1 ＋ 税率）。10%なら ×1.1、8%なら ×1.08。</li>
        <li>・<strong>税込 → 税抜：</strong>税抜 ＝ 税込 ÷（1 ＋ 税率）。10%なら ÷1.1、8%なら ÷1.08。</li>
        <li>・<strong>消費税額：</strong>税込 − 税抜。1円未満は事業者ごとに端数処理します。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10%・8%の早見（税抜→税込）</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">税抜</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-right">税込（10%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-right">税込（8%）</th>
            </tr>
          </thead>
          <tbody>
            {[100, 500, 1000, 3000, 5000, 10000, 30000, 100000].map((n, i) => (
              <tr key={n} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">¥{n.toLocaleString()}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-right font-mono">¥{Math.floor(n * 1.1).toLocaleString()}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-right font-mono">¥{Math.floor(n * 1.08).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-slate-400 dark:text-zinc-500">※ 消費税額を切り捨てで計算した目安です。</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・請求書を作成する <Link href="/tools/invoice-generator" className="text-violet-600 dark:text-violet-400 hover:underline">請求書作成</Link></li>
        <li>・見積書を作成する <Link href="/tools/estimate-generator" className="text-violet-600 dark:text-violet-400 hover:underline">見積書作成</Link></li>
        <li>・粗利・原価から利益を計算する <Link href="/tools/gross-profit-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">粗利計算</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="消費税計算"
        description="税抜⇔税込をワンタップで変換。消費税10%・軽減税率8%・任意税率に対応し、消費税額の内訳と端数処理も選べます。"
        icon="🧮"
        slug="tax-calculator"
        seoContent={seoContent}
      >
        <TaxCalculator />
      </ToolLayout>
    </>
  );
}
