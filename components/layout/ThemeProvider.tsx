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
      defaultTheme="system"   // OS設定に自動追従
      enableSystem            // システム設定を有効化
      disableTransitionOnChange // テーマ切替時のチラツキ防止
    >
      {children}
    </NextThemesProvider>
  );
}
