import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  Checklist,
  Figure,
  H2,
  MochicoListCard,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Stats,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";
import { GoodsBudget, LiveCountdown } from "../_components/oshi/LiveWidgets";
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("hey-say-jump-juliet-fukuoka-goods")!;
const list = LIVE_LISTS.jump;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "Hey! Say! JUMP Juliet グッズ",
  "Hey! Say! JUMP ドームツアー 2026 福岡",
  "JUMP Juliet 福岡 PayPayドーム",
  "Hey! Say! JUMP ペンライト 8000",
  "Juliet ツアー グッズ 値段",
  "Hey! Say! JUMP 東京ドーム 2026",
  "MERCH MARKET Hey! Say! JUMP",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "4大ドーム10公演の日程" },
  { id: "goods", label: "グッズ全12アイテムと予算計算" },
  { id: "rules", label: "購入制限・ペンライト・オンライン販売" },
  { id: "venue", label: "会場販売はどうなる？（発表待ち）" },
  { id: "day", label: "福岡公演の持ち物" },
];

const SHOWS = [
  { d: "12/12(土)", v: "みずほPayPayドーム福岡", t: "18:00" },
  { d: "12/13(日)", v: "みずほPayPayドーム福岡", t: "15:00" },
  { d: "12/19(土)", v: "バンテリンドーム ナゴヤ", t: "17:00" },
  { d: "12/20(日)", v: "バンテリンドーム ナゴヤ", t: "15:00" },
  { d: "12/29(火)", v: "東京ドーム", t: "17:00" },
  { d: "12/30(水)", v: "東京ドーム", t: "17:00" },
  { d: "1/1(金・祝)", v: "東京ドーム", t: "17:00" },
  { d: "1/10(日)", v: "京セラドーム大阪", t: "17:00" },
  { d: "1/11(月・祝)", v: "京セラドーム大阪", t: "17:00" },
  { d: "1/12(火)", v: "京セラドーム大阪", t: "16:00" },
];
const VENUE_GUIDE: Record<string, string> = {
  "みずほPayPayドーム福岡": "/blog/paypay-dome-fukuoka-guide",
  "バンテリンドーム ナゴヤ": "/blog/vantelin-dome-nagoya-guide",
  東京ドーム: "/blog/tokyo-dome-guide",
  京セラドーム大阪: "/blog/kyocera-dome-osaka-guide",
};

