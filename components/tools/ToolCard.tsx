// ========================================
// ツールカードコンポーネント（トップページ用）
// ========================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/types";

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.href} className="group block">
      <article className="tool-card p-5 h-full">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={tool.title}>
              {tool.icon}
            </span>
            <div className="flex flex-wrap gap-1">
              {tool.isNew && (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                  NEW
                </span>
              )}
              {tool.isPopular && (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                  人気
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {tool.description}
        </p>
      </article>
    </Link>
  );
}
