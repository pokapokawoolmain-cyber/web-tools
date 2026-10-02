-- ============================================================
-- SNS Starter Kit 予約テーブル — 適用後の確認（読み取りのみ）
-- 個人データの値は出力しない（件数・列名・可否のみ）
-- ============================================================
BEGIN READ ONLY;

SELECT 'rls' AS check, c.relrowsecurity AS enabled
FROM pg_class c WHERE c.oid = 'public.sns_starter_kit_reservations'::regclass;

SELECT 'policies' AS check, count(*) AS n
FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sns_starter_kit_reservations';

SELECT 'grants' AS check, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'sns_starter_kit_reservations'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC');

SELECT 'unique_email' AS check, indexdef
FROM pg_indexes WHERE tablename = 'sns_starter_kit_reservations' AND indexname = 'sns_starter_kit_reservations_email_key';

SELECT 'columns' AS check, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sns_starter_kit_reservations'
ORDER BY ordinal_position;

SELECT 'fk_to_other_tables' AS check, count(*) AS n
FROM information_schema.table_constraints
WHERE table_name = 'sns_starter_kit_reservations' AND constraint_type = 'FOREIGN KEY';

SELECT 'row_count' AS check, count(*) AS n FROM public.sns_starter_kit_reservations;

ROLLBACK;
