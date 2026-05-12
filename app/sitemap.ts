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
    { url: `${siteUrl}/blog/furusato-nozei-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/mercari-fees-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/mortgage-simulation-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // PDF活用 8記事
    { url: `${siteUrl}/blog/pdf-merge-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-compress-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-split-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-to-jpg-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/jpg-to-pdf-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-rotate-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-password-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/iphone-pdf-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // PDF応用 3記事
    { url: `${siteUrl}/blog/pdf-watermark-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-privacy-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-reorder-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 画像変換 3記事
    { url: `${siteUrl}/blog/heic-jpg-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/heic-what-is`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/image-compress-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // QR・テキスト 3記事
    { url: `${siteUrl}/blog/qr-create-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/wifi-qr-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/url-shorten-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 証明写真 3記事
    { url: `${siteUrl}/blog/id-photo-convenience`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/id-photo-size-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/id-photo-smartphone`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 投資・お金 3記事
    { url: `${siteUrl}/blog/nisa-ideco-compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/investment-beginner-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/side-job-tax-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 生活・計算 3記事
    { url: `${siteUrl}/blog/shift-salary-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/gas-cost-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/point-return-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 学生・仕事 2記事
    { url: `${siteUrl}/blog/gpa-calculation-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/resume-writing-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // 動画・テキスト 2記事
    { url: `${siteUrl}/blog/video-compress-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/word-count-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
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
