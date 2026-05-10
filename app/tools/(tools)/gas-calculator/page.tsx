import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { GasCalculator } from "./GasCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "ガソリン代計算",
  "走行距離・燃費・ガソリン価格を入力。片道・往復・月間のガソリン代をリアルタイムで計算。",
  "gas-calculator",
  ["ガソリン代", "燃費計算", "交通費", "ドライブ費用", "カーライフ", "通勤費"]
);

export default function GasCalculatorPage() {
  return (
    <ToolLayout
      title="ガソリン代計算"
      description="走行距離・燃費・ガソリン単価を入力。片道・往復・月間のガソリン代を即計算します。"
      icon="⛽"
      slug="gas-calculator"
    >
      <GasCalculator />
    </ToolLayout>
  );
}
