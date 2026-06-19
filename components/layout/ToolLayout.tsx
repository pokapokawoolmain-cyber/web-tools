// ========================================
// ツールページ共通レイアウト
// 全ツールページはこれをラップして使う
// ========================================
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { AfterToolAd } from "@/components/ads/presets";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { getCategoryForTool } from "@/data/categories";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RecentToolsWrapper } from "@/components/tools/RecentToolsWrapper";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

type ToolLayoutProps = {
  title: string;
  description: string;
  icon: string;
  slug: string;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
};

export function ToolLayout({
  title,
  description,
  icon,
  slug,
  children,
  seoContent,
}: ToolLayoutProps) {
  const siteUrl = getSiteUrl();
  const toolUrl = `${siteUrl}/tools/${slug}`;

  // カテゴリTOPページへの紐付け
  const categoryConfig = getCategoryForTool(slug);
  const categoryHref = categoryConfig ? `/${categoryConfig.slug}` : "/tools";
  const categoryLabel = categoryConfig ? categoryConfig.name : "ツール一覧";

  const breadcrumbItems = categoryConfig
    ? [
        { "@type": "ListItem", "position": 1, "name": "ToolBox", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": categoryConfig.name, "item": `${siteUrl}/${categoryConfig.slug}` },
        { "@type": "ListItem", "position": 3, "name": title, "item": toolUrl },
      ]
    : [
        { "@type": "ListItem", "position": 1, "name": "ToolBox", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": "ツール一覧", "item": `${siteUrl}/tools` },
        { "@type": "ListItem", "position": 3, "name": title, "item": toolUrl },
      ];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": title,
      "description": description,
      "url": toolUrl,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "inLanguage": "ja",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems,
    },
  ];

  return (
    <>
      <JsonLd data={schemas as Record<string, unknown>[]} />
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base py-8 sm:py-12">
          {/* パンくずリスト（SEO + ナビゲーション） */}
          <nav aria-label="パンくずリスト" className="mb-4">
            <ol className="flex items-center flex-wrap gap-1 text-sm text-slate-500 dark:text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  ToolBox
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={categoryHref} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{title}</li>
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
            {/* 広告枠 */}
            <AdBanner slot="sidebar" />

            {/* カテゴリTOPへの戻りリンク */}
            <Link
              href={categoryHref}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {categoryLabel}へ戻る
            </Link>

            {/* 最近使ったツール */}
            <RecentToolsWrapper />
          </aside>
        </div>

        {/* SEO補足テキスト */}
        {seoContent && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 max-w-3xl">
            {seoContent}
          </div>
        )}

        {/* ツールページ下部の広告（ツール操作領域から十分離れた位置） */}
        <AfterToolAd className="mt-10" />

        {/* 関連ガイド記事（ツール→ブログの内部リンク・回遊強化） */}
        <RelatedArticles
          toolId={slug}
          className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-800"
        />

        {/* 関連ツール自動回遊 */}
        <RelatedTools
          toolId={slug}
          className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-800"
        />
      </div>
    </div>
    </>
  );
}
