# Phase Revenue 0 — 本番運用セットアップ手順書

Revenue Experiment（Image Pro / Seller）を本番で開始する前に、**人間が行う必要がある**設定をまとめる。
コード側は実装済みのため、以下を終えれば実際にデータが取れる状態になる。

対象読者: CEO（このリポジトリの開発は行っていない前提で、迷わない粒度で書く）。

---

## STEP1: Waitlist用 Google Formの作成

CTAを押した人のうち「メールで連絡が欲しいほど興味がある人」を記録するための送信先。
`app/contact/ContactForm.tsx` と全く同じ仕組み（Google Formへの無音送信）を使う。

### 1-1. フォームを作る

1. [Google Forms](https://forms.google.com) を開き、新しいフォームを作成する。
2. タイトル例: `ToolBoxJP Revenue 0 — 先行案内`
3. 質問を **2つだけ** 作る（増やすとCVRが下がるため、これ以上は追加しない）。
   - 質問1: 「メールアドレス」— 回答形式「記述式」
   - 質問2: 「対象商品」— 回答形式「記述式」（コード側が `image_pro` または `seller` を自動で入力するので、実際にユーザーへ見せる必要はない）
4. 右上の「回答」タブで、送信内容をスプレッドシートに自動保存する設定（緑色のスプレッドシートアイコン）にしておくと確認が楽。

### 1-2. 各質問の `entry.xxxxxxxxxx` を控える（最も簡単な方法）

1. フォーム編集画面の右上「⋮」→「事前入力したURLを取得」を選ぶ。
2. 「メールアドレス」欄に `test-email` 、「対象商品」欄に `test-product` などダミー値を入れて「リンクを取得」。
3. 生成されたURLの末尾に `...&entry.1234567890=test-email&entry.9876543210=test-product` のような形式でパラメータが並ぶ。この `entry.` から始まる数字が、それぞれの質問のIDになる。
   - `entry.` の直前が「メールアドレス」の値なら → それが `NEXT_PUBLIC_WAITLIST_ENTRY_EMAIL`
   - もう一方が → `NEXT_PUBLIC_WAITLIST_ENTRY_PRODUCT`

### 1-3. 送信先URLを作る

1. フォームの回答用URL（`.../viewform` で終わるURL）を控える。
2. 末尾の `/viewform` を `/formResponse` に置き換えたものが送信先URL。
   - 例: `https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxx/viewform` → `https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxx/formResponse`

### 1-4. Vercelに環境変数を設定

Vercel Dashboard → Project → Settings → Environment Variables → **Production**（必要なら Preview にも）に以下3つを追加する。

| 変数名 | 値 |
|---|---|
| `NEXT_PUBLIC_WAITLIST_FORM_URL` | STEP1-3で作った `/formResponse` で終わるURL |
| `NEXT_PUBLIC_WAITLIST_ENTRY_EMAIL` | STEP1-2で控えた「メールアドレス」質問のentry ID |
| `NEXT_PUBLIC_WAITLIST_ENTRY_PRODUCT` | STEP1-2で控えた「対象商品」質問のentry ID |

設定後、再デプロイすると反映される。

### 1-5. 動作確認

1. 本番の `/pro/image-pro` を開き、CTAを押して「準備中」パネルを表示。
2. 自分のメールアドレスで先行案内に登録してみる。
3. Google Formの「回答」タブ（またはリンク済みスプレッドシート）に、今入力したメールアドレスと `image_pro` という文字列が1行追加されていれば成功。
4. `/pro/seller` でも同様に確認し、`seller` という文字列が入ることを確認する。

**この設定を行わない場合**: LP上のWaitlist欄は「先行案内のご登録受付は準備中です」という表示のままで、メール入力欄自体が出ない（コード側の意図的な安全策）。Revenue Experiment自体はこの設定なしでも開始できるが、Waitlist Submitという「強い意欲シグナル」が一切取得できない状態になる。

---

## STEP2: GA4カスタムディメンションの追加登録

`akamaru-ceo/docs/TOOLBOX_GA4_SETUP.md` のSTEP2と同じ画面（GA4管理画面 → プロパティ → データ表示 → カスタム定義）で、
今回追加したパラメータのうち **新規に登録が必要なもの** だけを追加する。

`tool_id` は`tool_started`等で既に登録済みのため、`revenue_cta_impression`/`revenue_cta_click`が送る同名パラメータにも自動的に適用される（再登録不要）。

### 追加するカスタムディメンション（イベントスコープ）

| 表示名 | イベントパラメータ | 説明 |
|---|---|---|
| Revenue Product | `product` | `image_pro` または `seller` |
| Revenue Entry Point | `entry_point` | `note` / `internal_tool` / `organic` / `direct` / `other` |
| Revenue CTA Placement | `placement` | `lp_hero` / `lp_footer` / `tool_banner` |

### 追加するカスタム指標（イベントスコープ）

| 表示名 | イベントパラメータ | 単位 |
|---|---|---|
| Revenue Price Shown | `price_shown` | 標準（円） |

これを登録しないと、GA4のDebugView/Realtimeでパラメータの中身は見えるが、Explore（探索レポート）で `product` 別・`entry_point` 別に集計できない。**本番公開後、なるべく早く登録すること**（登録日以降のイベントにしか反映されないため）。

---

## STEP3: Unique KPIの見方（GA4 Exploration）

経営判断で使う「ユニークユーザー単位」の指標は、新しい記録の仕組みを追加していない。
GA4標準の「探索」機能で、イベント名ごとの重複排除済みユーザー数（Active users）を見るだけで算出できる。

1. GA4管理画面 →「探索」→「空白」から新規探索を作成。
2. ディメンションに `Revenue Product`（STEP2で登録）を追加。
3. 指標に `Active users`（アクティブユーザー数）を追加。
4. 「セグメント」または「フィルタ」で `イベント名 = revenue_lp_view` に絞ると → **Unique LP Users**
5. 同様に `revenue_cta_impression` に絞ると → **Unique CTA Exposed Users**
6. 同様に `revenue_cta_click` に絞ると → **Unique CTA Click Users**
7. 同様に `revenue_waitlist_submit` に絞ると → **Unique Waitlist Users**

**Unique Intent Rate** = Unique CTA Click Users ÷ Unique CTA Exposed Users（`product`別に見る）

**Waitlist転換率** = Unique Waitlist Users ÷ Unique CTA Click Users（「押した人のうちどれだけが本気か」）

**Placement別CTR**（商品の弱さ・配置の弱さを切り分ける指標）は、上記に `Revenue CTA Placement` ディメンションを追加すれば、`lp_hero` / `lp_footer` / `tool_banner` ごとの Impression → Click 件数（イベント件数ベース、ユニークではなく生イベント数）がそのまま見える。

独自のCookie発行・ユーザーIDの記録などは一切追加していない。GA4が標準で持つクライアントIDベースの識別のみを使う（`TOOLBOX_GA4_SETUP.md` STEP9のretention実装と同じ考え方）。

---

## STEP4: 本番公開直後に確認すること

1. GA4 Realtime（リアルタイムレポート）を開いた状態で、本番の `/pro/image-pro` と `/pro/seller` に実際にアクセスする。
2. `revenue_lp_view` がRealtimeに現れるか確認。
3. CTAを押して `revenue_cta_impression` → `revenue_cta_click` が正しい `placement` で記録されるか、DebugView（Chrome拡張 Google Analytics Debugger推奨）でパラメータの中身まで確認。
4. `image-compress` で画像を2枚以上圧縮し、バナーの `tool_banner_impression` 相当（`revenue_cta_impression` with `placement=tool_banner`）が発生するか確認。
5. バナーのCTAを押して `/pro/image-pro?src=tool:image-compress` へ遷移し、`revenue_lp_view` の `entry_point` が `internal_tool` になっているか確認。
6. Waitlist登録を1件行い、`revenue_waitlist_submit` がGA4に、実際のメールアドレスがGoogle Formに、それぞれ届いているか確認。
