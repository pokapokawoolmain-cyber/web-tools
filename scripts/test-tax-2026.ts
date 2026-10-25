/* eslint-disable no-console */
// ============================================================
// 令和8年分の税制（手取り・住民税・ふるさと納税）の単体テスト
//   実行: npm run test:tax
// 期待値は国税庁タックスアンサー No.1199（基礎控除）・No.1410（給与所得控除）の表から。
// ============================================================
import assert from "node:assert/strict";
import {
  calcSalaryDeduction,
  calcBasicDeduction,
  calcResidentBasicDeduction,
  calcAnnualSocialInsurance,
  calcTakehome,
} from "../lib/takehome";
import { calcResidentTax, RESIDENT_EXEMPT_SALARY_SINGLE } from "../lib/resident-tax";
import { calcFurusatoLimit } from "../lib/furusato";
import { calcInvoiceTax } from "../lib/invoice-tax-simulator";

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

console.log("給与所得控除（令和8年分・令和9年分）");
test("220万円以下は74万円", () => {
  assert.equal(calcSalaryDeduction(1_500_000), 740_000);
  assert.equal(calcSalaryDeduction(2_200_000), 740_000);
});
test("収入が74万円未満なら収入全額まで", () => assert.equal(calcSalaryDeduction(600_000), 600_000));
test("220万円超は収入×30%＋8万円（境界で連続）", () => {
  assert.equal(calcSalaryDeduction(3_000_000), 980_000);
  assert.equal(Math.round(calcSalaryDeduction(2_200_001)), 740_000);
});
test("360万・660万・850万円の区分", () => {
  assert.equal(calcSalaryDeduction(5_000_000), 1_440_000);
  assert.equal(calcSalaryDeduction(8_000_000), 1_900_000);
  assert.equal(calcSalaryDeduction(10_000_000), 1_950_000);
});

console.log("基礎控除（所得税・令和8年分）");
test("合計所得489万円以下は104万円", () => {
  assert.equal(calcBasicDeduction(0), 1_040_000);
  assert.equal(calcBasicDeduction(4_890_000), 1_040_000);
});
test("489万円超655万円以下は67万円", () => assert.equal(calcBasicDeduction(4_890_001), 670_000));
test("655万円超2,350万円以下は62万円", () => assert.equal(calcBasicDeduction(10_000_000), 620_000));
test("2,350万円超の逓減と2,500万円超の0円", () => {
  assert.equal(calcBasicDeduction(23_900_000), 480_000);
  assert.equal(calcBasicDeduction(24_400_000), 320_000);
  assert.equal(calcBasicDeduction(24_900_000), 160_000);
  assert.equal(calcBasicDeduction(25_000_001), 0);
});
test("住民税の基礎控除は43万円", () => assert.equal(calcResidentBasicDeduction(5_000_000), 430_000));

console.log("年収の壁");
test("給与収入178万円なら所得税の課税所得は0（社会保険料なしでも）", () => {
  const income = 1_780_000;
  const employment = income - calcSalaryDeduction(income);
  assert.equal(employment - calcBasicDeduction(employment), 0);
});
test("単身の住民税非課税ラインは給与収入119万円", () => {
  assert.equal(RESIDENT_EXEMPT_SALARY_SINGLE, 1_190_000);
  assert.equal(calcResidentTax(1_190_000).isExempt, true);
  assert.equal(calcResidentTax(1_200_000).isExempt, false);
});

console.log("社会保険料");
test("780万円以下は健康保険4.955%＋厚生年金9.15%＋雇用保険0.55%", () => assert.equal(Math.round(calcAnnualSocialInsurance(5_000_000)), 732_750));
test("厚生年金の上限を超えた部分には年金保険料がかからない", () => {
  assert.equal(Math.round(calcAnnualSocialInsurance(20_000_000)), Math.round(16_680_000 * 0.04955 + 7_800_000 * 0.0915 + 20_000_000 * 0.0055));
});

