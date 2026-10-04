-- ============================================================
-- Mochico: CEO Dashboard 向けの集計関数
--
-- 目的
--   CEO Dashboard（別システム）が Mochico の利用状況を «集計値だけ» で把握するための入口。
--
-- 守ること
--   * 返すのは件数・日別件数だけ。user id・メールアドレス・表示名・イベント名・グッズ名・
--     画像パス・共有トークンは一切返さない（share_links.token 列はこの関数で参照すらしない）。
--   * RLS・既存ポリシー・既存関数は変更しない（追加のみ）。
--   * 実行できるのは service_role だけ（anon / authenticated からは呼べない）。
--     呼び出し元は Mochico 側のサーバー専用エンドポイント /mochico/internal/stats のみ。
--   * 日付の境界は Asia/Tokyo（JST）。
--
-- 指標の定義（CEO Dashboard の表示と1対1で対応させること）
--   users.confirmed      : メール確認済み（= ログインコードの入力まで完了した）アカウント数
--   users.accounts       : ログインコードを要求した時点で作られるアカウント数（未完了を含む）
--   users.today / last7d : メール確認日時が JST の今日 / 直近7日（今日を含む）のアカウント数
--   active.wau / mau     : 直近7日 / 30日（JST・今日を含む）に «意味のある操作» をした確認済みユーザー数
--                          意味のある操作 = イベント作成・編集、グッズ登録・編集（イベント作成者）、
--                          所持状態の登録・変更、共有リンクの作成・停止（イベント作成者）、共有からの参加。
--                          ログインだけ・閲覧だけは含めない。各行の最終更新時刻で判定するため、
--                          日別のアクティブ数（履歴）はこの関数では出せない。
--   funnel.*             : 確認済みユーザーのうち、各段階まで «順番に» 到達した人数（作成者の流れ）
--                          created_event → added_goods（自分のイベントにグッズ）→ tracked_ownership（所持状態を登録）
--                          → shared（自分のイベントの共有リンクを作成）。前段を満たさない人は後段に数えない。
--   funnel.viewer_only   : 自分ではイベントを作らず、共有からの参加だけで使っている確認済みユーザー数
--   events.live / goods.live : 削除されていないイベント / グッズ（イベントも削除されていないもの）の数
--   share.creator_users / users_any : 共有リンクを作った / 共有を使った（作成または参加）確認済みユーザー数
--   share.*              : 共有リンク作成数は削除済みイベントも含む累計。参加は現在残っている参加（role = 'member'）の行。
--   daily[]              : JST の日別の新規件数（その日に作られたもの。後で削除されたものも含む）
-- ============================================================

