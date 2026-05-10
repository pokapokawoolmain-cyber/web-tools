import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { PointSimulator } from "./PointSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "ポイント還元シミュレーター",
  "PayPay・楽天・dポイントなど主要サービスの還元率を比較。月間・年間の獲得ポイントを一覧計算。",
  "point-simulator",
  ["ポイント還元計算", "クレカ還元率比較", "PayPay還元", "楽天ポイント", "dポイント", "年間ポイント"]
);

export default function PointSimulatorPage() {
  return (
    <ToolLayout
      title="ポイント還元シミュレーター"
      description="月の利用金額を入力するだけ。PayPay・楽天・クレカなど主要サービスの年間獲得ポイントを一括比較。"
      icon="💳"
      slug="point-simulator"
    >
      <PointSimulator />
    </ToolLayout>
  );
}
