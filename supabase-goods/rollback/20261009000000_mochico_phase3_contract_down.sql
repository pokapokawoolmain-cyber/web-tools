-- ROLLBACK for 20261009000000_mochico_phase3_contract.sql（goods の列権限を元に戻すだけ。データの変更は無い）
begin;
revoke insert, update on public.goods from authenticated;
grant insert, update on public.goods to authenticated;
delete from supabase_migrations.schema_migrations where version = '20261009000000';
commit;
