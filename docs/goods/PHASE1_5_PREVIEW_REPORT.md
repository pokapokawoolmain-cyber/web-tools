# PHASE 1.5 PREVIEW REPORT — User Acceptance Preview Preparation

- 作成日: 2026-10-01
- ブランチ: `feature/goods-manager`（worktree `~/web-tools-goods`、未コミット・未push）
- 判定（Development 側）: **Phase 1 User Acceptance Ready**
- Phase 2（共有機能）には着手していない。Phase 2 開始判断は Development 側では行わない。

## 守った制約
| 制約 | 状態 |
|---|---|
| 本番 Supabase を作成しない | ✅ 作成していない |
| Production Vercel へ接続しない | ✅ Vercel には一切アクセスしていない（Preview デプロイもしていない） |
| main へ merge しない | ✅ 未コミット・未push |
| Product #01 等の既存作業に触れない | ✅ `~/web-tools`（main の作業ツリー）は読み取りのみ。変更なし |
| feature/goods-manager の隔離維持 | ✅ |
| Phase 2 に着手しない | ✅ |

---

## 1. Acceptance Preview 準備内容

### 1-1. Preview の方式（外部公開は見送り）
外部 Preview の候補を検討し、**見送り**とした。
| 候補 | 判断 |
|---|---|
| Vercel Preview デプロイ | 見送り。Vercel プロジェクトは本番と同一で、Preview から到達できる DB は本番インフラ側にしか用意できない（ローカル DB へはつながらない）。指示「本番インフラを勝手に作らない」に抵触 |
| トンネル（ngrok 等）でローカルを公開 | 見送り。ローカル Supabase（既定の公開鍵・service role 鍵）をインターネットへ晒すことになり安全でない |
| **ローカル本番ビルド＋同一 Wi‑Fi（LAN）からのアクセス** | **採用**。インターネットには出さず、CEO のスマホ実機で触れる |

- `npm run goods:acceptance`（PC のみ）/ `npm run goods:acceptance -- --lan`（同じ Wi‑Fi のスマホからも）
- 本番ビルド（`next build` → `next start`）で起動するため、開発モードより実際の体感に近い
- `--lan` はプライベート IP（10./172.16-31./192.168.）以外では起動を拒否
- 現在 `--lan` モードで起動中: PC `http://localhost:3300/goods` / スマホ `http://192.168.68.54:3300/goods`

### 1-2. テストデータ（TASK 3）
`npm run goods:seed-acceptance`（ローカル Supabase 以外への接続は拒否。何度でも初期化可能）
- アカウント: `ceo-acceptance@example.test`（ログインは6桁コード、Mailpit で確認）
- Sample Live 2026 [テストデータ]: 17商品（Tシャツ×2・ペンライト・タオル×2・アクスタ・缶バッジ・トート・キーホルダー・パンフ・パーカー・ステッカー・ブランケット＋崩れ確認用の長い商品名・価格未定・画像なし×2）、5件取得済み、カバー画像あり
- Sample 大量テスト 120商品 [テストデータ]: 40件取得済み、一部画像なし
- Sample コンプリート済み [テストデータ]: 4商品すべて取得済み
- 商品画像は実在ブランドを使わず、Canvas で「絵文字＋商品名＋SAMPLE / TEST DATA」を描いて生成
- すべてのイベント名に [テストデータ]、概要に「Acceptance 用のテストデータ」と明記

### 1-3. ガイド
`docs/goods/PHASE1_USER_ACCEPTANCE_GUIDE.md`（A〜R の操作手順と期待結果、スマホ/PC/HEIC チェックリスト、不具合報告テンプレート）

---

## 2. 変更ファイル（Phase 1 からの差分）

### バグ修正（アプリ）
| ファイル | 内容 | 理由 |
|---|---|---|
| `lib/goods/uuid.ts`（新規）, `app/goods/_components/GoodsForm.tsx`, `lib/goods/image/storage.ts` | `crypto.randomUUID` が無い環境向けのフォールバック（`getRandomValues` で v4 UUID） | **非 HTTPS（LAN の http）では `crypto.randomUUID` が undefined** で、グッズ登録・画像アップロードが失敗する。実際に `isSecureContext=false / randomUUID=undefined` を確認したうえで修正 |
| `app/goods/_components/GoodsBoard.tsx` | カードを行内で同じ高さに（`h-full`） | 同じ行でカード枠の高さが揃わなかった |
| 同上 | 価格をカード下端に揃える（`mt-auto`）、「価格未定」を控えめな色に | カテゴリの有無で隣のカードと価格の縦位置がずれていた。「価格未定」と金額の区別がつきにくかった |

大きなデザイン変更（色・余白・レイアウト方針）は行っていない。

### テスト・Acceptance 用（新規）
- `e2e/goods/regression.spec.ts` — 既知問題の回帰テスト4件
- `scripts/goods-seed-acceptance.mts` — Acceptance 用テストデータ
- `scripts/goods-acceptance-preview.sh` — Acceptance Preview 起動
- `package.json` — scripts `goods:seed-acceptance` `goods:acceptance` を追加
- `docs/goods/PHASE1_USER_ACCEPTANCE_GUIDE.md` / `PHASE1_5_PREVIEW_REPORT.md`

