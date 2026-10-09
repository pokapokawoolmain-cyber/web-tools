/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// 退会（オーナーアカウント削除）と共有カタログ保存のテスト（ローカル Supabase 専用）
//
// 実行: npm run goods:account-test
//   本番と同じ lib/goods/account.ts の deleteAccount / runOrphanCleanup を呼ぶ
//   （server-only を満たすため --conditions=react-server で起動している）
// ============================================================
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** storage.objects は PostgREST に公開されていないため、ローカル DB に psql で直接問い合わせる */
function storageOwners(eventId: string): { owner: string | null; owner_id: string | null }[] {
  if (!/^[0-9a-f-]{36}$/.test(eventId)) throw new Error("bad id");
  const out = execSync(
    `docker exec supabase_db_toolboxjp-goods psql -U postgres -tAc "select coalesce(owner::text,'NULL')||'|'||coalesce(owner_id,'NULL') from storage.objects where bucket_id='goods-images' and name like '${eventId}/%'"`,
    { env: { ...process.env, PATH: `/Applications/Docker.app/Contents/Resources/bin:${process.env.PATH}` } }
  ).toString();
  return out.trim().split("\n").filter(Boolean).map((l) => {
    const [o, oi] = l.split("|");
    return { owner: o === "NULL" ? null : o, owner_id: oi === "NULL" ? null : oi };
  });
}

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const URL_ = process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.GOODS_TEST_SUPABASE_SERVICE_ROLE_KEY ?? "";
const host = (() => {
  try {
    return new URL(URL_).hostname;
  } catch {
    return "";
  }
})();
if (!["127.0.0.1", "localhost"].includes(host) || !ANON || !SERVICE) {
  console.error(`中止: ローカル Supabase 以外（${host || "未設定"}）には接続しません。`);
  process.exit(2);
}

const { deleteAccount, runOrphanCleanup } = await import("../lib/goods/account");

const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
let passed = 0;
let failed = 0;
const check = (name: string, ok: boolean, detail?: unknown) => {
  if (ok) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`, detail ?? "");
  }
};
const stamp = Date.now();
const PW = `del-${stamp}-Pw!`;
const created: string[] = [];

interface U {
  id: string;
  email: string;
  c: SupabaseClient;
}
async function user(label: string, displayName?: string): Promise<U> {
  const email = `goods-del-${label}-${stamp}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: PW, email_confirm: true, user_metadata: { full_name: displayName ?? `氏名${label}` } });
  if (error || !data.user) throw new Error(error?.message);
  created.push(data.user.id);
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { error: e2 } = await c.auth.signInWithPassword({ email, password: PW });
  if (e2) throw new Error(e2.message);
  return { id: data.user.id, email, c };
}
const count = async (table: string, filter: Record<string, string>) => {
  let q = admin.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
  return (await q).count ?? -1;
};
const objects = async (eventId: string) => {
  const out: string[] = [];
  const { data: folders } = await admin.storage.from("goods-images").list(eventId, { limit: 1000 });
  for (const f of folders ?? []) {
    const { data: files } = await admin.storage.from("goods-images").list(`${eventId}/${f.name}`, { limit: 1000 });
    for (const x of files ?? []) out.push(`${eventId}/${f.name}/${x.name}`);
  }
  return out;
};
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");

/** オーナーが画像付きのイベント（カバー＋商品3点）を作る */
async function makeEvent(owner: U, title: string) {
  const { data: ev } = await owner.c.from("events").insert({ title, description: "概要", start_date: "2026-12-01" }).select().single();
  const coverId = crypto.randomUUID();
  const cover = `${ev!.id}/cover/${coverId}-full.jpg`;
  await owner.c.storage.from("goods-images").upload(cover, new Blob([png], { type: "image/jpeg" }), { contentType: "image/jpeg" });
  await owner.c.storage.from("goods-images").upload(cover.replace("-full", "-thumb"), new Blob([png], { type: "image/jpeg" }), { contentType: "image/jpeg" });
  await owner.c.from("events").update({ cover_image_path: cover }).eq("id", ev!.id);
  const goods: { id: string }[] = [];
  for (let i = 1; i <= 3; i++) {
    const id = crypto.randomUUID();
    const p = `${ev!.id}/${id}/${crypto.randomUUID()}-full.jpg`;
    await owner.c.storage.from("goods-images").upload(p, new Blob([png], { type: "image/jpeg" }), { contentType: "image/jpeg" });
    const t = p.replace("-full", "-thumb");
    await owner.c.storage.from("goods-images").upload(t, new Blob([png], { type: "image/jpeg" }), { contentType: "image/jpeg" });
    // Phase 3: 代表画像は goods_images の先頭（goods.image_path はトリガーが写す）
    await owner.c.from("goods").insert({ id, event_id: ev!.id, name: `商品${i}`, price: i * 100, sort_order: i });
    await owner.c.rpc("goods_save_media", { p_goods_id: id, p_images: [{ image_path: p, thumb_path: t }], p_variants: null });
    goods.push({ id });
  }
  const { data: link } = await owner.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: null });
  const token = (Array.isArray(link) ? link[0] : link).token as string;
  return { id: ev!.id as string, goods, token, cover };
}

