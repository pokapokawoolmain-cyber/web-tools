import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "お金・投資";
const SLUG = "finance";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "お金・投資の無料ツール一覧",
  description: "FIREシミュレーター・NISA積立・住宅ローン・ふるさと納税など、お金と投資に関する無料計算ツール。",
  path: `/tools/${SLUG}`,
  keywords: ["お金", "投資", "FIRE", "NISA", "無料ツール"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="FIREシミュレーター・NISA積立・住宅ローン・ふるさと納税など、お金と投資に関する無料計算ツール。"
      tools={tools}
    />
  );
}
