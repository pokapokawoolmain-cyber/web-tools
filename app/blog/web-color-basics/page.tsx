import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("web-color-basics")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["Web カラーコード 基礎 初心者", "HEX RGB HSL 使い分け", "CSS 色 指定方法", "カラーコード 覚え方", "Webデザイン 色 基礎知識"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        Web制作を始めたばかりの方が最初に混乱するのがカラーコードの種類です。<strong>#FF6B35</strong>（HEX）・<strong>rgb(255, 107, 53)</strong>（RGB）・<strong>hsl(18, 100%, 60%)</strong>（HSL）——これらはすべて「同じオレンジ色」を表しています。本記事では3つの形式の違いと使い分けを初心者向けに解説します。
      </p>

      <h2>なぜカラーコードが3種類あるの？</h2>
      <p>
        コンピューターの画面は赤・緑・青の光を組み合わせて色を表現します（RGB）。HEXはこのRGBを16進数で短く書いたもの、HSLは人間が色を感じる感覚（色相・彩度・明度）に合わせた表現です。同じ色でも表記方法が異なるため、場面に応じて使い分けることが重要です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HEX（16進数カラーコード）</h2>
      <p>
        <code>#RRGGBB</code>の形式で、R・G・Bそれぞれを00〜FFの16進数2桁で表します。
      </p>

      <h3>特徴</h3>
      <ul className="space-y-1">
        <li>✅ 最もコンパクトで書きやすい（7文字）</li>
        <li>✅ HTMLとCSSで最も広く使われる形式</li>
        <li>✅ デザインツール（Figma・Photoshop）がHEXで色を表示</li>
        <li>⚠️ 人間が見ても色を想像しにくい</li>
      </ul>

      <h3>使い所</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* 基本的な色指定 */
color: #FF6B35;
background-color: #FFFFFF;

/* Tailwind CSS カスタムカラー */
// tailwind.config.js
colors: {
  brand: '#667EEA',
  accent: '#764BA2',
}`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>RGB（赤・緑・青）</h2>
      <p>
        <code>rgb(R, G, B)</code>の形式で、各チャンネルを0〜255の10進数で指定します。
        透明度が必要な場合は<code>rgba(R, G, B, A)</code>（Aは0〜1）を使います。
      </p>

      <h3>特徴</h3>
      <ul className="space-y-1">
        <li>✅ 透明度（アルファ値）を rgba() で指定できる</li>
        <li>✅ JavaScriptでの計算・操作がしやすい</li>
        <li>✅ CSS変数と組み合わせて透明度を動的に変更できる</li>
        <li>⚠️ HEXより文字数が多い</li>
      </ul>

      <h3>使い所</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* 透明度が必要なとき */
background-color: rgba(102, 126, 234, 0.5); /* 50%透明 */
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

/* CSS変数と組み合わせ（モダンな方法） */
:root {
  --brand-rgb: 102, 126, 234;
}
.overlay {
  background-color: rgb(var(--brand-rgb) / 0.3);
}`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>HSL（色相・彩度・明度）</h2>
      <p>
        <code>hsl(H, S%, L%)</code>の形式。Hは色相（0〜360°）、Sは彩度（0〜100%）、Lは明度（0〜100%）です。
      </p>

      <h3>特徴</h3>
      <ul className="space-y-1">
        <li>✅ 人間の色覚に近く、直感的に調整しやすい</li>
        <li>✅ ダークモード実装で同じ色相のまま明度だけ変えられる</li>
        <li>✅ 配色理論（補色は+180°）をコードで表現しやすい</li>
        <li>⚠️ 3つの数値を覚える必要がある</li>
      </ul>

      <h3>使い所</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* ダークモードで明度だけ変える */
:root {
  --primary: hsl(220, 90%, 55%);
}
.dark {
  --primary: hsl(220, 90%, 70%); /* 明度を上げるだけ */
}

/* ホバーエフェクト */
.button {
  background: hsl(220, 90%, 55%);
}
.button:hover {
  background: hsl(220, 90%, 45%); /* 暗くする */
}`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>3形式の使い分けまとめ</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">場面</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">推奨形式</th>
              <th className="p-2 text-left border border-slate-200 dark:border-zinc-700">理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">基本的な色指定</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">HEX</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">短くて書きやすい</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">半透明・シャドウ</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">rgba()</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">アルファ値が指定できる</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">ダークモード対応</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">HSL</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">明度だけ変えて自然な暗色に</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">Tailwindカスタムカラー</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">HEX</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">config.jsに貼りやすい</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">JS での色計算</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700 font-mono">RGB / HSL</td>
              <td className="p-2 border border-slate-200 dark:border-zinc-700">数値として操作しやすい</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツールで実践</h2>
      <p>
        3形式の変換は<Link href="/tools/hex-rgb-converter">カラーコード変換ツール</Link>で即座に行えます。
        配色を決めたい場合は<Link href="/tools/color-palette">カラーパレット生成ツール</Link>、
        グラデーションを作成したい場合は<Link href="/tools/gradient-generator">CSSグラデーション生成ツール</Link>、
        文字の読みやすさを確認したい場合は<Link href="/tools/contrast-checker">コントラストチェッカー</Link>をご利用ください。
      </p>
    </BlogLayout>
  );
}
