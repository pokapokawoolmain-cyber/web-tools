import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "PDFツール一覧｜無料でPDF結合・分割・圧縮・変換・回転・透かし・削除・並び替え・暗号化",
  description: "PDF結合・分割・圧縮・JPG変換・回転・透かし・ページ削除・並び替え・パスワード保護・メタデータ削除まで11種類のPDFツールを無料提供。登録不要・ブラウザ完結。",
  path: "/pdf-tools",
  keywords: ["PDFツール 無料", "PDF結合 無料", "PDF分割", "PDF圧縮", "PDF変換 ブラウザ", "PDF回転", "PDFページ削除", "PDF並び替え", "PDF パスワード"],
});

const tools = [
  { href: "/tools/pdf-merge",        emoji: "📎", title: "PDF結合ツール",        description: "複数のPDFを1つにまとめます。ドラッグで順番変更・登録不要。",                       color: "blue",   keywords: ["結合", "まとめる", "複数"],        popular: true  },
  { href: "/tools/pdf-split",        emoji: "✂️", title: "PDF分割ツール",        description: "ページ指定で分割・必要なページだけ抽出できます。",                                   color: "orange", keywords: ["分割", "抽出", "ページ指定"],      popular: false },
  { href: "/tools/pdf-compress",     emoji: "🗜️", title: "PDF圧縮ツール",        description: "ファイルサイズを軽量化。メール送信・アップロードに最適。",                           color: "purple", keywords: ["圧縮", "軽量化", "サイズ削減"],    popular: true  },
  { href: "/tools/jpg-to-pdf",       emoji: "🖼️", title: "JPG・画像をPDFに変換", description: "複数画像をまとめてPDF化。A4サイズ対応・iPhone対応。",                              color: "green",  keywords: ["画像変換", "写真", "まとめる"],    popular: true  },
  { href: "/tools/pdf-to-jpg",       emoji: "📄", title: "PDFをJPG画像に変換",   description: "PDFページを高画質JPGに変換。複数ページはZIPで一括DL。",                            color: "rose",   keywords: ["画像化", "スクリーンショット", "ZIP"], popular: false },
  { href: "/tools/pdf-rotate",       emoji: "🔄", title: "PDF回転ツール",        description: "90°・180°・270°でページを回転。スキャンで横になったPDFを修正。",               color: "indigo", keywords: ["回転", "横向き修正", "スキャン"],  popular: false },
  { href: "/tools/pdf-watermark",    emoji: "🔏", title: "PDF透かし追加ツール",   description: "「社外秘」「DRAFT」などのテキスト透かしを追加。色・透明度を自由設定。",             color: "teal",   keywords: ["透かし", "社外秘", "ウォーターマーク"], popular: false },
  { href: "/tools/pdf-delete-pages", emoji: "🗑️", title: "PDFページ削除ツール",  description: "不要なページを選んで削除。複数選択・反転選択・一括削除に対応。",                   color: "red",    keywords: ["ページ削除", "不要ページ", "消去"], popular: false },
  { href: "/tools/pdf-reorder",          emoji: "↕️", title: "PDF並び替えツール",        description: "ドラッグ操作でページ順を自由に変更。スマホは上下ボタンにも対応。サムネイル表示付き。",               color: "amber",  keywords: ["並び替え", "順番変更", "入れ替え"],    popular: false },
  { href: "/tools/pdf-password",         emoji: "🔐", title: "PDFパスワード設定ツール",    description: "AES-256暗号化でPDFを保護。設定したパスワードで解除も可能。Adobe非互換の独自形式。",               color: "violet", keywords: ["パスワード", "暗号化", "保護"],        popular: false },
  { href: "/tools/pdf-metadata-remover", emoji: "🧹", title: "PDFメタデータ削除ツール",    description: "作成者・作成日・使用ソフト名などのメタデータを削除。共有前のプライバシー保護に。",                   color: "slate",  keywords: ["メタデータ", "作成者削除", "個人情報"], popular: false },
];

