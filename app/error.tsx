"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * セグメント単位のエラーバウンダリ。
 * ページのレンダリング中に例外が発生した場合、素の「Application error」ではなく
 * ブランドに合わせた復旧画面を表示する。
 *
 * デプロイ直後に古いタブから遷移すると、旧JSチャンクが取得できず
 * ChunkLoadError で画面が壊れることがある。その場合は自動で再読み込みして復旧する。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i.test(
      error.message || ""
    );

  useEffect(() => {
    if (isChunkError) {
      // 新しいデプロイでチャンクが差し替わった場合。1度だけ強制リロードして復旧する。
      const KEY = "tb-chunk-reloaded";
      if (!sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, "1");
        window.location.reload();
      }
    } else {
      // 復旧に成功したらフラグをクリア
      sessionStorage.removeItem("tb-chunk-reloaded");
    }
  }, [isChunkError]);

  if (isChunkError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">最新版を読み込んでいます…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="text-5xl mb-4" aria-hidden>
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          問題が発生しました
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          ページの表示中にエラーが発生しました。もう一度お試しいただくか、時間をおいてアクセスしてください。
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            再読み込み
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
