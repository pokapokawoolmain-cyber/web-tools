"use client";
import { useId, useState } from "react";
import { Check, RotateCcw, Send } from "lucide-react";
import type { RevenueProduct } from "@/lib/analytics/events";
import { trackRevenueWaitlistSubmit } from "@/lib/analytics/track";
import {
  isWaitlistConfigured,
  WAITLIST_ENTRY_EMAIL,
  WAITLIST_ENTRY_PRODUCT,
  WAITLIST_FORM_URL,
} from "@/lib/revenue/waitlist-config";

type Status = "idle" | "loading" | "submitted" | "error";

export function WaitlistForm({ product, productName }: { product: RevenueProduct; productName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const configured = isWaitlistConfigured();
  const inputId = useId();

  const submit = async () => {
    if (!email || status === "loading") return;
    setStatus("loading");

    const formData = new FormData();
    formData.append(WAITLIST_ENTRY_EMAIL, email);
    formData.append(WAITLIST_ENTRY_PRODUCT, product);

    try {
      // no-corsのためHTTPステータス・バリデーション結果は読めない（Google Form送信の既知の制約、
      // app/contact/ContactFormと同じ）。ここで検知できるのはネットワークレベルの失敗のみ。
      await fetch(WAITLIST_FORM_URL, { method: "POST", mode: "no-cors", body: formData });
      trackRevenueWaitlistSubmit(product);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit();
  };

  if (status === "submitted") {
    return (
      <div role="status" className="flex items-center gap-2 text-[13.5px] text-emerald-700 dark:text-emerald-400">
        <Check className="w-4 h-4 flex-shrink-0" />
        <span>ご登録ありがとうございます。{productName}の準備ができ次第、メールでお知らせします。</span>
      </div>
    );
  }

  if (!configured) {
    // Google Form未設定の間はメール入力欄を出さない
    // （「送信したのにどこにも届かない」事故を防ぐための意図的な制限）。
    return (
      <p className="text-[13px] text-slate-400 dark:text-zinc-500">
        先行案内のご登録受付は準備中です。
      </p>
    );
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor={inputId} className="sr-only">メールアドレス</label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          disabled={status === "loading"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-zinc-700 text-white text-[13.5px] font-semibold transition-colors flex-shrink-0"
        >
          {status === "loading" ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
          ) : (
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          優先案内を受け取る
        </button>
      </form>
      <div role="status" aria-live="polite">
        {status === "error" && (
          <p className="flex items-center gap-2 text-[12.5px] text-red-600 dark:text-red-400 mt-2">
            送信に失敗しました。通信状況をご確認のうえ、もう一度お試しください。
            <button
              type="button"
              onClick={() => void submit()}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              再試行
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
