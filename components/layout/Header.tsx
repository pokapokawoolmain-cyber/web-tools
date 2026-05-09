"use client";
// ========================================
// ヘッダーコンポーネント
// ロゴ・ナビゲーション・ダークモード切替
// ========================================
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { href: "/fire-simulator", label: "🔥 FIRE計算" },
  { href: "/nisa-calculator", label: "📈 NISA計算" },
  { href: "/mercari-profit", label: "🛍️ メルカリ" },
  { href: "/image-compress", label: "🗜️ 画像圧縮" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container-base">
        <div className="flex h-14 items-center justify-between">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🧰</span>
            <span>ToolBox</span>
          </Link>

          {/* デスクトップナビ */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 右側アクション */}
          <div className="flex items-center gap-2">
            {/* ダークモード切替ボタン */}
            <button
              onClick={toggleTheme}
              aria-label="ダークモード切替"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </button>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="メニューを開く"
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 animate-fade-in">
          <nav className="container-base py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
