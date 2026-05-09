// ========================================
// Sitemap生成
// /sitemap.xml にアクセスすると自動生成される
// ========================================
import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  // トップページ
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // ツールページを自動生成
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
