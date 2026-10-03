import { readFileSync } from "node:fs";
import { expect, type Page } from "@playwright/test";

/** playwright.config.ts の webServer と同じポート */
export const E2E_PORT = Number(process.env.GOODS_E2E_PORT ?? 3210);
export const E2E_BASE = `http://localhost:${E2E_PORT}`;
export const E2E_BASE_IP = `http://127.0.0.1:${E2E_PORT}`;

function env(name: string): string {
  if (process.env[name]) return process.env[name]!;
  const line = readFileSync(".env.local", "utf8")
    .split("\n")
    .find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1) : "";
}

export const SUPABASE_URL = env("NEXT_PUBLIC_GOODS_SUPABASE_URL");
const host = new URL(SUPABASE_URL || "http://invalid").hostname;
if (!["127.0.0.1", "localhost"].includes(host)) {
  throw new Error(`E2E はローカル Supabase 専用です（接続先: ${host}）。本番DBでは実行しません。`);
}

/** ローカル Mailpit（supabase-goods の local_smtp）から最新のログインコードを取得 */
export async function fetchOtp(email: string, notBefore: number): Promise<string> {
  const mailpit = "http://127.0.0.1:55324";
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`${mailpit}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`);
    const data = (await res.json()) as { messages: { Created: string; Snippet: string }[] };
    const latest = data.messages?.find((m) => new Date(m.Created).getTime() >= notBefore - 1000);
    const code = latest?.Snippet.match(/(\d{6})/)?.[1];
    if (code) return code;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`OTP mail not found for ${email}`);
}

export async function login(page: Page, email: string, next = "/mochico/events", landing?: RegExp) {
  await page.goto(`/mochico/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("メールアドレス").fill(email);
  const sentAt = Date.now();
  await page.getByRole("button", { name: "ログインコードを送る" }).click();
  await expect(page.getByLabel("ログインコード")).toBeVisible();
  const code = await fetchOtp(email, sentAt);
  await page.getByLabel("ログインコード").fill(code);
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
  await page.waitForURL(landing ?? ((u) => u.pathname === next));
}

export async function logout(page: Page) {
  await page.goto("/mochico/settings");
  await page.getByRole("button", { name: "ログアウト" }).click();
  await page.waitForURL(/\/mochico\/login/);
}

export function uniqueEmail(label: string) {
  return `e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.test`;
}

export function goodsCard(page: Page, name: string) {
  return page.getByRole("button", { name: new RegExp(`^${name.replace(/[()（）]/g, ".")}、`) });
}

/** テスト用の管理クライアント（ローカル専用。期限切れリンクの作成や行数の確認に使う） */
export async function adminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(SUPABASE_URL, env("GOODS_TEST_SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
}
