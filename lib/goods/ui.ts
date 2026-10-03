// /goods 共通のクラス。タップ領域は最低 44px（Apple HIG / WCAG 2.5.5）を確保する。
export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100 dark:hover:bg-zinc-800",
  danger:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40",
  ghost:
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-zinc-800",
};

export const field = {
  label: "block text-sm font-bold text-slate-800 dark:text-slate-100",
  input:
    "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 aria-[invalid=true]:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100 dark:placeholder:text-zinc-500",
  hint: "mt-1 text-xs text-slate-500 dark:text-slate-400",
  error: "mt-1 text-sm font-medium text-red-600 dark:text-red-400",
};

export const card = "rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";
