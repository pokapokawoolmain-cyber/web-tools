"use client";
// ========================================
// ダークモードプロバイダー
// next-themesを使ってシステム設定に自動追従
// ========================================
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"       // <html class="dark"> で切り替え
      defaultTheme="dark"     // 初回訪問はダークモード（切替でシステム/ライトも選択可）
      enableSystem            // システム設定も選択肢として有効
      disableTransitionOnChange // テーマ切替時のチラツキ防止
    >
      {children}
    </NextThemesProvider>
  );
}
