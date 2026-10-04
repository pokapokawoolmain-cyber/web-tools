# GOODS MANAGER — PHASE 2 DEVELOPMENT REPORT（Shared Catalog / Personal Collection）

- 作成日: 2026-10-02
- ブランチ: `feature/goods-manager`（worktree `~/web-tools-goods`、**未コミット・未push・main 未マージ**）
- 判定（Development 側）: **Phase 2 User Acceptance Ready**
- 本番 Supabase・Production Vercel には接続していない。Product #01 の作業ツリー（`~/web-tools`）には触れていない。Phase 3 には着手していない。

---

## 1. 実装概要
| # | 指示 | 実装 |
|---|---|---|
| 1 | 共有リンク発行（オーナー） | Event Detail に「共有」ボタン（オーナーのみ表示）→ 共有シートで発行 |
| 2 | コピー | 「コピー」（Clipboard API、使えない http 環境では選択コピーにフォールバック）＋ 対応端末では OS の共有シート（「送る」） |
| 3 | 失効 | 「共有を停止（リンクを失効）」＋確認ダイアログ。失効は一方通行 |
| 4 | 有効期限 | 期限なし（既定）/ 7日間 / 30日間。サーバー時刻で設定・判定 |
| 5 | 匿名閲覧 | `/goods/s/[token]` → カタログ（イベント・グッズ・画像・名前・価格・概要・カテゴリ）。所持状態は出さない |
| 6 | 自分の管理に追加 | 未ログイン → ログイン → 元の共有ページへ戻る → 自動で追加 → 自分の Event Detail |
| 7 | event_membership | 参加 = `event_memberships` に本人の1行（role `member`）。UNIQUE(user_id, event_id) |
| 8 | ユーザー別 ownership | 既存の `ownerships`（user_id 単位）をそのまま使用。参加時に行を作らない（行なし = 未取得） |
| 9 | 共有後の追加・編集反映 | event / goods を共有参照しているため自動で反映（コピーしない） |
| 10 | 共有元削除 | soft delete。参加者には「作成者によって削除されています」と表示し、本人が「マイイベントから外す」を選べる |
| 11 | エラー状態 | invalid / 共有終了 / 期限切れ / 利用不可 / 通信エラー / 再読込切れ を区別（内部情報は出さない） |
| 12 | RLS / Server Boundary | 匿名カタログは service_role 専用関数＋サーバー経由のみ。anon への SELECT 許可なし |
| 13 | トークン漏洩対策 | トークンを HttpOnly Cookie に移してトークンを含まない URL へリダイレクト（§13） |
| 14 | テスト | 共有 DB/RLS 90件、E2E（共有11件含む）23件、既存 RLS 65件、すべて PASS |

---

## 2. Architecture

```
            ┌────────────── 1 Event Catalog ──────────────┐
            │ events (1行)  goods (N行)  Storage画像 (1組) │  ← コピーしない
            └──────────────────────────────────────────────┘
                 ▲ event_memberships（参加 = 1行だけ）
   owner A ──────┤ role=owner
   member B ─────┤ role=member
   member C ─────┘ role=member
                 ▼ ownerships（各自の行だけ。行なし = 未取得）
   A: Goods1=owned        B: Goods2=owned        C: （行なし）
```

共有URLのリクエストの流れ:
```
/goods/s/<token>            → Route Handler: 描画しない。token を HttpOnly Cookie へ → 303 /goods/s/view
/goods/s/view               → Server Component: Cookie の token を service_role 専用関数で検証
                               → カタログのみ取得 → 画像パスをサーバーで一括署名 → 描画
「ログインして追加」         → /goods/login?next=/goods/s/view?join=1（token は URL に出ない）
ログイン後 /goods/s/view?join=1 → 自動で POST /goods/s/join
POST /goods/s/join          → 本人セッションで goods_join_via_share（auth.uid() 本人の membership のみ）
                               → Cookie 削除 → /goods/events/<id>?added=1
```

