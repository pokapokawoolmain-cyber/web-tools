/* eslint-disable no-console */
// ============================================================
// サイトマップの全URLのインデックス登録状況を URL 検査 API で調べる（週次 PDCA 用）
//   実行: npm run gsc:inspect
//
// Search Console の「ページ」レポートの URL 一覧は API で取れないため、
// サイトマップの各 URL を URL 検査 API（1日2,000件まで）で1件ずつ確認する。
// 出力: reports/gsc/<今日>/index-inspection.json（URL ごとの状態）と index-summary.json（状態別の件数）
// 環境変数: gsc-auth.ts の鍵、GSC_SITE_URL（既定 https://www.toolboxjp.com/）、
//           SITEMAP_URL（既定 https://www.toolboxjp.com/sitemap.xml）
// ============================================================
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAccessToken, loadServiceAccount } from "./gsc-auth";

type Inspection = {
  url: string;
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  sitemap?: string[];
  error?: string;
};

async function inspect(token: string, site: string, url: string): Promise<Inspection> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: site, languageCode: "ja" }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) return { url, error: `${res.status} ${(await res.text()).slice(0, 200)}` };
    const r = (await res.json()) as { inspectionResult?: { indexStatusResult?: Record<string, unknown> } };
    const s = (r.inspectionResult?.indexStatusResult ?? {}) as Record<string, string & string[]>;
    return {
      url,
      verdict: s.verdict,
      coverageState: s.coverageState,
      indexingState: s.indexingState,
      pageFetchState: s.pageFetchState,
      robotsTxtState: s.robotsTxtState,
      lastCrawlTime: s.lastCrawlTime,
      googleCanonical: s.googleCanonical,
      userCanonical: s.userCanonical,
      sitemap: s.sitemap,
    };
  }
  return { url, error: "retry limit" };
}

async function main() {
  const site = process.env.GSC_SITE_URL ?? "https://www.toolboxjp.com/";
  const sitemapUrl = process.env.SITEMAP_URL ?? "https://www.toolboxjp.com/sitemap.xml";
  const xml = await (await fetch(sitemapUrl)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  console.log(`サイトマップ: ${urls.length} URL`);

  const token = await getAccessToken(loadServiceAccount());
  const results: Inspection[] = [];
  const concurrency = 4; // API 上限（1分600件）に余裕を持たせる
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = await Promise.all(urls.slice(i, i + concurrency).map((u) => inspect(token, site, u)));
    results.push(...batch);
    if ((i / concurrency) % 10 === 0) console.log(`  ${Math.min(i + concurrency, urls.length)} / ${urls.length}`);
  }

  const summary: Record<string, number> = {};
  for (const r of results) {
    const key = r.error ? `エラー: ${r.error.slice(0, 40)}` : r.coverageState ?? "不明";
    summary[key] = (summary[key] ?? 0) + 1;
  }
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const outDir = join(process.cwd(), "reports", "gsc", today);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index-inspection.json"), JSON.stringify(results, null, 1));
  writeFileSync(join(outDir, "index-summary.json"), JSON.stringify({ site, inspectedAt: new Date().toISOString(), total: results.length, summary }, null, 2));
  console.log("\n状態別:");
  for (const [k, v] of Object.entries(summary).sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);
  console.log(`\n保存先: ${outDir}`);
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exitCode = 1;
});
