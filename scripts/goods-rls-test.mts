/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// /goods の DB・RLS・Storage 越境テスト
//
// 実行: npm run goods:rls-test
//
// 安全装置:
//   ローカルSupabase（127.0.0.1 / localhost）以外には絶対に接続しない。
//   本番DBで破壊テストを行わないため、URL を検査してから開始する。
//
// 検証内容（指示書 §15 のDB側項目）:
//   A がイベント作成 → 10商品登録 → 3商品を取得済み → 再取得・再ログインで保持
//   B から A の ownership が読めない / 書き換えられない
//   非オーナーが event / goods を編集できない
//   同じグッズでも A と B の所持状態は独立
//   anon はテーブル・関数・Storage に一切触れない
//   変更不可列・物理削除不可・100商品以上
// ============================================================
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* 環境変数から直接渡してもよい */
  }
}
loadEnv();

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
if (!["127.0.0.1", "localhost"].includes(host)) {
  console.error(`中止: ローカル以外のSupabase（${host || "未設定"}）には接続しません。`);
  process.exit(2);
}
if (!ANON || !SERVICE) {
  console.error("中止: NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY / GOODS_TEST_SUPABASE_SERVICE_ROLE_KEY が未設定です。");
  process.exit(2);
}

const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
const anon = createClient(URL_, ANON, { auth: { persistSession: false } });

let passed = 0;
let failed = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`, detail ?? "");
  }
}

const stamp = Date.now();
const PASSWORD = `rls-test-${stamp}-Pw!`;

async function makeUser(label: string) {
  const email = `goods-rls-${label}-${stamp}@example.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true });
  if (error || !data.user) throw new Error(`createUser ${label}: ${error?.message}`);
  return { id: data.user.id, email };
}

async function signIn(email: string): Promise<SupabaseClient> {
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw new Error(`signIn: ${error.message}`);
  return c;
}

