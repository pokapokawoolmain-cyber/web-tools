import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ExteriorPaintCalculator } from "./ExteriorPaintCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "外壁塗装 費用計算ツール【無料】坪数・面積から工事費・塗料使用量を自動算出",
  description: "建物の坪数・間口・奥行を入力して外壁塗装の面積・塗料使用量・工事費目安を自動計算。30坪で約80〜130万円、40坪で約110〜170万円が目安。シリコン・フッ素・無機塗料の坪単価比較付き。無料・登録不要。",
  path: "/tools/exterior-paint-calculator",
  keywords: [
    "外壁塗装 費用 計算",
    "外壁塗装 面積 計算",
    "外壁塗装 坪単価",
    "外壁塗装 費用 目安 坪数",
    "塗装 坪数 計算 無料",
    "外壁塗装 見積 計算",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "30坪の家の外壁塗装費用はいくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "30坪（延べ床面積）の場合、外壁面積は約95〜130m²が目安です。シリコン塗料（坪単価4.5〜7万円）で約90〜130万円、フッ素塗料で約120〜160万円が概算です。足場・シーリング・付帯部を含む総額は業者の現地見積で確認してください。" },
    },
    {
      "@type": "Question",
      name: "外壁塗装の塗料はどれを選べばいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "コスパ重視ならシリコン（耐用年数10〜15年）、長期メンテナンスを減らしたいならフッ素（15〜20年）か無機（20〜25年）がおすすめです。ただし高グレードほど初期費用が上がるため、次のメンテナンスまでの年数で比較すると判断しやすいです。" },
    },
    {
      "@type": "Question",
      name: "外壁塗装の面積計算はなぜ坪数と間口・奥行で結果が違いますか？",
      acceptedAnswer: { "@type": "Answer", text: "坪数法は延べ床面積から外壁面積を推定する概算計算のため、建物形状・バルコニー・吹き抜けなどの影響で実測値と差が生じます。より正確な計算には、建物の間口・奥行・階数を入力する方法をご利用ください。" },
    },
    {
      "@type": "Question",
      name: "外壁塗装の費用に含まれないものは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "このツールで算出する工事費は外壁面のみの塗装費です。足場仮設費（3〜10万円）、シーリング（コーキング）打ち替え費、雨樋・軒天・幕板などの付帯部塗装費、高圧洗浄費は別途発生します。総額の目安は算出金額に30〜40%を加算してください。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">外壁塗装 坪数別工事費目安（2026年版）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        シリコン塗料を使用した場合の工事費目安です（足場・高圧洗浄含む・付帯部別途）。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">延べ床面積</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">シリコン（足場込み）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">フッ素（足場込み）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">無機（足場込み）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["20坪（66m²）", "約60〜90万円", "約80〜115万円", "約100〜140万円"],
              ["25坪（83m²）", "約75〜110万円", "約100〜140万円", "約120〜170万円"],
              ["30坪（99m²）", "約90〜130万円", "約120〜160万円", "約145〜200万円"],
              ["35坪（116m²）", "約105〜150万円", "約135〜180万円", "約165〜230万円"],
              ["40坪（132m²）", "約120〜170万円", "約155〜205万円", "約185〜260万円"],
              ["50坪（165m²）", "約145〜210万円", "約190〜255万円", "約230〜320万円"],
            ].map(([size, silicon, fluorine, inorganic], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium text-[13px]">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-blue-600 dark:text-blue-400 text-[13px]">{silicon}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{fluorine}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-[13px]">{inorganic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-2">
        ※ 足場（仮設費）・高圧洗浄含む概算です。付帯部（雨樋・軒天等）・シーリング打ち替えは別途です。地域・業者・建物形状により変動します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">外壁塗装面積計算ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        建物の形状に合わせて3つの計算方法から選択できます。最も簡単なのは「坪数から」の方法で、登記簿や固定資産税通知書に記載の延べ床面積（坪）を入力するだけです。より精密な計算が必要な場合は、実測した間口・奥行を使ってください。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 space-y-2">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">入力例（2階建て・延べ床35坪の場合）</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>・計算方法：坪数から　→　外壁面積：約323m²</li>
          <li>・間口8.5m・奥行7.0m・2階建て　→　外壁面積：約131m²</li>
        </ul>
        <p className="text-xs text-blue-600 dark:text-blue-500">※坪数法と間口・奥行法で結果が異なる場合があります。実際の現場では実測値を優先してください。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくあるケース・注意点</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "面積計算で出た数字と現場の実測が大きく違う", a: "本ツールは概算計算です。実際の外壁塗装では、ベランダ・軒天・雨戸・付帯部などを含む実測が必要です。必ず現地調査を行い、実測値を見積に使用してください。" },
          { q: "坪数と延べ床面積の違いがわからない", a: "1坪≒3.306m²です。登記簿・固定資産税通知書には「延べ床面積（㎡）」で記載されています。坪数に換算する場合は㎡÷3.306で計算できます。" },
          { q: "塗料の使用量が多すぎる気がする", a: "本ツールでは10%のロス係数を加算しています。実際には塗り方・気温・塗料粘度により使用量は変動します。メーカーの仕様書の塗布量を優先してください。" },
          { q: "工事費目安の幅が広すぎる", a: "地域・建物形状・足場費用・シーリング費用・付帯部（雨樋・軒天・幕板等）の有無で大きく変わります。本ツールの工事費目安は壁面のみの概算です。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">外壁塗料グレード比較</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="px-3 py-2 text-left text-slate-700 dark:text-zinc-300 font-semibold rounded-tl-lg">塗料グレード</th>
              <th className="px-3 py-2 text-left text-slate-700 dark:text-zinc-300 font-semibold">耐用年数</th>
              <th className="px-3 py-2 text-left text-slate-700 dark:text-zinc-300 font-semibold">単価目安</th>
              <th className="px-3 py-2 text-left text-slate-700 dark:text-zinc-300 font-semibold rounded-tr-lg">特徴</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {[
              { name: "シリコン系", life: "10〜15年", price: "2,500〜3,500円/m²", note: "コスパ最高。一般住宅の標準グレード" },
              { name: "ラジカル系", life: "12〜15年", price: "3,000〜4,200円/m²", note: "チョーキングを抑制。シリコンとフッ素の中間" },
              { name: "フッ素系", life: "15〜20年", price: "3,500〜5,000円/m²", note: "高耐久。長期コスパが高い" },
              { name: "無機系", life: "20〜25年", price: "4,500〜6,500円/m²", note: "最高耐久。超長期メンテナンスフリーを重視する場合" },
            ].map(({ name, life, price, note }) => (
              <tr key={name} className="bg-white dark:bg-zinc-900">
                <td className="px-3 py-2 font-semibold text-slate-800 dark:text-zinc-200">{name}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-zinc-400">{life}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-zinc-400">{price}</td>
                <td className="px-3 py-2 text-slate-500 dark:text-zinc-500 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ ご注意</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールの計算結果はあくまで概算です。実際の見積・発注には現場実測・現地調査が必須です。建物形状・劣化状況・付帯工事により大幅に変動します。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="外壁塗装 費用計算ツール"
        description="坪数・間口・奥行から外壁塗装面積・塗料使用量・工事費目安を自動計算。坪数別費用早見表付き。"
        icon="🏠"
        slug="exterior-paint-calculator"
        seoContent={seoContent}
      >
        <ExteriorPaintCalculator />
      </ToolLayout>
    </>
  );
}
