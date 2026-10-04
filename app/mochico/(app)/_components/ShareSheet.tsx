"use client";
// ============================================================
// 共有シート（イベントのオーナーだけに表示）
//   リンクが無い → 期限を選んで「共有リンクを作成」
//   有効なリンク → URL・コピー・（対応端末では）共有・状態・失効
//   期限切れ/失効 → 新しいリンクを作成
// 権限は RLS / RPC 側で強制（オーナー以外は作成・失効できない）。
// ============================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Link2, Link2Off, Loader2, Share2, X } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { btn } from "@/lib/goods/ui";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";
import { useOnline } from "./useOnline";

interface LinkRow {
  token: string;
  status: "active" | "revoked";
  expires_at: string | null;
}

type Expiry = "none" | "7" | "30";

function formatUntil(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Clipboard API は HTTPS でしか使えないため、使えない環境では選択範囲コピーにフォールバック */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* フォールバックへ */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function ShareButton({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${btn.ghost} shrink-0 border border-slate-200 dark:border-zinc-800`} aria-haspopup="dialog">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span>共有</span>
      </button>
      <ShareSheet open={open} onClose={() => setOpen(false)} eventId={eventId} eventTitle={eventTitle} />
    </>
  );
}

function ShareSheet({ open, onClose, eventId, eventTitle }: { open: boolean; onClose: () => void; eventId: string; eventTitle: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const online = useOnline();
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<LinkRow | null>(null);
  const [expiry, setExpiry] = useState<Expiry>("none");
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function" && window.isSecureContext);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const { data, error } = await goodsBrowserClient()
      .from("share_links")
      .select("token, status, expires_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) setLoadError(true);
    setLink((data as LinkRow | null) ?? null);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const expired = !!link?.expires_at && new Date(link.expires_at).getTime() <= Date.now();
  const usable = link?.status === "active" && !expired;
  const url = usable && typeof window !== "undefined" ? `${window.location.origin}/mochico/s/${link!.token}` : "";

  async function create() {
    setBusy(true);
    const { data, error } = await goodsBrowserClient().rpc("goods_create_share_link", {
      p_event_id: eventId,
      p_expires_days: expiry === "none" ? null : Number(expiry),
    });
    setBusy(false);
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row) {
      toast.show("共有リンクを作成できませんでした。もう一度お試しください。", { tone: "error" });
      return;
    }
    setLink({ token: row.token, status: row.status, expires_at: row.expires_at });
    toast.show("共有リンクを作成しました");
  }

  async function revoke() {
    if (!link) return;
    setBusy(true);
    const { error } = await goodsBrowserClient().from("share_links").update({ status: "revoked" }).eq("token", link.token);
    setBusy(false);
    setConfirmRevoke(false);
    if (error) {
      toast.show("共有を停止できませんでした。もう一度お試しください。", { tone: "error" });
      return;
    }
    setLink({ ...link, status: "revoked" });
    toast.show("共有リンクを停止しました。追加済みの人のリストはそのまま使えます。");
  }

  async function copy() {
    const ok = await copyText(url);
    toast.show(ok ? "共有リンクをコピーしました" : "コピーできませんでした。URLを長押ししてコピーしてください。", { tone: ok ? "default" : "error" });
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: eventTitle, text: `「${eventTitle}」のグッズリスト`, url });
    } catch {
      /* キャンセル */
    }
  }

  return (
    <dialog
      ref={ref}
      // 内側の確認ダイアログの close が React ツリーを伝って届くため、自分自身の close のときだけ閉じる
      onClose={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="share-sheet-title"
      className="goods-sheet mb-0 mt-auto w-full max-w-lg rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl sm:m-auto sm:rounded-3xl dark:bg-zinc-900 dark:text-slate-100"
    >
      {open && (
        <div className="goods-slide-up p-5" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="share-sheet-title" className="text-lg font-bold">
                グッズリストを共有
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                リンクを知っている人はこのイベントとグッズを見られ、自分の管理に追加できます。<strong className="font-bold text-slate-800 dark:text-slate-200">あなたの取得状況は共有されません。</strong>
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="閉じる" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-slate-500" role="status">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                読み込み中…
              </div>
            ) : loadError ? (
              <div className="space-y-3">
                <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">共有設定を読み込めませんでした。</p>
                <button type="button" onClick={load} className={btn.secondary}>再読み込み</button>
              </div>
            ) : usable ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                    共有中
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">{link!.expires_at ? `${formatUntil(link!.expires_at)} まで` : "期限なし"}</span>
                </div>
                <label htmlFor="share-url" className="sr-only">共有URL</label>
                <input
                  id="share-url"
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 font-mono text-xs text-slate-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-200"
                />
                <div className={cn("grid gap-2", canShare ? "grid-cols-2" : "grid-cols-1")}>
                  <button type="button" onClick={copy} className={btn.primary}>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    コピー
                  </button>
                  {canShare && (
                    <button type="button" onClick={nativeShare} className={btn.secondary}>
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                      送る
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => setConfirmRevoke(true)} disabled={busy || !online} className={`${btn.danger} w-full`}>
                  <Link2Off className="h-4 w-4" aria-hidden="true" />
                  共有を停止（リンクを失効）
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {link && (
                  <p className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                    {link.status === "revoked" ? "以前のリンクは停止済みです。" : "以前のリンクは期限切れです。"}追加済みの人のリストはそのまま使えます。
                  </p>
                )}
                <fieldset>
                  <legend className="text-sm font-bold text-slate-800 dark:text-slate-100">リンクの有効期限</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(
                      [
                        ["none", "期限なし"],
                        ["7", "7日間"],
                        ["30", "30日間"],
                      ] as [Expiry, string][]
                    ).map(([v, label]) => (
                      <label
                        key={v}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-bold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500",
                          expiry === v
                            ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                            : "border-slate-300 text-slate-700 dark:border-zinc-700 dark:text-slate-300"
                        )}
                      >
                        <input type="radio" name="expiry" value={v} checked={expiry === v} onChange={() => setExpiry(v)} className="sr-only" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button type="button" onClick={create} disabled={busy || !online} className={`${btn.primary} w-full`}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                  {link ? "新しい共有リンクを作成" : "共有リンクを作成"}
                </button>
              </div>
            )}
            {!online && <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">オフラインのため共有設定を変更できません。</p>}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmRevoke}
        title="共有を停止しますか？"
        confirmLabel="停止する"
        busy={busy}
        onConfirm={revoke}
        onCancel={() => setConfirmRevoke(false)}
      >
        このリンクからは新しく閲覧・追加できなくなります。すでに自分の管理に追加した人のリストはそのまま残ります。
      </ConfirmDialog>
    </dialog>
  );
}
