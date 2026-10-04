// ============================================================
// Mochico の Web App Manifest
//   ToolBox 全体の /manifest.json（起動先 "/"）とは別物。/mochico のアプリ画面でだけ配信する
//   （公開 LP には付けない＝本体が未公開の環境でホーム画面に追加させない）。
// ============================================================
import { GOODS_APP_DESCRIPTION, GOODS_APP_FULL_NAME, GOODS_APP_SHORT_NAME, GOODS_SCOPE, GOODS_START_URL } from "@/lib/goods/app-meta";

export const dynamic = "force-static";

export function GET() {
  const manifest = {
    id: GOODS_START_URL,
    name: GOODS_APP_FULL_NAME,
    short_name: GOODS_APP_SHORT_NAME,
    description: GOODS_APP_DESCRIPTION,
    lang: "ja",
    // 起点は /mochico/app（ログイン済みならマイイベント、未ログインならログイン）。
    // 範囲は /mochico 配下（公開 LP も含むが、マニフェスト自体はアプリ画面でのみ配信する）。
    start_url: GOODS_START_URL,
    scope: GOODS_SCOPE,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c4dff",
    icons: [
      { src: "/mochico/app-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/mochico/app-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/mochico/app-icon/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
}
