// ============================================================
// SNS Starter Kit 関連記事のレイアウト（ToolBoxJP ブログ内・白基調）
//   - Mochico 記事（../mochico/MochicoArticle.tsx）と同じ構成。サーバーコンポーネントのみ
//   - 商品を紹介する記事のため、広告は置かない
//   - 構造化データは BlogPosting + BreadcrumbList。FAQ / 評価 / 架空の著者資格は入れない
//   - 商品について書いてよいこと（確認済みの機能・動作環境・価格・ライセンス）は
//     lib/sns-starter-kit/content.ts と commerce.ts に従う
//   - 白基調への固定は lib/theme/forced-light-routes.ts（SNS_KIT_ARTICLE_PATHS）で行う
// ============================================================
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { BLOG_POSTS, type BlogPost } from "@/data/blog-posts";
import s from "./article.module.css";
import { ServicePromoBottom, ServicePromoTop } from "@/components/blog/ServicePromo";
import { ArticleLinkTracker } from "../ArticleLinkTracker";

export type TocItem = { id: string; label: string };

/** SNS Starter Kit のガイド記事のカテゴリ（関連記事・活用ガイドの記事一覧はこのカテゴリで集める） */
export const SNS_KIT_GUIDE_CATEGORY = "コミュニティSNSづくり";

/** 記事の読み手（活用ガイドでの振り分けに使う） */
export type SnsKitAudience = "organizer" | "developer";
export const AUDIENCE_LABEL: Record<SnsKitAudience, string> = {
  organizer: "コミュニティを運営する方へ",
  developer: "自分のサービスを作る開発者へ",
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+09:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  });

export function SnsKitArticleLayout({
  post,
  audience,
  heroLead,
  children,
}: {
  post: BlogPost;
  audience: SnsKitAudience;
  /** Hero に置く短い説明（meta description とは別に、読み物として自然な一文） */
  heroLead: string;
  children: ReactNode;
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  const image = `${siteUrl}/blog/${post.slug}/opengraph-image`;
  const modified = post.updatedAt ?? post.publishedAt;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: `${post.publishedAt}T00:00:00+09:00`,
      dateModified: `${modified}T00:00:00+09:00`,
      inLanguage: "ja",
      image,
      author: { "@type": "Organization", name: "ToolBoxJP", url: siteUrl },
      publisher: {
        "@type": "Organization",
        name: "ToolBoxJP",
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/icon` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "ブログ", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <ArticleLinkTracker slug={post.slug}>
    <div className={s.page}>
      <JsonLd data={schemas} />

      <nav aria-label="パンくずリスト" className={s.crumbs}>
        <ol>
          <li>
            <Link href="/">ToolBox</Link>
          </li>
          <li>
            <Link href="/blog">ブログ</Link>
          </li>
          <li aria-current="page">{post.category}</li>
        </ol>
      </nav>

      <article>
        <header className={s.hero}>
          <div className={s.kicker}>
            <span className={s.category}>{post.category}</span>
            <span className={s.brand}>{AUDIENCE_LABEL[audience]}</span>
          </div>
          <h1 className={s.h1}>{post.title}</h1>
          <p className={s.lead}>{heroLead}</p>
          <p className={s.meta}>
            <span>
              公開：<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span>
                更新：<time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </span>
            )}
            <span>読了目安 約{post.readingMinutes}分</span>
            <span>文：ToolBoxJP編集部</span>
          </p>
        </header>

        <div className={s.paper}>
          <div className={s.body}>
            <ServicePromoTop post={post} />
            {children}
            <ServicePromoBottom post={post} />
          </div>
        </div>
      </article>

      <RelatedGuides currentSlug={post.slug} />

      <div className={s.bottomArea}>
        <p className={s.footerNote}>
          <Link href="/blog" className={s.back}>
            ← ブログ一覧に戻る
          </Link>
        </p>
      </div>
    </div>
    </ArticleLinkTracker>
  );
}

/** 同じカテゴリの記事と、活用ガイド・販売ページへのリンク */
function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const others = BLOG_POSTS.filter((p) => p.category === SNS_KIT_GUIDE_CATEGORY && p.slug !== currentSlug);
  return (
    <aside className={s.related} aria-labelledby="related-guides-title">
      <h2 id="related-guides-title" className={s.relatedTitle}>
        コミュニティSNSづくりの記事
      </h2>
      {others.length > 0 && (
        <ul className={s.relatedList}>
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className={s.relatedLink}>
                <span className={s.relatedName}>{p.title}</span>
                <span className={s.relatedDesc}>{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className={s.relatedLp}>
        <Link href="/sns-starter-kit/guide">SNS Starter Kit の活用ガイド（作れるSNSの例・導入の流れ・よくある質問） →</Link>
      </p>
    </aside>
  );
}

export function Toc({ items }: { items: TocItem[] }) {
  return (
    <details className={s.toc} open>
      <summary>この記事の目次</summary>
      <nav aria-label="目次">
        <ol>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`}>{it.label}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

export function SnsKitCta({
  title,
  sub,
  href = "/sns-starter-kit",
  label = "SNS Starter Kit を見る",
}: {
  title: string;
  sub: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className={s.cta}>
      <div className={s.ctaText}>
        <p className={s.ctaTitle}>{title}</p>
        <p className={s.ctaSub}>{sub}</p>
      </div>
      <Link href={href} className={s.ctaButton}>
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export { s as articleStyles };
