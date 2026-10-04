# MOCHICO V1 PRODUCTION RELEASE REPORT

- 作成日: 2026-10-04
- 最終ステータス: **Production deploy 済み（efa92b0 / `dpl_HoZxR9NTZFnm7yGzxo7wRqpUh2uw`）・Acceptance 1件 STOP**（共有停止時に token が Supabase へのリクエスト URL に載る。修正は release ブランチ `2f4bf12` に用意・未 deploy）。LP の CTA は準備中のまま
- 公開LP（https://www.toolboxjp.com/mochico）は従来どおり公開中。CTA は「近日公開」のまま（変更していない）

## 1. 判定の要約（Deploy 直前 Gate）
| Gate | 状態 |
|---|---|
| Production Supabase 構築・migration | ✅ `mochico-production`、4本適用・順序一致 |
| DB / RLS / Storage 設定 | ✅ 12/12 |
| 共有 / プライバシー / 退会（R6 含む）Production 実測 | ✅ 61/61（2回実施） |
| Auth（Site URL・Redirect・6桁 OTP・新規/既存・メールリンク） | ✅ 14/14 |
| SMTP（Resend） | ✅ 送信成功（Resend テスト宛先） |
| Vercel 環境変数（toolbox-jp・Production のみ・種別） | ✅ 5件、秘密値は sensitive、値一致を確認（sensitive は設定時の値で更新） |
| cleanup / cron secret ローテーション | ✅ 新しい値で Vercel・`prod.env` を更新 |
| client bundle / server 出力に秘密値なし（本番値でビルド） | ✅ 陽性対照あり |
| ローカル自動テスト | ✅ RLS 65/65・共有 90/90・退会 68/68・E2E 35/35・tsc・lint・build |
| Analytics / AdSense のアプリ内停止 | ✅ ローカル本番ビルド（Production は deploy 後に再確認） |
| Privacy / Terms | ✅ 補足ページ作成（CEO 文面確認） |
| Production deploy（main マージ） | ⏸ 未実施（指示待ち） |
| Production ブラウザ smoke・実メール本文・cleanup endpoint 実測・PWA | ⏸ deploy 後 |
| 実機確認（iPhone / Android） | ⏸ deploy 後（Android 実機なし） |

## 2. Production architecture
- Web: **Vercel プロジェクト `toolbox-jp`**（`www.toolboxjp.com` / `toolboxjp.com` を持つ。main = Production 自動 deploy）。同じリポジトリの main から `web-tools`・`web-tools-jp`（*.vercel.app のみ）も deploy されるが、Mochico の環境変数は持たないためアプリは「準備中」表示・cleanup cron は 404 で何もしない。アプリは `/mochico/*`（LP と同一ドメイン）
- DB / Auth / Storage: Supabase `mochico-production`（ref `rfdhqxxvcipnekeawrxk`、org yoru、ap-northeast-1、Micro）。Product #01（`toolboxjp-production`）・yoru・家族セール等とは別プロジェクト
- 秘密値の保管: CEO の Mac の `~/.config/mochico/prod.env`（chmod 600、リポジトリ外）。レポート・コミット・ログには値を出していない
- リリースブランチ: `release/mochico-v1`（commit `3c98b06`、origin/main `e83690e` から作成・push 済み・未マージ）。作業ツリー `~/web-tools-release`
- Product #01 の未コミット作業（`~/web-tools`）には一切触れていない

## 3. Migration 結果
適用前に実ファイルの名前・順序・内容を確認（sha256 記録）。`supabase db push` で適用し `migration list` で local/remote 一致を確認。

| 順 | ファイル | 内容 |
|---|---|---|
| 1 | 20261001000000_goods_init.sql | テーブル・RLS・Storage バケット/ポリシー |
| 2 | 20261003000000_goods_share.sql | 共有リンク・参加 RPC |
| 3 | 20261004000000_goods_account_deletion.sql | 退会・Preserved Catalog・cleanup |
| 4 | 20261005000000_mochico_profile.sql | `profiles.mascot_color`（実装済みの「キャラクターの色」用。新機能追加ではない） |

