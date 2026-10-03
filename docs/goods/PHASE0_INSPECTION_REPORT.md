# PHASE 0 INSPECTION REPORT — オタクグッズ管理Webアプリ（/goods）

- 作成日: 2026-09-30
- 対象リポジトリ: `~/web-tools`（origin: `pokapokawoolmain-cyber/web-tools`、Vercel project `web-tools`、本番 `https://www.toolboxjp.com`）
- 調査方法: 実ファイルの読み取りのみ。コード・DB・Vercel・Supabaseへの変更は一切行っていない。
- 結論（先出し）: **Phase 1 は「条件付きで実装可能」。ただし本番Supabaseプロジェクトの新規作成と、サイト初の認証導入を伴うため、指示§17に従いここで停止して判断を仰ぐ。**

---

## 0. 調査の前提で判明した事実（重要）

| # | 事実 | 影響 |
|---|---|---|
| A | 作業セッションの cwd は `~/manzokuya`（別プロダクト「mannzokuya-family-sale」、Next 16）。ToolBoxJP 本体は `~/web-tools`。 | 以降の調査・実装はすべて `~/web-tools` を対象とする。manzokuya の `AGENTS.md`（Next 16 の注意書き）は web-tools には当てはまらない。 |
| B | 添付の仕様書 `otaku_goods_manager_product_spec_v0.1.docx` は指定パスに存在せず、読めなかった。 | 本レポートはチャットで受け取った指示本文のみに基づく。docx 側に追加要件があれば差分が出る可能性あり。 |
| C | `~/web-tools` の `main` 作業ツリーに **別ワークストリーム（Product #01「EC/CSV 月次締め」）の未コミット変更が大量にある**（変更12ファイル＋未追跡ディレクトリ多数。`package.json` / `package-lock.json` / `vercel.json` / `robots.ts` / `Header.tsx` / `ThemeProvider.tsx` / `.env.example` / `supabase/` を含む）。local `main` = `origin/main` = `1423894`。 | この作業ツリー上で /goods を実装すると他作業と混ざり、コミット・レビュー・ロールバックが不能になる。**別 worktree / 別ブランチで実装すべき。** |

---

## 1. 現在の構成

| 項目 | 実態（確認ファイル） |
|---|---|
| Framework | Next.js **15.3.9**（`node_modules/next/package.json`）。React 19.2.6 |
| Router | **App Router のみ**（`app/`。`pages/` なし） |
| TypeScript | strict、`moduleResolution: bundler`、パスエイリアス `@/*` → ルート（`tsconfig.json`） |
| Package manager | **npm**（`package-lock.json`）。Node v22.19.0 |
| ディレクトリ | `app/`・`components/`（ads, layout, tools, ui, pro …）・`lib/`・`data/`・`styles/globals.css`・`public/`・`scripts/`・`supabase/`(未追跡) |
| 既存 `/goods` | **存在しない**。`goods` を含むパス・コードもゼロ。`next.config.ts` の redirects にも `/goods` なし → ルート衝突なし |
| 認証 | **ユーザー認証は一切存在しない**。唯一 `/pro/ops` が合言葉（`PRO_OPS_PASSWORD`）方式、`/orders/[token]` がURLトークン方式（いずれも未コミット） |
| Supabase | コミット済みコードでは**未使用**。未コミットの Product #01 が `@supabase/supabase-js` を追加し、`lib/pro/store/supabase-driver.ts` で **service role のみ・サーバー専用**で使用予定。**Supabase プロジェクト自体が未発行**（`docs/PRO_LAUNCH_SETUP.md`:17）。`@supabase/ssr` は未導入 |
| DB migration | `supabase/migrations/0001_pro_orders.sql`（未追跡・未適用）のみ。RLS 有効＋ポリシー0件＝全拒否の方針 |
| Storage | 同 migration で非公開バケット `pro-order-files` 定義のみ（未適用） |
| 環境変数 | `.env.local`: SITE_URL, GA, WAITLIST, PRO_* 等。Supabase 関連は未設定。`.env.example` に `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`（サーバー専用）の記載あり |
| middleware | **なし** |
| API / Server Actions | Route Handlers: `app/api/og`, `favicon`, `favicon-probe`, `sitemap`, `pro/*`（未追跡）。Server Actions の使用は確認されず |
| CSS | Tailwind **v4**（`@tailwindcss/postcss`、`styles/globals.css` で `@import "tailwindcss"`、`@variant dark` クラス方式）。`tailwind.config.ts` も残存（brand色・アニメ定義） |
| UI component | `components/ui/`（CopyResultButton, NumberInput, ResultCard, SliderInput）、`components/layout/`（Header, Footer, ToolLayout, ThemeProvider）。アイコンは `lucide-react`、`clsx` + `tailwind-merge` |
| テーマ | `next-themes`、`defaultTheme="dark"`、`enableSystem`。Pro顧客画面のみ `forcedTheme="light"`（未コミット） |
| デプロイ | Vercel（`.vercel/project.json`、`vercel.json` region `hnd1`）。GitHub `main` → 本番と推定（Vercel Git連携の設定画面は未確認） |
| routing | `next.config.ts` で `toolboxjp.com` → `www.toolboxjp.com` 301。サブパス `/goods` は同一アプリ内ルートとして動く（別アプリ・rewrites 不要） |
| PWA | `public/manifest.json`（start_url `/`、`display: standalone`）のみ。**Service Worker なし**。IndexedDB 使用は favicon-generator 内のみ |
| テスト | **テストフレームワークなし**（Jest/Vitest/Playwright いずれもなし）。`tsx` 実行のスクリプト型テスト（`test:subsidy`、未追跡の `pro:qa`/`pro:e2e`）。CI は `.github/workflows/subsidy-check.yml` のみ |
| ローカル検証環境 | `supabase` CLI（Homebrew）あり、**Docker 起動中** → **ローカル Supabase で本番に触れずに DB/RLS/Storage を完全検証できる** |

