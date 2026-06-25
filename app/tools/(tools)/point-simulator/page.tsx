import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { PointSimulator } from "./PointSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateToolMeta(
  "ポイント還元シミュレーター",
  "PayPay・楽天・dポイントなど主要サービスの還元率を比較。月間・年間の獲得ポイントを一覧計算。",
  "point-simulator",
  ["ポイント還元計算", "クレカ還元率比較", "PayPay還元", "楽天ポイント", "dポイント", "年間ポイント"]
);

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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">年間いくら変わる？</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        還元率の差は小さく見えても、積み重なると大きな差になります。
      </p>
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
