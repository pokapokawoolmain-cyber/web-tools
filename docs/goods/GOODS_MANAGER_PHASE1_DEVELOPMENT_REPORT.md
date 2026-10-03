# GOODS MANAGER — PHASE 1 DEVELOPMENT REPORT

- 作成日: 2026-09-30
- ブランチ: `feature/goods-manager`（worktree: `~/web-tools-goods`、`origin/main` 1423894 から分岐。upstream は外してあり、誤って main へ push されない）
- 状態: **ローカル環境で実装・テスト完了。未コミット・未push・本番未反映。**
- 本番（Supabase プロジェクト作成・Vercel 環境変数・デプロイ）には一切触れていない。

---

## 0. オーナー決定事項（Phase 0 後）

| 項目 | 決定 |
|---|---|
| 進め方 | worktree 分離 + ローカル Supabase で Phase 1 を実装（本番は承認後） |
| Supabase | 既存とは分離した goods 専用の新規プロジェクト前提 |
| ログイン | メール（6桁コード。メール内リンクでも可）＋ Google |
| E2E | Playwright を devDependency で追加 |

---

## 1. 実装内容

### 画面（すべて `/goods` 配下の新規ルート）
| URL | 内容 |
|---|---|
| `/goods` | 未ログイン: 紹介＋ログイン導線 / ログイン済み: `/goods/events` へ |
| `/goods/login` | メールOTP（6桁コード入力・再送60秒クールダウン）、Google ボタン（`NEXT_PUBLIC_GOODS_GOOGLE_ENABLED=true` の環境のみ表示） |
| `/goods/auth/callback` | Google（PKCE）/ メール内リンク（token_hash）のコールバック。遷移先は `/goods` 配下の相対パスのみ許可 |
| `/goods/auth/signout` | POST のみ・Origin 検証。ログアウト前に端末内キャッシュ（IndexedDB）を消去 |
| `/goods/events` | My Events（カバー・日付・進捗 `18 / 32` と%・「共有」バッジ・コンプリート表示）、スマホは右下FAB |
| `/goods/events/new` | イベント作成 → そのままグッズ登録へ |
| `/goods/events/[eventId]` | **Event Detail**（下記） |
| `/goods/events/[eventId]/edit` | イベント編集・カバー変更/削除・イベント削除（確認ダイアログ） |
| `/goods/events/[eventId]/items/new` | グッズ登録。「保存して続けて追加」で連続登録（カテゴリは引き継ぎ・入力補完） |
| `/goods/events/[eventId]/items/[goodsId]/edit` | グッズ編集・画像差し替え/削除・グッズ削除（確認ダイアログ） |
| `/goods/settings` | アカウント表示・表示名・ログアウト |
| `/goods/s/[shareToken]` | Phase 2 用にルートのみ確保（「準備中」表示。トークンは検証も表示もしない） |

### Event Detail（最重要画面）
- 上部: カバー（スマホ 5:2 / PC 4:1 で縦を取りすぎない）、イベント名、開催日（曜日付き）、概要（2行で折りたたみ・もっと見る）
- 進捗: `5 / 11 取得` ＋ `45%` ＋ プログレスバー（`role=progressbar`、読み上げ用ラベル付き）、全取得でコンプリート表示
- フィルター: すべて / 未取得 / 取得済み（件数付き、スクロールしても上部に固定、イベントごとに記憶）
- グリッド: スマホ2列 / sm 3列 / md 4列 / lg 5列。画像は全カード正方形で統一（`object-contain`）、商品名2行・価格・カテゴリ
- 状態表示: 取得済み＝**チェックアイコン＋「取得済み」ラベル＋ピンクの太枠**、未取得＝空丸＋「未取得」ラベル（色だけに頼らない）
- **カード1タップで切替**（確認ダイアログなし）。Optimistic UI → 失敗時は確定状態へロールバック＋エラー表示
- 誤タップ対策: トーストの「元に戻す」（6秒）
- 連打対策: グッズ単位で書き込みを直列化し、通信中の再タップは完了後に「最新の希望状態」だけを送る（古いリクエストが後から上書きする事故を防止）
- フィルター中に切り替えたカードは、フィルターを変えるまでその場に残す（急に消えて迷子にならない）
- ⓘ ボタンで詳細シート（下から表示。詳細用画像はこの時だけ署名・読込）、オーナーには編集導線
- 空イベント: オーナーには登録導線、閲覧者には説明文

