-- ============================================================
-- ROLLBACK for 20261008000000_mochico_phase3.sql（expand）
--   Phase 3 以前のスキーマへ戻す（手動実行。migrations/ には置かない）。画像パスのガード（20261007）は残す。
--   順番: contract を適用済みなら先に contract のロールバック → アプリを Phase 3 以前に戻す → この SQL
--
--   残るもの: グッズ単位の取得状況（ランダム商品は「どれかの絵柄を1つ以上持っていれば取得済み」）、
--             代表画像（goods.image_path）、カテゴリ名（goods.category 文字列）
--   失われるもの（必要なら事前にバックアップ）:
--     * 2枚目以降の画像の登録（Storage のファイルは残る）
--     * 絵柄と絵柄ごとの数量、2個以上の数量（取得済み / 未取得だけに戻る）
--     * 空のカテゴリ・カテゴリの並び順
-- ============================================================
begin;

-- 所持: ownerships はグッズ単位の合計を保っているので、status をそのまま残せばよい（数量列を消すだけ）
drop trigger if exists ownerships_a_quantity_status on public.ownerships;
drop table if exists public.ownership_variants;
alter table public.ownerships drop column if exists quantity;

-- カタログ
drop trigger if exists goods_sync_category on public.goods;
drop trigger if exists goods_legacy_image_sync on public.goods;
drop table if exists public.goods_variants;
drop table if exists public.goods_images;
alter table public.goods drop column if exists category_id;
alter table public.goods drop column if exists kind;
drop table if exists public.goods_categories;

drop function if exists public.goods_convert_kind(uuid, text, text);
drop function if exists public.goods_save_media(uuid, jsonb, jsonb);
drop function if exists public.goods_event_has_members(uuid);
drop function if exists public.goods_unreferenced_storage_paths(interval);
drop function if exists public.goods_ownership_variants_changed();
drop function if exists public.goods_variant_visibility_changed();
drop function if exists public.goods_recompute_ownership(uuid, uuid);
drop function if exists public.goods_event_image_count(uuid);
drop function if exists public.goods_sync_cover_image();
drop function if exists public.goods_legacy_image_sync();
drop function if exists public.goods_sync_category();
drop function if exists public.goods_category_renamed();
drop function if exists public.goods_ownership_quantity_status();
drop function if exists public.goods_ownership_variant_check();
drop function if exists public.goods_variant_requires_random();

-- 画像パスの検査を「画像パスのガード」時点の定義へ（events / goods のみ）
create or replace function public.goods_check_image_paths()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_table_name = 'events' then
    if tg_op = 'INSERT' or new.cover_image_path is distinct from old.cover_image_path then
      if not public.goods_path_in(new.cover_image_path, new.id::text || '/cover/') then
        raise exception 'invalid image path' using errcode = '22023';
      end if;
    end if;
  elsif tg_table_name = 'goods' then
    if tg_op = 'INSERT' or new.image_path is distinct from old.image_path or new.thumb_path is distinct from old.thumb_path then
      if not public.goods_path_in(new.image_path, new.event_id::text || '/' || new.id::text || '/')
         or not public.goods_path_in(new.thumb_path, new.event_id::text || '/' || new.id::text || '/') then
        raise exception 'invalid image path' using errcode = '22023';
      end if;
    end if;
  end if;
  return new;
end;
$$;

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

-- 共有カタログを「画像パスのガード」時点の定義へ
create or replace function public.goods_get_shared_catalog(p_token text)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare r record; v_event jsonb; v_goods jsonb;
begin
  select * into r from public.goods_resolve_share(p_token);
  if r.o_status <> 'ok' then return jsonb_build_object('status', r.o_status); end if;
  select jsonb_build_object('title', e.title, 'description', e.description, 'start_date', e.start_date, 'end_date', e.end_date,
           'cover_path', case when public.goods_path_in(e.cover_image_path, e.id::text || '/cover/') then e.cover_image_path end)
    into v_event from public.events e where e.id = r.o_event_id;
  select coalesce(jsonb_agg(jsonb_build_object(
           'key', g.sort_order::text || '-' || left(md5(g.id::text), 8), 'name', g.name, 'price', g.price,
           'description', g.description, 'category', g.category,
           'image_path', case when public.goods_path_in(g.image_path, g.event_id::text || '/' || g.id::text || '/') then g.image_path end,
           'thumb_path', case when public.goods_path_in(g.thumb_path, g.event_id::text || '/' || g.id::text || '/') then g.thumb_path end
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
