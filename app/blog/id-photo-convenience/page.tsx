import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("id-photo-convenience")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["証明写真 コンビニ 印刷 方法", "証明写真 コンビニ 安い", "L判 証明写真 印刷", "証明写真 40円", "スマホ 証明写真 コンビニ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        証明写真ボックスを使うと700〜900円かかりますが、スマホで撮影→証明写真ツールでL判レイアウト作成→コンビニで<strong>40円</strong>印刷すれば費用を大幅に節約できます。具体的な手順を解説します。
      </p>

      <h2>コンビニ印刷との費用比較</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費用</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">枚数</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["証明写真ボックス", "700〜900円", "4〜8枚"],
              ["コンビニ印刷（L判）", "40〜50円", "4〜6枚（写真サイズによる）"],
              ["写真館", "1,500〜3,000円", "2〜4枚"],
            ].map(([method, cost, count], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{cost}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>コンビニ印刷の手順</h2>

      <h3>① スマホで写真を撮影する</h3>
      <p>
        白・グレー・薄いブルーの無地の壁を背景に、正面からまっすぐ顔が収まるように撮影します。明るい場所で撮影することで自然な仕上がりになります。三脚やスタンドを使うと手ブレを防げます。
      </p>

      <h3>② 証明写真ツールでL判レイアウトを作成する</h3>
      <p>
        <Link href="/tools/id-photo">証明写真作成ツール</Link>を使って、撮影した写真を適切な証明写真サイズに加工し、L判（89×127mm）に複数枚配置したレイアウト画像を作成します。
      </p>
      <ol>
        <li>写真をアップロードし、顔の位置・サイズを調整</li>
        <li>必要であれば背景除去・背景色変更（白・グレー・ブルー）</li>
        <li>証明写真のサイズを選択（履歴書・パスポートなど）</li>
        <li>「L判レイアウトで印刷」を選択してダウンロード</li>
      </ol>

      <h3>③ コンビニのコピー機で「写真プリント」する</h3>
      <p>
        作成した画像をスマホのカメラロールまたはファイルに保存し、コンビニへ持参します。
      </p>
      <ul className="space-y-2">
        <li><strong>セブン-イレブン</strong>：マルチコピー機→「プリント」→「写真プリント」→「スマホで撮った写真」</li>
        <li><strong>ファミリーマート・ローソン</strong>：マルチコピー機→「写真サービス」→「写真プリント」</li>
      </ul>
      <p>
        プリント設定では「L判」を選択してください。用紙の種類が選べる場合は「写真光沢」を選ぶと仕上がりがよくなります。
      </p>

      <h3>④ カット線に沿って切り取る</h3>
      <p>
        印刷後は、L判用紙に印刷されたカット線（薄いガイドライン）に沿ってハサミで丁寧に切り取ります。定規を当てながらカッターで切ると直線がきれいに出ます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>コンビニ印刷で注意すること</h2>
      <ul className="space-y-2">
        <li>「写真プリント」ではなく「普通紙プリント」を選ぶと品質が落ちるため注意</li>
        <li>L判（89×127mm）を選択すること——2L・A4サイズを選ぶとサイズが違う</li>
        <li>光沢のある写真用紙で印刷することで証明写真ボックスに近い仕上がりになる</li>
        <li>プリント後すぐに折れないよう、クリアファイルに入れて持ち帰る</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>対応コンビニと料金</h2>
      <ul className="space-y-2">
        <li><strong>セブン-イレブン</strong>：L判 40円</li>
        <li><strong>ファミリーマート</strong>：L判 40円</li>
        <li><strong>ローソン</strong>：L判 40円</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">証明写真ツールについて</strong>
        <Link href="/tools/id-photo" className="text-blue-600 dark:text-blue-400 hover:underline">証明写真作成ツール</Link>はブラウザ内で処理が完結します。アップロードした写真が外部サーバーに送信されることは一切ありません。
      </div>
    </BlogLayout>
  );
}
