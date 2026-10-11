-- ============================================================
-- Mochico: 予約・販売スケジュール（expand のみ。既存データは変更しない）
--   設計書: docs/goods/MOCHICO_SCHEDULE_DESIGN.md（CEO 決定 D1〜D4）
--
--   * 日時は「日本時間の日付（date）」＋「時刻（time、null = 日付のみ）」で保存する（タイムゾーンの曖昧さを持たない）
--   * 判定（D2）: 開始 = その時刻（日付のみは 0:00）から / 終了 = その時刻の直前まで（日付のみは当日 23:59:59 まで
--                ＝ 翌日 0:00 を排他的な終了境界とする）
--   * グッズ（D1）: schedule_override = false なら「イベントと同じ」、true なら「このグッズだけ別に設定」
--   * イベント一覧（D3）: イベント自身の予約期間を表示。グッズ固有の設定は件数だけ返す（イベントの期間として扱わない）
--   * 共有ページ（D4）: イベントとグッズの（有効な）スケジュールを返す。所持情報は含めない
--   * 権限: 書き込みはイベントのオーナーだけ（既存の RLS）。参加者は閲覧のみ
--   * contract（20261009、未適用）: goods の列権限リストに新しい列を追加済み（このファイルでも列単位で許可する）
-- ロールバック: supabase-goods/rollback/20261011000000_mochico_schedule_down.sql
-- ============================================================

-- 日本時間の「壁時計」の時刻（timestamp without time zone）。日本は夏時間が無いので比較はこの値で一意
create or replace function public.goods_schedule_start(p_date date, p_time time)
returns timestamp language sql immutable set search_path = ''
as $$ select case when p_date is null then null else p_date + coalesce(p_time, time '00:00') end $$;

-- 終了の排他的境界: 日付のみ → 翌日 0:00、時刻あり → その時刻
create or replace function public.goods_schedule_end(p_date date, p_time time)
returns timestamp language sql immutable set search_path = ''
as $$ select case when p_date is null then null when p_time is null then (p_date + 1) + time '00:00' else p_date + p_time end $$;

-- ------------------------------------------------------------
-- 列（すべて null 可・既定値なし。既存の行は「未設定」のまま）
-- ------------------------------------------------------------
alter table public.events
  add column reserve_start_date date,
  add column reserve_start_time time,
  add column reserve_end_date date,
  add column reserve_end_time time,
  add column sale_start_date date,
  add column sale_start_time time,
  add constraint events_schedule_time_needs_date check (
    (reserve_start_time is null or reserve_start_date is not null)
    and (reserve_end_time is null or reserve_end_date is not null)
    and (sale_start_time is null or sale_start_date is not null)),
  add constraint events_schedule_order check (
    reserve_start_date is null or reserve_end_date is null
    or public.goods_schedule_end(reserve_end_date, reserve_end_time) > public.goods_schedule_start(reserve_start_date, reserve_start_time));

alter table public.goods
  add column schedule_override boolean not null default false,
  add column reserve_start_date date,
  add column reserve_start_time time,
  add column reserve_end_date date,
  add column reserve_end_time time,
  add column sale_start_date date,
  add column sale_start_time time,
  add constraint goods_schedule_time_needs_date check (
    (reserve_start_time is null or reserve_start_date is not null)
    and (reserve_end_time is null or reserve_end_date is not null)
    and (sale_start_time is null or sale_start_date is not null)),
  add constraint goods_schedule_order check (
    reserve_start_date is null or reserve_end_date is null
    or public.goods_schedule_end(reserve_end_date, reserve_end_time) > public.goods_schedule_start(reserve_start_date, reserve_start_time));

-- ------------------------------------------------------------
-- 列の権限: contract（20261009）が goods の列を限定しても、スケジュールの列は書けるようにする。
-- （テーブル単位の revoke は列単位の権限も外すため、contract 側の列リストにも同じ列を追加してある）
-- ------------------------------------------------------------
grant insert (schedule_override, reserve_start_date, reserve_start_time, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time) on public.goods to authenticated;
grant update (schedule_override, reserve_start_date, reserve_start_time, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time) on public.goods to authenticated;

