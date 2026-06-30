import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TOOLS, getPopularTools } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ALL_CATEGORIES } from "@/data/categories";
import { ArrowRight, Lock, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { BottomAd } from "@/components/ads/presets";
import { CategoryTabSection } from "./_components/CategoryTabSection";
import { HeroPreviewDeck } from "./_components/HeroPreviewDeck";
import { StoryStickySection } from "./_components/StoryStickySection";
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

const STATS = [
  { value: `${TOOLS.length}+`, label: "ツール" },
  { value: "完全無料", label: "登録不要" },
  { value: "0秒", label: "URLを開くだけ" },
  { value: "100%", label: "ブラウザ内で処理" },
];

export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = TOOLS.filter((t) => t.isNew).slice(0, 6);

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 pt-14 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* 左：コピー */}
            <div>
              <ScrollReveal delay={0}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-7">
                  全{TOOLS.length}ツール · 無料 · 登録不要 · ブラウザ完結
                </p>
              </ScrollReveal>

              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-7">
                <ScrollReveal mode="clip" delay={80}>
                  <span className="block">面倒な作業を、</span>
                </ScrollReveal>
                <ScrollReveal mode="clip" delay={220}>
                  <span className="block">ひとつずつ</span>
                </ScrollReveal>
                <ScrollReveal mode="clip" delay={360}>
                  <span className="block text-blue-400">軽くする。</span>
                </ScrollReveal>
              </h1>

              <ScrollReveal delay={500}>
                <p className="text-[16px] sm:text-[17px] text-zinc-300 leading-relaxed mb-10 max-w-md">
                  PDF・画像・書類・お金・生活。<br />
                  {TOOLS.length}種類のツールが、ブラウザだけで使える。
                </p>
              </ScrollReveal>

              <ScrollReveal delay={600}>
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link
                    href="/tools"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-zinc-900 text-[15px] font-bold hover:bg-zinc-100 transition-all hover:-translate-y-0.5 hover:shadow-lg min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    今すぐ使う
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/pdf"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/20 text-zinc-300 hover:border-white/40 hover:text-white text-[15px] font-semibold transition-all min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    PDFツールを試す
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={700}>
                <p className="text-[12px] text-zinc-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 flex-shrink-0" />
                  ファイルはブラウザ内で処理。サーバーに送信されません。
                </p>
              </ScrollReveal>
            </div>

            {/* 右：PCプレビュー + スマホモック */}
            <ScrollReveal delay={300} className="w-full pb-10 lg:pb-0">
              <HeroPreviewDeck />
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 dark:divide-zinc-800">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-5 px-4 gap-0.5">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          3. STORY STICKY SECTION
      ══════════════════════════════════════════════ */}
      <StoryStickySection />

      {/* ══════════════════════════════════════════════
          4. CATEGORY TAB SECTION
      ══════════════════════════════════════════════ */}
      <CategoryTabSection />

      {/* ══════════════════════════════════════════════
          5. スマホ対応 (compact)
      ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* 左：スマホモック */}
            <ScrollReveal delay={100} className="flex justify-center order-2 lg:order-1">
              <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 -m-10 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="relative w-[200px] sm:w-[240px]">
                  <div className="bg-[#111] rounded-[44px] p-[6px] shadow-2xl ring-1 ring-white/10">
                    <div className="bg-[#111] rounded-t-[38px] h-7 flex items-end justify-center pb-[4px]">
                      <div className="w-20 h-4 bg-[#0a0a0a] rounded-full ring-1 ring-white/10" />
                    </div>
                    <div className="overflow-hidden rounded-none">
                      <Image
                        src="/previews/home/mobile-pdf-merge.jpg"
                        alt="スマートフォンでのPDF結合ツール表示例"
                        width={390}
                        height={788}
                        className="w-full object-cover object-top"
                        style={{ height: "400px" }}
                        unoptimized
                      />
                    </div>
                    <div className="bg-white rounded-b-[38px] h-7 flex items-center justify-center">
                      <div className="w-24 h-[4px] bg-zinc-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* 右：コピー */}
            <div className="order-1 lg:order-2">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                  スマホでも、<br />PCでも、<br />すぐ使える。
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <ul className="space-y-5 mb-8">
                  {[
                    { Icon: Smartphone, title: "アプリのインストール不要", body: "URLを開くだけ。Safari・Chromeがあれば、今すぐ使えます。" },
                    { Icon: Zap, title: "スマホ向けUIで設計", body: "タップ・スクロールで快適に動作。小さな画面でも迷わない。" },
                    { Icon: ShieldCheck, title: "ファイルは端末内で処理", body: "PDFや画像は外部に送信されず、デバイス内だけで完結。" },
                  ].map(({ Icon, title, body }) => (
                    <li key={title} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-0.5">{title}</p>
                        <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={280}>
                <div className="flex flex-wrap gap-2">
                  {["iPhone  /  Safari", "Android  /  Chrome", "iPad", "PC ブラウザ"].map((os) => (
                    <span
                      key={os}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[12px] font-medium text-slate-500 dark:text-zinc-400"
                    >
                      {os}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. 人気ツール
      ══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <ScrollReveal className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                POPULAR
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                人気のツール
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 min-h-[44px] transition-colors"
            >
              すべて見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {popularTools.map((tool, i) => (
              <ScrollReveal key={tool.id} delay={i * 50}>
                <ToolCard tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. 新着ツール
      ══════════════════════════════════════════════ */}
      {newTools.length > 0 && (
        <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
          <div className="container-base">
            <ScrollReveal className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
                  NEW
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  新着ツール
                </h2>
              </div>
              <Link
                href="/tools"
                className="text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 min-h-[44px] transition-colors"
              >
                すべて見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {newTools.map((tool, i) => (
                <ScrollReveal key={tool.id} delay={i * 50}>
                  <ToolCard tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          8. CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-zinc-950 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.12)_0%,_transparent_70%)]" />
        <div className="container-base text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              必要なツールに、すぐ届く。
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-zinc-400 text-[16px] mb-10 max-w-md mx-auto">
              {TOOLS.length}種類のツールを無料で。登録不要、今すぐ使えます。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2.5 bg-white text-zinc-900 px-8 py-4 rounded-2xl text-[15px] font-bold hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              ツールをすべて見る
              <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. カテゴリ一覧
      ══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <ScrollReveal>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8">
              カテゴリ別ツール一覧
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {ALL_CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 40}>
                <Link
                  href={`/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                >
                  <span
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-sm`}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-200 leading-tight mb-0.5">
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

      {/* ══════════════════════════════════════════════
          10. 広告
      ══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <BottomAd />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          11. FAQ
      ══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base max-w-3xl">
          <ScrollReveal>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              よくある質問
            </h2>
          </ScrollReveal>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 40}>
                <details className="group bg-white dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[14px] font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors min-h-[56px]">
                    <span className="flex items-center gap-2.5">
                      <span className="text-blue-500 font-bold flex-shrink-0 text-[13px]">Q.</span>
                      {item.q}
                    </span>
                    <span className="text-slate-300 dark:text-zinc-600 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-xl font-light leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-700 pt-4">
                    <span className="text-blue-500 font-bold mr-2 text-[13px]">A.</span>
                    {item.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-slate-400 dark:text-zinc-500">
            その他のご質問は
            <Link href="/contact" className="text-slate-600 dark:text-zinc-300 hover:underline ml-1 underline-offset-2">
              お問い合わせフォーム
            </Link>
            からどうぞ。
          </p>
        </div>
      </section>
    </>
  );
}
