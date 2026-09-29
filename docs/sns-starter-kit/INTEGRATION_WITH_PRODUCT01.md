# SNS Starter Kit × Product #01（Pro）統合手順

`feature/sns-starter-kit-lp` と、`/Users/hiyu_mac/web-tools` にある Product #01 の未コミット作業は、次の4ファイルで重なる。
どちらの意図も残す統合方法を、ここに固定しておく。

| ファイル | Product #01 側 | SNS Starter Kit 側 | 統合後 |
|---|---|---|---|
| `components/layout/ThemeProvider.tsx` | `isProCustomerRoute()` のとき `forcedTheme="light"` | `isForcedLightRoute()` のとき `forcedTheme="light"` | **判定を `isForcedLightRoute()` の1つにまとめる**（中で Pro の判定も呼ぶ） |
| `components/layout/Header.tsx` | Pro の顧客画面ではテーマ切替ボタンを出さない | LP ではテーマ切替ボタンを出さない | 同上。`hideThemeToggle = isForcedLightRoute(usePathname())` |
| `.env.example` | Product #01 のブロックを末尾に追加 | SNS Kit のブロックを末尾に追加 | **両方のブロックを残す**（Pro → SNS Kit の順） |
| `.gitignore` | `.pro-data/` | `.sns-kit-data/` | **両方の行を残す** |

## 統合後の `lib/theme/forced-light-routes.ts`

feature ブランチ上には `lib/pro` がまだ存在しないため、Pro の判定を呼ぶ行は統合時に追加する。

```ts
import { isProCustomerRoute } from "@/lib/pro/routes";

const LAUNCH_PAGE_PREFIXES = ["/sns-starter-kit"];

export function isForcedLightRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (isProCustomerRoute(pathname)) return true;
  return LAUNCH_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
```

- Pro の対象画面（`/services/ec-csv-monthly-close` 以下、`/orders/` 以下）の定義は、これまでどおり `lib/pro/routes.ts` だけが持つ。
- `ThemeProvider.tsx` と `Header.tsx` の import は、Pro 版の `@/lib/pro/routes` から `@/lib/theme/forced-light-routes` に置き換える。コメントは Pro 版の意図（業務データを預ける画面を白基調に固定する理由）を残したうえで、LP を追記する。

## 検証結果（2026-09-30）

本体の作業ツリーを変更せずにスクラッチへ複製し、Pro の未コミット作業と feature ブランチを重ねた状態で、ビルドと回帰テストを実施した。

- 型チェックとビルド: PASS
- `/`、`/tools`、`/tools/pdf-merge`、`/blog`、`/privacy`、`/pro/image-pro`、`/pro/ops`: ダークを維持し、テーマ切替ボタンあり
- `/services/ec-csv-monthly-close`、`/sns-starter-kit`: ライトに固定、テーマ切替ボタンなし
- `/tools` でテーマ切替が動作する。Pro の画面からトップへ遷移すると固定が解除される
- JS エラー: 0件

## 注意

- 環境変数は意図的に分けている。Pro は `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`、SNS Kit は `SNS_KIT_SUPABASE_URL` / `SNS_KIT_SUPABASE_SERVICE_ROLE_KEY`。
  同じ Supabase プロジェクトを使う場合は、同じ値を入れればよい。将来プロジェクトを分ける場合も、コードの変更は不要。
- 統合（main への merge）は Chief Gate の後に行う。Pro 作業のコミットは Pro 側で行うこと。この統合のために Pro の変更を stash / reset / checkout しないこと。
