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

const post = getBlogPost("osaka-jo-hall-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "大阪城ホール",
  "大阪城ホール コインロッカー",
  "大阪城ホール アクセス",
  "大阪城ホール 帰り 混雑",
  "大阪城ホール 座席 見え方",
  "大阪城ホール 立見",
  "大阪城ホール 双眼鏡",
  "大阪城ホール 物販",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "行き：4つの駅と使い分け" },
  { id: "exit", label: "帰り：大阪城公園駅の入場規制を避けるには" },
  { id: "seat", label: "座席：アリーナ・スタンド・立見の見え方" },
  { id: "locker", label: "コインロッカーは160個だけ・100円玉のみ" },
  { id: "inside", label: "館内：トイレ・売店・自販機・飲食" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
  { id: "links", label: "公式情報へのリンク" },
];

/** 自作の図：4つの駅と徒歩時間（簡略図） */
function StationMap() {
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="oj-access-title oj-access-desc">
      <title id="oj-access-title">大阪城ホールへの4つの駅からの徒歩時間（簡略図・上が北）</title>
      <desc id="oj-access-desc">
        ホールの東にJR大阪環状線の大阪城公園駅、北側の川沿いに地下鉄長堀鶴見緑地線の大阪ビジネスパーク駅があり、どちらも徒歩5分。南の森ノ宮駅（JR・地下鉄）と北西の大阪城北詰駅（JR東西線）は徒歩15分。川の北側の京橋駅まで歩いて帰る人も多い。
      </desc>
      <rect x="0" y="0" width="360" height="330" fill="#fbf9ff" />
      <text x="346" y="20" fontSize="11" fill="#625b7c" fontWeight="800" textAnchor="end">
        ↑ 北
      </text>
      {/* 川の北側 */}
      <rect x="8" y="10" width="138" height="50" rx="12" fill="#fff6cc" />
      <text x="77" y="30" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        大阪城北詰駅
      </text>
      <text x="77" y="49" fontSize="11" fontWeight="800" fill="#8a5a00" textAnchor="middle">
        JR東西線・15分
      </text>
      <rect x="158" y="10" width="150" height="50" rx="12" fill="#fff" stroke="#ddd2ff" strokeDasharray="4 4" />
      <text x="233" y="30" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        京橋駅（参考）
      </text>
      <text x="233" y="49" fontSize="10.5" fill="#5a2fd2" fontWeight="700" textAnchor="middle">
        帰りに歩く人が多い・15分前後
      </text>
      <rect x="0" y="72" width="360" height="22" fill="#e0f0ff" />
      <text x="14" y="87" fontSize="10.5" fill="#1d5fae" fontWeight="700">
        第二寝屋川
      </text>
      {/* OBP */}
      <rect x="8" y="104" width="134" height="52" rx="12" fill="#dcf7ec" stroke="#9fdcc1" />
      <text x="75" y="125" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        大阪ビジネスパーク駅
      </text>
      <text x="75" y="144" fontSize="11" fontWeight="800" fill="#047857" textAnchor="middle">
        長堀鶴見緑地線・5分
      </text>
      <path d="M128 156 L 160 178" stroke="#047857" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      {/* ホール */}
      <circle cx="200" cy="200" r="58" fill="#dcf7ec" />
      <text x="200" y="182" fontSize="10.5" fill="#047857" fontWeight="700" textAnchor="middle">
        大阪城公園
      </text>
      <rect x="140" y="190" width="120" height="44" rx="14" fill="#7c4dff" />
      <text x="200" y="217" fontSize="14" fill="#fff" fontWeight="800" textAnchor="middle">
        大阪城ホール
      </text>
      {/* 大阪城公園駅（東） */}
      <path d="M262 212 L 286 212" stroke="#be185d" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="276" y="168" width="78" height="88" rx="12" fill="#ffe4f0" />
      <text x="315" y="196" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        大阪城
      </text>
      <text x="315" y="211" fontSize="11.5" fontWeight="800" fill="#1b1430" textAnchor="middle">
        公園駅
      </text>
      <text x="315" y="230" fontSize="10.5" fontWeight="800" fill="#be185d" textAnchor="middle">
        JR環状線
      </text>
      <text x="315" y="245" fontSize="10.5" fontWeight="800" fill="#be185d" textAnchor="middle">
        徒歩5分
      </text>
      {/* 森ノ宮（南） */}
      <path d="M200 262 L 200 274" stroke="#8a5a00" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="136" y="274" width="128" height="50" rx="12" fill="#fff6cc" />
      <text x="200" y="294" fontSize="12" fontWeight="800" fill="#1b1430" textAnchor="middle">
        森ノ宮駅
      </text>
      <text x="200" y="313" fontSize="11" fontWeight="800" fill="#8a5a00" textAnchor="middle">
        JR・地下鉄・15分
      </text>
    </svg>
  );
}

