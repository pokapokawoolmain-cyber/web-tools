// ========================================
// ブログカード — 2モード
//   featured: カテゴリTOPの大カード
//   compact : 一覧・サイドバー用小カード
// ========================================
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { BlogEntry } from "@/data/blogs";

type Props = {
  blog: BlogEntry;
  variant?: "featured" | "compact";
  /** カテゴリカラー（Tailwind テキストクラス） */
  accentColor?: string;
  /** 関連ツールへのリンクを表示するか */
  showRelatedTool?: boolean;
};

// カテゴリ別デフォルトカラー（accentColor 未指定時）
const CATEGORY_COLORS: Record<string, string> = {
  pdf: "text-rose-600 dark:text-rose-400",
  image: "text-violet-600 dark:text-violet-400",
  money: "text-emerald-600 dark:text-emerald-400",
  text: "text-blue-600 dark:text-blue-400",
  calculator: "text-orange-600 dark:text-orange-400",
  student: "text-indigo-600 dark:text-indigo-400",
  lifestyle: "text-teal-600 dark:text-teal-400",
};

const CATEGORY_LABELS: Record<string, string> = {
  pdf: "PDF活用",
  image: "画像・動画",
  money: "お金・投資",
  text: "テキスト・Web",
  calculator: "計算ツール",
  student: "学生向け",
  lifestyle: "生活・副業",
};

export function BlogCard({
  blog,
  variant = "compact",
  accentColor,
}: Props) {
  const color = accentColor ?? CATEGORY_COLORS[blog.category] ?? "text-blue-600 dark:text-blue-400";
  const label = CATEGORY_LABELS[blog.category] ?? "記事";

  if (variant === "featured") {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block">
        <article className="relative h-full rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
          {/* 右下グロー */}
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -right-8 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-2xl"
          />
          <div className="relative">
            {/* カテゴリバッジ */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 ${color}`}>
                <BookOpen className="w-3 h-3" />
                {label}
              </span>
              {blog.isPopular && (
                <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  人気
                </span>
              )}
            </div>

            {/* タイトル */}
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
              {blog.title}
            </h3>

            {/* 説明 */}
            <p className="text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed line-clamp-2 mb-4">
              {blog.description}
            </p>

            {/* タグ */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 読む→ */}
            <div className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${color} group-hover:gap-2.5 transition-all`}>
              読む <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // compact
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <article className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <BookOpen className={`w-4 h-4 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white text-[13px] leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {blog.title}
          </h3>
          {blog.isPopular && (
            <span className="inline-block text-[10px] font-bold text-orange-600 dark:text-orange-400">
              人気記事
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
      </article>
    </Link>
  );
}
