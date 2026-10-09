"use client";
// 削除など取り消せない操作だけに使う確認ダイアログ（<dialog> でフォーカス管理・Esc を標準対応）
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { btn } from "@/lib/goods/ui";

interface Props {
  open: boolean;
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, children, confirmLabel, busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  // 1画面に複数の確認ダイアログがあっても読み上げ名が混ざらないよう、見出しの id はダイアログごとに分ける
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      aria-labelledby={titleId}
      className="goods-sheet m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white p-0 text-slate-900 shadow-2xl dark:bg-zinc-900 dark:text-slate-100"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-base font-bold">
          {title}
        </h2>
        {children && <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={busy} className={btn.secondary} autoFocus>
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
