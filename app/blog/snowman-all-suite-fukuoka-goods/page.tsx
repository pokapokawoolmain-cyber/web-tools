import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  Checklist,
  Figure,
  H2,
  MochicoListCard,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Stats,
  Timeline,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";
import { GoodsBudget, LiveCountdown } from "../_components/oshi/LiveWidgets";
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("snowman-all-suite-fukuoka-goods")!;
const list = LIVE_LISTS.snowman;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "Snow Man ドームツアー 福岡 グッズ",
  "Snow Man ALL SUITE グッズ",
  "Snow Man 福岡 整理券",
  "MERCH MARKET 整理券 福岡",
  "Snow Man ペンライト 販売",
  "ALL SUITE 福岡 物販 時間",
  "Snow Man PayPayドーム",
]);

const TOC: TocItem[] = [
  { id: "about", label: "「ALL SUITE」はどんなツアー？" },
  { id: "goods", label: "グッズ全14種の価格と予算計算" },
  { id: "ticket", label: "整理券のとり方（区分1・区分2）" },
  { id: "hours", label: "福岡の物販時間と、ペンライトの専用窓口" },
  { id: "rules", label: "購入制限・目黒蓮さんのグッズ・オンライン販売" },
  { id: "day", label: "福岡公演の持ち物とスケジュール" },
];