### 全ページ共通で /goods に影響するもの（`app/layout.tsx`）
- `<AdScript />`（AdSense ローダー。本番かつID設定時に**全ページの `<head>`** に挿入）
- `<Header />` / `<Footer />`（全ページ）、`<Analytics />`（Vercel）、`<AnalyticsScript />`（GA4）
- metadata `robots: index/follow`（全ページ既定）
- `vercel.json`: **`/(.*)` に `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`**

---

## 2. 再利用可能なもの

| 対象 | 用途 |
|---|---|
| `app/layout.tsx` のフォント・ThemeProvider・Header/Footer | /goods も同じ外枠に載せる（ToolBoxJP の一部としての一体感） |
| `styles/globals.css` のCSS変数・dark variant | 色トークン・ダークモード |
| `lucide-react` / `clsx` / `tailwind-merge`（`lib/utils.ts`） | アイコン・クラス結合 |
| `heic2any`（既存依存。`heic-to-jpg/HeicConverter.tsx` で動的import） | iPhone の HEIC を画像前処理で JPEG 化 |
| `lib/image-converter.ts` の設計（Worker + OffscreenCanvas、フォールバック） | 参考にする。ただし出力要件（2サイズ生成・EXIF向き・サイズ上限）が違うため、goods 専用の小さな前処理モジュールを別途作る（既存ファイルは改変しない） |
| `lib/pro/api.ts` のエラー応答方針（存在有無で応答を変えない・内部エラー非開示） | 共有トークン検証（Phase 2）に同じ方針を適用 |
| `0001_pro_orders.sql` の方針（RLS有効・非公開バケット） | 同じ思想で goods 用 migration を書く |
| `app/not-found.tsx` / `error.tsx` | サイト全体のフォールバック。/goods は専用の not-found / error を持つ |

---

## 3. 新規追加が必要なもの

1. **Supabase プロジェクト**（本番用。現在ゼロ）と **ローカル Supabase 環境**（`supabase init` 相当の config）
2. **依存追加**: `@supabase/ssr`（Cookie セッション）、`@supabase/supabase-js`（main には未コミットのため goods ブランチで追加）、`server-only`。（テスト用に Playwright を入れるかは §6 で要判断）
3. **middleware.ts**（新規・**matcher を `/goods/:path*` に限定**してセッション更新のみ。他ルートでは一切実行しない）
4. **認証フロー**: `/goods/login`、`/goods/auth/callback`（OAuth/メールリンク用）、ログアウト
5. **/goods 配下の全画面**（§6）と goods 専用 layout（noindex・no-store・サブヘッダー）
6. **DB migration / RLS / Storage policy**（§7）
7. **画像前処理モジュール**（EXIF向き補正・リサイズ・WebP化・サムネ生成・サイズ検証・HEIC変換）
8. **IndexedDB キャッシュ層**（正本ではない。直近表示イベントの読み取りキャッシュ・UI state）
9. **RLS 自動テスト**（2ユーザーでの越境読み書きテスト。既存流儀に合わせ `tsx` スクリプト）
10. **プライバシーポリシー・利用規約の改訂**（本番公開前に必須。§5）

