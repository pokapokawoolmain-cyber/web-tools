// ============================================================
// 予約・販売スケジュール（純粋関数。サーバー・クライアント・テストで共通に使う）
//   * 日時は「日本時間の日付（YYYY-MM-DD）」＋「時刻（HH:MM、null = 日付のみ）」で持つ
//   * 判定はすべて日本時間。日本は夏時間が無いので「日付＋時刻＋09:00」で時刻が一意に決まり、端末のタイムゾーンに左右されない
//   * 予約開始: その時刻（日付のみは 0:00）から受付
//   * 予約終了: その時刻の直前まで（日付のみは当日 23:59:59 まで＝翌日 0:00 を排他的な終了境界とする）
//   * グッズ: 「イベントと同じ」なら イベントの設定、「このグッズだけ別に設定」ならグッズの設定（項目ごとには混ぜない）
//   DB 側の同じルール: supabase-goods/supabase/migrations/20261011000000_mochico_schedule.sql
// ============================================================

export interface Schedule {
  reserveStartDate: string | null;
  reserveStartTime: string | null;
  reserveEndDate: string | null;
  reserveEndTime: string | null;
  saleStartDate: string | null;
  saleStartTime: string | null;
}

export const EMPTY_SCHEDULE: Schedule = {
  reserveStartDate: null,
  reserveStartTime: null,
  reserveEndDate: null,
  reserveEndTime: null,
  saleStartDate: null,
  saleStartTime: null,
};

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;
const JST_OFFSET = 9 * HOUR;
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/** DB の time（"HH:MM:SS"）や入力（"HH:MM"）を "HH:MM" に揃える。空は null */
export function normalizeTime(t: string | null | undefined): string | null {
  if (!t) return null;
  const m = /^(\d{2}):(\d{2})/.exec(t);
  return m ? `${m[1]}:${m[2]}` : null;
}

export function hasReservation(s: Schedule): boolean {
  return !!(s.reserveStartDate || s.reserveEndDate);
}
export function hasSale(s: Schedule): boolean {
  return !!s.saleStartDate;
}
export function isScheduleEmpty(s: Schedule): boolean {
  return !hasReservation(s) && !hasSale(s);
}

/** 日本時間の日付＋時刻 → 時刻（ミリ秒）。日付のみは 0:00 */
export function jstStart(date: string | null, time: string | null): number | null {
  if (!date) return null;
  const t = normalizeTime(time) ?? "00:00";
  return Date.parse(`${date}T${t}:00+09:00`);
}

/** 予約終了の排他的境界。日付のみ → 翌日 0:00、時刻あり → その時刻 */
export function jstEnd(date: string | null, time: string | null): number | null {
  if (!date) return null;
  const t = normalizeTime(time);
  return t ? Date.parse(`${date}T${t}:00+09:00`) : Date.parse(`${date}T00:00:00+09:00`) + DAY;
}

/** 日本時間の今日（YYYY-MM-DD） */
export function jstToday(now: number): string {
  return new Date(now + JST_OFFSET).toISOString().slice(0, 10);
}

