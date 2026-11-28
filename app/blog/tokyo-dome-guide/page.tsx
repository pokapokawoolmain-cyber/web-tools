import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  FanVoices,
  Figure,
  H2,
  MochicoNudge,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Stats,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("tokyo-dome-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "東京ドーム コインロッカー",
  "東京ドーム ゲート",
  "東京ドーム 帰り 混雑",
  "東京ドーム アクセス 最寄り駅",
  "東京ドーム 持ち込み",
  "東京ドーム 天井席 双眼鏡",
  "東京ドーム コンサート 12月",
]);

const TOC: TocItem[] = [
  { id: "dec", label: "12月〜1月の東京ドームのライブとグッズリスト" },
  { id: "access", label: "4つの駅と、ゲートの探し方" },
  { id: "gate", label: "ゲート番号と座席エリアの傾向" },
  { id: "locker", label: "コインロッカー：空き状況はスマホで見られる" },
  { id: "rules", label: "場内は完全キャッシュレス・持ち込み禁止のもの" },
  { id: "exit", label: "帰り：最寄り駅を避けると早い" },
];

/** 自作の図：駅とドームの位置関係（簡略図・上が北） */
function StationRing() {
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="td-title td-desc">
      <title id="td-title">東京ドームのまわりの4つの駅（簡略図・上が北）</title>
      <desc id="td-desc">
        ドームの北側に東京メトロ後楽園駅と都営春日駅、南側にJR水道橋駅（西口・東口）と都営三田線の水道橋駅がある。後楽園駅から25ゲートは近く、JR水道橋西口からは後楽橋を渡って22ゲートへ向かう。
      </desc>
      <rect x="0" y="0" width="360" height="330" fill="#fbf9ff" />
      <text x="346" y="20" fontSize="11" fill="#625b7c" fontWeight="800" textAnchor="end">
        ↑ 北
      </text>
      <rect x="8" y="10" width="160" height="56" rx="12" fill="#efe9ff" />
      <text x="88" y="32" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        春日駅（都営）
      </text>
      <text x="88" y="52" fontSize="10.5" fill="#5a2fd2" fontWeight="700" textAnchor="middle">
        大江戸線・三田線
      </text>
      <rect x="190" y="30" width="160" height="56" rx="12" fill="#dcf7ec" />
      <text x="270" y="52" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        後楽園駅（メトロ）
      </text>
      <text x="270" y="72" fontSize="10.5" fill="#047857" fontWeight="700" textAnchor="middle">
        丸ノ内線・南北線
      </text>
      <ellipse cx="180" cy="176" rx="104" ry="70" fill="#1b1430" />
      <ellipse cx="180" cy="176" rx="84" ry="52" fill="#2d2550" />
      <text x="180" y="172" fontSize="15" fontWeight="900" fill="#fff" textAnchor="middle">
        東京ドーム
      </text>
      <text x="180" y="192" fontSize="10.5" fill="#d6d0ee" textAnchor="middle">
        文京区後楽1-3-61
      </text>
      <rect x="252" y="100" width="56" height="24" rx="8" fill="#047857" />
      <text x="280" y="117" fontSize="11" fontWeight="900" fill="#fff" textAnchor="middle">
        25G
      </text>
      <rect x="152" y="236" width="56" height="24" rx="8" fill="#be185d" />
      <text x="180" y="253" fontSize="11" fontWeight="900" fill="#fff" textAnchor="middle">
        22G
      </text>
      <rect x="8" y="266" width="164" height="56" rx="12" fill="#ffe4f0" />
      <text x="90" y="288" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        JR水道橋駅
      </text>
      <text x="90" y="308" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        西口・東口（後楽橋を渡る）
      </text>
      <rect x="188" y="266" width="164" height="56" rx="12" fill="#fff6cc" />
      <text x="270" y="288" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        水道橋駅（都営三田線）
      </text>
      <text x="270" y="308" fontSize="10.5" fill="#8a5a00" fontWeight="700" textAnchor="middle">
        A2・A3出口
      </text>
    </svg>
  );
}

