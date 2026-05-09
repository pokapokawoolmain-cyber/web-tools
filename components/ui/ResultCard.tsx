// ========================================
// 計算結果表示カードコンポーネント
// ========================================
import { cn } from "@/lib/utils";

type ResultCardProps = {
  label: string;
  value: string;
  subValue?: string;   // 補足情報（例: "月利: 〇〇円"）
  highlight?: boolean; // 最重要の結果をハイライト
  className?: string;
};

export function ResultCard({
  label,
  value,
  subValue,
  highlight = false,
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 sm:p-5",
        highlight
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800"
          : "bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700",
        className
      )}
    >
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>
      <p
        className={cn(
          "text-xl sm:text-2xl font-bold tabular-nums",
          highlight
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-900 dark:text-white"
        )}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {subValue}
        </p>
      )}
    </div>
  );
}