function daysBetween(fromDate: string, toDate: string): number {
  return Math.round((Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / DAY);
}

/** 終了は開始より後か（DB の制約と同じ）。どちらかが未設定なら OK */
export function isReservationOrderValid(s: Schedule): boolean {
  const a = jstStart(s.reserveStartDate, s.reserveStartTime);
  const b = jstEnd(s.reserveEndDate, s.reserveEndTime);
  return a === null || b === null || b > a;
}

/** グッズの有効なスケジュール（D1） */
export function effectiveSchedule(eventSchedule: Schedule, goods: { scheduleOverride: boolean; ownSchedule: Schedule }): { schedule: Schedule; own: boolean } {
  return goods.scheduleOverride ? { schedule: goods.ownSchedule, own: true } : { schedule: eventSchedule, own: false };
}

export type ReserveState = "none" | "before" | "open" | "closed";
export interface ReserveStatus {
  state: ReserveState;
  startAt: number | null;
  /** 排他的な終了境界 */
  endAt: number | null;
}

export function reservationStatus(s: Schedule, now: number): ReserveStatus {
  const startAt = jstStart(s.reserveStartDate, s.reserveStartTime);
  const endAt = jstEnd(s.reserveEndDate, s.reserveEndTime);
  if (startAt === null && endAt === null) return { state: "none", startAt, endAt };
  if (startAt !== null && now < startAt) return { state: "before", startAt, endAt };
  if (endAt !== null && now >= endAt) return { state: "closed", startAt, endAt };
  return { state: "open", startAt, endAt };
}

export type SaleState = "none" | "before" | "on";
export function saleStatus(s: Schedule, now: number): { state: SaleState; at: number | null } {
  const at = jstStart(s.saleStartDate, s.saleStartTime);
  if (at === null) return { state: "none", at };
  return { state: now < at ? "before" : "on", at };
}

/** 「10/15(水)」「10/15(水) 23:59」。年が今年と違うときは年も付ける（日付は日本時間の日付をそのまま表示） */
export function formatScheduleDate(date: string, time: string | null, now: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const wd = WEEK[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const yearPart = String(y) === jstToday(now).slice(0, 4) ? "" : `${y}/`;
  const t = normalizeTime(time);
  return `${yearPart}${m}/${d}(${wd})${t ? ` ${t}` : ""}`;
}

/**
 * 予約終了までの残り。受付中のときだけ意味がある（表示の文言だけ。判定は reservationStatus）
 *   日付のみ: 当日 =「今日まで」、翌日 =「明日まで」、それ以降 =「あと n 日」（日本時間の暦日）
 *   時刻あり: 1時間未満 =「あと n 分」（切り捨て・最低1分）、24時間未満 =「あと n 時間」（切り捨て）、
 *             24時間以上は日付を基準に: 翌日 =「明日18:00まで」、それ以降 =「あと n 日」（日本時間の暦日）
 */
export function remainingLabel(s: Schedule, now: number): string | null {
  const st = reservationStatus(s, now);
  if (st.state !== "open" || st.endAt === null || !s.reserveEndDate) return null;
  const ms = st.endAt - now;
  const days = daysBetween(jstToday(now), s.reserveEndDate);
  const time = normalizeTime(s.reserveEndTime);
  if (time) {
    if (ms < HOUR) return `あと${Math.max(1, Math.floor(ms / MIN))}分`;
    if (ms < DAY) return `あと${Math.floor(ms / HOUR)}時間`;
    if (days === 1) return `明日${time}まで`;
    return `あと${Math.max(1, days)}日`;
  }
  if (days <= 0) return "今日まで";
  if (days === 1) return "明日まで";
  return `あと${days}日`;
}

/** 受付中で残り 3 日以内（強調表示）。表示の「あと n 日」と揃える: 日付のみは日本時間の暦日、時刻ありは 72 時間 */
export function isUrgent(s: Schedule, now: number): boolean {
  const st = reservationStatus(s, now);
  if (st.state !== "open" || st.endAt === null || !s.reserveEndDate) return false;
  return normalizeTime(s.reserveEndTime) ? st.endAt - now <= 3 * DAY : daysBetween(jstToday(now), s.reserveEndDate) <= 3;
}

export interface ScheduleSummary {
  state: ReserveState;
  /** 例:「予約受付中・あと3日」「予約 10/20(月) 10:00〜」「予約終了」 */
  label: string;
  /** 例:「10/15(水) 23:59まで」（受付中で終了日があるとき） */
  detail: string | null;
  urgent: boolean;
}

/** 予約の状態の一行表示。予約が未設定なら null（不要なラベルを出さない） */
export function reservationSummary(s: Schedule, now: number): ScheduleSummary | null {
  const st = reservationStatus(s, now);
  if (st.state === "none") return null;
  if (st.state === "before") {
    return { state: "before", label: `予約 ${formatScheduleDate(s.reserveStartDate!, s.reserveStartTime, now)}〜`, detail: null, urgent: false };
  }
  if (st.state === "closed") return { state: "closed", label: "予約終了", detail: null, urgent: false };
  const rest = remainingLabel(s, now);
  const end = s.reserveEndDate ? `${formatScheduleDate(s.reserveEndDate, s.reserveEndTime ?? "23:59", now)}まで` : null;
  return { state: "open", label: rest ? `予約受付中・${rest}` : "予約受付中", detail: end, urgent: isUrgent(s, now) };
}

/** 販売開始の一行表示（予約とは別）。未設定なら null */
export function saleSummary(s: Schedule, now: number): string | null {
  const st = saleStatus(s, now);
  if (st.state === "none") return null;
  const when = formatScheduleDate(s.saleStartDate!, s.saleStartTime, now);
  return st.state === "before" ? `販売開始 ${when}` : `販売中（${when}〜）`;
}

/**
 * 「予約期限が近い順」の並び順キー（小さいほど先）
 *   受付中（終了が近い順、終了日なしは受付中の最後）→ 予約前（開始が近い順）→ 設定なし → 受付終了（終わったのが最近の順）
 */
export function deadlineSortKey(s: Schedule, now: number): [number, number] {
  const st = reservationStatus(s, now);
  switch (st.state) {
    case "open":
      return st.endAt === null ? [1, 0] : [0, st.endAt];
    case "before":
      return [2, st.startAt ?? 0];
    case "none":
      return [3, 0];
    case "closed":
      return [4, -(st.endAt ?? 0)];
  }
}

export function compareDeadline(a: Schedule, b: Schedule, now: number): number {
  const [a1, a2] = deadlineSortKey(a, now);
  const [b1, b2] = deadlineSortKey(b, now);
  return a1 - b1 || a2 - b2;
}

/** DB の行（snake_case）→ Schedule */
export function scheduleFromRow(r: {
  reserve_start_date?: string | null;
  reserve_start_time?: string | null;
  reserve_end_date?: string | null;
  reserve_end_time?: string | null;
  sale_start_date?: string | null;
  sale_start_time?: string | null;
}): Schedule {
  return {
    reserveStartDate: r.reserve_start_date ?? null,
    reserveStartTime: normalizeTime(r.reserve_start_time),
    reserveEndDate: r.reserve_end_date ?? null,
    reserveEndTime: normalizeTime(r.reserve_end_time),
    saleStartDate: r.sale_start_date ?? null,
    saleStartTime: normalizeTime(r.sale_start_time),
  };
}

/** Schedule → DB の列（保存用）。時刻は日付があるときだけ */
export function scheduleToRow(s: Schedule) {
  return {
    reserve_start_date: s.reserveStartDate || null,
    reserve_start_time: s.reserveStartDate ? normalizeTime(s.reserveStartTime) : null,
    reserve_end_date: s.reserveEndDate || null,
    reserve_end_time: s.reserveEndDate ? normalizeTime(s.reserveEndTime) : null,
    sale_start_date: s.saleStartDate || null,
    sale_start_time: s.saleStartDate ? normalizeTime(s.saleStartTime) : null,
  };
}

export const SCHEDULE_COLUMNS = "reserve_start_date, reserve_start_time, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time";
