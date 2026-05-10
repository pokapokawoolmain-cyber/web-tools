import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { SideJobCalculator } from "./SideJobCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "副業利益・税金計算",
  "副業収入と経費を入力するだけで所得税・住民税・手取り額を計算。確定申告の目安に。",
  "side-job-profit",
  ["副業", "税金計算", "確定申告", "所得税", "住民税", "フリーランス", "雑所得"]
);

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      副業と確定申告について
    </h2>
    <p>
      副業による所得（収入−経費）が年間20万円を超えると確定申告が必要です。経費を正しく計上することで税金を合法的に減らせます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      経費になるものの例
    </h3>
    <p>
      副業に使ったPC・スマホ・通信費・書籍代・交通費・セミナー費用などが経費として認められる場合があります。領収書やレシートを保管しましょう。
    </p>
  </div>
);

export default function SideJobProfitPage() {
  return (
    <ToolLayout
      title="副業利益・税金計算"
      description="副業収入から経費・税金を差し引いた実質手取りを計算。確定申告の目安も確認できます。"
      icon="💼"
      slug="side-job-profit"
      seoContent={seoContent}
    >
      <SideJobCalculator />
    </ToolLayout>
  );
}
