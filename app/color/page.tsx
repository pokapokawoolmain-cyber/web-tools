import type { Metadata } from "next";
import { TOOLS } from "@/data/tools";
import { CATEGORY_CONFIGS } from "@/data/categories";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryToolGrid } from "@/components/category/CategoryToolGrid";
import { CategoryFAQ } from "@/components/category/CategoryFAQ";
import { CategorySeoContent } from "@/components/category/CategorySeoContent";
import { CategoryBlogSection } from "@/components/category/CategoryBlogSection";
import { BottomAd } from "@/components/ads/presets";

const config = CATEGORY_CONFIGS["color"]!;
const siteUrl = getSiteUrl();

export const metadata: Metadata = generateMeta({
  title: config.title,
  description: config.description,
  path: "/color",
  keywords: config.keywords,
});

export default function ColorCategoryPage() {
  const popularTools = config.popularToolIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  const allTools = config.allToolIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "カラーツール", item: `${siteUrl}/color` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.title,
    description: config.description,
    url: `${siteUrl}/color`,
    hasPart: allTools.map((t) => ({
      "@type": "WebApplication",
      name: t.title,
      url: `${siteUrl}${t.href}`,
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    })),
  };

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema, collectionSchema] as Record<string, unknown>[]} />

      {/* Hero */}
      <CategoryHero config={config} />

      {/* メインコンテンツ */}
      <div className="container-base py-12 sm:py-16 space-y-16">
        {/* ツールグリッド */}
        <CategoryToolGrid
          popularTools={popularTools}
          allTools={allTools}
          accentColor={config.accentColor}
          categoryName="カラー"
        />

        {/* 関連ブログ */}
        <CategoryBlogSection
          category="color"
          sectionTitle="カラー活用ガイド"
          accentColor={config.accentColor}
        />

        <CategorySeoContent slug="color" />


        {/* FAQ */}
        <CategoryFAQ faqs={config.faqs} accentColor={config.accentColor} />

        {/* ブラウザ完結バナー */}
        <div className="rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">🖥️</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">
                すべてブラウザ内で完結・登録不要
              </p>
              <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">
                カラーコード変換・パレット生成・グラデーション作成・コントラストチェックは、
                すべてブラウザ内のJavaScriptで処理されます。
                データが外部サーバーに送信されることはなく、インストール・ログイン不要でご利用いただけます。
              </p>
            </div>
          </div>
        </div>

        {/* ページ下部広告 */}
        <BottomAd />
      </div>
    </>
  );
}
