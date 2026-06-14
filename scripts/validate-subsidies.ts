/* eslint-disable no-console */
// ============================================================
// 補助金データのスキーマ・鮮度検証
//   実行: npm run validate:subsidies
//
// - 必須フィールドの欠落、ID重複、URL形式、日付の妥当性を検査
// - 派生ステータス（締切超過の自動終了）を計算し、
//   「更新が必要な制度」を一覧で表示する
// - スキーマ違反があれば exit 1（CIで落とせる）
//   鮮度の警告は exit 0（情報提供）
// ============================================================
import { SUBSIDIES_SOURCE, type SubsidyData } from "../data/subsidies";
import { computeSubsidyStatus, dateStrToInt, jstTodayInt } from "../lib/subsidy/status";

const errors: string[] = [];
const warnings: string[] = [];

const isHttpsUrl = (u?: string) => !!u && /^https:\/\/[^\s]+$/.test(u);
const isDate = (s?: string) => !s || dateStrToInt(s) !== null;

const seenIds = new Set<string>();
const seenNames = new Set<string>();

// 公的ドメインの簡易判定（民間まとめサイト混入の検知用）
const OFFICIAL_DOMAIN = /(\.go\.jp|\.lg\.jp|\.jgrants-portal\.go\.jp|gbiz-id\.go\.jp|smrj\.go\.jp|jgrants|chusho\.meti\.go\.jp|mhlw\.go\.jp|meti\.go\.jp|shokokai|cci\.or\.jp|jsbri)/i;

function checkProgram(s: SubsidyData) {
  const tag = `[${s.id ?? "??"}] ${s.name ?? "(no name)"}`;

  // 必須
  if (!s.id) errors.push(`${tag}: id が空`);
  if (!s.name) errors.push(`${tag}: name が空`);
  if (!s.category) errors.push(`${tag}: category が空`);
  if (!s.officialUrl) errors.push(`${tag}: officialUrl が空`);
  if (!s.lastCheckedAt) errors.push(`${tag}: lastCheckedAt が空`);

  // 一意性
  if (s.id) {
    if (seenIds.has(s.id)) errors.push(`${tag}: id が重複`);
    seenIds.add(s.id);
  }
  if (s.name) {
    if (seenNames.has(s.name)) warnings.push(`${tag}: name が重複（別公募枠なら shortName で区別を）`);
    seenNames.add(s.name);
  }

  // URL形式
  if (s.officialUrl && !isHttpsUrl(s.officialUrl)) errors.push(`${tag}: officialUrl が https でない (${s.officialUrl})`);
  if (s.sourceUrl && !isHttpsUrl(s.sourceUrl)) errors.push(`${tag}: sourceUrl が https でない (${s.sourceUrl})`);
  if (s.officialUrl && !OFFICIAL_DOMAIN.test(s.officialUrl)) {
    warnings.push(`${tag}: officialUrl が公的ドメインに見えない（要確認） ${s.officialUrl}`);
  }

  // 日付妥当性
  if (!isDate(s.applicationStartDate)) errors.push(`${tag}: applicationStartDate が不正 (${s.applicationStartDate})`);
  if (!isDate(s.applicationEndDate)) errors.push(`${tag}: applicationEndDate が不正 (${s.applicationEndDate})`);
  if (!isDate(s.lastCheckedAt)) errors.push(`${tag}: lastCheckedAt が不正 (${s.lastCheckedAt})`);
  const st = dateStrToInt(s.applicationStartDate);
  const en = dateStrToInt(s.applicationEndDate);
  if (st !== null && en !== null && st > en) errors.push(`${tag}: 開始日 > 締切日`);

  // 断定表現の検知（「必ず」「対象です」等）
  const assertive = /必ず受給|必ずもらえ|確実に受給|あなたは対象です/;
  if (assertive.test(s.description ?? "")) errors.push(`${tag}: description に断定表現`);
}

SUBSIDIES_SOURCE.forEach(checkProgram);

// ─── 鮮度レポート ───────────────────────────────────────────
const today = jstTodayInt();
const STALE_DAYS = 60;
type Row = { name: string; live: string; end: string; checked: string; action: string; url: string };
const rows: Row[] = SUBSIDIES_SOURCE.map((s) => {
  const live = computeSubsidyStatus({
    storedStatus: s.status,
    applicationStartDate: s.applicationStartDate,
    applicationEndDate: s.applicationEndDate,
    rolling: s.status === "随時受付",
  });
  const checkedInt = dateStrToInt(s.lastCheckedAt);
  const stale =
    checkedInt !== null &&
    Math.round((Date.UTC(Math.floor(today / 10000), (Math.floor(today / 100) % 100) - 1, today % 100) -
      Date.UTC(Math.floor(checkedInt / 10000), (Math.floor(checkedInt / 100) % 100) - 1, checkedInt % 100)) / 86_400_000) > STALE_DAYS;

  let action = "OK";
  if (live === "終了") action = "要・新公募回へ更新（締切超過で自動終了中）";
  else if (live === "不明") action = "要・公式で締切確認";
  else if (stale) action = `要・再確認（${STALE_DAYS}日以上未確認）`;

  if (action !== "OK") warnings.push(`鮮度: [${s.id}] ${s.name} → ${action}`);

  return {
    name: s.name,
    live,
    end: s.applicationEndDate ?? "—",
    checked: s.lastCheckedAt ?? "—",
    action,
    url: s.officialUrl ?? "—",
  };
});

console.log("\n=== 補助金 鮮度レポート（派生ステータス）===");
console.log("制度名 / 現在状態 / 締切 / 最終確認 / 対応");
for (const r of rows) {
  console.log(`- ${r.name} | ${r.live} | ${r.end} | ${r.checked} | ${r.action}`);
}

console.log(`\n総数: ${SUBSIDIES_SOURCE.length}件`);
console.log(`スキーマエラー: ${errors.length}件 / 警告: ${warnings.length}件`);
if (errors.length) {
  console.error("\n--- スキーマエラー ---");
  errors.forEach((e) => console.error(`  ✗ ${e}`));
}
if (warnings.length) {
  console.log("\n--- 警告（更新が必要な可能性）---");
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (errors.length) process.exitCode = 1;
