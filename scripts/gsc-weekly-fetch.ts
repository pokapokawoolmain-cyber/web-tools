/* eslint-disable no-console */
// ============================================================
// Search Console の週次データ取得（週次 PDCA 用）
//   実行: npm run gsc:fetch
//
// 認証: サービスアカウント（Search Console に「制限付き（閲覧のみ）」で追加したもの）
//   GSC_SA_KEY_JSON  … サービスアカウントの鍵 JSON の中身（クラウド環境の秘密情報に登録）
//   GSC_SA_KEY_FILE  … または鍵ファイルのパス（ローカル実行用。リポジトリには置かない）
//   GSC_SITE_URL     … プロパティ。既定は "sc-domain:toolboxjp.com"
//                      （URL プレフィックスのプロパティなら "https://www.toolboxjp.com/"）
//
// 出力: reports/gsc/<基準日>/*.json（直近7日・前の7日・直近28日・前の28日 × ページ/クエリ/デバイス/見え方）
// 依存ゼロ: JWT 署名は node:crypto、API 呼び出しは fetch。
// 注意: 検索パフォーマンスのデータは2〜3日遅れて確定するため、終了日は3日前にそろえる。
//       「生成 AI 機能」のレポートは API で取得できないため、必要な週は手動エクスポートを使う。
// ============================================================
import { createSign } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type ServiceAccount = { client_email: string; private_key: string };

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.GSC_SA_KEY_JSON ?? (process.env.GSC_SA_KEY_FILE ? readFileSync(process.env.GSC_SA_KEY_FILE, "utf8") : "");
  if (!raw) throw new Error("GSC_SA_KEY_JSON または GSC_SA_KEY_FILE を設定してください");
  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) throw new Error("鍵 JSON に client_email / private_key がありません");
  return sa;
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const jwt = `${header}.${claim}.${b64url(signer.sign(sa.private_key))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!res.ok) throw new Error(`トークン取得に失敗: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/** JST の日付（YYYY-MM-DD）を days 日ずらして返す */
function jstDate(offsetDays: number, base = new Date()): string {
  const jst = new Date(base.getTime() + 9 * 3600 * 1000 + offsetDays * 86400 * 1000);
  return jst.toISOString().slice(0, 10);
}

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(token: string, site: string, body: Record<string, unknown>): Promise<Row[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const rows: Row[] = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ ...body, type: "web", rowLimit: 25000, startRow }),
    });
    if (!res.ok) throw new Error(`searchAnalytics.query に失敗: ${res.status} ${await res.text()}`);
    const page = ((await res.json()) as { rows?: Row[] }).rows ?? [];
    rows.push(...page);
    if (page.length < 25000) break;
  }
  return rows;
}

async function main() {
  const site = process.env.GSC_SITE_URL ?? "sc-domain:toolboxjp.com";
  const sa = loadServiceAccount();
  const token = await getAccessToken(sa);

  // 確定済みデータにそろえるため、終了日は3日前
  const end = jstDate(-3);
  const ranges = {
    d7: { startDate: jstDate(-9), endDate: end },
    prev7: { startDate: jstDate(-16), endDate: jstDate(-10) },
    d28: { startDate: jstDate(-30), endDate: end },
    prev28: { startDate: jstDate(-58), endDate: jstDate(-31) },
  };
  const dimensionSets: Record<string, string[]> = {
    total: [],
    page: ["page"],
    query: ["query"],
    pageQuery: ["page", "query"],
    device: ["device"],
    appearance: ["searchAppearance"],
    date: ["date"],
  };

  const outDir = join(process.cwd(), "reports", "gsc", end);
  mkdirSync(outDir, { recursive: true });
  const summary: Record<string, unknown> = { site, fetchedAt: new Date().toISOString(), ranges };

  for (const [rangeName, range] of Object.entries(ranges)) {
    for (const [dimName, dimensions] of Object.entries(dimensionSets)) {
      // ページ×クエリと日別は直近期間だけで十分
      if ((dimName === "pageQuery" || dimName === "date") && rangeName !== "d28") continue;
      const rows = await query(token, site, { ...range, dimensions });
      writeFileSync(join(outDir, `${rangeName}-${dimName}.json`), JSON.stringify(rows, null, 1));
      if (dimName === "total") summary[rangeName] = rows[0] ?? null;
      console.log(`  ✓ ${rangeName}-${dimName}: ${rows.length} 行`);
    }
  }
  writeFileSync(join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(`\n保存先: ${outDir}`);
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exitCode = 1;
});
