"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMascot } from "@/components/mochico/MascotColorContext";

const items = [
  { href: "/mochico/events", label: "マイイベント", icon: LayoutGrid, match: (p: string) => p.startsWith("/mochico/events") },
  { href: "/mochico/settings", label: "設定", icon: Settings, match: (p: string) => p.startsWith("/mochico/settings") },
];

export function GoodsSubNav() {
  const pathname = usePathname() ?? "";
  const hideNav = pathname.startsWith("/mochico/login") || pathname.startsWith("/mochico/s/") || pathname === "/mochico/app";
  return (
    <div className="sticky top-[var(--goods-top)] z-30 border-b pt-[var(--goods-safe-top)] border-slate-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <Link
          href="/mochico/app"
          className="flex items-center gap-2 rounded-lg text-sm font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50" aria-hidden="true">
            <AppMascot size={24} />
          </span>
          <span className="font-extrabold tracking-tight">Mochico</span>
        </Link>
        {!hideNav && (
          <nav aria-label="Mochicoメニュー" className="flex items-center gap-1">
            {items.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={label}
                  className={cn(
                    "flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active
                      ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline" aria-hidden="true">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
