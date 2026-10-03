-- ============================================================
-- Production Preparation: Owner Account Deletion / Shared Catalog Preservation
--
-- 方針
--   * 「ユーザーアカウント」と「共有カタログの存続」を分離する。
--   * オーナー退会時:
--       - 参加者（member）がいないイベント → 削除（goods・画像も）
--       - 参加者がいるイベント → Preserved Read-Only Catalog として残す
--           owner_id = NULL（元オーナーとの関係を切る）/ 共有リンクは失効 / 既存 membership・ownership は維持
--           参加者を自動でオーナーに昇格させない（= 誰も編集できない）
--   * auth.users を直接削除しても（管理画面など）共有イベントが CASCADE で消えない（FK は SET NULL）。
--   * 最後の参加者が外れたイベントは「cleanup 対象」として印を付け、猶予期間後に削除する
--     （即時削除しない: 誤削除・競合を避ける）。
--   * RLS は緩めない。オーナー不在のイベントは既存ポリシー（owner_id = auth.uid()）により誰も編集できない。
-- ============================================================

-- ------------------------------------------------------------
-- events: owner_id を NULL 可・ON DELETE SET NULL に。状態列を追加
-- ------------------------------------------------------------
alter table public.events drop constraint if exists events_owner_id_fkey;
alter table public.events alter column owner_id drop not null;
alter table public.events
  add constraint events_owner_id_fkey foreign key (owner_id) references auth.users (id) on delete set null;

alter table public.events
  -- 作成者が退会し、参加者のために保存されている（読み取り専用）
  add column if not exists preserved_at timestamptz,
  -- オーナー不在かつ参加者0人になった時刻（cleanup の対象。猶予期間後に削除）
  add column if not exists orphaned_at timestamptz;

-- オーナーが居ない行は必ず preserved として識別できること
alter table public.events
  add constraint events_owner_or_preserved check (owner_id is not null or preserved_at is not null);

create index if not exists events_orphaned_idx on public.events (orphaned_at) where orphaned_at is not null;

-- ------------------------------------------------------------
-- 変更不可列の保護を更新
--   owner_id は「NULL にする」（退会による切り離し）だけを許す。
--   一度 NULL になったら誰にも付け替えられない（乗っ取り・自動昇格の防止）。
-- ------------------------------------------------------------
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
      -- 切り離し（→ NULL）は許可。保存状態にする
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

-- 退会などでオーナーが切り離されたら、そのイベントの共有リンクをすべて失効させる
-- （管理画面から auth.users を直接削除した場合も FK の SET NULL 経由でここを通る）
create or replace function public.goods_on_owner_detached()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.owner_id is not null and new.owner_id is null then
    update public.share_links set status = 'revoked'
     where event_id = new.id and status = 'active';
    -- 画像メタデータに残る元オーナーのユーザーIDを消す（参加者が Storage 経由で読めるため）
    update storage.objects set owner = null, owner_id = null
     where bucket_id = 'goods-images' and name like new.id::text || '/%';
    -- 参加者が1人もいなければ、すぐに cleanup 対象として印を付ける
    if not exists (select 1 from public.event_memberships m where m.event_id = new.id and m.role = 'member') then
      update public.events set orphaned_at = now() where id = new.id and orphaned_at is null;
    end if;
  end if;
  return null;
end;
$$;

create trigger events_owner_detached
  after update of owner_id on public.events
  for each row execute function public.goods_on_owner_detached();

-- 最後の参加者が外れたら cleanup 対象として印を付ける（オーナー不在のイベントのみ）
create or replace function public.goods_on_membership_removed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'member'
     and exists (select 1 from public.events e where e.id = old.event_id and e.owner_id is null and e.orphaned_at is null)
     and not exists (select 1 from public.event_memberships m where m.event_id = old.event_id and m.role = 'member') then
    update public.events set orphaned_at = now() where id = old.event_id and orphaned_at is null;
  end if;
  return null;
end;
$$;

create trigger event_memberships_removed
  after delete on public.event_memberships
  for each row execute function public.goods_on_membership_removed();

-- ------------------------------------------------------------
-- 共有トークン判定: オーナー不在（保存済み）のイベントは新規閲覧・参加不可
-- ------------------------------------------------------------
create or replace function public.goods_resolve_share(p_token text, out o_status text, out o_event_id uuid)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_link public.share_links%rowtype;
  v_event record;
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
  select deleted_at, owner_id into v_event from public.events where id = v_link.event_id;
  if not found or v_event.deleted_at is not null or v_event.owner_id is null then
    o_status := 'unavailable';
    return;
  end if;
  o_status := 'ok';
  o_event_id := v_link.event_id;
end;
$$;

