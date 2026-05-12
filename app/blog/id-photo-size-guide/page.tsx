import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("id-photo-size-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["証明写真 サイズ 一覧", "履歴書 写真 サイズ mm", "パスポート 写真 サイズ", "マイナンバー 写真 サイズ", "証明写真 規格"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        「証明写真のサイズが合っていない」として書類を差し戻されるケースは意外と多くあります。用途ごとに定められたサイズをあらかじめ確認してから撮影・作成しましょう。
      </p>

      <h2>証明写真サイズ一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">縦×横（mm）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["一般的な履歴書", "40×30mm", "最も一般的なサイズ"],
              ["JIS規格履歴書", "36×24mm", "JIS規格では36×24mmが標準"],
              ["パスポート", "45×35mm", "顔の大きさ34〜36mm"],
              ["マイナンバーカード", "45×35mm", "パスポートと同サイズ"],
              ["運転免許証更新", "30×24mm", "都道府県によって異なる場合あり"],
              ["在留カード", "40×30mm", "パスポートサイズで代用できる場合も"],
              ["学生証・社員証", "30×25mm", "発行機関に要確認"],
              ["ビザ申請", "各国規定による", "申請先の規定を必ず確認"],
            ].map(([use, size, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-mono">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500 text-[12px]">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>用途別の詳細と注意点</h2>

      <h3>履歴書用（40×30mm）</h3>
      <p>
        就職・転職の書類でよく使う一般的な履歴書の証明写真サイズは縦40mm×横30mmです。市販の履歴書の多くがこのサイズを前提に設計されています。
      </p>
      <p>
        JIS規格の履歴書では縦36mm×横24mmと定められていますが、市販品では40×30mmが標準的になっています。提出先に合わせて確認しましょう。
      </p>

      <h3>パスポート用（45×35mm）</h3>
      <p>
        パスポート申請写真は縦45mm×横35mmで、顔の大きさ（頭頂から顎まで）は34〜36mmが規定です。背景は白または薄いグレーが必要です。
      </p>
      <p>
        パスポートの審査は厳しく、顔の向き・表情・背景・影の有無などについて詳細な要件があります。パスポートセンターで確認するか、写真館で撮影するのが確実です。
      </p>

      <h3>マイナンバーカード用（45×35mm）</h3>
      <p>
        マイナンバーカードの写真サイズはパスポートと同じ45×35mmです。申請方法（窓口・郵送・オンライン）によって写真の提出方法が異なります。オンライン申請ではスマホで撮影した写真をそのまま使えます。
      </p>

      <h3>運転免許証更新用（30×24mm）</h3>
        <p>
        運転免許証更新用写真は縦30mm×横24mmです。ただし各都道府県の警察署・免許センターで規格が若干異なる場合があります。持参する写真は事前に要確認です。なお、更新時は窓口での撮影が基本で、持参写真を使えない場合もあります。
      </p>

      <h2>証明写真を正しいサイズで作成するには</h2>
      <p>
        <Link href="/tools/id-photo">証明写真作成ツール</Link>では、上記の各サイズに対応したプリセットが用意されています。写真をアップロードして用途に合ったサイズを選ぶだけで、適切なサイズの証明写真を作成できます。
      </p>
      <p>
        作成後はL判（89×127mm）レイアウトに配置してダウンロードし、コンビニの写真プリントサービスで印刷できます。詳しくは<Link href="/blog/id-photo-convenience">コンビニで証明写真を印刷する方法</Link>を参照してください。
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-4 border border-amber-200 dark:border-amber-800">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">重要書類の場合は必ず公式サイトで確認を</p>
        <p className="text-[14px] text-amber-700 dark:text-amber-400">
          パスポート・マイナンバーカードなど重要書類の写真規格は改定されることがあります。申請前に各機関の公式サイトで最新の規格を確認してください。
        </p>
      </div>
    </BlogLayout>
  );
}
