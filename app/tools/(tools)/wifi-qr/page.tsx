import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { WifiQr } from "./WifiQr";

export const metadata: Metadata = generateToolMeta(
  "Wi-Fi QRコード生成",
  "SSIDとパスワードを入力するだけでWi-Fi接続用QRコードを即生成。スキャンするだけで簡単接続。",
  "wifi-qr",
  ["WiFi QRコード", "Wi-Fi共有", "QR生成", "パスワード不要接続"]
);

export default function Page() {
  return <WifiQr />;
}