/** 自作の図：整理券の2つの区分 */
function TicketFlow() {
  return (
    <svg viewBox="0 0 360 290" role="img" aria-labelledby="sm-title sm-desc">
      <title id="sm-title">福岡公演の物販整理券の申し込み（区分1・区分2）</title>
      <desc id="sm-desc">
        区分1は公演チケットを持つ代表者向けで、11月26日19時から11月29日23時59分まで。会員サイトから認証してMERCH MARKET Goods Appで申し込む。区分2は同行者やチケットを持っていない人向けで、11月30日19時から。
      </desc>
      <rect x="8" y="8" width="344" height="128" rx="16" fill="#fbf5e4" stroke="#d4af37" strokeWidth="1.5" />
      <text x="22" y="36" fontSize="14" fontWeight="900" fill="#6f5410">
        区分1：チケットを持つ代表者
      </text>
      <text x="22" y="60" fontSize="12" fontWeight="800" fill="#1b1430">
        11/26(木) 19:00 〜 11/29(日) 23:59
      </text>
      <text x="22" y="84" fontSize="11" fill="#3e3756">
        会員サイトにログイン →「申込確認」→ 整理券の申込へ
      </text>
      <text x="22" y="104" fontSize="11" fill="#3e3756">
        → MERCH MARKET Goods App で申し込む
      </text>
      <text x="22" y="124" fontSize="11" fill="#3e3756">
        同行者の分も代表者が取れる（1人1枚必要）
      </text>
      <rect x="8" y="150" width="344" height="110" rx="16" fill="#fff" stroke="#e6d39c" strokeWidth="1.5" />
      <text x="22" y="178" fontSize="14" fontWeight="900" fill="#1b2f4a">
        区分2：同行者・チケットがない人
      </text>
      <text x="22" y="202" fontSize="12" fontWeight="800" fill="#1b1430">
        11/30(月) 19:00 〜
      </text>
      <text x="22" y="226" fontSize="11" fill="#3e3756">
        MERCH MARKET Goods App から直接申し込む
      </text>
      <text x="22" y="246" fontSize="11" fill="#3e3756">
        先着順。どの区分も各販売日1人1枚まで
      </text>
      <text x="12" y="282" fontSize="10.5" fill="#625b7c">
        ※ 整理券がない人は物販会場に入れません
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="snowman"
      heading={
        <>
          Snow Man「ALL SUITE」<mark>福岡公演</mark>のグッズと整理券ガイド
        </>
      }
      heroLead="ホテルのスイートルームをテーマにしたようなアメニティ風グッズが並ぶ、Snow Man のドームツアー。福岡公演（12/4〜6）の整理券の申し込み時間、物販の営業時間、ペンライトの専用窓口、1商品2点までの購入制限をまとめました。"
      stickers={["🏨 ALL SUITE", "⛄ Snow Man", "🎫 整理券必須", "📅 12/4〜12/6 福岡"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/3(木) プレ販売のスタート", start: "2026-12-03T13:00:00+09:00" },
            { label: "12/4(金) 物販のスタート", start: "2026-12-04T10:00:00+09:00" },
            { label: "12/5(土) 物販のスタート", start: "2026-12-05T10:00:00+09:00" },
            { label: "12/6(日) 物販のスタート", start: "2026-12-06T10:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、STARTO ENTERTAINMENT の公演ページなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。開場・開演時間はチケットと公式サイトで確認してください。販売時間や在庫は変わることがあります（2026年11月28日時点）。"
    >
      <p>
        Snow Man のドームツアー「Snow Man DOME TOUR 2026-2027 ALL SUITE」。愛知公演（11/26〜29）が終わり、次は<strong>福岡公演（12/4〜6）</strong>。そのあと東京・大阪と続きます。
      </p>
      <p>
        今回のグッズは、ルームキー風キーホルダー、スリッパ、入浴料（入浴剤）、パジャマ、バスタオル、ネームバッジ…と、<span className={s.hl}>まるでホテルのアメニティ</span>のようなラインナップ。物販は<strong>整理券がないと会場に入れない</strong>方式なので、申し込みの時間を逃さないようにしましょう。
      </p>

      <Tldr
        items={[
          <>福岡の整理券は、区分1（チケットを持つ代表者）が 11/29(日) 23:59 まで、区分2（同行者・チケットなし）は 11/30(月) 19:00 から</>,
          <>物販は 12/3(木) プレ販売 13:00〜20:00、12/4・5 は 10:00〜17:30、12/6 は 10:00〜16:30</>,
          <>会場・オンラインとも1人1商品2点まで。ペンライトは会場の外の専用窓口で、当日のチケットを持つ人だけ</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="Snow Man「ALL SUITE」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="about" num={1}>
        「ALL SUITE」はどんなツアー？
      </H2>
      <Stats
        items={[
          { num: <>14<small>種</small></>, label: "グッズの種類（個人9種の商品を含む）" },
          { num: <>2<small>点まで</small></>, label: "1人1商品あたりの購入上限" },
          { num: <>11,000<small>円</small></>, label: "ファミリークラブ会員チケット" },
          { num: <>11,500<small>円</small></>, label: "一般チケット（プレイガイド）" },
        ]}
      />
      <p>
        公演のチケット販売は愛知・福岡・東京・大阪の4都市。福岡はみずほPayPayドーム福岡での3日間です。ドームの行き方・帰り方・海風対策は「
        <Link href="/blog/paypay-dome-fukuoka-guide">みずほPayPayドーム福岡 完全ガイド</Link>
        」で詳しく解説しています。
      </p>

      <H2 id="goods" num={2}>
        グッズ全14種の価格と予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。1商品2点までなので、友達の分もまとめて買う人は数を確認しておきましょう。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>
        価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。ジャンボうちわ・アクリルスタンド・ネームバッジ＆ステッカーセットは個人9種、パジャマは2種、入浴料は1種×2個セット。パンフレットは目黒蓮さんを除く8名で撮影とされています。
      </p>
      <Bubble>
        「スイートに泊まる」つもりで、パジャマ＋スリッパ＋入浴料のセットをそろえるファンも多そう。合計は上でチェックして確かめてね！
      </Bubble>

      <H2 id="ticket" num={3}>
        整理券のとり方（区分1・区分2）
      </H2>
      <Figure caption="編集部作成。STARTO ENTERTAINMENT の公演ページの案内を図にしたものです。">
        <TicketFlow />
      </Figure>
      <ul>
        <li>整理券は専用アプリ「MERCH MARKET Goods App」で申し込みます。アプリの会員登録が必要なので、早めにインストールしておきましょう。</li>
        <li>整理券は1人1枚必要で、どの区分も各販売日につき1人1枚まで。</li>
        <li>小学生以下の子どもは保護者の同伴が必要です。保護者の整理券は不要ですが、買えるのは整理券を持つ人だけです。</li>
      </ul>
      <Card kind="caution" label="申し込み開始直後はアクセスが集中">
        <p>
          ファンのブログでは、申し込み開始の直後はアクセスが集中し、アプリが再起動するとファンクラブの認証が切れていることがあると紹介されています。その場合は会員サイトからもう一度入り直しましょう。
        </p>
      </Card>

      <ArticleAd />

      <H2 id="hours" num={4}>
        福岡の物販時間と、ペンライトの専用窓口
      </H2>
      <div className={s.tableWrap} role="region" aria-label="福岡公演の物販時間" tabIndex={0}>
        <table className={s.table}>
          <caption>福岡公演 物販特設会場の営業時間</caption>
          <thead>
            <tr>
              <th scope="col">日付</th>
              <th scope="col">時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">12/3(木) プレ販売</th>
              <td>13:00〜20:00</td>
            </tr>
            <tr>
              <th scope="row">12/4(金)</th>
              <td>10:00〜17:30</td>
            </tr>
            <tr>
              <th scope="row">12/5(土)</th>
              <td>10:00〜17:30</td>
            </tr>
            <tr>
              <th scope="row">12/6(日)</th>
              <td>10:00〜16:30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：STARTO ENTERTAINMENT「Snow Man DOME TOUR 2026-2027 ALL SUITE」。悪天候などで時間変更・中断・中止になる場合や、終了前でも列に並べない場合があります。</p>
      <Card kind="point" label="オリジナルペンライトは別の窓口">
        <p>
          オリジナルペンライト（4,500円）は物販特設会場ではなく、<strong>会場の外に設ける専用販売窓口だけ</strong>で販売。当日の公演チケットを持っている人だけが買えて、<strong>チケット1枚につき1本</strong>です。入口と購入時にデジタルチケットか紙チケットを見せます。場所と時間は当日会場で案内されます。
        </p>
      </Card>

      <H2 id="rules" num={5}>
        購入制限・目黒蓮さんのグッズ・オンライン販売
      </H2>
      <ul>
        <li>
          <strong>会場もオンラインも1人1商品2点まで。</strong>会場販売の個数制限は変更になる場合があります。
        </li>
        <li>
          <strong>目黒蓮さんの個人アイテム</strong>（ジャンボうちわ・アクリルスタンド・ネームバッジ＆ステッカーセット）は、製造の都合で<strong>会場とツアー後のオンライン販売のみ</strong>です。
        </li>
        <li>
          オンラインの2回目は <strong>2027/1/7(木) 19:00〜1/13(水) 23:00</strong>（MERCH MARKET）。1回目（9/30〜10/6）は終了しています。
        </li>
      </ul>
      <Card kind="caution" label="フリマの高額出品に注意">
        <p>フリマアプリには公式価格より高い出品が多く見られます。会場で買えなかったら、1月のオンライン販売を待つのが安心です。</p>
      </Card>

      <H2 id="day" num={6}>
        福岡公演の持ち物とスケジュール
      </H2>
      <Timeline
        items={[
          { date: "11/29(日) 23:59", text: "区分1（チケットを持つ代表者）の整理券申込しめきり", hot: true },
          { date: "11/30(月) 19:00〜", text: "区分2（同行者・チケットなし）の整理券申込スタート" },
          { date: "12/3(木) 13:00〜20:00", text: "プレ販売（前日物販）" },
          { date: "12/4(金)〜12/6(日)", text: "福岡公演。物販は各日10:00から" },
          { date: "12/14(月) 19:00〜", text: "東京公演の整理券申込（区分1）。大阪は 12/25(金) 19:00〜" },
        ]}
      />
      <Checklist
        title="ALL SUITE 福岡の持ち物"
        icon="🏨"
        items={[
          { must: true, text: "チケット（デジタルチケット画面）と整理券", why: "ペンライト窓口・物販の両方で使う" },
          { must: true, text: "MERCH MARKET Goods App（ログイン済み）" },
          { text: "大きめのエコバッグ", why: "パジャマやバスタオルはかさばる。ショッピングバッグを買う手も" },
          { text: "防寒着とカイロ", why: "ドームは博多湾のそば。冬の海風で外の列は冷える" },
          { text: "モバイルバッテリー", why: "チケット・整理券・決済がすべてスマホ" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="Snow Man「ALL SUITE」" goodsCount={list.items.length} note="買ったグッズをMochicoのリストでチェックしておけば、1月のオンライン販売で買い足すものがすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://starto.jp/s/p/live/10578?artist=43", title: "STARTO「ALL SUITE」公演ページ（グッズ・整理券）", icon: "⛄" },
          { href: "https://goods-app.jp/", title: "MERCH MARKET Goods App", icon: "📱" },
          { href: "https://famikura-store.jp/s/j/page/merchmarket", title: "MERCH MARKET オンライン", icon: "🛍️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://starto.jp/s/p/live/10578?artist=43", label: "STARTO ENTERTAINMENT「Snow Man DOME TOUR 2026-2027 ALL SUITE」（グッズ・価格・購入制限・整理券・物販時間・ペンライト窓口・オンライン販売）" },
          { href: "https://snowman-information.com/suite/", label: "Snow Man Information「ALL SUITE オフィシャルグッズ公開」" },
          { href: "https://suno-oshinote.com/live-goods-purchase/", label: "あゆの推し活note「ALL SUITE ライブグッズ購入ガイド」（アプリの注意点）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
