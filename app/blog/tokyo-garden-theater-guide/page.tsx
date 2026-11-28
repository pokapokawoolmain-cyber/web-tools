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

const post = getBlogPost("tokyo-garden-theater-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "東京ガーデンシアター アクセス",
  "東京ガーデンシアター コインロッカー",
  "東京ガーデンシアター バルコニー 見え方",
  "東京ガーデンシアター 帰り 混雑",
  "東京ガーデンシアター 双眼鏡",
  "東京ガーデンシアター 最寄り駅",
  "有明ガーデン ライブ",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "3つの駅：ゆりかもめは有明テニスの森がおすすめ" },
  { id: "floor", label: "フロアと座席：アリーナ＋バルコニー3層" },
  { id: "locker", label: "ロッカーは現金不可・クロークなし" },
  { id: "inside", label: "売店・トイレ・喫煙室・Wi-Fi" },
  { id: "exit", label: "帰りの混雑と、有明ガーデンでの時間調整" },
];

/** 自作の図：フロアの構成 */
function FloorStack() {
  const rows = [
    { f: "5F", t: "バルコニー3", d: "いちばん上。見下ろしでもステージは見える", fill: "#efe9ff" },
    { f: "4F", t: "バルコニー2", d: "手すりにガラスがある席も", fill: "#f4f2f8" },
    { f: "3F", t: "バルコニー1", d: "意外と高くなく見やすい・授乳室・車いす席", fill: "#e9f8f2" },
    { f: "2F", t: "アリーナ", d: "平らな床。レイアウトは公演ごと", fill: "#fff6cc" },
  ];
  return (
    <svg viewBox="0 0 360 250" role="img" aria-labelledby="tg2-title tg2-desc">
      <title id="tg2-title">東京ガーデンシアターのフロア構成（簡略図）</title>
      <desc id="tg2-desc">2階がアリーナ、3階がバルコニー1、4階がバルコニー2、5階がバルコニー3。入場口から各階へはエレベーターがあるが、座席へは階段の移動がある。</desc>
      {rows.map((r, i) => (
        <g key={r.f}>
          <rect x={8 + i * 18} y={8 + i * 56} width={344 - i * 18} height="48" rx="12" fill={r.fill} />
          <text x={22 + i * 18} y={38 + i * 56} fontSize="15" fontWeight="900" fill="#5a2fd2">
            {r.f}
          </text>
          <text x={62 + i * 18} y={28 + i * 56} fontSize="12.5" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <text x={62 + i * 18} y={46 + i * 56} fontSize="10.5" fill="#3e3756">
            {r.d}
          </text>
        </g>
      ))}
      <text x="12" y="244" fontSize="10.5" fill="#625b7c">
        ※ ステージから最も遠い席でも約54m（ファンが会場公式の数字として紹介）
      </text>
    </svg>
  );
}

