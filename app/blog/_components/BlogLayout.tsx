import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import type { BlogPost } from "@/data/blog-posts";

type Props = {
  post: BlogPost;
  children: React.ReactNode;
};

export function BlogLayout({ post, children }: Props) {
  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: articleUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "ja",
    author: { "@type": "Organization", name: "ToolBox", url: siteUrl },
    publisher: { "@type": "Organization", name: "ToolBox", url: siteUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "ブログ", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  const dateStr = new Date(post.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1 text-[13px] text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">ToolBox</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-slate-600 transition-colors">ブログ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-500 truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-slate-400">
                <Clock className="w-3 h-3" />約{post.readingMinutes}分
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-4">
              {post.title}
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {post.description}
            </p>
            <time className="text-[13px] text-slate-400" dateTime={post.publishedAt}>
              {dateStr}
            </time>
          </header>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none
            prose-h2:text-xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-[17px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
            prose-li:text-[15px] prose-li:leading-relaxed
            prose-table:text-[14px]
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>

          {/* Related tool CTA */}
          {post.relatedToolHref && (
            <div className="mt-14 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">この記事で使ったツール</p>
              <Link
                href={post.relatedToolHref}
                className="inline-flex items-center gap-2 text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80 transition-opacity"
              >
                無料で試す →
              </Link>
            </div>
          )}

          {/* Back */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-800">
            <Link href="/blog" className="text-[14px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              ← ブログ一覧に戻る
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
