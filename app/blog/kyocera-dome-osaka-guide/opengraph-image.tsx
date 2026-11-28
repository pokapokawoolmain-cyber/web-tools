// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("kyocera-dome-osaka-guide")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜会場ガイド",
    title: "京セラドーム大阪 完全ガイド",
    subLines: ["ロッカーの場所・フロア図・", "帰りの駅の使い分け"],
  });
}
