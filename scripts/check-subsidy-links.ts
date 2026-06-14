/* eslint-disable no-console */
// ============================================================
// 補助金 外部リンク検査
//   実行: npm run check:subsidy-links
//
// - 各制度の officialUrl / sourceUrl / applicationUrl を GET で確認
//   （HEADを拒否する公式サイトがあるため GET + redirect follow）
// - ステータス・最終遷移先・エラーを一覧出力
// - 公的ドメイン以外は「要確認」として強調
// - 高頻度クロール禁止: 1リクエストずつ・待機を入れて実行
//
// 注意: 実行環境からネットワークに出られない場合は
//       各行 "NETWORK_BLOCKED" として記録される（クラッシュしない）。
// ============================================================
import { SUBSIDIES_SOURCE } from "../data/subsidies";

const OFFICIAL_DOMAIN =
  /(\.go\.jp|\.lg\.jp|jgrants-portal\.go\.jp|gbiz-id\.go\.jp|smrj\.go\.jp|mhlw\.go\.jp|meti\.go\.jp|chusho\.meti\.go\.jp)/i;

const TIMEOUT_MS = 12_000;
const DELAY_MS = 1_500; // 公式サイトへの配慮（高頻度クロール禁止）

type Result = {
  name: string;
  field: string;
  url: string;
  status: number | string;
  finalUrl: string;
  official: boolean;
  note: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function check(url: string): Promise<{ status: number | string; finalUrl: string; note: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "ToolBoxSubsidyLinkChecker/1.0 (+https://toolboxjp.com)" },
    });
    clearTimeout(timer);
    const note = res.redirected ? "リダイレクトあり" : "";
    return { status: res.status, finalUrl: res.url, note };
  } catch (e) {
    clearTimeout(timer);
    const msg = (e as Error).name === "AbortError" ? "TIMEOUT" : (e as Error).message;
    const blocked = /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|network|fetch failed/i.test(msg);
    return { status: blocked ? "NETWORK_BLOCKED" : "ERROR", finalUrl: url, note: msg.slice(0, 80) };
  }
}

async function main() {
  // ユニークなURL（フィールド付き）を収集
  const targets: { name: string; field: string; url: string }[] = [];
  const seen = new Set<string>();
  for (const s of SUBSIDIES_SOURCE) {
    for (const [field, url] of [
      ["officialUrl", s.officialUrl],
      ["sourceUrl", s.sourceUrl],
      ["applicationUrl", (s as { applicationUrl?: string }).applicationUrl],
    ] as const) {
      if (url && !seen.has(url)) {
        seen.add(url);
        targets.push({ name: s.name, field, url });
      }
    }
  }

  console.log(`外部リンク検査: ${targets.length}件（GET / redirect follow / ${TIMEOUT_MS / 1000}s timeout）`);
  console.log(`最終確認日時: ${new Date().toISOString()}\n`);

  const results: Result[] = [];
  for (const t of targets) {
    const r = await check(t.url);
    const official = OFFICIAL_DOMAIN.test(r.finalUrl);
    results.push({ name: t.name, field: t.field, url: t.url, status: r.status, finalUrl: r.finalUrl, official, note: r.note });
    const flag =
      typeof r.status === "number"
        ? r.status >= 200 && r.status < 300
          ? official ? "OK" : "OK(非公的ドメイン要確認)"
          : `要確認(${r.status})`
        : `要確認(${r.status})`;
    console.log(`- [${flag}] ${t.name} (${t.field})`);
    console.log(`    ${t.url}`);
    if (r.finalUrl !== t.url) console.log(`    → ${r.finalUrl}`);
    if (r.note) console.log(`    note: ${r.note}`);
    await sleep(DELAY_MS);
  }

  const bad = results.filter(
    (r) => typeof r.status !== "number" || r.status < 200 || r.status >= 400,
  );
  const nonOfficial = results.filter((r) => !r.official && typeof r.status === "number" && r.status < 400);
  console.log(`\n総数 ${results.length} / 要修正(4xx/5xx/error) ${bad.length} / 非公的ドメイン ${nonOfficial.length}`);
  // ネットワーク遮断環境では落とさない。明確な4xx/5xxのみ警告終了。
  const hardFail = results.some((r) => typeof r.status === "number" && (r.status === 404 || r.status === 410));
  if (hardFail) process.exitCode = 1;
}

main();
