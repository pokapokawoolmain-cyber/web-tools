import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, getPopularTools } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ALL_CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";
import { BottomAd } from "@/components/ads/presets";
import { CategoryTabSection } from "./_components/CategoryTabSection";
import { HeroPreviewDeck } from "./_components/HeroPreviewDeck";
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

const HERO_PURPOSES = [
  { label: "PDFを変換・編集する", href: "/pdf", emoji: "📄" },
  { label: "画像を圧縮・変換する", href: "/image", emoji: "🖼️" },
  { label: "お金・税金を計算する", href: "/money", emoji: "💰" },
  { label: "書類・請求書を作る", href: "/business", emoji: "📋" },
  { label: "生活を便利にする", href: "/tools/lifestyle", emoji: "🏠" },
];

export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = TOOLS.filter((t) => t.isNew).slice(0, 6);

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* ═══════════════════════════════════════════════
          1. HERO — 2カラム
      ═══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* 左：テキスト＋CTA */}
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-full mb-6 border border-blue-100 dark:border-blue-900/40">
                <span aria-hidden="true">🧰</span>
                全{TOOLS.length}ツール · 無料 · 登録不要 · ブラウザ完結
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.625rem] xl:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
                PDF、画像、仕事、お金の<br />
                作業を、ブラウザだけで<br className="sm:hidden" />かんたんに。
              </h1>
              <p className="text-[16px] sm:text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                登録不要・無料で使える実用ツールを{TOOLS.length}種類まとめました。スマホでもPCでも、日常のちょっと面倒な作業をすぐに片付けられます。
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-6">
                {HERO_PURPOSES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all min-h-[44px] shadow-sm"
                  >
                    <span aria-hidden="true" className="text-base">{p.emoji}</span>
                    {p.label}
                  </Link>
                ))}
              </div>

              <p className="text-[12px] text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <span aria-hidden="true">🔒</span>
                PDF・画像の処理はすべてブラウザ内で完結。ファイルはサーバーに送信されません。
              </p>
            </div>

            {/* 右：実画面プレビューデッキ */}
            <div className="w-full">
              <HeroPreviewDeck />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. ToolBoxJPでできること（タブ式）
      ═══════════════════════════════════════════════ */}
      <CategoryTabSection />

      {/* ═══════════════════════════════════════════════
          3. 人気ツール
      ═══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[12px] font-bold text-orange-500 uppercase tracking-widest mb-1">POPULAR</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                人気のツール
              </h2>
            </div>
            <Link href="/tools" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 min-h-[44px]">
              すべて見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. 新着ツール
      ═══════════════════════════════════════════════ */}
      {newTools.length > 0 && (
        <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
          <div className="container-base">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[12px] font-bold text-purple-500 uppercase tracking-widest mb-1">NEW</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  新着ツール
                </h2>
              </div>
              <Link href="/tools" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 min-h-[44px]">
                すべて見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newTools.map((tool) => (
                <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          5. カテゴリ別一覧
      ═══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            カテゴリ別ツール一覧
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-center"
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
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. ToolBoxJPとは
      ═══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">ABOUT</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                ToolBoxJPとは？
              </h2>
              <div className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  ToolBoxJPは「<strong className="text-slate-800 dark:text-zinc-200">すぐ使える・迷わない・ブラウザだけで完結する</strong>」をコンセプトにした、無料Webツール集です。
                </p>
                <p>
                  PDF結合・画像圧縮・FIRE計算・請求書作成など、アプリを入れずにブラウザだけで使えるツールを<strong className="text-slate-800 dark:text-zinc-200">{TOOLS.length}種類以上</strong>揃えています。
                </p>
                <p>
                  PDFや画像ファイルはサーバーに送信されず、すべてブラウザ内で処理されるため、機密書類や個人情報を含むファイルも安心して使えます。
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/about" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px]">
                  詳しくはこちら <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/updates" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px]">
                  <span aria-hidden="true">📋</span> 更新履歴
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "⚡", title: "登録不要でいますぐ使える", body: "URLを開くだけで即利用。アカウント作成・アプリインストール・クレジットカード入力は一切不要。" },
                { icon: "🔒", title: "ファイルが外部に出ない", body: "PDFや画像の処理はすべてブラウザ内で完結。サーバーに送信されないので機密書類も安心。" },
                { icon: "📱", title: "スマホ・PCどこでも", body: "iPhone・Android・PC問わず動作。最新のブラウザがあれば快適に使えます。" },
                { icon: "🆓", title: "完全無料・制限なし", body: "利用回数の上限なし。有料プランへの誘導もありません。すべて無料でお使いいただけます。" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
                  <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1">{item.title}</p>
                    <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. 広告
      ═══════════════════════════════════════════════ */}
      <div className="bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <BottomAd />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          8. よくある質問
      ═══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base max-w-3xl">
          <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            よくある質問
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[14px] font-semibold text-slate-800 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-colors min-h-[56px]">
                  <span className="flex items-center gap-2.5">
                    <span className="text-blue-500 font-bold flex-shrink-0 text-[15px]">Q.</span>
                    {item.q}
                  </span>
                  <span className="text-slate-400 dark:text-zinc-600 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-xl font-light leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800 pt-4 bg-white dark:bg-zinc-900">
                  <span className="text-blue-500 font-bold mr-2 text-[15px]">A.</span>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-slate-400 dark:text-zinc-500">
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
