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

const post = getBlogPost("k-arena-yokohama-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "Kアリーナ横浜",
  "Kアリーナ横浜 コインロッカー",
  "Kアリーナ横浜 アクセス",
  "Kアリーナ横浜 帰り 混雑",
  "Kアリーナ横浜 規制退場",
  "Kアリーナ横浜 座席 見え方",
  "Kアリーナ レベル7 双眼鏡",
  "Kアリーナ横浜 トイレ",
  "Kアリーナ横浜 物販",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "行き：3つの駅と、おすすめの歩き方" },
  { id: "exit", label: "帰り：規制退場と「歩道橋渋滞」の避け方" },
  { id: "seat", label: "座席：LEVEL別の見え方と双眼鏡の倍率" },
  { id: "toilet", label: "トイレ：混む場所・空きやすい場所" },
  { id: "locker", label: "コインロッカーとクローク（現金を忘れずに）" },
  { id: "food", label: "飲食・Wi-Fi・喫煙所・バリアフリー" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
  { id: "around", label: "開場前・終演後に寄れる周辺スポット" },
  { id: "links", label: "公式情報へのリンク" },
];

// ── 自作の図（公式の地図・座席図は使わず、公開情報をもとに編集部が描いた簡略図） ──

/** 行きの3ルート */
function AccessMap() {
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="access-title access-desc">
      <title id="access-title">Kアリーナ横浜への3つの駅からの徒歩ルート（簡略図）</title>
      <desc id="access-desc">
        新高島駅4番出口から徒歩5分、横浜駅東口から徒歩9分、みなとみらい駅2番出口から徒歩12分。横浜駅からは高島水際線デッキ、みなとみらい駅からはグランモール軸の歩行者道を使う。
      </desc>
      <rect x="0" y="0" width="360" height="70" fill="#e0f0ff" />
      <text x="16" y="24" fontSize="11" fill="#1d5fae" fontWeight="700">
        横浜港（海側）
      </text>
      <rect x="120" y="40" width="130" height="58" rx="16" fill="#7c4dff" />
      <text x="185" y="66" fontSize="15" fill="#fff" fontWeight="800" textAnchor="middle">
        Kアリーナ横浜
      </text>
      <text x="185" y="86" fontSize="11" fill="#efe9ff" textAnchor="middle">
        みなとみらい6-2-14
      </text>
      <path d="M60 236 C 60 170, 100 120, 132 98" stroke="#be185d" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="8" y="236" width="104" height="52" rx="12" fill="#ffe4f0" />
      <text x="60" y="258" fontSize="13" fontWeight="800" fill="#1b1430" textAnchor="middle">
        横浜駅 東口
      </text>
      <text x="60" y="277" fontSize="12" fontWeight="800" fill="#be185d" textAnchor="middle">
        徒歩 約9分
      </text>
      <rect x="10" y="146" width="76" height="34" rx="8" fill="#fff" stroke="#ffd1e6" />
      <text x="48" y="160" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        高島水際線
      </text>
      <text x="48" y="174" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        デッキ経由
      </text>
      <path d="M185 196 L 185 102" stroke="#047857" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="128" y="196" width="114" height="52" rx="12" fill="#dcf7ec" />
      <text x="185" y="218" fontSize="13" fontWeight="800" fill="#1b1430" textAnchor="middle">
        新高島駅 4番出口
      </text>
      <text x="185" y="237" fontSize="12" fontWeight="800" fill="#047857" textAnchor="middle">
        徒歩 約5分・最寄り
      </text>
      <path d="M300 236 C 300 170, 270 120, 240 98" stroke="#8a5a00" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="248" y="236" width="104" height="52" rx="12" fill="#fff6cc" />
      <text x="300" y="258" fontSize="12.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        みなとみらい駅
      </text>
      <text x="300" y="277" fontSize="12" fontWeight="800" fill="#8a5a00" textAnchor="middle">
        2番出口 約12分
      </text>
      <rect x="262" y="146" width="88" height="34" rx="8" fill="#fff" stroke="#ffe9a3" />
      <text x="306" y="160" fontSize="10.5" fill="#8a5a00" fontWeight="700" textAnchor="middle">
        グランモール軸
      </text>
      <text x="306" y="174" fontSize="10.5" fill="#8a5a00" fontWeight="700" textAnchor="middle">
        （歩行者道）
      </text>
    </svg>
  );
}

