-- ============================================================
-- Mochico: 画像パスのガード（セキュリティ修正。Phase 3 とは独立して先に適用できる）
--
-- 問題: events.cover_image_path / goods.image_path / thumb_path に任意のパスを保存でき、
--       共有カタログ（service_role で署名 URL を作る）経由で、他のイベントの画像を表示できた。
--       ログイン後の画面はユーザー本人の権限で署名するため Storage の RLS で拒否されるが、
--       共有ページ（未ログイン閲覧）はサーバー権限で署名するため RLS が効かない。
-- 修正:
--   1. 保存時の検査（トリガー）: カバーは `{event_id}/cover/`、グッズ画像は `{event_id}/{goods_id}/` の配下だけ。
--      `..` や想定外の文字を含むパスは拒否。変更されたときだけ検査する（既存の正当な画像は影響なし）
--   2. 共有カタログ: 規約に合わないパスは返さない（既存データに万一あっても署名しない＝多重防御）
-- 本番の既存データ（2026-10-09 時点）: カバー 3件・グッズ画像 34件すべて規約どおり（読み取り専用で確認）
-- ロールバック: supabase-goods/rollback/20261007000000_mochico_image_path_guard_down.sql
-- ============================================================

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

create trigger events_check_image_paths before insert or update on public.events
  for each row execute function public.goods_check_image_paths();
create trigger goods_check_image_paths before insert or update on public.goods
  for each row execute function public.goods_check_image_paths();

-- 共有カタログ: 規約に合わないパスは null にして返す（署名しない）
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
           'cover_path', case when public.goods_path_in(e.cover_image_path, e.id::text || '/cover/') then e.cover_image_path end
         )
    into v_event
    from public.events e where e.id = r.o_event_id;

  select coalesce(jsonb_agg(jsonb_build_object(
           'key', g.sort_order::text || '-' || left(md5(g.id::text), 8),
           'name', g.name,
           'price', g.price,
           'description', g.description,
           'category', g.category,
           'image_path', case when public.goods_path_in(g.image_path, g.event_id::text || '/' || g.id::text || '/') then g.image_path end,
           'thumb_path', case when public.goods_path_in(g.thumb_path, g.event_id::text || '/' || g.id::text || '/') then g.thumb_path end
         ) order by g.sort_order, g.created_at), '[]'::jsonb)
    into v_goods
    from public.goods g
   where g.event_id = r.o_event_id and g.deleted_at is null;

  return jsonb_build_object('status', 'ok', 'event', v_event, 'goods', v_goods);
end;
$$;

-- 実行権限: パス検査はユーザー権限・サーバー権限のどちらのトリガーからも呼ばれる
revoke execute on function public.goods_path_in(text, text), public.goods_check_image_paths() from public, anon;
grant execute on function public.goods_path_in(text, text) to authenticated, service_role;
revoke execute on function public.goods_get_shared_catalog(text) from public, anon, authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;
