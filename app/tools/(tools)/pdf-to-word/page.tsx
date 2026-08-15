import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToWord } from "./PdfToWord";

export const metadata: Metadata = generateMeta({
  title: "PDFをWordに変換【無料】文章を編集できる文書に｜ブラウザ完結・登録不要",
  description:
    "PDFの文章を読み取って、Wordで編集できる文書に変換。契約書・報告書・原稿などの文字をそのまま編集・再利用できます。処理はすべてブラウザ内で完結し、ファイルはサーバーに送信されません。無料・登録不要・スマホ対応。",
  path: "/tools/pdf-to-word",
  keywords: [
    "pdf word 変換",
    "pdf ワード 変換 無料",
    "pdf 編集 word",
    "pdf 文字 抽出",
    "pdf テキスト 抽出",
    "pdf word 変換 登録不要",
    "pdf 文章 コピー",
    "pdf 編集 無料",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF→Word変換", icon: "📝", desc: "PDFの文章を編集できる文書に" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFはサーバーにアップロードされますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。変換はすべてお使いのブラウザ内で完結し、PDFファイルが外部サーバーに送信されることは一切ありません。契約書や社外秘の資料も安心して変換できます。" } },
    { "@type": "Question", name: "作成されるファイルはWordで開けますか？", acceptedAnswer: { "@type": "Answer", text: "はい。出力は.doc形式で、Microsoft Word・Googleドキュメント・Mac の Pages などで開いて編集できます。文字はテキストとして取り込まれるため、そのまま修正・再利用できます。" } },
    { "@type": "Question", name: "元のPDFのレイアウトはそのまま再現されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。本ツールは文章（テキスト）を編集できる形で取り出すことを目的としています。段組み・画像・図表の細かな配置や書式は再現されません。レイアウトを保ったまま見たい場合は、PDFのまま閲覧するか画像への変換をご利用ください。" } },
    { "@type": "Question", name: "スキャンしたPDF（画像）も変換できますか？", acceptedAnswer: { "@type": "Answer", text: "できません。スキャンやカメラ撮影のPDFは中身が画像で文字情報を持たないため、テキストとして抽出できません。文字認識（OCR）が必要です。パソコンで作成した文字ベースのPDFが対象です。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF→Word変換の使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>PDFファイルをドラッグ＆ドロップ（またはクリックして選択）</li>
        <li>必要に応じて「ページごとに改ページ」を選ぶ</li>
        <li>「Wordに変換する」を押す</li>
        <li>プレビューを確認して、Word文書（.doc）をダウンロードする</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">こんなときに便利です</h2>
      <ul className="space-y-1.5">
        <li>・PDFで受け取った契約書や報告書の文章を、一部だけ修正して使いたい</li>
        <li>・過去のPDF資料の文章を、新しい文書に再利用したい</li>
        <li>・PDFの原稿からテキストを取り出して、翻訳や校正にかけたい</li>
        <li>・コピーできないと思っていたPDFの文章を編集できる形にしたい</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">安心のブラウザ完結処理</h2>
      <p>
        変換処理は<strong>すべてお使いのブラウザ内（端末上）</strong>で行われ、PDFファイルが外部サーバーへ送信されることは一切ありません。
        契約書・見積書・社内文書など、外部に預けたくない書類でも安心して変換できます。会員登録やインストールも不要です。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">できること・できないこと</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">対応</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["文章（テキスト）の抽出・編集", "◎ 得意。段落を保って取り出します"],
              ["文字ベースのPDF", "◎ 正確に変換できます"],
              ["スキャン画像のPDF", "× 文字情報が無く変換できません（OCRが必要）"],
              ["レイアウト・段組みの再現", "△ 再現されません（文章の取り出しが目的）"],
              ["画像・図表の配置", "× 再現されません"],
            ].map(([item, ok], i) => (
              <tr key={item as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{ok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・表を抜き出して集計する <Link href="/tools/pdf-to-excel" className="text-sky-600 dark:text-sky-400 hover:underline">PDFをExcelに変換</Link></li>
        <li>・逆にWordをPDFにする <Link href="/tools/word-to-pdf" className="text-sky-600 dark:text-sky-400 hover:underline">Word→PDF変換</Link></li>
        <li>・PDFのページを画像にする <Link href="/tools/pdf-to-jpg" className="text-sky-600 dark:text-sky-400 hover:underline">PDF→JPG変換</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="PDF→Word変換"
        description="PDFの文章を読み取ってWordで編集できる文書に変換。ブラウザ内で完結し、ファイルは外部に送信されません。"
        icon="📝"
        slug="pdf-to-word"
        seoContent={seoContent}
      >
        <PdfToWord />
      </ToolLayout>
    </>
  );
}
