import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "仕事・副業";
const SLUG = "work";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "仕事・副業の無料ツール｜履歴書・職務経歴書作成",
  description: "履歴書・職務経歴書をフォームに入力するだけで自動作成。転職・就活・バイト探しに使える無料ツール。登録不要・ブラウザ完結。",
  path: `/tools/${SLUG}`,
  keywords: ["履歴書 作成 無料", "職務経歴書 テンプレート", "転職 書類", "就活 履歴書"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">このカテゴリのツール</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            name: "履歴書・職務経歴書作成",
            use: "フォームに経歴・スキル・自己PRを入力するだけで、そのまま印刷できる書類が完成。転職・就活・アルバイト応募に。",
          },
        ].map(({ name, use }) => (
          <div key={name} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">{name}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">履歴書・職務経歴書の書き方</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>転職活動で最初に必要になるのが書類作成です。Wordテンプレートをダウンロードして書式を調整して…という手順は意外と時間がかかります。ToolBoxの履歴書作成ツールはフォームに入力するだけで書類の体裁を整えるので、内容を考えることだけに集中できます。</p>
        <p>職務経歴書では「何をしたか」よりも「どんな成果が出たか」を数字で示すと採用担当者に伝わりやすくなります。例えば「営業担当として売上に貢献した」より「新規顧客獲得数を前年比120%に伸ばした」と書く方が具体的です。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よく使われる場面</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "転職活動", desc: "複数社への応募書類を素早く準備" },
          { label: "就職活動", desc: "エントリーシートと並行して書類作成" },
          { label: "アルバイト", desc: "バイト先に提出する簡易履歴書を作成" },
        ].map(({ label, desc }) => (
          <div key={label} className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3 text-center">
            <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">{label}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "入力した個人情報はどこかに保存されますか？", a: "ブラウザ内にのみ保存されます（localStorageの仕組みを利用）。入力した情報が外部サーバーに送信されることはありません。ブラウザの履歴やキャッシュを消せばデータも消去されます。" },
          { q: "印刷すると書式が崩れることはありますか？", a: "A4印刷に最適化しています。ブラウザの印刷プレビューで「背景のグラフィック」をONにして、余白を「なし」または「小」に設定すると見やすく印刷できます。" },
          { q: "職務経歴書と履歴書の違いは？", a: "履歴書は学歴・職歴・資格などを年月順に記載する書類で、多くの企業で「書式指定あり」のことが多いです。職務経歴書は仕事の内容・実績・スキルを詳しく記載する書類で、書式は自由です。転職では両方必要なことが多いです。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="履歴書・職務経歴書をフォームに入力するだけで自動作成。転職・就活・アルバイト応募に使える無料ツール。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
