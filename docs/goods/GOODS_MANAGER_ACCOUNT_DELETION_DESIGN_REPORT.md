# GOODS MANAGER — ACCOUNT DELETION DESIGN REPORT（Owner Account Deletion / Shared Catalog Preservation）

- 作成日: 2026-10-03
- ブランチ: `feature/goods-manager`（worktree `~/web-tools-goods`、**未コミット・未push・main 未マージ**）
- 判定（Development 側）: **Account Deletion Preservation Ready**
- 本番 Supabase・Production Vercel には反映していない。検証はすべてローカル Supabase。

---

## 1. 変更前の問題
| 経路 | 変更前 | 影響 |
|---|---|---|
| `events.owner_id → auth.users` | **ON DELETE CASCADE** | オーナー退会でイベント物理削除 → goods・member の membership・ownership まで CASCADE で消失 |
| Storage `storage.objects.owner / owner_id` | アップロードした人のユーザーIDを保持 | 参加者は画像を読めるため、メタデータから元オーナーのユーザーIDを辿れる可能性 |
| `share_links` | オーナー退会後もリンクが残る（CASCADE で消えるまで） | 設計次第では退会者のイベントに新規参加が続く |
| 退会機能 | 未実装 | 本人によるデータ削除手段がない |

## 2. 採用したDB設計
**「ユーザーアカウント」と「共有カタログの存続」を分離**する。

```
events
  owner_id      uuid NULL  → auth.users  ON DELETE SET NULL   （NOT NULL を外した）
  preserved_at  timestamptz NULL   作成者が退会し、参加者のために保存されている
  orphaned_at   timestamptz NULL   オーナー不在かつ参加者0人になった時刻（cleanup 対象）
  CHECK (owner_id IS NOT NULL OR preserved_at IS NOT NULL)   オーナー不在の行は必ず preserved
```
- オーナー不在のイベント = **Preserved Read-Only Catalog**。`owner_id IS NULL` で識別でき、元オーナーとの関係は DB 上どこにも残らない
- 参加者の自動昇格はしない。オーナー権限の判定は既存の `owner_id = auth.uid()` のままなので、`NULL` のイベントは**誰も編集できない**（RLS を緩めずに読み取り専用になる）
- 一度 `NULL` になった `owner_id` は、トリガーにより誰にも（service role でも）付け替えられない。`preserved_at` の解除も不可（乗っ取り防止）

検討して採らなかった案:
| 案 | 不採用理由 |
|---|---|
| 退会者を「匿名ダミーユーザー」に付け替える | 実在しない auth ユーザーの管理が必要になり、ダミーに権限が残る。`NULL` の方が「誰の権限でもない」ことが明確 |
| 最古の member をオーナーに昇格 | 指示で禁止。共有した覚えのない人に編集権限が移る |
| イベントを member ごとにコピー | Phase 2 の基本方針（1 Catalog）に反し、画像も複製される |

## 3. FK変更
| FK | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| `events.owner_id` | CASCADE・NOT NULL | **SET NULL・NULL 可** | 退会で共有イベントを消さない。管理画面から auth ユーザーを直接削除しても CASCADE しない |
| `event_memberships.user_id` | CASCADE | CASCADE（変更なし） | 退会者本人の membership は削除（他人の membership は無関係） |
| `ownerships.user_id` | CASCADE | CASCADE（変更なし） | 退会者本人の取得状況は削除 |
| `profiles.id` | CASCADE | CASCADE（変更なし） | 表示名などの個人情報を削除 |
| `share_links.created_by` | SET NULL | SET NULL（変更なし。保護トリガーを NULL 化だけ許可するよう Phase 2 で修正済み） | 発行者の記録を切る |
| `goods.event_id` / `ownerships.goods_id` / `share_links.event_id` / `event_memberships.event_id` | CASCADE | 変更なし | イベントが実際に削除されるのは「参加者0人」の場合だけになったため |

## 4. 退会処理
UI: 設定 →「アカウントを削除」→ 影響の説明 → 「削除」と入力 →「アカウントを完全に削除」
API: `POST /goods/account/delete`（同一オリジン・本人のセッション必須。他人の userId は受け取らない）

`lib/goods/account.ts` `deleteAccount(userId)`:
1. **`goods_prepare_account_deletion(uid)`**（DB・1トランザクション・service_role 専用）
   1. 本人がオーナーのイベントを `FOR UPDATE` でロック
   2. それらの共有リンクを**先に失効**（以後の新規参加を止める）
   3. イベントごとに参加者（role=member）数を確認
      - **0人** → イベントを削除（goods・share_links・membership・その商品の ownership は CASCADE）
      - **1人以上** → オーナーの membership を外し `owner_id = NULL`（→ トリガーで preserved・リンク失効・画像の所有者情報消去）
