-- ============================================================
-- Mochico Phase 3: カテゴリ・複数画像・ランダム商品（絵柄）・所持数量
--
-- 設計（docs/goods/MOCHICO_PHASE3_PLAN.md）
--   * カタログ（共有）: goods_categories / goods（拡張）/ goods_images / goods_variants
--       閲覧 = イベントのメンバー、変更 = イベントのオーナー（既存の goods と同じ）
--   * 所持（個人）: ownerships を拡張（quantity・variant_id）。本人だけ。新しい個人テーブルは作らない
--   * 後方互換
--       ownerships.status は quantity から自動で決まる（集計・旧クライアント用）
--       goods.image_path / thumb_path は「代表画像（goods_images の先頭）」の写し（トリガーで維持）
--       goods.category は category_id のカテゴリ名の写し（旧クライアントの文字列書き込みも受け付ける）
--   * 画像のパスは自分のイベントのフォルダ配下に限る（共有カタログは service_role で署名するため、
--     他イベントの画像を指すパスを登録させない。events.cover_image_path・goods.image_path の既存の穴も塞ぐ）
--   ロールバック: supabase-goods/rollback/20261008000000_mochico_phase3_down.sql
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

-- 既存の1枚画像を先頭（代表）として移す
insert into public.goods_images (goods_id, event_id, image_path, thumb_path, sort_order, created_at)
select g.id, g.event_id, g.image_path, coalesce(g.thumb_path, g.image_path), 0, g.created_at
  from public.goods g
 where g.image_path is not null;

-- ------------------------------------------------------------
-- 4. ランダム商品の絵柄（所持管理の対象。画像は任意で1枚）
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
  updated_at timestamptz not null default now()
);
create index goods_variants_goods_idx on public.goods_variants (goods_id, sort_order);
create trigger goods_variants_updated_at before update on public.goods_variants
  for each row execute function public.goods_set_updated_at();

-- ------------------------------------------------------------
-- 5. 所持数量（個人）。既存の owned → 1 / unowned → 0
-- ------------------------------------------------------------
alter table public.ownerships
  add column quantity integer not null default 0 check (quantity between 0 and 9999),
  add column variant_id uuid references public.goods_variants (id) on delete cascade;
update public.ownerships set quantity = case when status = 'owned' then 1 else 0 end;
alter table public.ownerships drop constraint if exists ownerships_user_id_goods_id_key;
alter table public.ownerships
  add constraint ownerships_user_goods_variant_key unique nulls not distinct (user_id, goods_id, variant_id);
create index ownerships_variant_idx on public.ownerships (variant_id) where variant_id is not null;

-- ============================================================
-- トリガー
-- ============================================================

-- 変更不可列の保護（既存の関数に新テーブルと variant_id を追加）
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
  elsif tg_table_name = 'ownerships' then
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

