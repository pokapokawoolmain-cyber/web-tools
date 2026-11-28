// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("enhypen-blood-saga-tokyo-dome-goods")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜ENHYPEN",
    title: "BLOOD SAGA 東京ドームのグッズ",
    subLines: ["会場受取の時間・価格一覧・", "ペンライトの座席登録"],
  });
}
