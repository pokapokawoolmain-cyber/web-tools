// ============================================================
// Search Console API の認証（サービスアカウント・依存ゼロ）
//   gsc-weekly-fetch.ts / gsc-index-inspect.ts で共通利用
//   鍵: GSC_SA_KEY_B64（base64）・GSC_SA_KEY_JSON・GSC_SA_KEY_FILE のいずれか
// ============================================================
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

export type ServiceAccount = { client_email: string; private_key: string };

export function loadServiceAccount(): ServiceAccount {
  const raw = process.env.GSC_SA_KEY_B64
    ? Buffer.from(process.env.GSC_SA_KEY_B64, "base64").toString("utf8")
    : process.env.GSC_SA_KEY_JSON ?? (process.env.GSC_SA_KEY_FILE ? readFileSync(process.env.GSC_SA_KEY_FILE, "utf8") : "");
  if (!raw) throw new Error("GSC_SA_KEY_B64・GSC_SA_KEY_JSON・GSC_SA_KEY_FILE のいずれかを設定してください");
  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) throw new Error("鍵 JSON に client_email / private_key がありません");
  return sa;
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

export async function getAccessToken(sa: ServiceAccount): Promise<string> {
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