/** 自作の図：ゲート番号と座席エリアの傾向 */
function GateTiers() {
  const rows = [
    { g: "40番台", t: "2階スタンドの上段（いわゆる天井席）", n: "4階のコンコースから入る", fill: "#efe9ff", ink: "#5a2fd2" },
    { g: "20〜24", t: "1階スタンド", n: "20・21が1塁側、22が正面、23・24が3塁側", fill: "#ffe4f0", ink: "#be185d" },
    { g: "11・25", t: "アリーナ・外野側", n: "11は1塁側、25は3塁側。公演によっては1階席も", fill: "#dcf7ec", ink: "#047857" },
  ];
  return (
    <svg viewBox="0 0 360 236" role="img" aria-labelledby="tg-title tg-desc">
      <title id="tg-title">東京ドームのゲート番号と座席エリアの傾向</title>
      <desc id="tg-desc">40番台は2階スタンド上段、20から24は1階スタンド、11と25はアリーナや外野側につながることが多い。公演によって違う。</desc>
      {rows.map((r, i) => (
        <g key={r.g}>
          <rect x="8" y={8 + i * 76} width="344" height="66" rx="16" fill={r.fill} />
          <text x="22" y={46 + i * 76} fontSize="20" fontWeight="900" fill={r.ink}>
            {r.g}
          </text>
          <text x="104" y={34 + i * 76} fontSize="13" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <text x="104" y={54 + i * 76} fontSize="10.5" fill="#3e3756">
            {r.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

const DEC = [
  { date: "12/1(火)・12/2(水)", name: "ENHYPEN「BLOOD SAGA」", href: "/blog/enhypen-blood-saga-tokyo-dome-goods", list: LIVE_LISTS.enhypen.listUrl },
  { date: "12/5(土)・12/6(日)", name: "YOASOBI「超惑星」", href: "/blog/yoasobi-superplanet-tokyo-dome-goods", list: LIVE_LISTS.yoasobi.listUrl },
  { date: "12/9(水)・12/10(木)", name: "Number_i「LIVE TOUR No.Ⅲ」", href: "/blog/number-i-no3-tour-goods", list: LIVE_LISTS.numberi.listUrl },
  { date: "12/13(日)〜12/15(火)", name: "BIGBANG「XX : COSMOS」", href: "/blog/bigbang-xx-cosmos-japan-goods", list: LIVE_LISTS.bigbang.listUrl },
  { date: "12/29(火)・12/30(水)・1/1(金・祝)", name: "Hey! Say! JUMP「Juliet」", href: "/blog/hey-say-jump-juliet-fukuoka-goods", list: LIVE_LISTS.jump.listUrl },
  { date: "2027/1/7(木)・1/8(金)", name: "TXT「STEAL THE WIND」", href: "/blog/txt-steal-the-wind-fukuoka-goods", list: LIVE_LISTS.txt.listUrl },
];

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>東京ドーム</mark>完全ガイド：ゲート・ロッカー・帰りの混雑・持ち込み
        </>
      }
      heroLead="4つの駅、40近くのゲート、場内は完全キャッシュレス。日本でいちばん有名なライブ会場は、知っていると当日がぐっと楽になるポイントが多い場所です。公式の案内とファンの体験談をもとに、図つきでまとめました。"
      stickers={["🏟️ 会場ガイド", "🚪 ゲートの傾向", "🔐 ロッカー", "🚶 帰りの混雑"]}
      unofficialNote="この記事は、東京ドームシティの公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ゲートと座席の関係は公演ごとに違うので、必ずチケットに書かれたゲートを確認してください（2026年11月28日時点）。"
    >
      <p>
        水道橋・後楽園にある<strong>東京ドーム</strong>は、約5万5000人が入る日本初の全天候型ドーム。12月も、ENHYPEN・YOASOBI・Number_i・BIGBANG と大きなライブが続きます。
      </p>
      <p>
        広い会場なので、<span className={s.hl}>「降りる駅」と「入るゲート」の組み合わせ</span>を間違えると、ドームの外周を半周歩くことに。ロッカーや場内のルールも独特なので、出かける前に押さえておきましょう。
      </p>

      <Tldr
        items={[
          <>駅は JR水道橋・メトロ後楽園・都営水道橋・都営春日の4つ。チケットのゲート番号から降りる駅を決める</>,
          <>場内は完全キャッシュレス（現金不可）。喫煙は再入場の手続きをして場外の喫煙所で</>,
          <>帰りは最寄り駅が大混雑。公式も「周辺の駅」の利用をお願いしている。春日駅は比較的空いているという声</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="dec" num={1}>
        12月〜1月の東京ドームのライブとグッズリスト
      </H2>
      <div className={s.tableWrap} role="region" aria-label="12月の東京ドームのライブ" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">ライブ</th>
              <th scope="col">グッズリスト</th>
            </tr>
          </thead>
          <tbody>
            {DEC.map((d) => (
              <tr key={d.name}>
                <th scope="row">{d.date}</th>
                <td>
                  <Link href={d.href}>{d.name} のグッズガイド</Link>
                </td>
                <td>{d.list ? <a href={d.list} rel="nofollow">Mochicoで開く</a> : "準備中"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>グッズリストは ToolBoxJP のアプリ「Mochico」で公開している非公式のまとめです。ログインしなくても見られます。</p>

      <H2 id="access" num={2}>
        4つの駅と、ゲートの探し方
      </H2>
      <Figure caption="編集部作成の簡略図。位置関係は実際の縮尺ではありません。正確なルートは東京ドームシティ公式のアクセスページで確認してください。">
        <StationRing />
      </Figure>
      <ul>
        <li>
          <strong>JR水道橋駅（西口）：</strong>後楽橋（歩道橋）を渡ってまっすぐ進むと 22ゲート。東口からは青い階段を上がって進みます。
        </li>
        <li>
          <strong>東京メトロ後楽園駅：</strong>歩道橋を渡って右に曲がるとすぐ 25ゲート（ファンのブログでは2番出口から約100m・徒歩2〜3分）。
        </li>
        <li>
          <strong>都営三田線 水道橋駅：</strong>A2出口からのルートが公式で案内されています。
        </li>
        <li>
          <strong>都営 春日駅：</strong>6番出口から後楽園駅の2番出口方面に進み、陸橋を渡ると25ゲート、左に進むと11ゲート（ファンのブログより）。
        </li>
      </ul>
      <Stats
        items={[
          { num: <>約5.5万<small>人</small></>, label: "最大収容（ファンのブログより）" },
          { num: <>4<small>駅</small></>, label: "JR・メトロ・都営2駅" },
          { num: <>2〜3<small>分</small></>, label: "後楽園駅2番出口→25ゲート" },
          { num: <>0<small>円</small></>, label: "場内で使える現金（完全キャッシュレス）" },
        ]}
      />

      <H2 id="gate" num={3}>
        ゲート番号と座席エリアの傾向
      </H2>
      <Figure caption="編集部作成。ファンのブログなどで紹介されている傾向をまとめたもので、公式の対応表ではありません。公演によって違います。">
        <GateTiers />
      </Figure>
      <FanVoices
        title="ゲートについての体験談（まとめ）"
        items={[
          { text: "22ゲートと40番台のゲートは入る階が違う。番号が近くても同じ場所から入れるとは限らない", from: "遠征ガイド記事より" },
          { text: "JR水道橋の西口から外周を左に進むと33ゲート、さらに進むと41ゲート", from: "ゲート解説ブログより" },
          { text: "ゲートを間違えると外周をぐるっと回ることになり、開演に間に合わなくなる人も", from: "遠征ガイド記事より" },
        ]}
      />
      <Card kind="point" label="双眼鏡の目安">
        <p>
          ドームは2階スタンドの上段（いわゆる天井席）だとステージまでかなり遠く、ファンのブログでは<strong>8〜10倍</strong>、表情まで見たいなら<strong>10〜12倍・防振つき</strong>がよくすすめられています。公演によっては撮影機能つきの双眼鏡が持ち込めないので注意。
        </p>
      </Card>

      <ArticleAd />

      <H2 id="locker" num={4}>
        コインロッカー：空き状況はスマホで見られる
      </H2>
      <p>
        東京ドームシティ公式は、ロッカーの案内として<strong>「ロッカーコンシェルジュ」で空き状況を確認できるページ</strong>を紹介しています。出発前と到着直前に一度見ておくと、空いている場所に直行できます。
      </p>
      <div className={s.tableWrap} role="region" aria-label="ドームシティの主なロッカー（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <caption>東京ドームシティの主なロッカー（大／中／小の数・2025年3月のファンの調べ）</caption>
          <thead>
            <tr>
              <th scope="col">場所</th>
              <th scope="col">大/中/小</th>
              <th scope="col">時間</th>
              <th scope="col">支払い</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Gallery AaMo（三田線A3出口側）</th>
              <td>34/99/158</td>
              <td>4:30〜25:00</td>
              <td>現金/IC・ICのみ</td>
            </tr>
            <tr>
              <th scope="row">ラクーア1F ワンダードロップ横</th>
              <td>10/39/32</td>
              <td>7:00〜23:00</td>
              <td>一部IC</td>
            </tr>
            <tr>
              <th scope="row">ジオポリス1F（トイレ前・GO-FUN側）</th>
              <td>8/39/38</td>
              <td>営業時間内など</td>
              <td>現金/IC</td>
            </tr>
            <tr>
              <th scope="row">トリックアート通路</th>
              <td>8/15/21</td>
              <td>8:00〜23:00</td>
              <td>IC</td>
            </tr>
            <tr>
              <th scope="row">後楽園ホールビル1F</th>
              <td>8/18/16</td>
              <td>9:00〜22:30</td>
              <td>現金/IC</td>
            </tr>
            <tr>
              <th scope="row">黄色いビル2F</th>
              <td>4/9/26</td>
              <td>9:00〜22:30</td>
              <td>現金/IC</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>
        出典：東京ドームへようこそ！「東京ドーム・東京ドームシティのコインロッカー」（2025年3月調べ）。料金の目安は大1,000円・中800円・小600円。<strong>ドーム内のロッカーは交通系ICのみ・イベント時間中のみ</strong>という報告もあります。最新の数や料金は現地で確認してください。
      </p>
      <FanVoices
        title="ロッカーについての体験談（まとめ）"
        items={[
          { text: "13〜16時は遠征組が集中して満杯になりやすい", from: "ロッカー解説ブログより" },
          { text: "後楽園駅のロッカーは数が少ない。JR水道橋駅には改札の内外に数か所ある", from: "ロッカー解説ブログより" },
          { text: "満杯のときは、スマホで予約できる荷物預かり（ecbo cloak・Bounce など）が便利", from: "ロッカー解説ブログより" },
        ]}
      />

      <H2 id="rules" num={5}>
        場内は完全キャッシュレス・持ち込み禁止のもの
      </H2>
      <ul>
        <li>
          <strong>場内は完全キャッシュレス。</strong>現金は使えません（東京ドームシティ公式「来場時のお願い」より）。
        </li>
        <li>
          <strong>場内は全面禁煙。</strong>喫煙は再入場の手続きをしてから場外の所定の喫煙所で。
        </li>
        <li>入場時に手荷物検査があります。自分の席の範囲を超える大きな荷物は持ち込めません。ベビーカーは入場ゲートで預かり。</li>
        <li>ビン・缶、凍らせたものや1,000mlを超えるペットボトル、アルコール類などは持ち込み禁止。主催者のルールで変わることもあります。</li>
      </ul>
      <Bubble>
        グッズの支払いは公演ごとにルールが違うけど、場内の売店はキャッシュレスだけ。交通系ICのチャージを忘れずに！
      </Bubble>

      <H2 id="exit" num={6}>
        帰り：最寄り駅を避けると早い
      </H2>
      <p>
        東京ドームシティ公式は、混雑をやわらげるために<strong>分散退場への協力と、最寄り駅ではなく周辺の駅を使うこと</strong>をお願いしています。
      </p>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "終演直後の混雑のピークは21:00〜21:30ごろ（夜公演の場合）", from: "ロッカー解説ブログより" },
          { text: "JR水道橋駅は混雑、メトロ後楽園駅は非常に混雑。都営の春日駅は比較的空いている", from: "ロッカー解説ブログより" },
          { text: "春日駅は後楽園駅と地下通路でつながっていて、乗り換えにも使いやすい", from: "ロッカー解説ブログより" },
        ]}
      />
      <MochicoNudge title="東京ドームで買ったグッズを、公演ごとに残すなら">
        <p>
          「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。12月の東京ドーム公演のグッズリストも公開中です。
        </p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.tokyo-dome.co.jp/dome/access/", title: "東京ドーム アクセス（公式）", icon: "🚃" },
          { href: "https://www.tokyo-dome.co.jp/dome/guide/caution-event", title: "イベント来場時のお願い（公式）", icon: "📋" },
          { href: "https://www.akilocker.biz/mobile/area.html?locationId=TOKYO_DOME", title: "ロッカーの空き状況（ロッカーコンシェルジュ）", icon: "🔐" },
          { href: "https://www.tokyo-dome.co.jp/faq/dome", title: "東京ドーム よくあるご質問（公式）", icon: "❓" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.tokyo-dome.co.jp/dome/access/", label: "東京ドームシティ「東京ドーム アクセス」（住所・駅・22/25ゲートへのルート）" },
          { href: "https://www.tokyo-dome.co.jp/dome/guide/caution-event", label: "東京ドームシティ「来場時のお願い（イベント）」（キャッシュレス・禁煙・持ち込み・分散退場）" },
          { href: "https://www.tokyo-dome.co.jp/dome/seat", label: "東京ドームシティ「座席」（1F席・2F席・バルコニー席、ロッカー案内）" },
          { href: "https://www.aoimahiroblog.tokyo/coin-locker-seek/", label: "東京ドームへようこそ！「東京ドーム・東京ドームシティのコインロッカー」（2025年3月調べ）" },
          { href: "https://wordtrace.hatenablog.jp/entry/tokyo-dome-locker-live", label: "言葉の痕跡「東京ドームライブ当日の荷物預け完全ガイド」（混雑時間・駅の傾向）" },
          { href: "https://guidebridge.jp/tokyo-dome-guide/", label: "guidebridge「東京ドーム ゲート迷子で開演に間に合わない」（22と40は階が違う）" },
          { href: "https://minute.jp/articles/4591", label: "minute「東京ドーム 完璧ガイド 入場ゲート別ルート」" },
          { href: "https://lignea.co.jp/tokyo-dome-seat/", label: "LIGNEA「東京ドームの座席ガイド」（ゲートと座席の傾向・見え方）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