create or replace function public.mochico_dashboard_stats(p_from date default null)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
with
p0 as (
  select (now() at time zone 'Asia/Tokyo')::date as today
),
p as (
  select
    today,
    -- 日別系列は最大366日まで（集計コストの上限）
    least(greatest(coalesce(p_from, today - 89), today - 365), today) as from_date,
    (today::timestamp at time zone 'Asia/Tokyo') as today_start,
    ((today - 6)::timestamp at time zone 'Asia/Tokyo') as w7_start,
    ((today - 29)::timestamp at time zone 'Asia/Tokyo') as w30_start
  from p0
),
accounts as (
  select u.id, u.email_confirmed_at
  from auth.users u
  where u.deleted_at is null and not coalesce(u.is_anonymous, false)
),
confirmed as (
  select a.id, a.email_confirmed_at from accounts a where a.email_confirmed_at is not null
),
ev as (
  select e.id, e.owner_id, e.created_at, e.updated_at, e.deleted_at from public.events e
),
gd as (
  select g.event_id, g.created_at, g.updated_at, g.deleted_at from public.goods g
),
own as (
  select o.user_id, o.status, o.updated_at from public.ownerships o
),
mem as (
  -- 共有から参加した人（role = 'member'。作成者は 'owner'）
  select m.user_id, m.event_id, m.joined_at from public.event_memberships m where m.role = 'member'
),
sl as (
  -- token 列は選ばない
  select s.event_id, s.created_by, s.status, s.created_at, s.expires_at, s.revoked_at from public.share_links s
),
creators as (
  select distinct ev.owner_id as user_id from ev where ev.owner_id is not null
),
goods_users as (
  select distinct ev.owner_id as user_id from gd join ev on ev.id = gd.event_id where ev.owner_id is not null
),
ownership_users as (
  select distinct own.user_id from own
),
share_users as (
  -- 共有リンクを作った人（created_by。古い行で空ならイベント作成者）
  select distinct coalesce(sl.created_by, ev.owner_id) as user_id
  from sl join ev on ev.id = sl.event_id
  where coalesce(sl.created_by, ev.owner_id) is not null
),
viewer_users as (
  select distinct mem.user_id from mem
),
funnel as (
  select
    count(*) as confirmed,
    count(*) filter (where c.id in (select user_id from creators)) as created_event,
    count(*) filter (where c.id in (select user_id from goods_users)) as added_goods,
    count(*) filter (where c.id in (select user_id from goods_users)
                       and c.id in (select user_id from ownership_users)) as tracked_ownership,
    count(*) filter (where c.id in (select user_id from goods_users)
                       and c.id in (select user_id from ownership_users)
                       and c.id in (select user_id from share_users)) as shared,
    count(*) filter (where c.id in (select user_id from viewer_users)
                       and c.id not in (select user_id from creators)) as viewer_only
  from confirmed c
),
actions as (
  select ev.owner_id as user_id, ev.updated_at as at from ev where ev.owner_id is not null
  union all
  select ev.owner_id, gd.updated_at from gd join ev on ev.id = gd.event_id where ev.owner_id is not null
  union all
  select own.user_id, own.updated_at from own
  union all
  select mem.user_id, mem.joined_at from mem
  union all
  select coalesce(sl.created_by, ev.owner_id), greatest(sl.created_at, coalesce(sl.revoked_at, sl.created_at))
  from sl join ev on ev.id = sl.event_id where coalesce(sl.created_by, ev.owner_id) is not null
),
active as (
  select
    count(distinct a.user_id) filter (where a.at >= p.w7_start) as wau,
    count(distinct a.user_id) filter (where a.at >= p.w30_start) as mau
  from actions a cross join p
  where a.user_id in (select id from confirmed)
),
catalog_participants as (
  select mem.event_id, count(*) as n from mem group by mem.event_id
),
days as (
  select d::date as day from p, generate_series(p.from_date, p.today, interval '1 day') as d
)
select jsonb_build_object(
  'version', 1,
  'as_of', now(),
  'timezone', 'Asia/Tokyo',
  'today', (select to_char(today, 'YYYY-MM-DD') from p),
  'from', (select to_char(from_date, 'YYYY-MM-DD') from p),
  'users', jsonb_build_object(
    'confirmed', (select count(*) from confirmed),
    'accounts', (select count(*) from accounts),
    'today', (select count(*) from confirmed c, p where c.email_confirmed_at >= p.today_start),
    'last7d', (select count(*) from confirmed c, p where c.email_confirmed_at >= p.w7_start),
    'before_from', (select count(*) from confirmed c, p
                    where (c.email_confirmed_at at time zone 'Asia/Tokyo')::date < p.from_date)
  ),
  'active', (select jsonb_build_object('wau', wau, 'mau', mau) from active),
  'events', jsonb_build_object(
    'live', (select count(*) from ev where ev.deleted_at is null),
    'today', (select count(*) from ev, p where ev.created_at >= p.today_start)
  ),
  'goods', jsonb_build_object(
    'live', (select count(*) from gd join ev on ev.id = gd.event_id
             where gd.deleted_at is null and ev.deleted_at is null),
    'today', (select count(*) from gd, p where gd.created_at >= p.today_start)
  ),
  'ownership', jsonb_build_object(
    'users_any', (select count(*) from ownership_users),
    'users_owned', (select count(distinct own.user_id) from own where own.status = 'owned'),
    'owned_marks', (select count(*) from own where own.status = 'owned')
  ),
  'share', jsonb_build_object(
    'links_created', (select count(*) from sl),
    'links_active', (select count(*) from sl join ev on ev.id = sl.event_id
                     where sl.status = 'active' and (sl.expires_at is null or sl.expires_at > now())
                       and ev.deleted_at is null),
    'catalogs_shared', (select count(distinct sl.event_id) from sl),
    'catalogs_with_participants', (select count(*) from catalog_participants),
    'joins', (select count(*) from mem),
    'participant_users', (select count(*) from viewer_users),
    -- 確認済みユーザーのうち、共有リンクを作った人 / 共有を使った人（作成または参加）
    'creator_users', (select count(*) from confirmed c where c.id in (select user_id from share_users)),
    'users_any', (select count(*) from confirmed c
                  where c.id in (select user_id from share_users) or c.id in (select user_id from viewer_users)),
    'participants_max', (select max(n) from catalog_participants),
    'catalogs_by_participants', jsonb_build_object(
      '1', (select count(*) from catalog_participants where n = 1),
      '2_4', (select count(*) from catalog_participants where n between 2 and 4),
      '5_plus', (select count(*) from catalog_participants where n >= 5)
    ),
    -- 確認済みユーザーのうち、自分のイベントを作る前（または作らずに）共有から参加した人数
    'joined_before_creating', (
      select count(*) from confirmed c
      where exists (select 1 from mem where mem.user_id = c.id)
        and (select min(mem.joined_at) from mem where mem.user_id = c.id)
            < coalesce((select min(ev.created_at) from ev where ev.owner_id = c.id), 'infinity'::timestamptz)
    )
  ),
  'funnel', (select jsonb_build_object(
    'confirmed', confirmed, 'created_event', created_event, 'added_goods', added_goods,
    'tracked_ownership', tracked_ownership, 'shared', shared, 'viewer_only', viewer_only) from funnel),
  'daily', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'date', to_char(days.day, 'YYYY-MM-DD'),
      'new_users', (select count(*) from confirmed c
                    where (c.email_confirmed_at at time zone 'Asia/Tokyo')::date = days.day),
      'new_events', (select count(*) from ev where (ev.created_at at time zone 'Asia/Tokyo')::date = days.day),
      'new_goods', (select count(*) from gd where (gd.created_at at time zone 'Asia/Tokyo')::date = days.day),
      'share_links', (select count(*) from sl where (sl.created_at at time zone 'Asia/Tokyo')::date = days.day),
      'joins', (select count(*) from mem where (mem.joined_at at time zone 'Asia/Tokyo')::date = days.day)
    ) order by days.day), '[]'::jsonb)
    from days
  )
);
$$;

-- 実行権限は service_role のみ（Supabase の既定では anon / authenticated にも付くため明示的に外す）
revoke all on function public.mochico_dashboard_stats(date) from public;
revoke all on function public.mochico_dashboard_stats(date) from anon, authenticated;
grant execute on function public.mochico_dashboard_stats(date) to service_role;

comment on function public.mochico_dashboard_stats(date) is
  'CEO Dashboard 向けの集計値のみを返す（PII・共有トークンは返さない）。service_role 専用。';