/** 自作の図：年末年始をまたぐツアーのカレンダー */
function TourCalendar() {
  const cities = [
    { c: "福岡", d: "12/12・13", fill: "#f3b9ca" },
    { c: "名古屋", d: "12/19・20", fill: "#e0577f" },
    { c: "東京", d: "12/29・30・1/1", fill: "#b3264f" },
    { c: "大阪", d: "1/10・11・12", fill: "#6b1636" },
  ];
  return (
    <svg viewBox="0 0 360 150" role="img" aria-labelledby="jp-title jp-desc">
      <title id="jp-title">Hey! Say! JUMP「Juliet」4大ドームツアーの流れ</title>
      <desc id="jp-desc">福岡12/12・13、名古屋12/19・20、東京12/29・30・1/1、大阪1/10・11・12の順に回る。</desc>
      <line x1="30" y1="60" x2="330" y2="60" stroke="#f3b9ca" strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
      {cities.map((c, i) => {
        const x = 45 + i * 90;
        return (
          <g key={c.c}>
            <circle cx={x} cy="60" r="26" fill={c.fill} />
            <text x={x} y="65" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">
              {c.c}
            </text>
            <text x={x} y="110" fontSize="11" fontWeight="800" fill="#1b1430" textAnchor="middle">
              {c.d}
            </text>
          </g>
        );
      })}
      <text x="180" y="140" fontSize="10.5" fill="#625b7c" textAnchor="middle">
        年末年始をまたいで、2026/12/12〜2027/1/12
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="heysayjump"
      heading={
        <>
          Hey! Say! JUMP「Juliet」<mark>福岡公演</mark>のグッズガイド
        </>
      }
      heroLead="アルバム『Juliet』を引っさげた4大ドームツアーが、12/12・12/13 のみずほPayPayドーム福岡から始まります。グッズ12アイテムの予算計算、1商品2点までの購入制限、ペンライトの注意点、オンライン販売の日程、年末年始の東京ドームまでまとめました。"
      stickers={["🌹 Juliet", "🏟️ 4大ドーム", "🛍️ 全12アイテム", "📅 12/12〜1/12"]}
      heroExtra={
        <LiveCountdown
          shows={SHOWS.map((sh) => {
            const [m, d] = sh.d.replace(/\(.*$/, "").split("/").map(Number);
            const y = m === 1 ? 2027 : 2026;
            return { label: `${sh.d} ${sh.v}の開演`, start: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T${sh.t}:00+09:00` };
          })}
        />
      }
      unofficialNote="この記事は、STARTO ENTERTAINMENT の公演ページなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。開演時間は報道記事によるもので、会場販売の場所・スケジュールは 11/29 時点で「決まり次第お知らせ」です。出かける前に必ず公式の最新情報を確認してください。"
    >
      <p>
        Hey! Say! JUMP の「Hey! Say! JUMP DOME TOUR 2026-2027 Juliet」は、11/11 発売のアルバム『Juliet』を携えた4大ドームツアー。<strong>12月12日(土)・13日(日)のみずほPayPayドーム福岡</strong>で幕を開け、名古屋・東京（年末年始）・大阪と、全10公演を回ります。
      </p>
      <p>
        グッズは12アイテム。<span className={s.hl}>会場・オンラインとも1人1商品2点まで</span>、そして<span className={s.hl}>オリジナルペンライトはツアー後のオンライン販売がない</span>のが大事なポイントです。
      </p>

      <Tldr
        items={[
          <>福岡は 12/12(土) 18:00、12/13(日) 15:00 開演。その後、名古屋・東京・大阪で全10公演</>,
          <>会場もオンラインも1商品2点まで。オリジナルペンライト（8,000円）はツアー後の通販なし</>,
          <>会場販売の詳細は発表待ち。オンラインの2回目は 2027/1/12〜1/18</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="Hey! Say! JUMP「Juliet」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        4大ドーム10公演の日程
      </H2>
      <Figure caption="編集部作成。日程は公式・報道の発表によります。">
        <TourCalendar />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="全10公演の日程（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">会場</th>
              <th scope="col">開演</th>
            </tr>
          </thead>
          <tbody>
            {SHOWS.map((sh) => (
              <tr key={sh.d}>
                <th scope="row">{sh.d}</th>
                <td>
                  <Link href={VENUE_GUIDE[sh.v]}>{sh.v}</Link>
                </td>
                <td>{sh.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>開演時間は楽天ブックス「推し楽」の記事（10/13）によります。開場時間は公式の案内で確認してください。会場名から、それぞれの会場ガイドへ移動できます。</p>
      <Stats
        items={[
          { num: <>11,000<small>円</small></>, label: "ファミリークラブ会員チケット" },
          { num: <>11,500<small>円</small></>, label: "一般チケット（プレイガイド）" },
          { num: <>10<small>公演</small></>, label: "4大ドーム" },
          { num: <>2<small>点まで</small></>, label: "1人1商品あたり（会場・オンライン）" },
        ]}
      />

      <H2 id="goods" num={2}>
        グッズ全12アイテムと予算計算
      </H2>
      <p>欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。ジャンボうちわ・ブリスターキーホルダー・フォトシートセットは個人7種、オリジナルフォトセットは混合1種と個人7種、靴下は2種です。</p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は STARTO ENTERTAINMENT の公演ページをもとに作成した Mochico のリストの内容です。</p>
      <Bubble>パーカー（8,500円）とペンライト（8,000円）で一気に予算が上がるから、推しのうちわ＋フォトセットの組み合わせと比べてみてね。</Bubble>

      <H2 id="rules" num={3}>
        購入制限・ペンライト・オンライン販売
      </H2>
      <ul>
        <li>
          <strong>購入制限：</strong>会場・オンラインストアとも1人1商品2点まで（会場販売の個数制限は変わる場合あり）。
        </li>
        <li>
          <strong>オリジナルペンライト：</strong>前のツアー「H⁺」「S say」や「JUMPdate!」と同じ商品です。持っている人は買い直さなくて大丈夫。<strong>ツアー後のオンライン販売はありません</strong>。
        </li>
        <li>
          <strong>オンライン（MERCH MARKET）：</strong>1回目（11/12〜11/18）は終了。2回目は <strong>2027/1/12(火) 19:00〜1/18(月) 23:00</strong>。発送件数・在庫には限りがあります。
        </li>
      </ul>

      <ArticleAd />

      <H2 id="venue" num={4}>
        会場販売はどうなる？（発表待ち）
      </H2>
      <p>11/29 時点で、公式は会場販売の「販売場所、販売スケジュールの詳細は決まり次第お知らせ」としています。</p>
      <Card kind="info" label="同じ事務所のツアーの例">
        <p>
          同じ STARTO ENTERTAINMENT の Snow Man「ALL SUITE」では、会場販売に入場整理券（MERCH MARKET Goods App）が必要で、チケットを持つ代表者向けと同行者・チケットなしの人向けの2つの区分で申し込む形でした（<Link href="/blog/snowman-all-suite-fukuoka-goods">Snow Man 福岡公演のガイド</Link>）。JUMP の福岡公演も同じ形になるかは、公式の発表を待ちましょう。
        </p>
      </Card>
      <p>福岡のドームの行き方・帰りの混雑・海風対策は「<Link href="/blog/paypay-dome-fukuoka-guide">みずほPayPayドーム福岡 完全ガイド</Link>」にまとめています。</p>

      <H2 id="day" num={5}>
        福岡公演の持ち物
      </H2>
      <Checklist
        title="Juliet 福岡の持ち物"
        icon="🌹"
        items={[
          { must: true, text: "チケット（デジタルチケット）と身分証", why: "主催者の案内に従う" },
          { text: "オリジナルペンライト（前のツアーのものも同じ商品）" },
          { text: "MERCH MARKET Goods App（ログイン確認）", why: "会場販売で使う可能性がある" },
          { text: "防寒着とカイロ", why: "ドームは博多湾のそば。12月の海風は冷たい" },
          { text: "モバイルバッテリー" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="Hey! Say! JUMP「Juliet」" goodsCount={list.items.length} note="福岡で買ったものをMochicoのリストでチェックしておけば、名古屋・東京・大阪や1月のオンライン販売で買い足すものがすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://starto.jp/s/p/live/10602", title: "STARTO「Juliet」公演ページ（グッズ・チケット）", icon: "🌹" },
          { href: "https://famikura-store.jp/s/j/page/merchmarket", title: "MERCH MARKET オンライン", icon: "🛍️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://starto.jp/s/p/live/10602", label: "STARTO ENTERTAINMENT「Hey! Say! JUMP DOME TOUR 2026-2027 Juliet」（チケット・グッズ・購入制限・ペンライト・オンライン販売・会場販売）" },
          { href: "https://fan.books.rakuten.co.jp/articles/dkbsesm02rn2tmotezmst1i9", label: "楽天ブックス 推し楽「Hey! Say! JUMP、4大ドームツアー『Juliet』開催！」（全公演の日程・開演時間）" },
          { href: "https://lp.p.pia.jp/event/music/515136/index.html", label: "チケットぴあ「Hey! Say! JUMP DOME TOUR 2026-2027 Juliet」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
