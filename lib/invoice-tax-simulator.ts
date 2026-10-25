// ========================================
// インボイス税額シミュレーター 計算ロジック
// 2割特例・3割特例・簡易課税・本則課税で消費税納税額を試算する
//
// 根拠: 国税庁「令和8年度税制改正特集（インボイス経過措置の見直し等）」
//  - 2割特例: 令和8年（2026年）9月30日を含む課税期間まで（個人事業主は2026年分まで）
//  - 3割特例: 個人事業者のみ・令和9年分（2027年）と令和10年分（2028年）
//             （基準期間の課税売上高1,000万円以下・インボイス登録が要件）
//  - 免税事業者等からの仕入れの経過措置（7・5・3割控除）:
//      2023/10〜2026/9 80% → 2026/10〜2028/9 70% → 2028/10〜2030/9 50%
//      → 2030/10〜2031/9 30% → 2031/10以降 0%
// ========================================

export type BusinessCategory =
  | "wholesale" // 第一種：卸売業
  | "retail" // 第二種：小売業
  | "manufacturing" // 第三種：製造業等
  | "restaurant" // 第四種：飲食店業等・その他
  | "service" // 第五種：サービス業等
  | "realestate"; // 第六種：不動産業

export const DEEMED_PURCHASE_RATES: Record<BusinessCategory, { label: string; kind: string; rate: number }> = {
  wholesale: { label: "卸売業（第一種）", kind: "他者から仕入れた商品をそのまま他の事業者に販売する", rate: 0.9 },
  retail: { label: "小売業（第二種）", kind: "他者から仕入れた商品をそのまま消費者に販売する", rate: 0.8 },
  manufacturing: { label: "製造業等（第三種）", kind: "製造業・建設業・農林漁業など", rate: 0.7 },
  restaurant: { label: "飲食店業等・その他（第四種）", kind: "飲食店業、第一〜三・五・六種にあてはまらない事業", rate: 0.6 },
  service: { label: "サービス業等（第五種）", kind: "士業・コンサル・美容・運輸・情報通信など", rate: 0.5 },
  realestate: { label: "不動産業（第六種）", kind: "不動産の賃貸・仲介・管理など", rate: 0.4 },
};

export type InvoiceTaxInput = {
  /** 年間の課税売上高（税込・円） */
  salesTaxIncluded: number;
  /** 消費税率（標準10% or 軽減8%） */
  taxRate: 0.1 | 0.08;
  /** 簡易課税用の事業区分 */
  category: BusinessCategory;
  /** 本則課税用：年間の課税仕入・経費（税込・円）。インボイスのない仕入れも含めた合計 */
  purchasesTaxIncluded: number;
  /** 上のうち、免税事業者などインボイスのない相手からの仕入れ（税込・円） */
  nonInvoicePurchasesTaxIncluded?: number;
  /** 申告する年分（個人事業主の暦年）。省略時は2026年分 */
  taxYear?: TaxYear;
  /** 個人事業主か法人か（3割特例は個人のみ）。省略時は個人 */
  entity?: "individual" | "corporation";
};

export type TaxYear = 2026 | 2027 | 2028 | 2029 | 2030;
export const TAX_YEARS: TaxYear[] = [2026, 2027, 2028, 2029, 2030];

/**
 * インボイスのない仕入れのうち仕入税額控除できる割合（その年1〜12月に均等に仕入れた場合の平均）。
 * 年の途中（10月1日）で割合が切り替わる年は、9か月分と3か月分の加重平均で近似する。
 */
export const NON_INVOICE_CREDIT_RATES: Record<TaxYear, { rate: number; label: string }> = {
  2026: { rate: (0.8 * 9 + 0.7 * 3) / 12, label: "1〜9月80%・10〜12月70%" },
  2027: { rate: 0.7, label: "70%" },
  2028: { rate: (0.7 * 9 + 0.5 * 3) / 12, label: "1〜9月70%・10〜12月50%" },
  2029: { rate: 0.5, label: "50%" },
  2030: { rate: (0.5 * 9 + 0.3 * 3) / 12, label: "1〜9月50%・10〜12月30%" },
};