/** 自作の図：ステージの組み方ごとの収容人数（公式の座席表ページの数値） */
function CapacityBars() {
  const rows = [
    { name: "A ゆとり型", arena: 2500, stand: 3700, standing: 0 },
    { name: "B 大規模型", arena: 4000, stand: 6500, standing: 700 },
    { name: "C センター型", arena: 4500, stand: 9000, standing: 2500 },
  ];
  const scale = 320 / 16000;
  return (
    <svg viewBox="0 0 360 230" role="img" aria-labelledby="oj-cap-title oj-cap-desc">
      <title id="oj-cap-title">大阪城ホールのステージパターン別の収容人数</title>
      <desc id="oj-cap-desc">
        パターンA：アリーナ2,500・スタンド3,700・計6,200人。パターンB：アリーナ4,000・スタンド6,500・立見700・計11,200人。パターンC（センターステージ）：アリーナ4,500・スタンド9,000・立見2,500・計16,000人。
      </desc>
      {rows.map((r, i) => {
        const y = 28 + i * 64;
        const a = r.arena * scale;
        const b = r.stand * scale;
        const c = r.standing * scale;
        const total = r.arena + r.stand + r.standing;
        return (
          <g key={r.name}>
            <text x="12" y={y - 6} fontSize="12" fontWeight="900" fill="#1b1430">
              {r.name}
            </text>
            <text x="348" y={y - 6} fontSize="12" fontWeight="900" fill="#5a2fd2" textAnchor="end">
              計 {total.toLocaleString("ja-JP")}人
            </text>
            <rect x="12" y={y} width={a} height="26" rx="6" fill="#fff6cc" />
            <rect x={12 + a} y={y} width={b} height="26" fill="#dcf7ec" />
            {c > 0 && <rect x={12 + a + b} y={y} width={c} height="26" fill="#ffe4f0" />}
            <text x="18" y={y + 17} fontSize="10" fill="#8a5a00" fontWeight="700">
              {r.arena.toLocaleString("ja-JP")}
            </text>
            <text x={18 + a} y={y + 17} fontSize="10" fill="#047857" fontWeight="700">
              {r.stand.toLocaleString("ja-JP")}
            </text>
            {c > 0 && (
              <text x={16 + a + b} y={y + 17} fontSize="10" fill="#be185d" fontWeight="700">
                {r.standing.toLocaleString("ja-JP")}
              </text>
            )}
          </g>
        );
      })}
      <rect x="12" y="206" width="12" height="12" fill="#fff6cc" />
      <text x="28" y="216" fontSize="10.5" fill="#3e3756">
        アリーナ（1F）
      </text>
      <rect x="112" y="206" width="12" height="12" fill="#dcf7ec" />
      <text x="128" y="216" fontSize="10.5" fill="#3e3756">
        スタンド（2F）
      </text>
      <rect x="212" y="206" width="12" height="12" fill="#ffe4f0" />
      <text x="228" y="216" fontSize="10.5" fill="#3e3756">
        立見（2F最後部）
      </text>
    </svg>
  );
}

