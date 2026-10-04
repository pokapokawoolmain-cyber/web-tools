import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, backHref, backLabel, sub }: { title: string; backHref: string; backLabel: string; sub?: string }) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="-ml-2 inline-flex min-h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>
      <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      {sub && <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}
