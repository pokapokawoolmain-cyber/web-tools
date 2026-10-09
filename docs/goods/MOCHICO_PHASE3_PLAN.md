# MOCHICO PHASE 3 — 監査結果と統合設計（検索・カテゴリ・数量・複数画像・ランダム商品）

- 作成日: 2026-10-08
- ブランチ: `feature/mochico-phase3`（origin/main `4d5e0ac` から。SEO ブランチとは別）
- 範囲: ローカルでの実装・検証まで。本番 Migration・main マージ・Production デプロイは承認待ち

## 1. 既存コード監査（実コード確認済み）
| 対象 | 現状 |
|---|---|
| goods | `name`(1-100) `price`(0-1千万, null可) `description`(≤1000) `image_path`/`thumb_path`（1枚、full+thumb） `category text`(1-30, 自由入力) `sort_order` `deleted_at`（**論理削除**）。イベントあたり1000件上限（トリガー） |
| ownerships | `(user_id, goods_id)` 一意、`status` 'unowned'/'owned'、`acquired_at`（サーバー時刻トリガー）。RLS: 本人のみ SELECT/INSERT/UPDATE/DELETE、書き込みは `goods_can_track`（メンバーかつ有効なグッズ） |
| event_memberships | role 'owner' / 'member'（Phase 2 で変更）。INSERT はトリガー / RPC のみ |
| RLS | goods: メンバー閲覧・オーナー作成/更新。anon は全テーブル権限なし。authenticated は必要な操作だけ GRANT |
| Storage | `{event_id}/{goods_id|cover}/{uuid}-full|thumb.webp`。先頭フォルダの event でポリシー判定（メンバー閲覧・オーナー書込）。1枚約 full 46KB / thumb 10KB（本番実測）、上限 2MB、webp/jpeg のみ |
| 登録・編集 | `GoodsForm`: 画像アップロード → goods を insert/update（クライアントから直接、RLS で保護）。置き換えた旧画像は Storage から削除。グッズ削除は `deleted_at`（画像は残る＝イベント削除時に消える） |
| 所持更新 | `GoodsBoard`: Optimistic UI。グッズごとに書き込みを直列化し「最新の希望状態」だけ送る。失敗時は確定状態へ戻す。トーストで元に戻す |
| 共有 | `goods_get_shared_catalog`（service_role 専用 RPC → サーバーで署名URL化）。goods は id を返さず key のみ。参加者はイベント画面で同じ goods を RLS 経由で閲覧 |
| キャッシュ | IndexedDB スナップショット `{event, goods, statuses, isOwner}`（オフライン閲覧用・正本ではない）、フィルターの UI state |
| 退会 | auth ユーザー削除で ownerships は CASCADE。参加者がいるイベントは owner 切り離し（トリガーで Storage の owner も NULL）。Storage はイベントフォルダ単位で削除・孤児検出 |
| 集計 | `goods_my_events`: 取得数 = `count(*)` of owned rows（1グッズ1行が前提）。`mochico_dashboard_stats`（別セッション追加）: `ownerships.status = 'owned'` を参照 |
| E2E | goods / share / account / pwa / regression（35件）。所持は `aria-pressed`、タブは role=tab「すべて/未取得/取得済み」 |

## 2. 統合設計の方針
- **カタログ（共有）** と **所持（個人）** の分離をそのまま拡張する
  - カタログ: `goods_categories`（新）・`goods`（拡張）・`goods_images`（新）・`goods_variants`（新）。閲覧はメンバー、編集はオーナー（`goods_is_owner`）
  - 所持: `ownerships` を拡張（`quantity`・`variant_id`）。本人のみ。テーブルを増やさない
- **後方互換**: `ownerships.status` は `quantity > 0` から自動で決まる列として残す（ダッシュボード集計・旧クライアントが壊れない）。`goods.image_path/thumb_path` は「代表画像」の写しとしてトリガーで維持（一覧・共有カタログは従来どおり1回の取得で表示）。`goods.category` 文字列もカテゴリ名の写しとして維持
- 画像・バリエーションは既存の Storage パス規約（`{event_id}/{goods_id}/...`）に置く → 既存の Storage ポリシー・退会・孤児掃除がそのまま効く

## 3. DB 変更（migration `20261008000000_mochico_phase3.sql`）
| テーブル | 変更 |
|---|---|
| `goods_categories`（新） | id, event_id, name(1-30, イベント内で一意), sort_order。メンバー閲覧・オーナー作成/変更/削除。上限 50/イベント |
| `goods` | `kind` ('normal'/'random', 既定 normal)、`category_id`（FK, 削除時 NULL＝未分類）。`category` 文字列は category_id から自動同期。`image_path/thumb_path` は代表画像の写し（クライアントからの直接更新は列権限で禁止） |
| `goods_images`（新） | id, goods_id, event_id(写し), image_path, thumb_path, sort_order（0 = 代表）。上限 10/グッズ |
| `goods_variants`（新） | id, goods_id, event_id(写し), name(1-60), image_path/thumb_path（任意・1枚）, sort_order。上限 100/グッズ。ランダム商品のみ |
| `ownerships` | `quantity int 0..9999`（既存 owned→1 / unowned→0）、`variant_id`（ランダム商品の絵柄。通常商品は NULL）。一意制約を `(user_id, goods_id, variant_id) NULLS NOT DISTINCT` に変更。`status` は quantity から自動 |
| 関数 | `goods_my_events`（取得数を「数量1以上のグッズ数」に修正）、`goods_get_shared_catalog`（カテゴリ・種類・バリエーション数・画像一覧を追加）、`goods_convert_kind`（通常⇄ランダムの変換。全参加者の数量を移す/合算する。オーナーのみ）、検証トリガー（バリエーションの所属・種類の整合） |

## 4. 機能仕様（要約）
- 検索・絞り込み・並び替え: クライアント側（最大1000件）。商品名の部分一致（ひらがな/カタカナ・全角/半角・大小文字を正規化）、所持（すべて/未取得/取得済み）× カテゴリ × 並び替え（登録順/名前順/価格の安い順/高い順）。取得率はイベント全体
- カテゴリ: 横スクロールのタブ（すべて・各カテゴリ・未分類）。オーナーは追加・名前変更・並び替え・削除（グッズは未分類へ）。候補9種はワンタップ追加
- 数量: 通常商品はカードのタップで 0→1 / 1→0（従来どおり＋元に戻す）。**2個以上はタップしても減らさず数量シートを開く**。数量シートで −/＋/直接入力（0〜9999 の整数）
- ランダム商品: カードに代表画像・「全8種」・取得種類数。タップで絵柄一覧シート（画像・名前・数量の −/＋）。商品の取得 = いずれかの絵柄が1以上。合計数量 = 絵柄の数量の合計
- 複数画像: 最大10枚。追加・削除・並び替え・代表（先頭）設定。詳細シートで横スワイプ閲覧。ギャラリー（紹介用）と絵柄（所持管理用）は別の UI に分ける
- 変換: 通常→ランダム = 既存の数量を最初の絵柄へ移す。ランダム→通常 = 絵柄の数量を合算し絵柄を削除（どちらも確認ダイアログ）
