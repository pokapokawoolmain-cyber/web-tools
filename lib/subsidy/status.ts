// ============================================================
// 補助金ステータス自動判定（日本時間基準）
//
// データに手入力された status は古くなりがちなので、
// 受付開始日・締切日から「現在の状態」を毎回計算し直す。
// これにより「締切を過ぎた制度が受付中のまま表示される」
// 事故を、データ更新を待たずに防ぐ。
//
// 重要:
//  - このモジュールは data/ を import しない（循環依存防止）。
//  - 日付は YYYYMMDD の整数に変換して比較し、
//    サーバーのタイムゾーンに依存した1日のズレを起こさない。
// ============================================================

// data/subsidies.ts の SubsidyStatus と同じ値域（importせず独立定義）
export type LiveStatus = "受付中" | "随時受付" | "準備中" | "終了" | "不明";
export type LiveStatusCode = "open" | "scheduled" | "closed" | "unknown";

export interface StatusInput {
  /** データに手入力された現在の status（日本語） */
  storedStatus: string;
  /** 受付開始日 "YYYY-MM-DD" */
  applicationStartDate?: string;
  /** 受付締切日 "YYYY-MM-DD" */
  applicationEndDate?: string;
  /** 随時受付（予算枯渇まで等）。true の場合は締切日で自動終了させない */
  rolling?: boolean;
}

/** 締切○日前以内を「締切間近」とみなすしきい値 */
export const CLOSING_SOON_DAYS = 14;

/** "YYYY-MM-DD" を YYYYMMDD の整数へ。不正なら null */
export function dateStrToInt(s?: string): number | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return y * 10000 + mo * 100 + d;
}

/**
 * 「今日（日本時間）」を YYYYMMDD の整数で返す。
 * UTCに+9時間してからUTCの暦フィールドを読むことで、
 * 実行環境のタイムゾーンに関係なく常にJSTの暦日を得る。
 */
export function jstTodayInt(now: Date = new Date()): number {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.getUTCFullYear() * 10000 + (jst.getUTCMonth() + 1) * 100 + jst.getUTCDate();
}

/** YYYYMMDD整数 → その暦日のUTC0時のミリ秒（日数差の計算用） */
function intToUtcMs(yyyymmdd: number): number {
  const y = Math.floor(yyyymmdd / 10000);
  const mo = Math.floor((yyyymmdd % 10000) / 100);
  const d = yyyymmdd % 100;
  return Date.UTC(y, mo - 1, d);
}

/** 締切までの残り日数（JST暦日基準）。当日=0、前日=1、過ぎていれば負。 */
export function daysUntil(endDate?: string, now: Date = new Date()): number | null {
  const end = dateStrToInt(endDate);
  if (end === null) return null;
  const today = jstTodayInt(now);
  return Math.round((intToUtcMs(end) - intToUtcMs(today)) / 86_400_000);
}

/**
 * 受付開始日・締切日・随時フラグから現在の状態を判定する。
 * 優先順位:
 *  1. 随時受付（rolling / stored=随時受付）→ 随時受付（締切日で自動終了しない）
 *  2. stored=終了 → 終了
 *  3. 締切日があり、今日 > 締切 → 終了
 *  4. 開始日があり、今日 < 開始 → 準備中
 *  5. 締切日があり、開始日未設定or開始済み → 受付中
 *  6. それ以外（判定材料なし）→ 不明
 */
export function computeSubsidyStatus(input: StatusInput, now: Date = new Date()): LiveStatus {
  const { storedStatus, applicationStartDate, applicationEndDate, rolling } = input;

  if (rolling || storedStatus === "随時受付") return "随時受付";
  if (storedStatus === "終了") return "終了";

  const today = jstTodayInt(now);
  const start = dateStrToInt(applicationStartDate);
  const end = dateStrToInt(applicationEndDate);

  if (end !== null && today > end) return "終了";
  if (start !== null && today < start) return "準備中";
  if (end !== null && (start === null || today >= start)) return "受付中";

  // 締切日が無く判定できない場合は、誤って「受付中」と断定しない
  if (storedStatus === "準備中") return "準備中";
  return "不明";
}

/** LiveStatus → statusCode */
export function mapToStatusCode(status: LiveStatus): LiveStatusCode {
  switch (status) {
    case "受付中":
    case "随時受付":
      return "open";
    case "準備中":
      return "scheduled";
    case "終了":
      return "closed";
    default:
      return "unknown";
  }
}

export interface StatusDetail {
  status: LiveStatus;
  statusCode: LiveStatusCode;
  /** 受付中のときの締切までの残り日数（随時・終了・準備中はnull） */
  daysLeft: number | null;
  /** 締切14日前以内か */
  isClosingSoon: boolean;
}

/** 状態＋残り日数＋締切間近フラグをまとめて返す */
export function getStatusDetail(input: StatusInput, now: Date = new Date()): StatusDetail {
  const status = computeSubsidyStatus(input, now);
  const statusCode = mapToStatusCode(status);
  let daysLeft: number | null = null;
  if (status === "受付中") daysLeft = daysUntil(input.applicationEndDate, now);
  const isClosingSoon =
    status === "受付中" && daysLeft !== null && daysLeft >= 0 && daysLeft <= CLOSING_SOON_DAYS;
  return { status, statusCode, daysLeft, isClosingSoon };
}
