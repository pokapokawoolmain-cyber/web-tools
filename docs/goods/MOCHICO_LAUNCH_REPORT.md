# MOCHICO LAUNCH REPORT — Brand Launch / Public LP / PWA Foundation

- 作成日: 2026-10-04
- 最終ステータス: **MOCHICO PUBLIC LP LIVE** — https://www.toolboxjp.com/mochico

## 1. 概要
| 項目 | 内容 |
|---|---|
| ブランド | Mochico（モチコ） |
| タイトル | Mochico（モチコ）｜推しグッズを見やすく管理・共有 |
| メッセージ | リストはみんなで。持ってるものは、自分だけ。 |
| 公開したもの | 公開LP `/mochico`（Production） |
| 公開していないもの | アプリ本体（`/mochico/app` ほか）。Production Supabase が未作成のため、ローカル環境のみ |
| LP の CTA | アプリ未公開のため「アプリは近日公開・準備中」（リンクなし）。壊れた本番アプリへは接続していない |

## 2. URL 設計
| URL | 役割 | Production |
|---|---|---|
| `/mochico` | 公開LP（index） | **公開** |
| `/mochico/app` | アプリの入口（ログイン済み→`/mochico/events`、未ログイン→`/mochico/login?next=/mochico/events`） | 未公開（404） |
| `/mochico/events`, `/mochico/events/[eventId]` | マイイベント / グッズ一覧 | 未公開 |
| `/mochico/settings` | 設定（見た目 → キャラクターの色 を含む） | 未公開 |
| `/mochico/s/[shareToken]` | 共有リンク。token を HttpOnly Cookie（path `/mochico/s`）へ移し、token を含まない `/mochico/s/view` へリダイレクト（設計は従来どおり維持） | 未公開 |
| `/goods`, `/goods/*` | 旧URL。308 で `/mochico/app`, `/mochico/*` へ転送（クエリ維持・Referrer-Policy no-referrer）。急な削除はしない | 本番には元々存在しない |

- アプリ本体のブランチ: `feature/goods-manager`（`~/web-tools-goods`、未コミット）。公開LPのブランチ: `feature/mochico-lp`（origin/main から作成）
- `NEXT_PUBLIC_MOCHICO_APP_ENABLED=true` のときだけ CTA が `/mochico/app` へのリンクになる。Production では未設定

## 3. LP 構成（`components/mochico/lp/`）
1. Hero: ロゴ（マスコット＋Mochico）、H1「推しグッズ、ぜんぶここに。」、CTA、「使い方を見る」（#how）、実UIを再現したスマホモック
2. Mochicoとは（イベントごとに整理 / 写真つき / リストは仲間と共有）
3. 「持ってる」はタップするだけ — 操作できるデモ（5/17 → タップで増減、LP専用デモデータ・保存なし）
4. 共有 — A 5/17・B 11/17・C 2/17 のデモ（「説明のため並べています。実際には他人の取得状況は表示されません」を明記）
5. 利用シーン（物販の列 / 重複購入防止 / ランダムグッズ）
6. 実画面（ローカル環境の実アプリで撮影。共有URLは本番ドメイン＋伏せ字に置換し、localhost・token は写さない）
7. はじめ方 3ステップ
8. FAQ（実装済みの事実のみ・7問）
9. Final CTA

デザイン: 白ベース、ソフトピンク / ラベンダー / ソフトブルー、紫アクセント。ハート・絵文字・過度なグラデーションは不使用。ライトテーマ固定（`FORCED_LIGHT_EXACT`）。SNS Starter Kit LP のコピーではない独自構成。