### リポジトリ外
- `~/manzokuya/.claude/launch.json` に `toolboxjp-goods-acceptance`（port 3300、`--lan`）を追加（このセッションのプレビュー起動用）

---

## 3. 再実行したテストと結果（すべて 2026-10-01 に実行した実測値）

### TASK 1: 現在状態の再確認（変更前）
| 項目 | 結果 |
|---|---|
| TypeScript | ✅ エラー0 |
| build | ✅ 成功 |
| DB / RLS / Storage テスト | ✅ 65 / 65 |
| Playwright（Phase 1 の8件） | ✅ 8 / 8 |
| 既存 ToolBoxJP への影響 | ✅ origin/main（1423894・前回から変化なし）のビルドと比較し、/goods 以外の177ルートのレンダリング種別が完全一致（差分は Middleware 行のみ）。共通 JS 102kB で不変 |

### 最終（今回の修正後）
| 項目 | 結果 |
|---|---|
| ESLint（goods 関連・テスト・スクリプト） | ✅ エラー0 |
| build | ✅ 成功。既存ルート差分なし・共通 JS 102kB |
| service role / secret 実値のクライアント混入 | ✅ なし |
| DB / RLS / Storage テスト | ✅ **65 / 65** |
| Playwright 全体 | ✅ **12 / 12**（Phase 1 の8件＋回帰4件） |

### TASK 6: 既知問題の回帰テスト（自動・通常操作以外の条件で再現）
| # | 条件 | 結果 |
|---|---|---|
| R1-a | **2連打**、1本目の通信を1.5秒遅延 | ✅ 送信は owned → unowned の順。**2本目は1本目の完了後に送信**（直列化を時刻で検証）。UI・リロード後とも「未取得」で一致 |
| R1-b | **3連打**、1本目を1.2秒遅延 | ✅ 中間状態を送らず最新の希望（owned）だけを送信。UI・リロード後とも「取得済み」 |
| R1-c | **連打中に1本目の通信が失敗** | ✅ エラー表示、UI とリロード後の保存値が一致。失敗後にユーザーが押していない限り古い値を自動再送しない |
| R2 | **DB（PostgREST コンテナ）を実際に停止**して再読み込み | ✅ **10.6〜12.9秒**で「前回データ（閲覧のみ）」へ切替（修正前は約47秒）。閲覧専用中のタップは「変更できません」。コンテナ復旧後は通常表示へ戻る |

### TASK 2: 非 HTTPS（スマホから LAN 経由と同じ条件）
Playwright（iPhone 13 相当、`http://192.168.68.54:3300`）で実施:
`isSecureContext=false`、`crypto.randomUUID=undefined` の状態で、ログイン → Sample Live 表示（5/17・サムネ読込）→ 画像付きグッズ登録 → 取得切替 → リロード後も保持、ページエラー0。
（※同じ Mac から LAN IP 経由でアクセスしたもの。**別端末（実機）からの接続は未確認**。macOS のファイアウォール設定によっては接続を許可する必要がある）

### TASK 5: UI セルフチェック
| 項目 | 結果 |
|---|---|
| 商品画像の大きさ（2列で正方形、約170px） | ✅ 何の商品か判別できる |
| 商品名の読みやすさ（13px 太字・2行で省略） | ✅ |
| 価格の認識しやすさ | ✅（下端揃えに修正） |
| 取得済みの即時判別（チェック＋「取得済み」＋ピンク枠） | ✅ |
| 未取得が暗すぎないか | ✅ 画像は通常の明るさ、「未取得」ラベル付き |
| 2列が狭すぎないか / カード高さ | ✅（高さ揃えを修正） |
| 画像比率の統一 | ✅ 全カード正方形 |
| 長い商品名 / 価格未定 / 画像なし | ✅ 崩れなし（テストデータで確認） |
| 100商品以上 | ✅ 120件で描画・スクロール・遅延読込 |
| 切替の反応 | ✅ 即時反映（楽観的更新）、押し込みアニメーション、Android は短い振動 |
| 誤タップから戻せるか | ✅「元に戻す」（6秒） |
| Loading / Empty / Error | ✅ スケルトン・空状態・エラー・閲覧専用フォールバックとも実装済み |
| スマホ下部の操作性 | △ 右下の「グッズ追加」ボタンがスクロール最下部の最後のカードやフッターに重なる（スクロールで回避可）。**好みに関わるため変更せず Acceptance で判断** |

Acceptance で判断いただきたい（Development 側では変えていない）点:
- 「グッズ追加」ボタンを一覧の最下部でも常に表示するか
- 「元に戻す」の表示時間（6秒）
- 初期テーマがダーク（ToolBox 全体の設定に従っている）
- カード内の情報量（カテゴリ・商品名2行・価格）

