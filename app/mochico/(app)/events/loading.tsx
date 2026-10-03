export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6" aria-busy="true" aria-label="読み込み中">
      <div className="mb-5 h-7 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-20 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="flex flex-1 flex-col gap-2 py-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="mt-auto h-1.5 w-full animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
