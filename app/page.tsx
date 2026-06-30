import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TOOLS, getPopularTools } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ALL_CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";
import { BottomAd } from "@/components/ads/presets";
import { CategoryTabSection } from "./_components/CategoryTabSection";
import { HeroPreviewDeck } from "./_components/HeroPreviewDeck";
import { ScrollReveal } from "./_components/ScrollReveal";
import { getSiteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "ToolBoxJP | 無料Webツール集 — PDF・画像・お金・仕事の作業をブラウザで完結",
  description:
    "PDF結合・圧縮・変換、画像圧縮・HEIC変換、FIRE計算・NISA積立・手取り計算、請求書・契約書作成まで。登録不要・無料・スマホ対応のWebツール集。ファイルはサーバーに送信されません。",
  keywords:
    "無料ツール, PDF結合, PDF圧縮, 画像圧縮, FIRE計算, NISA積立, 手取り計算, 請求書作成, 無料 登録不要",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "ToolBoxJP | 無料Webツール集",
    description: "PDF・画像・お金・仕事の作業をブラウザだけでかんたんに。登録不要・無料。",
    url: siteUrl,
    type: "website",
  },
};

const faqItems = [
  {
    q: "ToolBoxJPは本当に無料ですか？",
    a: "はい、すべてのツールが完全無料でご利用いただけます。利用回数の制限もなく、登録・ログイン・クレジットカード情報の入力は一切不要です。広告収益によってサービスを維持しています。",
  },
  {
    q: "アップロードしたPDFや画像は安全ですか？",
    a: "はい。PDFや画像の処理はすべてお使いのブラウザ内で完結します。ファイルが外部サーバーに送信されることは一切ありません。機密書類や個人情報を含むファイルも安心してご利用いただけます。",
  },
  {
    q: "スマートフォンから使えますか？",
    a: "はい。iPhone（Safari）・Android（Chrome）などのモバイルブラウザから快適にご利用いただけます。アプリのインストールは不要です。",
  },
  {
    q: "計算結果の精度はどの程度ですか？",
    a: "FIREシミュレーター・NISA計算・手取り計算などは参考値として活用することを前提に設計されています。税制変更や実際の運用成績によって差異が生じることがあります。重要な判断は専門家にご相談ください。",
  },
  {
    q: "新しいツールのリクエストはできますか？",
    a: "はい。お問い合わせフォームからご要望をお送りください。需要の高いツールは優先的に開発を検討いたします。",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const CATEGORY_PILLS = [
  { emoji: "📄", label: "PDF", href: "/pdf" },
  { emoji: "🖼️", label: "画像", href: "/image" },
  { emoji: "💰", label: "お金・計算", href: "/money" },
  { emoji: "📋", label: "仕事・書類", href: "/business" },
  { emoji: "🏠", label: "生活便利", href: "/tools/lifestyle" },
];

const STATS = [
  { value: `${TOOLS.length}+`, label: "ツール" },
  { value: "無料", label: "完全無料・登録不要" },
  { value: "0秒", label: "URLを開くだけ" },
  { value: "100%", label: "ブラウザ内で処理" },
];

export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = TOOLS.filter((t) => t.isNew).slice(0, 6);

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* ═══════════════════════════════════════════════
          1. HERO — 大きな見出し + 実画面プレビュー
      ═══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-14 pb-20 sm:pt-24 sm:pb-28">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* 左：コピー＋CTA */}
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-400 bg-blue-950/50 px-3 py-1.5 rounded-full mb-8 border border-blue-800/50">
                <span aria-hidden="true">🧰</span>
                全{TOOLS.length}ツール · 無料 · 登録不要 · ブラウザ完結
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                面倒な作業を、<br />
                ひとつずつ<br />
                <span className="text-blue-400">軽くする。</span>
              </h1>

              <p className="text-[16px] sm:text-[17px] text-slate-300 leading-relaxed mb-10 max-w-md">
                PDF・画像・書類・お金・生活。<br />
                {TOOLS.length}種類のツールが、ブラウザだけで使える。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  今すぐ使う
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pdf"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white text-[15px] font-semibold transition-all min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  PDFツールを試す
                </Link>
              </div>

              <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
                <span aria-hidden="true">🔒</span>
                ファイルはブラウザ内で処理。サーバーに送信されません。
              </p>
            </div>

            {/* 右：PCブラウザ + スマホモック */}
            <div className="w-full pb-10 lg:pb-0">
              <HeroPreviewDeck />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. スタッツバー
      ═══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 dark:divide-zinc-800">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-6 px-4 gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-[11px] sm:text-[12px] text-slate-400 dark:text-zinc-500 text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          3. タグライン — "PDFも、画像も、書類も。"
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-32 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="container-base text-center">
          <ScrollReveal>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
              PDFも、画像も、<br />書類も。
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-lg text-slate-400 dark:text-zinc-500 mb-12">
              5つのカテゴリで、日常の作業をすべてカバーします。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORY_PILLS.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[15px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 hover:shadow-md transition-all min-h-[44px]"
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. ToolBoxJPでできること（タブ式）
      ═══════════════════════════════════════════════ */}
      <CategoryTabSection />

      {/* ═══════════════════════════════════════════════
          5. スマホ対応セクション
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-32 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* 左：コピー */}
            <div>
              <ScrollReveal>
                <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
                  MOBILE READY
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
                  スマホでも、<br />PCでも、<br />すぐ使える。
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <ul className="space-y-6 mb-10">
                  {[
                    {
                      icon: "📲",
                      title: "アプリのインストール不要",
                      body: "URLを開くだけ。Safari・Chromeがあれば、すぐ使えます。",
                    },
                    {
                      icon: "✋",
                      title: "指一本で操作できる",
                      body: "スマホ向けのUIで設計。タップ・スクロールで快適に動きます。",
                    },
                    {
                      icon: "🔒",
                      title: "ファイルはスマホ内で処理",
                      body: "PDFや画像はデバイス内だけで完結。外部送信なし。",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[14px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={280}>
                <div className="flex flex-wrap gap-2">
                  {["iPhone (Safari)", "Android (Chrome)", "iPad", "PC ブラウザ"].map((os) => (
                    <span
                      key={os}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[12px] font-medium text-slate-600 dark:text-zinc-400"
                    >
                      {os}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* 右：スマホモックアップ（大） */}
            <ScrollReveal delay={100} className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* グロー背景 */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -m-8 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"
                />
                {/* スマホ本体 */}
                <div className="relative w-[220px] sm:w-[260px]">
                  <div className="bg-[#111] rounded-[44px] p-[6px] shadow-2xl ring-1 ring-white/10">
                    {/* ノッチ */}
                    <div className="bg-[#111] rounded-t-[38px] h-7 flex items-end justify-center pb-[4px]">
                      <div className="w-20 h-4 bg-[#0a0a0a] rounded-full ring-1 ring-white/10" />
                    </div>
                    {/* スクリーン */}
                    <div className="overflow-hidden rounded-none">
                      <Image
                        src="/previews/home/mobile-pdf-merge.jpg"
                        alt="スマートフォンでのPDF結合ツール表示例"
                        width={390}
                        height={788}
                        className="w-full object-cover object-top"
                        style={{ height: "440px" }}
                        unoptimized
                      />
                    </div>
                    {/* ホームバー */}
                    <div className="bg-white rounded-b-[38px] h-7 flex items-center justify-center">
                      <div className="w-24 h-[4px] bg-zinc-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* 右上に小さいPCブラウザフレーム（デコ） */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute -top-8 -right-16 w-[180px] rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 opacity-90"
                >
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-red-400/70" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                    <span className="w-2 h-2 rounded-full bg-green-400/70" />
                    <div className="ml-1 flex-1 h-3.5 bg-white dark:bg-zinc-700 rounded text-[7px] text-slate-400 px-1 flex items-center border border-slate-200 dark:border-zinc-600">
                      toolboxjp.com
                    </div>
                  </div>
                  <Image
                    src="/previews/home/pdf-merge.jpg"
                    alt=""
                    width={1280}
                    height={760}
                    className="w-full object-cover object-top"
                    style={{ height: "110px" }}
                    unoptimized
                  />
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. 人気ツール
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <ScrollReveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[12px] font-bold text-orange-500 uppercase tracking-widest mb-1.5">
                POPULAR
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                人気のツール
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              すべて見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool, i) => (
              <ScrollReveal key={tool.id} delay={i * 60}>
                <ToolCard tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. 新着ツール
      ═══════════════════════════════════════════════ */}
      {newTools.length > 0 && (
        <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
          <div className="container-base">
            <ScrollReveal className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[12px] font-bold text-purple-500 uppercase tracking-widest mb-1.5">
                  NEW
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  新着ツール
                </h2>
              </div>
              <Link
                href="/tools"
                className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 min-h-[44px]"
              >
                すべて見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newTools.map((tool, i) => (
                <ScrollReveal key={tool.id} delay={i * 60}>
                  <ToolCard tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          8. CTAバナー
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 relative overflow-hidden">
        {/* デコ */}
        <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="container-base text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              必要なツールに、<br className="sm:hidden" />すぐ届く。
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-blue-100 text-[16px] sm:text-[17px] mb-10 max-w-md mx-auto">
              {TOOLS.length}種類のツールを無料で。<br />
              登録不要、今すぐ使えます。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2.5 bg-white text-blue-700 px-8 py-4 rounded-2xl text-[16px] font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              ツールをすべて見る
              <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. カテゴリ別一覧
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10">
              カテゴリ別ツール一覧
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 60}>
                <Link
                  href={`/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                >
                  <span
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm`}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-0.5">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                      {cat.allToolIds.length}ツール
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. 広告
      ═══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <BottomAd />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          11. よくある質問
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base max-w-3xl">
          <ScrollReveal>
            <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10">
              よくある質問
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 50}>
                <details className="group bg-white dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[14px] font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors min-h-[56px]">
                    <span className="flex items-center gap-2.5">
                      <span className="text-blue-500 font-bold flex-shrink-0 text-[15px]">Q.</span>
                      {item.q}
                    </span>
                    <span className="text-slate-400 dark:text-zinc-600 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-xl font-light leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-700 pt-4">
                    <span className="text-blue-500 font-bold mr-2 text-[15px]">A.</span>
                    {item.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-slate-400 dark:text-zinc-500">
            その他のご質問は
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              お問い合わせフォーム
            </Link>
            からどうぞ。
          </p>
        </div>
      </section>
    </>
  );
}
