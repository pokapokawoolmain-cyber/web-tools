import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "更新履歴｜ToolBox - 新ツール追加・機能改善ログ",
  description: "ToolBoxの更新履歴です。新ツールの追加、機能改善、バグ修正などの変更を時系列でご確認いただけます。",
  path: "/updates",
});

const siteUrl = getSiteUrl();

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ToolBox", "item": siteUrl },
    { "@type": "ListItem", "position": 2, "name": "更新履歴", "item": `${siteUrl}/updates` },
  ],
};

type UpdateEntry = {
  date: string;
  type: "new" | "improve" | "fix" | "blog";
  title: string;
  body: string;
  href?: string;
};

const UPDATES: UpdateEntry[] = [
  {
    date: "2026-06-04",
    type: "new",
    title: "カラーツールカテゴリ追加（4ツール）",
    body: "HEX・RGB・HSL変換ツール、カラーパレット生成ツール、CSSグラデーション生成ツール、コントラストチェッカーを新たに追加しました。",
    href: "/color",
  },
  {
    date: "2026-06-04",
    type: "blog",
    title: "カラー関連ブログ記事5本追加",
    body: "HEXとRGBの変換方法、配色の決め方、CSSグラデーションの書き方、コントラスト比とWCAG解説、Webカラーコード基礎の5記事を公開しました。",
    href: "/blog",
  },
  {
    date: "2026-06-02",
    type: "new",
    title: "見積書・工数計算ガイド記事公開",
    body: "見積書の作成方法と工数計算の基礎を解説するブログ記事を追加しました。",
    href: "/blog/estimate-guide",
  },
  {
    date: "2026-06-02",
    type: "new",
    title: "電子印鑑・電子署名 活用ガイド公開",
    body: "電子印鑑・電子署名の違いや法的効力についての解説記事を追加しました。",
    href: "/blog/hanko-create-guide",
  },
  {
    date: "2026-06-02",
    type: "new",
    title: "税務書類PDF作成ガイド公開",
    body: "確定申告・領収書・各種税務書類のPDF化・作成手順についての解説記事を追加しました。",
    href: "/blog/tax-docs-pdf-guide",
  },
  {
    date: "2026-01-15",
    type: "improve",
    title: "全ブログ記事に最終更新日を追加",
    body: "GoogleのFreshness評価を改善するため、全ブログ記事に最終更新日（updatedAt）を追記しました。",
  },
  {
    date: "2025-12-20",
    type: "new",
    title: "冠婚葬祭・文書カテゴリを追加",
    body: "のし紙作成・香典袋作成など冠婚葬祭に特化したツールを新カテゴリとして追加しました。",
    href: "/ceremony",
  },
  {
    date: "2025-12-01",
    type: "new",
    title: "AI文章ツールカテゴリを追加",
    body: "ChatGPT整形・AI文章自然化・X投稿プレビューなど、AI活用に特化したツール群を追加しました。",
    href: "/ai",
  },
  {
    date: "2025-11-15",
    type: "new",
    title: "ビジネス書類カテゴリを追加",
    body: "業務委託契約書・NDA・請求書・見積書・退職届など、各種ビジネス書類の作成ツールを追加しました。",
    href: "/business",
  },
  {
    date: "2025-11-01",
    type: "new",
    title: "ToolBox サービス開始",
    body: "FIRE計算・NISA積立・PDF結合・画像圧縮など、主要ツールをそろえてToolBoxをリリースしました。「すぐ使える・登録不要・ブラウザ完結」をコンセプトに開発しました。",
    href: "/",
  },
];

const TYPE_CONFIG: Record<UpdateEntry["type"], { label: string; color: string }> = {
  new: { label: "新機能", color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  improve: { label: "改善", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  fix: { label: "バグ修正", color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  blog: { label: "ブログ", color: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function UpdatesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <nav aria-label="パンくずリスト" className="mb-4 text-sm text-slate-500">
              <ol className="flex items-center gap-1">
                <li><Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">ToolBox</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 dark:text-slate-300">更新履歴</li>
              </ol>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              📋 更新履歴
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px]">
              新ツールの追加・機能改善・バグ修正などの変更履歴です
            </p>
            {/* タイプ凡例 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(Object.entries(TYPE_CONFIG) as [UpdateEntry["type"], typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([, v]) => (
                <span key={v.label} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${v.color}`}>
                  {v.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* タイムライン */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="relative">
            {/* 縦線 */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-zinc-800 hidden sm:block" />

            <div className="space-y-6">
              {UPDATES.map((entry, i) => {
                const tc = TYPE_CONFIG[entry.type];
                return (
                  <div key={i} className="sm:pl-10 relative">
                    {/* ドット */}
                    <div className="absolute left-0 top-4 hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border-2 border-slate-200 dark:border-zinc-700" />

                    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-slate-200 dark:hover:border-zinc-700 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <time className="text-[12px] text-slate-400 dark:text-zinc-500 font-mono">
                          {formatDate(entry.date)}
                        </time>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${tc.color}`}>
                          {tc.label}
                        </span>
                      </div>
                      <h2 className="text-[15px] font-bold text-slate-800 dark:text-zinc-200 mb-1">
                        {entry.href ? (
                          <Link href={entry.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {entry.title}
                          </Link>
                        ) : entry.title}
                      </h2>
                      <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {entry.body}
                      </p>
                      {entry.href && (
                        <Link
                          href={entry.href}
                          className="inline-flex items-center gap-1 mt-2 text-[12px] text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          詳細を見る →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* フッター */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap gap-4 text-[13px]">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← トップページへ</Link>
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">ToolBoxについて</Link>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">ブログ記事一覧</Link>
          </div>
        </div>
      </div>
    </>
  );
}
