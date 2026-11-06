import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
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
  "Kアリーナ横浜 座席 LEVEL",
  "Kアリーナ横浜 クローク",
  "Kアリーナ横浜 物販",
  "Kアリーナ横浜 飲食",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "アクセス：3つの駅と、行き・帰りのルート" },
  { id: "seat", label: "座席とフロア：「LEVEL」の読み方" },
  { id: "locker", label: "コインロッカーとクローク（現金を忘れずに）" },
  { id: "food", label: "飲食・トイレ・Wi-Fi・喫煙所" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
  { id: "around", label: "開場前に寄れる周辺スポット" },
  { id: "links", label: "公式情報へのリンク" },
];

/** 自作の図：駅から会場までの位置関係（簡略図） */
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
      {/* 横浜駅 */}
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
      {/* 新高島駅 */}
      <path d="M185 196 L 185 102" stroke="#047857" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="128" y="196" width="114" height="52" rx="12" fill="#dcf7ec" />
      <text x="185" y="218" fontSize="13" fontWeight="800" fill="#1b1430" textAnchor="middle">
        新高島駅 4番出口
      </text>
      <text x="185" y="237" fontSize="12" fontWeight="800" fill="#047857" textAnchor="middle">
        徒歩 約5分・最寄り
      </text>
      {/* みなとみらい駅 */}
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

