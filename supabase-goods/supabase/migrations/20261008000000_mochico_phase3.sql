-- ============================================================
-- Mochico Phase 3（expand）: カテゴリ・複数画像・ランダム商品（絵柄）・所持数量
--
-- 段階的な移行（expand → アプリのデプロイ → contract）
--   この migration は「旧アプリ（Phase 3 以前）がそのまま動く」ように作る。
--     * ownerships の一意キー (user_id, goods_id) は変えない（旧アプリの upsert がそのまま動く）
--     * 絵柄ごとの数量は ownership_variants に置き、ownerships にはその合計をトリガーで保つ
--     * 旧アプリが goods.image_path を直接書いたら、ギャラリーの先頭（代表画像）へ反映する
--     * goods の列権限はここでは絞らない（20261009000000_mochico_phase3_contract.sql で、デプロイ後に絞る）
--
-- データの置き場所
--   カタログ（共有）: goods_categories / goods（kind・category_id）/ goods_images / goods_variants
--       閲覧 = イベントのメンバー、変更 = イベントのオーナー
--   所持（個人）  : ownerships（グッズ単位の数量。ランダム商品は絵柄の合計）/ ownership_variants（絵柄ごと）
--       本人だけ
--
-- 所持数量を失わないための設計
--   * 絵柄の削除は論理削除（deleted_at）。参加者の数量は残り、戻すと数量も戻る
--   * ランダム → 通常の変換は、ほかに参加者がいないリストのときだけ（参加者の絵柄ごとの数量をまとめない）
--   * 通常 → ランダムは、各人の数量を1つ目の絵柄へそのまま移す（合計は変わらない）
--
-- 前提: 20261007000000_mochico_image_path_guard.sql（画像パスのガード）
-- ロールバック: supabase-goods/rollback/20261008000000_mochico_phase3_down.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. カテゴリ（イベント単位・共有カタログ）
-- ------------------------------------------------------------
create table public.goods_categories (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 30 and name = btrim(name)),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, name)
);
create index goods_categories_event_idx on public.goods_categories (event_id, sort_order);
create trigger goods_categories_updated_at before update on public.goods_categories
  for each row execute function public.goods_set_updated_at();

-- ------------------------------------------------------------
-- 2. goods の拡張
-- ------------------------------------------------------------
alter table public.goods
  add column kind text not null default 'normal' check (kind in ('normal', 'random')),
  add column category_id uuid references public.goods_categories (id) on delete set null;
create index goods_category_idx on public.goods (category_id) where category_id is not null;

-- 既存の文字列カテゴリからカテゴリを作り、category_id を設定する（削除済みでないグッズの分だけ作る）
insert into public.goods_categories (event_id, name, sort_order)
select event_id, name, (row_number() over (partition by event_id order by first_sort, name))::int - 1
  from (
    select g.event_id, btrim(g.category) as name, min(g.sort_order) as first_sort
      from public.goods g
     where g.deleted_at is null and g.category is not null and btrim(g.category) <> ''
     group by g.event_id, btrim(g.category)
  ) c;
update public.goods g
   set category_id = c.id
  from public.goods_categories c
 where c.event_id = g.event_id and c.name = btrim(g.category) and g.category is not null;

