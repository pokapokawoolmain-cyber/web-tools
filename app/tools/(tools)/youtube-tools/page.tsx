import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { YoutubeTools } from "./YoutubeTools";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "YouTube SEOツール",
  "タイトル文字数・ハッシュタグ最適化・サムネイル比率確認をまとめてチェック。動画SEO改善に。",
  "youtube-tools",
  ["YouTube SEO", "YouTubeタイトル", "ハッシュタグ", "サムネイル", "動画SEO", "チャンネル改善"]
);

export default function YoutubeToolsPage() {
  return (
    <ToolLayout
      title="YouTube SEOツール"
      description="タイトル文字数・ハッシュタグ最適化・サムネイル比率確認をまとめてチェック。"
      icon="🎥"
      slug="youtube-tools"
    >
      <YoutubeTools />
    </ToolLayout>
  );
}
