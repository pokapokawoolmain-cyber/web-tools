import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { calcTakehome } from "@/lib/takehome";
import { BottomAd } from "@/components/ads/presets";

export const metadata: Metadata = generateMeta({
  title: "年収・手取り早見表【2026年税制改正対応】年収の壁178万円・月収50万・年収1000万の手取り一覧",
  description: "2026年税制改正（年収の壁178万円）対応の手取り早見表。年収300〜1000万円・月収25〜100万円の手取りを一覧確認。所得税・住民税・社会保険料の内訳、年収別の増税・減税シミュレーション付き。",
  path: "/salary",
  keywords: ["手取り 早見表", "年収 手取り", "月収 手取り", "月収 手取り 一覧", "手取り早見表 2026", "年収 月収 換算", "年収1000万 手取り", "年収の壁 178万円", "2026年税制改正 手取り", "年収 手取り 計算 2026"],
});

// 月収（額面・万円）→ 年収×12 → 手取り。ツールと同一ロジック（独身・基礎控除・賞与なし）
const MONTHLY_MAN = [25, 30, 34, 40, 50, 60, 70, 80, 90, 100];

const posts = [
  { slug: "takehome-300", title: "年収300万円の手取り", subtitle: "月20.3万円（年243万）", desc: "手取り率81%。一人暮らし・節税シミュレーション付き" },
  { slug: "takehome-400", title: "年収400万円の手取り", subtitle: "月26.5万円（年318万）", desc: "控除約82万。生活費シミュレーション・独身/家族比較" },
  { slug: "takehome-500", title: "年収500万円の手取り", subtitle: "月32.8万円（年393万）", desc: "平均年収を上回るレンジ。ボーナス手取り計算付き" },
  { slug: "takehome-600", title: "年収600万円の手取り", subtitle: "月38.5万円（年462万）", desc: "独身・既婚別の手取り比較と節税方法を解説" },
  { slug: "takehome-700", title: "年収700万円の手取り", subtitle: "月44万円（年528万）", desc: "控除172万。FIRE積立シミュレーション付き" },
  { slug: "takehome-800", title: "年収800万円の手取り", subtitle: "月49.1万円（年589万）", desc: "所得税65万。節税効果が最大化する年収帯" },
  { slug: "takehome-900", title: "年収900万円の手取り", subtitle: "月54.4万円（年653万）", desc: "控除247万。節税シミュレーション付き" },
  { slug: "takehome-1000", title: "年収1000万円の手取り", subtitle: "月60.2万円（年722万）", desc: "税金・社会保険の全内訳。大台の手取り実額" },
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
              年収300〜1000万円の手取り額・月収換算・税金内訳を年収別に解説。節税方法・生活費シミュレーション・FIRE積立戦略もまとめています。
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

          {/* 月収別 手取り早見表（「月収X万 手取り」需要の受け皿） */}
          <section className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">月収別の手取り早見表</h2>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-4">
              月収（額面）から手取りの目安を調べられます。各行をクリックすると税金・節税・生活費シミュレーションの詳細ページへ移動できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">月収（額面）</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">年収換算</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">月の手取り目安</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">手取り率</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_MAN.map((man, i) => {
                    const annual = man * 12 * 10000;
                    const r = calcTakehome(annual);
                    const monthlyManText = (Math.round(r.monthlyNet / 1000) / 10).toFixed(1);
                    const rate = Math.round((r.annualNet / annual) * 100);
                    return (
                      <tr key={man} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">
                          <Link href={`/salary/monthly/${man}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            月収{man}万円
                          </Link>
                        </td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">年収{annual / 10000}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">約{monthlyManText}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
              ※ 独身・基礎控除のみ・賞与なしの月収ベースの概算です。賞与込みの年収で見たい場合や、扶養がある場合は
              <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline">手取り計算ツール</Link>
              で正確に試算できます。
            </p>
          </section>

          {/* 2026年税制改正セクション */}
          <section className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2026年税制改正：年収の壁が178万円に引き上げ</h2>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-4">
              2026年（令和8年）の税制改正により、所得税の非課税ライン（いわゆる「年収の壁」）が従来の103万円から
              <strong className="text-slate-700 dark:text-zinc-200">178万円</strong>
              に大幅引き上げされます。給与所得控除と基礎控除の合計が最大178万円となり（年収665万円以下の場合）、
              全給与所得者の約8割が手取り増の恩恵を受けます。
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">項目</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2025年まで（従来）</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2026年（改正後）</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["所得税の非課税ライン（年収の壁）", "103万円", "178万円"],
                    ["基礎控除（最大）", "48万円", "104万円（特例）"],
                    ["給与所得控除（最低保証）", "55万円", "74万円（特例）"],
                    ["合計控除上限", "103万円", "178万円"],
                  ].map(([item, before, after], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-[13px]">{item}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500 text-[13px]">{before}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-semibold text-[13px]">{after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 text-[13px] text-slate-600 dark:text-zinc-400">
              <p>
                <strong className="text-slate-700 dark:text-zinc-300">いつから適用？</strong>
                　2026年1月1日以降の給与に適用。毎月の源泉徴収は従来通りで、増えた分は
                <strong>2026年12月の年末調整でまとめて還付</strong>されます。
              </p>
              <p>
                <strong className="text-slate-700 dark:text-zinc-300">対象者</strong>
                　年収665万円以下の給与所得者（全給与所得者の約8割）。年収665万円超は段階的に縮小されます。
              </p>
              <p>
                <strong className="text-slate-700 dark:text-zinc-300">社会保険の壁は変わらない</strong>
                　130万円・106万円などの社会保険加入の基準は別制度のため、この改正の影響を受けません。
              </p>
            </div>
          </section>

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
            <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">2026年税制改正後の手取りを正確に計算する</p>
            <p className="text-[12px] text-blue-600 dark:text-blue-500 mb-2">年収・家族構成・各種控除を入力して手取り額を即計算。</p>
            <Link
              href="/tools/net-income"
              className="inline-flex items-center gap-2 text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80 transition-opacity"
            >
              手取り計算ツール（無料）→
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-zinc-800">
            <p className="text-[14px] font-semibold text-slate-700 dark:text-zinc-300 mb-3">手取りを理解するための関連ガイド</p>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/blog/shakai-hoken-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  社会保険料の計算方法【年収別早見表・標準報酬月額】
                </Link>
              </li>
              <li>
                <Link href="/blog/jumin-zei-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  住民税の計算方法【年収別早見表・天引きの仕組み】
                </Link>
              </li>
              <li>
                <Link href="/blog/bonus-takehome" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ボーナスの手取りはいくら？賞与の税金・社会保険料の計算
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ページ下部広告 */}
        <BottomAd />
      </div>
    </>
  );
}