const colorMap: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",     text: "text-blue-600 dark:text-blue-400",     border: "hover:border-blue-200 dark:hover:border-blue-800",     tag: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", text: "text-orange-600 dark:text-orange-400", border: "hover:border-orange-200 dark:hover:border-orange-800", tag: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-600 dark:text-purple-400", border: "hover:border-purple-200 dark:hover:border-purple-800", tag: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",   text: "text-green-600 dark:text-green-400",   border: "hover:border-green-200 dark:hover:border-green-800",   tag: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",     text: "text-rose-600 dark:text-rose-400",     border: "hover:border-rose-200 dark:hover:border-rose-800",     tag: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/20", text: "text-indigo-600 dark:text-indigo-400", border: "hover:border-indigo-200 dark:hover:border-indigo-800", tag: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/20",     text: "text-teal-600 dark:text-teal-400",     border: "hover:border-teal-200 dark:hover:border-teal-800",     tag: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" },
  red:    { bg: "bg-red-50 dark:bg-red-950/20",       text: "text-red-600 dark:text-red-400",       border: "hover:border-red-200 dark:hover:border-red-800",       tag: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/20",   text: "text-amber-600 dark:text-amber-400",   border: "hover:border-amber-200 dark:hover:border-amber-800",   tag: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-600 dark:text-violet-400", border: "hover:border-violet-200 dark:hover:border-violet-800", tag: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" },
  slate:  { bg: "bg-slate-100 dark:bg-slate-800/30",  text: "text-slate-600 dark:text-slate-400",   border: "hover:border-slate-300 dark:hover:border-slate-600",   tag: "bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300" },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "PDFツール一覧",
  description: "PDF結合・分割・圧縮・変換・回転・透かし・ページ削除・並び替え・パスワード保護・メタデータ削除まで11種のPDFツールを無料提供。登録不要・ブラウザ完結。",
  url: "https://www.toolboxjp.com/pdf-tools",
  numberOfItems: 11,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFツールは本当に無料ですか？", acceptedAnswer: { "@type": "Answer", text: "はい、11種類すべてのPDFツールは完全無料です。会員登録・クレジットカードは一切不要です。" } },
    { "@type": "Question", name: "アップロードしたPDFはサーバーに保存されますか？", acceptedAnswer: { "@type": "Answer", text: "保存されません。すべての処理はブラウザ内で完結します。機密性の高い文書も安心してご利用いただけます。" } },
    { "@type": "Question", name: "スマートフォンやiPhoneで使えますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidともに対応しています。PDF並び替えツールはスマホ向けの上下ボタンも搭載しています。" } },
    { "@type": "Question", name: "PDF分割とPDFページ削除の違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "PDF分割は「必要なページを取り出す」ツールです。PDFページ削除は「不要なページを消して残りを保存する」ツールです。大半のページを残したい場合はページ削除のほうが操作しやすいです。" } },
  ],
};

