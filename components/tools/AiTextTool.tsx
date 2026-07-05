"use client";

// ========================================
// AI文章ツール共通コンポーネント
// フォーム → 生成 → 結果表示 → コピー / 再生成 / リセット を統一。
// generate は現状ローカルのテンプレート関数だが、async 対応のため
// Promise も受け付ける（将来 OpenAI API 等へ差し替え可能）。
// ========================================

import { useState, useCallback } from "react";
import { Sparkles, RotateCcw, Copy, Check, Eraser } from "lucide-react";
import {
  generateEmail,
  generateKeigo,
  generateApology,
  generateDecline,
  generateInquiry,
  generatePrompt,
} from "@/lib/ai-writing/generators";

// generatorKey → 生成関数のディスパッチ表。
// Server Component からは関数を渡せないため、キー文字列で指定する。
const GENERATORS: Record<string, (v: AiTextValues) => string | Promise<string>> = {
  email: generateEmail,
  keigo: generateKeigo,
  apology: generateApology,
  decline: generateDecline,
  inquiry: generateInquiry,
  prompt: generatePrompt,
};

export type GeneratorKey = keyof typeof GENERATORS;

export type AiField =
  | {
      type: "select";
      name: string;
      label: string;
      options: { value: string; label: string }[];
      defaultValue?: string;
      hint?: string;
    }
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
      defaultValue?: string;
      hint?: string;
    }
  | {
      type: "textarea";
      name: string;
      label: string;
      placeholder?: string;
      defaultValue?: string;
      rows?: number;
      hint?: string;
    };

export type AiTextValues = Record<string, string>;

type Props = {
  fields: AiField[];
  /** 生成関数のキー。将来 API 化する場合はここで分岐する。 */
  generatorKey: string;
  /** 生成ボタンの文言 */
  generateLabel?: string;
  /** 結果の見出し */
  resultLabel?: string;
  /** 入力前のガイド文 */
  placeholder?: string;
};

function initialValues(fields: AiField[]): AiTextValues {
  const v: AiTextValues = {};
  for (const f of fields) {
    if (f.type === "select") v[f.name] = f.defaultValue ?? f.options[0]?.value ?? "";
    else v[f.name] = f.defaultValue ?? "";
  }
  return v;
}

export function AiTextTool({
  fields,
  generatorKey,
  generateLabel = "文章を作成する",
  resultLabel = "作成結果",
  placeholder = "上のフォームを入力して作成してください。",
}: Props) {
  const [values, setValues] = useState<AiTextValues>(() => initialValues(fields));
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const setField = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const run = useCallback(async () => {
    const generate = GENERATORS[generatorKey] ?? (() => "");
    setLoading(true);
    try {
      const out = await generate(values);
      setResult(out);
    } finally {
      setLoading(false);
    }
  }, [generatorKey, values]);

  const reset = () => {
    setValues(initialValues(fields));
    setResult("");
    setCopied(false);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 入力フォーム */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 sm:p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.name} className="space-y-1.5">
            <label htmlFor={f.name} className="block text-[13px] font-semibold text-slate-700 dark:text-zinc-300">
              {f.label}
            </label>

            {f.type === "select" && (
              <select
                id={f.name}
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[15px] focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}

            {f.type === "text" && (
              <input
                id={f.name}
                type="text"
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="w-full h-12 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            )}

            {f.type === "textarea" && (
              <textarea
                id={f.name}
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={f.rows ?? 4}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-[15px] leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-y"
              />
            )}

            {f.hint && <p className="text-[11px] text-slate-400 dark:text-zinc-500">{f.hint}</p>}
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-60 transition-all min-h-[48px] shadow-[0_6px_20px_rgba(139,92,246,0.35)]"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "作成中…" : result ? "作り直す" : generateLabel}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 transition-all text-[14px] min-h-[48px]"
          >
            <Eraser className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>

      {/* 結果 */}
      {result ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-violet-200 dark:border-violet-900/50 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-zinc-800 bg-violet-50/60 dark:bg-violet-950/20">
            <span className="text-[13px] font-bold text-violet-700 dark:text-violet-300">{resultLabel}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={run}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                再生成
              </button>
              <button
                onClick={copy}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                  copied
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-slate-300"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "コピーしました" : "コピー"}
              </button>
            </div>
          </div>
          <pre className="px-4 sm:px-5 py-4 text-[14px] leading-loose text-slate-800 dark:text-zinc-100 whitespace-pre-wrap font-sans">
            {result}
          </pre>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 py-10 text-center text-[13px] text-slate-400 dark:text-zinc-600">
          {placeholder}
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-zinc-600 text-center leading-relaxed">
        ※ 生成される文章は下書きの目安です。送信前に固有名詞・日時・敬称をご確認ください。処理はすべてブラウザ内で完結し、入力内容は外部に送信されません。
      </p>
    </div>
  );
}