console.log("手取り");
test("年収500万円：所得税は課税所得×5%の帯（約9.2万円）", () => {
  const r = calcTakehome(5_000_000);
  // 給与所得356万 − 社保73.275万 − 基礎控除104万 = 178.725万 → 5% × 1.021
  assert.equal(r.incomeTax, Math.round(1_787_250 * 0.05 * 1.021));
});
test("手取りは年収が増えるほど増える（2,000万円まで単調）", () => {
  let prev = 0;
  // 合計所得2,500万円超で基礎控除が0になる段差は制度どおりなので、2,000万円までで確認
  for (let y = 1_000_000; y <= 20_000_000; y += 100_000) {
    const n = calcTakehome(y).annualNet;
    assert.ok(n > prev, `${y}円で手取りが減少`);
    prev = n;
  }
});

console.log("ふるさと納税の控除上限額");
// 総務省「全額控除されるふるさと納税額（年間上限）の目安」（旧税制）と近い水準になることを確認
const near = (actual: number, expected: number, tol = 0.15) =>
  assert.ok(Math.abs(actual - expected) / expected <= tol, `${actual} が ${expected} の±${tol * 100}%外`);
test("独身 300万円 ≒ 2.8万円", () => near(calcFurusatoLimit({ income: 3_000_000, hasSpouse: false, generalDependents: 0 }).limit, 28_000));
test("独身 500万円 ≒ 6.1万円", () => near(calcFurusatoLimit({ income: 5_000_000, hasSpouse: false, generalDependents: 0 }).limit, 61_000));
test("独身 1,000万円 ≒ 18万円", () => near(calcFurusatoLimit({ income: 10_000_000, hasSpouse: false, generalDependents: 0 }).limit, 180_000));
test("夫婦 500万円 ≒ 4.9万円", () => near(calcFurusatoLimit({ income: 5_000_000, hasSpouse: true, generalDependents: 0 }).limit, 49_000));
test("夫婦＋高校生 700万円 ≒ 8.5万円", () => near(calcFurusatoLimit({ income: 7_000_000, hasSpouse: true, generalDependents: 1 }).limit, 85_000));
test("住民税の基礎控除を二重に引かない（独身500万円の所得割が約24万円）", () => {
  const r = calcFurusatoLimit({ income: 5_000_000, hasSpouse: false, generalDependents: 0 });
  near(r.residentIncomeLevy, 240_000, 0.05);
});

console.log("インボイス（令和8年度改正）");
const inv = { salesTaxIncluded: 5_500_000, taxRate: 0.1 as const, category: "service" as const, purchasesTaxIncluded: 1_100_000 };
test("2026年分は2割特例（売上税額50万円×20%）", () => {
  const r = calcInvoiceTax({ ...inv, taxYear: 2026 });
  assert.equal(r.specialLabel, "2割特例");
  assert.equal(r.reducedSpecialTax, 100_000);
});
test("個人の2027・2028年分は3割特例（×30%）", () => {
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2027 }).reducedSpecialTax, 150_000);
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2028 }).specialLabel, "3割特例");
});
test("法人の2027年分と個人の2029年分は特例なし", () => {
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2027, entity: "corporation" }).reducedSpecialTax, null);
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2029 }).reducedSpecialTax, null);
});
test("インボイスのない仕入れは2027年分70%控除", () => {
  // 仕入110万円（税10万円）すべてインボイスなし → 7万円だけ控除 → 50万 − 7万 = 43万
  const r = calcInvoiceTax({ ...inv, taxYear: 2027, nonInvoicePurchasesTaxIncluded: 1_100_000 });
  assert.equal(r.generalTax, 430_000);
});
test("2029年分は50%控除、インボイスありの仕入れは全額控除", () => {
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2029, nonInvoicePurchasesTaxIncluded: 1_100_000 }).generalTax, 450_000);
  assert.equal(calcInvoiceTax({ ...inv, taxYear: 2029 }).generalTax, 400_000);
});

console.log(`\n${passed} passed`);
