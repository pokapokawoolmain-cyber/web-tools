/* eslint-disable no-console -- CLIテストの結果出力 */
// ============================================================
// 予約・販売スケジュールのテスト（判定ロジック ＋ ローカル Supabase の DB / RLS）
//
// 実行: npm run goods:schedule-test
//   端末のタイムゾーンに依存しないことの確認: TZ=America/Los_Angeles npm run goods:schedule-test 等でも同じ結果になる
//   A = イベントオーナー / B = 共有から参加した member / C = 無関係のユーザー
// ============================================================
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  EMPTY_SCHEDULE,
  compareDeadline,
  effectiveSchedule,
  formatScheduleDate,
  isReservationOrderValid,
  jstEnd,
  jstStart,
  remainingLabel,
  reservationStatus,
  reservationSummary,
  saleSummary,
  scheduleFromRow,
  scheduleToRow,
  type Schedule,
} from "../lib/goods/schedule";

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
const at = (iso: string) => Date.parse(iso); // 必ず +09:00 付きで書く
const S = (p: Partial<Schedule>): Schedule => ({ ...EMPTY_SCHEDULE, ...p });

function logicTests() {
  console.log(`\n■ 判定ロジック（端末のタイムゾーン: ${Intl.DateTimeFormat().resolvedOptions().timeZone}）`);
  // D2: 日付のみの予約終了 = 当日 23:59:59 まで受付、翌日 0:00 が排他的終了境界
  const dateOnlyEnd = S({ reserveEndDate: "2026-10-15" });
  check("日付のみの終了: 終了境界は翌日 0:00（日本時間）", jstEnd("2026-10-15", null) === at("2026-10-16T00:00:00+09:00"));
  check("日付のみの終了: 当日 23:59:59.999 は受付中", reservationStatus(dateOnlyEnd, at("2026-10-15T23:59:59.999+09:00")).state === "open");
  check("日付のみの終了: 翌日 0:00 ちょうどは受付終了", reservationStatus(dateOnlyEnd, at("2026-10-16T00:00:00+09:00")).state === "closed");
  check("日付のみの終了: 当日の表示は「今日まで」", remainingLabel(dateOnlyEnd, at("2026-10-15T09:00:00+09:00")) === "今日まで");
  check("日付のみの終了: 前日の表示は「明日まで」", remainingLabel(dateOnlyEnd, at("2026-10-14T23:00:00+09:00")) === "明日まで");
  check("日付のみの終了: 3日前は「あと3日」", remainingLabel(dateOnlyEnd, at("2026-10-12T00:00:00+09:00")) === "あと3日");
  check("日付のみの終了: 終了後は残り表示なし", remainingLabel(dateOnlyEnd, at("2026-10-16T00:00:01+09:00")) === null);
  // 日付のみの開始 = 0:00 から
  const dateOnlyStart = S({ reserveStartDate: "2026-10-10", reserveEndDate: "2026-10-15" });
  check("日付のみの開始: 前日 23:59:59 は予約前", reservationStatus(dateOnlyStart, at("2026-10-09T23:59:59+09:00")).state === "before");
  check("日付のみの開始: 当日 0:00 から受付中", reservationStatus(dateOnlyStart, at("2026-10-10T00:00:00+09:00")).state === "open");
  // 時刻あり
  const timed = S({ reserveStartDate: "2026-10-10", reserveStartTime: "10:00", reserveEndDate: "2026-10-15", reserveEndTime: "23:59" });
  check("時刻あり: 開始 1 秒前は予約前", reservationStatus(timed, at("2026-10-10T09:59:59+09:00")).state === "before");
  check("時刻あり: 開始ちょうどから受付中", reservationStatus(timed, at("2026-10-10T10:00:00+09:00")).state === "open");
  check("時刻あり: 終了時刻ちょうどで受付終了（その時刻の直前まで）", reservationStatus(timed, at("2026-10-15T23:59:00+09:00")).state === "closed");
  check("時刻あり: 終了 30 分前は「あと30分」", remainingLabel(timed, at("2026-10-15T23:29:00+09:00")) === "あと30分");
  check("時刻あり: 終了 5 時間前は「あと5時間」", remainingLabel(timed, at("2026-10-15T18:59:00+09:00")) === "あと5時間");
  check("時刻あり: 2 日以上前は「あと n 日」", remainingLabel(timed, at("2026-10-12T12:00:00+09:00")) === "あと3日");
  check("時刻あり: 30 秒前でも「あと1分」（0分と表示しない）", remainingLabel(timed, at("2026-10-15T23:58:30+09:00")) === "あと1分");
  // 時刻ありの残り表示（24時間以上は日付基準・24時間未満は時間・1時間未満は分）
  const tmr = S({ reserveEndDate: "2026-10-15", reserveEndTime: "18:00" });
  check("時刻あり: 前日 1:00（残り41時間）は「明日18:00まで」", remainingLabel(tmr, at("2026-10-14T01:00:00+09:00")) === "明日18:00まで");
  check("時刻あり: 残りちょうど24時間（前日 18:00）は「明日18:00まで」", remainingLabel(tmr, at("2026-10-14T18:00:00+09:00")) === "明日18:00まで");
  check("時刻あり: 残り24時間を1ミリ秒切ると「あと23時間」", remainingLabel(tmr, at("2026-10-14T18:00:00.001+09:00")) === "あと23時間");
  check("時刻あり: 残り23時間59分も「あと23時間」（切り捨て）", remainingLabel(tmr, at("2026-10-14T18:01:00+09:00")) === "あと23時間");
  check("時刻あり: 残りちょうど1時間は「あと1時間」", remainingLabel(tmr, at("2026-10-15T17:00:00+09:00")) === "あと1時間");
  check("時刻あり: 残り59分59秒は「あと59分」（60分と表示しない）", remainingLabel(tmr, at("2026-10-15T17:00:00.001+09:00")) === "あと59分");
  check("時刻あり: 残り45分は「あと45分」", remainingLabel(tmr, at("2026-10-15T17:15:00+09:00")) === "あと45分");
  check("時刻あり: 残り1秒は「あと1分」（0分と表示しない）", remainingLabel(tmr, at("2026-10-15T17:59:59+09:00")) === "あと1分");
  check("時刻あり: 締切ちょうどで受付終了（残り表示なし）", remainingLabel(tmr, at("2026-10-15T18:00:00+09:00")) === null && reservationStatus(tmr, at("2026-10-15T18:00:00+09:00")).state === "closed");
  check("時刻あり: 2日前以上（残り24時間以上・翌々日以降）は「あと n 日」", remainingLabel(tmr, at("2026-10-13T12:00:00+09:00")) === "あと2日");
  check("時刻あり: 翌々日 0:30 の締切（残り25時間）は暦日で数えて「あと2日」", remainingLabel(S({ reserveEndDate: "2026-10-15", reserveEndTime: "00:30" }), at("2026-10-13T23:30:00+09:00")) === "あと2日");
  check("時刻あり: 翌日 0:30 の締切（前日 0:00、残り24時間30分）は「明日00:30まで」", remainingLabel(S({ reserveEndDate: "2026-10-15", reserveEndTime: "00:30" }), at("2026-10-14T00:00:00+09:00")) === "明日00:30まで");
  check("受付中の一行表示「予約受付中・明日18:00まで」", reservationSummary(tmr, at("2026-10-14T09:00:00+09:00"))?.label === "予約受付中・明日18:00まで");
  check("日付のみは従来どおり（当日中は「今日まで」・翌日 0:00 で終了）", remainingLabel(dateOnlyEnd, at("2026-10-15T23:59:59+09:00")) === "今日まで" && reservationStatus(dateOnlyEnd, at("2026-10-16T00:00:00+09:00")).state === "closed");
  // 開始だけ・終了だけ・未設定
  check("開始だけ: 開始後はずっと受付中（終了なし）", reservationStatus(S({ reserveStartDate: "2026-10-10" }), at("2030-01-01T00:00:00+09:00")).state === "open");
  check("終了だけ: 終了前はすべて受付中", reservationStatus(S({ reserveEndDate: "2026-10-15" }), at("2020-01-01T00:00:00+09:00")).state === "open");
  check("未設定: 状態なし・ラベルなし", reservationStatus(EMPTY_SCHEDULE, Date.now()).state === "none" && reservationSummary(EMPTY_SCHEDULE, Date.now()) === null && saleSummary(EMPTY_SCHEDULE, Date.now()) === null);
  // 表示
  const now = at("2026-10-12T12:00:00+09:00");
  check("予約前の表示「予約 10/20(火) 10:00〜」", reservationSummary(S({ reserveStartDate: "2026-10-20", reserveStartTime: "10:00" }), now)?.label === "予約 10/20(火) 10:00〜");
  const open = reservationSummary(dateOnlyEnd, now);
  check("受付中の表示「予約受付中・あと3日」「10/15(木) 23:59まで」", open?.label === "予約受付中・あと3日" && open?.detail === "10/15(木) 23:59まで" && open.urgent === true, open);
  check("強調表示は「あと3日」以内と一致（あと4日は強調しない）", reservationSummary(dateOnlyEnd, at("2026-10-11T12:00:00+09:00"))?.urgent === false && reservationSummary(dateOnlyEnd, at("2026-10-12T00:00:00+09:00"))?.urgent === true);
  check("受付終了の表示「予約終了」", reservationSummary(S({ reserveEndDate: "2026-10-01" }), now)?.label === "予約終了");
  check("販売開始は予約と別の表示（前: 販売開始 / 後: 販売中）", saleSummary(S({ saleStartDate: "2026-10-20" }), now) === "販売開始 10/20(火)" && saleSummary(S({ saleStartDate: "2026-10-01", saleStartTime: "12:00" }), now) === "販売中（10/1(木) 12:00〜）");
  check("年が違うときは年も表示", formatScheduleDate("2027-01-05", null, now) === "2027/1/5(火)");
  // 境界: 日本時間の日付で数える（UTC では前日でも日本時間では当日）
  check("日本時間 0:30（UTC では前日）の「今日」は日本時間の日付", remainingLabel(dateOnlyEnd, at("2026-10-15T00:30:00+09:00")) === "今日まで");
  // 終了 > 開始（DB の制約と同じ）
  check("開始と終了が同じ時刻は不可", !isReservationOrderValid(S({ reserveStartDate: "2026-10-10", reserveStartTime: "10:00", reserveEndDate: "2026-10-10", reserveEndTime: "10:00" })));
  check("同じ日付（日付のみ）は可（当日 0:00〜23:59:59）", isReservationOrderValid(S({ reserveStartDate: "2026-10-10", reserveEndDate: "2026-10-10" })));
  check("終了が開始より前は不可", !isReservationOrderValid(S({ reserveStartDate: "2026-10-10", reserveEndDate: "2026-10-09" })));
  // 並び替え
  const list = [
    { n: "終了済み", s: S({ reserveEndDate: "2026-10-01" }) },
    { n: "未設定", s: EMPTY_SCHEDULE },
    { n: "予約前", s: S({ reserveStartDate: "2026-10-20" }) },
    { n: "受付中・終了なし", s: S({ reserveStartDate: "2026-10-01" }) },
    { n: "受付中・10/20まで", s: S({ reserveEndDate: "2026-10-20" }) },
    { n: "受付中・10/14まで", s: S({ reserveEndDate: "2026-10-14" }) },
  ];
  const order = [...list].sort((a, b) => compareDeadline(a.s, b.s, now)).map((x) => x.n);
  check("予約期限が近い順: 受付中（近い順）→ 終了なし → 予約前 → 未設定 → 終了", JSON.stringify(order) === JSON.stringify(["受付中・10/14まで", "受付中・10/20まで", "受付中・終了なし", "予約前", "未設定", "終了済み"]), order);
  // 継承（D1）
  const ev = S({ reserveEndDate: "2026-10-15" });
  check("「イベントと同じ」: イベントの設定を使う", effectiveSchedule(ev, { scheduleOverride: false, ownSchedule: S({ reserveEndDate: "2026-10-12" }) }).schedule.reserveEndDate === "2026-10-15");
  check("「このグッズだけ別に設定」: グッズの設定だけを使う（未設定の項目はイベントから補わない）", (() => {
    const e = effectiveSchedule(S({ reserveStartDate: "2026-10-01", reserveEndDate: "2026-10-15" }), { scheduleOverride: true, ownSchedule: S({ reserveEndDate: "2026-10-12" }) });
    return e.own && e.schedule.reserveEndDate === "2026-10-12" && e.schedule.reserveStartDate === null;
  })());
  // 保存形式
  check("DB の time（HH:MM:SS）を HH:MM に揃える", scheduleFromRow({ reserve_end_date: "2026-10-15", reserve_end_time: "23:59:00" }).reserveEndTime === "23:59");
  check("保存時: 日付が無ければ時刻も送らない", scheduleToRow(S({ reserveEndTime: "10:00" })).reserve_end_time === null);
  check("開始時刻の解釈は端末のタイムゾーンに依存しない", jstStart("2026-10-10", "10:00") === at("2026-10-10T10:00:00+09:00"));
}

