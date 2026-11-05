// 販売の条件のページ（購入内容の確認・特定商取引法に基づく表記・規約）の共通の枠
export function LegalShell({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-sm text-slate-500 mb-2">
          <a href="/sns-starter-kit" className="underline underline-offset-2">SNS Starter Kit</a>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{title}</h1>
        {updated && <p className="text-sm text-slate-500 mb-10">最終更新日：{updated}</p>}
        <div className="space-y-8 text-[15px] text-slate-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** 2列の表（特定商取引法に基づく表記・購入内容の確認で使う） */
export function TermTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-200 border-y border-slate-200">
      {rows.map(([k, v]) => (
        <div key={k} className="grid sm:grid-cols-[12rem_1fr] gap-1 sm:gap-6 py-4">
          <dt className="font-bold text-slate-900">{k}</dt>
          <dd className="text-slate-700">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
