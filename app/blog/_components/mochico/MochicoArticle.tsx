// ============================================================
// Mochico 関連記事のレイアウト（ToolBoxJP ブログ内・白基調）
//   - サーバーコンポーネントのみ（クライアント JS を増やさない）
//   - 通常ブログ（BlogLayout）とは見た目だけ分け、URL・データ・広告の扱いは既存ブログに合わせる
//   - 構造化データは BlogPosting + BreadcrumbList。FAQ / 評価 / 架空の著者資格は入れない
//   - 白基調への固定は lib/theme/forced-light-routes.ts（MOCHICO_ARTICLE_PATHS）で行う
// ============================================================
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { BottomAd, InArticleAd } from "@/components/ads/presets";
import { MascotSvg } from "@/lib/mochico/icon-render";
import { getSiteUrl } from "@/lib/utils";
import { BLOG_POSTS, type BlogPost } from "@/data/blog-posts";
import s from "./article.module.css";

export type TocItem = { id: string; label: string };

/** Mochico ガイド記事のカテゴリ（関連記事・LP のガイド一覧はこのカテゴリで集める） */
export const MOCHICO_GUIDE_CATEGORY = "推し活・グッズ管理";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+09:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  });

export function MochicoArticleLayout({
  post,
  heroLead,
  children,
}: {
  post: BlogPost;
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
            <span className={s.brand}>
              <span aria-hidden="true">
                <MascotSvg size={18} />
              </span>
              Mochico ガイド
            </span>
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
          <div className={s.body}>{children}</div>
        </div>
      </article>

      <RelatedGuides currentSlug={post.slug} />

      <div className={s.bottomArea}>
        <BottomAd />
        <p className={s.footerNote}>
          <Link href="/blog" className={s.back}>
            ← ブログ一覧に戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

/** 同じカテゴリのガイド記事と Mochico 紹介ページへのリンク（記事どうしを相互につなぐ） */
function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const others = BLOG_POSTS.filter((p) => p.category === MOCHICO_GUIDE_CATEGORY && p.slug !== currentSlug);
  if (others.length === 0) return null;
  return (
    <aside className={s.related} aria-labelledby="related-guides-title">
      <h2 id="related-guides-title" className={s.relatedTitle}>
        推しグッズ管理のガイド
      </h2>
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
      <p className={s.relatedLp}>
        <Link href="/mochico">推しグッズ管理アプリ「Mochico（モチコ）」の紹介ページ →</Link>
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

/** 記事中の広告（ブログの既存方針どおり。答えにたどり着く前には置かない） */
export function ArticleAd() {
  return (
    <div className={s.adArea}>
      <InArticleAd />
    </div>
  );
}

export function MochicoCta({ title, sub, label = "Mochicoを見てみる" }: { title: string; sub: string; label?: string }) {
  return (
    <div className={s.cta}>
      <span className={s.ctaMascot} aria-hidden="true">
        <MascotSvg size={40} />
      </span>
      <div className={s.ctaText}>
        <p className={s.ctaTitle}>{title}</p>
        <p className={s.ctaSub}>{sub}</p>
      </div>
      <Link href="/mochico" className={s.ctaButton}>
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export { s as articleStyles };
