-- ============================================================
-- Mochico: キャラクターの色（ユーザーごとの見た目設定）
--   profiles は本人だけが読み書きできる（既存 RLS）。他ユーザーには影響しない。
--   12色のいずれか。既定は公式色の purple。
-- ============================================================
alter table public.profiles
  add column if not exists mascot_color text not null default 'purple'
  check (mascot_color in ('purple','red','orange','yellow','lime','green','cyan','blue','navy','pink','white','black'));
