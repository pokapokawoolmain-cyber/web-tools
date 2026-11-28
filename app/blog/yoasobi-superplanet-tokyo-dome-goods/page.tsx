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
  Timeline,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";
import { GoodsBudget, LiveCountdown } from "../_components/oshi/LiveWidgets";
import { LIVE_LISTS } from "../_components/oshi/live-lists";

const post = getBlogPost("yoasobi-superplanet-tokyo-dome-goods")!;
const list = LIVE_LISTS.yoasobi;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "YOASOBI 東京ドーム グッズ",
  "YOASOBI 超惑星 グッズ",
  "YOASOBI 超惑星 東京ドーム",
  "YOASOBI 東京ドーム 整理券",
  "YOASOBI グッズ 購入制限",
  "YOASOBI 東京ドーム 本人確認",
  "YOASOBI スーツケース 受注",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "東京ドーム公演の日程とチケット" },
  { id: "goods", label: "グッズ全27アイテムと予算計算" },
  { id: "limits", label: "購入制限（20点・3点・1点）と受注販売" },
  { id: "howto", label: "東京ドームでの買い方（これまでの会場の例）" },
  { id: "entry", label: "入場時の本人確認と、スマホ撮影OKのルール" },
  { id: "day", label: "当日のタイムラインと持ち物" },
];

