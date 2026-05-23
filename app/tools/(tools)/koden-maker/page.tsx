import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { KodenMaker } from "./KodenMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "香典袋表書きメーカー",
  "御霊前・御仏前・御香典など宗派別に表書きを作成。毛筆風フォント・PDF保存・スマホ完結。",
  "koden-maker",
  ["香典袋 書き方", "表書き 印刷", "御霊前 名前 印刷", "御仏前 書き方", "香典 表書き 無料"]
);

export default function KodenMakerPage() {
  return (
    <ToolLayout
      title="香典袋表書きメーカー"
      description="御霊前・御仏前・御香典など宗派別の香典袋表書きを無料作成。毛筆風フォント対応・PDF保存・スマホ完結。"
      icon="🕯️"
      slug="koden-maker"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">御霊前と御仏前の違い</h2>
          <p><strong>御霊前</strong>：四十九日の法要前まで使います。宗派を問わず広く使えます（浄土真宗を除く）。</p>
          <p><strong>御仏前</strong>：四十九日以降に使います。故人が成仏したあとの意味です。</p>
          <p>宗派がわからない場合は「御霊前」か「御香典」が無難です。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">香典袋に薄墨を使う理由</h2>
          <p>悲しみの涙で墨が薄まった、または急いで墨をすった（準備できなかった）という意味を込めています。現代では薄墨筆ペンが広く普及しています。</p>
        </div>
      }
    >
      <KodenMaker />
    </ToolLayout>
  );
}
