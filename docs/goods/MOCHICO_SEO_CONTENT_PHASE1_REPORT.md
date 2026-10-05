# MOCHICO SEO CONTENT PHASE 1 REPORT — 検索流入用ブログ基盤 + 第1弾記事

- 作成日: 2026-10-06
- ブランチ: `feature/mochico-seo-phase1`（ワークツリー `~/web-tools-seo`、origin/main ベース）
- ステータス: **SEO CONTENT PHASE 1 READY**（ローカル本番ビルドで検証済み。main へのマージ＝Production 反映は CEO 承認待ち）

## 1. 現状調査（実コード）
| 項目 | 結果 |
|---|---|
| ブログURL | `/blog/<英語スラッグ>` のフラット構造（90記事）。ネストした `/blog/mochico/...` は既存に無い |
| 記事データ | `data/blog-posts.ts`（`BLOG_POSTS`。一覧・sitemap の日付に使用）。`data/blogs.ts` はカテゴリページ用の別レジストリ |
| レイアウト | `app/blog/_components/BlogLayout.tsx`（prose・目次なし・Article + Breadcrumb + FAQPage・記事中/末尾に広告） |
| metadata | `lib/seo.ts` の `generateMeta()`（canonical 自己参照・index,follow・OG/Twitter） |
| sitemap / robots | sitemap は記事を手動列挙。robots は全許可＋sitemap。RSS なし |
| テーマ | サイト既定はダーク。`lib/theme/forced-light-routes.ts` で LP（`/mochico`）だけ白基調に固定 |
| 広告 / 計測 | ブログは AdSense 2枠（本番で確認）＋ GA4。Mochico アプリ内部は GA・広告停止、noindex |
| Mochico | LP `/mochico`（index）、アプリ `/mochico/app` ほか（noindex）、2026-10-05 一般公開。LP の CTA は `/mochico/app` |

### 記事に書いた機能の根拠（すべて実装済みを確認）
- イベント: 名前・開始日/終了日・概要・カバー画像（`EventForm.tsx`）
- グッズ: 写真・名前・価格・カテゴリ・概要（`GoodsForm.tsx`）
- タップで「取得済み」⇄「未取得」、取得数と割合、「すべて・未取得・取得済み」の絞り込み（`GoodsBoard.tsx`）
- リンク共有。閲覧はログイン不要、自分の管理への追加はログイン必要（`s/join/route.ts`, `ShareCatalogView.tsx`）
- 取得状況は本人だけに表示、作成者にも見えない（LP FAQ・共有シートの表示）
- 追加・編集は作成者のみ、変更は共有先に反映、共有の停止が可能（LP FAQ・共有シート）
- Webアプリ・ホーム画面追加・メールの6桁コードでログイン（LP FAQ）
- **書いていないこと**: 料金（「無料」等の記載はコード・LP・規約のどこにも無いため）、個数管理・欲しい/交換用などの状態・支出集計（未実装と明記）

## 2. SERP 調査（2026-10-05〜06、Web検索。検索ボリュームは取得できないため数値は書かない）
| 検索テーマ | 上位の傾向 | 隙間 |
|---|---|---|
| 推しグッズ 管理（方法） | 収納（片付け・保管）記事が大半。記録・把握は一部 | 「収納」と「把握」を分け、把握の方法を比較する記事が無い |
| 推しグッズ 管理 アプリ / 推し活 アプリ | App Store 個別ページ、アプリまとめ記事 | ネイティブアプリ比較の土俵。公開直後は不利 |
| グッズ 重複 防止 | 物欲を抑える個人ブログ、アプリまとめ | 「何を記録すれば防げるか」の具体論が薄い |
| グッズリスト 作り方 | 汎用 ToDo / スプレッドシート記事 | 推し活向けが少ない |
| ライブ グッズ 管理 | 主催者側の物販在庫管理・買い方ガイド | ファン側の「イベント単位のリスト」記事が無い |
| グッズ 一覧 共有 | ほぼ無関係な結果 | 「一覧は共有・所持は各自」の論点はどこにも無い |

競合2本（Yahoo!ニュース エキスパート記事、otakatsu.jp）を構成分析: いずれも方法の比較表、イベント単位の整理、共有時の所持状況のプライバシーを扱っていない。文章・構成は流用していない。

