"use client";
import { useEffect } from "react";
import { AppMascot } from "@/components/mochico/MascotColorContext";
import { btn } from "@/lib/goods/ui";

export default function GoodsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[goods] page error", error.digest ?? "");
  }, [error]);
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
      <div className="mb-4 flex items-center justify-center" aria-hidden="true">
        <AppMascot size={64} state={offline ? "sleep" : "peek"} />
      </div>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{offline ? "オフラインです" : "読み込みに失敗しました"}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {offline ? "通信が戻ったら、もう一度お試しください。" : "時間をおいて、もう一度お試しください。"}
      </p>
      <button type="button" onClick={reset} className={`${btn.primary} mt-7`}>
        再読み込み
      </button>
    </div>
  );
}
