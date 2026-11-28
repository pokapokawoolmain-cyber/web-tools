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

const post = getBlogPost("kyocera-dome-osaka-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "京セラドーム コインロッカー",
  "京セラドーム 帰り 混雑",
  "京セラドーム アクセス",
  "京セラドーム ゲート",
  "京セラドーム 九条駅 歩く",
  "京セラドーム 持ち込み",
  "京セラドーム ライブ 12月",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "floor", label: "フロアの構成：ゲートは3階、上段席は5階" },
  { id: "locker", label: "ゲートの中にロッカーはない：預ける場所マップ" },
  { id: "rules", label: "持ち込みのルールと支払い" },
  { id: "exit", label: "帰り：4つの駅の使い分け" },
  { id: "live", label: "Number_i（12/2）に行く人へ" },
];

/** 自作の図：フロアの積み重なり */
function FloorStack() {
  const rows = [
    { f: "9F", t: "スカイホール", d: "（宴会場）", fill: "#f4f2f8" },
    { f: "6〜8F", t: "ビスタルーム", d: "（個室の観覧席）", fill: "#f4f2f8" },
    { f: "5F", t: "上段席", d: "通路51〜66番・売店が並ぶ", fill: "#eef2ff" },
    { f: "3F", t: "入場ゲート・下段席", d: "ゲート1〜14番・通路1〜36番", fill: "#dbe6ff", hot: true },
    { f: "2F", t: "スタジアムモール", d: "コインロッカー・飲食・北口インフォメーション", fill: "#fff6cc" },
    { f: "1F", t: "アリーナ・バス乗降場", d: "コンサートのアリーナ席はこの階", fill: "#dcf7ec" },
  ];
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="ky-title ky-desc">
      <title id="ky-title">京セラドーム大阪のフロア構成（簡略図）</title>
      <desc id="ky-desc">1階アリーナ、2階スタジアムモール（ロッカー・飲食）、3階入場ゲートと下段席、5階上段席、6〜8階ビスタルーム、9階スカイホール。入場ゲートは3階で、ゲートの内側にロッカーはない。</desc>
      {rows.map((r, i) => (
        <g key={r.f}>
          <rect x="8" y={8 + i * 52} width="344" height="46" rx="12" fill={r.fill} stroke={r.hot ? "#1e40af" : "none"} strokeWidth="2" />
          <text x="22" y={36 + i * 52} fontSize="14" fontWeight="900" fill="#1e40af">
            {r.f}
          </text>
          <text x="80" y={28 + i * 52} fontSize="12.5" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <text x="80" y={46 + i * 52} fontSize="10.5" fill="#3e3756">
            {r.d}
          </text>
        </g>
      ))}
      <text x="12" y="324" fontSize="10.5" fill="#be185d" fontWeight="800">
        ※ 3Fのゲートより内側にロッカーはない。2Fまでに預ける
      </text>
    </svg>
  );
}

