// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("disney-christmas-2026-guide")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜テーマパーク",
    title: "ディズニー・クリスマス2026はいつから",
    subLines: ["パレード・ジョリーフード・プラザ・", "ランドとシーの違い"],
  });
}