async function main() {
  // ---------------------------------------------------------
  console.log("\n[TEST 1/2/4/5/6] A=owner, B・C=member → A 退会");
  const A = await user("a", "山田アリス");
  const B = await user("b");
  const C = await user("c");
  const ev = await makeEvent(A, "保存テストライブ");
  const solo = await makeEvent(A, "A だけのイベント"); // 参加者0人
  const softDel = await makeEvent(A, "A が削除済みのイベント"); // 参加者0人・soft delete 済み
  await A.c.from("events").update({ deleted_at: new Date().toISOString() }).eq("id", softDel.id);
  for (const u of [B, C]) await u.c.rpc("goods_join_via_share", { p_token: ev.token });
  await A.c.from("ownerships").insert({ goods_id: ev.goods[0].id, status: "owned" });
  await B.c.from("ownerships").insert({ goods_id: ev.goods[1].id, status: "owned" });
  await C.c.from("ownerships").insert({ goods_id: ev.goods[2].id, status: "owned" });
  // A は他人のイベントにも参加している（退会で A の membership・ownership だけ消えること）
  const other = await makeEvent(C, "C のイベント");
  await A.c.rpc("goods_join_via_share", { p_token: other.token });
  await A.c.from("ownerships").insert({ goods_id: other.goods[0].id, status: "owned" });
  const evObjectsBefore = await objects(ev.id);
  check("（準備）共有イベントに画像8枚", evObjectsBefore.length === 8, evObjectsBefore.length);

  const result = await deleteAccount(A.id);
  check("deleteAccount が成功し、共有イベントは preserved・単独イベントは削除に振り分け",
    result.preservedEventIds.includes(ev.id) && result.deletedEventIds.includes(solo.id) && result.deletedEventIds.includes(softDel.id) && !result.deletedEventIds.includes(ev.id), result);

  // TEST 1: A の認証・個人情報
  const { data: au } = await admin.auth.admin.getUserById(A.id);
  check("A の auth ユーザーは削除されている", !au?.user);
  check("A の profile は削除されている", (await count("profiles", { id: A.id })) === 0);
  check("A の membership は全イベントで削除", (await count("event_memberships", { user_id: A.id })) === 0);
  check("A の ownership は全イベントで削除", (await count("ownerships", { user_id: A.id })) === 0);
  const { data: evRow } = await admin.from("events").select("owner_id, preserved_at, deleted_at, title, description, start_date, cover_image_path").eq("id", ev.id).single();
  check("共有イベントは残存（タイトル・概要・日付・カバーを維持）", evRow?.title === "保存テストライブ" && evRow.description === "概要" && evRow.start_date === "2026-12-01" && evRow.cover_image_path === ev.cover, evRow);
  check("owner_id は NULL、preserved_at が設定（元オーナーとの関係を切断）", evRow?.owner_id === null && !!evRow?.preserved_at, evRow);
  check("goods は3点とも残存", (await count("goods", { event_id: ev.id })) === 3);
  check("共有イベントの画像8枚は残存", (await objects(ev.id)).length === 8);
  const objMeta = storageOwners(ev.id);
  check("画像メタデータから元オーナーのユーザーIDが消えている", objMeta.length === 8 && objMeta.every((o) => o.owner === null && o.owner_id === null), objMeta);

  // TEST 2: B / C の利用継続・独立
  check("B の membership 残存", (await count("event_memberships", { event_id: ev.id, user_id: B.id })) === 1);
  check("C の membership 残存", (await count("event_memberships", { event_id: ev.id, user_id: C.id })) === 1);
  const { data: bOwn } = await B.c.from("ownerships").select("goods_id, status");
  const { data: cOwn } = await C.c.from("ownerships").select("goods_id, status").eq("goods_id", ev.goods[2].id);
  check("B の ownership 残存（商品2=owned）", bOwn?.length === 1 && bOwn[0].goods_id === ev.goods[1].id);
  check("C の ownership 残存（商品3=owned）", cOwn?.length === 1);
  const { data: bGoods } = await B.c.from("goods").select("id").eq("event_id", ev.id).is("deleted_at", null);
  check("B はカタログを閲覧できる", bGoods?.length === 3);
  const { error: bTog } = await B.c.from("ownerships").upsert({ goods_id: ev.goods[0].id, user_id: B.id, status: "owned" }, { onConflict: "user_id,goods_id,variant_id" });
  check("B は自分の ownership を更新できる", !bTog, bTog);
  const { error: cTog } = await C.c.from("ownerships").upsert({ goods_id: ev.goods[0].id, user_id: C.id, status: "owned" }, { onConflict: "user_id,goods_id,variant_id" });
  check("C も独立して更新できる", !cTog, cTog);
  const { data: bSeeC } = await B.c.from("ownerships").select("id").eq("user_id", C.id);
  check("B は C の ownership を読めない（独立）", (bSeeC?.length ?? 0) === 0);
  const { data: bMy } = await B.c.rpc("goods_my_events");
  const bE = bMy?.find((e: { id: string }) => e.id === ev.id);
  check("B のマイイベントに preserved として表示（進捗は B 自身の 2/3）", bE?.preserved === true && bE.owned_count === 2 && bE.total_count === 3, bE);
  check("C のイベントから A の membership・ownership だけ消え、C のイベントは無傷", (await count("events", { id: other.id })) === 1 && (await count("goods", { event_id: other.id })) === 3);

  // TEST 4: 読み取り専用（自動昇格なし）
  const { data: bEd } = await B.c.from("events").update({ title: "B編集" }).eq("id", ev.id).select();
  check("B はイベントを編集できない", (bEd?.length ?? 0) === 0);
  const { data: bGEd } = await B.c.from("goods").update({ name: "B編集" }).eq("event_id", ev.id).select();
  check("B は商品を編集できない", (bGEd?.length ?? 0) === 0);
  const { error: bGAdd } = await B.c.from("goods").insert({ event_id: ev.id, name: "B追加" });
  check("B は商品を追加できない", !!bGAdd);
  const { data: bGDel } = await B.c.from("goods").update({ deleted_at: new Date().toISOString() }).eq("event_id", ev.id).select();
  check("B は商品を削除できない", (bGDel?.length ?? 0) === 0);
  const { error: bLink } = await B.c.rpc("goods_create_share_link", { p_event_id: ev.id, p_expires_days: null });
  check("B は共有リンクを発行できない", !!bLink);
  const { error: bLink2 } = await B.c.from("share_links").insert({ event_id: ev.id });
  check("B は share_links に直接 INSERT できない", !!bLink2);
  const { data: roles } = await admin.from("event_memberships").select("role").eq("event_id", ev.id);
  check("参加者は自動でオーナーに昇格しない（全員 member）", !!roles?.length && roles.every((r) => r.role === "member"), roles);
  const { error: takeover } = await admin.from("events").update({ owner_id: B.id }).eq("id", ev.id);
  check("service role でもオーナーを付け替えられない（乗っ取り防止）", !!takeover);
  const { error: unpreserve } = await admin.from("events").update({ preserved_at: null }).eq("id", ev.id);
  check("preserved 状態は解除できない", !!unpreserve);

  // TEST 5: 共有リンク
  const { data: link } = await admin.from("share_links").select("status, revoked_at").eq("token", ev.token).single();
  check("既存の共有リンクは失効", link?.status === "revoked" && !!link?.revoked_at, link);
  const D = await user("d");
  const { data: dJoin } = await D.c.rpc("goods_join_via_share", { p_token: ev.token });
  check("新規ユーザーは参加できない", dJoin?.status === "revoked", dJoin);
  const { data: cat } = await admin.rpc("goods_get_shared_catalog", { p_token: ev.token });
  check("共有URLからカタログも見られない", cat?.status === "revoked", cat);
  const { error: forged } = await admin.from("share_links").insert({ event_id: ev.id });
  const { data: forgedRow } = await admin.from("share_links").select("token").eq("event_id", ev.id).eq("status", "active").maybeSingle();
  if (!forged && forgedRow) {
    const { data: fCat } = await admin.rpc("goods_get_shared_catalog", { p_token: forgedRow.token });
    check("仮に有効リンクが作られても preserved イベントは unavailable", fCat?.status === "unavailable", fCat);
    await admin.from("share_links").update({ status: "revoked" }).eq("token", forgedRow.token);
  } else check("仮に有効リンクが作られても preserved イベントは unavailable", true);

  // TEST 6: 個人情報が辿れない
  const blob = JSON.stringify({
    ev: await B.c.from("events").select("*").eq("id", ev.id).single(),
    goods: await B.c.from("goods").select("*").eq("event_id", ev.id),
    mems: await B.c.from("event_memberships").select("*").eq("event_id", ev.id),
    my: await B.c.rpc("goods_my_events"),
    prof: await B.c.from("profiles").select("*"),
    links: await B.c.from("share_links").select("*").eq("event_id", ev.id),
    objs: await B.c.storage.from("goods-images").list(`${ev.id}/cover`),
    cat: await admin.rpc("goods_get_shared_catalog", { p_token: ev.token }),
  });
  check("B が読めるデータに元オーナーの user ID が含まれない", !blob.includes(A.id));
  check("B が読めるデータに元オーナーのメールが含まれない", !blob.includes(A.email));
  check("B が読めるデータに元オーナーの表示名が含まれない", !blob.includes("山田アリス"));
  const { data: cProf } = await C.c.from("profiles").select("*").eq("id", A.id);
  check("C から元オーナーの profile は取得できない", (cProf?.length ?? 0) === 0);
  const { data: anyRef } = await admin.from("share_links").select("created_by").eq("event_id", ev.id).not("created_by", "is", null);
  check("共有リンクの発行者（created_by）も NULL 化", (anyRef?.length ?? 0) === 0, anyRef);

  // TEST 3: 参加者0人のイベントは削除・画像も削除
  check("単独イベントは削除（events 行なし）", (await count("events", { id: solo.id })) === 0);
  check("単独イベントの goods も削除", (await count("goods", { event_id: solo.id })) === 0);
  check("単独イベントの画像も削除（Storage 孤立なし）", (await objects(solo.id)).length === 0);
  check("soft delete 済み単独イベントも削除・画像削除", (await count("events", { id: softDel.id })) === 0 && (await objects(softDel.id)).length === 0);
  const { data: orphanAfterDel } = await admin.rpc("goods_orphan_storage_event_ids");
  check("Storage に DB の無いフォルダが残っていない", !(orphanAfterDel as string[] | null)?.some((id) => [solo.id, softDel.id].includes(id)), orphanAfterDel);

  // ---------------------------------------------------------
  console.log("\n[TEST 7] preserved イベントの最後の参加者が外れる → cleanup 対象。他イベントを誤削除しない");
  const keepPreserved = await (async () => {
    // 別の preserved イベント（参加者が残る）を用意して、誤削除されないことも確かめる
    const E = await user("e");
    const k = await makeEvent(E, "参加者が残る preserved");
    await B.c.rpc("goods_join_via_share", { p_token: k.token });
    await deleteAccount(E.id);
    return k;
  })();
  const { data: bLeave } = await B.c.from("event_memberships").delete().eq("event_id", ev.id).eq("user_id", B.id).select();
  check("B が外れる", bLeave?.length === 1);
  const { data: mid } = await admin.from("events").select("orphaned_at").eq("id", ev.id).single();
  check("まだ C が残っているので cleanup 対象ではない", mid?.orphaned_at === null, mid);
  await C.c.from("event_memberships").delete().eq("event_id", ev.id).eq("user_id", C.id);
  const { data: after } = await admin.from("events").select("orphaned_at").eq("id", ev.id).single();
  check("最後の C が外れると cleanup 対象（orphaned_at）になる", !!after?.orphaned_at, after);
  check("即時には削除されない（猶予期間）", (await count("events", { id: ev.id })) === 1);
  const r7a = await runOrphanCleanup(7 * 24 * 3600);
  check("猶予期間中の cleanup では削除しない", !r7a.deletedEventIds.includes(ev.id) && (await count("events", { id: ev.id })) === 1);
  const r7b = await runOrphanCleanup(0);
  check("猶予経過後の cleanup で削除（events・goods）", r7b.deletedEventIds.includes(ev.id) && (await count("events", { id: ev.id })) === 0 && (await count("goods", { event_id: ev.id })) === 0, r7b);
  check("その画像も削除", (await objects(ev.id)).length === 0);
  check("参加者が残る preserved イベントは削除されない", (await count("events", { id: keepPreserved.id })) === 1 && (await objects(keepPreserved.id)).length === 8);
  check("オーナーがいる通常イベントは削除されない", (await count("events", { id: other.id })) === 1 && (await objects(other.id)).length === 8);
  check("cleanup で他イベントの商品を巻き込まない（C のイベントの商品3点は無傷）", (await count("goods", { event_id: other.id })) === 3);

  // ---------------------------------------------------------
  console.log("\n[DIRECT] 管理画面などから auth ユーザーを直接削除した場合（退会処理を経由しない）");
  const F = await user("f");
  const G = await user("g");
  const fev = await makeEvent(F, "直接削除テスト");
  await G.c.rpc("goods_join_via_share", { p_token: fev.token });
  const { error: directErr } = await admin.auth.admin.deleteUser(F.id);
  check("auth ユーザーの直接削除が成功する", !directErr, directErr);
  const { data: fRow } = await admin.from("events").select("owner_id, preserved_at").eq("id", fev.id).single();
  check("CASCADE で消えず preserved になる", fRow?.owner_id === null && !!fRow?.preserved_at, fRow);
  const { data: fLink } = await admin.from("share_links").select("status").eq("token", fev.token).single();
  check("共有リンクはトリガーで失効", fLink?.status === "revoked");
  const fObj = storageOwners(fev.id);
  check("画像の所有者情報もトリガーで消去", fObj.length === 8 && fObj.every((o) => o.owner === null && o.owner_id === null), fObj);
  check("G は引き続き利用できる", (await count("event_memberships", { event_id: fev.id, user_id: G.id })) === 1);

  // ---------------------------------------------------------
  console.log("\n[RACE] 退会処理と共有リンクからの参加が同時に走る（退会の開始を 0〜120ms ずらして8回）");
  const joiners = await Promise.all(Array.from({ length: 6 }, (_, i) => user(`j${i}`)));
  const delays = [0, 5, 10, 20, 30, 45, 70, 120];
  const outcomes = new Set<string>();
  for (let round = 0; round < delays.length; round++) {
    const H = await user(`h${round}`);
    const hev = await makeEvent(H, `競合テスト${round}`);
    const joins = joiners.map((u, i) => new Promise((r) => setTimeout(r, i * 4)).then(() => u.c.rpc("goods_join_via_share", { p_token: hev.token })));
    const delP = new Promise((r) => setTimeout(r, delays[round])).then(() => deleteAccount(H.id)).then(() => null, (e: Error) => e);
    const [del, ...joinRes] = await Promise.all([delP, ...joins]);
    const statuses = joinRes.map((j) => (j as { data?: { status?: string }; error?: { message: string } }).data?.status ?? `error:${(j as { error?: { message: string } }).error?.message}`);
    const joined = statuses.filter((x) => x === "joined").length;
    const exists = (await count("events", { id: hev.id })) === 1;
    const members = await count("event_memberships", { event_id: hev.id });
    outcomes.add(exists ? (joined === joiners.length ? "全員参加→preserved" : "一部参加→preserved") : "参加0→削除");
    check(
      `round ${round}: 退会成功・デッドロック/エラーなし・整合（参加${joined}人 → ${exists ? "preserved" : "削除"}）`,
      del === null &&
        statuses.every((x) => ["joined", "revoked", "unavailable", "invalid"].includes(x)) &&
        (exists ? members === joined && joined > 0 : joined === 0),
      { del: del?.message, statuses, exists, members }
    );
  }
  console.log(`  （発生したパターン: ${[...outcomes].join(" / ")}）`);
  check("競合の複数パターンが実際に発生している（テストとして有効）", outcomes.size >= 2, [...outcomes]);

  // 後始末
  for (const id of created) await admin.auth.admin.deleteUser(id).catch(() => undefined);
  await runOrphanCleanup(0);
  console.log(`\n結果: ${passed} passed / ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  for (const id of created) await admin.auth.admin.deleteUser(id).catch(() => undefined);
  process.exit(1);
});
