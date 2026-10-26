import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import { calcTakehome } from "@/lib/takehome";
import { BottomAd } from "@/components/ads/presets";

export const metadata: Metadata = generateMeta({
  title: "手取り早見表【2026年版】年収200万〜1500万円・月収別の手取りと税金内訳｜年収の壁178万円対応",
  description: "2026年分（令和8年分）の税制で計算した手取り早見表。年収200万〜1500万円の手取り・月収換算・社会保険料・所得税・住民税の内訳、配偶者や子どもがいる場合の手取り、月収25万〜100万円の手取りを一覧で確認できます。",
  path: "/salary",
  keywords: ["手取り 早見表", "年収 手取り", "月収 手取り", "月収 手取り 一覧", "手取り早見表 2026", "年収 月収 換算", "年収1000万 手取り", "年収の壁 178万円", "2026年税制改正 手取り", "年収 手取り 計算 2026"],
});

// 月収（額面・万円）→ 年収×12 → 手取り。ツールと同一ロジック（独身・基礎控除・賞与なし）
const MONTHLY_MAN = [25, 30, 34, 40, 50, 60, 70, 80, 90, 100];

// 年収（額面・万円）の早見表。ツールと同一ロジック（独身・基礎控除のみ・令和8年分）
const ANNUAL_MAN = [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1200, 1500];
// 家族構成別の比較に使う年収（万円）
const FAMILY_MAN = [300, 400, 500, 600, 700, 800, 900, 1000];

const man1 = (yen: number) => (Math.round(yen / 1000) / 10).toFixed(1);
/** 「約X.X万円」。0円のときは「0円」と表示する */
const approxMan1 = (yen: number) => (yen < 500 ? "0円" : `約${man1(yen)}万円`);
const man0 = (yen: number) => Math.round(yen / 10000).toLocaleString();
const rateOf = (net: number, gross: number) => (Math.round((net / gross) * 1000) / 10).toFixed(1);

