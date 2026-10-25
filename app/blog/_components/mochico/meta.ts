// Mochico ガイド記事の metadata（第1弾記事 oshi-goods-management と同じ形）
import type { Metadata } from "next";
import type { BlogPost } from "@/data/blog-posts";
import { generateMeta } from "@/lib/seo";

export function mochicoArticleMeta(post: BlogPost, keywords: string[]): Metadata {
  const base = generateMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords,
    ogImage: `/blog/${post.slug}/opengraph-image`,
    type: "article",
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  };
}
