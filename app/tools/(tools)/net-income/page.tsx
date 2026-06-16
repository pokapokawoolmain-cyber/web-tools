import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateMeta } from "@/lib/seo";
import { NetIncome } from "./NetIncome";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "手取り計算｜年収・月収から手取りをシミュレーション【無料】",
  description:
    "年収・月収を入力するだけで手取り額を計算。社会保険料・所得税・住民税の内訳も確認できます。無料・登録不要・スマホ対応。",
  path: "/tools/net-income",
  keywords: [
    "年収 計算", "手取り 計算", "手取り シミュレーション", "額面 手取り 換算",
    "月収 手取り", "収入 手取り 計算", "手取り 計算 ツール",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "手取り計算", icon: "💴", desc: "年収・月収から手取りを計算。税金の内訳つき。" }).toString()}`,
});

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="net-income" title="手取り計算" description="年収・月収を入力するだけで月間・年間の手取り額を計算。社会保険料・所得税・住民税の内訳も確認。" />
      <NetIncome />
      <div className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <RelatedArticles toolId="net-income" />
        </div>
      </div>
    </>
  );
}
