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

const post = getBlogPost("txt-steal-the-wind-fukuoka-goods")!;
const list = LIVE_LISTS.txt;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "TXT 福岡 グッズ",
  "TOMORROW X TOGETHER STEAL THE WIND グッズ",
  "TXT ドームツアー 2026",
  "TXT POP UP 福岡 PARCO",
  "TXT PayPayドーム",
  "STEAL THE WIND 日本 日程",
  "TXT ライブビューイング 12月20日",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "日本4都市8公演の日程とチケット" },
  { id: "goods", label: "グッズ全27アイテムと予算計算" },
  { id: "buy", label: "買い方：予約販売・POP UP STORE・会場販売" },
  { id: "popup", label: "POP UP STORE（福岡・東京・大阪）" },
  { id: "events", label: "ハイタッチ会・ライブビューイング" },
  { id: "day", label: "福岡公演の持ち物" },
];

const SHOWS = [
  { d: "12/19(土)", v: "みずほPayPayドーム福岡", o: "15:00", t: "17:00", href: "/blog/paypay-dome-fukuoka-guide" },
  { d: "12/20(日)", v: "みずほPayPayドーム福岡", o: "14:00", t: "16:00", href: "/blog/paypay-dome-fukuoka-guide" },
  { d: "2027/1/7(木)", v: "東京ドーム", o: "16:00", t: "18:00", href: "/blog/tokyo-dome-guide" },
  { d: "1/8(金)", v: "東京ドーム", o: "16:00", t: "18:00", href: "/blog/tokyo-dome-guide" },
  { d: "1/30(土)", v: "京セラドーム大阪", o: "15:00", t: "17:00", href: "/blog/kyocera-dome-osaka-guide" },
  { d: "1/31(日)", v: "京セラドーム大阪", o: "14:00", t: "16:00", href: "/blog/kyocera-dome-osaka-guide" },
  { d: "2/20(土)", v: "バンテリンドーム ナゴヤ", o: "15:00", t: "17:00", href: "/blog/vantelin-dome-nagoya-guide" },
  { d: "2/21(日)", v: "バンテリンドーム ナゴヤ", o: "15:00", t: "17:00", href: "/blog/vantelin-dome-nagoya-guide" },
];

