// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("mochico-how-to-use")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "Mochico 使い方ガイド",
    title: "Mochico（モチコ）の使い方",
    subLines: ["推しグッズ管理アプリの", "はじめ方・共有・ホーム画面追加"],
  });
}
