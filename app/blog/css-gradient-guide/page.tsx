import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("css-gradient-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["CSS グラデーション 書き方", "linear-gradient 使い方", "radial-gradient conic-gradient 例", "background gradient CSS コピペ", "CSSグラデーション ジェネレーター 無料"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        CSSのグラデーションはWebデザインで最もよく使われる視覚効果のひとつです。<code>linear-gradient</code>・<code>radial-gradient</code>・<code>conic-gradient</code>の3種類を、コピペで使えるコード例とともに解説します。
      </p>

      <h2>linear-gradient（線形グラデーション）</h2>
      <p>
        指定した角度や方向に沿って色が変化する最も基本的なグラデーションです。
      </p>

      <h3>基本的な書き方</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* 角度を指定（135度） */
background: linear-gradient(135deg, #667eea, #764ba2);

/* 方向キーワード */
background: linear-gradient(to right, #ff6b6b, #feca57);
background: linear-gradient(to bottom right, #00b09b, #96c93d);

/* 3色以上のグラデーション */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);`}</pre>

      <h3>よく使われる角度</h3>
      <ul className="space-y-1 text-[13px]">
        <li><code>0deg</code> — 下から上</li>
        <li><code>90deg</code> — 左から右</li>
        <li><code>135deg</code> — 左上から右下（斜め、よく使われる）</li>
        <li><code>180deg</code> — 上から下（デフォルトと同じ）</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>radial-gradient（放射状グラデーション）</h2>
      <p>
        中心から円状・楕円状に広がるグラデーションです。スポットライト効果やアイコン背景に使われます。
      </p>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* 基本（円形） */
background: radial-gradient(circle, #667eea, #764ba2);

/* 中心位置を指定 */
background: radial-gradient(circle at top left, #ff6b6b, #feca57);

/* サイズ指定 */
background: radial-gradient(circle 200px at center, #00c6ff, transparent);`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>conic-gradient（円錐グラデーション）</h2>
      <p>
        中心点を軸に回転しながら色が変わるグラデーションです。円グラフ風デザインやカラーホイールに活用できます。
      </p>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`/* 基本 */
background: conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b);

/* 開始角度を指定 */
background: conic-gradient(from 45deg, red, blue);

/* 円グラフ風（50/50） */
background: conic-gradient(#667eea 50%, #764ba2 50%);`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>実践的な使い方例</h2>

      <h3>ヘッダー・バナー背景</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 24px;
}`}</pre>

      <h3>ボタンのグラデーション</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`.btn-gradient {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-gradient:hover {
  opacity: 0.85;
}`}</pre>

      <h3>テキストにグラデーションをかける</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 48px;
}`}</pre>

      <h3>Tailwind CSSでのグラデーション</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`<!-- Tailwind CSS v3 標準クラス -->
<div class="bg-gradient-to-r from-purple-500 to-pink-500">...</div>

<!-- カスタムカラーはstyleで -->
<div style="background: linear-gradient(135deg, #667eea, #764ba2)">...</div>`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>無料グラデーション生成ツール</h2>
      <p>
        コードを手書きするのが面倒な場合は<Link href="/tools/gradient-generator">CSSグラデーション生成ツール</Link>を使いましょう。
        Linear・Radial・Conicを視覚的に設定し、カラーストップを追加してCSSコードをワンクリックでコピーできます。
        20種類のプリセットもあるので、すぐに使えるグラデーションが見つかります。
      </p>
    </BlogLayout>
  );
}
