"use client";
// 画面下部のトースト（Undo 付き）。スクリーンリーダーには aria-live で読み上げる。
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

interface ToastData {
  id: number;
  message: string;
  tone: "default" | "error";
  action?: { label: string; onClick: () => void };
  duration: number;
}

interface ToastApi {
  show: (message: string, opts?: { tone?: "default" | "error"; action?: ToastData["action"]; duration?: number }) => void;
  dismiss: () => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used within ToastProvider");
  return v;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback<ToastApi["show"]>((message, opts) => {
    if (timer.current) clearTimeout(timer.current);
    seq.current += 1;
    setToast({
      id: seq.current,
      message,
      tone: opts?.tone ?? "default",
      action: opts?.action,
      duration: opts?.duration ?? (opts?.action ? 6000 : 3500),
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    timer.current = setTimeout(() => setToast(null), toast.duration);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast]);

  return (
    <Ctx.Provider value={{ show, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {toast && (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-md goods-slide-up items-center gap-2 rounded-2xl py-2 pl-4 pr-2 text-sm shadow-xl ${
              toast.tone === "error" ? "bg-red-700 text-white" : "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            }`}
          >
            <span className="flex-1 py-1.5">{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action!.onClick();
                  dismiss();
                }}
                className="min-h-10 shrink-0 rounded-xl px-3 font-bold text-pink-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:text-pink-700 dark:hover:bg-black/5"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="閉じる"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl opacity-70 hover:bg-white/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:hover:bg-black/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
