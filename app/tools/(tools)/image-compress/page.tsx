import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ImageCompressor } from "./ImageCompressor";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "画像圧縮ツール",
  "JPG・PNG・WebP画像をブラウザ上で高品質のまま圧縮。ファイルサイズを最大80%削減。",
  "image-compress",
  ["画像圧縮", "JPG圧縮", "PNG圧縮", "ファイルサイズ削減", "無料", "オンライン"]
);

export default function ImageCompressPage() {
  return (
    <ToolLayout
      title="画像圧縮ツール"
      description="JPG・PNG・WebP画像をブラウザ上で圧縮。サーバーに送信しないのでプライバシー安全。"
      icon="🗜️"
      slug="image-compress"
    >
      <ImageCompressor />
    </ToolLayout>
  );
}
