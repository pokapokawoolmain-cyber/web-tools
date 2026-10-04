"use client";
// グッズ詳細（下からのシート）。詳細用画像は開いたときだけ署名・読込する（一覧で原寸を読まない）。
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { signImage } from "@/lib/goods/image/storage";
import { formatPrice } from "@/lib/goods/format";
import type { GoodsItem } from "@/lib/goods/types";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ImageFallback } from "./ImageFallback";

interface Props {
  item: GoodsItem | null;
  owned: boolean;
  isOwner: boolean;
  disabled: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function GoodsDetailSheet({ item, owned, isOwner, disabled, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  useEffect(() => {
    setFullUrl(null);
    setImgFailed(false);
    if (!item?.imagePath) return;
    let cancelled = false;
    setLoadingImg(true);
    signImage(goodsBrowserClient(), item.imagePath)
      .then((u) => !cancelled && setFullUrl(u))
      .finally(() => !cancelled && setLoadingImg(false));
    return () => {
      cancelled = true;
    };
  }, [item?.imagePath]);

  const src = fullUrl ?? item?.thumbUrl ?? null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // 背景タップで閉じる
      }}
      aria-labelledby="goods-detail-title"
      className="goods-sheet mb-0 mt-auto w-full max-w-lg rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl sm:m-auto sm:rounded-3xl dark:bg-zinc-900 dark:text-slate-100"
    >
      {item && (
        <div className="goods-slide-up max-h-[88vh] overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className={cn("relative w-full bg-slate-100 dark:bg-zinc-800", item.imagePath ? "aspect-square max-h-[60vh]" : "h-36")}>
            {src && !imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element -- 署名付きURL
              <img src={src} alt={item.name} onError={() => setImgFailed(true)} className="h-full w-full object-contain" />
            ) : (
              <ImageFallback missing={!!item.imagePath} />
            )}
            {loadingImg && !fullUrl && (
              <Loader2 className="absolute bottom-3 right-3 h-5 w-5 animate-spin text-slate-500" aria-label="高画質画像を読み込み中" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-zinc-900/90 dark:text-slate-200"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="p-5">
            {item.category && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.category}</p>}
            <h2 id="goods-detail-title" className="mt-0.5 text-lg font-bold leading-snug">
              {item.name}
            </h2>
            <p className="mt-1 text-xl font-bold tabular-nums">{formatPrice(item.price)}</p>
            {item.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>
            )}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onToggle}
                disabled={disabled}
                aria-pressed={owned}
                className={cn(
                  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-bold transition active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2",
                  owned
                    ? "border-2 border-pink-600 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                )}
              >
                {owned ? (
                  <>
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    取得済み（タップで未取得に戻す）
                  </>
                ) : (
                  "取得済みにする"
                )}
              </button>
              {isOwner && (
                <Link href={`/mochico/events/${item.eventId}/items/${item.id}/edit`} className={btn.secondary}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  このグッズを編集
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
