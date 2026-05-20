// ========================================
// カテゴリTOP - ツールグリッド（人気 + 全一覧）
// ========================================
import type { ToolItem } from "@/data/tools";
import { CategoryToolCard } from "./CategoryToolCard";

type Props = {
  popularTools: ToolItem[];
  allTools: ToolItem[];
  accentColor: string;
  categoryName: string;
};

export function CategoryToolGrid({ popularTools, allTools, accentColor, categoryName }: Props) {
  // 全ツール一覧から人気ツールを除外
  const remainingTools = allTools.filter(
    (t) => !popularTools.some((p) => p.id === t.id)
  );

  return (
    <div className="space-y-12">
      {/* 人気ツール（フィーチャード） */}
      {popularTools.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              人気ツール
            </h2>
            <span className="text-[12px] text-slate-400 dark:text-zinc-500 font-medium">
              よく使われているツール
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <CategoryToolCard
                key={tool.id}
                tool={tool}
                accentColor={accentColor}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* 全ツール一覧 */}
      {remainingTools.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {categoryName}ツール一覧
            </h2>
            <span className="text-[12px] text-slate-400 dark:text-zinc-500 font-medium">
              全{allTools.length}種類
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {remainingTools.map((tool) => (
              <CategoryToolCard
                key={tool.id}
                tool={tool}
                accentColor={accentColor}
                featured={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
