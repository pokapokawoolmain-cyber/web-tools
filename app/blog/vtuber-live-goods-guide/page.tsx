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
  MochicoNudge,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Tldr,
  Timeline,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";

const post = getBlogPost("vtuber-live-goods-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "Vtuber ライブ グッズ",
  "Vtuber 現地 物販",
  "会場受け取り 事前オーダー",
  "受注生産 締切 忘れ",
  "オンラインガチャ ライブ",
  "ライブビューイング 持ち物",
  "星街すいせい 福岡 グッズ",
  "Vtuber 推し活",
]);

const TOC: TocItem[] = [
  { id: "season", label: "この冬の大きな現地イベント" },
  { id: "ways", label: "グッズの買い方は大きく4種類" },
  { id: "compare", label: "同じ「ライブ物販」でもこんなに違う" },
  { id: "order", label: "受注生産グッズの締切を逃さないコツ" },
  { id: "entry", label: "入場・ライブビューイングで気をつけること" },
  { id: "check", label: "Vtuberの現地参戦チェックリスト" },
];

/** 自作の図：グッズの4つの買い方 */
function FourWays() {
  const items = [
    { t: "① 事前オーダー → 会場受け取り", d: "ネットで注文・決済して、当日は受け取るだけ", fill: "#efe9ff", ink: "#5a2fd2" },
    { t: "② 当日の会場販売", d: "先着順。在庫がなくなり次第終了", fill: "#ffe4f0", ink: "#be185d" },
    { t: "③ オンラインガチャ", d: "スマホで回して、結果を会場で受け取る", fill: "#fff6cc", ink: "#8a5a00" },
    { t: "④ 受注生産・事後通販", d: "期間内に注文。届くのは数か月後のことも", fill: "#dcf7ec", ink: "#047857" },
  ];
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="fw-title fw-desc">
      <title id="fw-title">ライブグッズの4つの買い方</title>
      <desc id="fw-desc">
        事前オーダーして会場で受け取る、当日の会場販売、オンラインガチャ、受注生産・事後通販の4種類。
      </desc>
      {items.map((it, i) => (
        <g key={it.t}>
          <rect x="8" y={8 + i * 72} width="344" height="62" rx="14" fill={it.fill} />
          <text x="22" y={34 + i * 72} fontSize="13.5" fontWeight="900" fill={it.ink}>
            {it.t}
          </text>
          <text x="22" y={55 + i * 72} fontSize="11.5" fill="#3e3756">
            {it.d}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 自作の図：受注生産グッズの一生（発表から届くまで） */
function OrderLife() {
  const steps = [
    { x: 14, label: "発表", sub: "誕生日・周年など" },
    { x: 100, label: "受注開始", sub: "ここで登録" },
    { x: 186, label: "締切", sub: "いちばん忘れがち", hot: true },
    { x: 272, label: "お届け", sub: "数か月後のことも" },
  ];
  return (
    <svg viewBox="0 0 360 150" role="img" aria-labelledby="ol-title ol-desc">
      <title id="ol-title">受注生産グッズの流れ</title>
      <desc id="ol-desc">発表、受注開始、締切、お届けの順に進む。締切がいちばん忘れやすく、届くまで数か月かかることもある。</desc>
      <line x1="40" y1="52" x2="320" y2="52" stroke="#ddd2ff" strokeWidth="4" />
      {steps.map((st) => (
        <g key={st.label}>
          <circle cx={st.x + 34} cy="52" r="16" fill={st.hot ? "#be185d" : "#7c4dff"} />
          <text x={st.x + 34} y="57" fontSize="12" fill="#fff" fontWeight="900" textAnchor="middle">
            {st.hot ? "!" : "●"}
          </text>
          <text x={st.x + 34} y="94" fontSize="12.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
            {st.label}
          </text>
          <text x={st.x + 34} y="112" fontSize="10" fill={st.hot ? "#be185d" : "#625b7c"} fontWeight={st.hot ? 800 : 400} textAnchor="middle">
            {st.sub}
          </text>
        </g>
      ))}
      <text x="14" y="140" fontSize="10.5" fill="#625b7c">
        届くころには「何を頼んだか」を忘れがち。注文内容も残しておこう
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          Vtuberのライブ・<mark>受注グッズ</mark>で後悔しないためのガイド
        </>
      }
      heroLead="事前オーダー、当日販売、オンラインガチャ、受注生産。Vtuberの現地イベントは、グッズの買い方がとにかく多い。この冬の大きなライブを例に、仕組みの違いと「締切を逃さない」コツをまとめました。"
      stickers={["🌟 Vtuber", "🛍️ 会場受け取り", "⏰ 受注の締切", "🎬 ライブビューイング"]}
      unofficialNote="この記事は、各公演の公式サイト・公式発表をもとにToolBoxJP編集部がまとめた非公式のガイドです。記事で例に挙げた出演者・事務所・会場とは関係ありません。受付期間や販売方法は公演ごとに違い、変更されることもあるので、必ず公式の最新情報を確認してください（2026年11月8日時点の情報）。"
    >
      <p>
        配信で応援してきた推しに、会場で会える。Vtuberのアリーナ公演や大型イベントが増えて、現地参戦する人もどんどん増えています。
      </p>
      <p>
        ただ、Vtuberのイベントは<span className={s.hl}>グッズの買い方が公演ごとにバラバラ</span>。「事前オーダーの締切を過ぎていた」「会場受け取りと当日販売の違いが分からなかった」「誕生日グッズの受注を忘れていた」…そんな後悔をしないためのポイントを整理しました。
      </p>

      <Tldr
        items={[
          <>グッズは「事前オーダー→会場受け取り」「当日販売」「オンラインガチャ」「受注生産」の4種類。公演ごとに組み合わせが違う</>,
          <>事前オーダーは公演の数日前に締め切られることが多い。チケットが取れたら、すぐ物販の案内を確認</>,
          <>誕生日・周年の受注グッズは期間限定。発表を見たら、締切日をすぐ記録しておく</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="season" num={1}>
        この冬の大きな現地イベント
      </H2>
      <Timeline
        items={[
          {
            date: "11/12(木)",
            text: (
              <>
                <strong>HOSHIMACHI SUISEI ARENA TOUR 2026 “Once Upon a Stellar”</strong> 福岡公演（マリンメッセ福岡A館）。ツアーの最終公演で、全国51館と海外の映画館でライブビューイングあり。
              </>
            ),
            hot: true,
          },
          {
            date: "12/19(土)・20(日)",
            text: (
              <>
                <strong>にじさんじ Girls Idol Festival 〜虹をつないで、未来を見つけて〜</strong>（インテックス大阪5号館）。詳細は公式サイトで順次発表。
              </>
            ),
          },
        ]}
      />
      <p>
        福岡公演に行く人は、会場のアクセスや帰りのバスについて「
        <Link href="/blog/marine-messe-fukuoka-guide">マリンメッセ福岡A館 完全ガイド</Link>
        」にまとめています。
      </p>

      <H2 id="ways" num={2}>
        グッズの買い方は大きく4種類
      </H2>
      <Figure caption="編集部作成。実際にどの方法があるかは公演ごとに違います。">
        <FourWays />
      </Figure>
      <h3>例：星街すいせいさんの福岡公演（公式FCサイトの案内より）</h3>
      <div className={s.tableWrap} role="region" aria-label="福岡公演のグッズの買い方" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">方法</th>
              <th scope="col">期間・時間</th>
              <th scope="col">ポイント</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">事前オーダー→会場受け取り</th>
              <td>注文：11/3 18:00〜11/10 23:59<br />受け取り：11/12 10:00〜18:45</td>
              <td>チケットがない人も利用可。注文後のキャンセル・サイズ変更はできない</td>
            </tr>
            <tr>
              <th scope="row">当日の会場販売</th>
              <td>11/12 10:00〜開演前19:00</td>
              <td>数量限定・先着順。アプリで購入リストを作っておける（購入の保証ではない）</td>
            </tr>
            <tr>
              <th scope="row">オンラインガチャ</th>
              <td>福岡公演はなし</td>
              <td>名古屋公演などで実施。神戸公演では1人50回までだった</td>
            </tr>
            <tr>
              <th scope="row">FCブース</th>
              <td>物販開始〜終演30分後</td>
              <td>FC会員はマイページのQRコードを見せるとオリジナルトレカ（なくなり次第終了）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：星街すいせい公式ファンクラブ「ARENA TOUR 2026」、Studio STELLAR公式Xの神戸公演の告知。</p>
      <Card kind="caution" label="支払いの細かいルール">
        <p>
          福岡公演の会場販売では、現金とキャッシュレスの<strong>併用ができず</strong>、会場で交通系ICの<strong>チャージもできません</strong>。キャッシュレスで払うなら、残高は前日までに。
        </p>
      </Card>

      <H2 id="compare" num={3}>
        同じ「ライブ物販」でもこんなに違う
      </H2>
      <p>同じ時期のツアーでも、物販の仕組みはアーティストによってまったく違います。たとえば、米津玄師さんの「GHOST」ツアーと比べるとこんな感じです。</p>
      <div className={s.tableWrap} role="region" aria-label="物販の仕組みの比較（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">星街すいせい 福岡公演</th>
              <th scope="col">米津玄師 GHOST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">混雑対策</th>
              <td>事前オーダーの会場受け取り</td>
              <td>アプリの整理券（先着・20時配布）</td>
            </tr>
            <tr>
              <th scope="row">事前決済</th>
              <td>あり（全会場）</td>
              <td>神奈川公演の会場受け取りのみ</td>
            </tr>
            <tr>
              <th scope="row">ガチャ</th>
              <td>オンラインガチャ（一部公演）</td>
              <td>会場のガチャガチャ（1回の並びで6回まで）</td>
            </tr>
            <tr>
              <th scope="row">チケットなしで買える？</th>
              <td>会場受け取りは可</td>
              <td>会場販売は可</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>各公演の公式サイトの案内より（2026年11月8日時点）。詳しくは「<Link href="/blog/yonezu-ghost-tour-goods">GHOSTツアーグッズまとめ</Link>」も参照。</p>
      <Bubble>「前のライブと同じだろう」と思い込まないのがいちばんのコツ。チケットが取れたら、まず物販のページを開こう！</Bubble>

      <ArticleAd />

      <H2 id="order" num={4}>
        受注生産グッズの締切を逃さないコツ
      </H2>
      <p>
        Vtuberのグッズで多いのが、誕生日・周年・記念配信に合わせた<strong>期間限定の受注生産</strong>。ボイスやアクスタ、タペストリーなどが「◯日まで」と区切って受け付けられ、締切を過ぎると基本的に買えません。複数の推しがいると、締切が毎週のようにやってきます。
      </p>
      <Figure caption="編集部作成。期間やお届けの時期はグッズごとに違います。">
        <OrderLife />
      </Figure>
      <ol>
        <li>
          <strong>発表を見たら、その場で締切を記録する。</strong>「あとで買う」は忘れるもと。商品名・締切の日時・価格をセットで残します。
        </li>
        <li>
          <strong>締切の「時刻」まで見る。</strong>23:59締切と18:00締切では大違い。日付だけで覚えていると危険です。
        </li>
        <li>
          <strong>注文したら「注文済み」にする。</strong>数か月後に届くころには何を頼んだか忘れがち。二重注文も防げます。
        </li>
        <li>
          <strong>届いたら写真を残す。</strong>持っているものの一覧になり、次の受注で迷わなくなります。
        </li>
      </ol>
      <MochicoNudge title="締切までの日数を、一覧でひと目に">
        <p>
          「Mochico（モチコ）」では、グッズごとに予約開始・締切・販売開始の日時を登録できます。一覧に「予約受付中・あと3日」のように締切までの残りが表示されるので、受注グッズの申し込み忘れを防げます。周年・誕生日・コラボをイベントごとに分けて管理でき、持っているものはタップで記録できます。
        </p>
      </MochicoNudge>
      <p>
        締切の管理については「<Link href="/blog/prevent-duplicate-goods">推しグッズの重複買いを防ぐ方法</Link>」「<Link href="/blog/random-goods-management">ランダムグッズの管理方法</Link>」もどうぞ。
      </p>

      <H2 id="entry" num={5}>
        入場・ライブビューイングで気をつけること
      </H2>
      <h3>現地参戦（星街すいせいさんのツアーの例）</h3>
      <ul>
        <li>チケットはすべてスマホの電子チケット。同行者の分は、同行者のスマホに分配しておく必要があります。</li>
        <li>入場時に本人確認をすることがあります。チケットの紛失・忘れは、どんな理由でも入場できません。</li>
        <li>開場後の再入場はできません。物販で買ったものは入場前に整理しておきましょう。</li>
        <li>公演中の撮影・録音・録画は禁止です。</li>
      </ul>
      <h3>ライブビューイング（映画館）</h3>
      <ul>
        <li>福岡公演のライブビューイングは全席指定5,000円（税込）。来場者特典はA3ポスター（上映館で当日のみ配布）。</li>
        <li>スクリーンの撮影・録音は禁止。ペンライトや強い光を出すものは、映画館ごとにルールがあります。</li>
        <li>大阪府の映画館では、19時以降に終わる上映は16歳未満の人は保護者の同伴が必要です。</li>
        <li>通信の都合で映像や音が乱れることや、災害時に中断されることがあります。</li>
      </ul>

      <H2 id="check" num={6}>
        Vtuberの現地参戦チェックリスト
      </H2>
      <Checklist
        title="チケットが取れたら"
        icon="🎫"
        items={[
          { must: true, text: "物販の案内ページを確認（事前オーダーの締切・会場受け取りの時間）" },
          { must: true, text: "同行者に電子チケットを分配" },
          { text: "グッズアプリをインストールして、購入リストを作る" },
          { text: "遠征なら、会場のアクセスと帰りの手段を調べる", why: "会場ガイドは下のリンクから" },
        ]}
      />
      <Checklist
        title="当日の持ち物"
        icon="🌟"
        items={[
          { must: true, text: "電子チケットが入ったスマホと、本人確認書類" },
          { must: true, text: "モバイルバッテリー", why: "チケット・決済・受け取りのQRコードがすべてスマホ" },
          { text: "受け取り用のQRコード（スクショではなく、アプリで表示できるか確認）" },
          { text: "現金とキャッシュレスの両方", why: "会場によって使えるものが違う" },
          { text: "大きめのエコバッグ", why: "再入場できない公演では、買ったものを持ったまま入場する" },
          { text: "ペンライト（公演のルールを確認してから）" },
        ]}
      />
      <p>
        遠征全体の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」、会場ごとの攻略は「
        <Link href="/blog/k-arena-yokohama-guide">Kアリーナ横浜</Link>」「
        <Link href="/blog/osaka-jo-hall-guide">大阪城ホール</Link>」「
        <Link href="/blog/marine-messe-fukuoka-guide">マリンメッセ福岡</Link>」のガイドにまとめています。
      </p>

      <OfficialLinks
        items={[
          { href: "https://hoshimachi-suisei-fc.jp/s/hs/page/arena_tour_2026", title: "HOSHIMACHI SUISEI ARENA TOUR 2026（公式FC）", icon: "🌟" },
          { href: "https://liveviewing.jp/hoshimachi-suisei-2026/", title: "福岡公演 ライブビューイング", icon: "🎬" },
          { href: "https://www.nijisanji.jp/news/tyibyhe2j", title: "にじさんじ Girls Idol Festival（公式ニュース）", icon: "🌈" },
        ]}
      />

      <Sources
        items={[
          { href: "https://hoshimachi-suisei-fc.jp/s/hs/page/arena_tour_2026", label: "星街すいせい公式ファンクラブ「HOSHIMACHI SUISEI ARENA TOUR 2026 Once Upon a Stellar」（入場・グッズ・FCブース）" },
          { href: "https://liveviewing.jp/hoshimachi-suisei-2026/", label: "ライブ・ビューイング・ジャパン「HOSHIMACHI SUISEI ARENA TOUR 2026 LIVE VIEWING」" },
          { href: "https://x.com/ST_STELLAR_info/status/2112511929562661005", label: "Studio STELLAR 公式X（神戸公演の会場受け取り・当日購入・オンラインガチャの告知）" },
          { href: "https://www.animatetimes.com/news/details.php?id=1774251077", label: "アニメイトタイムズ「星街すいせい 4都市アリーナツアー開催決定」" },
          { href: "https://www.nijisanji.jp/news/tyibyhe2j", label: "にじさんじ公式「にじさんじ Girls Idol Festival」公演の詳細情報" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（比較に使った物販の仕組み）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
