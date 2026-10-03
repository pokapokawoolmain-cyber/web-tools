-- ============================================================
-- Phase 2: Shared Catalog / Personal Collection
--
--   1 Event Catalog + 1 Goods Catalog + N User Collections
--   * 共有で event / goods / 画像はコピーしない。参加は event_memberships の1行だけ。
--   * 所持状態は ownerships（user_id 単位）のまま。参加時に ownership を事前生成しない
--     （行が無い = 未取得）。
--   * 匿名の共有カタログ取得は service_role 専用の関数のみ（ブラウザからは呼べない）。
--   * 参加は authenticated 専用の関数のみ（auth.uid() 本人の membership しか作れない）。
-- ============================================================

-- ------------------------------------------------------------
-- event_memberships.role: viewer → member（Product Lead 指定の名称）
-- ------------------------------------------------------------
alter table public.event_memberships drop constraint if exists event_memberships_role_check;
update public.event_memberships set role = 'member' where role = 'viewer';
alter table public.event_memberships
  add constraint event_memberships_role_check check (role in ('owner', 'member'));

-- ------------------------------------------------------------
-- share_links
--   created_by: 誰が発行したかの監査用（オーナー以外が発行することは RLS で不可）
--   1イベントにつき有効なリンクは1本まで（再発行時は古いものを失効させる）
-- ------------------------------------------------------------
alter table public.share_links
  add column if not exists created_by uuid default auth.uid() references auth.users (id) on delete set null;

create unique index if not exists share_links_one_active_per_event
  on public.share_links (event_id) where status = 'active';

-- 失効は一方通行（revoked → active に戻せない）。失効時刻はサーバーで記録。
-- 有効期限は発行時に決め、後から延長・変更しない（延長したい場合は再発行）。
create or replace function public.goods_share_link_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'revoked' and new.status <> 'revoked' then
    raise exception 'revoked share link cannot be reactivated' using errcode = '42501';
  end if;
  if new.expires_at is distinct from old.expires_at then
    raise exception 'expires_at cannot be changed' using errcode = '42501';
  end if;
  -- 発行者のアカウント削除時（FK の ON DELETE SET NULL）だけは NULL への変更を許す
  if new.created_by is distinct from old.created_by and new.created_by is not null then
    raise exception 'created_by cannot be changed' using errcode = '42501';
  end if;
  if new.status = 'revoked' and old.status <> 'revoked' then
    new.revoked_at := now();
  elsif new.revoked_at is distinct from old.revoked_at then
    raise exception 'revoked_at is managed by the server' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger share_links_guard before update on public.share_links
  for each row execute function public.goods_share_link_guard();

