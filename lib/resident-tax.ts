// ============================================================
// 住民税の「目安」計算（共通ロジック）
//
// 住民税は「所得割（課税所得の約10%）＋ 均等割（定額）」で構成される。
// 前年の所得をもとに計算され、6月から翌年5月にかけて徴収される。
//
// 重要な前提（YMYL配慮）:
//  - あくまで概算の目安。正確な税額は自治体・各種控除により異なる。
//  - 会社員・給与所得のみ・基礎控除＋社会保険料控除＋扶養控除のみを想定。
//  - 2026年の給与収入にかかる住民税（令和9年度分・2027年6月から徴収）を計算する。
//    給与所得控除は所得税と同じ令和8・9年分の表（最低保障額74万円）を使う。
//  - 住民税独自の控除額（所得税とは異なる）を使用:
//      基礎控除 43万円 / 一般扶養控除 33万円/人 / 配偶者控除 33万円
//  - 調整控除・均等割は簡易的な標準値。復興特別分に代わる森林環境税(1,000円)を
//    含めた均等割の目安として 5,000円 を用いる。
// ============================================================

import { calcSalaryDeduction, calcResidentBasicDeduction, calcAnnualSocialInsurance } from "./takehome";

export interface ResidentTaxResult {
  /** 給与所得（給与収入 − 給与所得控除） */
  employmentIncome: number;
  /** 社会保険料の概算 */
  socialInsurance: number;
  /** 住民税の課税所得（1,000円未満切り捨て） */
  taxableIncome: number;
  /** 所得割（課税所得×10% − 調整控除の目安） */
  incomeLevy: number;
  /** 均等割（定額の目安） */
  perCapitaLevy: number;
  /** 年間の住民税目安 */
  total: number;
  /** 月あたり（6月〜翌年5月の12回で割った目安） */
  monthly: number;
  /** 非課税の目安に該当するか */
  isExempt: boolean;
}

/** 住民税の均等割の目安（市区町村民税3,500＋道府県民税1,500 相当。森林環境税1,000円を含む） */
export const PER_CAPITA_LEVY = 5000;

const DEPENDENT_DEDUCTION = 330000; // 一般扶養・配偶者控除（住民税）
const ADJUSTMENT_CREDIT = 2500; // 調整控除の簡易目安

/** 住民税が非課税になる合計所得の上限（1級地の基準。自治体の級地により低い場合がある） */
export function residentExemptIncomeLimit(dependents = 0): number {
  const n = Math.max(0, Math.floor(dependents));
  return 350000 * (1 + n) + 100000 + (n > 0 ? 210000 : 0);
}

/** 単身で住民税が非課税になる給与収入の目安（円） */
export const RESIDENT_EXEMPT_SALARY_SINGLE = residentExemptIncomeLimit(0) + 740000;

/**
 * 住民税の目安を計算する。
 * @param annualIncome 額面の給与収入（年）
 * @param dependents 扶養親族の人数（配偶者含む・一般扶養として概算）
 * @param socialInsuranceInput 社会保険料を手入力する場合の金額（未指定なら健康保険・厚生年金・雇用保険の料率と上限で概算）
 */
export function calcResidentTax(
  annualIncome: number,
  dependents = 0,
  socialInsuranceInput?: number
): ResidentTaxResult {
  const income = Math.max(0, annualIncome);
  const salaryDeduction = calcSalaryDeduction(income);
  const employmentIncome = Math.max(0, income - salaryDeduction);
  const socialInsurance =
    socialInsuranceInput != null && socialInsuranceInput >= 0
      ? socialInsuranceInput
      : Math.round(calcAnnualSocialInsurance(income));

  const deductions =
    socialInsurance + calcResidentBasicDeduction(employmentIncome) + DEPENDENT_DEDUCTION * Math.max(0, dependents);
  // 1,000円未満は切り捨て
  const taxableIncome = Math.max(0, Math.floor((employmentIncome - deductions) / 1000) * 1000);

  // 非課税の目安（均等割も課税されない基準・1級地）：
  //   合計所得 ≦ 35万円 ×（本人＋扶養人数）＋ 10万円（扶養がいれば ＋21万円）
  //   単身なら合計所得45万円以下 ＝ 給与収入119万円以下（給与所得控除74万円）
  const exemptThreshold = residentExemptIncomeLimit(dependents);
  const isExempt = employmentIncome <= exemptThreshold;

  const incomeLevy = !isExempt && taxableIncome > 0 ? Math.max(0, Math.round(taxableIncome * 0.1) - ADJUSTMENT_CREDIT) : 0;
  const perCapitaLevy = isExempt ? 0 : PER_CAPITA_LEVY;
  const total = incomeLevy + perCapitaLevy;

  return {
    employmentIncome: Math.round(employmentIncome),
    socialInsurance: Math.round(socialInsurance),
    taxableIncome,
    incomeLevy,
    perCapitaLevy,
    total,
    monthly: Math.round(total / 12),
    isExempt,
  };
}
