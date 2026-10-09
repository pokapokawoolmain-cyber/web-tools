-- ============================================================
-- Mochico Phase 3（contract）: 新しいアプリのデプロイ完了「後」に適用する
--   goods の画像列（代表画像の写し）と種類（変換 RPC だけで変える）を、クライアントから直接書けないようにする。
--   旧アプリはこの時点で使われていない前提（旧アプリは goods.image_path を直接書くため、これ以降は画像の保存に失敗する）
-- ロールバック: supabase-goods/rollback/20261009000000_mochico_phase3_contract_down.sql
-- ============================================================
revoke insert, update on public.goods from authenticated;
grant insert (id, event_id, name, price, description, category, category_id, kind, sort_order) on public.goods to authenticated;
grant update (name, price, description, category, category_id, sort_order, deleted_at) on public.goods to authenticated;
