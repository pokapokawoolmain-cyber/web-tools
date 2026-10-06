// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("live-goods-shopping-list")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活・グッズ管理",
    title: "ライブ物販の買い物リストの作り方",
    subLines: ["予算と購入制限を、", "物販の前に整理するコツ"],
  });
}
