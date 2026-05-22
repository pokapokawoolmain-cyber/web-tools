import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("chatgpt-format-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ChatGPT 改行 整形", "AI文章 コピペ 崩れる", "ChatGPT note 貼り付け", "AI 文章 整形 無料", "ChatGPT ブログ 貼り付け"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        ChatGPTの文章をnoteやブログにそのままコピペすると、改行が崩れて「#」や「**」などの記号が表示されてしまう——この問題を無料ツールで瞬時に解決できます。この記事では原因と対策を詳しく解説します。
      </p>

      {/* TOP CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/chatgpt-format" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          ChatGPT改行整形ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ChatGPTのコピペが崩れる原因</h2>

      <p>
        ChatGPTは内部的に<strong>Markdown記法</strong>で文章を出力します。Markdownとは、<code>#</code>で見出し、<code>**テキスト**</code>で太字、<code>-</code>や<code>*</code>で箇条書きを表現するテキスト形式です。
      </p>
      <p>
        ChatGPT自体のUIはMarkdownを解釈して見やすく表示してくれますが、<strong>noteやWordPress、はてなブログの通常の入力欄</strong>ではMarkdownをそのままコピーしても記号が文字として表示されてしまい崩れます。
      </p>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ よくある崩れ方</p>
        <ul className="mt-2 space-y-1 text-[13px] text-amber-700 dark:text-amber-400">
          <li>• <code>## 見出し</code> → そのまま「## 見出し」と表示される</li>
          <li>• <code>**重要**</code> → 「**重要**」とアスタリスクが残る</li>
          <li>• <code>- 箇条書き</code> → 「- 箇条書き」とハイフンが残る</li>
        </ul>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>最も簡単な解決方法</h2>

      <p>
        <Link href="/tools/chatgpt-format">ChatGPT改行整形ツール</Link>を使えば、AI出力をそのまま貼り付けるだけで各プラットフォームに最適化されたテキストに自動変換されます。
      </p>

      <div className="space-y-4 my-6">
        {[
          { step: "①", title: "整形ツールにアクセス", body: "ChatGPT改行整形ツール（/tools/chatgpt-format）をブラウザで開きます。アプリのインストールや登録は不要です。" },
          { step: "②", title: "投稿先のモードを選択", body: "note・ブログ・X・LINE・Discordから投稿先を選びます。各プラットフォームに最適なフォーマットで整形されます。" },
          { step: "③", title: "AI文章を貼り付け", body: "ChatGPTやClaudeからコピーした文章を入力欄に貼り付けます。リアルタイムで整形結果が右側に表示されます。" },
          { step: "④", title: "整形後テキストをコピー", body: "「ワンタップコピー」ボタンをタップするだけで整形済みテキストがクリップボードにコピーされます。あとは投稿先に貼り付けるだけです。" },
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

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>プラットフォーム別の整形モード</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">モード</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">主な変換内容</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["note", "Markdown記号除去・見出し前後に空白追加・箇条書き「・」変換", "note.com への記事投稿"],
              ["ブログ", "見出し記号を▍■◆に変換・段落整形", "WordPress・はてなブログ"],
              ["X", "Markdown全除去・文字数最適化・【】見出し変換", "X（旧Twitter）投稿"],
              ["LINE", "太字を【】変換・段落を短くカット", "LINEメッセージ送信"],
              ["Discord", "Discord対応Markdown維持・箇条書き変換", "Discordサーバー投稿"],
            ].map(([mode, content, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{mode}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{content}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">✨ 今すぐ試す</p>
        <Link href="/tools/chatgpt-format" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          ChatGPT改行整形ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">スマホ・PC対応・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホからの使い方</h2>

      <p>
        スマホ（iPhone・Android）でもブラウザから全機能を使えます。ChatGPTアプリで文章を生成 → コピー → ブラウザで整形ツールを開いて貼り付け → 整形 → コピー → note/ブログアプリに貼り付け、という流れが最速です。
      </p>

      <h3>iPhoneからnoteに貼り付ける最速手順</h3>
      <ol className="space-y-2 list-decimal list-inside">
        <li>ChatGPTアプリで回答をコピー</li>
        <li>SafariでToolBoxJPの整形ツールを開く</li>
        <li>「note」モードを選択して貼り付け</li>
        <li>「ワンタップコピー」をタップ</li>
        <li>noteアプリに貼り付けて投稿</li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ChatGPTの出力をそのまま使う方法（設定変更）</h2>

      <p>
        ChatGPTに「Markdownを使わずプレーンテキストで回答してください」と指示すれば、整形なしで使えるテキストが出力されます。ただし見出し・箇条書きの視認性が落ちるため、整形ツールを使う方が実用的です。
      </p>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 プロンプト例</strong>
        「以下の内容をMarkdownなし、プレーンテキストで出力してください。見出しは【】で囲んでください。」
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>失敗しやすいポイント</h2>

      <ul className="space-y-2">
        <li><strong>整形後にもう一度編集が必要な場合がある</strong>：コードブロック（```）の中身は除去されます。コード部分は別途手動で貼り付けてください。</li>
        <li><strong>noteのリッチエディタとの相性</strong>：noteのリッチエディタ（見出しボタンなどがあるもの）に貼ると崩れる場合があります。プレーンテキスト欄に貼るか、マークダウンエディタモードを使ってください。</li>
        <li><strong>絵文字は変換されない</strong>：絵文字はそのまま維持されます。X向けに文字数を削減したい場合は絵文字を減らすのが有効です。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>

      <ul className="space-y-2">
        <li><Link href="/tools/ai-humanize">AI文章自然化ツール</Link>：整形した後にAIっぽさが気になる場合に。語尾・言い回しを自然な日本語に変換。</li>
        <li><Link href="/tools/note-format">note記事整形ツール</Link>：note専用の整形に特化。note風プレビューで仕上がりを確認できる。</li>
        <li><Link href="/tools/x-post-preview">X投稿プレビュー</Link>：X向けに整形した後、実際の投稿表示を確認。文字数・ハッシュタグもチェック。</li>
        <li><Link href="/tools/word-counter">文字数カウント</Link>：整形後の文字数を正確にカウント。X・履歴書など文字数制限がある場合に。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>

      <ul className="space-y-2">
        <li><Link href="/blog/ai-text-natural-guide">AI文章が「バレる」理由と自然化する方法｜ChatGPT・Claude対応</Link></li>
        <li><Link href="/blog/x-post-format-guide">X（旧Twitter）投稿の改行テクニック｜バズる投稿の書き方</Link></li>
        <li><Link href="/blog/pdf-watermark-guide">PDFに透かしを入れる方法｜無料ブラウザ完結</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400 mb-1">✨ 無料で今すぐ試す</p>
        <Link href="/tools/chatgpt-format" className="text-[17px] font-bold text-violet-700 dark:text-violet-300 hover:opacity-80">
          ChatGPT改行整形ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
