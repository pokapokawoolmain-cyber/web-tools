// 記事の OG 画像（SNS Starter Kit ガイド記事の共通の形）
import { OG_SIZE, snsKitOgImage } from "../_components/sns-kit/og";

export const alt = "自分たちのコミュニティSNSを持つには｜LINE・Discord・自分たちのSNSの比べ方と、始める前に決めること";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return snsKitOgImage({
    kicker: "コミュニティSNSを持つには",
    title: ["自分たちの", "コミュニティSNSを持つには"],
    sub: ["LINE・Discord・自分たちのSNSの比べ方と、", "始める前に決めること"],
  });
}
