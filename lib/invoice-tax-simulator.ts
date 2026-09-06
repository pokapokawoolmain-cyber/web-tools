// ========================================
// インボイス「2割特例」廃止後の税額シミュレーター 計算ロジック
// 2割特例・簡易課税・本則課税の3方式で消費税納税額を試算する
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
  /** 本則課税用：年間の課税仕入・経費（税込・円） */
  purchasesTaxIncluded: number;
};

export type InvoiceTaxResult = {
  salesExTax: number;
  taxOnSales: number;
  purchasesExTax: number;
  taxOnPurchases: number;
  /** 2割特例（2026年9月30日属する課税期間まで） */
  reducedSpecialTax: number;
  /** 簡易課税 */
  simplifiedTax: number;
  /** 本則課税（一般課税） */
  generalTax: number;
  cheapest: "reduced" | "simplified" | "general";
};

export function calcInvoiceTax(input: InvoiceTaxInput): InvoiceTaxResult {
  const { salesTaxIncluded, taxRate, category, purchasesTaxIncluded } = input;
  const divisor = 1 + taxRate;

  const salesExTax = salesTaxIncluded / divisor;
  const taxOnSales = salesExTax * taxRate;

  const purchasesExTax = purchasesTaxIncluded / divisor;
  const taxOnPurchases = purchasesExTax * taxRate;

  // 2割特例：みなし仕入率80%相当（納税額＝売上に係る消費税額の20%）
  const reducedSpecialTax = Math.max(0, Math.round(taxOnSales * 0.2));

  // 簡易課税：業種別のみなし仕入率を適用
  const deemedRate = DEEMED_PURCHASE_RATES[category].rate;
  const simplifiedTax = Math.max(0, Math.round(taxOnSales * (1 - deemedRate)));

  // 本則課税：実際の仕入税額を控除
  const generalTax = Math.max(0, Math.round(taxOnSales - taxOnPurchases));

  const options: { key: "reduced" | "simplified" | "general"; value: number }[] = [
    { key: "reduced", value: reducedSpecialTax },
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
    simplifiedTax,
    generalTax,
    cheapest,
  };
}

/** 2割特例が使える最後の課税期間（個人事業主・12月決算法人の場合の目安） */
export const REDUCED_SPECIAL_DEADLINE = "2026年9月30日";
