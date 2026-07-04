"use client";
// ========================================
// 最近使ったツール（LocalStorage）
// ========================================
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, X } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { ToolIcon } from "@/components/tools/ToolIcon";

const STORAGE_KEY = "recent-tools";
const MAX_RECENT = 8;

/** ツールページの useEffect から呼んで訪問を記録 */
export function recordToolVisit(toolId: string) {
  if (typeof window === "undefined") return;
  const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  const updated = [toolId, ...existing.filter((id) => id !== toolId)].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function RecentTools() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setRecentIds(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentIds([]);
  };

  const recentTools = recentIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  if (recentTools.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">最近使ったツール</span>
        </div>
        <button
          onClick={clear}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
        >
          <X className="w-3 h-3" />
          クリア
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentTools.slice(0, 6).map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-full text-xs text-slate-600 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ToolIcon toolId={tool.id} size="sm" fallbackEmoji={tool.emoji} />
            <span>{tool.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
