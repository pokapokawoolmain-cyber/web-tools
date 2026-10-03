// 表示用フォーマット（サーバー・クライアント共用）

export function formatPrice(price: number | null): string {
  if (price === null) return "価格未定";
  return `¥${price.toLocaleString("ja-JP")}`;
}

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

function parseDate(d: string): Date {
  // "YYYY-MM-DD" をローカル日付として扱う（UTC解釈による日付ずれを防ぐ）
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function fmt(d: string, withYear: boolean): string {
  const dt = parseDate(d);
  const base = `${dt.getMonth() + 1}/${dt.getDate()}(${WEEK[dt.getDay()]})`;
  return withYear ? `${dt.getFullYear()}/${base}` : base;
}

export function formatEventDate(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && (!end || end === start)) return fmt(start, true);
  if (!start && end) return `〜${fmt(end, true)}`;
  const sameYear = start!.slice(0, 4) === end!.slice(0, 4);
  return `${fmt(start!, true)} 〜 ${fmt(end!, !sameYear)}`;
}

export function progressPercent(owned: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((owned / total) * 100);
}
