import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { IdPhoto } from "./IdPhoto";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "証明写真作成ツール｜履歴書・コンビニ印刷対応【無料・登録不要】",
  description: "履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を作成。L判4枚配置でコンビニ印刷にも対応。無料・登録不要。",
  path: "/tools/id-photo",
  keywords: ["証明写真 作成", "履歴書 写真 作成", "証明写真 コンビニ", "パスポート 写真 作成", "マイナンバー 写真 作成"],
  ogImage: `/api/og?${new URLSearchParams({ title: "証明写真作成", icon: "🪪", desc: "履歴書・マイナンバー・パスポート対応。コンビニ印刷OK。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "証明写真をスマホで作る方法は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールにスマホで撮影した写真をアップロードし、サイズを選択するだけで証明写真を作成できます。登録不要・無料でご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "コンビニ印刷に対応していますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。L判（89×127mm）に4枚配置した画像をダウンロードできます。この画像をコンビニのマルチコピー機でL判印刷することで、証明写真として利用できます。" },
    },
    {
      "@type": "Question",
      name: "履歴書・パスポート・マイナンバーの写真サイズはそれぞれ何ミリですか？",
      acceptedAnswer: { "@type": "Answer", text: "履歴書は縦40×横30mm、パスポートは縦45×横35mm（顔部分34mm以上）、マイナンバーカードは縦45×横35mmです。このツールでは主要なサイズをプリセットから選択できます。" },
    },
    {
      "@type": "Question",
      name: "写真データはサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。すべての処理はブラウザ内で完結します。アップロードした写真がサーバーに送信・保存されることは一切ありません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="id-photo" title="証明写真作成" description="履歴書・マイナンバー・パスポート対応。写真をアップロードするだけで証明写真を自動作成。" />
      <JsonLd data={faqSchema} />
      <IdPhoto />
      <div className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <RelatedArticles toolId="id-photo" />
        </div>
      </div>

      {/* ── SEO補足コンテンツ ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        {/* サイズ一覧 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">証明写真のサイズと使いどころ</h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4">
            サイズを間違えると提出先に差し戻されます。よく使われる4種を整理しておきます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                  <th className="text-left px-3 py-2 font-medium">用途</th>
                  <th className="text-left px-3 py-2 font-medium">サイズ（縦×横）</th>
                  <th className="text-left px-3 py-2 font-medium">備考</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-zinc-300">
                <tr className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="px-3 py-2">履歴書</td>
                  <td className="px-3 py-2">40×30 mm</td>
                  <td className="px-3 py-2">JIS規格の一般的サイズ</td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="px-3 py-2">パスポート</td>
                  <td className="px-3 py-2">45×35 mm</td>
                  <td className="px-3 py-2">顔が縦34mm以上必要</td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="px-3 py-2">マイナンバー</td>
                  <td className="px-3 py-2">45×35 mm</td>
                  <td className="px-3 py-2">6か月以内撮影・背景無地</td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="px-3 py-2">運転免許証</td>
                  <td className="px-3 py-2">30×24 mm</td>
                  <td className="px-3 py-2">更新時は試験場で撮影も可</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* コンビニ印刷の手順 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">コンビニ印刷の具体的な手順</h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-3">
            このツールでL判（89×127 mm）に4枚配置した画像をダウンロードしてから、コンビニのマルチコピー機に持っていきます。
          </p>
          <div className="space-y-3 text-sm text-slate-700 dark:text-zinc-300">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <p className="font-semibold mb-1">セブン-イレブン</p>
              <p>「ネットプリント」アプリで画像を登録→8桁のプリント番号を取得→マルチコピー機で「プリント」→「ネットプリント」→番号入力。L判を選択。料金は白黒30円・カラー40円。</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <p className="font-semibold mb-1">ファミリーマート・ローソン</p>
              <p>「ファミリーマートプリント」または「ローソン・ミニストップのコピー機」アプリをインストール→画像を送信→発行された番号でマルチコピー機から印刷。L判カラー30〜40円。</p>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500">※ 証明写真として使う場合は写真印刷（フォト用紙）を選ぶと画質が上がります。普通紙は安いですが、審査が厳しい書類には不向きです。</p>
          </div>
        </section>

        {/* よくある失敗 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-3">スマホ撮影でありがちな失敗と対策</h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-zinc-400">
            <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span><strong className="text-slate-700 dark:text-zinc-300">背景が透けた・影が映り込んだ</strong>：壁から50cm以上離れて白い壁の前に立つ。曇りの日に窓近くで撮ると影が出にくい。</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span><strong className="text-slate-700 dark:text-zinc-300">顔が暗すぎた</strong>：スマホの明るさ自動調整がうまく働かないことがある。撮影前にスクリーンの顔の部分をタップしてピントと露出を顔に合わせる。</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span><strong className="text-slate-700 dark:text-zinc-300">サイズを間違えた</strong>：このツールは用途ごとのプリセットを選べます。「履歴書用」と「パスポート用」は縦横が逆なので要注意。</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span><strong className="text-slate-700 dark:text-zinc-300">解像度が低すぎた</strong>：スマホカメラは十分な解像度があるので、圧縮済みのSNS画像を使わず、カメラアプリ撮影の元ファイルを使う。</span></li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-4">よくある質問</h2>
          <dl className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">証明写真をスマホで作る方法は？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">このツールにスマホで撮影した写真をアップロードし、サイズを選択するだけで証明写真を作成できます。登録不要・無料でご利用いただけます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">コンビニ印刷に対応していますか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">はい。L判（89×127mm）に4枚配置した画像をダウンロードできます。この画像をコンビニのマルチコピー機でL判印刷することで、証明写真として利用できます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">履歴書・パスポート・マイナンバーの写真サイズはそれぞれ何ミリですか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">履歴書は縦40×横30mm、パスポートは縦45×横35mm（顔部分34mm以上）、マイナンバーカードは縦45×横35mmです。このツールでは主要なサイズをプリセットから選択できます。</dd>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
              <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">写真データはサーバーに保存されますか？</dt>
              <dd className="text-sm text-slate-600 dark:text-zinc-400">いいえ。すべての処理はブラウザ内で完結します。アップロードした写真がサーバーに送信・保存されることは一切ありません。</dd>
            </div>
          </dl>
        </section>

      </div>
    </>
  );
}