## 3. Content Cluster
| Cluster | Primary | 意図 | Mochico 関連 | 競合（定性） | Cannibalization |
|---|---|---|---|---|---|
| A（第1弾・ピラー） | 推しグッズ 管理（方法） | 把握の方法を知りたい | 高 | 中（収納記事が強い） | — |
| B | ライブ グッズ 管理 / 物販 リスト | 物販前に買うものを決めたい | 最高 | 低〜中（ファン側が手薄） | A の H2「イベント単位」と一部重複 → B は物販当日・予算に特化 |
| C | グッズ 重複買い 防止 | 二重購入をやめたい | 高 | 中 | A の H2 と重複 → C はランダム商品・通販の二重注文に特化 |
| D | グッズリスト 作り方（スプレッドシート） | 表で管理したい | 中 | 低（推し活向け少） | A の比較と重複小 |
| E | 友達 グッズ 一覧 共有 | 一緒に行く人と一覧を使いたい | 最高（差別化） | 低（需要は不明） | A の H2 と重複 → E は手順・注意点に特化 |
| F | 推しグッズ 管理 アプリ | アプリを選びたい | 高 | 高（App Store・まとめ） | A と競合しやすい。自社紹介色が強くなるため後回し |

## 4. 第1弾記事
- URL: `/blog/oshi-goods-management`（既存のフラット規則に統一）
- title: 推しグッズの管理方法｜持っているものを把握して重複買いを防ぐコツ（＋ ` | ToolBox`）
- Primary: 推しグッズ 管理（方法）/ Secondary: グッズ 管理 方法、推し活 グッズ 管理、グッズ 重複買い 防止、グッズリスト 作り方、ライブ グッズ 管理
- 第一候補「推しグッズの管理方法」から変更なし。ただし SERP が収納寄りのため、冒頭で「収納」と「把握」を分け、本記事は把握を扱うと明示
- 構成: 導入（場面）→ 先に結論 → 目次 → 把握が難しい理由 → 方法の比較表＋各方法の向き不向き → 選び方 → [記事中広告] → 最低限記録したいこと（チェックリスト・ランダム商品・記録のタイミング）→ イベント単位の整理（ステップ）→ 共有の注意点（一覧と所持の分離）→ Mochico 紹介（提供元明示・実画面2枚・できないことも明記・CTA1）→ まとめ（CTA2）→ [末尾広告]
- 本文約5,100字・読了目安9分。Mochico 紹介は H2 1つ分（約2割）

## 5. 実装
| 内容 | ファイル |
|---|---|
| Mochico 記事レイアウト（Server Component、白基調、Hero・パンくず・目次・CTA・BlogPosting/Breadcrumb） | `app/blog/_components/mochico/MochicoArticle.tsx` |
| ライトテーマ（Mochico LP と同じ色トークン。新色なし） | `app/blog/_components/mochico/article.module.css` |
| 記事本文・metadata | `app/blog/oshi-goods-management/page.tsx` |
| 記事専用 OG 画像（LP と同方式、架空の数値なし） | `app/blog/oshi-goods-management/opengraph-image.tsx` |
| 記事データ | `data/blog-posts.ts`（+1件） |
| 白基調の固定 | `lib/theme/forced-light-routes.ts`（`MOCHICO_ARTICLE_PATHS` を追加、完全一致） |
| sitemap | `app/sitemap.ts`（+1行） |

- 実画面は LP で公開済みの `public/mochico/shots/{event,share}.webp` を再利用（テストデータ・共有URL伏せ字済み。新規撮影・本番データ作成なし）
- 構造化データ: BlogPosting + BreadcrumbList。FAQPage は付けない（FAQ リッチリザルトは 2023 年以降ほぼ政府・医療系に限定され、本記事は FAQ 形式でもないため）。評価・レビュー・著者資格は入れていない
- E-E-A-T: Hero に「文：ToolBoxJP編集部」、紹介節の冒頭で「ToolBoxJPが提供している」を明示
- CTA: 本文1・記事末1、いずれも `/mochico`（LP）へ。記事から直接ログインを求めず、LP で機能・実画面を見てから LP の CTA（`mochico_cta_click` 計測済み）でアプリへ進む導線
- 計測: 追加していない（GA4 の page_view＋参照元で 記事→LP は追える）。提案は 10 参照
- 広告: 既存ブログと同じ2枠。記事中枠は答え（比較・選び方）の後に置き、本文到達を遅らせない

## 6. 検証（ローカル本番ビルド `next start`）
- tsc / lint / build 合格。記事は Static、ページ固有 JS 1.6 kB
- メタ: title・description・canonical（自己参照）・robots index,follow・OG（article, published/modified）・Twitter summary_large_image・OG画像 200（1200×630）。H1 1つ、H2 8つ（固定 ID）
- モバイル 375 / 390 / 430・PC 1440: 横スクロールなし、本文 16px（PC 17px）・行間 1.9、表は横スクロール（1列目固定）、375px でもファーストビューに本文の書き出しが入る
- Lighthouse（モバイル、3回）: Performance 86〜87（既存記事 noshi-paper-guide は 88）、FCP 2.0s（同値）、LCP 3.8s（既存 3.6s）、CLS 0、TBT 80〜130ms、総転送量 1,009 KiB（既存 1,031 KiB）。SEO 100、Accessibility 96（違反はサイト共通フッターの文字色のみで、既存記事と同じ。記事本体は違反なし）
- アクセシビリティ: 色は LP で AA 確認済みのトークン、focus-visible、目次・CTA・表（tabIndex）キーボード操作可、アニメーションなし、alt は画面の説明のみ
- 境界: Mochico記事は light 固定・テーマ切替なし／既存記事は dark・切替あり。記事の GA4・広告は既存ブログと同じ。アプリ・共有は従来どおり noindex（meta）、sitemap は記事と `/mochico` のみ
- 回帰: `/`, `/tools`, `/tools/pdf-merge`, `/blog`, `/blog/noshi-paper-guide`, `/mochico`, `/mochico/privacy`, `/mochico/terms`, `/mochico/app`, `/mochico/login`, `/mochico/events`, `/mochico/s/view` 200、`/mochico/s/<token>` 303 → `/mochico/s/view`、`/goods` 308、sitemap / robots 200（robots 変更なし）
- Mochico 本体（アプリ・DB・RLS・Supabase・認証・共有・middleware・vercel.json）は変更なし

