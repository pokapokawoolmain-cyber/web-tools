-- ============================================================
-- ROLLBACK for 20261008000000_mochico_phase3.sql
--   本番で問題があった場合に、Phase 3 以前のスキーマへ戻す（手動実行。migrations/ には置かない）。
--   アプリは先に Phase 3 以前のデプロイへ戻すこと（新しいアプリは新しい列を前提にしている）。
--
--   失われるもの（戻す前に必要ならバックアップを取る）
--     * 2枚目以降の画像の登録（代表画像は goods.image_path に残る。Storage のファイルは残る）
--     * ランダム商品の絵柄と、絵柄ごとの数量（ユーザーごとに「どれか1つでも持っていれば取得済み」に集約）
--     * 2個以上の数量（取得済み / 未取得だけに戻る）
--     * 空のカテゴリ・カテゴリの並び順（グッズの category 文字列は残る）
-- ============================================================
begin;

-- 所持: 絵柄ごとの行をグッズ単位の1行（取得済み / 未取得）に集約
with agg as (
  delete from public.ownerships where variant_id is not null
  returning user_id, goods_id, quantity
)
insert into public.ownerships (user_id, goods_id, status)
select a.user_id, a.goods_id, case when sum(a.quantity) > 0 then 'owned' else 'unowned' end
  from agg a group by a.user_id, a.goods_id
on conflict do nothing;

drop trigger if exists ownerships_a_quantity_status on public.ownerships;
drop trigger if exists ownerships_b_variant_check on public.ownerships;
alter table public.ownerships drop constraint if exists ownerships_user_goods_variant_key;
alter table public.ownerships drop column if exists variant_id;
alter table public.ownerships drop column if exists quantity;
alter table public.ownerships add constraint ownerships_user_id_goods_id_key unique (user_id, goods_id);

-- カタログ
drop trigger if exists goods_sync_category on public.goods;
drop trigger if exists events_check_image_paths on public.events;
drop table if exists public.goods_variants;
drop table if exists public.goods_images;
alter table public.goods drop column if exists category_id;
alter table public.goods drop column if exists kind;
drop table if exists public.goods_categories;

drop function if exists public.goods_convert_kind(uuid, text, text);
drop function if exists public.goods_save_media(uuid, jsonb, jsonb);
drop function if exists public.goods_sync_cover_image();
drop function if exists public.goods_sync_category();
drop function if exists public.goods_category_renamed();
drop function if exists public.goods_ownership_quantity_status();
drop function if exists public.goods_ownership_variant_check();
drop function if exists public.goods_variant_requires_random();
drop function if exists public.goods_check_image_paths();
drop function if exists public.goods_path_in(text, text);

-- goods の列権限を元に戻す
revoke insert, update on public.goods from authenticated;
grant insert, update on public.goods to authenticated;

-- 関数を Phase 3 以前の定義へ（20261004 の goods_my_events / 20261003 の goods_get_shared_catalog /
-- 20261004 の goods_protect_columns / 20261001 の goods_enforce_limits）
create or replace function public.goods_my_events()
returns table (
  id uuid, owner_id uuid, title text, description text, start_date date, end_date date, cover_image_path text,
  role text, total_count bigint, owned_count bigint, updated_at timestamptz, deleted boolean, preserved boolean
)
language sql stable security invoker set search_path = ''
as $$
  select
    e.id, e.owner_id, e.title, e.description, e.start_date, e.end_date, e.cover_image_path,
    m.role,
    (select count(*) from public.goods g where g.event_id = e.id and g.deleted_at is null),
    (select count(*) from public.goods g
       join public.ownerships o on o.goods_id = g.id and o.user_id = auth.uid() and o.status = 'owned'
      where g.event_id = e.id and g.deleted_at is null),
    e.updated_at, e.deleted_at is not null, e.preserved_at is not null
  from public.event_memberships m
  join public.events e on e.id = m.event_id
  where m.user_id = auth.uid() and (e.deleted_at is null or m.role = 'member')
  order by (e.deleted_at is not null), coalesce(e.start_date, e.created_at::date) desc, e.created_at desc;
$$;

create or replace function public.goods_get_shared_catalog(p_token text)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare r record; v_event jsonb; v_goods jsonb;
begin
  select * into r from public.goods_resolve_share(p_token);
  if r.o_status <> 'ok' then return jsonb_build_object('status', r.o_status); end if;
  select jsonb_build_object('title', e.title, 'description', e.description, 'start_date', e.start_date,
                            'end_date', e.end_date, 'cover_path', e.cover_image_path)
    into v_event from public.events e where e.id = r.o_event_id;
  select coalesce(jsonb_agg(jsonb_build_object(
           'key', g.sort_order::text || '-' || left(md5(g.id::text), 8), 'name', g.name, 'price', g.price,
           'description', g.description, 'category', g.category, 'image_path', g.image_path, 'thumb_path', g.thumb_path
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods from public.goods g where g.event_id = r.o_event_id and g.deleted_at is null;
  return jsonb_build_object('status', 'ok', 'event', v_event, 'goods', v_goods);
end;
$$;

create or replace function public.goods_protect_columns()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_table_name = 'events' then
    if new.owner_id is distinct from old.owner_id then
      if new.owner_id is not null then raise exception 'owner_id cannot be changed' using errcode = '42501'; end if;
      new.preserved_at := coalesce(new.preserved_at, now());
    end if;
    if old.preserved_at is not null and new.preserved_at is null then
      raise exception 'preserved event cannot be restored' using errcode = '42501';
    end if;
  elsif tg_table_name = 'goods' then
    if new.event_id is distinct from old.event_id then raise exception 'event_id cannot be changed' using errcode = '42501'; end if;
  elsif tg_table_name = 'ownerships' then
    if new.user_id is distinct from old.user_id or new.goods_id is distinct from old.goods_id then
      raise exception 'ownership keys cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'share_links' then
    if new.event_id is distinct from old.event_id or new.token is distinct from old.token then
      raise exception 'share link keys cannot be changed' using errcode = '42501';
    end if;
  end if;
  if new.created_at is distinct from old.created_at then raise exception 'created_at cannot be changed' using errcode = '42501'; end if;
  return new;
end;
$$;

create or replace function public.goods_enforce_limits()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_table_name = 'events' then
    if (select count(*) from public.events where owner_id = new.owner_id and deleted_at is null) >= 300 then
      raise exception 'event limit reached' using errcode = 'P0001', hint = 'goods_event_limit';
    end if;
  elsif tg_table_name = 'goods' then
    if (select count(*) from public.goods where event_id = new.event_id and deleted_at is null) >= 1000 then
      raise exception 'goods limit reached' using errcode = 'P0001', hint = 'goods_goods_limit';
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.goods_my_events(), public.goods_get_shared_catalog(text) from public, anon, authenticated;
grant execute on function public.goods_my_events() to authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;

delete from supabase_migrations.schema_migrations where version = '20261008000000';
commit;
