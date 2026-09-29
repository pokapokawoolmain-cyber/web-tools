"use client";
// ========================================
// ダークモードプロバイダー
// next-themesを使ってシステム設定に自動追従
// 例外: 商品のLaunch Page（lib/theme/forced-light-routes）は白基調に固定する
// ========================================
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { isForcedLightRoute } from "@/lib/theme/forced-light-routes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const forcedTheme = isForcedLightRoute(usePathname()) ? "light" : undefined;
  return (
    <NextThemesProvider
      attribute="class"       // <html class="dark"> で切り替え
      defaultTheme="dark"     // 初回訪問はダークモード（切替でシステム/ライトも選択可）
      enableSystem            // システム設定も選択肢として有効
      disableTransitionOnChange // テーマ切替時のチラツキ防止
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
