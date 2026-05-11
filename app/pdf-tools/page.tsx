import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "PDFツール一覧｜無料でPDF結合・分割・圧縮・変換",
  description: "PDF結合・分割・圧縮・JPG変換などPDF関連ツールを無料で提供。登録不要・ブラウザ完結・スマホ対応。",
  path: "/pdf-tools",
  keywords: ["PDFツール 無料", "PDF結合 無料", "PDF分割", "PDF圧縮", "PDF変換 ブラウザ"],
});

const tools = [
  {
    href: "/tools/pdf-merge",
    emoji: "📎",
    title: "PDF結合",
    seoTitle: "PDF結合ツール",
    description: "複数のPDFを1つにまとめます。ドラッグで順番変更・登録不要。",
    color: "blue",
    keywords: ["結合", "まとめる", "複数"],
  },
  {
    href: "/tools/pdf-split",
    emoji: "✂️",
    title: "PDF分割",
    seoTitle: "PDF分割ツール",
    description: "ページ指定で分割・必要なページだけ抽出できます。",
    color: "orange",
    keywords: ["分割", "抽出", "ページ指定"],
  },
  {
    href: "/tools/pdf-compress",
    emoji: "🗜️",
    title: "PDF圧縮",
    seoTitle: "PDF圧縮ツール",
    description: "ファイルサイズを軽量化。メール送信・アップロードに最適。",
    color: "purple",
    keywords: ["圧縮", "軽量化", "サイズ削減"],
  },
  {
    href: "/tools/jpg-to-pdf",
    emoji: "🖼️",
    title: "JPG→PDF変換",
    seoTitle: "JPG・画像をPDFに変換",
    description: "複数画像をまとめてPDF化。A4サイズ対応・iPhone対応。",
    color: "green",
    keywords: ["画像変換", "写真", "まとめる"],
  },
  {
    href: "/tools/pdf-to-jpg",
    emoji: "📄",
    title: "PDF→JPG変換",
    seoTitle: "PDFをJPG画像に変換",
    description: "PDFページを高画質JPGに変換。複数ページはZIPで一括DL。",
    color: "rose",
    keywords: ["画像化", "スクリーンショット", "ZIP"],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",   text: "text-blue-600 dark:text-blue-400",   border: "hover:border-blue-200 dark:hover:border-blue-800",   tag: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", text: "text-orange-600 dark:text-orange-400", border: "hover:border-orange-200 dark:hover:border-orange-800", tag: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-600 dark:text-purple-400", border: "hover:border-purple-200 dark:hover:border-purple-800", tag: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",  text: "text-green-600 dark:text-green-400",  border: "hover:border-green-200 dark:hover:border-green-800",  tag: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",    text: "text-rose-600 dark:text-rose-400",    border: "hover:border-rose-200 dark:hover:border-rose-800",    tag: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "PDFツール一覧",
  description: "PDF結合・分割・圧縮・変換ツールを無料で提供。登録不要・ブラウザ完結。",
  url: "https://www.toolboxjp.com/pdf-tools",
};

export default function PdfToolsPage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-slate-100 dark:border-zinc-800 py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[12px] font-semibold text-blue-600 dark:text-blue-400 mb-6">
              📄 PDFツールコレクション
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              PDFをもっと<br className="sm:hidden" />自由に、もっと簡単に
            </h1>
            <p className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              結合・分割・圧縮・変換まで。すべてブラウザで完結。登録不要・完全無料・スマホ対応。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[13px] text-slate-400">
              <span>✓ 登録不要</span>
              <span>✓ ファイルはサーバーに保存されない</span>
              <span>✓ スマホ対応</span>
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const c = colorMap[tool.color];
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group relative flex flex-col p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 ${c.border} hover:shadow-lg transition-all`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${c.bg} mb-4`}>
                    <span className="text-2xl">{tool.emoji}</span>
                  </div>
                  <h2 className="text-[18px] font-bold text-slate-900 dark:text-white mb-1">{tool.seoTitle}</h2>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">{tool.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.keywords.map((kw) => (
                      <span key={kw} className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${c.tag}`}>{kw}</span>
                    ))}
                  </div>
                  <span className={`absolute top-5 right-5 text-[13px] font-semibold ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    使う →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Feature highlights */}
        <section className="bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-8 text-center">すべてのツールの共通仕様</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: "🔒", title: "プライバシー安全", desc: "ファイルはブラウザ内で処理。サーバーへのアップロードは一切なし。" },
                { emoji: "📱", title: "スマホ完全対応", desc: "iPhone・Androidどちらでも快適に操作できます。" },
                { emoji: "⚡", title: "即使える", desc: "登録不要・インストール不要。ページを開けばすぐ使えます。" },
              ].map((f) => (
                <div key={f.title} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 text-center">
                  <span className="text-2xl block mb-2">{f.emoji}</span>
                  <p className="text-[14px] font-semibold text-slate-800 dark:text-white mb-1">{f.title}</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-6">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "本当に無料ですか？", a: "はい、すべてのPDFツールは完全無料でご利用いただけます。会員登録・クレジットカード情報の入力は一切不要です。" },
              { q: "アップロードしたファイルはどこに保存されますか？", a: "ファイルはサーバーにアップロードされません。処理はすべてお使いのデバイスのブラウザ内で完結します。機密性の高い文書も安心してご利用いただけます。" },
              { q: "スマートフォンでも使えますか？", a: "はい。iPhone・Androidともに対応しています。iPhoneでの写真（HEIC形式）もJPG→PDF変換ツールでそのままPDF化できます。" },
              { q: "ファイルサイズの上限はありますか？", a: "明示的な上限は設けていませんが、処理はブラウザのメモリを使用するため、非常に大きなファイル（100MB以上）の場合は動作が遅くなることがあります。" },
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-[15px] font-semibold text-slate-800 dark:text-white mb-2">{item.q}</p>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
