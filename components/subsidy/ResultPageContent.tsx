"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, AlertTriangle, SlidersHorizontal, Bookmark } from "lucide-react";
import { diagnose, deserializeInput, RELATED_TOOLS, type DiagnosisResult } from "@/data/subsidies";
import { ResultCard } from "./ResultCard";
import { useFavorites } from "./FavoriteButton";

type SortKey = "score" | "deadline" | "maxSubsidy";

function sortResults(results: DiagnosisResult[], key: SortKey): DiagnosisResult[] {
  return [...results].sort((a, b) => {
    if (key === "deadline") {
      const da = a.subsidy.deadlineDate ?? "9999-12-31";
      const db = b.subsidy.deadlineDate ?? "9999-12-31";
      return da < db ? -1 : da > db ? 1 : 0;
    }
    return b.score - a.score;
  });
}

export function ResultPageContent({ encoded }: { encoded: string }) {
  const input = useMemo(() => deserializeInput(encoded), [encoded]);
  const rawResults = useMemo(() => (input ? diagnose(input) : []), [input]);
  const [sort, setSort] = useState<SortKey>("score");
  const { favorites } = useFavorites();

  const results = useMemo(() => sortResults(rawResults, sort), [rawResults, sort]);
  const high = results.filter((r) => r.recommendLevel === "高");
  const mid = results.filter((r) => r.recommendLevel === "中");
  const cond = results.filter((r) => r.recommendLevel === "条件次第");
  const favCount = results.filter((r) => favorites.includes(r.subsidy.id)).length;

  if (!input) {
    return (
      <div className="container-base max-w-3xl py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-slate-500 dark:text-slate-400 mb-6">診断データが見つかりませんでした。</p>
        <Link href="/subsidy" className="btn-primary text-sm">診断をやり直す</Link>
      </div>
    );
  }

  return (
    <div className="container-base max-w-3xl py-6 sm:py-8">

      {/* パンくずリスト */}
      <nav aria-label="パンくずリスト" className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500 mb-5">
        <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ToolBoxJP</Link>
        <span>/</span>
        <Link href="/subsidy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">補助金診断</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-400">診断結果</span>
      </nav>

      {/* 戻るリンク */}
      <Link href="/subsidy" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-5">
        <ArrowLeft className="w-3.5 h-3.5" />戻る
      </Link>

      {/* 診断サマリーカード */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-blue-300 text-[11px] font-semibold uppercase tracking-wider mb-1">診断結果</p>
            <p className="text-[15px] font-bold">
              {results.length}件の制度が対象の可能性があります
            </p>
          </div>
          {favCount > 0 && (
            <span className="flex items-center gap-1 text-amber-300 text-[12px] font-medium bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <Bookmark className="w-3.5 h-3.5 fill-amber-400" />{favCount}件保存済み
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "事業形態", value: input.businessType },
            { label: "地域", value: input.prefecture },
            { label: "業種", value: input.industry },
            { label: "従業員", value: input.employeeCount },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-lg px-3 py-1.5 text-[12px]">
              <span className="text-blue-300 mr-1">{item.label}</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
        {input.purposes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {input.purposes.map((p) => (
              <span key={p} className="text-[11px] bg-blue-500/20 text-blue-200 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 免責バナー */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3 mb-5 text-[12px] text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>
          以下は参考情報です。
          <strong>申請可否・詳細条件は必ず公式公募要領または専門家へご確認ください。</strong>
          当サイトは申請可否を保証するものではありません。
        </p>
      </div>

      {/* ソートバー */}
      {results.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
          <span className="text-[12px] text-slate-400 dark:text-zinc-500 mr-1">並び替え:</span>
          {([ ["score", "おすすめ順"], ["deadline", "締切が近い順"] ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`text-[12px] px-3 py-1.5 rounded-full font-medium transition-all ${
                sort === key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 結果リスト */}
      {results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">😔</p>
          <p className="text-slate-500 dark:text-slate-400 mb-5">条件に合う補助金・助成金が見つかりませんでした。</p>
          <Link href="/subsidy" className="btn-primary text-sm">条件を変えて再診断</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {high.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                <p className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                  対象の可能性が高い（{high.length}件）
                </p>
              </div>
              <div className="space-y-3">
                {high.map((r, i) => <ResultCard key={r.subsidy.id} result={r} rank={i} />)}
              </div>
            </section>
          )}
          {mid.length > 0 && (
            <section className={high.length > 0 ? "mt-6" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
                <p className="text-[12px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                  対象の可能性あり（{mid.length}件）
                </p>
              </div>
              <div className="space-y-3">
                {mid.map((r, i) => <ResultCard key={r.subsidy.id} result={r} rank={i + high.length} />)}
              </div>
            </section>
          )}
          {cond.length > 0 && (
            <section className={high.length + mid.length > 0 ? "mt-6" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-zinc-500 rounded-full" />
                <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  条件次第で対象の可能性（{cond.length}件）
                </p>
              </div>
              <div className="space-y-3">
                {cond.map((r, i) => <ResultCard key={r.subsidy.id} result={r} rank={i + high.length + mid.length} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 申請準備に使える関連ツール */}
      <section className="mt-10 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 mb-3">🛠️ 申請準備に使えるツール</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {RELATED_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="flex items-start gap-2.5 bg-slate-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl p-3 transition-all group"
            >
              <span className="text-xl flex-shrink-0">{tool.emoji}</span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-tight">{tool.title}</p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 再診断 */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/subsidy"
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-[13px] font-medium min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />条件を変えて再診断する
        </Link>
      </div>
    </div>
  );
}
