"use client";
// グッズ詳細（下からのシート）
//   * 画像ギャラリー（商品紹介用）: 横スワイプ。原寸は開いたときだけ署名・読込（一覧で原寸を読まない）
//   * 所持数: 通常商品は −／数値／＋。ランダム商品は「絵柄ごとの所持数」一覧（所持管理の対象）
//   ギャラリーと絵柄は見た目でも分ける（紹介用の写真 ≠ 持っている絵柄）
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, X } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { signImages } from "@/lib/goods/image/storage";
import { formatPrice } from "@/lib/goods/format";
import { itemTotal, ownedVariantCount } from "@/lib/goods/quantity";
import { qtyKey, type GoodsItem, type Quantities } from "@/lib/goods/types";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ImageFallback } from "./ImageFallback";
import { QuantityStepper } from "./QuantityStepper";

interface Props {
  item: GoodsItem | null;
  quantities: Quantities;
  isOwner: boolean;
  disabled: boolean;
  /** variantId が null なら通常商品 */
  onQuantity: (item: GoodsItem, variantId: string | null, next: number) => void;
  onClose: () => void;
}

export function GoodsDetailSheet({ item, quantities, isOwner, disabled, onQuantity, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [urls, setUrls] = useState<Map<string, string>>(new Map());
  const [loadingImg, setLoadingImg] = useState(false);
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  // 開いたときに、ギャラリーの原寸と絵柄のサムネをまとめて署名する（往復1回）
  const imageKey = item ? item.images.map((i) => i.imagePath).join("|") + "#" + item.variants.map((v) => v.thumbPath ?? "").join("|") : "";
  useEffect(() => {
    setUrls(new Map());
    setSlide(0);
    trackRef.current?.scrollTo({ left: 0 });
    if (!item) return;
    const paths = [...item.images.map((i) => i.imagePath), ...item.variants.map((v) => v.thumbPath)];
    if (paths.every((p) => !p)) return;
    let cancelled = false;
    setLoadingImg(true);
    signImages(goodsBrowserClient(), paths)
      .then((m) => !cancelled && setUrls(m))
      .finally(() => !cancelled && setLoadingImg(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 画像の組み合わせが変わったときだけ署名し直す
  }, [item?.id, imageKey]);

  const images = item?.images ?? [];
  const total = item ? itemTotal(item, quantities) : 0;

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
        // 高さは dvh（画面に見えている高さ）で決める。vh だと iPhone Safari でツールバー表示中に
        // シートの下がツールバーの裏に隠れ、最後までスクロールできない
        <div className="goods-slide-up max-h-[88dvh] overflow-y-auto overscroll-contain" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {/* ギャラリー（商品紹介用） */}
          <div className={cn("relative w-full bg-slate-100 dark:bg-zinc-800", images.length ? "aspect-square max-h-[52dvh]" : "h-32")}>
            {images.length ? (
              <div
                ref={trackRef}
                className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setSlide(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
                }}
                aria-label={images.length > 1 ? `商品画像（${images.length}枚。横にスワイプで切り替え）` : "商品画像"}
                role="region"
                tabIndex={images.length > 1 ? 0 : -1}
              >
                {images.map((img, i) => {
                  const src = urls.get(img.imagePath) ?? img.thumbUrl ?? (i === 0 ? item.thumbUrl : null);
                  return (
                    <div key={img.id} className="h-full w-full shrink-0 snap-center">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element -- 署名付きURL
                        <img src={src} alt={i === 0 ? item.name : `${item.name}（${i + 1}枚目）`} className="h-full w-full object-contain" loading={i === 0 ? "eager" : "lazy"} />
                      ) : (
                        <ImageFallback missing />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <ImageFallback missing={false} />
            )}
            {images.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
                {images.map((img, i) => (
                  <span key={img.id} className={cn("h-1.5 rounded-full transition-all", i === slide ? "w-4 bg-slate-800 dark:bg-white" : "w-1.5 bg-slate-400/80")} />
                ))}
              </div>
            )}
            {loadingImg && <Loader2 className="absolute bottom-3 right-3 h-5 w-5 animate-spin text-slate-500" aria-label="画像を読み込み中" />}
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
            <div className="flex flex-wrap items-center gap-1.5">
              {item.category && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-slate-300">{item.category}</span>}
              {item.kind === "random" && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">ランダム・全{item.variants.length}種</span>
              )}
            </div>
            <h2 id="goods-detail-title" className="mt-1 text-lg font-bold leading-snug">
              {item.name}
            </h2>
            <p className="mt-1 text-xl font-bold tabular-nums">{formatPrice(item.price)}</p>
            {item.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>}

            {item.kind === "normal" ? (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-zinc-700">
                <div>
                  <p className="text-sm font-bold">所持数</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
                    {total > 0 ? `取得済み（${total}個）` : "未取得（0個）"}
                  </p>
                </div>
                <QuantityStepper value={total} disabled={disabled} label={`${item.name}の所持数`} onChange={(n) => onQuantity(item, null, n)} />
              </div>
            ) : (
              <section className="mt-6" aria-labelledby="variants-title">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 id="variants-title" className="text-sm font-bold">
                    絵柄ごとの所持数
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
                    {ownedVariantCount(item, quantities)}/{item.variants.length}種・合計{total}個
                  </p>
                </div>
                {item.variants.length === 0 ? (
                  <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                    絵柄がまだ登録されていません。{isOwner ? "「このグッズを編集」から追加できます。" : ""}
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-zinc-800 dark:border-zinc-700">
                    {item.variants.map((v) => {
                      const q = quantities[qtyKey(item.id, v.id)] ?? 0;
                      const src = (v.thumbPath && urls.get(v.thumbPath)) ?? v.thumbUrl;
                      return (
                        <li key={v.id} className="flex items-center gap-3 p-2.5">
                          <div className={cn("relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800", q > 0 && "ring-2 ring-pink-500")}>
                            {src ? (
                              // eslint-disable-next-line @next/next/no-img-element -- 署名付きURL
                              <img src={src} alt="" className="h-full w-full object-contain" loading="lazy" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">画像なし</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-bold leading-snug">{v.name}</p>
                            <p className={cn("text-xs", q > 0 ? "font-bold text-pink-600 dark:text-pink-400" : "text-slate-500 dark:text-slate-400")}>
                              {q > 0 ? `${q}個` : "未取得"}
                            </p>
                          </div>
                          <QuantityStepper size="sm" value={q} disabled={disabled} label={`${v.name}の所持数`} onChange={(n) => onQuantity(item, v.id, n)} />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {isOwner && (
              <div className="mt-5">
                <Link href={`/mochico/events/${item.eventId}/items/${item.id}/edit`} className={`${btn.secondary} w-full`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  このグッズを編集
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
