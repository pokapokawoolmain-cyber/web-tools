// ============================================================
// 手取り計算（共通ロジック）
//
// net-income ツールと /salary の早見表で同じ計算を使い、
// 数値の不整合をなくすための単一ソース。
// 前提: 会社員・独身・基礎控除のみの概算。賞与は年収に含む想定。
//   （配偶者控除・扶養控除・各種保険料控除は未反映）
// ============================================================

/** 給与所得控除 */
export function calcSalaryDeduction(income: number): number {
  if (income <= 1625000) return 550000;
  if (income <= 1800000) return income * 0.4 - 100000;
  if (income <= 3600000) return income * 0.3 + 80000;
  if (income <= 6600000) return income * 0.2 + 440000;
  if (income <= 8500000) return income * 0.1 + 1100000;
  return 1950000;
}

/** 所得税（速算表・復興特別所得税は別途乗算） */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 1950000) return taxableIncome * 0.05;
  if (taxableIncome <= 3300000) return taxableIncome * 0.10 - 97500;
  if (taxableIncome <= 6950000) return taxableIncome * 0.20 - 427500;
  if (taxableIncome <= 9000000) return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
  return taxableIncome * 0.40 - 2796000;
}

export interface TakehomeResult {
  /** 年間手取り（円） */
  annualNet: number;
  /** 月換算の手取り（円） */
  monthlyNet: number;
  socialInsurance: number;
  incomeTax: number;
  residenceTax: number;
}

/** 目標の年間手取り（円）から必要な額面年収（円）を二分探索で逆算する */
export function calcRequiredIncome(targetAnnualNet: number): number {
  let lo = targetAnnualNet;        // 手取り ≦ 額面
  let hi = targetAnnualNet * 2.5;  // 高所得帯でも手取り率は40%を下回らない前提
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (calcTakehome(mid).annualNet < targetAnnualNet) lo = mid;
    else hi = mid;
  }
  return Math.round(hi);
}

/** 年収（額面・円）から手取りを概算する */
export function calcTakehome(annualIncome: number): TakehomeResult {
  const salaryDeduction = calcSalaryDeduction(annualIncome);
  const netIncome = annualIncome - salaryDeduction;
  const socialInsurance = annualIncome * 0.1451;
  const basicDeduction = 480000;
  const taxableIncome = Math.max(0, netIncome - socialInsurance - basicDeduction);
  const incomeTax = calcIncomeTax(taxableIncome) * 1.021;
  const residenceTaxableIncome = Math.max(0, netIncome - socialInsurance - 430000);
  const residenceTax = residenceTaxableIncome * 0.10;
  const annualNet = annualIncome - socialInsurance - incomeTax - residenceTax;
  return {
    annualNet: Math.round(annualNet),
    monthlyNet: Math.round(annualNet / 12),
    socialInsurance: Math.round(socialInsurance),
    incomeTax: Math.round(incomeTax),
    residenceTax: Math.round(residenceTax),
  };
}
