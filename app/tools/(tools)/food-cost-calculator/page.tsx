import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { FoodCostCalculator } from "./FoodCostCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "原価率計算ツール｜飲食店・カフェ向け食材原価・粗利計算【無料】",
  description:
    "食材費・販売価格を入力して原価率・粗利率・粗利額を即計算。複数食材・歩留まり・ロス率対応。目標原価率との比較と値上げ目安も表示。",
  path: "/tools/food-cost-calculator",
  keywords: ["飲食店 原価率 計算", "原価率 計算ツール 無料", "食材費 粗利 計算", "飲食店 原価管理"],
});

const seoContent = (
  <div className="space-y-6">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        原価率計算ツールの使い方
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        食材名・仕入れ価格・仕入れ量・1食あたりの使用量・歩留まりを食材ごとに入力し、販売価格と目標原価率を設定してください。
        合計原価・原価率・粗利率・粗利額がリアルタイムで計算されます。
        目標原価率を下回っている場合は緑色、超過している場合は赤色で警告を表示します。
        歩留まりとは、仕入れた食材のうち実際に使える割合です。例えばキャベツの外葉を除いた場合、歩留まりは85〜90%程度になります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        飲食業の原価率の目安
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-semibold rounded-tl-lg">業態</th>
              <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-semibold rounded-tr-lg">目安の原価率</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["居酒屋", "25〜30%"],
              ["ラーメン店", "25〜30%"],
              ["カフェ", "30〜40%"],
              ["カレー・丼もの", "20〜25%"],
              ["フレンチ・イタリアン", "35〜45%"],
            ].map(([gyotai, rate]) => (
              <tr key={gyotai} className="border-t border-slate-100 dark:border-zinc-800">
                <td className="p-3 text-slate-700 dark:text-slate-300">{gyotai}</td>
                <td className="p-3 font-semibold text-orange-600 dark:text-orange-400">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        ※ 原価率は業態・立地・客単価によって異なります。あくまで参考値としてお使いください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            原価率が高すぎる場合はどうすればよいですか？
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            仕入れ先の見直し・ロス削減・使用量の調整・販売価格の引き上げの4つのアプローチが有効です。
            まず食材の中で原価比率が高いものを特定し、代替食材の検討や仕入れ量の交渉を行いましょう。
            販売価格の引き上げが難しい場合は、セットメニュー化やサイドメニューとの組み合わせで客単価を上げる方法も効果的です。
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            歩留まりとは何ですか？
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            歩留まり（ぶどまり）とは、仕入れた食材のうち廃棄せずに使用できる割合を指します。
            例えば、魚の切り身は内臓・骨・皮を取り除くと歩留まりは60〜70%程度になります。
            歩留まりを正確に設定することで、実際の食材コストを正確に把握できます。
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            原価計算は税込・税抜どちらで行うべきですか？
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            一般的に原価率の計算は税抜価格で行います。仕入れ価格の消費税は仕入税額控除として還付されるため、
            実質的なコストは税抜価格です。このツールでは販売価格が税込・税抜どちらの入力かを選択でき、
            内部的に税抜ベースで原価率を計算しています。
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default function FoodCostCalculatorPage() {
  return (
    <ToolLayout
      title="原価率計算ツール"
      description="食材費・販売価格を入力して原価率・粗利を即計算。複数食材・歩留まり対応。"
      icon="🍽️"
      slug="food-cost-calculator"
      seoContent={seoContent}
    >
      <FoodCostCalculator />
    </ToolLayout>
  );
}
