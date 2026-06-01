import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("tax-docs-pdf-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["確定申告 書類 PDF まとめ", "確定申告 領収書 スマホ 撮影", "医療費 領収書 PDF 提出", "e-Tax 添付書類 スマホ", "確定申告 スキャン アプリ不要"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「確定申告の提出に書類のPDFが必要だけどスキャナーがない」「医療費の領収書が大量にあってPDFにまとめたい」——スマホカメラ＋ブラウザだけで書類をPDF化してe-Taxや郵送提出に対応できる手順を解説します。
      </p>

      {/* 結論 CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 今すぐ書類をPDFにまとめる</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">複数枚対応・登録不要・iPhone/Android対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>確定申告でPDFが必要な書類一覧</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">書類の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">提出方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">PDF化のポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["医療費の領収書・明細書", "e-Tax添付 or 郵送", "1枚ずつ撮影→複数枚まとめてPDF化"],
              ["源泉徴収票", "e-Tax添付 or 郵送", "書類全体が入るよう真上から撮影"],
              ["寄付金受領証明書（ふるさと納税）", "e-Tax添付 or 郵送", "ワンストップ特例なら不要"],
              ["生命保険料控除証明書", "e-Tax添付 or 郵送", "小さい書類は A4に複数枚並べて撮影も可"],
              ["社会保険料控除証明書", "e-Tax添付 or 郵送", "国民年金の控除証明書など"],
              ["住宅借入金等特別控除関係書類", "e-Tax添付 or 郵送", "複数年目から省略可の場合あり"],
              ["事業経費の領収書（自営業・副業）", "保管のみ（7年間）", "月ごとまとめてPDF化しクラウド保存"],
            ].map(([doc, method, point], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-[13px]">{doc}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px]">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px] text-slate-500 dark:text-zinc-400">{point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【基本手順】スマホで書類を撮影してPDFにまとめる</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "書類をきれいに撮影する",
            body: "書類を白い机の上に置き、蛍光灯か窓際の自然光で撮影します。影が入らないよう真上から撮ると文字が読みやすくなります。A4書類はスマホを少し離して書類全体が収まるよう撮影してください。",
          },
          {
            step: "②",
            title: "画像→PDFツールをブラウザで開く",
            body: "ToolBoxJPの画像→PDFツール（/tools/jpg-to-pdf）をChromeやSafariで開きます。",
          },
          {
            step: "③",
            title: "複数の写真をまとめてアップロード",
            body: "「ファイルを選択」からカメラロールの写真を複数選択します。医療費領収書なら枚数分の写真をまとめて選べます。",
          },
          {
            step: "④",
            title: "ページ順を確認して変換",
            body: "アップロードした書類の順番を確認します。申告書の見やすい順に並べてから「PDF変換」ボタンを押します。",
          },
          {
            step: "⑤",
            title: "PDFをダウンロードしてe-Taxや郵送に使う",
            body: "完成したPDFをダウンロードします。e-Taxへのアップロードは1ファイル3MB以内が目安なので、サイズが大きい場合は次のステップで圧縮します。",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>e-Tax提出の場合：ファイルサイズを3MB以下に</h2>

      <p>
        e-Taxでは添付ファイルの上限が<strong>1ファイルあたり約3MB</strong>です。スマホで撮影した高解像度写真をそのままPDF化するとサイズが超えることがあります。
      </p>

      <div className="space-y-3 my-4">
        {[
          { step: "1", text: "画像を先に圧縮してからPDF変換（推奨）" },
          { step: "2", text: "PDF変換後にPDF圧縮ツールで軽量化" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 border border-slate-200 dark:border-zinc-700">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">{step}</span>
            <p className="text-[14px] text-slate-700 dark:text-zinc-200">{text}</p>
          </div>
        ))}
      </div>

      <div className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
        <p className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300 mb-2">PDFを軽量化するツール</p>
        <Link href="/tools/pdf-compress" className="text-[15px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF圧縮ツール → 無料で使う
        </Link>
        <p className="text-[12px] text-slate-500 dark:text-zinc-500 mt-1">e-Tax添付用に3MB以下に圧縮</p>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 複数の書類をまとめてPDF化</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">複数枚・ページ並べ替え・A4対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>医療費控除の領収書まとめ方のコツ</h2>

      <div className="my-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-[14px] text-green-800 dark:text-green-300">
        <strong className="block mb-1">✅ 効率的な整理方法</strong>
        <p>病院・薬局ごとにグループ分けして撮影し、1つのPDFにまとめると確認しやすくなります。合計金額のメモ（医療費の明細書）を先頭ページにすると審査が通りやすくなります。</p>
      </div>

      <ul className="space-y-2">
        <li><strong>月別・病院別にまとめる</strong>：「〇〇病院・1〜3月分」などグループ化して撮影すると、後から探しやすい。</li>
        <li><strong>明細書も忘れずに撮影</strong>：領収書だけでなく診療明細書もスキャン。診療内容の確認に使われる場合があります。</li>
        <li><strong>市販薬の領収書は対象外</strong>：市販薬はセルフメディケーション税制の対象になる場合はあるが、通常の医療費控除では対象外です。</li>
        <li><strong>e-Taxでは5年間保管で書類提出免除</strong>：e-Taxで申告した場合、領収書の提出は不要で5年間自宅保管するだけでOKです（提出を求められることもあります）。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li>
          <strong>撮影時の影と傾きに注意</strong>：暗い場所や影がかかった写真は文字が読みにくくなります。傾きが気になる場合は<Link href="/tools/pdf-rotate" className="text-blue-600 dark:text-blue-400 hover:underline">PDF回転ツール</Link>で修正できます。
        </li>
        <li>
          <strong>個人情報の扱い</strong>：ToolBoxJPはすべてブラウザ内で処理されるため、アップロードした書類はサーバーに送信・保存されません。
        </li>
        <li>
          <strong>PDF化後も原本は保管</strong>：PDF化しても紙の原本は法定期間（5〜7年）保管してください。税務調査で原本の提出を求められる場合があります。
        </li>
        <li>
          <strong>既存のPDFと合わせる場合</strong>：電子送付された書類（保険会社からのPDF）とスマホ撮影のPDFを1つにまとめたい場合は<Link href="/tools/pdf-merge" className="text-blue-600 dark:text-blue-400 hover:underline">PDF結合ツール</Link>を使ってください。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/jpg-to-pdf">画像→PDFツール</Link>：スマホで撮影した書類をPDF化。複数枚対応。</li>
        <li><Link href="/tools/pdf-merge">PDF結合ツール</Link>：複数のPDFをまとめて1ファイルに。</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮ツール</Link>：e-Tax添付用にPDFを3MB以下に軽量化。</li>
        <li><Link href="/tools/pdf-rotate">PDF回転ツール</Link>：横向きになったPDFページの向きを修正。</li>
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：PDF変換前に写真を軽くする。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/android-pdf-guide">Androidスマホで写真・書類を複数まとめてPDFにする方法</Link></li>
        <li><Link href="/blog/iphone-pdf-guide">iPhoneでPDFを編集・加工する方法まとめ【アプリ不要】</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで結合・まとめる方法</Link></li>
        <li><Link href="/blog/furusato-limit-by-income">年収別ふるさと納税の上限額早見表</Link></li>
        <li><Link href="/blog/nencho-guide">年末調整のやり方と必要書類まとめ</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 無料で今すぐ書類をPDF化</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・確定申告対応</p>
      </div>

    </BlogLayout>
  );
}
