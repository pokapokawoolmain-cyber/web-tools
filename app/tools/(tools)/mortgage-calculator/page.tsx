import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { MortgageCalculator } from "./MortgageCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "住宅ローンシミュレーター",
  "借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計をグラフ付きで即計算。",
  "mortgage-calculator",
  ["住宅ローン計算", "ローン返済シミュレーション", "毎月返済額", "総返済額", "利息計算", "元利均等"]
);

const seoContent = (
  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">住宅ローンシミュレーターの使い方</h2>
    <p>借入金額・年利・返済期間を入力すると、元利均等返済方式での毎月返済額・総返済額・利息合計を自動計算します。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">元利均等返済とは？</h3>
    <p>毎月の返済額が一定になる最も一般的な返済方式です。返済初期は利息の割合が高く、後半になるほど元本が多く減っていきます。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">繰り上げ返済の効果</h3>
    <p>ローン残高が多い初期に繰り上げ返済を行うことで、利息を大幅に減らせます。本ツールで試算してから金融機関に相談しましょう。</p>
  </div>
);

export default function MortgageCalculatorPage() {
  return (
    <ToolLayout
      title="住宅ローンシミュレーター"
      description="借入金額・金利・年数を入力するだけ。毎月返済額・総返済額・利息合計を即計算します。"
      icon="🏠"
      slug="mortgage-calculator"
      seoContent={seoContent}
    >
      <MortgageCalculator />
    </ToolLayout>
  );
}