/** 自作の図：ロッカーの比較（Kアリーナ横浜との違い） */
function LockerCompare() {
  return (
    <svg viewBox="0 0 360 170" role="img" aria-labelledby="oj-lk-title oj-lk-desc">
      <title id="oj-lk-title">コインロッカーの数と支払い方法の比較</title>
      <desc id="oj-lk-desc">
        大阪城ホールの館内ロッカーは160個で100円硬貨のみ・両替機なし。Kアリーナ横浜は館内外で最大6,240個で現金のみ・1,000円札の両替機あり。
      </desc>
      <rect x="8" y="8" width="168" height="154" rx="16" fill="#ffe4f0" />
      <text x="92" y="34" fontSize="12.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        大阪城ホール
      </text>
      <text x="92" y="76" fontSize="34" fontWeight="900" fill="#be185d" textAnchor="middle">
        160
      </text>
      <text x="92" y="96" fontSize="11" fill="#3e3756" textAnchor="middle">
        個（館内のみ）
      </text>
      <text x="92" y="124" fontSize="11" fontWeight="800" fill="#be185d" textAnchor="middle">
        100円玉のみ
      </text>
      <text x="92" y="142" fontSize="11" fontWeight="800" fill="#be185d" textAnchor="middle">
        館内に両替機なし
      </text>
      <rect x="184" y="8" width="168" height="154" rx="16" fill="#efe9ff" />
      <text x="268" y="34" fontSize="12.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        （参考）Kアリーナ横浜
      </text>
      <text x="268" y="76" fontSize="34" fontWeight="900" fill="#5a2fd2" textAnchor="middle">
        6,240
      </text>
      <text x="268" y="96" fontSize="11" fill="#3e3756" textAnchor="middle">
        個（館内外の最大）
      </text>
      <text x="268" y="124" fontSize="11" fontWeight="800" fill="#5a2fd2" textAnchor="middle">
        現金のみ
      </text>
      <text x="268" y="142" fontSize="11" fontWeight="800" fill="#5a2fd2" textAnchor="middle">
        両替機は1,000円札だけ
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
          <mark>大阪城ホール</mark>完全ガイド：アクセス・帰りの混雑・座席・ロッカー
        </>
      }
      heroLead="ロッカーは館内に160個だけで、しかも100円玉しか使えない。帰りは最寄り駅に入場規制がかかることも。公式の案内とファンの体験談をもとに、大阪城ホールで困らないためのポイントを図つきでまとめました。"
      stickers={["🏯 会場ガイド", "🚃 4つの駅", "🔐 ロッカー160個", "🪑 立見・天井席"]}
      unofficialNote="この記事は、大阪城ホールの公式サイトと、ファンのブログ・Q&Aなどの体験談をもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ルールや動線は公演ごとに変わるので、主催者・会場の最新情報もあわせて確認してください（2026年11月8日時点の情報）。"
    >
      <p>
        大阪城公園の中にある<strong>大阪城ホール</strong>は、1983年にできた関西を代表するアリーナ。アイドルからロック、K-POPまで毎週のようにライブが行われていて、米津玄師さんの「2026 TOUR / GHOST」でも11月18日・19日の2公演が予定されています。
      </p>
      <p>
        駅から近くて行きやすい一方、<span className={s.hl}>「ロッカーが少ない」「帰りの駅が大混雑」</span>は体験談でくり返し出てくるポイント。知っておけば準備で防げることばかりなので、出かける前にチェックしておきましょう。
      </p>

      <Tldr
        items={[
          <>最寄りは大阪城公園駅（JR環状線）と大阪ビジネスパーク駅（地下鉄）でどちらも徒歩5分。駐車場はない</>,
          <>館内ロッカーは160個だけ・100円玉のみ・両替機なし。大きな荷物は駅やホテルに預けてから</>,
          <>帰りは大阪城公園駅に入場規制がかかることも。京橋駅・森ノ宮駅まで歩いて分散する人が多い</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>16,000<small>人</small></>, label: "最大収容（センターステージ時）" },
          { num: <>160<small>個</small></>, label: "館内のコインロッカー" },
          { num: <>5<small>分</small></>, label: "大阪城公園駅・OBP駅から徒歩" },
          { num: <>0<small>台</small></>, label: "ホールの駐車場（なし）" },
        ]}
      />
      <p>住所は大阪市中央区大阪城3番1号。新大阪駅からはJRで大阪駅または京橋駅を経由して大阪城公園駅へ向かうのが一般的です。</p>

      <H2 id="access" num={2}>
        行き：4つの駅と使い分け
      </H2>
      <Figure caption="編集部作成の簡略図。駅と会場の位置関係・距離は実際の縮尺ではありません。正確な道順は公式のアクセスページで確認してください。">
        <StationMap />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="最寄り駅と徒歩時間" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">駅</th>
              <th scope="col">路線</th>
              <th scope="col">徒歩</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">大阪城公園駅</th>
              <td>JR大阪環状線</td>
              <td>約5分</td>
            </tr>
            <tr>
              <th scope="row">大阪ビジネスパーク駅</th>
              <td>地下鉄 長堀鶴見緑地線</td>
              <td>約5分</td>
            </tr>
            <tr>
              <th scope="row">森ノ宮駅</th>
              <td>JR大阪環状線・地下鉄</td>
              <td>約15分</td>
            </tr>
            <tr>
              <th scope="row">大阪城北詰駅</th>
              <td>JR東西線</td>
              <td>約15分</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：大阪城ホール「アクセス」。</p>
      <Card kind="caution" label="車はおすすめできない">
        <p>
          大阪城ホールには<strong>駐車場がありません</strong>。公式サイトでも、イベントの日は周辺の駐車場がとても混むため公共交通機関の利用を呼びかけています。車いすで来場する場合も、敷地内に車は入れないので近くの公共駐車場を使います（北側入口の外にエレベーターがあります）。
        </p>
      </Card>

      <H2 id="exit" num={3}>
        帰り：大阪城公園駅の入場規制を避けるには
      </H2>
      <p>
        終演後は、1万人以上が一斉に最寄りの大阪城公園駅へ向かいます。ファンの体験談やガイド記事では、駅で<strong>入場規制</strong>がかかって改札の外で待つことがあるという話がよく出てきます。
      </p>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "大阪城公園駅は終演後に入場規制がかかることがある。急いでいるなら別の駅まで歩くほうが早い", from: "遠征ガイド記事より" },
          { text: "京橋駅までは徒歩15分前後。高架の歩道を通るルートがあり、雨の日でも歩きやすい", from: "アクセス解説記事より" },
          { text: "森ノ宮駅は徒歩10〜15分ほどで、JRと地下鉄の両方が使えるので分散しやすい", from: "遠征ブログより" },
          { text: "遠征なら京橋・大阪ビジネスパーク・天満橋あたりに泊まると、帰りの混雑をほぼ気にしなくていい", from: "遠征ブログより" },
        ]}
      />
      <h3>行き先別のおすすめ</h3>
      <ul>
        <li>
          <strong>京阪線・JR東西線・学研都市線方面：</strong>京橋駅まで歩く
        </li>
        <li>
          <strong>天王寺・奈良方面：</strong>森ノ宮駅と大阪城公園駅を比べて空いている方へ
        </li>
        <li>
          <strong>新大阪（新幹線）方面：</strong>京橋駅または大阪駅経由。終演から新幹線まで1時間半以上あけておくと安心
        </li>
        <li>
          <strong>地下鉄で梅田・心斎橋方面：</strong>大阪ビジネスパーク駅（長堀鶴見緑地線）も選択肢
        </li>
      </ul>
      <Bubble>
        京橋はお店が多いから、少し時間をずらしてご飯を食べてから帰るのもアリだよ。
      </Bubble>

      <H2 id="seat" num={4}>
        座席：アリーナ・スタンド・立見の見え方
      </H2>
      <p>
        大阪城ホールは、1Fが<strong>アリーナ</strong>（可動式の席）、2Fが<strong>スタンド</strong>（A〜Nの14ブロックとBOX席）という2層の作りです。アリーナの配置はステージの組み方で毎回変わり、事前には公表されません。ステージの組み方によって、収容人数は6,200人から16,000人まで変わります。
      </p>
      <Figure caption="編集部作成。数値は大阪城ホール公式「座席表」ページに載っているステージパターン別の収容人数です。実際の公演がどのパターンかは主催者の発表で確認してください。">
        <CapacityBars />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="エリア別の見え方（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <caption>エリア別の見え方（体験談のまとめ）</caption>
          <thead>
            <tr>
              <th scope="col">エリア</th>
              <th scope="col">見え方の傾向</th>
              <th scope="col">双眼鏡の目安</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">アリーナ（1F）</th>
              <td>ステージに近い。床が平らなので、後方は前の人の頭で見えにくいことも</td>
              <td>後方なら8倍前後</td>
            </tr>
            <tr>
              <th scope="row">スタンド前方（2F）</th>
              <td>段差があって視界が安定しやすい。ステージ横のブロックは斜めから見る形</td>
              <td>6〜8倍</td>
            </tr>
            <tr>
              <th scope="row">スタンド後方（2F）</th>
              <td>距離はあるが、ステージ全体や照明の演出を見渡せる</td>
              <td>10〜12倍</td>
            </tr>
            <tr>
              <th scope="row">立見（2F最後部）</th>
              <td>いちばん遠いが、前に座席がないので視界は遮られにくい。上の方は音が反響してMCが聞き取りにくいという声も</td>
              <td>10〜12倍</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>倍率は複数のファンのブログの目安をまとめたものです。</p>
      <Card kind="point" label="立見の人へ">
        <p>
          公式FAQによると、立見の人は並ぶところから入場までスタッフが案内し、立ち位置は<strong>2Fスタンドの22列目より後ろ</strong>です。ずっと立ちっぱなしになるので、クッション性のある靴と、荷物は小さなバッグひとつにまとめるのがおすすめです。米津玄師さんのGHOSTツアーでも、大阪公演は立見のチケットが販売されています。
        </p>
      </Card>
      <p>
        公式サイトの座席表ページでは、スタンドの各ブロックの拡大図と、<strong>360°パノラマビュー</strong>で客席からの見え方を確認できます。
      </p>

      <H2 id="locker" num={5}>
        コインロッカーは160個だけ・100円玉のみ
      </H2>
      <p>
        大阪城ホールでいちばん気をつけたいのがロッカーです。館内のロッカーは<strong>全部で160個</strong>しかなく、1万人規模の公演だと早い時間に埋まってしまうこともあります。
      </p>
      <Figure caption="編集部作成。数値は各会場の公式サイトの案内によります。">
        <LockerCompare />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="大阪城ホールのコインロッカー" tabIndex={0}>
        <table className={s.table}>
          <caption>館内コインロッカー（1Fアリーナフロア・2Fスタンドフロアのロビー）</caption>
          <thead>
            <tr>
              <th scope="col">サイズ</th>
              <th scope="col">数</th>
              <th scope="col" className={s.price}>
                料金
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">大型（高さ約84cm）</th>
              <td>23個</td>
              <td className={s.price}>700円</td>
            </tr>
            <tr>
              <th scope="row">中型（高さ約49〜55cm）</th>
              <td>56個</td>
              <td className={s.price}>500円</td>
            </tr>
            <tr>
              <th scope="row">小型（高さ約32cm）</th>
              <td>81個</td>
              <td className={s.price}>300円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：大阪城ホール「コインロッカー」。どのサイズも幅は約35.5cm。正確な寸法は公式ページで確認してください。</p>
      <Card kind="caution" label="100円玉を用意しておく">
        <p>
          ロッカーは<strong>すべて100円硬貨のみ</strong>。館内には<strong>両替機がなく、両替サービスもありません</strong>。大型なら100円玉が7枚必要です。家を出る前に用意しておきましょう。
        </p>
      </Card>
      <FanVoices
        title="ロッカーについての体験談（まとめ）"
        items={[
          { text: "予約はできず早い者勝ち。公演によっては開場前に埋まる", from: "ロッカー解説ブログより" },
          { text: "大阪城公園駅の周辺のロッカーは、ライブ当日の午前中に埋まりやすい", from: "ロッカー解説ブログより" },
          { text: "駅前の商業施設「JO-TERRACE OSAKA」にもロッカーがある", from: "周辺ガイド記事より" },
        ]}
      />
      <p>
        遠征でキャリーケースがある人は、新大阪駅・大阪駅・京橋駅のロッカーや、ホテルに預けてから来るのが確実です。
      </p>

      <ArticleAd />

      <H2 id="inside" num={6}>
        館内：トイレ・売店・自販機・飲食
      </H2>
      <ul>
        <li>
          <strong>トイレ：</strong>公式フロアガイドの表示では、1Fに女性・男性トイレと臨時男性トイレ、2Fに女性トイレと多目的トイレがあります。
        </li>
        <li>
          <strong>売店・自動販売機：</strong>売店は1Fと2Fのロビー、自動販売機はロビーの各所にあります（Kアリーナ横浜と違って自販機があります）。
        </li>
        <li>
          <strong>飲食：</strong>客席での飲食は控えるよう案内されていて、各フロアのロビーで食べるルールです。
        </li>
        <li>
          <strong>そのほか：</strong>託児施設や、館内の呼び出しはありません。待ち合わせは事前に場所を決めておきましょう。
        </li>
      </ul>
      <Card kind="memo" label="チケットのルール">
        <p>
          大阪城ホールの公式FAQでは、正規のルート以外で手に入れたチケットは入場を断られる場合があると案内しています。譲渡は、各公演の公式リセールを使いましょう。
        </p>
      </Card>

      <H2 id="goods" num={7}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <p>米津玄師さんの「GHOST」ツアーの大阪城ホール公演の物販をまとめると、こんな感じです。</p>
      <ul>
        <li>
          <strong>販売場所は外テント。</strong>11/18(水)は12:00から（整理券の時間帯 〜15:00）、11/19(木)は13:00から（〜15:00）。
        </li>
        <li>
          アプリ「米津玄師 STORE」の整理券は<strong>11/13(金) 20:00から</strong>配布されます。
        </li>
        <li>大阪公演には会場受け取りはありません（神奈川公演のみ）。</li>
        <li>ロッカーが少ないので、物販で大きなアパレルを買う人は、たためるエコバッグを持っていくか、一度駅やホテルに戻れるよう予定を組んでおくと安心です。</li>
      </ul>
      <p>
        グッズの価格と、長野公演の様子は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」にまとめています。
      </p>

      <MochicoNudge title="買ったグッズを、公演ごとに記録しておくなら">
        <p>
          「Mochico（モチコ）」は、ライブやイベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。複数の公演に行く人も、どこで何を買ったかをすぐ見返せます。
        </p>
      </MochicoNudge>
      <p>
        遠征の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」、横浜公演は「<Link href="/blog/k-arena-yokohama-guide">Kアリーナ横浜完全ガイド</Link>」も参考にしてください。
      </p>

      <H2 id="links" num={8}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: "https://www.osaka-johall.com/access/", title: "アクセス（駅・駐車場）", icon: "🚃" },
          { href: "https://www.osaka-johall.com/seat/", title: "座席表・360°パノラマビュー", icon: "🪑" },
          { href: "https://www.osaka-johall.com/floorguide/coinlocker/", title: "コインロッカー", icon: "🔐" },
          { href: "https://www.osaka-johall.com/faq/", title: "よくあるご質問", icon: "❓" },
        ]}
      />

      <Sources
        items={[
          { href: "https://www.osaka-johall.com/access/", label: "大阪城ホール「アクセス」（最寄り駅・駐車場）" },
          { href: "https://www.osaka-johall.com/seat/", label: "大阪城ホール「座席表」（ブロック・ステージパターン別の収容人数）" },
          { href: "https://www.osaka-johall.com/floorguide/coinlocker/", label: "大阪城ホール「コインロッカー」（数・料金・100円硬貨のみ）" },
          { href: "https://www.osaka-johall.com/floorguide/", label: "大阪城ホール「フロアガイド」（トイレ・売店・自販機）" },
          { href: "https://www.osaka-johall.com/faq/", label: "大阪城ホール「よくあるご質問」（飲食・立見・車いす・チケット）" },
          { href: "https://sorami0705.hatenablog.com/entry/osakajohall-live-exit-guide", label: "オタビログ「大阪城ホールの終演後、混雑と規制退場を回避する帰り方」" },
          { href: "https://guidebridge.jp/osaka-jo-hall-guide/", label: "guidebridge「大阪城ホール 帰り 京橋・森ノ宮・大阪城公園の方面別フロー」" },
          { href: "https://tabi-hikaku.com/article-osakajo-hall-ikikata.html", label: "旅比較「大阪城ホールの行き方ガイド」（徒歩ルート比較・帰りの混雑対策）" },
          { href: "https://wordtrace.hatenablog.jp/entry/osaka-jo-hall-live-tenjoseki", label: "言葉の痕跡「大阪城ホール『天井席・立見席』徹底ガイド」" },
          { href: "https://sakamichi-trip.com/osaka-jo-hall-view/", label: "坂道トリップ「大阪城ホールの見え方完全ガイド」（双眼鏡の目安）" },
          { href: "https://wordtrace.hatenablog.jp/entry/osakajo-hall-live-coinlocker", label: "言葉の痕跡「大阪城ホールのライブを手ぶらで楽しむ！コインロッカー完全攻略ガイド」" },
          { href: "https://osaka-castle.jp/shuhen/osakajokoen-osakajohall-coinlockers.html", label: "大阪城ガイド「大阪城公園駅・大阪城ホール周辺のコインロッカー」" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（大阪公演の物販時間・整理券）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