/** 自作の図：ロッカーの数の分布（ファンの調べ） */
function LockerBars() {
  const rows = [
    { t: "ドームの内外（スタジアムモールなど）", n: 290 },
    { t: "阪神 ドーム前駅 改札階", n: 166 },
    { t: "地下鉄 ドーム前千代崎駅 改札横", n: 70 },
    { t: "JR 大正駅 改札内", n: 33 },
    { t: "イオンモール 2F 南デッキ入口横", n: 15 },
    { t: "スーパービバホーム 店内", n: 15 },
    { t: "地下鉄 大正駅 構内", n: 11 },
  ];
  const max = 290;
  return (
    <svg viewBox="0 0 360 290" role="img" aria-labelledby="kl-title kl-desc">
      <title id="kl-title">京セラドーム周辺のコインロッカーの数（ファンの調べ）</title>
      <desc id="kl-desc">ドームの内外に290、阪神ドーム前駅に166、ドーム前千代崎駅に70、JR大正駅に33、イオンモールとスーパービバホームに各15、地下鉄大正駅に11。</desc>
      {rows.map((r, i) => (
        <g key={r.t}>
          <text x="10" y={22 + i * 39} fontSize="11" fontWeight="800" fill="#1b1430">
            {r.t}
          </text>
          <rect x="10" y={28 + i * 39} width={(r.n / max) * 290} height="14" rx="5" fill={i === 0 ? "#1e40af" : "#93b4f5"} />
          <text x={16 + (r.n / max) * 290} y={40 + i * 39} fontSize="11" fontWeight="900" fill="#1e40af">
            {r.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Page() {
  const ni = LIVE_LISTS.numberi;
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>京セラドーム大阪</mark>完全ガイド：ロッカー・フロア・帰りの混雑
        </>
      }
      heroLead="入場ゲートは3階、その内側にロッカーはなし。帰りは駅の改札前で待つことも。関西のライブの聖地・京セラドーム大阪で困らないために、公式のフロアガイドとファンの体験談を図つきでまとめました。"
      stickers={["🏟️ 会場ガイド", "🔐 ロッカー地図", "🏢 フロア図", "🚶 帰りの4駅"]}
      unofficialNote="この記事は、京セラドーム大阪の公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ロッカーの数・料金はファンの調べで、変わっている場合があります（2026年11月28日時点）。"
    >
      <p>
        大阪・ドーム前にある<strong>京セラドーム大阪</strong>は、最大5万5000人が入る関西最大級のドーム。12月も Number_i（12/2）をはじめ、ライブが続きます。
      </p>
      <p>
        いちばんの注意点は、<span className={s.hl}>3階の入場ゲートより内側にコインロッカーがない</span>こと。荷物はゲートに入る前に預けるのが鉄則です。
      </p>

      <Tldr
        items={[
          <>入場ゲート（1〜14番）は3階。ロッカーは2階のスタジアムモールや周辺の駅にしかない</>,
          <>周辺のロッカーは約600個（ファンの調べ）。ほとんど現金のみ・100円玉が中心で、両替機がない場所が多い</>,
          <>帰りはドーム前千代崎・大正の改札が混む。九条駅（徒歩10〜15分）まで歩く手も</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>55,000<small>人</small></>, label: "最大収容人員（公式）" },
          { num: <>14<small>か所</small></>, label: "入場ゲート（3階・1〜14番）" },
          { num: <>約600<small>m</small></>, label: "コンコース1周" },
          { num: <>83<small>m</small></>, label: "高さ（地上9階・地下1階）" },
        ]}
      />
      <p>
        住所は大阪市西区千代崎3丁目中2番1号。1997年にオープンしました。最寄りは地下鉄長堀鶴見緑地線「ドーム前千代崎」、阪神なんば線「ドーム前」、JR・地下鉄「大正」の3駅です。車の場合、イベント日のドーム駐車場は3,000円ですが、公式は周辺道路が混むので公共交通機関を使うよう案内しています。
      </p>

      <H2 id="floor" num={2}>
        フロアの構成：ゲートは3階、上段席は5階
      </H2>
      <Figure caption="編集部作成の簡略図（京セラドーム大阪公式のフロアガイドをもとに作成）。コンサートでの使い方は公演によって変わります。">
        <FloorStack />
      </Figure>
      <ul>
        <li>3階が入場ゲートと下段席。通路の番号は1〜36番です。</li>
        <li>5階が上段席（通路51〜66番）。売店も5階に並んでいます。</li>
        <li>2階のスタジアムモールは、イベント開催時はイベントの時間に合わせて営業します。</li>
      </ul>

      <H2 id="locker" num={3}>
        ゲートの中にロッカーはない：預ける場所マップ
      </H2>
      <Figure caption="編集部作成。数はファンのブログ（京セラドーム大阪イベントナビ、2026年2月）の調べによります。公式の発表ではありません。">
        <LockerBars />
      </Figure>
      <FanVoices
        title="ロッカーについての体験談（まとめ）"
        items={[
          { text: "ロッカーは現金のみで、とくに100円玉。両替機がない場所がほとんど", from: "ロッカー解説ブログより" },
          { text: "開演の4時間以上前なら余裕。2〜3時間前から埋まりはじめ、1時間前はほぼ満室のことも", from: "ロッカー解説ブログより" },
          { text: "阪神ドーム前駅は激戦区。JR大正駅は利用者がばらけている", from: "ロッカー解説ブログより" },
          { text: "スタジアムモールで、イベントによっては1件1,000円の手荷物預かりがある（予定数に達したら終了）", from: "ロッカー解説ブログより" },
          { text: "アリーナ席は想像以上にせまい。大きな荷物は預けてから入るのが正解", from: "ロッカー解説ブログより" },
        ]}
      />
      <Card kind="caution" label="イオンモールのロッカーは閉店に注意">
        <p>イオンモール大阪ドームシティのロッカーは、専門店街の営業時間を過ぎると取り出せない場所があります。終演が遅い公演では、駅のロッカーのほうが安心です。</p>
      </Card>

      <ArticleAd />

      <H2 id="rules" num={4}>
        持ち込みのルールと支払い
      </H2>
      <ul>
        <li>ドーム内への<strong>飲食物の持ち込みは原則お断り</strong>。手荷物検査があります。</li>
        <li>ビン・缶、凍らせたものや1,000mlを超えるペットボトル、クーラーボックス、ペットなどは持ち込めません。</li>
        <li>
          場内の売店はキャッシュレスに対応（クレジット・交通系IC・WAON・iD・QUICPay・各種コード決済）。<strong>PiTaPa は使えません</strong>。
        </li>
        <li>ドーム内は原則禁煙。イベントによってはゲートの外に喫煙所が設けられます。</li>
      </ul>

      <H2 id="exit" num={5}>
        帰り：4つの駅の使い分け
      </H2>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "ドーム前千代崎駅は改札がせまく、終演後は15分待ちも", from: "帰り方の解説ブログより" },
          { text: "ドーム前千代崎駅やJR大正駅の前で、改札を通るまで40〜60分待たされることも珍しくない", from: "帰り方の解説ブログより" },
          { text: "九条駅（中央線・阪神なんば線）は徒歩10〜15分かかるが、混雑がゆるやか。規制退場の日は歩いたほうが早いことも", from: "帰り方の解説ブログより" },
          { text: "北側の出口から九条方面へ歩くと流れがスムーズ", from: "帰り方の解説ブログより" },
        ]}
      />
      <Bubble>新幹線で帰る人は、終演から新大阪の発車まで1時間半以上あけておくと安心。急ぐなら九条まで歩くのが定番だよ。</Bubble>

      <H2 id="live" num={6}>
        Number_i（12/2）に行く人へ
      </H2>
      <ul>
        <li>グッズの会場販売は 12/2(水) 11:00〜18:30。整理券・予約・チケットは不要です。</li>
        <li>1会計につき各4点まで。現金とキャッシュレスの併用はできません。</li>
      </ul>
      <p>
        グッズの価格・予算計算・ペンライトの座席登録は「<Link href="/blog/number-i-no3-tour-goods">Number_i「LIVE TOUR No.Ⅲ」グッズガイド</Link>」で、
        {ni.listUrl ? (
          <>
            グッズリストは <a href={ni.listUrl} rel="nofollow">Mochico</a> で公開しています。
          </>
        ) : (
          "グッズリストは Mochico で準備中です。"
        )}
      </p>
      <h3>ほかの12月前後のライブ</h3>
      <ul>
        <li>
          <strong>BIGBANG「XX : COSMOS」11/27〜29</strong>：大阪限定グッズやフード＆ドリンクも。「<Link href="/blog/bigbang-xx-cosmos-japan-goods">BIGBANG「XX : COSMOS」グッズ完全ガイド</Link>」
        </li>
        <li>
          <strong>Hey! Say! JUMP「Juliet」2027/1/10〜12</strong>：「<Link href="/blog/hey-say-jump-juliet-fukuoka-goods">Hey! Say! JUMP「Juliet」グッズガイド</Link>」
        </li>
        <li>
          <strong>TXT「STEAL THE WIND」2027/1/30・31</strong>：「<Link href="/blog/txt-steal-the-wind-fukuoka-goods">TXT「STEAL THE WIND」グッズガイド</Link>」
        </li>
        <li>
          <strong>LE SSERAFIM「PUREFLOW」12/19・20</strong>：グループ初の京セラドーム公演。「<Link href="/blog/le-sserafim-pureflow-kyocera-goods">LE SSERAFIM「PUREFLOW」グッズガイド</Link>」
        </li>
      </ul>
      <MochicoNudge title="ドームで買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.kyoceradome-osaka.jp/access/", title: "アクセス（公式）", icon: "🚃" },
          { href: "https://www.kyoceradome-osaka.jp/floor_guide/f3/", title: "フロアガイド 3F（ゲート・持ち込み）", icon: "🏢" },
          { href: "https://www.kyoceradome-osaka.jp/floor_guide/f2/", title: "フロアガイド 2F（ロッカー・飲食）", icon: "🔐" },
          { href: "https://www.kyoceradome-osaka.jp/facility/", title: "施設概要（公式）", icon: "🏟️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.kyoceradome-osaka.jp/facility/", label: "京セラドーム大阪「施設概要」（住所・収容人員・構造）" },
          { href: "https://www.kyoceradome-osaka.jp/access/", label: "京セラドーム大阪「アクセス」（駐車場・公共交通機関の案内）" },
          { href: "https://www.kyoceradome-osaka.jp/floor_guide/f3/", label: "京セラドーム大阪「フロアガイド 3F」（入場ゲート・禁煙・持ち込み・キャッシュレス）" },
          { href: "https://www.kyoceradome-osaka.jp/floor_guide/f5/", label: "京セラドーム大阪「フロアガイド 5F」（上段席・売店）" },
          { href: "https://www.kyoceradome-osaka.jp/floor_guide/f2/", label: "京セラドーム大阪「フロアガイド 2F」（スタジアムモール・ロッカー）" },
          { href: "https://www.evenavi-osaka.com/we-will-thoroughly-explain-the-coin-locker-situation/", label: "京セラドーム大阪イベントナビ「コインロッカーを徹底解説」（2026年2月）" },
          { href: "https://oshikatsu-trip.com/kyocera-dome-lockers/", label: "推し活Trip「京セラドーム大阪のコインロッカー完全攻略」" },
          { href: "https://wordtrace.hatenablog.jp/entry/kyocera-dome-live-konzatsu-kaisyo", label: "言葉の痕跡「京セラドーム大阪ライブ後の混雑回避術」" },
          { href: "https://guidebridge.jp/kyocera-dome-guide/", label: "guidebridge「京セラドーム 帰り」（ゲート別の駅選び）" },
          { href: "https://tobe-store.jp/blogs/information/108", label: "TOBE OFFICIAL STORE「Number_i LIVE TOUR No.Ⅲ 会場販売のご案内」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
