-- ROLLBACK for 20261007000000_mochico_image_path_guard.sql（データの変更は無い。検査をやめて共有カタログを元に戻すだけ）
-- 注意: Phase 3（20261008000000）が適用済みなら、先に Phase 3 をロールバックすること
begin;
drop trigger if exists events_check_image_paths on public.events;
drop trigger if exists goods_check_image_paths on public.goods;
drop function if exists public.goods_check_image_paths();
drop function if exists public.goods_path_in(text, text);

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
revoke execute on function public.goods_get_shared_catalog(text) from public, anon, authenticated;
grant execute on function public.goods_get_shared_catalog(text) to service_role;
delete from supabase_migrations.schema_migrations where version = '20261007000000';
commit;
