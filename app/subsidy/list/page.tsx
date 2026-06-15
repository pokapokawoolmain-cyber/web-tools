import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SUBSIDIES, STATUS_CONFIG, DIFFICULTY_CONFIG,
  getDaysUntilDeadline, getDeadlineColor,
} from "@/data/subsidies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

// 派生ステータス（締切自動判定）を定期的に再計算するためISR化（1時間）
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "補助金・助成金一覧｜最新の公募情報【2025年度】",
  description: "個人事業主・中小企業向けの最新補助金・助成金一覧。小規模事業者持続化補助金・IT導入補助金・業務改善助成金など、補助率・締切・難易度を一覧で確認できます。",
  keywords: "補助金一覧 2025, 助成金一覧, 持続化補助金, IT導入補助金, 業務改善助成金, キャリアアップ助成金",
  alternates: { canonical: `${SITE_URL}/subsidy/list` },
  openGraph: {
    title: "補助金・助成金一覧｜最新の公募情報",
    description: "個人事業主・中小企業向けの補助金・助成金を一覧で確認。",
    url: `${SITE_URL}/subsidy/list`, type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ToolBoxJP", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "補助金・助成金診断", item: `${SITE_URL}/subsidy` },
    { "@type": "ListItem", position: 3, name: "一覧", item: `${SITE_URL}/subsidy/list` },
  ],
};

function SubsidyCard({ s }: { s: typeof SUBSIDIES[0] }) {
  const days = getDaysUntilDeadline(s.deadlineDate);
  const dlColor = getDeadlineColor(days);
  const stCfg = STATUS_CONFIG[s.status];
  const diffCfg = DIFFICULTY_CONFIG[s.difficulty];

  const statusBarCls = stCfg.color.includes("emerald")
    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50"
    : stCfg.color.includes("blue")
    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50"
    : stCfg.color.includes("amber")
    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50"
    : "bg-slate-50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-800";

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden shadow-sm hover:shadow transition-shadow">
      {/* ステータスバー */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${statusBarCls}`}>
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${stCfg.color.split(" ")[0]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} ${s.status === "受付中" || s.status === "随時受付" ? "animate-pulse" : ""}`} />
          {stCfg.label}
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          {days !== null && (
            <span className={`font-bold ${dlColor.split(" ")[0]}`}>
              {days <= 0 ? "締切超過" : `締切まで残${days}日`}
            </span>
          )}
          <span className={`font-medium ${diffCfg.color}`}>{diffCfg.label}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl flex-shrink-0">{s.emoji}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.category === "補助金" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"}`}>
                {s.category}
              </span>
              {s.targetBusinessTypes.map((t) => (
                <span key={t} className="text-[11px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[16px] mb-1">{s.name}</h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.description}</p>
          </div>
        </div>

        {/* 数値グリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: "補助上限", value: s.maxSubsidy.replace("最大", "") },
            { label: "補助率", value: s.subsidyRate },
            { label: "準備期間目安", value: s.preparationWeeks },
            { label: "採択率目安", value: s.adoptionRateNote },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-2.5">
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mb-0.5">{item.label}</p>
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 用途タグ */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {s.usagePurposes.map((p) => (
            <span key={p} className="text-[11px] border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{p}</span>
          ))}
        </div>

        {/* 参照元 + 公式リンク */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <span className="text-[11px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
            📋 {s.sourceLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">最終確認: {s.updatedAt}</span>
            <Link
              href={s.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />公式サイト
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SubsidyListPage() {
  const subsidies = SUBSIDIES.filter((s) => s.category === "補助金");
  const grants = SUBSIDIES.filter((s) => s.category === "助成金");
  const active = SUBSIDIES.filter((s) => s.status === "受付中" || s.status === "随時受付");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-10">
        <div className="container-base max-w-4xl">
          <nav aria-label="パンくずリスト" className="flex items-center gap-1.5 text-[11px] text-blue-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">ToolBoxJP</Link>
            <span>/</span>
            <Link href="/subsidy" className="hover:text-white transition-colors">補助金診断</Link>
            <span>/</span>
            <span className="text-blue-200">一覧</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">補助金・助成金一覧</h1>
          <p className="text-blue-100 text-[13px]">個人事業主・中小企業向けの主要制度をまとめています</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
        <div className="container-base max-w-4xl py-2.5 text-[12px] text-amber-800 dark:text-amber-300">
          ⚠️ 掲載情報は参考情報です。申請前に必ず公式公募要領または専門家へご確認ください。
        </div>
      </div>

      <main className="container-base max-w-4xl py-8 sm:py-10">
        {/* 受付中サマリー */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">現在{active.length}件が受付中・随時受付</span>
          </div>
          <Link href="/subsidy" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all min-h-[40px]">
            🔍 診断ツールで絞り込む
          </Link>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 bg-blue-500 rounded-full" />
            <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">補助金（{subsidies.length}件）</h2>
          </div>
          <div className="space-y-4">
            {subsidies.map((s) => <SubsidyCard key={s.id} s={s} />)}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">助成金（{grants.length}件）</h2>
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-500 mb-4">助成金は要件を満たせば原則支給されます（競争による採択なし）</p>
          <div className="space-y-4">
            {grants.map((s) => <SubsidyCard key={s.id} s={s} />)}
          </div>
        </section>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 text-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">あなたに合う補助金を診断する</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">事業内容・地域・目的から8問で無料マッチング</p>
          <Link href="/subsidy" className="btn-primary text-[13px]">無料診断をはじめる</Link>
        </div>
      </main>

      <div className="h-20 sm:hidden" />
    </>
  );
}
