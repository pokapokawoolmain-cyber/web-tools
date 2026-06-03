import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("hex-rgb-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["HEX RGB 変換 無料", "カラーコード 16進数 仕組み", "hex to rgb 計算方法", "CSS カラーコード 書き方", "rgb hsl 違い"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        CSSを書いていると必ず登場する<strong>#FF6B35</strong>や<strong>rgb(255, 107, 53)</strong>といったカラーコード。なんとなく使っているという方も多いのではないでしょうか。本記事ではHEX・RGB・HSLの仕組みと相互変換の方法を、コード例を交えてわかりやすく解説します。
      </p>

      <h2>HEXカラーコードとは？</h2>
      <p>
        HEX（ヘックス）コードは<strong>16進数（hexadecimal）</strong>を使った色の表現方法です。<code>#RRGGBB</code>の形式で、RRが赤、GGが緑、BBが青の強さを00〜FF（10進数で0〜255）で表します。
      </p>
      <ul className="space-y-2">
        <li><code>#FF0000</code> → 赤（Red=255, Green=0, Blue=0）</li>
        <li><code>#00FF00</code> → 緑（Red=0, Green=255, Blue=0）</li>
        <li><code>#0000FF</code> → 青（Red=0, Green=0, Blue=255）</li>
        <li><code>#FFFFFF</code> → 白（すべて最大値）</li>
        <li><code>#000000</code> → 黒（すべて0）</li>
      </ul>
      <p>
        短縮形として<code>#RGB</code>（3文字）も使えます。<code>#FFF</code>は<code>#FFFFFF</code>、<code>#F00</code>は<code>#FF0000</code>と同じ意味です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>RGBとは？HEXとの違い</h2>
      <p>
        RGB（Red/Green/Blue）はその名の通り赤・緑・青の光の三原色を<strong>0〜255の10進数</strong>で表す方法です。CSSでは<code>rgb(255, 107, 53)</code>のように使います。
      </p>
      <p>
        HEXとRGBは同じ色を異なる表記で表しているだけで、色自体に違いはありません。HEXの方がコンパクトで、RGBの方が人間が直感的に読みやすいという特徴があります。
      </p>

      <h3>HEX → RGB の変換方法</h3>
      <p>
        HEXの各2桁を16進数として10進数に変換するだけです。
      </p>
      <ul className="space-y-1">
        <li><code>#FF6B35</code> → FF=255, 6B=107, 35=53 → <code>rgb(255, 107, 53)</code></li>
        <li><code>#667EEA</code> → 66=102, 7E=126, EA=234 → <code>rgb(102, 126, 234)</code></li>
      </ul>
      <p>
        計算が面倒な場合は<Link href="/tools/hex-rgb-converter">カラーコード変換ツール</Link>を使えば一瞬で変換できます。
      </p>

      <h3>RGB → HEX の変換方法</h3>
      <p>
        各チャンネルの数値を16進数に変換して2桁にゼロ埋めし、<code>#</code>を付けます。
      </p>
      <ul className="space-y-1">
        <li>255 → FF, 107 → 6B, 53 → 35 → <code>#FF6B35</code></li>
        <li>0 → 00, 128 → 80, 255 → FF → <code>#0080FF</code></li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HSLとは？ダークモードに便利な理由</h2>
      <p>
        HSLは<strong>H（Hue=色相）・S（Saturation=彩度）・L（Lightness=明度）</strong>で色を表す方法です。CSSでは<code>hsl(18, 100%, 60%)</code>のように書きます。
      </p>
      <ul className="space-y-2">
        <li><strong>色相（H）</strong>：0〜360°。0が赤、120が緑、240が青</li>
        <li><strong>彩度（S）</strong>：0%が無彩色（グレー）、100%が鮮やかな色</li>
        <li><strong>明度（L）</strong>：0%が黒、50%が普通、100%が白</li>
      </ul>
      <p>
        HSLのメリットは色を直感的に調整しやすい点です。ダークモードでは同じ色相・彩度のまま<strong>明度だけを下げる</strong>ことで自然な暗い色を作れます。
      </p>

      <h3>CSS変数と組み合わせたHSLの活用例</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`:root {
  --primary-h: 220;
  --primary-s: 90%;
  --primary-l: 55%;
}

.button {
  color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
}

.dark .button {
  color: hsl(var(--primary-h), var(--primary-s), 75%); /* 明度だけ変更 */
}`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HEX・RGB・HSLの使い分けまとめ</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">形式</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">書き方例</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">向いている用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">HEX</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">#FF6B35</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">シンプルな色指定・Tailwind設定</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">RGB</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">rgb(255,107,53)</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">透明度付き rgba() の利用時</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">HSL</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">hsl(18,100%,60%)</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">ダークモード・明度を動的変更</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>無料変換ツールで即チェック</h2>
      <p>
        <Link href="/tools/hex-rgb-converter">ToolBoxJPのカラーコード変換ツール</Link>を使えば、HEX・RGB・HSLを双方向でリアルタイム変換できます。カラーピッカーで直感的に色を選ぶことも可能で、日本の伝統色20種のサンプルパレットも収録しています。
      </p>
      <p>
        配色を決めたい場合は<Link href="/tools/color-palette">カラーパレット生成ツール</Link>、コントラスト比を確認したい場合は<Link href="/tools/contrast-checker">コントラストチェッカー</Link>も合わせてご利用ください。
      </p>
    </BlogLayout>
  );
}
