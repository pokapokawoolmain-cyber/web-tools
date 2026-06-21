import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { calcTakehome } from "@/lib/takehome";
import { BottomAd } from "@/components/ads/presets";

// 対象月収（万円単位・5万刻み）
const AMOUNTS = [
  20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
  70, 75, 80, 85, 90, 95, 100, 110, 120, 130,
  140, 150, 160, 170, 180, 190, 200,
];

export function generateStaticParams() {
  return AMOUNTS.map((n) => ({ amount: String(n) }));
}

function getAmount(amount: string): number | null {
  const n = Number(amount);
  if (!Number.isInteger(n) || !AMOUNTS.includes(n)) return null;
  return n;
}

type Props = { params: Promise<{ amount: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount } = await params;
  const man = getAmount(amount);
  if (!man) return {};
  const annual = man * 12 * 10000;
  const r = calcTakehome(annual);
  const monthlyNet = Math.round(r.monthlyNet / 10000 * 10) / 10;
  return generateMeta({
    title: `月収${man}万円の手取りはいくら？【${new Date().getFullYear()}年最新】税金・社会保険料の内訳`,
    description: `月収${man}万円（額面）の手取りは約${monthlyNet}万円（年収${man * 12}万円・独身の場合）。所得税・住民税・社会保険料の内訳と節税方法、生活費シミュレーションを解説。`,
    path: `/salary/monthly/${man}`,
    keywords: [
      `月収${man}万 手取り`,
      `月収${man}万円 手取り`,
      `月収${man}万 税金`,
      `月収${man}万 社会保険料`,
      `${man}万 手取り いくら`,
    ],
  });
}

// 生活費シミュレーション（手取り万円ベースの目安）
function getLifeScenario(monthlyNetMan: number): { items: { label: string; amount: string; note: string }[]; summary: string } {
  if (monthlyNetMan < 18) {
    return {
      summary: "一人暮らしは家賃次第。節約を徹底すれば貯蓄もできます。",
      items: [
        { label: "家賃", amount: "〜4万円", note: "シェアハウスや築古物件で抑える" },
        { label: "食費", amount: "2〜3万円", note: "自炊中心で節約可能" },
        { label: "光熱費・通信費", amount: "1.5万円", note: "格安SIMで通信費削減" },
        { label: "貯蓄", amount: "1〜2万円", note: "毎月積み立てを習慣化" },
      ],
    };
  }
  if (monthlyNetMan < 25) {
    return {
      summary: "都市圏での一人暮らしも十分可能。生活費を管理すれば貯蓄も安定します。",
      items: [
        { label: "家賃", amount: "5〜7万円", note: "単身向け1K〜1DK" },
        { label: "食費", amount: "3〜4万円", note: "外食週2〜3回程度" },
        { label: "光熱費・通信費", amount: "1.5〜2万円", note: "スマホ・電気・ガス込み" },
        { label: "貯蓄", amount: "2〜4万円", note: "新NISAへの積立が有効" },
      ],
    };
  }
  if (monthlyNetMan < 35) {
    return {
      summary: "生活に余裕が生まれるレンジ。貯蓄・投資を本格化できます。",
      items: [
        { label: "家賃", amount: "7〜10万円", note: "1LDK〜2DKも視野に" },
        { label: "食費", amount: "4〜5万円", note: "外食も無理なく楽しめる" },
        { label: "趣味・娯楽", amount: "2〜3万円", note: "旅行・習い事もできる" },
        { label: "貯蓄・投資", amount: "5〜8万円", note: "NISAフル活用（月3.3万円〜）" },
      ],
    };
  }
  if (monthlyNetMan < 50) {
    return {
      summary: "家族を養える余裕が出てきます。住宅購入の検討や教育費の積立が現実的に。",
      items: [
        { label: "家賃 or 住宅ローン", amount: "10〜15万円", note: "ローン返済も無理なく可能" },
        { label: "食費（家族含む）", amount: "6〜8万円", note: "外食・デリバリーも取り入れられる" },
        { label: "教育費・保険", amount: "3〜5万円", note: "子どもの習い事・学資保険" },
        { label: "貯蓄・投資", amount: "8〜15万円", note: "FIRE・資産形成を本格化" },
      ],
    };
  }
  return {
    summary: "高収入帯。節税と資産運用が重要です。FIREや不動産投資も視野に。",
    items: [
      { label: "住居費", amount: "15〜25万円", note: "家賃または住宅ローン" },
      { label: "生活費全般", amount: "15〜20万円", note: "外食・旅行も充実" },
      { label: "節税対策", amount: "ふるさと納税・iDeCo最大限", note: "所得が高いほど節税効果大" },
      { label: "投資・資産形成", amount: "20〜30万円以上", note: "NISA・不動産・株式投資" },
    ],
  };
}

