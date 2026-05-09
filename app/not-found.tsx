// 404ページ
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません | ToolBox",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-6xl">🔍</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          ページが見つかりません
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
