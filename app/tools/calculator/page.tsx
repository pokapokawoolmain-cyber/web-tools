import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "計算ツール";
const SLUG = "calculator";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "計算ツール一覧",
  description: "メルカリ利益・ガソリン代・シフト給与・ポイント還元など、日常の計算をかんたんに。",
  path: `/tools/${SLUG}`,
  keywords: ["計算ツール", "メルカリ", "ガソリン代", "給与計算", "無料"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="メルカリ利益・ガソリン代・シフト給与・ポイント還元など、日常の計算をかんたんに。"
      tools={tools}
    />
  );
}
