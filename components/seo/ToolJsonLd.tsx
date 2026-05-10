import { getSiteUrl } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

type Props = {
  slug: string;
  title: string;
  description: string;
};

export function ToolJsonLd({ slug, title, description }: Props) {
  const siteUrl = getSiteUrl();
  const toolUrl = `${siteUrl}/tools/${slug}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      description,
      url: toolUrl,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      inLanguage: "ja",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "ツール一覧", item: `${siteUrl}/tools` },
        { "@type": "ListItem", position: 3, name: title, item: toolUrl },
      ],
    },
  ];

  return <JsonLd data={schemas as Record<string, unknown>[]} />;
}
