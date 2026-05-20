// ========================================
// カテゴリTOP - ツールカード
// ========================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolItem } from "@/data/tools";

type Props = {
  tool: ToolItem;
  accentColor: string;
  featured?: boolean;
};

export function CategoryToolCard({ tool, accentColor, featured = false }: Props) {
  if (featured) {
    return (
      <Link href={tool.href} className="group block">
        <article className="relative h-full rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
          {/* グロー背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />

          <div className="relative">
            {/* アイコン + バッジ */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {tool.emoji}
                </div>
                <div className="flex flex-col gap-1">
                  {tool.isPopular && (
                    <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                      人気
                    </span>
                  )}
                  {tool.isNew && (
                    <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className={`h-5 w-5 ${accentColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
            </div>

            {/* タイトル */}
            <h3 className={`font-bold text-slate-900 dark:text-white text-[16px] mb-2 group-hover:${accentColor} transition-colors`}>
              {tool.seoTitle ?? tool.title}
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {tool.description}
            </p>

            {/* 使うボタン */}
            <div className={`mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold ${accentColor} group-hover:gap-2.5 transition-all`}>
              無料で使う <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // 通常サイズ（一覧用）
  return (
    <Link href={tool.href} className="group block">
      <article className="flex items-start gap-4 rounded-xl border border-slate-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {tool.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-[14px] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h3>
            {tool.isNew && (
              <span className="flex-shrink-0 inline-block px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                NEW
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 dark:text-zinc-500 line-clamp-1">
            {tool.description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
      </article>
    </Link>
  );
}