適用後: anon は全テーブル・RPC に権限なし（401/42501）、バケット `goods-images` は private・2MB・webp/jpeg のみ。

## 4. Auth
- 方式: メールの6桁コード（OTP、1時間有効、再送間隔 60 秒）。Google ログインは未設定のため **ボタン非表示**（`NEXT_PUBLIC_GOODS_GOOGLE_ENABLED` 未設定）
- 本番設定は `supabase-goods/supabase/config.toml` の `[remotes.production]` に定義済み（Site URL `https://www.toolboxjp.com`、Redirect `https://www.toolboxjp.com/mochico/auth/callback`、日本語テンプレート「Mochico ログインコード」、メール送信上限 30/時）。**反映は CEO が実行**（12 参照）
- Production では Mailpit を使わない。SMTP は Resend（CEO 決定）

## 5. Storage / RLS / 共有 / 退会（Production 実測: 61/61）
スクリプト（リポジトリ外・テスト用ユーザーのみ・メール送信なし・最後に全削除）で Production DB / Storage を直接検証。

- A: イベント・グッズ3件・画像（full/thumb）・取得・共有リンク作成 ／ B: 共有から参加・取得 ／ C: 非参加者
- 画像: 匿名・非参加者はダウンロード不可、非参加者はアップロード不可、PNG は拒否、参加者は署名URL取得可
- プライバシー: A/B とも自分の取得状況・プロフィールのみ取得、C はイベント/グッズ不可、匿名は全テーブル不可、catalog RPC は匿名不可、B は編集・共有リンク作成不可
- 失効: 失効トークンでの参加は `revoked`、既存参加者 B は継続利用可
- **退会（A）**: auth / profile / ownership / membership 削除、イベント残存・`owner_id` NULL・`preserved_at` 設定、グッズ3件残存、共有リンク `created_by` NULL・全失効、画像残存、**R6: `storage.objects.owner` と `owner_id` が両方 NULL（Production で実測）**、B の membership・ownership 残存、B はイベント/グッズ/画像を引き続き閲覧可、B から A の email・氏名・UUID は取得不可（`goods_my_events` 含む）、B は編集・共有不可
- cleanup: 最後の参加者が抜けると orphaned、7日 grace では削除されず、grace 0 で削除、孤立画像フォルダ検出 → Storage API で削除
- 実行後の残存: テストユーザー 0・イベント 0・画像 0

## 6. Cleanup scheduler
- Vercel Cron（`vercel.json` の `crons`）: `/mochico/internal/cleanup` を毎日 18:00 UTC（03:00 JST）に GET
- 認証: `Authorization: Bearer <secret>` を timingSafeEqual で照合。`GOODS_CLEANUP_SECRET` 未設定・32文字未満・不一致はすべて 404
- Vercel Cron は `CRON_SECRET` を Bearer として送るため、`CRON_SECRET` に `GOODS_CLEANUP_SECRET` と同じ値（64文字の暗号学的乱数。2026-10-04 にローテーション済み・未表示）を設定する
- grace は設計どおり 7 日

## 7. URL / noindex
- `/mochico` のみ index（LP）。`/mochico/privacy`・`/mochico/terms` は公開ページ
- アプリ内部（`/mochico/app|events|settings|login|auth|s|account`）は metadata の noindex ＋ `vercel.json` の `X-Robots-Tag: noindex` と `Cache-Control: private, no-store`。sitemap には載せない
- 共有: `/mochico/s/<token>` はページを描画せず token を HttpOnly Cookie（path `/mochico/s`、1時間）へ移して `/mochico/s/view` へリダイレクト（Referrer-Policy no-referrer）
- 旧 `/goods` は 308 で `/mochico` 配下へ（Production に旧アプリは存在しないため二重アプリにならない）

