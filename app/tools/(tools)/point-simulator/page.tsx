import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { PointSimulator } from "./PointSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "ポイント還元率シミュレーター【2026年版】PayPay・楽天・dカード 年間ポイントを一括比較",
  description: "月の支払い額を入力してPayPay・楽天カード・dカード・au PAY・イオンカードなど主要クレカの年間獲得ポイントを一覧比較。還元率0.5%・1%・1.5%の差が年間いくらになるかをシミュレーション。楽天ペイ2026年改定対応。",
  path: "/tools/point-simulator",
  keywords: [
    "ポイント還元率 比較",
    "クレカ 還元率 計算",
    "PayPay 楽天 比較",
    "ポイント 年間 計算",
    "クレジットカード ポイント シミュレーション",
    "ポイント還元計算",
    "楽天ポイント 計算",
    "dポイント 計算",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ポイント還元率のデータはいつ更新されますか？",
      acceptedAnswer: { "@type": "Answer", text: "主要サービスの基本還元率を参考値として設定しています。各社のキャンペーンや改定に随時対応しますが、最新の還元率は各サービスの公式サイトでご確認ください。" },
    },
    {
      "@type": "Question",
      name: "複数のカードを使い分けた場合の計算はできますか？",
      acceptedAnswer: { "@type": "Answer", text: "現在は1つの還元率を入力して比較する形式です。実際に複数カードを使い分けている場合は、それぞれのカードで月間いくら使うかを個別に入力してシミュレーションしてください。" },
    },
    {
      "@type": "Question",
      name: "獲得したポイントに税金はかかりますか？",
      acceptedAnswer: { "@type": "Answer", text: "ポイントの税務処理は利用状況によって異なります。副業収入の一部として雑所得に含めるケースもあります。年間の獲得ポイントが大きい場合は税理士や税務署にご確認ください。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">主要クレカ・スマホ決済の還元率比較（2026年版）</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">カード・サービス</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">通常還元率</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">月5万円の年間ポイント</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["楽天カード", "1.0%", "6,000P", "楽天市場利用で3.0%〜"],
              ["PayPayカード", "1.0%", "6,000P", "ステップ達成で最大1.5%"],
              ["dカード", "1.0%", "6,000P", "ドコモ利用でポイントアップ"],
              ["三井住友カード（NL）", "0.5%", "3,000P", "対象コンビニ・飲食店で最大7%"],
              ["イオンカード", "0.5%", "3,000P", "イオン系で2倍（1.0%）"],
              ["au PAY カード", "1.0%", "6,000P", "auユーザー向け特典あり"],
              ["リクルートカード", "1.2%", "7,200P", "Pontaポイント/じゃらん連携"],
              ["楽天ペイ（楽天カード払い）", "1.0%", "6,000P", "2026年3月に1.5%→1.0%に改定"],
            ].map(([card, rate, annual, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{card}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{annual}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-400 dark:text-zinc-500 text-[12px]">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">
        ※ 通常還元率は2026年6月時点の基本値です。キャンペーン・会員ランク・利用店舗によって変わります。最新情報は各社公式サイトでご確認ください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">月の支出別・年間ポイント早見表</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">月の支払い額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">還元率0.5%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">還元率1.0%</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">還元率1.5%</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["月3万円", "1,800P", "3,600P", "5,400P"],
              ["月5万円", "3,000P", "6,000P", "9,000P"],
              ["月8万円", "4,800P", "9,600P", "14,400P"],
              ["月10万円", "6,000P", "12,000P", "18,000P"],
              ["月15万円", "9,000P", "18,000P", "27,000P"],
              ["月20万円", "12,000P", "24,000P", "36,000P"],
            ].map(([monthly, r05, r10, r15], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500">{r05}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{r10}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-emerald-600 dark:text-emerald-400 font-medium">{r15}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">還元率の差は年間いくら？</h2>
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">月5万円の支払いの場合</p>
          <p>還元率1%（年間6,000ポイント）と1.5%（年間9,000ポイント）の差は<strong className="text-slate-800 dark:text-zinc-200">年間3,000円</strong>。5年間では15,000円の差になります。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">月10万円の支払いの場合</p>
          <p>還元率1%と1.5%の差は<strong className="text-slate-800 dark:text-zinc-200">年間6,000円</strong>。日常の支払いをまとめるだけで効果が出ます。</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">生活シーン別の使い方</h2>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">スーパー・コンビニ：</strong>Visaタッチ決済に対応しているカードは追加ポイントが付くことが多く、日常の食費で効率よく還元を受けられます。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">ネット通販：</strong>楽天市場では楽天カード、Amazonではアマゾンカードを使うと特定サービス内での還元率が上がります。よく使うECサイトに合わせてカードを選ぶのが効果的です。</span></li>
        <li className="flex gap-2"><span className="text-slate-400 shrink-0">•</span><span><strong className="text-slate-700 dark:text-slate-300">公共料金・定期支払い：</strong>電気・ガス・水道・スマホ料金をクレカ払いにまとめると、毎月自動でポイントが貯まります。</span></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">注意点</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        このシミュレーターは各サービスの基本還元率を使用して計算しています。実際の還元ポイントはキャンペーン・会員ランク・利用上限・特定店舗での特典などによって異なります。シミュレーション結果はあくまで参考値としてご利用ください。最新の還元率や詳細条件は各サービスの公式サイトでご確認ください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "ポイント還元率のデータはいつ更新されますか？", a: "主要サービスの基本還元率を参考値として設定しています。各社のキャンペーンや改定に随時対応しますが、最新の還元率は各サービスの公式サイトでご確認ください。" },
          { q: "複数のカードを使い分けた場合の計算はできますか？", a: "現在は1つの還元率を入力して比較する形式です。実際に複数カードを使い分けている場合は、それぞれのカードで月間いくら使うかを個別に入力してシミュレーションしてください。" },
          { q: "獲得したポイントに税金はかかりますか？", a: "ポイントの税務処理は利用状況によって異なります。副業収入の一部として雑所得に含めるケースもあります。年間の獲得ポイントが大きい場合は税理士や税務署にご確認ください。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function PointSimulatorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="ポイント還元シミュレーター"
        description="月の利用金額を入力するだけ。PayPay・楽天・クレカなど主要サービスの年間獲得ポイントを一括比較。"
        icon="💳"
        slug="point-simulator"
        seoContent={seoContent}
      >
        <PointSimulator />
      </ToolLayout>
    </>
  );
}
