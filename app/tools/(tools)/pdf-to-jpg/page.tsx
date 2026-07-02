import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdfToJpg } from "./PdfToJpg";
import { RelatedPdfTools } from "@/components/pdf/RelatedPdfTools";
import { RelatedArticles } from "@/app/tools/_components/RelatedArticles";

export const metadata: Metadata = generateMeta({
  title: "PDF JPG変換ツール【無料・登録不要】PDFを高画質JPG画像に一括変換｜ブラウザ完結",
  description: "無料のPDF JPG変換ツール。PDFの全ページを高画質JPG・画像に一括変換してZIPでダウンロード。インストール・登録不要でブラウザ完結、スマホ（iPhone/Android）・PC対応。ファイルはサーバーに送信されず安全です。",
  path: "/tools/pdf-to-jpg",
  keywords: ["PDF JPG 変換", "pdf jpg 変換 ツール", "無料 pdf jpg 変換 ツール", "PDF 画像 変換 無料", "pdf 画像変換", "pdf 写真変換", "PDF to image", "PDF ページ 画像保存", "PDF JPEG 変換"],
  ogImage: `/api/og?${new URLSearchParams({ title: "PDF→JPG変換", icon: "📄", desc: "PDFページを高画質JPGへ変換。ZIP一括DL対応。" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "PDFからJPG変換は無料ですか？", acceptedAnswer: { "@type": "Answer", text: "完全無料です。登録・インストール不要でブラウザから即利用できます。" } },
    { "@type": "Question", name: "複数ページのPDFも変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。全ページをJPGに変換してZIPファイルでダウンロードできます。" } },
    { "@type": "Question", name: "変換した画像の画質はどのくらいですか？", acceptedAnswer: { "@type": "Answer", text: "高解像度（2倍スケール）でJPGを生成します。テキストや図表がはっきり読み取れる品質です。" } },
    { "@type": "Question", name: "iPhoneでPDFを写真として保存できますか？", acceptedAnswer: { "@type": "Answer", text: "できます。SafariでこのツールにアクセスしてPDFをJPGに変換し、ダウンロード後に「写真に保存」を選ぶと、iPhoneの写真アプリにPDFのページが画像として保存されます。アプリのインストールは不要です。" } },
    { "@type": "Question", name: "アプリのインストールは必要ですか？", acceptedAnswer: { "@type": "Answer", text: "不要です。Chrome・Safari・Edgeなどのブラウザだけで動作します。Adobe Acrobatなどの有料ソフトを購入する必要もありません。" } },
    { "@type": "Question", name: "ファイルはサーバーに送信されますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。処理はすべてブラウザ内で完結します。PDFファイルが外部サーバーに送信されることは一切ありません。" } },
  ],
};

export default function Page() {
  return (
    <>
      <ToolJsonLd slug="pdf-to-jpg" title="PDF→JPG変換ツール" description="PDFページを高画質JPGへ変換。ブラウザ完結・登録不要・ZIPまとめダウンロード対応。" />
      <JsonLd data={faqSchema} />
      <PdfToJpg />
      <div className="max-w-2xl mx-auto px-4 pb-16">

        {/* SEOガイドセクション */}
        <div className="mt-14 space-y-10 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800 pt-10">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PDFをJPGに変換する方法</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>PDFファイルをアップロードエリアにドラッグ＆ドロップ（またはクリックして選択）</li>
              <li>PDFが読み込まれ、全ページのプレビューが表示されます</li>
              <li>変換したいページを選択（全ページ or 個別ページ）</li>
              <li>「JPGに変換」ボタンを押す</li>
              <li>1ページの場合はJPGファイルを直接ダウンロード、複数ページはZIPでまとめてダウンロード</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PDFを画像に変換する用途・よくある使い方</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">具体的なシーン</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["SNS・ブログへの掲載", "PDFの資料や書類を画像に変換してTwitter・InstagramやブログにそのままアップロードしたいときはJPG変換が必要"],
                    ["WordやPowerPointへの挿入", "PDFをJPG化してOffice製品に画像として貼り付けると、レイアウトを崩さずに文書内に組み込める"],
                    ["特定ページだけ保存したい", "複数ページのPDFから必要なページだけを取り出してJPG保存。契約書・カタログの一部を切り取るときに便利"],
                    ["PDFを開けない環境での共有", "PDFビューアがない環境の相手に資料を共有するとき、JPGに変換すれば誰でも表示できる"],
                    ["OCR・AI読み取りの前処理", "スキャンPDFをJPGに変換してからAIやOCRサービスに読ませる場合に使用"],
                    ["メールの添付サイズを小さくしたい", "PDFより圧縮率の高いJPGに変換することでファイルサイズを削減できる場合がある"],
                  ].map(([use, scene], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-slate-700 dark:text-zinc-200">{use}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{scene}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">PDFをJPGに変換する方法の比較</h2>
            <p className="mb-4">
              PDFを画像に変換する方法は複数あります。それぞれの特徴を比較すると、日常的な用途にはブラウザ完結型のオンラインツールが最も手軽です。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">方法</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">料金</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">インストール</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ファイル送信</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">一括変換</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["本ツール（ブラウザ完結）", "無料", "不要", "なし（安全）", "○ ZIP対応"],
                    ["Adobe Acrobat Pro", "月額制（有料）", "必要", "なし", "○"],
                    ["他のオンライン変換サイト", "無料〜", "不要", "サーバー送信あり", "○"],
                    ["スクリーンショット", "無料", "不要", "なし", "×（1画面ずつ）"],
                    ["Macのプレビュー", "無料", "標準搭載", "なし", "×（1ページずつ書き出し）"],
                  ] as string[][]).map(([method, price, install, upload, batch], i) => (
                    <tr key={method} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium ${i === 0 ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-zinc-200"}`}>{method}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{price}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{install}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{upload}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-400">
              一般的なオンライン変換サイトはPDFをサーバーにアップロードして処理しますが、本ツールは<strong className="text-slate-700 dark:text-zinc-200">ブラウザ内（PDF.js）で処理が完結する</strong>ため、契約書や個人情報を含むPDFも外部に送信されません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">JPG変換の画質・解像度について</h2>
            <p>
              このツールはPDFページを<strong>2倍スケール（高解像度）</strong>でJPGに変換します。スクリーン表示用（72dpi）よりも高品質な画像が生成されるため、テキストや表の細部もはっきり読み取れる仕上がりになります。
            </p>
            <p className="mt-3">
              一般的なウェブ表示では72〜96dpiで十分ですが、印刷用途には150〜300dpiが推奨されます。本ツールの2倍スケール出力は画面表示の2倍にあたるため、ウェブ掲載・Office貼り付け・SNS投稿などの用途には十分な品質です。
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px]">
              <p className="font-semibold text-slate-700 dark:text-zinc-200 mb-2">ファイルサイズの目安</p>
              <ul className="space-y-1 text-slate-500 dark:text-zinc-400">
                <li>・A4サイズ（テキスト中心のPDF）→ JPG変換後 約300KB〜1MB/ページ</li>
                <li>・写真・図表が多いPDF → 1〜3MB/ページ程度</li>
                <li>・複数ページはZIPにまとめてダウンロードされます</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">スマホ・PC別の操作ガイド</h2>
            <p className="mb-4">
              このツールはiPhone・Android・PCのいずれのブラウザからも操作できます。デバイスによって操作の細部が異なるので、初めて使う場合は以下を参考にしてください。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                {
                  device: "iPhone（iOS）",
                  steps: [
                    "Safariで本ページを開く",
                    "「ファイルを選択」をタップ",
                    "「ファイル」アプリ → PDFを選択",
                    "変換後、「ダウンロード」をタップ",
                    "「写真に保存」または「ファイルに保存」",
                  ],
                  note: "iCloud DriveやDropbox上のPDFも直接選択できます",
                },
                {
                  device: "Android",
                  steps: [
                    "Chromeで本ページを開く",
                    "「ファイルを選択」をタップ",
                    "「ファイル」アプリからPDFを選択",
                    "変換後、「ダウンロード」をタップ",
                    "端末の「ダウンロード」フォルダに保存",
                  ],
                  note: "Google Driveのファイルも選択可能。ZIP形式でダウンロードされます",
                },
                {
                  device: "PC（Windows/Mac）",
                  steps: [
                    "Chrome/Safari/Edgeで開く",
                    "PDFをドラッグ＆ドロップが最速",
                    "または「ファイルを選択」でPDF選択",
                    "変換後、「ダウンロード」をクリック",
                    "指定フォルダに保存される",
                  ],
                  note: "複数ページはZIPファイルでダウンロードされます",
                },
              ] as { device: string; steps: string[]; note: string }[]).map(({ device, steps, note }) => (
                <div key={device} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-2 text-[14px]">{device}</p>
                  <ol className="space-y-1 text-[12px] text-slate-600 dark:text-zinc-400 list-decimal list-inside">
                    {steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                  <p className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800 rounded-lg px-2 py-1">{note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">変換後によくある問題と対処法</h2>
            <p className="mb-4">
              PDFをJPGに変換したとき、思い通りの結果にならないことがあります。よくある問題と原因・対処法をまとめました。
            </p>
            <div className="space-y-3">
              {([
                {
                  problem: "変換後の画像が真っ白になる",
                  cause: "元PDFが透明なレイヤーや特殊なカラースペース（CMYK等）を使っている場合に発生しやすい",
                  fix: "別の方法（Adobe AcrobatやPreview）でPDFを一度開き直してから保存し直すと解決することがあります。または元ファイルの作成ソフトでRGBカラーに変換して書き出してください。",
                },
                {
                  problem: "テキストがぼやけて読みにくい",
                  cause: "元PDFの解像度が低い、またはフォントが画像として埋め込まれているスキャンPDFの場合に起きやすい",
                  fix: "本ツールは2倍スケールで出力しているため、元PDFの品質以上には改善できません。スキャン品質の高いPDFを使うか、元の文書から直接PDFとして書き出すと品質が向上します。",
                },
                {
                  problem: "変換に時間がかかる・ブラウザが重くなる",
                  cause: "ページ数が多い（50ページ以上）または1ページあたりのデータ量が大きいPDFで発生しやすい",
                  fix: "必要なページだけを選択して変換するか、PDFを分割ツールで必要ページだけ抽出してから変換してください。ブラウザのメモリが不足している場合は他のタブを閉じると改善します。",
                },
                {
                  problem: "日本語・中国語などの文字が文字化けする",
                  cause: "フォントが正しく埋め込まれていないPDFで起きることがある",
                  fix: "本ツールはPDFをそのまま画像化するため、表示されているとおりに変換されます。文字化けが起きている場合はPDF自体の問題です。元のファイル作成ソフトでフォントを埋め込んで再書き出ししてください。",
                },
                {
                  problem: "画像の色が元のPDFと違う",
                  cause: "CMYKカラーのPDFをRGBで表示した場合に色の見え方が変わることがある",
                  fix: "ブラウザはRGBで色を表示するため、印刷用途（CMYK）のPDFは色が多少変わって見えます。印刷用途には元のCMYKデータをそのまま使い、Web用途にのみ本ツールを使うことをおすすめします。",
                },
              ] as { problem: string; cause: string; fix: string }[]).map(({ problem, cause, fix }) => (
                <details key={problem} className="group border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                    <span className="text-[14px] font-medium text-slate-800 dark:text-zinc-100">⚠ {problem}</span>
                    <span className="flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200 text-[12px]">▼</span>
                  </summary>
                  <div className="px-4 py-3 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                    <p className="text-[13px] text-slate-500 dark:text-zinc-400"><span className="font-semibold text-slate-600 dark:text-zinc-300">原因：</span>{cause}</p>
                    <p className="text-[13px] text-slate-600 dark:text-zinc-300"><span className="font-semibold">対処法：</span>{fix}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">JPG・PNG・WebP の違い：どの形式を選ぶべきか</h2>
            <p className="mb-4">
              PDFを画像に変換する際、JPGのほかにPNGやWebP形式を選べる場合があります。用途によって最適な形式が異なります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800">
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">形式</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">特徴</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている用途</th>
                    <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いていない用途</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["JPG（JPEG）", "圧縮率が高くファイルが軽い。色のグラデーションに強い", "SNS投稿・ブログ・Officeへの挿入・メール添付", "文字が多いPDF（圧縮ノイズが出やすい）・透過が必要なとき"],
                    ["PNG", "可逆圧縮で画質劣化ゼロ。透過（透明背景）対応", "テキスト主体のPDF・図表・ロゴ・印刷向け高品質出力", "写真中心のPDF（ファイルが大きくなりがち）"],
                    ["WebP", "JPGとPNGの中間。高品質かつ軽量", "Webサイトへの掲載（表示速度重視）", "古いブラウザやOfficeソフトとの互換性が必要なとき"],
                  ] as string[][]).map(([fmt, feature, good, bad], i) => (
                    <tr key={fmt} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-bold text-blue-600 dark:text-blue-400">{fmt}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{feature}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px] text-slate-600 dark:text-zinc-300">{good}</td>
                      <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px] text-slate-500 dark:text-zinc-500">{bad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-slate-500 dark:text-zinc-400">
              <strong className="text-slate-700 dark:text-zinc-200">迷ったらJPGを選べばOK</strong>です。SNS・ブログ・Office全般に対応しており、互換性が最も高い形式です。テキスト中心の書類でどうしても文字をくっきり見せたい場合はPNGを選んでください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">プライバシーについて</h2>
            <p>
              アップロードしたPDFファイルはサーバーに一切送信されません。すべての処理はブラウザ内のJavaScript（PDF.js）で完結しています。契約書・個人情報が含まれるPDF・機密書類も安心してご利用いただけます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
                <div key={name} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{name}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">関連ツール・記事</h2>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline">
                  JPG→PDF変換ツール｜画像をまとめてPDFに変換
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-merge" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDF結合ツール｜複数PDFを1つにまとめる
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-compress" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDF圧縮ツール｜ファイルサイズを軽量化
                </Link>
              </li>
              <li>
                <Link href="/blog/pdf-to-jpg-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PDFを画像に変換する方法｜スマホ・PC・無料ツール別ガイド
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <RelatedArticles
          toolId="pdf-to-jpg"
          className="pt-10 mb-10 border-t border-slate-200 dark:border-zinc-800"
        />
        <RelatedPdfTools currentHref="/tools/pdf-to-jpg" />
      </div>
    </>
  );
}
