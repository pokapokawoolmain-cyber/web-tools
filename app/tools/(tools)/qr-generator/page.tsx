import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { QrGenerator } from "./QrGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "QRコード生成",
  "URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。無料・登録不要。",
  "qr-generator",
  ["QRコード作成", "QR生成", "QRコード無料", "URL QR", "WiFi QR", "ダウンロード"]
);

export default function QrGeneratorPage() {
  return (
    <ToolLayout
      title="QRコード生成"
      description="URL・テキスト・WiFi情報をQRコードに変換。色変更・PNG/SVGダウンロード対応。"
      icon="📱"
    >
      <QrGenerator />
    </ToolLayout>
  );
}
