import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";

export const metadata: Metadata = generateMeta({
  title: "手取り年収早見表｜年収別の月収・税金内訳を一覧で確認",
  description: "年収300〜800万円の手取り額を一覧で確認できるカテゴリページ。月収換算・税金内訳・節税方法・生活レベルシミュレーションをまとめました。",
  path: "/salary",
  keywords: ["手取り", "年収 手取り", "手取り早見表", "年収 月収 換算", "給与 税金 計算"],
});

const posts = [
  { slug: "takehome-300", title: "年収300万円の手取り", subtitle: "月20.3万円（年243万）", desc: "手取り率81%。一人暮らし・節税シミュレーション付き" },
  { slug: "takehome-400", title: "年収400万円の手取り", subtitle: "月26.5万円（年318万）", desc: "控除約82万。生活費シミュレーション・独身/家族比較" },
  { slug: "takehome-500", title: "年収500万円の手取り", subtitle: "月32.8万円（年393万）", desc: "平均年収を上回るレンジ。ボーナス手取り計算付き" },
  { slug: "takehome-600", title: "年収600万円の手取り", subtitle: "月38.5万円（年462万）", desc: "独身・既婚別の手取り比較と節税方法を解説" },
  { slug: "takehome-700", title: "年収700万円の手取り", subtitle: "月44万円（年528万）", desc: "控除172万。FIRE積立シミュレーション付き" },
  { slug: "takehome-800", title: "年収800万円の手取り", subtitle: "月49.1万円（年589万）", desc: "所得税65万。節税効果が最大化する年収帯" },
];

export default function SalaryPage() {
  const siteUrl = getSiteUrl();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "手取り年収早見表", item: `${siteUrl}/salary` },
    ],
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
              手取り年収早見表
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
              年収300〜800万円の手取り額・月収換算・税金内訳を年収別に解説。節税方法・生活費シミュレーション・FIRE積立戦略もまとめています。
            </p>
          </header>

          <div className="grid gap-4">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block border border-slate-200 dark:border-zinc-700 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-blue-600 dark:text-blue-400 mb-1">{p.title}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{p.subtitle}</p>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-500">{p.desc}</p>
                  </div>
                  <span className="flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors mt-1">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
            <p className="text-[14px] font-semibold text-slate-700 dark:text-zinc-300 mb-2">全年収の手取り一覧を確認する</p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-500 mb-3">
              年収300〜1,500万円の手取り・税金内訳を一表で確認できます。
            </p>
            <Link
              href="/blog/salary-takehome-table"
              className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              手取り早見表を見る →
            </Link>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">自分の手取りを正確に計算する</p>
            <Link
              href="/tools/net-income"
              className="inline-flex items-center gap-2 text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80 transition-opacity"
            >
              手取り計算ツール（無料）→
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
