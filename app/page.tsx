// ========================================
// トップページ
// ツール一覧を表示するランディングページ
// ========================================
import type { Metadata } from "next";
import Link from "next/link";
import { tools, categoryLabels, getToolsByCategory } from "@/lib/tools-data";
import { ToolCard } from "@/components/tools/ToolCard";

export const metadata: Metadata = {
  title: "ToolBox | 無料Webツール集 - FIRE・NISA・画像変換など",
  description:
    "FIREシミュレーター・NISA積立計算・メルカリ利益計算・画像圧縮など、毎日使える無料ツールを集めたサイト。登録不要・スマホ対応・ブラウザ完結。",
  keywords:
    "無料ツール, FIRE計算, NISA積立, メルカリ利益計算, 画像圧縮, ガソリン代計算, 副業計算",
  openGraph: {
    title: "ToolBox | 無料Webツール集",
    description: "毎日使える無料ツールを集めたサイト。登録不要・スマホ対応。",
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  const toolsByCategory = getToolsByCategory();
  const popularTools = tools.filter((t) => t.isPopular);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 py-16 sm:py-24">
        {/* 背景グラデーション装飾 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container-base relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* h1タグ：SEO最重要 */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                無料Webツール
              </span>
              で、<br className="sm:hidden" />
              もっとスマートに。
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              FIRE計算・NISA積立・メルカリ利益計算・画像変換など
              <br className="hidden sm:block" />
              登録不要・スマホ対応・ブラウザ完結の無料ツール集。
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/fire-simulator"
                className="btn-primary text-sm sm:text-base"
              >
                🔥 FIREシミュレーター
              </Link>
              <Link
                href="/nisa-calculator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                📈 NISA計算
              </Link>
            </div>

            {/* 統計バッジ */}
            <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">
              全{tools.length}ツール　·　無料　·　登録不要　·　スマホ対応
            </p>
          </div>
        </div>
      </section>

      {/* 人気ツール */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
        <div className="container-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            人気のツール
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            よく使われているツールです
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* カテゴリ別ツール一覧 */}
      {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
        <section
          key={category}
          className="py-12 border-t border-slate-100 dark:border-zinc-800"
        >
          <div className="container-base">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {categoryLabels[category as keyof typeof categoryLabels] ?? category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* SEO向け補足テキスト */}
      <section className="py-12 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            ToolBoxについて
          </h2>
          <div className="prose prose-slate dark:prose-invert text-sm leading-relaxed text-slate-600 dark:text-slate-400 space-y-3">
            <p>
              ToolBoxは、日常で「ちょっと計算したい」「ファイルを変換したい」という場面で役立つ、無料のWebツールを集めたサービスです。
            </p>
            <p>
              FIREシミュレーターやNISA積立計算など投資・お金のツール、メルカリの利益計算・副業収入の税金計算など副業サポートツール、HEIC→JPG変換や画像圧縮などファイル変換ツールを提供しています。
            </p>
            <p>
              すべてのツールはブラウザ完結で動作するため、ファイルがサーバーにアップロードされることはなく、プライバシーも安心です。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
