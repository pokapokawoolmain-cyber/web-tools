import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { RestaurantPopGenerator } from "./RestaurantPopGenerator";

export const metadata: Metadata = generateMeta({
  title: "POP・店内案内文メーカー｜飲食店向け無料印刷対応",
  description: "本日のおすすめ・期間限定・テイクアウト・臨時休業など10種類のPOP・案内文をその場で作成。A4/A5印刷対応。登録不要・ブラウザ完結。飲食店・カフェ・居酒屋向け無料ツール。",
  path: "/tools/restaurant-pop-generator",
  keywords: ["飲食店 POP 作成 無料", "店内案内 テンプレート", "おすすめ POP 印刷", "臨時休業 案内文", "テイクアウト POP"],
});

const seoContent = (
  <div className="space-y-6">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">POP・案内文メーカーの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        POPの種類を選び、店名・タイトル・本文などを入力してください。プレビューを確認しながらリアルタイムで編集でき、完成したら印刷・PDF保存できます。
      </p>
      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/50">
        <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">印刷のコツ</p>
        <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <li>・ブラウザの印刷ダイアログで「背景のグラフィック」をオンにすると色が正確に印刷されます</li>
          <li>・A4・A5どちらもブラウザの印刷設定でサイズを変更できます</li>
          <li>・ラミネート加工してカウンターや入口に設置するのに最適です</li>
        </ul>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "作成したPOPはどのくらい保存されますか？", a: "ブラウザのローカルストレージに保存されます。ブラウザのキャッシュをクリアするまで保持されますが、重要なPOPはPDFとして保存しておくことをお勧めします。" },
          { q: "A5サイズで印刷したい場合は？", a: "ブラウザの印刷ダイアログで用紙サイズを「A5」に変更してください。「ページに合わせる」オプションをオンにすると自動的にフィットします。" },
          { q: "複数のPOPを作りたい場合は？", a: "POPの種類を切り替えるたびに内容を変更し、その都度「印刷・PDF保存」で出力してください。各種類の内容はブラウザ内に記憶されます。" },
        ].map((faq) => (
          <div key={faq.q} className="bg-slate-50 dark:bg-zinc-900 rounded-lg p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="POP・店内案内文メーカー"
      description="本日のおすすめ・期間限定・テイクアウト・臨時休業など10種類のPOP・案内文をその場で作成。A4/A5印刷対応。"
      icon="📢"
      slug="restaurant-pop-generator"
      seoContent={seoContent}
    >
      <RestaurantPopGenerator />
    </ToolLayout>
  );
}