/** その年分に使える特例（2割特例・3割特例）。使えない年は null */
export function getSpecialRule(taxYear: TaxYear, entity: "individual" | "corporation" = "individual") {
  if (taxYear === 2026) return { key: "reduced" as const, label: "2割特例", rate: 0.2 };
  if (entity === "individual" && (taxYear === 2027 || taxYear === 2028)) {
    return { key: "reduced" as const, label: "3割特例", rate: 0.3 };
  }
  return null;
}

export type InvoiceTaxResult = {
  salesExTax: number;
  taxOnSales: number;
  purchasesExTax: number;
  taxOnPurchases: number;
  /** 2割特例・3割特例（その年分に使えない場合は null） */
  reducedSpecialTax: number | null;
  /** 適用した特例の名前（2割特例・3割特例）。使えない年は null */
  specialLabel: string | null;
  /** インボイスのない仕入れの控除割合（その年の平均） */
  nonInvoiceCreditRate: number;
  /** 簡易課税 */
  simplifiedTax: number;
  /** 本則課税（一般課税） */
  generalTax: number;
  cheapest: "reduced" | "simplified" | "general";
};

export function calcInvoiceTax(input: InvoiceTaxInput): InvoiceTaxResult {
  const { salesTaxIncluded, taxRate, category, purchasesTaxIncluded } = input;
  const taxYear = input.taxYear ?? 2026;
  const entity = input.entity ?? "individual";
  const divisor = 1 + taxRate;

  const salesExTax = salesTaxIncluded / divisor;
  const taxOnSales = salesExTax * taxRate;

  const purchasesExTax = purchasesTaxIncluded / divisor;
  const taxOnPurchases = purchasesExTax * taxRate;
  const nonInvoice = Math.min(Math.max(0, input.nonInvoicePurchasesTaxIncluded ?? 0), purchasesTaxIncluded);
  const taxOnNonInvoice = (nonInvoice / divisor) * taxRate;
  const nonInvoiceCreditRate = NON_INVOICE_CREDIT_RATES[taxYear].rate;

  // 2割特例・3割特例：納税額＝売上に係る消費税額の20%（2026年分）／30%（個人の2027・2028年分）
  const special = getSpecialRule(taxYear, entity);
  const reducedSpecialTax = special ? Math.max(0, Math.round(taxOnSales * special.rate)) : null;

  // 簡易課税：業種別のみなし仕入率を適用
  const deemedRate = DEEMED_PURCHASE_RATES[category].rate;
  const simplifiedTax = Math.max(0, Math.round(taxOnSales * (1 - deemedRate)));

  // 本則課税：インボイスのある仕入れは全額、ない仕入れは経過措置の割合だけ控除
  const creditable = taxOnPurchases - taxOnNonInvoice + taxOnNonInvoice * nonInvoiceCreditRate;
  const generalTax = Math.max(0, Math.round(taxOnSales - creditable));

  const options: { key: "reduced" | "simplified" | "general"; value: number }[] = [
    ...(reducedSpecialTax !== null ? [{ key: "reduced" as const, value: reducedSpecialTax }] : []),
    { key: "simplified", value: simplifiedTax },
    { key: "general", value: generalTax },
  ];
  const cheapest = options.reduce((a, b) => (b.value < a.value ? b : a)).key;

  return {
    salesExTax: Math.round(salesExTax),
    taxOnSales: Math.round(taxOnSales),
    purchasesExTax: Math.round(purchasesExTax),
    taxOnPurchases: Math.round(taxOnPurchases),
    reducedSpecialTax,
    specialLabel: special?.label ?? null,
    nonInvoiceCreditRate,
    simplifiedTax,
    generalTax,
    cheapest,
  };
}

/** 2割特例が使える最後の課税期間（個人事業主・12月決算法人の場合の目安） */
export const REDUCED_SPECIAL_DEADLINE = "2026年9月30日";

/** 3割特例が使える年分（個人事業主のみ） */
export const THIRTY_PERCENT_SPECIAL_YEARS = "2027年分・2028年分";