-- ------------------------------------------------------------
-- 3. 複数画像（商品紹介用。sort_order 0 が代表画像）
-- ------------------------------------------------------------
create table public.goods_images (
  id         uuid primary key default gen_random_uuid(),
  goods_id   uuid not null references public.goods (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  image_path text not null check (char_length(image_path) <= 300),
  thumb_path text not null check (char_length(thumb_path) <= 300),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index goods_images_goods_idx on public.goods_images (goods_id, sort_order);
create index goods_images_event_idx on public.goods_images (event_id);

-- 既存の1枚画像を先頭（代表）として移す
insert into public.goods_images (goods_id, event_id, image_path, thumb_path, sort_order, created_at)
select g.id, g.event_id, g.image_path, coalesce(g.thumb_path, g.image_path), 0, g.created_at
  from public.goods g
 where g.image_path is not null;

-- ------------------------------------------------------------
-- 4. ランダム商品の絵柄（所持管理の対象。画像は任意で1枚。削除は論理削除）
-- ------------------------------------------------------------
create table public.goods_variants (
  id         uuid primary key default gen_random_uuid(),
  goods_id   uuid not null references public.goods (id) on delete cascade,
  event_id   uuid not null references public.events (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 60 and name = btrim(name)),
  image_path text check (image_path is null or char_length(image_path) <= 300),
  thumb_path text check (thumb_path is null or char_length(thumb_path) <= 300),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index goods_variants_goods_idx on public.goods_variants (goods_id, sort_order);
create index goods_variants_event_idx on public.goods_variants (event_id);
create trigger goods_variants_updated_at before update on public.goods_variants
  for each row execute function public.goods_set_updated_at();

-- ------------------------------------------------------------
-- 5. 所持数量（個人）
--   ownerships: グッズ単位。既存の owned → 1 / unowned → 0。一意キーは (user_id, goods_id) のまま
--   ownership_variants: ランダム商品の絵柄ごと。ownerships.quantity はその合計（トリガーで維持）
-- ------------------------------------------------------------
alter table public.ownerships
  add column quantity integer not null default 0 check (quantity between 0 and 9999);
update public.ownerships set quantity = case when status = 'owned' then 1 else 0 end;

create table public.ownership_variants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  goods_id    uuid not null references public.goods (id) on delete cascade,
  variant_id  uuid not null references public.goods_variants (id) on delete cascade,
  quantity    integer not null default 0 check (quantity between 0 and 9999),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, variant_id)
);
create index ownership_variants_goods_idx on public.ownership_variants (goods_id);
create index ownership_variants_variant_idx on public.ownership_variants (variant_id);
create trigger ownership_variants_updated_at before update on public.ownership_variants
  for each row execute function public.goods_set_updated_at();

-- ============================================================
-- トリガー
-- ============================================================

-- 変更不可列の保護（既存の関数に新テーブルを追加）
create or replace function public.goods_protect_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'events' then
    if new.owner_id is distinct from old.owner_id then
      if new.owner_id is not null then
        raise exception 'owner_id cannot be changed' using errcode = '42501';
      end if;
      new.preserved_at := coalesce(new.preserved_at, now());
    end if;
    if old.preserved_at is not null and new.preserved_at is null then
      raise exception 'preserved event cannot be restored' using errcode = '42501';
    end if;
  elsif tg_table_name = 'goods' then
    if new.event_id is distinct from old.event_id then
      raise exception 'event_id cannot be changed' using errcode = '42501';
    end if;
    -- 種類は変換 RPC（数量の移し替えを伴う）からだけ変えられる。列権限を絞る前（expand 中）も直接の変更を拒否
    if new.kind is distinct from old.kind and coalesce(current_setting('mochico.kind_convert', true), '') <> '1' then
      raise exception 'use goods_convert_kind to change kind' using errcode = '42501';
    end if;
  elsif tg_table_name = 'ownerships' then
    if new.user_id is distinct from old.user_id or new.goods_id is distinct from old.goods_id then
      raise exception 'ownership keys cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'ownership_variants' then
    if new.user_id is distinct from old.user_id or new.goods_id is distinct from old.goods_id
       or new.variant_id is distinct from old.variant_id then
      raise exception 'ownership keys cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'share_links' then
    if new.event_id is distinct from old.event_id or new.token is distinct from old.token then
      raise exception 'share link keys cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'goods_categories' then
    if new.event_id is distinct from old.event_id then
      raise exception 'event_id cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name in ('goods_images', 'goods_variants') then
    if new.goods_id is distinct from old.goods_id or new.event_id is distinct from old.event_id then
      raise exception 'goods_id cannot be changed' using errcode = '42501';
    end if;
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'created_at cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger goods_categories_protect before update on public.goods_categories
  for each row execute function public.goods_protect_columns();
create trigger goods_images_protect before update on public.goods_images
  for each row execute function public.goods_protect_columns();
create trigger goods_variants_protect before update on public.goods_variants
  for each row execute function public.goods_protect_columns();
create trigger ownership_variants_protect before update on public.ownership_variants
  for each row execute function public.goods_protect_columns();

-- 画像パスの検査（画像パスのガードの関数に、画像・絵柄のテーブルを追加）
create or replace function public.goods_check_image_paths()
returns trigger
language plpgsql
set search_path = ''
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
  elsif tg_table_name in ('goods_images', 'goods_variants') then
    -- event_id はグッズから決める（クライアントの値を信用しない）
    select g.event_id into new.event_id from public.goods g where g.id = new.goods_id;
    if new.event_id is null then
      raise exception 'goods not found' using errcode = '23503';
    end if;
    if not public.goods_path_in(new.image_path, new.event_id::text || '/' || new.goods_id::text || '/')
       or not public.goods_path_in(new.thumb_path, new.event_id::text || '/' || new.goods_id::text || '/') then
      raise exception 'invalid image path' using errcode = '22023';
    end if;
  end if;
  return new;
end;
$$;
create trigger goods_images_check_paths before insert or update on public.goods_images
  for each row execute function public.goods_check_image_paths();
create trigger goods_variants_check_paths before insert or update on public.goods_variants
  for each row execute function public.goods_check_image_paths();

-- 絵柄はランダム商品にだけ追加できる
create or replace function public.goods_variant_requires_random()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (select 1 from public.goods g where g.id = new.goods_id and g.kind = 'random') then
    raise exception 'variants are only for random goods' using errcode = '22023';
  end if;
  return new;
end;
$$;
create trigger goods_variants_require_random before insert on public.goods_variants
  for each row execute function public.goods_variant_requires_random();

-- 代表画像の写し（goods.image_path / thumb_path = goods_images の先頭）
--   contract 後は goods の画像列をクライアントが直接書けないため security definer で書く。
--   旧アプリ由来の書き込み（下の goods_legacy_image_sync）と区別するため、書く間だけフラグを立てる
create or replace function public.goods_sync_cover_image()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_goods uuid := coalesce(new.goods_id, old.goods_id);
  v_img text;
  v_thumb text;
  v_prev text := coalesce(current_setting('mochico.media_sync', true), '');
begin
  select i.image_path, i.thumb_path into v_img, v_thumb
    from public.goods_images i
   where i.goods_id = v_goods
   order by i.sort_order, i.created_at, i.id
   limit 1;
  perform set_config('mochico.media_sync', '1', true);
  update public.goods g
     set image_path = v_img, thumb_path = v_thumb
   where g.id = v_goods
     and (g.image_path is distinct from v_img or g.thumb_path is distinct from v_thumb);
  perform set_config('mochico.media_sync', v_prev, true);
  return null;
end;
$$;
create trigger goods_images_sync_cover after insert or update or delete on public.goods_images
  for each row execute function public.goods_sync_cover_image();

-- 旧アプリ互換: goods.image_path を直接書いたら、ギャラリーの先頭（代表画像）へ反映する
--   （旧アプリは1枚だけを扱う。2枚目以降の画像には触れない）
create or replace function public.goods_legacy_image_sync()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(current_setting('mochico.media_sync', true), '') = '1' then
    return null; -- 代表画像の写しによる更新（新しい仕組み）なので何もしない
  end if;
  if tg_op = 'UPDATE' and new.image_path is not distinct from old.image_path and new.thumb_path is not distinct from old.thumb_path then
    return null;
  end if;
  if new.image_path is null then
    delete from public.goods_images where goods_id = new.id and sort_order = 0;
  elsif exists (select 1 from public.goods_images where goods_id = new.id and sort_order = 0) then
    update public.goods_images
       set image_path = new.image_path, thumb_path = coalesce(new.thumb_path, new.image_path)
     where goods_id = new.id and sort_order = 0;
  else
    insert into public.goods_images (goods_id, event_id, image_path, thumb_path, sort_order)
    values (new.id, new.event_id, new.image_path, coalesce(new.thumb_path, new.image_path), 0);
  end if;
  return null;
end;
$$;
create trigger goods_legacy_image_sync after insert or update of image_path, thumb_path on public.goods
  for each row execute function public.goods_legacy_image_sync();

-- カテゴリの写し: category_id ⇄ category（旧アプリの文字列書き込みも受け付ける）
create or replace function public.goods_sync_category()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_name text;
  v_id uuid;
begin
  if tg_op = 'INSERT' and new.category_id is null and new.category is not null
     or tg_op = 'UPDATE' and new.category_id is not distinct from old.category_id and new.category is distinct from old.category then
    -- 文字列だけが送られてきた（旧アプリ）: 同名のカテゴリへ紐づけ、無ければ作る（作れるのはオーナーだけ＝RLS）
    v_name := nullif(btrim(new.category), '');
    if v_name is null then
      new.category_id := null;
      new.category := null;
    else
      select c.id into v_id from public.goods_categories c where c.event_id = new.event_id and c.name = v_name;
      if v_id is null then
        insert into public.goods_categories (event_id, name, sort_order)
        values (new.event_id, v_name, coalesce((select max(sort_order) + 1 from public.goods_categories where event_id = new.event_id), 0))
        returning id into v_id;
      end if;
      new.category_id := v_id;
      new.category := v_name;
    end if;
  elsif tg_op = 'INSERT' or new.category_id is distinct from old.category_id then
    if new.category_id is null then
      new.category := null;
    else
      select c.name into v_name from public.goods_categories c where c.id = new.category_id and c.event_id = new.event_id;
      if v_name is null then
        raise exception 'category not found in this event' using errcode = '23503';
      end if;
      new.category := v_name;
    end if;
  end if;
  return new;
end;
$$;
create trigger goods_sync_category before insert or update on public.goods
  for each row execute function public.goods_sync_category();

-- カテゴリ名を変えたら、グッズの写し（category 文字列）も変える
create or replace function public.goods_category_renamed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.name is distinct from old.name then
    update public.goods set category = new.name where category_id = new.id and category is distinct from new.name;
  end if;
  return null;
end;
$$;
create trigger goods_categories_renamed after update on public.goods_categories
  for each row execute function public.goods_category_renamed();

-- ownerships: status は quantity から決める（旧アプリの status だけの書き込みも互換）。
--   ランダム商品の行は絵柄の合計なので、直接は書かせない（合計の再計算のときだけフラグ付きで書く）
--   名前は ownerships_acquired_at より先に動くように付ける（トリガーは名前順）
create or replace function public.goods_ownership_quantity_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is not null and new.status not in ('owned', 'unowned') then
    raise exception 'invalid status' using errcode = '23514';
  end if;
  if coalesce(current_setting('mochico.ownership_sync', true), '') <> '1'
     and exists (select 1 from public.goods g where g.id = new.goods_id and g.kind = 'random') then
    raise exception 'use ownership_variants for random goods' using errcode = '22023';
  end if;
  if tg_op = 'INSERT' then
    if new.quantity = 0 and new.status = 'owned' then
      new.quantity := 1;
    end if;
  elsif new.quantity is distinct from old.quantity then
    null; -- 数量が送られてきた（新しいアプリ）→ そのまま
  elsif new.status is distinct from old.status then
    new.quantity := case when new.status = 'owned' then greatest(old.quantity, 1) else 0 end;
  end if;
  new.status := case when new.quantity > 0 then 'owned' else 'unowned' end;
  return new;
end;
$$;
create trigger ownerships_a_quantity_status before insert or update on public.ownerships
  for each row execute function public.goods_ownership_quantity_status();

-- ownership_variants の整合: その絵柄がそのグッズのもので、削除されておらず、グッズがランダム商品
create or replace function public.goods_ownership_variant_check()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.goods_variants v join public.goods g on g.id = v.goods_id
     where v.id = new.variant_id and v.goods_id = new.goods_id and v.deleted_at is null and g.kind = 'random' and g.deleted_at is null
  ) then
    raise exception 'invalid variant' using errcode = '22023';
  end if;
  return new;
