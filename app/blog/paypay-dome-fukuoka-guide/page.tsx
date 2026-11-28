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

const post = getBlogPost("paypay-dome-fukuoka-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "PayPayドーム アクセス",
  "PayPayドーム 帰り 混雑",
  "みずほPayPayドーム コンサート",
  "PayPayドーム 唐人町 徒歩",
  "PayPayドーム 臨時バス",
  "PayPayドーム 持ち込み",
  "PayPayドーム ライブ 寒い",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "行き：地下鉄＋徒歩か、直行の臨時バスか" },
  { id: "rules", label: "持ち込みのルール（飲み物は1Lまで1本）" },
  { id: "exit", label: "帰り：唐人町駅の規制とバスの行列を避ける" },
  { id: "cold", label: "海風と寒さの対策、周辺施設" },
  { id: "live", label: "Snow Man（12/4〜6）に行く人へ" },
];

/** 自作の図：博多・天神・唐人町からのルート（簡略図・上が北） */
function RouteMap() {
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="pp-title pp-desc">
      <title id="pp-title">みずほPayPayドーム福岡への行き方（簡略図・上が北）</title>
      <desc id="pp-desc">
        ドームは博多湾に面した地行浜にある。最寄りは地下鉄空港線の唐人町駅3番出口で徒歩約15分。イベント日は天神高速バスターミナルと博多バスターミナルから直行の臨時バスが出る。
      </desc>
      <rect x="0" y="0" width="360" height="300" fill="#fbfaf6" />
      <rect x="0" y="0" width="360" height="60" fill="#e0f0ff" />
      <text x="12" y="22" fontSize="11" fill="#1d5fae" fontWeight="700">
        博多湾（北側）
      </text>
      <text x="346" y="22" fontSize="11" fill="#625b7c" fontWeight="800" textAnchor="end">
        ↑ 北
      </text>
      <ellipse cx="96" cy="82" rx="78" ry="34" fill="#0b1626" />
      <text x="96" y="80" fontSize="12.5" fontWeight="900" fill="#fff" textAnchor="middle">
        PayPayドーム
      </text>
      <text x="96" y="97" fontSize="10" fill="#f5e6b8" textAnchor="middle">
        地行浜2-2-2
      </text>
      <rect x="196" y="58" width="152" height="44" rx="12" fill="#fbf5e4" />
      <text x="272" y="78" fontSize="11" fontWeight="800" fill="#6f5410" textAnchor="middle">
        ヒルトン福岡シーホーク
      </text>
      <text x="272" y="94" fontSize="10" fill="#3e3756" textAnchor="middle">
        ドームのとなり
      </text>
      <rect x="12" y="150" width="150" height="52" rx="12" fill="#dcf7ec" />
      <text x="87" y="171" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        唐人町駅 3番出口
      </text>
      <text x="87" y="190" fontSize="10.5" fontWeight="800" fill="#047857" textAnchor="middle">
        地下鉄空港線・徒歩約15分
      </text>
      <path d="M87 150 L 92 118" stroke="#047857" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="12" y="232" width="150" height="56" rx="12" fill="#fff6cc" />
      <text x="87" y="254" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        天神
      </text>
      <text x="87" y="273" fontSize="10.5" fontWeight="700" fill="#8a5a00" textAnchor="middle">
        地下鉄で約5分／臨時バス
      </text>
      <rect x="198" y="232" width="150" height="56" rx="12" fill="#ffe4f0" />
      <text x="273" y="254" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        博多駅
      </text>
      <text x="273" y="273" fontSize="10.5" fontWeight="700" fill="#be185d" textAnchor="middle">
        地下鉄で約11分／臨時バス
      </text>
      <rect x="198" y="150" width="150" height="52" rx="12" fill="#fff" stroke="#e6d39c" />
      <text x="273" y="171" fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        直行の臨時バス
      </text>
      <text x="273" y="190" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        イベント日・天神／博多から
      </text>
    </svg>
  );
}

