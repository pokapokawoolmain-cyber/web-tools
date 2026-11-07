import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

// 既存の画像ツールから画像ワークスペース（試験公開）への案内。ツール本体の下に小さく出す
export function WorkspaceHint({ text }: { text: string }) {
  return (
    <Link
      href="/workspace/image"
      className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 min-h-[44px] text-[13px] text-slate-600 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
    >
      <Layers className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
      <span className="flex-1">
        {text}
        <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">画像ワークスペース（試験公開）</span>
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden />
    </Link>
  );
}
