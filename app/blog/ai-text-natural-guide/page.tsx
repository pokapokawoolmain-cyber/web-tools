import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("ai-text-natural-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["AI文章 バレる", "ChatGPT 文章 自然化", "AIっぽい 文章 修正", "AI感 なくす", "AI文章 人間らしく"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「この文章、AIが書いたよね？」——そう思われてしまうAI文章には共通のパターンがあります。特徴を知って自動修正すれば、読者に気づかれない自然な文章が作れます。
      </p>

      {/* TOP CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">🤖 このツールで今すぐ自然化</p>
        <Link href="/tools/ai-humanize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          AI文章自然化ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">AI感スコア表示・登録不要・ブラウザ完結</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>AI文章が「バレる」6つのパターン</h2>

      <p>
        ChatGPTやClaudeが生成する日本語文章には、繰り返し出現する特徴的なパターンがあります。読者がこれらのパターンを無意識に感じ取ることで「AIっぽい」と判断します。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">パターン</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">AI文章の例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">自然化後</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["段落冒頭の繰り返し", "まず〜。次に〜。また〜。さらに〜。", "文脈に合った接続詞を使い分ける"],
              ["冗長な動詞", "〜することができます", "〜できます"],
              ["固い言い回し", "〜という点において", "〜の点で"],
              ["語尾の均一化", "〜です。〜ます。〜です。〜ます。", "体言止め・省略表現を混ぜる"],
              ["過剰な強調語", "非常に重要、極めて効果的", "とても重要、かなり効果的"],
              ["説明的すぎる結び", "〜ということが言えます", "〜と言えます・〜でしょう"],
            ].map(([pattern, ai, natural], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{pattern}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-red-600 dark:text-red-400">{ai}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400">{natural}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自然化の最も簡単な方法</h2>

      <p>
        手動で修正するには時間がかかりますが、<Link href="/tools/ai-humanize">AI文章自然化ツール</Link>を使えばワンクリックで自動修正できます。
      </p>

      <div className="space-y-4 my-6">
        {[
          { step: "①", title: "AI文章を貼り付け", body: "ChatGPT・Claude・GeminiなどのAIが生成した文章を貼り付けます。" },
          { step: "②", title: "変換モードを選択", body: "ビジネス文書・SNS投稿・ブログ記事の3モードから用途に合わせて選択します。" },
          { step: "③", title: "AI感スコアを確認", body: "入力した文章のAI感を0〜100でスコアリング。70以上なら修正が必要です。" },
          { step: "④", title: "自然化テキストをコピー", body: "修正箇所がハイライト表示されます。確認してコピーするだけです。" },
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
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">🤖 AI感スコアを確認する</p>
        <Link href="/tools/ai-humanize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          AI文章自然化ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">スマホ・PC対応・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>変換モード別の特徴</h2>

      <h3>ビジネスモード</h3>
      <p>
        丁寧語を維持しながら冗長な表現を圧縮します。「させていただきます」→「します」、「しております」→「しています」など、読みやすさを保ちながら簡潔にします。
      </p>

      <h3>SNSモード</h3>
      <p>
        テンポよく読めるよう語尾をカジュアルに変換します。「ます。」→「！」、「しています」→「してる」など、SNSらしい口語調にします。
      </p>

      <h3>ブログモード</h3>
      <p>
        読者への語りかけ表現を意識した親しみやすい文体に変換します。「なお、」→「ちなみに、」など、読者を意識した表現に整えます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>手動で自然化する5つのテクニック</h2>

      <ul className="space-y-2">
        <li><strong>語尾を変化させる</strong>：「〜です。〜ます。〜です。」の繰り返しに、体言止め（「〜が重要」）や疑問形（「〜ではないでしょうか」）を混ぜる。</li>
        <li><strong>一文を短くする</strong>：AIは長い複合文を好みます。句読点で切って短い文にするだけで読みやすくなります。</li>
        <li><strong>接続詞を削る</strong>：「まず」「次に」「また」「さらに」が多すぎると機械的に見えます。文脈で自然に繋がる場合は削除します。</li>
        <li><strong>冗長表現を短縮する</strong>：「〜することができます」→「〜できます」のように動詞を直接的に使います。</li>
        <li><strong>自分の言葉を1文混ぜる</strong>：AIの文章に自分の実体験・感想を1〜2文追加するだけで一気に人間らしくなります。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>AI文章はSEOに影響しますか？</h2>

      <p>
        GoogleはAI生成コンテンツそのものを禁止していません（2023年2月のガイドライン更新で明示）。ただし「品質・有用性・独自の視点」が重要視されており、AIのコピペそのままでは低品質コンテンツと判定される可能性があります。自然化・加筆・独自情報の追加が有効です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/chatgpt-format">ChatGPT改行整形ツール</Link>：自然化の前にまず改行・フォーマットを整えたい場合に。</li>
        <li><Link href="/tools/note-format">note記事整形ツール</Link>：noteに特化した整形。プレビュー確認付き。</li>
        <li><Link href="/tools/word-counter">文字数カウント</Link>：自然化後の文字数確認に。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/chatgpt-format-guide">ChatGPTのコピペが崩れる問題を解決｜noteやブログへの正しい貼り付け方</Link></li>
        <li><Link href="/blog/x-post-format-guide">X（旧Twitter）投稿の改行テクニック｜バズる投稿の書き方</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">🤖 無料で今すぐ試す</p>
        <Link href="/tools/ai-humanize" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          AI文章自然化ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