export default function Page() {
  const sm = LIVE_LISTS.snowman;
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>みずほPayPayドーム福岡</mark>完全ガイド：行き方・帰りの混雑・海風対策
        </>
      }
      heroLead="唐人町駅から歩いて約15分、博多湾のそばで冬は海風が冷たい。帰りは駅に規制がかかることも。九州最大のドームで困らないために、公式の案内とファンの体験談を図つきでまとめました。"
      stickers={["🏟️ 会場ガイド", "🚌 臨時バス", "🌊 海風対策", "🚶 帰りの混雑"]}
      unofficialNote="この記事は、みずほPayPayドーム福岡の公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。臨時バスや規制はイベントごとに変わるので、主催者・西鉄の最新情報もあわせて確認してください（2026年11月28日時点）。"
    >
      <p>
        福岡市の地行浜にある<strong>みずほPayPayドーム福岡</strong>は、1993年に日本で初めての開閉式屋根のドームとして開業。12月は Snow Man のドームツアー（12/4〜6）が予定されています。
      </p>
      <p>
        駅から少し遠く、<span className={s.hl}>帰りは唐人町駅とバス停に人が集中</span>するのがこのドームの特徴。行き方と帰り方を先に決めておくと、終演後がぐっと楽になります。
      </p>

      <Tldr
        items={[
          <>最寄りは地下鉄空港線・唐人町駅（3番出口から徒歩約15分）。イベント日は天神・博多から直行の臨時バス</>,
          <>帰りは唐人町駅に改札規制がかかることも。終演後30分ずらす・西新方面へ歩く・ホテル泊が定番</>,
          <>飲食物の持ち込みは禁止だが、ペットボトルは1L以内を1人1本までOK</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>40,029<small>人</small></>, label: "公式の定員（野球基準・2026/11〜）" },
          { num: <>15<small>分</small></>, label: "唐人町駅3番出口から徒歩（公式）" },
          { num: <>660<small>m</small></>, label: "コンコース1周" },
          { num: <>約1,700<small>台</small></>, label: "駐車場（イベント日は混雑）" },
        ]}
      />
      <p>住所は福岡市中央区地行浜2-2-2。ドームのまわりには外周デッキ（1周800m）があり、商業施設の BOSS E・ZO FUKUOKA が併設されています。</p>

      <H2 id="access" num={2}>
        行き：地下鉄＋徒歩か、直行の臨時バスか
      </H2>
      <Figure caption="編集部作成の簡略図。位置関係・距離は実際の縮尺ではありません。臨時バスののりばはイベントごとに公式・西鉄の案内で確認してください。">
        <RouteMap />
      </Figure>
      <ul>
        <li>
          <strong>地下鉄：</strong>空港線の唐人町駅3番出口から徒歩約15分。コンサートの日（一部を除く）は臨時列車が出ます。博多から唐人町は約11分、天神からは約5分（ファンのブログより）。
        </li>
        <li>
          <strong>臨時バス：</strong>イベント日は西鉄の直行臨時バスが天神高速バスターミナル・博多バスターミナル（6・7番のりば）から出ます。北九州・筑豊・久留米からの臨時高速バスが出る日もあります。
        </li>
        <li>
          <strong>路線バス：</strong>「みずほPayPayドーム」「九州医療センター」のバス停が近くにあります。2026年7月から、土日祝の 10:00〜16:59 発の天神・博多方面行きは、約100m先の「福岡市発達教育センター前」から乗る形に変わっています。
        </li>
      </ul>
      <FanVoices
        title="行きについての体験談（まとめ）"
        items={[
          { text: "唐人町駅からの徒歩は実際に測ると約16分。混雑時は20〜25分かかることも", from: "アクセス解説ブログより" },
          { text: "博多バスターミナルから乗ると約23分、天神から約15分（バスの乗車時間）", from: "アクセス解説ブログより" },
          { text: "「九州医療センター」のバス停のほうが、降りてからの徒歩が短い", from: "アクセス解説ブログより" },
        ]}
      />

      <H2 id="rules" num={3}>
        持ち込みのルール（飲み物は1Lまで1本）
      </H2>
      <ul>
        <li>
          <strong>飲食物の持ち込みは禁止</strong>（ドーム・BOSS E・ZO で買ったものは OK）。
        </li>
        <li>
          ペットボトル・紙パックは<strong>1L以内を1人1本</strong>、水筒・タンブラーは2L以内なら持ち込めます（熱中症対策、安全確認のうえ）。
        </li>
        <li>ビン・缶、危険物は持ち込めません。手荷物検査があります。</li>
        <li>敷地内のコンセントは使えません（館内カウンター・USBを除く）。モバイルバッテリーは満タンにしておきましょう。</li>
        <li>主催者が決めたルールが優先されます。</li>
      </ul>

      <ArticleAd />

      <H2 id="exit" num={4}>
        帰り：唐人町駅の規制とバスの行列を避ける
      </H2>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "終演後は唐人町駅で改札の規制がかかり、電車を3〜4本見送った", from: "遠征ガイド記事より" },
          { text: "臨時バスの行列は長い。唐人町駅まで歩いたほうが早い場合もある", from: "会場ガイド記事より" },
          { text: "混雑のピークは終演直後〜30分ほど。急がないなら少し待ってから動くと楽", from: "帰り方の解説記事より" },
          { text: "西新駅方面（徒歩20〜25分）は唐人町より空いていることが多い", from: "遠征ガイド記事より" },
          { text: "タクシーは終演後つかまりにくい。となりのヒルトンの前で配車してもらえたという声も", from: "複数のガイド記事より（意見が分かれる）" },
        ]}
      />
      <Card kind="caution" label="飛行機で帰る人は要注意">
        <p>
          ファンのガイドでは、唐人町から福岡空港駅までは混雑時に25〜30分かかるとされています。夜公演のあとの最終便（羽田行きは21時台など）に間に合わせるのはかなりギリギリ。<strong>博多・天神に泊まる前提</strong>で考えておくと安心です。
        </p>
      </Card>

      <H2 id="cold" num={5}>
        海風と寒さの対策、周辺施設
      </H2>
      <ul>
        <li>ドームは博多湾のすぐそば。冬は海風が強く、外の物販列や帰りの行列は体感温度がかなり下がります。</li>
        <li>ドームの中は暖かいので、脱ぎ着しやすい服装がおすすめです。</li>
        <li>
          <strong>周辺：</strong>BOSS E・ZO FUKUOKA（ドームの外周デッキ）、ヒルトン福岡シーホーク（となり）、唐人町駅との間には MARK IS 福岡ももち。開演前の時間つぶしに便利です。
        </li>
        <li>公式の託児「キッズルームFAY」（3F・外周2GATE横）は開演2時間前〜終了まで。</li>
      </ul>
      <Bubble>12月の福岡は、昼は暖かくても夜の海風はキーンと冷えるよ。カイロと手袋は鞄に入れておこう！</Bubble>

      <H2 id="live" num={6}>
        Snow Man（12/4〜6）に行く人へ
      </H2>
      <ul>
        <li>物販は整理券制（MERCH MARKET Goods App）。区分1は 11/29(日) 23:59 まで、区分2は 11/30(月) 19:00 から。</li>
        <li>物販特設会場は 12/3(木) プレ販売 13:00〜20:00、12/4・5 は 10:00〜17:30、12/6 は 10:00〜16:30。</li>
        <li>オリジナルペンライトは会場の外の専用窓口で、当日のチケットを持つ人だけ（チケット1枚につき1本）。</li>
      </ul>
      <p>
        グッズの価格・予算計算・整理券のとり方は「<Link href="/blog/snowman-all-suite-fukuoka-goods">Snow Man「ALL SUITE」福岡公演のグッズと整理券ガイド</Link>」で、
        {sm.listUrl ? (
          <>
            グッズリストは <a href={sm.listUrl} rel="nofollow">Mochico</a> で公開しています。
          </>
        ) : (
          "グッズリストは Mochico で準備中です。"
        )}
      </p>
      <MochicoNudge title="遠征で買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.softbankhawks.co.jp/stadium/access.html", title: "アクセス（公式）", icon: "🚃" },
          { href: "https://www.softbankhawks.co.jp/stadium/guide/attendance_rule.html", title: "観戦・来場ルール（公式）", icon: "📋" },
          { href: "https://www.softbankhawks.co.jp/stadium/institution.html", title: "施設概要（公式）", icon: "🏟️" },
          { href: "https://www.nishitetsu.jp/bus/", title: "西鉄バス", icon: "🚌" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.softbankhawks.co.jp/stadium/access.html", label: "みずほPayPayドーム福岡「アクセス」（唐人町駅・臨時列車・臨時バス・バス停の変更）" },
          { href: "https://www.softbankhawks.co.jp/stadium/institution.html", label: "みずほPayPayドーム福岡「施設概要」（定員・構造・コンコース）" },
          { href: "https://www.softbankhawks.co.jp/stadium/guide/attendance_rule.html", label: "みずほPayPayドーム福岡「来場時のルール」（持ち込み・コンセント）" },
          { href: "https://www.softbankhawks.co.jp/stadium/shop.html", label: "みずほPayPayドーム福岡「ショップ・施設」（キッズルームFAY）" },
          { href: "https://yuruoshi-blog.com/paypaydome-access-guide/", label: "ちょひろのゆる推しブログ「みずほPayPayドーム福岡アクセスガイド」" },
          { href: "https://guidebridge.jp/fukuoka-paypay-dome-guide/", label: "guidebridge「PayPayドーム 帰り」（唐人町・西新・ヒルトン前タクシー・最終便）" },
          { href: "https://nerutokonavi.com/venue-guide/mizuho-paypay-dome-fukuoka/", label: "NERUTOKO「みずほPayPayドーム福岡完全ガイド」（帰り・海風・周辺施設）" },
          { href: "https://stay-holiday.com/livefukuoka/howtoreturn/", label: "stay-holiday「福岡ライブ終演後の帰り方まとめ」" },
          { href: "https://starto.jp/s/p/live/10578?artist=43", label: "STARTO ENTERTAINMENT「Snow Man DOME TOUR 2026-2027 ALL SUITE」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
