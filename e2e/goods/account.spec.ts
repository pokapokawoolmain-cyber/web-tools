// オーナー退会 → 共有カタログの保存（Preserved Read-Only Catalog）の E2E
import { expect, test, type Browser, type Page } from "@playwright/test";
import { adminClient, fetchOtp, goodsCard, login, uniqueEmail, E2E_BASE } from "./helpers";

test.describe.configure({ mode: "serial" });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "mobile", "スマホ設定で1回だけ実行");
});

const emailA = uniqueEmail("del-a");
const emailB = uniqueEmail("del-b");

async function ctx(browser: Browser, extra: Record<string, unknown> = {}) {
  const { devices } = await import("@playwright/test");
  return browser.newContext({ ...devices["iPhone 13"], baseURL: E2E_BASE, ...extra });
}
async function loginHere(page: Page, email: string) {
  await page.getByLabel("メールアドレス").fill(email);
  const t = Date.now();
  await page.getByRole("button", { name: "ログインコードを送る" }).click();
  await expect(page.getByLabel("ログインコード")).toBeVisible();
  await page.getByLabel("ログインコード").fill(await fetchOtp(email, t));
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
}

test("オーナーが退会しても、参加者のリストは読み取り専用で残り、取得状況を記録できる", async ({ browser }) => {
  test.setTimeout(120_000);
  const cA = await ctx(browser);
  const cB = await ctx(browser);
  const a = await cA.newPage();
  const b = await cB.newPage();

  // A: イベント作成・2商品・共有
  await login(a, emailA, "/mochico/events/new");
  await a.getByLabel("イベント名").fill("退会E2Eライブ [TEST]");
  await a.getByRole("button", { name: "作成してグッズを登録" }).click();
  await a.waitForURL(/\/items\/new/);
  for (const [i, n] of ["退会グッズ1", "退会グッズ2"].entries()) {
    await a.getByLabel("商品名").fill(n);
    await a.getByRole("button", { name: "保存して続けて追加" }).click();
    await expect(a.getByText(`このイベントに ${i + 1} 件追加しました`)).toBeVisible();
  }
  const eventPath = new URL(a.url()).pathname.replace(/\/items\/new$/, "");
  await a.goto(eventPath);
  await a.getByRole("button", { name: "共有" }).click();
  const dlg = a.getByRole("dialog", { name: "グッズリストを共有" });
  await dlg.getByRole("button", { name: "共有リンクを作成" }).click();
  const shareUrl = await dlg.getByLabel("共有URL").inputValue();
  await dlg.getByRole("button", { name: "閉じる" }).first().click();

  // B: 参加して1つ取得済み
  await b.goto(shareUrl);
  await b.getByRole("link", { name: "ログインして自分の管理に追加" }).click();
  await b.waitForURL(/login/);
  await loginHere(b, emailB);
  await b.waitForURL(new RegExp(`${eventPath}\\?added=1$`), { timeout: 20_000 });
  await goodsCard(b, "退会グッズ1").click();
  await expect(goodsCard(b, "退会グッズ1")).toHaveAttribute("aria-pressed", "true");

  // A: 設定 → アカウントを削除
  await a.goto("/mochico/settings");
  await a.getByRole("button", { name: "アカウントを削除する" }).click();
  const submit = a.getByRole("button", { name: "アカウントを完全に削除" });
  await expect(submit).toBeDisabled();
  await a.getByLabel("確認のため「削除」と入力してください").fill("削除");
  await submit.click();
  await a.waitForURL(/\/mochico\/login\?deleted=1/, { timeout: 20_000 });
  await expect(a.getByText("アカウントを削除しました")).toBeVisible();
  await a.goto("/mochico/events");
  await a.waitForURL(/\/mochico\/login/); // セッションは消えている

  // B: 読み取り専用で残る
  await b.reload();
  await expect(b.getByText("このリストの作成者は退会しています")).toBeVisible();
  await expect(goodsCard(b, "退会グッズ1")).toHaveAttribute("aria-pressed", "true");
  await expect(b.getByRole("button", { name: "共有" })).toHaveCount(0);
  await expect(b.getByRole("link", { name: "イベントを編集" })).toHaveCount(0);
  await goodsCard(b, "退会グッズ2").click();
  await expect(goodsCard(b, "退会グッズ2")).toHaveAttribute("aria-pressed", "true");
  await b.reload();
  await expect(goodsCard(b, "退会グッズ2")).toHaveAttribute("aria-pressed", "true");
  await b.goto(`${eventPath}/edit`);
  await expect(b.getByText("編集する権限がありません")).toBeVisible();
  await b.goto("/mochico/events");
  await expect(b.getByRole("link", { name: /退会E2Eライブ/ }).getByText("作成者退会")).toBeVisible();
  // 元オーナーのメールアドレスはどこにも表示されない
  await b.goto(eventPath);
  expect(await b.content()).not.toContain(emailA);

  // 共有リンクは失効
  const cN = await ctx(browser);
  const n = await cN.newPage();
  await n.goto(shareUrl);
  await expect(n.getByText("この共有リンクは共有が終了しています")).toBeVisible();

  // DB: A は存在しない
  const admin = await adminClient();
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  expect(users.users.some((u) => u.email === emailA)).toBe(false);

  await cA.close();
  await cB.close();
  await cN.close();
});
