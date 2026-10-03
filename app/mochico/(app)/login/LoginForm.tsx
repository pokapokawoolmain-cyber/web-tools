"use client";
// メールの6桁コード（メール内リンクでも可）＋ Google ログイン。
// コード入力方式を主にしているのは、iOS のホーム画面から開いた場合に
// メールのリンクが別のブラウザで開き、ログインが引き継がれない問題を避けるため。
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { btn, field } from "@/lib/goods/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_WAIT = 60;

export function LoginForm({ next, googleEnabled }: { next: string; googleEnabled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  const callbackUrl = () => `${window.location.origin}/mochico/auth/callback?next=${encodeURIComponent(next)}`;

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const addr = email.trim();
    if (!EMAIL_RE.test(addr)) {
      setError("メールアドレスの形式を確認してください。");
      return;
    }
    setBusy(true);
    const { error: err } = await goodsBrowserClient().auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true, emailRedirectTo: callbackUrl() },
    });
    setBusy(false);
    if (err) {
      setError(
        err.status === 429
          ? "短時間に送信しすぎました。しばらく待ってからお試しください。"
          : "コードを送信できませんでした。通信環境を確認して、もう一度お試しください。"
      );
      return;
    }
    setStep("code");
    setCooldown(RESEND_WAIT);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const token = code.replace(/\D/g, "");
    if (token.length !== 6) {
      setError("6桁のコードを入力してください。");
      return;
    }
    setBusy(true);
    const { error: err } = await goodsBrowserClient().auth.verifyOtp({ email: email.trim(), token, type: "email" });
    if (err) {
      setBusy(false);
      setError("コードが正しくないか、期限切れです。もう一度お試しください。");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function google() {
    setError(null);
    setBusy(true);
    const { error: err } = await goodsBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    if (err) {
      setBusy(false);
      setError("Googleログインを開始できませんでした。メールでのログインをお試しください。");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {step === "email" ? (
        <form onSubmit={sendCode} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className={field.label}>
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field.input}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" disabled={busy} className={`${btn.primary} w-full`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Mail className="h-4 w-4" aria-hidden="true" />}
            ログインコードを送る
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="font-bold">{email}</span> に6桁のコードを送りました。メールに記載のリンクからもログインできます。
          </p>
          <div>
            <label htmlFor="code" className={field.label}>
              ログインコード
            </label>
            <input
              ref={codeRef}
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={`${field.input} text-center font-mono text-2xl tracking-[0.5em]`}
              placeholder="000000"
            />
          </div>
          <button type="submit" disabled={busy} className={`${btn.primary} w-full`}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            ログイン
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <button type="button" onClick={() => setStep("email")} className={btn.ghost}>
              メールアドレスを変更
            </button>
            <button type="button" disabled={cooldown > 0 || busy} onClick={() => sendCode()} className={`${btn.ghost} disabled:opacity-50`}>
              {cooldown > 0 ? `再送信（${cooldown}秒）` : "コードを再送信"}
            </button>
          </div>
        </form>
      )}

      {googleEnabled && step === "email" && (
        <>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400" aria-hidden="true">
            <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
            または
            <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
          </div>
          <button type="button" onClick={google} disabled={busy} className={`${btn.secondary} w-full`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Googleでログイン
          </button>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        ログインすると、メールアドレスと登録したイベント・グッズ・取得状況が保存されます。取得状況はあなた本人以外には表示されません。
      </p>
    </div>
  );
}
