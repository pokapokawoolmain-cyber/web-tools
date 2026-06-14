/* eslint-disable no-console */
// ============================================================
// 補助金ステータス判定の単体テスト
//   実行: npm run test:subsidy
// 依存ゼロ（node:assert）。tsx で TypeScript を直接実行する。
// ============================================================
import assert from "node:assert/strict";
import {
  computeSubsidyStatus,
  getStatusDetail,
  jstTodayInt,
  daysUntil,
} from "../lib/subsidy/status";

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

// JST正午相当のUTC（その暦日が確実にJSTでその日になる）
const at = (jstDate: string) => new Date(`${jstDate}T03:00:00Z`); // = 正午 JST

console.log("subsidy status logic");

// 1. 締切当日 → まだ受付中
test("締切当日は受付中", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "受付中", applicationStartDate: "2026-06-01", applicationEndDate: "2026-06-14" },
    at("2026-06-14"),
  );
  assert.equal(s, "受付中");
});

// 2. 締切翌日 → 終了（自動でclosedになる）
test("締切翌日は終了（自動close）", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "受付中", applicationStartDate: "2026-06-01", applicationEndDate: "2026-06-14" },
    at("2026-06-15"),
  );
  assert.equal(s, "終了");
});

// 3. 開始日前日 → 準備中（upcoming）
test("開始日前日は準備中", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "受付中", applicationStartDate: "2026-07-01", applicationEndDate: "2026-07-31" },
    at("2026-06-30"),
  );
  assert.equal(s, "準備中");
});

// 4. 開始当日 → 受付中
test("開始当日は受付中", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "準備中", applicationStartDate: "2026-07-01", applicationEndDate: "2026-07-31" },
    at("2026-07-01"),
  );
  assert.equal(s, "受付中");
});

// 5. 随時受付 → 締切日が過去でも随時受付のまま（誤って終了にしない）
test("随時受付は締切プレースホルダが過去でも維持", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "随時受付", applicationEndDate: "2025-08-31", rolling: true },
    at("2026-06-14"),
  );
  assert.equal(s, "随時受付");
});

// 6. 締切未定（日付なし） → 受付中と断定しない
test("締切未定は受付中と断定しない（不明）", () => {
  const s = computeSubsidyStatus({ storedStatus: "受付中" }, at("2026-06-14"));
  assert.equal(s, "不明");
});

// 6b. 旧データ（2025締切・受付中表記）が自動で終了になる＝今回の本丸
test("2025年の旧締切データは自動で終了になる", () => {
  const s = computeSubsidyStatus(
    { storedStatus: "受付中", applicationEndDate: "2025-09-30" },
    at("2026-06-14"),
  );
  assert.equal(s, "終了");
});

// 7. JST日付境界: UTCでは前日でもJSTで翌日ならJST基準で判定
test("JST日付境界: UTC 15:30 は翌日のJST扱い", () => {
  // 2026-06-14T15:30:00Z = 2026-06-15 00:30 JST
  assert.equal(jstTodayInt(new Date("2026-06-14T15:30:00Z")), 20260615);
  // 2026-06-14T14:30:00Z = 2026-06-14 23:30 JST
  assert.equal(jstTodayInt(new Date("2026-06-14T14:30:00Z")), 20260614);
});

// 8. 締切間近（14日以内）の判定
test("締切14日前以内はclosing soon", () => {
  const d = getStatusDetail(
    { storedStatus: "受付中", applicationEndDate: "2026-06-20" },
    at("2026-06-14"),
  );
  assert.equal(d.status, "受付中");
  assert.equal(d.daysLeft, 6);
  assert.equal(d.isClosingSoon, true);
});

test("締切15日以上先はclosing soonでない", () => {
  const d = getStatusDetail(
    { storedStatus: "受付中", applicationEndDate: "2026-07-30" },
    at("2026-06-14"),
  );
  assert.equal(d.isClosingSoon, false);
});

// 9. daysUntil: 当日0・前日1・過ぎたら負
test("daysUntil 当日=0/前日=1/翌日=-1", () => {
  assert.equal(daysUntil("2026-06-14", at("2026-06-14")), 0);
  assert.equal(daysUntil("2026-06-15", at("2026-06-14")), 1);
  assert.equal(daysUntil("2026-06-13", at("2026-06-14")), -1);
});

// ── 診断ロジック（終了制度の除外・0件・同点）──────────────
import { diagnose, SUBSIDIES } from "../data/subsidies";

test("診断結果に終了制度が含まれない", () => {
  const results = diagnose({
    businessType: "法人",
    prefecture: "東京都",
    industry: "IT",
    employeeCount: "1〜5人",
    purposes: ["IT導入"],
    investmentAmount: "100〜500万円",
    hiringPlan: "未定",
    wageIncreasePlan: "未定",
  });
  assert.ok(Array.isArray(results));
  for (const r of results) {
    assert.notEqual(r.subsidy.status, "終了", `終了制度が混入: ${r.subsidy.name}`);
  }
});

test("派生ステータスにより旧制度が終了扱い（受付中に残らない）", () => {
  const open = SUBSIDIES.filter((s) => s.status === "受付中");
  // 締切が過去の受付中が存在しないこと
  for (const s of open) {
    if (s.applicationEndDate) {
      const today = jstTodayInt();
      const end = Number(s.applicationEndDate.replace(/-/g, ""));
      assert.ok(end >= today, `締切超過なのに受付中: ${s.name} (${s.applicationEndDate})`);
    }
  }
});

console.log(`\n${passed} checks passed`);
