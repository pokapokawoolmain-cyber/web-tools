import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("android-pdf-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["Android PDF 作成", "スマホ 写真 PDF まとめる", "Android 書類 PDF 無料", "Android PDF 複数枚", "書類スキャン Android"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「Androidスマホで書類を撮影してPDFにしたい」「複数の写真を1つのPDFファイルにまとめて提出したい」——iPhoneと違ってAndroidはOS標準でPDF変換できない機種も多いです。アプリ不要でブラウザだけで完結する方法を手順通りに解説します。
      </p>

      {/* 結論 CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 今すぐPDFに変換する</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">複数枚対応・登録不要・Androidブラウザで完結</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>こんな場面で役立ちます</h2>
      <ul className="space-y-1">
        <li>確定申告の領収書・レシートをまとめてPDF提出したい</li>
        <li>書類をスキャン代わりにスマホで撮影してPDFにしたい</li>
        <li>複数の写真（契約書・明細書など）を1ファイルにしてメール送信したい</li>
        <li>マイナンバーカード・保険証をPDFにして提出書類に添付したい</li>
        <li>PDFを求められているのに手元にスキャナーがない</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【基本手順】写真1〜複数枚をPDFにまとめる</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "書類・写真を撮影する",
            body: "Androidのカメラアプリで変換したい書類を撮影します。明るい場所で書類を平らに置き、真上から撮ると文字が読みやすくなります。影が入らないよう注意してください。",
          },
          {
            step: "②",
            title: "ToolBoxJPの画像→PDFツールをブラウザで開く",
            body: "Chromeなどのブラウザで「ToolBoxJP 画像PDF」と検索するか、/tools/jpg-to-pdf に直接アクセスします。",
          },
          {
            step: "③",
            title: "写真ファイルをアップロード",
            body: "「ファイルを選択」をタップしてカメラロールから写真を選びます。複数枚まとめて選択すれば、1回の操作で全ページ分をアップロードできます。",
          },
          {
            step: "④",
            title: "ページ順を並べ替える",
            body: "アップロードした画像の順番を確認し、PDFのページ順になるように並べ替えます。ドラッグ操作でページ順を変更できます。",
          },
          {
            step: "⑤",
            title: "「PDFに変換」を押してダウンロード",
            body: "「PDF変換」ボタンを押すと数秒で処理されます。完成したPDFはダウンロードフォルダに保存されます。Gmailやクラウドストレージに直接送ることもできます。",
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
      <h2>既存PDFと写真を1つにまとめたい場合</h2>

      <p>
        「すでにPDFがある書類」と「スマホで撮影した写真」を合わせて1つのPDFにしたいケースもあります。その場合は2段階で対応します。
      </p>

      <div className="space-y-3 my-4">
        {[
          { step: "1", text: "写真をPDFに変換（画像→PDFツールで）" },
          { step: "2", text: "できた複数のPDFをPDF結合ツールで1ファイルにまとめる" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 border border-slate-200 dark:border-zinc-700">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">{step}</span>
            <p className="text-[14px] text-slate-700 dark:text-zinc-200">{text}</p>
          </div>
        ))}
      </div>

      <div className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
        <p className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300 mb-2">PDF結合ツールはこちら</p>
        <Link href="/tools/pdf-merge" className="text-[15px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          PDF結合ツール → 無料で使う →
        </Link>
        <p className="text-[12px] text-slate-500 dark:text-zinc-500 mt-1">複数PDFを1ファイルにまとめる・順番変更可</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>用途別のポイント</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使い方</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["確定申告の提出書類", "領収書・医療費明細は1枚ずつ撮影し複数ページのPDFにまとめて提出"],
              ["賃貸・行政書類の提出", "書類の向きを統一して撮影。傾きが気になる場合はPDF回転ツールで修正"],
              ["スキャン代わり（書類保管）", "A4書類は書類全体が入るよう離れて撮影。画質高めで撮っておくと文字が潰れない"],
              ["保険証・マイナンバーカード", "カード全体が枠内に収まるよう撮影。個人情報なのでPDF化後の管理に注意"],
            ].map(([use, point], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 複数枚まとめてPDF化</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">ページ並び替え・A4サイズ対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li>
          <strong>PDFの向きが横になる場合</strong>：スマホを横向きにして撮影した写真は、PDFでも横向きになります。<Link href="/tools/pdf-rotate" className="text-blue-600 dark:text-blue-400 hover:underline">PDF回転ツール</Link>で向きを修正できます。
        </li>
        <li>
          <strong>画像のファイルサイズが大きい場合</strong>：1枚数MBの高解像度写真は、PDF変換前に<Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline">画像圧縮ツール</Link>で圧縮しておくとPDFが軽くなります。
        </li>
        <li>
          <strong>文字が読みにくくなる場合</strong>：暗い場所や影がかかった状態で撮影すると文字が潰れます。蛍光灯の下か窓際の自然光が最もきれいに撮れます。
        </li>
        <li>
          <strong>個人情報の取り扱い</strong>：ToolBoxJPはすべてブラウザ上で処理されるため、アップロードした画像はサーバーに保存されません。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/jpg-to-pdf">画像→PDFツール</Link>：写真・JPG・PNGをPDFに変換。複数枚対応。</li>
        <li><Link href="/tools/pdf-merge">PDF結合ツール</Link>：複数のPDFファイルを1つにまとめる。</li>
        <li><Link href="/tools/pdf-rotate">PDF回転ツール</Link>：PDFの向きを修正する。</li>
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：PDF化前に写真を軽くする。</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮ツール</Link>：作成したPDFをさらに軽くする。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/jpg-to-pdf-guide">写真・画像をPDFにまとめる方法【スマホ撮影OK・無料】</Link></li>
        <li><Link href="/blog/iphone-pdf-guide">iPhoneでPDFを編集・加工する方法まとめ【アプリ不要】</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで結合・まとめる方法</Link></li>
        <li><Link href="/blog/pdf-rotate-guide">PDFが横向きになったのを直す方法</Link></li>
        <li><Link href="/blog/image-compress-guide">画像を軽くする方法【JPG・PNG圧縮】</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">📄 無料で今すぐPDF作成</p>
        <Link href="/tools/jpg-to-pdf" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像→PDF変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・Android対応</p>
      </div>

    </BlogLayout>
  );
}