/** 帰り：混雑ポイントと迂回ルート */
function ExitMap() {
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="exit-title exit-desc">
      <title id="exit-title">終演後に混みやすいポイントと、横浜駅きた東口への迂回ルート（簡略図）</title>
      <desc id="exit-desc">
        多くの人がみなとみらい大通りの歩道橋に集中して待ち時間が発生しやすい。迂回ルートは、高島水際線デッキからみなとみらい大橋に出て右側の歩道橋を上がり、横浜ベイクォーターを通って横浜駅きた東口へ向かう。
      </desc>
      <rect x="0" y="0" width="360" height="52" fill="#e0f0ff" />
      <text x="14" y="22" fontSize="11" fill="#1d5fae" fontWeight="700">
        横浜港（海側）
      </text>
      <rect x="196" y="24" width="140" height="48" rx="14" fill="#7c4dff" />
      <text x="266" y="53" fontSize="14" fill="#fff" fontWeight="800" textAnchor="middle">
        Kアリーナ横浜
      </text>
      {/* 混む本流 */}
      <path d="M232 74 C 220 130, 190 160, 150 186 S 90 250, 80 286" stroke="#be185d" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />
      <circle cx="150" cy="186" r="20" fill="#be185d" />
      <text x="150" y="190" fontSize="16" fill="#fff" fontWeight="900" textAnchor="middle">
        !
      </text>
      <rect x="176" y="168" width="168" height="44" rx="10" fill="#fff" stroke="#be185d" strokeWidth="1.5" />
      <text x="260" y="186" fontSize="11.5" fill="#be185d" fontWeight="800" textAnchor="middle">
        混雑ポイント：大通りの歩道橋
      </text>
      <text x="260" y="203" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        人が集中し、渡る前に待ちが出やすい
      </text>
      {/* 迂回ルート */}
      <path d="M206 64 C 150 60, 60 70, 34 120 S 30 230, 52 286" stroke="#047857" strokeWidth="5" fill="none" strokeDasharray="3 8" strokeLinecap="round" />
      <rect x="40" y="84" width="128" height="40" rx="10" fill="#fff" stroke="#9fdcc1" />
      <text x="104" y="100" fontSize="10.5" fill="#047857" fontWeight="800" textAnchor="middle">
        ① 高島水際線デッキ
      </text>
      <text x="104" y="115" fontSize="10.5" fill="#047857" fontWeight="800" textAnchor="middle">
        → みなとみらい大橋
      </text>
      <rect x="44" y="208" width="104" height="40" rx="10" fill="#fff" stroke="#9fdcc1" />
      <text x="96" y="224" fontSize="10.5" fill="#047857" fontWeight="800" textAnchor="middle">
        ② 右側の歩道橋
      </text>
      <text x="96" y="239" fontSize="10.5" fill="#047857" fontWeight="800" textAnchor="middle">
        → ベイクォーター
      </text>
      <rect x="8" y="284" width="150" height="38" rx="12" fill="#dcf7ec" />
      <text x="83" y="308" fontSize="12.5" fill="#1b1430" fontWeight="800" textAnchor="middle">
        ③ 横浜駅 きた東口
      </text>
      <rect x="196" y="250" width="150" height="62" rx="12" fill="#fff6cc" />
      <text x="271" y="272" fontSize="11.5" fill="#8a5a00" fontWeight="800" textAnchor="middle">
        ほかの手
      </text>
      <text x="271" y="290" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        新高島駅・みなとみらい駅へ
      </text>
      <text x="271" y="305" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        分散 ／ 周辺で時間をずらす
      </text>
    </svg>
  );
}

