# GOODS MANAGER — PWA / HOME SCREEN ONBOARDING REPORT

- 作成日: 2026-10-03
- 状態: **実装完了・全テスト合格**（2026-10-04 更新）。アプリ本体は未コミット・本番未反映（ローカルのみ）。
- 2026-10-04: Mochico へのブランド移行に伴い、パスは `/goods` → `/mochico`（scope `/mochico`、start_url `/mochico/app`、SW `public/mochico-sw.js`、オフライン `public/mochico-offline.html`、localStorage キー `mochico.a2hs.v1:`）に変更。`/goods` は 308 で `/mochico` 配下へ転送。詳細は `MOCHICO_LAUNCH_REPORT.md`。

## 既存PWA構成（確認結果）
- ToolBox 全体: `/manifest.json`（ToolBox・start_url `/`）のみ。Service Worker なし。**変更していない**
- /goods: 専用マニフェスト・アイコン・apple-touch-icon・`apple-mobile-web-app-capable`・theme-color・standalone 時のヘッダー/フッター非表示（前回実装）

## 追加・変更
| 項目 | 内容 |
|---|---|
| アプリ名 | `lib/goods/app-meta.ts` に集約（仮称「グッズ管理」。ここだけ変えれば全体に反映） |
| マニフェスト | `start_url` と `scope` を **`/goods`** に変更（`/goods/` だと `/goods` 自体が範囲外になるため）。id も `/goods` |
| Service Worker | `public/goods-sw.js`（scope `/goods`）。**/goods 配下のページ遷移が通信失敗したときに静的なオフライン案内ページ `/goods-offline.html` を返すだけ**。アプリの JS・API 応答・画像・個人データはキャッシュしない（キャッシュは1枚のみ）。開発モード・非HTTPSでは登録しない |
| 案内カード | `HomeScreenPrompt`（マイイベントにのみ表示・1.5秒後）。文言は「ホーム画面に追加」「次回からアプリのようにすぐ開けます」。専門用語なし |
| iPhone 導線 | 「ホーム画面に追加」→ 3ステップのガイド（Safari: 「…」→「共有」→「ホーム画面に追加」→「Webアプリとして開く」オンのまま「追加」／iPhone の Chrome 等: 共有ボタン→「ホーム画面に追加」→「追加」／LINE 等のアプリ内ブラウザ: 「Safariで開く」を案内）。図は説明用で押せない |
| Android 導線 | ブラウザ標準の `beforeinstallprompt` をレイアウトで捕捉し、カードの「ホーム画面に追加」タップ時に `prompt()` を直接呼ぶ → 標準のインストール確認 →「インストール」（**2タップ**、最終確認はユーザー）。Chromium 系では確認画面を出せる状態になるまでカードを出さない（メニューを探させない）。承認→完了、キャンセル→7日抑制 |
| install済み判定 | `display-mode: standalone/fullscreen/minimal-ui` と `navigator.standalone`。ホーム画面起動中は表示しない。Android は `appinstalled` も利用。判定できない環境は断定しない |
| 再表示ルール | 端末内（localStorage・ユーザー単位）。「あとで」/×=7日、iPhone ガイド表示後=30日、「今後表示しない」=表示しない、Android 承認=完了。設定画面「ホーム画面への追加方法」からいつでも再確認 |

## セキュリティ
構成プロファイル・証明書・外部アプリ・追跡・追加権限は一切要求しない。標準の Web App の範囲のみ。SW は個人データを保持しないため、ユーザー切替で他人のコレクションが出ることはない。

## テスト結果
- PWA E2E `e2e/goods/pwa.spec.ts`: **11/11 合格**（iPhone Safari 初回表示・3ステップ・30日抑制／あとで7日・期限後再表示・今後表示しない・設定から再確認／standalone 非表示／PC 非表示／iPhone Chrome・LINE の案内出し分け／Android 標準確認の直接呼び出し（承認・キャンセル）／ユーザー切替・ログアウト再ログイン／共有URLからのログイン直後は出さない／マニフェスト／SW はオフライン案内1枚のみキャッシュ・ToolBox 本体は SW 管理外）
- DB: RLS 65/65、共有 90/90、退会 68/68 合格
- build 成功。既存 ToolBoxJP のルートは origin/main と差分なし（Middleware 行のみ）。秘密情報の混入なし
- 全体 E2E: **33/33 合格**、PWA 11/11 合格。SW により Playwright の `page.route` が通信を捕捉できなくなる問題は、通信差し替えを行う spec（regression / goods）に `test.use({ serviceWorkers: "block" })` を追加して解消（アプリ側の変更なし）

## 実機未確認
- iPhone 実機での案内表示・ガイドの手順の一致（特に iOS 26 の「…」→「共有」の位置）・ホーム画面アイコンからの起動・**ホーム画面アプリでは Safari とログイン状態が別のため初回再ログインが必要**
- Android 実機での標準インストール確認（**HTTPS が必須**のため、http の Acceptance 環境では出ない。また Chrome は「1回以上タップ」「30秒以上閲覧」の条件を満たすまで確認画面を出さない）
- SW のオフライン案内（HTTPS 環境での動作）

## Production前に必要な確認
HTTPS の Preview/本番で: iPhone・Android でのホーム画面追加と起動、Android の標準確認画面、オフライン案内、ログイン状態の維持。
