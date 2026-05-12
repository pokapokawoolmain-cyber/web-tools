import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("heic-what-is")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["HEIC とは", "HEIC JPG 違い", "iPhone 写真 形式", "HEIC 開けない 原因", "HEIC 変換 方法"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        iPhoneの写真ファイルを見ると「.heic」という拡張子がついています。これは何か、JPGとどう違うのか、なぜWindowsで開けないのかをわかりやすく解説します。
      </p>

      <h2>HEICとは何か</h2>
      <p>
        HEIC（High Efficiency Image Container）は、Apple が iOS 11（2017年）から採用した画像ファイル形式です。HEIF（High Efficiency Image Format）という規格のコンテナフォーマットで、同等の画質を保ちながらJPGの約半分のファイルサイズで保存できます。
      </p>
      <p>
        Appleがこの形式を採用した主な理由はストレージ節約です。スマートフォンの写真解像度が年々上がる中で、ストレージ容量を圧迫しないようにするためです。
      </p>

      <h2>HEICとJPGの違い</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">特徴</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">HEIC</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">JPG</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ファイルサイズ", "小さい（JPGの約半分）", "大きい"],
              ["画質", "高品質（12ビット色深度）", "8ビット色深度"],
              ["Windows互換性", "△（バージョンによる）", "◎ どこでも開ける"],
              ["Android互換性", "△（機種による）", "◎ どこでも開ける"],
              ["Web対応", "△（サービスによる）", "◎ 全サービス対応"],
              ["採用デバイス", "iPhone（iOS 11以降）", "ほぼすべてのデバイス"],
            ].map(([feature, heic, jpg], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{feature}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{heic}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{jpg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>HEICが開けない原因と対処法</h2>

      <h3>Windowsで開けない場合</h3>
      <p>
        Windows 10以降では「HEIF画像拡張機能」をMicrosoftストアからインストールすることで標準の「フォト」アプリでHEICを開けるようになります。ただしインストール不要で解決したい場合は、JPGへの変換が最も手軽です。
      </p>

      <h3>Androidで開けない場合</h3>
      <p>
        一部のAndroid端末やギャラリーアプリはHEICに対応していません。特に古い機種では非対応のことが多いです。JPGに変換してから送ると確実に開けます。
      </p>

      <h3>Webサービスでアップロードできない場合</h3>
      <p>
        ECサイトや求人サイト、行政の申請サービスなど、古いシステムでは対応フォーマットがJPG/PNGのみのことがあります。この場合もJPGへの変換で解決できます。
      </p>

      <h2>HEICをJPGに変換する方法</h2>
      <p>
        最も手軽な方法は<Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>を使うことです。ブラウザから操作でき、インストール不要・無料で変換できます。
      </p>
      <p>
        複数枚のHEICをまとめてJPGに変換することもできます。変換後に複数の画像を1つのPDFにまとめたい場合は<Link href="/tools/jpg-to-pdf">JPG→PDF変換ツール</Link>も合わせて使えます。
      </p>

      <h2>iPhoneでJPG形式で撮影する方法</h2>
      <p>
        「設定」→「カメラ」→「フォーマット」→「互換性優先」を選択すると、以降はJPG形式で保存されます。ただしストレージ消費が増えるため、変換の手間を受け入れてHEICのままにしておく方がストレージ効率は良いです。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">関連ツール</strong>
        <Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline">HEIC→JPG変換ツール</Link>で、ブラウザから無料でHEICをJPGに変換できます。登録不要・インストール不要です。
      </div>
    </BlogLayout>
  );
}
