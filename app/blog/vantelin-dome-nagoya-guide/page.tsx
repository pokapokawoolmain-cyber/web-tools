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

const post = getBlogPost("vantelin-dome-nagoya-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "バンテリンドーム アクセス",
  "バンテリンドーム 帰り 混雑",
  "バンテリンドーム コインロッカー",
  "バンテリンドーム 大曽根 歩く",
  "バンテリンドーム 持ち込み",
  "ナゴヤドーム ライブ 12月",
  "バンテリンドーム 天井席 双眼鏡",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ" },
  { id: "access", label: "行きは地下鉄、帰りは大曽根まで歩くのが定番" },
  { id: "locker", label: "ロッカーは2階コンコースの5か所だけ" },
  { id: "rules", label: "持ち込み禁止のもの・支払い・喫煙" },
  { id: "seat", label: "座席の見え方と双眼鏡" },
  { id: "dec", label: "12月のバンテリンドームのライブ" },
];

/** 自作の図：2つの駅と帰りの分散（簡略図） */
function RouteMap() {
  return (
    <svg viewBox="0 0 360 290" role="img" aria-labelledby="vd-title vd-desc">
      <title id="vd-title">バンテリンドーム ナゴヤへの行き方と帰り方（簡略図）</title>
      <desc id="vd-desc">
        地下鉄名城線とゆとりーとラインのナゴヤドーム前矢田駅1番出入口から徒歩約5分。JR中央線と名鉄瀬戸線の大曽根駅から徒歩約15分。帰りは矢田駅への通路が混むので、大曽根駅まで歩く人が多い。
      </desc>
      <rect x="0" y="0" width="360" height="290" fill="#fbf9ff" />
      <ellipse cx="250" cy="96" rx="92" ry="56" fill="#1b2f4a" />
      <text x="250" y="92" fontSize="14" fontWeight="900" fill="#fff" textAnchor="middle">
        バンテリンドーム
      </text>
      <text x="250" y="112" fontSize="10.5" fill="#cfe0ff" textAnchor="middle">
        東区大幸南1-1-1
      </text>
      <rect x="8" y="40" width="140" height="62" rx="12" fill="#dcf7ec" stroke="#047857" strokeWidth="1.5" />
      <text x="78" y="62" fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        ナゴヤドーム前矢田駅
      </text>
      <text x="78" y="80" fontSize="10.5" fontWeight="800" fill="#047857" textAnchor="middle">
        1番出入口・徒歩約5分
      </text>
      <text x="78" y="95" fontSize="9.5" fill="#3e3756" textAnchor="middle">
        地下鉄名城線・ゆとりーと
      </text>
      <path d="M148 72 L 160 82" stroke="#047857" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="8" y="196" width="160" height="78" rx="12" fill="#ffe4f0" stroke="#be185d" strokeWidth="1.5" />
      <text x="88" y="220" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        大曽根駅
      </text>
      <text x="88" y="239" fontSize="10.5" fontWeight="800" fill="#be185d" textAnchor="middle">
        徒歩約15分（帰りの定番）
      </text>
      <text x="88" y="257" fontSize="9.5" fill="#3e3756" textAnchor="middle">
        JR中央線・名鉄瀬戸線・地下鉄
      </text>
      <path d="M168 230 C 230 220, 250 190, 250 154" stroke="#be185d" strokeWidth="4" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="196" y="196" width="156" height="78" rx="12" fill="#fff6cc" />
      <text x="274" y="220" fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        名古屋駅まで
      </text>
      <text x="274" y="239" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        大曽根からJRで約13分
      </text>
      <text x="274" y="257" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        栄へは矢田から地下鉄約17分
      </text>
    </svg>
  );
}

