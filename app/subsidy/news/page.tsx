import type { Metadata } from "next";
import Link from "next/link";
import { getAllNews } from "@/lib/subsidy/fetchNews";
import { NEWS_CATEGORIES, type NewsCategory } from "@/data/subsidyNews";
import { NewsCard } from "@/components/subsidy/NewsCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

export const metadata: Metadata = {
  title: "補助金・助成金 最新情報｜公募開始・締切・制度変更まとめ",
  description:
    "IT導入補助金・ものづくり補助金・持続化補助金など主要補助金・助成金の公募開始、締切情報、制度変更をまとめてお届けします。",
  keywords:
    "補助金 最新情報, 補助金 公募, 助成金 締切, 補助金 制度変更, 補助金 ニュース",
  alternates: { canonical: `${SITE_URL}/subsidy/news` },
  openGraph: {
    title: "補助金・助成金 最新情報",
    description: "公募開始・締切・制度変更をまとめてお届けします。",
    url: `${SITE_URL}/subsidy/news`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ToolBoxJP", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "補助金・助成金診断", item: `${SITE_URL}/subsidy` },
    { "@type": "ListItem", position: 3, name: "最新情報", item: `${SITE_URL}/subsidy/news` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "補助金の公募情報はどこで確認できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "中小企業庁（chusho.meti.go.jp）、各補助金の公式サイト、ミラサポplus（mirasapo-plus.smrj.go.jp）などで確認できます。当ページでも主要な公募情報を随時まとめています。",
      },
    },
    {
      "@type": "Question",
      name: "補助金の締切はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "補助金・助成金によって締切日は異なり、毎年・毎期変わります。当ページで締切間近の情報を随時お知らせしていますが、必ず公式公募要領でご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "補助金の制度変更はどこで分かりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "各省庁・事務局の公式サイト、中小企業庁メールマガジンなどで告知されます。当ページでも制度変更情報をまとめてお届けします。",
      },
    },
  ],
};

const CATEGORY_FILTER_LABELS: { value: string; label: string }[] = [
  { value: "", label: "すべて" },
  ...NEWS_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export default async function SubsidyNewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const selectedCategory = (params["cat"] ?? "") as NewsCategory | "";

  const allNews = await getAllNews();
  const filtered = selectedCategory
    ? allNews.filter((n) => n.category === selectedCategory)
    : allNews;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-10">
        <div className="container-base max-w-3xl">
          <nav
            aria-label="パンくずリスト"
            className="flex items-center gap-1.5 text-[11px] text-blue-400 mb-3"
          >
            <Link href="/" className="hover:text-white transition-colors">
              ToolBoxJP
            </Link>
            <span>/</span>
            <Link href="/subsidy" className="hover:text-white transition-colors">
              補助金診断
            </Link>
            <span>/</span>
            <span className="text-blue-200">最新情報</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            補助金・助成金 最新情報
          </h1>
          <p className="text-blue-100 text-[13px]">
            公募開始・締切・制度変更・採択結果をまとめてお届けします
          </p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
        <div className="container-base max-w-3xl py-2.5 text-[12px] text-amber-800 dark:text-amber-300">
          ⚠️
          当サイトの情報は公的機関等の情報をもとに整理していますが、申請可否・採択・受給を保証するものではありません。申請前には必ず公式サイト・公募要領・管轄窓口をご確認ください。
        </div>
      </div>

      <main className="container-base max-w-3xl py-8 sm:py-10">
        {/* カテゴリフィルター */}
        <section className="mb-8">
          <h2 className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-3">
            カテゴリで絞り込む
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTER_LABELS.map(({ value, label }) => (
              <Link
                key={value}
                href={value ? `/subsidy/news?cat=${encodeURIComponent(value)}` : "/subsidy/news"}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                  selectedCategory === value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* 件数 */}
        <section>
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">
            {selectedCategory ? `「${selectedCategory}」の情報` : "最新情報一覧"}
            <span className="ml-2 text-[14px] font-normal text-slate-400">
              （{filtered.length}件）
            </span>
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="mb-2">該当する情報が見つかりませんでした。</p>
              <Link
                href="/subsidy/news"
                className="text-blue-600 text-[13px] hover:underline"
              >
                絞り込みを解除
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* FAQ section */}
        <section className="mt-12">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-5">よくある質問</h2>
          <div className="space-y-3">
            {faqJsonLd.mainEntity.map((faq, i) => (
              <details
                key={i}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl px-5 py-4 group"
              >
                <summary className="cursor-pointer font-semibold text-[14px] text-slate-800 dark:text-slate-200 list-none flex items-center justify-between gap-2">
                  <span>{faq.name}</span>
                  <span className="text-slate-400 dark:text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 text-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            自分に合う補助金を診断する
          </h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">
            地域・業種・目的など8問で精度の高いマッチング診断
          </p>
          <Link href="/subsidy" className="btn-primary text-[13px]">
            無料診断をはじめる
          </Link>
        </div>
      </main>

      <div className="h-20 sm:hidden" />
    </>
  );
}
