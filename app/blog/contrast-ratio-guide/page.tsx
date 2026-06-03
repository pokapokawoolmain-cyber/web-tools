import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("contrast-ratio-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["WCAG コントラスト比 基準", "Webアクセシビリティ 色 チェック", "コントラスト比 4.5 7 違い", "JIS X 8341 アクセシビリティ", "色覚 弱視 配色"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「おしゃれな配色だけど文字が読みにくい」——デザイナーとエンジニアが陥りがちな落とし穴です。本記事では、Webアクセシビリティの国際標準<strong>WCAG 2.1</strong>のコントラスト比基準と、無料ツールを使った確認方法を解説します。
      </p>

      <h2>コントラスト比とは？</h2>
      <p>
        コントラスト比（Contrast Ratio）とは、<strong>文字色と背景色の明るさの差</strong>を数値化したものです。
        白背景に黒文字は最大値の21:1、白背景に白文字は最小値の1:1となります。
      </p>
      <p>
        値が高いほど文字が見やすく、弱視・高齢者・色覚異常のある方がテキストを認識しやすくなります。
        また、明るい屋外でスマートフォンを見る場合にも高コントラストが重要になります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>WCAG 2.1のコントラスト基準</h2>
      <p>
        W3Cが定める<strong>WCAG（Web Content Accessibility Guidelines）</strong>では、コントラスト比に関して次の基準を設けています。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">基準</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">通常テキスト</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">大きなテキスト</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">適用場面</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-bold">AA（最低基準）</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">4.5:1 以上</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">3:1 以上</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">ほとんどのWebサイト</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-bold">AAA（最高基準）</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">7:1 以上</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">4.5:1 以上</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">医療・官公庁・金融</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        「大きなテキスト」とは、通常ウェイトで18px以上、または太字（bold）で14px以上のテキストを指します。
        見出しはこちらの基準（3:1以上）が適用されることが多いです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>なぜ今アクセシビリティ対応が重要なのか</h2>
      <ul className="space-y-3">
        <li>
          <strong>法的義務化の流れ</strong>：日本では2024年に改正された障害者差別解消法の合理的配慮義務化により、Webアクセシビリティへの対応が民間事業者にも求められています。JIS X 8341-3（高齢者・障害者等配慮設計指針）もWCAGに対応しています。
        </li>
        <li>
          <strong>ユーザー層の広がり</strong>：日本の高齢化率は約29%。視力が低下した高齢ユーザーにも読みやすいサイトは、全ユーザーに使いやすいサイトでもあります。
        </li>
        <li>
          <strong>SEO効果</strong>：Googleはアクセシビリティの高いサイトを評価する傾向があり、Core Web Vitalsにも間接的に影響します。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>コントラスト比の計算方法</h2>
      <p>
        WCAG 2.1で定められた計算式は以下の通りです。
      </p>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`コントラスト比 = (L1 + 0.05) / (L2 + 0.05)

L1 = 明るい方の相対輝度（Relative Luminance）
L2 = 暗い方の相対輝度

相対輝度の計算：
RGB値を 0〜1 に正規化してガンマ補正を適用
L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}</pre>
      <p>
        計算が複雑なため、<Link href="/tools/contrast-checker">コントラストチェッカーツール</Link>を使えば入力するだけで即座に判定できます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある失敗パターンと改善例</h2>
      <ul className="space-y-3">
        <li>
          <strong>グレーテキスト on 白背景</strong>：#999999 on #FFFFFF → コントラスト比2.85:1（AA不合格）。
          #767676以上の暗いグレーにするとAA合格（4.54:1）になります。
        </li>
        <li>
          <strong>ブランドカラーのボタンテキスト</strong>：青背景(#4a90d9)に白テキスト → 3.09:1（AA不合格）。
          より濃い青(#1d4ed8)に変えると4.76:1でAA合格になります。
        </li>
        <li>
          <strong>薄いグラデーション背景上のテキスト</strong>：グラデーションは場所によってコントラストが変わるため、最も淡い部分でもAA合格かどうか確認が必要です。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>コントラストチェッカーの使い方</h2>
      <p>
        <Link href="/tools/contrast-checker">ToolBoxJPのコントラストチェッカー</Link>で以下の手順で確認できます：
      </p>
      <ul className="space-y-2">
        <li>① 文字色（Foreground）と背景色（Background）を入力</li>
        <li>② コントラスト比とWCAG AA/AAA判定が即表示</li>
        <li>③ プレビューで実際の見え方を確認</li>
        <li>④ テキストサイズ（通常/大きな）を切り替えて基準確認</li>
      </ul>
    </BlogLayout>
  );
}
