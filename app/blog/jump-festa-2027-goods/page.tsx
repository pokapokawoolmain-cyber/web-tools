import { CalendarCheck, ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Card,
  Checklist,
  H2,
  MochicoNudge,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Timeline,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";

const post = getBlogPost("jump-festa-2027-goods")!;

export const metadata = mochicoArticleMeta(post, [
  "ジャンプフェスタ2027 グッズ",
  "ジャンフェス 2027 グッズ 買い方",
  "ジャンプフェスタ 事前抽選 グッズ",
  "ジャンプフェスタ 公式ショップ 購入チケット",
  "ジャンプフェスタ 支払い方法",
  "ジャンプNAVI 事前抽選",
]);

const JF = "https://www.jumpfesta.com";

const TOC: TocItem[] = [
  { id: "schedule", label: "日程の一覧（入場の当選発表から当日まで）" },
  { id: "ways", label: "公式ショップでグッズを買う3つの方法" },
  { id: "rules", label: "購入のルールと支払い方法" },
  { id: "todo", label: "当選発表の日にやること" },
  { id: "after", label: "買ったグッズの整理" },
  { id: "links", label: "公式情報へのリンク" },
];

const WAYS: { name: string; when: string; how: string; note: string }[] = [
  {
    name: "事前抽選チケット",
    when: "11/24(火)10:00〜11/30(月)17:59に応募。当選発表は12/11(金)9:30頃",
    how: "ジャンプNAVIアプリから応募。入場チケットに当選した日だけ応募できる",
    note: "各日の午前（9:00〜12:00）の枠のみ。時間は集合時間で、待機列で待つことがある",
  },
  {
    name: "当日抽選チケット",
    when: "当日、会場に入ってから",
    how: "ジャンプNAVIアプリから応募",
    note: "JF公式ショップの購入チケットは午後の枠のみ。購入時間は選べない",
  },
  {
    name: "完売したとき・行けないとき",
    when: "イベント後",
    how: "完売した商品は、食品をのぞいて通販で注文できる（公式の注意事項より）",
    note: "通販の申し込み方法・期間は公式の続報を確認",
  },
];

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="jump"
      heading={
        <>
          ジャンプフェスタ2027の<mark>グッズの買い方</mark>
        </>
      }
      heroLead="入場チケットの当選発表は11月24日(火)9:30頃。その30分後の10:00から、公式ショップでグッズを買うための事前抽選の応募が始まります。日程・買い方・支払い方法を、公式サイトの案内からまとめました。"
      stickers={["ジャンプフェスタ2027", "公式ショップ", "事前抽選", "12/19・20"]}
      unofficialNote="この記事は ToolBoxJP 編集部が公式サイトの案内をもとにまとめた非公式の記事です。内容は変更されることがあるため、最新の情報は必ず公式サイトで確認してください（確認日：2026年11月14日）。"
    >
      <Tldr
        items={[
          <>公式ショップに入るには「JF公式ショップグッズ購入チケット」が必要。<strong>1人1日1回</strong>までで、買えることを約束するものではない</>,
          <>チケットは<strong>事前抽選（午前の枠・11/24〜11/30応募）</strong>と<strong>当日抽選（午後の枠）</strong>の2通り</>,
          <>支払いは<strong>現金・クレジットカード・交通系IC・PayPay</strong>。分けて払う・組み合わせることはできない</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        日程の一覧（入場の当選発表から当日まで）
      </H2>
      <p>ジャンプフェスタ2027は入場無料で、来場には事前の応募が必要です。入場チケットの応募はすでに締め切られています（11/16まで）。</p>
      <Timeline
        items={[
          { date: "11/24(火) 9:30頃", text: "入場チケットの当選発表（ジャンプNAVIアプリ）" },
          { date: "11/24(火) 10:00", text: "事前抽選チケットの応募開始（公式ショップの購入チケット・スーパーステージなど）", hot: true },
          { date: "11/30(月) 17:59", text: "事前抽選チケットの応募締切", hot: true },
          { date: "12/11(金) 9:30頃", text: "事前抽選チケットの当選発表" },
          { date: "12/14(月) 9:30頃", text: "入場時間（第一部 9:00〜9:30／第二部 10:30〜11:00）と入場口の発表" },
          { date: "12/19(土)・20(日)", text: "開催（幕張メッセ 国際展示場 ホール1〜9・11、9:00〜17:00）" },
        ]}
      />
      <Card kind="caution">
        <p>入場時間と入場口は抽選で決まり、選べません。事前抽選の購入チケットの時間（午前の枠）は入場時間とは別の「集合時間」です。両方の時間をアプリで確認しておきましょう。</p>
      </Card>

      <H2 id="ways" num={2}>
        公式ショップでグッズを買う3つの方法
      </H2>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>方法</th>
              <th>いつ</th>
              <th>どうやって</th>
              <th>注意</th>
            </tr>
          </thead>
          <tbody>
            {WAYS.map((w) => (
              <tr key={w.name}>
                <th scope="row">{w.name}</th>
                <td>{w.when}</td>
                <td>{w.how}</td>
                <td>{w.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        会場には公式ショップのほかに、ジャンフェスストア、お土産処JUMP亭、各メーカーのブース（JUMP SHOPなど）があり、売場ごとに買い方が違います。行きたい売場のページを事前に見ておくと当日迷いません。
      </p>
      <p>
        先着整理券（会場に入ってからアプリで取得）は、同じコーナーにつき1日1回まで。呼出時間を過ぎると失効します。
      </p>

      <ArticleAd />

      <H2 id="rules" num={3}>
        購入のルールと支払い方法
      </H2>
      <ul>
        <li>購入チケットは<strong>1人1日1回</strong>まで。集合時間が終わってから45分で失効する</li>
        <li>購入のとき、代表者と同行者の本人確認がある</li>
        <li>商品ごとに購入数の上限がある（公式ショップのページに商品ごとに記載）</li>
        <li>ランダム商品・フルセット商品などは、注文用紙を使ってレジで受け取る</li>
        <li>返品・交換は不良品をのぞいてできない。お釣りと商品はその場で確認する</li>
      </ul>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>売場</th>
              <th>使える支払い方法</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">JF公式ショップ</th>
              <td>現金・主要クレジットカード・交通系IC・PayPay（1回の支払いは1つの方法だけ）</td>
            </tr>
            <tr>
              <th scope="row">お土産処JUMP亭</th>
              <td>クレジットカード・交通系IC・PayPay（現金は使えない）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Card kind="caution">
        <p>会場の内外で、グッズや配布物の交換・譲渡・転売は禁止されています。チケットの譲渡・転売も禁止です。</p>
      </Card>

      <H2 id="todo" num={4}>
        当選発表の日にやること
      </H2>
      <p>11/24(火)は当選発表から応募開始までが30分しかありません。前日までに決めておくと慌てずに済みます。</p>
      <Checklist
        title="11/24(火)までに決めておくこと"
        icon={<CalendarCheck className="w-5 h-5" aria-hidden />}
        items={[
          { text: "ジャンプNAVIアプリにログインできるか確認", must: true },
          { text: "公式ショップの購入チケットに応募するか、どの日・どの枠にするか", why: "事前抽選は各日の午前の枠だけ。同じ時間帯に別の事前抽選チケットは申し込めない" },
          { text: "スーパーステージに応募するなら、時間が重ならないか", why: "ステージは各日2つまで応募できる" },
          { text: "同行者がいるなら、代表者がまとめて応募する", why: "同行者が個別に応募することはできない" },
          { text: "応募締切 11/30(月)17:59 をカレンダーに入れる" },
        ]}
      />
      <Checklist
        title="当日までに用意するもの"
        icon={<ShoppingBag className="w-5 h-5" aria-hidden />}
        items={[
          { text: "充電したスマートフォン（入場・抽選・整理券はすべてアプリ）", must: true },
          { text: "支払い方法を1つに決めておく（現金かキャッシュレスか）", why: "1回の支払いで組み合わせはできない" },
          { text: "買うものと予算のメモ", why: "商品ごとの上限と価格を公式ショップのページで確認しておく" },
          { text: "持ち込み禁止のもの（刃物・アルコールなど）を持っていないか確認" },
        ]}
      />

      <H2 id="after" num={5}>
        買ったグッズの整理
      </H2>
      <p>
        ランダム商品やフルセット商品を買ったら、帰ってから「どの絵柄がそろったか」を記録しておくと、事後の通販で買い足すときや、次のイベントで重複して買うのを防げます。
      </p>

      <p>
        ランダムグッズの記録のコツは<Link href="/blog/random-goods-management">ランダムグッズの管理方法</Link>、遠方から行く場合の準備は<Link href="/blog/live-ensei-checklist">遠征の持ち物チェックリスト</Link>にまとめています。年末に続けて行くなら<Link href="/blog/comiket-109-ticket-guide">コミケC109のチケット・リストバンドの買い方</Link>もあわせてどうぞ。
      </p>

      <MochicoNudge title="欲しいグッズと締切を、1つのリストで">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを写真つきで一覧にして、持っている・まだのものをタップで記録できるアプリです。ランダム商品は絵柄ごとの所持数を記録でき、予約や応募の締切を登録すると締切までの残りが表示されます。
        </p>
      </MochicoNudge>

      <H2 id="links" num={6}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: `${JF}/guide/advance-lottery/`, title: "事前抽選チケット応募", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${JF}/guide/same-day-ticket/`, title: "当日抽選チケット応募", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${JF}/market/shop/`, title: "JF公式ショップ（商品と購入上限）", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${JF}/guide/attention/`, title: "注意事項（支払い・持ち込み禁止・転売）", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
        ]}
      />

      <Sources
        items={[
          { href: `${JF}/`, label: "ジャンプフェスタ2027 公式サイト（開催日・会場）" },
          { href: `${JF}/guide/flow/`, label: "応募の流れ（入場時間・同行者）" },
          { href: `${JF}/guide/admission/`, label: "入場チケット応募（当選発表日）" },
          { href: `${JF}/guide/advance-lottery/`, label: "事前抽選チケット応募（応募期間・当選発表日・午前の枠）" },
          { href: `${JF}/guide/same-day-ticket/`, label: "当日抽選チケット応募（午後の枠）" },
          { href: `${JF}/guide/numbered-ticket/`, label: "先着整理券" },
          { href: `${JF}/market/shop/`, label: "JF公式ショップ（1人1日1回・商品ごとの上限）" },
          { href: `${JF}/guide/attention/`, label: "注意事項（支払い方法・失効・返品・転売の禁止）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
