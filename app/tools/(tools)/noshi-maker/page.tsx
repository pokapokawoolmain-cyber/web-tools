import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { NoshiMaker } from "./NoshiMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "のし紙作成ツール",
  "御祝・内祝・御歳暮など用途別のし紙を無料で作成。水引・名入れ対応。A4印刷・コンビニ印刷対応。登録不要。",
  "noshi-maker",
  ["のし紙 作成 無料", "のし テンプレート 印刷", "無料 のし 印刷", "のし紙 御祝 印刷", "内祝い のし 無料"]
);

export default function NoshiMakerPage() {
  return (
    <ToolLayout
      title="のし紙作成ツール"
      description="御祝・内祝・御歳暮・御中元など用途別ののし紙を無料作成。水引・名入れ対応。A4印刷・コンビニ印刷対応。"
      icon="🎀"
      slug="noshi-maker"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">のし紙の基本知識</h2>
          <p>のし紙は贈り物に掛ける包装紙で、水引（みずひき）と熨斗（のし）が印刷されています。表書き・水引の種類・名前の書き方は用途によって異なります。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">水引の種類と使い分け</h2>
          <p><strong>蝶結び（花結び）</strong>：何度あってもよいお祝い。出産・入学・御祝・御歳暮・御中元など。</p>
          <p><strong>結び切り</strong>：一度きりであってほしいこと。婚礼・快気祝など。</p>
          <p><strong>あわじ結び</strong>：両方に使える格式ある結び。婚礼・弔事にも。</p>
        </div>
      }
    >
      <NoshiMaker />
    </ToolLayout>
  );
}
