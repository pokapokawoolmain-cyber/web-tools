// ========================================
// Sitemap生成
// /sitemap.xml にアクセスすると自動生成される
// ========================================
import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pdf-tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/blog/fire-how-much-needed`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/nisa-monthly-simulation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/salary-takehome-table`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/finance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/image`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/lifestyle`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/text`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/student`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/pdf-rotate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-watermark`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-delete-pages`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-reorder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-password`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-metadata-remover`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // 各ツールページ
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