## 3. DB変更
| 対象 | 変更 | 理由 |
|---|---|---|
| `event_memberships.role` | `viewer` → **`member`**（CHECK を owner/member に） | 指示の名称に統一。既存 viewer 行は member へ更新（ローカルのテストデータのみ） |
| `share_links.created_by` | **追加**（default `auth.uid()`、ON DELETE SET NULL） | 誰が発行したかの監査。RLS 上オーナー以外は発行できないため、実質オーナーの記録 |
| `share_links` 部分 UNIQUE | `(event_id) WHERE status='active'` | 1イベントにつき有効リンクは1本。再発行時は旧リンクを同一トランザクションで失効 |
| `share_links` トリガー | 失効は一方通行・`revoked_at` はサーバーが記録・`expires_at`/`created_by` 変更不可（アカウント削除時の NULL 化のみ許可） | 失効済みリンクの復活や期限延長で、意図せず再公開されるのを防ぐ |
| `goods_my_events()` | `deleted` 列を追加。作成者が削除したイベントを **member には残す**（オーナーには出さない） | 「突然消すより状態を明示」の方針 |
| token の UNIQUE | Phase 1 から設定済み（変更なし） | — |

## 4. Migration
`supabase-goods/supabase/migrations/20261003000000_goods_share.sql`（ローカルにのみ適用）
- ローカル DB を**空の状態から作り直し**、Phase 1 の `20261001000000_goods_init.sql` → 本 migration の順で適用できることを確認済み
- 新規関数: `goods_create_share_link`（invoker）/ `goods_resolve_share`（内部用・実行権限なし）/ `goods_get_shared_catalog`（service_role 専用）/ `goods_join_via_share`（authenticated 専用）/ `goods_share_relation`（authenticated 専用・副作用なし）/ `goods_share_link_guard`（トリガー）

## 5. RLS変更
- **テーブルのポリシーは追加・緩和していない**（anon は引き続き全テーブル権限なし。`USING (true)` なし）
- `event_memberships` への直接 INSERT は引き続き誰にも許可しない。参加は `goods_join_via_share` のみ（内部で `auth.uid()` を使用 → 他人の membership は作れない）
- 既存ポリシー `memberships_delete_own_viewer`（role <> 'owner' の自分の行のみ削除可）が member にもそのまま効く → 「マイイベントから外す」
- 関数の実行権限は `public / anon / authenticated` から一旦すべて剥奪し、必要なロールにだけ付与

## 6. Share Token設計
- 32バイトの暗号学的乱数（`gen_random_bytes`）の base64url、43文字。連番・event ID・user ID を含まない（テストで確認）
- token は UNIQUE。形式外（43文字の base64url 以外）は DB を引かずに invalid
- 状態判定はすべてサーバー（DB の `now()`）: 存在 → `status=active` かつ `revoked_at IS NULL` → `expires_at` 未到来 → イベント未削除
- 1イベント1有効リンク。再発行で旧リンクは自動失効

## 7. Server Boundary
- 匿名のカタログ取得は **`goods_get_shared_catalog`（service_role 専用）を Next.js サーバーだけが呼ぶ**。ブラウザ（anon / authenticated）からは実行不可（テストで確認）→ ブラウザから DB を探索する経路がない
- 返す項目はカタログのみ: イベント（タイトル・概要・日付・カバー）、グッズ（名前・価格・概要・カテゴリ・画像）。owner_id・メール・membership・ownership・event ID・goods ID は返さない（テストで JSON を検査）
- 画像は非公開バケットのまま。サーバーが service_role で**1回のまとめ署名**（1時間有効）をしてからブラウザに渡す
- service_role を使うのは `lib/goods/supabase/admin.ts`（`server-only`）だけ。用途はカタログ取得と署名の2つに限定
- 参加は本人セッションで `goods_join_via_share` を呼ぶ Route Handler（POST・同一オリジン検証）

## 8. Membership設計
- 参加 = `event_memberships(user_id, event_id, role='member', joined_at)` の1行。UNIQUE(user_id, event_id)＋`ON CONFLICT DO NOTHING`
- 二重タップ・並列送信: UI でボタン無効化＋送信中フラグ、DB で一意制約（8並列でも1行をテストで確認）
- オーナーが自分のリンクを開いても member 行は作らない（`owner` を返す）
- オーナーでも membership 一覧（誰が参加したか）は見えない（自分の行のみ SELECT 可）

## 9. Ownership isolation
- `ownerships` の RLS は Phase 1 のまま `user_id = auth.uid()`。オーナーにも他人の行を見る権限はない
- テストで確認: B→A、C→A、A→B の SELECT・UPDATE・DELETE すべて0件、他人名義の INSERT 不可
- 匿名カタログ・共有ページには ownership を一切含めない

## 10. Catalog sync
- event / goods は1組を全員が参照するため、オーナーの追加・編集は再読込時にそのまま反映（リアルタイム反映は未実装）
- 追加商品は ownership 行がない = 未取得として表示。参加時・商品追加時に ownership を一括生成しない（150商品・2人参加で ownership 0行増加を確認）
- 商品編集後も各自の ownership は不変（goods_id で紐づくため）

