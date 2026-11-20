"use client";
import { useState } from "react";

// 規約への同意のチェックを入れるまで、支払い画面へ進めないようにする。
// 「支払い画面へ進む」を押すと、サーバーで同意を確かめてから Stripe の支払い画面を作る（固定の支払いリンクは使わない）。
export function PurchaseConsent({ action, termsVersion }: { action: string; termsVersion: string }) {
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <form method="post" action={action} onSubmit={() => setSending(true)} className="rounded-xl border border-slate-300 p-5 space-y-4">
      <input type="hidden" name="terms_version" value={termsVersion} />
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          value="agree"
          className="mt-1 h-5 w-5"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          <a href="/sns-starter-kit/terms" target="_blank" rel="noopener" className="underline underline-offset-2">販売利用規約・使用許諾条件</a>
          と
          <a href="/sns-starter-kit/tokushoho" target="_blank" rel="noopener" className="underline underline-offset-2">特定商取引法に基づく表記</a>
          を確認し、上の内容（返品・返金の条件を含みます）に同意します。
        </span>
      </label>
      <button
        type="submit"
        disabled={!agreed || sending}
        className="block w-full rounded-lg bg-slate-900 px-5 py-4 text-center text-base font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {sending ? "支払い画面を準備しています…" : "49,800円（税込）の支払い画面へ進む"}
      </button>
      <p className="text-sm text-slate-600">次の Stripe の画面でメールアドレスとカード情報を入力し、「支払う」を押すと購入が確定します。</p>
    </form>
  );
}