/** 自作の図：POP UP STORE と公演の期間 */
function PopupBars() {
  const rows = [
    { t: "福岡 POP UP（福岡PARCO）", s: 0, e: 10, fill: "#8be9e0" },
    { t: "福岡公演 12/19・20", s: 8, e: 9, fill: "#0a6b6b" },
    { t: "東京 POP UP（神宮前）", s: 12, e: 31, fill: "#6aa7ff" },
    { t: "大阪 POP UP（梅田）", s: 36, e: 51, fill: "#ffd6a8" },
  ];
  const X = (d: number) => 16 + (d / 52) * 328;
  return (
    <svg viewBox="0 0 360 230" role="img" aria-labelledby="tx-title tx-desc">
      <title id="tx-title">POP UP STORE と公演の期間</title>
      <desc id="tx-desc">福岡のPOP UPは12月11日から21日、福岡公演は12月19日・20日。東京のPOP UPは12月23日から1月11日（12/31〜1/2休業）、大阪は1月16日から31日。</desc>
      {[
        { d: 0, l: "12/11" },
        { d: 12, l: "12/23" },
        { d: 21, l: "1/1" },
        { d: 36, l: "1/16" },
        { d: 51, l: "1/31" },
      ].map((m) => (
        <g key={m.l}>
          <line x1={X(m.d)} y1="16" x2={X(m.d)} y2="186" stroke="#e5eef0" />
          <text x={X(m.d)} y="204" fontSize="10.5" fill="#625b7c" textAnchor="middle">
            {m.l}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.t}>
          <text x="16" y={30 + i * 42} fontSize="11" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <rect x={X(r.s)} y={36 + i * 42} width={Math.max(X(r.e) - X(r.s), 10)} height="14" rx="5" fill={r.fill} />
        </g>
      ))}
      <text x="16" y="224" fontSize="10.5" fill="#625b7c">
        ※ 愛知の POP UP は開催予定（詳細は後日）
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="txt"
      heading={
        <>
          TXT「STEAL THE WIND」<mark>福岡公演</mark>のグッズガイド
        </>
      }
      heroLead="TOMORROW X TOGETHER、3度目の日本ドームツアーは 12/19・12/20 のみずほPayPayドーム福岡から。グッズ27アイテムの予算計算、予約販売と購入数の上限、福岡PARCO ほか3都市の POP UP STORE、ハイタッチ会やライブビューイングまでまとめました。"
      stickers={["🌬️ STEAL THE WIND", "🏟️ 4大ドーム", "🛍️ 全27アイテム", "📅 12/19・12/20 福岡"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/11(金) 福岡 POP UP STORE のオープン", start: "2026-12-11T10:00:00+09:00" },
            { label: "12/19(土) 福岡の開演", start: "2026-12-19T17:00:00+09:00" },
            { label: "12/20(日) 福岡の開演", start: "2026-12-20T16:00:00+09:00" },
            { label: "1/7(木) 東京ドームの開演", start: "2027-01-07T18:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、TOMORROW X TOGETHER JAPAN OFFICIAL SITE・ライブビューイング公式サイトなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。公演会場でのグッズ販売の詳細は 11/29 時点で発表前です。出かける前に必ず公式の最新情報を確認してください。"
    >
      <p>
        TOMORROW X TOGETHER の5度目のワールドツアー「TOMORROW X TOGETHER WORLD TOUR ＜STEAL THE WIND＞」。“風”をテーマに、「流れを自分のものにする」という意味をこめたツアーです。日本では3度目のドームツアーで、<strong>12月19日(土)・20日(日)のみずほPayPayドーム福岡</strong>から、東京・大阪・名古屋の4都市8公演を回ります。
      </p>
      <p>
        グッズは27アイテム（公式ペンライト VER.2 とカプセルトイを含む）。<span className={s.hl}>Weverse Shop の予約販売は 11/29 17:59 で終わり</span>、次は 12/11 から福岡PARCOで始まる POP UP STORE と、公演会場での販売です。
      </p>

      <Tldr
        items={[
          <>福岡は 12/19(土) 開場15:00・開演17:00、12/20(日) 開場14:00・開演16:00。指定席16,500円</>,
          <>福岡PARCO の POP UP STORE は 12/11〜12/21（一般の先着予約は 12/4 18:00〜）</>,
          <>12/20 の福岡公演は全国の映画館でライブビューイング。ハイタッチ会の第2回応募は 12/1 10:59 まで</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="TXT「STEAL THE WIND」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        日本4都市8公演の日程とチケット
      </H2>
      <div className={s.tableWrap} role="region" aria-label="日本公演の日程（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 540 }}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">会場</th>
              <th scope="col">開場</th>
              <th scope="col">開演</th>
            </tr>
          </thead>
          <tbody>
            {SHOWS.map((sh) => (
              <tr key={sh.d}>
                <th scope="row">{sh.d}</th>
                <td>
                  <Link href={sh.href}>{sh.v}</Link>
                </td>
                <td>{sh.o}</td>
                <td>{sh.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：TOMORROW X TOGETHER JAPAN OFFICIAL SITE の開催決定のお知らせ。会場名から各会場のガイドへ移動できます。</p>
      <Stats
        items={[
          { num: <>16,500<small>円</small></>, label: "指定席（税込）" },
          { num: <>27,500<small>円</small></>, label: "プレミアムシート（MOA 会員のアップグレード）" },
          { num: <>8<small>公演</small></>, label: "4大ドーム" },
          { num: <>3<small>歳〜</small></>, label: "チケットが必要（3歳未満は入場不可）" },
        ]}
      />

      <H2 id="goods" num={2}>
        グッズ全27アイテムと予算計算
      </H2>
      <p>欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。キャラクター「PPULBATU」のシュシュや、NEW ERA® とのコラボキャップもあります。</p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。LOCAL PPULBATU FIGURE KEYRING は福岡・東京・大阪・愛知の都市ごとのデザインです。カプセルトイは POP UP STORE では専用コインで回します。</p>
      <Bubble>コーデュロイジャケット（15,000円）とユニフォーム（7,800円）で予算が大きく変わるよ。冬のドームの物販列で着るなら、フーディーも人気になりそう。</Bubble>

      <H2 id="buy" num={3}>
        買い方：予約販売・POP UP STORE・会場販売
      </H2>
      <ul>
        <li>
          <strong>Weverse Shop の予約販売（終了）：</strong>一般は 11/27〜11/29 17:59。CAP 以外は 12/11 までに届く予定で、福岡公演に間に合います（TXT X NEW ERA CAP は 12/25〜12/30 に別送）。
        </li>
        <li>
          <strong>購入数（予約販売）：</strong>各商品3個まで。PHOTO CARD・PHOTO CARD 10SET・INSTANT PHOTO CARD・MINI IMAGE PICKET KEYRING・CAN BADGE・LOCAL PPULBATU FIGURE KEYRING は各10個まで。
        </li>
        <li>
          <strong>公演会場：</strong>POP UP STORE と公演会場での販売も予定されています。会場での時間・方法は公式の発表待ちです。
        </li>
      </ul>

      <ArticleAd />

      <H2 id="popup" num={4}>
        POP UP STORE（福岡・東京・大阪）
      </H2>
      <Figure caption="編集部作成。期間は公式のお知らせ（11/27 更新）によります。">
        <PopupBars />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="POP UP STORE（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col">都市</th>
              <th scope="col">期間・時間</th>
              <th scope="col">場所</th>
              <th scope="col">一般の先着予約</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">福岡</th>
              <td>12/11(金)〜12/21(月) 10:00〜20:30</td>
              <td>福岡PARCO 本館5F PARCO FACTORY</td>
              <td>12/4(金) 18:00〜</td>
            </tr>
            <tr>
              <th scope="row">東京</th>
              <td>12/23(水)〜1/11(月) 11:00〜19:00（12/31〜1/2休業）</td>
              <td>第9SYビル1F（渋谷区神宮前）</td>
              <td>12/16(水) 18:00〜</td>
            </tr>
            <tr>
              <th scope="row">大阪</th>
              <td>1/16(土)〜1/31(日) 11:00〜19:00</td>
              <td>シログチビル1-2F（大阪市北区角田町）</td>
              <td>1/11(月) 18:00〜</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul>
        <li>予約は Weverse Spot から。一般は1アカウント1日1枠1枚まで。予約の指定日時以外は予約なしでも入店できます（混雑時は整理券の場合あり）。</li>
        <li>1回の入店につき1会計まで。支払いは現金・クレジットカード・電子マネー（端末の状況で現金のみになる場合あり）。</li>
        <li>カプセルトイは専用コイン（レジで購入）が必要です。</li>
      </ul>
      <Card kind="point" label="福岡公演の前に POP UP へ">
        <p>福岡の POP UP は公演の1週間前から始まります。遠征組は公演の前日に天神の PARCO に寄ってグッズをそろえておくと、当日は会場まわりで慌てずにすみます。</p>
      </Card>

      <H2 id="events" num={5}>
        ハイタッチ会・ライブビューイング
      </H2>
      <Timeline
        items={[
          { date: "12/1(火) 10:59 まで", text: "ハイタッチ会 第2回の応募（「PERFECT STORM」の対象商品を購入）。当落は 12/10 20:00 ごろ", hot: true },
          { date: "12/9(水) 18:00〜12/16(水) 22:00", text: "ライブビューイングのプレリクエスト先着（ローソンチケット）" },
          { date: "12/20(日) 16:00", text: "福岡公演 2日目を全国の映画館で生中継" },
        ]}
      />
      <ul>
        <li>ハイタッチ会は終演後に行われ、当選者本人のみ。電子チケット「Meet Pass」と顔写真付き身分証（写真・コピー・期限切れ不可）が必要です。</li>
        <li>ライブビューイングは1人4枚まで。来場特典は「メモリアルチケット風カード」。ペンライトは常時点灯モードで、頭より高く振らないよう案内されています。</li>
        <li>公演の前日などに、ランタンを上げるイベント「THE MAGIC WORLD」も各都市で予定されています。</li>
      </ul>

      <H2 id="day" num={6}>
        福岡公演の持ち物
      </H2>
      <Checklist
        title="STEAL THE WIND 福岡の持ち物"
        icon="🌬️"
        items={[
          { must: true, text: "チケット（スマホ）と身分証", why: "主催者の案内に従う" },
          { text: "OFFICIAL LIGHT STICK" },
          { text: "Weverse Spot の POP UP 予約画面", why: "福岡PARCO に寄る人" },
          { text: "防寒着", why: "ドームは博多湾のそば。12月の夜は海風が冷たい" },
          { text: "モバイルバッテリー", why: "チケット・Meet Pass・決済でスマホを使う" },
        ]}
      />
      <p>ドームの行き方・帰りの混雑は「<Link href="/blog/paypay-dome-fukuoka-guide">みずほPayPayドーム福岡 完全ガイド</Link>」にまとめています。</p>
      <MochicoListCard href={list.listUrl} tour="TXT「STEAL THE WIND」" goodsCount={list.items.length} note="予約で頼んだもの・POP UPで買ったもの・会場で買ったものを、Mochicoのリスト1つでまとめてチェックできます。" />

      <OfficialLinks
        items={[
          { href: "https://txt-official.jp/news/4268e4e57ee0", title: "日本公演 開催決定（公式）", icon: "🌬️" },
          { href: "https://txt-official.jp/news/c770aef192cb", title: "POP-UP STORE（公式）", icon: "🏬" },
          { href: "https://txt-official.jp/news/250b79c331d9", title: "OFFICIAL MERCHANDISE 予約販売（公式）", icon: "🛍️" },
          { href: "https://api-liveviewing.com/txt_steal_the_wind_in_japan/", title: "ライブビューイング（公式）", icon: "🎬" },
        ]}
      />
      <Sources
        items={[
          { href: "https://txt-official.jp/news/4268e4e57ee0", label: "TOMORROW X TOGETHER JAPAN OFFICIAL SITE「日本公演 開催決定」（日程・開場/開演・チケット）" },
          { href: "https://txt-official.jp/news/250b79c331d9", label: "TOMORROW X TOGETHER JAPAN OFFICIAL SITE「OFFICIAL MERCHANDISE 予約販売」（ラインナップ・購入数・お届け）" },
          { href: "https://txt-official.jp/news/c770aef192cb", label: "TOMORROW X TOGETHER JAPAN OFFICIAL SITE「POP-UP STORE」（福岡・東京・大阪）" },
          { href: "https://txt-official.jp/news/02e45668dca1", label: "TOMORROW X TOGETHER JAPAN OFFICIAL SITE「ハイタッチ会」" },
          { href: "https://www.universal-music.co.jp/txt/news/2026-11-11/", label: "UNIVERSAL MUSIC JAPAN「公演終演後メンバー全員ハイタッチ会」" },
          { href: "https://api-liveviewing.com/txt_steal_the_wind_in_japan/", label: "ライブビューイング公式サイト「STEAL THE WIND IN JAPAN」" },
          { href: "https://kstyle.com/article.ksn?articleNo=2284007", label: "Kstyle「TOMORROW X TOGETHER、3度目の日本ドームツアー決定」（ツアーのコンセプト）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