## 8. Analytics / AdSense
- 共通レイアウト `<head>` 先頭の静的インラインスクリプト（`PrivateAppGuard`）で、アプリ内部のパスでは GA4 公式オプトアウト（`ga-disable-<ID>`）と AdSense `pauseAdRequests` を設定
- Vercel Analytics は `beforeSend` でアプリ内部のページビューを送らない
- ローカル本番ビルドで確認: `/mochico/login`・`/mochico/s/view` は GA 無効・広告/計測ビーコン 0、`/`・`/mochico`・`/mochico/privacy` は従来どおり
- LP の CTA は通常のページ遷移（`<a>`）にして、アプリ入場時に必ず上記が効くようにした
- 共有 token を含む URL ではスクリプトが一切動かない（リダイレクトのみ）
- 推奨（任意）: AdSense 管理画面の自動広告「除外ページ」にも `/mochico/app` 等を登録

## 9. PWA
- マニフェスト `/mochico/manifest.webmanifest`: name/short_name「Mochico」、start_url `/mochico/app`、scope `/mochico`、standalone、theme `#7c4dff`、紫アイコン（192/512/maskable）、apple-touch-icon
- SW `/mochico-sw.js`（scope `/mochico`）はオフライン案内1枚のみキャッシュ
- iOS は手順ガイド（自動追加を装わない）。Android Chromium は `beforeinstallprompt` を保持しボタンから標準 UI を直接表示
- **Production HTTPS 上での確認は deploy 後**（未実施）

## 10. Privacy / Terms
- 既存の ToolBoxJP プライバシーポリシーは CEO 確定文面のため変更していない
- `/mochico/privacy`（補足）: 取得情報（メール・登録内容・画像・取得状況・共有・表示設定・Cookie）、EXIF 位置情報を保存しないこと、共有で見える範囲、保存先（Supabase 東京）、アプリ内では解析・広告を動かさないこと、端末内キャッシュ、**退会時の取扱い（参加者がいるカタログは作成者とのつながりを切り離して既存参加者向けに維持、参加者0人から7日目安で削除）**
- `/mochico/terms`（補足）: アカウント、登録内容の権利、共有、退会、禁止事項、サービス変更
- ログイン画面・設定画面・LP フッターからリンク。法的保証の断定は書いていない。**CEO の文面確認が必要**

## 11. テスト結果
- ローカル自動（リリースブランチ・ローカル Supabase）: RLS 65/65、共有 90/90、退会 68/68、Playwright 35/35（70 件中 35 件は端末プロファイル重複のため設計上 skip）
- tsc / lint / build 合格。ビルドのルート表を main と比較 → 差分は Mochico ルートの追加のみ
- Production DB/Storage smoke: 61/61（上記 5）
- Production ブラウザ smoke（LP → ログイン → 実メール → 作成 → 共有 → 退会）: **未実施（deploy・SMTP 待ち）**

## 12. GO までに必要な作業（順番どおり）
※ 1〜3 は 2026-10-04 に完了（16〜18 参照）。残りは 4 以降。
1. **Auth 本番設定の反映**（CEO が Terminal で実行。差分を確認して承認）  
   `cd ~/web-tools-release/supabase-goods && supabase config push --project-ref rfdhqxxvcipnekeawrxk`
2. **Resend**: アカウント作成 → Domains で `toolboxjp.com` を追加 → 表示された DNS レコード（DKIM / SPF / MX）を DNS に追加して Verify → API Key（Sending access）作成 → Supabase Dashboard › Authentication › SMTP Settings: Host `smtp.resend.com`、Port `465`、Username `resend`、Password = API Key、Sender `noreply@toolboxjp.com`、Sender name `Mochico`  
   ※ 1 の後に行う（以後 `config push` を再実行すると SMTP 設定が上書きされるおそれがあるため、再実行しない）
