"use client";
// ============================================================
// Event Detail の本体: 進捗 / フィルター / グッズグリッド / ワンタップ切替
//
// 切替は Optimistic UI:
//   タップ → 即座に表示を更新 → Supabase へ upsert
//   失敗したら、そのグッズの「最後に確定した状態」へ戻してエラーを出す。
//   連打しても最後のタップだけが保存されるよう、グッズごとに書き込みを直列化する。
// 誤タップは確認ダイアログではなくトーストの「元に戻す」で救う。
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Info, Plus } from "lucide-react";
import { AppMascot } from "@/components/mochico/MascotColorContext";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { loadUiState, saveSnapshot, saveUiState } from "@/lib/goods/cache/idb";
import { formatPrice, progressPercent } from "@/lib/goods/format";
import type { GoodsEvent, GoodsItem, OwnershipStatus } from "@/lib/goods/types";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { ImageFallback } from "./ImageFallback";
import { GoodsDetailSheet } from "./GoodsDetailSheet";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";

type Filter = "all" | "owned" | "unowned";

interface Props {
  userId: string;
  event: GoodsEvent;
  goods: GoodsItem[];
  initialStatuses: Record<string, OwnershipStatus>;
  isOwner: boolean;
  /** オフライン時にキャッシュから表示している場合 true（書き込み不可） */
  fromCache?: boolean;
}

