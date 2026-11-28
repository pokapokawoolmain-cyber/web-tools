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
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("aichi-sky-expo-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "Aichi Sky Expo アクセス",
  "Aichi Sky Expo コインロッカー",
  "Aichi Sky Expo ライブ 帰り",
  "愛知県国際展示場 ライブ",
  "Aichi Sky Expo ホールA 座席",
  "Aichi Sky Expo 駐車場",
  "セントレア ライブ 会場",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ（空港のとなりの展示場）" },
  { id: "access", label: "行き方：名鉄・空港バス・高速船・車" },
  { id: "hall", label: "ホールAの座席と見え方" },
  { id: "locker", label: "ロッカーは6か所・100円硬貨のみ" },
  { id: "food", label: "飲食・トイレ・電波" },
  { id: "parking", label: "車で行く人へ（12/14〜24 は駐車場閉鎖）" },
];

/** 自作の図：名古屋から会場までの道のり */
function RouteFlow() {
  return (
    <svg viewBox="0 0 360 250" role="img" aria-labelledby="ae-title ae-desc">
      <title id="ae-title">名古屋から Aichi Sky Expo までの道のり</title>
      <desc id="ae-desc">名鉄名古屋駅から名鉄の特急ミュースカイで最速28分（特別車両券が必要）、一般の特急で約37分。中部国際空港駅から連絡通路を歩いて約5分で会場のメインエントランス。空港バスや高速船、車でも行ける。</desc>
      <rect x="8" y="10" width="150" height="56" rx="12" fill="#ffe4f0" />
      <text x="83" y="34" fontSize="12.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        名鉄名古屋駅
      </text>
      <text x="83" y="53" fontSize="10.5" fill="#be185d" fontWeight="700" textAnchor="middle">
        名鉄 空港線方面
      </text>
      <path d="M158 38 L 196 38" stroke="#be185d" strokeWidth="4" markerEnd="url(#aeArrow)" />
      <defs>
        <marker id="aeArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L 8 4 L 0 8 z" fill="#be185d" />
        </marker>
      </defs>
      <rect x="202" y="10" width="150" height="56" rx="12" fill="#e0f0ff" />
      <text x="277" y="34" fontSize="12.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        中部国際空港駅
      </text>
      <text x="277" y="53" fontSize="10.5" fill="#1d5fae" fontWeight="700" textAnchor="middle">
        セントレア
      </text>
      <text x="14" y="92" fontSize="11" fontWeight="800" fill="#1b1430">
        ミュースカイで最速28分
      </text>
      <text x="14" y="109" fontSize="10.5" fill="#3e3756">
        （特別車両券が必要）
      </text>
      <text x="14" y="126" fontSize="10.5" fill="#3e3756">
        一般の特急 約37分・準急 約48分
      </text>
      <path d="M277 66 L 277 140" stroke="#1d5fae" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <text x="290" y="108" fontSize="10.5" fill="#1d5fae" fontWeight="800">
        連絡通路を
      </text>
      <text x="290" y="124" fontSize="10.5" fill="#1d5fae" fontWeight="800">
        徒歩約5分
      </text>
      <rect x="160" y="146" width="192" height="58" rx="14" fill="#3b1d5e" />
      <text x="256" y="172" fontSize="13.5" fontWeight="900" fill="#fff" textAnchor="middle">
        Aichi Sky Expo
      </text>
      <text x="256" y="191" fontSize="10.5" fill="#f5e6ff" textAnchor="middle">
        メインエントランスから入場
      </text>
      <rect x="8" y="146" width="140" height="94" rx="12" fill="#fff6cc" />
      <text x="78" y="168" fontSize="11.5" fontWeight="900" fill="#1b1430" textAnchor="middle">
        ほかの行き方
      </text>
      <text x="78" y="188" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        空港バス（名古屋駅・栄など）
      </text>
      <text x="78" y="206" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        高速船（津から）
      </text>
      <text x="78" y="224" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        タクシー 名古屋駅から約50分
      </text>
    </svg>
  );
}

