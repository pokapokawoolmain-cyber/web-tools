// ========================================
// ツールページ共通レイアウト
// 全ツールページはこれをラップして使う
// ========================================
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

type ToolLayoutProps = {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  // SEO補足テキスト（ページ下部に表示）
  seoContent?: React.ReactNode;
};

export function ToolLayout({
  title,
  description,
  icon,
  children,
  seoContent,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base py-8 sm:py-12">
          {/* パンくずリスト（SEO + ナビゲーション） */}
          <nav aria-label="パンくずリスト" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  ToolBox
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 dark:text-slate-300">{title}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <span className="text-4xl sm:text-5xl" role="img" aria-label={title}>
              {icon}
            </span>
            <div>
              {/* h1: SEOの最重要タグ */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container-base py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ツール本体（2/3幅） */}
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* サイドバー（広告・関連ツール） */}
          <aside className="space-y-6">
            {/* 広告枠（将来的にGoogle AdSenseを配置） */}
            <AdBanner slot="sidebar" />

            {/* 戻るリンク */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              ツール一覧に戻る
            </Link>
          </aside>
        </div>

        {/* SEO補足テキスト（h2見出し付きの説明文） */}
        {seoContent && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 max-w-3xl">
            {seoContent}
          </div>
        )}
      </div>
    </div>
  );
}