---

## 4. 既知問題
| # | 内容 |
|---|---|
| K1 | **ローカル Supabase の Docker ポート（API 55321・DB 55322・Mailpit 55324）は `0.0.0.0` で待ち受けており、同じネットワークの他端末から到達可能**（Supabase CLI の既定。Phase 1 開始時点から同様）。中身はテストデータのみだが、公開デモ鍵で全権操作できる状態。信頼できるネットワークでのみ使い、使わないときは `supabase stop --workdir supabase-goods` を推奨 |
| K2 | Acceptance Preview はローカル（Mac 起動中のみ）。外部から触れる Preview は本番インフラ判断とセット |
| K3 | メール内のログインリンクは Acceptance 環境（3300）では使えない（ローカル Auth の Site URL が 3100 のため）。6桁コードを使う |
| K4 | 完全オフラインでのページ表示は不可（Service Worker なし） |
| K5 | Acceptance サーバーと E2E は同じ `.next` を使うため同時に動かさない（E2E 実行後は `npm run goods:acceptance` で再ビルドが必要） |
| K6 | Phase 1 レポート記載の K5〜K9（署名URLのキャッシュ、アカウント削除未実装、マージ時の衝突、本番 Postgres での確認、計測ツールへの URL 送信）は引き続き有効 |

## 5. 未確認事項（実機未確認は「未確認」）
- **iPhone Safari 実機：未確認**
- **Android Chrome 実機：未確認**
- **本物の HEIC 写真（選択・変換・圧縮・アップロード・表示）：未確認**（確認項目はガイド §8 に記載）
- カメラ直接撮影からの登録：未確認
- 別端末から LAN 経由での接続：未確認（同一 Mac からの LAN IP アクセスのみ確認）
- Google ログイン：未確認（ローカルに資格情報なし、ボタン非表示）
- 低速モバイル回線での体感：未確認

## 6. Phase 2 へ進める状態か
- Development 側の判断は行わない（指示どおり）。
- 技術的な前提（DB 構造・RLS・share_links テーブル・`/goods/s/[token]` のルート確保）は Phase 1 で用意済み。
- **ただし、上記「未確認事項」の実機確認と、CEO による User Acceptance の結果を受けてから判断いただく前提**で、ここで停止する。

---

## 追記（2026-10-02）: ホーム画面追加でグッズ管理専用アプリとして起動

CEO の Acceptance で「おおむね良い。ホーム画面に追加したときにグッズ管理専用アプリとして使えれば可」というフィードバックを受け、対応した。

### 変更
| ファイル | 内容 |
|---|---|
| `app/goods/manifest.webmanifest/route.ts`（新規） | /goods 専用マニフェスト（name「グッズ管理 \| ToolBox」/ short_name「グッズ管理」/ start_url `/goods/events` / scope `/goods/` / standalone / アイコン192・512・maskable512） |
| `lib/goods/app-icon.tsx`・`app/goods/app-icon/[variant]/route.tsx`・`app/goods/icon.tsx`・`app/goods/apple-icon.tsx`（新規） | 専用アイコン（ピンク＋白チェック）。/goods 配下のみ ToolBox のアイコンを上書き |
| `app/goods/layout.tsx` | metadata で manifest・appleWebApp（タイトル「グッズ管理」）・`apple-mobile-web-app-capable`・theme-color を /goods 配下のみ上書き |
| `app/goods/goods.css` | ホーム画面から起動（`display-mode: standalone`）したときだけ ToolBox のヘッダー・フッターを隠す。上部固定バーとフィルターの位置を CSS 変数で切替 |
| `GoodsSubNav.tsx`・`GoodsBoard.tsx` | 固定位置を CSS 変数参照に変更 |
| `middleware.ts` | アイコン・マニフェスト取得時はセッション確認を行わない（matcher から除外） |

ToolBox 本体（root layout・Header・Footer・`/manifest.json`）は変更していない。トップページの manifest は従来どおり `/manifest.json`・ToolBox アイコンであることを確認済み。

### 確認結果
- build ✅ / 既存ルートのレンダリング種別差分なし ✅ / Playwright 12/12 ✅ / RLS 65/65 ✅ / ESLint ✅
- /goods のページで manifest・apple-touch-icon・`apple-mobile-web-app-capable`・タイトル「グッズ管理」が出力されることを確認（LAN 経由でも同様）
- アイコン画像（192・512・maskable・apple 180）の生成を確認
- standalone 表示の見た目: Chrome の自動操作では display-mode をエミュレートできなかったため、ビルド済み CSS の standalone 用ルールをページに適用して確認（ヘッダー・フッター非表示、上部バー top=0、フィルター top=48px）

### 未確認
- **iPhone・Android 実機でのホーム画面追加と起動：未確認**
- **Android は http の Acceptance 環境ではアプリとしてインストールされない可能性が高い**（HTTPS が条件）。全画面での最終確認は HTTPS 環境（本番 or Preview）が必要で、これは本番インフラ判断とセット

