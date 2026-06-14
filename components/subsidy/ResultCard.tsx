"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, XCircle, FileDown, Clock,
} from "lucide-react";
import {
  STATUS_CONFIG, DIFFICULTY_CONFIG, getDaysUntilDeadline, getDeadlineColor,
  type DiagnosisResult,
} from "@/data/subsidies";
import { FavoriteButton } from "./FavoriteButton";

const LEVEL_CONFIG = {
  高: {
    label: "対象の可能性：高",
    headerBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    cardBg: "bg-white dark:bg-zinc-900",
    border: "border-emerald-200 dark:border-emerald-900",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ring: "ring-1 ring-emerald-200 dark:ring-emerald-900",
  },
  中: {
    label: "対象の可能性：中",
    headerBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
    cardBg: "bg-white dark:bg-zinc-900",
    border: "border-blue-200 dark:border-blue-900",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ring: "ring-1 ring-blue-200 dark:ring-blue-900",
  },
  条件次第: {
    label: "条件次第で対象の可能性",
    headerBg: "bg-gradient-to-r from-slate-400 to-slate-500",
    cardBg: "bg-white dark:bg-zinc-900",
    border: "border-slate-200 dark:border-zinc-700",
    badge: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400",
    ring: "ring-1 ring-slate-200 dark:ring-zinc-700",
  },
};

export function ResultCard({ result, rank }: { result: DiagnosisResult; rank: number }) {
  const [expanded, setExpanded] = useState(rank <= 1);
  const cfg = LEVEL_CONFIG[result.recommendLevel];
  const s = result.subsidy;
  const statusCfg = STATUS_CONFIG[s.status];
  const diffCfg = DIFFICULTY_CONFIG[s.difficulty];
  const days = getDaysUntilDeadline(s.deadlineDate);
  const deadlineColor = getDeadlineColor(days);

  return (
    <article className={`rounded-2xl overflow-hidden shadow-sm ${cfg.ring} ${cfg.border} border`}>

      {/* カラーヘッダーバー */}
      <div className={`${cfg.headerBg} px-5 py-3 flex items-center justify-between`}>
        <span className="text-white text-[13px] font-bold tracking-wide">{cfg.label}</span>
        <div className="flex items-center gap-2">
          <FavoriteButton id={s.id} size="sm" />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label={expanded ? "閉じる" : "詳細を見る"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* メインカード */}
      <div className={`${cfg.cardBg} px-5 pt-4 pb-3`}>
        {/* タイトル行 */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0">{s.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`} />
                {statusCfg.label}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400">
                {s.category}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                📋 {s.sourceLabel}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[16px] leading-snug">{s.name}</h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
          </div>
        </div>

        {/* 数値サマリー */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wide mb-0.5">補助上限</p>
            <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{s.maxSubsidy.replace("最大", "")}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wide mb-0.5">補助率</p>
            <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{s.subsidyRate}</p>
          </div>
          <div className={`rounded-xl p-3 ${days !== null ? deadlineColor.replace("text-", "bg-").split(" ")[1] + " " : "bg-slate-50 dark:bg-zinc-800"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5 text-slate-400 dark:text-zinc-500">締切</p>
            {days !== null ? (
              <p className={`text-[12px] font-bold leading-tight ${deadlineColor.split(" ")[0]}`}>
                {days <= 0 ? "締切超過" : `残${days}日`}
              </p>
            ) : (
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">随時</p>
            )}
          </div>
        </div>

        {/* サブ情報行 */}
        <div className="flex flex-wrap gap-3 text-[12px] text-slate-500 dark:text-slate-400 pb-1">
          <span className={`font-medium ${diffCfg.color}`}>{diffCfg.label}</span>
          <span className="text-slate-400 dark:text-zinc-500">採択率目安: {s.adoptionRateNote}</span>
          <span className="text-slate-400 dark:text-zinc-500">準備期間: {s.preparationWeeks}</span>
        </div>
      </div>

      {/* 展開コンテンツ */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40 px-5 py-5 space-y-5">

          {/* 対象になる可能性が高い理由 */}
          {result.matchedReasons.length > 0 && (
            <div>
              <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                対象になる可能性が高い理由
              </h4>
              <ul className="space-y-2">
                {result.matchedReasons.map((r, i) => (
                  <li key={i} className="text-[13px] text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-white dark:bg-zinc-900 rounded-lg px-3 py-2 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 確認が必要な点 */}
          {result.unmatchReasons.length > 0 && (
            <div>
              <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                確認が必要な点
              </h4>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3">
                <p className="text-[13px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  {result.unmatchReasons.join("。また、")}。申請前に必ず公式公募要領をご確認ください。
                </p>
              </div>
            </div>
          )}

          {/* 想定用途 */}
          <div>
            <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">活用できる用途</h4>
            <div className="flex flex-wrap gap-1.5">
              {s.usagePurposes.map((p, i) => (
                <span key={i} className="text-[12px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* 締切・注意 */}
          {s.deadlineNote && (
            <div className="flex items-start gap-2 text-[13px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{s.deadlineNote}</p>
            </div>
          )}

          {/* 次にやること */}
          <div>
            <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2.5">次にやること</h4>
            <ol className="space-y-2">
              {s.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-zinc-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* 注意事項 */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">注意事項</p>
            <ul className="space-y-1">
              {s.notes.map((note, i) => (
                <li key={i} className="text-[12px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="flex-shrink-0">※</span>{note}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Link
              href={s.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm min-h-[48px]"
            >
              <ExternalLink className="w-4 h-4" />
              公式サイトを確認する
            </Link>
            <button
              title="PDF出力（準備中）"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[13px] font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all min-h-[48px]"
              onClick={() => {}}
            >
              <FileDown className="w-4 h-4" />
              PDF出力（準備中）
            </button>
          </div>

          {/* 情報フッター */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href={s.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              参照元: {s.sourceLabel}
            </Link>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">最終確認: {s.updatedAt}</p>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            当サイトの診断は参考情報です。申請可否は必ず公式公募要領または専門家へご確認ください。
          </div>
        </div>
      )}
    </article>
  );
}
