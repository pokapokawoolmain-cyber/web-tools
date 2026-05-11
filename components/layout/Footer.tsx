import Link from "next/link";
import { TOOLS, CATEGORIES } from "@/data/tools";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const toolsByCategory = CATEGORIES.reduce((acc, cat) => {
    const items = TOOLS.filter(t => t.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Brand */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-[17px] text-slate-900 dark:text-white hover:opacity-70 transition-opacity mb-3">
            <span>🧰</span><span>ToolBox</span>
          </Link>
          <p className="text-[14px] text-slate-500 dark:text-zinc-500 leading-relaxed max-w-sm">
            「すぐ使える」「シンプルで迷わない」「ブラウザだけで完結する」無料ツール集。
          </p>
        </div>

        {/* Category grids */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(toolsByCategory).map(([cat, tools]) => (
            <div key={cat}>
              <h3 className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">{cat}</h3>
              <ul className="space-y-2.5">
                {tools.map(t => (
                  <li key={t.id}>
                    <Link href={t.href}
                      className="text-[13px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-[11px]">{t.emoji}</span>
                      <span>{t.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* PDF & Blog quick links */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/pdf-tools" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[13px] text-rose-600 dark:text-rose-400 hover:opacity-80 transition-opacity border border-rose-100 dark:border-rose-900/40">
            📄 PDFツール一覧
          </Link>
          <Link href="/blog" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[13px] text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity border border-emerald-100 dark:border-emerald-900/40">
            📝 ブログ
          </Link>
          <Link href="/tools" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[13px] text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity border border-blue-100 dark:border-blue-900/40">
            🧰 全ツール一覧
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-3 text-[12px] text-slate-400 dark:text-zinc-600">
          <p>© {currentYear} ToolBox. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-zinc-400 transition-colors">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-zinc-400 transition-colors">利用規約</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
