import type { Metadata } from "next";
import Link from "next/link";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { calcInvoiceTax, DEEMED_PURCHASE_RATES, REDUCED_SPECIAL_DEADLINE, type BusinessCategory } from "@/lib/invoice-tax-simulator";
import { InvoiceTaxSimulator } from "./InvoiceTaxSimulator";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "インボイス税額シミュレーター｜2割特例廃止後は簡易課税と本則課税どちらが得？【無料】",
  description:
    `インボイス「2割特例」は${REDUCED_SPECIAL_DEADLINE}を含む課税期間で終了。廃止後に選ぶべき簡易課税・本則課税の消費税納税額を、売上・経費・業種から自動比較。フリーランス・個人事業主・小規模法人向け。無料・登録不要。`,
  path: "/tools/invoice-tax-simulator",
  keywords: [
    "インボイス 2割特例 廃止",
    "2割特例 いつまで",
    "簡易課税 本則課税 どちらが得",
    "インボイス 消費税 計算",
    "簡易課税 みなし仕入率",
    "消費税 納税額 シミュレーション",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "インボイス税額シミュレーター", icon: "🧾", desc: "2割特例廃止後、簡易課税と本則課税どちらが得？" }).toString()}`,
});

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">{label}</p>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

const CATEGORY_KEYS = Object.keys(DEEMED_PURCHASE_RATES) as BusinessCategory[];

// 早見表：課税売上高500万円・各業種で3方式を比較（標準税率10%）
const SAMPLE_SALES = 5000000;
const COMPARISON_TABLE = CATEGORY_KEYS.map((k) => {
  const r = calcInvoiceTax({ salesTaxIncluded: SAMPLE_SALES, taxRate: 0.1, category: k, purchasesTaxIncluded: 1000000 });
  return { category: k, label: DEEMED_PURCHASE_RATES[k].label, reduced: r.reducedSpecialTax, simplified: r.simplifiedTax, general: r.generalTax };
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "2割特例はいつまで使えますか？", acceptedAnswer: { "@type": "Answer", text: `2割特例は、インボイス制度をきっかけに免税事業者から課税事業者になった事業者向けの時限的な負担軽減措置です。個人事業主の場合は2026年分（令和8年分）の申告、つまり${REDUCED_SPECIAL_DEADLINE}を含む課税期間までが対象で、それ以降は使えなくなります。廃止後は簡易課税か本則課税のいずれかを選ぶ必要があります。` } },
    { "@type": "Question", name: "簡易課税と本則課税はどちらが得ですか？", acceptedAnswer: { "@type": "Answer", text: "経費・仕入が売上に対して少ない業種（サービス業・士業など）は、実額の仕入税額控除が少ないため簡易課税の方が有利になりやすい傾向があります。逆に設備投資や仕入が多い年は、本則課税で実額控除した方が納税額を抑えられることがあります。本ツールで自分の数字を入れて比較するのが確実です。" } },
    { "@type": "Question", name: "簡易課税を選ぶには届出が必要ですか？", acceptedAnswer: { "@type": "Answer", text: "はい。簡易課税制度を適用するには、原則として適用を受けたい課税期間の開始前日までに「消費税簡易課税制度選択届出書」を税務署に提出する必要があります。一度選択すると2年間は本則課税に戻れない縛りがある点にも注意が必要です。" } },
    { "@type": "Question", name: "事業区分（第一種〜第六種）はどう決まりますか？", acceptedAnswer: { "@type": "Answer", text: "簡易課税は営む事業の種類ごとに「みなし仕入率」が決まっています。卸売業90%、小売業80%、製造業等70%、飲食店業等・その他60%、サービス業等50%、不動産業40%です。複数の事業を営む場合は、それぞれの売上を区分して計算します（区分していない場合は最も低い率が適用されるため注意）。" } },
    { "@type": "Question", name: "電子帳簿保存法との関係はありますか？", acceptedAnswer: { "@type": "Answer", text: "電子帳簿保存法は2026年1月から本格的な義務化が始まっており、インボイス（適格請求書）や領収書を電子データで受け取った場合は、原則として電子データのまま保存する必要があります。本則課税を選ぶ場合は特に、仕入税額控除の根拠となるインボイスの保存要件を満たしているか確認しておきましょう。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd
        slug="invoice-tax-simulator"
        title="インボイス税額シミュレーター"
        description={`2割特例（${REDUCED_SPECIAL_DEADLINE}を含む課税期間まで）・簡易課税・本則課税の3方式で消費税の納税額を自動比較します。`}
      />
      <JsonLd data={faqSchema} />
      <InvoiceTaxSimulator />

      <div className="bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pb-20 space-y-6">
          <Block label="2割特例が終わるとどうなるか">
            <p className="mb-3">
              2割特例は、インボイス制度の開始（2023年10月）にあわせて免税事業者から課税事業者になった小規模事業者の負担を一時的に軽くするための特例です。
              納税額を「売上に係る消費税額の<strong className="text-slate-800 dark:text-zinc-200">20%</strong>」というシンプルな計算に抑えられますが、
              個人事業主の場合は<strong className="text-slate-800 dark:text-zinc-200">{REDUCED_SPECIAL_DEADLINE}を含む課税期間分の申告</strong>を最後に終了します。
            </p>
            <p>
              それ以降は、消費税の課税事業者である限り、<strong className="text-slate-800 dark:text-zinc-200">簡易課税</strong>か
              <strong className="text-slate-800 dark:text-zinc-200">本則課税（一般課税）</strong>のいずれかで消費税を計算・納税し続けることになります。
            </p>
          </Block>

          <Block label="3方式の違い（計算式）">
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-[13px] font-medium text-slate-800 dark:text-zinc-200 mb-4 leading-relaxed space-y-1">
              <p>2割特例　＝　売上に係る消費税額 × 20%</p>
              <p>簡易課税　＝　売上に係る消費税額 ×（1 − みなし仕入率）</p>
              <p>本則課税　＝　売上に係る消費税額 − 実際の仕入に係る消費税額</p>
            </div>
            <p>
              簡易課税は業種ごとに決められた「みなし仕入率」で仕入税額控除を概算するため、経費の記帳や計算が簡単になる一方、実際の経費が少ない業種ほど有利になります。
              本則課税はすべての取引を実額で計算するため手間はかかりますが、設備投資などで支出が多い年は納税額を抑えられる可能性があります。
            </p>
          </Block>

          <Block label="業種別・3方式の比較早見表">
            <p className="mb-4">課税売上高500万円・経費100万円（いずれも税込・標準税率10%）で試算した場合の目安です。</p>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                    <th className="text-left font-medium py-2 px-1">事業区分</th>
                    <th className="text-right font-medium py-2 px-1">2割特例</th>
                    <th className="text-right font-medium py-2 px-1">簡易課税</th>
                    <th className="text-right font-medium py-2 px-1">本則課税</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row) => (
                    <tr key={row.category} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0">
                      <td className="py-2.5 px-1 font-medium text-slate-700 dark:text-zinc-300">{row.label}</td>
                      <td className="py-2.5 px-1 text-right">¥{row.reduced.toLocaleString()}</td>
                      <td className="py-2.5 px-1 text-right">¥{row.simplified.toLocaleString()}</td>
                      <td className="py-2.5 px-1 text-right">¥{row.general.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 経費の内容・金額は事業者によって大きく異なります。正確な比較は上のシミュレーターに実際の数字を入力してください。
            </p>
          </Block>

          <Block label="簡易課税を選ぶ際の注意点">
            <ul className="space-y-2.5">
              <li>・<span className="font-semibold text-slate-700 dark:text-zinc-300">事前の届出が必要：</span>適用したい課税期間の開始前日までに「消費税簡易課税制度選択届出書」を提出します。</li>
              <li>・<span className="font-semibold text-slate-700 dark:text-zinc-300">2年間は変更できない：</span>簡易課税を選択すると、原則2年間は本則課税に戻れません。設備投資の予定がある場合は特に注意が必要です。</li>
              <li>・<span className="font-semibold text-slate-700 dark:text-zinc-300">複数事業を営む場合：</span>事業ごとに売上を区分していないと、最も低いみなし仕入率が適用され不利になることがあります。</li>
            </ul>
            <p className="mt-3">
              請求書・領収書の発行には
              <Link href="/tools/invoice-generator" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">請求書作成ツール</Link>
              もあわせてご利用ください。
            </p>
          </Block>

          <Block label="よくある質問">
            <dl className="space-y-4">
              {faqSchema.mainEntity.map((f) => (
                <div key={f.name}>
                  <dt className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">{f.name}</dt>
                  <dd>{f.acceptedAnswer.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">
              ※ 本ツールの計算は概算の目安です。実際の届出の要否・納税額は所轄の税務署または税理士にご確認ください。
            </p>
          </Block>

          <RelatedTools toolId="invoice-tax-simulator" />
          <RelatedArticles toolId="invoice-tax-simulator" />
        </div>
      </div>
    </>
  );
}
