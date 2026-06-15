import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResultPageContent } from "@/components/subsidy/ResultPageContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

// 派生ステータス（締切自動判定）を定期的に再計算するためISR化（1時間）
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "診断結果｜補助金・助成金マッチング診断",
  description: "あなたの事業内容・地域・目的から、対象になる可能性のある補助金・助成金の診断結果を表示しています。",
  alternates: { canonical: `${SITE_URL}/subsidy/result` },
  robots: { index: false },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-5 sm:py-6">
        <div className="container-base max-w-3xl">
          <nav aria-label="パンくずリスト" className="flex items-center gap-1.5 text-[11px] text-blue-400 mb-2">
            <Link href="/" className="hover:text-white transition-colors">ToolBoxJP</Link>
            <span>/</span>
            <Link href="/subsidy" className="hover:text-white transition-colors">補助金診断</Link>
            <span>/</span>
            <span className="text-blue-200">診断結果</span>
          </nav>
          <h1 className="text-lg sm:text-xl font-bold">あなたへの診断結果</h1>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="container-base max-w-3xl py-16 text-center">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">診断中...</p>
          </div>
        }
      >
        <ResultPageContent encoded={params["d"] ?? ""} />
      </Suspense>
      {/* スマホ底部余白（sticky CTAの下に隠れないように） */}
      <div className="h-20 sm:hidden" />
    </>
  );
}