---

## 4. 競合リスク

| リスク | 内容 | 対策 |
|---|---|---|
| **未コミット作業との衝突（高）** | Product #01 が `package.json` / `package-lock.json` / `vercel.json` / `robots.ts` / `.env.example` / `supabase/` を変更中。goods も同じファイルを触る必要がある | `origin/main` から **`feature/goods-manager` を git worktree で分離**して実装。main の作業ツリーには触れない。マージ時の衝突は `package*.json`・`vercel.json` の追記部分のみに限定されるよう、差分を最小に保つ |
| **Supabase プロジェクトの共用（中）** | Product #01 も同じく「未発行」の Supabase を使う計画 | **goods 専用プロジェクトを推奨**（顧客業務データ〈pro_orders〉と一般ユーザーUGC・Auth を同居させない＝事故時の影響範囲を分離）。共用する場合はテーブル名衝突はないが、Auth ユーザーが混在する |
| middleware 新設 | 既存サイトにmiddlewareがないため、全ルートに影響し得る | matcher を `/goods/:path*` のみに限定。静的ページ（ツール群・ブログ）の SSG/ISR に影響させない |
| `vercel.json` の全体 Cache-Control | `/(.*)` に `public, max-age=3600` → ログイン後の HTML がブラウザ／中間キャッシュに残る恐れ | `/goods/(.*)` に `private, no-store` を**後段に追加**（Vercel は後に書いたヘッダーが優先）。加えて goods ページは dynamic rendering |
| 全ページ AdSense 自動広告 | /goods（個人データ画面・ユーザー投稿画像）にも自動広告が入る。AdSense は UGC ページに管理責任を求める | **AdSense 管理画面の自動広告「除外ページ」に `/goods/*` を登録**（コード変更不要。既存の広告挙動に一切触れない）。要オーナー作業 |
| ルート名 | `/goods` 配下は全て新規。既存 `app/` 直下カテゴリ（`/image`, `/money` 等）と衝突なし | — |
| Next.js バージョン | web-tools は 15.3（`params` は Promise、middleware は `middleware.ts`）。manzokuya の Next 16 の流儀（`proxy.ts` 等）を持ち込まない | 15.3 の API に合わせる |

---

## 5. セキュリティリスク

| # | リスク | 設計上の対策 |
|---|---|---|
| S1 | service role key のブラウザ漏洩 | service role を使うモジュールは `import "server-only"` 付きの単一ファイルに隔離。`NEXT_PUBLIC_` を付けない。ビルド後の `.next/static` を grep して混入ゼロを確認するテストを入れる。**Phase 1 では service role を使わない設計にできる**（下記 S3） |
| S2 | RLS の抜け・`using (true)` 系ポリシー | 全テーブル RLS 有効。anon には**テーブル権限自体を与えない**（`revoke all ... from anon`）。`using (true)` / `with check (true)` を禁止。※同オーナーの別プロダクトで `users_select_all (true)` による全件露出が実際に発生しており、同種の事故を migration レビューで機械的に弾く（grep チェック） |
| S3 | 匿名共有ページ（Phase 2） | anon に events/goods の SELECT を与えない。`security definer` の RPC `goods_get_shared_event(token)` が **token を検証し、そのイベントの公開列だけ**を返す（search_path 固定）。画像は非公開バケット＋サーバー側で署名URLを発行（ここのみ service role をサーバーで使用、または RPC 経由の署名） |
| S4 | 所持状態の越境 | `ownerships` のみが所持状態を保持。RLS 4操作とも `user_id = auth.uid()`。さらに INSERT/UPDATE の WITH CHECK で「そのグッズのイベントのメンバーであること」を要求（任意の goods_id への書き込み・存在確認を防ぐ） |
| S5 | 列の書き換えによる権限奪取 | `events.owner_id`・`goods.event_id`・`ownerships.user_id/goods_id` を UPDATE で変更不可にするトリガー |
| S6 | Storage の一覧取得・越境アップロード | バケット非公開。パス `{event_id}/{goods_id}/…` の先頭フォルダで owner/member を判定するポリシー。`file_size_limit`・`allowed_mime_types`（webp/jpeg）をバケットで強制（クライアント前処理を信用しない） |
| S7 | 認証メール | Supabase 既定SMTPは**プロジェクトメンバー宛以外に送れない**ため、本番ではカスタムSMTP（例: Resend）が必須 |
| S8 | 個人情報の新規取得 | 現プライバシーポリシーは「個人を特定できる情報は収集していません」「入力データはサーバーに送信されません」と明記（`app/privacy/page.tsx`:24,39）。**/goods 公開前に改訂必須**（メールアドレス・アップロード画像・所持データの保存） |
| S9 | 画像の著作権 | 公式グッズ写真・公式画像の転載が想定される。利用規約に投稿責任・削除対応を明記し、共有ページは noindex に |
| S10 | CSRF / オープンリダイレクト | Server Actions（Origin 検証あり）を使用。ログイン後の `next` パラメータは `/goods` 始まりの相対パスのみ許可 |
| S11 | 共有トークン | 32バイトの暗号学的乱数（base64url 43文字）。連番・event UUID を認証に使わない。形式不正と不存在で応答を変えない（列挙対策） |

