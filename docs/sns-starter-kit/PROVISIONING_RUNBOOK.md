# ToolBoxJP production backend — プロビジョニング手順

実績（2026-10-01）: `toolboxjp-production`（ref `jxhvakzqtxocxwrdpyiw`、Tokyo）を、CEO の判断により課金済みの `yoru` 組織内に**別プロジェクト**として作成した。yoru の DB とは共用していない。

対象: SNS Starter Kit の先行予約（`sns_starter_kit_reservations`）と Product #01（`pro_orders` / `pro_files`）の共用バックエンド。
**Secrets（DBパスワード・service role / secret key）は、このファイル・コード・コミット・ログに書かない。**

---

## A. CEO が行う操作（Supabase Dashboard、約5分）

有料契約はCEOの判断事項のため、この部分は Development では実行しない。

1. https://supabase.com/dashboard で **New organization** を作る
   - Name: `ToolBoxJP`（yoru の組織とは分ける。請求と権限を事業ごとに分けるため）
   - Plan: **Pro**（有料。料金はこの画面の表示で確認してから確定する）
2. `ToolBoxJP` 組織の中で **New project** を作る
   - Name: `toolboxjp-production`
   - Region: **Northeast Asia (Tokyo) / ap-northeast-1**
   - Database password: 自動生成を使い、**CEOのパスワード管理ツールに保存する**（Development には渡さない）
3. 作成が終わったら、**Project ref**（URL `…/project/<ここ>` の文字列。秘密情報ではない）を Development に伝える

> Development の Supabase CLI は CEO と同じアカウントでログイン済みのため、ref が分かれば以降の作業（B）は Development 側で行える。

## B. Development が行う操作（CLI）

```bash
# 1) worktree を新しいプロジェクトに紐付ける（DBパスワードは入力しない）
supabase link --project-ref <REF>

# 2) テーブルを作る（Revision 3）
supabase db query --linked -f docs/sns-starter-kit/reservations.sql

# 3) 読み取りのみで確認する（RLS / ポリシー0 / 権限なし / 一意 / 列 / 外部キー0 / 件数）
supabase db query --linked -f docs/sns-starter-kit/reservations_verify.sql

# 4) ローカル検証用に、キーを画面に出さずに .env.local（gitignore 済み）へ書き込む
#    ★新形式の secret key は --reveal を付けないと伏せ字（…****）で返り、PostgREST で
#      "Invalid API key" になる。値は変数経由でファイルへ直接書き、画面に出さない。
#    例: S=$(supabase projects api-keys --project-ref <REF> --reveal -o json | jq -r '[.[]|select(.type=="secret")][0].api_key')
```

- anon / publishable key で REST から `sns_starter_kit_reservations` を SELECT / INSERT できないこと（401 / 403 / 権限エラー）を確認する。
- Product #01 のマイグレーション（`supabase/migrations/0001_pro_orders.sql`）は Product #01 側で適用する（同じプロジェクト、別テーブル）。

## C. CEO が行う操作（Vercel Dashboard、約3分）

本番ドメイン `www.toolboxjp.com` が割り当てられている Vercel プロジェクトで行う。
（このリポジトリからは web-tools / toolbox-jp / web-tools-jp の3つがデプロイされている。**Domains 設定で www.toolboxjp.com があるプロジェクト**を選ぶ）

`Settings → Environment Variables` で、**Environment は「Preview」だけ**にチェックして次の3つを追加する。Production にはまだ入れない。

| Name | Value |
|---|---|
| `SNS_KIT_RESERVATION_STORE` | `supabase` |
| `SNS_KIT_SUPABASE_URL` | Supabase の `Project Settings → API → Project URL` |
| `SNS_KIT_SUPABASE_SERVICE_ROLE_KEY` | Supabase の `Project Settings → API Keys` の **secret key**（または service_role key）。**Sensitive にチェック** |

追加したら Development に「設定した」とだけ伝える（値は送らない）。Development が feature ブランチを再デプロイする。

## D. Preview E2E（Development と CEO）

Preview は Vercel 認証で保護されているため、送信はCEOのブラウザで行い、DBの確認は Development が行う。

1. Preview URL の `/sns-starter-kit?utm_source=e2e&utm_medium=test&utm_campaign=e2e_test` を開く
2. 次の内容で送信する
   - メール: `sns-kit-e2e-<日付>@example.com`（予約済みドメインのため実在しない。テストデータだと識別できる）
   - 経験: どれでも可 / 説明: `[E2E TEST] 動作確認` / 30日: どれでも可 / 必須の同意: ON / 任意の同意: OFF
3. 同じメールで、大文字を混ぜてもう一度送信する（画面が同じであること）
4. Development が DB を確認する: 該当は1行だけ、全列、UTM、`consent_version`、`created_at`（DB時刻）、`status = reserved`
5. 確認後、テスト行は `status` 以外で識別できるため、Development が削除する（CEOの承認を得てから）

## E. Production への反映（Final Gate 通過後のみ）

Gate A〜I がすべて PASS し、CEO の承認を得てから行う。

- Vercel の Production 環境に C と同じ3変数を追加する
- feature ブランチを main へ統合する（Product #01 の統合手順は `INTEGRATION_WITH_PRODUCT01.md`）
- プライバシーポリシーの承認版を公開する（最終更新日・`RESERVATION_CONSENT_VERSION` を更新する）