2. 削除したイベントの画像を Storage API で削除（`{eventId}/` 配下を全件。UUID 形式以外のパスは触らない）
3. `auth.admin.deleteUser(uid)` → profiles・本人の membership（他人のイベントでの参加を含む）・ownership が CASCADE で削除
4. セッション Cookie 破棄 → 端末内キャッシュ（IndexedDB）消去 → 「アカウントを削除しました」

**冪等**: どの段階で失敗しても、再実行すれば続きから完了する（2 の取りこぼしは cleanup の孤立フォルダ掃除でも回収）。

**同時実行**: 退会処理と共有リンクからの参加が同時に走っても、ロック順序（イベント → 共有リンク）をそろえてあるためデッドロックせず、「失効後に参加が紛れ込む」「参加者がいるのに削除される」も起きない（§10 RACE で実測）。

**管理画面から直接 auth ユーザーを消した場合**（退会処理を経由しない）: FK が SET NULL → トリガーにより preserved・リンク失効・画像の所有者情報消去が自動で行われる。参加者0人のイベントは `orphaned_at` が付き、cleanup で削除される。

## 5. Preserved Catalog仕様
| 主体 | できること | できないこと |
|---|---|---|
| 既存 member | 閲覧、自分の取得状況の変更、「マイイベントから外す」 | イベント編集、商品の追加・編集・削除、共有リンク発行 |
| 新規ユーザー | — | 共有URLからの閲覧・参加（リンクは失効、仮に有効リンクがあっても `unavailable`） |
| 元オーナー | （アカウント自体が存在しない） | — |
| service role | （データ修復などの運用） | オーナーの付け替え・preserved の解除（トリガーで拒否） |

UI:
- Event Detail に「このリストの作成者は退会しています。グッズの追加・編集は行われませんが、自分の取得状況はこれまでどおり記録できます。」（個人情報は表示しない）
- マイイベントに「作成者退会」バッジ
- 編集・共有・グッズ追加ボタンは表示しない（RLS でも拒否）

## 6. Storage cleanup
| ケース | 画像 |
|---|---|
| 退会時、参加者0人のイベント | 退会処理の中で即削除 |
| 退会時、参加者ありのイベント（preserved） | **削除しない**（コレクションが壊れるため）。`owner` / `owner_id` メタデータのみ NULL 化 |
| preserved イベントの最後の参加者が外れた | `orphaned_at` を記録 → **猶予期間（既定7日）後**に cleanup でイベントごと削除 → 画像削除 |
| DB にイベントが無いのに Storage に残っているフォルダ | cleanup が検出して削除（取りこぼし対策） |

cleanup（`runOrphanCleanup`）:
- `goods_cleanup_orphaned_events(grace)`: オーナー不在・`orphaned_at` から grace 経過・**削除直前に参加者0人を行ロック付きで再確認**（`FOR UPDATE SKIP LOCKED`）したものだけ削除
- `goods_orphan_storage_event_ids()`: Storage に残る孤立フォルダを列挙
- 定期実行用 `POST /goods/internal/cleanup`（`Authorization: Bearer <GOODS_CLEANUP_SECRET>`。未設定・不一致は 404）。**本番のスケジューラ設定は未実施**

即時削除にしなかった理由: 最後の参加者の「外す」が誤操作だった場合や、退会処理・参加・外す操作が競合した場合に、カタログを取り戻せない削除を避けるため。

## 7. RLS変更
- **テーブルのポリシーは変更していない**（緩めていない）。読み取り専用化は `owner_id = auth.uid()` が `NULL` で常に偽になることで実現
- 追加・変更した関数（すべて `search_path=''`）:
  | 関数 | 実行権限 |
  |---|---|
  | `goods_prepare_account_deletion(uuid)` | service_role のみ |
  | `goods_cleanup_orphaned_events(interval)` | service_role のみ |
  | `goods_orphan_storage_event_ids()` | service_role のみ |
  | `goods_resolve_share` | 実行権限なし（内部用）。オーナー不在を `unavailable` に |
  | `goods_join_via_share` | authenticated。ロック順序を変更（イベント → リンク） |
  | `goods_my_events` | authenticated。`preserved` 列を追加 |
  | トリガー: `goods_protect_columns`（owner_id は NULL 化のみ許可）/ `goods_on_owner_detached`（リンク失効・画像所有者消去・参加者0人なら orphaned）/ `goods_on_membership_removed`（最後の参加者なら orphaned） | — |

