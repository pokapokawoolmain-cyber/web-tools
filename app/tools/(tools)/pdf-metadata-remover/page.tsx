import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfMetadataRemover } from "./PdfMetadataRemover";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";

export const metadata: Metadata = generateMeta({
  title: "PDFメタデータ削除ツール｜作成者・日付を無料で消去【登録不要】",
  description: "PDFに埋め込まれた作成者・作成日・使用ソフト名などのメタデータを削除。共有前のプライバシー保護に。ブラウザ完結・登録不要・無料。",
  path: "/tools/pdf-metadata-remover",
  keywords: ["PDF メタデータ 削除", "PDF 作成者 削除", "PDF 個人情報 削除", "PDF プロパティ 削除", "PDF metadata remover"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDFメタデータ削除", icon: "🧹", desc: "作成者・日付・ソフト名を削除。プライバシー保護。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PDFのメタデータとは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "PDFには文書の内容以外に、タイトル・作成者名・作成日時・使用したソフトウェア名・キーワードなどの「メタデータ」が自動的に記録されます。これらはファイルプロパティから確認できます。" },
    },
    {
      "@type": "Question",
      name: "本文テキストや画像は削除されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。このツールは文書プロパティ（メタデータ）のみを削除します。本文テキスト・画像・レイアウト・注釈などの内容は一切変更されません。" },
    },
    {
      "@type": "Question",
      name: "ファイルは安全ですか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。すべての処理はブラウザ内で完結します。アップロードしたPDFが外部サーバーに送信されることは一切ありません。" },
    },
    {
      "@type": "Question",
      name: "デジタル署名や暗号化は影響を受けますか？",
      acceptedAnswer: { "@type": "Answer", text: "デジタル署名が付いたPDFは、メタデータ削除後に署名が無効になる場合があります。暗号化されたPDFはそのままでは処理できません。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-metadata-remover" title="PDFメタデータ削除ツール" description="PDFの作成者・日付・使用ソフト名などのメタデータを削除。ブラウザ完結・登録不要・無料。" />
      <JsonLd data={faqSchema} />
      <PdfMetadataRemover />
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <RelatedPdfTools currentHref="/tools/pdf-metadata-remover" />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDFに埋め込まれるメタデータの種類</h2>
          <p>
            PDFファイルには文書の内容以外に、ファイルの「素性」を示す情報が自動的に記録されています。WordやAcrobat、Keynoteなど作成ソフトが書き込みます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">メタデータの項目</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">何が分かるか</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["作成者（Author）", "文書を作成したユーザーアカウント名。個人名や社内IDが入っていることがある"],
                  ["作成日時（CreationDate）", "ファイルを最初に作った日付と時刻"],
                  ["更新日時（ModDate）", "最後に保存・変更した日付と時刻"],
                  ["使用ソフト（Creator/Producer）", "「Microsoft Word 2019」「Adobe Acrobat 23.0」などのソフト名とバージョン"],
                  ["会社名（Company）", "Officeソフトの設定から自動入力される組織名"],
                  ["タイトル・サブジェクト・キーワード", "ファイル保存時に設定した文書の説明情報"],
                ] as string[][]).map(([field, what], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200 text-[13px]">{field}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">メタデータが残ったままだと起きるリスク</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <p className="font-semibold text-red-800 dark:text-red-300 text-[14px] mb-1">作成者名から個人が特定される</p>
              <p className="text-[13px] text-red-700 dark:text-red-400">匿名で提出した文書でも、作成者フィールドに本名が入っていると特定されます。アンケートや内部告発書類に注意が必要です。</p>
            </div>
            <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
              <p className="font-semibold text-orange-800 dark:text-orange-300 text-[14px] mb-1">会社名・部署名が競合他社に漏洩する</p>
              <p className="text-[13px] text-orange-700 dark:text-orange-400">提案書をクライアントに送る際、Officeの設定から記録された会社名・部署名が埋め込まれています。競合企業に提案書を見せる際は注意が必要です。</p>
            </div>
            <div className="p-4 rounded-xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20">
              <p className="font-semibold text-yellow-800 dark:text-yellow-300 text-[14px] mb-1">使用ソフトのバージョンから脆弱性が推測される</p>
              <p className="text-[13px] text-yellow-700 dark:text-yellow-400">「Adobe Acrobat 11.0」のように古いバージョンが記録されていると、既知の脆弱性を持つソフトウェアを使っていることが外部に分かります。</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">メタデータの確認方法</h2>
          <p>
            削除前にどんなメタデータが入っているか確認する方法は環境によって異なります。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-2">Windows</p>
              <ol className="text-[13px] space-y-1 list-decimal list-inside text-slate-600 dark:text-zinc-400">
                <li>PDFファイルを右クリック</li>
                <li>「プロパティ」を選択</li>
                <li>「詳細」タブを開く</li>
                <li>作成者・タイトルなどを確認</li>
              </ol>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-2">Mac（プレビュー）</p>
              <ol className="text-[13px] space-y-1 list-decimal list-inside text-slate-600 dark:text-zinc-400">
                <li>プレビューでPDFを開く</li>
                <li>メニュー「ツール」→「インスペクタを表示」</li>
                <li>「書類情報」タブを選択</li>
                <li>作成者・キーワードなどを確認</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">よくある質問</h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{item.name}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