-- ------------------------------------------------------------
-- マイイベント一覧: イベント自身のスケジュールと、個別のスケジュールを持つグッズの件数を追加（D3）
-- 戻り値の型が変わるため作り直す（旧アプリは項目名で読むので、追加の項目は無視される）
-- ------------------------------------------------------------
drop function public.goods_my_events();
create function public.goods_my_events()
returns table (
  id uuid,
  owner_id uuid,
  title text,
  description text,
  start_date date,
  end_date date,
  cover_image_path text,
  role text,
  total_count bigint,
  owned_count bigint,
  updated_at timestamptz,
  deleted boolean,
  preserved boolean,
  reserve_start_date date,
  reserve_start_time time,
  reserve_end_date date,
  reserve_end_time time,
  sale_start_date date,
  sale_start_time time,
  goods_schedule_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    e.id, e.owner_id, e.title, e.description, e.start_date, e.end_date, e.cover_image_path,
    m.role,
    (select count(*) from public.goods g where g.event_id = e.id and g.deleted_at is null),
    (select count(*) from public.goods g
       join public.ownerships o on o.goods_id = g.id and o.user_id = auth.uid() and o.quantity > 0
      where g.event_id = e.id and g.deleted_at is null),
    e.updated_at,
    e.deleted_at is not null,
    e.preserved_at is not null,
    e.reserve_start_date, e.reserve_start_time, e.reserve_end_date, e.reserve_end_time, e.sale_start_date, e.sale_start_time,
    (select count(*) from public.goods g
      where g.event_id = e.id and g.deleted_at is null and g.schedule_override
        and (g.reserve_start_date is not null or g.reserve_end_date is not null or g.sale_start_date is not null))
  from public.event_memberships m
  join public.events e on e.id = m.event_id
  where m.user_id = auth.uid()
    and (e.deleted_at is null or m.role = 'member')
  order by (e.deleted_at is not null), coalesce(e.start_date, e.created_at::date) desc, e.created_at desc;
$$;

-- ------------------------------------------------------------
-- 共有カタログ: イベントのスケジュールと、グッズの有効なスケジュール（D1 の継承後）を追加（D4）
-- ------------------------------------------------------------
create or replace function public.goods_get_shared_catalog(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  r record;
  v_event jsonb;
  v_goods jsonb;
  v_categories jsonb;
begin
  select * into r from public.goods_resolve_share(p_token);
  if r.o_status <> 'ok' then
    return jsonb_build_object('status', r.o_status);
  end if;

  select jsonb_build_object(
           'title', e.title,
           'description', e.description,
           'start_date', e.start_date,
           'end_date', e.end_date,
           'cover_path', case when public.goods_path_in(e.cover_image_path, e.id::text || '/cover/') then e.cover_image_path end,
           'schedule', jsonb_build_object(
             'reserve_start_date', e.reserve_start_date, 'reserve_start_time', e.reserve_start_time,
             'reserve_end_date', e.reserve_end_date, 'reserve_end_time', e.reserve_end_time,
             'sale_start_date', e.sale_start_date, 'sale_start_time', e.sale_start_time)
         )
    into v_event
    from public.events e where e.id = r.o_event_id;

  select coalesce(jsonb_agg(c.name order by c.sort_order, c.name), '[]'::jsonb)
    into v_categories
    from public.goods_categories c where c.event_id = r.o_event_id;

  select coalesce(jsonb_agg(jsonb_build_object(
           'key', g.sort_order::text || '-' || left(md5(g.id::text), 8),
           'name', g.name,
           'price', g.price,
           'description', g.description,
           'category', g.category,
           'kind', g.kind,
           'image_path', case when public.goods_path_in(g.image_path, g.event_id::text || '/' || g.id::text || '/') then g.image_path end,
           'thumb_path', case when public.goods_path_in(g.thumb_path, g.event_id::text || '/' || g.id::text || '/') then g.thumb_path end,
           'variants', case when g.kind = 'random' then (
              select coalesce(jsonb_agg(jsonb_build_object(
                       'name', v.name,
                       'thumb_path', case when public.goods_path_in(v.thumb_path, g.event_id::text || '/' || g.id::text || '/') then v.thumb_path end
                     ) order by v.sort_order, v.created_at), '[]'::jsonb)
                from public.goods_variants v where v.goods_id = g.id and v.deleted_at is null) else '[]'::jsonb end,
           'schedule_own', g.schedule_override,
           'schedule', case when g.schedule_override then jsonb_build_object(
               'reserve_start_date', g.reserve_start_date, 'reserve_start_time', g.reserve_start_time,
               'reserve_end_date', g.reserve_end_date, 'reserve_end_time', g.reserve_end_time,
               'sale_start_date', g.sale_start_date, 'sale_start_time', g.sale_start_time)
             else jsonb_build_object(
               'reserve_start_date', e.reserve_start_date, 'reserve_start_time', e.reserve_start_time,
               'reserve_end_date', e.reserve_end_date, 'reserve_end_time', e.reserve_end_time,
               'sale_start_date', e.sale_start_date, 'sale_start_time', e.sale_start_time) end
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods
    from public.goods g
    join public.events e on e.id = g.event_id
   where g.event_id = r.o_event_id and g.deleted_at is null;

  return jsonb_build_object('status', 'ok', 'event', v_event, 'categories', v_categories, 'goods', v_goods);
end;
$$;

-- 実行権限（判定関数は CHECK 制約からユーザー権限で呼ばれる）
revoke execute on function public.goods_schedule_start(date, time), public.goods_schedule_end(date, time) from public, anon;
grant execute on function public.goods_schedule_start(date, time), public.goods_schedule_end(date, time) to authenticated, service_role;
revoke execute on function public.goods_my_events(), public.goods_get_shared_catalog(text) from public, anon, authenticated;
grant execute on function public.goods_my_events() to authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;
