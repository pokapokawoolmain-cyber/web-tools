// ========================================
// FIREシミュレーターページ
// SEO: "FIRE シミュレーター" "FIRE 計算" で上位狙い
// ========================================
import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { FireSimulator } from "./FireSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "FIREシミュレーター",
  "現在の資産・毎月の積立・生活費を入力するだけでFIRE達成年数と必要資産額を計算。",
  "fire-simulator",
  ["FIRE計算", "早期退職", "経済的自由", "4%ルール", "資産運用", "セミリタイア"]
);

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      FIREシミュレーターの使い方
    </h2>
    <p>
      FIREとは「Financial Independence, Retire Early（経済的自立と早期退職）」の略です。本ツールでは、現在の資産額・毎月の積立金額・年間生活費・運用利回りを入力するだけで、FIRE達成までの年数と必要資産額を計算できます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      4%ルールとは？
    </h3>
    <p>
      「年間生活費の25倍の資産があれば、毎年4%ずつ取り崩しても資産が尽きない」という米国のトリニティ研究をもとにした考え方です。例えば年間生活費が300万円なら、7,500万円の資産がFIREの目安となります。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      注意点
    </h3>
    <p>
      本シミュレーターは参考値です。実際の運用成績は変動し、インフレや税金の影響を受けます。投資判断は自己責任でお願いします。
    </p>
  </div>
);

export default function FireSimulatorPage() {
  return (
    <ToolLayout
      title="FIREシミュレーター"
      description="現在の資産・積立額・生活費を入力するだけ。FIRE達成年数と必要資産額を即計算します。"
      icon="🔥"
      seoContent={seoContent}
    >
      <FireSimulator />
    </ToolLayout>
  );
}
