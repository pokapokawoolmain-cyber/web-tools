// ============================================================
// 推し活ガイド（ライブ・会場・遠征の読み物）のレイアウト（ToolBoxJP ブログ内・ポップな白基調）
//   - サーバーコンポーネントのみ（クライアント JS を増やさない）
//   - Mochico ガイド（../mochico/MochicoArticle.tsx）と URL・データ・広告・構造化データの扱いは同じ。見た目だけ分ける
//   - 公式の画像・座席図は転載しない。図は自作し、公式ページへはリンクカードで案内する
//   - 白基調への固定は lib/theme/forced-light-routes.ts（MOCHICO_ARTICLE_PATHS）で行う
// ============================================================
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { BottomAd, InArticleAd } from "@/components/ads/presets";
import { MascotSvg } from "@/lib/mochico/icon-render";
import { getSiteUrl } from "@/lib/utils";
import { BLOG_POSTS, type BlogPost } from "@/data/blog-posts";
import { MOCHICO_GUIDE_CATEGORY } from "../mochico/MochicoArticle";
import s from "./oshi.module.css";
import { ArticleLinkTracker } from "../ArticleLinkTracker";
import { ServicePromoBottom, ServicePromoTop } from "@/components/blog/ServicePromo";

export type TocItem = { id: string; label: string };

/** 推し活ガイドのカテゴリ（関連記事はこのカテゴリと Mochico ガイドから集める） */
export const OSHI_GUIDE_CATEGORY = "推し活ガイド";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+09:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  });

