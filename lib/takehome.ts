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

// ============================================================
// 賞与（ボーナス）の手取り計算
//
// 手取り = 賞与額 − 社会保険料 − 源泉所得税
//  - 社会保険料: 標準賞与額（1,000円未満切捨て）× 料率
//      健康保険 4.955%（協会けんぽ・本人負担、年573万円上限）
//      介護保険 0.795%（40歳以上のみ、健康保険と同じ上限）
//      厚生年金 9.15%（1回あたり150万円上限）
//      雇用保険 0.55%
//  - 源泉所得税: (賞与額 − 社会保険料) × 賞与に対する源泉徴収税率
//      税率は「前月の社会保険料控除後の給与額」と扶養親族数で決まる
//      国税庁「賞与に対する源泉徴収税額の算出率の表」（令和6年分以降・甲欄）に基づく概算
// ============================================================

/** 賞与の源泉徴収税率（%）。国税庁の算出率表の税率列（令和6年分以降） */
const BONUS_TAX_RATES = [
  0, 2.042, 4.084, 6.126, 8.168, 10.21, 12.252, 14.294, 16.336, 18.377,
  20.419, 22.461, 24.504, 26.546, 28.587, 30.629, 32.671, 35.735, 38.798,
  41.861, 45.945,
] as const;

/**
 * 扶養親族数ごとの「前月の社会保険料控除後の給与額」の区分閾値（千円）。
 * thresholds[i] 未満なら BONUS_TAX_RATES[i]、すべて以上なら最終税率 45.945%。
 * 扶養1〜3人の高額帯は国税庁の表に基づく概算値。
 */
const BONUS_TAX_THRESHOLDS: Record<number, number[]> = {
  0: [68, 79, 252, 300, 334, 363, 395, 417, 445, 477, 510, 544, 582, 647, 699, 730, 764, 804, 857, 955],
  1: [94, 243, 282, 338, 365, 394, 422, 455, 484, 520, 557, 602, 650, 708, 745, 779, 816, 867, 934, 1027],
  2: [133, 269, 312, 369, 393, 420, 450, 484, 520, 557, 602, 650, 708, 745, 779, 816, 867, 934, 1027, 1177],
  3: [171, 295, 345, 398, 417, 445, 477, 510, 544, 582, 623, 693, 735, 771, 807, 850, 896, 946, 1036, 1163],
};

/**
 * 賞与に対する源泉徴収税率（%）を返す。
 * @param prevMonthSalary 前月の社会保険料控除後の給与額（円）
 * @param dependents 扶養親族数（0〜3。範囲外は0〜3に丸める）
 */
export function getBonusTaxRate(prevMonthSalary: number, dependents: number): number {
  const dep = Math.min(3, Math.max(0, Math.floor(dependents)));
  const thresholds = BONUS_TAX_THRESHOLDS[dep];
  const salaryThousand = prevMonthSalary / 1000;
  for (let i = 0; i < thresholds.length; i++) {
    if (salaryThousand < thresholds[i]) return BONUS_TAX_RATES[i];
  }
  return BONUS_TAX_RATES[BONUS_TAX_RATES.length - 1];
}

export interface BonusTakehomeResult {
  /** 手取り額（円） */
  net: number;
  /** 健康保険料（介護保険料を含む場合あり・円） */
  healthInsurance: number;
  /** 厚生年金保険料（円） */
  pension: number;
  /** 雇用保険料（円） */
  employmentInsurance: number;
  /** 社会保険料合計（円） */
  socialInsurance: number;
  /** 源泉所得税（円） */
  incomeTax: number;
  /** 適用された源泉徴収税率（%） */
  taxRate: number;
  /** 額面に対する手取り率（%・小数第1位まで） */
  netRate: number;
}

/**
 * 賞与（ボーナス）の手取りを概算する。
 * 協会けんぽ・本人負担・甲欄（扶養控除等申告書提出済み）前提の概算。
 * @param bonus 賞与額（額面・円）
 * @param prevMonthSalary 前月の社会保険料控除後の給与額（円）
 * @param dependents 扶養親族数（0〜3人）
 * @param isOver40 40歳以上（介護保険第2号被保険者）なら true
 */
export function calcBonusTakehome(
  bonus: number,
  prevMonthSalary: number,
  dependents: number = 0,
  isOver40: boolean = false,
): BonusTakehomeResult {
  // 標準賞与額: 1,000円未満切捨て
  const standardBonus = Math.floor(bonus / 1000) * 1000;
  // 健康保険（+介護保険）: 年度累計573万円上限（ここでは1回の賞与で判定）
  const healthBase = Math.min(standardBonus, 5_730_000);
  const healthRate = 0.04955 + (isOver40 ? 0.00795 : 0);
  const healthInsurance = Math.round(healthBase * healthRate);
  // 厚生年金: 1か月あたり150万円上限
  const pensionBase = Math.min(standardBonus, 1_500_000);
  const pension = Math.round(pensionBase * 0.0915);
  // 雇用保険
  const employmentInsurance = Math.round(standardBonus * 0.0055);

  const socialInsurance = healthInsurance + pension + employmentInsurance;

  // 源泉所得税: (賞与額 − 社会保険料) × 税率（1円未満切捨て）
  const taxRate = getBonusTaxRate(prevMonthSalary, dependents);
  const incomeTax = Math.floor(Math.max(0, bonus - socialInsurance) * (taxRate / 100));

  const net = bonus - socialInsurance - incomeTax;
  return {
    net,
    healthInsurance,
    pension,
    employmentInsurance,
    socialInsurance,
    incomeTax,
    taxRate,
    netRate: bonus > 0 ? Math.round((net / bonus) * 1000) / 10 : 0,
  };
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
