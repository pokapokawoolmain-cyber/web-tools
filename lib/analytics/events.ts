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

export interface EventDefinition {
  eventName: ToolBoxEventName;
  category: AnalyticsEventCategory;
  description: string;
  service: "toolbox";
  /** North Star（仕事完了件数）の算出対象に含めてよいイベントか。 */
  northStarEligible: boolean;
  /** イベント定義のバージョン。パラメータ構造を変える時にインクリメントする。 */
  version: number;
}

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

export const ALL_EVENTS: EventDefinition[] = Object.values(EVENT_REGISTRY);