---

## 6. 実装予定ファイル（Phase 1、すべて新規。既存ファイルの変更は最小の4点のみ）

### 既存ファイルへの変更（最小限）
| ファイル | 変更 |
|---|---|
| `package.json` / `package-lock.json` | `@supabase/ssr`, `@supabase/supabase-js`, `server-only` 追加。script `goods:rls-test` 追加 |
| `vercel.json` | `/goods/(.*)` の `Cache-Control: private, no-store` と `X-Robots-Tag: noindex` を末尾に追記 |
| `.env.example` | goods 用変数の記載追記 |
| （`robots.ts` は触らない：Product #01 が変更中のため。noindex は goods layout の metadata と `X-Robots-Tag` で担保） |

### 新規
```
middleware.ts                                  # matcher: /goods/:path* のみ。セッション更新
app/goods/
  layout.tsx                                   # noindex, dynamic, サブヘッダー, オフライン表示
  page.tsx                                     # /goods → 未ログインならLP+ログイン導線 / ログイン済みなら My Events へ
  not-found.tsx, error.tsx, loading.tsx
  login/page.tsx                               # ログイン
  auth/callback/route.ts                       # OAuth / メールリンクのコード交換
  events/page.tsx                              # My Events
  events/new/page.tsx                          # イベント作成
  events/[eventId]/page.tsx                    # Event Detail（最重要）
  events/[eventId]/edit/page.tsx
  events/[eventId]/items/new/page.tsx
  events/[eventId]/items/[goodsId]/edit/page.tsx
  settings/page.tsx                            # 表示名・ログアウト
  s/[shareToken]/page.tsx                      # Phase 1 は「準備中」表示のみ（ルートだけ確保）
  _components/                                 # GoodsCard, GoodsGrid, ProgressBar, FilterTabs,
                                               # EventHeader, ImagePicker, UndoToast, Skeletons,
                                               # EmptyState, OfflineBanner, ImageFallback ...
  _actions/                                    # events.ts, goods.ts, ownerships.ts（Server Actions）
lib/goods/
  supabase/server.ts, supabase/browser.ts, supabase/middleware.ts
  auth.ts                                      # requireUser()（未ログイン→login、next 付き）
  types.ts, validation.ts                      # 入力検証（長さ・価格範囲等）
  image/preprocess.ts                          # EXIF向き・リサイズ・WebP・2サイズ・HEIC
  image/storage.ts                             # 署名URL取得・パス規約
  cache/idb.ts                                 # IndexedDB 読み取りキャッシュ
supabase-goods/                                # goods 専用の Supabase ローカル設定（Product #01 の supabase/ と分離）
  config.toml
  migrations/20261001000000_goods_init.sql
  seed.sql                                     # ローカル専用テストデータ
scripts/goods-rls-test.mts                     # 2ユーザー越境テスト（ローカル Supabase 対象）
docs/goods/GOODS_MANAGER_PHASE1_DEVELOPMENT_REPORT.md
```

### 画面の状態（正式UIとして実装）
Loading / Skeleton / Empty / Error / Offline / Image missing / Unauthorized / 404 / Share expired（Phase 1 はルート確保＋表示のみ）

---

## 7. DB変更予定（migration 案・未適用）

方針:
- `ownerships` 以外に所持状態を持たない。
- events / goods は **soft delete（`deleted_at`）**。ownerships は物理行を残す（イベント削除後もメンバー側に「削除されたイベント」と表示でき、突然の参照破壊を避ける）。物理削除（パージ）は将来のバッチで。
- status は `text + CHECK`。MVP は `unowned` / `owned`、将来 `wanted` / `reserved` を CHECK 差し替えだけで追加できる（enum 型より変更が安全）。
- 仕様との差分: `goods.thumb_path` を追加（§10）。`profiles` は `auth.users` 作成時にトリガーで自動作成。

