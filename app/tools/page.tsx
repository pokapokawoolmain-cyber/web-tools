import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, getToolsByCategory, CATEGORY_SLUGS } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { generateMeta } from "@/lib/seo";
import { BottomAd } from "@/components/ads/presets";

export const metadata: Metadata = generateMeta({
  title: "無料Webツール一覧",
  description: `FIRE計算・NISA積立・画像変換など全${TOOLS.length}種類の無料ツール。登録不要・スマホ対応・ブラウザ完結。`,
  path: "/tools",
  keywords: ["無料ツール", "Webツール", "オンラインツール", "便利ツール"],
});

export default function ToolsPage() {
  const toolsByCategory = getToolsByCategory();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Hero */}
      <section className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            無料Webツール一覧
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            全{TOOLS.length}ツール・登録不要・スマホ対応・ブラウザ完結
          </p>
          {/* Category links */}
          <div className="flex flex-wrap gap-2 mt-5">
            {Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="text-[13px] px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools by category */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {Object.entries(toolsByCategory).map(([category, categoryTools]) => {
          const slug = CATEGORY_SLUGS[category as keyof typeof CATEGORY_SLUGS];
          return (
            <section key={category}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category}</h2>
                <Link
                  href={`/tools/${slug}`}
                  className="text-[13px] text-blue-500 hover:text-blue-600 transition-colors"
                >
                  一覧を見る →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ページ下部広告 */}
        <BottomAd />
      </div>
    </div>
  );
}
