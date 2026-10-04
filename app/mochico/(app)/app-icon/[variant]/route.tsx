// マニフェスト用アイコン: /mochico/app-icon/192 /mochico/app-icon/512 /mochico/app-icon/maskable-512
//   Mochico 公式（purple のキャラクター）。maskable は OS の切り抜きに備えて余白を広く取る。
import { ImageResponse } from "next/og";
import { MochicoIcon } from "@/lib/mochico/icon-render";

const VARIANTS: Record<string, { size: number; padding: number }> = {
  "192": { size: 192, padding: 0.16 },
  "512": { size: 512, padding: 0.16 },
  "maskable-512": { size: 512, padding: 0.26 },
};

export async function GET(_req: Request, { params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const v = VARIANTS[variant];
  if (!v) return new Response("not found", { status: 404 });
  const res = new ImageResponse(<MochicoIcon size={v.size} padding={v.padding} />, { width: v.size, height: v.size });
  res.headers.set("Cache-Control", "public, max-age=86400");
  return res;
}