```sql
-- 拡張
create extension if not exists pgcrypto;

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  description text check (char_length(description) <= 2000),
  start_date date,
  end_date date,
  cover_image_path text,
  visibility text not null default 'private' check (visibility in ('private','link')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (end_date is null or start_date is null or end_date >= start_date)
);
create index on public.events (owner_id) where deleted_at is null;

-- goods
create table public.goods (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  price integer check (price is null or (price >= 0 and price <= 10000000)),
  description text check (char_length(description) <= 1000),
  image_path text,
  thumb_path text,
  category text check (char_length(category) <= 30),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on public.goods (event_id, sort_order) where deleted_at is null;

-- event_memberships（オーナーもメンバー行を持つ＝閲覧判定を一本化）
create table public.event_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  role text not null check (role in ('owner','viewer')),
  joined_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ownerships（個人の所持状態の唯一の置き場）
create table public.ownerships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goods_id uuid not null references public.goods(id) on delete cascade,
  status text not null check (status in ('unowned','owned')),
  acquired_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, goods_id)
);

-- share_links（Phase 2 で使用。テーブルだけ Phase 1 で作る）
create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(32), 'base64url')  -- ※PG の base64url 可否はローカルで確認し、不可なら置換処理
    check (char_length(token) >= 43),
  status text not null default 'active' check (status in ('active','revoked')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz
);
-- expired は expires_at < now() で判定（status に書き込まない＝時刻依存の不整合を避ける）

-- トリガー: updated_at 自動更新 / 新規ユーザーで profiles 作成 /
--           events 作成時に owner membership 自動作成 /
--           owner_id・event_id・user_id・goods_id の UPDATE 禁止
```

## RLS 案

```sql
-- 全テーブル
alter table ... enable row level security;
revoke all on all tables in schema public from anon;   -- anon はテーブルに一切触れない

-- ヘルパー（security definer, search_path 固定。RLS 再帰回避）
--   goods_is_member(event_id)  : auth.uid() がそのイベントのメンバーか
--   goods_is_owner(event_id)   : auth.uid() がそのイベントの owner か（deleted_at is null）

-- profiles : select/update 本人のみ（id = auth.uid()）。insert はトリガーのみ
-- events   : select  = goods_is_member(id)
--            insert  = authenticated かつ owner_id = auth.uid()
--            update  = owner_id = auth.uid()（soft delete も update で実施）
--            delete  = ポリシーなし（物理削除は不可）
-- goods    : select  = goods_is_member(event_id)
--            insert/update = goods_is_owner(event_id)
--            delete  = ポリシーなし
-- event_memberships :
--            select  = user_id = auth.uid()
--            insert  = ポリシーなし（owner 行はトリガー、viewer 行は Phase 2 の
--                      security definer RPC goods_join_via_share(token) 経由のみ）
--            delete  = user_id = auth.uid() and role <> 'owner'（自分の退出のみ）
-- ownerships :
--            select/delete = user_id = auth.uid()
--            insert/update = user_id = auth.uid()
--                            and goods_is_member((select event_id from goods where id = goods_id))
-- share_links : select/insert/update = goods_is_owner(event_id)。delete なし（revoke で失効）
--               revoke しても event_memberships は削除しない

-- Storage（bucket: goods-images, public=false, file_size_limit=2MB,
--          allowed_mime_types = image/webp, image/jpeg）
--   select         : goods_is_member(先頭フォルダの event_id)
--   insert/update/delete : goods_is_owner(先頭フォルダの event_id)
```

---

## 8. 必要な環境変数

| 変数 | 公開範囲 | 用途 |
|---|---|---|
| `NEXT_PUBLIC_GOODS_SUPABASE_URL` | ブラウザ可 | goods 用 Supabase URL |
| `NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY` | ブラウザ可（RLS前提） | anon / publishable key |
| `GOODS_SUPABASE_SERVICE_ROLE_KEY` | **サーバー専用** | Phase 2 の共有ページ画像署名のみ。Phase 1 では不要 |

※ Product #01 の `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` と名前空間を分け、プロジェクトを取り違える事故を防ぐ。

---

## 9. Production への影響

