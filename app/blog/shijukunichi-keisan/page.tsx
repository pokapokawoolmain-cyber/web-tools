import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { formatJpDate, monthTable } from "@/lib/memorial-dates";
import { ShijukunichiCalculator } from "./ShijukunichiCalculator";

const post = getBlogPost("shijukunichi-keisan")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["49日 計算", "四十九日 計算 自動", "四十九日 数え方", "四十九日 いつ", "四十九日 関西 数え方", "四十九日 前倒し", "三月越し"],
  type: "article",
});

/** 早見表を出す月（公開時点で問い合わせが多い直近の月。更新時にずらす） */
const TABLE_MONTHS: [number, number][] = [
  [2026, 11],
  [2026, 12],
];

const STEPS: [string, string][] = [
  ["できるだけ早く", "お寺（菩提寺）に連絡して、日程と読経をお願いする。お寺の予定が先に決まることが多いため、日程はお寺と相談して決める"],
  ["日程が決まったら", "親族など参列してほしい人に連絡する。会食をする場合は人数の見込みを立てる"],
  ["会場・会食", "自宅・お寺・斎場のどこで行うかを決め、会食の店や仕出しを手配する"],
  ["準備するもの", "本位牌（白木の位牌から作り替える場合。作るのに日数がかかることがある）、お供え物、引き出物、お布施"],
  ["納骨する場合", "墓地・霊園の管理者と石材店への連絡、必要な書類（埋葬許可証など）を確認する"],
];

const SOURCES: { href: string; label: string }[] = [
  { href: "https://meetsmore.com/services/funeral/media/148830", label: "ミツモア「四十九日とはどんな法要？」（亡くなった日を1日目として数える・前倒しが望ましい）" },
  { href: "https://gentosha-go.com/articles/-/58080", label: "幻冬舎ゴールドオンライン「四十九日法要までに済ませておきたい8つのこと」（命日を1日目と数える）" },
  { href: "https://allabout.co.jp/gm/gc/71872/", label: "All About「忌明けとは？四十九日法要の迎え方」（忌明け・納骨・三月越しを避けて早めに行う例）" },
];

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        四十九日は、<strong>命日を1日目として数えて49日目</strong>です。日付で言うと「命日の48日後」。たとえば11月1日に亡くなった場合は12月19日になります。下の計算機に命日を入れると、四十九日と、その前の土日、気をつけたい点がすぐ分かります。
      </p>

      <ShijukunichiCalculator />

      <p className="text-[13px] text-slate-500 dark:text-zinc-400">
        計算はこの端末の中だけで行い、入力した日付はどこにも送信・保存しません。
      </p>

      <h2>四十九日の数え方</h2>
      <p>
        一般的には、亡くなった日（命日）を1日目と数えます。7日ごとに法要の区切りがあり、7回目の7日目にあたる49日目が「四十九日（七七日・しちしちにち）」です。この日に忌明けとし、法要と納骨を行う家が多くあります。
      </p>
      <p>
        計算するときは「命日 ＋ 48日」です。「49日後」と数えると1日ずれるので注意しましょう。たとえば11月1日が命日なら、11月は30日まであるので、11月1日〜30日で30日、12月に入って19日目が49日目にあたり、四十九日は12月19日です。
      </p>
      <p>
        ただし、数え方や習わしは地域や宗派、お寺の考え方によって違うことがあります。迷ったら、法要をお願いするお寺に「何日が四十九日にあたりますか」と聞くのがいちばん確実です。
      </p>

      <h2>法要の日をずらすときの考え方</h2>
      <p>
        四十九日が平日にあたる場合は、参列する人が集まりやすい土日に法要を行うことがよくあります。このとき、<strong>四十九日より前の日にずらす（前倒し）</strong>のが一般的で、後ろにずらすのは避けるという考え方もあります。上の計算機では、四十九日当日かそれより前の土曜・日曜を出しています。
      </p>
      <p>
        ただし、お寺の都合や会場の空きで決まることも多く、決まりがあるわけではありません。家族とお寺で相談して決めれば問題ありません。
      </p>

      <h3>「三月越し（みつきごし）」とは</h3>
      <p>
        四十九日が命日の月から数えて3か月目にかかることを「三月越し」と呼び、縁起がよくないとして避け、法要を早めに行う家もあります。言い伝え（迷信）とされており、気にしない家やお寺もあります。命日が月の後半だと三月越しになりやすいため、気になる場合は早めに親族と話しておきましょう。
      </p>

      <h3>年末年始に重なる場合</h3>
      <p>
        11月中旬が命日だと、四十九日が年末年始にかかります（例：11月14日が命日なら1月1日）。年末年始はお寺や会場、親族の予定が限られるため、日程の相談を早めに始めると安心です。
      </p>

      <h2>2026年11月・12月が命日の場合の早見表</h2>
      <p>命日を1日目と数えた場合の四十九日です。「三月越し」の欄は、命日の月から数えて3か月目にかかる日です。</p>
      {TABLE_MONTHS.map(([y, m]) => (
        <details key={`${y}-${m}`} className="my-3 rounded-xl border border-slate-200 dark:border-zinc-700 not-prose">
          <summary className="cursor-pointer select-none px-4 py-3 min-h-[44px] font-semibold text-slate-800 dark:text-zinc-100">
            {y}年{m}月が命日の場合
          </summary>
          <div className="overflow-x-auto px-2 pb-3">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800">
                  <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">命日</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">四十九日</th>
                  <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">三月越し</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-zinc-300">
                {monthTable(y, m).map((r) => (
                  <tr key={r.death.toISOString()}>
                    <td className="border border-slate-200 dark:border-zinc-700 px-3 py-1.5">{formatJpDate(r.death, false)}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-3 py-1.5">{formatJpDate(r.day49)}</td>
                    <td className="border border-slate-200 dark:border-zinc-700 px-3 py-1.5">{r.spansThreeMonths ? "かかる" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}

      <h2>四十九日までにやることの流れ</h2>
      <p>順番や時期は家によって違います。目安として、決める順に並べました。</p>
      <ol>
        {STEPS.map(([when, what]) => (
          <li key={when}>
            <strong>{when}：</strong>
            {what}
          </li>
        ))}
      </ol>

      <h2>四十九日法要の香典・お供えの表書き</h2>
      <p>
        四十九日法要に持っていく香典の表書きは、仏式（浄土真宗以外）では「御仏前」とするのが一般的です。四十九日より前の法要では「御霊前」を使い、浄土真宗では最初から「御仏前」を使います。宗派ごとの違いは
        <Link href="/blog/koden-writing-guide">香典袋の書き方ガイド</Link>
        で、表書きの作成は
        <Link href="/tools/koden-maker">香典袋表書きメーカー</Link>
        でできます。お供え物にかけるのし紙は
        <Link href="/tools/noshi-maker">のし紙作成ツール</Link>
        で作れます。
      </p>

      <h2>一周忌・三回忌もまとめて確認する</h2>
      <p>
        百箇日、一周忌、三回忌以降の年忌法要の日付は、
        <Link href="/tools/houyou-calculator">四十九日・法要日程計算ツール</Link>
        で命日から一覧にできます。喪中はがきの準備が必要な時期でもあるため、
        <Link href="/blog/mochu-hagaki-itsumade">喪中はがきはいつまでに出すか</Link>
        もあわせて確認しておくと安心です。
      </p>

      <h2>参考にした資料</h2>
      <ul className="text-[13px]">
        {SOURCES.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-slate-500 dark:text-zinc-400">確認日：2026年11月13日。法要の数え方や習わしは地域・宗派・お寺によって異なります。</p>
    </BlogLayout>
  );
}
