import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PercentageCalculator } from "./PercentageCalculator";

export const metadata: Metadata = generateMeta({
  title: "パーセント計算機｜30%オフ後さらに10%オフはいくつ？連続割引・税込み対応【無料】",
  description:
    "「30%オフのあとさらに10%オフ」「割引後の税込み価格」など、単純な電卓では計算しにくい複合パーセント計算に対応。「2000円の15%」「30点は40点満点の何%」といった基本計算から、連続割引・増減率まで5モードで即計算。登録不要・スマホ対応・無料。",
  path: "/tools/percentage-calculator",
  keywords: [
    "パーセント 計算",
    "割合 計算",
    "百分率 計算",
    "何パーセント 計算",
    "割引 計算",
    "増減率 計算",
    "パーセント 出し方",
    "％ 計算 やり方",
    "何パーセントか計算",
    "円のパーセント計算",
    "パーセントオフ 計算",
    "30%オフ 10%オフ 計算",
    "割引 重ねがけ 計算",
    "連続割引 計算",
    "割引 税込み 計算",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "パーセント計算機", icon: "％", desc: "30%オフ後さらに10%オフはいくつ？連続割引・税込み対応" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "パーセント（割合）の出し方は？", acceptedAnswer: { "@type": "Answer", text: "「対象 ÷ 全体 × 100」で求めます。例えば40点満点で30点なら、30 ÷ 40 × 100 ＝ 75% です。本ツールの「◯は△の何%」モードに数字を入れると自動で計算します。" } },
    { "@type": "Question", name: "20%オフの値段を計算したい。", acceptedAnswer: { "@type": "Answer", text: "「◯を△%増減」モードで、もとの値段と20を入れると20%減の金額（割引後の価格）が表示されます。例えば2,000円の20%オフは1,600円です。" } },
    { "@type": "Question", name: "前年比・増減率はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "「◯→△の増減率」モードを使い、変化前と変化後の数を入れます。増減率 ＝（変化後 − 変化前）÷ 変化前 × 100 で、プラスなら増加、マイナスなら減少です。" } },
    { "@type": "Question", name: "入力した数字は送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。計算はすべてブラウザ内で完結し、入力した数字が外部に送信されることはありません。" } },
    { "@type": "Question", name: "30%オフのあとさらに10%オフはいくつになりますか？", acceptedAnswer: { "@type": "Answer", text: "足し算で40%オフにはならず、掛け算で計算します。もとの価格 ×（1−0.3）×（1−0.1）＝ もとの価格 × 0.63 となり、実質37%オフです。「連続割引＋税込み」モードにもとの価格と2つの割引率を入れると自動計算できます。" } },
    { "@type": "Question", name: "割引後の税込み価格も計算できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。「連続割引＋税込み」モードで税率（10%・8%・なし）を選ぶと、割引後の価格にさらに消費税を掛けた最終価格を計算します。割引→税込みの順に掛け算するのが正しい計算順序です。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5つのモードでできること</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">モード</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">計算式</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">使う場面</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["◯の△%はいくつ", "◯ × △ ÷ 100", "消費税額・ポイント・手数料"],
              ["◯は△の何%", "◯ ÷ △ × 100", "達成率・得点率・シェア"],
              ["◯を△%増減", "◯ ×（1 ± △÷100）", "割引後価格・値上げ後価格"],
              ["◯→△の増減率", "（△−◯）÷ ◯ × 100", "前年比・成長率・変化率"],
              ["連続割引＋税込み", "◯ ×（1−1回目%）×（1−2回目%）×（1+税率）", "重ねがけクーポン・セール品の税込み最終価格"],
            ].map(([m, f, use], i) => (
              <tr key={m as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{m}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-[12px]">{f}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある計算の例</h2>
      <ul className="space-y-1.5">
        <li>・<strong>2,000円の15%：</strong>2000 × 15 ÷ 100 ＝ 300円</li>
        <li>・<strong>30点は40点満点の何%：</strong>30 ÷ 40 × 100 ＝ 75%</li>
        <li>・<strong>3,000円の20%オフ：</strong>3000 ×（1 − 0.2）＝ 2,400円</li>
        <li>・<strong>売上が500→650万に：</strong>（650 − 500）÷ 500 × 100 ＝ 30%増</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">30%オフ後さらに10%オフはいくつ？連続割引の早見表</h2>
      <p className="mb-3">
        「30%オフのあとさらに10%オフ」は<strong>40%オフではなく、実質37%オフ</strong>です。割引は足し算ではなく掛け算（もとの価格 ×（1−1回目の割引率）×（1−2回目の割引率））で計算するため、単純な暗算や電卓の「％」ボタンでは正しい答えが出ません。よくある組み合わせの実質割引率をまとめました。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">1回目の割引</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2回目の割引</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">単純合計（誤り）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">実質の割引率（正しい）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["30%オフ", "10%オフ", "40%オフ", "37%オフ"],
              ["20%オフ", "20%オフ", "40%オフ", "36%オフ"],
              ["50%オフ", "10%オフ", "60%オフ", "55%オフ"],
              ["30%オフ", "30%オフ", "60%オフ", "51%オフ"],
              ["10%オフ", "10%オフ", "20%オフ", "19%オフ"],
            ].map(([d1, d2, wrong, correct], i) => (
              <tr key={d1 + d2} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{d1}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{d2}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-400 line-through">{wrong}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-semibold text-violet-600 dark:text-violet-400">{correct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2">
        ※ 割引の順序を入れ替えても最終価格は変わりません（掛け算の順序は結果に影響しないため）。税込み価格まで含めて計算したい場合は、上の「連続割引＋税込み」モードをご利用ください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">間違えやすいポイント</h2>
      <ul className="space-y-1.5">
        <li>・<strong>「%増」と「%ポイント増」は別物：</strong>10%が12%になったとき、上がったのは「2%ポイント」ですが、割合としては「20%増」です。</li>
        <li>・<strong>20%増→20%減で元に戻らない：</strong>100を20%増やすと120、そこから20%減らすと96。掛け算のため、同じ割合でも元の値には戻りません。</li>
        <li>・<strong>割引の重ねがけ：</strong>「30%オフ後にさらに10%オフ」は40%オフではなく、0.7 × 0.9 ＝ 0.63、つまり37%オフです。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・税込・税抜を計算する <Link href="/tools/tax-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">消費税計算</Link></li>
        <li>・飲み会の割り勘を計算する <Link href="/tools/warikan-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">割り勘計算機</Link></li>
        <li>・BMIを計算する <Link href="/tools/bmi-calculator" className="text-violet-600 dark:text-violet-400 hover:underline">BMI計算</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="パーセント計算機"
        description="「◯の△%」「◯は△の何%」「◯を△%増減」「増減率」「連続割引＋税込み」の5モードで、割引・割合・前年比をすぐ計算。"
        icon="％"
        slug="percentage-calculator"
        seoContent={seoContent}
      >
        <PercentageCalculator />
      </ToolLayout>
    </>
  );
}
