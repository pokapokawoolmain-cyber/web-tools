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

const post = getBlogPost("glion-arena-kobe-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "GLION ARENA KOBE アクセス",
  "ジーライオンアリーナ神戸 帰り",
  "ジーライオンアリーナ 座席 5階",
  "GLION ARENA KOBE ロッカー",
  "ジーライオンアリーナ シャトルバス",
  "ジーライオンアリーナ 新神戸 最終",
  "GLION ARENA KOBE キャッシュレス",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ（2025年開業の海辺のアリーナ）" },
  { id: "access", label: "行き：歩く・シャトル・ポートループ" },
  { id: "seat", label: "ゲートと座席：アリーナとスタンドは別の入口" },
  { id: "inside", label: "館内：完全キャッシュレス・ロッカー・飲食" },
  { id: "exit", label: "帰り：三宮行きシャトルと新神戸の最終" },
  { id: "live", label: "ミセス「SHADOWS」（12/2・3）に行く人へ" },
];

/** 自作の図：三宮からの3つの行き方 */
function AccessOptions() {
  const rows = [
    { t: "歩く", d: "阪神・阪急「神戸三宮」から約17〜18分、JR「三ノ宮」から約20分", time: "約20分", fill: "#e9f8f2", ink: "#0b6f54" },
    { t: "アリーナシャトル", d: "三宮駅前（神戸阪急前）E1のりば → 会場 直行", time: "約5分", fill: "#efe9ff", ink: "#5a2fd2" },
    { t: "ポートループ", d: "三宮駅前（神戸阪急前）E2のりば → アリーナ前", time: "約8分", fill: "#fff6cc", ink: "#8a5a00" },
    { t: "ポートライナー", d: "「ポートターミナル」駅から徒歩約13分", time: "＋徒歩", fill: "#e0f0ff", ink: "#1d5fae" },
  ];
  return (
    <svg viewBox="0 0 360 312" role="img" aria-labelledby="gl-title gl-desc">
      <title id="gl-title">三宮からGLION ARENA KOBEへの行き方</title>
      <desc id="gl-desc">
        徒歩なら神戸三宮駅から約17〜18分、JR三ノ宮駅から約20分。アリーナシャトルは三宮駅前E1のりばから約5分、ポートループはE2のりばから約8分。ポートライナーのポートターミナル駅から徒歩約13分。
      </desc>
      {rows.map((r, i) => (
        <g key={r.t}>
          <rect x="8" y={8 + i * 74} width="344" height="64" rx="14" fill={r.fill} />
          <text x="22" y={34 + i * 74} fontSize="14" fontWeight="900" fill={r.ink}>
            {r.t}
          </text>
          <text x="338" y={34 + i * 74} fontSize="13" fontWeight="900" fill={r.ink} textAnchor="end">
            {r.time}
          </text>
          <text x="22" y={56 + i * 74} fontSize="10.5" fill="#3e3756">
            {r.d}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 自作の図：入口と階の関係 */
function GateFloors() {
  return (
    <svg viewBox="0 0 360 250" role="img" aria-labelledby="gf-title gf-desc">
      <title id="gf-title">入口と座席の階の関係（簡略図）</title>
      <desc id="gf-desc">
        アリーナ席は1階西側のInfosys GATEから。スタンド席は2階北側のmicware GATEか2階南側のTOTTEI PARK GATEから入り、5階へは2階からエスカレーターで上がる。アリーナとスタンドは行き来できない。
      </desc>
      <rect x="8" y="10" width="344" height="58" rx="14" fill="#efe9ff" />
      <text x="22" y="34" fontSize="13" fontWeight="900" fill="#1b1430">
        5階スタンド（急な傾斜）
      </text>
      <text x="22" y="54" fontSize="10.5" fill="#3e3756">
        2階からエスカレーターで。約3,974席（5〜7階・固定席）
      </text>
      <rect x="8" y="80" width="344" height="58" rx="14" fill="#e9f8f2" />
      <text x="22" y="104" fontSize="13" fontWeight="900" fill="#1b1430">
        2階スタンド
      </text>
      <text x="22" y="124" fontSize="10.5" fill="#3e3756">
        入口：micware GATE（北）／TOTTEI PARK GATE（南）
      </text>
      <rect x="8" y="150" width="344" height="58" rx="14" fill="#fff6cc" />
      <text x="22" y="174" fontSize="13" fontWeight="900" fill="#1b1430">
        1階アリーナ（平らな仮設席）
      </text>
      <text x="22" y="194" fontSize="10.5" fill="#3e3756">
        入口：Infosys GATE（西）
      </text>
      <text x="12" y="236" fontSize="10.5" fontWeight="800" fill="#a3306f">
        ※ アリーナとスタンドは中で行き来できない（チケットの入口を確認）
      </text>
    </svg>
  );
}

export default function Page() {
  const mga = LIVE_LISTS.mga;
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>GLION ARENA KOBE</mark>完全ガイド：アクセス・座席・帰りのシャトル
        </>
      }
      heroLead="2025年に神戸の新港第2突堤に開業した、海に囲まれたアリーナ。駐車場なし・館内は現金不可・アリーナとスタンドは入口が別、と初めて行くと戸惑うポイントが多い会場です。公式の案内とファンの体験談をもとに、図つきでまとめました。"
      stickers={["🌊 会場ガイド", "🚌 シャトルバス", "🪑 5階は急傾斜", "💳 キャッシュレスのみ"]}
      unofficialNote="この記事は、TOTTEI（GLION ARENA KOBE）の公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。バスの時刻・増便はイベントごとに神姫バスの最新情報を確認してください（2026年11月28日時点）。"
    >
      <p>
        <strong>GLION ARENA KOBE（ジーライオンアリーナ神戸）</strong>は、2025年4月に開業した神戸のウォーターフロントのアリーナ。約1万人が入り、周りの「TOTTEI」というエリアと一体になっています。12月は Mrs. GREEN APPLE のファンクラブツアー「SHADOWS」（12/2・3）が予定されています。
      </p>
      <p>
        <span className={s.hl}>駐車場がなく、館内は現金が使えない</span>など、新しい会場ならではのルールがいくつかあります。先に押さえておけば当日も安心です。
      </p>

      <Tldr
        items={[
          <>三宮から歩いて約17〜20分。イベント時はアリーナシャトル（約5分）やポートループ（約8分）も</>,
          <>館内は現金不可・キャッシュレスのみ。駐車場・駐輪場はなし、送迎の停車も禁止</>,
          <>帰りのシャトルは三宮行きだけで、終演後1時間〜1時間半の運行。新神戸の最終新幹線は逆算して</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ（2025年開業の海辺のアリーナ）
      </H2>
      <Stats
        items={[
          { num: <>約1万<small>人</small></>, label: "最大収容（公式）" },
          { num: <>2025<small>年</small></>, label: "4月4日に開業" },
          { num: <>0<small>台</small></>, label: "会場の駐車場（なし）" },
          { num: <>0<small>円</small></>, label: "館内で使える現金（キャッシュレスのみ）" },
        ]}
      />
      <p>
        住所は神戸市中央区新港町2番1号（新港第2突堤）。2・4・5階には海を見渡せる展望デッキがあり、4階のスイートからはポートタワーを含む景色が見えるとされています。
      </p>

      <H2 id="access" num={2}>
        行き：歩く・シャトル・ポートループ
      </H2>
      <Figure caption="編集部作成。所要時間は公式アクセスページの目安です。バスの運行日・増便は神姫バスで確認してください。">
        <AccessOptions />
      </Figure>
      <ul>
        <li>
          <strong>アリーナシャトル：</strong>大人230円・小児120円（後払い・IC可）。行きは土日祝 8:00〜18:00 の運行で、イベント時は開演約3時間前〜30分前に増便されます。
        </li>
        <li>
          <strong>ポートループ：</strong>大人230円・小児120円（後払い・IC・クレジットのタッチ決済可）。新神戸からも乗り換えなしで約21分です。
        </li>
        <li>
          <strong>車：</strong>会場に駐車場はありません。近くの有料駐車場（神戸みなと温泉 蓮 約200台・徒歩約2分など）を使います。路上駐車や送迎の停車は禁止です。
        </li>
      </ul>

      <H2 id="seat" num={3}>
        ゲートと座席：アリーナとスタンドは別の入口
      </H2>
      <Figure caption="編集部作成の簡略図。ゲート名と席数はファン・メディアの記事（公式施設資料を引用とのこと）によります。公演ごとにチケットの入口を確認してください。">
        <GateFloors />
      </Figure>
      <FanVoices
        title="座席についての体験談（まとめ）"
        items={[
          { text: "5階は急な傾斜で「スナイパー席」と呼ばれることも。見下ろす形で全体がよく見える", from: "会場ガイド記事・SNSの声より" },
          { text: "2階スタンドは最大22列、5階は最大24列ほど", from: "座席解説記事より" },
          { text: "アリーナは平らな仮設席で、後方は前の人の頭で見えにくいことがある", from: "座席解説記事より" },
          { text: "双眼鏡の目安はアリーナで不要〜6倍、2階で4〜8倍、5階で6〜10倍", from: "座席解説記事の推定" },
        ]}
      />

      <ArticleAd />

      <H2 id="inside" num={4}>
        館内：完全キャッシュレス・ロッカー・飲食
      </H2>
      <ul>
        <li>
          <strong>現金は使えません。</strong>TOTTEI PAY、クレジットカード、電子マネー、QR決済のみ（公式FAQ）。
        </li>
        <li>
          <strong>飲食：</strong>常設の店舗と、アリーナのイベントのチケットを持つ人だけが使える FOOD STAND があります。飲食物の持ち込みは原則お断り（主催者ルールに準じる）。アリーナ1階の南側に屋外の自動販売機があります。
        </li>
        <li>
          <strong>ロッカー：</strong>公式FAQでは「館外にコインロッカーのご用意」があるとされています。ファンの記事では小100台・中8台・大8台で、<strong>大型は8台しかない</strong>という報告。キャリーケースは三宮駅周辺に預けてくるのが安心です。
        </li>
        <li>
          <strong>喫煙：</strong>館内は禁煙。屋外の喫煙所はイベントによって設置される場合があります。
        </li>
        <li>
          <strong>授乳室：</strong>館内に5か所（1階1、2階2、5階2）。多目的トイレは各階にあります。
        </li>
      </ul>
      <Bubble>現金しか持っていない人は要注意！ 交通系ICのチャージや、スマホ決済の残高を前日までに確認しておこう。</Bubble>

      <H2 id="exit" num={5}>
        帰り：三宮行きシャトルと新神戸の最終
      </H2>
      <ul>
        <li>
          公式によると、帰りのシャトルは<strong>三ノ宮駅行きだけ</strong>で、イベント終了から1時間〜1時間半の運行です。
        </li>
        <li>ポートループの帰りの乗り場は、行きの降り場とは別の「アリーナ前（三宮駅方向）」（徒歩約3分）。</li>
        <li>神戸駅からの臨時バスはありません。混雑時は待ち時間が出ます。</li>
      </ul>
      <FanVoices
        title="帰りについての体験談・調べ（まとめ）"
        items={[
          { text: "新神戸駅行きのポートループの最終は、平日20時台・土日祝21時台。平日の夜公演では終演前に最終が出てしまう", from: "遠征ガイド記事（2026年4月改正の時刻表より）" },
          { text: "三宮から新神戸は地下鉄で1駅（約2分）。シャトルで三宮へ出て乗り換えるのが現実的", from: "遠征ガイド記事より" },
          { text: "「終演時刻＝会場を出られる時刻」ではない。新幹線は余裕を持った便に", from: "会場ガイド記事より" },
        ]}
      />
      <Card kind="caution" label="新幹線で帰る人へ">
        <p>
          ガイド記事の調べ（2026年9月時点）では、新神戸発の東京方面の最終は21時台はじめ。18:00開演の平日公演だと、その日のうちに東京へ戻るのはかなり厳しいので、<strong>神戸・大阪に泊まる前提</strong>で考えるのがおすすめです。乗る便の時刻は必ず JR の公式で確認してください。
        </p>
      </Card>

      <H2 id="live" num={6}>
        ミセス「SHADOWS」（12/2・3）に行く人へ
      </H2>
      <ul>
        <li>開演は両日 18:00。全員「顔写真登録あり」のチケットでの入場です。</li>
        <li>神戸の街では 11/27〜12/6 に無料の『旅のしおり』を配布（三宮・元町・ハーバーランドなど8か所）。</li>
        <li>会場のお楽しみ「FLYING GHOST」は1回500円で、支払いはキャッシュレスのみ。</li>
      </ul>
      <p>
        グッズの価格・予算計算・会場のお楽しみは「<Link href="/blog/mrs-green-apple-shadows-kobe-goods">ミセス「SHADOWS」神戸公演のグッズと楽しみ方</Link>」で、
        {mga.listUrl ? (
          <>
            グッズリストは <a href={mga.listUrl} rel="nofollow">Mochico</a> で公開しています。
          </>
        ) : (
          "グッズリストは Mochico で準備中です。"
        )}
      </p>
      <MochicoNudge title="神戸で買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.totteikobe.jp/access", title: "アクセス（TOTTEI 公式）", icon: "🚃" },
          { href: "https://www.totteikobe.jp/faq", title: "よくあるご質問（TOTTEI 公式）", icon: "❓" },
          { href: "https://www.totteikobe.jp/map/arena/", title: "座席表・フロアマップ（公式）", icon: "🪑" },
          { href: "https://www.shinkibus.co.jp/bus/portloop/", title: "ポートループ（神姫バス）", icon: "🚌" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.totteikobe.jp/about_gilionarenakobe", label: "TOTTEI「GLION ARENA KOBE について」（開業日・収容・展望デッキ）" },
          { href: "https://www.totteikobe.jp/access", label: "TOTTEI「アクセス」（徒歩・アリーナシャトル・ポートループ・駐車場）" },
          { href: "https://www.totteikobe.jp/faq", label: "TOTTEI「よくあるご質問」（キャッシュレス・飲食・ロッカー・喫煙・授乳室）" },
          { href: "https://lignea.co.jp/glion-arena-kobe-seat/", label: "LIGNEA「GLION ARENA KOBE 座席の見え方」（ゲート・列数・ロッカー・双眼鏡）" },
          { href: "https://guidebridge.jp/glion-arena-kobe-guide/", label: "guidebridge「ジーライオンアリーナ神戸 完全攻略」（帰りのバス・新神戸の最終）" },
          { href: "https://ikizulivelog.hatenadiary.com/entry/glion-arena-kobe-guide", label: "イキヅライブログ！「GLION ARENA KOBE 会場攻略」" },
          { href: "https://kyodo-osaka.co.jp/search/detail/13432", label: "キョードーインフォメーション「Mrs. GREEN APPLE Ringo Jam Tour “SHADOWS”」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
