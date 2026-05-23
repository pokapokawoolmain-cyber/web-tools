import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("koden-writing-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["香典袋 書き方", "御霊前 御仏前 違い", "香典 表書き 宗派", "香典袋 薄墨", "香典 金額 書き方"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        香典袋の「御霊前・御仏前どちらを使う？」「薄墨で書く理由は？」「金額は漢数字で？」——葬儀・法要のマナーを宗派別に整理し、迷わず準備できるよう解説します。
      </p>

      {/* TOP CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🕯️ 表書きを今すぐ作成</p>
        <Link href="/tools/koden-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          香典袋表書きメーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">宗派選択・薄墨フォント・金額漢数字変換・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>宗派別・表書きの選び方</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">宗派</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">四十九日前</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">四十九日後</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["仏式（浄土真宗以外）", "御霊前", "御仏前", "四十九日を境に切り替え"],
              ["仏式（浄土真宗）", "御仏前", "御仏前", "成仏の概念が異なるため最初から御仏前"],
              ["神式（神道）", "御霊前・玉串料", "御霊前・玉串料", "「御香典」も可"],
              ["キリスト教", "御花料・御霊前", "御花料", "カトリック：御ミサ料も可"],
              ["宗派不明", "御霊前・御香典", "御霊前・御香典", "どの宗派にも使える無難な表書き"],
            ].map(([religion, before, after, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{religion}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{before}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{after}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[12px] text-slate-500 dark:text-zinc-400">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 宗派がわからない場合</strong>
        「御霊前」または「御香典」はほとんどの宗派に対応できる無難な表書きです。ただし浄土真宗には「御霊前」は使えないため、不安な場合は事前に確認するか「御香典」を使いましょう。
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>名前の書き方</h2>

      <h3>個人の場合</h3>
      <p>
        表書きの下中央に<strong>薄墨</strong>でフルネームを縦書きします。ひらがなでなく漢字が基本です。
      </p>

      <h3>連名（2〜3名）の場合</h3>
      <p>
        中央に最も格上の方、右に次の方、左に三人目を書きます。夫婦連名の場合は夫のフルネームを中央に、妻の名前（名のみ）を左に書きます。
      </p>

      <h3>4名以上（団体・職場）の場合</h3>
      <p>
        「○○一同」または「○○有志」と書き、別紙に全員の名前を書いて中袋に入れます。
      </p>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🕯️ 宗派を選ぶだけで自動作成</p>
        <Link href="/tools/koden-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          香典袋表書きメーカー → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">連名対応・金額漢数字変換・印刷対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>金額の書き方（中袋）</h2>

      <p>
        中袋の表面中央に<strong>漢数字</strong>で金額を縦書きします。改ざん防止のため大字（旧字）を使うのが正式です。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">算用数字</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">漢数字（大字）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1,000円", "金壱仟圓"],
              ["3,000円", "金参仟圓"],
              ["5,000円", "金伍仟圓"],
              ["10,000円", "金壱萬圓"],
              ["30,000円", "金参萬圓"],
              ["50,000円", "金伍萬圓"],
            ].map(([num, kanji], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{num}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{kanji}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>薄墨を使う理由</h2>

      <p>
        通夜・葬儀の香典袋は<strong>薄墨</strong>で書くのがマナーです。「悲しみの涙で墨が薄まった」「突然の訃報で墨をする時間がなかった」という悲しみの気持ちを表します。
      </p>
      <p>
        薄墨の筆ペンはコンビニや100円ショップでも購入できます。用意できない場合は通常の黒墨でも失礼にはあたりません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>香典袋メーカーの使い方</h2>

      <div className="space-y-4 my-6">
        {[
          { step: "①", title: "宗派を選択", body: "仏式・神式・キリスト教・宗派不明の4種類から選択すると、適切な表書きが自動で絞り込まれます。" },
          { step: "②", title: "表書きを選択", body: "四十九日前後で表書きが変わる場合も自動でガイドします。" },
          { step: "③", title: "名前・金額を入力", body: "薄墨フォント切り替え対応。金額は自動で漢数字（大字）に変換されます。" },
          { step: "④", title: "印刷またはコピー", body: "A4用紙への印刷またはテキストコピーが可能。コンビニ印刷にも対応しています。" },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/koden-maker">香典袋表書きメーカー</Link>：宗派別表書き・薄墨フォント・漢数字変換対応。</li>
        <li><Link href="/tools/noshi-maker">のし紙作成ツール</Link>：御祝・内祝など慶事ののし紙を無料作成。</li>
        <li><Link href="/tools/resignation-letter">退職届作成ツール</Link>：会社提出用の退職届・退職願を印刷形式で作成。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/noshi-paper-guide">のし紙の書き方・選び方完全ガイド｜無料で印刷する方法</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🕯️ 無料で今すぐ作成</p>
        <Link href="/tools/koden-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          香典袋表書きメーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・印刷対応</p>
      </div>

    </BlogLayout>
  );
}
