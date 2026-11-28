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

const post = getBlogPost("kawaii-lab-live-goods")!;
const list = LIVE_LISTS.kawaiilab;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "KAWAII LAB. グッズ",
  "KAWAII LAB. ライブ 物販",
  "CANDY TUNE グッズ",
  "SWEET STEADY グッズ",
  "CUTIE STREET グッズ",
  "MORE STAR グッズ",
  "KAWAII LAB. STORE 整理券",
]);

const TOC: TocItem[] = [
  { id: "report", label: "11/6 FC限定フリーライブはどんなイベントだった？" },
  { id: "goods", label: "4グループのグッズ全40アイテムと予算計算" },
  { id: "howto", label: "KAWAII LAB. のライブ物販の流れ（整理券アプリ）" },
  { id: "next", label: "12月〜1月の KAWAII LAB. のライブ予定" },
  { id: "entry", label: "入場時の本人確認と持ち物" },
];

const GROUPS = [
  { name: "CANDY TUNE", color: "#ff6fae" },
  { name: "SWEET STEADY", color: "#ff9a5c" },
  { name: "CUTIE STREET", color: "#9b8cff" },
  { name: "MORE STAR", color: "#3fb8ff" },
];

/** 自作の図：グループごとのグッズの構成（どのグループも同じ並び） */
function GroupGrid() {
  const rows = ["メンバー別アクスタ ¥1,500", "メンバー別アクキー ¥1,000", "トレカ（クリア ¥500／ランダム ¥200）", "写真L判2枚セット ¥400", "ランダム缶バッジ ¥500", "ファンライト／ペンライト", "タオル ¥2,000", "CD 会場予約"];
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="kl-title kl-desc">
      <title id="kl-title">4グループのグッズの構成</title>
      <desc id="kl-desc">CANDY TUNE、SWEET STEADY、CUTIE STREET、MORE STARの4組とも、アクスタ、アクキー、トレカ、写真L判、ランダム缶バッジ、ファンライト、タオル、CD会場予約の同じ構成。</desc>
      {GROUPS.map((g, i) => (
        <g key={g.name}>
          <rect x={8 + i * 87} y="8" width="83" height="34" rx="10" fill={g.color} />
          <text x={49.5 + i * 87} y="30" fontSize="10" fontWeight="900" fill="#fff" textAnchor="middle">
            {g.name}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r}>
          <rect x="8" y={52 + i * 34} width="344" height="28" rx="8" fill={i % 2 ? "#fff" : "#ffe9f3"} />
          <text x="18" y={70 + i * 34} fontSize="11.5" fontWeight="800" fill="#1b1430">
            {r}
          </text>
          <text x="342" y={70 + i * 34} fontSize="11" fontWeight="900" fill="#b0236a" textAnchor="end">
            ×4組
          </text>
        </g>
      ))}
      <text x="12" y="326" fontSize="10.5" fill="#625b7c">
        ※ ライトは3組が ¥5,700、MORE STAR は ¥3,500
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="kawaiilab"
      heading={
        <>
          <mark>KAWAII LAB.</mark>のライブグッズまとめ：4グループの物販と次のライブ
        </>
      }
      heroLead="11/6 に東京ガーデンシアターで開かれた「KAWAII LAB. ファンクラブ限定フリーライブ」の物販を振り返りながら、CANDY TUNE・SWEET STEADY・CUTIE STREET・MORE STAR の4グループのグッズ40アイテム、整理券アプリでの買い方、12月〜1月のライブ予定をまとめました。"
      stickers={["🍬 KAWAII LAB.", "🎀 4グループ", "🛍️ 全40アイテム", "📅 12月〜1月のライブ"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/14(月) MORE STAR 1st ANNIVERSARY LIVE の開演", start: "2026-12-14T18:00:00+09:00" },
            { label: "12/17(木) 早瀬ノエル 生誕祭の開演", start: "2026-12-17T19:00:00+09:00" },
            { label: "1/7(木) 奥田彩友 BIRTHDAY LIVE の開演", start: "2027-01-07T19:00:00+09:00" },
            { label: "1/18(月) 音井結衣 BIRTHDAY LIVE の開演", start: "2027-01-18T19:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、KAWAII LAB. OFFICIAL FANCLUB・各グループ公式サイトなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。11/6 のイベントは終了しています。新作アイテムは後日通販の予定と案内されているので、最新情報は公式で確認してください（2026年11月28日時点）。"
    >
      <p>
        アソビシステムのアイドルプロジェクト「KAWAII LAB.」。2026年11月6日(金)、ファンクラブの有料会員だけが参加できる<strong>無料のフリーライブ</strong>が東京ガーデンシアターで開かれ、CANDY TUNE・SWEET STEADY・CUTIE STREET・MORE STAR の4組が出演しました。
      </p>
      <p>
        このとき会場で売られたのが、全グループ<span className={s.hl}>新衣装の新商品</span>。新作は後日通販の予定もあるので、買えなかった人もリストで欲しいものを整理しておきましょう。
      </p>

      <Tldr
        items={[
          <>11/6 のフリーライブは終了。新作アイテムは後日の通販が予定されている</>,
          <>KAWAII LAB. の会場物販は「KAWAII LAB. STORE」アプリの整理券で先行販売 → 一般販売の流れ</>,
          <>次は 12/14 MORE STAR 1周年、12/17 早瀬ノエル生誕祭、1/7・1/18 SWEET STEADY のバースデーライブ</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="KAWAII LAB. フリーライブ" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="report" num={1}>
        11/6 FC限定フリーライブはどんなイベントだった？
      </H2>
      <Stats
        items={[
          { num: <>0<small>円</small></>, label: "チケット代（システム手数料は別）" },
          { num: <>4<small>組</small></>, label: "CANDY TUNE・SWEET STEADY・CUTIE STREET・MORE STAR" },
          { num: <>約8,000<small>人</small></>, label: "東京ガーデンシアターの最大収容" },
          { num: <>2<small>枚</small></>, label: "1申し込みあたり（同行者も有料会員）" },
        ]}
      />
      <ul>
        <li>日時：2026年11月6日(金) 開場16:30・開演18:00、会場は東京ガーデンシアター（江東区有明）。</li>
        <li>KAWAII LAB. OFFICIAL FANCLUB の有料会員限定。同行者も有料会員である必要があり、入場時には全員が本人確認書類（原本）を見せました。</li>
        <li>一部のパートは着席での鑑賞をお願いされる形でした。</li>
      </ul>
      <p>
        東京ガーデンシアターの行き方・ロッカー・バルコニー席の見え方は「<Link href="/blog/tokyo-garden-theater-guide">東京ガーデンシアター 完全ガイド</Link>」にまとめています。12/9 には CANDY TUNE のライブも東京ガーデンシアターで予定されています。
      </p>

      <H2 id="goods" num={2}>
        4グループのグッズ全40アイテムと予算計算
      </H2>
      <Figure caption="編集部作成。Mochico のリストの内容（公式発表をもとに作成）を、グループごとの構成としてまとめたものです。">
        <GroupGrid />
      </Figure>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。複数グループを推している人は、ここで一度合計を出してみるのがおすすめです。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は 11/6 の会場販売をもとに作成した Mochico のリストの内容です（税込）。後日の通販での価格・取り扱いは公式の発表を確認してください。</p>
      <Bubble>
        ランダム缶バッジ（500円）とランダムトレカ（200円）は、推しが出るまで…になりがち。Mochico のリストに参加すると、ランダムグッズは絵柄ごとに何個持っているか記録できるよ。
      </Bubble>

      <H2 id="howto" num={3}>
        KAWAII LAB. のライブ物販の流れ（整理券アプリ）
      </H2>
      <p>11/6 の会場販売は、次の流れでした（MORE STAR 公式の案内より）。次のライブでも参考になります。</p>
      <Timeline
        items={[
          { date: "公演の数日前 12:00〜", text: "「KAWAII LAB. STORE」アプリで先行販売の整理券を受付（先着・上限に達したら終了）" },
          { date: "当日 11:30〜16:00", text: "先行販売（2Fロビー）。整理券は 11:30〜14:30 の30分ごとの枠", hot: true },
          { date: "当日 14:30ごろ〜", text: "一般販売。整理券の分を買った人から順に案内" },
          { date: "開場中・終演後", text: "販売を続ける予定（状況で前後）" },
        ]}
      />
      <ul>
        <li>支払いは現金・クレジットカード・PayPay（一括払いのみ）。通信状況でキャッシュレスが使えない場合があります。</li>
        <li>11/6 は<strong>公演チケットを持っている人だけ</strong>が購入できました。</li>
        <li>一部のアイテムは1会計あたりの個数制限あり。数量限定で、なくなり次第終了です。</li>
      </ul>

      <ArticleAd />

      <H2 id="next" num={4}>
        12月〜1月の KAWAII LAB. のライブ予定
      </H2>
      <div className={s.tableWrap} role="region" aria-label="これからのライブ予定（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">公演</th>
              <th scope="col">会場・時間</th>
              <th scope="col">チケット</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">12/14(月)</th>
              <td>MORE STAR 1st ANNIVERSARY LIVE</td>
              <td>Zepp Shinjuku(TOKYO) 開場17:00・開演18:00</td>
              <td>スタンディング ¥4,000</td>
            </tr>
            <tr>
              <th scope="row">12/17(木)</th>
              <td>FRUITS ZIPPER 早瀬ノエル 生誕祭 2026</td>
              <td>SGCホール有明 開場17:30・開演19:00</td>
              <td>指定席 ¥7,000</td>
            </tr>
            <tr>
              <th scope="row">1/7(木)</th>
              <td>SWEET STEADY 奥田彩友 BIRTHDAY LIVE 2027</td>
              <td>SGCホール有明 開場17:30・開演19:00</td>
              <td>指定席 ¥6,500</td>
            </tr>
            <tr>
              <th scope="row">1/18(月)</th>
              <td>SWEET STEADY 音井結衣 BIRTHDAY LIVE 2027</td>
              <td>SGCホール有明 開場17:30・開演19:00</td>
              <td>指定席 ¥6,500</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>
        出典：KAWAII LAB. OFFICIAL FANCLUB の各公演のお知らせ。FC 先行の受付はすでに終わっているものがあります。ほかにも「KAWAII LAB. Christmas SESSION 2026」（有明アリーナ）などが告知されています。
      </p>
      <Card kind="info" label="次のライブの前に">
        <p>
          物販の整理券は公演の数日前からアプリで受付、という流れになることが多いので、<strong>KAWAII LAB. STORE アプリ</strong>を入れて、ログインできるか確認しておきましょう。欲しいものは Mochico のリストで先に決めておくと、レジで迷いません。
        </p>
      </Card>

      <H2 id="entry" num={5}>
        入場時の本人確認と持ち物
      </H2>
      <ul>
        <li>KAWAII LAB. のライブは電子チケットで、入場時に本人確認があります。有効期限内の原本（コピー不可）が必要で、同伴者も対象です。</li>
        <li>対象の書類：運転免許証、パスポート、在留カード、特別永住者証明書、身体障害者手帳、マイナンバーカード（表面のみ）、顔写真つきクレジットカード、顔写真つき学生証。</li>
        <li>録音・撮影・転売・譲渡は禁止です。</li>
      </ul>
      <Checklist
        title="KAWAII LAB. のライブの持ち物"
        icon="🍬"
        items={[
          { must: true, text: "電子チケットが入ったスマホと、本人確認書類の原本" },
          { must: true, text: "KAWAII LAB. STORE アプリ（整理券）" },
          { text: "ファンライト・ペンライトと予備の単4電池", why: "ファンライトは単4電池3本付き" },
          { text: "現金とキャッシュレスの両方", why: "通信状況でキャッシュレスが使えないことがある" },
          { text: "トレカや缶バッジを入れる小袋", why: "ランダムグッズの仕分けに" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="KAWAII LAB. フリーライブ" goodsCount={list.items.length} note="通販で買い足すときや、次のライブで交換に出すダブりを探すときに、Mochicoのリストのチェックが役に立ちます。" />

      <OfficialLinks
        items={[
          { href: "https://kawaiilab.asobisystem.com/news/detail/93695", title: "FC限定フリーライブ 開催のお知らせ", icon: "🍬" },
          { href: "https://morestar.asobisystem.com/news/detail/94769", title: "会場グッズ販売情報（11/6）", icon: "🛍️" },
          { href: "https://kawaiilab.goods-order.com/", title: "KAWAII LAB. STORE", icon: "📱" },
        ]}
      />
      <Sources
        items={[
          { href: "https://kawaiilab.asobisystem.com/news/detail/93695", label: "KAWAII LAB. OFFICIAL FANCLUB「KAWAII LAB. ファンクラブ限定フリーライブ 開催決定」（日時・会場・出演・チケット・本人確認）" },
          { href: "https://morestar.asobisystem.com/news/detail/94769", label: "MORE STAR OFFICIAL FANCLUB「11/6 会場グッズ販売情報」（販売時間・整理券・支払い）" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/schedule/5987/", label: "東京ガーデンシアター「KAWAII LAB. ファンクラブ限定フリーライブ」" },
          { href: "https://kawaiilab.asobisystem.com/news/detail/96770", label: "KAWAII LAB.「MORE STAR 1st ANNIVERSARY LIVE」" },
          { href: "https://kawaiilab.asobisystem.com/news/detail/95172", label: "KAWAII LAB.「FRUITS ZIPPER 早瀬ノエル 生誕祭 2026」" },
          { href: "https://kawaiilab.asobisystem.com/news/detail/95344", label: "KAWAII LAB.「SWEET STEADY 奥田彩友 BIRTHDAY LIVE 2027」" },
          { href: "https://kawaiilab.asobisystem.com/news/detail/95387", label: "KAWAII LAB.「SWEET STEADY 音井結衣 BIRTHDAY LIVE 2027」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
