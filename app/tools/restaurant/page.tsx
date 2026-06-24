import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "飲食店";
const SLUG = "restaurant";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "飲食店向けツール一覧",
  description: "原価率計算・メニュー価格シミュレーター・メニュー表作成・Google口コミ返信・POP作成など、飲食店の日常業務に役立つ無料ツール集。",
  path: `/tools/${SLUG}`,
  keywords: ["飲食店", "原価率", "メニュー表", "口コミ返信", "POP作成", "無料ツール"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="原価率計算・メニュー価格シミュレーター・メニュー表作成・Google口コミ返信・POP作成など、飲食店の日常業務に役立つ無料ツール集。"
      tools={tools}
    />
  );
}
