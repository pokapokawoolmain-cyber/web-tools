import { sendGAEvent } from "@next/third-parties/google";
import type { AnalyticsToolCategory, CompletionType, DeviceType, ToolBoxEventName } from "./events";

// ============================================================
// Analytics 共通送信レイヤー。
//
// 各ツールはこの3関数だけを呼ぶ。GA4のAPIを直接触らない。
// 将来 GA4 以外の Analytics へ切り替える時は、このファイルの中身だけを
// 差し替えれば足りる（呼び出し側の signature は変えない）。
//
// Analytics 障害はツール本体の障害にしてはいけない
// （/Users/hiyu_mac/yoru/web/src/lib/activity.ts の recordActivity と同じ方針）。
// このファイルの公開関数は絶対に例外を投げない。
// ============================================================

/** ToolBoxJPには現状ログイン機構が無いため常に false。Workspace実装時にここ1箇所を差し替える。 */
const IS_LOGGED_IN = false;

function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

function sendAnalyticsEvent(eventName: ToolBoxEventName, params: Record<string, unknown>): void {
  try {
    if (typeof window === "undefined") return;
    sendGAEvent("event", eventName, {
      ...params,
      device_type: getDeviceType(),
      is_logged_in: IS_LOGGED_IN,
    });
  } catch (e) {
    console.warn(`[analytics] ${eventName} send failed:`, e instanceof Error ? e.message : e);
  }
}

interface ToolContext {
  toolId: string;
  toolCategory: AnalyticsToolCategory;
  toolName: string;
}

/**
 * ツールの処理開始を記録する。戻り値の時刻(ms)は tool_completed の
 * duration_ms 計算に使う。呼び出し側で1回の処理試行につき1回だけ呼ぶこと
 * （useEffectで状態変化を監視して発火せず、イベントハンドラ内で直接呼ぶ）。
 */
export function trackToolStarted(ctx: ToolContext): number {
  const startedAt = Date.now();
  sendAnalyticsEvent("tool_started", {
    tool_id: ctx.toolId,
    tool_category: ctx.toolCategory,
    tool_name: ctx.toolName,
  });
  return startedAt;
}

export interface ToolCompletedParams extends ToolContext {
  completionType: CompletionType;
  /** trackToolStarted() の戻り値との差分。計測できない場合は省略可。 */
  durationMs?: number | null;
  /** バッチ処理した件数。省略時は1。 */
  itemCount?: number;
}

/** ツールの処理完了を記録する。個人情報・ファイル名・入力内容は一切渡さないこと。 */
export function trackToolCompleted(params: ToolCompletedParams): void {
  sendAnalyticsEvent("tool_completed", {
    tool_id: params.toolId,
    tool_category: params.toolCategory,
    tool_name: params.toolName,
    completion_type: params.completionType,
    duration_ms: params.durationMs ?? null,
    item_count: params.itemCount ?? 1,
  });
}

export interface ToolFailedParams extends ToolContext {
  /** 失敗した処理段階（例: "merge" "convert" "print"）。エラーメッセージ本文は渡さない。 */
  errorStage?: string;
}

/** ツールの処理失敗を記録する。Error オブジェクトやメッセージ本文は受け取らない設計（PII/内部情報の混入を型で防ぐ）。 */
export function trackToolFailed(params: ToolFailedParams): void {
  sendAnalyticsEvent("tool_failed", {
    tool_id: params.toolId,
    tool_category: params.toolCategory,
    tool_name: params.toolName,
    error_stage: params.errorStage ?? null,
  });
}
