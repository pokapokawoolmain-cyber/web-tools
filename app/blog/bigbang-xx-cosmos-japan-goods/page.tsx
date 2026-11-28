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

const post = getBlogPost("bigbang-xx-cosmos-japan-goods")!;
const list = LIVE_LISTS.bigbang;
const listHref = list.listUrl ?? "/mochico";

export const metadata = mochicoArticleMeta(post, [
  "BIGBANG ドームツアー グッズ",
  "BIGBANG XX COSMOS グッズ",
  "BIGBANG 東京ドーム 2026",
  "BIGBANG 名古屋 バンテリンドーム",
  "BIGBANG 福岡 PayPayドーム",
  "BIGBANG ペンライト 20周年",
  "BIGBANG 会場限定グッズ",
]);

const TOC: TocItem[] = [
  { id: "schedule", label: "日本4都市10公演の日程と開場/開演" },
  { id: "goods", label: "グッズ全34アイテムと予算計算" },
  { id: "limited", label: "会場限定グッズと、25,000円ごとのフォトカード" },
  { id: "lightstick", label: "20周年ペンライトと応援グッズのルール" },
  { id: "buy", label: "会場販売・オンライン（YGEX）の買い方" },
  { id: "entry", label: "入場（AnyPASS）と持ち物" },
];

const SHOWS = [
  { city: "大阪", venue: "京セラドーム大阪", days: "11/27(金)・28(土)・29(日)", time: "開演18:00／17:00／17:00", href: "/blog/kyocera-dome-osaka-guide", done: true },
  { city: "名古屋", venue: "バンテリンドーム ナゴヤ", days: "12/5(土)・6(日)", time: "開場15:00・開演17:00", href: "/blog/vantelin-dome-nagoya-guide" },
  { city: "東京", venue: "東京ドーム", days: "12/13(日)・14(月)・15(火)", time: "13日 17:00開演／14・15日 18:00開演", href: "/blog/tokyo-dome-guide" },
  { city: "福岡", venue: "みずほPayPayドーム福岡", days: "12/26(土)・27(日)", time: "開場15:00・開演17:00", href: "/blog/paypay-dome-fukuoka-guide" },
];

