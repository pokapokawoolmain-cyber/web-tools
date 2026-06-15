// ============================================================
// 広告（Google AdSense）一元設定
//
// Publisher ID・各スロットIDは環境変数で管理する。
// ソース各所へのベタ書きを避け、ここ1か所に集約する。
//
// 重要な分離:
//  - スクリプト読み込み（サイト確認用）: client が存在する本番なら常に行う
//  - 広告ユニットの描画: ADS_ENABLED かつ 対象スロットIDがある時だけ
//    → 審査中は ENABLED=false にして「スクリプトはあるが空ユニットは出さない」
//      クリーンな状態を保てる。承認後に ENABLED=true ＋ スロット投入。
// ============================================================

/** AdSense Publisher ID（"ca-pub-..."）。既存の本番値を既定にしつつ env で上書き可能 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-8801800417491644";

/** 広告ユニットを実際に描画するか（審査中は false 推奨） */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

/** 本番環境か（dev では広告スクリプトを読み込まない） */
export const IS_PROD = process.env.NODE_ENV === "production";

/**
 * 配置場所ごとのスロットID（AdSense管理画面で発行した値を env で設定）。
 * 未設定のスロットは描画されない（空白だけが残らないようにするため）。
 */
export const AD_SLOTS = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT,
  bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

/** その配置の広告ユニットを描画してよいか（ID未設定なら描画しない） */
export function getSlotId(placement: AdPlacement): string | undefined {
  return AD_SLOTS[placement];
}

/**
 * AdSenseスクリプトを読み込むべきか。
 * client があり本番なら、ENABLED に関わらず読み込む（サイト確認のため）。
 * dev では読み込まない（コンソールノイズ・誤計測を避ける）。
 */
export function shouldLoadAdScript(): boolean {
  return IS_PROD && !!ADSENSE_CLIENT;
}

/** 実際にこの配置の広告ユニットを出してよいか（ENABLED かつ slot 設定済み かつ 本番） */
export function shouldRenderUnit(placement: AdPlacement): boolean {
  return IS_PROD && ADS_ENABLED && !!getSlotId(placement);
}
