// ========================================
// ルートレイアウト（全ページ共通）
// フォント・テーマ・グローバルCSSをここで設定
// ========================================
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

// 英語フォント: Inter（Appleサイト的な洗練感）
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // フォント読み込み中もテキスト表示（Core Web Vitals改善）
});

// 日本語フォント: Noto Sans JP
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // デフォルトメタデータ（各ページで上書き可能）
  title: {
    default: "ToolBox | 無料Webツール集",
    template: "%s | ToolBox",
  },
  description:
    "FIREシミュレーター・NISA計算・メルカリ利益計算・画像変換など、検索で見つかる無料ツールを集めたサイト。登録不要・スマホ対応。",
  keywords: "無料ツール, 計算ツール, FIRE, NISA, 画像変換, メルカリ",
  authors: [{ name: "ToolBox" }],
  creator: "ToolBox",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  // サイト全体のOG設定（各ページで上書き可）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ToolBox",
  },
  // robots設定
  verification: {
    google: "QYjtugi8BFF5kEzdJoVN74hleLT6GGpBFq0kT7g4jOw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning // next-themesのダークモード切替時の警告を抑制
      className={`${inter.variable} ${notoSansJP.variable}`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8801800417491644"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100 antialiased">
        <ThemeProvider>
          {/* スキップリンク（アクセシビリティ） */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg"
          >
            メインコンテンツへスキップ
          </a>

          <Header />

          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-CM9H4Y9XLD" />
    </html>
  );
}
