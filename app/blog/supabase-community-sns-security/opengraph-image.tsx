// 記事の OG 画像（SNS Starter Kit ガイド記事の共通の形）
import { OG_SIZE, snsKitOgImage } from "../_components/sns-kit/og";

export const alt = "Supabaseで会員制コミュニティを作るときの安全チェックリスト｜RLS・Storage・管理者権限・退会";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return snsKitOgImage({
    kicker: "開発者向けチェックリスト",
    title: ["Supabase 会員制コミュニティの", "安全チェックリスト"],
    sub: ["RLS・Storage・管理者権限・退会まで"],
  });
}
