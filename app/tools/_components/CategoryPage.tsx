import React from "react";
import Link from "next/link";
import { ToolItem, CATEGORY_SLUGS } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ChevronRight } from "lucide-react";
import { BottomAd } from "@/components/ads/presets";

type Props = {
  category: string;
  slug: string;
  description: string;
  tools: ToolItem[];
  seoContent?: React.ReactNode;
};

export function CategoryPage({ category, slug, description, tools, seoContent }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1 text-[13px] text-slate-400">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ホーム</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/tools" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ツール一覧</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-300">{category}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white dark:bg-zinc-900 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-[13px] text-blue-500 font-medium mb-2">カテゴリ</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {category}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] max-w-xl">
            {description}
          </p>
          <p className="text-[13px] text-slate-400 mt-3">全{tools.length}ツール・無料・登録不要</p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
          ))}
        </div>
      </section>

      {/* SEO content */}
      {seoContent && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 sm:p-8">
            {seoContent}
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-[13px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">他のカテゴリ</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_SLUGS)
            .filter(([, s]) => s !== slug)
            .map(([cat, s]) => (
              <Link
                key={s}
                href={`/tools/${s}`}
                className="text-[13px] px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {cat}
              </Link>
            ))}
        </div>

        {/* ページ下部広告 */}
        <BottomAd className="mt-8" />
      </section>
    </div>
  );
}