3. **Vercel 環境変数**（Production のみ）: Terminal で `~/.config/mochico/vercel-env-helper.sh` を実行すると、値を表示せずに1つずつクリップボードへコピーする。Vercel › Settings › Environment Variables に貼り付け（5件）。`NEXT_PUBLIC_MOCHICO_APP_ENABLED` はまだ設定しない
4. **Production deploy の承認**: `release/mochico-v1` を main にマージ（Claude が実行。CEO の明示承認が必要）
5. Claude が Production smoke（ブラウザ・CEO のメールで実受信）、Analytics/AdSense・PWA・noindex・既存ページを本番で確認
6. CEO の iPhone 実機確認（下記）
7. 全 Gate 合格後に `NEXT_PUBLIC_MOCHICO_APP_ENABLED=true` を Vercel に追加 → 再 deploy → LP の CTA が「Mochicoをはじめる」になる → 本番で最終確認

## 13. 実機確認（未実施）
CEO iPhone: LP → 開始、ログイン、メールコード、マイイベント、作成、グッズ作成、カメラ/写真、取得、再読み込み、共有・受信、ホーム画面追加の案内、アイコン、standalone 起動、ログアウト/ログイン、設定、退会画面。Android 実機: なし（未確認）。

## 14. Rollback
- アプリ: Vercel プロジェクト **`toolbox-jp`** で直前の Production deploy（現在 `dpl_Dx12DdrZJCnyriEj4AoQrW5qkJza` / `e83690e`）へ Instant Rollback、または main で merge commit を revert
- CTA だけ戻す: `NEXT_PUBLIC_MOCHICO_APP_ENABLED` を削除して再 deploy
- DB: Mochico 専用プロジェクトのため他サービスに影響なし。migration の巻き戻しは行わない（データ保全のため）

## 15. 残存リスク
- SMTP 未設定の間は一般ユーザーがログインできない（built-in メールは org メンバー宛てのみ）
- Resend 無料枠（3,000通/月・100通/日）を超えると送信停止 → 利用状況を見て有料化を判断
- AdSense / GA のローダースクリプト自体はアプリ画面でもダウンロードされる（送信・広告表示は停止）
- Google ログインは v1 では提供しない
- Brand Legal: 「合同会社mochico」が存在。商標クリアランスは別 Gate（今回、新たな重大な同業商標衝突は調査していない）
- Supabase Micro の容量・性能は公開後に監視が必要

## 16. Pre-deploy Gate 再確認（2026-10-04 追記）
| 項目 | 結果 |
|---|---|
| SMTP（Resend） | ✅ Supabase → Resend の送信成功（Resend 公式テスト宛先 `delivered@resend.dev`。実在の人には送っていない。テストユーザーは削除済み） |
| 有効なログイン方法 | ✅ メールのみ（Google 無効・匿名無効・新規登録可） |
| **Site URL** | ⛔ `http://localhost:3000` のまま（config push の本番上書きが反映されていない） |
| **Redirect URL 許可リスト** | ⛔ `https://www.toolboxjp.com/mochico/auth/callback` が未登録（指定しても Site URL へ戻される） |
| **ログインコードの桁数** | ⛔ 8桁（アプリは6桁のみ受付 → このままではログイン不可） |
| メールテンプレート | ⚠️ 未確認（上記から未反映の可能性が高い） |
| Vercel 環境変数 | ⚠️ 確認不可（Vercel CLI トークンが失効 `invalidToken`。Chrome 拡張も未接続） |
| GOODS_SUPABASE_SERVICE_ROLE_KEY「Needs Attention」 | ⚠️ 原因未確定。最有力は「秘密値が Sensitive（Secret）型でなく読み取り可能な型で保存されている」 |
| cleanup / cron secret | 🔄 ローカル `prod.env` で新しい値（64文字）へローテーション済み。Vercel 側の更新待ち（旧値はスクリーンショット流出のため失効扱い。アプリ未 deploy のため旧値で呼べる endpoint は本番に存在しない） |

