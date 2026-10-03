// /mochico 配下のタブアイコン（Mochico 公式: purple）
import { ImageResponse } from "next/og";
import { MochicoIcon } from "@/lib/mochico/icon-render";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<MochicoIcon size={64} rounded padding={0.1} />, size);
}
