-- ============================================================
-- SNS Starter Kit 先行予約テーブル（Revision 2 / 2026-09-30）
-- ★未適用。どの Supabase プロジェクトに置くかは CEO の決定待ち。
--   yoru. のプロジェクトには絶対に適用しない（完全に別システム）。
--
-- アクセス方針:
--   - ブラウザから Supabase へ直接アクセスしない。書き込みは
--     /api/sns-starter-kit/reservations（サーバー）から service role でのみ行う。
--   - RLS を有効化し、ポリシーは 1つも作らない = anon / authenticated は全操作が拒否される。
--   - さらにテーブル権限を anon / authenticated / PUBLIC から剥がす（Supabase は public スキーマの
--     新規テーブルに既定で権限を付けるため。RLS と二重に閉じる）。
--   - service role は RLS をバイパスする（サーバー側の保存・運用者の閲覧に使う）。
--
-- 重複: email は小文字化して保存し、一意インデックスで1人1行に固定する。
--   API は 409（一意制約違反）を「登録済み」とみなし、新規登録と同じ応答を返す。
--
-- 自由記述（community_description）の注意:
--   保存時に制御文字を除去している。HTMLとして表示する画面は現在存在しない。
--   CSV / スプレッドシートへ書き出す場合は、先頭が = + - @ の値を数式として
--   実行させない処理（先頭に ' を付ける等）を必ず行うこと。
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.sns_starter_kit_reservations (
  reservation_id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                         text NOT NULL
                                CHECK (char_length(email) BETWEEN 6 AND 254
                                       AND email = lower(email)
                                       AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  experience_type               text NOT NULL
                                CHECK (experience_type IN ('built_with_ai', 'has_tech_partner', 'neither')),
  community_description         text NOT NULL
                                CHECK (char_length(community_description) BETWEEN 1 AND 300),
  use_within_30_days            text NOT NULL CHECK (use_within_30_days IN ('yes', 'undecided')),
  -- 販売開始案内の受け取り同意（予約の成立条件。true 以外は保存できない）
  purchase_notification_consent boolean NOT NULL CHECK (purchase_notification_consent = true),
  -- 他の商品・お知らせの受け取り同意（任意・既定 false）。販売開始案内とは独立
  marketing_consent             boolean NOT NULL DEFAULT false,
  -- 同意時に表示していた文言・ポリシーの版（同意の記録）
  consent_version               text NOT NULL CHECK (char_length(consent_version) BETWEEN 1 AND 40),
  source                        text CHECK (char_length(source) <= 100),
  utm_source                    text CHECK (char_length(utm_source) <= 100),
  utm_medium                    text CHECK (char_length(utm_medium) <= 100),
  utm_campaign                  text CHECK (char_length(utm_campaign) <= 100),
  created_at                    timestamptz NOT NULL DEFAULT now(),
  status                        text NOT NULL DEFAULT 'reserved'
                                CHECK (status IN ('reserved', 'notified', 'purchased', 'declined'))
);

CREATE UNIQUE INDEX IF NOT EXISTS sns_starter_kit_reservations_email_key
  ON public.sns_starter_kit_reservations (email);

CREATE INDEX IF NOT EXISTS sns_starter_kit_reservations_created_at_idx
  ON public.sns_starter_kit_reservations (created_at);

ALTER TABLE public.sns_starter_kit_reservations ENABLE ROW LEVEL SECURITY;
-- ポリシーは作らない（既定で全拒否）

REVOKE ALL ON public.sns_starter_kit_reservations FROM anon, authenticated, PUBLIC;

COMMIT;

-- ── 適用後の確認（読み取りのみ） ────────────────────────────────
-- 1) RLS 有効 / ポリシー 0件
--   SELECT relrowsecurity FROM pg_class WHERE oid = 'public.sns_starter_kit_reservations'::regclass;
--   SELECT count(*) FROM pg_policies WHERE tablename = 'sns_starter_kit_reservations';
-- 2) anon / authenticated に権限が無い
--   SELECT grantee, privilege_type FROM information_schema.role_table_grants
--    WHERE table_name = 'sns_starter_kit_reservations' AND grantee IN ('anon','authenticated','PUBLIC');
-- 3) anon key で REST から読めない・書けない（401/403 または 0件）