/** よくある質問（年収別の数字は計算ロジックから生成） */
const FAQ_ITEMS = [300, 500, 700, 1000].map((man) => {
  const r = calcTakehome(man * 10000);
  return {
    q: `年収${man}万円の手取りはいくらですか？`,
    a: `独身・会社員の場合、年間の手取りは約${man0(r.annualNet)}万円、月あたり約${man1(r.monthlyNet)}万円が目安です（2026年分の税制）。社会保険料が約${man0(r.socialInsurance)}万円、所得税が約${man1(r.incomeTax)}万円、住民税が約${man1(r.residenceTax)}万円引かれます。`,
  };
}).concat([
  {
    q: "配偶者や子どもを扶養していると手取りはどれくらい増えますか？",
    a: "配偶者控除（所得税38万円・住民税33万円）や、16歳以上の子どもの扶養控除が使えるため、所得税と住民税が下がります。年収500万円なら配偶者控除で年約5万円、高校生の子どもがいるとさらに約5万円増えるのが目安です。15歳以下の子どもは扶養控除の対象外です。",
  },
  {
    q: "早見表の数字はどの税制で計算していますか？",
    a: "2026年分（令和8年分）の所得税（基礎控除・給与所得控除の引き上げ後）と、同じ所得にかかる住民税、協会けんぽの保険料率（健康保険4.955%・厚生年金9.15%・雇用保険0.55%）で計算した概算です。賞与の有無で年額はほぼ変わりません。",
  },
]);

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <header className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
              手取り年収早見表
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
              年収200万〜1,500万円と月収25万〜100万円の手取り、社会保険料・所得税・住民税の内訳、配偶者や子どもがいる場合の手取り、配偶者の「年収の壁」を、2026年分（令和8年分）の税制でまとめています。
            </p>
          </header>

          {/* 年収別 手取り早見表（年収別の解説記事を統合） */}
          <section id="nenshu-table">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">年収別の手取り早見表（2026年分）</h2>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-4">
              年収（額面）から、手取りと引かれるお金の内訳をまとめました。独身・会社員・基礎控除のみの概算です。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    {["年収", "手取り（年）", "月の手取り", "社会保険料", "所得税", "住民税", "手取り率"].map((h) => (
                      <th key={h} className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ANNUAL_MAN.map((man, i) => {
                    const gross = man * 10000;
                    const r = calcTakehome(gross);
                    return (
                      <tr key={man} id={`nenshu-${man}`} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{man.toLocaleString()}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">約{man0(r.annualNet)}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{man1(r.monthlyNet)}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{man0(r.socialInsurance)}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{approxMan1(r.incomeTax)}</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{approxMan1(r.residenceTax)}</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{rateOf(r.annualNet, gross)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
              年収が上がるほど手取り率が下がるのは、所得税が累進課税で、課税所得が増えるほど高い税率がかかるためです。年収を100万円上げても、手取りの増加はおおむね64〜76万円にとどまります。
            </p>
          </section>

          <section className="mt-12" id="family">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">配偶者・子どもがいる場合の手取り</h2>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-4">
              配偶者控除や扶養控除が使えると、所得税と住民税が下がって手取りが増えます。配偶者は収入なし、子どもは16〜18歳（高校生）として計算しています。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    {["年収", "独身", "配偶者あり", "配偶者＋高校生1人"].map((h) => (
                      <th key={h} className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAMILY_MAN.map((man, i) => {
                    const gross = man * 10000;
                    const single = calcTakehome(gross).annualNet;
                    const spouse = calcTakehome(gross, { hasSpouse: true }).annualNet;
                    const kid = calcTakehome(gross, { hasSpouse: true, generalDependents: 1 }).annualNet;
                    return (
                      <tr key={man} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{man.toLocaleString()}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{man0(single)}万円</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{man0(spouse)}万円（+{man0(spouse - single)}万）</td>
                        <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">約{man0(kid)}万円（+{man0(kid - single)}万）</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
              15歳以下の子どもは扶養控除の対象外のため、手取りは「配偶者あり」と同じです。家族構成を細かく入れて計算するなら
              <Link href="/tools/net-income" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">手取り計算</Link>
              を、目標の手取りから必要な年収を出すなら
              <Link href="/tools/takehome-reverse" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">手取りから年収を逆算</Link>
              を使ってください。
            </p>
          </section>

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
              2026年（令和8年）の税制改正により、所得税の非課税ライン（いわゆる「年収の壁」）が2025年分の160万円（2024年分までは103万円）から
              <strong className="text-slate-700 dark:text-zinc-200">178万円</strong>
              に引き上げられました。給与所得控除と基礎控除の合計が最大178万円となり（年収665万円以下の場合）、
              全給与所得者の約8割が手取り増の恩恵を受けます。このページの早見表もすべて令和8年分の税制で計算しています。
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">項目</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2024年分まで</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2025年分</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">2026年分（令和8年分）</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["所得税の非課税ライン（年収の壁）", "103万円", "160万円", "178万円"],
                    ["基礎控除（最大）", "48万円", "95万円", "104万円"],
                    ["給与所得控除（最低保障額）", "55万円", "65万円", "74万円"],
                  ].map(([item, before, mid, after], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-[13px]">{item}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500 text-[13px]">{before}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500 text-[13px]">{mid}</td>
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

          <section className="mt-12" id="kabe">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">配偶者の収入と「年収の壁」（2026年分）</h2>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-4">
              配偶者がパート・アルバイトで働いている場合に意識したい収入のラインです。税金の金額は国税庁タックスアンサー（No.1191・1195）の令和8年分の基準です。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left whitespace-nowrap">配偶者の給与収入</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">超えると起きること</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["106万円", "賃金要件（月8.8万円）は2026年10月に撤廃。従業員51人以上の勤務先では週20時間以上で社会保険に加入"],
                    ["130万円", "社会保険の扶養から外れ、自分で社会保険（または国民健康保険・国民年金）に加入"],
                    ["136万円", "配偶者控除（38万円）の対象外になり、配偶者特別控除に切り替わる（配偶者の合計所得62万円）"],
                    ["169万円", "配偶者特別控除が満額（38万円）から段階的に減り始める（配偶者の合計所得95万円）"],
                    ["178万円", "配偶者本人に所得税がかかり始める"],
                    ["207万円", "配偶者特別控除がなくなる（配偶者の合計所得133万円）"],
                  ].map(([line, what], i) => (
                    <tr key={line} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium whitespace-nowrap">{line}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-500">
              自分の年収でどの壁を超えるかは
              <Link href="/tools/nenshu-kabe" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">年収の壁シミュレーター</Link>
              で確認できます。
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
            <dl className="space-y-4">
              {FAQ_ITEMS.map((f) => (
                <div key={f.q}>
                  <dt className="text-[14px] font-semibold text-slate-800 dark:text-zinc-200 mb-1">{f.q}</dt>
                  <dd className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

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
