import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { HeicConverter } from "./HeicConverter";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "HEIC→JPG変換",
  "iPhoneで撮影したHEIC形式の写真をJPGに無料変換。ブラウザ完結でプライバシー安全。",
  "heic-to-jpg",
  ["HEIC変換", "HEIC JPG", "iPhone写真", "HEICをJPGに変換", "無料", "オンライン"]
);

export default function HeicToJpgPage() {
  return (
    <ToolLayout
      title="HEIC → JPG 変換"
      description="iPhoneの写真（HEIC形式）をJPGに変換。ブラウザ完結・サーバー送信なし・無料。"
      icon="🖼️"
    >
      <HeicConverter />
    </ToolLayout>
  );
}
