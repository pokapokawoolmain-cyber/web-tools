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

const post = getBlogPost("le-sserafim-pureflow-kyocera-goods")!;
const list = LIVE_LISTS.lesserafim;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "LE SSERAFIM 京セラドーム グッズ",
  "LE SSERAFIM PUREFLOW グッズ",
  "ルセラフィム 京セラドーム 2026",
  "LE SSERAFIM POP UP 心斎橋",
  "LE SSERAFIM 京セラ 開演",
  "LE SSERAFIM ライトリング",
  "PUREFLOW 大阪 グッズ 値段",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "京セラドーム公演の日程とチケット" },
  { id: "goods", label: "グッズ全26アイテムと予算計算" },
  { id: "buy", label: "買い方：事前予約・会場販売・POP UP STORE" },
  { id: "popup", label: "心斎橋PARCOの POP UP STORE（12/9〜12/20）" },
  { id: "events", label: "サウンドチェック・ハイタッチ会の当日の持ち物" },
  { id: "day", label: "当日のタイムラインと持ち物" },
];

/** 自作の図：3つの買い方の時期 */
function BuyTimeline() {
  const rows = [
    { t: "オンライン事前予約", d: "11/24〜11/28 17:59（終了）・12/16までにお届け予定", x1: 0, x2: 1, fill: "#bcd7fb", done: true },
    { t: "POP UP STORE（心斎橋PARCO）", d: "12/9〜12/20 10:00〜20:00", x1: 2, x2: 4, fill: "#5ec8ff" },
    { t: "会場販売（京セラドーム大阪）", d: "12/19・12/20（詳細は後日発表）", x1: 3.6, x2: 4, fill: "#1556a8" },
  ];
  const X = (v: number) => 20 + v * 80;
  return (
    <svg viewBox="0 0 360 236" role="img" aria-labelledby="ls-title ls-desc">
      <title id="ls-title">LE SSERAFIM 京セラドーム公演のグッズの買い方と時期</title>
      <desc id="ls-desc">オンライン事前予約は11月24日から28日で終了。心斎橋PARCOのPOP UP STOREは12月9日から20日。会場販売は12月19日・20日で、詳細は後日発表。</desc>
      {["11/24", "12/2", "12/9", "12/16", "12/20"].map((d, i) => (
        <g key={d}>
          <line x1={X(i)} y1="20" x2={X(i)} y2="196" stroke="#e5e7eb" />
          <text x={X(i)} y="214" fontSize="10.5" fill="#625b7c" textAnchor="middle">
            {d}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.t}>
          <text x="20" y={34 + i * 58} fontSize="11.5" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <rect x={X(r.x1)} y={42 + i * 58} width={Math.max(X(r.x2) - X(r.x1), 14)} height="16" rx="6" fill={r.fill} opacity={r.done ? 0.6 : 1} />
          <text x="20" y={74 + i * 58} fontSize="10" fill="#3e3756">
            {r.d}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="lesserafim"
      heading={
        <>
          LE SSERAFIM「PUREFLOW」<mark>京セラドーム大阪</mark>のグッズガイド
        </>
      }
      heroLead="LE SSERAFIM 初の京セラドーム大阪公演（12/19・12/20）。グッズ26アイテムの予算計算、事前予約・会場販売・心斎橋PARCOの POP UP STORE の3つの買い方、購入数の上限、サウンドチェックやハイタッチ会の当日の持ち物までまとめました。"
      stickers={["💙 PUREFLOW", "🏟️ 京セラドーム", "🛍️ 全26アイテム", "📅 12/19・12/20"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/9(水) POP UP STORE のオープン", start: "2026-12-09T10:00:00+09:00" },
            { label: "12/19(土) 京セラドームの開演", start: "2026-12-19T17:00:00+09:00" },
            { label: "12/20(日) 京セラドームの開演", start: "2026-12-20T16:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、LE SSERAFIM JAPAN OFFICIAL SITE などの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。会場販売の詳細は 11/28 時点で「別途お知らせ」です。出かける前に必ず公式の最新情報を確認してください。"
    >
      <p>
        LE SSERAFIM の「2026 LE SSERAFIM TOUR &apos;PUREFLOW&apos; IN KYOCERA DOME OSAKA」は、グループ初の京セラドーム大阪公演。<strong>12月19日(土)・20日(日)</strong>の2日間です。
      </p>
      <p>
        グッズは、メンバー別のユニフォームシャツやバーシティジャケット、キャラクターのマスコットリングなど26アイテム。<span className={s.hl}>オンライン予約は 11/28 で終わり、次は 12/9 からの心斎橋の POP UP STORE と、当日の会場販売</span>です。
      </p>

      <Tldr
        items={[
          <>12/19(土) 開場15:00・開演17:00、12/20(日) 開場14:00・開演16:00。指定席は16,500円</>,
          <>心斎橋PARCO 9F の POP UP STORE は 12/9〜12/20（予約は FC 先着 11/26〜、一般先着 12/2 18:00〜）</>,
          <>会場販売も予定（詳細は後日発表）。購入数の目安は各商品3個まで、フォトカード類は10個まで</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="LE SSERAFIM「PUREFLOW」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        京セラドーム公演の日程とチケット
      </H2>
      <div className={s.tableWrap} role="region" aria-label="京セラドーム大阪公演の日程" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">開場</th>
              <th scope="col">開演</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">2026/12/19(土)</th>
              <td>15:00</td>
              <td>17:00</td>
            </tr>
            <tr>
              <th scope="row">2026/12/20(日)</th>
              <td>14:00</td>
              <td>16:00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Stats
        items={[
          { num: <>16,500<small>円</small></>, label: "指定席（税込）" },
          { num: <>3<small>歳〜</small></>, label: "チケットが必要（3歳未満は入場不可）" },
          { num: <>12/9〜</>, label: "心斎橋PARCO の POP UP STORE" },
          { num: <>初</>, label: "LE SSERAFIM の京セラドーム大阪公演" },
        ]}
      />
      <p>
        ステージサイドなど見えにくい・聞こえにくい席があり、見え方を理由にした返金・キャンセルはできません。京セラドームの行き方・ロッカー・帰りの混雑は「<Link href="/blog/kyocera-dome-osaka-guide">京セラドーム大阪 完全ガイド</Link>」で解説しています。
      </p>

      <H2 id="goods" num={2}>
        グッズ全26アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。マスコットリングは OFFICIAL LIGHT STICK を彩るアクセサリーで、LIGHT RING は公演に合わせた特別価格です。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。メンバー別・サイズ別の商品があります。会場・POP UP での取り扱いと価格は公式の最新情報を確認してください。</p>
      <Bubble>
        マスコットリング・キャラクタータグ・ミニパペット・ラゲッジタグは、それぞれ KIMACHI・SAKKUKKU・HEURIMONG・ZUHARONG・HONGPPIPPI の5種類。推しキャラを決めてからチェックしてみてね。
      </Bubble>

      <H2 id="buy" num={3}>
        買い方：事前予約・会場販売・POP UP STORE
      </H2>
      <Figure caption="編集部作成。期間は公式発表によります（会場販売の時間・場所は後日発表）。">
        <BuyTimeline />
      </Figure>
      <ul>
        <li>
          <strong>オンライン事前予約（終了）：</strong>LE SSERAFIM Weverse Shop で 11/24〜11/28 17:59。12/4 以降に順次発送し、期間内の注文分は 12/16 までに届く予定です。
        </li>
        <li>
          <strong>購入数の目安（事前予約）：</strong>各商品・各オプション3個まで。ACRYLIC STAND は5個、PHOTO CARD・INSTANT PHOTO CARD・PHOTO CAN BADGE・ACRYLIC KEYRING・LIGHT RING は10個まで。
        </li>
        <li>
          <strong>会場販売：</strong>公演会場と POP UP STORE での販売が予定されています。会場での時間・場所・方法は別途発表されます。
        </li>
      </ul>

      <ArticleAd />

      <H2 id="popup" num={4}>
        心斎橋PARCOの POP UP STORE（12/9〜12/20）
      </H2>
      <Timeline
        items={[
          { date: "11/26(木) 18:00〜", text: "FEARNOT Membership (JP) の先着予約（1アカウント1回1枚）" },
          { date: "12/2(水) 18:00〜", text: "一般の先着予約（1アカウント1日1枠1枚）", hot: true },
          { date: "12/9(水)・12/10(木)", text: "終日予約制" },
          { date: "12/11(金)〜12/20(日)", text: "13:00 まで予約制、13:00 からフリー入場（空きがあれば予約なしでも）" },
        ]}
      />
      <ul>
        <li>場所：心斎橋PARCO 9F EVENT SPACE（大阪市中央区心斎橋筋1-8-3）。営業は全日 10:00〜20:00。</li>
        <li>予約は Weverse Spot から。1回の入店につき1会計までです。</li>
        <li>支払い：現金・クレジットカード・電子マネー（端末の状況で現金のみになる場合あり）。名前や文字を入れられる MEMORIAL KEYHOLDER は現金のみ。</li>
        <li>対象 CD を1枚買うごとに POP UP 限定フォトカード1枚（全5種からランダム）。</li>
      </ul>
      <Card kind="point" label="公演の前に POP UP で買うのが安心">
        <p>会場販売の詳細はまだ発表前。公演の日にグッズの列で時間を使いたくない人は、12/9〜12/18 の平日に POP UP STORE で買っておくのも手です。</p>
      </Card>

      <H2 id="events" num={5}>
        サウンドチェック・ハイタッチ会の当日の持ち物
      </H2>
      <p>2nd Single「Made My Night」の購入者を対象にしたサウンドチェック観覧とハイタッチ会（終演後・約45分後から）は、応募がすでに終わっています。当選した人は次の点に注意しましょう。</p>
      <ul>
        <li>
          主催者が指定する<strong>顔写真つきの身分証</strong>（写真・コピー・期限切れは不可）と、電子チケット「passchord」（前日17:00ごろ発券・1枚につきスマホ1台）が必要。
        </li>
        <li>本人のみ参加できます。代理・家族・友人の入場はできません。撮影・録音・録画は禁止です。</li>
      </ul>

      <H2 id="day" num={6}>
        当日のタイムラインと持ち物
      </H2>
      <Checklist
        title="PUREFLOW 京セラドームの持ち物"
        icon="💙"
        items={[
          { must: true, text: "チケット（スマホ）と身分証", why: "主催者の案内に従う" },
          { text: "OFFICIAL LIGHT STICK（とマスコットリング）" },
          { text: "100円玉", why: "京セラドーム周辺のロッカーはほとんど現金・100円玉のみ" },
          { text: "防寒着", why: "12月の大阪、物販や退場の待ち時間に" },
          { text: "モバイルバッテリー", why: "電子チケットと passchord でスマホを使う" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="LE SSERAFIM「PUREFLOW」" goodsCount={list.items.length} note="予約で頼んだもの・POP UPで買ったもの・会場で買ったものを、Mochicoのリスト1つでまとめてチェックできます。" />

      <OfficialLinks
        items={[
          { href: "https://www.le-sserafim.jp/news/0fbf87ba1d6c", title: "京セラドーム大阪公演 開催決定（公式）", icon: "💙" },
          { href: "https://www.le-sserafim.jp/news/1fefc4b122c0", title: "Official Merch 予約販売（公式）", icon: "🛍️" },
          { href: "https://www.le-sserafim.jp/news/281a764b180f", title: "POP UP STORE in 大阪（公式）", icon: "🏬" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.le-sserafim.jp/news/0fbf87ba1d6c", label: "LE SSERAFIM JAPAN OFFICIAL SITE「2026 LE SSERAFIM TOUR 'PUREFLOW' IN KYOCERA DOME OSAKA 開催決定」" },
          { href: "https://www.le-sserafim.jp/news/c3c8ff82cde6", label: "LE SSERAFIM JAPAN OFFICIAL SITE「ローソンチケット抽選先行」（指定席・注意事項）" },
          { href: "https://www.le-sserafim.jp/news/1fefc4b122c0", label: "LE SSERAFIM JAPAN OFFICIAL SITE「Official Merch 予約販売」（ラインナップ・購入数・お届け）" },
          { href: "https://www.le-sserafim.jp/news/281a764b180f", label: "LE SSERAFIM JAPAN OFFICIAL SITE「POP UP STORE」（心斎橋PARCO・予約・支払い）" },
          { href: "https://www.le-sserafim.jp/news/037b5ca8b01d", label: "LE SSERAFIM JAPAN OFFICIAL SITE「サウンドチェックイベント」" },
          { href: "https://www.le-sserafim.jp/news/626ca93be8bf", label: "LE SSERAFIM JAPAN OFFICIAL SITE「ハイタッチ会」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
