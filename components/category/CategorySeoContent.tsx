import { CATEGORY_SEO } from "@/data/category-seo";

/**
 * カテゴリページの独自SEO読み物セクション。
 * data/category-seo.ts のスラッグ別コンテンツを描画する。
 * 該当スラッグが無い場合は何も描画しない。
 */
export function CategorySeoContent({ slug }: { slug: string }) {
  const blocks = CATEGORY_SEO[slug];
  if (!blocks || blocks.length === 0) return null;

  return (
    <section aria-label="このカテゴリについて" className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 sm:p-8">
      <div className="space-y-7 max-w-3xl">
        {blocks.map((b) => (
          <div key={b.h}>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2.5">{b.h}</h2>
            {b.p && <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{b.p}</p>}
            {b.list && (
              <ul className="mt-1 space-y-1.5 text-[14px] text-slate-600 dark:text-slate-400">
                {b.list.map((li, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-slate-300 dark:text-zinc-600 shrink-0">・</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
