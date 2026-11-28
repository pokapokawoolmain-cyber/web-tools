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

const post = getBlogPost("number-i-no3-tour-goods")!;
const list = LIVE_LISTS.numberi;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "Number_i グッズ 京セラドーム",
  "Number_i 東京ドーム グッズ",
  "Number_i LIVE TOUR No.Ⅲ グッズ",
  "Number_i No.III 物販 時間",
  "Number_i ペンライト 座席登録",
  "Number_i ブリスターパック",
  "Number_i ツアーグッズ 値段",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "大阪・東京の日程と物販時間" },
  { id: "goods", label: "グッズ全12アイテムと予算計算" },
  { id: "rules", label: "整理券なし・1会計4点まで・支払い方法" },
  { id: "penlight", label: "無線制御ペンライトの座席登録と持ち込みルール" },
  { id: "day", label: "当日の動き方と持ち物" },
];

/** 自作の図：会場ごとの物販時間（大阪・東京） */
function SalesBars() {
  const rows = [
    { d: "12/2(水) 京セラドーム大阪", s: 11, e: 18.5, fill: "#3b82f6" },
    { d: "12/9(水) 東京ドーム", s: 10, e: 18.5, fill: "#1e40af" },
    { d: "12/10(木) 東京ドーム", s: 10, e: 18.5, fill: "#1e40af" },
  ];
  const x = (h: number) => 20 + ((h - 9) / 11) * 320;
  return (
    <svg viewBox="0 0 360 230" role="img" aria-labelledby="ni-title ni-desc">
      <title id="ni-title">Number_i 会場物販の時間（大阪・東京）</title>
      <desc id="ni-desc">12月2日の京セラドーム大阪は11時から18時30分、12月9日と10日の東京ドームは10時から18時30分。開演は18時30分。</desc>
      {[10, 12, 14, 16, 18, 20].map((h) => (
        <g key={h}>
          <line x1={x(h)} y1="18" x2={x(h)} y2="176" stroke="#e5e7eb" />
          <text x={x(h)} y="192" fontSize="10.5" fill="#625b7c" textAnchor="middle">
            {h}:00
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.d}>
          <text x="20" y={34 + i * 52} fontSize="11.5" fontWeight="800" fill="#1b1430">
            {r.d}
          </text>
          <rect x={x(r.s)} y={42 + i * 52} width={x(r.e) - x(r.s)} height="18" rx="6" fill={r.fill} />
          <text x={x(r.s) + 6} y={55 + i * 52} fontSize="10.5" fontWeight="800" fill="#fff">
            {r.s === 11 ? "11:00" : "10:00"}〜18:30
          </text>
        </g>
      ))}
      <line x1={x(18.5)} y1="18" x2={x(18.5)} y2="176" stroke="#be185d" strokeWidth="2" strokeDasharray="4 4" />
      <text x={x(18.5)} y="214" fontSize="10.5" fontWeight="800" fill="#be185d" textAnchor="middle">
        開演 18:30
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="numberi"
      heading={
        <>
          Number_i「LIVE TOUR No.Ⅲ」<mark>大阪・東京</mark>のグッズと物販ガイド
        </>
      }
      heroLead="5大ドームを回る Number_i のツアー。12/2 京セラドーム大阪と 12/9・12/10 東京ドームは、整理券なし・チケットなしでも物販に並べます。物販時間、1会計4点までの購入制限、無線制御ペンライトの座席登録、ブリスターパックの注意点をまとめました。"
      stickers={["🖤 No.Ⅲ", "🏟️ 京セラ・東京ドーム", "🛍️ 整理券なし", "📅 12/2・12/9・12/10"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/2(水) 京セラドーム大阪の開演", start: "2026-12-02T18:30:00+09:00" },
            { label: "12/9(水) 東京ドームの開演", start: "2026-12-09T18:30:00+09:00" },
            { label: "12/10(木) 東京ドームの開演", start: "2026-12-10T18:30:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、TOBE OFFICIAL STORE の「オフィシャルグッズ会場販売のご案内」（11/25 更新）などの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。取り扱いアイテムは会場で一部変わる場合があるので、公式の最新情報を確認してください（2026年11月28日時点）。"
    >
      <p>
        Number_i の「Number_i LIVE TOUR No.Ⅲ」は、全国5都市の5大ドームを回るツアー。10月の札幌から始まり、12月は<strong>2日(水)に京セラドーム大阪、9日(水)・10日(木)に東京ドーム</strong>で公演があります。開演はいずれも18:30。
      </p>
      <p>
        うれしいのは、物販が<span className={s.hl}>事前予約も整理券も不要で、チケットを持っていなくても買える</span>こと。その分、並ぶ時間と在庫の読みがカギになります。
      </p>

      <Tldr
        items={[
          <>物販は 12/2 京セラドーム大阪 11:00〜18:30、12/9・12/10 東京ドーム 10:00〜18:30。整理券・予約・チケットは不要</>,
          <>1会計につき1人各4点まで。現金とキャッシュレスの併用はできない</>,
          <>オリジナルペンライトは無線制御。アプリで座席情報の事前登録が必要</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="Number_i「No.Ⅲ」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        大阪・東京の日程と物販時間
      </H2>
      <Figure caption="編集部作成。時間は TOBE OFFICIAL STORE の案内によります。数量に限りがあり、時間内でも売り切れる場合があります。">
        <SalesBars />
      </Figure>
      <Stats
        items={[
          { num: <>18:30</>, label: "開演（大阪・東京とも）" },
          { num: <>0<small>枚</small></>, label: "必要な整理券（不要）" },
          { num: <>4<small>点</small></>, label: "1会計あたり各商品の上限" },
          { num: <>¥30</>, label: "TOBEオリジナルショッパー（上限の対象外）" },
        ]}
      />
      <p>
        会場ごとの行き方・ロッカー・帰りの混雑は「<Link href="/blog/kyocera-dome-osaka-guide">京セラドーム大阪 完全ガイド</Link>」「<Link href="/blog/tokyo-dome-guide">東京ドーム完全ガイド</Link>」で解説しています。CD・Blu-ray・DVD の会場販売もあり、こちらは終演後も販売されます。
      </p>

      <H2 id="goods" num={2}>
        グッズ全12アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。1会計4点までなので、友達の分を頼まれている人は数も確認しておきましょう。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。会場販売の取り扱いアイテムは一部変更になる場合があります（公式 11/5・11/25 追記）。</p>
      <Card kind="point" label="ブリスターパックは開演前に開けない">
        <p>
          ブリスターパック（3,500円）には、銀テープ入れ・<strong>公演内容に関連したデザインの銀テープ風マスキングテープ</strong>・耳栓・ボディシールが入っています。公式は「LIVE前に開封しないように」と注意しています。
        </p>
      </Card>

      <H2 id="rules" num={3}>
        整理券なし・1会計4点まで・支払い方法
      </H2>
      <ul>
        <li>
          <strong>予約・整理券は不要。</strong>公演チケットがなくても買えます。
        </li>
        <li>
          <strong>1会計につき1人各4点まで</strong>（TOBEオリジナルショッパーは対象外）。
        </li>
        <li>
          <strong>支払い：</strong>現金、クレジットカード（VISA・Mastercard・JCB・AMERICAN EXPRESS・Diners Club・DISCOVER）、QR決済（PayPay・au PAY・d払い）。一括払いのみ。タッチ決済のカードやスマホも使えます。
        </li>
        <li>
          <strong>現金とキャッシュレスの併用は不可。</strong>QR決済は事前に残高の確認・チャージを。
        </li>
      </ul>
      <Card kind="caution" label="電波が弱いと現金払いになることも">
        <p>
          会場の電波状況によってはキャッシュレス決済ができず、現金での支払いをお願いされる場合があります。<strong>キャッシュレス派の人も、予算分の現金を少し持っていく</strong>と安心です。
        </p>
      </Card>
      <ul>
        <li>数量に限りがあり、並んでも売り切れる場合があります。</li>
        <li>お釣りと商品はその場で確認。売り場を離れたあとの申し出には対応してもらえません。</li>
        <li>不良品の交換は当日の物販時間内だけ（レシートを保管）。</li>
        <li>購入目的の徹夜・早朝からの来場・自然発生の列はやめるよう呼びかけられています。</li>
      </ul>
      <Bubble>
        整理券がない分、朝から並ぶか、昼過ぎの空き時間を狙うかが作戦の分かれ目。どれを絶対に買うか、上のチェックで先に決めておこう！
      </Bubble>

      <ArticleAd />

      <H2 id="penlight" num={4}>
        無線制御ペンライトの座席登録と持ち込みルール
      </H2>
      <ul>
        <li>
          公演では「Number_i LIVE TOUR No.Ⅲ オリジナルペンライト」（7,200円）を使った演出があり、<strong>アプリで座席情報の事前登録</strong>が必要です（登録方法は公式の案内ページから）。
        </li>
        <li>以前のツアーのオフィシャルペンライトや「3XL」ハートのペンダントは持ち込めますが、<strong>ライトを消した状態</strong>で使用・着用します。</li>
        <li>オフィシャルグッズ以外の光るものは持ち込み禁止です。</li>
      </ul>

      <H2 id="day" num={5}>
        当日の動き方と持ち物
      </H2>
      <Checklist
        title="No.Ⅲ 大阪・東京の持ち物"
        icon="🖤"
        items={[
          { must: true, text: "チケット（スマホ）と身分証", why: "主催者の案内に従う" },
          { must: true, text: "現金とキャッシュレスの両方", why: "併用はできないが、電波が悪いときの予備に" },
          { text: "オリジナルペンライト（座席登録済み）" },
          { text: "大きめのバッグかショッパー", why: "スウェットやブランケットはかさばる（ショッパーは30円）" },
          { text: "モバイルバッテリー" },
          { text: "防寒着", why: "12月の屋外の物販列は冷える" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="Number_i「No.Ⅲ」" goodsCount={list.items.length} note="大阪で買ったものをMochicoのリストでチェックしておけば、東京公演で買い足すものがすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://tobe-store.jp/blogs/information/108", title: "オフィシャルグッズ会場販売のご案内（TOBE OFFICIAL STORE）", icon: "🛍️" },
          { href: "https://tower.jp/article/news/2026/08/07/tg002", title: "No.Ⅲ 全国5都市の日程（TOWER RECORDS ONLINE）", icon: "📅" },
        ]}
      />
      <Sources
        items={[
          { href: "https://tobe-store.jp/blogs/information/108", label: "TOBE OFFICIAL STORE「Number_i LIVE TOUR No.Ⅲ オフィシャルグッズ会場販売のご案内」（11/25 更新：販売日時・購入制限・支払い・ペンライト・注意事項）" },
          { href: "https://tower.jp/article/news/2026/08/07/tg002", label: "TOWER RECORDS ONLINE「Number_i、日本公演 LIVE TOUR No.III 全国5都市／5大ドームの日程公開」" },
          { href: "https://www.livefans.jp/groups/274941", label: "LiveFans「Number_i LIVE TOUR No.III」（日程・開演時間）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
