import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("id-photo-smartphone")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["スマホ 証明写真 作り方 無料 アプリ不要", "証明写真 自分で 撮影 コンビニ 印刷", "履歴書 証明写真 スマホ 無料", "証明写真 ブラウザ 登録不要 即日", "マイナンバー パスポート 証明写真 サイズ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        証明写真ボックスが近くにない、急いで証明写真が必要——スマホとブラウザがあれば、アプリをインストールせずに無料で証明写真を作成できます。撮影のコツから印刷まで手順をまとめました。
      </p>

      <h2>スマホで証明写真を作る全体の流れ</h2>
      <ol>
        <li>スマホで写真を撮影する</li>
        <li>ブラウザで<Link href="/tools/id-photo">証明写真作成ツール</Link>を開く</li>
        <li>写真をアップロードして顔の位置・背景を調整</li>
        <li>サイズを選択してL判レイアウトをダウンロード</li>
        <li>コンビニで40円印刷</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>撮影のコツ</h2>

      <h3>背景は無地の壁がベスト</h3>
      <p>
        白・薄いグレー・ライトブルーの無地の壁を背景にします。自宅なら白い壁やドアが使いやすいです。カーテンや棚が写り込む場所は避けましょう。ツールで背景除去もできますが、最初から無地の方が仕上がりがきれいです。
      </p>

      <h3>光の当て方</h3>
      <p>
        窓からの自然光が入る明るい場所が最もきれいに撮れます。顔に影が出ないように、光源を顔の正面方向に向けます。逆光（窓を背に撮影）は顔が暗くなるため避けましょう。
      </p>

      <h3>カメラの向きと構図</h3>
      <ul className="space-y-2">
        <li>スマホを目線の高さに固定する（スタンドまたは三脚が理想）</li>
        <li>顔が画面の中央に来るように構図を決める</li>
        <li>正面を向き、顎を少し引く</li>
        <li>表情は自然な閉口（口を閉じた状態）が基本</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>証明写真ツールでの編集手順</h2>

      <h3>① 写真をアップロードして顔をトリミング</h3>
      <p>
        <Link href="/tools/id-photo">証明写真作成ツール</Link>に写真をアップロードします。顔の位置とサイズを調整して、顔が適切な位置に収まるようにします。
      </p>

      <h3>② 背景の調整（必要な場合）</h3>
      <p>
        背景が無地でない場合は背景除去機能を使います。除去後は白・グレー・ブルーから背景色を選択できます。パスポートは白・薄いグレー、履歴書は白が一般的です。
      </p>

      <h3>③ 証明写真サイズを選択する</h3>
      <p>
        用途に合わせてサイズを選択します。
      </p>
      <ul className="space-y-2">
        <li>履歴書：40×30mm（一般的な履歴書）</li>
        <li>パスポート・マイナンバー：45×35mm</li>
        <li>運転免許証：30×24mm</li>
      </ul>
      <p>
        サイズの詳細は<Link href="/blog/id-photo-size-guide">証明写真サイズ一覧</Link>を参照してください。
      </p>

      <h3>④ L判レイアウトでダウンロード</h3>
      <p>
        「L判レイアウトで印刷」を選択すると、1枚のL判（89×127mm）用紙に複数枚配置したレイアウト画像が生成されます。履歴書サイズ（30×40mm）なら6枚が配置されます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>印刷して完成</h2>
      <p>
        ダウンロードした画像をコンビニの写真プリントサービスで「L判」指定で印刷します（40円）。カット線に沿ってハサミで切り取れば完成です。コンビニ印刷の詳細は<Link href="/blog/id-photo-convenience-store">コンビニで証明写真を印刷する方法</Link>を参照してください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホ撮影のよくある失敗と対策</h2>
      <ul className="space-y-2">
        <li><strong>顔が暗い</strong>：窓を正面に向けて撮影する、または照明を増やす</li>
        <li><strong>手ブレ</strong>：スタンドを使う、またはタイマー撮影を活用する</li>
        <li><strong>服が写真映えしない</strong>：シャツ・ジャケットなどフォーマルな服を着用する</li>
        <li><strong>影が顔に落ちている</strong>：光源と顔の角度を調整し、顔に直接光が当たるようにする</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">安全性について</strong>
        アップロードした写真はブラウザ内のみで処理されます。外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