/** 座席の重なり（扇形の簡略図）。席数はファンの調べによる目安 */
function SeatFan() {
  const cx = 180;
  const cy = 236;
  const band = (r1: number, r2: number) =>
    `M ${cx - r2} ${cy} A ${r2} ${r2} 0 0 1 ${cx + r2} ${cy} L ${cx + r1} ${cy} A ${r1} ${r1} 0 0 0 ${cx - r1} ${cy} Z`;
  const rings = [
    { r1: 72, r2: 110, fill: "#dcf7ec", lv: "LEVEL 3 ロアー", n: "約5,000席" },
    { r1: 114, r2: 142, fill: "#ffe4f0", lv: "LEVEL 5 ミドル", n: "約4,600席" },
    { r1: 146, r2: 176, fill: "#efe9ff", lv: "LEVEL 7 アッパー", n: "約6,400席" },
  ];
  return (
    <svg viewBox="0 0 360 268" role="img" aria-labelledby="fan-title fan-desc">
      <title id="fan-title">Kアリーナ横浜の客席の重なり（簡略図）</title>
      <desc id="fan-desc">
        ステージを囲むように、手前からLEVEL1アリーナ約4,000席、LEVEL3ロアースタンド約5,000席、LEVEL5ミドルスタンド約4,600席、LEVEL7アッパースタンド約6,400席が扇形に重なる。席数はファンの調べによる目安。
      </desc>
      {rings.map((r) => (
        <g key={r.lv}>
          <path d={band(r.r1, r.r2)} fill={r.fill} stroke="#fff" strokeWidth="2" />
          <text x={cx} y={cy - (r.r1 + r.r2) / 2 - 2} fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
            {r.lv}
          </text>
          <text x={cx} y={cy - (r.r1 + r.r2) / 2 + 11} fontSize="10" fill="#3e3756" textAnchor="middle">
            {r.n}
          </text>
        </g>
      ))}
      <path d={`M ${cx - 68} ${cy} A 68 68 0 0 1 ${cx + 68} ${cy} Z`} fill="#fff6cc" stroke="#fff" strokeWidth="2" />
      <text x={cx} y={cy - 34} fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        LEVEL 1 アリーナ
      </text>
      <text x={cx} y={cy - 21} fontSize="10" fill="#3e3756" textAnchor="middle">
        約4,000席・床は平ら
      </text>
      <rect x={cx - 60} y={cy + 4} width="120" height="24" rx="6" fill="#1b1430" />
      <text x={cx} y={cy + 21} fontSize="12" fontWeight="800" fill="#fff" textAnchor="middle">
        STAGE
      </text>
    </svg>
  );
}

