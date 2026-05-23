import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("noshi-paper-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["のし紙 書き方", "のし 表書き 一覧", "のし紙 水引 選び方", "内祝い のし 書き方", "のし紙 無料 印刷"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        のし紙の「表書き」「水引の種類」「名前の書き方」——場面によって正解が異なるため迷いがちです。用途別の選び方と、ブラウザから無料で印刷する方法をまとめました。
      </p>

      {/* TOP CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🎀 今すぐのし紙を作成</p>
        <Link href="/tools/noshi-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          のし紙作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">水引・名入れ対応・A4印刷・登録不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>のし紙とは</h2>

      <p>
        のし紙（熨斗紙）とは、贈り物に掛ける包装紙のことで、<strong>水引（みずひき）</strong>と<strong>熨斗（のし）</strong>が印刷されています。正式には水引と熨斗が別々に飾り付けられますが、現代では印刷で代用するのが一般的です。
      </p>
      <p>
        弔事（葬儀・法要）には熨斗のない「掛け紙」を使い、のし紙は慶事・贈答用に使います。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>水引の種類と使い分け</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">水引の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">色</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["蝶結び（花結び）", "出産・入学・御祝・御歳暮・御中元など", "紅白"],
              ["結び切り", "婚礼・快気祝いなど「一度きり」の祝い", "紅白・金銀"],
              ["あわじ結び", "婚礼・弔事にも使える格式ある結び", "紅白・黒白"],
              ["黒白・黄白", "弔事・法要（のし紙ではなく掛け紙）", "黒白・黄白"],
            ].map(([type, use, color], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{color}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 蝶結び vs 結び切りの覚え方</strong>
        「何度あってもよいこと（出産・入学）」→ 蝶結び（ほどけて何度でも結べる）。「二度とあってほしくないこと（結婚・病気）」→ 結び切り（一度結んだら解けない）。
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>場面別・表書きの選び方一覧</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">場面</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">表書き</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">水引</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["結婚祝い", "御結婚御祝・寿", "結び切り（金銀・紅白）"],
              ["出産祝い", "御出産祝・御誕生祝", "蝶結び"],
              ["内祝い（お返し）", "内祝", "蝶結び"],
              ["出産内祝い", "出産内祝・内祝", "蝶結び"],
              ["快気祝い", "快気祝・全快祝", "結び切り"],
              ["入学・卒業祝い", "御入学祝・御卒業御祝", "蝶結び"],
              ["お中元", "御中元", "蝶結び"],
              ["お歳暮", "御歳暮", "蝶結び"],
              ["お年賀", "御年賀・新年御挨拶", "蝶結び"],
              ["昇進・就職祝い", "御昇進御祝・御就職御祝", "蝶結び"],
            ].map(([scene, text, himo], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{scene}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{text}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{himo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🎀 用途を選ぶだけで自動作成</p>
        <Link href="/tools/noshi-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          のし紙作成ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">12種の表書きテンプレ・水引選択・名入れ対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>のし紙の名前の書き方</h2>

      <h3>表書きの位置</h3>
      <p>
        水引の<strong>上段</strong>に表書き（例：御祝）、水引の<strong>下段</strong>に贈り主の名前を書きます。名前は表書きより少し小さく、フルネームが基本です。
      </p>

      <h3>連名の場合</h3>
      <p>
        2〜3名の場合は中央を最も格上の人物にし、右・左の順で書きます。4名以上は「○○一同」として、別紙に全員の名前を書いて同封します。
      </p>

      <h3>会社名を入れる場合</h3>
      <p>
        個人名の右上に少し小さく会社名・部署名を書きます。会社名のみの場合は中央に書きます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>のし紙を無料で印刷する方法</h2>

      <div className="space-y-4 my-6">
        {[
          { step: "①", title: "のし紙作成ツールにアクセス", body: "ToolBoxJPののし紙作成ツール（/tools/noshi-maker）をブラウザで開きます。スマホでも利用可能。" },
          { step: "②", title: "表書きを選択", body: "御祝・内祝・御歳暮など12種のテンプレートから選択。独自の表書きも入力できます。" },
          { step: "③", title: "水引・名前を入力", body: "水引は自動設定されますが手動変更も可能。お名前を入力して下段に反映。" },
          { step: "④", title: "印刷ボタンを押す", body: "「印刷・PDF保存」ボタンを押してA4用紙に印刷。コンビニ印刷はPDFで保存後、ネットプリントを利用。" },
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
        <li><Link href="/tools/noshi-maker">のし紙作成ツール</Link>：水引・表書き・名入れ対応。A4印刷。</li>
        <li><Link href="/tools/koden-maker">香典袋表書きメーカー</Link>：宗派別の表書きを自動選択。薄墨フォント対応。</li>
        <li><Link href="/tools/fax-cover">送付状作成ツール</Link>：ビジネス書類の送付状を素早く作成。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/koden-writing-guide">香典袋の書き方完全ガイド｜表書き・名前・金額の正しいマナー</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
        <p className="text-[13px] font-semibold text-rose-600 dark:text-rose-400 mb-1">🎀 無料で今すぐ作成</p>
        <Link href="/tools/noshi-maker" className="text-[17px] font-bold text-rose-700 dark:text-rose-300 hover:opacity-80">
          のし紙作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・A4印刷対応</p>
      </div>

    </BlogLayout>
  );
}
