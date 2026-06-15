import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SUBSIDIES, PURPOSE_GROUPS, STATUS_CONFIG, DIFFICULTY_CONFIG,
  getSubsidiesByPurpose, type Purpose,
} from "@/data/subsidies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

// 派生ステータス（締切自動判定）を定期的に再計算するためISR化（1時間）
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "目的別 補助金・助成金一覧｜IT導入・採用・賃上げなど",
  description: "IT導入・販路開拓・設備投資・採用・賃上げ・研修・事業承継など、目的別に使える補助金・助成金を確認できます。",
  keywords: "目的別 補助金, IT導入補助金, 採用 助成金, 賃上げ 助成金, 販路開拓 補助金",
  alternates: { canonical: `${SITE_URL}/subsidy/purpose` },
  openGraph: { title: "目的別 補助金・助成金一覧", description: "目的別に補助金・助成金を探せます。", url: `${SITE_URL}/subsidy/purpose`, type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ToolBoxJP", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "補助金・助成金診断", item: `${SITE_URL}/subsidy` },
    { "@type": "ListItem", position: 3, name: "目的別一覧", item: `${SITE_URL}/subsidy/purpose` },
  ],
};

const PURPOSE_EMOJI: Record<Purpose, string> = {
  "ホームページ制作": "🌐", "広告・販路開拓": "📣", "店舗改装": "🏪",
  "設備投資": "🏭", "IT導入": "💻", "AI導入": "🤖", "省力化": "⚙️",
  "採用": "👥", "賃上げ": "📈", "研修": "📚",
  "事業承継": "🤝", "新規事業": "🚀", "海外展開": "🌏", "研究開発": "🔬",
};

export default async function PurposePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const selectedPurpose = (params["p"] ?? "") as Purpose | "";
  const filteredSubsidies = selectedPurpose ? getSubsidiesByPurpose(selectedPurpose) : SUBSIDIES;

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
            <span className="text-blue-200">目的別一覧</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">目的別 補助金・助成金一覧</h1>
          <p className="text-blue-100 text-[13px]">やりたいことを選んで、対象になる可能性のある制度を確認できます</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
        <div className="container-base max-w-4xl py-2.5 text-[12px] text-amber-800 dark:text-amber-300">
          ⚠️ 掲載情報は参考情報です。申請前に必ず公式公募要領または専門家へご確認ください。
        </div>
      </div>

      <main className="container-base max-w-4xl py-8 sm:py-10">
        {/* 目的セレクター */}
        <section className="mb-8">
          <h2 className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-4">目的を選ぶ</h2>
          <div className="space-y-4">
            {PURPOSE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.purposes.map((p) => (
                    <Link
                      key={p}
                      href={`/subsidy/purpose?p=${encodeURIComponent(p)}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                        selectedPurpose === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      <span>{PURPOSE_EMOJI[p]}</span>{p}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {selectedPurpose && (
              <Link href="/subsidy/purpose" className="inline-block text-[12px] text-slate-400 hover:text-slate-600 underline mt-1">
                選択を解除
              </Link>
            )}
          </div>
        </section>

        {/* 結果 */}
        <section>
          <h2 className="text-[18px] font-bold text-slate-900 mb-5">
            {selectedPurpose
              ? <><span className="mr-1">{PURPOSE_EMOJI[selectedPurpose]}</span>「{selectedPurpose}」に使える可能性のある制度</>
              : "全制度一覧"
            }
            <span className="ml-2 text-[14px] font-normal text-slate-400">（{filteredSubsidies.length}件）</span>
          </h2>

          {filteredSubsidies.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="mb-2">条件に合う制度が見つかりませんでした。</p>
              <Link href="/subsidy/purpose" className="text-blue-600 text-[13px] hover:underline">絞り込みを解除</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubsidies.map((s) => {
                const stCfg = STATUS_CONFIG[s.status];
                const diffCfg = DIFFICULTY_CONFIG[s.difficulty];
                return (
                  <article key={s.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 sm:p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${stCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} ${s.status === "受付中" || s.status === "随時受付" ? "animate-pulse" : ""}`} />
                            {stCfg.label}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.category === "補助金" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"}`}>
                            {s.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[15px] mb-1">{s.name}</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{s.description}</p>

                        {/* 対象目的タグ */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {s.targetPurposes.map((p) => (
                            <span key={p} className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              p === selectedPurpose
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                                : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400"
                            }`}>
                              {PURPOSE_EMOJI[p]} {p}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 text-[12px] mb-3">
                          <span><span className="text-slate-400 dark:text-zinc-500">上限 </span><span className="font-bold text-slate-700 dark:text-slate-300">{s.maxSubsidy.replace("最大","")}</span></span>
                          <span><span className="text-slate-400 dark:text-zinc-500">補助率 </span><span className="font-bold text-slate-700 dark:text-slate-300">{s.subsidyRate}</span></span>
                          <span className={`font-medium ${diffCfg.color}`}>{diffCfg.label}</span>
                          <span><span className="text-slate-400 dark:text-zinc-500">対象 </span><span className="font-bold text-slate-700 dark:text-slate-300">{s.targetBusinessTypes.join("・")}</span></span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-indigo-500 dark:text-indigo-400">📋 {s.sourceLabel}</span>
                          <Link href={s.officialUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            <ExternalLink className="w-3 h-3" />公式サイト
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 text-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">さらに絞り込んで診断する</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">地域・業種・従業員数などを加味した精度の高いマッチング診断</p>
          <Link href="/subsidy" className="btn-primary text-[13px]">無料診断をはじめる</Link>
        </div>
      </main>
      <div className="h-20 sm:hidden" />
    </>
  );
}
