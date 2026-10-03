// Empty / Error / Unauthorized / 404 / Share expired などの状態表示（共通の見た目）
import Link from "next/link";
import type { ReactNode } from "react";
import { btn } from "@/lib/goods/ui";

interface Props {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
  secondary?: { href: string; label: string };
  tone?: "neutral" | "warning" | "danger";
  /** キャラクターなど、色付きの枠なしで出すアイコン */
  plainIcon?: boolean;
}

export function StateMessage({ icon, title, children, action, secondary, tone = "neutral", plainIcon = false }: Props) {
  const ring =
    tone === "danger"
      ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
        : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
      <div className={plainIcon ? "mb-4 flex items-center justify-center" : `mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${ring}`} aria-hidden="true">
        {icon}
      </div>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
      {children && <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>}
      {(action || secondary) && (
        <div className="mt-7 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          {action && (
            <Link href={action.href} className={btn.primary}>
              {action.label}
            </Link>
          )}
          {secondary && (
            <Link href={secondary.href} className={btn.secondary}>
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
