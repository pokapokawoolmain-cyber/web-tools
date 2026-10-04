-- ============================================================
-- オタクグッズ管理（/goods） 初期スキーマ
--
-- 大原則:
--   * 個人の所持状態は ownerships にだけ保存する。events / goods には持たない。
--   * anon にはテーブル権限を一切与えない。匿名共有（Phase 2）は
--     トークンを検証する security definer 関数だけを入口にする。
--   * events / goods は soft delete（deleted_at）。物理 DELETE ポリシーは作らない。
--     共有先ユーザーの参照を突然壊さないため。
--   * using (true) / with check (true) のポリシーは作らない。
-- ============================================================

-- ------------------------------------------------------------
-- 共通: updated_at 自動更新
-- ------------------------------------------------------------
create or replace function public.goods_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 40),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.goods_set_updated_at();

-- 新規ユーザー作成時にプロフィール行を作る。
-- 表示名は Google の氏名があれば使い、無ければ空（メールアドレスは表示名に流用しない）。
create or replace function public.goods_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(nullif(trim(coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name', '')), ''), 40);
begin
  insert into public.profiles (id, display_name) values (new.id, v_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger goods_on_auth_user_created
  after insert on auth.users
  for each row execute function public.goods_handle_new_user();

-- ------------------------------------------------------------
-- events
-- ------------------------------------------------------------
create table public.events (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title            text not null check (char_length(title) between 1 and 100),
  description      text check (description is null or char_length(description) <= 2000),
  start_date       date,
  end_date         date,
  cover_image_path text check (cover_image_path is null or char_length(cover_image_path) <= 300),
  -- private: メンバーのみ / link: 共有リンク経由で閲覧可（Phase 2）
  visibility       text not null default 'private' check (visibility in ('private', 'link')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz,
  constraint events_date_order check (end_date is null or start_date is null or end_date >= start_date)
);

create index events_owner_idx on public.events (owner_id) where deleted_at is null;

create trigger events_updated_at before update on public.events
  for each row execute function public.goods_set_updated_at();

-- ------------------------------------------------------------
-- goods
-- ------------------------------------------------------------
create table public.goods (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 100),
  -- 円。未定・非公開の商品もあるため null を許す。
  price       integer check (price is null or price between 0 and 10000000),
  description text check (description is null or char_length(description) <= 1000),
  -- 詳細表示用（長辺 ~1600px）と一覧用サムネ（~480px）。
  -- Storage の画像変換は有料機能のため、アップロード時にクライアントで2枚作る。
  image_path  text check (image_path is null or char_length(image_path) <= 300),
  thumb_path  text check (thumb_path is null or char_length(thumb_path) <= 300),
  category    text check (category is null or char_length(category) between 1 and 30),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index goods_event_idx on public.goods (event_id, sort_order) where deleted_at is null;

create trigger goods_updated_at before update on public.goods
  for each row execute function public.goods_set_updated_at();

-- ------------------------------------------------------------
-- event_memberships
--   オーナーも role='owner' の行を持つ。閲覧権限の判定を「メンバーか」に一本化する。
-- ------------------------------------------------------------
create table public.event_memberships (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  event_id  uuid not null references public.events (id) on delete cascade,
  role      text not null check (role in ('owner', 'viewer')),
  joined_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create index event_memberships_event_idx on public.event_memberships (event_id);

-- ------------------------------------------------------------
-- ownerships（個人の所持状態の唯一の置き場）
--   status は text + CHECK。将来 wanted / reserved を足すときは CHECK の差し替えだけで済む。
-- ------------------------------------------------------------
create table public.ownerships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  goods_id    uuid not null references public.goods (id) on delete cascade,
  status      text not null check (status in ('unowned', 'owned')),
  acquired_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, goods_id)
);

create index ownerships_goods_idx on public.ownerships (goods_id);

create trigger ownerships_updated_at before update on public.ownerships
  for each row execute function public.goods_set_updated_at();

-- acquired_at はサーバー時刻で管理する（クライアントの時計を信用しない）。
create or replace function public.goods_ownership_acquired_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'owned' then
    if tg_op = 'INSERT' or old.status is distinct from 'owned' then
      new.acquired_at := now();
    else
      new.acquired_at := old.acquired_at;
    end if;
  else
    new.acquired_at := null;
  end if;
  return new;
end;
$$;

create trigger ownerships_acquired_at before insert or update on public.ownerships
  for each row execute function public.goods_ownership_acquired_at();

-- ------------------------------------------------------------
-- share_links（Phase 2 で使用。構造だけ先に用意する）
--   expired は expires_at < now() で判定し、status には書き込まない。
-- ------------------------------------------------------------
create table public.share_links (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  -- 32バイトの暗号学的乱数を base64url 化（43文字）。連番・event UUID は使わない。
  token      text not null unique default rtrim(translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/', '-_'), '='),
  status     text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  constraint share_links_token_len check (char_length(token) >= 43)
);

create index share_links_event_idx on public.share_links (event_id);

-- ------------------------------------------------------------
-- 変更不可列の保護（所有者・所属の付け替えによる権限奪取を防ぐ）
-- ------------------------------------------------------------
create or replace function public.goods_protect_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'events' then
    if new.owner_id is distinct from old.owner_id then
      raise exception 'owner_id cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'goods' then
    if new.event_id is distinct from old.event_id then
      raise exception 'event_id cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'ownerships' then
    if new.user_id is distinct from old.user_id or new.goods_id is distinct from old.goods_id then
      raise exception 'ownership keys cannot be changed' using errcode = '42501';
    end if;
  elsif tg_table_name = 'share_links' then
    if new.event_id is distinct from old.event_id or new.token is distinct from old.token then
      raise exception 'share link keys cannot be changed' using errcode = '42501';
    end if;
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'created_at cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger events_protect before update on public.events
  for each row execute function public.goods_protect_columns();
create trigger goods_protect before update on public.goods
  for each row execute function public.goods_protect_columns();
create trigger ownerships_protect before update on public.ownerships
  for each row execute function public.goods_protect_columns();
create trigger share_links_protect before update on public.share_links
  for each row execute function public.goods_protect_columns();

-- ------------------------------------------------------------
-- 権限判定ヘルパー（security definer: RLS の再帰を避ける。search_path 固定）
-- ------------------------------------------------------------
create or replace function public.goods_is_member(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.event_memberships m
    where m.event_id = p_event_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.goods_is_owner(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.events e
    where e.id = p_event_id and e.owner_id = auth.uid() and e.deleted_at is null
  );
$$;

-- 所持状態を記録してよいグッズか（削除されておらず、自分がメンバーのイベントのもの）
create or replace function public.goods_can_track(p_goods_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.goods g
    join public.events e on e.id = g.event_id
    join public.event_memberships m on m.event_id = g.event_id and m.user_id = auth.uid()
    where g.id = p_goods_id and g.deleted_at is null and e.deleted_at is null
  );
$$;

-- Storage パス `{event_id}/...` の先頭フォルダを uuid として取り出す。不正なら null。
create or replace function public.goods_path_event_id(p_name text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_first text := split_part(p_name, '/', 1);
begin
  if v_first ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return v_first::uuid;
  end if;
  return null;
end;
$$;

-- ------------------------------------------------------------
-- イベント作成時にオーナーの membership を作る
-- ------------------------------------------------------------
create or replace function public.goods_add_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.event_memberships (user_id, event_id, role)
  values (new.owner_id, new.id, 'owner')
  on conflict (user_id, event_id) do update set role = 'owner';
  return new;
end;
$$;

create trigger events_add_owner_membership
  after insert on public.events
  for each row execute function public.goods_add_owner_membership();

-- ------------------------------------------------------------
-- 乱用防止の上限（DB側で強制。UIの制限を信用しない）
-- ------------------------------------------------------------
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
  end if;
  return new;
end;
$$;

create trigger events_limits before insert on public.events
  for each row execute function public.goods_enforce_limits();
create trigger goods_limits before insert on public.goods
  for each row execute function public.goods_enforce_limits();

-- ------------------------------------------------------------
-- 一覧用: 自分が参加しているイベントと進捗（security invoker = RLS がそのまま効く）
-- ------------------------------------------------------------
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
  updated_at timestamptz
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
       join public.ownerships o on o.goods_id = g.id and o.user_id = auth.uid() and o.status = 'owned'
      where g.event_id = e.id and g.deleted_at is null),
    e.updated_at
  from public.event_memberships m
  join public.events e on e.id = m.event_id
  where m.user_id = auth.uid() and e.deleted_at is null
  order by coalesce(e.start_date, e.created_at::date) desc, e.created_at desc;
$$;

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.events            enable row level security;
alter table public.goods             enable row level security;
alter table public.event_memberships enable row level security;
alter table public.ownerships        enable row level security;
alter table public.share_links       enable row level security;

-- anon にはテーブル権限を一切与えない（RLS 以前に権限で拒否する二重防御）
revoke all on public.profiles, public.events, public.goods, public.event_memberships,
              public.ownerships, public.share_links from anon;

-- authenticated も「必要な操作だけ」に絞る。DELETE は ownerships / event_memberships のみ。
revoke all on public.profiles, public.events, public.goods, public.event_memberships,
              public.ownerships, public.share_links from authenticated;
grant select, update                 on public.profiles          to authenticated;
grant select, insert, update         on public.events            to authenticated;
grant select, insert, update         on public.goods             to authenticated;
grant select, delete                 on public.event_memberships to authenticated;
grant select, insert, update, delete on public.ownerships        to authenticated;
grant select, insert, update         on public.share_links       to authenticated;
-- service_role はサーバー専用（Phase 2 の共有参加RPC・運用作業）。ブラウザには絶対に渡さない。
grant all on public.profiles, public.events, public.goods, public.event_memberships,
             public.ownerships, public.share_links to service_role;

-- 関数の実行権限: anon / public から剥奪
revoke execute on function
  public.goods_is_member(uuid), public.goods_is_owner(uuid), public.goods_can_track(uuid),
  public.goods_my_events(), public.goods_path_event_id(text),
  public.goods_handle_new_user(), public.goods_add_owner_membership(),
  public.goods_enforce_limits(), public.goods_protect_columns(),
  public.goods_ownership_acquired_at(), public.goods_set_updated_at()
from public, anon;
grant execute on function
  public.goods_is_member(uuid), public.goods_is_owner(uuid), public.goods_can_track(uuid),
  public.goods_my_events(), public.goods_path_event_id(text)
to authenticated;

-- profiles: 本人のみ
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- events
--   select に owner_id を含めるのは、INSERT ... RETURNING の時点では
--   owner membership（AFTER トリガー）がまだ見えないため。
create policy events_select_member on public.events
  for select to authenticated
  using (owner_id = auth.uid() or public.goods_is_member(id));
create policy events_insert_self on public.events
  for insert to authenticated
  with check (owner_id = auth.uid());
create policy events_update_owner on public.events
  for update to authenticated
  using (owner_id = auth.uid() and deleted_at is null)
  with check (owner_id = auth.uid());

-- goods
create policy goods_select_member on public.goods
  for select to authenticated
  using (public.goods_is_member(event_id));
create policy goods_insert_owner on public.goods
  for insert to authenticated
  with check (public.goods_is_owner(event_id));
create policy goods_update_owner on public.goods
  for update to authenticated
  using (public.goods_is_owner(event_id))
  with check (public.goods_is_owner(event_id));

-- event_memberships: 自分の行のみ。INSERT はトリガー / Phase 2 の RPC のみ。
create policy memberships_select_own on public.event_memberships
  for select to authenticated using (user_id = auth.uid());
create policy memberships_delete_own_viewer on public.event_memberships
  for delete to authenticated using (user_id = auth.uid() and role <> 'owner');

-- ownerships: 本人のみ。書き込みはメンバーであるイベントの有効なグッズに限る。
create policy ownerships_select_own on public.ownerships
  for select to authenticated using (user_id = auth.uid());
create policy ownerships_insert_own on public.ownerships
  for insert to authenticated
  with check (user_id = auth.uid() and public.goods_can_track(goods_id));
create policy ownerships_update_own on public.ownerships
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.goods_can_track(goods_id));
create policy ownerships_delete_own on public.ownerships
  for delete to authenticated using (user_id = auth.uid());

-- share_links: イベントオーナーのみ。削除はさせず revoke で失効させる。
create policy share_links_select_owner on public.share_links
  for select to authenticated using (public.goods_is_owner(event_id));
create policy share_links_insert_owner on public.share_links
  for insert to authenticated with check (public.goods_is_owner(event_id));
create policy share_links_update_owner on public.share_links
  for update to authenticated
  using (public.goods_is_owner(event_id))
  with check (public.goods_is_owner(event_id));

-- ============================================================
-- Storage
--   非公開バケット。パス規約: {event_id}/{goods_id|cover}/{uuid}-{full|thumb}.webp
--   サイズ・形式はバケット側で強制する（クライアントの前処理を信用しない）。
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('goods-images', 'goods-images', false, 2097152, array['image/webp', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy goods_images_select_member on storage.objects
  for select to authenticated
  using (bucket_id = 'goods-images' and public.goods_is_member(public.goods_path_event_id(name)));
create policy goods_images_insert_owner on storage.objects
  for insert to authenticated
  with check (bucket_id = 'goods-images' and public.goods_is_owner(public.goods_path_event_id(name)));
create policy goods_images_update_owner on storage.objects
  for update to authenticated
  using (bucket_id = 'goods-images' and public.goods_is_owner(public.goods_path_event_id(name)))
  with check (bucket_id = 'goods-images' and public.goods_is_owner(public.goods_path_event_id(name)));
create policy goods_images_delete_owner on storage.objects
  for delete to authenticated
  using (bucket_id = 'goods-images' and public.goods_is_owner(public.goods_path_event_id(name)));
