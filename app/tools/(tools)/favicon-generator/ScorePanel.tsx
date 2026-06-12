"use client";
import { useMemo } from "react";
import type { FaviconSettings, ImageAnalysis } from "./lib/favicon-lib";
import { calcScore } from "./lib/favicon-lib";

interface Props {
  mainDataUrl: string;
  maskDataUrl: string;
  settings: FaviconSettings;
  analysis: ImageAnalysis | null;
  onFix: (fixId: string) => void;
}

export function ScorePanel({ mainDataUrl, maskDataUrl, settings, analysis, onFix }: Props) {
  const { score, items } = useMemo(
    () => calcScore(mainDataUrl, maskDataUrl, settings, analysis),
    [mainDataUrl, maskDataUrl, settings, analysis]
  );

  const scoreColor =
    score >= 90 ? "text-emerald-600 dark:text-emerald-400"
    : score >= 70 ? "text-blue-600 dark:text-blue-400"
    : score >= 50 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400";

  const scoreLabel =
    score >= 90 ? "優秀"
    : score >= 70 ? "良好"
    : score >= 50 ? "要改善"
    : "問題あり";

  const scoreBg =
    score >= 90 ? "#10b981"
    : score >= 70 ? "#3b82f6"
    : score >= 50 ? "#f59e0b"
    : "#ef4444";

  return (
    <div className="space-y-4">
      {/* Score gauge */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500">技術的完成度スコア</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-slate-400 text-lg">/100</span>
              <span className={`text-sm font-medium ${scoreColor}`}>{scoreLabel}</span>
            </div>
          </div>
          {/* Circular gauge */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-zinc-800" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke={scoreBg}
                strokeWidth="6"
                strokeDasharray={`${(score / 100) * 163.4} 163.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor}`}>
              {score}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: scoreBg }}
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
          ※ 判定根拠を開示した技術的チェックです。デザインの主観的評価は含みません。
        </p>
      </div>

      {/* Score items */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-2">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-3">チェック項目</h3>
        {items.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 py-2.5 border-b border-slate-50 dark:border-zinc-800 last:border-0`}>
            <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              item.passed
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                : "bg-red-100 dark:bg-red-900/30 text-red-600"
            }`}>
              {item.passed ? "✓" : "✕"}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  item.passed
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600"
                }`}>
                  {item.passed ? `+${item.points}` : `−${item.points}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{item.detail}</p>
              {!item.passed && item.fixId && (
                <button
                  onClick={() => onFix(item.fixId!)}
                  className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  🔧 自動修正する
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