## 17. 再検証（CEO の Supabase 手動設定後・2026-10-04）
| # | 項目 | 結果 |
|---|---|---|
| 1 | Site URL | ✅ `https://www.toolboxjp.com/` |
| 2 | Redirect allow-list | ✅ `/mochico/auth/callback` はそのまま維持、許可外ホストは Site URL へ戻される |
| 3 | OTP 桁数 | ✅ 6桁（数字のみ） |
| 4 | Resend 経由の送信 | ✅ 新規・既存ユーザーとも送信成功（宛先は Resend 公式テストアドレスのみ） |
| 5 | OTP 認証フロー | ✅ 新規（アカウント作成・profile 自動作成）・既存（同一アカウント・重複なし）・誤コード拒否・メールリンク（token_hash）経路 |
| 6 | localhost へ戻らない | ✅ |
| 7 | 秘密値の露出 | ✅ Production の実値でビルドし `.next/static`・`.next/server`・ビルドログを走査 → service role・cleanup/cron secret・DB パスワード 0 件（陽性対照: anon key・URL は検出） |
| 8 | Vercel 環境変数の名前・Environment・種別 | ⛔ **未確認**（Vercel CLI トークン失効 `invalidToken`、Chrome 拡張未接続） |
| 9 | DB / RLS / Storage | ✅ 12/12（migration 4本、全テーブル RLS、`using (true)` なし、anon 権限なし、service 専用 RPC、SECURITY DEFINER の search_path 固定、バケット設定、Storage ポリシー、退会トリガー、本番データ 0 件） |
| 10 | 全テスト | ✅ Production smoke 61/61、Auth 14/14、ローカル RLS 65/65・共有 90/90・退会 68/68・E2E 35/35、tsc・lint・build |

未確認（制約）: メール本文の見た目（日本語テンプレートの描画）は、テスト宛先の受信内容を読めないため未確認。deploy 後の実メール受信（CEO のアドレス）で確認する。

## 18. Vercel 環境変数の最終確認（2026-10-04 23:30）
- 本番ドメインを持つのは `toolbox-jp`（以前のレポートで参照していた `web-tools` は *.vercel.app のみ。deploy ID の記載を訂正）
- `toolbox-jp` の Production に5件。重複なし。`NEXT_PUBLIC_MOCHICO_APP_ENABLED` は未設定（CTA は閉じたまま）

| Key | 種別 | Environment | 値の確認 |
|---|---|---|---|
| NEXT_PUBLIC_GOODS_SUPABASE_URL | encrypted（公開値のため可） | Production | `prod.env` と完全一致 |
| NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY | encrypted（公開値のため可） | Production | `prod.env` と完全一致 |
| GOODS_SUPABASE_SERVICE_ROLE_KEY | **sensitive**（23:29 に再設定） | Production | 再設定前に `prod.env` と完全一致を確認（前後の空白なし）→ 同じ値で sensitive 化 |
| GOODS_CLEANUP_SECRET | sensitive | Production | **ローテーション後の新しい値（64文字）で 23:29 に更新** |
| CRON_SECRET | sensitive | Production | GOODS_CLEANUP_SECRET と同じ新しい値で 23:29 に更新 |

- 「Needs Attention」の原因: service role key が読み取り可能な `encrypted` 型で保存されていた → `sensitive` へ再設定して解消
- cleanup / cron secret: Vercel の値は流出した旧値のまま（更新 22:46/22:48 → ローカルのローテーションは約 22:52）だったため、新しい値へ更新。旧値は Vercel・`prod.env` のどちらにも残っていない。旧値で呼べる endpoint は本番に存在したことがない（アプリ未 deploy）
- sensitive の値は仕様上読み戻せないため、cleanup secret の一致は deploy 直後に endpoint を正しい値・誤った値で呼んで確認する
- service role key は短時間 `encrypted` 型だったが、閲覧できるのはチームメンバー（OWNER のみ）で、外部流出の兆候はない。ローテーションは不要と判断（必要なら Supabase で JWT secret 更新が必要で anon key も変わる）

## 19. Production deploy・Acceptance（2026-10-04）
- main へマージ: `efa92b0`（release/mochico-v1 `71b63fb` を no-ff マージ）→ `toolbox-jp` Production `dpl_HoZxR9NTZFnm7yGzxo7wRqpUh2uw` READY
- 確認方法: 本番 URL への HTTP 確認、ヘッドレス Chrome での実 UI 操作（テストアカウントは管理 API で作成しセッション Cookie を設定。フォームに資格情報は入力していない）、本番 DB の読み取り確認