/** 自作の図：フロア（LEVEL）の積み重なり（断面の簡略図） */
function LevelStack() {
  const rows = [
    { y: 18, x: 14, lv: "LEVEL 7", name: "アッパースタンド", f: "トイレ・売店・喫煙室・ロッカー", fill: "#efe9ff" },
    { y: 74, x: 44, lv: "LEVEL 5", name: "ミドルスタンド", f: "売店・エスカレーター・車椅子優先トイレ", fill: "#ffe4f0" },
    { y: 130, x: 74, lv: "LEVEL 4", name: "（通路階）", f: "トイレ・喫煙室・ロッカー", fill: "#f4f2f8" },
    { y: 186, x: 104, lv: "LEVEL 3", name: "ロアースタンド", f: "メインエントランス・授乳室・売店", fill: "#dcf7ec" },
    { y: 242, x: 134, lv: "LEVEL 1", name: "アリーナ", f: "トイレ・売店・ロッカー", fill: "#fff6cc" },
  ];
  return (
    <svg viewBox="0 0 360 312" role="img" aria-labelledby="level-title level-desc">
      <title id="level-title">Kアリーナ横浜のフロア構成（簡略図）</title>
      <desc id="level-desc">
        上からLEVEL7アッパースタンド、LEVEL5ミドルスタンド、LEVEL4、LEVEL3ロアースタンド（メインエントランス）、LEVEL1アリーナ。LEVELの数字は地上の階数。
      </desc>
      {rows.map((r) => (
        <g key={r.lv}>
          <rect x={r.x} y={r.y} width={346 - r.x} height="48" rx="10" fill={r.fill} />
          <text x={r.x + 10} y={r.y + 20} fontSize="12" fontWeight="900" fill="#5a2fd2">
            {r.lv}
          </text>
          <text x={r.x + 72} y={r.y + 20} fontSize="12.5" fontWeight="800" fill="#1b1430">
            {r.name}
          </text>
          <text x={r.x + 10} y={r.y + 38} fontSize="10.5" fill="#3e3756">
            {r.f}
          </text>
        </g>
      ))}
      <text x="14" y="300" fontSize="10.5" fill="#625b7c">
        ← 客席は上の階ほど後方へ ／ ステージ側 →
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
          <mark>Kアリーナ横浜</mark>完全ガイド：アクセス・ロッカー・座席・物販のコツ
        </>
      }
      heroLead="最寄り駅と帰りのルート、「LEVEL」の読み方、現金しか使えないロッカーとキャッシュレスだけの売店。初めて行く人がつまずきやすいポイントを、公式の案内をもとにまとめました。"
      stickers={["🏟️ 会場ガイド", "🚃 アクセス", "🔐 ロッカー", "🪑 座席LEVEL"]}
      unofficialNote="この記事は、Kアリーナ横浜の公式サイトなどをもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図は編集部が作った簡略図です。ルールは公演ごとに変わることがあるので、主催者・会場の最新情報もあわせて確認してください（2026年11月6日時点の情報）。"
    >
      <p>
        横浜・みなとみらいにある<strong>Kアリーナ横浜</strong>は、座席数2万席超の音楽専用アリーナ。米津玄師さんの「2026 TOUR / GHOST」でも、11月11日・12日と、ツアーファイナルの12月16日・17日の計4公演が予定されています。
      </p>
      <p>
        大きな会場なので、ロッカー・トイレ・売店の場所やルールを知らないまま行くと、開演前にバタバタしがち。とくに<span className={s.hl}>「ロッカーは現金のみ」「売店はキャッシュレスのみ」</span>という逆向きのルールは、知っておくだけで当日の安心感が違います。
      </p>

      <Tldr
        items={[
          <>最寄りは新高島駅（4番出口から徒歩約5分）。横浜駅からは東口から徒歩約9分</>,
          <>コインロッカーは現金のみ・両替機は1,000円札だけ。売店・バーはキャッシュレスのみ</>,
          <>「LEVEL◯」は地上の階数。メインエントランスはLEVEL3、座席の見え方は公式シートマップで確認できる</>,
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
        アクセス：3つの駅と、行き・帰りのルート
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">新高島駅（みなとみらい線）</th>
              <td>4番出口（臨港パーク口）</td>
              <td>約5分</td>
            </tr>
            <tr>
              <th scope="row">横浜駅（JRほか各線）</th>
              <td>東口</td>
              <td>約9分</td>
            </tr>
            <tr>
              <th scope="row">みなとみらい駅（みなとみらい線）</th>
              <td>2番出口（いちょう通り口）</td>
              <td>約12分</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：Kアリーナ横浜「アクセス」。</p>
      <h3>横浜駅からは「高島水際線デッキ」へ</h3>
      <p>
        会場の公式のお知らせでは、横浜駅から歩く場合、<strong>高島水際線デッキ</strong>を使うルートが案内されています。みなとみらい駅から歩く人は、周辺の住宅地を通らず、歩行者専用の<strong>グランモール軸</strong>を使うようお願いされています。
      </p>
      <h3>帰りは「規制退場」がある前提で</h3>
      <ul>
        <li>Kアリーナ横浜では、全公演で規制退場（ブロックごとに順番に退場）を主催者に依頼しています。</li>
        <li>終演後は、決められた退場ルート以外の階段が閉鎖されます。周辺のゲートも封鎖されるので、遠回りになることがあります。</li>
        <li>
          <strong>会場にタクシー乗り場はありません。</strong>送迎の車や、周辺での路上駐車も控えるよう案内されています。
        </li>
      </ul>
      <Card kind="caution" label="車で行くなら予約が必須">
        <p>
          隣接する「ミュージックテラス駐車場 P1」は、公演日などの特定日は<strong>WEB事前予約制</strong>で、一般の車向けの駐車場は用意されていません。特定日の料金は60分2,000円・当日最大10,000円（公式アクセスページより）。予約は特定日の1か月前から、タイムズのサイトでできます。
        </p>
      </Card>
      <Bubble>
        終演後の新幹線や夜行バスに乗る人は、規制退場の時間も考えて余裕をもった便にしておこうね。
      </Bubble>

      <H2 id="seat" num={3}>
        座席とフロア：「LEVEL」の読み方
      </H2>
      <p>
        チケットに書かれている<strong>「LEVEL◯」は地上の階数</strong>です。LEVEL1が地上1階（アリーナ）、LEVEL5が地上5階というように読みます。会場の入口となる<strong>メインエントランスはLEVEL3</strong>にあります。
      </p>
      <Figure caption="編集部作成の簡略図（公式フロアガイドの各階の設備をもとに作成）。アリーナの形やステージの位置は公演ごとに変わります。">
        <LevelStack />
      </Figure>
      <ul>
        <li>
          <strong>LEVEL1 アリーナ：</strong>ステージにいちばん近いフロア。席の配置やステージの形は公演ごとに変わります。
        </li>
        <li>
          <strong>LEVEL3 ロアースタンド：</strong>メインエントランスと同じ階。授乳室もこの階です。
        </li>
        <li>
          <strong>LEVEL5 ミドルスタンド：</strong>中央前方には、幅の広い特別仕様の「バルコニー席」があります。
        </li>
        <li>
          <strong>LEVEL7 アッパースタンド：</strong>いちばん上のスタンド。双眼鏡があると表情まで楽しめます。
        </li>
      </ul>
      <Card kind="point" label="座席からの見え方は公式で見られる">
        <p>
          公式の「シートマップ」では、座席をクリックすると<strong>その席から見たステージの写真</strong>が確認できます。チケットの席番号が分かったら、一度のぞいておくと当日のイメージがわきます（公演によってステージの形が違うので、あくまで目安として）。
        </p>
      </Card>

      <H2 id="locker" num={4}>
        コインロッカーとクローク（現金を忘れずに）
      </H2>
      <p>
        ロッカーは館内・館外あわせて最大6,240個。数は多いのですが、<strong>館内は小サイズしかない</strong>ので、大きな荷物は館外のロッカーかクロークを使います。
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

      <H2 id="food" num={5}>
        飲食・トイレ・Wi-Fi・喫煙所
      </H2>
      <h3>飲食はキャッシュレスのみ・自販機なし</h3>
      <ul>
        <li>
          館内のバー・売店は<strong>キャッシュレス決済のみ</strong>（現金不可）。交通系ICや二次元コード決済に対応していて、使えるブランドは店舗ごとに違います。
        </li>
        <li>
          <strong>自動販売機は設置されていません。</strong>飲み物は売店で買うことになります。
        </li>
        <li>飲食物の持ち込みは原則できません（公演によって違う場合は主催者の案内に従います）。</li>
        <li>客席で飲食できますが、公演によって変わることがあります。「Lounge 5」では、館内で買ったものを座って楽しめます。</li>
      </ul>
      <Bubble>
        ロッカーは現金、売店はキャッシュレス。Kアリーナ横浜の日は「小銭」と「チャージ済みの交通系IC」の両方を持っていこう！
      </Bubble>
      <h3>トイレ</h3>
      <p>
        開場前は、ミュージックテラスのノースゲート階段下と、サウスエントランス側の外周にあるトイレを使います。開場後は館内のトイレを使えます（公演チケットを持っている人のみ）。男女の配置は公演ごとに変わることがあります。
      </p>
      <h3>Wi-Fi・喫煙所・バリアフリー</h3>
      <ul>
        <li>来場者向けのWi-Fiはありません。電子チケットは事前に表示確認を。</li>
        <li>喫煙室はLEVEL4とLEVEL7にあり、開場後に使えます（公演によっては使えない場合あり）。</li>
        <li>車いすで来場する人はサウスゲートから。エレベーターとスロープがあり、全フロアにアクセスできるエレベーターもあります（利用は主催者に問い合わせ）。</li>
      </ul>

      <H2 id="goods" num={6}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <p>
        物販のやり方は公演ごとに違います。例として、米津玄師さんの「GHOST」ツアーでのKアリーナ横浜公演の物販をまとめると、こんな感じです。
      </p>
      <ul>
        <li>
          <strong>販売場所は外テント。</strong>4公演とも10:00から販売が始まり、混雑する時間帯は公式アプリの整理券で案内されます。
        </li>
        <li>
          <strong>事前決済の「会場受け取り」</strong>もあり、受け取り場所は横浜ランドマークホール（Kアリーナ横浜から徒歩20分以上）。ライブ会場とは別の場所なので、移動時間を見込んでおきましょう。
        </li>
        <li>館外のコインロッカーが使えるのも公演日の10:00から。午前中に物販で買ったものを預けて、身軽に過ごせます。</li>
      </ul>
      <p>
        グッズの価格や整理券の配布日は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」で詳しくまとめています。
      </p>

      <H2 id="around" num={7}>
        開場前に寄れる周辺スポット
      </H2>
      <p>
        会場のまわりには、時間をつぶしたり、ごはんを食べたりできる場所がそろっています。公式アクセスページで紹介されている主な施設は次のとおりです。
      </p>
      <ul>
        <li>
          <strong>商業施設：</strong>横浜ベイクォーター、横浜ポルタ、スカイビル、そごう・西武横浜店（どれも横浜駅東口側）
        </li>
        <li>
          <strong>ホテル：</strong>ヒルトン・ガーデン・イン横浜みなとみらい、THE SPLAISIR YOKOHAMA、三井ガーデンホテル横浜みなとみらいプレミア、横浜東急REIホテル、京急EXイン横浜駅東口 など
        </li>
        <li>
          <strong>温浴施設：</strong>RAKUSPA BAY、万葉倶楽部 MM21（遠征の疲れを取りたい人に）
        </li>
      </ul>
      <Card kind="memo" label="会場まわりのマナー">
        <p>
          Kアリーナ横浜のまわりには住宅地もあります。公演前後に会場周辺に長くとどまらない、大きな声で騒がない、など近隣への配慮を忘れずに。
        </p>
      </Card>

      <MochicoNudge title="ライブごとに「買うもの」「買ったもの」を残すなら">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。予約受付や販売開始の日時も登録できるので、物販の前の買い物リストにも、終わったあとの記録にも使えます。
        </p>
      </MochicoNudge>
      <p>
        遠征の持ち物は「
        <Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>
        」、物販のリストの作り方は「
        <Link href="/blog/live-goods-shopping-list">ライブ物販の買い物リストの作り方</Link>
        」も参考にしてください。
      </p>

      <H2 id="links" num={8}>
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
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（Kアリーナ横浜公演の物販・会場受け取り）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
