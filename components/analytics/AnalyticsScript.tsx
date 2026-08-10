// ============================================================
// GA4 計測タグ（共通レイアウトで1回だけ）
//
// - 本番でのみ読み込む（dev では読み込まない。誤計測・コンソールノイズを避ける）
// - components/ads/AdScript.tsx と同じ設計パターン
// サーバーコンポーネント（条件分岐は描画時に確定）。
// ============================================================
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID, shouldLoadAnalyticsScript } from "@/lib/analytics/config";

export function AnalyticsScript() {
  if (!shouldLoadAnalyticsScript()) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
