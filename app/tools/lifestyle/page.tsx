import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "生活・副業";
const SLUG = "lifestyle";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "生活・副業ツール一覧",
  description: "副業利益計算・YouTubeツール・SNSリンクまとめなど、生活や副業に役立つ無料ツール。",
  path: `/tools/${SLUG}`,
  keywords: ["副業", "SNS", "YouTube", "生活", "無料ツール"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="副業利益計算・YouTubeツール・SNSリンクまとめなど、生活や副業に役立つ無料ツール。"
      tools={tools}
    />
  );
}
