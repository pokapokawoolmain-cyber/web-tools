import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { FurusatoSimulator } from "./FurusatoSimulator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "ふるさと納税シミュレーター",
  "年収と家族構成を選ぶだけで控除上限額を即計算。自己負担2,000円でお得に活用できる金額がわかる。",
  "furusato-simulator",
  ["ふるさと納税 シミュレーション", "控除額計算", "控除上限", "年収別", "家族構成", "2000円負担"]
);

const seoContent = (
  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">ふるさと納税の仕組み</h2>
    <p>ふるさと納税は、応援したい自治体に寄附することで、寄附額から2,000円を引いた金額が所得税・住民税から控除される制度です。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">控除上限とは？</h3>
    <p>控除を受けられる金額には上限があり、年収と家族構成によって異なります。上限を超えて寄附しても控除されないため、本ツールで事前に確認することをおすすめします。</p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">ワンストップ特例制度</h3>
    <p>寄附先が5自治体以内であれば、確定申告不要で住民税控除が受けられます。</p>
  </div>
);

export default function FurusatoSimulatorPage() {
  return (
    <ToolLayout
      title="ふるさと納税シミュレーター"
      description="年収と家族構成を選ぶだけで控除上限額を即計算。自己負担2,000円でお得に活用できます。"
      icon="🎁"
      seoContent={seoContent}
    >
      <FurusatoSimulator />
    </ToolLayout>
  );
}
