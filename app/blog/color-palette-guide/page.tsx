import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("color-palette-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["カラーパレット 作り方", "配色 決め方 Webデザイン", "補色 類似色 トライアド 違い", "CSS カラー変数 設計", "デザイン 配色 無料ツール"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「どんな色の組み合わせにすればいいかわからない」——Webデザイン初心者が最初に悩むのが配色です。本記事では配色の基本理論（補色・類似色・トライアドなど）と、無料ツールを使った実践的なパレット作成方法を解説します。
      </p>

      <h2>配色が重要な理由</h2>
      <p>
        Webサイトの第一印象の大部分は色で決まります。一貫した配色はブランドの信頼性を高め、ユーザーを自然に導線へ誘導します。逆に配色が乱れていると、どれだけコンテンツが良くても「素人っぽい」「信頼できない」という印象を与えてしまいます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>5種類の配色パターン</h2>

      <h3>① 補色（Complementary）</h3>
      <p>
        色相環で正反対（180°）に位置する色の組み合わせです。青とオレンジ、赤と緑などが代表例。
        高いコントラストが生まれるため、CTAボタン・バッジ・アクセントカラーに最適です。
      </p>

      <h3>② 類似色（Analogous）</h3>
      <p>
        色相環で隣り合う色（±30〜60°）の組み合わせです。統一感があり柔らかい印象を与えます。
        自然・ナチュラル系のブランド、コーポレートサイト、ポートフォリオサイトに向いています。
      </p>

      <h3>③ トライアド（Triadic）</h3>
      <p>
        色相環を3等分した位置にある3色の組み合わせ（+120°・+240°）です。
        バランスが取れた豊かな配色になり、子ども向けコンテンツ・エンターテインメント系サービスに使われます。
      </p>

      <h3>④ 分裂補色（Split-Complementary）</h3>
      <p>
        補色の両隣（+150°・+210°）を使う配色です。補色より穏やかなコントラストで、扱いやすいのが特徴です。
        初心者がアクセントカラーを使いたいときに特に有効です。
      </p>

      <h3>⑤ モノクロマティック（Monochromatic）</h3>
      <p>
        同じ色相で明度・彩度だけを変える配色です。洗練されたミニマルなデザインに最適。
        テキスト・カード・区切り線などに同じ色の濃淡を使うことで、統一感のある画面が作れます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>カラーパレット生成ツールの使い方</h2>
      <p>
        <Link href="/tools/color-palette">カラーパレット生成ツール</Link>を使えば、ベースカラーを1色選ぶだけで上記5パターンのパレットが自動生成されます。
      </p>

      <h3>手順</h3>
      <ul className="space-y-2">
        <li>① ブランドカラーやメインカラーをカラーピッカーで選択（またはHEXコードを入力）</li>
        <li>② 配色パターン（補色・類似色・トライアドなど）をボタンで切り替え</li>
        <li>③ 気に入った配色の各色を個別にコピー、または「全色コピー」でCSS変数としてまとめてコピー</li>
        <li>④ CSSの <code>:root {`{}`}</code> ブロックに貼り付けて使用</li>
      </ul>

      <h3>CSS変数として使う</h3>
      <pre className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-4 text-[12px] font-mono overflow-x-auto">{`:root {
  --color-1: #667EEA;
  --color-2: #7B8FEF;
  --color-3: #5A6FE5;
  --color-4: #EA8266;
  --color-5: #EA9566;
}

.button-primary {
  background-color: var(--color-1);
}

.button-accent {
  background-color: var(--color-4); /* 補色を使ったCTAボタン */
}`}</pre>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>配色を決めるときのヒント</h2>
      <ul className="space-y-3">
        <li>
          <strong>60-30-10ルール</strong>：メインカラー60%・サブカラー30%・アクセントカラー10%の比率で使うと自然なバランスになります
        </li>
        <li>
          <strong>コントラストを確認する</strong>：テキストと背景の組み合わせはWCAG基準（4.5:1以上）を満たしているか<Link href="/tools/contrast-checker">コントラストチェッカー</Link>で確認しましょう
        </li>
        <li>
          <strong>色の意味を意識する</strong>：青は信頼・安心、赤は緊急・情熱、緑は自然・成功など、色が持つ印象をブランドイメージに合わせて選びましょう
        </li>
        <li>
          <strong>グレーを活用する</strong>：テキスト・区切り線・背景にはグレーを多用することで、アクセントカラーが際立ちます
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <p>
        配色が決まったら<Link href="/tools/gradient-generator">グラデーション生成ツール</Link>でCSS背景グラデーションを作成したり、
        <Link href="/tools/hex-rgb-converter">HEX・RGB変換ツール</Link>でHSL値に変換してダークモード対応を進めましょう。
      </p>
    </BlogLayout>
  );
}
