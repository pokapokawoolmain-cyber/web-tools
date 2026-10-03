// 画像なし / 読み込み失敗（Image missing）の表示
import { ImageOff, Package } from "lucide-react";

export function ImageFallback({ missing = false, label }: { missing?: boolean; label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
      {missing ? <ImageOff className="h-7 w-7" aria-hidden="true" /> : <Package className="h-7 w-7" aria-hidden="true" />}
      <span className="text-[11px] font-medium">{label ?? (missing ? "画像を表示できません" : "画像なし")}</span>
    </div>
  );
}