### 状態UI
Loading（スケルトン: 一覧・詳細）/ Empty / Error / Offline（バナー＋書き込み停止）/ Image missing（画像なし・読込失敗を区別）/ Unauthorized（編集権限なし）/ 404（他人のイベントも「見つかりません」で存在を明かさない）/ 削除済みイベント / Share（準備中）

### 画像（クライアント前処理）
`lib/goods/image/preprocess.ts`
- 形式チェック（SVG・PDF・偽装ファイル・空ファイル・40MB超は理由を説明して停止）
- HEIC/HEIF: ブラウザが直接デコードできなければ `heic2any`（既存依存）で変換。失敗時は iPhone の設定変更を案内
- EXIF の向きを反映して描画（`createImageBitmap({ imageOrientation: "from-image" })`、フォールバックあり）
- 詳細用（長辺1600px）と一覧用サムネ（長辺480px）の2枚を生成、WebP（非対応ブラウザは JPEG）、2MB以下になるまで品質を段階的に下げる
- Canvas 再エンコードで**位置情報などの EXIF は保存されない**
- 一覧はサムネのみ・`loading="lazy"`・固定比率の枠でレイアウトシフトを抑制

### IndexedDB（正本ではない）
`lib/goods/cache/idb.ts` — 直近表示イベントのスナップショット（ユーザーID単位）と UI state（フィルター）。書き込みは常にクラウドへ直接。ログアウトで全消去。使えない環境では黙って無効化。

### 既存サイトへの配慮
- middleware は **matcher `/goods` のみ**で動作（セッション更新）
- root layout・Header・Footer・globals.css・robots.ts は**一切変更していない**
- /goods 専用CSS（`app/goods/goods.css`）でアニメーションを定義（既存の `tailwind.config.ts` のアニメーションは Tailwind v4 で読み込まれていないため）
- noindex: goods layout の metadata ＋ `vercel.json` の `X-Robots-Tag`
- キャッシュ: `vercel.json` で `/goods` と `/goods/(.*)` を `private, no-store`（全体の `public, max-age=3600` より後段に追記して上書き）
- サーバー側 Supabase 通信に10秒タイムアウト（DB障害時にスケルトンのまま待たせない。後述の不具合修正参照）

---

## 2. 追加 / 変更ファイル

### 既存ファイルの変更（5件のみ）
| ファイル | 変更 |
|---|---|
| `package.json` / `package-lock.json` | 依存 `@supabase/ssr` `@supabase/supabase-js` `server-only`、dev `@playwright/test`、scripts `goods:rls-test` `goods:e2e` |
| `vercel.json` | `/goods`・`/goods/(.*)` の no-store / noindex を末尾に追記（※`regions` 配列の改行整形も入った。Product #01 側も同じ整形をしている） |
| `.env.example` | goods 用変数の説明を追記 |
| `.gitignore` | Playwright の出力先を追記 |

