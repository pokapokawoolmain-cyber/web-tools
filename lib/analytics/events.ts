// ============================================================
// Analytics Event Registry
//
// GA4へ送るイベント名をコンポーネントへ直書きしない。
// ここが唯一の正。イベントを増やす時はここに1エントリ足すだけでよい
// （akamaru CEO Dashboard の KPI Registry と同じ設計思想）。
//
// 「実装が伴わない先付けの定義は作らない」ため、実際に発火コードが
// 存在するイベントだけを登録する（download_completed / workspace_* 等の
// 将来イベントは、実装に着手する時にここへ1エントリ足す）。
// ============================================================

/** 分析用のツール分類。サイト表示用の category（data/tools.ts）とは別軸。 */
export type AnalyticsToolCategory = "pdf" | "image" | "estimate" | "invoice";
// 将来拡張例: | "workspace" | "document"（実装時に追加）

/**
 * 完了の検知方式。
 *   processed = コード自身が成功を確認した完了（try節の正常終了）
 *   print     = window.print() 呼び出しをもって推定した完了
 *               （印刷ダイアログの起動は検知できるが、実際に印刷/PDF保存
 *               されたか・キャンセルされたかはブラウザAPI上区別できない）
 */
export type CompletionType = "processed" | "print";

export type DeviceType = "mobile" | "desktop";

export type AnalyticsEventCategory = "engagement" | "conversion" | "error";

export type ToolBoxEventName = "tool_started" | "tool_completed" | "tool_failed";

// ============================================================
// Revenue Experiment（Phase Revenue 0）イベント
//
// Image Pro / Seller の2商品仮説を「同一の計測基盤・同一の評価基準」で
// 比較するための共通イベント群。プロダクト固有のイベント名を増やさず、
// 全て product パラメータで分岐させる（後から商品仮説が増えても
// イベント設計自体は変えなくてよいようにするため）。
// ============================================================

/** 検証対象の商品仮説。ここに増やすだけで新しいRevenue実験を追加できる。 */
export type RevenueProduct = "image_pro" | "seller";

/**
 * 流入の分類。
 *   note          = note記事経由（utm_source=note、またはreferrerがnote.com）
 *   internal_tool = ToolBoxJP内の既存ツールに置いた文脈CTA経由（?src=tool:<id>）
 *   organic       = 検索エンジンからの自然流入
 *   direct        = リンク先不明の直接アクセス（URL直打ち・ブックマーク等）
 *   other         = 上記以外（SNS等、今後utm運用が広がったら細分化する）
 */
export type RevenueEntryPoint = "note" | "internal_tool" | "organic" | "direct" | "other";

/**
 * CTAの設置場所。lp_hero/lp_footerは同一LP内の重複表示のため、
 * CTR計算時に合算しないこと（分母のimpressionもplacement別に出る）。
 */
export type RevenueCtaPlacement = "lp_hero" | "lp_footer" | "tool_banner";

export type RevenueEventName =
  | "revenue_lp_view"
  | "revenue_cta_impression"
  | "revenue_cta_click"
  | "revenue_waitlist_submit";

export interface EventDefinition {
  eventName: ToolBoxEventName | RevenueEventName;
  category: AnalyticsEventCategory;
  description: string;
  service: "toolbox";
  /** North Star（仕事完了件数）の算出対象に含めてよいイベントか。 */
  northStarEligible: boolean;
  /** イベント定義のバージョン。パラメータ構造を変える時にインクリメントする。 */
  version: number;
}

export const REVENUE_EVENT_REGISTRY: Record<RevenueEventName, EventDefinition> = {
  revenue_lp_view: {
    eventName: "revenue_lp_view",
    category: "engagement",
    description:
      "Revenue Experiment LP（Image Pro / Seller）の表示。product・entry_point・utm_*・referrerを付与する。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
  revenue_cta_impression: {
    eventName: "revenue_cta_impression",
    category: "engagement",
    description:
      "ProへのCTAが画面内に実際に入った瞬間（IntersectionObserverで検知、1セッション1回）。placement='lp_hero'（LP本体）と'tool_banner'（既存ツール内バナー）を区別する。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
  revenue_cta_click: {
    eventName: "revenue_cta_click",
    category: "conversion",
    description:
      "ProへのCTA押下。price_shownに表示価格を含める。GO/NO-GO判断の中心指標（CTA Impression比のCTR）。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
  revenue_waitlist_submit: {
    eventName: "revenue_waitlist_submit",
    category: "conversion",
    description:
      "準備中表示後の任意Waitlist登録送信。メールアドレス自体はGA4へ送らない（PII混入防止）。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
};

export const EVENT_REGISTRY: Record<ToolBoxEventName, EventDefinition> = {
  tool_started: {
    eventName: "tool_started",
    category: "engagement",
    description:
      "ユーザーがツールの処理・生成を実際に開始した（ファイル選択後の実行ボタン押下、または印刷系ツールでは印刷ボタン押下）。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
  tool_completed: {
    eventName: "tool_completed",
    category: "conversion",
    description:
      "ツールの処理が完了した。completion_type='print' の場合は印刷ダイアログの起動をもって推定した完了であり、実際の印刷/PDF保存の成否は検知できない。",
    service: "toolbox",
    northStarEligible: true,
    version: 1,
  },
  tool_failed: {
    eventName: "tool_failed",
    category: "error",
    description: "ツールの処理が失敗した。エラーメッセージ本文・ファイル名は一切含めない。",
    service: "toolbox",
    northStarEligible: false,
    version: 1,
  },
};

export const ALL_EVENTS: EventDefinition[] = [
  ...Object.values(EVENT_REGISTRY),
  ...Object.values(REVENUE_EVENT_REGISTRY),
];
