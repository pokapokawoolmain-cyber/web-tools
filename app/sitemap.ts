// ========================================
// Sitemap生成
// /sitemap.xml にアクセスすると自動生成される
// ========================================
import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { BLOG_POSTS } from "@/data/blog-posts";
import { getSiteUrl } from "@/lib/utils";

function blogDate(slug: string): Date {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return new Date("2026-05-12");
  return new Date(post.updatedAt ?? post.publishedAt);
}

const TOOL_LAUNCH = new Date("2026-05-10");
const SITE_LAUNCH = new Date("2026-05-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    // カテゴリTOPページ（SEO強化）
    { url: `${siteUrl}/pdf`, lastModified: new Date("2026-05-17"), changeFrequency: "monthly", priority: 0.92 },
    { url: `${siteUrl}/image`, lastModified: new Date("2026-05-17"), changeFrequency: "monthly", priority: 0.92 },
    { url: `${siteUrl}/money`, lastModified: new Date("2026-05-17"), changeFrequency: "monthly", priority: 0.92 },
    { url: `${siteUrl}/pdf-tools`, lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/blog/fire-how-much-needed`, lastModified: blogDate("fire-how-much-needed"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/nisa-monthly-simulation`, lastModified: blogDate("nisa-monthly-simulation"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/salary-takehome-table`, lastModified: blogDate("salary-takehome-table"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/furusato-nozei-guide`, lastModified: blogDate("furusato-nozei-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/mercari-fees-guide`, lastModified: blogDate("mercari-fees-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/mortgage-simulation-guide`, lastModified: blogDate("mortgage-simulation-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 手取りカテゴリ TOP
    { url: `${siteUrl}/salary`, lastModified: new Date("2026-05-17"), changeFrequency: "monthly", priority: 0.9 },
    // 手取り年収別（高ボリュームクエリ）
    { url: `${siteUrl}/blog/takehome-300`, lastModified: blogDate("takehome-300"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-400`, lastModified: blogDate("takehome-400"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-500`, lastModified: blogDate("takehome-500"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-600`, lastModified: blogDate("takehome-600"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-700`, lastModified: blogDate("takehome-700"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-800`, lastModified: blogDate("takehome-800"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-900`, lastModified: blogDate("takehome-900"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-1000`, lastModified: blogDate("takehome-1000"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/nencho-guide`, lastModified: blogDate("nencho-guide"), changeFrequency: "yearly", priority: 0.88 },
    { url: `${siteUrl}/blog/furusato-limit-by-income`, lastModified: blogDate("furusato-limit-by-income"), changeFrequency: "yearly", priority: 0.86 },
    // 手取り補完 3記事
    { url: `${siteUrl}/blog/takehome-2026`, lastModified: blogDate("takehome-2026"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/takehome-20s`, lastModified: blogDate("takehome-20s"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/bonus-takehome`, lastModified: blogDate("bonus-takehome"), changeFrequency: "monthly", priority: 0.8 },
    // FIRE・資産形成 3記事
    { url: `${siteUrl}/blog/fire-monthly-5man`, lastModified: blogDate("fire-monthly-5man"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/fire-4percent-rule`, lastModified: blogDate("fire-4percent-rule"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/nisa-fire-strategy`, lastModified: blogDate("nisa-fire-strategy"), changeFrequency: "monthly", priority: 0.8 },
    // PDF補完 3記事
    { url: `${siteUrl}/blog/iphone-pdf-merge`, lastModified: blogDate("iphone-pdf-merge"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-compress-tips`, lastModified: blogDate("pdf-compress-tips"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-edit-smartphone`, lastModified: blogDate("pdf-edit-smartphone"), changeFrequency: "monthly", priority: 0.8 },
    // PDF活用 8記事
    { url: `${siteUrl}/blog/pdf-merge-guide`, lastModified: blogDate("pdf-merge-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-compress-guide`, lastModified: blogDate("pdf-compress-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-split-guide`, lastModified: blogDate("pdf-split-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-to-jpg-guide`, lastModified: blogDate("pdf-to-jpg-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/jpg-to-pdf-guide`, lastModified: blogDate("jpg-to-pdf-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-rotate-guide`, lastModified: blogDate("pdf-rotate-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-password-guide`, lastModified: blogDate("pdf-password-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/iphone-pdf-guide`, lastModified: blogDate("iphone-pdf-guide"), changeFrequency: "monthly", priority: 0.8 },
    // PDF応用 3記事
    { url: `${siteUrl}/blog/pdf-watermark-guide`, lastModified: blogDate("pdf-watermark-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-privacy-guide`, lastModified: blogDate("pdf-privacy-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/pdf-reorder-guide`, lastModified: blogDate("pdf-reorder-guide"), changeFrequency: "monthly", priority: 0.8 },
    // AI文章ツールカテゴリ
    { url: `${siteUrl}/ai`, lastModified: new Date("2026-05-22"), changeFrequency: "weekly", priority: 0.92 },
    { url: `${siteUrl}/blog/chatgpt-format-guide`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/ai-text-natural-guide`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/x-post-format-guide`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.8 },
    // 冠婚葬祭・文書カテゴリ
    { url: `${siteUrl}/ceremony`, lastModified: new Date("2026-05-22"), changeFrequency: "weekly", priority: 0.92 },
    { url: `${siteUrl}/tools/noshi-maker`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/koden-maker`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/resignation-letter`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/fax-cover`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/noshi-paper-guide`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/koden-writing-guide`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    // PDF・画像 新規 8記事
    { url: `${siteUrl}/blog/pdf-confidential-watermark`, lastModified: blogDate("pdf-confidential-watermark"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/pdf-draft-watermark`, lastModified: blogDate("pdf-draft-watermark"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/pdf-remove-personal-info`, lastModified: blogDate("pdf-remove-personal-info"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/pdf-check-metadata`, lastModified: blogDate("pdf-check-metadata"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/heic-to-jpg-iphone`, lastModified: blogDate("heic-to-jpg-iphone"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/id-photo-convenience-store`, lastModified: blogDate("id-photo-convenience-store"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/resume-photo-size`, lastModified: blogDate("resume-photo-size"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/pdf-delete-pages-guide`, lastModified: blogDate("pdf-delete-pages-guide"), changeFrequency: "monthly", priority: 0.85 },
    // 画像変換 3記事
    { url: `${siteUrl}/blog/heic-jpg-guide`, lastModified: blogDate("heic-jpg-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/heic-what-is`, lastModified: blogDate("heic-what-is"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/image-compress-guide`, lastModified: blogDate("image-compress-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/image-resize-guide`, lastModified: blogDate("image-resize-guide"), changeFrequency: "monthly", priority: 0.82 },
    { url: `${siteUrl}/blog/line-photo-size-guide`, lastModified: blogDate("line-photo-size-guide"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/android-pdf-guide`, lastModified: blogDate("android-pdf-guide"), changeFrequency: "monthly", priority: 0.83 },
    { url: `${siteUrl}/blog/estimate-guide`, lastModified: blogDate("estimate-guide"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/hanko-create-guide`, lastModified: blogDate("hanko-create-guide"), changeFrequency: "monthly", priority: 0.83 },
    { url: `${siteUrl}/blog/tax-docs-pdf-guide`, lastModified: blogDate("tax-docs-pdf-guide"), changeFrequency: "monthly", priority: 0.87 },
    // QR・テキスト 3記事
    { url: `${siteUrl}/blog/qr-create-guide`, lastModified: blogDate("qr-create-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/wifi-qr-guide`, lastModified: blogDate("wifi-qr-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/url-shorten-guide`, lastModified: blogDate("url-shorten-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 証明写真 3記事
    { url: `${siteUrl}/blog/id-photo-convenience`, lastModified: blogDate("id-photo-convenience"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/id-photo-size-guide`, lastModified: blogDate("id-photo-size-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/id-photo-smartphone`, lastModified: blogDate("id-photo-smartphone"), changeFrequency: "monthly", priority: 0.8 },
    // 投資・お金 3記事
    { url: `${siteUrl}/blog/nisa-ideco-compare`, lastModified: blogDate("nisa-ideco-compare"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/investment-beginner-guide`, lastModified: blogDate("investment-beginner-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/side-job-tax-guide`, lastModified: blogDate("side-job-tax-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 生活・計算 3記事
    { url: `${siteUrl}/blog/shift-salary-guide`, lastModified: blogDate("shift-salary-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/gas-cost-guide`, lastModified: blogDate("gas-cost-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/point-return-guide`, lastModified: blogDate("point-return-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 学生・仕事 2記事
    { url: `${siteUrl}/blog/gpa-calculation-guide`, lastModified: blogDate("gpa-calculation-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/resume-writing-guide`, lastModified: blogDate("resume-writing-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 動画・テキスト 2記事
    { url: `${siteUrl}/blog/video-compress-guide`, lastModified: blogDate("video-compress-guide"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog/word-count-guide`, lastModified: blogDate("word-count-guide"), changeFrequency: "monthly", priority: 0.8 },
    // 税金・社会保険 3記事
    { url: `${siteUrl}/blog/jumin-zei-guide`, lastModified: blogDate("jumin-zei-guide"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/shakai-hoken-guide`, lastModified: blogDate("shakai-hoken-guide"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/blog/furusato-nozei-howto`, lastModified: blogDate("furusato-nozei-howto"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/finance`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/calculator`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/image`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/lifestyle`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/text`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/student`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/work`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/tools/pdf-rotate`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-watermark`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-delete-pages`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-reorder`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-password`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/pdf-metadata-remover`, lastModified: TOOL_LAUNCH, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/tools/chatgpt-format`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/ai-humanize`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/x-post-preview`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/tools/note-format`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/privacy`, lastModified: new Date("2026-05-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date("2026-05-01"), changeFrequency: "yearly", priority: 0.3 },
    // 補助金・助成金診断セカンドライン
    { url: `${siteUrl}/subsidy`, lastModified: new Date("2026-05-23"), changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/subsidy/list`, lastModified: new Date("2026-05-23"), changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/subsidy/area`, lastModified: new Date("2026-05-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/subsidy/purpose`, lastModified: new Date("2026-05-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/subsidy/news`, lastModified: new Date("2026-05-23"), changeFrequency: "weekly", priority: 0.85 },
  ];

  // 各ツールページ
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}${tool.href}`,
    lastModified: TOOL_LAUNCH,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