### 新規（約4,200行）
```
middleware.ts
playwright.config.ts
app/goods/
  layout.tsx  page.tsx  not-found.tsx  error.tsx  goods.css
  login/page.tsx  login/LoginForm.tsx
  auth/callback/route.ts  auth/signout/route.ts
  events/page.tsx  events/loading.tsx  events/new/page.tsx
  events/[eventId]/page.tsx  loading.tsx  error.tsx  edit/page.tsx
  events/[eventId]/items/new/page.tsx  items/[goodsId]/edit/page.tsx
  settings/page.tsx  settings/SettingsForm.tsx
  s/[shareToken]/page.tsx
  _components/ GoodsBoard, GoodsDetailSheet, EventHeader, EventForm, GoodsForm,
               ImagePicker, ConfirmDialog, Toast, ProgressBar, StateMessage,
               ImageFallback, OfflineBanner, useOnline, GoodsSubNav, PageHeader, Forbidden
lib/goods/
  env.ts  types.ts  format.ts  validation.ts  ui.ts  data.ts
  supabase/{browser,server,middleware,fetch}.ts
  image/{preprocess,storage}.ts
  cache/idb.ts
supabase-goods/supabase/
  config.toml  migrations/20261001000000_goods_init.sql  templates/otp.html
scripts/goods-rls-test.mts
e2e/goods/{goods.spec.ts,helpers.ts}
docs/goods/{PHASE0_INSPECTION_REPORT.md, GOODS_MANAGER_PHASE1_DEVELOPMENT_REPORT.md}
```
※ Product #01 の `supabase/`（未追跡）と混ざらないよう、goods の Supabase 設定は `supabase-goods/` に分離。`supabase db push` を誤ったプロジェクトへ流す事故を防ぐため。

### リポジトリ外の変更
- `~/manzokuya/.claude/launch.json` に dev server 設定 `toolboxjp-goods`（port 3100）を1件追加（このセッションのプレビュー用。未追跡ファイル）

---

## 3. DB migration

`supabase-goods/supabase/migrations/20261001000000_goods_init.sql`（ローカルにのみ適用済み）

| テーブル | 要点 |
|---|---|
| `profiles` | `auth.users` 作成時にトリガーで自動作成。表示名は Google 氏名のみ流用（メールアドレスは流用しない） |
| `events` | `owner_id` 既定 `auth.uid()`、`visibility` private/link、`deleted_at`、文字数・日付順の CHECK |
| `goods` | `image_path` + **`thumb_path`**、`price` 0〜1千万 or null、`sort_order`、`deleted_at` |
| `event_memberships` | オーナーも `role='owner'` 行を持つ（作成時トリガー）。`UNIQUE(user_id, event_id)` |
| `ownerships` | **所持状態の唯一の置き場**。`UNIQUE(user_id, goods_id)`、`status` は text+CHECK（unowned/owned、将来 wanted/reserved を CHECK 差し替えで追加可）、`acquired_at` はサーバー時刻でトリガー設定 |
| `share_links` | 32バイト乱数の base64url トークン（43文字）を既定値で生成、active/revoked、expired は `expires_at` で判定 |

その他トリガー: `updated_at` 自動更新 / `owner_id`・`goods.event_id`・`ownerships` のキー・`created_at` の変更禁止 / 乱用防止上限（1ユーザー300イベント、1イベント1000グッズ）
RPC: `goods_my_events()`（security invoker＝RLSがそのまま効く、進捗集計付き）

**events / goods に所持状態は一切保存していない。**

## 4. RLS

- 全6テーブル RLS 有効。**anon はテーブル権限ごと剥奪**（RLS 以前に権限で拒否）。authenticated も必要な操作だけ GRANT（events/goods は DELETE 権限なし＝物理削除不可）
- `using (true)` / `with check (true)` は1つもない
- 判定ヘルパー `goods_is_member` / `goods_is_owner` / `goods_can_track` / `goods_path_event_id`（security definer・`search_path=''`・anon 実行不可）

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | 本人 | （トリガーのみ） | 本人 | 不可 |
| events | オーナー or メンバー | `owner_id = auth.uid()` | オーナー（soft delete もここ） | 不可 |
| goods | メンバー | イベントオーナー | イベントオーナー | 不可 |
| event_memberships | 本人の行 | 不可（トリガー / Phase 2 RPC のみ） | 不可 | 本人の viewer 行のみ（オーナー行は不可） |
| ownerships | 本人 | 本人＋メンバーであるイベントの削除されていないグッズのみ | 同左 | 本人 |
| share_links | イベントオーナー | イベントオーナー | イベントオーナー | 不可（revoke で失効） |
| storage `goods-images` | メンバー（パス先頭 event_id で判定） | オーナー | オーナー | オーナー |