## 11. Soft delete behavior
| 操作 | 挙動 |
|---|---|
| 商品削除（オーナー） | `deleted_at` を設定。全員の一覧・共有カタログから非表示。各自の ownership 行は残る（参照整合性維持）。削除済み商品の取得状態は変更不可 |
| イベント削除（オーナー） | `deleted_at` を設定（行は残る）。オーナーのマイイベントからは消え、member には「削除済み」バッジ付きで残る。詳細画面は「このイベントは作成者によって削除されています」＋「マイイベントから外す」。共有リンクは有効でも閲覧・新規参加不可（unavailable） |
| リンク失効 | 新規閲覧・新規参加不可。**既存 membership は削除しない**。member は引き続き取得状態を更新できる |
| hard delete | 通常操作では行わない（events / goods に DELETE 権限なし） |

## 12. Cache behavior
- 共有ページ（匿名カタログ）は IndexedDB に保存しない。トークンも保存しない（HttpOnly Cookie のみ、1時間、参加後に削除）
- 参加後のイベントは通常どおり `userId:eventId` 単位でスナップショット保存
- **修正**: DB 障害時のオフライン表示が「そのイベントの最新スナップショット」を出していたため、共有イベントでは同じ端末の別ユーザーの取得状況が出る可能性があった → 端末内セッションから本人を特定し、本人のスナップショットだけを出すよう変更（E2E「CACHE」で、最新が別ユーザーの状態でも本人のものが出ることを確認）
- ログアウト時は従来どおり IndexedDB を全消去

## 13. Security対策（トークン漏洩対策を含む）
| リスク | 対策 |
|---|---|
| **GA4 / Vercel Analytics が URL を記録** | ToolBox は全ページで GA4（page_view で page_location を送信）と Vercel Analytics を読み込む。`/goods/s/<token>` はページを描画せず 303 リダイレクトのみ（スクリプトが一切動かない）→ 計測されるのはトークンを含まない `/goods/s/view` だけ |
| ログイン後の戻り先 | `next=/goods/s/view?join=1`（トークンを含まない） |
| Referer | 共有ページに `<meta name="referrer" content="no-referrer">`、リダイレクト応答に `Referrer-Policy: no-referrer`、画像に `referrerPolicy="no-referrer"` |
| console / エラー出力 | トークンをログ出力するコードなし（エラー時も内部情報を出さない） |
| 検索エンジン | `/goods` 全体 noindex（metadata＋`X-Robots-Tag`）。共有ページは `noindex, nofollow, nocache`。sitemap に /goods は含まれない（sitemap は既存ツール・ブログのみから生成） |
| robots だけに頼らない | トークン検証は毎回サーバー側で実施 |
| service role | ブラウザバンドルに実値・`service_role` JWT・環境変数名・カタログ関数名が含まれないことをビルド後に検査 |
| CSRF | 参加 API・ログアウトは POST のみ＋同一オリジン検証 |
| オープンリダイレクト | ログイン後の遷移先は `/goods` 配下の相対パスのみ |

### この Phase で見つけて直した不具合
1. **LAN モード（`next start -H 0.0.0.0`）で共有リンク・ログアウト・ログインのリダイレクトが `http://0.0.0.0:3300` に飛ぶ** → Cookie が届かず「利用できません」になっていた（Acceptance 環境で発見。E2E では未検出だった）。リダイレクトを相対パスに、Origin 検証を Host ヘッダー比較に変更。**E2E サーバーを `-H 127.0.0.1` で起動するよう変更**し、ホスト不一致の条件で常にテストされるようにした
2. **共有リンクを発行したユーザーのアカウント削除が失敗する**（`created_by` の ON DELETE SET NULL を保護トリガーが拒否）→ NULL 化のみ許可。テストの後片付けで削除エラーを見ていなかったため一度見逃した → 削除の成否をテスト項目に追加
3. **共有シート内の確認ダイアログを閉じると共有シートごと閉じる**（React のイベント伝播）→ 自分自身の close のときだけ閉じるよう修正
4. **オフライン表示のユーザー混在**（§12）

