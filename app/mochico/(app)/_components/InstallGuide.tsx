"use client";
// ============================================================
// ホーム画面への追加方法（端末・ブラウザ別の短い手順）
//   iPhone は Web サイトから自動追加できないため、Safari 等の「標準の操作」を最大3ステップで案内する。
//   図はあくまで説明用（押せるボタンではない）。実際の操作はブラウザの画面で行う。
// ============================================================
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import type { Platform } from "@/lib/goods/pwa";
import { GOODS_APP_SHORT_NAME } from "@/lib/goods/app-meta";
import { btn } from "@/lib/goods/ui";

/** iOS の共有アイコン（□＋↑）の説明用の図。ボタンではない */
function ShareGlyph() {
  return (
    <span className="mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 align-middle dark:border-zinc-600" aria-label="共有のマーク">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="M8 7l4-4 4 4" />
        <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
      </svg>
    </span>
  );
}
function MoreGlyph() {
  return (
    <span className="mx-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-300 px-1 align-middle text-sm font-bold leading-none dark:border-zinc-600" aria-label="「…」のマーク">
      …
    </span>
  );
}
function MenuGlyph() {
  return (
    <span className="mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 align-middle text-sm font-bold leading-none dark:border-zinc-600" aria-label="「︙」のマーク">
      ︙
    </span>
  );
}

function Steps({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white" aria-hidden="true">
            {i + 1}
          </span>
          <p className="pt-0.5 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
            <span className="sr-only">手順{i + 1}: </span>
            {s}
          </p>
        </li>
      ))}
    </ol>
  );
}

export type GuideVariant = "ios-safari" | "ios-other" | "ios-inapp" | "android-menu" | "android-inapp" | "desktop";

export function guideVariantFor(p: Platform): GuideVariant {
  if (p.os === "ios") return p.browser === "safari" ? "ios-safari" : p.browser === "inapp" ? "ios-inapp" : "ios-other";
  if (p.os === "android") return p.browser === "inapp" ? "android-inapp" : "android-menu";
  return "desktop";
}

function GuideBody({ variant }: { variant: GuideVariant }) {
  switch (variant) {
    case "ios-safari":
      return (
        <>
          <Steps
            steps={[
              <>
                画面の <MoreGlyph /> をタップして「共有」を選びます（<ShareGlyph /> が見えている場合はそれをタップ）
              </>,
              <>出てきた一覧を下にスクロールして「ホーム画面に追加」をタップ</>,
              <>「Webアプリとして開く」がある場合はオンのまま、右上の「追加」をタップ</>,
            ]}
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">ホーム画面に「{GOODS_APP_SHORT_NAME}」のアイコンが追加されます。次回からはアイコンをタップするだけで開けます。</p>
        </>
      );
    case "ios-other":
      return (
        <>
          <Steps
            steps={[
              <>
                アドレスバーの右側などにある <ShareGlyph /> 共有ボタンをタップ（見つからない場合は <MoreGlyph /> などのメニューから「共有」）
              </>,
              <>「ホーム画面に追加」をタップ</>,
              <>右上の「追加」をタップ</>,
            ]}
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            「ホーム画面に追加」が見つからない場合は、このページを <strong>Safari</strong> で開くと追加できます。
          </p>
        </>
      );
    case "ios-inapp":
    case "android-inapp":
      return (
        <>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
            いまは LINE などのアプリの中で開いているため、ホーム画面に追加できません。
          </p>
          <Steps
            steps={[
              <>画面の右上（または右下）のメニューをタップ</>,
              <>{variant === "ios-inapp" ? "「Safariで開く」（または「ブラウザで開く」）" : "「ブラウザで開く」（「Chromeで開く」など）"}を選ぶ</>,
              <>開いたページで、もう一度「ホーム画面に追加」を押す</>,
            ]}
          />
        </>
      );
    case "android-menu":
      return (
        <Steps
          steps={[
            <>
              ブラウザの右上の <MenuGlyph /> メニューをタップ
            </>,
            <>「ホーム画面に追加」または「アプリをインストール」をタップ</>,
            <>確認画面で「インストール」（または「追加」）をタップ</>,
          ]}
        />
      );
    default:
      return (
        <p className="mt-4 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
          ホーム画面への追加は、スマートフォンで使うときに便利な機能です。スマートフォンでこのページを開き、「設定」の「ホーム画面への追加方法」をご覧ください。
        </p>
      );
  }
}

export function InstallGuideDialog({ open, variant, onClose }: { open: boolean; variant: GuideVariant; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="install-guide-title"
      className="goods-sheet mb-0 mt-auto w-full max-w-lg rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl sm:m-auto sm:rounded-3xl dark:bg-zinc-900 dark:text-slate-100"
    >
      {open && (
        <div className="goods-slide-up p-5" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
          <div className="flex items-start justify-between gap-3">
            <h2 id="install-guide-title" className="text-lg font-bold">
              ホーム画面に追加する方法
            </h2>
            <button type="button" onClick={onClose} aria-label="閉じる" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {variant !== "desktop" && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">この画面を閉じてから、ブラウザの画面で操作してください。</p>
          )}
          <GuideBody variant={variant} />
          <button type="button" onClick={onClose} className={`${btn.primary} mt-6 w-full`}>
            わかりました
          </button>
        </div>
      )}
    </dialog>
  );
}
