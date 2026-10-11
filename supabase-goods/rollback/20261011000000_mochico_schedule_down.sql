-- ============================================================
-- ROLLBACK for 20261011000000_mochico_schedule.sql（手動実行。migrations/ には置かない）
--   順番: アプリを予約・販売スケジュール以前に戻す → この SQL
--   失われるもの: 予約・販売スケジュールの入力値（必要なら事前にバックアップ）。それ以外のデータは変わらない
-- ============================================================
begin;

-- マイイベント一覧・共有カタログを Phase 3 の定義へ（20261008 と同じ本文）
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
  preserved boolean
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
    e.preserved_at is not null
  from public.event_memberships m
  join public.events e on e.id = m.event_id
  where m.user_id = auth.uid()
    and (e.deleted_at is null or m.role = 'member')
  order by (e.deleted_at is not null), coalesce(e.start_date, e.created_at::date) desc, e.created_at desc;
$$;

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
           'cover_path', case when public.goods_path_in(e.cover_image_path, e.id::text || '/cover/') then e.cover_image_path end
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
                from public.goods_variants v where v.goods_id = g.id and v.deleted_at is null) else '[]'::jsonb end
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods
    from public.goods g
   where g.event_id = r.o_event_id and g.deleted_at is null;

  return jsonb_build_object('status', 'ok', 'event', v_event, 'categories', v_categories, 'goods', v_goods);
end;
$$;

alter table public.goods
  drop constraint if exists goods_schedule_order,
  drop constraint if exists goods_schedule_time_needs_date,
  drop column if exists schedule_override,
  drop column if exists reserve_start_date,
  drop column if exists reserve_start_time,
  drop column if exists reserve_end_date,
  drop column if exists reserve_end_time,
  drop column if exists sale_start_date,
  drop column if exists sale_start_time;
alter table public.events
  drop constraint if exists events_schedule_order,
  drop constraint if exists events_schedule_time_needs_date,
  drop column if exists reserve_start_date,
  drop column if exists reserve_start_time,
  drop column if exists reserve_end_date,
  drop column if exists reserve_end_time,
  drop column if exists sale_start_date,
  drop column if exists sale_start_time;
drop function if exists public.goods_schedule_start(date, time);
drop function if exists public.goods_schedule_end(date, time);

revoke execute on function public.goods_my_events(), public.goods_get_shared_catalog(text) from public, anon, authenticated;
grant execute on function public.goods_my_events() to authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;

delete from supabase_migrations.schema_migrations where version = '20261011000000';
commit;
