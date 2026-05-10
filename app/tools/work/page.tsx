import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "仕事・副業";
const SLUG = "work";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "仕事・副業ツール一覧",
  description: "履歴書・職務経歴書作成など、仕事と副業を効率化する無料ツール。",
  path: `/tools/${SLUG}`,
  keywords: ["履歴書", "職務経歴書", "副業", "仕事", "無料ツール"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="履歴書・職務経歴書作成など、仕事と副業を効率化する無料ツール。"
      tools={tools}
    />
  );
}
