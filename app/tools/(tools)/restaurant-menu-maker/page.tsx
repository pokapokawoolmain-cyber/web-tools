import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { RestaurantMenuMaker } from "./RestaurantMenuMaker";

export const metadata: Metadata = generateMeta({
  title: "メニュー表作成ツール｜飲食店・カフェ向けA4印刷対応【無料】",
  description: "カテゴリ・メニュー名・価格・説明・アレルギー情報を入力してA4メニュー表をPDF保存・印刷。カフェ風・居酒屋風テーマ対応。登録不要・ブラウザ完結。",
  path: "/tools/restaurant-menu-maker",
  keywords: ["メニュー表 作成 無料", "飲食店 メニュー表 A4", "メニュー 印刷 無料", "カフェ メニュー表 テンプレ"],
});

const seoContent = (
  <div className="space-y-6">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">メニュー表作成ツールの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        カテゴリ（ドリンク・フード・デザートなど）を作成し、各メニューの名前・価格・説明文・アレルギー情報・テイクアウト可否を入力してください。
        完成したらテーマを選んで「印刷・PDF保存」ボタンでA4のメニュー表として出力できます。
      </p>
      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/50">
        <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">印刷のコツ</p>
        <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <li>・ブラウザの印刷ダイアログで「背景のグラフィック」をオンにすると色が正確に印刷されます</li>
          <li>・PDFとして保存する場合は「PDFに保存」を選択してください</li>
          <li>・A4縦で最適化されています。ラミネート加工してテーブルに設置するのに適したサイズです</li>
        </ul>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "アレルギー情報はどう書けばいいですか？", a: "「小麦・卵・乳を含む」「えびを使用した設備で製造」など、含む食材名と注意事項を記載することを推奨します。7大アレルゲン（小麦・そば・卵・乳・落花生・えび・かに）は特に重要です。" },
          { q: "メニュー表の内容は保存されますか？", a: "ブラウザのローカルに保存されます（Chromeなら1〜2週間程度）。重要なデータはPDF出力後に保管することをお勧めします。" },
          { q: "印刷時にフォームや広告が入らないようにできますか？", a: "はい。「印刷・PDF保存」ボタンを押すと、印刷時には入力フォーム・ヘッダー・フッター・広告などは自動的に非表示になり、メニュー表のみが出力されます。" },
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
      title="メニュー表作成ツール"
      description="カテゴリ・メニュー名・価格・説明文・アレルギー情報を入力してA4メニュー表をPDF保存・印刷。カフェ風・居酒屋風テーマ対応。"
      icon="📋"
      slug="restaurant-menu-maker"
      seoContent={seoContent}
    >
      <RestaurantMenuMaker />
    </ToolLayout>
  );
}