/** フロアごとの設備と、トイレ・エスカレーター */
function LevelStack() {
  const rows = [
    { y: 14, x: 14, lv: "LEVEL 7", name: "アッパースタンド", f: "トイレ・売店・喫煙室・ロッカー／階段移動", fill: "#efe9ff" },
    { y: 70, x: 44, lv: "LEVEL 5", name: "ミドルスタンド", f: "一般トイレの表示なし（車椅子優先のみ）", fill: "#ffe4f0", warn: true },
    { y: 126, x: 74, lv: "LEVEL 4", name: "客席なし", f: "トイレ広め・比較的空きやすい", fill: "#dcf7ec", good: true },
    { y: 182, x: 104, lv: "LEVEL 3", name: "ロアースタンド", f: "メインエントランス・授乳室・売店", fill: "#f4f2f8" },
    { y: 238, x: 134, lv: "LEVEL 1", name: "アリーナ", f: "トイレ・売店・ロッカー", fill: "#fff6cc" },
  ];
  return (
    <svg viewBox="0 0 360 318" role="img" aria-labelledby="level-title level-desc">
      <title id="level-title">Kアリーナ横浜のフロア構成とトイレの傾向（簡略図）</title>
      <desc id="level-desc">
        LEVEL7アッパースタンド、LEVEL5ミドルスタンド（一般トイレの表示なし）、LEVEL4（客席なし・トイレが比較的空きやすい）、LEVEL3ロアースタンド（メインエントランス）、LEVEL1アリーナ。一般向けのエスカレーターはLEVEL3とLEVEL5を結ぶ。
      </desc>
      {rows.map((r) => (
        <g key={r.lv}>
          <rect x={r.x} y={r.y} width={346 - r.x} height="48" rx="10" fill={r.fill} stroke={r.good ? "#047857" : r.warn ? "#be185d" : "none"} strokeWidth="1.5" />
          <text x={r.x + 10} y={r.y + 20} fontSize="12" fontWeight="900" fill="#5a2fd2">
            {r.lv}
          </text>
          <text x={r.x + 72} y={r.y + 20} fontSize="12.5" fontWeight="800" fill="#1b1430">
            {r.name}
          </text>
          <text x={r.x + 10} y={r.y + 38} fontSize="10.5" fill={r.good ? "#047857" : r.warn ? "#be185d" : "#3e3756"} fontWeight={r.good || r.warn ? 700 : 400}>
            {r.f}
          </text>
        </g>
      ))}
      <text x="14" y="300" fontSize="10.5" fill="#5a2fd2" fontWeight="700">
        一般のエスカレーターは LEVEL3 ⇄ LEVEL5（LEVEL7 へは階段中心）
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
          <mark>Kアリーナ横浜</mark>完全ガイド：アクセス・帰りの混雑・座席・トイレ・ロッカー
        </>
      }
      heroLead="公式の案内に、実際に行ったファンの体験談をたっぷり足しました。帰りに詰まる場所と迂回ルート、LEVEL別の見え方と双眼鏡の倍率、トイレが空きやすい階、現金のみのロッカーまで、図つきで解説します。"
      stickers={["🏟️ 会場ガイド", "🚶 帰りの迂回ルート", "🔭 座席の見え方", "🚻 トイレ"]}
      unofficialNote="この記事は、Kアリーナ横浜の公式サイトと、ファンのブログ・Q&A・口コミなどの体験談をもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ルールや動線は公演ごとに変わるので、主催者・会場の最新情報もあわせて確認してください（2026年11月8日更新）。"
    >
      <p>
        横浜・みなとみらいにある<strong>Kアリーナ横浜</strong>は、2023年にできた座席数2万席超の音楽専用アリーナ。米津玄師さんの「2026 TOUR / GHOST」でも、11月11日・12日と、ツアーファイナルの12月16日・17日の計4公演が予定されています。
      </p>
      <p>
        音の良さや席の見やすさは評判の一方で、ファンの体験談では<span className={s.hl}>「帰りの混雑」「トイレ」「階段」</span>の3つがくり返し話題になります。この記事では、公式の情報と体験談をつき合わせて、つまずきやすいポイントの避け方をまとめました。
      </p>

      <Tldr
        items={[
          <>帰りは規制退場＋歩道橋の待ちで、横浜駅まで30分〜1時間超かかった体験談が多い。迂回ルートか時間ずらしで回避</>,
          <>LEVEL5には一般トイレの表示がない。客席のないLEVEL4のトイレが比較的空きやすい</>,
          <>ロッカーは現金のみ（両替機は1,000円札だけ）、売店はキャッシュレスのみ。両方持っていく</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>20,033<small>席</small></>, label: "座席数（公式フロアガイド）" },
          { num: <>9<small>階建て</small></>, label: "地上9階・高さ約45m" },
          { num: <>6,240<small>個</small></>, label: "コインロッカー（館内外の最大数）" },
          { num: <>5<small>分</small></>, label: "最寄り・新高島駅から徒歩" },
        ]}
      />
      <p>
        住所は横浜市西区みなとみらい6-2-14。東京駅・新宿駅・渋谷駅からは横浜駅まで約25〜30分、羽田空港からも約22分（公式アクセスページの目安）なので、遠征組にも行きやすい会場です。
      </p>

      <H2 id="access" num={2}>
        行き：3つの駅と、おすすめの歩き方
      </H2>
      <Figure caption="編集部作成の簡略図。駅と会場の位置関係・距離は実際の縮尺ではありません。正確な道順は公式のアクセスページで確認してください。">
        <AccessMap />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="最寄り駅と徒歩時間" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">駅</th>
              <th scope="col">出口</th>
              <th scope="col">徒歩</th>
              <th scope="col">こんな人に</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">新高島駅（みなとみらい線）</th>
              <td>4番出口（臨港パーク口）</td>
              <td>約5分</td>
              <td>いちばん近い。横浜駅で乗り換えて1駅</td>
            </tr>
            <tr>
              <th scope="row">横浜駅（JRほか各線）</th>
              <td>東口</td>
              <td>約9分</td>
              <td>乗り換えなし。ご飯やロッカーを駅周辺で済ませたい人</td>
            </tr>
            <tr>
              <th scope="row">みなとみらい駅（みなとみらい線）</th>
              <td>2番出口（いちょう通り口）</td>
              <td>約12分</td>
              <td>みなとみらい側のホテル・観光と組み合わせる人</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：Kアリーナ横浜「アクセス」。</p>
      <p>
        会場の公式のお知らせでは、横浜駅から歩く場合は<strong>高島水際線デッキ</strong>を使うルートが案内されています。みなとみらい駅から歩く人は、周辺の住宅地を通らず、歩行者専用の<strong>グランモール軸</strong>を使うようお願いされています。
      </p>
      <Card kind="caution" label="車で行くなら予約が必須">
        <p>
          隣接する「ミュージックテラス駐車場 P1」は、公演日などの特定日は<strong>WEB事前予約制</strong>で、一般の車向けの駐車場は用意されていません。特定日の料金は60分2,000円・当日最大10,000円（公式アクセスページより）。予約は特定日の1か月前から、タイムズのサイトでできます。会場には<strong>タクシー乗り場もありません</strong>。
        </p>
      </Card>

      <H2 id="exit" num={3}>
        帰り：規制退場と「歩道橋渋滞」の避け方
      </H2>
      <p>
        Kアリーナ横浜は<strong>全公演で規制退場</strong>（ブロックごとに順番に退場）を主催者に依頼しています。終演後は決められたルート以外の階段が閉鎖され、周辺のゲートも封鎖されます。ここまでは公式の案内ですが、体験談を読むと、実際に時間がかかるのは<strong>会場を出たあと</strong>のようです。
      </p>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "終演から横浜駅に着くまで、30分程度・45〜50分・1時間半と、公演や呼ばれる順番でかなり差がある", from: "Yahoo!知恵袋の回答より" },
          { text: "規制退場の呼び出しが中盤で、横浜駅周辺に着いたのは終演からおよそ1時間後。会場の外を少し進むと混雑はなかった", from: "note の体験記より" },
          { text: "会場を出るまでで約30分、大通りの歩道橋に乗るまでにさらに約30分。観客の大半が横浜駅方面に向かうため、歩道橋の前で詰まる", from: "地元情報サイトの解説より" },
          { text: "混雑のピークは終演直後から60分ほど。駅から遠い順に呼ばれても、結局同じ道に合流する", from: "遠征ガイド記事より" },
        ]}
      />
      <Figure caption="編集部作成の簡略図。迂回ルートは地元情報サイトで紹介されている道順を簡略化したものです。当日の誘導や通行止めがあれば、そちらに従ってください。">
        <ExitMap />
      </Figure>
      <h3>おすすめの帰り方3つ</h3>
      <ol>
        <li>
          <strong>迂回ルートで横浜駅「きた東口」へ：</strong>高島水際線デッキからみなとみらい大橋に出て、混む側と反対（右側）の歩道橋を上がり、横浜ベイクォーターの中を通ってきた東口へ。きた東口から入ると、ホームの混む側と反対の端に出られるという声もあります。
        </li>
        <li>
          <strong>別の駅に分散：</strong>新高島駅（みなとみらい線）やみなとみらい駅に向かう人は少なめ。横浜駅で乗り換えが必要でも、結果的に早いことがあります。
        </li>
        <li>
          <strong>時間をずらす：</strong>ピークは終演直後〜1時間ほど。会場周辺のお店で食事をしてから帰る、ホテルを近くに取る、という人も多いです（会場周辺に長くとどまるのは控え、お店や駅側へ移動して）。
        </li>
      </ol>
      <Bubble>
        新幹線や夜行バスで帰る人は、「終演＋1時間半」くらいを目安に便を選ぶと安心だよ。
      </Bubble>

      <H2 id="seat" num={4}>
        座席：LEVEL別の見え方と双眼鏡の倍率
      </H2>
      <p>
        チケットの<strong>「LEVEL◯」は地上の階数</strong>です。LEVEL1が地上1階（アリーナ）、LEVEL5が地上5階というように読みます。会場の入口となる<strong>メインエントランスはLEVEL3</strong>。客席はステージに向かって扇形に広がっているので、左右の端の席でもステージの方を向いて座れます。
      </p>
      <Figure caption="編集部作成の簡略図。席数はファンのブログでの調べによる目安です（公式の総座席数は20,033席）。アリーナの形やステージの位置は公演ごとに変わります。">
        <SeatFan />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="LEVEL別の見え方と双眼鏡の目安（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 600 }}>
          <caption>LEVEL別の見え方（体験談のまとめ）</caption>
          <thead>
            <tr>
              <th scope="col">LEVEL</th>
              <th scope="col">見え方の傾向</th>
              <th scope="col">双眼鏡の目安</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1 アリーナ</th>
              <td>近い。ただし床が平らなので、前の人の背の高さで見え方が変わる</td>
              <td>後方なら8倍前後</td>
            </tr>
            <tr>
              <th scope="row">3 ロアースタンド</th>
              <td>段差があり見やすい。距離と見やすさのバランスがいちばん良いという声が多い</td>
              <td>6〜8倍</td>
            </tr>
            <tr>
              <th scope="row">5 ミドルスタンド</th>
              <td>会場全体を見渡せる高さ。中央前方には幅の広い「バルコニー席」がある</td>
              <td>8〜10倍</td>
            </tr>
            <tr>
              <th scope="row">7 アッパースタンド</th>
              <td>傾斜が急で見下ろす形。演出や照明の全体はよく見えるが、表情はモニター頼り。「思ったより近い」「かなり遠い」と感想が分かれる</td>
              <td>10〜12倍（防振つきが人気）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>倍率は複数のファンのブログの目安をまとめたものです。手ブレが気になる人は防振双眼鏡が快適です。</p>
      <h3>LEVEL7の席番号の見方（ファンの調べ）</h3>
      <ul>
        <li>列は前から1列〜28列ほど。</li>
        <li>番号は左から数え、左ブロックが1〜80番、中央ブロックが81〜204番、右ブロックが205〜284番前後。中央の130〜150番台がステージ正面に近い位置です。</li>
        <li>最前列は手すりが視界に入ることがある、という声もあります。</li>
      </ul>
      <Card kind="point" label="自分の席からの見え方は公式で確認できる">
        <p>
          公式の「シートマップ」では、座席をクリックすると<strong>その席から見たステージの写真</strong>が見られます。席番号が分かったら一度のぞいておくと安心です（公演によってステージの形が違うので、あくまで目安として）。
        </p>
      </Card>
      <Card kind="caution" label="LEVEL7は階段が急">
        <p>
          「階段の角度が怖い」「上るのに息が切れる」という声が多いのがLEVEL7。歩きやすいスニーカーで、荷物は少なめに。足腰に不安がある人は、エレベーターの使い方を事前に主催者へ問い合わせておきましょう（全フロアに行けるエレベーターがあります）。
        </p>
      </Card>

      <H2 id="toilet" num={5}>
        トイレ：混む場所・空きやすい場所
      </H2>
      <p>
        口コミでいちばん不満が多いのがトイレです。理由は会場の作りにあって、公式フロアガイドを見ると<strong>LEVEL5には一般トイレの表示がなく</strong>（車椅子優先トイレのみ）、一般向けのエスカレーターも<strong>LEVEL3とLEVEL5を結ぶだけ</strong>。LEVEL3はメインエントランスの階なので、入場直後の人も集まります。
      </p>
      <Figure caption="編集部作成の簡略図（公式フロアガイドの設備表示と、ファンの体験談をもとに作成）。男女の配置は公演ごとに変わることがあります。">
        <LevelStack />
      </Figure>
      <FanVoices
        title="トイレについての体験談（まとめ）"
        items={[
          { text: "客席のないLEVEL4はトイレが広く、開演15分前でも待ちは10人ほどだった", from: "note の分析記事より" },
          { text: "LEVEL5の人は、中央の階段を下りてLEVEL4のトイレに行くのが定番", from: "note の分析記事より" },
          { text: "LEVEL7は中央より端や奥のトイレのほうが空いている", from: "口コミより" },
          { text: "終演後は館内のトイレが早めに閉まっていた。退場前に済ませておくのが安全", from: "口コミ・体験記より" },
        ]}
      />
      <p>
        開場前は、公式案内にある<strong>ミュージックテラスのノースゲート階段下</strong>と<strong>サウスエントランス側の外周</strong>のトイレが使えます。開場後の館内トイレは公演チケットを持っている人だけが使えます。
      </p>

      <H2 id="locker" num={6}>
        コインロッカーとクローク（現金を忘れずに）
      </H2>
      <p>
        ロッカーは館内・館外あわせて最大6,240個。体験談でも「数が多くて困らなかった」という声が目立ちます。ただし<strong>館内は小サイズしかなく</strong>、大きな荷物が入るサイズは館外の一部だけです。
      </p>
      <div className={s.tableWrap} role="region" aria-label="コインロッカーの料金とサイズ" tabIndex={0}>
        <table className={s.table}>
          <caption>コインロッカーの料金とサイズ（幅×高さ×奥行）</caption>
          <thead>
            <tr>
              <th scope="col">場所</th>
              <th scope="col">サイズ</th>
              <th scope="col" className={s.price}>
                料金
              </th>
              <th scope="col">使える時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">館内</th>
              <td>小 23×31×45cm</td>
              <td className={s.price}>400円</td>
              <td>開館時間内</td>
            </tr>
            <tr>
              <th scope="row" rowSpan={3}>
                館外
              </th>
              <td>小 23×31×45cm</td>
              <td className={s.price}>400円</td>
              <td rowSpan={3}>公演日の10:00〜終演1時間後</td>
            </tr>
            <tr>
              <td>中 36×27×60cm</td>
              <td className={s.price}>500円</td>
            </tr>
            <tr>
              <td>大 36×56×60cm</td>
              <td className={s.price}>800円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：Kアリーナ横浜「よくあるご質問」。</p>
      <Card kind="caution" label="ロッカーは現金のみ">
        <p>
          コインロッカーの支払いは<strong>現金だけ</strong>です。各フロアに両替機はありますが、使えるのは<strong>1,000円札のみ</strong>（5,000円札・10,000円札は不可）。100円玉を多めに持っていくのが確実です。
        </p>
      </Card>
      <h3>クローク</h3>
      <ul>
        <li>場所は「Kアリーナショップ」。料金は1つ1,000円（税込）。</li>
        <li>一度預けたら、途中で荷物の出し入れはできません。</li>
        <li>終演後1時間以内に引き取る必要があり、受付数に達したら終了です。</li>
      </ul>
      <p>
        キャリーケースのような大きな荷物は、館内や座席スペースへの持ち込みを控えるよう案内されています。遠征の人は、横浜駅周辺のロッカーや宿泊先に預けてから来ると身軽です。
      </p>

      <ArticleAd />

      <H2 id="food" num={7}>
        飲食・Wi-Fi・喫煙所・バリアフリー
      </H2>
      <ul>
        <li>
          館内のバー・売店は<strong>キャッシュレス決済のみ</strong>（現金不可）。交通系ICや二次元コード決済に対応していて、使えるブランドは店舗ごとに違います。
        </li>
        <li>
          <strong>自動販売機は設置されていません。</strong>飲み物は売店で買うか、入場前に用意を（持ち込みの可否は公演ごとの案内に従います）。
        </li>
        <li>飲食物の持ち込みは原則できません。客席での飲食はできますが、公演によって変わることがあります。「Lounge 5」では館内で買ったものを座って楽しめます。</li>
        <li>来場者向けのWi-Fiはありません。電子チケットは事前に表示確認を。</li>
        <li>喫煙室はLEVEL4とLEVEL7。開場後に使えます（公演によっては使えない場合あり）。</li>
        <li>車いすで来場する人はサウスゲートから。エレベーターとスロープがあります。</li>
      </ul>
      <Bubble>
        ロッカーは現金、売店はキャッシュレス。Kアリーナ横浜の日は「小銭」と「チャージ済みの交通系IC」の両方を持っていこう！
      </Bubble>

      <H2 id="goods" num={8}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <p>物販のやり方は公演ごとに違います。例として、米津玄師さんの「GHOST」ツアーのKアリーナ横浜公演をまとめると、こんな感じです。</p>
      <ul>
        <li>
          <strong>販売場所は外テント。</strong>4公演とも10:00から販売が始まり、混雑する時間帯は公式アプリの整理券で案内されます（11月公演の整理券は11/8 20:00〜、12月公演は12/11 20:00〜配布）。
        </li>
        <li>
          <strong>事前決済の「会場受け取り」</strong>もあり、受け取り場所は横浜ランドマークホール（Kアリーナ横浜から徒歩20分以上）。12月公演分の予約は12/7(月) 20:00〜12/10(木) 20:00です。
        </li>
        <li>館外のコインロッカーが使えるのも公演日の10:00から。午前中に買ったものを預けて、身軽に過ごせます。</li>
      </ul>
      <p>
        グッズの価格や長野公演の様子は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」で詳しくまとめています。
      </p>

      <H2 id="around" num={9}>
        開場前・終演後に寄れる周辺スポット
      </H2>
      <ul>
        <li>
          <strong>商業施設：</strong>横浜ベイクォーター、横浜ポルタ、スカイビル、そごう・西武横浜店（どれも横浜駅東口側。帰りの迂回ルート上のベイクォーターは時間調整にも便利）
        </li>
        <li>
          <strong>ホテル：</strong>ヒルトン・ガーデン・イン横浜みなとみらい、THE SPLAISIR YOKOHAMA、三井ガーデンホテル横浜みなとみらいプレミア、横浜東急REIホテル、京急EXイン横浜駅東口 など（公式アクセスページで紹介）
        </li>
        <li>
          <strong>温浴施設：</strong>RAKUSPA BAY、万葉倶楽部 MM21（遠征の疲れを取りたい人に）
        </li>
      </ul>
      <Card kind="memo" label="米津玄師ファンは書店にも寄り道を">
        <p>
          会場から歩いて行ける<strong>紀伊國屋書店 横浜店</strong>では、Kアリーナ公演にあわせてブックフェア「米津玄師と文学2026」を開催中（11/8〜12/24）。米津さんがインタビューなどで触れた本が並んでいます（音楽ナタリーの報道より）。
        </p>
      </Card>
      <Card kind="memo" label="会場まわりのマナー">
        <p>Kアリーナ横浜のまわりには住宅地もあります。公演前後に会場周辺に長くとどまらない、大きな声で騒がない、など近隣への配慮を忘れずに。</p>
      </Card>

      <MochicoNudge title="ライブごとに「買うもの」「買ったもの」を残すなら">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。予約受付や販売開始の日時も登録できるので、物販の前の買い物リストにも、終わったあとの記録にも使えます。
        </p>
      </MochicoNudge>
      <p>
        遠征の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」、大阪公演に行く人は「<Link href="/blog/osaka-jo-hall-guide">大阪城ホール完全ガイド</Link>」も参考にしてください。
      </p>

      <H2 id="links" num={10}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: "https://k-arena.com/access/", title: "アクセス（駅・駐車場・周辺施設）", icon: "🚃" },
          { href: "https://k-arena.com/seat", title: "シートマップ（座席からの見え方）", icon: "🪑" },
          { href: "https://k-arena.com/floor", title: "フロアガイド（各LEVELの設備）", icon: "🏟️" },
          { href: "https://k-arena.com/faq", title: "よくあるご質問（ロッカー・飲食など）", icon: "❓" },
        ]}
      />

      <Sources
        items={[
          { href: "https://k-arena.com/access/", label: "Kアリーナ横浜「アクセス」（2025年3月時点の内容と記載）" },
          { href: "https://k-arena.com/faq", label: "Kアリーナ横浜「よくあるご質問」（ロッカー・クローク・飲食・トイレ・規制退場）" },
          { href: "https://k-arena.com/floor", label: "Kアリーナ横浜「フロアガイド」（各LEVELの設備・座席数）" },
          { href: "https://k-arena.com/seat", label: "Kアリーナ横浜「シートマップ」" },
          { href: "https://k-arena.com/news/20250204-1", label: "Kアリーナ横浜「入退場についてのお知らせ（高島水際線デッキを利用するルートのご案内）」" },
          { href: "https://minatomirai-life.com/k-arena-detour-route/", label: "みなとみらいLIFEドットコム「Kアリーナ脱出 おすすめ迂回ルート」（帰りの混雑ポイント・迂回ルート）" },
          { href: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11292526026", label: "Yahoo!知恵袋「Kアリーナ横浜の退場に2時間掛かるのでしょうか？」（帰りの所要時間の体験談）" },
          { href: "https://note.com/cutehamster/n/nafb904a1188e", label: "note「Kアリーナ横浜の退場と音響について」（退場の体験記）" },
          { href: "https://note.com/satokesama/n/nbe0b4a9eef83", label: "note「Kアリーナ横浜のトイレ問題―なぜいつも並ぶのか」（トイレの配置と体験談）" },
          { href: "https://kotonohamizu.hatenablog.jp/entry/k-arena-lv7", label: "ことのはみず「Kアリーナ横浜 レベル7の見え方」（LEVEL別の席数の目安・席番号）" },
          { href: "https://www.oshinote.net/k-arena-level7-view/", label: "Oshinote「KアリーナLEVEL7って見える？双眼鏡は必要？」（双眼鏡の倍率）" },
          { href: "https://map.yahoo.co.jp/v3/place/TaAvsjTKt26/review", label: "Yahoo!マップ「Kアリーナ横浜」のクチコミ（階段・トイレ・退場の感想）" },
          { href: "https://news.yahoo.co.jp/articles/9df15bb56b74aff470e7dbb2fb2381a32aafde6e", label: "音楽ナタリー「ブックフェア『米津玄師と文学』紀伊國屋書店横浜店で」" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（Kアリーナ横浜公演の物販・会場受け取り）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