-- 画像パスは「自分のイベント/自分のグッズ」のフォルダ配下だけ（他イベントの画像を指させない）
create or replace function public.goods_path_in(p_path text, p_prefix text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_path is null
      or (left(p_path, char_length(p_prefix)) = p_prefix
          and position('..' in p_path) = 0
          and p_path ~ '^[0-9a-zA-Z/_.-]+$');
$$;

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
create trigger events_check_image_paths before insert or update on public.events
  for each row execute function public.goods_check_image_paths();
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
--   goods の画像列はクライアントから直接更新できない（列権限）ため security definer で書く。
--   対象はトリガー元の画像行が属するグッズだけ（その行の変更自体は RLS でオーナーに限られている）。
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
begin
  select i.image_path, i.thumb_path into v_img, v_thumb
    from public.goods_images i
   where i.goods_id = v_goods
   order by i.sort_order, i.created_at, i.id
   limit 1;
  update public.goods g
     set image_path = v_img, thumb_path = v_thumb
   where g.id = v_goods
     and (g.image_path is distinct from v_img or g.thumb_path is distinct from v_thumb);
  return null;
end;
$$;
create trigger goods_images_sync_cover after insert or update or delete on public.goods_images
  for each row execute function public.goods_sync_cover_image();

-- カテゴリの写し: category_id ⇄ category（旧クライアントの文字列書き込みも受け付ける）
create or replace function public.goods_sync_category()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_name text;
  v_id uuid;
begin
  if tg_op = 'INSERT' or new.category_id is distinct from old.category_id then
    if new.category_id is null then
      new.category := null;
    else
      select c.name into v_name from public.goods_categories c where c.id = new.category_id and c.event_id = new.event_id;
      if v_name is null then
        raise exception 'category not found in this event' using errcode = '23503';
      end if;
      new.category := v_name;
    end if;
  elsif new.category is distinct from old.category then
    -- 旧クライアント（文字列のみ）: 同名のカテゴリへ紐づけ、無ければ作る（作れるのはオーナーだけ＝RLS）
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

-- 所持: status は quantity から決める。旧クライアント（status だけ送る）も壊さない。
--   名前は ownerships_acquired_at より先に動くように付ける（トリガーは名前順）
create or replace function public.goods_ownership_quantity_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- 未定義の status は従来どおり拒否する（数量から決める前に検査）
  if new.status is not null and new.status not in ('owned', 'unowned') then
    raise exception 'invalid status' using errcode = '23514';
  end if;
  if tg_op = 'INSERT' then
    if new.quantity = 0 and new.status = 'owned' then
      new.quantity := 1;
    end if;
  elsif new.quantity is distinct from old.quantity then
    null; -- 数量が送られてきた（新しいクライアント）→ そのまま
  elsif new.status is distinct from old.status then
    new.quantity := case when new.status = 'owned' then greatest(old.quantity, 1) else 0 end;
  end if;
  new.status := case when new.quantity > 0 then 'owned' else 'unowned' end;
  return new;
end;
$$;
create trigger ownerships_a_quantity_status before insert or update on public.ownerships
  for each row execute function public.goods_ownership_quantity_status();

-- 所持の行と商品の種類の整合（通常 = variant_id なし、ランダム = そのグッズの絵柄）
create or replace function public.goods_ownership_variant_check()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_kind text;
begin
  select g.kind into v_kind from public.goods g where g.id = new.goods_id;
  if v_kind = 'random' then
    if new.variant_id is null
       or not exists (select 1 from public.goods_variants v where v.id = new.variant_id and v.goods_id = new.goods_id) then
      raise exception 'variant is required for random goods' using errcode = '22023';
    end if;
  elsif new.variant_id is not null then
    raise exception 'variant is not allowed for normal goods' using errcode = '22023';
  end if;
  return new;
end;
$$;
create trigger ownerships_b_variant_check before insert or update on public.ownerships
  for each row execute function public.goods_ownership_variant_check();

-- 上限（既存の関数に追加）
create or replace function public.goods_enforce_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
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
  elsif tg_table_name = 'goods_categories' then
    if (select count(*) from public.goods_categories where event_id = new.event_id) >= 50 then
      raise exception 'category limit reached' using errcode = 'P0001', hint = 'goods_category_limit';
    end if;
  elsif tg_table_name = 'goods_images' then
    if (select count(*) from public.goods_images where goods_id = new.goods_id) >= 10 then
      raise exception 'image limit reached' using errcode = 'P0001', hint = 'goods_image_limit';
    end if;
  elsif tg_table_name = 'goods_variants' then
    if (select count(*) from public.goods_variants where goods_id = new.goods_id) >= 100 then
      raise exception 'variant limit reached' using errcode = 'P0001', hint = 'goods_variant_limit';
    end if;
  end if;
  return new;
end;
$$;
create trigger goods_categories_limits before insert on public.goods_categories
  for each row execute function public.goods_enforce_limits();
create trigger goods_images_limits before insert on public.goods_images
  for each row execute function public.goods_enforce_limits();
create trigger goods_variants_limits before insert on public.goods_variants
  for each row execute function public.goods_enforce_limits();

-- ============================================================
-- RPC
-- ============================================================

-- 通常商品 ⇄ ランダム商品の変換（オーナーのみ）。全参加者の数量を失わないように移す。
--   normal → random: 最初の絵柄を作り、既存の数量をその絵柄へ移す
--   random → normal: 絵柄ごとの数量をユーザーごとに合算し（上限 9999）、絵柄を削除する
--   戻り値: { status, variant_id?, removed_paths: [...] }（削除した絵柄の画像。Storage からはクライアントが消す）
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

  if p_kind = 'random' then
    update public.goods set kind = 'random' where id = p_goods_id;
    insert into public.goods_variants (goods_id, event_id, name, sort_order)
    values (p_goods_id, v_goods.event_id, coalesce(nullif(btrim(p_first_variant_name), ''), '絵柄1'), 0)
    returning id into v_variant;
    -- variant_id はキー列（保護トリガー）なので、行を作り直して移す
    insert into public.ownerships (user_id, goods_id, variant_id, quantity, status)
    select o.user_id, o.goods_id, v_variant, o.quantity, o.status
      from public.ownerships o where o.goods_id = p_goods_id and o.variant_id is null;
    delete from public.ownerships where goods_id = p_goods_id and variant_id is null;
    return jsonb_build_object('status', 'converted', 'variant_id', v_variant, 'removed_paths', v_paths);
  end if;

  -- random → normal
  select coalesce(jsonb_agg(p), '[]'::jsonb) into v_paths
    from (select unnest(array[v.image_path, v.thumb_path]) as p from public.goods_variants v where v.goods_id = p_goods_id) s
   where p is not null;
  -- 先に種類を通常へ（所持行の整合チェックが「通常 = variant_id なし」を要求するため）
  update public.goods set kind = 'normal' where id = p_goods_id;
  -- 絵柄ごとの行を消し、ユーザーごとの合計を1行にまとめて入れ直す（1文で行うので途中状態が残らない）
  with del as (
    delete from public.ownerships where goods_id = p_goods_id returning user_id, quantity
  )
  insert into public.ownerships (user_id, goods_id, variant_id, quantity, status)
  select d.user_id, p_goods_id, null, least(sum(d.quantity), 9999)::int,
         case when sum(d.quantity) > 0 then 'owned' else 'unowned' end
    from del d group by d.user_id;
  delete from public.goods_variants where goods_id = p_goods_id;
  return jsonb_build_object('status', 'converted', 'removed_paths', v_paths);
end;
$$;

-- 画像（ギャラリー）と絵柄の保存を1トランザクションで行う（security invoker = RLS がそのまま効く）
--   p_images:   並び順どおりの配列 [{ id? , image_path?, thumb_path? }]（id ありは既存、なしは新規）。先頭が代表画像
--   p_variants: ランダム商品のときだけ。並び順どおり [{ id?, name, image_path?, thumb_path? }]
--               既存の絵柄で image_path キーを含む場合は画像を置き換え（null で外す）
--   一覧に無い既存の画像・絵柄は削除（絵柄の削除は全員のその絵柄の所持数も消える＝UI で確認してから呼ぶ）
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
    with d as (
      delete from public.goods_variants where goods_id = p_goods_id and not (id = any(v_keep)) returning image_path, thumb_path
    )
    select coalesce(array_agg(p), '{}') into v_tmp from d, unnest(array[d.image_path, d.thumb_path]) p;
    v_removed := v_removed || v_tmp;
    for r in select x, ord from jsonb_array_elements(p_variants) with ordinality t(x, ord) loop
      if nullif(r.x->>'id', '') is not null then
        if r.x ? 'image_path' then
          select v.image_path, v.thumb_path into v_old from public.goods_variants v where v.id = (r.x->>'id')::uuid and v.goods_id = p_goods_id;
          if v_old.image_path is distinct from (r.x->>'image_path') then
            v_removed := v_removed || array[v_old.image_path, v_old.thumb_path];
          end if;
          update public.goods_variants
             set name = btrim(r.x->>'name'), sort_order = r.ord - 1,
                 image_path = r.x->>'image_path', thumb_path = coalesce(r.x->>'thumb_path', r.x->>'image_path')
           where id = (r.x->>'id')::uuid and goods_id = p_goods_id;
        else
          update public.goods_variants set name = btrim(r.x->>'name'), sort_order = r.ord - 1
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

-- My Events: 取得数 = 「数量1以上の行があるグッズ」の数（絵柄ごとの行で重複して数えない）
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
    (select count(distinct g.id) from public.goods g
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

-- 共有カタログ: カテゴリ・種類・絵柄（名前と画像）を追加。所持情報は含めない
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
           'cover_path', e.cover_image_path
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
           'image_path', g.image_path,
           'thumb_path', g.thumb_path,
           'variants', case when g.kind = 'random' then (
              select coalesce(jsonb_agg(jsonb_build_object('name', v.name, 'thumb_path', v.thumb_path) order by v.sort_order, v.created_at), '[]'::jsonb)
                from public.goods_variants v where v.goods_id = g.id) else '[]'::jsonb end
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods
    from public.goods g
   where g.event_id = r.o_event_id and g.deleted_at is null;

  return jsonb_build_object('status', 'ok', 'event', v_event, 'categories', v_categories, 'goods', v_goods);
end;
$$;

-- ============================================================
-- RLS と権限
-- ============================================================
alter table public.goods_categories enable row level security;
alter table public.goods_images     enable row level security;
alter table public.goods_variants   enable row level security;

revoke all on public.goods_categories, public.goods_images, public.goods_variants from anon, authenticated;
grant select, insert, update, delete on public.goods_categories to authenticated;
grant select, insert, delete on public.goods_images to authenticated;
grant update (sort_order) on public.goods_images to authenticated;
grant select, insert, delete on public.goods_variants to authenticated;
grant update (name, image_path, thumb_path, sort_order) on public.goods_variants to authenticated;
grant all on public.goods_categories, public.goods_images, public.goods_variants to service_role;

-- goods: 画像列（代表画像の写し）と種類はクライアントから直接書かせない（種類の変更は goods_convert_kind）
revoke insert, update on public.goods from authenticated;
grant insert (id, event_id, name, price, description, category, category_id, kind, sort_order) on public.goods to authenticated;
grant update (name, price, description, category, category_id, sort_order, deleted_at) on public.goods to authenticated;

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
create policy goods_variants_delete_owner on public.goods_variants
  for delete to authenticated using (public.goods_is_owner(event_id));

revoke execute on function
  public.goods_check_image_paths(), public.goods_variant_requires_random(),
  public.goods_sync_cover_image(), public.goods_sync_category(), public.goods_category_renamed(),
  public.goods_ownership_quantity_status(), public.goods_ownership_variant_check(),
  public.goods_convert_kind(uuid, text, text), public.goods_save_media(uuid, jsonb, jsonb),
  public.goods_get_shared_catalog(text), public.goods_my_events()
from public, anon, authenticated;
-- goods_path_in はパス文字列を調べるだけの純粋関数。ユーザー権限で動くトリガーから呼ぶため実行権限を与える
revoke execute on function public.goods_path_in(text, text) from public, anon;
grant execute on function public.goods_path_in(text, text) to authenticated, service_role;
grant execute on function public.goods_convert_kind(uuid, text, text) to authenticated;
grant execute on function public.goods_save_media(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.goods_my_events() to authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;