export default function Page() {
  const bb = LIVE_LISTS.bigbang;
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>バンテリンドーム ナゴヤ</mark>完全ガイド：アクセス・ロッカー・帰りの混雑
        </>
      }
      heroLead="地下鉄の駅から徒歩5分と行きは楽でも、帰りは駅までの通路がびっしり。ロッカーは2階コンコースの5か所だけ。名古屋のドームで困らないために、公式の案内とファンの体験談を図つきでまとめました。"
      stickers={["🏟️ 会場ガイド", "🚃 矢田・大曽根", "🔐 ロッカー", "🚶 帰りの混雑"]}
      unofficialNote="この記事は、バンテリンドーム ナゴヤの公式サイトと、ファンのブログなどの体験談をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。ルールや動線は公演ごとに変わるので、主催者の最新情報もあわせて確認してください（2026年11月28日時点）。"
    >
      <p>
        名古屋市東区の<strong>バンテリンドーム ナゴヤ</strong>は、1997年に開業したドーム。アリーナを使うライブでは最大約4万9千人が入ります。12月は BIGBANG（12/5・6）や ENHYPEN（12/26・27）の公演が予定されています。
      </p>
      <p>
        いちばんの注意点は<span className={s.hl}>帰り</span>。最寄りのナゴヤドーム前矢田駅へ向かう通路が人で埋まり、改札に入るまで数十分かかることも。帰りのルートを先に決めておきましょう。
      </p>

      <Tldr
        items={[
          <>行きは地下鉄名城線「ナゴヤドーム前矢田駅」1番出入口から徒歩約5分</>,
          <>帰りは矢田駅への通路が大混雑。JR・名鉄の大曽根駅（徒歩約15分）まで歩くのが定番</>,
          <>ロッカーは2階コンコースの5か所だけで、ほかの荷物預かりはなし。名古屋駅やホテルに預けてから</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ
      </H2>
      <Stats
        items={[
          { num: <>49,185<small>人</small></>, label: "最大収容（アリーナ使用時・公式）" },
          { num: <>5<small>分</small></>, label: "ナゴヤドーム前矢田駅から徒歩" },
          { num: <>5<small>か所</small></>, label: "ロッカー（2階コンコース）" },
          { num: <>64.3<small>m</small></>, label: "天井の高さ（地上6階）" },
        ]}
      />
      <p>住所は名古屋市東区大幸南一丁目1番1号。総合案内所は2階の1ゲート付近にあり、原則として開場1時間前から開いています。</p>

      <H2 id="access" num={2}>
        行きは地下鉄、帰りは大曽根まで歩くのが定番
      </H2>
      <Figure caption="編集部作成の簡略図。位置関係・距離は実際の縮尺ではありません。所要時間は公式アクセスページの目安です。">
        <RouteMap />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="主なアクセス" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">駅</th>
              <th scope="col">徒歩</th>
              <th scope="col">主な所要時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">ナゴヤドーム前矢田（地下鉄名城線・ゆとりーとライン）</th>
              <td>1番出入口から約5分</td>
              <td>栄から約17分、金山から約24分</td>
            </tr>
            <tr>
              <th scope="row">大曽根（JR中央線・名鉄瀬戸線）</th>
              <td>約15分</td>
              <td>名古屋からJRで約13分</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：バンテリンドーム ナゴヤ公式「アクセス」。駐車場はありますが、イベント日の料金は要確認で、混雑するため公共交通機関がおすすめです。</p>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "規制退場がとても厳しく、退場後は駅までの通路が人で埋まって牛歩状態", from: "会場ガイド記事より" },
          { text: "ナゴヤドーム前矢田駅は、改札に入るまで数十分かかることもザラ", from: "会場ガイド記事より" },
          { text: "人混みで立ち止まるより、大曽根駅まで15〜20分歩くほうが早いことが多い", from: "会場ガイド記事より" },
          { text: "新幹線の時間が迫っているなら、矢田駅のルートだけに頼るのは危険", from: "会場ガイド記事より" },
        ]}
      />
      <Bubble>名古屋駅から新幹線で帰る人は、大曽根からJRに乗るのがいちばん分かりやすいよ。終演から2時間くらいあけた便にしておくと安心。</Bubble>

      <H2 id="locker" num={3}>
        ロッカーは2階コンコースの5か所だけ
      </H2>
      <ul>
        <li>
          公式によると、コインロッカーは<strong>2階コンコースの5か所</strong>で、数に限りがあります。<strong>ほかの荷物預かりサービスはありません</strong>。
        </li>
        <li>ファンの体験談では、ナゴヤドーム前矢田駅のロッカーはすぐ埋まり、となりのイオンモールのロッカーは営業時間の制限があるとのこと。</li>
        <li>キャリーケースは、名古屋駅のロッカーか宿泊先のホテルに預けてから向かうのが鉄則です。</li>
      </ul>

      <ArticleAd />

      <H2 id="rules" num={4}>
        持ち込み禁止のもの・支払い・喫煙
      </H2>
      <ul>
        <li>
          プロ野球以外のイベント時は、<strong>ビン・カン・飲食物・クーラーボックス</strong>、自分の席に置けない大きな荷物などは持ち込めません。入場時に手荷物検査（金属探知機の場合も）があります。
        </li>
        <li>食物アレルギーのある人は、本人が食べる分に限り飲食物を持ち込めます（手荷物検査で申し出る）。</li>
        <li>館内の支払いはクレジットカード・電子マネー・コード決済が使えます（一部を除く）。</li>
        <li>館内は禁煙。電子たばこを含め、指定の喫煙所で。</li>
        <li>紙ふぶき・紙テープ・ジェット風船は使えません。</li>
      </ul>

      <H2 id="seat" num={5}>
        座席の見え方と双眼鏡
      </H2>
      <ul>
        <li>アリーナ席は床が平らで、後方は前の人の頭で見えにくいことがあります。</li>
        <li>
          スタンド上段の席（いわゆる天井席）について、ファンのガイドでは「ステージの人は米粒以下」として、<strong>10〜12倍以上の双眼鏡</strong>がすすめられています。
        </li>
        <li>2階・3階コンコースに授乳・おむつ替えのベビールームがあります。</li>
      </ul>
      <Card kind="memo" label="泊まるなら栄か名古屋駅">
        <p>公式は、宿泊施設が多いエリアとして、矢田駅から地下鉄で約17分の栄、大曽根からJRで約13分の名古屋駅周辺を案内しています。</p>
      </Card>

      <H2 id="dec" num={6}>
        12月のバンテリンドームのライブ
      </H2>
      <ul>
        <li>
          <strong>BIGBANG「XX : COSMOS」12/5(土)・6(日)</strong>：開場15:00・開演17:00。グッズは「<Link href="/blog/bigbang-xx-cosmos-japan-goods">BIGBANG「XX : COSMOS」グッズ完全ガイド</Link>」
          {bb.listUrl && (
            <>
              、リストは <a href={bb.listUrl} rel="nofollow">Mochico</a>
            </>
          )}
          で。名古屋限定のスウェットセットアップやお守りもあります。
        </li>
        <li>
          <strong>ENHYPEN「BLOOD SAGA」12/26(土)・27(日)</strong>：日本ツアーの名古屋公演。東京公演のグッズの買い方は「<Link href="/blog/enhypen-blood-saga-tokyo-dome-goods">ENHYPEN 東京ドームグッズ完全ガイド</Link>」を参考に。
        </li>
      </ul>
      <MochicoNudge title="ドームで買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.nagoya-dome.co.jp/enjoy/access.php", title: "アクセス（公式）", icon: "🚃" },
          { href: "https://www.nagoya-dome.co.jp/aboutus/onegai-etc.php", title: "イベント時のお願い（公式）", icon: "📋" },
          { href: "https://www.nagoya-dome.co.jp/aboutus/facilities.php", title: "館内施設（公式）", icon: "🏟️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.nagoya-dome.co.jp/enjoy/access.php", label: "バンテリンドーム ナゴヤ「アクセス」（駅・徒歩・所要時間・駐車場）" },
          { href: "https://www.nagoya-dome.co.jp/aboutus/gaiyo.php", label: "バンテリンドーム ナゴヤ「施設概要」（収容・開業・構造）" },
          { href: "https://www.nagoya-dome.co.jp/aboutus/facilities.php", label: "バンテリンドーム ナゴヤ「館内施設」（ロッカー・総合案内所・キャッシュレス）" },
          { href: "https://www.nagoya-dome.co.jp/aboutus/onegai-etc.php", label: "バンテリンドーム ナゴヤ「プロ野球以外のイベント時のお願い」（持ち込み・喫煙）" },
          { href: "https://nerutokonavi.com/venue-guide/vantelin-dome-nagoya/", label: "NERUTOKO「バンテリンドーム ナゴヤ 完全ガイド」（帰りの混雑・大曽根・双眼鏡）" },
          { href: "https://ygex.jp/bigbang/20th-anniv/", label: "BIGBANG 20TH ANNIVERSARY 公式サイト（名古屋公演の日程）" },
          { href: "https://www.hybejapan-concert.com/statics/enhypen_blood_saga", label: "HYBE JAPAN「ENHYPEN WORLD TOUR 'BLOOD SAGA' IN JAPAN」（名古屋公演の日程）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
