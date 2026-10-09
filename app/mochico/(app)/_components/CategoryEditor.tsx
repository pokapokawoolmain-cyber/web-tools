"use client";
// カテゴリの編集（イベントのオーナーだけ。権限は DB の RLS でも強制）
//   追加・名前の変更・並び替え・削除。削除してもグッズは消えず「未分類」になる
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, X } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { friendlyDbError } from "@/lib/goods/validation";
import type { GoodsCategory } from "@/lib/goods/types";
import { btn, field } from "@/lib/goods/ui";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

/** よく使うカテゴリの候補（固定の選択肢ではなく、ワンタップで追加できる候補） */
export const CATEGORY_SUGGESTIONS = ["アクリルスタンド", "缶バッジ", "ペンライト", "タオル", "Tシャツ", "ぬいぐるみ", "キーホルダー", "トレーディングカード", "その他"];

interface Props {
  open: boolean;
  eventId: string;
  categories: GoodsCategory[];
  /** カテゴリごとのグッズ数（削除の確認文に使う） */
  counts: Record<string, number>;
  onClose: () => void;
}

export function CategoryEditor({ open, eventId, categories, counts, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<GoodsCategory | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => setDrafts({}), [categories]);

  const supabase = goodsBrowserClient();
  const names = new Set(categories.map((c) => c.name));

  async function run(fn: () => PromiseLike<{ error: unknown }>, ok?: string) {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) {
      toast.show(friendlyDbError(error as { code?: string; message?: string }), { tone: "error" });
      return false;
    }
    if (ok) toast.show(ok);
    router.refresh();
    return true;
  }

  async function add(raw: string) {
    const name = raw.normalize("NFKC").trim();
    if (!name || name.length > 30) return toast.show("カテゴリ名は1〜30文字で入力してください。", { tone: "error" });
    if (names.has(name)) return toast.show("同じ名前のカテゴリがあります。", { tone: "error" });
    const next = categories.length ? Math.max(...categories.map((c) => c.sortOrder)) + 1 : 0;
    if (await run(() => supabase.from("goods_categories").insert({ event_id: eventId, name, sort_order: next }), `「${name}」を追加しました`)) setNewName("");
  }

  async function rename(c: GoodsCategory) {
    const name = (drafts[c.id] ?? c.name).normalize("NFKC").trim();
    if (name === c.name) return;
    if (!name || name.length > 30) return toast.show("カテゴリ名は1〜30文字で入力してください。", { tone: "error" });
    if (names.has(name)) return toast.show("同じ名前のカテゴリがあります。", { tone: "error" });
    await run(() => supabase.from("goods_categories").update({ name }).eq("id", c.id), "名前を変更しました");
  }

  async function move(index: number, dir: -1 | 1) {
    const a = categories[index];
    const b = categories[index + dir];
    if (!a || !b) return;
    // 並び順を振り直して入れ替える（同じ sort_order が混ざっていても確実に動かす）
    const order = categories.map((c) => c.id);
    [order[index], order[index + dir]] = [order[index + dir], order[index]];
    setBusy(true);
    const results = await Promise.all(order.map((id, i) => supabase.from("goods_categories").update({ sort_order: i }).eq("id", id)));
    setBusy(false);
    const failed = results.find((r) => r.error);
    if (failed) toast.show(friendlyDbError(failed.error!), { tone: "error" });
    router.refresh();
  }

  async function remove(c: GoodsCategory) {
    const ok = await run(() => supabase.from("goods_categories").delete().eq("id", c.id), `「${c.name}」を削除しました。グッズは「未分類」になりました`);
    if (ok) setToDelete(null);
  }

  const suggestions = CATEGORY_SUGGESTIONS.filter((s) => !names.has(s));

  return (
    <dialog
      ref={ref}
      onClose={(e) => {
        // 中の確認ダイアログが閉じたときの close は無視する（ShareSheet と同じ）
        if (e.target === e.currentTarget) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="category-editor-title"
      className="goods-sheet mb-0 mt-auto w-full max-w-lg rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl sm:m-auto sm:rounded-3xl dark:bg-zinc-900 dark:text-slate-100"
    >
      {open && (
        <div className="goods-slide-up max-h-[88vh] overflow-y-auto overscroll-contain p-5" style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="category-editor-title" className="text-lg font-bold">
              カテゴリを編集
            </h2>
            <button type="button" onClick={onClose} aria-label="閉じる" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">カテゴリはリストを共有している全員に表示されます。削除しても、グッズは「未分類」として残ります。</p>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              add(newName);
            }}
          >
            <label htmlFor="new-category" className="sr-only">
              新しいカテゴリ名
            </label>
            <input id="new-category" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={30} placeholder="新しいカテゴリ名" className={`${field.input} mt-0 min-w-0 flex-1`} disabled={busy} />
            <button type="submit" className={`${btn.primary} shrink-0`} disabled={busy || !newName.trim()}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              追加
            </button>
          </form>
          {suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">よく使うカテゴリ</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {suggestions.map((sname) => (
                  <button
                    key={sname}
                    type="button"
                    disabled={busy}
                    onClick={() => add(sname)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-full border border-dashed border-violet-300 px-3 text-sm text-violet-700 hover:bg-violet-50 disabled:opacity-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/40"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    {sname}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="mt-5 space-y-2" aria-label="カテゴリ一覧">
            {categories.length === 0 && <li className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-zinc-800 dark:text-slate-300">まだカテゴリがありません。</li>}
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-1.5 rounded-xl border border-slate-200 p-2 dark:border-zinc-700">
                <label htmlFor={`cat-${c.id}`} className="sr-only">
                  {c.name}の名前
                </label>
                <input
                  id={`cat-${c.id}`}
                  value={drafts[c.id] ?? c.name}
                  maxLength={30}
                  disabled={busy}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                  onBlur={() => rename(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-base font-medium focus:border-slate-300 focus:outline-none dark:focus:border-zinc-600"
                />
                <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">{counts[c.id] ?? 0}件</span>
                <button type="button" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label={`${c.name}を上へ`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-zinc-800">
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={busy || i === categories.length - 1} aria-label={`${c.name}を下へ`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-zinc-800">
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setToDelete(c)} disabled={busy} aria-label={`${c.name}を削除`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 dark:text-red-400 dark:hover:bg-red-950/40">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          {busy && <Loader2 className="mx-auto mt-3 h-5 w-5 animate-spin text-slate-400" aria-label="保存中" />}
        </div>
      )}
      <ConfirmDialog
        open={!!toDelete}
        title={`「${toDelete?.name ?? ""}」を削除しますか？`}
        confirmLabel="削除する"
        busy={busy}
        onConfirm={() => toDelete && remove(toDelete)}
        onCancel={() => setToDelete(null)}
      >
        このカテゴリのグッズ{toDelete ? `（${counts[toDelete.id] ?? 0}件）` : ""}は削除されず、「未分類」になります。
      </ConfirmDialog>
    </dialog>
  );
}
