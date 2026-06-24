// ========================================
// トップページ
// ツール一覧を表示するランディングページ
// ========================================
import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, getToolsByCategory, getPopularTools } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ALL_CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";
import { BottomAd } from "@/components/ads/presets";
import { getSiteUrl } from "@/lib/utils";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "ToolBox | 無料Webツール集 - FIRE・NISA・画像変換など",
  description:
    "FIREシミュレーター・NISA積立計算・メルカリ利益計算・画像圧縮など、毎日使える無料ツールを集めたサイト。登録不要・スマホ対応・ブラウザ完結。",
  keywords:
    "無料ツール, FIRE計算, NISA積立, メルカリ利益計算, 画像圧縮, ガソリン代計算, 副業計算",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "ToolBox | 無料Webツール集",
    description: "毎日使える無料ツールを集めたサイト。登録不要・スマホ対応。",
    url: siteUrl,
    type: "website",
  },
};

export default function HomePage() {
  const toolsByCategory = getToolsByCategory();
  const popularTools = getPopularTools();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 py-16 sm:py-24">
        {/* 背景グラデーション装飾 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container-base relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* h1タグ：SEO最重要 */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                無料Webツール
              </span>
              で、<br className="sm:hidden" />
              もっとスマートに。
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              FIRE計算・NISA積立・メルカリ利益計算・画像変換など
              <br className="hidden sm:block" />
              登録不要・スマホ対応・ブラウザ完結の無料ツール集。
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/tools/fire-simulator"
                className="btn-primary text-sm sm:text-base"
              >
                🔥 FIREシミュレーター
              </Link>
              <Link
                href="/tools/nisa-calculator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                📈 NISA計算
              </Link>
            </div>

            {/* 統計バッジ */}
            <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">
              全{TOOLS.length}ツール　·　無料　·　登録不要　·　スマホ対応
            </p>
          </div>
        </div>
      </section>

      {/* カテゴリから探す */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            カテゴリから探す
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-[15px]">
            専門ツールをカテゴリ別にまとめました
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ALL_CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradientLight} border border-slate-200/60 dark:border-zinc-700/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                  {/* 背景グロー */}
                  <div
                    aria-hidden="true"
                    className={`absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="relative">
                    {/* アイコン */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    {/* テキスト */}
                    <h3 className="font-bold text-slate-900 dark:text-white text-[17px] mb-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-500 mb-3 line-clamp-2">
                      {cat.tagline}
                    </p>
                    {/* ツール数 + 矢印 */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] font-semibold ${cat.accentColor}`}>
                        {cat.allToolIds.length}種類のツール
                      </span>
                      <ArrowRight className={`h-4 w-4 ${cat.accentColor} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 人気ツール */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
        <div className="container-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            人気のツール
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            よく使われているツールです
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
            ))}
          </div>
        </div>
      </section>

      {/* カテゴリ別ツール一覧 */}
      {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
        <section key={category} className="py-12 border-t border-slate-100 dark:border-zinc-800">
          <div className="container-base">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={{ ...tool, icon: tool.emoji, keywords: [] }} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* 初心者向けおすすめツール */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            はじめての方におすすめ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-[15px]">
            迷ったらこのツールから始めてみてください
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                emoji: "🔥",
                title: "FIREシミュレーター",
                desc: "現在の貯蓄・毎月の積立・年利を入れると、FIRE達成まであと何年かを計算。老後の資産計画にも活用できます。",
                href: "/tools/fire-simulator",
                tag: "お金・投資",
              },
              {
                emoji: "📎",
                title: "PDF結合ツール",
                desc: "複数のPDFを1つにまとめます。登録不要・ファイルの外部送信なし。スマホからも使えます。",
                href: "/tools/pdf-merge",
                tag: "PDFツール",
              },
              {
                emoji: "🖼️",
                title: "画像圧縮ツール",
                desc: "写真やスクリーンショットを圧縮してファイルサイズを削減。ブラウザだけで処理、画質を保ちながら軽量化。",
                href: "/tools/image-compress",
                tag: "画像ツール",
              },
              {
                emoji: "🎨",
                title: "カラーコード変換",
                desc: "HEX・RGB・HSLを相互変換。カラーピッカーで色を選んでCSSコードを即コピーできます。",
                href: "/tools/hex-rgb-converter",
                tag: "カラーツール",
              },
              {
                emoji: "📋",
                title: "業務委託契約書作成",
                desc: "フリーランス・副業で必要な業務委託契約書をブラウザで作成。PDF保存まで完結。",
                href: "/tools/business-contract-generator",
                tag: "ビジネス書類",
              },
              {
                emoji: "💴",
                title: "手取り早見表",
                desc: "年収・月収から手取り額を素早く確認。税金・社会保険料の内訳もわかります。",
                href: "/salary",
                tag: "計算ツール",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mb-0.5">{item.tag}</p>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-[15px] mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ToolBoxとは：充実した解説セクション */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 左：説明テキスト */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                ToolBoxとは？
              </h2>
              <div className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  ToolBoxは「<strong className="text-slate-800 dark:text-zinc-200">すぐ使える・迷わない・ブラウザだけで完結する</strong>」をコンセプトにした、無料Webツール集です。
                </p>
                <p>
                  FIRE（経済的自立）シミュレーター・NISA積立計算・PDF結合・画像圧縮・カラーコード変換など、日常生活や仕事のちょっとした場面で「ツールを使いたいけど、アプリを入れるのは面倒」という状況に応えます。
                </p>
                <p>
                  現在<strong className="text-slate-800 dark:text-zinc-200">{TOOLS.length}種類以上</strong>のツールが無料で利用可能。すべてアカウント登録不要・スマートフォン対応です。
                </p>
                <p>
                  PDFや画像ファイルはサーバーに送信されず、すべてブラウザ内で処理されるため、機密書類や個人情報を含むファイルも安心して使えます。
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  詳しくはこちら →
                </a>
                <a
                  href="/updates"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  📋 更新履歴
                </a>
              </div>
            </div>

            {/* 右：特徴リスト */}
            <div className="space-y-3">
              {[
                {
                  icon: "⚡",
                  title: "すぐ使える・登録不要",
                  body: "URLにアクセスするだけで即利用できます。アカウント作成・アプリインストール・クレジットカード情報の入力は一切不要。",
                },
                {
                  icon: "🔒",
                  title: "ファイルが外部に送信されない",
                  body: "PDFや画像の処理はすべてブラウザ内のJavaScriptで完結。ファイルがサーバーに送信されることはありません。",
                },
                {
                  icon: "📱",
                  title: "スマホ・PC どこでも使える",
                  body: "iPhone・Android・Windows・Macを問わず、最新のブラウザがあれば快適に使えるよう最適化されています。",
                },
                {
                  icon: "📖",
                  title: "使い方ガイド付き",
                  body: "各ツールページにはわかりやすい使い方説明・FAQ・関連知識のブログ記事へのリンクを掲載。初めての方でも安心。",
                },
                {
                  icon: "🌙",
                  title: "ダークモード対応",
                  body: "目に優しいダークモードに対応。画面右上のアイコンからいつでも切り替えられます。",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-0.5">{item.title}</p>
                    <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ページ下部広告（ファーストビュー・主要操作と十分離れた位置） */}
      <div className="bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base">
          <BottomAd />
        </div>
      </div>

      {/* よくある質問 */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
        <div className="container-base max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            よくある質問
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "本当に無料ですか？",
                a: "はい、ToolBoxのすべてのツールは完全無料でご利用いただけます。利用回数の制限もありません。広告収益によってサービスを維持しています。",
              },
              {
                q: "アップロードしたファイルは安全ですか？",
                a: "はい。PDFや画像などのファイル処理はすべてお使いのブラウザ内で行われます。外部サーバーへのファイル送信は一切行っていないため、機密情報を含む書類も安心してご利用いただけます。",
              },
              {
                q: "スマートフォンから使えますか？",
                a: "はい。iPhone（Safari）・Android（Chrome）などのモバイルブラウザに対応しています。一部のツール（PDFの複数ページ処理など）はPCでの利用を推奨しますが、基本的にはスマホから快適に利用できます。",
              },
              {
                q: "計算結果の精度はどの程度ですか？",
                a: "FIREシミュレーター・NISA計算・住宅ローン計算などのツールは、参考値として活用することを前提に設計されています。税制変更や実際の運用成績との差異が生じる場合があります。重要な判断は専門家にご相談ください。",
              },
              {
                q: "新しいツールのリクエストはできますか？",
                a: "はい。お問い合わせフォームからご要望をお送りください。需要の高いツールは優先的に開発を検討いたします。",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-[14px] font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">Q.</span>
                    {item.q}
                  </span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-lg font-light">+</span>
                </summary>
                <div className="px-5 pb-4 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800 pt-3">
                  <span className="text-blue-500 font-bold mr-2">A.</span>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-slate-400 dark:text-zinc-500">
            その他のご質問は<a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">お問い合わせフォーム</a>からどうぞ。
          </p>
        </div>
      </section>
    </>
  );
}