// ---------------- DB / RLS（ローカル Supabase 専用） ----------------
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
const stamp = Date.now();
const users: string[] = [];

async function dbTests() {
  if (!["127.0.0.1", "localhost"].includes(host) || !ANON || !SERVICE) {
    console.error(`中止: ローカル Supabase 以外（${host || "未設定"}）には接続しません。`);
    process.exit(2);
  }
  const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
  const PW = `sch-${stamp}-Pw!`;
  async function user(label: string): Promise<{ id: string; c: SupabaseClient }> {
    const email = `goods-sch-${label}-${stamp}@example.test`;
    const { data, error } = await admin.auth.admin.createUser({ email, password: PW, email_confirm: true });
    if (error || !data.user) throw new Error(error?.message);
    users.push(data.user.id);
    const c = createClient(URL_, ANON, { auth: { persistSession: false } });
    const { error: e2 } = await c.auth.signInWithPassword({ email, password: PW });
    if (e2) throw new Error(e2.message);
    return { id: data.user.id, c };
  }
  const A = await user("a");
  const B = await user("b");
  const C = await user("c");

  console.log("\n■ 既存データとの互換性");
  const { data: legacy } = await A.c.from("events").insert({ title: `旧イベント ${stamp}`, start_date: "2026-12-01", end_date: "2026-12-02", description: "既存の説明" }).select("*").single();
  check("スケジュールを指定しない作成（旧アプリと同じ）は今までどおり成功し、未設定のまま", !!legacy && legacy.reserve_end_date === null && legacy.reserve_start_date === null && legacy.sale_start_date === null);
  check("開催日・説明は変わらない", legacy?.start_date === "2026-12-01" && legacy?.end_date === "2026-12-02" && legacy?.description === "既存の説明");
  const { data: lg } = await A.c.from("goods").insert({ event_id: legacy!.id, name: "旧グッズ", sort_order: 0 }).select("schedule_override, reserve_end_date").single();
  check("グッズも未設定（schedule_override = false）で作成される", lg?.schedule_override === false && lg?.reserve_end_date === null);

  console.log("\n■ 保存と DB の制約");
  const { data: ev, error: evErr } = await A.c
    .from("events")
    .insert({ title: `予約テスト ${stamp}`, start_date: "2026-12-20", ...scheduleToRow(S({ reserveStartDate: "2026-10-01", reserveStartTime: "10:00", reserveEndDate: "2026-10-15", saleStartDate: "2026-12-20" })) })
    .select("*")
    .single();
  check("オーナーはイベントのスケジュールを保存できる", !evErr && ev?.reserve_end_date === "2026-10-15" && ev?.reserve_start_time === "10:00:00", evErr);
  const eventId = ev!.id as string;
  check("開催日は別の列のまま（予約で上書きされない）", ev?.start_date === "2026-12-20");
  const { error: timeOnly } = await A.c.from("events").update({ reserve_end_date: null, reserve_end_time: "10:00" }).eq("id", eventId);
  check("時刻だけの保存は拒否", !!timeOnly);
  const { error: badOrder } = await A.c.from("events").update({ reserve_end_date: "2026-09-30", reserve_end_time: null }).eq("id", eventId);
  check("終了が開始より前は拒否", !!badOrder);
  const { error: sameMoment } = await A.c.from("events").update({ reserve_start_date: "2026-10-05", reserve_start_time: "10:00", reserve_end_date: "2026-10-05", reserve_end_time: "10:00" }).eq("id", eventId);
  check("開始と終了が同じ時刻は拒否", !!sameMoment);
  const { error: sameDay } = await A.c.from("events").update({ reserve_start_date: "2026-10-05", reserve_start_time: null, reserve_end_date: "2026-10-05", reserve_end_time: null }).eq("id", eventId);
  check("同じ日付（日付のみ）は保存できる（当日 0:00〜23:59:59）", !sameDay, sameDay);
  await A.c.from("events").update(scheduleToRow(S({ reserveStartDate: "2026-10-01", reserveStartTime: "10:00", reserveEndDate: "2026-10-15", saleStartDate: "2026-12-20" }))).eq("id", eventId);

  const { data: g1, error: g1Err } = await A.c.from("goods").insert({ event_id: eventId, name: "個別グッズ", sort_order: 0, schedule_override: true, ...scheduleToRow(S({ reserveEndDate: "2026-10-12", reserveEndTime: "18:00" })) }).select("id").single();
  check("オーナーはグッズ個別のスケジュールを保存できる（contract 適用後の列権限でも）", !g1Err, g1Err);
  const { data: g2 } = await A.c.from("goods").insert({ event_id: eventId, name: "同じグッズ", sort_order: 1 }).select("id").single();
  const { data: g3 } = await A.c.from("goods").insert({ event_id: eventId, name: "設定を残して戻したグッズ", sort_order: 2, schedule_override: false, ...scheduleToRow(S({ reserveEndDate: "2026-11-30" })) }).select("id").single();
  check("「イベントと同じ」に戻してもグッズ側の値は残せる", !!g3);
  const { error: gBad } = await A.c.from("goods").update({ reserve_start_date: "2026-10-13", reserve_start_time: null }).eq("id", g1!.id);
  check("グッズも終了 < 開始は拒否", !!gBad);

  console.log("\n■ 権限（共有メンバーは閲覧のみ）");
  const { data: link } = await A.c.rpc("goods_create_share_link", { p_event_id: eventId, p_expires_days: null });
  const token = (Array.isArray(link) ? link[0] : link).token as string;
  const { data: joined } = await B.c.rpc("goods_join_via_share", { p_token: token });
  check("B が共有から参加", (joined as { status: string }).status === "joined");
  const { data: bEv } = await B.c.from("events").select("reserve_end_date").eq("id", eventId).single();
  check("B はイベントのスケジュールを見られる", bEv?.reserve_end_date === "2026-10-15");
  const { data: bUpd } = await B.c.from("events").update({ reserve_end_date: "2027-01-01" }).eq("id", eventId).select("id");
  check("B はイベントのスケジュールを変更できない", (bUpd ?? []).length === 0);
  const { data: bG } = await B.c.from("goods").update({ schedule_override: true, reserve_end_date: "2027-01-01" }).eq("id", g2!.id).select("id");
  check("B はグッズのスケジュールを変更できない", (bG ?? []).length === 0);
  const { data: cEv } = await C.c.from("events").select("id").eq("id", eventId);
  check("無関係の C は見られない", (cEv ?? []).length === 0);
  const { data: cUpd } = await C.c.from("events").update({ reserve_end_date: "2027-01-01" }).eq("id", eventId).select("id");
  check("無関係の C は変更できない", (cUpd ?? []).length === 0);
  const after = (await admin.from("events").select("reserve_end_date").eq("id", eventId).single()).data;
  check("変更されていない（2026-10-15 のまま）", after?.reserve_end_date === "2026-10-15");
  const priv = await admin.rpc("goods_my_events"); // service_role では auth.uid() が無いので空（呼び出しエラーにならないことだけ確認）
  check("RPC はサービス権限でも壊れない", !priv.error || priv.error.code === "42501", priv.error);

  console.log("\n■ マイイベント一覧（D3: イベント自身の設定を表示、グッズ個別は件数だけ）");
  const { data: mine } = await A.c.rpc("goods_my_events");
  const row = (mine as Record<string, unknown>[]).find((r) => r.id === eventId)!;
  check("イベント自身の予約期間を返す", row.reserve_end_date === "2026-10-15" && row.reserve_start_time === "10:00:00");
  check("個別のスケジュールを持つグッズの件数 = 1（「設定を残して戻した」グッズは数えない）", Number(row.goods_schedule_count) === 1, row.goods_schedule_count);
  const legacyRow = (mine as Record<string, unknown>[]).find((r) => r.id === legacy!.id)!;
  check("予約未設定のイベントは未設定のまま（グッズの期間をイベントの期間にしない）", legacyRow.reserve_end_date === null && Number(legacyRow.goods_schedule_count) === 0);
  // イベントに期間が無く、グッズだけに期間がある場合
  const { data: onlyGoodsEv } = await A.c.from("events").insert({ title: `グッズだけ期間 ${stamp}` }).select("id").single();
  await A.c.from("goods").insert({ event_id: onlyGoodsEv!.id, name: "期間ありグッズ", sort_order: 0, schedule_override: true, reserve_end_date: "2026-10-20" });
  const { data: mine2 } = await A.c.rpc("goods_my_events");
  const og = (mine2 as Record<string, unknown>[]).find((r) => r.id === onlyGoodsEv!.id)!;
  check("イベントが未設定でグッズだけ期間あり → イベントの期間は空・件数 1（誤表示しない）", og.reserve_end_date === null && og.reserve_start_date === null && Number(og.goods_schedule_count) === 1, og);
  const { data: bMine } = await B.c.rpc("goods_my_events");
  check("参加者 B の一覧にも同じイベントの期間が出る", (bMine as Record<string, unknown>[]).some((r) => r.id === eventId && r.reserve_end_date === "2026-10-15"));

  console.log("\n■ 共有ページ（D4）");
  const { data: cat } = await admin.rpc("goods_get_shared_catalog", { p_token: token });
  const c = cat as { event: { schedule: Record<string, string | null> }; goods: { name: string; schedule: Record<string, string | null>; schedule_own: boolean }[] };
  check("イベントのスケジュールが含まれる", c.event.schedule.reserve_end_date === "2026-10-15" && c.event.schedule.sale_start_date === "2026-12-20");
  const own = c.goods.find((g) => g.name === "個別グッズ")!, same = c.goods.find((g) => g.name === "同じグッズ")!, back = c.goods.find((g) => g.name === "設定を残して戻したグッズ")!;
  check("個別設定のグッズは自分の期間（schedule_own = true）", own.schedule_own === true && own.schedule.reserve_end_date === "2026-10-12" && own.schedule.reserve_end_time === "18:00:00");
  check("「イベントと同じ」のグッズはイベントの期間", same.schedule_own === false && same.schedule.reserve_end_date === "2026-10-15");
  check("「イベントと同じ」に戻したグッズは残した値ではなくイベントの期間", back.schedule_own === false && back.schedule.reserve_end_date === "2026-10-15");
  check("所持情報は含まれない", !/quantity|user_id|"owned"|"unowned"/.test(JSON.stringify(cat)));

  console.log("\n■ 継承の切り替え（イベントの変更の反映・個別 → 継承 → 個別）");
  {
    const cat = async () => ((await admin.rpc("goods_get_shared_catalog", { p_token: token })).data as { goods: { name: string; schedule: Record<string, string | null>; schedule_own: boolean }[] }).goods;
    const { data: gx } = await A.c.from("goods").insert({ event_id: eventId, name: "切替グッズ", sort_order: 9, schedule_override: true, ...scheduleToRow(S({ reserveEndDate: "2026-10-12", reserveEndTime: "18:00" })) }).select("id").single();
    const find = async () => (await cat()).find((g) => g.name === "切替グッズ")!;
    let x = await find();
    check("個別設定: グッズ自身の期間（10/12 18:00）", x.schedule_own && x.schedule.reserve_end_date === "2026-10-12" && x.schedule.reserve_end_time === "18:00:00");
    await A.c.from("goods").update({ schedule_override: false }).eq("id", gx!.id);
    x = await find();
    check("継承に戻す: イベントの期間（10/15・時刻なし）。古い個別の値（18:00）は混ざらない", !x.schedule_own && x.schedule.reserve_end_date === "2026-10-15" && x.schedule.reserve_end_time === null, x.schedule);
    const stored = (await admin.from("goods").select("reserve_end_date, reserve_end_time").eq("id", gx!.id).single()).data;
    check("継承中もグッズ側の値は保存されたまま（表示には使わない）", stored?.reserve_end_date === "2026-10-12" && stored?.reserve_end_time === "18:00:00");
    await A.c.from("events").update({ reserve_end_date: "2026-10-20", reserve_end_time: "12:00" }).eq("id", eventId);
    x = await find();
    const same = (await cat()).find((g) => g.name === "同じグッズ")!;
    check("イベントの期間を変更すると、継承中のグッズにそのまま反映（10/20 12:00）", x.schedule.reserve_end_date === "2026-10-20" && x.schedule.reserve_end_time === "12:00:00" && same.schedule.reserve_end_date === "2026-10-20", { x: x.schedule, same: same.schedule });
    const { data: mineX } = await A.c.rpc("goods_my_events");
    check("マイイベント一覧のイベントの期間も変更後の値", (mineX as Record<string, unknown>[]).some((r) => r.id === eventId && r.reserve_end_date === "2026-10-20" && r.reserve_end_time === "12:00:00"));
    await A.c.from("goods").update({ schedule_override: true }).eq("id", gx!.id);
    x = await find();
    check("再び個別設定: 保存済みの値（10/12 18:00）が復元される（イベントの変更の影響を受けない）", x.schedule_own && x.schedule.reserve_end_date === "2026-10-12" && x.schedule.reserve_end_time === "18:00:00", x.schedule);
    await A.c.from("events").update({ reserve_end_date: "2026-10-15", reserve_end_time: null }).eq("id", eventId);
  }

  console.log("\n■ 列権限（contract 適用後もスケジュールの列は書ける・画像の列は書けない）");
  const { error: imgDirect } = await A.c.from("goods").update({ image_path: null }).eq("id", g2!.id);
  const contractApplied = !!imgDirect;
  const { error: schedUpd } = await A.c.from("goods").update({ schedule_override: true, reserve_end_date: "2026-10-31" }).eq("id", g2!.id);
  check(`スケジュールの列は更新できる（contract ${contractApplied ? "適用済み" : "未適用"}の DB）`, !schedUpd, schedUpd);

  console.log("\n■ 退会: スケジュールは共有中のイベントに残る");
  await admin.rpc("goods_prepare_account_deletion", { p_user: A.id });
  await admin.auth.admin.deleteUser(A.id);
  users.splice(users.indexOf(A.id), 1);
  const kept = (await admin.from("events").select("owner_id, reserve_end_date").eq("id", eventId).single()).data;
  check("作成者が退会しても、共有中のイベントのスケジュールは残る", kept?.owner_id === null && kept?.reserve_end_date === "2026-10-15");
}

async function main() {
  logicTests();
  if (process.env.GOODS_SCHEDULE_LOGIC_ONLY !== "1") await dbTests();
}

main()
  .catch((e) => {
    failed++;
    console.log("  ❌ 予期しないエラー", e);
  })
  .finally(async () => {
    if (users.length) {
      const admin = createClient(URL_, SERVICE, { auth: { persistSession: false } });
      for (const id of users) {
        await admin.rpc("goods_prepare_account_deletion", { p_user: id }).then(() => 0, () => 0);
        await admin.auth.admin.deleteUser(id);
      }
    }
    console.log(`\n結果: ${passed} passed / ${failed} failed`);
    process.exit(failed ? 1 : 0);
  });
