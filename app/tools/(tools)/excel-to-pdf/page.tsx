import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExcelToPdf } from "./ExcelToPdf";

export const metadata: Metadata = generateMeta({
  title: "ExcelをPDFに変換｜.xlsx/.csvを無料でPDF化【登録不要・ブラウザ完結】",
  description: "ExcelファイルをPDFに変換。.xlsx・.xls・.csvをアップロードするだけで即変換。シート選択・用紙向き・フォントサイズを選んでブラウザから直接PDFとして保存。登録不要・無料・ファイルはサーバーに送信されません。",
  path: "/tools/excel-to-pdf",
  keywords: ["excel pdf 変換", "xlsx pdf 変換", "エクセル pdf 変換", "csv pdf 変換", "excel pdf 無料", "スプレッドシート pdf"],
  ogImage: `/api/og?${new URLSearchParams({ title: "Excel→PDF変換", icon: "📊", desc: ".xlsx/.csvをPDFに変換。無料・登録不要・ブラウザ完結。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ExcelファイルをPDFに変換するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: ".xlsx・.xls・.csvファイルをこのツールにアップロードまたはドラッグ＆ドロップすると、ブラウザ上でプレビューが表示されます。シート・用紙向き・フォントサイズを選んで「PDFとして保存する」ボタンを押し、印刷ダイアログで「PDFとして保存」を選んで保存してください。",
      },
    },
    {
      "@type": "Question",
      name: ".xls（旧形式）のExcelファイルは変換できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、.xlsx・.xls・.csvの3形式に対応しています。ただし、.xlsは古い形式のため、一部のセル書式が正しく読み込まれない場合があります。Excelをお持ちの場合は、いったん.xlsxとして保存してからご利用いただくとより正確に変換できます。",
      },
    },
    {
      "@type": "Question",
      name: "複数のシートを1つのPDFにまとめられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。複数シートがある場合、シート選択パネルで含めるシートをチェックボックスで選択できます。選択した全シートが1つのPDFにまとめて出力されます。",
      },
    },
    {
      "@type": "Question",
      name: "ファイルが外部に送信されることはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ありません。変換処理はすべてブラウザ内のJavaScriptで完結します。アップロードしたExcelファイルがサーバーに送信されることは一切ないため、社内データや個人情報を含むスプレッドシートも安心してご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "列が多いシートはどうすればよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "用紙の向きを「横（A4）」に設定することをおすすめします。また、フォントサイズを「小」に設定すると1ページに収まりやすくなります。それでも収まらない場合は、Excel本体で印刷範囲を設定してから変換するとよりきれいに仕上がります。",
      },
    },
    {
      "@type": "Question",
      name: "セルの色やグラフは変換されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "セルの色は一部再現されますが、完全な再現は保証できません。グラフはブラウザ上での変換では対応していないため、グラフを含むシートはグラフ部分が省略されます。グラフを含むファイルの変換にはExcel本体の「名前を付けて保存」でのPDF出力をご利用ください。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-6 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Excel→PDF変換ツールの使い方</h2>
      <ol className="space-y-2 list-decimal list-inside">
        <li>.xlsx・.xls・.csvファイルをアップロードエリアにドラッグ＆ドロップ（またはクリックして選択）</li>
        <li>ブラウザ内でデータが読み込まれ、スプレッドシートのプレビューが表示されます</li>
        <li>複数シートがある場合はPDFに含めるシートをチェックで選択する</li>
        <li>用紙の向き（縦・横）とフォントサイズを調整する</li>
        <li>「PDFとして保存する」ボタンを押す</li>
        <li>印刷ダイアログの「プリンター」欄で「PDFとして保存」を選んで保存</li>
      </ol>
    </section>
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">対応形式と変換内容</h2>
      <ul className="space-y-1 list-disc list-inside">
        <li>.xlsx（Excel 2007以降）・.xls（旧Excel形式）・.csv（カンマ区切り）に対応</li>
        <li>すべてのシートのテキストデータと表形式を変換</li>
        <li>複数シートを1つのPDFにまとめて出力可能</li>
        <li>セルの行列構造・基本的な書式を再現</li>
      </ul>
    </section>
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">再現が難しい要素</h2>
      <p>ブラウザ上での変換のため、以下の書式は完全に再現されない場合があります。</p>
      <ul className="mt-2 space-y-1 list-disc list-inside">
        <li>グラフ・ピボットテーブル（省略されます）</li>
        <li>セルの結合・複雑な書式設定</li>
        <li>条件付き書式・カスタムフォント</li>
        <li>数式の結果は再現されますが、数式自体は表示されません</li>
        <li>画像・オブジェクトの埋め込み</li>
      </ul>
      <p className="mt-3">
        完全な再現が必要な場合は、Microsoft Excel本体で「ファイル → エクスポート → PDFの作成」を使用することをお勧めします。
      </p>
    </section>
  </div>
);

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="Excel→PDF変換"
        description=".xlsx・.xls・.csvファイルをアップロードするだけでPDFに変換。シート選択・用紙向きを選んでブラウザから直接保存できます。"
        icon="📊"
        slug="excel-to-pdf"
        seoContent={seoContent}
      >
        <ExcelToPdf />
      </ToolLayout>
    </>
  );
}
