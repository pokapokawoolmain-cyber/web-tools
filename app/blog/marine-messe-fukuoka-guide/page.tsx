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

const post = getBlogPost("marine-messe-fukuoka-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "マリンメッセ福岡",
  "マリンメッセ福岡 アクセス",
  "マリンメッセ福岡 帰り",
  "マリンメッセ福岡 バス",
  "マリンメッセ福岡 座席 見え方",
  "マリンメッセ福岡 ロッカー",
  "マリンメッセ福岡 駐車場",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ（A館・B館に注意）" },
  { id: "access", label: "行き：駅から遠い会場。バスか歩きか" },
  { id: "exit", label: "帰り：バス待ちを避ける3つの方法" },
  { id: "seat", label: "座席：アリーナ・スタンド・立見の見え方" },
  { id: "inside", label: "館内：ロッカー・自販機・Wi-Fi・飲食" },
  { id: "parking", label: "車で行く人へ：駐車場3か所の違い" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
  { id: "links", label: "公式情報へのリンク" },
];

/** 自作の図：博多・天神からのルート（簡略図） */
function RouteMap() {
  return (
    <svg viewBox="0 0 360 320" role="img" aria-labelledby="mm-title mm-desc">
      <title id="mm-title">マリンメッセ福岡A館への行き方（簡略図・上が北）</title>
      <desc id="mm-desc">
        会場は博多湾に面した沖浜町にあり、最寄りの地下鉄駅は呉服町駅（徒歩15分）と中洲川端駅（徒歩18分）。博多駅の西日本シティ銀行前Fのりばと、天神ソラリアステージ前2Aのりばから西鉄バスで「マリンメッセ前」へ。博多駅から歩くと30分前後。
      </desc>
      <rect x="0" y="0" width="360" height="320" fill="#fbf9ff" />
      <rect x="0" y="0" width="360" height="64" fill="#e0f0ff" />
      <text x="14" y="24" fontSize="11" fill="#1d5fae" fontWeight="700">
        博多湾（北側）
      </text>
      <text x="346" y="24" fontSize="11" fill="#625b7c" fontWeight="800" textAnchor="end">
        ↑ 北
      </text>
      <rect x="196" y="40" width="150" height="50" rx="14" fill="#7c4dff" />
      <text x="271" y="62" fontSize="13.5" fill="#fff" fontWeight="800" textAnchor="middle">
        マリンメッセ福岡A館
      </text>
      <text x="271" y="80" fontSize="10.5" fill="#efe9ff" textAnchor="middle">
        バス停「マリンメッセ前」
      </text>
      {/* 呉服町・中洲川端 */}
      <rect x="150" y="128" width="120" height="50" rx="12" fill="#dcf7ec" />
      <text x="210" y="148" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        呉服町駅（地下鉄）
      </text>
      <text x="210" y="167" fontSize="11" fontWeight="800" fill="#047857" textAnchor="middle">
        徒歩15分
      </text>
      <path d="M232 128 L 256 92" stroke="#047857" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="12" y="128" width="124" height="50" rx="12" fill="#dcf7ec" />
      <text x="74" y="148" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        中洲川端駅（地下鉄）
      </text>
      <text x="74" y="167" fontSize="11" fontWeight="800" fill="#047857" textAnchor="middle">
        徒歩18分
      </text>
      {/* 天神 */}
      <rect x="12" y="236" width="140" height="70" rx="12" fill="#fff6cc" />
      <text x="82" y="257" fontSize="12" fontWeight="800" fill="#1b1430" textAnchor="middle">
        天神
      </text>
      <text x="82" y="275" fontSize="10.5" fill="#8a5a00" fontWeight="700" textAnchor="middle">
        西鉄バス
      </text>
      <text x="82" y="292" fontSize="10.5" fill="#8a5a00" fontWeight="700" textAnchor="middle">
        ソラリアステージ前 2A
      </text>
      {/* 博多 */}
      <rect x="196" y="236" width="152" height="70" rx="12" fill="#ffe4f0" />
      <text x="272" y="257" fontSize="12" fontWeight="800" fill="#1b1430" textAnchor="middle">
        博多駅
      </text>
      <text x="272" y="275" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        西鉄バス 西日本シティ銀行前 F
      </text>
      <text x="272" y="292" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        歩くと30分前後
      </text>
      <path d="M336 236 L 336 92" stroke="#be185d" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
    </svg>
  );
}

/** 自作の図：同じ敷地にある3つの会場 */
function ThreeVenues() {
  const items = [
    { name: "マリンメッセ福岡 A館", cap: "最大 約15,000人", note: "アリーナツアーの会場はたいていここ", fill: "#efe9ff", stroke: "#7c4dff" },
    { name: "マリンメッセ福岡 B館", cap: "約6,000人", note: "A館とは別の建物。入口も別", fill: "#fff", stroke: "#ddd2ff" },
    { name: "福岡サンパレス", cap: "約3,000人", note: "ホテル＆ホール。近くにあり間違えやすい", fill: "#fff", stroke: "#ddd2ff" },
  ];
  return (
    <svg viewBox="0 0 360 214" role="img" aria-labelledby="mm3-title mm3-desc">
      <title id="mm3-title">近くにある3つの会場の違い</title>
      <desc id="mm3-desc">マリンメッセ福岡A館は最大約15,000人、B館は約6,000人、福岡サンパレスは約3,000人。建物と入口が違うので、チケットの会場名を確認する。</desc>
      {items.map((it, i) => (
        <g key={it.name}>
          <rect x="8" y={8 + i * 68} width="344" height="60" rx="14" fill={it.fill} stroke={it.stroke} strokeWidth={i === 0 ? 2.5 : 1.5} />
          <text x="22" y={32 + i * 68} fontSize="13" fontWeight="900" fill="#1b1430">
            {it.name}
          </text>
          <text x="338" y={32 + i * 68} fontSize="11.5" fontWeight="800" fill="#5a2fd2" textAnchor="end">
            {it.cap}
          </text>
          <text x="22" y={52 + i * 68} fontSize="11" fill="#3e3756">
            {it.note}
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
      heading={
        <>
          <mark>マリンメッセ福岡A館</mark>完全ガイド：バス・帰りの混雑・座席・駐車場
        </>
      }
      heroLead="駅から歩いて15分以上、帰りはバス停に長い列。博多湾に面したマリンメッセ福岡は、行き方と帰り方を先に決めておくのがいちばんの攻略法です。公式の案内とファンの体験談をもとに、図つきでまとめました。"
      stickers={["🌊 会場ガイド", "🚌 バスと徒歩", "🚶 帰りの混雑", "🅿️ 駐車場"]}
      unofficialNote="この記事は、マリンメッセ福岡の公式サイトと、ファンのブログ・Q&Aなどの体験談をもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営者とは関係ありません。図はすべて編集部が作った簡略図です。バスの運行や動線は公演ごとに変わるので、主催者・西鉄バスの最新情報もあわせて確認してください（2026年11月8日時点の情報）。"
    >
      <p>
        博多湾に面した<strong>マリンメッセ福岡A館</strong>は、九州でいちばん大きなアリーナ級の会場のひとつ。2026年秋も、Mr.Children（11/7・8）、星街すいせいさんのアリーナツアーの最終公演（11/12）、米津玄師さんの「GHOST」ツアー（11/27・28）と、大きなライブが続きます。
      </p>
      <p>
        ただ、<span className={s.hl}>駅から遠く、帰りはバス停が大行列</span>になりやすいのがこの会場。「歩くか、バスか、タクシーか」を先に決めておくだけで、終演後の疲れ方がまったく違います。
      </p>

      <Tldr
        items={[
          <>最寄りは地下鉄の呉服町駅（徒歩15分）。博多駅・天神からは西鉄バスで「マリンメッセ前」へ</>,
          <>帰りのバスは長い列になりやすい。博多駅まで歩く（30分前後）か、時間をずらすのが定番</>,
          <>同じ敷地にB館・福岡サンパレスもある。チケットの会場名を必ず確認</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ（A館・B館に注意）
      </H2>
      <Stats
        items={[
          { num: <>15,000<small>人</small></>, label: "A館の最大収容（体験談・ガイドの目安）" },
          { num: <>15<small>分</small></>, label: "最寄り・呉服町駅から徒歩" },
          { num: <>3<small>か所</small></>, label: "施設の有料駐車場" },
          { num: <>無料</>, label: "全館でWi-Fiあり（公演により不可）" },
        ]}
      />
      <p>住所は福岡市博多区沖浜町7-1。まわりには、間違えやすい会場が2つあります。</p>
      <Figure caption="編集部作成。収容人数はガイド記事などでの目安です。">
        <ThreeVenues />
      </Figure>

      <H2 id="access" num={2}>
        行き：駅から遠い会場。バスか歩きか
      </H2>
      <Figure caption="編集部作成の簡略図。位置関係・距離は実際の縮尺ではありません。バスの時刻表は公式アクセスページのリンクから確認できます。">
        <RouteMap />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="主な行き方" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">出発地</th>
              <th scope="col">行き方</th>
              <th scope="col">メモ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">博多駅</th>
              <td>西鉄バス「博多駅西日本シティ銀行前 F」のりば → マリンメッセ前</td>
              <td>新幹線・空港からの人はこれが基本</td>
            </tr>
            <tr>
              <th scope="row">天神</th>
              <td>西鉄バス「天神ソラリアステージ前 2A」のりば → マリンメッセ前</td>
              <td>天神のホテルに泊まる人に</td>
            </tr>
            <tr>
              <th scope="row">福岡空港</th>
              <td>地下鉄で博多駅へ → 博多駅からバス</td>
              <td>公式の案内どおりの乗り継ぎ</td>
            </tr>
            <tr>
              <th scope="row">地下鉄</th>
              <td>呉服町駅から徒歩15分／中洲川端駅から徒歩18分</td>
              <td>バスが混んでいるときの選択肢</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：マリンメッセ福岡A館「交通アクセス」。大きなイベントの日は、西鉄バスの臨時バスが出ることがあります（公式アクセスページにリンクあり）。</p>

      <H2 id="exit" num={3}>
        帰り：バス待ちを避ける3つの方法
      </H2>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "終演後の「マリンメッセ前」バス停は長蛇の列。1時間以上待つこともあるという声", from: "遠征ブログより" },
          { text: "会場の横断幕に「徒歩でも博多駅までは意外と近い！歩いて帰ろう！」と書かれていた、という報告", from: "遠征ガイド記事より" },
          { text: "博多駅まで歩くと25〜35分ほど。人の流れが多い間はもう少しかかる", from: "複数のブログより" },
          { text: "隣の博多港国際ターミナル側のバス停は始発で、待ちが短かった", from: "遠征ガイド記事より" },
          { text: "タクシーは配車アプリで早めに呼ぶのが安心。ライブの日は台数を増やしているらしい、という声も", from: "Yahoo!知恵袋の回答より" },
        ]}
      />
      <ol>
        <li>
          <strong>歩く：</strong>博多駅まで30分前後、地下鉄の呉服町駅まで15分。荷物が少なく、歩きやすい靴ならいちばん確実です。
        </li>
        <li>
          <strong>時間をずらす：</strong>終演後15〜20分ほど待ってからバス停に向かうと、列が短くなっていることも。ただし博多方面の夜のバスは最終が早めなので、時刻表は先に確認を。
        </li>
        <li>
          <strong>タクシーを予約：</strong>グループなら割り勘で現実的。早めに配車アプリや電話で予約しておきましょう。
        </li>
      </ol>
      <Card kind="caution" label="九州・関西への日帰りは要注意">
        <p>
          遠征ガイドでは、熊本方面は終演が早ければ帰れる可能性がある一方、鹿児島・長崎・大分・宮崎や、関西より遠い人は<strong>博多泊が前提</strong>とされています。最終の新幹線・特急の時刻を、終演時刻＋1時間半くらいで逆算しておきましょう。
        </p>
      </Card>

      <H2 id="seat" num={4}>
        座席：アリーナ・スタンド・立見の見え方
      </H2>
      <p>
        A館は、床に並べる<strong>アリーナ席</strong>と、まわりを囲む<strong>スタンド席</strong>の作り。公式サイトにはコンサートとセンターステージの2種類の座席図が載っていますが、座席図や番号は公演によって変わります。立見は<strong>2階スタンドの後方</strong>です（アリーナのスタンディングとは別）。
      </p>
      <div className={s.tableWrap} role="region" aria-label="エリア別の見え方" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <caption>エリア別の見え方（体験談のまとめ）</caption>
          <thead>
            <tr>
              <th scope="col">エリア</th>
              <th scope="col">見え方の傾向</th>
              <th scope="col">双眼鏡</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">アリーナ前方</th>
              <td>出演者が近く、臨場感はいちばん</td>
              <td>なくてもOK</td>
            </tr>
            <tr>
              <th scope="row">アリーナ後方</th>
              <td>床が平らなので、前の人や機材で見えにくいことがある</td>
              <td>8倍前後</td>
            </tr>
            <tr>
              <th scope="row">1階スタンド前方</th>
              <td>ステージ全体と演出を見渡せて人気が高い</td>
              <td>6〜8倍</td>
            </tr>
            <tr>
              <th scope="row">スタンド後方・立見</th>
              <td>遠いがフォーメーションや照明は見やすい</td>
              <td>10倍前後</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>倍率はファンのブログの目安をまとめたものです。</p>

      <ArticleAd />

      <H2 id="inside" num={5}>
        館内：ロッカー・自販機・Wi-Fi・飲食
      </H2>
      <ul>
        <li>
          <strong>ロッカー：</strong>館内にあり、ファンのブログでは小型224個（200円）・大型24個（300円）と紹介されています。「開演1時間前でも半分以上空いていた」という声もある一方、大型は少ないので、キャリーケースは博多駅・天神やホテルに預けるのが安心です。
        </li>
        <li>
          <strong>自動販売機・レストラン：</strong>公式FAQでは、各階に自動販売機、2階にレストランがあります。
        </li>
        <li>
          <strong>Wi-Fi：</strong>全館で無料Wi-Fiが使えます（演出の都合で使えない公演もあります）。
        </li>
        <li>
          <strong>飲食：</strong>会場内で飲食できるかはイベントごとに違うので、主催者の案内を確認しましょう。
        </li>
        <li>
          <strong>車いす：</strong>施設内で使う車いすの貸し出しがあります（台数に限りがあり、主催者に相談）。
        </li>
      </ul>
      <Bubble>
        海沿いだから、冬は建物の外がとくに冷えるよ。バスや入場の待ち時間用に、上着とカイロを忘れずに！
      </Bubble>

      <H2 id="parking" num={6}>
        車で行く人へ：駐車場3か所の違い
      </H2>
      <div className={s.tableWrap} role="region" aria-label="駐車場の比較" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">駐車場</th>
              <th scope="col">台数</th>
              <th scope="col">料金</th>
              <th scope="col">メモ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">第1駐車場</th>
              <td>約700台</td>
              <td>20分100円・1日1,000円</td>
              <td>8:00〜22:00。22時〜翌8時は出庫できない</td>
            </tr>
            <tr>
              <th scope="row">第2駐車場</th>
              <td>328台</td>
              <td>1日1回600円（前払い・現金のみ）</td>
              <td>営業時間はイベントによって違う</td>
            </tr>
            <tr>
              <th scope="row">第3駐車場</th>
              <td>171台</td>
              <td>1日1回600円（前払い・現金のみ）</td>
              <td>営業時間はイベントによって違う</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：マリンメッセ福岡A館「駐車場」。身障者用の駐車スペースは第2・第3駐車場で、公演の2週間前〜2日前に予約できます。</p>
      <Card kind="caution" label="22時を過ぎると出られない">
        <p>第1駐車場は22:00〜翌8:00の出庫ができません。終演が遅い公演や、規制退場で出るのが遅くなりそうなときは注意しましょう。</p>
      </Card>

      <H2 id="goods" num={7}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <ul>
        <li>
          <strong>販売場所は外テント。</strong>11/27(金)は12:00から（整理券の時間帯 〜15:00）、11/28(土)は11:00から（〜13:00）。
        </li>
        <li>
          アプリ「米津玄師 STORE」の整理券は<strong>11/20(金) 20:00から</strong>配布されます。
        </li>
        <li>11/28は土曜で開場15:30・開演17:00と早めなので、物販と入場の時間が近くなります。</li>
      </ul>
      <p>
        グッズの価格と、これまでの公演の様子は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」に、星街すいせいさんの福岡公演に行く人は「
        <Link href="/blog/vtuber-live-goods-guide">Vtuberのライブ・受注グッズで後悔しないためのガイド</Link>
        」にまとめています。
      </p>

      <MochicoNudge title="遠征で買ったグッズを、公演ごとに残すなら">
        <p>
          「Mochico（モチコ）」は、ライブやイベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。予約の締切や販売開始の日時も登録しておけます。
        </p>
      </MochicoNudge>
      <p>
        遠征の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」も参考にしてください。
      </p>

      <H2 id="links" num={8}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: "https://www.marinemesse.or.jp/messe", title: "マリンメッセ福岡A館（アクセス・駐車場・座席図）", icon: "🌊" },
          { href: "https://www.marinemesse.or.jp/messe/faq", title: "よくあるご質問", icon: "❓" },
          { href: "https://www.marinemesse.or.jp/messe/facilities", title: "施設案内（トイレ・ロッカー・授乳室）", icon: "🗺️" },
          { href: "https://www.nishitetsu.jp/bus/", title: "西鉄バス（時刻表・臨時バス）", icon: "🚌" },
        ]}
      />

      <Sources
        items={[
          { href: "https://www.marinemesse.or.jp/messe", label: "マリンメッセ福岡A館「交通アクセス」「駐車場」「座席図」" },
          { href: "https://www.marinemesse.or.jp/messe/faq", label: "マリンメッセ福岡A館「よくあるご質問」（立見・自販機・Wi-Fi・車いす）" },
          { href: "https://guidebridge.jp/marine-messe-fukuoka-guide/", label: "guidebridge「マリンメッセ福岡 帰り」（A館・B館・サンパレス、帰りの手段、九州各方面の終電）" },
          { href: "https://nogizaka-ensei.jp/entry/2026/05/06/105023", label: "乃木坂遠征ガイド「マリンメッセ福岡 帰り 混雑・バス待ち・終電対策」" },
          { href: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10310082480", label: "Yahoo!知恵袋「ライブでマリンメッセ福岡に行くのですが帰り混みますか？」" },
          { href: "https://aimasupay.hatenablog.com/entry/marine-messe-fukuoka-a-guide", label: "ブログ「マリンメッセ福岡A館攻略 座席・見え方・アクセス・ロッカー」" },
          { href: "https://stay-holiday.com/livefukuoka/marinemesse_seat/", label: "stay-holiday「マリンメッセ福岡 座席表 アリーナ・スタンドの見え方」" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（福岡公演の物販時間・整理券）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
