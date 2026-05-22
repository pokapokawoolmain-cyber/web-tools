import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("x-post-format-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["X 改行 方法", "Twitter 改行確認", "X投稿 文字数 カウント", "X 投稿 シミュレーター", "X バズる 書き方"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        X（旧Twitter）の投稿で改行が正しく表示されているか不安……そんな悩みを解決します。投稿前にプレビューで確認できるツールと、バズる投稿に共通する改行テクニックを解説します。
      </p>

      {/* TOP CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">𝕏 投稿前に確認する</p>
        <Link href="/tools/x-post-preview" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          X投稿プレビュー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">文字数カウント・ハッシュタグ確認・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>X（旧Twitter）の改行の仕組み</h2>

      <p>
        Xでは改行（Enterキー・改行ボタン）をそのまま投稿内容に含めることができます。PCではShift+Enterで改行を入力し、スマホでは改行キーを押すと改行が入力されます。
      </p>
      <p>
        ただし<strong>2行以上の連続した空行は1行に自動圧縮</strong>されます。また文章の先頭・末尾の空白行も自動的に除去されます。投稿前にプレビューで確認することをおすすめします。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>X投稿の文字数カウントの仕組み</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">文字の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">カウント数</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["日本語（ひらがな・漢字等）", "1文字 = 1", "全角文字すべて"],
              ["英語・数字", "1文字 = 1", "半角英数字"],
              ["URL（http://〜）", "23文字固定", "文字数にかかわらず23とカウント"],
              ["改行", "1文字", "各改行が1文字としてカウント"],
              ["絵文字", "2文字", "一部は1文字の場合も"],
            ].map(([type, count, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{count}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 文字数制限</strong>
        無料アカウントは<strong>140文字</strong>が上限（日本語・英語ともに1文字換算）。X Premium加入者は最大25,000文字まで投稿可能です。
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>X投稿プレビューツールの使い方</h2>

      <div className="space-y-4 my-6">
        {[
          { step: "①", title: "プレビューツールにアクセス", body: "X投稿プレビューツール（/tools/x-post-preview）をブラウザで開きます。" },
          { step: "②", title: "投稿テキストを入力", body: "入力欄に投稿したいテキストを貼り付けるか直接入力します。文字数がリアルタイムでカウントされます。" },
          { step: "③", title: "プレビューを確認", body: "スマホ表示・PC表示を切り替えて実際の見た目を確認します。ハッシュタグ・メンション・URLも色分け表示されます。" },
          { step: "④", title: "テキストをコピーして投稿", body: "確認できたらコピーボタンでクリップボードにコピーし、Xに貼り付けて投稿します。" },
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

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">𝕏 プレビューで確認する</p>
        <Link href="/tools/x-post-preview" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          X投稿プレビュー → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">スマホ・PC表示確認・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>バズる投稿に共通する改行テクニック</h2>

      <h3>1〜2行ごとに改行を入れる</h3>
      <p>
        スマホで読む人の多いXでは、長い段落は読み飛ばされやすいです。1〜2文ごとに改行を入れると余白が生まれ、最後まで読んでもらいやすくなります。
      </p>

      <h3>最初の1行で引きつける</h3>
      <p>
        X（特にスマホ）では最初の数十文字しか表示されない場合があります。冒頭に「結論」「数字」「疑問形」を置いて「もっと見る」をタップさせることが重要です。
      </p>

      <h3>ハッシュタグは末尾に集める</h3>
      <p>
        本文の途中にハッシュタグを入れると読みにくくなります。3〜5個に絞って末尾にまとめるのが一般的な書き方です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホ（iPhone・Android）からの操作手順</h2>

      <ol className="space-y-2 list-decimal list-inside">
        <li>SafariまたはChromeでX投稿プレビューツールを開く</li>
        <li>テキスト欄に投稿文を入力または貼り付け</li>
        <li>「スマホ」プレビューで実際の表示を確認</li>
        <li>文字数が140以内であることを確認</li>
        <li>「コピー」ボタンをタップ → Xアプリに貼り付けて投稿</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/chatgpt-format">ChatGPT改行整形ツール</Link>：AIの文章をX向けに整形してからプレビューに貼り付けると効率的。</li>
        <li><Link href="/tools/ai-humanize">AI文章自然化ツール</Link>：AIっぽい表現を自然に変換してからX投稿に。</li>
        <li><Link href="/tools/word-counter">文字数カウント</Link>：詳細な文字数・行数・単語数カウントに。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/chatgpt-format-guide">ChatGPTのコピペが崩れる問題を解決｜noteやブログへの正しい貼り付け方</Link></li>
        <li><Link href="/blog/ai-text-natural-guide">AI文章が「バレる」理由と自然化する方法</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">𝕏 無料で今すぐ確認</p>
        <Link href="/tools/x-post-preview" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          X投稿プレビュー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
