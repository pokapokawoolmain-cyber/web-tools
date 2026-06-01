import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("image-resize-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["画像 リサイズ 無料", "画像 サイズ変更 方法", "画像 縮小 スマホ", "画像 ピクセル 変更", "写真 リサイズ ブラウザ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「ブログに載せたら画像が大きすぎた」「SNSに投稿したら縦横比がおかしくなった」——そんな悩みは画像のリサイズで解決できます。アプリ不要・登録不要、スマホのブラウザだけで縦横サイズを自由に変更する手順を解説します。
      </p>

      {/* 結論 CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">📐 今すぐリサイズする</p>
        <Link href="/tools/image-resize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          画像リサイズツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・JPG/PNG/WebP対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>リサイズと圧縮の違い——まず確認</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">操作</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">変わるもの</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使うシーン</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["リサイズ", "縦×横のピクセル数（解像度）", "ブログ・SNSの表示サイズを合わせたい"],
              ["圧縮", "ファイルサイズ（KB・MB）", "メール添付・アップロード容量を減らしたい"],
            ].map(([op, change, scene], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{op}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{change}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{scene}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        縦横のサイズ（ピクセル数）を変えたいなら<strong>リサイズ</strong>、ファイルの容量（KB・MBの数字）だけ減らしたいなら<strong>圧縮</strong>を使います。両方したい場合はリサイズ→圧縮の順で行うのが効率的です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>こんな人におすすめ</h2>

      <ul className="space-y-1">
        <li>ブログやWordPressに貼る画像が大きすぎて表示が重い</li>
        <li>X（旧Twitter）やInstagramに投稿したら画像が切れてしまった</li>
        <li>メールに添付する写真の縦横サイズを小さくしたい</li>
        <li>複数の画像を同じサイズに統一したい</li>
        <li>印刷用に特定のピクセル数に合わせたい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>画像リサイズの手順（スマホ・PC共通）</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "リサイズツールにアクセス",
            body: "ToolBoxJPの画像リサイズツール（/tools/image-resize）をブラウザで開きます。スマホのSafari・ChromeどちらでもOKです。",
          },
          {
            step: "②",
            title: "画像をアップロード",
            body: "「ファイルを選択」または画面へのドラッグ＆ドロップで画像を読み込みます。JPG・PNG・WebPなど主要形式に対応しています。",
          },
          {
            step: "③",
            title: "変更後のサイズを入力",
            body: "幅（横）または高さ（縦）のピクセル数を入力します。「アスペクト比を保持」をオンにすると縦横比を保ったままリサイズできます。",
          },
          {
            step: "④",
            title: "リサイズ実行・ダウンロード",
            body: "「リサイズ」ボタンを押すとプレビューが表示されます。確認してダウンロードボタンを押せば完了です。",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>用途別おすすめサイズ一覧</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">推奨サイズ（幅×高さ）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["WordPress・ブログ本文", "800×600px 前後", "表示速度に影響しないサイズ感"],
              ["X（旧Twitter）シェア画像", "1200×675px", "16:9比率が最適"],
              ["Instagram正方形投稿", "1080×1080px", "1:1比率"],
              ["Instagram縦長投稿", "1080×1350px", "4:5比率"],
              ["メール添付（軽量化）", "幅1000px以下", "送受信サイズの目安"],
              ["A4印刷（高解像度）", "2480×3508px", "300DPI相当"],
              ["スマホ壁紙（iPhone）", "1179×2556px", "iPhone 15 Pro相当"],
            ].map(([use, size, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-violet-600 dark:text-violet-400">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px] text-slate-500 dark:text-zinc-500">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">📐 ピクセル数を指定してリサイズ</p>
        <Link href="/tools/image-resize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          画像リサイズツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">アスペクト比保持・プレビュー確認あり</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li>
          <strong>拡大すると画質が落ちる</strong>：元の画像より大きなサイズに拡大すると、ぼやけや粗さが目立ちます。縮小は画質劣化がほとんどありませんが、拡大は避けるのが基本です。
        </li>
        <li>
          <strong>HEICファイルはJPGに変換してから</strong>：iPhoneのHEIC形式はリサイズ前に<Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline">HEIC→JPG変換ツール</Link>でJPGにしてください。
        </li>
        <li>
          <strong>アスペクト比を無視すると縦横比が崩れる</strong>：「幅だけ変えたい」場合は必ず「アスペクト比を保持」をオンにしましょう。
        </li>
        <li>
          <strong>リサイズしてもファイルサイズが大きいとき</strong>：リサイズ後にさらに<Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline">画像圧縮ツール</Link>で圧縮すると、ファイルサイズも小さくなります。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/image-compress">画像圧縮ツール</Link>：縦横サイズはそのままでファイル容量だけ減らしたいときに。</li>
        <li><Link href="/tools/heic-to-jpg">HEIC→JPG変換ツール</Link>：iPhoneで撮影したHEICファイルをJPGに変換。</li>
        <li><Link href="/tools/image-resize">画像リサイズツール</Link>：縦横ピクセルを自由に指定して変更。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/image-compress-guide">画像を軽くする方法【JPG・PNGのサイズを小さくする手順】</Link></li>
        <li><Link href="/blog/line-photo-size-guide">LINEで写真・動画が送れない原因と解決方法</Link></li>
        <li><Link href="/blog/heic-jpg-guide">HEICをJPGに変換する方法【iPhone写真・無料】</Link></li>
        <li><Link href="/blog/id-photo-smartphone">スマホで証明写真を作る方法【無料・コンビニ印刷対応】</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">📐 無料で今すぐリサイズ</p>
        <Link href="/tools/image-resize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          画像リサイズツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
