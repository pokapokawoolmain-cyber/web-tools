import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import { generateMeta } from "@/lib/seo";
import { Clock } from "lucide-react";

export const metadata: Metadata = generateMeta({
  title: "ブログ｜お金・投資・節税の解説記事",
  description: "FIREシミュレーション・新NISA・手取り計算など、お金に関する実践的な解説記事。ツールと合わせて読むとさらに理解が深まります。",
  path: "/blog",
  keywords: ["FIRE", "新NISA", "手取り計算", "お金", "投資", "節税"],
});

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <section className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">ブログ</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            お金・投資・節税に関する実践的な解説記事
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        {BLOG_POSTS.map((post) => {
          const dateStr = new Date(post.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric", month: "long", day: "numeric",
          });
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white dark:bg-zinc-900 rounded-2xl p-6 hover:shadow-md transition-shadow border border-slate-100 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-slate-400">
                  <Clock className="w-3 h-3" />約{post.readingMinutes}分
                </span>
              </div>
              <h2 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {post.description}
              </p>
              <time className="text-[12px] text-slate-400 mt-3 block" dateTime={post.publishedAt}>
                {dateStr}
              </time>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
