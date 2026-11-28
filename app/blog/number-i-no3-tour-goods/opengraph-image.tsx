// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("number-i-no3-tour-goods")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜Number_i",
    title: "No.Ⅲ 大阪・東京のグッズ",
    subLines: ["整理券なしの物販時間・", "価格一覧・ペンライト登録"],
  });
}
