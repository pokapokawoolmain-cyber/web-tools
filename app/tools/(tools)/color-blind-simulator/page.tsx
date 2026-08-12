import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ColorBlindSimulator } from "./ColorBlindSimulator";

export const metadata: Metadata = generateMeta({
  title: "色覚シミュレーター｜配色が色覚多様性でどう見えるか確認【無料】",
  description:
    "選んだ色が、P型・D型・T型・全色盲などの色覚でどのように見えるかをシミュレーション。赤と緑など見分けにくくなる組み合わせを自動で警告します。グラフ・信号・UI配色のアクセシビリティ確認に。登録不要・ブラウザ完結。",
  path: "/tools/color-blind-simulator",
  ogImage: `/api/og?${new URLSearchParams({ title: "色覚シミュレーター", icon: "🎨", desc: "選んだ色がP型・D型・T型などの色覚でどう見えるかをシミ" }).toString()}`,
  keywords: ["色覚 シミュレーター", "色覚多様性 配色", "色弱 見え方 確認", "カラーユニバーサルデザイン", "赤緑 見分け 配色"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "色覚シミュレーターは何に使いますか？", acceptedAnswer: { "@type": "Answer", text: "グラフの色分け・路線図・ボタンの状態表示・注意喚起など、色で情報を伝える場面で、色覚特性のある人にも見分けられるかを確認できます。特に赤と緑の組み合わせは注意が必要です。" } },
    { "@type": "Question", name: "P型・D型・T型とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "色覚特性のタイプです。D型（2型・緑）は日本人男性に最も多く、P型（1型・赤）と合わせると男性の約5%が該当するとされます。T型（3型・青）はまれです。いずれも赤と緑、または青と黄の区別が難しくなる傾向があります。" } },
    { "@type": "Question", name: "見分けにくい配色を避けるには？", acceptedAnswer: { "@type": "Answer", text: "色だけで区別せず、アイコン・テキストラベル・模様・線の太さ・位置などを併用するのが基本です。どうしても色で分ける場合は、明度差を大きくすると区別しやすくなります。" } },
    { "@type": "Question", name: "このシミュレーションは正確ですか？", acceptedAnswer: { "@type": "Answer", text: "研究に基づく変換行列を用いた近似表示です。実際の見え方には個人差があり、程度も人によって異なります。目安として活用し、最終的には当事者の確認やガイドラインの参照をおすすめします。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>グラフやUIで使う色を2〜6色登録する</li>
        <li>通常の見え方と、各色覚型での見え方を並べて比較する</li>
        <li>「見分けにくくなる組み合わせ」の警告を確認し、必要なら色や表現を調整する</li>
      </ol>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">なぜ色だけに頼らないほうがよいか</h2>
      <p>日本人男性の約20人に1人は色覚特性があるとされ、赤と緑の区別が難しいケースが少なくありません。グラフの凡例を色だけで分ける、エラーを赤字だけで示す、といった設計は一定の割合の人に伝わりません。色に加えてアイコンやラベル、模様を添えると、誰にとってもわかりやすくなります。これはカラーユニバーサルデザインの基本的な考え方です。</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・読みやすさを数値で確認する <Link href="/tools/contrast-checker" className="text-violet-600 dark:text-violet-400 hover:underline">コントラスト比チェッカー</Link></li>
        <li>・配色全体を判定する <Link href="/tools/palette-accessibility" className="text-violet-600 dark:text-violet-400 hover:underline">配色アクセシビリティチェッカー</Link></li>
        <li>・パレットを作る <Link href="/tools/color-palette" className="text-violet-600 dark:text-violet-400 hover:underline">カラーパレット生成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="色覚シミュレーター"
        description="選んだ色が各色覚型でどう見えるかを比較。見分けにくくなる組み合わせを自動で警告します。"
        icon="🎨"
        slug="color-blind-simulator"
        seoContent={seoContent}
      >
        <ColorBlindSimulator />
      </ToolLayout>
    </>
  );
}