/** 自作の図：ロッカーの場所 */
function LockerMap() {
  const rows = [
    { t: "エントランスホール①（オレンジ）", d: "超大型24口 800円・中型36口 600円", n: 60 },
    { t: "エントランスホール②（イエロー）", d: "超大型24口 800円・中型36口 600円", n: 60 },
    { t: "北モール（グリーン）", d: "大型・中型・小型 計20口", n: 20 },
    { t: "中央モール（ピンク）", d: "大型・中型・小型 計20口", n: 20 },
    { t: "南モール（ブルー）", d: "大型・中型・小型 計20口", n: 20 },
    { t: "カフェE（ホワイト）", d: "中型12口 600円", n: 12 },
  ];
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="al-title al-desc">
      <title id="al-title">Aichi Sky Expo のコインロッカー（公式）</title>
      <desc id="al-desc">館内6か所、合わせて約190口。エントランスホールの2か所に超大型と中型、モールの3か所に大型・中型・小型、カフェEに中型。100円硬貨・現金のみ。</desc>
      {rows.map((r, i) => (
        <g key={r.t}>
          <text x="10" y={20 + i * 46} fontSize="11.5" fontWeight="900" fill="#1b1430">
            {r.t}
          </text>
          <rect x="10" y={27 + i * 46} width={(r.n / 60) * 230} height="12" rx="4" fill={i < 2 ? "#b8285d" : "#ffc6da"} />
          <text x={16 + (r.n / 60) * 230} y={37 + i * 46} fontSize="10.5" fontWeight="900" fill="#b8285d">
            {r.n}口
          </text>
          <text x="10" y={52 + i * 46} fontSize="10" fill="#3e3756">
            {r.d}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Page() {
  const milk = LIVE_LISTS.milk;
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>Aichi Sky Expo</mark>完全ガイド：アクセス・ロッカー・ホールAの見え方
        </>
      }
      heroLead="中部国際空港（セントレア）のとなりにある、日本初の空港直結型の展示場。名古屋から電車で約30〜40分、ロッカーは100円硬貨だけ、ホールAは平らな床。ライブで初めて行く人向けに、公式の案内とファンの声を図つきでまとめました。"
      stickers={["✈️ 会場ガイド", "🚃 名鉄ミュースカイ", "🔐 100円硬貨のみ", "🅿️ 駐車場の閉鎖期間"]}
      unofficialNote="この記事は、Aichi Sky Expo（愛知県国際展示場）の公式サイトと、ファンのブログなどの情報をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。会場の運営会社とは関係ありません。図はすべて編集部が作った簡略図です。座席や物販の場所は公演ごとに変わるので、主催者の案内も確認してください（2026年11月29日時点）。"
    >
      <p>
        <strong>Aichi Sky Expo（愛知県国際展示場）</strong>は、2019年に常滑市の空港島に開業した、日本初の空港直結型の展示場。ふだんは展示会の会場ですが、ホールAはライブ会場としても使われています。12月は M!LK のアリーナツアー（12/12・13）が予定されています。
      </p>
      <p>
        名古屋の中心からは少し離れていますが、<span className={s.hl}>空港の駅から屋根のある通路で歩いて5分</span>。帰りの電車の時刻と、100円玉の用意さえ押さえておけば安心です。
      </p>

      <Tldr
        items={[
          <>名鉄名古屋駅からミュースカイで最速28分（特別車両券が必要）。中部国際空港駅から徒歩約5分</>,
          <>ロッカーは館内6か所・約190口で、100円硬貨・現金のみ。両替はビジネスセンター</>,
          <>ホールAは平らな床。12/14〜12/24 は会場の駐車場が閉鎖される</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ（空港のとなりの展示場）
      </H2>
      <Stats
        items={[
          { num: <>5<small>分</small></>, label: "中部国際空港（駅・ターミナル）から徒歩" },
          { num: <>28<small>分</small></>, label: "名鉄名古屋からミュースカイで（最速）" },
          { num: <>約190<small>口</small></>, label: "コインロッカー（館内6か所）" },
          { num: <>2019<small>年</small></>, label: "開業（日本初の空港直結型）" },
        ]}
      />
      <p>住所は愛知県常滑市セントレア5丁目10番1号。中部国際空港の駅の改札から連絡通路を通って、展示場のメインエントランスに入ります。</p>

      <H2 id="access" num={2}>
        行き方：名鉄・空港バス・高速船・車
      </H2>
      <Figure caption="編集部作成。所要時間は公式アクセスページとファンのガイド記事の目安です。">
        <RouteFlow />
      </Figure>
      <ul>
        <li>
          <strong>名鉄：</strong>名鉄名古屋駅から中部国際空港駅へ。全車特別車両の「ミュースカイ」なら最速28分（乗車券のほかに特別車両券が必要）。一般の特急は約37分です。
        </li>
        <li>
          <strong>空港バス：</strong>名古屋駅・栄・藤が丘・金城ふ頭などからセントレアの空港バス乗り場へ。
        </li>
        <li>
          <strong>高速船：</strong>三重の津（なぎさまち）とセントレアの間を毎日運航。船着場から徒歩約5分。
        </li>
        <li>
          <strong>タクシー：</strong>名古屋駅・栄から約50分、約16,000円（有料道路代は別）。
        </li>
        <li>
          <strong>飛行機：</strong>中部国際空港のターミナルから徒歩約5分。遠征組には便利な会場です。
        </li>
      </ul>
      <Bubble>帰りの名鉄はライブ終わりの人でいっぱいになりがち。名古屋駅から新幹線に乗るなら、名鉄の時刻を先に調べて、余裕のある便を選んでおこう。</Bubble>

      <H2 id="hall" num={3}>
        ホールAの座席と見え方
      </H2>
      <ul>
        <li>ファンのガイドでは、ホールAは約100m四方の正方形で<strong>平らな床</strong>。座席は公演ごとに組まれ、A・B・C…のブロック制になることが多いとされています。</li>
        <li>前方は神席、後方や端は前の人の頭で見えにくいことがあります。双眼鏡の目安は前方で不要〜4倍、中ほどで6〜8倍、後方・端で8〜10倍（ファンのガイドの推定）。</li>
        <li>物販や会場受取は、ライブのホールとは別のホールになることがあります（M!LK の愛知公演は会場受取がホールB）。</li>
      </ul>

      <ArticleAd />

      <H2 id="locker" num={4}>
        ロッカーは6か所・100円硬貨のみ
      </H2>
      <Figure caption="編集部作成。数は公式「手荷物預かりサービス」ページの口数を編集部が集計したものです。">
        <LockerMap />
      </Figure>
      <Card kind="caution" label="100円玉を多めに">
        <p>ロッカーは<strong>100円硬貨・現金のみ</strong>。両替は館内のビジネスセンターです。超大型（800円）は100円玉8枚。家を出る前に用意しておきましょう。大きな公演では埋まりやすいという声もあります。</p>
      </Card>

      <H2 id="food" num={5}>
        飲食・トイレ・電波
      </H2>
      <ul>
        <li>館内にフードコート（モールから入れる）、常設カフェ2か所、売店（弁当・飲み物）、自動販売機があります。</li>
        <li>となりの中部国際空港にも飲食店がたくさん。常滑・セントレア・イオンモール常滑の対象店で使える「とこなめおもてなしクーポン」も総合案内などで配られています。</li>
        <li>多目的トイレは展示ホールA〜Fに各3か所。授乳室・ベビーシートもあります。車いすは総合案内で無料貸し出し（5台）。</li>
        <li>ファンのガイドでは「ホール内は電波が弱い」という声も。電子チケットは入場前に表示を確認しておきましょう。</li>
      </ul>

      <H2 id="parking" num={6}>
        車で行く人へ（12/14〜24 は駐車場閉鎖）
      </H2>
      <ul>
        <li>第1・第2駐車場があり、24時間入出庫できます（事前予約不可）。支払いはクレジット・交通系IC・電子マネー・QR・現金。</li>
        <li>セントレア東ICから約2分。普通車は高さ2.5mまで。</li>
      </ul>
      <Card kind="caution" label="駐車場の閉鎖期間">
        <p>
          公式のお知らせによると、<strong>2026年12月14日(月)〜12月24日(木)は第1・第2駐車場が閉鎖</strong>され、12/13 中の出庫が必要です。12/12・13 の M!LK 公演の日は使えますが、出し忘れに注意。閉鎖期間中はセントレアの空港駐車場が案内されています。
        </p>
      </Card>

      <h3>12月の Aichi Sky Expo のライブ</h3>
      <p>
        <strong>M!LK「シャカリキレボリューション」12/12(土)・13(日)</strong>：グッズと会場受取は「<Link href="/blog/milk-shakariki-revolution-aichi-goods">M!LK 愛知公演のグッズガイド</Link>」で
        {milk.listUrl && (
          <>
            、リストは <a href={milk.listUrl} rel="nofollow">Mochico</a> で公開しています
          </>
        )}
        。
      </p>
      <MochicoNudge title="ライブで買ったグッズを、公演ごとに残すなら">
        <p>「Mochico（モチコ）」は、ライブごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。</p>
      </MochicoNudge>

      <OfficialLinks
        items={[
          { href: "https://www.aichiskyexpo.com/access/", title: "アクセス（公式）", icon: "🚃" },
          { href: "https://www.aichiskyexpo.com/visitors/storageservice/", title: "手荷物預かり・ロッカー（公式）", icon: "🔐" },
          { href: "https://www.aichiskyexpo.com/parking/", title: "駐車場（公式）", icon: "🅿️" },
          { href: "https://www.aichiskyexpo.com/visitors/floormap/", title: "フロアマップ（公式）", icon: "🗺️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.aichiskyexpo.com/access/", label: "Aichi Sky Expo「アクセス」（名鉄・ミュースカイ・空港バス・高速船・タクシー）" },
          { href: "https://www.aichiskyexpo.com/visitors/storageservice/", label: "Aichi Sky Expo「手荷物預かりサービス」（ロッカーの場所・口数・料金・100円硬貨のみ）" },
          { href: "https://www.aichiskyexpo.com/parking/", label: "Aichi Sky Expo「駐車場」（台数・支払い・閉鎖のお知らせ）" },
          { href: "https://www.aichiskyexpo.com/visitors/restaurant_list/", label: "Aichi Sky Expo「レストラン情報」（館内・空港エリアの飲食）" },
          { href: "https://www.aichiskyexpo.com/visitors/floormap/", label: "Aichi Sky Expo「フロアマップ」（トイレ・授乳室）" },
          { href: "https://nerutokonavi.com/venue-guide/aichi-sky-expo/", label: "NERUTOKO「Aichi Sky Expo 完全ガイド」（所要時間・ホテル）" },
          { href: "https://lignea.co.jp/aichi-sky-expo-seat/", label: "LIGNEA「Aichi Sky Expo 座席の見え方」（ホールA・双眼鏡・電波）" },
          { href: "https://sd-milk.com/contents/1132253", label: "M!LK OFFICIAL SITE「愛知公演 事前購入・会場受取」（受取場所 ホールB）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
