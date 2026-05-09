import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// TailwindCSSのクラスを安全にマージするユーティリティ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 数値を日本円形式でフォーマット（例: 1234567 → "123万4,567円"）
export function formatJPY(amount: number): string {
  if (amount >= 100000000) {
    const oku = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    return man > 0 ? `${oku}億${man.toLocaleString()}万円` : `${oku}億円`;
  }
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    const rest = amount % 10000;
    return rest > 0
      ? `${man.toLocaleString()}万${rest.toLocaleString()}円`
      : `${man.toLocaleString()}万円`;
  }
  return `${amount.toLocaleString()}円`;
}

// パーセント表示（小数点2桁）
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

// 複利計算: 元本 × (1 + 年利率)^年数
export function calcCompound(
  principal: number,
  annualRate: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRate / 100, years);
}

// 毎月積立の将来価値計算（複利）
// FV = PMT × ((1+r)^n - 1) / r
export function calcFutureValueMonthly(
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthlyContribution * n;
  return monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

// サイトURLを取得（SSR/CSR両対応）
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// デバウンス（入力値の変化を遅延処理）
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