end;
$$;
create trigger ownership_variants_a_check before insert or update on public.ownership_variants
  for each row execute function public.goods_ownership_variant_check();

-- グッズ単位の合計を再計算（削除されていない絵柄の数量の合計）。ランダム商品のときだけ
create or replace function public.goods_recompute_ownership(p_user uuid, p_goods uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sum integer;
begin
  -- ユーザーの退会・グッズの削除による連鎖削除の途中では何もしない
  if not exists (select 1 from auth.users u where u.id = p_user)
     or not exists (select 1 from public.goods g where g.id = p_goods and g.kind = 'random') then
    return;
  end if;
  select coalesce(sum(ov.quantity), 0) into v_sum
    from public.ownership_variants ov
    join public.goods_variants v on v.id = ov.variant_id and v.deleted_at is null
   where ov.user_id = p_user and ov.goods_id = p_goods;
  perform set_config('mochico.ownership_sync', '1', true);
  insert into public.ownerships (user_id, goods_id, quantity, status)
  values (p_user, p_goods, least(v_sum, 9999), case when v_sum > 0 then 'owned' else 'unowned' end)
  on conflict (user_id, goods_id) do update set quantity = excluded.quantity, status = excluded.status;
  perform set_config('mochico.ownership_sync', '', true);
end;
$$;

create or replace function public.goods_ownership_variants_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.goods_recompute_ownership(coalesce(new.user_id, old.user_id), coalesce(new.goods_id, old.goods_id));
  return null;
end;
$$;
create trigger ownership_variants_sum after insert or update or delete on public.ownership_variants
  for each row execute function public.goods_ownership_variants_changed();

-- 絵柄を削除（論理削除）・戻したら、その絵柄を持っている全員の合計を再計算する
create or replace function public.goods_variant_visibility_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
begin
  if new.deleted_at is distinct from old.deleted_at then
    for r in select distinct ov.user_id from public.ownership_variants ov where ov.variant_id = new.id loop
      perform public.goods_recompute_ownership(r.user_id, new.goods_id);
    end loop;
  end if;
  return null;
end;
$$;
create trigger goods_variants_visibility after update of deleted_at on public.goods_variants
  for each row execute function public.goods_variant_visibility_changed();

-- 上限（既存の関数に追加）
--   画像: 1グッズ10枚 / 絵柄: 1グッズ100種（削除していないもの）/ カテゴリ: 1イベント50
--   画像ファイル（ギャラリー＋絵柄の画像。1件 = full + thumb）: 1イベント2000件
create or replace function public.goods_event_image_count(p_event uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select (select count(*) from public.goods_images where event_id = p_event)::int
       + (select count(*) from public.goods_variants where event_id = p_event and image_path is not null)::int;
$$;

create or replace function public.goods_enforce_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event uuid;
begin
  if tg_table_name = 'events' then
    if (select count(*) from public.events where owner_id = new.owner_id and deleted_at is null) >= 300 then
      raise exception 'event limit reached' using errcode = 'P0001', hint = 'goods_event_limit';
    end if;
  elsif tg_table_name = 'goods' then
    if (select count(*) from public.goods where event_id = new.event_id and deleted_at is null) >= 1000 then
      raise exception 'goods limit reached' using errcode = 'P0001', hint = 'goods_goods_limit';
    end if;
  elsif tg_table_name = 'goods_categories' then
    if (select count(*) from public.goods_categories where event_id = new.event_id) >= 50 then
      raise exception 'category limit reached' using errcode = 'P0001', hint = 'goods_category_limit';
    end if;
  elsif tg_table_name = 'goods_images' then
    if (select count(*) from public.goods_images where goods_id = new.goods_id) >= 10 then
      raise exception 'image limit reached' using errcode = 'P0001', hint = 'goods_image_limit';
    end if;
    select g.event_id into v_event from public.goods g where g.id = new.goods_id;
    if public.goods_event_image_count(v_event) >= 2000 then
      raise exception 'event image limit reached' using errcode = 'P0001', hint = 'goods_event_image_limit';
    end if;
  elsif tg_table_name = 'goods_variants' then
    if tg_op = 'INSERT' or (old.deleted_at is not null and new.deleted_at is null) then
      if (select count(*) from public.goods_variants where goods_id = new.goods_id and deleted_at is null) >= 100 then
        raise exception 'variant limit reached' using errcode = 'P0001', hint = 'goods_variant_limit';
      end if;
    end if;
    if new.image_path is not null and (tg_op = 'INSERT' or old.image_path is null) then
      select g.event_id into v_event from public.goods g where g.id = new.goods_id;
      if public.goods_event_image_count(v_event) >= 2000 then
        raise exception 'event image limit reached' using errcode = 'P0001', hint = 'goods_event_image_limit';
      end if;
    end if;
  end if;
  return new;
end;
$$;
create trigger goods_categories_limits before insert on public.goods_categories
  for each row execute function public.goods_enforce_limits();
create trigger goods_images_limits before insert on public.goods_images
  for each row execute function public.goods_enforce_limits();
create trigger goods_variants_limits before insert or update on public.goods_variants
  for each row execute function public.goods_enforce_limits();

-- ============================================================
-- RPC
-- ============================================================

-- イベントに作成者以外の参加者がいるか（オーナーだけが呼べる。誰が・何人かは返さない）
create or replace function public.goods_event_has_members(p_event_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.goods_is_owner(p_event_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return exists (select 1 from public.event_memberships m where m.event_id = p_event_id and m.role = 'member');
end;
$$;

-- 通常商品 ⇄ ランダム商品の変換（オーナーのみ）
--   normal → random: 最初の絵柄を作り、各人の数量をその絵柄へ移す（合計は変わらない）
--   random → normal: ほかに参加者がいないリストのときだけ。オーナーの合計数量をそのまま通常商品の数量にする
--   戻り値: { status, variant_id?, removed_paths: [...] }
create or replace function public.goods_convert_kind(p_goods_id uuid, p_kind text, p_first_variant_name text default null)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_goods record;
  v_variant uuid;
  v_paths jsonb := '[]'::jsonb;
begin
  if p_kind not in ('normal', 'random') then
    raise exception 'invalid kind' using errcode = '22023';
  end if;
  select g.id, g.event_id, g.kind into v_goods from public.goods g where g.id = p_goods_id and g.deleted_at is null for update;
  if not found or not public.goods_is_owner(v_goods.event_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if v_goods.kind = p_kind then
    return jsonb_build_object('status', 'unchanged', 'removed_paths', v_paths);
  end if;

  perform set_config('mochico.kind_convert', '1', true);
  if p_kind = 'random' then
    update public.goods set kind = 'random' where id = p_goods_id;
    insert into public.goods_variants (goods_id, event_id, name, sort_order)
    values (p_goods_id, v_goods.event_id, coalesce(nullif(btrim(p_first_variant_name), ''), '絵柄1'), 0)
    returning id into v_variant;
    perform set_config('mochico.kind_convert', '', true);
    -- 各人の数量を1つ目の絵柄へ（ownerships の合計はトリガーで同じ値に再計算される）
    insert into public.ownership_variants (user_id, goods_id, variant_id, quantity)
    select o.user_id, o.goods_id, v_variant, o.quantity
      from public.ownerships o where o.goods_id = p_goods_id and o.quantity > 0;
    return jsonb_build_object('status', 'converted', 'variant_id', v_variant, 'removed_paths', v_paths);
  end if;

  -- random → normal: 参加者の絵柄ごとの数量をまとめてしまうため、共有中のリストでは行わない
  if exists (select 1 from public.event_memberships m where m.event_id = v_goods.event_id and m.role = 'member') then
    raise exception 'cannot convert shared random goods' using errcode = 'P0001', hint = 'goods_convert_shared';
  end if;
  select coalesce(jsonb_agg(p), '[]'::jsonb) into v_paths
    from (select unnest(array[v.image_path, v.thumb_path]) as p from public.goods_variants v where v.goods_id = p_goods_id) s
   where p is not null;
  -- 先に通常商品にする（以後、合計の再計算はしない＝今の合計がそのまま通常商品の数量になる）
  update public.goods set kind = 'normal' where id = p_goods_id;
  perform set_config('mochico.kind_convert', '', true);
  delete from public.ownership_variants where goods_id = p_goods_id;
  delete from public.goods_variants where goods_id = p_goods_id;
  return jsonb_build_object('status', 'converted', 'removed_paths', v_paths);
end;
$$;

-- 画像（ギャラリー）と絵柄の保存を1トランザクションで行う（security invoker = RLS がそのまま効く）
--   p_images:   並び順どおり [{ id?, image_path?, thumb_path? }]（id ありは既存、なしは新規）。先頭が代表画像
--               一覧に無い既存の画像は削除（カタログの画像。所持情報ではない）
--   p_variants: ランダム商品のときだけ。並び順どおり [{ id?, name, image_path?, thumb_path? }]
--               一覧に無い絵柄は論理削除（参加者の数量は残り、id を含めて送ると戻る）
--               既存の絵柄で image_path キーを含む場合は画像を置き換え（null で外す）
--   戻り値: { removed_paths: [...] }（Storage からはクライアントが消す）
create or replace function public.goods_save_media(p_goods_id uuid, p_images jsonb, p_variants jsonb default null)
returns jsonb
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_goods record;
  v_removed text[] := '{}';
  v_tmp text[];
  v_keep uuid[];
  r record;
  v_old record;
begin
  select g.id, g.event_id, g.kind into v_goods from public.goods g where g.id = p_goods_id and g.deleted_at is null;
  if not found or not public.goods_is_owner(v_goods.event_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if p_images is null or jsonb_typeof(p_images) <> 'array' or jsonb_array_length(p_images) > 10 then
    raise exception 'invalid images' using errcode = '22023', hint = 'goods_image_limit';
  end if;

  -- 画像
  select coalesce(array_agg((x->>'id')::uuid), '{}') into v_keep
    from jsonb_array_elements(p_images) x where nullif(x->>'id', '') is not null;
  with d as (
    delete from public.goods_images where goods_id = p_goods_id and not (id = any(v_keep)) returning image_path, thumb_path
  )
  select coalesce(array_agg(p), '{}') into v_tmp from d, unnest(array[d.image_path, d.thumb_path]) p;
  v_removed := v_removed || v_tmp;
  for r in select x, ord from jsonb_array_elements(p_images) with ordinality t(x, ord) loop
    if nullif(r.x->>'id', '') is not null then
      update public.goods_images set sort_order = r.ord - 1 where id = (r.x->>'id')::uuid and goods_id = p_goods_id;
    else
      insert into public.goods_images (goods_id, event_id, image_path, thumb_path, sort_order)
      values (p_goods_id, v_goods.event_id, r.x->>'image_path', coalesce(r.x->>'thumb_path', r.x->>'image_path'), r.ord - 1);
    end if;
  end loop;

  -- 絵柄（ランダム商品だけ）
  if p_variants is not null then
    if v_goods.kind <> 'random' then
      raise exception 'variants are only for random goods' using errcode = '22023';
    end if;
    if jsonb_typeof(p_variants) <> 'array' or jsonb_array_length(p_variants) > 100 then
      raise exception 'invalid variants' using errcode = '22023', hint = 'goods_variant_limit';
    end if;
    select coalesce(array_agg((x->>'id')::uuid), '{}') into v_keep
      from jsonb_array_elements(p_variants) x where nullif(x->>'id', '') is not null;
    -- 一覧から外れた絵柄は論理削除（画像も数量も残す）
    update public.goods_variants set deleted_at = now()
     where goods_id = p_goods_id and deleted_at is null and not (id = any(v_keep));
    for r in select x, ord from jsonb_array_elements(p_variants) with ordinality t(x, ord) loop
      if nullif(r.x->>'id', '') is not null then
        if r.x ? 'image_path' then
          select v.image_path, v.thumb_path into v_old from public.goods_variants v where v.id = (r.x->>'id')::uuid and v.goods_id = p_goods_id;
          if v_old.image_path is distinct from (r.x->>'image_path') then
            v_removed := v_removed || array[v_old.image_path, v_old.thumb_path];
          end if;
          update public.goods_variants
             set name = btrim(r.x->>'name'), sort_order = r.ord - 1, deleted_at = null,
                 image_path = r.x->>'image_path', thumb_path = coalesce(r.x->>'thumb_path', r.x->>'image_path')
           where id = (r.x->>'id')::uuid and goods_id = p_goods_id;
        else
          update public.goods_variants set name = btrim(r.x->>'name'), sort_order = r.ord - 1, deleted_at = null
           where id = (r.x->>'id')::uuid and goods_id = p_goods_id;
        end if;
      else
        insert into public.goods_variants (goods_id, event_id, name, image_path, thumb_path, sort_order)
        values (p_goods_id, v_goods.event_id, btrim(r.x->>'name'), r.x->>'image_path', coalesce(r.x->>'thumb_path', r.x->>'image_path'), r.ord - 1);
      end if;
    end loop;
  end if;

  return jsonb_build_object('removed_paths', coalesce(to_jsonb(array_remove(v_removed, null)), '[]'::jsonb));
end;
$$;

-- My Events: 取得数 = 数量1以上のグッズ（ownerships はグッズにつき1行。ランダム商品は絵柄の合計）
create or replace function public.goods_my_events()
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

-- 共有カタログ: カテゴリ・種類・絵柄（削除していないもの）を追加。所持情報は含めない。画像パスのガードは維持
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

-- 参照されていない画像ファイル（アップロード途中で閉じた等で残ったもの）の一覧。service_role 専用
--   イベントは存在するが、カバー・グッズ・ギャラリー・絵柄（削除済みの絵柄も）のどこからも参照されていないファイル
--   作成から p_older_than 以上たったものだけ（保存中のアップロードを消さない）。イベントごと消えたフォルダは既存の孤児掃除が扱う
create or replace function public.goods_unreferenced_storage_paths(p_older_than interval default interval '1 day')
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select o.name
    from storage.objects o
   where o.bucket_id = 'goods-images'
     and o.created_at < now() - p_older_than
     and exists (select 1 from public.events e where e.id::text = split_part(o.name, '/', 1))
     and not exists (select 1 from public.events e
                      where e.cover_image_path = o.name or regexp_replace(e.cover_image_path, '-full\.', '-thumb.') = o.name)
     and not exists (select 1 from public.goods g where g.image_path = o.name or g.thumb_path = o.name)
     and not exists (select 1 from public.goods_images i where i.image_path = o.name or i.thumb_path = o.name)
     and not exists (select 1 from public.goods_variants v where v.image_path = o.name or v.thumb_path = o.name)
   limit 1000;
$$;

-- ============================================================
-- RLS と権限（goods の列権限は contract migration で絞る）
-- ============================================================
alter table public.goods_categories   enable row level security;
alter table public.goods_images       enable row level security;
alter table public.goods_variants     enable row level security;
alter table public.ownership_variants enable row level security;

revoke all on public.goods_categories, public.goods_images, public.goods_variants, public.ownership_variants from anon, authenticated;
grant select, insert, update, delete on public.goods_categories to authenticated;
grant select, insert, delete on public.goods_images to authenticated;
grant update (sort_order) on public.goods_images to authenticated;
-- 絵柄は物理削除させない（論理削除のみ）
grant select, insert on public.goods_variants to authenticated;
grant update (name, image_path, thumb_path, sort_order, deleted_at) on public.goods_variants to authenticated;
grant select, insert, update, delete on public.ownership_variants to authenticated;
grant all on public.goods_categories, public.goods_images, public.goods_variants, public.ownership_variants to service_role;

create policy goods_categories_select_member on public.goods_categories
  for select to authenticated using (public.goods_is_member(event_id));
create policy goods_categories_insert_owner on public.goods_categories
  for insert to authenticated with check (public.goods_is_owner(event_id));
create policy goods_categories_update_owner on public.goods_categories
  for update to authenticated using (public.goods_is_owner(event_id)) with check (public.goods_is_owner(event_id));
create policy goods_categories_delete_owner on public.goods_categories
  for delete to authenticated using (public.goods_is_owner(event_id));

create policy goods_images_select_member on public.goods_images
  for select to authenticated using (public.goods_is_member(event_id));
create policy goods_images_insert_owner on public.goods_images
  for insert to authenticated with check (public.goods_is_owner(event_id));
create policy goods_images_update_owner on public.goods_images
  for update to authenticated using (public.goods_is_owner(event_id)) with check (public.goods_is_owner(event_id));
create policy goods_images_delete_owner on public.goods_images
  for delete to authenticated using (public.goods_is_owner(event_id));

create policy goods_variants_select_member on public.goods_variants
  for select to authenticated using (public.goods_is_member(event_id));
create policy goods_variants_insert_owner on public.goods_variants
  for insert to authenticated with check (public.goods_is_owner(event_id));
create policy goods_variants_update_owner on public.goods_variants
  for update to authenticated using (public.goods_is_owner(event_id)) with check (public.goods_is_owner(event_id));

-- 所持（絵柄ごと）: 本人だけ。書き込みはメンバーであるイベントの有効なグッズに限る（ownerships と同じ）
create policy ownership_variants_select_own on public.ownership_variants
  for select to authenticated using (user_id = auth.uid());
create policy ownership_variants_insert_own on public.ownership_variants
  for insert to authenticated with check (user_id = auth.uid() and public.goods_can_track(goods_id));
create policy ownership_variants_update_own on public.ownership_variants
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid() and public.goods_can_track(goods_id));
create policy ownership_variants_delete_own on public.ownership_variants
  for delete to authenticated using (user_id = auth.uid());

revoke execute on function
  public.goods_check_image_paths(), public.goods_variant_requires_random(),
  public.goods_sync_cover_image(), public.goods_legacy_image_sync(), public.goods_sync_category(), public.goods_category_renamed(),
  public.goods_ownership_quantity_status(), public.goods_ownership_variant_check(),
  public.goods_recompute_ownership(uuid, uuid), public.goods_ownership_variants_changed(), public.goods_variant_visibility_changed(),
  public.goods_event_image_count(uuid), public.goods_event_has_members(uuid),
  public.goods_convert_kind(uuid, text, text), public.goods_save_media(uuid, jsonb, jsonb),
  public.goods_get_shared_catalog(text), public.goods_my_events(), public.goods_unreferenced_storage_paths(interval)
from public, anon, authenticated;
grant execute on function public.goods_event_has_members(uuid) to authenticated;
grant execute on function public.goods_convert_kind(uuid, text, text) to authenticated;
grant execute on function public.goods_save_media(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.goods_my_events() to authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;
grant execute on function public.goods_unreferenced_storage_paths(interval) to service_role;