## 14. 変更ファイル一覧（Phase 1.5 以降）
### 新規
```
supabase-goods/supabase/migrations/20261003000000_goods_share.sql
lib/goods/share.ts                     共有トークン/カタログ（server-only）
lib/goods/supabase/admin.ts            service role クライアント（server-only、用途2つ）
lib/goods/http.ts                      相対リダイレクト・同一オリジン検証
app/goods/s/[shareToken]/route.ts      入口（Cookie へ移してリダイレクト）※旧 page.tsx（準備中）は削除
app/goods/s/view/page.tsx, loading.tsx 共有カタログ閲覧
app/goods/s/join/route.ts              自分の管理に追加（POST）
app/goods/_components/ShareSheet.tsx   共有シート（作成・コピー・送る・期限・失効）
app/goods/_components/ShareCatalogView.tsx 共有カタログ表示＋追加CTA＋詳細シート
app/goods/_components/LeaveEventButton.tsx マイイベントから外す
scripts/goods-share-rls-test.mts       共有 DB/RLS/Server Boundary テスト（90件）
e2e/goods/share.spec.ts                共有 E2E（FLOW 1〜12＋CACHE）
docs/goods/GOODS_MANAGER_PHASE2_DEVELOPMENT_REPORT.md / PHASE2_USER_ACCEPTANCE_GUIDE.md
```
### 変更
```
app/goods/_components/EventHeader.tsx       オーナーに「共有」、member に「共有されたリスト」
app/goods/events/page.tsx                   「共有」「削除済み」バッジ
app/goods/events/[eventId]/page.tsx         追加完了バナー、削除済み表示、マイイベントから外す
app/goods/events/[eventId]/error.tsx        オフライン表示を本人のスナップショットに限定
app/goods/login/page.tsx                    共有から来た場合の案内
app/goods/auth/callback/route.ts, auth/signout/route.ts  相対リダイレクト・Origin 検証
lib/goods/types.ts, data.ts                 role member / deleted
lib/goods/cache/idb.ts                      ユーザーを問わない読み出し関数を削除
scripts/goods-rls-test.mts                  role viewer → member
scripts/goods-seed-acceptance.mts           2人目のテストアカウント
e2e/goods/helpers.ts                        ログイン後の着地先指定・管理クライアント
playwright.config.ts                        E2E サーバーを -H 127.0.0.1 で起動
package.json                                script goods:share-test
.env.example                                GOODS_SUPABASE_SERVICE_ROLE_KEY（サーバー専用）
```

## 15. RLS test結果（2026-10-02、ローカル DB を空から作り直した後に実行）
- **共有テスト `npm run goods:share-test`: 90 passed / 0 failed**（§23 の全項目を含む）
  - A/B/C/anon のイベント・商品編集権限、ownership の SELECT/UPDATE/DELETE 越境、anon の全件検索不可、invalid / expired / revoked トークン、event UUID をトークンに使えない、有効トークンで対象カタログのみ・内部情報なし、B は自分の membership のみ作成可・C の分は不可、重複 membership 防止（8並列で1行）、リンク作成・失効はオーナーのみ、失効後も membership 維持、共有後の追加・編集反映、soft delete、150商品、参加時に ownership 一括生成なし、アカウント削除
- **既存 RLS テスト `npm run goods:rls-test`: 65 passed / 0 failed**
- service role がブラウザバンドルにないこと: ビルド後の `.next/static` 検査で該当なし

## 16. E2E結果
`npm run goods:e2e` → **23 passed / 0 failed**（スキップ表示はスマホ/PC プロジェクトの振り分けによるもの）
| FLOW | 内容 | 結果 |
|---|---|---|
| 1 | A ログイン → イベント → 共有リンク作成 → コピー（クリップボードの中身も一致） | ✅ |
| 2 | 未ログインで開く → イベント・グッズ表示、所持状態なし、URL/HTML にトークンなし、noindex・no-referrer | ✅ |
| 3 | B が共有URL → ログイン → 同じ共有イベントへ戻る → 自動追加 → マイイベントに「共有」付きで表示 | ✅ |
| 4 | B が取得済み → reload で保持 | ✅ |
| 5 / 11 | A の状態は独立（B の取得は A に出ない）、DB 上も A・B 別々に保持 | ✅ |
| 6 / 7 | A の商品追加が B に表示（未取得が初期値）、A の編集が B に反映し B の取得状態は不変 | ✅ |
| 8 | 失効 → 新規アクセス拒否（「共有が終了」）、B は引き続き利用・更新可 | ✅ |
| 9 | 期限切れ・存在しないトークン・event UUID を拒否 | ✅ |
| 10 | 追加ボタン連打 → membership 1件、再訪時「追加済み」 | ✅ |
| 12 | B に共有・編集・追加の導線なし、編集URLは「権限がありません」 | ✅ |
| CACHE | 同じ端末でユーザーが切り替わっても、オフライン表示は本人のもの | ✅ |

