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

const post = getBlogPost("milk-shakariki-revolution-aichi-goods")!;
const list = LIVE_LISTS.milk;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "M!LK 愛知 グッズ",
  "シャカリキレボリューション グッズ",
  "シャカレボ グッズ 値段",
  "M!LK Aichi Sky Expo",
  "M!LK 会場受取",
  "ミルクラスタル スティック 3",
  "M!LK アリーナツアー 2026",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "愛知公演の日程とツアー全体" },
  { id: "goods", label: "グッズ全18アイテムと予算計算" },
  { id: "pickup", label: "愛知だけの「事前購入・会場受取」" },
  { id: "light", label: "ペンライト「ミルクラスタル スティック 3」とうちわのルール" },
  { id: "entry", label: "入場の本人確認と、持ち込めないもの" },
];

/** 自作の図：会場受取の時間枠（12/12・12/13） */
function PickupSlots() {
  const X = (h: number) => 20 + ((h - 9) / 9) * 320;
  return (
    <svg viewBox="0 0 360 200" role="img" aria-labelledby="mk-title mk-desc">
      <title id="mk-title">会場受取の時間枠と公演の時間</title>
      <desc id="mk-desc">12月12日の受取は11:30から15:55、公演は17:00開演。12月13日の受取は9:30から16:25、公演は12:30と17:30開演の2回。受取場所はホールB。</desc>
      {[9, 11, 13, 15, 17, 18].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1="14" x2={X(h)} y2="158" stroke="#f1e4ea" />
          <text x={X(h)} y="174" fontSize="10.5" fill="#625b7c" textAnchor="middle">
            {h}:00
          </text>
        </g>
      ))}
      <text x="20" y="30" fontSize="11.5" fontWeight="900" fill="#1b1430">
        12/12(土)
      </text>
      <rect x={X(11.5)} y="38" width={X(15.92) - X(11.5)} height="16" rx="6" fill="#ff8fb8" />
      <text x={X(11.5) + 6} y="50" fontSize="10" fontWeight="800" fill="#fff">
        受取 11:30〜15:55
      </text>
      <circle cx={X(17)} cy="46" r="7" fill="#b8285d" />
      <text x={X(17)} y="68" fontSize="10" fontWeight="800" fill="#b8285d" textAnchor="middle">
        開演17:00
      </text>
      <text x="20" y="100" fontSize="11.5" fontWeight="900" fill="#1b1430">
        12/13(日)
      </text>
      <rect x={X(9.5)} y="108" width={X(16.42) - X(9.5)} height="16" rx="6" fill="#6cc4ff" />
      <text x={X(9.5) + 6} y="120" fontSize="10" fontWeight="800" fill="#fff">
        受取 9:30〜16:25
      </text>
      <circle cx={X(12.5)} cy="140" r="7" fill="#2b6cb0" />
      <text x={X(12.5)} y="156" fontSize="10" fontWeight="800" fill="#2b6cb0" textAnchor="middle">
        1部 12:30
      </text>
      <circle cx={X(17.5)} cy="140" r="7" fill="#2b6cb0" />
      <text x={X(17.5) - 8} y="156" fontSize="10" fontWeight="800" fill="#2b6cb0" textAnchor="middle">
        2部 17:30
      </text>
      <text x="20" y="194" fontSize="10.5" fill="#625b7c">
        ※ 受取場所はライブ会場（ホールA）ではなくホールB
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="milk"
      heading={
        <>
          M!LK「シャカリキレボリューション」<mark>愛知公演</mark>のグッズガイド
        </>
      }
      heroLead="M!LK史上最大規模のアリーナツアー。12/12・12/13 の Aichi Sky Expo 公演に向けて、グッズ18アイテムの予算計算、愛知だけの「事前購入・会場受取」、ペンライトとうちわのルール、入場の本人確認までまとめました。"
      stickers={["🥛 シャカレボ", "🎤 Aichi Sky Expo", "🛍️ 全18アイテム", "📅 12/12・12/13"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "事前購入・会場受取の申込しめきり（11/29 23:50）", start: "2026-11-29T23:50:00+09:00" },
            { label: "12/12(土) 愛知の開演", start: "2026-12-12T17:00:00+09:00" },
            { label: "12/13(日) 1部の開演", start: "2026-12-13T12:30:00+09:00" },
            { label: "12/13(日) 2部の開演", start: "2026-12-13T17:30:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、M!LK 公式サイト（スターダストプロモーション）のツアー特設ページ・お知らせなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。愛知の当日の会場販売は「後日お知らせ」です。出かける前に必ず公式の最新情報を確認してください（2026年11月29日時点）。"
    >
      <p>
        M!LK の「M!LK ARENA TOUR 2026-2027「シャカリキレボリューション」」は、全6会場19公演・約16万人を動員する、グループ史上最大規模のアリーナツアー。福岡・宮城・神奈川と回り、<strong>12月12日(土)・13日(日)に愛知の Aichi Sky Expo ホールA</strong>へやってきます。
      </p>
      <p>
        愛知公演でまず押さえたいのは、<span className={s.hl}>グッズを前もって買って会場で受け取る「事前購入・会場受取」の申し込みが 11/29(日) 23:50 まで</span>ということ。当日の会場販売は、事前購入の残りだけになる可能性があります。
      </p>

      <Tldr
        items={[
          <>愛知は 12/12(土) 開場16:00・開演17:00、12/13(日) は1部 12:30・2部 17:30 開演の2回公演</>,
          <>事前購入・会場受取は 11/29 23:50 しめきり。受取はホールBで、当日のチケットを持つ本人だけ</>,
          <>持ち込めるうちわは「シャカレボうちわ」だけ。光るものは M!LK 公式ペンライトのみ</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="M!LK「シャカリキレボリューション」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        愛知公演の日程とツアー全体
      </H2>
      <div className={s.tableWrap} role="region" aria-label="愛知公演の日程" tabIndex={0}>
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
              <th scope="row">12/12(土)</th>
              <td>16:00</td>
              <td>17:00</td>
            </tr>
            <tr>
              <th scope="row">12/13(日) 1部</th>
              <td>11:30</td>
              <td>12:30</td>
            </tr>
            <tr>
              <th scope="row">12/13(日) 2部</th>
              <td>16:30</td>
              <td>17:30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Stats
        items={[
          { num: <>11,500<small>円</small></>, label: "指定席・ファミリー席・着席指定席（税込）" },
          { num: <>19<small>公演</small></>, label: "全6会場（約16万人）" },
          { num: <>12/25・26</>, label: "次は大阪城ホール" },
          { num: <>1/15〜17</>, label: "ファイナルは横浜アリーナ" },
        ]}
      />
      <p>
        会場の Aichi Sky Expo は中部国際空港（セントレア）のとなり。行き方や帰りの電車は「<Link href="/blog/aichi-sky-expo-guide">Aichi Sky Expo 完全ガイド</Link>」で解説しています。大阪公演の会場は「<Link href="/blog/osaka-jo-hall-guide">大阪城ホール完全ガイド</Link>」へ。
      </p>

      <H2 id="goods" num={2}>
        グッズ全18アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。「シャカレボご当地ステッカー」は愛知ver.（全5種ランダム）で、愛知公演だけの販売です。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>価格は公式の「愛知 事前購入・会場受取」のお知らせ（税込）をもとに作成した Mochico のリストの内容です。メンバー別・色別の商品があります。</p>
      <div className={s.tableWrap} role="region" aria-label="主な購入制限" tabIndex={0}>
        <table className={s.table}>
          <caption>主な購入制限（愛知 事前購入のお知らせより）</caption>
          <tbody>
            <tr>
              <th scope="row">生写真セット（66杯目・67杯目）</th>
              <td>各10セットまで（5枚ランダム・直筆サイン入りもあり）</td>
            </tr>
            <tr>
              <th scope="row">シャカレボランダムトレカ</th>
              <td>10点まで（全20種から1枚）</td>
            </tr>
            <tr>
              <th scope="row">シャカレボTシャツ</th>
              <td>各メンバー合計2点まで</td>
            </tr>
            <tr>
              <th scope="row">ミルクラスタル スティック 3</th>
              <td>2点まで</td>
            </tr>
            <tr>
              <th scope="row">そのほか多く</th>
              <td>5点まで</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Bubble>生写真とランダムトレカは推しが出るまで…になりがち。Mochicoのリストに参加すれば、ランダムグッズは絵柄ごとに何枚持っているか残せるよ。</Bubble>

      <H2 id="pickup" num={3}>
        愛知だけの「事前購入・会場受取」
      </H2>
      <Figure caption="編集部作成。受取の時間枠は公式のお知らせによります（12/12 は9枠、12/13 は14枠）。">
        <PickupSlots />
      </Figure>
      <ul>
        <li>
          <strong>申込：</strong>11/27(金) 18:30〜<strong>11/29(日) 23:50</strong>、「スタダ便 会場受取」から（Plus member ID が必要・FC会員番号では不可）。
        </li>
        <li>
          <strong>受取：</strong>Aichi Sky Expo の<strong>ホールB</strong>（ライブ会場のホールAとは別）。当日のチケットを持つ本人だけで、代理受取はできません。マイページの購入履歴の QR コード（スクショ不可）が必要で、本人確認書類を求められることもあります。
        </li>
        <li>
          <strong>支払い：</strong>クレジットカードかコンビニ決済（前払い）。会場受取手数料 440円がかかります。会場受取は1公演につき1回。
        </li>
        <li>
          <strong>受け取れなかったら：</strong>後日配送（送料と手数料で 1,980円・沖縄と離島は 3,080円）。決済後のキャンセル・変更はできません。
        </li>
      </ul>
      <Card kind="caution" label="当日の会場販売は「残り」だけかも">
        <p>公式は、会場販売は事前購入の在庫のあとに残ったものだけを売り、完売や少数の場合は会場販売がないこともあると案内しています。確実に欲しいものは事前購入で押さえましょう。</p>
      </Card>

      <ArticleAd />

      <H2 id="light" num={4}>
        ペンライト「ミルクラスタル スティック 3」とうちわのルール
      </H2>
      <ul>
        <li>ミルクラスタル スティック 3（4,700円・ストラップ付き）は、桃→青→赤→白→黄の5色に切り替わります。単4マンガン電池3本。</li>
        <li>
          購入時の電池は点灯確認用のテスト電池。<strong>公演では新しい電池に入れ替えるのがおすすめ</strong>で、当日の会場での電池販売はありません。
        </li>
        <li>使える光るものは M!LK オフィシャルペンライトだけ（過去の M!LK オフィシャルペンライトも OK）。</li>
        <li>
          うちわは<strong>「シャカレボうちわ」だけ</strong>持ち込めます（1人1枚・装飾禁止）。手作りうちわやメッセージボードは持ち込めません。
        </li>
      </ul>

      <H2 id="entry" num={5}>
        入場の本人確認と、持ち込めないもの
      </H2>
      <ul>
        <li>入場時は同行者を含む全員に本人確認があります。顔写真付きの本人確認書類の原本（コピー不可・期限切れ不可）を持っていきましょう。</li>
        <li>先行分の電子チケットは EBiDAN OFFICIAL APP で発券。複数枚なら入場までに1人1枚ずつ分配します。</li>
        <li>6cm以上の厚底・ヒール、高さのあるカチューシャや帽子、お酒は NG。会場での手荷物預かりもありません。</li>
        <li>撮影・録音・録画は禁止。入り待ち・出待ち、プレゼントも控えるよう案内されています。</li>
      </ul>
      <Checklist
        title="シャカレボ 愛知の持ち物"
        icon="🥛"
        items={[
          { must: true, text: "電子チケット（EBiDAN OFFICIAL APP）と顔写真付き身分証の原本" },
          { must: true, text: "会場受取の QR コード（マイページで表示）", why: "スクショは使えない" },
          { text: "ミルクラスタル スティック 3 と新品の単4マンガン電池3本", why: "会場で電池は売っていない" },
          { text: "シャカレボうちわ（1人1枚）" },
          { text: "100円玉", why: "Aichi Sky Expo のロッカーは100円硬貨・現金のみ" },
          { text: "防寒着", why: "海辺の空港島。12月は風が冷たい" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="M!LK「シャカリキレボリューション」" goodsCount={list.items.length} note="受け取ったグッズや、生写真・トレカの絵柄をMochicoのリストに残しておくと、大阪・横浜公演で交換に出すダブりがすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://sd-milk.com/pages/shakarikirevolution", title: "シャカリキレボリューション 特設ページ", icon: "🥛" },
          { href: "https://sd-milk.com/contents/1132253", title: "愛知 事前購入・会場受取のお知らせ", icon: "🛍️" },
          { href: "https://store.plusmember.jp/stardustch_preorder/", title: "スタダ便 会場受取", icon: "📦" },
        ]}
      />
      <Sources
        items={[
          { href: "https://sd-milk.com/pages/shakarikirevolution", label: "M!LK OFFICIAL SITE「シャカリキレボリューション」特設ページ（日程・チケット・本人確認・禁止事項）" },
          { href: "https://sd-milk.com/contents/1132253", label: "M!LK OFFICIAL SITE「愛知公演 事前購入・会場受取」（ラインナップ・価格・購入制限・受取時間・ペンライト）" },
          { href: "https://sd-milk.com/contents/1046046", label: "M!LK OFFICIAL SITE「ARENA TOUR 2026-2027 開催決定」" },
          { href: "https://www.sundayfolk.com/liveinfo/529qwui", label: "サンデーフォークプロモーション「M!LK 愛知公演」（席種・入場条件）" },
          { href: "https://ebidan.jp/schedule/detail/10005647", label: "EBiDAN「【愛知】シャカリキレボリューション」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
