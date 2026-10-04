export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4" aria-busy="true" aria-label="共有されたリストを読み込み中">
      <div className="aspect-[5/2] w-full animate-pulse rounded-2xl bg-slate-200 sm:aspect-[4/1] dark:bg-zinc-800" />
      <div className="mt-3 h-7 w-2/3 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="aspect-square animate-pulse bg-slate-200 dark:bg-zinc-800" />
            <div className="space-y-1.5 p-2.5">
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-3.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