| # | 項目 | 結果 |
|---|---|---|
| 1 | build / deploy | ✅ READY |
| 2 | LP | ✅ 200・CTA「近日公開」・アプリへのリンクなし・index/follow・規約リンク |
| 3 | アプリ直接アクセス | ✅ ログイン済み → マイイベント、未ログイン → ログイン画面 |
| 4 | CEO のメールでの 6桁ログイン | ⏸ CEO 操作待ち（受信箱を見られないため） |
| 5 | 日本語メールの件名・本文・表示 | ⏸ CEO 操作待ち |
| 6 | 新規ユーザー登録 | ✅ テストアカウントで確認（Resend 送信・6桁検証・profile 作成）。CEO の実メールは 4 と同時に |
| 7 | 既存ユーザー再ログイン | ✅ 同上（同一アカウント・重複なし） |
| 8 | イベント作成 | ✅ |
| 9 | グッズ登録・画像 | ✅ 3件、画像は WebP（full 46KB / thumb 10KB）で保存・署名URLで表示 |
| 10 | 所持/未所持 | ✅ |
| 11 | リロード後保持 | ✅ |
| 12 | 共有リンク生成 | ✅ 本番ドメイン・43文字 |
| 13 | 未ログイン共有閲覧 | ✅ token なし URL へ移動、取得状況非表示、Cookie は HttpOnly・Secure・path /mochico/s、HTML に token なし |
| 14 | 別ユーザーで追加 | ✅ |
| 15 | 所持の分離 | ✅ UI（A 1/3・B 2/3）と DB の両方 |
| 16 | 共有停止 | ✅ 新規閲覧不可・既存 B は継続。**⚠ 停止リクエストの URL に token が載る（22 参照）** |
| 17 | 退会と保全 | ✅ UI 削除、DB（auth/profile/所持/参加削除、イベント保全・owner_id NULL、R6）、B は閲覧継続・編集/共有なし・A の情報なし（1回目は表示待ちのタイミングで失敗、再実行で全項目合格） |
| 18 | cleanup endpoint | ✅ 認証なし/誤り/長さ違い → 404、正しい secret → 200（削除 0 件） |
| 19 | PWA | ✅ manifest（short_name・iOS タイトル「Mochico」、start_url、scope、standalone、アイコン200）、SW 登録、設定の案内 |
| 20 | AdSense | ✅ アプリ画面の広告リクエスト 0（ローダーのみ取得） |
| 21 | noindex | ✅ アプリ・共有は X-Robots-Tag noindex + private no-store、sitemap は /mochico のみ |
| 22 | 漏洩 | ⚠ 秘密値（service role・cleanup/cron・DB パスワード）は本番 HTML/JS 114 応答・リクエスト・コンソールに無し（陽性対照あり）。GA/Vercel Analytics 送信 0、Referer・外部への token 送信なし。**ただし共有停止時に owner のブラウザから Supabase への `PATCH /rest/v1/share_links?token=eq.<token>` が発生 → Supabase の API ログに token が残る** |
| 23 | 既存 ToolBoxJP | ✅ / /tools /blog /sns-starter-kit /privacy /terms /tools/pdf-merge /robots.txt /sitemap.xml /manifest.json すべて 200 |

- 22 の影響: 送信先は自前の Supabase（第三者ではない）、ログを見られるのはプロジェクト管理者のみ、しかもその token は同じリクエストで失効する。重大度は低いが要件（ログへ漏らさない）に反するため STOP
- 修正: 停止を `event_id` + `status=active` で指定（有効リンクはイベントごとに1件のみの DB 制約あり）。release ブランチ `2f4bf12`、ローカルで tsc/lint/build・共有/退会 E2E 12/12 合格。**本番 deploy は CEO 承認待ち**
- テストデータ: すべて削除済み（users 0・events 0・画像 0・share_links 0）。途中でテストスクリプトが自身の不具合で停止した1回分も検出・削除済み
