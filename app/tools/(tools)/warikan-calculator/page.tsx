import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { WarikanCalculator } from "./WarikanCalculator";

export const metadata: Metadata = generateMeta({
  title: "割り勘計算機【無料】合計と人数で1人いくらか即計算｜端数・傾斜配分対応",
  description:
    "飲み会や旅行の合計金額と人数を入れるだけで1人あたりの割り勘額を自動計算。100円単位などの端数の丸めや、上司・年上が多めに払う傾斜配分にも対応し、幹事の集金の過不足まで表示します。登録不要・スマホ対応・無料。",
  path: "/tools/warikan-calculator",
  keywords: [
    "割り勘 計算",
    "割り勘 計算機",
    "割り勘 アプリ",
    "飲み会 割り勘 計算",
    "1人 いくら 計算",
    "傾斜配分 割り勘",
    "幹事 集金 計算",
    "割り勘 端数",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "割り勘計算機", icon: "💸", desc: "合計と人数で1人いくらか即計算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "端数はどう処理されますか？", acceptedAnswer: { "@type": "Answer", text: "選んだ単位（10円・100円・500円など）で1人あたりを切り上げて計算します。切り上げにより集めた合計が実費をわずかに上回るため、その差額は「幹事が受け取る」または「次回に繰り越す」とスマートです。" } },
    { "@type": "Question", name: "上司や年上が多めに払う割り勘もできますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「傾斜配分」をオンにし、多めに払う人数と1人あたりの上乗せ額を入力すると、多く払う人とその他の人の金額を分けて計算します。集金合計と実費の差も表示します。" } },
    { "@type": "Question", name: "傾斜配分の相場はどのくらいですか？", acceptedAnswer: { "@type": "Answer", text: "明確な決まりはありませんが、一般的には均等額に対して上司・年長者が1.5〜2倍程度、新人や学生は少なめ、という配分がよく使われます。金額でいうと均等額＋1,000〜3,000円を上乗せするケースが多いです。" } },
    { "@type": "Question", name: "入力した金額は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。計算はすべてブラウザ内で完結し、入力した金額や人数が外部に送信されることはありません。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">割り勘計算機の使い方</h2>
      <p>
        飲み会・旅行・ランチ会などの<strong>合計金額</strong>と<strong>人数</strong>を入力するだけで、1人あたりの金額がすぐにわかります。
        さらに「1人あたりの丸め」を選べば、集金しやすい100円単位などにそろえられ、切り上げによる差額（幹事の調整分）も自動で表示します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">端数をきれいに処理するコツ</h2>
      <p className="mb-3">
        「1人3,847円です」と言われても集金は大変です。<strong>100円単位に切り上げて3,900円</strong>にすれば、お釣りのやり取りが減り、集金がスムーズになります。
        本ツールは切り上げで計算するため集金合計が実費をわずかに上回りますが、この差額は次のように扱うのが定番です。
      </p>
      <ul className="space-y-1.5">
        <li>・幹事が予約や取りまとめの手間賃として受け取る</li>
        <li>・次回の飲み会費用として積み立てる（プール金）</li>
        <li>・二次会やタクシー代の一部に充てる</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">傾斜配分（多めに払う）の目安</h2>
      <p className="mb-3">
        職場の飲み会などでは、立場に応じて金額に差をつける「傾斜配分」がよく行われます。厳密なルールはありませんが、目安は次のとおりです。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">立場</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">均等額に対する目安</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["役職者・上司", "1.5〜2倍（＋2,000〜3,000円）"],
              ["先輩・年長者", "1.2〜1.5倍（＋1,000〜2,000円）"],
              ["一般社員", "均等額どおり"],
              ["新人・後輩・学生", "0.5〜0.8倍（少なめ）"],
            ].map(([role, ratio], i) => (
              <tr key={role as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{role}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
        あくまで一般的な目安です。関係性や地域の慣習によって異なります。金額の差が気まずくならないよう、事前にさりげなく伝えておくと角が立ちません。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">幹事が損しないためのポイント</h2>
      <ul className="space-y-1.5">
        <li>・予約時に「1人あたり〇〇円」を先に告知しておくと集金トラブルが減ります</li>
        <li>・当日欠席・遅刻のキャンセル料の扱いを事前に決めておく</li>
        <li>・クレジットカードで一括払いすればポイントが貯まり、集金は現金や送金アプリで受け取れます</li>
        <li>・端数の切り上げ分を幹事が受け取ることは、手間への配慮として広く受け入れられています</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・割合や増減を計算する <Link href="/tools/percentage-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">パーセント計算機</Link></li>
        <li>・税込・税抜を計算する <Link href="/tools/tax-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">消費税計算</Link></li>
        <li>・ご祝儀・会費の相場を調べる <Link href="/tools/shugi-maker" className="text-violet-600 dark:text-violet-400 hover:underline">祝儀袋メーカー</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="割り勘計算機"
        description="合計金額と人数から1人あたりの割り勘額を即計算。100円単位などの端数の丸めや、上司が多めに払う傾斜配分にも対応。"
        icon="💸"
        slug="warikan-calculator"
        seoContent={seoContent}
      >
        <WarikanCalculator />
      </ToolLayout>
    </>
  );
}