/** 自作の図：購入制限の3段階 */
function LimitTiers() {
  const tiers = [
    { n: "20", t: "各20点まで", d: "YOASOBIトレカ／バスボム／“超惑星”ガチャ", fill: "#f1ebff", ink: "#5b21b6" },
    { n: "3", t: "各3点まで", d: "下の2つ以外のすべて（色ちがいは色ごとに3点）", fill: "#e9f8ff", ink: "#0e7490" },
    { n: "1", t: "各1点まで", d: "《会場限定》ラゲッジタグ／《FC限定》Yちゃんネックレスチャーム", fill: "#fff6cc", ink: "#8a5a00" },
  ];
  return (
    <svg viewBox="0 0 360 236" role="img" aria-labelledby="yo-title yo-desc">
      <title id="yo-title">超惑星グッズの購入制限（1会計あたり）</title>
      <desc id="yo-desc">トレカ・バスボム・ガチャは各20点まで。会場限定のラゲッジタグとFC限定のネックレスチャームは各1点まで。それ以外は各3点まで。</desc>
      {tiers.map((tr, i) => (
        <g key={tr.t}>
          <rect x="8" y={8 + i * 76} width="344" height="66" rx="16" fill={tr.fill} />
          <text x="44" y={56 + i * 76} fontSize="34" fontWeight="900" fill={tr.ink} textAnchor="middle">
            {tr.n}
          </text>
          <text x="84" y={34 + i * 76} fontSize="13.5" fontWeight="900" fill="#1b1430">
            {tr.t}
          </text>
          <text x="84" y={54 + i * 76} fontSize="10.5" fill="#3e3756">
            {tr.d}
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
      theme="yoasobi"
      heading={
        <>
          YOASOBI「超惑星」<mark>東京ドーム</mark>のグッズ・整理券・入場ガイド
        </>
      }
      heroLead="アジア・オセアニア11都市を回る「超惑星」ツアーの東京ドーム公演（12/5・12/6）。グッズ27アイテムの予算計算、20点・3点・1点の購入制限、受注販売のしめきり、これまでの会場の整理券の流れ、入場時の本人確認までまとめました。"
      stickers={["🪐 超惑星", "🏟️ 東京ドーム", "🛍️ 全27アイテム", "📅 12/5・12/6"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/5(土) 東京ドームの開演", start: "2026-12-05T18:00:00+09:00" },
            { label: "12/6(日) 東京ドームの開演", start: "2026-12-06T17:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、YOASOBI 公式の「超惑星」特設サイトなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。東京公演のグッズ販売の詳細は 11/28 時点で「COMING SOON」（後日発表）です。発表されたら公式の案内を必ず確認してください。"
    >
      <p>
        YOASOBI のアジア・オセアニアツアー「YOASOBI 11-CITY ASIA-OCEANIA TOUR 2026-2027 “超惑星”」。日本では京セラドーム大阪・バンテリンドーム ナゴヤ・大和ハウス プレミストドーム・みずほPayPayドーム福岡を回り、<strong>12月5日(土)・6日(日) の東京ドーム</strong>で国内ドーム公演の最後を迎えます。
      </p>
      <p>
        宇宙・惑星をテーマにした今回のグッズは、“超惑星”パーカーやリバーシブルボンバージャケット、Ayase プロデュースのパジャマ、ikura プロデュースのバスボムまで27アイテム。<span className={s.hl}>東京公演の販売方法はまだ発表前</span>ですが、これまでの会場の流れと、全会場共通の購入制限は分かっています。
      </p>

      <Tldr
        items={[
          <>東京は 12/5(土) 開場15:30・開演18:00、12/6(日) 開場14:30・開演17:00</>,
          <>購入制限は1会計で「トレカ・バスボム・ガチャは20点」「会場限定・FC限定は1点」「それ以外は3点」</>,
          <>受注販売のスーツケース（25,000円）と FC 限定チャームは 12/11(金) 23:59 しめきり</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="YOASOBI「超惑星」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        東京ドーム公演の日程とチケット
      </H2>
      <div className={s.tableWrap} role="region" aria-label="東京ドーム公演の日程" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">日程</th>
              <th scope="col">開場</th>
              <th scope="col">開演</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">2026/12/5(土)</th>
              <td>15:30</td>
              <td>18:00</td>
            </tr>
            <tr>
              <th scope="row">2026/12/6(日)</th>
              <td>14:30</td>
              <td>17:00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Stats
        items={[
          { num: <>14,000<small>円</small></>, label: "指定席（税込）" },
          { num: <>8,000<small>円</small></>, label: "ファミリーチケット・子ども［着席指定］" },
          { num: <>11<small>都市</small></>, label: "アジア・オセアニアを回るツアー" },
          { num: <>2<small>日</small></>, label: "東京ドーム（国内ドーム公演の最後）" },
        ]}
      />
      <p>
        ファミリーチケットは2〜4枚で申し込み（1枚だけは不可）、公演当日に4歳〜小学生以下の子どもと一緒の家族向け。代表者は18歳以上で、公演中は立ち上がれません。東京ドームの行き方・ゲート・ロッカーは「<Link href="/blog/tokyo-dome-guide">東京ドーム完全ガイド</Link>」で解説しています。
      </p>

      <H2 id="goods" num={2}>
        グッズ全27アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。冬のドームらしく、マフラーやイヤーマフ、ジャージ上下などの防寒アイテムもそろっています。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は公式発表をもとに作成した Mochico のリストの内容です（税込）。会場での取り扱いは公式の東京公演の案内で確認してください。</p>
      <Bubble>
        ボンバージャケット（28,000円）とスーツケース（25,000円）は別格。スーツケースは会場ではなく受注販売だから、12/11 のしめきりを忘れないでね！
      </Bubble>

      <H2 id="limits" num={3}>
        購入制限（20点・3点・1点）と受注販売
      </H2>
      <Figure caption="編集部作成。公式特設サイトの「購入点数制限」を図にしたものです。">
        <LimitTiers />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="受注販売のしめきり" tabIndex={0}>
        <table className={s.table}>
          <caption>受注販売（会場受け取りではなく、YOASOBI Online Store で注文）</caption>
          <thead>
            <tr>
              <th scope="col">商品</th>
              <th scope="col">受付</th>
              <th scope="col">発送</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">スーツケース 25,000円</th>
              <td>〜2026/12/11(金) 23:59</td>
              <td>2027年3月下旬以降</td>
            </tr>
            <tr>
              <th scope="row">《FC限定》Yちゃんネックレスチャーム 3,500円</th>
              <td>〜2026/12/11(金) 23:59</td>
              <td>2027年2月下旬以降</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        受注生産のグッズは、届くころには「何を頼んだか」を忘れがち。注文したら Mochico のリストで「買った」にしておくと、二重注文を防げます（締切の管理のしかたは「
        <Link href="/blog/vtuber-live-goods-guide">受注グッズで後悔しないためのガイド</Link>
        」でも紹介しています）。
      </p>

      <ArticleAd />

      <H2 id="howto" num={4}>
        東京ドームでの買い方（これまでの会場の例）
      </H2>
      <p>
        東京公演の販売情報は、11/28 時点で公式特設サイトに「COMING SOON」と書かれています。参考に、<strong>ほかの会場ではこういう流れでした</strong>。
      </p>
      <ul>
        <li>
          <strong>整理券：</strong>予約サイト「YOASOBI Reservation」で受付（これまでは公演の4〜8日前の 19:00 から。福岡は 11/20(金) 19:00）。アカウント登録は YOASOBI Reservation・ファンクラブ「YOA&apos;S」・YOASOBI Online Store のどれかで、<strong>1アカウント1会場日程につき1枠</strong>。
        </li>
        <li>
          <strong>販売時間（福岡の例）：</strong>10:00 販売開始〜終演後1時間ほど。10:00〜12:59 は整理券を持っている人だけ、13:00 からはフリー販売。
        </li>
        <li>
          <strong>そのほか：</strong>FC ブース（会員にオリジナルステッカー）、会場限定の CD・Blu-ray 特典、本の移動販売「旅する本屋さんYOASOBI号」、フォトスポットなどがありました。
        </li>
      </ul>
      <Card kind="info" label="これから確認すること">
        <p>
          東京公演の販売場所・時間・整理券の受付日時は、公式の発表待ちです。事前通販の受付はすでに終了しています。発表されたら、上の予算計算で決めた「絶対に買うもの」から順に動けるようにしておきましょう。
        </p>
      </Card>

      <H2 id="entry" num={5}>
        入場時の本人確認と、スマホ撮影OKのルール
      </H2>
      <ul>
        <li>
          <strong>入場時に全員の身分証を確認。</strong>顔写真つきなら1点（運転免許証・パスポート・マイナンバーカード・顔写真つき学生証など）、顔写真なしなら2点が必要です。原本のみ有効。
        </li>
        <li>12歳までは健康保険の資格確認書1点で OK。</li>
        <li>手荷物検査は全員に実施されます。</li>
        <li>
          公演当日は<strong>スマートフォンでの撮影（静止画・動画）がOK</strong>とされています。周りの人の視界をさえぎらないよう気をつけましょう。
        </li>
      </ul>

      <H2 id="day" num={6}>
        当日のタイムラインと持ち物
      </H2>
      <Timeline
        items={[
          { date: "発表待ち", text: "東京公演の整理券の受付（これまでは公演の4〜8日前の 19:00 開始）" },
          { date: "12/5(土) 15:30 / 12/6(日) 14:30", text: "開場" },
          { date: "12/5(土) 18:00 / 12/6(日) 17:00", text: "開演", hot: true },
          { date: "12/11(金) 23:59", text: "スーツケース・FC限定チャームの受注しめきり" },
        ]}
      />
      <Checklist
        title="超惑星 東京ドームの持ち物"
        icon="🪐"
        items={[
          { must: true, text: "チケットと身分証の原本", why: "全員が本人確認の対象" },
          { must: true, text: "スマホとモバイルバッテリー", why: "撮影OKの公演はバッテリーの減りが早い" },
          { text: "大きめのエコバッグ", why: "パーカーやボンバージャケットはかさばる" },
          { text: "防寒着", why: "12月の物販列・帰りの駅は冷える" },
          { text: "双眼鏡（撮影機能のないもの）", why: "スタンド後方なら8〜10倍が目安" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="YOASOBI「超惑星」" goodsCount={list.items.length} note="買ったものや受注で頼んだものをMochicoのリストでチェックしておけば、届く前でも「もう頼んだか」がすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://www.yoasobi-music.jp/special/superplanet/", title: "YOASOBI「超惑星」特設サイト", icon: "🪐" },
          { href: "https://yoasobi-onlinestore.com/s/n135ec/", title: "YOASOBI Online Store", icon: "🛍️" },
          { href: "https://yoasobi-fc.com/s/n135rsv/", title: "YOASOBI Reservation（整理券）", icon: "🎫" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.yoasobi-music.jp/special/superplanet/", label: "YOASOBI「11-CITY ASIA-OCEANIA TOUR 2026-2027 “超惑星”」特設サイト（日程・チケット・本人確認・購入制限・受注販売・各会場の販売の例）" },
          { href: "https://www.yoasobi-music.jp/news/588376", label: "YOASOBI OFFICIAL SITE ニュース（ツアー名の変更・追加公演）" },
          { href: "https://global.topstarnews.net/en/articleView.html?idxno=16278618", label: "Topstarnews「YOASOBI to Hold Third Solo Concert in Korea」（海外公演）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
