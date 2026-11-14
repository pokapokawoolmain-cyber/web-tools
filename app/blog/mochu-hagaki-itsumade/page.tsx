import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("mochu-hagaki-itsumade")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["喪中はがき いつまで", "喪中はがき いつまでに出す 2026", "喪中はがき 範囲", "喪中はがき 間に合わない", "年賀状 受付 2026 12月20日", "寒中見舞い いつから"],
  type: "article",
});

/** 2026年冬〜2027年の流れ（日付は出典で確認したもの。年が変わったら更新する） */
const TIMELINE: { date: string; text: string; source?: string; hot?: boolean }[] = [
  { date: "11月2日（月）", text: "2027年用の年賀はがきの販売開始", source: "日本郵便" },
  { date: "11月中〜12月上旬", text: "喪中はがきを相手に届けたい時期。相手が年賀状を用意する前に届くようにする", hot: true },
  { date: "12月20日（日）", text: "年賀状の受付（引受）開始。2026年用までは12月15日だった", source: "日本郵便" },
  { date: "12月27日（日）", text: "年賀状を元日に届けるための投函の目安。2026年用までは12月25日だった", source: "日本郵便" },
  { date: "1月8日ごろ〜", text: "寒中見舞いを出し始める時期（関東の目安。関西では1月15日ごろから）", source: "HugKum" },
  { date: "2月3日（水）まで", text: "寒中見舞いは立春（2027年は2月4日）の前日までに届ける", source: "国立天文台" },
];

const SOURCES: { href: string; label: string }[] = [
  {
    href: "https://files.japanpost.jp/assets/34d9d11432734cfaa759e78fe395b688/159168aef19d465baf3350d358e46fa9/20260831_02_06.pdf",
    label: "日本郵便 プレスリリース「2027（令和9）年用年賀はがき等の発行概要」（2026年8月31日）",
  },
  { href: "https://hugkum.sho.jp/738453", label: "HugKum「喪中欠礼はいつからいつまで？間に合わない場合はどうする？」" },
  { href: "https://zexy.net/article/app002601013/", label: "ゼクシィ（喪中の対象は一般的に2親等まで）" },
  { href: "https://eco.mtk.nao.ac.jp/koyomi/yoko/2027/rekiyou272.html", label: "国立天文台「令和9年（2027）暦要項」（立春は2月4日）" },
];

export default function Page() {
  return (
    <BlogLayout post={post} tone="calm">
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        喪中はがきは、<strong>相手が年賀状を用意し始める前、11月中から遅くとも12月上旬までに届くように</strong>出すのが一般的です。今年（2027年用）は日本郵便が年賀状の受付開始を<strong>12月20日</strong>に遅らせ、元日に届ける投函の目安も<strong>12月27日</strong>に変わりました。日付を一覧にして、出す範囲と、間に合わないときの対応をまとめます。
      </p>

      <div className="not-prose my-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700">
        <p className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300 mb-1">文面を作る</p>
        <Link href="/tools/nenga-jimai-maker" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          喪中はがき・寒中見舞いの文例メーカー（無料）→
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">続柄を選ぶだけで文例ができます。友人向け・取引先向けを選べます。</p>
      </div>

      <h2>2026年冬〜2027年の日付一覧</h2>
      <p>喪中はがきから寒中見舞いまでの流れを、今年の日付で並べました。</p>
      <ol className="not-prose my-6 border-l-2 border-slate-200 dark:border-zinc-700 pl-5 space-y-4">
        {TIMELINE.map((t) => (
          <li key={t.date} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 ${t.hot ? "bg-rose-500 border-rose-500" : "bg-white dark:bg-zinc-950 border-slate-400"}`}
            />
            <p className={`text-[15px] font-bold ${t.hot ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>{t.date}</p>
            <p className="text-[14px] text-slate-700 dark:text-zinc-300">
              {t.text}
              {t.source && <span className="text-[12px] text-slate-400">（出典：{t.source}）</span>}
            </p>
          </li>
        ))}
      </ol>
      <p>
        年賀状の受付開始が遅くなったことで、相手が年賀状を書く時期が後ろにずれる可能性はありますが、年賀はがきの販売は11月2日から始まっています。早めに準備する人に合わせて、<strong>12月上旬までに届ける</strong>考え方は変えなくて大丈夫です。
      </p>

      <h2>喪中はがきを出す範囲</h2>
      <p>
        一般的には、<strong>自分または配偶者の二親等以内</strong>の親族が亡くなったときに出します。
      </p>
      <div className="overflow-x-auto my-6 not-prose">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">続柄</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">親等</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-zinc-300">
            {[
              ["父母・配偶者の父母・子", "一親等（配偶者は親等で数えないが、喪中とするのが一般的）"],
              ["祖父母・兄弟姉妹・孫・配偶者の祖父母や兄弟姉妹", "二親等"],
            ].map(([who, deg]) => (
              <tr key={who}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{who}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{deg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        同居していたか、どのくらい親しかったかで判断が分かれることもあります。家族の中で出すかどうかをそろえておくと、親戚とのやり取りで迷いません。
      </p>

      <h2>誰に出すか</h2>
      <ul>
        <li>毎年年賀状をやり取りしている相手</li>
        <li>仕事の取引先（会社として出す年賀状とは別に、個人として付き合いのある相手）</li>
        <li>葬儀に参列してくれた親族には出さないこともあります（亡くなったことを知っているため）。家の考え方に合わせます</li>
      </ul>

      <h2>12月に亡くなった・間に合わないとき</h2>
      <p>
        12月中旬以降に亡くなった場合や、準備が間に合わなかった場合は、無理に喪中はがきを出さず、<strong>年が明けてから寒中見舞い</strong>で年賀状をいただいたお礼と、年始の挨拶を控えたことを伝えます。寒中見舞いは、関東では1月8日ごろ、関西では1月15日ごろから、立春（2027年は2月4日）の前日までに届くように出すのが目安です。
      </p>
      <p>
        寒中見舞いの文例も
        <Link href="/tools/nenga-jimai-maker">文例メーカー</Link>
        の「寒中見舞い」で作れます。
      </p>

      <h2>喪中の相手に年賀状を出してしまったら</h2>
      <p>
        喪中はがきが届く前に年賀状を出してしまうのはよくあることです。気になる場合は、松の内が明けてから寒中見舞いで、知らずに年賀状を送ったことをお詫びし、お悔やみを伝えると丁寧です。
      </p>

      <h2>準備のチェックリスト</h2>
      <ol>
        <li>出す範囲（どの親族の喪中か）を家族で決める</li>
        <li>出す相手のリストを作る（前年に年賀状をくれた人を中心に）</li>
        <li>文面を決める（故人の続柄・名前・亡くなった月や年齢を入れるか）</li>
        <li>はがきを用意する（喪中はがき用の絵柄入り、または通常はがき）</li>
        <li>11月中に投函し、遅くとも12月上旬までに届くようにする</li>
      </ol>
      <p>
        法要の準備と重なる時期でもあります。四十九日の日付は
        <Link href="/blog/shijukunichi-keisan">四十九日の計算と早見表</Link>
        で確認できます。来年から年賀状のやり取り自体をやめたい場合は、
        <Link href="/tools/nenga-jimai-maker">年賀状じまいの文例</Link>
        も同じツールで作れます。
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
      <p className="text-[12px] text-slate-500 dark:text-zinc-400">
        確認日：2026年11月13日。日付は2027年用の年賀状の案内に基づきます。来年以降は日付が変わるため、毎年11月に更新します。
      </p>
    </BlogLayout>
  );
}
