import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { GasCalculator } from "./GasCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "ガソリン代計算",
  "走行距離・燃費・ガソリン価格を入力するだけで片道・往復・月間のガソリン代を即計算。通勤費・旅行費用・経費精算に。",
  "gas-calculator",
  ["ガソリン代 計算 無料", "燃費計算 ツール", "交通費 ガソリン 計算方法", "通勤費 車 計算", "ドライブ 費用 見積もり"]
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ガソリン代の計算式を教えてください",
      acceptedAnswer: { "@type": "Answer", text: "ガソリン代 = 走行距離（km） ÷ 燃費（km/L） × ガソリン単価（円/L）で計算します。例えば、100km走行・燃費15km/L・ガソリン165円/Lの場合、100÷15×165=1,100円となります。" },
    },
    {
      "@type": "Question",
      name: "燃費の平均はどのくらいですか？",
      acceptedAnswer: { "@type": "Answer", text: "普通乗用車（ガソリン車）の実燃費は10〜15km/L程度が一般的です。ハイブリッド車は20〜25km/L、軽自動車は15〜20km/Lが目安です。高速道路走行では燃費が改善される傾向があります。" },
    },
    {
      "@type": "Question",
      name: "通勤費の非課税上限はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "現在、マイカー通勤の非課税通勤手当の上限は片道の通勤距離により異なります。2km以上10km未満は月4,200円、10km以上15km未満は月7,100円、25km以上35km未満は月18,700円などです。詳細は国税庁の公式サイトでご確認ください。" },
    },
    {
      "@type": "Question",
      name: "会社への交通費精算でガソリン代の計算方法は？",
      acceptedAnswer: { "@type": "Answer", text: "会社によって計算方法が異なりますが、一般的には「走行距離（km）× 会社規定の単価（円/km）」で計算します。単価は10〜20円/kmが多いです。本ツールで実費を計算し、会社規定との差を確認するのにも使えます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      ガソリン代計算ツールの使い方
    </h2>
    <p>
      走行距離・燃費・ガソリン単価の3つを入力するだけで、片道・往復・1か月分（営業日ベース）のガソリン代が自動計算されます。
      通勤費の確認・ドライブの費用見積もり・経費精算などに活用してください。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      ガソリン代の計算式
    </h3>
    <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800 text-[13px] font-mono">
      ガソリン代 = 走行距離（km） ÷ 燃費（km/L） × ガソリン単価（円/L）
    </div>
    <p className="text-[14px]">
      例：通勤片道20km・燃費15km/L・ガソリン168円/Lの場合<br />
      20 ÷ 15 × 168 = <strong className="text-blue-600 dark:text-blue-400">224円（片道）</strong>、往復では<strong className="text-blue-600 dark:text-blue-400">448円</strong>
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      主な活用シーン
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>毎月の通勤費確認</strong>：会社から支給される通勤手当と実費を比較するのに便利。月額ガソリン代が手当をオーバーしていないか確認できます。</li>
      <li><strong>長距離ドライブの費用計画</strong>：旅行前に往復のガソリン代を計算し、全体の旅行予算を立てましょう。高速代と合わせて比較することで、新幹線や飛行機との費用差もわかります。</li>
      <li><strong>仕事の出張・営業経費</strong>：マイカーで顧客訪問する際の実際のガソリン代を計算して経費精算に。</li>
      <li><strong>燃費改善の効果確認</strong>：燃費が10km/Lから12km/Lに改善した場合、年間のガソリン代がどれだけ削減されるかシミュレーションできます。</li>
      <li><strong>電気自動車との比較</strong>：ガソリン車との月間燃料費の差から、EV購入後の回収期間を計算する際の参考値として使えます。</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      燃費・ガソリン価格の目安（参考）
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[12px]">
            <th className="pb-2 font-medium">車種カテゴリ</th>
            <th className="pb-2 font-medium">実燃費の目安</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["コンパクトカー（ガソリン）", "13〜18 km/L"],
            ["普通乗用車（ガソリン）", "10〜15 km/L"],
            ["軽自動車（ガソリン）", "15〜22 km/L"],
            ["ミニバン・SUV", "8〜14 km/L"],
            ["ハイブリッド車", "20〜28 km/L"],
            ["プラグインハイブリッド（HV走行）", "18〜25 km/L"],
          ].map(([cat, fuel]) => (
            <tr key={cat} className="border-t border-slate-100 dark:border-zinc-800">
              <td className="py-1.5 text-slate-700 dark:text-zinc-300">{cat}</td>
              <td className="py-1.5 font-mono text-blue-600 dark:text-blue-400">{fuel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-[12px] text-slate-400 dark:text-zinc-500">
      ※実燃費は走行条件・気温・エアコン使用状況などにより大きく異なります。カタログ燃費の70〜85%程度が実燃費の目安です。
    </p>
  </div>
);

export default function GasCalculatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ガソリン代計算"
        description="走行距離・燃費・ガソリン単価を入力。片道・往復・月間のガソリン代を即計算します。"
        icon="⛽"
        slug="gas-calculator"
        seoContent={seoContent}
      >
        <GasCalculator />
      </ToolLayout>
    </>
  );
}
