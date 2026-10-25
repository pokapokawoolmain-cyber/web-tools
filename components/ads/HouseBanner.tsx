"use client";
// ============================================================
// 自社サービス（Mochico）のバナー。広告欄の上に、広告と同じ幅・高さ（120px）で表示する
//
// 方針:
//  - 自社サービスなので「広告」ではなく「ToolBoxJPのアプリ」と明示する（Google 広告と誤認させない）
//  - 広告ユニットとの間は十分に離す（誤タップ防止。AdSense の誤クリック誘発の禁止に配慮）
//  - クリック元を計測できるよう UTM を付ける（utm_content = 表示したページのパス）
//  - Mochico 自身のページには出さない
// ============================================================
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/mochico/Mascot";

export function HouseBanner({ className = "" }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/mochico")) return null;
  const href = `/mochico?utm_source=toolboxjp&utm_medium=house_banner&utm_campaign=mochico&utm_content=${encodeURIComponent(pathname)}`;
  return (
    <aside aria-label="ToolBoxJPのアプリ" className={`my-6 ${className}`} data-house-banner="mochico">
      <div className="mb-1 text-center text-[10px] tracking-wide text-slate-400 dark:text-zinc-500">ToolBoxJPのアプリ</div>
      <Link
        href={href}
        className="group relative flex h-[120px] items-center gap-3 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-pink-50 px-4 transition hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:gap-4 sm:px-5 dark:border-violet-900/60 dark:from-violet-950/50 dark:via-zinc-900 dark:to-pink-950/40"
      >
        <Mascot color="purple" state="happy" size={64} float={false} className="shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold text-violet-700 dark:text-violet-300">推し活のグッズ管理アプリ「Mochico」</span>
          <span className="mt-0.5 block text-[15px] font-extrabold leading-snug text-slate-900 sm:text-base dark:text-white">推しグッズを、見やすく管理・共有</span>
          <span className="mt-0.5 hidden text-xs text-slate-600 sm:block dark:text-slate-300">ライブのグッズを写真つきで一覧に。持ってるものはタップで記録（無料）</span>
          <span className="mt-1.5 inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white transition group-hover:bg-violet-700 sm:hidden">Mochicoを見てみる</span>
        </span>
        <span className="hidden shrink-0 items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-violet-700 sm:inline-flex">Mochicoを見てみる</span>
        {/* アプリの画面（広い画面だけ） */}
        <span aria-hidden="true" className="relative hidden h-[104px] w-[64px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element -- 小さな静的画像（LP と同じスクリーンショット） */}
          <img src="/mochico/shots/event.webp" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        </span>
      </Link>
    </aside>
  );
}
