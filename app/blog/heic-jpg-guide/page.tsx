import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("heic-jpg-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["HEIC JPG 変換 無料 スマホ", "iPhone 写真 Windows 開けない 解決", "HEIC 変換 アプリ不要 ブラウザ", "heic to jpg オンライン 無料", "iPhone HEIC 変換 登録不要"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        iPhoneで撮影した写真をWindowsパソコンやAndroidスマホに送ったら「開けない」「見られない」——これはHEIC形式の互換性問題です。アプリのインストールなしに、ブラウザから無料で変換できる方法を解説します。
      </p>

      <h2>HEICファイルが開けない原因</h2>
      <p className="font-medium text-slate-800 dark:text-zinc-200">
        iOS 11以降のiPhoneは写真の保存形式にHEIC（High Efficiency Image Coding）を使っています。容量を約半分に抑えながら高画質を保てる優れた形式ですが、Windows・Androidなど他のOS・ソフトウェアでは対応していない場合があります。
      </p>
      <ul className="space-y-2">
        <li>古いWindowsの「フォト」アプリでは開けない</li>
        <li>WordやExcelにHEIC画像を貼り付けられない</li>
        <li>Androidスマホに送っても表示されない</li>
        <li>Webサービスの画像アップロードでHEICが弾かれる</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HEICをJPGに変換する手順</h2>

      <h3>① HEIC→JPG変換ツールにアクセスする</h3>
      <p>
        <Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>をブラウザで開きます。iPhone・Android・PC・Mac、どのデバイスからでも使えます。
      </p>

      <h3>② HEICファイルをアップロードする</h3>
      <p>
        「ファイルを選択」ボタンでHEICファイルを選びます。複数ファイルを一度に選択して一括変換することもできます。iPhoneの「写真」アプリからも直接選択できます。
      </p>

      <h3>③ JPGに変換してダウンロード</h3>
      <p>
        変換ボタンを押すと処理が始まります。変換が完了したらJPGファイルをダウンロードしてください。複数ファイルの場合はZIPでまとめてダウンロードできます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>変換前に知っておきたいこと</h2>

      <h3>画質はどうなる？</h3>
      <p>
        高品質での変換に対応しているため、通常の閲覧では劣化は気になりません。ただしHEICの方がJPGより同じ画質でファイルサイズが小さい特性があるため、変換後のJPGはHEICより少し容量が増えることがあります。
      </p>

      <h3>複数枚を一度に変換できる？</h3>
      <p>
        複数のHEICファイルを同時にアップロードして一括変換できます。旅行写真をまとめてWindows用に変換したい場合などに便利です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>変換後の活用方法</h2>
      <ul className="space-y-2">
        <li><strong>Windowsで開く</strong>：JPGはどのビューアーでも表示できます</li>
        <li><strong>Wordに貼り付け</strong>：Office製品でそのまま使用可能</li>
        <li><strong>SNSに投稿</strong>：Instagram・X（Twitter）へのアップロードが可能</li>
        <li><strong>複数写真をPDFにまとめる</strong>：<Link href="/tools/jpg-to-pdf">JPG→PDF変換ツール</Link>で書類まとめに</li>
        <li><strong>ファイルサイズをさらに小さく</strong>：<Link href="/tools/image-compress">画像圧縮ツール</Link>でWebアップロード用に軽量化</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>iPhoneの写真をJPGで撮影する設定</h2>
      <p>
        変換の手間を省きたい場合は、iPhoneのカメラ設定を変更してJPGで撮影することもできます。
      </p>
      <ol>
        <li>「設定」アプリを開く</li>
        <li>「カメラ」→「フォーマット」を開く</li>
        <li>「互換性優先」を選択（JPG形式で保存される）</li>
      </ol>
      <p>
        ただしこの設定にすると1枚あたりのファイルサイズが大きくなり、iPhoneのストレージが早く消費されます。必要な時だけJPGに変換する方がストレージ節約になります。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        変換処理はすべてブラウザ内で完結します。アップロードした写真・画像データが外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