Storage バケット: 非公開、`file_size_limit` 2MB、`allowed_mime_types` = webp / jpeg（クライアント前処理を信用せずサーバーで強制）

---

## 5. テスト結果（すべて実行済み・実測値）

### 5-1. DB / RLS / Storage 自動テスト — **65 passed / 0 failed**
`npm run goods:rls-test`（ローカル Supabase 以外への接続は起動時に拒否する安全装置付き）

| 指示書 §15 の項目 | 結果 |
|---|---|
| A がイベント作成 / 10商品登録 / 3商品取得済み | ✅ |
| reload（再取得）で保持 / logout→login で保持 | ✅ |
| B から A の ownership が取得できない（user_id 指定でも0件） | ✅ |
| B が A の ownership を更新・削除・A名義で作成できない | ✅ |
| 非オーナー（非メンバー・viewer とも）が event / goods を編集・追加できない | ✅ |
| B が自分で membership を作って潜り込めない / 共有リンクを作れない | ✅ |
| 同じグッズで A=取得済み、B=未取得が独立して共存 | ✅ |
| anon: 全6テーブル読取不可・作成不可・RPC/判定関数 実行不可 | ✅ |
| RLS bypass 試行: owner_id 付け替え・event_id 付け替え・物理削除・削除済みグッズへの記録・未定義 status・重複行 | ✅ すべて拒否 |
| Storage: viewer/非メンバーのアップロード拒否・パス規約外拒否・SVG拒否・2MB超拒否・anon取得/一覧拒否・公開URL不可・非メンバーの署名URL発行不可 | ✅ |
| 150商品の登録・取得 | ✅（29ms） |

### 5-2. E2E（Playwright・本番ビルド `next start`）— **8 passed / 0 failed**
`npm run goods:e2e`（iPhone 13 相当 と 1440×900。インストール済み Chrome を使用）
- A: 作成→必須チェック→10商品を UI で登録→3つ1タップ取得→reload→logout/login で `3 / 10（30%）` 保持
- 「元に戻す」で取消し、reload 後も未取得
- ownerships 通信を遮断→ロールバック＋エラー表示、reload 後も 3/10 のまま
- フィルター（取得済み3件 / 未取得7件）
- 不正画像（偽装 jpg / SVG）で理由を表示
- B: A のイベント・編集・グッズ登録 URL がすべて「見つかりません」
- スマホ幅2列・横スクロールなし / PC幅5列

### 5-3. ブラウザでの手動確認（アプリ内ブラウザ、ローカル）
| 項目 | 結果 |
|---|---|
| メールOTPログイン（カスタムテンプレートのコード受信→入力） | ✅ |
| 巨大画像 4032×3024・8.0MB JPEG | ✅ 0.5秒で処理 → 詳細用 559KB / サムネ 480×360・17KB（WebP） |
| 74MB 画像 | ✅ 「40MBまで」と説明して停止 |
| 偽装 jpg / SVG / PDF | ✅ それぞれ別の日本語メッセージ |
| 全角価格「３，５００円」 | ✅ 3500 として保存 / 「たぶん5000」はエラー表示 |
| 連打の競合（1回目の通信を900ms遅延させて2回タップ） | ✅ 送信は owned→unowned の順に直列化、UI と DB が一致 |
| B を viewer にした状態で B が同じイベントを表示 | ✅ B は 0/12（A の5件は見えない）、編集導線なし、編集URLは「権限がありません」 |
| オフライン模擬 | ✅ バナー表示、タップは「オフラインのため変更できません」で拒否 |
| DB API 停止（障害模擬） | ✅ 約10秒で「◯時点の内容を表示しています（閲覧のみ）」に切替（IndexedDB） |
| 120商品イベント | ✅ 120カード描画、画像はスクロールに応じて遅延読込（10→18→37/90枚） |
| ソフトデリート | ✅ 一覧・進捗から除外、DB には `deleted_at` 付きで残存 |
| ログアウト | ✅ セッション Cookie 消去、IndexedDB スナップショット 1→0 件 |
| スマホ 375px / PC 1023px（4列）/ 1440px（5列）/ ダーク・ライト | ✅ |

