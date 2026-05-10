"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, ChevronRight, Flame, Sparkles, Home } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/data/tools";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const popularTools = TOOLS.filter(t => t.isPopular);
  const newTools = TOOLS.filter(t => t.isNew);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 font-bold text-[17px] text-slate-900 dark:text-white hover:opacity-70 transition-opacity">
              <span className="text-2xl">🧰</span>
              <span>ToolBox</span>
            </Link>

            <div className="flex items-center gap-1">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="テーマ切替"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                <Sun className="h-[18px] w-[18px] hidden dark:block" />
                <Moon className="h-[18px] w-[18px] dark:hidden" />
              </button>
              <button onClick={() => setIsOpen(true)}
                aria-label="メニューを開く"
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Drawer */}
          <div className="relative w-full max-w-sm h-full bg-slate-100 dark:bg-zinc-900 shadow-2xl overflow-y-auto"
            style={{ animation: "slideInRight 0.28s cubic-bezier(0.32,0.72,0,1)" }}>

            {/* Drawer header */}
            <div className="sticky top-0 z-10 bg-slate-100/90 dark:bg-zinc-900/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/60">
              <span className="font-semibold text-[17px] text-slate-900 dark:text-white">ToolBox</span>
              <button onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center hover:opacity-70 transition-opacity">
                <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-6 pb-12">
              {/* Quick links */}
              <section>
                <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-700">
                  <Link href="/" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-[13px] hover:opacity-70 transition-opacity">
                    <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"><Home className="w-4 h-4" /></span>
                    <span className="text-[15px] font-medium text-slate-900 dark:text-white flex-1">ホーム</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600" />
                  </Link>
                  <div className="px-4 py-[13px]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center"><Flame className="w-4 h-4 text-white" /></span>
                      <span className="text-[15px] font-medium text-slate-900 dark:text-white">人気ツール</span>
                    </div>
                    <div className="space-y-1 pl-11">
                      {popularTools.map(t => (
                        <Link key={t.id} href={t.href} onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-1.5 text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <span>{t.emoji}</span><span>{t.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-[13px]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></span>
                      <span className="text-[15px] font-medium text-slate-900 dark:text-white">新着ツール</span>
                    </div>
                    <div className="space-y-1 pl-11">
                      {newTools.map(t => (
                        <Link key={t.id} href={t.href} onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-1.5 text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <span>{t.emoji}</span><span>{t.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Categories */}
              {CATEGORIES.map(cat => {
                const catTools = TOOLS.filter(t => t.category === cat);
                if (!catTools.length) return null;
                return (
                  <section key={cat}>
                    <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">{cat}</p>
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-700">
                      {catTools.map(t => (
                        <Link key={t.id} href={t.href} onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-[13px] hover:opacity-70 transition-opacity">
                          <span className="text-xl w-7 text-center">{t.emoji}</span>
                          <span className="text-[15px] text-slate-900 dark:text-white flex-1">{t.title}</span>
                          {t.isNew && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-full">NEW</span>}
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
