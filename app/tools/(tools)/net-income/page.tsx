import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateToolMeta } from "@/lib/seo";
import { NetIncome } from "./NetIncome";

export const metadata: Metadata = generateToolMeta(
  "手取り計算",
  "年収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。",
  "net-income",
  ["手取り計算", "年収 手取り", "税金計算", "社会保険料", "月収 手取り"]
);

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="net-income" title="手取り計算" description="年収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。" />
      <NetIncome />
    </>
  );
}
