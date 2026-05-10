import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { ShortLink } from "./ShortLink";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "URL短縮 & QR生成",
  "長いURLをコンパクトに整形してQRコードも同時生成。コピー・ダウンロードもワンクリック。",
  "short-link",
  ["URL短縮", "短縮リンク", "QRコード生成", "リンク短縮", "無料"]
);

export default function ShortLinkPage() {
  return (
    <ToolLayout
      title="URL短縮 & QR生成"
      description="長いURLをコンパクトに整形。QRコードも同時生成します。"
      icon="🔗"
      slug="short-link"
    >
      <ShortLink />
    </ToolLayout>
  );
}