## 4. マスコット
- オリジナルの名前なし・紫のドット絵宇宙生物。18×17 グリッドの SVG（`components/mochico/sprite.ts`, `Mascot.tsx`）。GIF / 動画 / canvas ループは不使用
- 動き: ふわふわ浮遊、まばたき、きょろきょろ、喜び（デモでタップ時）、のぞき込み、ねむり（18秒無操作）、共有セクションで2体目が登場、Final CTA で待機
- スクロール追従: ヒーロー通過後に右下に出現し、CSS transition で少し遅れてついてくる（scroll ごとの再描画なし）。スマホではデモ枠の個体と重なるため左側ののぞき込みは非表示
- パフォーマンス: transform / opacity のみ、画面外（IntersectionObserver）とタブ非表示（visibilitychange）で停止、`prefers-reduced-motion` で全停止（計測: 実行中アニメーション 0）。LCP 要素ではない
- アプリ内は控えめ: オンボーディング、ホーム画面追加の案内、空状態、100%達成、エラー（オフライン時はねむり）、404
- **キャラクターの色（12色）**: 設定 → 見た目。purple（既定）/ red / orange / yellow / lime / green / cyan / blue / navy / pink / white / black。各色に base / highlight / shadow / outline（＋目・頬）を設計（`palette.ts`）。ユーザーごとに `profiles.mascot_color` に保存（ローカル migration `20261005000000_mochico_profile.sql`、**Production 未適用**）。LP・ロゴ・PWA アイコンは常に紫

## 5. SEO
- title / description（自然な日本語で「推しグッズ」「グッズ管理」「ライブ」「イベント」「共有」「重複購入」を含む）
- canonical `https://www.toolboxjp.com/mochico`、robots index/follow
- OGP / Twitter（summary_large_image）。OG 画像 `/mochico/opengraph-image`（1200×630）。※ページで openGraph を指定すると親セグメントの画像が引き継がれないため明示指定
- 構造化データ: WebPage（isPartOf ToolBoxJP）＋ FAQPage
- sitemap.xml に `/mochico` を追加。共有token・非公開ページはサイトマップに含めず、アプリ側ページは noindex（アプリ本体は未公開）
- robots.txt は既存のまま（変更なし）

## 6. PWA
- アプリ名 Mochico、紫アイコン（`/mochico/icon`, `/mochico/apple-icon`、アプリ側は `app-icon/[variant]`）
- アプリ用マニフェスト: scope `/mochico`、start_url `/mochico/app`、theme `#7c4dff`（アプリ本体と同時に公開予定。LP は既存の `/manifest.json` のまま）
- SW `public/mochico-sw.js`: オフライン案内1枚のみキャッシュ。個人データ・API・画像はキャッシュしない
- ホーム画面追加: Android は `beforeinstallprompt` を捕捉し、アプリ内ボタン押下で標準の確認UIを直接表示（最終確認はユーザー、自動インストールなし）。iPhone は手順ガイド。詳細は `GOODS_MANAGER_PWA_REPORT.md`

## 7. パフォーマンス・アクセシビリティ（ローカル本番ビルドで計測）
- `/mochico`: Static、page 8.35 kB / First Load 114 kB。共有 First Load JS 102 kB は変更なし
- 3G相当（1.6Mbps・150ms）＋ CPU 4倍スロットリング: LCP 2.85s、CLS 0
- 実画面画像は WebP（22〜48 KB）
- H1 1つ・見出し階層、lang=ja、名前のないボタン/リンク 0、画像 alt 欠落 0、横スクロールなし（390px / 1366px）、取得状態は色・チェック・文字の3つで表示、AA コントラスト
- Lighthouse は未実施（上記の手動計測で代替）

## 8. 変更ファイル（Production に入ったもの: commit 543bbb1 / merge e83690e）
- 追加: `app/mochico/(lp)/page.tsx`, `app/mochico/{icon,apple-icon,opengraph-image}.tsx`, `components/mochico/{Mascot.tsx,mascot.module.css,palette.ts,sprite.ts}`, `components/mochico/lp/*`, `lib/mochico/{content.ts,icon-render.tsx}`, `public/mochico/shots/*.webp`
- 変更: `app/sitemap.ts`（+2行）, `lib/theme/forced-light-routes.ts`（+3行）
- 既存ルートとの差分: `/mochico` 系の追加のみ（build のルート一覧を origin/main と比較）
- 行っていないこと: DB migration / Production Supabase / 決済 / Product #01 / 既存サービス削除 / DNS / middleware 変更（Production 側）

