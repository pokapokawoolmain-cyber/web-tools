import Link from "next/link";
import { ChevronRight, Clock, RefreshCw } from "lucide-react";
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
  const ogImageUrl = `${siteUrl}/og-default.png`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: articleUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "ja",
    image: ogImageUrl,
    author: { "@type": "Organization", name: "ToolBox", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "ToolBox",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.ico` },
    },
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

  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  const schemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  const publishedStr = new Date(post.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });
  const updatedStr = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("ja-JP", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <>
      <JsonLd data={schemas as Record<string, unknown>[]} />
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
            <div className="flex items-center gap-4 text-[13px] text-slate-400">
              <time dateTime={post.publishedAt}>公開：{publishedStr}</time>
              {updatedStr && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  <time dateTime={post.updatedAt}>更新：{updatedStr}</time>
                </span>
              )}
            </div>
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

          {/* FAQ section */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-14" aria-label="よくある質問">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                よくある質問
              </h2>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none list-none bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                      <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-100">
                        Q. {faq.q}
                      </span>
                      <span className="flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="px-5 py-4 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
                      A. {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related tool CTA */}
          {post.relatedToolHref && (
            <div className="mt-10 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
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