## 7. 既存の気づき（今回は変更していない）
- サイト共通フッターの `text-slate-400` on `slate-50` がコントラスト 2.51:1（AA 未満）
- `/apple-icon.png` への参照が 404（`app/apple-icon.tsx` は `/apple-icon` で配信）
- sitemap に `/tools/noshi-maker` が2回出る

## 8. LP / 既存記事からのリンク（変更案のみ）
- Mochico LP: FAQ の下か Final CTA の手前に「グッズ管理のコツ（ガイド記事）」へのリンク1本。記事が index されたのを確認してから追加を推奨
- 既存 ToolBoxJP 記事: 自然につながる記事は現状なし（メルカリ手数料記事は「重複グッズを売る」文脈なら可能だが、SEO 目的だけのリンクになるため見送り）

## 9. 次の記事候補（量産せず、第1弾のデータを見てから判断）
| 優先 | Primary | 仮タイトル | Mochico 接続 | Cannibalization |
|---|---|---|---|---|
| 1 | ライブ グッズ 管理 / 物販 買うもの リスト | ライブ物販の買い物リストの作り方｜予算と購入制限を事前に整理する | イベント単位のリスト | 低（当日・予算に特化） |
| 2 | 友達 グッズ 共有 | 同じライブに行く友達とグッズ一覧を共有する方法と注意点 | 共有・所持の分離 | 中（A の H2 を深掘り） |
| 3 | ランダムグッズ 管理 / 缶バッジ 管理 | ランダム缶バッジ・トレカの管理方法｜どの絵柄を持っているか一目で | 種類ごとに1件 | 中 |
| 4 | グッズ 重複買い 防止 | 推しグッズの重複買いを防ぐ方法｜通販の二重注文もなくす記録のコツ | 取得済みで確認 | 中〜高（A と近い。A の順位を見て判断） |
| 5 | グッズリスト 作り方 スプレッドシート | 推しグッズのリストをスプレッドシートで作る方法（項目例つき） | 比較対象として公平に | 低 |
| 6 | 推し活 グッズ 予算 管理 | 推し活のグッズ予算の決め方 | 価格の登録（集計機能は無いと明記） | 低 |
| 7 | 推しグッズ 管理 アプリ | 推しグッズ管理アプリの選び方 | 直接 | 高（A と競合・自社紹介色） |

## 10. 計測の提案（未実装）
- 記事 → LP の CTA 押下: `mochico_article_cta_click`（`article_slug`, `cta_position: "body" | "end"` のみ。PII・user_id・token なし）。`lib/analytics/mochico.ts` の `MOCHICO_EVENT_REGISTRY` に1件追加する形。CEO Dashboard の LP CTA 計測と命名を揃えるため、Dashboard 側の要件確認後に実装
- 現状でも GA4 で「`/mochico` の page_view のうち参照元が `/blog/oshi-goods-management`」で記事→LP は把握できる

## 11. 公開後に見る Search Console 指標
- 対象ページ `/blog/oshi-goods-management`: 表示回数・クリック・CTR・平均掲載順位、クエリ（推しグッズ 管理 系 / 収納系が混ざるか）
- URL 検査でインデックス登録をリクエスト。数日〜数週間は順位が付かなくても異常扱いしない
- 収納系クエリで表示が多く CTR が低い場合は、タイトルに「記録」を寄せるか、収納への短い言及を足すかを検討
- GA4: 記事の page_view・スクロール、記事 → `/mochico` → `mochico_cta_click` → アプリ

## 12. Production 反映手順（承認後）
1. `feature/mochico-seo-phase1` を origin/main に追従させて main へマージ（toolbox-jp が Production 自動 deploy）
2. 本番で記事 200・メタ・OG画像・sitemap・白基調・既存ブログのダーク維持・アプリ noindex を確認
3. Search Console でサイトマップ再送信と URL 検査
- Rollback: main で merge commit を revert（記事の追加のみで、データ変更は無い）