| 項目 | 影響 |
|---|---|
| 既存ページ | 変更なし。middleware は `/goods` 限定、root layout 無変更 |
| 既存DB | なし（ToolBoxJP に稼働中DBは存在しない） |
| **新規本番リソース** | **Supabase プロジェクト新規作成・Auth有効化・カスタムSMTP・Vercel 環境変数追加が必要**（← 停止理由） |
| ビルド | 依存3つ追加。バンドルは /goods ルートのみに載る（既存ページのJSは増えない想定、ビルド後に確認） |
| 広告 | AdSense 除外設定をしないと /goods に自動広告が出る |
| 法務 | プライバシーポリシー記述と実態が矛盾する状態で公開してはならない |
| Supabase Free プラン | 1週間無操作で一時停止、DB 500MB / Storage 1GB。本番運用では Pro（$25/月）を検討 |

---

## 10. 設計（指示）との差分

| # | 指示 | 本案 | 理由 |
|---|---|---|---|
| D1 | goods に `image_path` | `image_path` ＋ **`thumb_path`** | Supabase の画像変換は有料プラン機能。一覧で原寸を読まないため、アップロード時にクライアントで一覧用サムネ（~480px）と詳細用（~1600px）の2枚を生成 |
| D2 | share_links.status に expired | `status` は active/revoked のみ、expired は `expires_at` で算出 | 時刻経過で status を書き換えるバッチが不要になり、不整合が起きない |
| D3 | event_memberships | オーナーも `role='owner'` の行を持つ | 閲覧権限判定を「メンバーか」の1本に統一でき、RLS がシンプルになる |
| D4 | DELETE ポリシー（events/goods） | 物理 DELETE は誰にも許可せず、soft delete は UPDATE で実施 | 共有ユーザーの参照を突然壊さない（§6） |
| D5 | ownerships の INSERT 条件 `auth.uid() = user_id` | ＋「そのイベントのメンバーであること」 | 無関係なグッズへの書き込み・存在探索を防止 |
| D6 | `/goods/s/[shareToken]` | Phase 1 はルートのみ確保し「準備中」 | 共有本実装は Phase 2（指示どおり） |
| D7 | Supabase の配置 | goods 専用プロジェクト推奨 | Product #01 の顧客業務データと影響範囲を分離 |
| D8 | IndexedDB | Phase 1 は「読み取りキャッシュ＋UI state」のみ。オフライン中の書き込みキュー（後で同期）は作らず、トグルを無効化して理由を表示 | 同期競合の設計が要るため Phase 2 以降。正本は常にクラウド |
| D9 | テスト | RLS は `tsx` スクリプトでローカル Supabase に対して自動テスト。UI はアプリ内ブラウザでスマホ幅/PC幅を実機相当に確認 | 既存リポジトリにテスト基盤がなく、流儀（tsx スクリプト）に合わせる。Playwright 導入は要判断 |

---

## Phase 1 実装可否

**技術的には可能。** 既存の認証・DB・ルートとの衝突はなく、既存機能を壊さずに `/goods` を完全に追加実装できる。

ただし次の理由で、指示§17に従い**ここで停止**する:

1. **Production DB（Supabase プロジェクト）の新規作成**が必要（ToolBoxJP には現在DBがない）
2. ToolBoxJP として**初めてのユーザー認証**を導入する（既存認証の「変更」ではないが、個人情報の取得開始という構造変更）
3. main の作業ツリーに別ワークストリームの未コミット変更があり、**worktree 分離での実装**に合意が必要

### 提案する進め方
- **本番には一切触れず**、`feature/goods-manager` worktree ＋ **ローカル Supabase（Docker）** で Phase 1 を実装・テストまで完了させる。
- 本番リソース（Supabase 作成・SMTP・Vercel 環境変数・AdSense 除外・ポリシー改訂）は、Phase 1 完了報告時にチェックリストとして提示し、オーナー承認後に実施する。

### オーナーに判断いただきたい事項
1. 上記「ローカル完結で Phase 1 実装」に進めてよいか
2. Supabase は goods 専用プロジェクトにするか（推奨）、Product #01 と共用するか
3. ログイン方式: **メールOTP（6桁コード）＋ Google ログイン**を推奨（iOS のホーム画面追加時にメールリンクだと別ブラウザで開き、ログインが引き継がれない問題を避けられる）
4. テスト用に Playwright を devDependency として追加してよいか

---

## 追記（2026-09-30）

オーナー判断により「worktree 分離＋ローカル Supabase」で Phase 1 を実施した。決定事項・結果は `GOODS_MANAGER_PHASE1_DEVELOPMENT_REPORT.md` を参照。
