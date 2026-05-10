import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "画像・PDF";
const SLUG = "image";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "画像・PDF変換ツール一覧",
  description: "HEIC変換・画像圧縮・動画圧縮・リサイズ・証明写真など、画像とPDFの変換ツール。",
  path: `/tools/${SLUG}`,
  keywords: ["画像変換", "PDF", "HEIC", "画像圧縮", "証明写真", "無料"],
});

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="HEIC変換・画像圧縮・動画圧縮・リサイズ・証明写真など、画像とPDFの変換ツール。"
      tools={tools}
    />
  );
}
