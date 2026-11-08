// 記事の OG 画像（SNS Starter Kit ガイド記事の共通の形）
import { OG_SIZE, snsKitOgImage } from "../_components/sns-kit/og";

export const alt = "Claude Codeでコミュニティ用のSNSを作る流れ｜用意するもの・費用の目安・つまずきやすいところ";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return snsKitOgImage({
    kicker: "Claude Code でSNSづくり",
    title: ["Claude Codeで", "コミュニティSNSを作る流れ"],
    sub: ["用意するもの・費用の目安・", "つまずきやすいところ"],
  });
}
