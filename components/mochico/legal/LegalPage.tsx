// ============================================================
// Mochico の規約・ポリシー用の簡素なレイアウト（サーバーコンポーネント）
// ============================================================
import type { ReactNode } from "react";

export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>
);

export const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc pl-5 space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);

export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-2">Mochico（モチコ）</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">最終更新日：{updated}</p>
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}

export const linkClass = "text-violet-700 dark:text-violet-300 underline underline-offset-2";