## 8. Share Link処理
- 退会処理の最初に、本人のイベントの有効リンクをすべて失効（`revoked_at` はサーバー時刻）
- `owner_id` が NULL になった時点でもトリガーが失効（直接削除の経路も同じ）
- `goods_resolve_share` はオーナー不在のイベントを `unavailable` とするため、仮に有効なリンク行が存在しても閲覧・参加できない（二重の防御）
- **既存 membership は削除しない**（Phase 2 の「リンク失効 ≠ 既存ユーザー追放」を維持）

## 9. 個人情報削除確認
| 情報 | 退会後 |
|---|---|
| auth ユーザー（メール・認証情報・identities） | 削除（`auth.admin.deleteUser`） |
| profiles（表示名） | 削除（CASCADE） |
| 本人の ownership（全イベント） | 削除（CASCADE） |
| 本人の membership（他人のイベントへの参加を含む） | 削除（CASCADE / 退会処理） |
| `events.owner_id` | NULL |
| `share_links.created_by` | NULL |
| Storage `owner` / `owner_id`（保存した画像） | NULL |
| 本人だけのイベント・商品・画像 | 削除 |
| 共有カタログ（タイトル・概要・日付・商品名・価格・概要・画像） | 参加者のために維持（個人を特定する情報ではない） |

テストで、B が読めるあらゆるデータ（イベント・商品・membership・マイイベント・profiles・share_links・Storage 一覧・共有カタログ）を JSON 化し、元オーナーの **user ID・メールアドレス・表示名が含まれない**ことを確認。

## 10. 追加テスト
`npm run goods:account-test` → **68 passed / 0 failed**（本番と同じ `lib/goods/account.ts` を `--conditions=react-server` で直接呼ぶ）
| 指示 | 内容 | 結果 |
|---|---|---|
| TEST 1 | A 退会 → auth・profile・A の membership/ownership 削除、event・goods・画像8枚残存、B の membership・ownership 残存・利用可 | ✅ |
| TEST 2 | B・C 両方利用可・ownership 独立（B は C の行を読めない）、進捗は各自 | ✅ |
| TEST 3 | 参加者0人のイベント（通常・soft delete 済み）→ events・goods・画像を削除、Storage 孤立なし | ✅ |
| TEST 4 | B はイベント編集・商品追加/編集/削除・リンク発行（RPC/直接 INSERT）不可、自分の ownership のみ変更可、自動昇格なし、service role でもオーナー付け替え・preserved 解除不可 | ✅ |
| TEST 5 | 既存リンク失効・新規参加不可・カタログ取得不可・仮に有効リンクがあっても unavailable・既存 member 利用可 | ✅ |
| TEST 6 | B/C から元オーナーの email・profile・user ID・表示名を取得不可、画像メタデータ・created_by も NULL | ✅ |
| TEST 7 | 最後の member が外れる → orphaned（他の member が残る間は付かない）→ 猶予中は削除しない → 猶予後に削除・画像削除。参加者が残る preserved・通常イベントは無傷 | ✅ |
| DIRECT | auth ユーザーを直接削除 → CASCADE せず preserved、リンク失効、画像所有者消去、member 利用可 | ✅ |
| RACE | 退会と6人の参加を同時実行×8回（開始を 0〜120ms ずらす）→ 「参加0→削除」「一部参加→preserved」「全員参加→preserved」の3パターンが実際に発生、全回デッドロック・エラーなし、参加者数と結果が整合 | ✅ |

E2E `e2e/goods/account.spec.ts`: A が設定画面から退会 → `/goods?deleted=1`・セッション消失 → B の画面に「作成者は退会しています」、B は取得状況を変更・保持できる、共有/編集ボタンなし・編集URLは権限なし、マイイベントに「作成者退会」、ページに A のメールなし、共有URLは「共有が終了」、DB に A なし → ✅

エンドポイント確認: cleanup は秘密未設定/不一致で 404、退会 API はクロスオリジン 403・未ログイン 401。