### 5-4. 既存サイトへの影響・漏洩チェック
| 項目 | 結果 |
|---|---|
| `npm run build` | ✅ 成功 |
| origin/main のビルドとの比較（/goods 以外の全177ルート） | ✅ レンダリング種別（静的/動的）が完全一致。差分は Middleware 行の追加のみ。静的生成 368 ページで同数 |
| 全ページ共通の First Load JS | ✅ 102kB で変化なし |
| service role / secret key のクライアント混入 | ✅ `.next/static` と goods サーバー出力に実値・`service_role` JWT なし（`sb_secret_` の文字列一致は supabase-js 内の接頭辞判定コードのみ） |
| アプリ本体の service role 使用 | ✅ なし（テストスクリプトのみ・ローカル限定） |
| 型チェック / ESLint（goods 関連） | ✅ エラー0 |

### 5-5. テスト中に発見して修正した不具合
1. **連打時に古いリクエストが後から保存される可能性** → グッズ単位の直列化に変更
2. **表示直後にフィルターを押すと、IndexedDB から遅れて読んだ前回値で上書きされる** → ユーザー操作を優先
3. **ログアウトが実行されない**（`await` 後に `e.currentTarget` が null）→ 先に参照を保持
4. **DB が応答しないと約47秒スケルトンのまま** → 10秒タイムアウト追加。さらに `AbortSignal.timeout` の `TimeoutError` を postgrest-js が再試行対象と判断し3回リトライしていたため、中断（AbortError）として扱うよう修正
5. **DB障害時に「見つかりません」と表示される** → エラーと 404 を区別
6. `content-visibility: auto` が非表示時の空白・スクロール時のずれの原因になり得る → 削除
7. スマホでイベント作成ボタンが FAB と二重表示（クラス競合）→ `cn()` で解決
8. 入力し直してもエラー表示が残る / アイコンのみリンクに名前がない / タイトルの「ToolBox」重複 → 修正

---

## 6. 未実装項目（Phase 1 の範囲外として意図的に未着手）
- 共有機能の本体（共有リンク発行・失効・`/goods/s/[token]` の閲覧・「自分の管理に追加」）→ Phase 2
- グッズの並べ替え（sort_order は登録順で自動採番のみ）
- アカウント削除（本人によるデータ削除）
- Service Worker（端末が完全オフラインでのページ表示）
- サムネイルの IndexedDB キャッシュ
- Header への /goods 導線追加（Header は Product #01 側が変更中のため触っていない）

