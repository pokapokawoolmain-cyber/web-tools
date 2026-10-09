/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// Phase 2 共有機能の DB / RLS / Server Boundary テスト（ローカル Supabase 専用）
//
// 実行: npm run goods:share-test
//
// 役割:
//   A = イベントオーナー / B = 共有リンクから参加した member / C = 無関係のユーザー / anon = 未ログイン
// ============================================================
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
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
const PW = `share-${stamp}-Pw!`;
const users: string[] = [];

async function user(label: string): Promise<{ id: string; c: SupabaseClient }> {
  const email = `goods-share-${label}-${stamp}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: PW, email_confirm: true });
  if (error || !data.user) throw new Error(error?.message);
  users.push(data.user.id);
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { error: e2 } = await c.auth.signInWithPassword({ email, password: PW });
  if (e2) throw new Error(e2.message);
  return { id: data.user.id, c };
}

const count = async (table: string, filter: Record<string, string>) => {
  let q = admin.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
  return (await q).count ?? -1;
};

async function main() {
  const A = await user("a");
  const B = await user("b");
  const C = await user("c");

  console.log("\n[1] 準備: A がイベントと商品3点を作成し、A は Goods 1 を取得済み");
  const { data: ev } = await A.c.from("events").insert({ title: "共有テストライブ" }).select().single();
  const { data: g } = await A.c
    .from("goods")
    .insert([1, 2, 3].map((i) => ({ event_id: ev!.id, name: `Goods ${i}`, price: i * 1000, sort_order: i })))
    .select("id, name");
  const goods = g!;
  await A.c.from("ownerships").insert({ goods_id: goods[0].id, status: "owned" });
  check("準備完了", !!ev && goods.length === 3);

  console.log("\n[2] 共有リンクの発行・失効はオーナーのみ");
  const { error: bCreate } = await B.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: null });
  check("B（非メンバー）はリンクを作れない", !!bCreate, bCreate);
  const { error: cCreate } = await C.c.from("share_links").insert({ event_id: ev!.id });
  check("C は share_links へ直接 INSERT できない", !!cCreate, cCreate);
  const { data: link1, error: aCreate } = await A.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: null });
  const token1 = (Array.isArray(link1) ? link1[0] : link1)?.token as string;
  check("A はリンクを作れる", !aCreate && /^[A-Za-z0-9_-]{43}$/.test(token1 ?? ""), aCreate);
  check("トークンは event ID / user ID を含まない", !!token1 && !token1.includes(ev!.id) && !token1.includes(A.id));
  const { data: link2 } = await A.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: 7 });
  const row2 = Array.isArray(link2) ? link2[0] : link2;
  const token2 = row2?.token as string;
  check("再発行するとトークンは別の値", !!token2 && token2 !== token1);
  check("7日の有効期限がサーバー時刻で設定される", !!row2?.expires_at && Math.abs(new Date(row2.expires_at).getTime() - Date.now() - 7 * 864e5) < 60_000);
  const { data: old1 } = await admin.from("share_links").select("status, revoked_at").eq("token", token1).single();
  check("再発行で古いリンクは失効（有効なリンクは1本）", old1?.status === "revoked" && !!old1?.revoked_at, old1);
  const { error: badExp } = await A.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: 3650 });
  check("任意の期限値は拒否（7 / 30 / なし のみ）", !!badExp);
  const { data: bSeeLinks } = await B.c.from("share_links").select("token").eq("event_id", ev!.id);
  check("B は share_links（トークン）を読めない", (bSeeLinks?.length ?? 0) === 0, bSeeLinks);
  const { error: dupTok } = await admin.from("share_links").insert({ event_id: ev!.id, token: token1, status: "revoked" });
  check("token は UNIQUE（重複不可）", !!dupTok);

  console.log("\n[3] Server Boundary（匿名カタログ取得）");
  const { error: anonCat } = await anon.rpc("goods_get_shared_catalog", { p_token: token2 });
  check("anon はカタログ関数を直接実行できない（サーバー専用）", !!anonCat, anonCat);
  const { error: bCat } = await B.c.rpc("goods_get_shared_catalog", { p_token: token2 });
  check("ログインユーザーもカタログ関数を直接実行できない", !!bCat, bCat);
  const { error: anonResolve } = await anon.rpc("goods_resolve_share", { p_token: token2 });
  check("内部判定関数は誰も直接実行できない", !!anonResolve);
  const { data: cat } = await admin.rpc("goods_get_shared_catalog", { p_token: token2 });
  const json = JSON.stringify(cat);
  check("有効なトークン → 対象カタログを返す（3点）", cat?.status === "ok" && cat.goods.length === 3 && cat.event.title === "共有テストライブ", cat);
  check("カタログに owner_id / user ID / メール / ownership / event ID を含まない",
    !json.includes(A.id) && !json.includes(ev!.id) && !json.includes("@") && !json.includes("owned") && !json.includes("owner") && !goods.some((x) => json.includes(x.id)));
  const { data: badTok } = await admin.rpc("goods_get_shared_catalog", { p_token: "A".repeat(43) });
  check("存在しないトークン → invalid", badTok?.status === "invalid", badTok);
  const { data: fmtTok } = await admin.rpc("goods_get_shared_catalog", { p_token: ev!.id });
  check("event UUID をトークンとして使っても取得できない", fmtTok?.status === "invalid", fmtTok);
  const { data: revTok } = await admin.rpc("goods_get_shared_catalog", { p_token: token1 });
  check("失効したトークン → revoked", revTok?.status === "revoked", revTok);
  const expTok = "E" + `${stamp}`.padEnd(42, "x").slice(0, 42);
  await admin.from("share_links").insert({ event_id: ev!.id, token: expTok, status: "revoked" });
  const { data: ev2 } = await A.c.from("events").insert({ title: "期限切れ確認用" }).select().single();
  const expTok2 = "X" + `${stamp}`.padEnd(42, "y").slice(0, 42);
  await admin.from("share_links").insert({ event_id: ev2!.id, token: expTok2, expires_at: new Date(Date.now() - 60_000).toISOString() });
  const { data: expRes } = await admin.rpc("goods_get_shared_catalog", { p_token: expTok2 });
  check("期限切れトークン → expired（サーバー時刻で判定）", expRes?.status === "expired", expRes);
  for (const t of ["events", "goods"]) {
    const { data, error } = await anon.from(t).select("id").limit(5);
    check(`anon は ${t} を全件検索できない`, !!error || (data?.length ?? 0) === 0, data);
  }

  console.log("\n[4] 参加（自分の管理に追加）");
  const ownBefore = await count("ownerships", {});
  const goodsBefore = await count("goods", { event_id: ev!.id });
  const eventsBefore = await count("events", {});
  const { error: anonJoin } = await anon.rpc("goods_join_via_share", { p_token: token2 });
  check("anon は参加できない", !!anonJoin);
  const { data: j1 } = await B.c.rpc("goods_join_via_share", { p_token: token2 });
  check("B は有効なリンクで参加できる（joined）", j1?.status === "joined" && j1.event_id === ev!.id, j1);
  const { data: j2 } = await B.c.rpc("goods_join_via_share", { p_token: token2 });
  check("2回目は already（重複しない）", j2?.status === "already", j2);
  const parallel = await Promise.all(Array.from({ length: 8 }, () => C.c.rpc("goods_join_via_share", { p_token: token2 })));
  const cRows = await count("event_memberships", { event_id: ev!.id, user_id: C.id });
  check("C が8並列で参加しても membership は1行", cRows === 1 && parallel.filter((p) => p.data?.status === "joined").length === 1, parallel.map((p) => p.data?.status));
  await admin.from("event_memberships").delete().eq("event_id", ev!.id).eq("user_id", C.id); // C は以後「無関係」に戻す
  const { data: jA } = await A.c.rpc("goods_join_via_share", { p_token: token2 });
  check("オーナーが自分のリンクを開くと owner（member 行は作らない）", jA?.status === "owner" && (await count("event_memberships", { event_id: ev!.id, user_id: A.id })) === 1, jA);
  const { data: bRole } = await admin.from("event_memberships").select("role").eq("event_id", ev!.id).eq("user_id", B.id).single();
  check("B の role は member", bRole?.role === "member", bRole);
  const { error: bForC } = await B.c.from("event_memberships").insert({ user_id: C.id, event_id: ev!.id, role: "member" });
  check("B は C の membership を作れない", !!bForC);
  const { error: bSelf } = await B.c.from("event_memberships").insert({ user_id: B.id, event_id: ev2!.id, role: "member" });
  check("B は membership を直接 INSERT できない（リンク経由のみ）", !!bSelf);
  check("参加で ownership 行は生成されない（行なし = 未取得）", (await count("ownerships", {})) === ownBefore);
  check("参加で goods はコピーされない", (await count("goods", { event_id: ev!.id })) === goodsBefore);
  check("参加で events はコピーされない", (await count("events", {})) === eventsBefore);
  const { data: jRev } = await C.c.rpc("goods_join_via_share", { p_token: token1 });
  check("失効したリンクでは参加できない", jRev?.status === "revoked", jRev);
  const { data: jExp } = await C.c.rpc("goods_join_via_share", { p_token: expTok2 });
  check("期限切れリンクでは参加できない", jExp?.status === "expired", jExp);
  const { data: rel } = await B.c.rpc("goods_share_relation", { p_token: token2 });
  check("関係照会: B は member", rel?.relation === "member", rel);
  const { data: relC } = await C.c.rpc("goods_share_relation", { p_token: token2 });
  check("関係照会: C は none（event_id を返さない）", relC?.relation === "none" && !relC.event_id, relC);

  console.log("\n[5] 所持状態の分離（A=owner / B=member / C=無関係）");
  const { data: bGoods } = await B.c.from("goods").select("id").eq("event_id", ev!.id).is("deleted_at", null);
  check("B はカタログ（商品3点）を読める", bGoods?.length === 3);
  const { data: cGoods } = await C.c.from("goods").select("id").eq("event_id", ev!.id);
  check("C は商品を読めない", (cGoods?.length ?? 0) === 0);
  const { error: bOwnIns } = await B.c.from("ownerships").insert({ goods_id: goods[1].id, status: "owned" });
  check("B は自分の ownership を作れる（Goods 2 = owned）", !bOwnIns, bOwnIns);
  const { data: aOwnA } = await A.c.from("ownerships").select("goods_id, status");
  check("A は A の ownership を読める（Goods 1 のみ）", aOwnA?.length === 1 && aOwnA[0].goods_id === goods[0].id, aOwnA);
  const { data: bOwnB } = await B.c.from("ownerships").select("goods_id, user_id");
  check("B は B の ownership だけを読める", bOwnB?.length === 1 && bOwnB[0].user_id === B.id, bOwnB);
  const { data: bSeeA } = await B.c.from("ownerships").select("id").eq("user_id", A.id);
  check("B は A の ownership を読めない", (bSeeA?.length ?? 0) === 0);
  const { data: cSeeA } = await C.c.from("ownerships").select("id").eq("user_id", A.id);
  check("C は A の ownership を読めない", (cSeeA?.length ?? 0) === 0);
  const { data: aSeeB } = await A.c.from("ownerships").select("id").eq("user_id", B.id);
  check("オーナー A でも B の ownership は読めない", (aSeeB?.length ?? 0) === 0);
  const { data: aUpdB } = await A.c.from("ownerships").update({ status: "unowned" }).eq("user_id", B.id).select();
  check("A は B の ownership を更新できない", (aUpdB?.length ?? 0) === 0);
  const { data: bUpdA } = await B.c.from("ownerships").update({ status: "unowned" }).eq("user_id", A.id).select();
  check("B は A の ownership を更新できない", (bUpdA?.length ?? 0) === 0);
  const { data: bDelA } = await B.c.from("ownerships").delete().eq("user_id", A.id).select();
  check("B は A の ownership を削除できない", (bDelA?.length ?? 0) === 0);
  const { error: cOwn } = await C.c.from("ownerships").insert({ goods_id: goods[0].id, status: "owned" });
  check("C は（非メンバーなので）ownership を作れない", !!cOwn);
  const { data: aMy } = await A.c.rpc("goods_my_events");
  const { data: bMy } = await B.c.rpc("goods_my_events");
  const aE = aMy?.find((e: { id: string }) => e.id === ev!.id);
  const bE = bMy?.find((e: { id: string }) => e.id === ev!.id);
  check("進捗は各自のもの: A=1/3, B=1/3（別の商品）", aE?.owned_count === 1 && bE?.owned_count === 1 && aE?.total_count === 3 && bE?.role === "member", { aE, bE });
  const { data: memList } = await A.c.from("event_memberships").select("user_id").eq("event_id", ev!.id);
  check("オーナーでも membership 一覧（誰が参加したか）は見えない", memList?.length === 1 && memList[0].user_id === A.id, memList);

  console.log("\n[6] 編集権限");
  const { data: aEd } = await A.c.from("events").update({ description: "A編集" }).eq("id", ev!.id).select();
  check("A はイベントを編集できる", aEd?.length === 1);
  const { data: bEd } = await B.c.from("events").update({ title: "B" }).eq("id", ev!.id).select();
  check("B（member）はイベントを編集できない", (bEd?.length ?? 0) === 0);
  const { data: cEd } = await C.c.from("events").update({ title: "C" }).eq("id", ev!.id).select();
  check("C はイベントを編集できない", (cEd?.length ?? 0) === 0);
  const { data: bGEd } = await B.c.from("goods").update({ name: "B" }).eq("id", goods[0].id).select();
  check("B は商品を編集できない", (bGEd?.length ?? 0) === 0);
  const { data: cGEd } = await C.c.from("goods").update({ name: "C" }).eq("id", goods[0].id).select();
  check("C は商品を編集できない", (cGEd?.length ?? 0) === 0);
  const { error: bGAdd } = await B.c.from("goods").insert({ event_id: ev!.id, name: "B追加" });
  check("B は商品を追加できない", !!bGAdd);
  const { data: bRevoke } = await B.c.from("share_links").update({ status: "revoked" }).eq("token", token2).select();
  check("B はリンクを失効できない", (bRevoke?.length ?? 0) === 0);

  console.log("\n[7] カタログ同期（共有後の追加・編集）");
  const { data: gD } = await A.c.from("goods").insert({ event_id: ev!.id, name: "Goods D", price: 500, sort_order: 9 }).select("id").single();
  const { data: bSeeD } = await B.c.from("goods").select("name").eq("id", gD!.id).maybeSingle();
  check("A が追加した Goods D が B に見える", bSeeD?.name === "Goods D");
  const { data: bOwnD } = await B.c.from("ownerships").select("id").eq("goods_id", gD!.id);
  check("B の Goods D は ownership 行なし（= 未取得）", (bOwnD?.length ?? 0) === 0);
  await A.c.from("goods").update({ name: "ツアーTシャツ", price: 4500 }).eq("id", goods[1].id);
  const { data: bSee2 } = await B.c.from("goods").select("name, price").eq("id", goods[1].id).single();
  const { data: bOwn2 } = await B.c.from("ownerships").select("status").eq("goods_id", goods[1].id).single();
  check("A の商品編集が B に反映", bSee2?.name === "ツアーTシャツ" && bSee2.price === 4500, bSee2);
  check("編集後も B の取得状態は owned のまま", bOwn2?.status === "owned", bOwn2);
  const { data: cat2 } = await admin.rpc("goods_get_shared_catalog", { p_token: token2 });
  check("共有カタログにも追加・編集が反映（4点・新名称）", cat2?.goods.length === 4 && JSON.stringify(cat2).includes("ツアーTシャツ"));

  console.log("\n[8] 商品の削除（soft delete）");
  await A.c.from("goods").update({ deleted_at: new Date().toISOString() }).eq("id", goods[1].id);
  const { data: bList } = await B.c.from("goods").select("id").eq("event_id", ev!.id).is("deleted_at", null);
  check("削除した商品は B の一覧から消える", bList?.length === 3 && !bList.some((x) => x.id === goods[1].id));
  check("B の ownership 行は残る（参照整合性を壊さない）", (await count("ownerships", { goods_id: goods[1].id, user_id: B.id })) === 1);
  const { data: cat3 } = await admin.rpc("goods_get_shared_catalog", { p_token: token2 });
  check("共有カタログからも消える", cat3?.goods.length === 3);
  const { error: bOwnDel } = await B.c.from("ownerships").update({ status: "unowned" }).eq("goods_id", goods[1].id).eq("user_id", B.id);
  check("削除済み商品の取得状態は変更できない", !!bOwnDel);

  console.log("\n[9] リンク失効 ≠ 既存ユーザー追放");
  const { data: rv } = await A.c.from("share_links").update({ status: "revoked" }).eq("token", token2).select("status, revoked_at");
  check("A はリンクを失効できる（revoked_at はサーバー時刻）", rv?.[0]?.status === "revoked" && !!rv[0].revoked_at, rv);
  const { error: reAct } = await A.c.from("share_links").update({ status: "active" }).eq("token", token2);
  check("失効したリンクは元に戻せない", !!reAct);
  const { error: extend } = await A.c.from("share_links").update({ expires_at: new Date(Date.now() + 864e5).toISOString() }).eq("token", token2);
  check("有効期限は後から変更できない", !!extend);
  const { data: catRev } = await admin.rpc("goods_get_shared_catalog", { p_token: token2 });
  check("失効後はカタログを取得できない", catRev?.status === "revoked");
  const { data: jAfter } = await C.c.rpc("goods_join_via_share", { p_token: token2 });
  check("失効後は新規参加できない", jAfter?.status === "revoked");
  check("B の membership は残る", (await count("event_memberships", { event_id: ev!.id, user_id: B.id })) === 1);
  const { error: bToggle } = await B.c.from("ownerships").upsert({ goods_id: goods[2].id, user_id: B.id, status: "owned" }, { onConflict: "user_id,goods_id,variant_id" });
  check("B は失効後も取得状態を更新できる", !bToggle, bToggle);

  console.log("\n[10] イベント削除（soft delete）");
  const { data: link3 } = await A.c.rpc("goods_create_share_link", { p_event_id: ev!.id, p_expires_days: 30 });
  const token3 = (Array.isArray(link3) ? link3[0] : link3)?.token as string;
  const { error: delEv } = await A.c.from("events").update({ deleted_at: new Date().toISOString() }).eq("id", ev!.id);
  check("A はイベントを soft delete できる", !delEv, delEv);
  check("events 行は残る（hard delete しない）", (await count("events", { id: ev!.id })) === 1);
  const { data: catDel } = await admin.rpc("goods_get_shared_catalog", { p_token: token3 });
  check("削除済みイベントは有効リンクでも取得できない（unavailable）", catDel?.status === "unavailable", catDel);
  const { data: jDel } = await C.c.rpc("goods_join_via_share", { p_token: token3 });
  check("削除済みイベントには新規参加できない", jDel?.status === "unavailable");
  const { data: bMy2 } = await B.c.rpc("goods_my_events");
  const bE2 = bMy2?.find((e: { id: string }) => e.id === ev!.id);
  check("B のマイイベントには「削除済み」として残る", bE2?.deleted === true, bE2);
  const { data: aMy2 } = await A.c.rpc("goods_my_events");
  check("A（オーナー）のマイイベントからは消える", !aMy2?.some((e: { id: string }) => e.id === ev!.id));
  check("B の ownership 行は残る", (await count("ownerships", { user_id: B.id })) >= 2);
  const { error: bTog2 } = await B.c.from("ownerships").upsert({ goods_id: goods[0].id, user_id: B.id, status: "owned" }, { onConflict: "user_id,goods_id,variant_id" });
  check("削除済みイベントの取得状態は変更できない", !!bTog2);
  const { data: leave } = await B.c.from("event_memberships").delete().eq("event_id", ev!.id).eq("user_id", B.id).select();
  check("B は自分の membership を外せる", leave?.length === 1);
  const { data: aLeave } = await A.c.from("event_memberships").delete().eq("event_id", ev!.id).eq("user_id", A.id).select();
  check("オーナーの membership は外せない", (aLeave?.length ?? 0) === 0);

  console.log("\n[11] スケール（150商品・複数 member）");
  const { data: big } = await A.c.from("events").insert({ title: "150商品" }).select().single();
  await A.c.from("goods").insert(Array.from({ length: 150 }, (_, i) => ({ event_id: big!.id, name: `商品${i + 1}`, sort_order: i })));
  const { data: bl } = await A.c.rpc("goods_create_share_link", { p_event_id: big!.id, p_expires_days: null });
  const bt = (Array.isArray(bl) ? bl[0] : bl)?.token as string;
  const t0 = performance.now();
  const { data: bigCat } = await admin.rpc("goods_get_shared_catalog", { p_token: bt });
  const ms = Math.round(performance.now() - t0);
  check(`150商品のカタログを1回の呼び出しで取得（${ms}ms）`, bigCat?.goods.length === 150);
  const ownB4 = await count("ownerships", {});
  for (const u of [B, C]) await u.c.rpc("goods_join_via_share", { p_token: bt });
  check("2人参加しても goods は150のまま（複製なし）", (await count("goods", { event_id: big!.id })) === 150);
  check("参加時に ownership を一括生成しない（0行増加）", (await count("ownerships", {})) === ownB4);

  console.log("\n[12] アカウント削除（共有リンクの発行者を含む）");
  for (const id of users) {
    const { error } = await admin.auth.admin.deleteUser(id);
    check(`ユーザー削除が失敗しない（${id === A.id ? "A: リンク発行者" : id === B.id ? "B" : "C"}）`, !error, error?.message);
  }
  console.log(`\n結果: ${passed} passed / ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  for (const id of users) await admin.auth.admin.deleteUser(id).catch(() => undefined);
  process.exit(1);
});
