// ============================================================
// AdSense ローダースクリプト（共通レイアウトで1回だけ）
//
// - 本番かつ Publisher ID がある時だけ読み込む（dev では読み込まない）
// - 重複挿入を避けるため、必ず layout の <head> に1回だけ置く
// - async でメインコンテンツ描画をブロックしない
// サーバーコンポーネント（条件分岐は描画時に確定）。
// ============================================================
import { ADSENSE_CLIENT, shouldLoadAdScript } from "@/lib/ads/config";

export function AdScript() {
  if (!shouldLoadAdScript()) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
