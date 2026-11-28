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

const post = getBlogPost("enhypen-blood-saga-tokyo-dome-goods")!;
const list = LIVE_LISTS.enhypen;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "ENHYPEN 東京ドーム グッズ",
  "ENHYPEN BLOOD SAGA グッズ",
  "ENHYPEN 東京ドーム 2026",
  "ENHYPEN 会場受取 Weverse",
  "ENHYPEN ペンライト 座席登録",
  "ENHYPEN 東京ドーム 本人確認",
  "BLOOD SAGA 東京ドーム 開演",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "公演日程・開場/開演とチケット" },
  { id: "goods", label: "グッズ全25アイテムと予算計算" },
  { id: "pickup", label: "東京ドームでの買い方：Weverse Shop 会場受取" },
  { id: "capsule", label: "カプセルトイと会員特典ブース" },
  { id: "lightstick", label: "ペンライトの座席登録と電池" },
  { id: "entry", label: "入場・本人確認・持ち込み禁止のもの" },
  { id: "day", label: "当日のタイムラインと持ち物" },
];

/** 自作の図：Weverse Shop 会場受取の流れ */
function PickupFlow() {
  const steps = [
    { t: "① Weverse Shop に会員登録", d: "非会員は購入できない" },
    { t: "② 受取時間を選んで注文・決済", d: "全注文で時間指定と決済が必須" },
    { t: "③ 東京ドーム プリズムホールへ", d: "チケットがなくても受け取れる" },
    { t: "④ 注文画面を見せて受け取り", d: "受け取らないと当日終了後に自動キャンセル" },
  ];
  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby="enp-title enp-desc">
      <title id="enp-title">Weverse Shop 会場受取の流れ</title>
      <desc id="enp-desc">会員登録、受取時間を選んで注文と決済、東京ドーム プリズムホールへ行く、注文画面を見せて受け取る、の4ステップ。</desc>
      {steps.map((st, i) => (
        <g key={st.t}>
          <rect x="10" y={8 + i * 72} width="340" height="60" rx="14" fill={i % 2 ? "#fdecee" : "#fff"} stroke="#f2b9c1" />
          <text x="24" y={33 + i * 72} fontSize="13.5" fontWeight="900" fill="#9c0f27">
            {st.t}
          </text>
          <text x="24" y={53 + i * 72} fontSize="11.5" fill="#3e3756">
            {st.d}
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
      theme="enhypen"
      heading={
        <>
          ENHYPEN「BLOOD SAGA」<mark>東京ドーム</mark>グッズ完全ガイド
        </>
      }
      heroLead="12/1・12/2 の東京ドーム公演は、グッズの買い方が「Weverse Shop の会場受取」と「カプセルトイ」の2つだけ。商品ページの公開時刻、受取時間、購入数の上限、ペンライトの座席登録まで、公式の案内をもとに1ページにまとめました。"
      stickers={["🩸 BLOOD SAGA", "🏟️ 東京ドーム", "🛍️ 全25アイテム", "📅 12/1・12/2"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "12/1(火) 東京ドームの開演", start: "2026-12-01T18:30:00+09:00" },
            { label: "12/2(水) 東京ドームの開演", start: "2026-12-02T16:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、ENHYPEN JAPAN OFFICIAL SITE・HYBE JAPAN の公演ページなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。販売時間や在庫は変わることがあるので、出かける前に必ず公式の最新情報を確認してください（2026年11月28日時点）。"
    >
      <p>
        ENHYPEN の4度目のワールドツアー「ENHYPEN WORLD TOUR &apos;BLOOD SAGA&apos;」。アルバムを通して続いてきたヴァンパイアの物語を引き継ぐツアーで、2026年5月のソウル公演から世界を回り、日本では<strong>12月1日・2日の東京ドーム</strong>から始まります。
      </p>
      <p>
        いちばん気をつけたいのは、<span className={s.hl}>東京ドーム公演では、ふつうの「会場物販」の案内がない</span>こと。公式に案内されているのは、Weverse Shop で注文してドームで受け取る「会場受取」と、カプセルトイの2つです。知らずに行くと「並べば買える」と思って空振りしてしまうので、この記事で流れを押さえておきましょう。
      </p>

      <Tldr
        items={[
          <>東京ドームのグッズは Weverse Shop の「会場受取」（事前の時間指定・決済が必須）とカプセルトイのみ。場所は東京ドーム プリズムホール</>,
          <>商品ページの公開は 11/30(月) 17:00 予定。購入数は1人各4個まで（一部は10〜20個）</>,
          <>公式ペンライト Ver.2 は座席登録が必要（12/1分は 11/30 16:00〜、12/2分は 12/1 20:00〜）</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="ENHYPEN「BLOOD SAGA」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        公演日程・開場/開演とチケット
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
              <th scope="row">2026/12/1(火)</th>
              <td>16:30</td>
              <td>18:30</td>
            </tr>
            <tr>
              <th scope="row">2026/12/2(水)</th>
              <td>14:00</td>
              <td>16:00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：HYBE JAPAN「ENHYPEN WORLD TOUR &apos;BLOOD SAGA&apos; IN JAPAN」公演ページ。2日目は開場・開演が早いので注意。</p>
      <Stats
        items={[
          { num: <>17,000<small>円</small></>, label: "指定席・注釈付き指定席（税込）" },
          { num: <>24,000<small>円</small></>, label: "S席（12/1のみ・会員のアップグレード）" },
          { num: <>28,000<small>円</small></>, label: "VIP席（12/2・サウンドチェック付き）" },
          { num: <>3<small>歳〜</small></>, label: "チケットが必要（3歳未満は入場不可）" },
        ]}
      />
      <p>
        日本ではこのあと、バンテリンドーム ナゴヤ（12/26・27）、みずほPayPayドーム福岡（2027/2/6・7）、京セラドーム大阪（2027/2/19・20）と続きます。
      </p>

      <H2 id="goods" num={2}>
        グッズ全25アイテムと予算計算
      </H2>
      <p>
        Mochico で公開しているリストのアイテムです。<strong>欲しいものにチェックを入れると、合計金額がその場で出ます</strong>。価格帯のボタンで絞り込めます。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>
        価格は公式発表をもとに作成した Mochico のリストの内容です。メンバー別・サイズ別の商品は、Weverse Shop の商品ページで選びます。商品ページは 11/30(月) 17:00 公開予定なので、最新の価格・在庫は公式で確認してください。
      </p>
      <Card kind="point" label="フォトカード特典のコツ">
        <p>
          会場受取では、<strong>1回の注文で税込7,000円ごとに PHOTO CARD を1枚</strong>（全12種からランダム）。別々の注文は合算されないので、まとめて買う人は1回の注文にまとめましょう。
        </p>
      </Card>

      <H2 id="pickup" num={3}>
        東京ドームでの買い方：Weverse Shop 会場受取
      </H2>
      <Figure caption="編集部作成。公式「会場販売のご案内」の内容を図にしたものです。">
        <PickupFlow />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="会場受取の時間" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">12/1(火)</th>
              <th scope="col">12/2(水)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">注文できる時間</th>
              <td>11:00〜17:50</td>
              <td>9:00〜15:20</td>
            </tr>
            <tr>
              <th scope="row">受取ブース</th>
              <td>12:00〜18:00</td>
              <td>10:00〜15:30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>場所：東京ドーム プリズムホール。出典：ENHYPEN JAPAN OFFICIAL SITE「会場販売のご案内」（11/24 掲載）。</p>
      <ul>
        <li>
          <strong>チケットがなくても購入・受け取りOK。</strong>ただし Weverse Shop の会員登録が必要です。
        </li>
        <li>
          <strong>購入数：</strong>1人あたり各商品4個まで。PRINTED PHOTO・WAPPEN BADGE・Random Capsule は各20個、LOCAL ENCHIN ACRYLIC BADGE は10個、OFFICIAL LIGHT STICK Ver.2 は1アカウント3個まで。
        </li>
        <li>
          <strong>支払い：</strong>PayPal、クレジットカード（VISA・Mastercard・JCB・American Express・Diners Club）、PayPay・メルペイ・au PAY・楽天ペイ。
        </li>
        <li>
          <strong>受け取らないと自動キャンセル：</strong>各日の受取終了後にキャンセルされます。
        </li>
        <li>
          <strong>交換・返品：</strong>都合による交換・返品は不可。不良品は受取当日の受取時間内にブースで交換（注文履歴の提示が必要）。
        </li>
      </ul>
      <Card kind="caution" label="決済ボタンは1回だけ">
        <p>公式は、お支払いボタンは1回だけ押し、決済後に「戻る」を押さないよう案内しています。エラーが出たら、注文履歴を確認してから注文し直しましょう。</p>
      </Card>
      <Bubble>
        商品ページが公開される 11/30(月) 17:00 に、欲しいものを先に決めておくとスムーズ。上の予算計算で合計を出して、Mochicoのリストに残しておこう！
      </Bubble>

      <ArticleAd />

      <H2 id="capsule" num={4}>
        カプセルトイと会員特典ブース
      </H2>
      <h3>CAPSULE TOY BOOTH</h3>
      <ul>
        <li>1回600円（税込）。入口で専用コインに交換（現金・クレジットカード・QR決済）。</li>
        <li>販売時間：12/1 12:00〜18:00、12/2 10:00〜15:30（東京ドーム プリズムホール）。</li>
        <li>1会計10回まで。コインは当日のみ有効。</li>
        <li>Cube Charm など全3アイテム。6種集めると立体キューブになります。</li>
      </ul>
      <h3>ENGENE Membership (JP) 会場限定特典</h3>
      <ul>
        <li>ソロフォトカード1枚（6種からランダム）を、チケット1枚につき1枚。</li>
        <li>
          受け取りは<strong>事前予約が必須</strong>（予約受付は 11/27(金) 19:00 開始）。予約時間外に来ると自動キャンセルになります。
        </li>
        <li>ブース：12/1 11:30〜18:15、12/2 9:00〜15:45。各部の10分前から整列、終了5分前までに到着。</li>
        <li>QRコードは予約サイトの画面でのみ有効（スクリーンショット不可）。本人のみ受け取れます。</li>
      </ul>

      <H2 id="lightstick" num={5}>
        ペンライトの座席登録と電池
      </H2>
      <Timeline
        items={[
          { date: "11/30(月) 16:00〜", text: "12/1 公演の座席登録が始まる（アプリ「ENHYPEN Official Light Stick Ver.2」のコンサートモード）", hot: true },
          { date: "12/1(火) 20:00〜", text: "12/2 公演の座席登録が始まる" },
          { date: "開場後〜開演後30分ごろ", text: "会場内のペアリングブースが開く（開場前の場外ブースはなし）" },
        ]}
      />
      <ul>
        <li>対象は OFFICIAL LIGHT STICK Ver.2・Ver.2 (Renewal Edition)・OFFICIAL LIGHT BAND。<strong>Ver.1 は対象外</strong>です。</li>
        <li>
          電池は<strong>新品のアルカリ単4電池3本</strong>（同じブランドで）。ペンライト本体には電池が入っていません。
        </li>
        <li>公演中は中央制御で色が自動で変わります。公式以外の光るもの・音の出るものは使えません。ペンライトは胸の高さで。</li>
      </ul>

      <H2 id="entry" num={6}>
        入場・本人確認・持ち込み禁止のもの
      </H2>
      <ul>
        <li>
          ENGENE Membership (JP) の先行で当選したチケットは、入場時にランダムで本人確認。<strong>会員証（またはDIGITAL MEMBERSHIP CARD・スクショ不可）＋顔写真付き身分証1点＋チケット</strong>が必要です。
        </li>
        <li>そのほかの先行・一般発売のチケットでも、身分証の確認を求められることがあります。</li>
        <li>カメラ、撮影機能つき双眼鏡、録音機器などは持ち込み禁止。入場時に手荷物検査があります。</li>
        <li>撮影・録音・ライブ配信は一切禁止。花や差し入れは受け付けておらず、手紙は ENGENE ブースのファンレターボックスへ。</li>
      </ul>
      <Card kind="caution" label="双眼鏡は撮影機能なしのものを">
        <p>
          東京ドームはスタンド上段だとステージまでかなり距離があります。双眼鏡は便利ですが、<strong>撮影機能つきのものは持ち込めません</strong>。席ごとの見え方やドームの回り方は「<Link href="/blog/tokyo-dome-guide">東京ドーム完全ガイド</Link>」で解説しています。
        </p>
      </Card>

      <H2 id="day" num={7}>
        当日のタイムラインと持ち物
      </H2>
      <Timeline
        items={[
          { date: "12/1 11:00 / 12/2 9:00", text: "Weverse Shop で会場受取の注文ができるようになる" },
          { date: "12/1 11:30 / 12/2 9:00", text: "会員特典ブースが開く（予約した時間に）" },
          { date: "12/1 12:00 / 12/2 10:00", text: "受取ブース・カプセルトイがオープン（プリズムホール）" },
          { date: "12/1 16:30 / 12/2 14:00", text: "開場。ペンライトのペアリングブースも開場後から" },
          { date: "12/1 18:30 / 12/2 16:00", text: "開演", hot: true },
        ]}
      />
      <Checklist
        title="ENHYPEN 東京ドームの持ち物"
        icon="🩸"
        items={[
          { must: true, text: "チケット（スマホ）と顔写真付き身分証", why: "会員先行のチケットは会員証も" },
          { must: true, text: "Weverse Shop の注文画面（受取用）", why: "通信が混むので、事前に開けるか確認" },
          { text: "公式ペンライト Ver.2 と新品の単4電池3本", why: "座席登録を済ませておく" },
          { text: "モバイルバッテリー", why: "受取・特典・ペンライトのアプリとスマホを使う場面が多い" },
          { text: "撮影機能のない双眼鏡", why: "スタンド後方なら8〜10倍くらいが目安" },
          { text: "大きめのエコバッグ", why: "ドーム内に大きな荷物は持ち込めない。グッズはまとめて持ち歩く" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="ENHYPEN「BLOOD SAGA」" goodsCount={list.items.length} note="受け取ったグッズは、Mochicoのリストでチェックしておくと、名古屋・福岡・大阪公演で買い足すときに迷いません。" />

      <OfficialLinks
        items={[
          { href: "https://www.hybejapan-concert.com/statics/enhypen_blood_saga", title: "HYBE JAPAN 公演ページ（日程・チケット・注意事項）", icon: "🎫" },
          { href: "https://enhypen-jp.weverse.io/news/882f56a7578a", title: "会場販売のご案内（東京ドーム）", icon: "🛍️" },
          { href: "https://enhypen-jp.weverse.io/news/dc6a5edd28d5", title: "公式ペンライトの座席登録", icon: "💡" },
          { href: "https://enhypen-jp.weverse.io/news/513801fcf2c9", title: "ENGENE Membership 会場限定特典", icon: "🎟️" },
        ]}
      />
      <Sources
        items={[
          { href: "https://www.hybejapan-concert.com/statics/enhypen_blood_saga", label: "HYBE JAPAN「ENHYPEN WORLD TOUR 'BLOOD SAGA' IN JAPAN」（日程・開場/開演・チケット・本人確認・注意事項）" },
          { href: "https://enhypen-jp.weverse.io/news/882f56a7578a", label: "ENHYPEN JAPAN OFFICIAL SITE「会場販売のご案内」（会場受取・カプセルトイ・購入制限・支払い）" },
          { href: "https://enhypen-jp.weverse.io/news/f1516fcdee64", label: "ENHYPEN JAPAN OFFICIAL SITE「事前予約販売のご案内」（ラインナップ・特典・配送）" },
          { href: "https://enhypen-jp.weverse.io/news/dc6a5edd28d5", label: "ENHYPEN JAPAN OFFICIAL SITE「OFFICIAL LIGHT STICK 座席登録のご案内」" },
          { href: "https://enhypen-jp.weverse.io/news/513801fcf2c9", label: "ENHYPEN JAPAN OFFICIAL SITE「ENGENE Membership (JP) 会場限定特典」" },
          { href: "https://enhypen-jp.weverse.io/news/f2708367741d", label: "ENHYPEN JAPAN OFFICIAL SITE「特典受け取り予約の開始」" },
          { href: "https://metropolisjapan.com/events/enhypen-tokyo-dome-2026/", label: "Metropolis「ENHYPEN: 'BLOOD SAGA' World Tour in Tokyo」（ツアーのコンセプト）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
