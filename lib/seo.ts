// ========================================
// SEOメタデータ生成ユーティリティ
// 各ページのgenerateMetadataからこれを呼ぶだけ
// ========================================
import type { Metadata } from "next";
import { getSiteUrl } from "./utils";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "ToolBox";
const siteUrl = getSiteUrl();

type GenerateMetaOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function generateMeta({
  title,
  description,
  path = "/",
  keywords = [],
  ogImage = "/og-default.png",
  noIndex = false,
  type = "website",
}: GenerateMetaOptions): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteName }],
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

/** ツールページ用のメタデータ生成（共通テンプレート） */
export function generateToolMeta(
  toolName: string,
  description: string,
  slug: string,
  keywords: string[] = []
): Metadata {
  return generateMeta({
    title: `${toolName}【無料・登録不要】`,
    description: `${description} 無料・登録不要・スマホ対応。`,
    path: `/${slug}`,
    keywords: [toolName, "無料ツール", "オンライン", ...keywords],
  });
}
