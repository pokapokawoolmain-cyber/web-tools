import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "学生向け";
const SLUG = "student";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "学生向け無料ツール一覧",
  description: "GPA計算など、大学生・高校生の学習・就活に役立つ無料ツール。",
  path: `/tools/${SLUG}`,
  keywords: ["GPA計算", "学生", "大学", "就活", "無料ツール"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="GPA計算など、大学生・高校生の学習・就活に役立つ無料ツール。"
      tools={tools}
    />
  );
}