/** 自作の図：4都市のツアーの流れ */
function TourMap() {
  return (
    <svg viewBox="0 0 360 290" role="img" aria-labelledby="bb-title bb-desc">
      <title id="bb-title">BIGBANG XX : COSMOS 日本ドームツアーの流れ</title>
      <desc id="bb-desc">大阪（11/27〜29）、名古屋（12/5・6）、東京（12/13〜15）、福岡（12/26・27）の4都市10公演。</desc>
      {SHOWS.map((sh, i) => {
        const y = 10 + i * 70;
        return (
          <g key={sh.city}>
            <rect x="8" y={y} width="344" height="60" rx="14" fill={sh.done ? "#f1efe8" : "#fff7d6"} stroke={sh.done ? "#ddd" : "#f0d77a"} />
            <circle cx="38" cy={y + 30} r="17" fill={sh.done ? "#b9b4a4" : "#a87c00"} />
            <text x="38" y={y + 35} fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">
              {i + 1}
            </text>
            <text x="66" y={y + 25} fontSize="13.5" fontWeight="900" fill="#1b1430">
              {sh.city}
              <tspan dx="6" fontSize="11" fontWeight="700" fill="#625b7c">
                {sh.venue}
              </tspan>
            </text>
            <text x="66" y={y + 46} fontSize="11.5" fontWeight="800" fill="#6f5300">
              {sh.days}
            </text>
            {sh.done && (
              <text x="340" y={y + 25} fontSize="10.5" fontWeight="900" fill="#625b7c" textAnchor="end">
                開催中〜終了
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="bigbang"
      heading={
        <>
          BIGBANG「XX : COSMOS」<mark>日本ドームツアー</mark>のグッズ完全ガイド
        </>
      }
      heroLead="デビュー20周年のワールドツアー、日本は4都市10公演。名古屋・東京・福岡に向けて、グッズ34アイテムの予算計算、会場ごとの限定グッズ、25,000円ごとのフォトカード、20周年ペンライト、AnyPASS での入場までまとめました。"
      stickers={["👑 XX : COSMOS", "🎉 20周年", "🛍️ 全34アイテム", "📅 11/27〜12/27"]}
      heroExtra={
        <LiveCountdown
          shows={[
            { label: "11/28(土) 大阪の開演", start: "2026-11-28T17:00:00+09:00" },
            { label: "11/29(日) 大阪の開演", start: "2026-11-29T17:00:00+09:00" },
            { label: "12/5(土) 名古屋の開演", start: "2026-12-05T17:00:00+09:00" },
            { label: "12/6(日) 名古屋の開演", start: "2026-12-06T17:00:00+09:00" },
            { label: "12/13(日) 東京ドームの開演", start: "2026-12-13T17:00:00+09:00" },
            { label: "12/14(月) 東京ドームの開演", start: "2026-12-14T18:00:00+09:00" },
            { label: "12/15(火) 東京ドームの開演", start: "2026-12-15T18:00:00+09:00" },
            { label: "12/26(土) 福岡の開演", start: "2026-12-26T17:00:00+09:00" },
            { label: "12/27(日) 福岡の開演", start: "2026-12-27T17:00:00+09:00" },
          ]}
        />
      }
      unofficialNote="この記事は、BIGBANG 20TH ANNIVERSARY 公式サイト（YGEX）・主催者の公演ページなどの公式発表をもとに ToolBoxJP 編集部がまとめた非公式のガイドです。出演者・主催者とは関係ありません。名古屋・東京・福岡の会場販売の詳細は公式で「別途お知らせ」とされています。出かける前に必ず最新情報を確認してください（2026年11月28日時点）。"
    >
      <p>
        2006年のデビューから20周年。BIGBANG のワールドツアー「BIGBANG 2026-2027 WORLD TOUR &lt; XX : COSMOS &gt;」の日本公演は、<strong>大阪・名古屋・東京・福岡の4大ドームで全10公演</strong>。大阪公演（11/27〜29）から始まり、12/27 の福岡まで続きます。11/20 には新曲「GiiiRIP」も配信されました。
      </p>
      <p>
        グッズは、ツアー共通の34アイテムに加えて、<span className={s.hl}>会場ごとの限定アイテム</span>（スウェットセットアップ・キャップ・お守りなど）が用意されているのが特徴。どの会場で何を買うか、先に決めておきましょう。
      </p>

      <Tldr
        items={[
          <>日本は4都市10公演。名古屋 12/5・6、東京ドーム 12/13〜15、福岡 12/26・27</>,
          <>会場のグッズ売場で 25,000円（税込）ごとにフォトカード1枚（ランダム全3種・ペンライトとカプセルトイは対象外）</>,
          <>20周年ペンライト（8,900円）は電池別売り・単4アルカリ3本。公式以外の応援グッズは使えない</>,
        ]}
      />

      <MochicoListCard href={list.listUrl} tour="BIGBANG「XX : COSMOS」" goodsCount={list.items.length} />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        日本4都市10公演の日程と開場/開演
      </H2>
      <Figure caption="編集部作成。日程は公式サイトの発表によります。">
        <TourMap />
      </Figure>
      <div className={s.tableWrap} role="region" aria-label="日程と会場ガイド" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th scope="col">都市</th>
              <th scope="col">日程</th>
              <th scope="col">時間</th>
              <th scope="col">会場ガイド</th>
            </tr>
          </thead>
          <tbody>
            {SHOWS.map((sh) => (
              <tr key={sh.city}>
                <th scope="row">{sh.city}</th>
                <td>{sh.days}</td>
                <td>{sh.time}</td>
                <td>
                  <Link href={sh.href}>{sh.venue}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>東京の開場は 13日 15:00、14・15日 16:00。大阪 11/27 は開場16:00・開演18:00。出演メンバー・開場/開演時間は予告なく変わることがあります。</p>

      <H2 id="goods" num={2}>
        グッズ全34アイテムと予算計算
      </H2>
      <p>
        欲しいものに<strong>チェックを入れると合計がその場で出ます</strong>。MA-1（29,900円）やボアフリースジャケット（22,900円）は、それだけでフォトカードの条件（25,000円）に届くかどうかの分かれ目です。
      </p>
      <GoodsBudget items={list.items} listHref={listHref} listLabel="Mochicoでリストを開く" />
      <p className={s.tableNote}>
        価格は公式のグッズ一覧（税込）をもとに作成した Mochico のリストの内容です。「スウェットセットアップ」は会場限定、「カプセルトイ」（ランダム全16種）は会場のみの販売です。
      </p>
      <Bubble>
        徳利＆お猪口セット、けん玉、ジグソーパズル…20周年らしい遊び心のあるグッズも。ツアーTとタオルだけの人と、アウターまで買う人で予算がまったく変わるから、上でチェックしてみてね。
      </Bubble>

      <H2 id="limited" num={3}>
        会場限定グッズと、25,000円ごとのフォトカード
      </H2>
      <p>次のアイテムには<strong>大阪・名古屋・東京・福岡の会場ごとのバージョン</strong>があり、オンラインでは売られません。</p>
      <div className={s.tableWrap} role="region" aria-label="会場限定グッズ" tabIndex={0}>
        <table className={s.table}>
          <caption>会場限定（各会場名入り・オンライン販売なし）</caption>
          <tbody>
            <tr>
              <th scope="row">スウェットセットアップ</th>
              <td className={s.price}>¥21,800</td>
            </tr>
            <tr>
              <th scope="row">キャップ</th>
              <td className={s.price}>¥4,500</td>
            </tr>
            <tr>
              <th scope="row">スポーツタオル</th>
              <td className={s.price}>¥3,200</td>
            </tr>
            <tr>
              <th scope="row">クッションキーリング</th>
              <td className={s.price}>¥2,500</td>
            </tr>
            <tr>
              <th scope="row">お守り</th>
              <td className={s.price}>¥1,500</td>
            </tr>
            <tr>
              <th scope="row">ハンドタオル</th>
              <td className={s.price}>¥1,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Card kind="point" label="フォトカードの条件">
        <ul>
          <li>会場のグッズ売場で、対象グッズを<strong>税込25,000円ごとにフォトカード1枚</strong>（ランダム全3種）。枚数の上限はありませんが、特典の数には限りがあります。</li>
          <li>ペンライトとカプセルトイは対象外。同じ会計の中は合算できますが、別の会計どうしは合算できません。</li>
          <li>オンライン（YGEX OFFICIAL SHOP）も1会計25,000円ごとに1枚（送料は含まず・ペンライトは対象外）。</li>
        </ul>
      </Card>
      <Card kind="memo" label="FC会員限定のホワイトタオル">
        <p>【TOUR】スポーツタオルの WHITE（3,200円）は FC 会員限定。オンラインや POP-UP では売られず、会場で<strong>デジタル会員証の提示</strong>が必要です。</p>
      </Card>

      <ArticleAd />

      <H2 id="lightstick" num={4}>
        20周年ペンライトと応援グッズのルール
      </H2>
      <Stats
        items={[
          { num: <>¥8,900</>, label: "OFFICIAL LIGHT STICK 20TH ANNIVERSARY EDITION" },
          { num: <>3<small>本</small></>, label: "単4アルカリ電池（別売り）" },
          { num: <>¥1,900</>, label: "ライトスティックリング A・B（V.4 にも使える）" },
          { num: <>¥2,800</>, label: "ライトスティックのキーリング（電池付き）" },
        ]}
      />
      <ul>
        <li>ペンライトには<strong>電池が付いていません</strong>。単4アルカリ乾電池3本を用意しておきましょう。</li>
        <li>大阪公演では会場のグッズ売場でペンライトの取り扱いが始まりました。ほかの会場の販売は公式で別途案内されます。</li>
        <li>オンラインでの購入分は、名古屋公演までのお届けは予定されていません。</li>
        <li>
          主催者の案内では、<strong>公式に販売したもの以外の応援グッズ（うちわ・ペンライトなど）は使えません</strong>。
        </li>
      </ul>

      <H2 id="buy" num={5}>
        会場販売・オンライン（YGEX）の買い方
      </H2>
      <ul>
        <li>
          <strong>オンライン：</strong>YGEX OFFICIAL SHOP で 11/2 から販売（会員登録が必要・発送は11月中旬以降）。会場名入りの限定品やカプセルトイはオンラインでは買えません。
        </li>
        <li>
          <strong>大阪の会場販売：</strong>「販売体制を拡大」と発表され、整理券を持っていない人もフリー入場・キャンセル待ちで順に案内されました（整理券を持つ人が優先）。
        </li>
        <li>
          <strong>名古屋・東京・福岡：</strong>販売の詳細は「別途お知らせ」。大阪と同じく整理券優先の形になる可能性があるので、公式の発表をこまめに確認しましょう。
        </li>
        <li>注文後のキャンセル・返品・支払方法や数量の変更はできません（オンライン）。</li>
      </ul>
      <Card kind="memo" label="大阪だけのフード＆ドリンク">
        <p>大阪公演では、オリジナルコースター付きの「&lt; XX : COSMOS &gt; DRINK&amp;CHURROS」が数量限定で販売されました（2F 特設ワゴン・3F/5F の売店）。</p>
      </Card>

      <H2 id="entry" num={6}>
        入場（AnyPASS）と持ち物
      </H2>
      <ul>
        <li>大阪公演のチケットはスマホのデジタルチケット「AnyPASS」。同行者には事前に分配しておきましょう（同行者も無料登録と受け取りが必要）。</li>
        <li>チケットは申し込み時の携帯番号に紐づくので、公演日まで番号の変更・解約をしないこと。</li>
        <li>3歳以上はチケットが必要で、3歳未満は入場できません。撮影・録音・録画は禁止です。</li>
      </ul>
      <Checklist
        title="XX : COSMOS の持ち物"
        icon="👑"
        items={[
          { must: true, text: "AnyPASS が入ったスマホ（同行者への分配も済ませる）" },
          { must: true, text: "ペンライト用の単4アルカリ電池3本", why: "20周年ペンライトは電池別売り" },
          { text: "FC のデジタル会員証", why: "FC限定のホワイトタオルを買う人" },
          { text: "大きめのバッグ", why: "アウターやブランケットはかさばる。ショッパー（1,500円）も" },
          { text: "防寒着", why: "12月の名古屋・東京・福岡の物販列は冷える" },
          { text: "モバイルバッテリー" },
        ]}
      />
      <MochicoListCard href={list.listUrl} tour="BIGBANG「XX : COSMOS」" goodsCount={list.items.length} note="会場ごとの限定品を集める人は、Mochicoのリストで買ったものをチェックしておくと、次の会場で何を買えばいいかすぐ分かります。" />

      <OfficialLinks
        items={[
          { href: "https://ygex.jp/bigbang/20th-anniv/", title: "BIGBANG 20TH ANNIVERSARY 公式サイト", icon: "👑" },
          { href: "https://ygex.jp/bigbang/20th-anniv/goods/items.php?id=1002866", title: "JAPAN TOUR グッズ一覧", icon: "🛍️" },
          { href: "https://ygex.jp/bigbang/20th-anniv/goods/items.php?id=1002869", title: "20周年ライトスティック", icon: "💡" },
          { href: "https://shop.ygex.jp/collections/bigbang-2026-goods", title: "YGEX OFFICIAL SHOP", icon: "🛒" },
        ]}
      />
      <Sources
        items={[
          { href: "https://ygex.jp/bigbang/20th-anniv/", label: "BIGBANG 20TH ANNIVERSARY Official Website（日程・開場/開演・ニュース）" },
          { href: "https://ygex.jp/bigbang/20th-anniv/goods/items.php?id=1002866", label: "YGEX「JAPAN TOUR グッズ」（ラインナップ・価格・会場限定・フォトカード特典）" },
          { href: "https://ygex.jp/bigbang/20th-anniv/goods/items.php?id=1002869", label: "YGEX「BIGBANG OFFICIAL LIGHT STICK 20TH ANNIVERSARY EDITION」" },
          { href: "https://ygex.jp/bigbang/20th-anniv/news/detail.php?id=1137519", label: "YGEX「大阪会場 グッズ販売のご案内」" },
          { href: "https://ygex.jp/bigbang/20th-anniv/news/detail.php?id=1137457", label: "YGEX「大阪会場 オリジナル FOOD&DRINK」" },
          { href: "https://kyodo-osaka.co.jp/search/detail/12886", label: "キョードーインフォメーション「BIGBANG 2026-2027 WORLD TOUR < XX : COSMOS > IN JAPAN」（AnyPASS・注意事項）" },
          { href: "https://kpop-concert.jp/artists/bigbang/xx-cosmos-japan-dome-tour-2026", label: "kpop-concert.jp「BIGBANG、日本ドームツアーは4都市10公演」" },
        ]}
      />
    </OshiArticleLayout>
  );
}
