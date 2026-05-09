// ========================================
// フッターコンポーネント
// ========================================
import Link from "next/link";
import { tools, categoryLabels } from "@/lib/tools-data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // カテゴリ別にグルーピング
  const categories = [...new Set(tools.map((t) => t.category))];

  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
      <div className="container-base py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {/* ブランド */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white mb-3">
              <span>🧰</span>
              <span>ToolBox</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
              無料・登録不要・スマホ対応の
              <br />
              Webツール集。
            </p>
          </div>

          {/* カテゴリ別ツールリンク */}
          {categories.slice(0, 3).map((cat) => (
            <div key={cat}>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
                {categoryLabels[cat as keyof typeof categoryLabels]}
              </h3>
              <ul className="space-y-2">
                {tools
                  .filter((t) => t.category === cat)
                  .map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ボトムバー */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-400 dark:text-slate-600">
          <p>© {currentYear} ToolBox. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