## 9. 回帰テスト
- LP ブランチ: tsc / lint / build 合格。ToolBoxJP の `/`, `/tools`, `/sns-starter-kit` 200、`/mochico/app`・`/mochico/events`・`/mochico/s/*`・`/goods` は 404（未公開のため期待どおり）
- アプリ本体（ローカル、Mochico 移行後）: RLS 65/65、共有 90/90、退会 68/68、E2E 33/33、PWA 11/11 合格

## 10. Production 確認結果
確認日時: 2026-10-04。Vercel Production デプロイ `dpl_Frci9jAkQoAqYHv6F7KVuAoeWveA`（GitHub main `e83690e`、state READY）。直前の Production は `222000b`（`dpl_5GiBpe3jmkBorP9H34u2b8o2TjRs`）なので、問題があれば Vercel でこのデプロイに戻せる。

| 確認項目 | 結果 |
|---|---|
| `https://www.toolboxjp.com/mochico` | 200（Static・CDN HIT） |
| title / canonical / robots | 「Mochico（モチコ）｜推しグッズを見やすく管理・共有」 / `https://www.toolboxjp.com/mochico` / index, follow |
| OGP / Twitter | og:image・twitter:image = `https://www.toolboxjp.com/mochico/opengraph-image`（200 image/png）、summary_large_image |
| 構造化データ | JSON-LD（WebPage・FAQPage）出力あり |
| sitemap.xml | `/mochico` を含む。共有token・アプリページは含まない |
| robots.txt | 既存のまま（Allow: /） |
| CTA | 「アプリは近日公開・準備中」。`/mochico/app` へのリンク 0件 |
| 未公開ルート | `/mochico/app`・`/mochico/events`・`/mochico/s/*`・`/goods` は 404（アプリ未公開のため期待どおり） |
| 既存 ToolBoxJP | `/`・`/tools`・`/sns-starter-kit`・`/blog`・`/manifest.json`・`/sitemap.xml` は 200 |
| スマホ（390×844）/ PC（1366×860） | 全セクションをスクロールして表示確認。横スクロールなし。デモのタップで 5/17 → 6/17。コンソールエラー 0 |
| アイコン | `/mochico/icon`・`/mochico/apple-icon` 200（紫） |

確認方法: 本番URLへの curl と、ヘッドレス Chrome（Playwright）での実ページ操作・スクリーンショット。実機（iPhone / Android）は未確認。

## 11. 未確認・TODO
- **Brand Legal TODO**: 「合同会社mochico」が存在する。商標調査（J-PlatPat 等で第9類・第42類・第45類など）と専門家確認は未実施。**「商標取得済み」「名称権利クリア済み」等の表示は一切していない**
- **Production Supabase TODO**: アプリ本体公開には Production 用 Supabase プロジェクト作成、migration 4本の適用、Auth（メール・Google）とリダイレクトURL `/mochico/auth/callback`、Storage バケット、Vercel 環境変数（`GOODS_SUPABASE_*`、`NEXT_PUBLIC_MOCHICO_APP_ENABLED=true`）が必要
- アプリ本体（`feature/goods-manager`）は未コミット。公開時に LP ブランチと共通ファイル（`components/mochico/*`, `lib/mochico/*`, `app/mochico/*`）を統合する（内容は両ワークツリーで同一に同期済み）
- iPhone / Android 実機での LP 表示・ホーム画面追加は未確認
- Lighthouse 正式スコア未取得

## 12. 次フェーズ候補（未着手・承認待ち）
- Production Supabase 構築とアプリ本体公開（CTA を `/mochico/app` に切替）
- 実機でのホーム画面追加検証
- 商標・名称の確認
- Phase 3 機能（無断では着手しない）
