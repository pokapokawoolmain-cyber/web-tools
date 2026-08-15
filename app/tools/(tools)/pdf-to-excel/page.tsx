import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToExcel } from "./PdfToExcel";

export const metadata: Metadata = generateMeta({
  title: "PDFをExcelに変換【無料】表・文字を.xlsxに抽出｜ブラウザ完結・登録不要",
  description:
    "PDFの表や文字を読み取ってExcel（.xlsx）に変換。請求書・明細・名簿などの表をスプレッドシートに書き出せます。処理はすべてブラウザ内で完結し、ファイルはサーバーに送信されません。無料・登録不要・スマホ対応。",
  path: "/tools/pdf-to-excel",
  keywords: [
    "pdf excel 変換",
    "pdf エクセル 変換 無料",
    "pdf 表 excel 変換",
    "pdf xlsx 変換",
    "pdf スプレッドシート 変換",
    "pdf 表 抽出",
    "pdf データ 抽出 excel",
    "pdf エクセル 貼り付け",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF→Excel変換", icon: "📊", desc: "PDFの表・文字を.xlsxに抽出" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFはサーバーにアップロードされますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。変換はすべてお使いのブラウザ内で完結し、PDFファイルが外部サーバーに送信されることは一切ありません。請求書や名簿など、社外に出せない書類も安心して変換できます。" } },
    { "@type": "Question", name: "スキャンしたPDF（画像）も変換できますか？", acceptedAnswer: { "@type": "Answer", text: "できません。スキャンやカメラ撮影のPDFは中身が画像で文字情報を持たないため、テキストとして抽出できません。文字認識（OCR）が必要です。パソコンで作成した文字ベースのPDFが対象です。" } },
    { "@type": "Question", name: "表の列がずれてしまいます。", acceptedAnswer: { "@type": "Answer", text: "PDFは文字と座標の集まりで、表の罫線やセルの構造情報を持ちません。そのため文字のx座標から列を推定しており、罫線が複雑な表や結合セルでは列がずれることがあります。変換後にExcel側で列幅やセルを微調整してご利用ください。" } },
    { "@type": "Question", name: "複数ページのPDFはどうなりますか？", acceptedAnswer: { "@type": "Answer", text: "「ページごとにシート」を選ぶとページ単位でシートが分かれ、「1シートにまとめる」を選ぶと全ページを1枚のシートに連続して書き出します。用途に合わせて選べます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF→Excel変換の使い方</h2>
      <ol className="list-decimal list-outside ml-5 space-y-1.5">
        <li>PDFファイルをドラッグ＆ドロップ（またはクリックして選択）</li>
        <li>シートの分け方（ページごと／1シートにまとめる）を選ぶ</li>
        <li>「Excelに変換する」を押す</li>
        <li>プレビューを確認して、.xlsxファイルをダウンロードする</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">こんなときに便利です</h2>
      <ul className="space-y-1.5">
        <li>・PDFの請求書・明細から、金額や品目をExcelに転記して集計したい</li>
        <li>・名簿・会員リストのPDFを表計算で並べ替え・検索したい</li>
        <li>・PDFの実績表・成績表を、グラフ化のためにスプレッドシートへ移したい</li>
        <li>・手入力での転記ミスや手間をなくしたい</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">安心のブラウザ完結処理</h2>
      <p>
        このツールは、変換処理を<strong>すべてお使いのブラウザ内（端末上）</strong>で行います。PDFファイルが外部のサーバーへアップロードされることは一切ありません。
        取引先の請求書や社員名簿など、外部に出せない機密書類でも安心してご利用いただけます。オンライン変換サービスにありがちな「ファイルを預ける不安」がありません。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">きれいに変換するためのコツと限界</h2>
      <p className="mb-3">
        PDFは「どの位置にどの文字があるか」という情報の集まりで、Word/Excelのような<strong>表やセルの構造情報を持っていません</strong>。
        本ツールは文字の座標から行と列を推定して表を復元しますが、次の点にご注意ください。
      </p>
      <ul className="space-y-1.5">
        <li>・<strong>文字ベースのPDFが対象：</strong>パソコンで作成したPDFは正確に抽出できます。スキャン画像のPDFは文字が無いため変換できません。</li>
        <li>・<strong>単純な表ほど正確：</strong>格子状のシンプルな表はきれいに変換できます。結合セルや複雑な罫線があると列がずれることがあります。</li>
        <li>・<strong>変換後の微調整前提で：</strong>ダウンロードした.xlsxをExcelで開き、列幅やセルを整えると実用的な表になります。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・文章を編集用に取り出す <Link href="/tools/pdf-to-word" className="text-emerald-600 dark:text-emerald-400 hover:underline">PDFをWordに変換</Link></li>
        <li>・逆にExcelをPDFにする <Link href="/tools/excel-to-pdf" className="text-emerald-600 dark:text-emerald-400 hover:underline">Excel→PDF変換</Link></li>
        <li>・PDFのページを画像にする <Link href="/tools/pdf-to-jpg" className="text-emerald-600 dark:text-emerald-400 hover:underline">PDF→JPG変換</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="PDF→Excel変換"
        description="PDFの表や文字を読み取ってExcel（.xlsx）に変換。ブラウザ内で完結し、ファイルは外部に送信されません。"
        icon="📊"
        slug="pdf-to-excel"
        seoContent={seoContent}
      >
        <PdfToExcel />
      </ToolLayout>
    </>
  );
}
