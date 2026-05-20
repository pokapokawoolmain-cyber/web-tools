// ========================================
// カテゴリTOP — ブログ記事セクション
// getFeaturedBlogsByCategory() でデータを取得
// ========================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogCategory } from "@/data/blogs";
import { getFeaturedBlogsByCategory, getBlogsByCategory } from "@/data/blogs";
import { BlogCard } from "@/components/blog/BlogCard";

type Props = {
  category: BlogCategory;
  sectionTitle: string;   // 例: "PDF活用ガイド"
  accentColor: string;    // Tailwind テキストクラス
};

export function CategoryBlogSection({ category, sectionTitle, accentColor }: Props) {
  const featured = getFeaturedBlogsByCategory(category);       // isFeatured=true の記事
  const all = getBlogsByCategory(category);
  const remaining = all.filter((b) => !b.isFeatured);          // 一覧に表示

  return (
    <section>
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {sectionTitle}
          </h2>
          <span className="text-[12px] text-slate-400 dark:text-zinc-500 font-medium">
            全{all.length}記事
          </span>
        </div>
        <Link
          href="/blog"
          className={`hidden sm:inline-flex items-center gap-1 text-[13px] font-medium ${accentColor} hover:opacity-70 transition-opacity`}
        >
          すべて見る <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* フィーチャード記事グリッド */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {featured.map((blog) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              variant="featured"
              accentColor={accentColor}
            />
          ))}
        </div>
      )}

      {/* 残りの記事コンパクト一覧 */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {remaining.slice(0, 6).map((blog) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              variant="compact"
              accentColor={accentColor}
            />
          ))}
        </div>
      )}

      {/* もっと見るリンク（スマホ + 記事が多い場合） */}
      <div className="mt-5 flex items-center justify-between">
        <Link
          href="/blog"
          className="sm:hidden inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors"
        >
          すべての記事を見る <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {all.length > featured.length + 6 && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors"
          >
            他{all.length - featured.length - 6}記事を見る <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </section>
  );
}
