// 記事の OG 画像（Mochico ガイド記事共通のデザイン。lib/mochico/article-og.tsx）
import { getBlogPost } from "@/data/blog-posts";
import { MOCHICO_OG_SIZE, renderMochicoArticleOg } from "@/lib/mochico/article-og";

export const alt = getBlogPost("comiket-109-ticket-guide")!.title;
export const size = MOCHICO_OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderMochicoArticleOg({
    kicker: "推し活ガイド｜イベント",
    title: "コミケC109 チケット・リストバンド",
    subLines: ["アーリー抽選11/16〜30・", "リストバンド12/5から・本人確認"],
  });
}
