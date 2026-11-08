// 記事の OG 画像（SNS Starter Kit ガイド記事の共通の形）
import { OG_SIZE, snsKitOgImage } from "../_components/sns-kit/og";

export const alt = "コミュニティSNSの通報・ブロック・管理画面の作り方｜後回しにすると困る理由と、よくある抜け漏れ";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return snsKitOgImage({
    kicker: "開発者向け",
    title: ["通報・ブロック・", "管理画面の作り方"],
    sub: ["後回しにすると困る理由と、", "よくある抜け漏れ"],
  });
}
