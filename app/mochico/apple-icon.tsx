// /mochico 配下の iPhone ホーム画面用アイコン（iOS が角丸に切り抜く）
import { ImageResponse } from "next/og";
import { MochicoIcon } from "@/lib/mochico/icon-render";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<MochicoIcon size={180} padding={0.16} />, size);
}
