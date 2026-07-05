// ========================================
// SEOメタデータ生成ユーティリティ
// 各ページのgenerateMetadataからこれを呼ぶだけ
// ========================================
import type { Metadata } from "next";
import { getSiteUrl } from "./utils";
import { getToolById } from "@/data/tools";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "ToolBox";
const siteUrl = getSiteUrl();

// ── ページに合わせた動的ファビコン（/api/favicon）───────────
// 対象外ページは undefined を返し、既定の app/icon.tsx が使われる。
const CATEGORY_FAVICONS: Record<string, { e: string; c: string }> = {
  "/pdf": { e: "📄", c: "38bdf8" },
  "/image": { e: "🖼️", c: "a78bfa" },
  "/money": { e: "💰", c: "34d399" },
  "/salary": { e: "💴", c: "34d399" },
  "/business": { e: "💼", c: "818cf8" },
  "/ai": { e: "🤖", c: "22d3ee" },
  "/ceremony": { e: "🎀", c: "e2c08d" },
  "/color": { e: "🎨", c: "c084fc" },
  "/subsidy": { e: "🏛️", c: "818cf8" },
  "/industry/construction": { e: "🏗️", c: "fb923c" },
  "/industry/restaurant": { e: "🍽️", c: "f87171" },
};

function faviconFor(path: string): string | undefined {
  if (path.startsWith("/tools/")) {
    const slug = path.split("/")[2];
    if (slug) return `/api/favicon?tool=${slug}`;
  }
  if (path === "/blog" || path.startsWith("/blog/")) {
    return `/api/favicon?emoji=${encodeURIComponent("📝")}&color=f472b6`;
  }
  const cat = CATEGORY_FAVICONS[path];
  if (cat) return `/api/favicon?emoji=${encodeURIComponent(cat.e)}&color=${cat.c}`;
  return undefined;
}

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
  const favicon = faviconFor(path);

  return {
    // absolute にしてルートlayoutのtemplate（"%s | ToolBox"）の二重付与を防ぐ
    title: { absolute: fullTitle },
    ...(favicon
      ? {
          icons: {
            icon: [{ url: favicon, type: "image/png", sizes: "64x64" }],
          },
        }
      : {}),
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
  const tool = getToolById(slug);
  const icon = tool?.emoji ?? "🧰";
  const ogImage = `/api/og?${new URLSearchParams({ title: toolName, icon, desc: description }).toString()}`;

  return generateMeta({
    title: `${toolName}【無料・登録不要】`,
    description: `${description} 無料・登録不要・スマホ対応。`,
    path: `/tools/${slug}`,
    keywords: [toolName, "無料ツール", "オンライン", ...keywords],
    ogImage,
  });
}