export function OshiArticleLayout({
  post,
  heading,
  heroLead,
  stickers,
  unofficialNote,
  children,
}: {
  post: BlogPost;
  /** h1 の表示（<mark> で一部を強調できる）。構造化データは post.title を使う */
  heading: ReactNode;
  heroLead: string;
  /** Hero に並べるラベル（最大4つ） */
  stickers: string[];
  /** 非公式であることの注記（アーティスト・会場名を扱う記事で出す） */
  unofficialNote?: string;
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
    // よくある質問（記事データに faqs がある記事だけ。画面にも同じ内容を出す）
    ...(post.faqs?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
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
          <div className={s.stickers}>
            {stickers.slice(0, 4).map((t) => (
              <span key={t} className={s.sticker}>
                {t}
              </span>
            ))}
          </div>
          <h1 className={s.h1}>{heading}</h1>
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
          {unofficialNote && <p className={s.unofficial}>{unofficialNote}</p>}
        </header>

        <div className={s.paper}>
          <div className={s.body}>
            <ServicePromoTop post={post} />
            {children}
            {post.faqs && post.faqs.length > 0 && (
              <section aria-labelledby="faq-title">
                <h2 id="faq-title">よくある質問</h2>
                {post.faqs.map((f) => (
                  <details key={f.q} className={s.faq}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </section>
            )}
            <ServicePromoBottom post={post} />
          </div>
        </div>
      </article>

      <RelatedReads currentSlug={post.slug} />

      <div className={s.bottomArea}>
        <BottomAd />
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

/** 推し活ガイド → Mochico ガイドの順に関連記事を出す（最大6件） */
function RelatedReads({ currentSlug }: { currentSlug: string }) {
  const pick = (cat: string) => BLOG_POSTS.filter((p) => p.category === cat && p.slug !== currentSlug);
  const items = [...pick(OSHI_GUIDE_CATEGORY), ...pick(MOCHICO_GUIDE_CATEGORY)].slice(0, 6);
  if (items.length === 0) return null;
  return (
    <aside className={s.related} aria-labelledby="related-reads-title">
      <h2 id="related-reads-title" className={s.relatedTitle}>
        あわせて読みたい
      </h2>
      <ul className={s.relatedList}>
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className={s.relatedLink}>
              <span className={s.relatedTag}>{p.category}</span>
              <span className={s.relatedName}>{p.title}</span>
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
      <summary>もくじ</summary>
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

/** 見出し（番号つき）。id は目次のリンク先 */
export function H2({ id, num, children }: { id: string; num: number; children: ReactNode }) {
  return (
    <h2 id={id}>
      <span className={s.num}>{`POINT ${String(num).padStart(2, "0")}`}</span>
      {children}
    </h2>
  );
}

export function Tldr({ items }: { items: ReactNode[] }) {
  return (
    <div className={s.tldr}>
      <p className={s.tldrTitle}>3行でいうと</p>
      <ol>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </div>
  );
}

/** マスコット「もち」の吹き出し（ひとこと・小ネタ用） */
export function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className={s.bubble}>
      <span className={s.bubbleFace} aria-hidden="true">
        <MascotSvg size={34} />
      </span>
      <div className={s.bubbleBody}>
        <span className={s.bubbleName}>もちのひとこと</span>
        <p>{children}</p>
      </div>
    </div>
  );
}

const CARD_LABEL = { point: "POINT", caution: "ちゅうい", memo: "メモ", info: "公式情報" } as const;
export function Card({
  kind,
  label,
  children,
}: {
  kind: keyof typeof CARD_LABEL;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${s.card} ${s[kind]}`}>
      <p className={s.cardLabel}>{label ?? CARD_LABEL[kind]}</p>
      {children}
    </div>
  );
}

export function Stats({ items }: { items: { num: ReactNode; label: string }[] }) {
  return (
    <div className={s.stats}>
      {items.map((it) => (
        <div key={it.label} className={s.stat}>
          <span className={s.statNum}>{it.num}</span>
          <span className={s.statLabel}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: { date: string; text: ReactNode; hot?: boolean }[] }) {
  return (
    <ol className={s.timeline}>
      {items.map((it, i) => (
        <li key={i} className={it.hot ? s.hot : undefined}>
          <span className={s.tlDate}>{it.date}</span>
          <span className={s.tlText}>{it.text}</span>
        </li>
      ))}
    </ol>
  );
}

export type CheckItem = { text: ReactNode; why?: ReactNode; must?: boolean };
export function Checklist({ title, icon, items }: { title: string; icon: ReactNode; items: CheckItem[] }) {
  return (
    <div className={s.check}>
      <div className={s.checkHead}>
        <span aria-hidden="true">{icon}</span>
        {title}
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" />
              <span>
                {it.must && <span className={s.must}>必須</span>}
                {it.text}
                {it.why && <span className={s.checkWhy}>{it.why}</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OfficialLinks({ items }: { items: { href: string; title: string; icon: ReactNode }[] }) {
  return (
    <div className={s.links}>
      {items.map((it) => (
        <a key={it.href} href={it.href} className={s.link} target="_blank" rel="noopener noreferrer">
          <span className={s.linkIcon} aria-hidden="true">
            {it.icon}
          </span>
          <span className={s.linkText}>
            <span className={s.linkTitle}>{it.title}</span>
            <span className={s.linkDomain}>{new URL(it.href).hostname}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className={s.figure}>
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** Mochico の紹介（記事の流れに沿った一か所だけ。広告と分かる表記を添える） */
export function MochicoNudge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className={s.nudge} aria-label="ToolBoxJPのアプリの紹介">
      <div className={s.nudgeHead}>
        <span aria-hidden="true">
          <MascotSvg size={44} />
        </span>
        <span>
          <span className={s.nudgeKicker}>ToolBoxJP のアプリ</span>
          <span className={s.nudgeTitle}>{title}</span>
        </span>
      </div>
      {children}
      <Link href="/mochico" className={s.nudgeButton}>
        Mochico（モチコ）を見てみる<span aria-hidden="true">→</span>
      </Link>
      <span className={s.nudgeNote}>無料・アプリのダウンロード不要（ブラウザで使えます）</span>
    </aside>
  );
}

/** 体験談のまとめ（ファンの投稿・ブログ・Q&A を編集部が要約したもの。原文の転載はしない） */
export function FanVoices({ title, items }: { title: string; items: { text: ReactNode; from: string }[] }) {
  return (
    <div className={s.voices}>
      <p className={s.voicesTitle}>
        <span aria-hidden="true">💬</span>
        {title}
      </p>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <span className={s.voiceText}>{it.text}</span>
            <span className={s.voiceFrom}>{it.from}</span>
          </li>
        ))}
      </ul>
      <p className={s.voicesNote}>
        ファンの体験談を編集部が要約したものです。公演や時期によって状況は変わります。
      </p>
    </div>
  );
}

export function Sources({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className={s.sources}>
      <p className={s.sourcesTitle}>この記事で参考にした情報</p>
      <ul>
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} target="_blank" rel="noopener noreferrer">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArticleAd() {
  return (
    <div className={s.adArea}>
      <InArticleAd />
    </div>
  );
}

export { s as oshiStyles };
