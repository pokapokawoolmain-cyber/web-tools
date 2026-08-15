import type { Metadata } from "next";
import Link from "next/link";
import { DiagnosisForm } from "@/components/subsidy/DiagnosisForm";
import { SUBSIDIES, STATUS_CONFIG, getDaysUntilDeadline, getDeadlineColor } from "@/data/subsidies";
import { ArrowRight, ShieldCheck, FileText, MapPin, Target, Clock, ExternalLink, Newspaper } from "lucide-react";
import { getLatestNews } from "@/data/subsidyNews";
import { NewsCard } from "@/components/subsidy/NewsCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

// 派生ステータス（締切自動判定）を定期的に再計算するためISR化（1時間）
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "補助金・助成金診断｜個人・家庭〜中小企業向けマッチングツール【無料】",
  description:
    "中小企業・個人事業主に加え、個人・家庭が使える給付金・補助金（教育訓練給付・住宅省エネ・育児休業給付・EV購入補助など）も無料診断。事業内容・地域・目的から使える可能性のある制度を確認できます。登録不要・約2分・スマホ対応。",
  keywords: "補助金診断, 助成金診断, 補助金マッチング, 個人 補助金, 個人事業主 補助金, 中小企業 助成金, 教育訓練給付金, 住宅省エネ 補助金, IT導入補助金, 持続化補助金, 無料",
  alternates: { canonical: `${SITE_URL}/subsidy` },
  openGraph: {
    title: "補助金・助成金診断｜個人事業主・中小企業向けマッチングツール",
    description: "事業形態・地域・目的から使える可能性のある補助金・助成金を無料診断。登録不要・約2分・スマホ対応。",
    url: `${SITE_URL}/subsidy`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?${new URLSearchParams({ title: "補助金・助成金診断ツール", icon: "🏛️", desc: "個人事業主・中小企業向け。事業内容・地域・目的から無料マッチング診断。" }).toString()}`,
        width: 1200, height: 630, alt: "補助金・助成金診断ツール",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

const FAQ_ITEMS = [
  { q: "診断は無料ですか？", a: "はい、完全無料でご利用いただけます。登録・ログインも不要です。" },
  { q: "診断結果は申請を保証するものですか？", a: "いいえ。当サイトの診断は参考情報であり、申請可否を保証するものではありません。最終的な申請可否は公式公募要領または専門家（中小企業診断士・社会保険労務士等）にご確認ください。" },
  { q: "補助金と助成金の違いは何ですか？", a: "補助金は主に国・自治体が公募し、採択されれば支給される資金です。助成金は主に厚生労働省管轄で、一定の要件を満たせば原則支給されます。補助金は競争性があり採択率が存在します。" },
  { q: "個人事業主でも使える補助金はありますか？", a: "はい。小規模事業者持続化補助金・IT導入補助金・業務改善助成金など、個人事業主が対象となる制度は多数あります。診断ツールでご確認ください。" },
  { q: "会社を経営していない個人・家庭でも使える制度はありますか？", a: "あります。診断の最初で「個人・家庭」を選ぶと、教育訓練給付金（資格取得）・住宅の省エネリフォーム補助・育児休業給付金・高年齢雇用継続給付・電動車（EV等）購入補助・自治体の住宅リフォーム補助など、働く個人や家庭が使える給付金・補助金を確認できます。金額や要件は年度・自治体で変わるため、必ず公式サイトで最新をご確認ください。" },
  { q: "申請はどこで行えますか？", a: "補助金ごとに申請先が異なります。持続化補助金は商工会・商工会議所経由、IT導入補助金はITベンダーと共同申請、助成金は労働局・ハローワーク経由が基本です。各補助金の公式サイトをご確認ください。" },
  { q: "gBizIDとは何ですか？", a: "法人・個人事業主向けの共通認証システムです。IT導入補助金・省力化補助金など多くの補助金の申請に必要です。取得には1〜2週間程度かかるため、早めの準備をお勧めします。" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/subsidy`,
      name: "補助金・助成金診断ツール",
      description: "個人事業主・中小企業向けに補助金・助成金を無料診断。登録不要・スマホ対応。",
      url: `${SITE_URL}/subsidy`,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ToolBoxJP", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "補助金・助成金診断", item: `${SITE_URL}/subsidy` },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function SubsidyPage() {
  const latestNews = getLatestNews(3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-14 sm:pt-16 sm:pb-20">
        <div className="container-base max-w-4xl">
          {/* パンくずリスト */}
          <nav aria-label="パンくずリスト" className="flex items-center gap-1.5 text-[11px] text-blue-400 mb-5">
            <Link href="/" className="hover:text-white transition-colors">ToolBoxJP</Link>
            <span>/</span>
            <span className="text-blue-200">補助金・助成金診断</span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
              🏛️ ToolBoxJP
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            補助金・助成金<br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">診断ツール</span>
          </h1>
          <p className="text-blue-100 text-[15px] sm:text-base leading-relaxed mb-6 max-w-2xl">
            中小企業・個人事業主に加え、個人・家庭が使える給付金・補助金も無料で診断。
            事業内容や暮らしの目的から数問でマッチング。
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-blue-200">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />公式情報に基づく</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />約2分で完了</span>
            <span>📱 スマホ対応</span>
            <span>🆓 無料・登録不要</span>
          </div>
        </div>
      </section>

      {/* ─── 免責バナー ───────────────────────────────── */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
        <div className="container-base max-w-4xl py-2.5 flex items-start gap-2 text-[12px] text-amber-800 dark:text-amber-300">
          <span className="flex-shrink-0">⚠️</span>
          <p>
            当ツールの診断結果は参考情報です。申請可否は必ず
            <strong>公式公募要領または専門家（中小企業診断士・社会保険労務士等）</strong>
            にご確認ください。
          </p>
        </div>
      </div>

      {/* ─── メインコンテンツ ─────────────────────────── */}
      <main id="main" className="container-base max-w-4xl py-8 sm:py-12">
        <div className="grid lg:grid-cols-[1fr_260px] gap-8 items-start">

          {/* フォームエリア */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">あなたに合う補助金・助成金を無料診断</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] mb-5">質問に答えるだけ。中小企業・個人事業主・個人/家庭に対応。</p>
            <DiagnosisForm />
          </div>

          {/* サイドバー */}
          <aside className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 shadow-sm">
              <p className="text-[12px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-3">一覧から探す</p>
              <div className="space-y-2">
                {[
                  { href: "/subsidy/list", icon: <FileText className="w-3.5 h-3.5" />, label: "補助金・助成金一覧" },
                  { href: "/subsidy/area", icon: <MapPin className="w-3.5 h-3.5" />, label: "地域別一覧" },
                  { href: "/subsidy/purpose", icon: <Target className="w-3.5 h-3.5" />, label: "目的別一覧" },
                  { href: "/subsidy/news", icon: <Newspaper className="w-3.5 h-3.5" />, label: "最新情報" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1.5">
                    <span className="text-slate-400 dark:text-zinc-500">{item.icon}</span>
                    {item.label}
                    <ArrowRight className="w-3 h-3 ml-auto text-slate-300 dark:text-zinc-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">掲載制度</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">補助金</span>
                  <span className="font-bold text-white">{SUBSIDIES.filter((s) => s.category === "補助金").length}件</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">助成金</span>
                  <span className="font-bold text-white">{SUBSIDIES.filter((s) => s.category === "助成金").length}件</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">※ 公式情報に基づき随時更新</p>
            </div>
          </aside>
        </div>

        {/* ─── 受付中の補助金 ───────────────────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">最新の公募情報</h2>
          <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-5">現在受付中・随時受付の制度を表示しています</p>
          <div className="space-y-3">
            {SUBSIDIES.filter((s) => s.status !== "終了").map((s) => {
              const days = getDaysUntilDeadline(s.deadlineDate);
              const dlColor = getDeadlineColor(days);
              const stCfg = STATUS_CONFIG[s.status];
              return (
                <div key={s.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${stCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />{stCfg.label}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.category === "補助金" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"}`}>
                        {s.category}
                      </span>
                    </div>
                    <p className="font-bold text-[13px] text-slate-800 dark:text-slate-200 truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{s.deadline}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {days !== null && (
                      <p className={`text-[11px] font-bold ${dlColor.split(" ")[0]}`}>
                        {days <= 0 ? "締切超過" : `残${days}日`}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">上限 {s.maxSubsidy.replace("最大", "")}</p>
                  </div>
                </div>
              );
            })}
            <Link href="/subsidy/list" className="flex items-center justify-center gap-2 py-3 text-blue-600 text-[13px] font-medium hover:text-blue-800 transition-colors">
              全件を見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ─── 目的別 ───────────────────────────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">目的別に探せる補助金一覧</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "IT・AI導入", href: "/subsidy/purpose?p=IT導入", emoji: "💻" },
              { label: "販路開拓", href: "/subsidy/purpose?p=広告・販路開拓", emoji: "📣" },
              { label: "設備投資", href: "/subsidy/purpose?p=設備投資", emoji: "🏭" },
              { label: "採用・人材", href: "/subsidy/purpose?p=採用", emoji: "👥" },
              { label: "賃上げ", href: "/subsidy/purpose?p=賃上げ", emoji: "📈" },
              { label: "研修", href: "/subsidy/purpose?p=研修", emoji: "📚" },
              { label: "事業承継", href: "/subsidy/purpose?p=事業承継", emoji: "🤝" },
              { label: "新規事業", href: "/subsidy/purpose?p=新規事業", emoji: "🚀" },
            ].map((item) => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <span>{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 個人事業主・中小企業に対応 ──────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">個人事業主・中小企業に対応</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🏪", title: "個人事業主", desc: "持続化補助金・IT導入補助金など個人事業主でも申請できる制度が多数あります" },
              { icon: "🏢", title: "中小企業", desc: "設備投資・人材育成・省力化など幅広い目的に対応した補助金・助成金があります" },
              { icon: "🌱", title: "創業予定", desc: "創業支援補助金など、起業前後に使える制度も診断できます" },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 申請前の注意点 ───────────────────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-4">申請前に確認すべき注意点</h2>
          <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-2xl p-5 sm:p-6 space-y-3 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {[
              "補助金・助成金は<strong>申請前に交付決定を受けることが原則</strong>です。発注・購入後の申請は対象外になる場合があります。",
              "申請には<strong>gBizID（共通認証システム）</strong>が必要な制度が多数あります。取得に1〜2週間かかるため早めに準備しましょう。",
              "補助金は採択されても<strong>実績報告・精算払いが基本</strong>です。先払いが必要なため、資金繰りに注意してください。",
              "当サイトの診断結果は<strong>参考情報</strong>です。申請可否は必ず公式公募要領または専門家へご確認ください。",
            ].map((text, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: `✅ ${text}` }} />
            ))}
          </div>
        </section>

        {/* ─── 最新ニュース ─────────────────────────── */}
        {latestNews.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-500" />
                補助金・助成金 最新情報
              </h2>
              <Link href="/subsidy/news" className="text-[12px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                すべて見る <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {latestNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/subsidy/news" className="inline-flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-800 font-medium transition-colors">
                最新情報を全件見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* ─── FAQ ──────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">よくある質問</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl p-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-[14px]">Q. {item.q}</h3>
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 公式リンク集 ─────────────────────────── */}
        <section className="mt-14">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">公式サイトリンク集</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SUBSIDIES.map((s) => (
              <Link
                key={s.id}
                href={s.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all group"
              >
                <span className="text-xl flex-shrink-0">{s.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate">{s.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{s.sourceLabel}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Sticky CTA（モバイル専用） ───────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 px-4 py-3 safe-bottom">
        <Link
          href="#main"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[14px] font-bold rounded-xl py-3.5 transition-all shadow-md"
        >
          🏛️ 今すぐ無料診断する
        </Link>
      </div>
    </>
  );
}
