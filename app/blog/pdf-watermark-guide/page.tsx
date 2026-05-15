import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-watermark-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 透かし 入れる 方法", "PDF ウォーターマーク 無料", "PDF 社外秘 入れる", "PDF DRAFT 透かし", "PDF watermark 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        書類を外部に送る前に「社外秘」「DRAFT」「回覧」などの透かしを入れておくことで、情報の取り扱いを明確にできます。Adobe Acrobatなしでブラウザから無料で追加できます。
      </p>

      <h2>透かし（ウォーターマーク）を入れたい場面</h2>
      <ul className="space-y-2">
        <li>社外に送る書類に「社外秘」「CONFIDENTIAL」を入れたい</li>
        <li>確認中の資料に「DRAFT」「校正中」を入れて差し替えを防ぎたい</li>
        <li>回覧書類に「回覧」「社内限り」を入れたい</li>
        <li>サンプル・見本資料に「SAMPLE」を入れたい</li>
        <li>著作権を示すために制作者名・社名を入れたい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFに透かしを入れる手順</h2>

      <h3>① PDF透かし追加ツールにアクセスする</h3>
      <p>
        <Link href="/tools/pdf-watermark">PDF透かし追加ツール</Link>をブラウザで開きます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」でPDFを読み込みます。
      </p>

      <h3>③ 透かしのテキストと設定を選ぶ</h3>
      <p>
        プリセット（社外秘・CONFIDENTIAL・DRAFT・SAMPLE・回覧など）から選ぶか、独自のテキストを入力します。以下のオプションでカスタマイズできます。
      </p>
      <ul className="space-y-2">
        <li><strong>テキスト</strong>：任意の文字列を入力可能</li>
        <li><strong>フォントサイズ</strong>：大きさを調整</li>
        <li><strong>色</strong>：赤・グレー・青など</li>
        <li><strong>透明度</strong>：5〜80%で調整（文書を読みやすいまま表示）</li>
        <li><strong>角度</strong>：斜め（45°）や水平（0°）など</li>
        <li><strong>位置</strong>：中央・対角線状に繰り返しなど</li>
      </ul>

      <h3>④ ダウンロードする</h3>
      <p>
        設定が確定したら「透かしを追加する」ボタンを押すと、全ページに透かしが入ったPDFをダウンロードできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>透かしの透明度の設定目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">透明度</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">見え方</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["20〜30%", "薄く見える", "文書を読みやすくしたい場合"],
              ["40〜60%", "中程度", "一般的なビジネス文書"],
              ["70〜80%", "はっきり見える", "注意喚起を強調したい場合"],
            ].map(([alpha, look, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{alpha}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{look}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>透かしと合わせて使えるツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/pdf-password">PDFパスワード設定</Link>：透かし入りPDFにさらにパスワードをかけてセキュリティを強化</li>
        <li><Link href="/tools/pdf-metadata-remover">PDFメタデータ削除</Link>：共有前に作成者名などの個人情報を削除</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮</Link>：透かし追加後にファイルサイズが増えた場合に軽量化</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        処理はすべてブラウザ内で完結します。機密文書を含むPDFがサーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
