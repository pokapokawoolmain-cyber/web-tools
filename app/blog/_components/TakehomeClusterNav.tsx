// ========================================
// 手取り年収クラスタの前後ナビゲーション
// takehome-300〜1000 の記事間を相互リンクし、
// クラスタ内の回遊と内部リンク密度を高める。
// ハブ（/salary）への導線も兼ねる。
// ========================================
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

// 表示順（万円）。新しい年収帯を足す場合はここに追加するだけ。
const SEQUENCE = [300, 400, 500, 600, 700, 800, 900, 1000];

export function TakehomeClusterNav({ current }: { current: number }) {
  const idx = SEQUENCE.indexOf(current);
  const prev = idx > 0 ? SEQUENCE[idx - 1] : null;
  const next = idx >= 0 && idx < SEQUENCE.length - 1 ? SEQUENCE[idx + 1] : null;

  return (
    <nav
      aria-label="年収別の手取り記事ナビゲーション"
      className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-800"
    >
      <div className="grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/blog/takehome-${prev}`}
            className="group flex items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-700 p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-blue-500" aria-hidden />
            <span>
              <span className="block text-[11px] text-slate-400 dark:text-zinc-500">前の年収帯</span>
              <span className="block text-[14px] font-semibold text-slate-800 dark:text-zinc-200">年収{prev}万円の手取り</span>
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}

        {next ? (
          <Link
            href={`/blog/takehome-${next}`}
            className="group flex items-center justify-end gap-2 rounded-xl border border-slate-200 dark:border-zinc-700 p-4 text-right transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <span>
              <span className="block text-[11px] text-slate-400 dark:text-zinc-500">次の年収帯</span>
              <span className="block text-[14px] font-semibold text-slate-800 dark:text-zinc-200">年収{next}万円の手取り</span>
            </span>
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-blue-500" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden />
        )}
      </div>

      <Link
        href="/salary"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3 text-[13px] font-medium text-slate-600 dark:text-zinc-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      >
        <LayoutGrid className="w-4 h-4" aria-hidden />
        年収別の手取り早見表（300〜1000万円の一覧）へ
      </Link>
    </nav>
  );
}
