import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateToolMeta } from "@/lib/seo";
import { NetIncome } from "./NetIncome";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

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
      <div className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <RelatedArticles toolId="net-income" />
        </div>
      </div>
    </>
  );
}