export default async function MonthlyTakehomePage({ params }: Props) {
  const { amount } = await params;
  const man = getAmount(amount);
  if (!man) notFound();

  const annual = man * 12 * 10000;
  const r = calcTakehome(annual);
  const monthlyNetMan = Math.round(r.monthlyNet / 10000 * 10) / 10;
  const annualNetMan = Math.round(r.annualNet / 10000);
  const takeRate = Math.round((r.annualNet / annual) * 100);
  const socialManYear = Math.round(r.socialInsurance / 10000);
  const incomeTaxManYear = Math.round(r.incomeTax / 10000);
  const residenceTaxManYear = Math.round(r.residenceTax / 10000);
  const socialMonthly = Math.round(r.socialInsurance / 12 / 1000) / 10;
  const incomeTaxMonthly = Math.round(r.incomeTax / 12 / 1000) / 10;
  const residenceTaxMonthly = Math.round(r.residenceTax / 12 / 1000) / 10;

  const prevMan = AMOUNTS[AMOUNTS.indexOf(man) - 1];
  const nextMan = AMOUNTS[AMOUNTS.indexOf(man) + 1];

  const scenario = getLifeScenario(monthlyNetMan);
  const siteUrl = getSiteUrl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `月収${man}万円の手取りはいくらですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `月収${man}万円（年収${man * 12}万円・独身・基礎控除のみ）の手取りは月約${monthlyNetMan}万円、年収ベースで約${annualNetMan}万円です。所得税・住民税・社会保険料を合計した控除額は約${man * 12 - annualNetMan}万円です。`,
        },
      },
      {
        "@type": "Question",
        name: `月収${man}万円の社会保険料はいくらですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `月収${man}万円の場合、社会保険料（健康保険・厚生年金・雇用保険）は月約${socialMonthly}万円（年間約${socialManYear}万円）です。会社員は会社が同額を負担しており、本人負担は給与の約14.5%が目安です。`,
        },
      },
      {
        "@type": "Question",
        name: `月収${man}万円の所得税・住民税はいくらですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `月収${man}万円の場合、所得税は月約${incomeTaxMonthly}万円（年間約${incomeTaxManYear}万円）、住民税は月約${residenceTaxMonthly}万円（年間約${residenceTaxManYear}万円）です。いずれも独身・基礎控除のみの概算です。`,
        },
      },
      {
        "@type": "Question",
        name: `月収${man}万円で一人暮らしはできますか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `手取り月${monthlyNetMan}万円あれば一人暮らしは十分可能です。家賃は手取りの3分の1以内（${Math.round(monthlyNetMan / 3 * 10) / 10}万円以内）を目安にすると、食費・光熱費・貯蓄のバランスが取りやすくなります。`,
        },
      },
      {
        "@type": "Question",
        name: `月収${man}万円の手取りを増やす方法はありますか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `手取りを増やす主な方法として①ふるさと納税（住民税控除で実質節税）②iDeCo（掛け金全額所得控除）③生命保険料控除の活用④副業収入の経費計上があります。特にiDeCoは所得税・住民税の両方が節税できるため、月収${man}万円帯では積極的に活用する価値があります。`,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "手取り早見表", item: `${siteUrl}/salary` },
      { "@type": "ListItem", position: 3, name: `月収${man}万円の手取り`, item: `${siteUrl}/salary/monthly/${man}` },
    ],
  };

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* パンくず */}
          <nav className="text-[13px] text-slate-400 dark:text-zinc-500 mb-6 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 dark:hover:text-zinc-300">ToolBox</Link>
            <span>›</span>
            <Link href="/salary" className="hover:text-slate-600 dark:hover:text-zinc-300">手取り早見表</Link>
            <span>›</span>
            <span className="text-slate-600 dark:text-zinc-300">月収{man}万円の手取り</span>
          </nav>

          {/* ヘッダー */}
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
              月収{man}万円の手取りはいくら？
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
              月収{man}万円（額面）の手取り・税金・社会保険料の内訳を解説。生活費シミュレーションと節税方法も紹介します。
            </p>
          </header>

          {/* メイン手取り */}
          <div className="mb-10 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">月収{man}万円（額面）の手取り目安</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-blue-700 dark:text-blue-300">月 約{monthlyNetMan}万円</span>
              <span className="text-[15px] text-blue-500 dark:text-blue-400">（手取り率：約{takeRate}%）</span>
            </div>
            <p className="text-[13px] text-blue-600 dark:text-blue-400">年収{man * 12}万円 → 年間手取り約{annualNetMan}万円</p>
            <p className="text-[12px] text-blue-400 dark:text-blue-500 mt-2">
              ※独身・基礎控除のみの概算。扶養・配偶者・副業がある場合は手取り計算ツールで正確に試算できます。
            </p>
          </div>

          {/* 税金・控除の内訳 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">税金・社会保険料の内訳</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right">月額目安</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right">年間合計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">月収（額面）</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right font-semibold">{man}万円</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right font-semibold">{man * 12}万円</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-zinc-900">
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-400">社会保険料（健保・年金・雇用）</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{socialMonthly}万円</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{socialManYear}万円</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-400">所得税（復興税込）</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{incomeTaxMonthly}万円</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{incomeTaxManYear}万円</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-zinc-900">
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-400">住民税</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{residenceTaxMonthly}万円</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right text-red-600 dark:text-red-400">−{residenceTaxManYear}万円</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/30">
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-bold text-slate-900 dark:text-white">手取り（概算）</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right font-bold text-blue-700 dark:text-blue-300 text-base">≒ {monthlyNetMan}万円</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-right font-bold text-blue-700 dark:text-blue-300 text-base">≒ {annualNetMan}万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12px] text-slate-400 dark:text-zinc-500">
              ※概算値（独身・基礎控除のみ）。賞与・扶養・各種控除により実際の金額は変わります。
            </p>
          </section>

          {/* 生活費シミュレーション */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">生活費シミュレーション</h2>
            <p className="text-[14px] text-slate-500 dark:text-zinc-400 mb-5">{scenario.summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.items.map(({ label, amount, note }) => (
                <div key={label} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <p className="text-[12px] text-slate-400 dark:text-zinc-500 mb-0.5">{label}</p>
                  <p className="text-[18px] font-bold text-slate-800 dark:text-zinc-100">{amount}</p>
                  <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 節税ポイント */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">手取りを増やす節税方法</h2>
            <div className="space-y-3">
              {[
                {
                  title: "ふるさと納税",
                  desc: `月収${man}万円の場合、ふるさと納税の控除上限額は年収${man * 12}万円に応じて数万〜数十万円。実質2,000円で特産品がもらえて住民税が減ります。`,
                  link: "/tools/furusato-simulator",
                  linkText: "ふるさと納税シミュレーター",
                },
                {
                  title: "iDeCo（個人型確定拠出年金）",
                  desc: "掛け金が全額所得控除になるため、所得税・住民税の両方が節税できます。会社員なら月最大2.3万円（企業型DCなしの場合）。老後資産形成と節税を同時に。",
                  link: null,
                  linkText: null,
                },
                {
                  title: "新NISA（つみたて投資枠）",
                  desc: "運用益が非課税になる制度。節税効果は投資益に対してのみですが、長期的な資産形成には最も基本的な手段。年間360万円まで非課税で運用できます。",
                  link: "/tools/nisa-calculator",
                  linkText: "NISA積立シミュレーター",
                },
                {
                  title: "生命保険料控除・地震保険料控除",
                  desc: "年間で最大4万円（所得税）の控除になります。すでに保険に加入している場合は年末調整で確実に申告しましょう。",
                  link: null,
                  linkText: null,
                },
              ].map(({ title, desc, link, linkText }) => (
                <div key={title} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">{title}</p>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                  {link && linkText && (
                    <Link href={link} className="inline-block mt-2 text-[12px] text-blue-600 dark:text-blue-400 hover:underline">
                      {linkText} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ツールCTA */}
          <div className="mb-10 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">自分の手取りを正確に計算する</p>
            <p className="text-[14px] text-blue-700 dark:text-blue-300 mb-3">賞与・扶養控除・各種保険料控除を反映した正確な手取りを計算できます。</p>
            <Link
              href="/tools/net-income"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl transition-colors"
            >
              手取り計算ツール（無料）→
            </Link>
          </div>

          {/* よくある質問 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">よくある質問</h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map((item) => (
                <details
                  key={item.name}
                  className="group border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none list-none bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                    <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-100">
                      Q. {item.name}
                    </span>
                    <span className="flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200">▼</span>
                  </summary>
                  <div className="px-5 py-4 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
                    A. {item.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 近い月収へのナビ */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">他の月収の手取りを確認する</h2>
            <div className="flex gap-3 flex-wrap">
              {prevMan && (
                <Link
                  href={`/salary/monthly/${prevMan}`}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                >
                  ← 月収{prevMan}万円
                </Link>
              )}
              {nextMan && (
                <Link
                  href={`/salary/monthly/${nextMan}`}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                >
                  月収{nextMan}万円 →
                </Link>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AMOUNTS.map((n) => (
                <Link
                  key={n}
                  href={`/salary/monthly/${n}`}
                  className={`text-center px-2 py-1.5 rounded-lg text-[12px] border transition-colors ${
                    n === man
                      ? "bg-blue-600 border-blue-600 text-white font-semibold"
                      : "border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  }`}
                >
                  {n}万円
                </Link>
              ))}
            </div>
          </section>

          {/* 関連リンク */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
            <p className="text-[14px] font-semibold text-slate-700 dark:text-zinc-300 mb-3">関連ガイド</p>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/salary" className="text-blue-600 dark:text-blue-400 hover:underline">
                  年収・月収の手取り早見表 一覧
                </Link>
              </li>
              <li>
                <Link href="/blog/shakai-hoken-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  社会保険料の計算方法【年収別早見表】
                </Link>
              </li>
              <li>
                <Link href="/blog/jumin-zei-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  住民税の計算方法【年収別早見表・天引きの仕組み】
                </Link>
              </li>
              <li>
                <Link href="/blog/bonus-takehome" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ボーナスの手取りはいくら？賞与の税金の計算
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <BottomAd />
      </div>
    </>
  );
}