## 11. 全Regression結果（2026-10-03、ローカル DB を空から作り直し、3本の migration を順に適用した後）
| スイート | 結果 |
|---|---|
| Phase 1 RLS / Storage `goods:rls-test` | ✅ 65 / 65 |
| Phase 2 共有 `goods:share-test` | ✅ 90 / 90 |
| 退会 `goods:account-test` | ✅ 68 / 68 |
| Playwright 全体 `goods:e2e`（Phase 1 8件・回帰4件・共有11件・退会1件） | ✅ 24 / 24 |
| build / 型 / ESLint | ✅ |
| 既存 ToolBoxJP | ✅ origin/main と比べ /goods 以外の全ルートのレンダリング種別一致（差分は Middleware 行のみ）、共通 JS 102kB 不変 |
| service role・cleanup secret・退会関数名のクライアント混入 | ✅ なし |

## 12. 残存リスク
| # | 内容 | 対応案 |
|---|---|---|
| R1 | オーナーが**在籍中**は、参加者が `events.owner_id`・画像メタデータ `owner` から**オーナーのユーザーID（UUID）**を読める（退会後は消える）。UUID 単独では他の情報に辿れないが、退会前に控えられていれば「その UUID の人がこのリストを作った」ことは残る | 必要なら events を member 向けに owner_id を返さないビュー経由にする（Phase 3 以降で検討） |
| R2 | Supabase Auth の監査ログ（`auth.audit_log_entries`）やプラットフォームのログにメールアドレス等が残る | 本番のログ保持期間・削除方針をプライバシーポリシーと合わせて決定 |
| R3 | cleanup の定期実行（スケジューラ）が未設定。設定しないと、最後の参加者が外れた preserved イベントと画像が残り続ける | 本番で Vercel Cron 等から `POST /goods/internal/cleanup` を日次実行（`GOODS_CLEANUP_SECRET` を設定） |
| R4 | 退会処理の途中（DB 準備後・auth 削除前）で失敗すると、イベントは既に振り分け済みでユーザーだけ残る | 再実行で完了する（冪等）。UI でエラー表示し再試行を促す |
| R5 | 「保存されたリスト」は作成者がいないため、誤りがあっても修正できない | 仕様（読み取り専用）。必要なら参加者が自分用に複製する機能を将来検討（今回は禁止事項に配慮し未実装） |
| R6 | ローカル検証は Supabase CLI のイメージ。本番の `storage.objects` に対する UPDATE（owner の NULL 化）が同様に許可されるかは本番で要確認 | migration 適用後に、テスト用アカウントで退会フローを1回実施して確認 |

## 13. Production migration時の注意
1. **適用順**: `20261001000000_goods_init.sql` → `20261003000000_goods_share.sql` → `20261004000000_goods_account_deletion.sql`（`supabase-goods/` を使う。Product #01 の `supabase/` と取り違えない）
2. 本番にデータがある状態で適用する場合、`events_owner_or_preserved` CHECK 追加前に `owner_id IS NULL` の行が無いことを確認（現状は NOT NULL のため無いはず）
3. FK の付け替え（DROP → ADD）は短時間 `events` をロックする。利用者の少ない時間帯に適用
4. 環境変数: `GOODS_SUPABASE_SERVICE_ROLE_KEY`（既出）に加え、cleanup を動かす場合は **`GOODS_CLEANUP_SECRET`**（32文字以上のランダム値・サーバー専用）
5. cleanup のスケジューラを設定（R3）
6. 適用後、テストアカウント2つで「共有 → 参加 → オーナー退会 → 参加者の画面確認」を1回実施（R6 の確認を含む）
7. プライバシーポリシー・利用規約に、退会時の扱い（共有カタログは作成者情報を消して参加者向けに残る）を明記

## 変更ファイル
```
新規  supabase-goods/supabase/migrations/20261004000000_goods_account_deletion.sql
新規  lib/goods/account.ts                       退会・cleanup（server-only）
新規  app/goods/account/delete/route.ts          退会 API
新規  app/goods/internal/cleanup/route.ts        cleanup API（秘密鍵必須・未設定なら 404）
新規  app/goods/settings/DeleteAccount.tsx       退会 UI
新規  scripts/goods-account-deletion-test.mts    退会テスト（68件）
新規  e2e/goods/account.spec.ts                  退会 E2E
変更  app/goods/settings/page.tsx, app/goods/page.tsx（退会後メッセージ）
変更  app/goods/_components/EventHeader.tsx（作成者退会の表示）, app/goods/events/page.tsx（バッジ）
変更  lib/goods/types.ts, lib/goods/data.ts（ownerId nullable・preserved）
変更  middleware.ts（/goods/internal/ はセッション確認しない）
変更  package.json（goods:account-test）
```
