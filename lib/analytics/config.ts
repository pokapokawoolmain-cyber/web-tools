// ============================================================
// Analytics（Google Analytics 4）一元設定
//
// lib/ads/config.ts と同じパターン: 値は環境変数に置き、
// 本番判定・読み込み可否の判断をここへ集約する。
// ============================================================

/** GA4 測定ID（"G-..."）。既存の本番値を既定にしつつ env で上書き可能。 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-CM9H4Y9XLD";

/** 本番環境か（dev では計測スクリプトを読み込まない。誤計測・コンソールノイズを避けるため）。 */
export const IS_PROD = process.env.NODE_ENV === "production";

/** GA4 計測スクリプトを読み込むべきか。 */
export function shouldLoadAnalyticsScript(): boolean {
  return IS_PROD && !!GA_MEASUREMENT_ID;
}
