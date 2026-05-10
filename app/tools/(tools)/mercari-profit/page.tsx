import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { MercariCalculator } from "./MercariCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "メルカリ利益計算",
  "販売価格・購入価格・送料を入力するだけ。手数料10%を引いた実質手取り利益を瞬時に計算。",
  "mercari-profit",
  ["メルカリ", "利益計算", "手数料10%", "送料", "フリマ", "副業", "せどり"]
);

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      メルカリの手数料について
    </h2>
    <p>
      メルカリの販売手数料は販売価格の10%です。さらに送料・仕入れ値・梱包費などのコストを引いた金額が実際の利益になります。本ツールはこれらを自動計算します。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      利益率の目安
    </h3>
    <p>
      メルカリで利益率20〜30%以上を確保できれば収益性が高いとされています。送料や梱包費も忘れずに計算しましょう。
    </p>
  </div>
);

export default function MercariProfitPage() {
  return (
    <ToolLayout
      title="メルカリ利益計算"
      description="販売価格・仕入れ価格・送料を入力するだけ。手数料10%を引いた実質手取りを計算します。"
      icon="🛍️"
      slug="mercari-profit"
      seoContent={seoContent}
    >
      <MercariCalculator />
    </ToolLayout>
  );
}
