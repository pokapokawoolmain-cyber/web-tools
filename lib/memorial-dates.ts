// ============================================================
// 四十九日の計算（純関数。記事の計算機と早見表で使う）
//
// - 命日を1日目と数える（四十九日 = 命日 + 48日）。法要日程計算ツールと同じ数え方
// - 日付は "YYYY-MM-DD" の文字列で受け渡し、時差の影響を受けないよう UTC で計算する
// ============================================================

const WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

function toUtc(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 ? d : null;
}

function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * 86400000);
}

export function formatJpDate(d: Date, withYear = true) {
  const y = withYear ? `${d.getUTCFullYear()}年` : "";
  return `${y}${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${WEEK[d.getUTCDay()]}）`;
}

export interface MemorialPlan {
  /** 四十九日（命日を1日目） */
  day49: Date;
  /** 四十九日当日かそれより前で、いちばん近い土曜・日曜 */
  weekendBefore: { sat: Date; sun: Date };
  /** 命日の月から数えて3か月目以降にかかるか（いわゆる三月越し） */
  spansThreeMonths: boolean;
  /** 年末年始（12/29〜1/3）に重なるか */
  newYearOverlap: boolean;
  /** 百箇日（命日 + 99日） */
  day100: Date;
}

export function memorialPlan(deathYmd: string): MemorialPlan | null {
  const death = toUtc(deathYmd);
  if (!death) return null;
  const day49 = addDays(death, 48);
  // 当日以前で直近の土曜（日曜が当日なら前日の土曜）
  const dow = day49.getUTCDay();
  const sat = addDays(day49, dow === 6 ? 0 : -((dow + 1) % 7));
  const sun = addDays(sat, 1) <= day49 ? addDays(sat, 1) : addDays(sat, -6);
  const monthsApart = (day49.getUTCFullYear() - death.getUTCFullYear()) * 12 + (day49.getUTCMonth() - death.getUTCMonth());
  const m = day49.getUTCMonth() + 1;
  const d = day49.getUTCDate();
  return {
    day49,
    weekendBefore: { sat, sun },
    spansThreeMonths: monthsApart >= 2,
    newYearOverlap: (m === 12 && d >= 29) || (m === 1 && d <= 3),
    day100: addDays(death, 99),
  };
}

/** 早見表用: 指定した年月の各日を命日としたときの四十九日 */
export function monthTable(year: number, month: number): { death: Date; day49: Date; spansThreeMonths: boolean }[] {
  const rows = [];
  for (let day = 1; day <= 31; day++) {
    const ymd = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const p = memorialPlan(ymd);
    if (!p) break;
    rows.push({ death: toUtc(ymd)!, day49: p.day49, spansThreeMonths: p.spansThreeMonths });
  }
  return rows;
}