export default function PdfToolsPage() {
  return (
    <>
      <JsonLd data={[pageSchema, faqSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">

        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-slate-100 dark:border-zinc-800 py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[12px] font-semibold text-blue-600 dark:text-blue-400 mb-6">
              📄 11種類のPDFツール
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              PDFをもっと<br className="sm:hidden" />自由に、もっと簡単に
            </h1>
            <p className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              結合・分割・圧縮・変換・回転・透かし・削除・並び替え・暗号化・メタデータ削除まで。すべてブラウザで完結。登録不要・完全無料・スマホ対応。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[13px] text-slate-400 dark:text-zinc-500">
              <span>✓ 登録不要</span>
              <span>✓ サーバー保存なし</span>
              <span>✓ スマホ対応</span>
              <span>✓ 完全無料</span>
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
                  {tool.popular && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-slate-700 dark:bg-zinc-500">
                      人気
                    </span>
                  )}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${c.bg} mb-4`}>
                    <span className="text-2xl">{tool.emoji}</span>
                  </div>
                  <h2 className="text-[17px] font-bold text-slate-900 dark:text-white mb-1.5 pr-12">{tool.title}</h2>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">{tool.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.keywords.map((kw) => (
                      <span key={kw} className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${c.tag}`}>{kw}</span>
                    ))}
                  </div>
                  <span className={`mt-4 text-[13px] font-semibold ${c.text} flex items-center gap-1`}>
                    今すぐ使う <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Feature highlights */}
        <section className="bg-slate-50 dark:bg-zinc-900 border-t border-b border-slate-100 dark:border-zinc-800 py-12">
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

        {/* Use case scenarios */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-6">こんな場面で使われています</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { scene: "📋 複数の申請書をまとめて提出", tool: "PDF結合", href: "/tools/pdf-merge" },
              { scene: "📧 メール添付用にPDFを軽量化", tool: "PDF圧縮", href: "/tools/pdf-compress" },
              { scene: "📸 スキャンした書類をPDF化", tool: "JPG→PDF", href: "/tools/jpg-to-pdf" },
              { scene: "🔍 必要なページだけ取り出す", tool: "PDF分割", href: "/tools/pdf-split" },
              { scene: "🖼️ PDFの画像をJPGで保存", tool: "PDF→JPG", href: "/tools/pdf-to-jpg" },
              { scene: "📐 横向きスキャンを縦に直す", tool: "PDF回転", href: "/tools/pdf-rotate" },
              { scene: "🔏 配布前に社外秘を追加する", tool: "PDF透かし", href: "/tools/pdf-watermark" },
              { scene: "🗑️ 不要な表紙・白紙を削除する", tool: "PDFページ削除", href: "/tools/pdf-delete-pages" },
              { scene: "↕️ 章の順番を入れ替えて整理", tool: "PDF並び替え", href: "/tools/pdf-reorder" },
              { scene: "🔐 社内資料を暗号化して安全共有", tool: "PDFパスワード", href: "/tools/pdf-password" },
              { scene: "🧹 作成者・日付を消して提出", tool: "PDFメタデータ削除", href: "/tools/pdf-metadata-remover" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-600 hover:shadow-sm transition-all group"
              >
                <span className="text-[14px] text-slate-700 dark:text-slate-300">{item.scene}</span>
                <span className="text-[12px] font-semibold text-blue-500 dark:text-blue-400 shrink-0 ml-3 group-hover:underline">{item.tool} →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-6">よくある質問</h2>
            <div className="space-y-4">
              {[
                { q: "本当に無料ですか？", a: "はい、11種類すべてのPDFツールは完全無料でご利用いただけます。会員登録・クレジットカード情報の入力は一切不要です。" },
                { q: "アップロードしたファイルはどこに保存されますか？", a: "ファイルはサーバーにアップロードされません。処理はすべてお使いのデバイスのブラウザ内で完結します。機密性の高い文書も安心してご利用いただけます。" },
                { q: "スマートフォンでも使えますか？", a: "はい。iPhone・Androidともに対応しています。PDF並び替えツールはスマホ向けの上下ボタンも搭載しています。" },
                { q: "PDF分割とPDFページ削除の違いは何ですか？", a: "PDF分割は「必要なページだけを取り出す」ツールです。PDFページ削除は「不要なページだけを消して残りをそのまま保存する」ツールです。大半のページを残したい場合はページ削除のほうが直感的に操作できます。" },
                { q: "PDFにパスワードがかかっていても使えますか？", a: "パスワード保護されたPDFはブラウザでの処理ができないため、事前にパスワードを解除してからご利用ください。" },
              ].map((item) => (
                <div key={item.q} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                  <p className="text-[15px] font-semibold text-slate-800 dark:text-white mb-2">{item.q}</p>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
