"use client";
// ============================================================
// Event Detail の本体: 進捗 / 絞り込み（所持・検索・カテゴリ・並び替え）/ グッズグリッド
//
// 所持数の更新は Optimistic UI:
//   タップ・数量変更 → 即座に表示を更新 → Supabase へ upsert（quantity）
//   失敗したら、その対象（グッズ／絵柄）の「最後に確定した数量」へ戻してエラーを出す。
//   連打しても最後の値だけが保存されるよう、対象ごとに書き込みを直列化する。
// カードのタップ:
//   通常商品 0個 → 1個 / 1個 → 0個（トーストで元に戻せる）
//   2個以上 → 減らさずに数量シートを開く（タップで意図せず 0 にしない）
//   ランダム商品 → 絵柄ごとの所持数シートを開く
// 取得率はイベント全体で計算する（検索・絞り込みの結果ではない）
// ============================================================
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Check, Info, Layers, Plus, Search, Settings2, X } from "lucide-react";
import { AppMascot } from "@/components/mochico/MascotColorContext";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { loadUiState, saveSnapshot, saveUiState } from "@/lib/goods/cache/idb";
import { formatPrice, progressPercent } from "@/lib/goods/format";
import { itemOwned, itemTotal, ownedVariantCount } from "@/lib/goods/quantity";
import { SORT_LABELS, queryGoods, type CategoryFilter, type OwnFilter, type SortKey } from "@/lib/goods/search";
import { qtyKey, type GoodsCategory, type GoodsEvent, type GoodsItem, type Quantities } from "@/lib/goods/types";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { ImageFallback } from "./ImageFallback";
import { GoodsDetailSheet } from "./GoodsDetailSheet";
import { CategoryEditor } from "./CategoryEditor";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";

/** この件数以上のイベントで検索・並び替えを表示する（少ないイベントは従来どおりの画面） */
const SEARCH_MIN_GOODS = 8;

interface Props {
  userId: string;
  event: GoodsEvent;
  goods: GoodsItem[];
  categories: GoodsCategory[];
  initialQuantities: Quantities;
  isOwner: boolean;
  /** オフライン時にキャッシュから表示している場合 true（書き込み不可） */
  fromCache?: boolean;
}

