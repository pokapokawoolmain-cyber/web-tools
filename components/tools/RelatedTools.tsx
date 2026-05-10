import Link from "next/link";
import { TOOLS } from "@/data/tools";
import { ChevronRight } from "lucide-react";

export function RelatedTools({ currentId, category }: { currentId: string; category?: string }) {
  const related = TOOLS
    .filter(t => t.id !== currentId && (!category || t.category === category))
    .slice(0, 3);
  if (!related.length) return null;
  return (
    <section>
      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">おすすめのツール</p>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
        {related.map(t => (
          <Link key={t.id} href={t.href} className="flex items-center px-5 py-4 gap-3 hover:opacity-70 transition-opacity">
            <span className="text-xl">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-slate-900 dark:text-white">{t.title}</p>
              <p className="text-[13px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{t.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
