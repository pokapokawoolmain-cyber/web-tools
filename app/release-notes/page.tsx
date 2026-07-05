import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import {
  RELEASE_NOTES,
  RELEASE_TYPE_STYLE,
  formatReleaseDate,
} from "@/data/release-notes";

export const metadata: Metadata = generateMeta({
  title: "リリースノート｜ToolBox の新ツール・改善・修正の履歴",
  description:
    "ToolBox（ツールボックス）の更新履歴です。新ツールの追加、機能の改善、不具合の修正を日付・種別・対象ツールごとに一覧で確認できます。",
  path: "/release-notes",
});

const siteUrl = getSiteUrl();

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "リリースノート", item: `${siteUrl}/release-notes` },
  ],
};

export default function ReleaseNotesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <nav aria-label="パンくずリスト" className="mb-4 text-sm text-slate-500">
              <ol className="flex items-center gap-1">
                <li>
                  <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">ToolBox</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 dark:text-slate-300">リリースノート</li>
              </ol>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              リリースノート
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed">
              新ツールの追加や機能改善、不具合の修正など、ToolBoxの更新をまとめています。
            </p>
            {/* 種別の凡例 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.values(RELEASE_TYPE_STYLE).map((s) => (
                <span key={s.label} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.className}`}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 一覧 */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="relative">
            {/* 縦線（PC） */}
            <div aria-hidden="true" className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-zinc-800 hidden sm:block" />

            <ol className="space-y-5">
              {RELEASE_NOTES.map((note, i) => {
                const style = RELEASE_TYPE_STYLE[note.type];
                return (
                  <li key={i} className="sm:pl-10 relative">
                    {/* ドット（PC） */}
                    <span aria-hidden="true" className="absolute left-0 top-4 hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border-2 border-slate-200 dark:border-zinc-700" />

                    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-slate-200 dark:hover:border-zinc-700 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${style.className}`}>
                          {style.label}
                        </span>
                        <time className="text-[12px] text-slate-400 dark:text-zinc-500 font-mono" dateTime={note.date}>
                          {formatReleaseDate(note.date)}
                        </time>
                        {note.target && (
                          <span className="text-[12px] text-slate-500 dark:text-zinc-400">
                            {note.target}
                          </span>
                        )}
                      </div>
                      <h2 className="text-[15px] font-bold text-slate-800 dark:text-zinc-200 mb-1">
                        {note.href ? (
                          <Link href={note.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {note.title}
                          </Link>
                        ) : (
                          note.title
                        )}
                      </h2>
                      <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {note.body}
                      </p>
                      {note.href && (
                        <Link
                          href={note.href}
                          className="inline-flex items-center gap-1 mt-2 text-[12px] text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          ページを見る →
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* フッター導線 */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap gap-4 text-[13px]">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← トップページへ</Link>
            <Link href="/tools" className="text-blue-600 dark:text-blue-400 hover:underline">ツール一覧</Link>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">ブログ記事一覧</Link>
          </div>
        </div>
      </div>
    </>
  );
}
