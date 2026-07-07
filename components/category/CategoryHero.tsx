// ========================================
// カテゴリTOP - Hero セクション
// ========================================
import Link from "next/link";
import type { CategoryConfig } from "@/data/categories";
import { CategoryIcon } from "@/components/tools/CategoryIcon";

type Props = {
  config: CategoryConfig;
};

export function CategoryHero({ config }: Props) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${config.gradientLight} py-14 sm:py-20`}
    >
      {/* 背景グロー装飾 */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-10 rounded-full blur-3xl`} />
        <div className={`absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-10 rounded-full blur-3xl`} />
      </div>

      <div className="container-base relative">
        {/* パンくず */}
        <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-8" aria-label="breadcrumb">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ToolBox</Link>
          <span>/</span>
          <span className={config.accentColor}>{config.name}</span>
        </nav>

        <div className="max-w-2xl">
          {/* カテゴリバッジ */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold mb-5 ${config.accentBg}`}>
            <CategoryIcon slug={config.slug} size="xs" fallbackEmoji={config.icon} />
            <span>{config.nameEn}</span>
          </div>

          {/* タイトル */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-snug mb-4">
            {config.tagline}
          </h1>

          {/* 説明 */}
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed mb-7">
            {config.longDescription}
          </p>

          {/* 特徴バッジ */}
          <div className="flex flex-wrap gap-2">
            {["無料", "登録不要", "スマホ対応", "ブラウザ完結", "プライバシー安全"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border border-white/50 dark:border-zinc-700/50 text-slate-700 dark:text-zinc-300 shadow-sm"
              >
                <span className="text-emerald-500">✓</span> {badge}
              </span>
            ))}
          </div>
        </div>

        {/* 統計グリッド */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {config.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-zinc-700/50 p-4 shadow-sm"
            >
              <p className={`text-lg font-bold ${config.accentColor} mb-0.5`}>{stat.value}</p>
              <p className="text-[12px] text-slate-500 dark:text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