-- 参加: 共有リンク行を FOR SHARE でロックしてから membership を作る。
--   退会処理（リンク失効 → 参加者数の確認）と同時に走っても、
--   「失効後に新規参加が紛れ込む」「参加者がいるのに削除される」が起きないようにする。
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
  -- ロック順序は退会処理（goods_prepare_account_deletion）と同じ「イベント → 共有リンク」にそろえる（デッドロック防止）
  perform 1 from public.events e
   where e.id = r.o_event_id and e.owner_id is not null and e.deleted_at is null
   for share;
  if not found then
    return jsonb_build_object('status', 'unavailable');
  end if;
  perform 1 from public.share_links s
   where s.token = p_token and s.status = 'active'
   for share;
  if not found then
    return jsonb_build_object('status', 'revoked');
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
-- 退会の準備（service_role 専用。サーバーの退会処理が auth ユーザー削除の前に呼ぶ）
--   1. 本人のイベントをロック → 共有リンクを先に失効（以後の新規参加を止める）
--   2. 参加者0人 → 削除（goods / share_links / membership / ownership は CASCADE）
--      参加者あり → owner membership を外し owner_id = NULL（preserved。トリガーが画像の所有者情報も消す）
--   3. 本人の他イベントでの membership・ownership は、この後の auth ユーザー削除で CASCADE 削除
--   戻り値: { deleted_event_ids: [...], preserved_event_ids: [...] }
--     deleted_event_ids の画像はサーバーが Storage API で削除する（SQL から Storage 実体は消せない）
-- ------------------------------------------------------------
create or replace function public.goods_prepare_account_deletion(p_user uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_event record;
  v_deleted uuid[] := '{}';
  v_preserved uuid[] := '{}';
begin
  if p_user is null then
    raise exception 'user required' using errcode = '22023';
  end if;

  -- 対象イベントを固定（同時の参加・編集と直列化）
  perform 1 from public.events where owner_id = p_user for update;

  -- 新規参加を止める（参加処理は share_links を FOR SHARE するので、ここで直列化される）
  update public.share_links s set status = 'revoked'
    from public.events e
   where s.event_id = e.id and e.owner_id = p_user and s.status = 'active';

  for v_event in select id from public.events where owner_id = p_user loop
    if exists (select 1 from public.event_memberships m where m.event_id = v_event.id and m.role = 'member') then
      delete from public.event_memberships where event_id = v_event.id and user_id = p_user;
      update public.events set owner_id = null where id = v_event.id; -- トリガーがリンク失効・画像の所有者情報消去を行う
      v_preserved := v_preserved || v_event.id;
    else
      delete from public.events where id = v_event.id;
      v_deleted := v_deleted || v_event.id;
    end if;
  end loop;

  return jsonb_build_object('deleted_event_ids', to_jsonb(v_deleted), 'preserved_event_ids', to_jsonb(v_preserved));
end;
$$;

-- ------------------------------------------------------------
-- cleanup（service_role 専用。定期実行を想定）
--   オーナー不在・参加者0人・印を付けてから p_grace 経過したイベントだけを削除する。
--   削除直前に「まだ参加者0人か」を行ロック付きで再確認する（競合・誤削除の防止）。
--   戻り値: 削除したイベントID（サーバーが Storage の画像を削除する）
-- ------------------------------------------------------------
create or replace function public.goods_cleanup_orphaned_events(p_grace interval default interval '7 days')
returns uuid[]
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_ids uuid[];
begin
  with candidates as (
    select e.id
      from public.events e
     where e.owner_id is null
       and e.orphaned_at is not null
       and e.orphaned_at <= now() - p_grace
       and not exists (select 1 from public.event_memberships m where m.event_id = e.id)
     for update of e skip locked
  ), removed as (
    delete from public.events e using candidates c where e.id = c.id
    returning e.id
  )
  select coalesce(array_agg(id), '{}') into v_ids from removed;
  return v_ids;
end;
$$;

-- Storage に残っているが DB にイベントが無いフォルダ（取りこぼし）の検出
create or replace function public.goods_orphan_storage_event_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select distinct public.goods_path_event_id(o.name)
    from storage.objects o
   where o.bucket_id = 'goods-images'
     and public.goods_path_event_id(o.name) is not null
     and not exists (select 1 from public.events e where e.id = public.goods_path_event_id(o.name));
$$;

-- ------------------------------------------------------------
-- My Events: 保存済み（作成者退会）を識別できるように
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
       join public.ownerships o on o.goods_id = g.id and o.user_id = auth.uid() and o.status = 'owned'
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

-- ------------------------------------------------------------
-- 権限
-- ------------------------------------------------------------
revoke execute on function
  public.goods_prepare_account_deletion(uuid), public.goods_cleanup_orphaned_events(interval),
  public.goods_orphan_storage_event_ids(), public.goods_on_owner_detached(), public.goods_on_membership_removed(),
  public.goods_resolve_share(text), public.goods_join_via_share(text), public.goods_my_events()
from public, anon, authenticated;

grant execute on function public.goods_prepare_account_deletion(uuid) to service_role;
grant execute on function public.goods_cleanup_orphaned_events(interval) to service_role;
grant execute on function public.goods_orphan_storage_event_ids() to service_role;
grant execute on function public.goods_join_via_share(text) to authenticated;
grant execute on function public.goods_my_events() to authenticated;