LAN モードの Acceptance 環境（`http://192.168.68.54:3300`）でも Playwright で一連の流れ（作成・フォールバックコピー・匿名閲覧・ログイン後自動追加・A/B 分離・ログアウト・失効）を確認。

## 17. Regression結果
| 項目 | 結果 |
|---|---|
| Phase 1 E2E（作成・10商品・取得・reload・再ログイン・Undo・通信失敗・フィルター・不正画像・他人アクセス・2列/5列） | ✅（23件の内数） |
| 回帰（2連打・3連打・連打中の失敗・DB 無応答フォールバック 約10〜13秒） | ✅（23件の内数） |
| 既存 RLS / Storage（画像アップロード制限含む） | ✅ 65/65 |
| build / 型 / ESLint | ✅ |
| 既存 ToolBoxJP | ✅ origin/main と比べ /goods 以外の全ルートのレンダリング種別が一致（差分は Middleware 行のみ）、共通 JS 102kB 不変 |

## 18. Scale test結果
- 150商品のイベント: 共有カタログ取得は関数1回（DB 内 約5ms）、画像署名は1回のまとめ呼び出し（N+1 なし）
- 2人参加後も goods 150行のまま（複製なし）、ownership は0行増加
- Phase 1 から引き続き 120商品のスクロール・遅延読込を確認済み

## 19. 未確認事項
- **iPhone Safari・Android Chrome 実機：未確認**（共有シートの「送る」は HTTPS 環境のみ表示。http の Acceptance 環境では出ない）
- **本物の HEIC：未確認**
- **Google OAuth：未確認**（ローカルに資格情報なし）
- 本番の GA4 / Vercel Analytics に実際にトークンが送られないこと：**本番環境では未確認**（ローカルでは計測スクリプトが無効。構造上、トークン入り URL ではスクリプトが動かないことを確認）
- 別端末から LAN 経由での接続：未確認（同じ Mac から LAN IP 経由で確認）

## 20. 既知問題
| # | 内容 |
|---|---|
| K1 | 共有ページの画像 URL（署名付き）には Storage のパス（event UUID・goods UUID）が含まれる。認証情報ではなく、RLS / 非公開バケットにより単独では使えないが、ページのソースからは見える |
| K2 | オーナーのアカウントを削除すると、FK の ON DELETE CASCADE で events が物理削除され、参加者のリストも消える（アカウント削除機能は未実装のため現状は運用上発生しない）。本番前にアカウント削除の方針（イベントの扱い）を決める必要あり |
| K3 | 共有後の追加・編集は再読込で反映（リアルタイム反映なし） |
| K4 | 1イベントにつき有効な共有リンクは1本（再発行すると旧リンクは失効） |
| K5 | 共有 Cookie は1時間有効。共有ページを開いたまま1時間以上経つと「開き直してください」になる |
| K6 | サーバーのアクセスログ（Vercel のリクエストログ）には `/goods/s/<token>` のパスが残る（リダイレクト応答のため不可避）。ログの閲覧権限管理が必要 |
| K7 | ローカル Supabase の Docker ポートが LAN から到達可能（Phase 1.5 から継続） |
| K8 | Phase 1 / 1.5 レポートの既知問題（署名URLのキャッシュ、オフライン起動不可、マージ時の衝突等）は継続 |

## 21. Production前に必要な作業（すべてオーナー承認が必要・未実施）
1. goods 専用 Supabase プロジェクト作成 → migration 2本を順に適用（`supabase-goods/` を使用。Product #01 の `supabase/` と取り違えない）
2. Vercel 環境変数: `NEXT_PUBLIC_GOODS_SUPABASE_URL` / `NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY` / **`GOODS_SUPABASE_SERVICE_ROLE_KEY`（サーバー専用・Production のみ）**
3. Auth: Site URL・Redirect URL（`/goods/auth/callback`）、カスタム SMTP、Google OAuth
4. 本番で GA4 / Vercel Analytics の記録 URL を確認し、`/goods/s/<token>` が記録されていないことを検証（できれば GA4 の除外設定も追加）
5. Vercel のリクエストログの閲覧権限の確認（K6）
6. アカウント削除の方針決定（K2）
7. プライバシーポリシー・利用規約の改訂（共有・投稿画像の扱いを含む）
8. AdSense 自動広告の `/goods/*` 除外
9. HTTPS の Preview 環境で実機確認（iPhone / Android / HEIC / ホーム画面追加 / 共有シートの「送る」）
10. Product #01 とのマージ順序の決定
