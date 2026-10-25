// ============================================================
// ふるさと納税の控除上限額（共通ロジック）
//
// 上限額 ＝ 住民税所得割額 × 20% ÷（90% − 所得税率 × 1.021）＋ 2,000円
//  - 所得税は令和8年分（2026年分）、住民税は同じ所得にかかる令和9年度分で計算する。
//  - 所得税と住民税では基礎控除・配偶者控除・扶養控除の金額が異なるため、
//    課税所得はそれぞれ別に求める（同じ控除を二重に引かない）。
//  - 住民税所得割は調整控除（人的控除額の差に基づく減額）を差し引いた額を使う。
//  - 前提: 給与所得のみ・社会保険料控除と人的控除のみ。住宅ローン控除・医療費控除・
//    iDeCo などは未反映の目安。
// ============================================================

import {
  calcSalaryDeduction,
  calcBasicDeduction,
  calcResidentBasicDeduction,
  calcAnnualSocialInsurance,
  calcFamilyDeductions,
} from "./takehome";

export interface FurusatoInput {
  /** 給与収入（年・円） */
  income: number;
  /** 配偶者控除の対象となる配偶者がいるか（配偶者の給与収入がおおむね136万円以下） */
  hasSpouse: boolean;
  /** 一般の扶養親族（16〜18歳・23歳以上など）の人数。15歳以下の子は扶養控除の対象外 */
  generalDependents: number;
  /** 特定扶養親族（19〜22歳）の人数 */
  specificDependents?: number;
}

export interface FurusatoResult {
  /** 控除上限額（円・1,000円未満切り捨て） */
  limit: number;
  /** 住民税所得割額（調整控除後・円） */
  residentIncomeLevy: number;
  /** 適用される所得税率（限界税率） */
  incomeTaxRate: number;
  /** 給与所得（円） */
  employmentIncome: number;
}

/** 所得税の限界税率 */
export function getIncomeTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1950000) return 0.05;
  if (taxableIncome <= 3300000) return 0.1;
  if (taxableIncome <= 6950000) return 0.2;
  if (taxableIncome <= 9000000) return 0.23;
  if (taxableIncome <= 18000000) return 0.33;
  if (taxableIncome <= 40000000) return 0.4;
  return 0.45;
}

export function calcFurusatoLimit(input: FurusatoInput): FurusatoResult {
  const income = Math.max(0, input.income);
  const employmentIncome = Math.max(0, income - calcSalaryDeduction(income));
  const socialInsurance = calcAnnualSocialInsurance(income);
  const family = calcFamilyDeductions(employmentIncome, {
    hasSpouse: input.hasSpouse,
    generalDependents: input.generalDependents,
    specificDependents: input.specificDependents,
  });

  // 所得税（令和8年分）
  const incomeTaxDeductions = socialInsurance + calcBasicDeduction(employmentIncome) + family.incomeTax;
  const incomeTaxable = Math.max(0, Math.floor((employmentIncome - incomeTaxDeductions) / 1000) * 1000);
  const incomeTaxRate = getIncomeTaxRate(incomeTaxable);

  // 住民税（令和9年度分）
  const residentDeductions = socialInsurance + calcResidentBasicDeduction(employmentIncome) + family.resident;
  const residentTaxable = Math.max(0, Math.floor((employmentIncome - residentDeductions) / 1000) * 1000);

  // 調整控除: 人的控除差（基礎5万・配偶者・一般扶養5万・特定扶養18万）
  const personalDiff = family.personalDiff;
  let adjustment = 0;
  if (employmentIncome <= 25000000 && residentTaxable > 0) {
    adjustment =
      residentTaxable <= 2000000
        ? Math.min(personalDiff, residentTaxable) * 0.05
        : Math.max(personalDiff - (residentTaxable - 2000000), 50000) * 0.05;
  }
  const residentIncomeLevy = Math.max(0, Math.round(residentTaxable * 0.1 - adjustment));

  const limit =
    residentIncomeLevy > 0
      ? Math.floor(((residentIncomeLevy * 0.2) / (0.9 - incomeTaxRate * 1.021) + 2000) / 1000) * 1000
      : 0;

  return { limit, residentIncomeLevy, incomeTaxRate, employmentIncome: Math.round(employmentIncome) };
}
