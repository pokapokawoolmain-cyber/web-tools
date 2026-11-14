// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("jump-festa-2027-goods")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜イベント物販",
    title: "ジャンプフェスタ2027 グッズの買い方",
    subLines: ["事前抽選11/24〜30・当日抽選・", "支払い方法と日程まとめ"],
  });
}
