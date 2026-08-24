import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("construction-kicko-aisatsu-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["工事 着工 挨拶 文", "工事 着工 近隣 挨拶", "工事 近所 挨拶 文", "近隣 挨拶 文", "工事のお知らせ 近隣挨拶", "工事挨拶文 テンプレート"],
  type: "article",
});

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-4 my-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[14px] flex items-center justify-center">{n}</div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
        <p className="text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        工事の近隣挨拶で近所トラブルになるのは、実は「挨拶をしなかった」ケースより「挨拶はしたが、伝え方や範囲が不十分だった」ケースの方が多くあります。
        この記事では、着工前の挨拶回りを<strong>失敗しないための実践的な手順</strong>を、訪問の順番・話す内容の順序・不在時の対応まで具体的に解説します。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 挨拶文をその場で作る</p>
        <Link href="/tools/neighbor-greeting" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          工事近隣挨拶文メーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">工事種別を選んで情報を入れるだけ。登録不要・印刷/PDF対応。この記事の手順とあわせて使うと、迷わず挨拶回りの準備ができます。</p>
      </div>

      <h2>着工前の挨拶回り、5つのステップ</h2>
      <p className="text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed mb-2">
        「近隣挨拶」と「着工挨拶」は基本的に同じものです。実際に重機・トラックが動き出す<strong className="text-slate-800 dark:text-zinc-200">着工日の3〜7日前</strong>までに、次の順番で進めると漏れやトラブルを防げます。
      </p>
      <Step n={1} title="訪問先をリストアップする" body="現場に近い家から順に、地図やメモに訪問先を書き出します。両隣・向かい3軒・裏3軒（向こう三軒両隣）が基本の範囲です。工事車両が通る経路沿いの家、駐車場を共有している家も忘れずに加えます。" />
      <Step n={2} title="近い家から外側へ順番に回る" body="現場に最も近い家から回り始め、外側へ広げます。順番を決めずに回ると同じ家に二度訪問したり、逆に漏れが出たりします。訪問済みの家にはリスト上で印をつけながら進めましょう。" />
      <Step n={3} title="話す内容は5点、この順番で伝える" body="①まず工事のお詫びの一言 ②工事内容と期間 ③作業時間帯 ④騒音・振動・車両の見込み ⑤緊急連絡先。長々と説明するより、挨拶文を渡しながら要点だけ口頭で添えるほうが、相手の負担になりません。" />
      <Step n={4} title="トラブルになりやすい点は特に明確に伝える" body="「駐車場所の変更」「洗濯物に影響が出る時間帯」「土日の作業有無」の3点は、聞いていなかったことによる苦情が特に多い項目です。挨拶文への記載に加え、口頭でも念押しすると誤解を防げます。" />
      <Step n={5} title="不在の家には投函＋掲示でカバーする" body="2回ほど訪問して不在なら、挨拶文をポストに投函します。着工後に工事車両や音で気づいた方がすぐ連絡できるよう、現場入口に工事概要と連絡先を掲示しておくと、後からの問い合わせにも落ち着いて対応できます。" />

      <h2>近所トラブルになりやすい3つの落とし穴</h2>
      <ul className="space-y-2 text-[14px] text-slate-600 dark:text-zinc-400">
        <li><strong className="text-slate-800 dark:text-zinc-200">①範囲が狭すぎる：</strong>両隣だけで済ませてしまい、裏の家や工事車両の通り道にある家から苦情が出るケース。騒音や振動は思ったより遠くまで届きます。</li>
        <li><strong className="text-slate-800 dark:text-zinc-200">②説明が一度きり：</strong>着工時にしか挨拶せず、工期途中で騒音の大きい工程（解体・基礎工事）に入る際の再連絡がないケース。長期工事では中間の一声が印象を大きく左右します。</li>
        <li><strong className="text-slate-800 dark:text-zinc-200">③口頭だけで済ませる：</strong>書面を残さず口頭だけで説明すると、後で「言った・言わない」の水掛け論になりがちです。挨拶文は必ず書面（または投函）で残しましょう。</li>
      </ul>

      <h2>マンション・アパートが隣接する場合</h2>
      <p className="text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
        全戸への個別訪問が現実的でない場合は、管理会社・管理組合を通じて掲示板への掲示を依頼します。あわせて、工事現場に最も近い低層階の住戸には個別に挨拶しておくと、騒音への理解が得やすくなります。
      </p>

      <h2>よくある質問</h2>
      <div className="space-y-3 my-4">
        {post.faqs?.map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 text-[14px]">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-[14px]">A. {a}</p>
          </div>
        ))}
      </div>

      <p className="text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
        コピペで使える完成例文が必要な場合は
        <Link href="/blog/construction-greeting-templates" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mx-1">工事の近隣挨拶文 例文テンプレート集</Link>
        もあわせてご覧ください。工事種別ごとの挨拶文をそのままコピーして使えます。
      </p>
    </BlogLayout>
  );
}
