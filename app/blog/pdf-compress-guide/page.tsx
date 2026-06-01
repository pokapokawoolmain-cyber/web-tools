import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("pdf-compress-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["PDF 圧縮 無料 スマホ アプリ不要", "PDF 軽くする ブラウザ 登録不要", "PDF サイズ 縮小 メール 添付", "PDF 容量 減らす 方法 簡単", "PDF 重い 送れない 解決"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「PDFを送ろうとしたらファイルサイズが大きすぎてメール添付できない」「会社のシステムでアップロード制限に引っかかった」——こういった状況は、スキャンや画像を多く含む資料でよく起きます。PDFを無料で圧縮する方法を解説します。
      </p>

      <h2>PDFが大きくなる主な原因</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        PDFのファイルサイズが大きくなる原因はほぼ決まっています。
      </p>
      <ul className="space-y-2">
        <li><strong>画像が多い</strong>：スキャンデータ・写真を貼り込んだ資料は一番サイズが膨らみます</li>
        <li><strong>スキャン解像度が高すぎる</strong>：600dpiでスキャンしたPDFは300dpiの4倍になります</li>
        <li><strong>埋め込みフォント</strong>：特殊なフォントがPDF内に埋め込まれているとサイズが増えます</li>
        <li><strong>不要なレイヤーや注釈</strong>：図面PDFには見えないレイヤーが残っていることがあります</li>
      </ul>
      <p>
        テキストだけのPDFは元々サイズが小さいため、圧縮の効果は限定的です。画像を含む資料ほど圧縮効果が大きくなります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>PDFを無料で圧縮する手順</h2>

      <h3>① PDF圧縮ツールを開く</h3>
      <p>
        <Link href="/tools/pdf-compress">PDF圧縮ツール</Link>にアクセスします。登録・インストール不要で使えます。
      </p>

      <h3>② PDFをアップロードする</h3>
      <p>
        「ファイルを選択」ボタンまたはドラッグ&ドロップでPDFを読み込みます。スマホからも同様に操作できます。
      </p>

      <h3>③ 圧縮されたPDFをダウンロードする</h3>
      <p>
        処理が完了したら元のサイズと圧縮後のサイズが表示されます。問題なければダウンロードボタンを押して保存します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮率の目安</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">PDFの種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">圧縮率の目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">例（元→圧縮後）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["スキャン画像が多い", "50〜80%削減", "20MB → 4〜10MB"],
              ["写真・図版が多い資料", "30〜60%削減", "10MB → 4〜7MB"],
              ["テキスト主体", "5〜20%削減", "2MB → 1.6〜1.9MB"],
              ["テキストのみ", "ほぼ変化なし", "500KB → 480KB程度"],
            ].map(([type, rate, example], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-green-700 dark:text-green-400">{rate}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>圧縮でも解決しない場合</h2>
      <p>
        圧縮後もサイズが大きい場合は、以下を試してみてください。
      </p>
      <ul className="space-y-2">
        <li><strong>不要なページを削除する</strong>：<Link href="/tools/pdf-delete-pages">PDFページ削除ツール</Link>で不要ページを取り除くと大幅に軽量化できます</li>
        <li><strong>PDFを分割して送る</strong>：<Link href="/tools/pdf-split">PDF分割ツール</Link>で章ごとに分けて送る方法もあります</li>
        <li><strong>別の送信方法を使う</strong>：GoogleドライブやDropboxにアップロードしてリンク共有する方法が容量制限を回避できます</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>メールのPDF添付容量制限まとめ</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">メールサービス</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">添付ファイル上限</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Gmail", "25MB"],
              ["Outlook / Hotmail", "25MB"],
              ["Yahoo!メール", "25MB"],
              ["iCloud メール", "20MB（Mail Dropで5GB）"],
            ].map(([service, limit], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{service}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        圧縮処理はすべてブラウザ内で完結します。PDFがサーバーに送信されることはなく、機密書類も安心してご利用いただけます。
      </div>
    </BlogLayout>
  );
}
