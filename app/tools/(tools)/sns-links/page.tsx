import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { generateToolMeta } from "@/lib/seo";
import { SnsLinks } from "./SnsLinks";

export const metadata: Metadata = generateToolMeta(
  "SNSプロフィールリンク生成",
  "X・Instagram・TikTok・YouTubeなど複数のSNSリンクをまとめた共有ページを即生成。",
  "sns-links",
  ["SNSリンクまとめ", "プロフィールリンク", "リンクまとめ", "SNS共有", "bio link"]
);

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="sns-links" title="SNSリンクまとめ" description="複数のSNSリンクをまとめた共有ページを即生成。" />
      <SnsLinks />
    </>
  );
}