/** 自作の図：ロッカーの数の分布 */
function LockerBars() {
  const rows = [
    { t: "3F 館外 コインロッカー室（小・中）", n: 464 },
    { t: "1F 館外 ホテル軒下（小・中・大）", n: 210 },
    { t: "4・5F 館内 ホワイエ北（小・中）", n: 160 },
    { t: "2F 館内 ホワイエ北（小）", n: 68 },
    { t: "3〜5F バゲッジポート（キャリー用）", n: 15 },
  ];
  const max = 464;
  return (
    <svg viewBox="0 0 360 220" role="img" aria-labelledby="tl-title tl-desc">
      <title id="tl-title">東京ガーデンシアターのロッカーの数（ファンの調べ）</title>
      <desc id="tl-desc">3階館外のコインロッカー室に464、1階館外のホテル軒下に210、4・5階館内に160、2階館内に68、キャリーバッグ用のバゲッジポートが15。大サイズは1階館外の65個だけ。</desc>
      {rows.map((r, i) => (
        <g key={r.t}>
          <text x="10" y={20 + i * 40} fontSize="11" fontWeight="800" fill="#1b1430">
            {r.t}
          </text>
          <rect x="10" y={26 + i * 40} width={(r.n / max) * 290} height="14" rx="5" fill={i === 0 ? "#5a2fd2" : "#b9a6f5"} />
          <text x={16 + (r.n / max) * 290} y={38 + i * 40} fontSize="11" fontWeight="900" fill="#5a2fd2">
            {r.n}
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
          <mark>東京ガーデンシアター</mark>完全ガイド：アクセス・ロッカー・バルコニー席
        </>
      }
      heroLead="有明ガーデンのとなりにある約8,000人の劇場型ホール。アリーナと3層のバルコニー、現金の使えないロッカー、クロークなし。初めて行く人がつまずきやすいポイントを、公式の案内とファンの体験談をもとに図つきでまとめました。"
      stickers={["🎭 会場ガイド", "🚃 3つの駅", "🔐 ロッカー約900個", "🪑 バルコニー"]}
      unofficialNote="この記事は、東京ガーデンシアターの公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ロッカーの数・料金はファンの調べ（2026年9月時点）で、変わっている場合があります（2026年11月28日時点）。"
    >
      <p>
        江東区有明の<strong>東京ガーデンシアター</strong>は、2020年に開業した最大約8,000人の劇場型ホール。ショッピングモール「有明ガーデン」と隣り合っていて、ライブの前後に食事や温泉まで楽しめるのが魅力です。11/6 には KAWAII LAB. のファンクラブ限定フリーライブが開かれ、12/9 には CANDY TUNE のライブも予定されています。
      </p>
      <p>
        ただし、<span className={s.hl}>ロッカーは現金不可・館内にクロークなし</span>、近くの有明アリーナと公演が重なると駅が混雑する、など知っておきたいポイントがあります。
      </p>

      <Tldr
        items={[
          <>駅はゆりかもめ有明（4分）・有明テニスの森（5分）、りんかい線 国際展示場（7分）。公式は有明テニスの森をすすめている</>,
          <>ロッカーは電子マネー・クレジットのみ（現金不可）。大サイズは館外1階だけ。クロークはない</>,
          <>アリーナ（2F）＋バルコニー1〜3（3〜5F）。最も遠い席でも約54mで、6〜10倍の双眼鏡が目安</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>約8,000<small>人</small></>, label: "最大収容（公式）" },
          { num: <>4<small>分</small></>, label: "ゆりかもめ有明駅2B出口から徒歩" },
          { num: <>約900<small>個</small></>, label: "ロッカー・バゲッジポートの合計（ファンの調べ）" },
          { num: <>約300<small>基</small></>, label: "全フロアのトイレの便器（公式）" },
        ]}
      />
      <p>住所は東京都江東区有明2-1-6。来場者用の駐車場・駐輪場はなく、有明ガーデンの駐車場（予約不可）を使います。</p>

      <H2 id="access" num={2}>
        3つの駅：ゆりかもめは有明テニスの森がおすすめ
      </H2>
      <div className={s.tableWrap} role="region" aria-label="最寄り駅" tabIndex={0}>
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
              <th scope="row">ゆりかもめ 有明</th>
              <td>2B出口</td>
              <td>約4分</td>
            </tr>
            <tr>
              <th scope="row">ゆりかもめ 有明テニスの森</th>
              <td>2A出口</td>
              <td>約5分</td>
            </tr>
            <tr>
              <th scope="row">りんかい線 国際展示場</th>
              <td>A出口</td>
              <td>約7分</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：東京ガーデンシアター公式「アクセス」。公式FAQは、ゆりかもめを使う人に、混雑しやすい有明駅より有明テニスの森駅をすすめています。</p>
      <ul>
        <li>都営バスなら東京駅から約30分（「有明二丁目・有明ガーデン」バス停）。羽田空港からはリムジンバスで約30〜40分。</li>
        <li>タクシーの専用乗り場はなく、有明ガーデン1階のバスターミナル内の乗降場から、タブレットかスマホで手配します。</li>
      </ul>

      <H2 id="floor" num={3}>
        フロアと座席：アリーナ＋バルコニー3層
      </H2>
      <Figure caption="編集部作成の簡略図（公式フロアガイドとファンの体験談をもとに作成）。アリーナのレイアウトは公演ごとに変わります。">
        <FloorStack />
      </Figure>
      <FanVoices
        title="座席についての体験談（まとめ）"
        items={[
          { text: "バルコニー1は意外と高さがなく、アーティストが見やすかった", from: "会場ガイド記事に引用された投稿より" },
          { text: "バルコニー2・3は見下ろす形だが、ステージはちゃんと見える", from: "複数のファンの投稿より" },
          { text: "バルコニー2・3の手すりにはガラスがある席があり、身長によっては視界に重なる", from: "会場ガイド記事より" },
          { text: "双眼鏡はアリーナ中央〜後方で6〜8倍、バルコニー3の正面後方で8〜10倍が目安", from: "座席解説記事の推定" },
        ]}
      />
      <p>入場口から各階へはエレベーターで移動でき、座席までは階段があります（公演によってエレベーターの利用が制限される場合あり）。</p>

      <ArticleAd />

      <H2 id="locker" num={4}>
        ロッカーは現金不可・クロークなし
      </H2>
      <Figure caption="編集部作成。数はファンのガイド記事（会場公式の「コインロッカーリニューアルのお知らせ」を引用、2026年9月時点）によります。">
        <LockerBars />
      </Figure>
      <ul>
        <li>
          <strong>支払い：</strong>コインロッカーは電子マネー・クレジットカードのみ（<strong>現金不可</strong>）。キャリーバッグ用のバゲッジポートは電子マネーのみ。
        </li>
        <li>
          <strong>料金の目安：</strong>小400円・中600円・大800円、バゲッジポート800円。<strong>大サイズは館外1階（ホテル軒下）の65個だけ</strong>です。
        </li>
        <li>
          <strong>クロークはありません。</strong>館内のロッカーは公演終了後まで、館外1階（ホテル軒下）は24時間使えます。
        </li>
      </ul>
      <Bubble>交通系ICにチャージしておけば、ロッカーも自販機もこれ1枚でOK。大きいキャリーは館外1階のロッカーに直行しよう。</Bubble>

      <H2 id="inside" num={5}>
        売店・トイレ・喫煙室・Wi-Fi
      </H2>
      <ul>
        <li>3〜5階にドリンク売店（軽食・アルコールも）、2階にタリーズコーヒーのカウンター。営業はふだん開場〜開演30分後。<strong>4階の売店は現金不可</strong>です。</li>
        <li>自動販売機は2階・4階（現金・電子マネー・交通系IC）。</li>
        <li>多機能トイレは2・3階に各1か所、4・5階に各2か所。公演によっては男女の振り替えがあります。</li>
        <li>喫煙室は各階にあります（紙・電子たばこ。公演によっては使えない）。授乳室は3階バルコニー1。</li>
        <li>フリー Wi-Fi「Ariake_Garden FreeWifi」が使えます。</li>
      </ul>

      <H2 id="exit" num={6}>
        帰りの混雑と、有明ガーデンでの時間調整
      </H2>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "規制退場が入ると、会場を出るまで最大30分前後かかることも（公演による）", from: "遠征ガイド記事より" },
          { text: "有明アリーナと東京ガーデンシアターの公演が同じ時間に終わり、有明テニスの森駅付近がとても混雑した日があった", from: "東京BRTの公式Xの案内（ガイド記事が引用）" },
          { text: "ゆりかもめが混んでいたら、りんかい線の国際展示場駅へ回るのが手", from: "遠征ガイド記事より" },
          { text: "ライブ前後は有明ガーデンの飲食店がとても混む。1階のスーパーで買うか、豊洲・大井町で食べる人も", from: "会場ガイド記事より" },
        ]}
      />
      <Card kind="memo" label="有明ガーデンで時間をずらす">
        <p>
          有明ガーデンには約170店舗、飲食店は約60店舗（夜11時まで営業、一部を除く）。温浴施設「泉天空の湯」もあり、混雑のピークをやり過ごすのにちょうどいい場所です。公式ホテル「ヴィラフォンテーヌ グランド 東京有明」もすぐそばです。
        </p>
      </Card>
      <p>
        11/6 の KAWAII LAB. フリーライブの物販や、4グループのグッズは「<Link href="/blog/kawaii-lab-live-goods">KAWAII LAB. のライブグッズまとめ</Link>」にまとめています。
      </p>
      <MochicoNudge title="ライブで買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/access/", title: "アクセス（公式）", icon: "🚃" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/visitor/floor/", title: "フロアガイド（公式）", icon: "🎭" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/faq/", title: "よくあるご質問（公式）", icon: "❓" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/", label: "東京ガーデンシアター公式（収容・住所・公演予定）" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/access/", label: "東京ガーデンシアター「アクセス」（駅・バス・タクシー・駐車場）" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/faq/", label: "東京ガーデンシアター「よくあるご質問」（有明テニスの森駅のすすめ・クローク・Wi-Fi・授乳室）" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/visitor/floor/", label: "東京ガーデンシアター「フロアガイド」（階の構成・ロッカー・売店・トイレ）" },
          { href: "https://www.shopping-sumitomo-rd.com/tokyo_garden_theater/visitor/hall/", label: "東京ガーデンシアター「ホール・有明ガーデン」（周辺施設）" },
          { href: "https://guidebridge.jp/tokyo-garden-theater-guide/", label: "guidebridge「東京ガーデンシアター」（ロッカーの数・料金・帰りの混雑）" },
          { href: "https://lignea.co.jp/tokyo-garden-theater-seat/", label: "LIGNEA「東京ガーデンシアター 座席の見え方」（ブロック・双眼鏡）" },
          { href: "https://nerutokonavi.com/venue-guide/tokyo-garden-theater/", label: "NERUTOKO「東京ガーデンシアター 完全ガイド」（手すり・飲食店の混雑）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
