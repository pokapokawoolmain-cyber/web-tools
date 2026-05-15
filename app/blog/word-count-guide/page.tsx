import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("word-count-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["文字数 カウント 方法", "Twitter 文字数 制限", "文字数 確認 ツール", "文字数 無料 オンライン", "word count 日本語"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「Twitterに投稿しようとしたら文字数オーバーだった」「レポートの字数制限を確認したい」——文字数を素早く数えたいときに役立つツールと活用方法を紹介します。
      </p>

      <h2>文字数カウントが役立つ場面</h2>
      <ul className="space-y-2">
        <li><strong>Twitter・X</strong>：140文字制限の確認（URLは23文字換算）</li>
        <li><strong>Instagram</strong>：キャプションの2,200文字制限の確認</li>
        <li><strong>大学レポート・論文</strong>：指定字数（2,000字以上3,000字以内など）の確認</li>
        <li><strong>履歴書・職務経歴書</strong>：志望動機欄・自己PRの字数調整</li>
        <li><strong>メルマガ・LPコピー</strong>：段落ごとの文字数バランス確認</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>文字数を数える方法</h2>

      <h3>ブラウザのツールを使う</h3>
      <p>
        <Link href="/tools/word-counter">文字数カウントツール</Link>にテキストを貼り付けると即座に文字数・行数・単語数が表示されます。
      </p>
      <ul className="space-y-2">
        <li>スペース・改行を含む文字数</li>
        <li>スペース・改行を除く文字数</li>
        <li>全角・半角の内訳</li>
      </ul>

      <h3>Wordで確認する</h3>
      <p>
        Microsoft Wordでは「校閲」→「文字カウント」で確認できます。ただしWord独自のカウント方式（スペースや記号の扱い）と、SNSや審査システムのカウント方式が異なる場合があります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>SNS別の文字数制限一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">サービス</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">文字数上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["X（旧Twitter）", "140文字", "URLは短縮されて23文字換算"],
              ["Instagram", "2,200文字", "キャプション。ハッシュタグ込み"],
              ["LINE メッセージ", "1万文字", "通常の使用では上限を意識しない"],
              ["Facebookの投稿", "6万3千文字", "実用上ほぼ制限なし"],
              ["YouTubeの説明欄", "5,000文字", "タイトルは100文字まで"],
            ].map(([service, limit, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{service}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{limit}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400 text-[12px]">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>Twitterの文字数カウントの仕組み</h2>
      <p>
        X（旧Twitter）の文字数は日本語・英語ともに1文字としてカウントされます。ただしURLは実際の文字数に関わらず、短縮処理されて23文字としてカウントされます。また絵文字は1〜2文字としてカウントされるものがあります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>全角・半角の違いとカウント</h2>
      <p>
        ほとんどのサービス・ツールでは全角文字（日本語・漢字等）も半角文字（英数字）も1文字としてカウントします。ただし一部の古いシステムでは全角を2文字、半角を1文字とするバイト数換算を使っている場合があります。
      </p>
      <p>
        フォームに文字数制限がある場合は、事前に<Link href="/tools/word-counter">文字数カウントツール</Link>で確認してから入力することをおすすめします。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">関連ツール</strong>
        URLを短縮して貼り付けたい場合は<Link href="/tools/short-link" className="text-blue-600 dark:text-blue-400 hover:underline">URL短縮ツール</Link>も活用できます。
      </div>
    </BlogLayout>
  );
}
