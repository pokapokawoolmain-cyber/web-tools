import Link from "next/link";
import { ExternalLink, CalendarDays } from "lucide-react";
import type { SubsidyNewsItem, NewsCategory } from "@/data/subsidyNews";

const CATEGORY_STYLE: Record<
  NewsCategory,
  { bg: string; text: string; border: string }
> = {
  公募開始: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800/50" },
  締切間近: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800/50" },
  公募終了: { bg: "bg-slate-100 dark:bg-zinc-800", text: "text-slate-500 dark:text-slate-400", border: "border-slate-200 dark:border-zinc-700" },
  採択結果: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800/50" },
  新制度: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800/50" },
  制度変更: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800/50" },
  重要: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function NewsCard({ item }: { item: SubsidyNewsItem }) {
  const cat = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE["重要"];
  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 sm:p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                NEW
              </span>
            )}
            {item.isImportant && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
                重要
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}
            >
              {item.category}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
              {item.region}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[15px] mb-1.5 leading-snug">
            {item.title}
          </h3>

          {item.summary && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              {item.summary}
            </p>
          )}

          {/* tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* footer */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
              <CalendarDays className="w-3 h-3" />
              <span>{formatDate(item.publishedAt)}</span>
              <span className="mx-1">·</span>
              <span className="text-indigo-400 dark:text-indigo-400">{item.sourceLabel}</span>
            </div>
            <Link
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              公式サイト
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
