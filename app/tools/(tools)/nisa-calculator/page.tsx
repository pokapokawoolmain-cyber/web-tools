import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { NisaCalculator } from "./NisaCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "新NISA積立計算",
  "毎月の積立額・運用期間・利回りを入力するだけで将来の資産額を計算。複利効果を可視化。",
  "nisa-calculator",
  ["新NISA", "積立NISA", "複利計算", "資産形成", "投資シミュレーション", "つみたて"]
);

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      新NISA積立計算の使い方
    </h2>
    <p>
      新NISAは2024年から始まった非課税投資制度です。年間360万円まで投資でき、利益が非課税になります。本ツールでは毎月の積立額・年数・利回りを入力して将来の資産額を計算できます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      複利の力
    </h3>
    <p>
      毎月3万円を年利5%で20年積み立てると、元本720万円が約1,233万円になります。複利は「利息にも利息がつく」仕組みで、長期投資ほど効果が大きくなります。
    </p>
  </div>
);

export default function NisaCalculatorPage() {
  return (
    <ToolLayout
      title="新NISA積立計算"
      description="毎月の積立額と運用期間を入力するだけ。複利効果で将来いくらになるかを可視化します。"
      icon="📈"
      slug="nisa-calculator"
      seoContent={seoContent}
    >
      <NisaCalculator />
    </ToolLayout>
  );
}
