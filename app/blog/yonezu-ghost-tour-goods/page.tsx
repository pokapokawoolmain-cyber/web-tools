import Link from "next/link";
import { Fragment } from "react";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  H2,
  MochicoNudge,
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

const post = getBlogPost("yonezu-ghost-tour-goods")!;

export const metadata = mochicoArticleMeta(post, [
  "米津玄師 GHOST グッズ",
  "米津玄師 ツアーグッズ 2026",
  "米津玄師 グッズ 値段",
  "米津玄師 物販 整理券",
  "米津玄師 STORE アプリ",
  "GHOST ツアー 会場受け取り",
  "米津玄師 ガチャガチャ",
]);

const TOC: TocItem[] = [
  { id: "lineup", label: "グッズ全20アイテムと価格" },
  { id: "budget", label: "予算はいくら？3つのモデルコース" },
  { id: "ways", label: "買い方は3通り（当日・会場受け取り・ツアー後）" },
  { id: "schedule", label: "会場別の物販時間と、アプリ整理券の配布日" },
  { id: "rules", label: "購入制限・支払い方法・ガチャのルール" },
  { id: "day", label: "当日の動き方と、11月の外テント対策" },
  { id: "after", label: "買ったあとにやっておきたいこと" },
  { id: "links", label: "公式情報へのリンク" },
];

type Item = { name: string; color?: string; price: number; note?: string };
const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "アパレル",
    items: [
      { name: "GHOST ジャケット", color: "BLACK", price: 15000 },
      { name: "ボルゾイ ジップフーディ", color: "BLACK", price: 12000 },
      { name: "ボルゾイ スウェット", color: "WASHED BLACK", price: 8800 },
      { name: "GHOST ゲームシャツ", color: "BLACK / WHITE", price: 7800 },
      { name: "IRIS OUT - T", color: "WASHED BLACK", price: 5500 },
      { name: "JANE DOE - T", color: "WASHED BLACK", price: 5500 },
      { name: "ボルゾイ T", color: "OFF WHITE", price: 5000 },
    ],
  },
  {
    title: "バッグ・小物",
    items: [
      { name: "GHOST ストール", price: 6500 },
      { name: "GHOST グローブ", color: "BLACK", price: 6500 },
      { name: "GHOST ベルトバッグ", color: "BLACK", price: 4800 },
      { name: "GHOST バケットバッグ", color: "BLUE", price: 4800 },
      { name: "GHOST キャップ", color: "BLACK / NAVY", price: 4500 },
      { name: "GHOST チェーンクラッチ", color: "BLACK", price: 3500 },
      { name: "GHOST タオル", price: 2500 },
      { name: "GHOST キーポーチ", color: "BLACK / BLUE / ORANGE", price: 1800 },
      { name: "GHOST コード ブレスレット", price: 1400 },
    ],
  },
  {
    title: "キャラクター・ガチャ",
    items: [
      { name: "リイシューねこちゃん チャーム", color: "PASTEL LILAC / ORANGE SHERBET / PASTEL BLUE", price: 2800 },
      { name: "とんがりくん キーリング", color: "WHITE / GRAY / AURORA", price: 2200 },
      { name: "ティースくん ぷっくりシール", price: 700 },
      { name: "リイシューオールスターズ / CANDY COLOR（ガチャガチャ）", price: 700, note: "1回" },
    ],
  },
];
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const TOTAL_ONE_EACH = GROUPS.flatMap((g) => g.items).reduce((a, it) => a + it.price, 0);

