"use client";
// 退会（アカウント削除）
//   * 自分だけが使っているイベント → グッズ・画像ごと削除
//   * 他の人が自分の管理に追加しているイベント → その人たちのために、作成者情報を消した読み取り専用リストとして残す
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { clearGoodsCache } from "@/lib/goods/cache/idb";
import { btn, card, field } from "@/lib/goods/ui";

const CONFIRM_WORD = "削除";

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (word !== CONFIRM_WORD) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/mochico/account/delete", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !body.ok) throw new Error();
      await clearGoodsCache();
      window.location.replace("/mochico/login?deleted=1");
    } catch {
      setBusy(false);
      setError("削除できませんでした。通信状況を確認して、もう一度お試しください。");
    }
  }

  return (
    <section className={`${card} mt-10 border-red-200 p-5 dark:border-red-900/60`}>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">アカウントを削除</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <li>メールアドレス・表示名・あなたの取得状況は削除されます。</li>
        <li>あなただけが使っているイベントは、グッズ・画像ごと削除されます。</li>
        <li>
          共有して<strong className="text-slate-800 dark:text-slate-200">他の人が自分の管理に追加しているイベント</strong>は、その人たちが使い続けられるよう、作成者の情報を消した「読み取り専用のリスト」として残ります。共有リンクは停止されます。
        </li>
        <li>この操作は取り消せません。</li>
      </ul>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={`${btn.danger} mt-4`}>
          アカウントを削除する
        </button>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label htmlFor="delete-confirm" className={field.label}>
            確認のため「{CONFIRM_WORD}」と入力してください
          </label>
          <input id="delete-confirm" value={word} onChange={(e) => setWord(e.target.value)} className={field.input} autoComplete="off" />
          {error && (
            <p role="alert" className={field.error}>
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button type="button" onClick={() => setOpen(false)} disabled={busy} className={btn.secondary}>
              やめる
            </button>
            <button
              type="submit"
              disabled={busy || word !== CONFIRM_WORD}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              アカウントを完全に削除
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
