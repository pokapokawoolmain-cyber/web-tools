// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("mrs-green-apple-shadows-kobe-goods")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜Mrs. GREEN APPLE",
    title: "SHADOWS 神戸のグッズと楽しみ方",
    subLines: ["価格一覧・購入制限・", "旅のしおり・FLYING GHOST"],
  });
}
