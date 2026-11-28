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
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";
import { GoodsBudget, LiveCountdown } from "../_components/oshi/LiveWidgets";
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("mrs-green-apple-shadows-kobe-goods")!;
const list = LIVE_LISTS.mga;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "ミセス 神戸 グッズ",
  "Mrs. GREEN APPLE SHADOWS グッズ",
  "Ringo Jam Tour SHADOWS 神戸",
  "ミセス GLION ARENA KOBE",
  "ミセス 旅のしおり 神戸",
  "FLYING GHOST ミセス",
  "SHADOWS ランダムフィギュア",
]);

const TOC: TocItem[] = [
  { id: "about", label: "「SHADOWS」神戸公演の基本情報" },
  { id: "goods", label: "グッズ全34アイテムと予算計算" },
  { id: "limits", label: "購入制限とランダムフィギュア" },
  { id: "booth", label: "会場のお楽しみ：FLYING GHOST・くじ・フォトスポット" },
  { id: "city", label: "神戸の街で：旅のしおりとCITY QUEST" },
  { id: "entry", label: "入場（顔写真登録）と持ち物" },
];

/** 自作の図：旅のしおりの配布スポットと会場の位置関係（簡略図） */
function KobeSpots() {
  const spots = [
    { x: 40, y: 54, t: "生田神社" },
    { x: 150, y: 54, t: "神戸マルイ" },
    { x: 262, y: 54, t: "総合案内所" },
    { x: 40, y: 112, t: "三宮センター街" },
    { x: 150, y: 112, t: "元町1番街" },
    { x: 262, y: 112, t: "南京町" },
    { x: 40, y: 170, t: "umie" },
    { x: 150, y: 170, t: "かもめりあ" },
  ];
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="kb-title kb-desc">
      <title id="kb-title">神戸で『旅のしおり』が配られる場所と会場（簡略図）</title>
      <desc id="kb-desc">
        三宮・元町・ハーバーランドの8か所（生田神社、神戸マルイ、神戸市総合インフォメーションセンター、三宮センター街、元町1番街商店街、南京町商店街、神戸ハーバーランドumie、中突堤中央ターミナルかもめりあ）で配布。会場のGLION ARENA KOBEは海側の新港第2突堤にある。
      </desc>
      <rect x="0" y="0" width="360" height="300" fill="#f8fbfa" />
      <text x="12" y="22" fontSize="11" fontWeight="800" fill="#625b7c">
        三宮・元町・ハーバーランド（山側）
      </text>
      {spots.map((sp) => (
        <g key={sp.t}>
          <rect x={sp.x - 30} y={sp.y - 18} width="108" height="40" rx="12" fill="#fff" stroke="#b7e6d6" />
          <text x={sp.x + 24} y={sp.y + 6} fontSize="11" fontWeight="800" fill="#0b6f54" textAnchor="middle">
            {sp.t}
          </text>
        </g>
      ))}
      <rect x="0" y="212" width="360" height="88" fill="#e0f0ff" />
      <text x="12" y="290" fontSize="10.5" fill="#1d5fae" fontWeight="700">
        神戸港（海側）
      </text>
      <rect x="150" y="222" width="198" height="54" rx="14" fill="#2e1b4f" />
      <text x="249" y="246" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">
        GLION ARENA KOBE
      </text>
      <text x="249" y="264" fontSize="10.5" fill="#d9fff5" textAnchor="middle">
        新港第2突堤（三宮から徒歩約20分）
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="mga"
      heading={
        <>
          Mrs. GREEN APPLE「SHADOWS」<mark>神戸公演</mark>のグッズと楽しみ方
        </>
      }
      heroLead="Ringo Jam 10周年のファンクラブツアー「SHADOWS」。12/2・12/3 の GLION ARENA KOBE 公演に向けて、グッズ34アイテムの予算計算、購入制限、FLYING GHOST などの会場のお楽しみ、神戸の街で配られる『旅のしおり』までまとめました。"
      stickers={["👻 SHADOWS", "🍏 Ringo Jam", "🛍️ 全34アイテム", "📅 12/2・12/3 神戸"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/2(水) 神戸公演の開演", start: "2026-12-02T18:00:00+09:00" },
            { label: "12/3(木) 神戸公演の開演", start: "2026-12-03T18:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、Mrs. GREEN APPLE の公式サイト・ファンクラブ「Ringo Jam」の案内、主催者（キョードーインフォメーション）の公演ページなどをもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。会場での販売方法は公式の最新情報を確認してください（2026年11月28日時点）。"
    >
      <p>
        Mrs. GREEN APPLE のファンクラブ「Ringo Jam」の10周年を記念したツアー「Mrs. GREEN APPLE Ringo Jam Tour “SHADOWS”」。オリジナルキャラクターのゴースト「メメル」と「ジャミー」が登場する、遊び心たっぷりのツアーです。
      </p>
      <p>
        神戸公演は<strong>12月2日(水)・3日(木) の GLION ARENA KOBE</strong>。2025年に開業した海辺の新しいアリーナで、約1万人規模です。11月の長野公演（11/18・19）は大森元貴さんの体調不良で 2027年3月23日・24日に延期されましたが、神戸公演の延期は発表されていません（11/28時点）。
      </p>

      <Tldr
        items={[
          <>神戸は 12/2(水)・12/3(木) 18:00 開演。全員「顔写真登録あり」のチケットでの入場</>,
          <>グッズは1会計で各商品2点まで（フォトカードセット15点・ランダムフィギュア9点・ネイルパーツ1点まで）</>,
          <>神戸の街では 11/27〜12/6 に無料の『旅のしおり』を配布。CITY QUEST のデジタルラリーも</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="ミセス「SHADOWS」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="about" num={1}>
        「SHADOWS」神戸公演の基本情報
      </H2>
      <Stats
        items={[
          { num: <>18:00</>, label: "神戸公演の開演（2日間とも）" },
          { num: <>15,000<small>円</small></>, label: "チケット（全席種・税込）" },
          { num: <>約1万<small>人</small></>, label: "GLION ARENA KOBE の収容" },
          { num: <>4<small>歳〜</small></>, label: "チケットが必要（3歳以下は入場不可）" },
        ]}
      />
      <p>
        席種は指定席・着席指定席・立見・注釈付き指定席・注釈付き着席指定席（いずれも15,000円）。着席指定席は公演中に立ち上がれません。立見はパイプ椅子・折りたたみ椅子・踏み台の持ち込みと使用が禁止されています。
      </p>
      <p>
        会場までの行き方、帰りのシャトルバス、新神戸の最終新幹線に間に合うかは「
        <Link href="/blog/glion-arena-kobe-guide">GLION ARENA KOBE 完全ガイド</Link>
        」で詳しく解説しています。
      </p>

      <H2 id="goods" num={2}>
        グッズ全34アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。Tシャツ・ロングスリーブは色ちがいで6種類あるので、推し色を先に決めておくと迷いません。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>
        価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。ナイロンブルゾン・ニット・グラフィックフォトのロンT・ネイルパーツ&シールは、10/2 からのオンライン先行で追加された商品です。会場で同じ商品が買えるかは、公式の最新情報を確認してください。
      </p>
      <Bubble>
        ランダムフィギュアは「通常6種＋シークレット3種」の全9種。通常の6種だけなら「全6種セット」もあるよ。シークレットを狙うかどうかで予算が変わるね。
      </Bubble>

      <H2 id="limits" num={3}>
        購入制限とランダムフィギュア
      </H2>
      <div className={s.tableWrap} role="region" aria-label="購入制限" tabIndex={0}>
        <table className={s.table}>
          <caption>1会計あたりの購入上限（公式グッズページより）</caption>
          <tbody>
            <tr>
              <th scope="row">基本</th>
              <td>各商品2点まで（Tシャツなどはサイズを問わず2点まで）</td>
            </tr>
            <tr>
              <th scope="row">Special Photo Card Set “SHADOWS”</th>
              <td>15点まで</td>
            </tr>
            <tr>
              <th scope="row">ランダムフィギュア</th>
              <td>9点まで（全9種：通常6種＋シークレット3種）</td>
            </tr>
            <tr>
              <th scope="row">ネイルパーツ&シール</th>
              <td>1点まで</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：Mrs. GREEN APPLE オフィシャルグッズ「SHADOWS」オンライン先行の案内。</p>
      <p>
        ランダムグッズは、どの絵柄が出たかをその場で記録しておくと、ダブりの交換相手を探すときに便利です。Mochico のリストに参加すると、ランダム商品は<strong>絵柄ごとに個数</strong>を記録できます（記録のしかたは「
        <Link href="/blog/random-goods-management">ランダムグッズの管理方法</Link>
        」で紹介しています）。
      </p>

      <ArticleAd />

      <H2 id="booth" num={4}>
        会場のお楽しみ：FLYING GHOST・くじ・フォトスポット
      </H2>
      <ul>
        <li>
          <strong>FLYING GHOST（有料ゲーム）：</strong>1回500円（税込）、Ringo Jam 会員（年会員・月会員）向け。1回の会計で最大10プレイ。支払いはクレジットカード（VISA・Mastercard・AMERICAN EXPRESS・JCB）と電子マネー（iD・QUICPay・交通系IC）のみで、現金は使えません。
        </li>
        <li>
          <strong>スピードJAM&apos;Sくじ：</strong>会場から約3km以内の会員が、スマホでその場で抽選。当たったら専用ブースで景品と交換（公演日限定）。
        </li>
        <li>
          <strong>PHOTO SPOT：</strong>メメル・ジャミーと撮れる限定フォトスポットと、未公開のメンバー写真の展示。時間帯優先の「Mrs. Pass」もあります。
        </li>
        <li>
          <strong>Ringo Jam Café フードトラック：</strong>「Mokkun Soda」「Hiropa Soda」「Ryo-chan Soda」各990円（税込）。会員1人1日・1会計3本まで。
        </li>
        <li>
          <strong>CD・映像の会場限定特典くじ：</strong>アルバム「POPS」の購入者向け、ハズレなし（音楽ショップのブース）。
        </li>
      </ul>

      <H2 id="city" num={5}>
        神戸の街で：旅のしおりとCITY QUEST
      </H2>
      <p>
        ツアーの開催都市では、全国の「JAM&apos;S」から寄せられた<strong>約2万件</strong>の推しスポット・グルメをまとめた冊子『旅のしおり』を無料で配っています。神戸の配布期間は <strong>11/27(金)〜12/6(日)</strong>。1人1冊で、各スポット・各日に配布数の上限があります。
      </p>
      <Figure caption="編集部作成の簡略図。配布場所は神戸ジャーナルの記事によります。位置関係は実際の地図ではありません。最新の配布場所は公式特設サイトで確認してください。">
        <KobeSpots />
      </Figure>
      <ul>
        <li>
          <strong>CITY QUEST デジタルラリー：</strong>対象スポットのQRコードを読み込むと、黄・赤・青のどれか1色のスタンプ（1個で壁紙）。3色そろえると「ご当地 THANK YOU VOICE」がもらえます。
        </li>
        <li>
          <strong>POP-UP STORE：</strong>神戸マルイで 11/20〜12/6 に開催。
        </li>
      </ul>
      <Card kind="memo" label="しおりは非売品">
        <p>『旅のしおり』は非売品で、転売・オークション・フリマアプリへの出品は禁止されています。</p>
      </Card>

      <H2 id="entry" num={6}>
        入場（顔写真登録）と持ち物
      </H2>
      <Card kind="caution" label="全員、顔写真の登録が必要">
        <p>
          神戸公演は「顔写真登録【あり】のチケット」での入場です。<strong>申込者も同行者も、事前に顔写真の登録が必要</strong>です。まだの人は早めに済ませましょう。
        </p>
      </Card>
      <Checklist
        title="SHADOWS 神戸の持ち物"
        icon="👻"
        items={[
          { must: true, text: "チケット（顔写真登録済み）が入ったスマホ" },
          { must: true, text: "キャッシュレス決済の手段", why: "FLYING GHOST は現金不可。会場の飲食店もキャッシュレスのみ" },
          { text: "MGA Official Light Stick（持っている人）" },
          { text: "防寒着", why: "アリーナは海に囲まれた突堤の先。夜は海風で冷える" },
          { text: "モバイルバッテリー", why: "スピードJAM'Sくじ・CITY QUEST・チケットでスマホを使う" },
          { text: "エコバッグ", why: "ブルゾンやニットなどかさばるグッズ用" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="ミセス「SHADOWS」" goodsCount={list.items.length} note="神戸で買ったものをMochicoのリストでチェックしておけば、ランダムフィギュアのダブりも、次の公演で買い足すものもすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://mga.fannect.jp/pages/shadows", title: "オフィシャルグッズ「SHADOWS」", icon: "🛍️" },
          { href: "https://mrsgreenapple.com/feature/ringojamtour_shadows_special", title: "SHADOWS スペシャル企画（会場のお楽しみ）", icon: "👻" },
          { href: "https://kyodo-osaka.co.jp/search/detail/13432", title: "キョードーインフォメーション（神戸公演）", icon: "🎫" },
        ]}
      />
      <Sources
        items={[
          { href: "https://kyodo-osaka.co.jp/search/detail/13432", label: "キョードーインフォメーション「Mrs. GREEN APPLE Ringo Jam Tour “SHADOWS”」（神戸公演の日時・席種・顔写真登録）" },
          { href: "https://mga.fannect.jp/pages/shadows", label: "Mrs. GREEN APPLE オフィシャルグッズ「SHADOWS」（ラインナップ・購入制限・オンライン先行）" },
          { href: "https://mrsgreenapple.com/feature/ringojamtour_shadows_special?lang=en", label: "Mrs. GREEN APPLE OFFICIAL SITE「SHADOWS」スペシャル企画（FLYING GHOST・くじ・フォトスポット・フードトラック）" },
          { href: "https://kobe-journal.com/archives/6954466435.html", label: "神戸ジャーナル「Mrs. GREEN APPLEの『旅のしおり』が神戸で無料配布」" },
          { href: "https://mrsgreenapple.com/news/detail/23395?lang=en", label: "Mrs. GREEN APPLE OFFICIAL SITE「長野公演（11/18・19）延期のお知らせ」" },
          { href: "https://news.infoseek.co.jp/article/sponichin_20261115_0297/", label: "スポニチ（Infoseekニュース）「ミセス 長野2公演の延期を発表」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
