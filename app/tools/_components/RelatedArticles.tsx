// ========================================
// ツールページ用「関連ガイド記事」セクション
// data/blogs.ts の relatedToolIds を逆引きして、
// そのツールに関連する解説記事を表示する。
// サーバーコンポーネント（初期HTMLにリンクが入りSEOに有効）。
// 関連記事が無いツールでは何も描画しない（return null）。
//
// 背景・最大幅・余白は呼び出し側に委ねる neutral 設計：
//  - ToolLayout 内では RelatedTools と同じ container 幅に揃う
//  - 素のツールページでは全幅バンドでラップして使う
// ========================================
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getBlogsByToolId } from "@/data/blogs";

type Props = {
  toolId: string;
  /** 見出し。デフォルトは「関連ガイド記事」 */
  title?: string;
  /** 最大表示件数（デフォルト4件） */
  limit?: number;
  /** 外側 <section> に付与する余白・区切りなどのクラス */
  className?: string;
};

export function RelatedArticles({
  toolId,
  title = "関連ガイド記事",
  limit = 4,
  className = "",
}: Props) {
  const articles = getBlogsByToolId(toolId).slice(0, limit);
  if (articles.length === 0) return null;

  return (
    <section aria-label={title} className={className}>
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden />
        {title}
      </h2>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500 mb-4">
        このツールの使い方や、関連するトピックを詳しく解説しています。
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-all hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm"
          >
            <h3 className="text-[14px] font-semibold leading-snug text-slate-900 dark:text-white mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {article.title}
            </h3>
            <p className="text-[12px] leading-relaxed text-slate-500 dark:text-zinc-500 line-clamp-2">
              {article.description}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 dark:text-blue-400">
              記事を読む
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
