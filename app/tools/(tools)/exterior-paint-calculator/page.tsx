import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ExteriorPaintCalculator } from "./ExteriorPaintCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "外壁塗装面積計算ツール｜坪数・間口・奥行から自動計算【無料】",
  description: "建物の間口・奥行・坪数を入力して外壁塗装面積を自動計算。塗料使用量・工事費目安も算出。シリコン・フッ素・ラジカル・無機塗料に対応。登録不要・ブラウザ完結。",
  path: "/tools/exterior-paint-calculator",
  keywords: ["外壁塗装 面積 計算", "外壁 塗料 使用量", "塗装 坪数 計算 無料", "外壁塗装 見積 計算", "外壁塗装 費用 目安", "塗装面積 計算方法"],
});

const seoContent = (
  <div className="space-y-8">
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
    <ToolLayout
      title="外壁塗装面積計算ツール"
      description="間口・奥行・坪数から外壁塗装面積を自動計算。塗料使用量・工事費目安も算出。"
      icon="🏠"
      slug="exterior-paint-calculator"
      seoContent={seoContent}
    >
      <ExteriorPaintCalculator />
    </ToolLayout>
  );
}