-- 共有リンクの発行（security invoker = RLS がそのまま効く。オーナー以外は失敗する）
--   既存の有効リンクを失効させてから新しいリンクを作る（同一トランザクション）。
create or replace function public.goods_create_share_link(p_event_id uuid, p_expires_days integer default null)
returns table (token text, status text, expires_at timestamptz, created_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
#variable_conflict use_column
declare
  v public.share_links%rowtype;
begin
  if p_expires_days is not null and p_expires_days not in (7, 30) then
    raise exception 'invalid expiry' using errcode = '22023';
  end if;
  if not public.goods_is_owner(p_event_id) then
    raise exception 'not owner' using errcode = '42501';
  end if;
  update public.share_links set status = 'revoked'
   where event_id = p_event_id and status = 'active';
  insert into public.share_links (event_id, expires_at)
  values (p_event_id, case when p_expires_days is null then null else now() + make_interval(days => p_expires_days) end)
  returning * into v;
  token := v.token;
  status := v.status;
  expires_at := v.expires_at;
  created_at := v.created_at;
  return next;
end;
$$;

-- ------------------------------------------------------------
-- 共有トークンの判定（内部用）
--   戻り値: 'ok' | 'invalid' | 'revoked' | 'expired' | 'unavailable'
-- ------------------------------------------------------------
create or replace function public.goods_resolve_share(p_token text, out o_status text, out o_event_id uuid)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_link public.share_links%rowtype;
  v_deleted timestamptz;
begin
  o_event_id := null;
  if p_token is null or p_token !~ '^[A-Za-z0-9_-]{43}$' then
    o_status := 'invalid';
    return;
  end if;
  select * into v_link from public.share_links where token = p_token;
  if not found then
    o_status := 'invalid';
    return;
  end if;
  if v_link.status <> 'active' or v_link.revoked_at is not null then
    o_status := 'revoked';
    return;
  end if;
  if v_link.expires_at is not null and v_link.expires_at <= now() then
    o_status := 'expired';
    return;
  end if;
  select deleted_at into v_deleted from public.events where id = v_link.event_id;
  if not found or v_deleted is not null then
    o_status := 'unavailable';
    return;
  end if;
  o_status := 'ok';
  o_event_id := v_link.event_id;
end;
$$;

-- ------------------------------------------------------------
-- 匿名共有カタログ（service_role 専用。Next.js サーバーだけが呼ぶ）
--   返すのはカタログ情報だけ。owner_id・メール・membership・ownership・内部IDは返さない。
--   画像パスはサーバー側で署名URLに変換するためだけに返す（ブラウザへは署名URLのみ渡す）。
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

  select coalesce(jsonb_agg(jsonb_build_object(
           'key', g.sort_order::text || '-' || left(md5(g.id::text), 8),
           'name', g.name,
           'price', g.price,
           'description', g.description,
           'category', g.category,
           'image_path', g.image_path,
           'thumb_path', g.thumb_path
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods
    from public.goods g
   where g.event_id = r.o_event_id and g.deleted_at is null;

  return jsonb_build_object('status', 'ok', 'event', v_event, 'goods', v_goods);
end;
$$;

-- ------------------------------------------------------------
-- 「自分の管理に追加」（authenticated 専用）
--   * auth.uid() 本人の membership だけを作る（他人の分は作れない）
--   * UNIQUE(user_id, event_id) + ON CONFLICT DO NOTHING で二重送信でも1行
--   * event / goods / ownership はコピー・生成しない
--   戻り値: { status: 'joined' | 'already' | 'owner' | 'invalid' | 'revoked' | 'expired' | 'unavailable', event_id? }
-- ------------------------------------------------------------
create or replace function public.goods_join_via_share(p_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  r record;
  v_uid uuid := auth.uid();
  v_role text;
  v_inserted int;
begin
  if v_uid is null then
    raise exception 'login required' using errcode = '42501';
  end if;
  select * into r from public.goods_resolve_share(p_token);
  if r.o_status <> 'ok' then
    return jsonb_build_object('status', r.o_status);
  end if;

  select m.role into v_role from public.event_memberships m
   where m.user_id = v_uid and m.event_id = r.o_event_id;
  if v_role = 'owner' then
    return jsonb_build_object('status', 'owner', 'event_id', r.o_event_id);
  end if;

  insert into public.event_memberships (user_id, event_id, role)
  values (v_uid, r.o_event_id, 'member')
  on conflict (user_id, event_id) do nothing;
  get diagnostics v_inserted = row_count;

  return jsonb_build_object('status', case when v_inserted = 1 then 'joined' else 'already' end,
                            'event_id', r.o_event_id);
end;
$$;

-- ------------------------------------------------------------
-- My Events: 作成者が削除したイベントも、参加者（member）には「削除済み」として残す
--   （突然消すより状態を明示する）。オーナー自身が削除したものは表示しない。
-- ------------------------------------------------------------
drop function if exists public.goods_my_events();
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
  deleted boolean
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
    e.updated_at,
    e.deleted_at is not null
  from public.event_memberships m
  join public.events e on e.id = m.event_id
  where m.user_id = auth.uid()
    and (e.deleted_at is null or m.role = 'member')
  order by (e.deleted_at is not null), coalesce(e.start_date, e.created_at::date) desc, e.created_at desc;
$$;

-- ------------------------------------------------------------
-- 権限
-- ------------------------------------------------------------
revoke execute on function
  public.goods_resolve_share(text), public.goods_get_shared_catalog(text),
  public.goods_join_via_share(text), public.goods_create_share_link(uuid, integer),
  public.goods_my_events(), public.goods_share_link_guard()
from public, anon, authenticated;

grant execute on function public.goods_get_shared_catalog(text) to service_role;
grant execute on function public.goods_join_via_share(text) to authenticated;
grant execute on function public.goods_create_share_link(uuid, integer) to authenticated;
grant execute on function public.goods_my_events() to authenticated;
-- goods_resolve_share は上記関数の内部からのみ使う（直接実行権限は誰にも与えない）

-- ------------------------------------------------------------
-- 共有ページ表示用: ログイン中ユーザーとこの共有イベントの関係（authenticated 専用・副作用なし）
--   { status, relation: 'owner' | 'member' | 'none', event_id?（owner/member のときだけ） }
-- ------------------------------------------------------------
create or replace function public.goods_share_relation(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  r record;
  v_role text;
begin
  if auth.uid() is null then
    raise exception 'login required' using errcode = '42501';
  end if;
  select * into r from public.goods_resolve_share(p_token);
  if r.o_status <> 'ok' then
    return jsonb_build_object('status', r.o_status);
  end if;
  select m.role into v_role from public.event_memberships m
   where m.user_id = auth.uid() and m.event_id = r.o_event_id;
  if v_role is null then
    return jsonb_build_object('status', 'ok', 'relation', 'none');
  end if;
  return jsonb_build_object('status', 'ok', 'relation', v_role, 'event_id', r.o_event_id);
end;
$$;

revoke execute on function public.goods_share_relation(text) from public, anon, authenticated;
grant execute on function public.goods_share_relation(text) to authenticated;
