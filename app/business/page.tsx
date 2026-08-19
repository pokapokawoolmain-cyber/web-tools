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

const config = CATEGORY_CONFIGS["business"]!;
const siteUrl = getSiteUrl();

export const metadata: Metadata = generateMeta({
  title: config.title,
  description: config.description,
  path: "/business",
  keywords: config.keywords,
});

export default function BusinessCategoryPage() {
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
      { "@type": "ListItem", position: 2, name: "ビジネス・契約書", item: `${siteUrl}/business` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.title,
    description: config.description,
    url: `${siteUrl}/business`,
    hasPart: allTools.map((t) => ({
      "@type": "WebApplication",
      name: t.title,
      url: `${siteUrl}${t.href}`,
      applicationCategory: "BusinessApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    })),
  };

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema, collectionSchema] as Record<string, unknown>[]} />

      <CategoryHero config={config} />

      <div className="container-base py-12 sm:py-16 space-y-16">
        <CategoryToolGrid
          popularTools={popularTools}
          allTools={allTools}
          accentColor={config.accentColor}
          categoryName="ビジネス"
        />

        <CategoryBlogSection
          category="business"
          sectionTitle="ビジネス書類ガイド"
          accentColor={config.accentColor}
        />

        <CategorySeoContent slug="business" />


        <CategoryFAQ faqs={config.faqs} accentColor={config.accentColor} />

        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                免責事項
              </p>
              <p className="text-[13px] text-amber-800 dark:text-amber-400 leading-relaxed">
                本サイトのビジネス書類ツールで作成した書類はひな形・参考資料です。法的効力や税務処理については、
                弁護士・税理士などの専門家にご相談ください。本サイトは、作成された書類の利用により生じた損害について責任を負いません。
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
