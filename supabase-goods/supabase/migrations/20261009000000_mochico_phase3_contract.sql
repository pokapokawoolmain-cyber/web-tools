-- ============================================================
-- Mochico Phase 3（contract）: 新しいアプリのデプロイ完了「後」に適用する
--   goods の画像列（代表画像の写し）と種類（変換 RPC だけで変える）を、クライアントから直接書けないようにする。
--   旧アプリはこの時点で使われていない前提（旧アプリは goods.image_path を直接書くため、これ以降は画像の保存に失敗する）
-- ロールバック: supabase-goods/rollback/20261009000000_mochico_phase3_contract_down.sql
-- ============================================================
revoke insert, update on public.goods from authenticated;
grant insert (id, event_id, name, price, description, category, category_id, kind, sort_order) on public.goods to authenticated;
grant update (name, price, description, category, category_id, sort_order, deleted_at) on public.goods to authenticated;

-- 予約・販売スケジュール（20261011）の列も書けるようにする。テーブル単位の revoke は列単位の許可も外すため、
-- ここで付け直す。20261011 より前に適用された場合は列がまだ無いので何もしない（20261011 側でも列単位で許可する）
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'goods' and column_name = 'schedule_override') then
    grant insert (schedule_override, reserve_start_date, reserve_start_time, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time) on public.goods to authenticated;
    grant update (schedule_override, reserve_start_date, reserve_start_time, reserve_end_date, reserve_end_time, sale_start_date, sale_start_time) on public.goods to authenticated;
  end if;
end;
$$;
