import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("line-photo-size-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["LINE 写真 送れない", "LINE 動画 容量 オーバー", "LINE ファイルサイズ 上限", "LINE 写真 重すぎる", "LINE 動画 送り方"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「LINEで写真を送ろうとしたらエラーが出た」「動画を送ったら相手に届かなかった」——よくある悩みです。原因はファイルの容量オーバーがほとんど。この記事では写真・動画それぞれの解決方法を、スマホだけで完結できる手順で説明します。
      </p>

      <div className="my-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-[14px] text-green-800 dark:text-green-300">
        <strong className="block mb-1">✅ 結論：圧縮すれば解決します</strong>
        <p>写真は画像圧縮ツールで、動画は動画圧縮ツールで小さくしてから送ればOKです。どちらも無料・登録不要・ブラウザだけで完結します。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>LINEのファイルサイズ制限（2026年現在）</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">送る内容</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">上限サイズ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">注意点</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["写真（カメラロールから選択）", "1ファイルあたり約30MB", "自動圧縮されるが、オリジナル送信時は上限あり"],
              ["動画（通常送信）", "5分以内・約1.2GB目安", "長い動画はカットか圧縮が必要"],
              ["ファイル（.pdf / .docx等）", "最大5GB", "「ファイル」メニューから送ると大きなデータも可"],
            ].map(([type, limit, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-rose-600 dark:text-rose-400 font-medium">{limit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px] text-slate-500 dark:text-zinc-500">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>こんな人におすすめ</h2>
      <ul className="space-y-1">
        <li>一眼レフやミラーレスで撮った高解像度写真をLINEで送りたい</li>
        <li>iPhoneで撮ったHEIC形式の写真がLINEで送れない</li>
        <li>撮影した動画が長くてLINEに送信できない</li>
        <li>画質を保ちつつできるだけ小さいサイズで送りたい</li>
        <li>アプリをインストールせず、すぐ解決したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【写真が送れない場合】画像圧縮で解決する手順</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "画像圧縮ツールにアクセス",
            body: "ToolBoxJPの画像圧縮ツール（/tools/image-compress）をスマホのブラウザで開きます。",
          },
          {
            step: "②",
            title: "送りたい写真をアップロード",
            body: "「ファイルを選択」からカメラロールの写真を選びます。複数枚まとめて選択することもできます。",
          },
          {
            step: "③",
            title: "圧縮品質を選ぶ",
            body: "「高品質（80〜85%）」を選ぶと画質の低下がほぼわからないままサイズが大幅に小さくなります。LINEで送る程度なら十分です。",
          },
          {
            step: "④",
            title: "圧縮後のファイルをダウンロード",
            body: "「ダウンロード」ボタンを押すとスマホの写真フォルダ（またはダウンロードフォルダ）に保存されます。",
          },
          {
            step: "⑤",
            title: "LINEで圧縮後の写真を選択して送信",
            body: "LINEのトーク画面から写真を選ぶ際、圧縮後に保存されたファイルを選んで送信します。",
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

      {/* CTA 画像圧縮 */}
      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🖼️ 写真が送れない場合はこちら</p>
        <Link href="/tools/image-compress" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          画像圧縮ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">JPG・PNG対応・登録不要・スマホ完結</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【動画が送れない場合】動画圧縮で解決する手順</h2>

      <p>
        動画は写真より容量が大きく、5分を超える動画や4K動画は特に送れないケースが多いです。動画圧縮ツールでファイルサイズを小さくしてから送るのが最も確実です。
      </p>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "動画圧縮ツールにアクセス",
            body: "ToolBoxJPの動画圧縮ツール（/tools/video-compress）をブラウザで開きます。",
          },
          {
            step: "②",
            title: "動画ファイルをアップロード",
            body: "MP4・MOV・AVI・WEBMなど主要な動画形式に対応しています。スマホで撮影した動画はMP4またはMOVが一般的です。",
          },
          {
            step: "③",
            title: "圧縮設定を選ぶ",
            body: "「中品質」を選ぶと画質とファイルサイズのバランスが良く、LINEで送るなら十分な品質を保てます。",
          },
          {
            step: "④",
            title: "圧縮後にダウンロード → LINEで送信",
            body: "圧縮完了後にダウンロードし、LINEで送信します。それでも大きい場合は「LINEのファイル機能（最大5GB）」を使うと確実です。",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA 動画圧縮 */}
      <div className="my-6 p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50">
        <p className="text-[13px] font-semibold text-orange-600 dark:text-orange-400 mb-1">🎬 動画が送れない場合はこちら</p>
        <Link href="/tools/video-compress" className="text-[17px] font-bold text-orange-700 dark:text-orange-300 hover:opacity-80">
          動画圧縮ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">MP4・MOV対応・登録不要・スマホ完結</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HEICファイルが送れない場合の特別対応</h2>

      <p>
        iPhone標準の写真形式（HEIC）はLINEで非対応になる場合があります。HEICファイルを送ろうとしてエラーになる場合は、まずJPGへ変換してください。変換後のJPGはLINEで問題なく送れます。
      </p>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 iPhoneのHEICをJPGに変換する方法</strong>
        <p>設定アプリ →「カメラ」→「フォーマット」→「互換性優先」に変えると、以後の撮影がJPG形式になります。既存のHEICファイルは<Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline">HEIC→JPG変換ツール</Link>で変換できます。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li><strong>圧縮しすぎると画質が落ちる</strong>：品質50%以下は文字が読みにくくなったり、顔写真がにじんだりします。特に書類・証明写真は高品質（80%以上）を推奨します。</li>
        <li><strong>LINEの自動圧縮に注意</strong>：LINEに写真を送ると自動でさらに圧縮されます。「オリジナル画質で送信」にチェックを入れると原画質が保たれますが、その分ファイルサイズが大きくなります。</li>
        <li><strong>動画は「ファイル」で送る方法も有効</strong>：トーク画面の「＋」→「ファイル」から送ると最大5GBまで送れます。自動圧縮もかかりません。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：写真ファイルを軽くしてLINEやメールで送りやすくする。</li>
        <li><Link href="/tools/video-compress">動画圧縮ツール</Link>：LINEやメールで送れるサイズに動画を圧縮する。</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>：iPhoneのHEICファイルをLINEで送れるJPGに変換。</li>
        <li><Link href="/tools/image-resize">画像リサイズツール</Link>：縦横ピクセルを小さくして容量も減らす。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/image-compress-guide">画像を軽くする方法【JPG・PNGのサイズを小さくする手順】</Link></li>
        <li><Link href="/blog/image-resize-guide">画像のサイズ（縦横）を変更する方法【無料・スマホ対応】</Link></li>
        <li><Link href="/blog/video-compress-guide">動画の容量を小さくする方法【MP4・MOVをLINEで送れるサイズに】</Link></li>
        <li><Link href="/blog/heic-jpg-guide">HEICをJPGに変換する方法【iPhone写真・無料】</Link></li>
      </ul>

    </BlogLayout>
  );
}