## 7. 既知の問題・未確認事項（正直ベース）
| # | 内容 |
|---|---|
| K1 | **実機（iPhone / Android）では未確認。** Chrome のスマホ幅エミュレーションのみ。本番前に実機で撮影→登録→取得の一連を確認する必要がある |
| K2 | **本物の HEIC ファイルでの変換は未確認**（手元にサンプルなし）。iOS Safari は `accept="image/*"` だと JPEG に変換して渡すのが通常挙動だが、Mac/Android で HEIC を直接選んだ場合の `heic2any` 経路は未検証 |
| K3 | **Google ログインは未テスト**（ローカルに資格情報なし）。コードとボタンは実装済みだが、環境変数でオンにするまで非表示 |
| K4 | 端末が完全オフラインだと、Service Worker がないためページ自体を開けない。IndexedDB の前回データ表示が効くのは「ページは開けるが DB に届かない」場合のみ |
| K5 | 画像の署名URLは表示のたびに変わるため、再訪時にブラウザキャッシュが効かない（有効期限6時間） |
| K6 | アカウントを削除しても Storage の画像は残る（削除フロー未実装） |
| K7 | `vercel.json` / `package.json` / `package-lock.json` / `.env.example` / `.gitignore` は Product #01 の未コミット変更と同じファイル。マージ時に衝突解消が必要（どれも追記のみなので機械的に解ける） |
| K8 | ローカル検証は Supabase CLI の Postgres 17 イメージ。本番プロジェクトで `extensions.gen_random_bytes` 等が同じ場所にあるか、適用前に確認が必要 |
| K9 | GA / Vercel Analytics が `/goods/events/<uuid>` の URL を記録する（認証情報ではないが、Phase 2 の共有トークン URL は計測から除外する対策が必須） |

---

## 8. Phase 2 へ持ち越す事項
1. 共有: `share_links` の発行・失効UI、`/goods/s/[token]` を security definer RPC（トークン検証→そのイベントの公開列のみ返却）で実装、画像はサーバー側で署名URL発行、「自分の管理に追加」RPC（viewer membership 作成）。失効しても既存 membership は削除しない
2. 共有トークンを GA / Vercel Analytics / Referer に流さない対策（`referrer: no-referrer` はルートに設定済み、計測除外が残り）
3. アカウント削除（DB＋Storage）
4. Service Worker（オフライン起動）とサムネイルのキャッシュ
5. グッズの並べ替え、カテゴリでの絞り込み
6. 実機テスト（iOS Safari / Android Chrome）と本物の HEIC

---

## 9. 本番公開前チェックリスト（すべてオーナー承認が必要・未実施）
- [ ] goods 専用 Supabase プロジェクトを作成（リージョンは Vercel `hnd1` に合わせ東京推奨）
- [ ] migration 適用（`supabase link` → `supabase db push --workdir supabase-goods`。**Product #01 の `supabase/` と取り違えないこと**）
- [ ] Auth 設定: Site URL `https://www.toolboxjp.com`、Redirect URL `https://www.toolboxjp.com/goods/auth/callback`、メールテンプレート（`templates/otp.html` と同内容）
- [ ] カスタム SMTP（既定 SMTP はプロジェクトメンバー以外に送れない）
- [ ] Google OAuth クライアント作成・Supabase に登録 → `NEXT_PUBLIC_GOODS_GOOGLE_ENABLED=true`
- [ ] Vercel 環境変数: `NEXT_PUBLIC_GOODS_SUPABASE_URL` / `NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY`（service role は不要）
- [ ] AdSense 管理画面の自動広告「除外ページ」に `/goods/*` を登録
- [ ] **プライバシーポリシー改訂**（現行は「個人を特定できる情報は収集していない」「データはサーバーに送信されない」と記載）と利用規約（投稿画像の権利・削除対応）
- [ ] Preview デプロイで実機確認（K1〜K3）
- [ ] Product #01 の作業とのマージ順序を決定（K7）

---

## 10. ローカルでの動かし方
```bash
cd ~/web-tools-goods
# Docker Desktop の認証ヘルパーが PATH に無い環境では先頭に付ける
PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH" supabase start --workdir supabase-goods
npm run dev -- -p 3100          # http://localhost:3100/goods
# ログインコードはローカル Mailpit で確認: http://127.0.0.1:55324
npm run goods:rls-test           # DB/RLS/Storage テスト
npm run build && npm run goods:e2e
```
ローカル Supabase のポートは 5532x 系（他プロジェクトの 5432x と衝突しない）。`.env.local` はローカル専用の公開デモ鍵のみ（gitignore 済み）。