const SALES: { venue: string; day1: string; day2: string; place: string }[] = [
  { venue: "長野ビッグハット", day1: "11/6(金) 11:00〜（整理券 〜14:00）", day2: "11/7(土) 11:00〜（整理券 〜13:00）", place: "外テント" },
  { venue: "K-Arena Yokohama（11月）", day1: "11/11(水) 10:00〜（整理券 〜13:00）", day2: "11/12(木) 10:00〜（整理券 〜12:00）", place: "外テント" },
  { venue: "大阪城ホール", day1: "11/18(水) 12:00〜（整理券 〜15:00）", day2: "11/19(木) 13:00〜（整理券 〜15:00）", place: "外テント" },
  { venue: "マリンメッセ福岡A館", day1: "11/27(金) 12:00〜（整理券 〜15:00）", day2: "11/28(土) 11:00〜（整理券 〜13:00）", place: "外テント" },
  { venue: "セキスイハイムスーパーアリーナ", day1: "12/3(木) 12:00〜（整理券 〜15:00）", day2: "12/4(金) 13:00〜（整理券 〜15:00）", place: "サブアリーナ" },
  { venue: "ポートメッセなごや", day1: "12/8(火) 12:00〜（整理券 〜15:00）", day2: "12/9(水) 13:00〜（整理券 〜15:00）", place: "第3展示館" },
  { venue: "K-Arena Yokohama（12月）", day1: "12/16(水) 10:00〜（整理券 〜13:00）", day2: "12/17(木) 10:00〜（整理券 〜12:00）", place: "外テント" },
];

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          米津玄師「GHOST」ツアーグッズ
          <mark>全20アイテム</mark>と物販攻略
        </>
      }
      heroLead="価格の一覧、予算のモデルコース、アプリ整理券の配布日、会場受け取り、支払い方法まで。公式の発表をもとに、物販の前に知っておきたいことを1ページにまとめました。"
      stickers={["🎤 ライブ物販", "👻 GHOST", "🧾 価格一覧つき", "📅 11/6〜12/17"]}
      unofficialNote="この記事は、公式サイトの発表をもとにToolBoxJP編集部がまとめた非公式のガイドです。米津玄師さん・REISSUE RECORDSとは関係ありません。販売時間や在庫は変わることがあるので、出かける前に必ず公式の最新情報を確認してください（2026年11月6日時点の情報）。"
    >
      <p>
        11月6日の長野ビッグハットから始まった「米津玄師 2026 TOUR / GHOST」。全国6都市14公演のアリーナツアーで、12月17日のK-Arena Yokohamaまで約6週間続きます。
      </p>
      <p>
        今回のツアーグッズは、米津さん描き下ろしのビジュアルを使ったアパレルから、リイシューねこちゃん・とんがりくん・ティースくんのキャラクターグッズ、ガチャガチャまで<span className={s.hl}>全20アイテム</span>。公式のグッズページには価格・購入制限・支払い方法が細かく載っていますが、情報量が多いので、物販の前に押さえておきたいところを整理しました。
      </p>

      <Stats
        items={[
          { num: <>20<small>アイテム</small></>, label: "ツアーグッズの種類（色違いを除く）" },
          { num: <>3<small>点まで</small></>, label: "1アイテムあたり1人の購入上限" },
          { num: yen(TOTAL_ONE_EACH), label: "全アイテムを1点ずつ買った場合" },
          { num: <>14<small>公演</small></>, label: "国内6都市（11/6〜12/17）" },
        ]}
      />

      <Tldr
        items={[
          <>会場物販はチケットがなくても買える。混雑する時間帯は、公式アプリ「米津玄師 STORE」の整理券で案内</>,
          <>神奈川公演だけ、事前決済の「会場受け取り」あり（受け取り場所は横浜ランドマークホール）</>,
          <>1アイテム1人3点まで。ツアーグッズ1万円以上でショッピングバッグの先着プレゼントあり</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="lineup" num={1}>
        グッズ全20アイテムと価格
      </H2>
      <p>
        公式のグッズページに載っているラインナップを、種類ごとに並べ直しました。価格は公式ページの表記どおりです。サイズ展開は、公式ページやアプリで確認してください。
      </p>
      <div className={s.tableWrap} role="region" aria-label="GHOST ツアーグッズの一覧（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>米津玄師 2026 TOUR / GHOST ツアーグッズ一覧</caption>
          <thead>
            <tr>
              <th scope="col">アイテム</th>
              <th scope="col">カラー</th>
              <th scope="col" className={s.price}>
                価格
              </th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <Fragment key={g.title}>
                <tr className={s.group}>
                  <th scope="rowgroup" colSpan={3}>
                    {g.title}
                  </th>
                </tr>
                {g.items.map((it) => (
                  <tr key={it.name}>
                    <th scope="row">{it.name}</th>
                    <td>{it.color ?? "—"}</td>
                    <td className={s.price}>
                      {yen(it.price)}
                      {it.note && `／${it.note}`}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：REISSUE RECORDS「GOODS / GHOST」。色違いは「各」同じ価格です。</p>

      <Card kind="memo" label="ショッピングバッグのプレゼント">
        <p>
          ツアーグッズを<strong>1万円以上</strong>買った人には、NAVYのショッピングバッグを1人1枚、先着でプレゼント（なくなり次第終了）。ガチャガチャとCDは金額の対象外で、会計を分けて何枚ももらうことはできません。
        </p>
      </Card>

      <Bubble>
        キャラクターものは色違いが3色ずつ。全色そろえると、チャームは{yen(2800 * 3)}、キーリングは{yen(2200 * 3)}だよ。「推し色はどれ？」を先に決めておくと、レジで迷わないよ。
      </Bubble>

      <H2 id="budget" num={2}>
        予算はいくら？3つのモデルコース
      </H2>
      <p>
        全アイテムを1点ずつ買うと<strong>{yen(TOTAL_ONE_EACH)}</strong>。さすがに全部は…という人のために、公式の価格で組んだモデルコースを3つ用意しました。どれもショッピングバッグの条件（ガチャを除いて1万円以上）を満たしています。
      </p>
      <div className={s.plans}>
        <div className={s.plan}>
          <span className={s.planName}>🧸 キャラ小物コース</span>
          <span className={s.planTotal}>{yen(10000)}</span>
          <ul>
            <li>タオル {yen(2500)}</li>
            <li>ねこちゃんチャーム {yen(2800)}</li>
            <li>とんがりくんキーリング {yen(2200)}</li>
            <li>キーポーチ {yen(1800)}</li>
            <li>ぷっくりシール {yen(700)}</li>
          </ul>
        </div>
        <div className={s.plan}>
          <span className={s.planName}>👕 Tシャツで参戦コース</span>
          <span className={s.planTotal}>{yen(10100)}</span>
          <ul>
            <li>IRIS OUT - T {yen(5500)}</li>
            <li>タオル {yen(2500)}</li>
            <li>コード ブレスレット {yen(1400)}</li>
            <li>ぷっくりシール {yen(700)}</li>
          </ul>
        </div>
        <div className={s.plan}>
          <span className={s.planName}>🧥 冬の遠征ガチ装備コース</span>
          <span className={s.planTotal}>{yen(30500)}</span>
          <ul>
            <li>GHOST ジャケット {yen(15000)}</li>
            <li>GHOST ストール {yen(6500)}</li>
            <li>GHOST グローブ {yen(6500)}</li>
            <li>GHOST タオル {yen(2500)}</li>
          </ul>
        </div>
      </div>
      <p>
        ここにガチャガチャを足すなら、1回{yen(700)}×回数ぶんを別に考えておきましょう（1回の並びで6回まで）。
      </p>

      <H2 id="ways" num={3}>
        買い方は3通り（当日・会場受け取り・ツアー後）
      </H2>
      <h3>① 公演当日に会場で買う</h3>
      <p>
        いちばん基本の買い方です。各会場の外テントなどで販売され、<strong>公演チケットがない人も買えます</strong>。開場後・終演後も販売があります。販売開始からしばらくの混雑する時間帯は、公式アプリ「米津玄師 STORE」の<strong>整理券</strong>で案内される仕組みです。
      </p>
      <p>
        このアプリは、欲しい商品を前もってリストにしておけるグッズオーダーアプリで、整理券の取得にも使います。公式は混雑緩和のためにインストールへの協力を呼びかけているので、行く人は早めに入れておきましょう。
      </p>
      <h3>② 会場受け取り（神奈川公演だけ）</h3>
      <p>
        K-Arena Yokohamaの公演に合わせて、事前に決済して受け取るだけの「会場受け取り」があります。受け取り場所は<strong>横浜ランドマークホール</strong>で、ライブ会場のK-Arena Yokohamaからは徒歩20分以上かかります。ライブ会場ではないので注意しましょう。
      </p>
      <div className={s.tableWrap} role="region" aria-label="会場受け取りの予約期間と受取日" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">公演</th>
              <th scope="col">予約期間</th>
              <th scope="col">受け取りできる日時</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">神奈川 11月</th>
              <td>11/3(火祝) 20:00〜11/5(木) 20:00（受付終了）</td>
              <td>11/10(火) 12:00〜21:00 / 11/11(水) 10:00〜21:00 / 11/12(木) 10:00〜18:00</td>
            </tr>
            <tr>
              <th scope="row">神奈川 12月</th>
              <td>
                <strong>12/7(月) 20:00〜12/10(木) 20:00</strong>
              </td>
              <td>12/15(火) 12:00〜21:00 / 12/16(水) 10:00〜21:00 / 12/17(木) 10:00〜18:00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>商品数と受け取り枠には限りがあります。売り切れ・枠終了のときは、ライブ会場での当日購入になります。</p>
      <Card kind="caution">
        <p>
          会場受け取りは、決済が終わったあとの<strong>キャンセル・サイズ変更・交換ができません</strong>。サイズはよく確かめてから決済しましょう。支払いはアプリに登録したクレジットカード・PayPay・paidyで、銀行振込とコンビニ払いは使えません。
        </p>
      </Card>
      <h3>③ ツアーが終わってから通販で買う</h3>
      <p>
        公式グッズページによると、ツアーグッズは<strong>ツアー終了後に販売を予定</strong>しています（詳細は後日発表、数量限定）。遠方で行けない人や、会場で売り切れていた人は、公式のお知らせを待ちましょう。
      </p>

      <ArticleAd />

      <H2 id="schedule" num={4}>
        会場別の物販時間と、アプリ整理券の配布日
      </H2>
      <p>
        販売開始時刻と、整理券で案内される時間帯は会場ごとに違います。横浜は10時から、大阪・福岡・宮城・名古屋の平日は昼からなど、かなり差があるので、自分の公演の行を確認しておきましょう。
      </p>
      <div className={s.tableWrap} role="region" aria-label="会場別の物販時間（横にスクロールできます）" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 640 }}>
          <caption>会場別の物販開始時刻（カッコ内は整理券で案内される時間帯）</caption>
          <thead>
            <tr>
              <th scope="col">会場</th>
              <th scope="col">1日目</th>
              <th scope="col">2日目</th>
              <th scope="col">販売場所</th>
            </tr>
          </thead>
          <tbody>
            {SALES.map((r) => (
              <tr key={r.venue}>
                <th scope="row">{r.venue}</th>
                <td>{r.day1}</td>
                <td>{r.day2}</td>
                <td>{r.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>販売開始時刻は状況によって前後することがあります。スマホでは表を横にスクロールできます。</p>

      <p>アプリの整理券は、各会場の公演の数日前の<strong>20:00から</strong>配布されます。</p>
      <Timeline
        items={[
          { date: "11/2(月) 20:00〜", text: "長野公演の整理券" },
          { date: "11/8(日) 20:00〜", text: "神奈川（11月）公演の整理券", hot: true },
          { date: "11/13(金) 20:00〜", text: "大阪公演の整理券" },
          { date: "11/20(金) 20:00〜", text: "福岡公演の整理券" },
          { date: "11/25(水) 20:00〜", text: "宮城公演の整理券" },
          { date: "12/5(土) 20:00〜", text: "愛知公演の整理券" },
          { date: "12/11(金) 20:00〜", text: "神奈川（12月）公演の整理券" },
        ]}
      />
      <Bubble>
        次は11/8(日)の夜、横浜公演の整理券だよ。スマホのリマインダーに「20時 整理券」って入れておこう！
      </Bubble>

      <H2 id="rules" num={5}>
        購入制限・支払い方法・ガチャのルール
      </H2>
      <h3>購入制限</h3>
      <ul>
        <li>
          <strong>1アイテムにつき1人3点まで。</strong>サイズ展開のある商品は、全サイズの合計で3点までです。
        </li>
        <li>ショッピングバッグは1人1枚まで（ツアーグッズ1万円以上・先着）。</li>
      </ul>
      <h3>支払い方法（会場販売）</h3>
      <div className={s.tableWrap} role="region" aria-label="会場販売で使える支払い方法" tabIndex={0}>
        <table className={s.table}>
          <tbody>
            <tr>
              <th scope="row">現金</th>
              <td>使える</td>
            </tr>
            <tr>
              <th scope="row">クレジットカード</th>
              <td>アプリに事前登録し、現地で決済</td>
            </tr>
            <tr>
              <th scope="row">電子マネー</th>
              <td>iD、QUICPay、交通系IC各種</td>
            </tr>
            <tr>
              <th scope="row">QRコード決済</th>
              <td>PayPay、楽天ペイ、au PAY、d払い、WeChat Pay、Alipay</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>クレジットカードは「アプリで事前登録」が前提です。当日あわてないよう、前日までに登録しておきましょう。</p>
      <h3>ガチャガチャ「リイシューオールスターズ / CANDY COLOR」</h3>
      <ul>
        <li>先にコイン交換所で専用コインに交換してから、ガチャの列に並びます。</li>
        <li>
          <strong>1回の並びにつき6回まで</strong>（専用コインの交換も6枚まで）。
        </li>
        <li>専用コインは<strong>当日のみ有効</strong>。余らせないように回数を決めてから交換しましょう。</li>
        <li>支払いは現金、クレジットカード、PayPay、交通系IC（PiTaPaを除く）。</li>
      </ul>

      <H2 id="day" num={6}>
        当日の動き方と、11月の外テント対策
      </H2>
      <p>公式の情報をもとに、当日の流れを組み立てるとこんな感じです。</p>
      <ol>
        <li>
          <strong>前日まで：</strong>アプリ「米津玄師 STORE」で欲しい商品をリスト化し、クレジットカードを登録。整理券の配布日（20:00〜）に整理券を取る。
        </li>
        <li>
          <strong>当日の朝：</strong>公式SNSで販売時間の変更や売り切れのお知らせがないかチェック。
        </li>
        <li>
          <strong>整理券の時間帯：</strong>指定された時間に販売場所へ。整理券の時間帯が終わったあとや、開場後・終演後にも販売があります。
        </li>
        <li>
          <strong>買ったら：</strong>荷物をまとめてからライブ会場へ。会場によってはロッカーの数や大きさに限りがあるので、大きなアパレルを買う予定の人は折りたためるバッグがあると安心です。
        </li>
      </ol>
      <Card kind="point" label="11〜12月の外テントは寒い">
        <p>
          長野・横浜・大阪・福岡の販売場所は「外テント」です。11月後半〜12月は日が落ちると一気に冷えるので、カイロ・手袋・温かい飲み物があると並ぶのがぐっと楽になります（そういう意味では、GHOSTグローブとストールは今回いちばん実用的なグッズかも…）。
        </p>
      </Card>
      <Card kind="caution" label="会場でのルール（公式チケットサイトより）">
        <ul>
          <li>入場時は全員が本人確認。公的身分証明書（コピー不可）を必ず持っていく。</li>
          <li>客席内での撮影・録音・録画は、入場時から退場時まで一切禁止。</li>
          <li>ステージや客席が写った写真・動画をSNSに載せるのも禁止。</li>
          <li>会場周辺で長時間とどまらない。近隣への配慮を。</li>
        </ul>
      </Card>
      <p>
        遠征する人の持ち物は「
        <Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>
        」に、横浜公演に行く人は「
        <Link href="/blog/k-arena-yokohama-guide">Kアリーナ横浜ガイド</Link>
        」にまとめています。
      </p>

      <H2 id="after" num={7}>
        買ったあとにやっておきたいこと
      </H2>
      <p>
        ツアーは12月まで続き、複数公演に入る人や、友達の分をまとめて買う人も多いはず。「どれをもう買ったか」「ガチャで何が出たか」は、その日のうちにメモしておくのがおすすめです。ツアー後の通販が始まったときに、買い足すものをすぐ判断できます。
      </p>
      <Bubble>
        ガチャは何が出たかを残しておくと、ダブりを交換に出すときに便利だよ。写真つきだとさらに分かりやすい！
      </Bubble>

      <MochicoNudge title="買ったグッズを、写真つきの一覧にしておくなら">
        <p>
          「Mochico（モチコ）」は、ライブやイベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。ガチャのようなランダムグッズは絵柄ごとに個数を記録でき、リストはリンクで友達と共有できます。
        </p>
      </MochicoNudge>

      <H2 id="links" num={8}>
        公式情報へのリンク
      </H2>
      <p>グッズの写真やサイズ、最新のお知らせは公式で確認できます。</p>
      <OfficialLinks
        items={[
          { href: "https://reissuerecords.net/goods/", title: "GOODS / GHOST（公式グッズページ）", icon: "👕" },
          { href: "https://reissuerecords.net/2026/07/03/2026-tour-ghost/", title: "米津玄師 2026 TOUR / GHOST（公演情報）", icon: "👻" },
          { href: "https://ticket.kenshiyonezu.jp/tour/2026", title: "KENSHI YONEZU TICKET（公式リセール）", icon: "🎫" },
          { href: "https://shop.kenshiyonezu.jp/", title: "米津玄師 ONLINE STORE", icon: "🛍️" },
        ]}
      />

      <Sources
        items={[
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（価格・販売時間・整理券・会場受け取り・支払い方法・購入制限）" },
          { href: "https://reissuerecords.net/2026/07/03/2026-tour-ghost/", label: "REISSUE RECORDS「米津玄師 2026 TOUR / GHOST」（公演日程）" },
          { href: "https://ticket.kenshiyonezu.jp/pages/2026_ticketcaution", label: "KENSHI YONEZU TICKET「注意事項」（本人確認・撮影禁止など）" },
          { href: "https://natalie.mu/music/news/696163", label: "音楽ナタリー「米津玄師ツアー『GHOST』グッズ リイシューねこちゃん、とんがりくん、ティースくんが大集合」" },
          { href: "https://www.thefirsttimes.jp/news/0000910204/", label: "THE FIRST TIMES「『米津玄師 2026 TOUR / GHOST』グッズビジュアル公開」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
