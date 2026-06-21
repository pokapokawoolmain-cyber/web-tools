import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "転載・引用ガイドライン｜ToolBoxJP",
  description: "ToolBoxJPのブログ記事・ツール解説コンテンツの転載・引用・SNS拡散に関するガイドラインです。出典明記を条件に転載を許可しています。",
  path: "/about/reprint",
});

export default function ReprintPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <nav className="text-[13px] text-slate-400 dark:text-zinc-500 mb-8 flex items-center gap-1">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-zinc-300">ToolBox</Link>
          <span>›</span>
          <Link href="/about" className="hover:text-slate-600 dark:hover:text-zinc-300">About</Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-zinc-300">転載・引用ガイドライン</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            転載・引用ガイドライン
          </h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
            ToolBoxJPのコンテンツを転載・引用・SNSでシェアしたい方へのガイドラインです。<strong className="text-slate-700 dark:text-zinc-200">出典を明記いただければ、申請不要で転載・引用が可能です。</strong>
          </p>
        </header>

        {/* 許可していること */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[11px] flex items-center justify-center font-bold">✓</span>
            許可していること
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "ブログ記事の部分引用",
                desc: "記事の一部（段落・表・リスト等）を引用元URLとともに掲載すること。引用は著作権法上の引用ルール（主従関係・出典明記）に従ってください。",
              },
              {
                title: "note・はてなブログ・Qiita 等への転載",
                desc: "記事全文または一部を他のプラットフォームへ転載すること。下記の出典表記フォーマットを記事内に明記してください。申請は不要です。",
              },
              {
                title: "SNS（X・Instagram・Facebook 等）でのシェア",
                desc: "記事URLのシェア・スクリーンショット引用・要約投稿はすべて自由です。申請・連絡は不要です。",
              },
              {
                title: "社内資料・勉強会資料への引用",
                desc: "非商業目的の社内利用・教育目的での引用は出典明記のうえ自由に使えます。",
              },
              {
                title: "早見表・比較表のスプレッドシートへの転記",
                desc: "手取り一覧・手数料比較などの表データを個人利用のスプレッドシートへ転記すること。",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/20">
                <span className="flex-shrink-0 text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px]">{title}</p>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* お断りしていること */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            お断りしていること
          </h2>
          <div className="space-y-3">
            {[
              "出典（URL）を明記しない全文転載",
              "転載元をToolBoxJPと偽る・著作者を改ざんする行為",
              "商業目的での全文転載・有料コンテンツへの転用",
              "SEOスパム目的での大量コピー・自動生成サイトへの転用",
              "ToolBoxJPのツール・コードを無断でコピーして別サービスとして公開すること",
            ].map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20">
                <span className="flex-shrink-0 text-red-400 font-bold mt-0.5">✗</span>
                <p className="text-[14px] text-slate-700 dark:text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 出典表記フォーマット */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">出典表記の書き方</h2>
          <p className="text-[14px] text-slate-500 dark:text-zinc-400 mb-4">
            転載・引用の際は、以下のいずれかの形式で出典を明記してください。
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900">
              <p className="text-[12px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">テキスト形式（推奨）</p>
              <code className="block text-[13px] text-slate-800 dark:text-zinc-200 font-mono bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-zinc-700">
                出典：ToolBoxJP「記事タイトル」（https://www.toolboxjp.com/blog/記事スラグ）
              </code>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900">
              <p className="text-[12px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">Markdown / HTML リンク形式</p>
              <code className="block text-[13px] text-slate-800 dark:text-zinc-200 font-mono bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-zinc-700 whitespace-pre-wrap">
                {`参考：[記事タイトル - ToolBoxJP](https://www.toolboxjp.com/blog/記事スラグ)`}
              </code>
            </div>
          </div>
        </section>

        {/* リンクについて */}
        <section className="mb-10 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
          <h2 className="text-[15px] font-bold text-blue-800 dark:text-blue-300 mb-2">リンクはそのまま貼ってください</h2>
          <p className="text-[14px] text-blue-700 dark:text-blue-400 leading-relaxed">
            転載・引用の際はリンクを<strong>nofollow なし</strong>で貼ることを推奨します。
            ToolBoxJPはすべてのコンテンツを無料で公開しています。被リンクはサイトの維持・発展に直結するため、通常のリンク（フォローリンク）で貼っていただけると大変助かります。
          </p>
        </section>

        {/* 連絡先 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">ご連絡・お問い合わせ</h2>
          <p className="text-[14px] text-slate-500 dark:text-zinc-400 leading-relaxed">
            転載の申請は不要ですが、「記事を使わせてもらいました」「ここに転載しました」などのご連絡は歓迎しています。
            X（旧Twitter）でのメンションや
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">お問い合わせページ</Link>
            からご連絡ください。シェアの報告も大歓迎です。
          </p>
        </section>

        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 text-[13px] text-slate-400 dark:text-zinc-600">
          <p>最終更新：2026年6月</p>
          <Link href="/about" className="mt-2 inline-block text-blue-600 dark:text-blue-400 hover:underline">← About に戻る</Link>
        </div>
      </div>
    </div>
  );
}
