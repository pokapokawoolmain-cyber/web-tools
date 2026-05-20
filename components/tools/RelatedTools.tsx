// ========================================
// 関連ツール自動回遊コンポーネント
// data/related-tools.ts のマップから自動表示
// ========================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { getRelatedToolIds } from "@/data/related-tools";

type Props = {
  toolId: string;
  className?: string;
};

export function RelatedTools({ toolId, className }: Props) {
  const relatedIds = getRelatedToolIds(toolId, 4);
  const relatedTools = relatedIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  if (relatedTools.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">関連ツール</h2>
        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">一緒によく使われます</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedTools.map((tool) => (
          <Link key={tool.id} href={tool.href} className="group block">
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                {tool.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {tool.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-1 mt-0.5">
                  {tool.description.slice(0, 40)}…
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
