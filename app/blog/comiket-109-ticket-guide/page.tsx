import { ExternalLink, IdCard, ListChecks } from "lucide-react";
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

const post = getBlogPost("comiket-109-ticket-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "コミケ C109 チケット",
  "冬コミ 2026 チケット",
  "コミケ アーリー入場 抽選",
  "C109 リストバンド 販売",
  "コミケ 2026 冬 日程",
  "コミケ 入場 本人確認",
]);

const CM = "https://www.comiket.co.jp/info-a/C109";

const TOC: TocItem[] = [
  { id: "summary", label: "C109の開催概要" },
  { id: "types", label: "入場の方法は4種類（価格・入場時間）" },
  { id: "schedule", label: "申し込みと販売の日程" },
  { id: "ticket", label: "チケット（アーリー・更衣室先行）の注意点" },
  { id: "wristband", label: "リストバンド型参加証の買い方" },
  { id: "list", label: "買うものリストを作っておく" },
  { id: "links", label: "公式情報へのリンク" },
];

const TYPES: { name: string; price: string; entry: string; how: string }[] = [
  { name: "アーリー入場チケット", price: "5,000円＋システム利用料385円", entry: "10:30以降", how: "チケットペイで抽選（11/16〜11/30）" },
  { name: "更衣室先行入場チケット", price: "3,000円＋システム利用料385円（コスプレ登録料500円を含む）", entry: "開会以降、庭園コスプレエリアから順次", how: "チケットペイで抽選（11/16〜11/30）" },
  { name: "午前入場リストバンド", price: "公式ページの表で確認", entry: "11:00以降", how: "12/5(土)からアニメイト・とらのあな・メロンブックスの店舗と通販" },
  { name: "午後入場リストバンド", price: "公式ページの表で確認", entry: "12:30以降", how: "同上。公式は専門店での事前購入を強く勧めている" },
];

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="comiket"
      heading={
        <>
          コミケC109の<mark>入場チケット・リストバンド</mark>の買い方
        </>
      }
      heroLead="冬コミ（コミックマーケット109）は12月29日(火)〜31日(木)の3日間。入場には事前に買う入場証券が必要です。アーリー入場の抽選は11月16日(月)13:00から、リストバンドは12月5日(土)から販売。種類・価格・日程を公式の告知からまとめました。"
      stickers={["コミケC109", "冬コミ2026", "アーリー抽選", "リストバンド"]}
      unofficialNote="この記事は ToolBoxJP 編集部が公式サイトの告知をもとにまとめた非公式の記事です。内容は変更されることがあるため、最新の情報は必ず公式サイトで確認してください（確認日：2026年11月15日）。"
    >
      <Tldr
        items={[
          <>入場には<strong>チケットかリストバンド型参加証</strong>が必要。中学生以下は保護者1人につき1人まで入場証券なしで入れる</>,
          <>アーリー入場（5,000円）と更衣室先行入場（3,000円）は<strong>11/16(月)13:00〜11/30(月)の抽選のみ</strong>。二次販売はない</>,
          <>午前・午後のリストバンドは<strong>12/5(土)から</strong>アニメイト・とらのあな・メロンブックスで販売</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="summary" num={1}>
        C109の開催概要
      </H2>
      <ul>
        <li>日程：2026年12月29日(火)〜31日(木)の3日間（2日間を超える開催は2019年冬のC97以来）</li>
        <li>会場：東京ビッグサイト（東4・5・6ホールは改修工事のため使えない）</li>
        <li>入場の締切：16:00まで（1日目・2日目の企業ブースは17時まで入場できる）</li>
      </ul>

      <H2 id="types" num={2}>
        入場の方法は4種類（価格・入場時間）
      </H2>
      <div className={s.tableWrap} role="region" aria-label="入場証券の種類（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>種類</th>
              <th>価格（税込）</th>
              <th>入場</th>
              <th>買い方</th>
            </tr>
          </thead>
          <tbody>
            {TYPES.map((t) => (
              <tr key={t.name}>
                <th scope="row">{t.name}</th>
                <td>{t.price}</td>
                <td>{t.entry}</td>
                <td>{t.how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        アーリー入場と更衣室先行入場は、会場の受付でリストバンド型参加証に交換します。どの入場証券でも閉会まで参加できます。2日間・3日間の通し券はなく、行く日ごとに買います。
      </p>
      <Card kind="memo">
        <p>リストバンドの価格は公式ページの画像の表に載っています。この記事では文字で確認できた価格だけを載せています。</p>
      </Card>

      <H2 id="schedule" num={3}>
        申し込みと販売の日程
      </H2>
      <Timeline
        items={[
          { date: "11/16(月) 13:00", text: "アーリー入場・更衣室先行入場チケットの抽選申込の開始（チケットペイ）", hot: true },
          { date: "11/30(月)", text: "抽選申込の締切", hot: true },
          { date: "12/4(金)", text: "抽選結果の発表。当選者には発券と支払いの案内がメールで届く（落選のメールは届かない）" },
          { date: "12/4(金)〜12/28(月)", text: "当選チケットの支払い・発券（ファミリーマートのマルチコピー機）" },
          { date: "12/5(土)", text: "午前・午後入場リストバンドの販売開始（アニメイト・とらのあな・メロンブックス）" },
          { date: "12/29(火)〜31(木)", text: "開催" },
        ]}
      />

      <ArticleAd />

      <H2 id="ticket" num={4}>
        チケット（アーリー・更衣室先行）の注意点
      </H2>
      <ul>
        <li>券面に申込者の名前が入り、<strong>当選した本人しか使えない</strong>。譲渡・転売はできない</li>
        <li>チケットペイに登録する名前は<strong>本名</strong>にする（ハンドルネーム・名字だけでは本人確認ができず入場できない）</li>
        <li>入場のときに本人確認がある。<strong>パスポートか、日本の公的機関が発行した写真付きの証明書の原本</strong>を持っていく（コピー・写真は不可）</li>
        <li>支払いはファミリーマートで現金、またはネットでクレジットカード・PayPay。発券はファミリーマートのみ（セブン-イレブンでは発券できない）</li>
        <li>発券は開催日まで可能だが、当日は会場近くのファミリーマートが混むため<strong>事前に発券</strong>しておく</li>
        <li>キャンセル・払い戻しはできない</li>
        <li>2026年11月13日の告知：チケットペイがサイバー攻撃対策で海外からのアクセスを止めているため、C109では日本国外からチケットに申し込めない</li>
      </ul>
      <Checklist
        title="当日の朝までに確認すること"
        icon={<IdCard className="w-5 h-5" aria-hidden />}
        items={[
          { text: "チケットを発券した（紙のチケットが手元にある）", must: true },
          { text: "写真付きの身分証の原本を持った", must: true, why: "パスポート、または日本の公的機関が発行した写真付きの証明書" },
          { text: "券面の受付時間と受付場所を確認した", why: "時間前の受付はできない。受付場所はカタログの諸注意ページに載る" },
        ]}
      />

      <H2 id="wristband" num={5}>
        リストバンド型参加証の買い方
      </H2>
      <ul>
        <li>12月5日(土)から、アニメイト・とらのあな・メロンブックスの店舗と通販で販売（取扱店は各社のサイトで確認）</li>
        <li>リストバンドで入場する（会場での引き換えはない）。会場の外に着いた時点で手首に巻く</li>
        <li>日ごとに色が違う。破損・紛失しても再発行はない（破損しても入場はできるので必ず持っていく）</li>
        <li>午後入場のリストバンドも、公式はできる限り専門店での事前購入を強く勧めている</li>
        <li>転売は禁止。転売されたものは買わない</li>
      </ul>

      <H2 id="list" num={6}>
        買うものリストを作っておく
      </H2>
      <p>
        3日間開催で、行く日によって買えるものが変わります。サークルや企業ブースで買いたいものを、日ごとに「名前・価格・優先順位」で書き出しておくと、当日の予算と回る順番が決めやすくなります。
      </p>
      <Checklist
        title="リストに入れておくと便利な項目"
        icon={<ListChecks className="w-5 h-5" aria-hidden />}
        items={[
          { text: "参加する日（1日目〜3日目）" },
          { text: "サークル名・企業名と、ほしいものの名前" },
          { text: "価格と、その日の予算の合計" },
          { text: "買えたかどうか（帰ってから重複して買わないために）" },
        ]}
      />

      <MochicoNudge title="「買う予定」と「買えたもの」を日ごとの一覧に">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを写真・名前・価格つきで一覧にして、買えたものをタップで記録できるアプリです。予約・販売開始の日付も登録でき、リストはリンクで一緒に行く友達と共有できます（買えたかどうかは本人にだけ表示）。
        </p>
      </MochicoNudge>

      <p>
        遠征して行く場合は、
        <Link href="/blog/live-ensei-checklist">遠征の持ち物チェックリスト</Link>
        も参考になります。買った同人誌やグッズの整理は
        <Link href="/blog/oshi-goods-management">推しグッズの管理方法</Link>
        でまとめています。その前の週末に行く人は
        <Link href="/blog/jump-festa-2027-goods">ジャンプフェスタ2027のグッズの買い方</Link>
        もどうぞ。
      </p>

      <H2 id="links" num={7}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: `${CM}/C109EntryTicket2.html`, title: "コミックマーケット109の入場について", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${CM}/C109EntryTicket3.html`, title: "チケット販売について（抽選・価格・本人確認）", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${CM}/C109EntryTicket4.html`, title: "リストバンド型参加証販売について", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
        ]}
      />

      <Sources
        items={[
          { href: `${CM}/C109Schedule.html`, label: "コミックマーケット109の日程について（2026年3月24日）" },
          { href: `${CM}/C109EntryTicket2.html`, label: "コミックマーケット109の入場について（2026年11月9日）" },
          { href: `${CM}/C109EntryTicket3.html`, label: "コミックマーケット109チケット販売について（2026年11月9日公開・11月13日更新）" },
          { href: `${CM}/C109EntryTicket4.html`, label: "コミックマーケット109リストバンド型参加証販売について（2026年11月9日）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
