"use client";
// ============================================================
// 共有カタログの表示（閲覧専用）＋「自分の管理に追加」
//   通常の Event Detail と同じ見た目の言語で、取得済み/未取得は表示しない。
// ============================================================
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Info, Loader2, Lock, Plus, X } from "lucide-react";
import { formatEventDate, formatPrice } from "@/lib/goods/format";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ImageFallback } from "./ImageFallback";
import type { SharedCatalog, SharedGoods } from "@/lib/goods/share";

export type ShareRelation =
  | { kind: "anonymous" }
  | { kind: "none" }
  | { kind: "member"; eventId: string }
  | { kind: "owner"; eventId: string };

type JoinState = "idle" | "pending" | "error" | "unavailable";

export function ShareCatalogView({ catalog, relation, autoJoin }: { catalog: SharedCatalog; relation: ShareRelation; autoJoin: boolean }) {
  const router = useRouter();
  const [detail, setDetail] = useState<SharedGoods | null>(null);
  const [joinState, setJoinState] = useState<JoinState>("idle");
  const inFlight = useRef(false);
  const { event, goods } = catalog;
  const date = formatEventDate(event.startDate, event.endDate);

  const join = useCallback(async () => {
    // 連打・二重送信でも1回だけ送る（DB 側でも UNIQUE で重複しない）
    if (inFlight.current) return;
    inFlight.current = true;
    setJoinState("pending");
    try {
      const res = await fetch("/mochico/s/join", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { status?: string; eventId?: string };
      if (body.status === "login_required") {
        router.push(`/mochico/login?next=${encodeURIComponent("/mochico/s/view?join=1")}`);
        return;
      }
      if ((body.status === "joined" || body.status === "already" || body.status === "owner") && body.eventId) {
        router.replace(`/mochico/events/${body.eventId}?${body.status === "joined" ? "added=1" : "already=1"}`);
        router.refresh();
        return;
      }
      setJoinState(["invalid", "revoked", "expired", "unavailable"].includes(body.status ?? "") ? "unavailable" : "error");
    } catch {
      setJoinState("error");
    } finally {
      inFlight.current = false;
    }
  }, [router]);

  useEffect(() => {
    if (autoJoin) join();
  }, [autoJoin, join]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-36 pt-4">
      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
        共有されたグッズリスト
      </p>

      {event.coverUrl && (
        <div className="aspect-[5/2] w-full overflow-hidden rounded-2xl bg-slate-200 sm:aspect-[4/1] dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- 署名付きURL */}
          <img src={event.coverUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}
      <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl dark:text-white">{event.title}</h1>
      {date && (
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {date}
        </p>
      )}
      {event.description && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{event.description}</p>}

      <p className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-200">
        グッズ <span className="tabular-nums">{goods.length}</span> 点
      </p>

      {goods.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-400">
          まだグッズが登録されていません。
        </p>
      ) : (
        <ul className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {goods.map((g) => (
            <ShareCard key={g.key} item={g} onOpen={() => setDetail(g)} />
          ))}
        </ul>
      )}

      <JoinBar relation={relation} state={joinState} onJoin={join} />
      <ShareDetailSheet item={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function ShareCard({ item, onOpen }: { item: SharedGoods; onOpen: () => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${item.name}、${formatPrice(item.price)}。詳細を見る`}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white text-left shadow-sm ring-1 ring-slate-200 transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:bg-zinc-900 dark:ring-zinc-800"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
          {item.thumbUrl && !failed ? (
            // eslint-disable-next-line @next/next/no-img-element -- 署名付きURLのサムネ
            <img src={item.thumbUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-contain" />
          ) : (
            <ImageFallback missing={item.hasImage} />
          )}
          <span className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm dark:bg-zinc-900/90 dark:text-slate-300" aria-hidden="true">
            <Info className="h-4 w-4" />
          </span>
          {item.kind === "random" && (
            <span className="absolute left-1.5 top-1.5 rounded-full border border-slate-300 bg-white/90 px-2 py-0.5 text-xs font-bold text-slate-600 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-slate-300">
              全{item.variants.length}種
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
    </li>
  );
}

function JoinBar({ relation, state, onJoin }: { relation: ShareRelation; state: JoinState; onJoin: () => void }) {
  let content: React.ReactNode;
  if (relation.kind === "owner" || relation.kind === "member") {
    content = (
      <>
        <p className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
          <Check className="h-4 w-4 text-pink-600 dark:text-pink-400" aria-hidden="true" />
          {relation.kind === "owner" ? "あなたが作成したイベントです" : "マイイベントに追加済みです"}
        </p>
        <Link href={`/mochico/events/${relation.eventId}`} className={`${btn.primary} w-full`}>
          マイイベントで開く
        </Link>
      </>
    );
  } else if (state === "unavailable") {
    content = <p role="alert" className="text-sm font-medium text-amber-700 dark:text-amber-400">この共有リンクは利用できなくなりました。共有した人に確認してください。</p>;
  } else {
    content = (
      <>
        {state === "error" && (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            追加できませんでした。通信状況を確認して、もう一度お試しください。
          </p>
        )}
        {relation.kind === "anonymous" ? (
          <Link href={`/mochico/login?next=${encodeURIComponent("/mochico/s/view?join=1")}`} className={`${btn.primary} w-full`}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            ログインして自分の管理に追加
          </Link>
        ) : (
          <button type="button" onClick={onJoin} disabled={state === "pending"} className={`${btn.primary} w-full`}>
            {state === "pending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {state === "pending" ? "追加しています…" : "自分の管理に追加"}
          </button>
        )}
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          追加すると、このリストで自分の取得状況を記録できます。取得状況はあなた本人にしか表示されません。
        </p>
      </>
    );
  }
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md flex-col gap-2 px-4 pt-3">{content}</div>
    </div>
  );
}

function ShareDetailSheet({ item, onClose }: { item: SharedGoods | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    setFailed(false);
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);
  const src = item?.imageUrl ?? item?.thumbUrl ?? null;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="share-detail-title"
      className="goods-sheet mb-0 mt-auto w-full max-w-lg rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl sm:m-auto sm:rounded-3xl dark:bg-zinc-900 dark:text-slate-100"
    >
      {item && (
        <div className="goods-slide-up max-h-[88vh] overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className={cn("relative w-full bg-slate-100 dark:bg-zinc-800", item.hasImage ? "aspect-square max-h-[60vh]" : "h-36")}>
            {src && !failed ? (
              // eslint-disable-next-line @next/next/no-img-element -- 署名付きURL
              <img src={src} alt={item.name} referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-contain" />
            ) : (
              <ImageFallback missing={item.hasImage} />
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
            <h2 id="share-detail-title" className="mt-0.5 text-lg font-bold leading-snug">
              {item.name}
            </h2>
            <p className="mt-1 text-xl font-bold tabular-nums">{formatPrice(item.price)}</p>
            {item.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>}
            {item.kind === "random" && item.variants.length > 0 && (
              <section className="mt-5" aria-labelledby="share-variants-title">
                <h3 id="share-variants-title" className="text-sm font-bold">
                  絵柄（全{item.variants.length}種）
                </h3>
                <ul className="mt-2 grid grid-cols-3 gap-2">
                  {item.variants.map((v, i) => (
                    <li key={`${v.name}-${i}`} className="flex flex-col gap-1">
                      <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                        {v.thumbUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- 署名付きURLのサムネ
                          <img src={v.thumbUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[10px] text-slate-400">画像なし</span>
                        )}
                      </div>
                      <span className="line-clamp-2 text-xs font-medium">{v.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