export function GoodsBoard({ userId, event, goods, initialStatuses, isOwner, fromCache = false }: Props) {
  const toast = useToast();
  const online = useOnline();
  const readOnly = fromCache || !online;

  const [statuses, setStatuses] = useState(initialStatuses);
  const confirmed = useRef<Record<string, OwnershipStatus>>({ ...initialStatuses });
  const desired = useRef<Record<string, OwnershipStatus>>({ ...initialStatuses });
  const inflight = useRef<Record<string, Promise<boolean> | undefined>>({});
  const [filter, setFilter] = useState<Filter>("all");
  // フィルター中に切り替えたカードは、フィルターを変えるまでその場に残す（急に消えると迷子になる）
  const [sticky, setSticky] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<GoodsItem | null>(null);
  const [popId, setPopId] = useState<string | null>(null);

  // サーバーから新しいデータが来たら同期（router.refresh 後など）
  useEffect(() => {
    setStatuses(initialStatuses);
    confirmed.current = { ...initialStatuses };
    desired.current = { ...initialStatuses };
  }, [initialStatuses]);

  // フィルターはイベントごとに記憶（IndexedDB の UI state）
  const uiKey = `filter:${userId}:${event.id}`;
  // 読み込みより先にユーザーがタブを押していたら、そちらを優先する（遅れて上書きしない）
  const filterTouched = useRef(false);
  useEffect(() => {
    loadUiState<Filter>(uiKey).then((f) => {
      if (filterTouched.current) return;
      if (f === "all" || f === "owned" || f === "unowned") setFilter(f);
    });
  }, [uiKey]);

  // 閲覧用スナップショット（正本ではない。オフライン時の表示用）
  useEffect(() => {
    if (fromCache) return;
    const t = setTimeout(() => {
      saveSnapshot({ userId, eventId: event.id, event, goods, statuses, isOwner, savedAt: Date.now() });
    }, 400);
    return () => clearTimeout(t);
  }, [fromCache, userId, event, goods, statuses, isOwner]);

  const isOwned = useCallback((id: string) => statuses[id] === "owned", [statuses]);
  const ownedCount = useMemo(() => goods.filter((g) => statuses[g.id] === "owned").length, [goods, statuses]);
  const total = goods.length;
  const pct = progressPercent(ownedCount, total);

  const visible = useMemo(() => {
    if (filter === "all") return goods;
    return goods.filter((g) => sticky.has(g.id) || (filter === "owned" ? statuses[g.id] === "owned" : statuses[g.id] !== "owned"));
  }, [goods, statuses, filter, sticky]);

  function changeFilter(f: Filter) {
    filterTouched.current = true;
    setFilter(f);
    setSticky(new Set());
    saveUiState(uiKey, f);
  }

  // グッズごとに書き込みを直列化する。通信中に再タップされたら、送信完了後に
  // 「最新の希望状態」だけを送る。古いリクエストが後から届いて上書きする事故を防ぐ。
  const write = useCallback(
    (item: GoodsItem, next: OwnershipStatus): Promise<boolean> => {
      desired.current[item.id] = next;
      setStatuses((s) => ({ ...s, [item.id]: next }));

      const running = inflight.current[item.id];
      if (running) return running;

      const flush = (async () => {
        try {
          const current = () => confirmed.current[item.id] ?? "unowned";
          while (desired.current[item.id] !== current()) {
            const v = desired.current[item.id];
            const { error } = await goodsBrowserClient()
              .from("ownerships")
              .upsert({ goods_id: item.id, user_id: userId, status: v }, { onConflict: "user_id,goods_id" });
            if (error) {
              desired.current[item.id] = current();
              setStatuses((s) => ({ ...s, [item.id]: current() }));
              toast.show(
                navigator.onLine ? `「${item.name}」を更新できませんでした。もう一度お試しください。` : "オフラインのため更新できませんでした。",
                { tone: "error" }
              );
              return false;
            }
            confirmed.current[item.id] = v;
          }
          return true;
        } finally {
          delete inflight.current[item.id];
        }
      })();
      inflight.current[item.id] = flush;
      return flush;
    },
    [toast, userId]
  );

  const toggle = useCallback(
    async (item: GoodsItem) => {
      if (readOnly) {
        toast.show(fromCache ? "オフライン表示中のため変更できません。" : "オフラインのため変更できません。", { tone: "error" });
        return;
      }
      const prev: OwnershipStatus = statuses[item.id] === "owned" ? "owned" : "unowned";
      const next: OwnershipStatus = prev === "owned" ? "unowned" : "owned";
      if (filter !== "all") setSticky((s) => new Set(s).add(item.id));
      setPopId(item.id);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);

      const ok = await write(item, next);
      if (ok) {
        toast.show(next === "owned" ? `「${item.name}」を取得済みにしました` : `「${item.name}」を未取得に戻しました`, {
          action: { label: "元に戻す", onClick: () => write(item, prev) },
        });
      }
    },
    [filter, fromCache, readOnly, statuses, toast, write]
  );

  const counts = { all: total, owned: ownedCount, unowned: total - ownedCount };
  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "unowned", label: "未取得" },
    { key: "owned", label: "取得済み" },
  ];

  return (
    <>
      {/* 進捗 */}
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

      {/* フィルター（上部に固定。スクロールしても切り替えられる） */}
      {total > 0 && (
        <div className="sticky top-[calc(var(--goods-top)+var(--goods-safe-top)+48px)] z-20 -mx-4 mt-4 bg-slate-50/95 px-4 py-2 backdrop-blur dark:bg-zinc-950/95">
          <div role="tablist" aria-label="表示の絞り込み" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-zinc-800/80">
            {tabs.map((t) => {
              const active = filter === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeFilter(t.key)}
                  className={cn(
                    "flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {t.label}
                  <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-slate-100 dark:bg-zinc-800" : "")}>{counts[t.key]}</span>
                </button>
              );
            })}
          </div>
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
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          {filter === "owned" ? "取得済みのグッズはまだありません。" : "未取得のグッズはありません。すべて取得済みです！"}
        </p>
      ) : (
        <ul className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((g) => (
            <GoodsCard
              key={g.id}
              item={g}
              owned={isOwned(g.id)}
              pop={popId === g.id}
              disabled={readOnly}
              onToggle={() => toggle(g)}
              onInfo={() => setDetail(g)}
            />
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

      <GoodsDetailSheet
        item={detail}
        owned={detail ? isOwned(detail.id) : false}
        isOwner={isOwner && !fromCache}
        disabled={readOnly}
        onToggle={() => detail && toggle(detail)}
        onClose={() => setDetail(null)}
      />
    </>
  );
}

function GoodsCard({
  item,
  owned,
  pop,
  disabled,
  onToggle,
  onInfo,
}: {
  item: GoodsItem;
  owned: boolean;
  pop: boolean;
  disabled: boolean;
  onToggle: () => void;
  onInfo: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <li className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={owned}
        aria-label={`${item.name}、${formatPrice(item.price)}、${owned ? "取得済み" : "未取得"}。タップで${owned ? "未取得" : "取得済み"}に切り替え`}
        aria-disabled={disabled || undefined}
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
          {owned ? (
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
        </div>
        <div className="flex flex-1 flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
          {item.category && (
            <span className="line-clamp-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.category}</span>
          )}
          <span className="line-clamp-2 min-h-[2.5em] text-[13px] font-bold leading-tight text-slate-900 dark:text-white">{item.name}</span>
          <span
            className={cn(
              "mt-auto pt-1 text-sm font-bold tabular-nums",
              item.price === null ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"
            )}
          >
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

