"use client";
import { WifiOff } from "lucide-react";
import { useOnline } from "./useOnline";

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-200">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 text-sm">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>オフラインです。表示中の内容は閲覧できますが、変更は通信が戻ってから行えます。</span>
      </div>
    </div>
  );
}
