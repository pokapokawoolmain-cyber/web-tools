import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("heic-to-jpg-iphone")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["iPhone HEIC JPG 変換", "HEIC 変換 無料", "HEIC 開けない Windows", "iPhone 写真 JPG 変換", "HEIC to JPG アプリなし"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        iPhoneで撮った写真をWindowsのPCに送ったら「開けない」と表示されたり、LINEやメールで送ろうとしたら形式が合わないと言われたりした経験はありませんか？それはiPhoneの写真形式「HEIC」が原因です。アプリ不要・ブラウザだけで無料・登録不要でJPGに変換できます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/heic-to-jpg" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          HEIC→JPG変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>HEICとは？なぜiPhoneはHEICを使うのか</h2>
      <p>
        HEIC（High Efficiency Image Container）は、Apple社がiOS 11から標準採用した画像フォーマットです。JPGと比べて同じ画質でファイルサイズが約半分になるため、iPhoneのストレージを効率よく使えるメリットがあります。ただし、WindowsやAndroidなど他のOSとの互換性が低く、開けないケースが頻繁に起こります。
      </p>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 ポイント</strong>
        HEICはAppleが採用したISO標準フォーマット（ISO/IEC 23008-12）をベースとしていますが、実装の違いからWindowsやAndroidでは標準では開けません。
      </div>

      <h2>HEICで困る場面</h2>
      <ul className="space-y-2">
        <li><strong>Windowsで写真が開けない</strong>：Windows標準のフォトアプリはHEICに非対応（Microsoft Storeから拡張機能の追加が必要）。</li>
        <li><strong>LINEやSlackで送った写真が表示されない</strong>：相手のAndroidや古いiPhoneでHEICが表示されないケースがある。</li>
        <li><strong>ブログやSNSにアップロードできない</strong>：多くのウェブサービスはJPG・PNG・WebPのみ対応しており、HEICは拒否される。</li>
        <li><strong>印刷サービスに使えない</strong>：コンビニのマルチコピー機や写真プリントサービスの多くがHEIC非対応。</li>
        <li><strong>メールに添付した写真が文字化けする</strong>：HEICのまま添付すると受け取り側が開けないことがある。</li>
      </ul>

      <h2>最も簡単な変換方法</h2>
      <p>
        ToolBoxJPの<Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>を使えば、インストール不要・アカウント登録不要でHEICをJPGに変換できます。複数ファイルの一括変換にも対応しています。処理はブラウザ内で完結するため、プライベートな写真もサーバーに送信されません。
      </p>

      <h2>iPhoneからそのままJPGに変換する手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "SafariでツールページにアクセスRする", body: "iPhoneのSafariでToolBoxJPのHEIC→JPG変換ツールを開きます。ブックマークしておくと次回から便利です。" },
          { step: "②", title: "「ファイルを選択」をタップする", body: "ページ内の「ファイルを選択」ボタンをタップします。iPhoneでは「写真ライブラリ」「ファイル」などから選択できます。" },
          { step: "③", title: "変換したいHEICファイルを選ぶ", body: "写真ライブラリから変換したい写真を選択します。複数選択も可能です。" },
          { step: "④", title: "JPGをダウンロードする", body: "変換後、「ダウンロード」ボタンをタップします。iPhoneでは「ファイルに保存」または「写真に保存」から保存先を選べます。" },
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

      <h2>PCからHEICをJPGに変換する手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "PCにHEICファイルを転送する", body: "iPhoneとPCをUSBケーブルで接続するか、AirDropやiCloudでPCにHEICファイルをコピーします。" },
          { step: "②", title: "ブラウザでツールを開く", body: "ChromeやEdgeでToolBoxJPのHEIC→JPG変換ツールを開きます。" },
          { step: "③", title: "HEICファイルをアップロードする", body: "「ファイルを選択」ボタンでHEICファイルを選択するか、ドラッグ＆ドロップします。複数ファイルの一括アップロードも可能です。" },
          { step: "④", title: "JPGをダウンロードする", body: "変換が完了したらJPGファイルをダウンロードします。複数ファイルはZIPでまとめてダウンロードできます。" },
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

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/heic-to-jpg" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          HEIC→JPG変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>iPhone側の設定でJPG撮影に切り替える方法</h2>
      <p>
        毎回変換するのが手間な場合、iPhoneのカメラ設定を変更すると撮影時からJPGで保存できます。
      </p>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "「設定」アプリを開く", body: "iPhoneのホーム画面から「設定」アプリをタップします。" },
          { step: "②", title: "「カメラ」→「フォーマット」を開く", body: "設定メニューをスクロールして「カメラ」をタップし、「フォーマット」を選択します。" },
          { step: "③", title: "「互換性優先」を選択する", body: "「高効率」（HEIC）から「互換性優先」（JPG）に切り替えると、以降の撮影がJPGで保存されます。" },
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

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: 「互換性優先」に設定するとJPGで保存されますが、同じ画質でHEICより約2倍のストレージを使用します。ストレージ管理にご注意ください。</p>
      </div>

      <h2>HEIC vs JPG 比較表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">HEIC</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">JPG</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ファイルサイズ", "小さい（JPGの約半分）", "大きい"],
              ["画質", "高い（同サイズでJPGより高画質）", "良好"],
              ["Windows対応", "非対応（要拡張機能）", "標準対応"],
              ["Android対応", "一部非対応", "標準対応"],
              ["ウェブサービス対応", "多くが非対応", "ほぼ全て対応"],
              ["コンビニ印刷対応", "多くが非対応", "対応"],
              ["SNSアップロード", "自動変換されることが多い", "そのままアップロード可"],
            ].map(([item, heic, jpg], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{heic}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{jpg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Windowsでも開く方法（代替案）</h2>
      <p>
        変換せずにWindowsでHEICを開きたい場合、Microsoft StoreからAppleが提供する「HEIF画像拡張機能」（有料、約120円）をインストールすると、標準フォトアプリでHEICが開けるようになります。ただし、他の人に送る場合は相手のPCでも同様の設定が必要になるため、送付前にJPGへ変換するのが最も確実です。
      </p>

      <h2>変換時の注意点</h2>
      <ul className="space-y-2">
        <li><strong>ファイルサイズが増える</strong>：JPGはHEICより圧縮率が低いため、変換後のファイルサイズが増えます。サイズを抑えたい場合は画像圧縮ツールを組み合わせて使いましょう。</li>
        <li><strong>EXIF情報（撮影日時・位置情報）は保持される</strong>：変換後もExif情報（撮影日時・GPS座標など）が残ります。プライバシーが気になる場合はExif削除ツールを使いましょう。</li>
        <li><strong>LivePhotoの動画部分は変換されない</strong>：HEICのLivePhoto（動く写真）は静止画部分のみJPGに変換され、動画部分は別ファイルになります。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/heic-jpg-guide">HEIC→JPG変換の完全ガイド</Link></li>
        <li><Link href="/blog/heic-what-is">HEICとは？開けない原因と対処法</Link></li>
        <li><Link href="/blog/image-compress-guide">画像を圧縮する方法｜ファイルサイズを小さくする手順</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/heic-to-jpg" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          HEIC→JPG変換ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>
    </BlogLayout>
  );
}
