import { progressPercent } from "@/lib/goods/format";

export function ProgressBar({ owned, total, size = "md" }: { owned: number; total: number; size?: "sm" | "md" }) {
  const pct = progressPercent(owned, total);
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={owned}
      aria-label={`取得状況 ${owned} / ${total}（${pct}%）`}
      className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800 ${h}`}
    >
      <div
        className={`${h} rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-[width] duration-500 ease-out motion-reduce:transition-none`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