export function GoodsBoard({ userId, event, goods, categories, initialQuantities, isOwner, fromCache = false }: Props) {
  const toast = useToast();
  const online = useOnline();
  const readOnly = fromCache || !online;

  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const confirmed = useRef<Quantities>({ ...initialQuantities });
  const desired = useRef<Quantities>({ ...initialQuantities });
  const inflight = useRef<Record<string, Promise<boolean> | undefined>>({});
  const [own, setOwn] = useState<OwnFilter>("all");
  const [sort, setSort] = useState<SortKey>("registered");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  // 所持で絞り込み中に切り替えたカードは、条件を変えるまでその場に残す（急に消えると迷子になる）
  const [sticky, setSticky] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editCategories, setEditCategories] = useState(false);
  const [popId, setPopId] = useState<string | null>(null);

  // サーバーから新しいデータが来たら同期（router.refresh 後など）。送信中の対象は希望値を保つ
  useEffect(() => {
    setQuantities((cur) => {
      const next = { ...initialQuantities };
      for (const k of Object.keys(inflight.current)) if (k in cur) next[k] = cur[k];
      return next;
    });
    confirmed.current = { ...initialQuantities };
    desired.current = { ...initialQuantities, ...Object.fromEntries(Object.keys(inflight.current).map((k) => [k, desired.current[k] ?? 0])) };
  }, [initialQuantities]);

  // 表示条件はイベントごとに記憶（IndexedDB の UI state）。所持の絞り込みは従来のキーのまま
  const uiKey = `filter:${userId}:${event.id}`;
  const viewKey = `view:${userId}:${event.id}`;
  // 読み込みより先にユーザーが操作していたら、そちらを優先する（遅れて上書きしない）
  const touched = useRef(false);
  useEffect(() => {
    Promise.all([loadUiState<OwnFilter>(uiKey), loadUiState<{ sort?: SortKey; category?: string }>(viewKey)]).then(([f, v]) => {
      if (touched.current) return;
      if (f === "all" || f === "owned" || f === "unowned") setOwn(f);
      if (v?.sort && v.sort in SORT_LABELS) setSort(v.sort);
      if (v?.category && (v.category === "all" || v.category === "none" || categories.some((c) => c.id === v.category))) setCategory(v.category);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- イベントを開いたときだけ復元する
  }, [uiKey, viewKey]);

  // 閲覧用スナップショット（正本ではない。オフライン時の表示用）
  useEffect(() => {
    if (fromCache) return;
    const t = setTimeout(() => {
      saveSnapshot({ userId, eventId: event.id, event, goods, categories, quantities, isOwner, savedAt: Date.now() });
    }, 400);
    return () => clearTimeout(t);
  }, [fromCache, userId, event, goods, categories, quantities, isOwner]);

  // 取得率はイベント全体
  const ownedCount = useMemo(() => goods.filter((g) => itemOwned(g, quantities)).length, [goods, quantities]);
  const total = goods.length;
  const pct = progressPercent(ownedCount, total);

  // 検索・カテゴリで絞った範囲（所持のタブの件数はこの範囲で数える）
  const scoped = useMemo(() => queryGoods(goods, quantities, { text: deferredText, own: "all", category, sort: "registered" }), [goods, quantities, deferredText, category]);
  const scopedOwned = useMemo(() => scoped.filter((g) => itemOwned(g, quantities)).length, [scoped, quantities]);
  const visible = useMemo(
    () => queryGoods(goods, quantities, { text: deferredText, own, category, sort, sticky }),
    [goods, quantities, deferredText, own, category, sort, sticky]
  );
  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const g of goods) if (g.categoryId) m[g.categoryId] = (m[g.categoryId] ?? 0) + 1;
    return m;
  }, [goods]);
  const uncategorized = goods.length - Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const detail = detailId ? goods.find((g) => g.id === detailId) ?? null : null;

  function changeOwn(f: OwnFilter) {
    touched.current = true;
    setOwn(f);
    setSticky(new Set());
    saveUiState(uiKey, f);
  }
  function changeView(next: { sort?: SortKey; category?: CategoryFilter }) {
    touched.current = true;
    const v = { sort: next.sort ?? sort, category: next.category ?? category };
    if (next.sort) setSort(next.sort);
    if (next.category) setCategory(next.category);
    setSticky(new Set());
    saveUiState(viewKey, v);
  }

  // 対象（グッズ／絵柄）ごとに書き込みを直列化する。通信中に再操作されたら、送信完了後に
  // 「最新の希望数量」だけを送る。古いリクエストが後から届いて上書きする事故を防ぐ。
  const write = useCallback(
    (item: GoodsItem, variantId: string | null, next: number): Promise<boolean> => {
      const key = qtyKey(item.id, variantId);
      desired.current[key] = next;
      setQuantities((s) => ({ ...s, [key]: next }));

      const running = inflight.current[key];
      if (running) return running;

      const flush = (async () => {
        try {
          const current = () => confirmed.current[key] ?? 0;
          while ((desired.current[key] ?? 0) !== current()) {
            const v = desired.current[key] ?? 0;
            const { error } = await goodsBrowserClient()
              .from("ownerships")
              .upsert(
                { goods_id: item.id, variant_id: variantId, user_id: userId, quantity: v, status: v > 0 ? "owned" : "unowned" },
                { onConflict: "user_id,goods_id,variant_id" }
              );
            if (error) {
              desired.current[key] = current();
              setQuantities((s) => ({ ...s, [key]: current() }));
              toast.show(
                navigator.onLine ? `「${item.name}」を更新できませんでした。もう一度お試しください。` : "オフラインのため更新できませんでした。",
                { tone: "error" }
              );
              return false;
            }
            confirmed.current[key] = v;
          }
          return true;
        } finally {
          delete inflight.current[key];
        }
      })();
      inflight.current[key] = flush;
      return flush;
    },
    [toast, userId]
  );

  const guardReadOnly = useCallback(() => {
    if (!readOnly) return false;
    toast.show(fromCache ? "オフライン表示中のため変更できません。" : "オフラインのため変更できません。", { tone: "error" });
    return true;
  }, [fromCache, readOnly, toast]);

  const tap = useCallback(
    async (item: GoodsItem) => {
      // ランダム商品と2個以上の商品は、タップで数を変えずにシートを開く（誤操作で減らさない）
      if (item.kind === "random" || (quantities[item.id] ?? 0) >= 2) {
        setDetailId(item.id);
        return;
      }
      if (guardReadOnly()) return;
      const prev = quantities[item.id] ?? 0;
      const next = prev > 0 ? 0 : 1;
      if (own !== "all") setSticky((s) => new Set(s).add(item.id));
      setPopId(item.id);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
      const ok = await write(item, null, next);
      if (ok) {
        toast.show(next > 0 ? `「${item.name}」を取得済みにしました` : `「${item.name}」を未取得に戻しました`, {
          action: { label: "元に戻す", onClick: () => write(item, null, prev) },
        });
      }
    },
    [guardReadOnly, own, quantities, toast, write]
  );

  const setQuantity = useCallback(
    (item: GoodsItem, variantId: string | null, next: number) => {
      if (guardReadOnly()) return;
      if (own !== "all") setSticky((s) => new Set(s).add(item.id));
      write(item, variantId, next);
    },
    [guardReadOnly, own, write]
  );

  const tabs: { key: OwnFilter; label: string; count: number }[] = [
    { key: "all", label: "すべて", count: scoped.length },
    { key: "unowned", label: "未取得", count: scoped.length - scopedOwned },
    { key: "owned", label: "取得済み", count: scopedOwned },
  ];
  const showSearch = total >= SEARCH_MIN_GOODS || text !== "";
  const showCategories = total > 0 && (categories.length > 0 || (isOwner && !fromCache));
  const narrowed = deferredText.trim() !== "" || category !== "all";

  return (
    <>
      {/* 進捗（イベント全体） */}
      <section aria-label="取得状況" className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-end justify-between gap-3">
          <p className="text-slate-900 dark:text-white">
            <span className="text-3xl font-bold tabular-nums">{ownedCount}</span>
            <span className="mx-1 text-lg text-slate-400">/</span>
            <span className="text-lg font-bold tabular-nums">{total}</span>
            <span className="ml-1.5 text-sm text-slate-500 dark:text-slate-400">取得</span>
          </p>
          <p className={cn("text-2xl font-bold tabular-nums", total > 0 && ownedCount === total ? "text-pink-600 dark:text-pink-400" : "text-slate-700 dark:text-slate-200")}>
            {pct}%
          </p>
        </div>
        <div className="mt-2.5">
          <ProgressBar owned={ownedCount} total={total} />
        </div>
        {total > 0 && ownedCount === total && (
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-pink-600 dark:text-pink-400">
            <span aria-hidden="true">
              <AppMascot size={36} state="happy" />
            </span>
            コンプリートおめでとうございます！
          </p>
        )}
      </section>

      {/* 絞り込み（上部に固定。スクロールしても切り替えられる）: 所持タブ → 検索・並び替え → カテゴリ */}
      {total > 0 && (
        <div className="sticky top-[calc(var(--goods-top)+var(--goods-safe-top)+48px)] z-20 -mx-4 mt-4 space-y-2 bg-slate-50/95 px-4 py-2 backdrop-blur dark:bg-zinc-950/95">
          <div role="tablist" aria-label="表示の絞り込み" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-zinc-800/80">
            {tabs.map((t) => {
              const active = own === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeOwn(t.key)}
                  className={cn(
                    "flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {t.label}
                  <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-slate-100 dark:bg-zinc-800" : "")}>{t.count}</span>
                </button>
              );
            })}
          </div>

          {showSearch && (
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="商品名で検索"
                  aria-label="商品名で検索"
                  enterKeyHint="search"
                  className="h-10 w-full min-w-0 rounded-xl border border-slate-300 bg-white pl-9 pr-9 text-base text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white [&::-webkit-search-cancel-button]:hidden"
                />
                {text && (
                  <button type="button" onClick={() => setText("")} aria-label="検索語を消す" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <label className="relative flex h-10 shrink-0 items-center gap-1 rounded-xl border border-slate-300 bg-white pl-2.5 pr-2 text-sm font-bold text-slate-700 focus-within:ring-2 focus-within:ring-violet-500/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200">
                <ArrowDownUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">並び替え</span>
                <select
                  value={sort}
                  onChange={(e) => changeView({ sort: e.target.value as SortKey })}
                  className="h-full max-w-[7.5rem] appearance-none bg-transparent pr-1 text-sm font-bold focus:outline-none"
                  aria-label="並び替え"
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {showCategories && (
            <div role="tablist" aria-label="カテゴリ" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.length > 0 && (
                <>
                  <CategoryChip active={category === "all"} onClick={() => changeView({ category: "all" })} label="すべて" />
                  {categories.map((c) => (
                    <CategoryChip key={c.id} active={category === c.id} onClick={() => changeView({ category: c.id })} label={c.name} count={categoryCounts[c.id] ?? 0} />
                  ))}
                  {uncategorized > 0 && <CategoryChip active={category === "none"} onClick={() => changeView({ category: "none" })} label="未分類" count={uncategorized} />}
                </>
              )}
              {isOwner && !fromCache && (
                <button
                  type="button"
                  onClick={() => setEditCategories(true)}
                  className="inline-flex min-h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-white dark:border-zinc-600 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  {categories.length > 0 ? <Settings2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                  {categories.length > 0 ? "カテゴリを編集" : "カテゴリを追加"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* グリッド */}
      {total === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <span aria-hidden="true">
            <AppMascot size={64} state="peek" />
          </span>
          <p className="mt-3 font-bold text-slate-900 dark:text-white">まだグッズが登録されていません</p>
          {isOwner ? (
            <>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">写真・商品名・価格を登録すると、ここに一覧で表示されます。</p>
              <Link href={`/mochico/events/${event.id}/items/new`} className={`${btn.primary} mt-6`}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                グッズを登録
              </Link>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">イベントの作成者がグッズを登録すると表示されます。</p>
          )}
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center" role="status">
          {narrowed ? (
            <>
              <span aria-hidden="true">
                <AppMascot size={48} state="peek" />
              </span>
              <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">条件に合うグッズはありません</p>
              <button
                type="button"
                className={`${btn.ghost} mt-2`}
                onClick={() => {
                  setText("");
                  changeView({ category: "all" });
                }}
              >
                検索・カテゴリの条件をクリア
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{own === "owned" ? "取得済みのグッズはまだありません。" : "未取得のグッズはありません。すべて取得済みです！"}</p>
          )}
        </div>
      ) : (
        <ul className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((g) => (
            <GoodsCard key={g.id} item={g} quantities={quantities} pop={popId === g.id} disabled={readOnly} onTap={() => tap(g)} onInfo={() => setDetailId(g.id)} />
          ))}
        </ul>
      )}

      {isOwner && total > 0 && !fromCache && (
        <Link
          href={`/mochico/events/${event.id}/items/new`}
          className="fixed right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-blue-600 px-5 font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
          style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm">グッズ追加</span>
        </Link>
      )}

      <GoodsDetailSheet item={detail} quantities={quantities} isOwner={isOwner && !fromCache} disabled={readOnly} onQuantity={setQuantity} onClose={() => setDetailId(null)} />
      {isOwner && !fromCache && (
        <CategoryEditor open={editCategories} eventId={event.id} categories={categories} counts={categoryCounts} onClose={() => setEditCategories(false)} />
      )}
    </>
  );
}

function CategoryChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        active ? "bg-violet-600 text-white shadow-sm" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-violet-50 dark:bg-zinc-900 dark:text-slate-200 dark:ring-zinc-700 dark:hover:bg-zinc-800"
      )}
    >
      {label}
      {count !== undefined && <span className={cn("text-xs tabular-nums", active ? "text-violet-100" : "text-slate-500 dark:text-slate-400")}>{count}</span>}
    </button>
  );
}

function GoodsCard({
  item,
  quantities,
  pop,
  disabled,
  onTap,
  onInfo,
}: {
  item: GoodsItem;
  quantities: Quantities;
  pop: boolean;
  disabled: boolean;
  onTap: () => void;
  onInfo: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const qty = itemTotal(item, quantities);
  const owned = qty > 0;
  const random = item.kind === "random";
  const kinds = item.variants.length;
  const ownedKinds = random ? ownedVariantCount(item, quantities) : 0;

  const label = random
    ? `${item.name}、${formatPrice(item.price)}、ランダム全${kinds}種のうち${ownedKinds}種取得${qty > 0 ? `・合計${qty}個` : ""}。タップで絵柄ごとの所持数を表示`
    : qty >= 2
      ? `${item.name}、${formatPrice(item.price)}、取得済み${qty}個。タップで数量を変更`
      : `${item.name}、${formatPrice(item.price)}、${owned ? "取得済み" : "未取得"}。タップで${owned ? "未取得" : "取得済み"}に切り替え`;

  return (
    <li className="relative">
      <button
        type="button"
        onClick={onTap}
        aria-pressed={random || qty >= 2 ? undefined : owned}
        aria-haspopup={random || qty >= 2 ? "dialog" : undefined}
        aria-label={label}
        aria-disabled={(disabled && !random && qty < 2) || undefined}
        className={cn(
          "group flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 active:scale-[0.97] dark:bg-zinc-900",
          owned ? "border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.15)] dark:border-pink-500" : "border-transparent shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800",
          pop && "goods-pop"
        )}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
          {item.thumbUrl && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- 署名付きURLのサムネ（480px・圧縮済み）
            <img
              src={item.thumbUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className={cn("h-full w-full object-contain transition", owned && "opacity-90")}
            />
          ) : (
            <ImageFallback missing={!!item.thumbPath} />
          )}
          {/* 状態バッジ: 色だけでなくアイコン＋文字で表す */}
          {random ? (
            <span
              className={cn(
                "absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full py-1 pl-1.5 pr-2.5 text-xs font-bold shadow-sm",
                owned ? "goods-check bg-pink-600 text-white" : "border border-slate-300 bg-white/90 text-slate-600 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-slate-300"
              )}
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              {owned ? `${ownedKinds}/${kinds}種` : `全${kinds}種`}
            </span>
          ) : owned ? (
            <span className="goods-check absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-pink-600 py-1 pl-1.5 pr-2.5 text-xs font-bold text-white shadow-sm">
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
              取得済み
            </span>
          ) : (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full border border-slate-300 bg-white/90 py-0.5 pl-1 pr-2 text-xs font-medium text-slate-600 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-slate-300">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-400 dark:border-zinc-500" aria-hidden="true" />
              未取得
            </span>
          )}
          {/* 数量（2個以上、またはランダムで合計がある場合だけ。カードの情報量を増やしすぎない） */}
          {(qty >= 2 || (random && qty > 0)) && (
            <span className="absolute bottom-1.5 right-1.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-bold tabular-nums text-white" aria-hidden="true">
              ×{qty}
            </span>
          )}
          {item.images.length > 1 && (
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-zinc-900/90 dark:text-slate-300" aria-hidden="true">
              {item.images.length}枚
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
          {item.category && <span className="line-clamp-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.category}</span>}
          <span className="line-clamp-2 min-h-[2.5em] text-[13px] font-bold leading-tight text-slate-900 dark:text-white">{item.name}</span>
          <span className={cn("mt-auto pt-1 text-sm font-bold tabular-nums", item.price === null ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
            {formatPrice(item.price)}
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={onInfo}
        aria-label={`${item.name}の詳細`}
        className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm dark:bg-zinc-900/90">
          <Info className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}
