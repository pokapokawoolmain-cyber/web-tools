import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "テキスト・Web";
const SLUG = "text";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "テキスト・Webツール一覧",
  description: "文字数カウント・Markdownエディタ・パスワード生成・QRコード・Wi-Fi QRなど。",
  path: `/tools/${SLUG}`,
  keywords: ["文字数カウント", "QRコード", "パスワード生成", "Markdown", "無料"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="文字数カウント・Markdownエディタ・パスワード生成・QRコード・Wi-Fi QRなど。"
      tools={tools}
    />
  );
}