async function main() {
  const userA = await makeUser("a");
  const userB = await makeUser("b");
  let a = await signIn(userA.email);
  const b = await signIn(userB.email);

  console.log("\n[1] User A: イベント作成・10商品・3つ取得済み");
  const { data: ev, error: evErr } = await a
    .from("events")
    .insert({ title: "RLSテストライブ", start_date: "2026-10-10" })
    .select()
    .single();
  check("A がイベントを作成できる", !evErr && !!ev, evErr);
  if (!ev) throw new Error("event not created");
  check("owner_id は A 自身", ev.owner_id === userA.id);

  const { data: mem } = await a.from("event_memberships").select("role").eq("event_id", ev.id);
  check("owner membership が自動作成される", mem?.length === 1 && mem[0].role === "owner", mem);

  const goodsRows = Array.from({ length: 10 }, (_, i) => ({
    event_id: ev.id,
    name: `グッズ${i + 1}`,
    price: 1000 + i * 500,
    sort_order: i,
  }));
  const { data: goods, error: gErr } = await a.from("goods").insert(goodsRows).select("id");
  check("A が10商品を登録できる", !gErr && goods?.length === 10, gErr);
  if (!goods) throw new Error("goods not created");

  const owned3 = goods.slice(0, 3).map((g) => ({ goods_id: g.id, status: "owned" }));
  const { error: oErr } = await a.from("ownerships").upsert(owned3, { onConflict: "user_id,goods_id,variant_id" });
  check("A が3商品を取得済みにできる", !oErr, oErr);

  const { data: oA1 } = await a.from("ownerships").select("goods_id,status,acquired_at,user_id").eq("status", "owned");
  check("再取得で取得済み3件が保持されている", oA1?.length === 3, oA1);
  check("acquired_at がサーバーで設定される", !!oA1?.every((o) => o.acquired_at), oA1);
  check("user_id は既定で auth.uid()", !!oA1?.every((o) => o.user_id === userA.id));

  await a.auth.signOut();
  a = await signIn(userA.email);
  const { data: oA2 } = await a.from("ownerships").select("goods_id").eq("status", "owned");
  check("logout → login 後も3件保持", oA2?.length === 3, oA2);

  const { data: myEvents, error: myErr } = await a.rpc("goods_my_events");
  const mine = myEvents?.find((e: { id: string }) => e.id === ev.id);
  check("goods_my_events が進捗 3/10 を返す", !myErr && mine?.total_count === 10 && mine?.owned_count === 3, myErr ?? mine);

  console.log("\n[2] User B（非メンバー）からの越境");
  const { data: bEv } = await b.from("events").select("id").eq("id", ev.id);
  check("B は A のイベントを読めない", bEv?.length === 0, bEv);
  const { data: bGoods } = await b.from("goods").select("id").eq("event_id", ev.id);
  check("B は A のグッズを読めない", bGoods?.length === 0, bGoods);
  const { data: bOwn } = await b.from("ownerships").select("id");
  check("B は A の ownership を1件も読めない", bOwn?.length === 0, bOwn);
  const { data: bOwnFilter } = await b.from("ownerships").select("id").eq("user_id", userA.id);
  check("user_id を指定しても読めない", bOwnFilter?.length === 0, bOwnFilter);

  const { data: bUpd } = await b.from("ownerships").update({ status: "unowned" }).eq("user_id", userA.id).select();
  check("B は A の ownership を更新できない（0行）", !bUpd || bUpd.length === 0, bUpd);
  const { data: bDel } = await b.from("ownerships").delete().eq("user_id", userA.id).select();
  check("B は A の ownership を削除できない（0行）", !bDel || bDel.length === 0, bDel);
  const { error: bInsForA } = await b.from("ownerships").insert({ user_id: userA.id, goods_id: goods[5].id, status: "owned" });
  check("B は A 名義の ownership を作れない", !!bInsForA, bInsForA);
  const { error: bInsOwn } = await b.from("ownerships").insert({ goods_id: goods[5].id, status: "owned" });
  check("B は非メンバーのグッズに自分の ownership も作れない", !!bInsOwn, bInsOwn);

  const { data: bEvUpd } = await b.from("events").update({ title: "乗っ取り" }).eq("id", ev.id).select();
  check("B は A のイベントを編集できない", !bEvUpd || bEvUpd.length === 0, bEvUpd);
  const { data: bGUpd } = await b.from("goods").update({ name: "乗っ取り" }).eq("event_id", ev.id).select();
  check("B は A のグッズを編集できない", !bGUpd || bGUpd.length === 0, bGUpd);
  const { error: bGIns } = await b.from("goods").insert({ event_id: ev.id, name: "混入" });
  check("B は A のイベントにグッズを追加できない", !!bGIns, bGIns);
  const { error: bEvIns } = await b.from("events").insert({ title: "なりすまし", owner_id: userA.id });
  check("B は A 名義のイベントを作れない", !!bEvIns, bEvIns);
  const { error: bMemIns } = await b.from("event_memberships").insert({ user_id: userB.id, event_id: ev.id, role: "member" });
  check("B は自分で membership を作って潜り込めない", !!bMemIns, bMemIns);
  const { error: bShare } = await b.from("share_links").insert({ event_id: ev.id });
  check("B は A のイベントの共有リンクを作れない", !!bShare, bShare);

  const { data: aCheck } = await a.from("ownerships").select("goods_id").eq("status", "owned");
  check("越境試行後も A の取得済みは3件のまま", aCheck?.length === 3, aCheck);
  const { data: aTitle } = await a.from("events").select("title").eq("id", ev.id).single();
  check("越境試行後もイベント名は不変", aTitle?.title === "RLSテストライブ", aTitle);

  console.log("\n[3] B がメンバーになった場合（Phase 2 の参加を service role で模擬）");
  const { error: joinErr } = await admin.from("event_memberships").insert({ user_id: userB.id, event_id: ev.id, role: "member" });
  check("（準備）B を member として追加", !joinErr, joinErr);
  const { data: bGoods2 } = await b.from("goods").select("id").eq("event_id", ev.id);
  check("メンバーの B はグッズ情報を読める", bGoods2?.length === 10, bGoods2?.length);
  const { data: bOwnA } = await b.from("ownerships").select("id").eq("user_id", userA.id);
  check("メンバーでも A の ownership は読めない", bOwnA?.length === 0, bOwnA);
  const { error: bOwnIns } = await b.from("ownerships").insert({ goods_id: goods[0].id, status: "unowned" });
  check("B は同じグッズに自分の状態（未取得）を持てる", !bOwnIns, bOwnIns);
  const { data: aOwn0 } = await a.from("ownerships").select("status").eq("goods_id", goods[0].id).single();
  check("A の同じグッズは取得済みのまま（独立）", aOwn0?.status === "owned", aOwn0);
  const { data: aSeeB } = await a.from("ownerships").select("id").eq("user_id", userB.id);
  check("A も B の ownership を読めない", aSeeB?.length === 0, aSeeB);
  const { data: bEvUpd2 } = await b.from("events").update({ title: "viewer編集" }).eq("id", ev.id).select();
  check("member はイベントを編集できない", !bEvUpd2 || bEvUpd2.length === 0, bEvUpd2);
  const { data: bGUpd2 } = await b.from("goods").update({ name: "viewer編集" }).eq("id", goods[0].id).select();
  check("member はグッズを編集できない", !bGUpd2 || bGUpd2.length === 0, bGUpd2);
  const { data: bSeeMem } = await b.from("event_memberships").select("user_id").eq("event_id", ev.id);
  check("B は他人の membership を読めない（自分の1行のみ）", bSeeMem?.length === 1 && bSeeMem[0].user_id === userB.id, bSeeMem);
  const { data: aMemDel } = await a.from("event_memberships").delete().eq("event_id", ev.id).eq("user_id", userA.id).select();
  check("オーナーは自分の owner membership を消せない", !aMemDel || aMemDel.length === 0, aMemDel);

  console.log("\n[4] 変更不可列・削除ポリシー");
  const { error: ownerChange } = await a.from("events").update({ owner_id: userB.id }).eq("id", ev.id);
  check("owner_id の付け替えは拒否される", !!ownerChange, ownerChange);
  const { error: goodsMove } = await a.from("goods").update({ event_id: crypto.randomUUID() }).eq("id", goods[0].id);
  check("goods.event_id の付け替えは拒否される", !!goodsMove, goodsMove);
  const { error: hardDel } = await a.from("events").delete().eq("id", ev.id);
  check("イベントの物理削除はできない", !!hardDel, hardDel);
  const { error: hardDelG } = await a.from("goods").delete().eq("id", goods[9].id);
  check("グッズの物理削除はできない", !!hardDelG, hardDelG);
  const { error: softDel } = await a.from("goods").update({ deleted_at: new Date().toISOString() }).eq("id", goods[9].id);
  check("オーナーはグッズを soft delete できる", !softDel, softDel);
  const { error: ownDeleted } = await a.from("ownerships").insert({ goods_id: goods[9].id, status: "owned" });
  check("削除済みグッズには所持状態を記録できない", !!ownDeleted, ownDeleted);
  const { error: badStatus } = await a.from("ownerships").upsert({ goods_id: goods[4].id, status: "stolen" }, { onConflict: "user_id,goods_id,variant_id" });
  check("未定義の status は CHECK で拒否", !!badStatus, badStatus);
  const { error: dupOwn } = await a.from("ownerships").insert({ goods_id: goods[0].id, status: "owned" });
  check("UNIQUE(user_id, goods_id, variant_id) で重複行は作れない", !!dupOwn, dupOwn);

  console.log("\n[5] anon（未ログイン）");
  for (const t of ["events", "goods", "ownerships", "event_memberships", "share_links", "profiles"]) {
    const { data, error } = await anon.from(t).select("*").limit(1);
    check(`anon は ${t} を読めない`, !!error || (data?.length ?? 0) === 0, data);
  }
  const { error: anonIns } = await anon.from("events").insert({ title: "anon" });
  check("anon はイベントを作れない", !!anonIns, anonIns);
  const { data: anonRpc, error: anonRpcErr } = await anon.rpc("goods_my_events");
  check("anon は goods_my_events を実行できない", !!anonRpcErr || (anonRpc?.length ?? 0) === 0, anonRpc);
  const { error: anonFn } = await anon.rpc("goods_is_member", { p_event_id: ev.id });
  check("anon は権限判定関数を実行できない", !!anonFn, anonFn);

  console.log("\n[6] Storage");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const jpegLike = new Blob([png], { type: "image/jpeg" });
  const pathA = `${ev.id}/${goods[0].id}/${crypto.randomUUID()}-thumb.jpg`;
  const { error: upA } = await a.storage.from("goods-images").upload(pathA, jpegLike, { contentType: "image/jpeg" });
  check("オーナーは自分のイベント配下にアップロードできる", !upA, upA);
  const { error: upB } = await b.storage
    .from("goods-images")
    .upload(`${ev.id}/${goods[0].id}/${crypto.randomUUID()}-x.jpg`, jpegLike, { contentType: "image/jpeg" });
  check("member はアップロードできない", !!upB, upB);
  const { error: upBad } = await a.storage
    .from("goods-images")
    .upload(`not-a-uuid/${crypto.randomUUID()}.jpg`, jpegLike, { contentType: "image/jpeg" });
  check("パス規約外（先頭がevent_idでない）は拒否", !!upBad, upBad);
  const { error: upMime } = await a.storage
    .from("goods-images")
    .upload(`${ev.id}/x/${crypto.randomUUID()}.svg`, new Blob(["<svg/>"], { type: "image/svg+xml" }), { contentType: "image/svg+xml" });
  check("許可外MIME（SVG）は拒否", !!upMime, upMime);
  const big = new Blob([new Uint8Array(2 * 1024 * 1024 + 10)], { type: "image/jpeg" });
  const { error: upBig } = await a.storage.from("goods-images").upload(`${ev.id}/x/${crypto.randomUUID()}.jpg`, big, { contentType: "image/jpeg" });
  check("2MB超は拒否", !!upBig, upBig);
  const { data: dlB, error: dlBErr } = await b.storage.from("goods-images").download(pathA);
  check("メンバーの B は画像を取得できる", !dlBErr && !!dlB, dlBErr);
  const { error: dlAnon } = await anon.storage.from("goods-images").download(pathA);
  check("anon は画像を取得できない", !!dlAnon, dlAnon);
  const { data: listAnon } = await anon.storage.from("goods-images").list(ev.id);
  check("anon は一覧を取得できない", (listAnon?.length ?? 0) === 0, listAnon);
  const { data: pub } = anon.storage.from("goods-images").getPublicUrl(pathA);
  const pubRes = await fetch(pub.publicUrl);
  check("公開URLでは取得できない（非公開バケット）", pubRes.status >= 400, pubRes.status);

  // 非メンバーを作ってダウンロード拒否を確認
  const userC = await makeUser("c");
  const c = await signIn(userC.email);
  const { error: dlC } = await c.storage.from("goods-images").download(pathA);
  check("非メンバーは画像を取得できない", !!dlC, dlC);
  const { data: signedC, error: signedCErr } = await c.storage.from("goods-images").createSignedUrl(pathA, 60);
  check("非メンバーは署名URLを発行できない", !!signedCErr || !signedC, signedC);

  console.log("\n[7] 100商品以上");
  const { data: ev2 } = await a.from("events").insert({ title: "大量テスト" }).select().single();
  const many = Array.from({ length: 150 }, (_, i) => ({ event_id: ev2!.id, name: `大量${i + 1}`, sort_order: i }));
  const t0 = performance.now();
  const { error: manyErr } = await a.from("goods").insert(many);
  const { data: manyRead } = await a.from("goods").select("id").eq("event_id", ev2!.id).is("deleted_at", null);
  check(`150商品を登録・取得できる（${Math.round(performance.now() - t0)}ms）`, !manyErr && manyRead?.length === 150, manyErr);

  // 後始末（ローカルのみ）。Storage の実体も消して孤児ファイルを残さない
  await admin.storage.from("goods-images").remove([pathA]);
  await admin.auth.admin.deleteUser(userA.id);
  await admin.auth.admin.deleteUser(userB.id);
  await admin.auth.admin.deleteUser(userC.id);

  console.log(`\n結果: ${passed} passed / ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
