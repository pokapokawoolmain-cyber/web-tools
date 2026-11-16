import Link from "next/link";
import { CalendarCheck, ExternalLink, ShoppingBag } from "lucide-react";
import { getBlogPost } from "@/data/blog-posts";
import { getTemplate, sumPrice } from "@/lib/mochico/templates";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Card,
  Checklist,
  H2,
  MochicoNudge,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Timeline,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";

const post = getBlogPost("disney-christmas-2026-goods")!;

export const metadata = mochicoArticleMeta(post, [
  "ディズニー クリスマス グッズ 2026",
  "リルリンリン 2026",
  "リルリンリン ぬいぐるみバッジ 値段",
  "ディズニー クリスマス グッズ いつから",
  "ディズニー グッズ スタンバイパス クリスマス",
  "ディズニー クリスマス ぬいぐるみバッジ",
]);

const TDR = "https://www.tokyodisneyresort.jp";
const T = getTemplate("disney-christmas-2026")!;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

const TOC: TocItem[] = [
  { id: "schedule", label: "販売開始日とイベントの日程" },
  { id: "list", label: "価格の一覧（公式の商品ページで確認できた20点）" },
  { id: "budget", label: "予算の目安" },
  { id: "standby", label: "スタンバイパスが必要なショップ" },
  { id: "rules", label: "買う前に知っておきたいこと" },
  { id: "list-make", label: "買う物リストを作っておく" },
  { id: "links", label: "公式情報へのリンク" },
];

/** スタンバイパスが必要なショップ（東京ディズニーリゾート「サイト更新情報」グッズ/ショップより） */
const STANDBY: { park: string; shop: string; from: string; announced: string }[] = [
  { park: "ランド", shop: "ディズニー＆カンパニー", from: "11/10(火)〜", announced: "10/7" },
  { park: "ランド", shop: "ギャグファクトリー／ファイブ・アンド・ダイム", from: "11/10(火)〜", announced: "10/7" },
  { park: "ランド", shop: "トレジャーコメット", from: "11/10(火)〜", announced: "10/7" },
  { park: "ランド", shop: "アドベンチャーランド・バザール", from: "11/10(火)〜", announced: "10/7" },
  { park: "ランド", shop: "ジャングルカーニバル", from: "11/10(火)〜", announced: "10/7" },
  { park: "ランド", shop: "ガラスの靴", from: "11/17(火)〜", announced: "11/16" },
  { park: "シー", shop: "ガッレリーア・ディズニー", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "スリーピーホエール・ショップ", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "エンポーリオ", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "タワー・オブ・テラー・メモラビリア", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "マーメイドトレジャー", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "アブーズ・バザール", from: "11/10(火)〜", announced: "10/7" },
  { park: "シー", shop: "アグラバーマーケットプレイス", from: "11/11(水)〜", announced: "11/10" },
];

const groups = [...new Set(T.items.map((it) => it.category))].map((cat) => ({ cat, items: T.items.filter((it) => it.category === cat) }));
const pick = (names: string[]) => T.items.filter((it) => names.includes(it.name));
const PLANS = [
  { name: "リルリンリンのぬいぐるみバッジを1つ", items: pick(["ぬいぐるみバッジ（リルリンリン・ピンクの衣装）"]) },
  {
    name: "リルリンリンをひと通り（ぬいぐるみ・バッジ3種・チャーム1回）",
    items: pick([
      "ぬいぐるみ（リルリンリン）",
      "ぬいぐるみバッジ（リルリンリン・グリーンの衣装）",
      "ぬいぐるみバッジ（リルリンリン・ピンクの衣装）",
      "ぬいぐるみバッジ（リルリンリン・ジュビリーブルー／東京ディズニーシー25周年）",
      "ぬいぐるみチャーム（リルリンリン）",
    ]),
  },
  {
    name: "パレードのぬいぐるみバッジ4種をそろえる",
    items: T.items.filter((it) => it.category === "パレード"),
  },
];

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      theme="xmas"
      heading={
        <>
          ディズニー・クリスマス2026の<mark>グッズと買い方</mark>
        </>
      }
      heroLead="グッズの販売は11月10日(火)から。リルリンリンのぬいぐるみバッジやパレードのぬいぐるみバッジなど、公式の商品ページで価格を確認できた20点の一覧と、スタンバイパスが必要なショップをまとめました。"
      stickers={["ディズニー・クリスマス", "2026", "リルリンリン", "スタンバイパス"]}
      unofficialNote="この記事は ToolBoxJP 編集部が東京ディズニーリゾート公式サイトの情報をもとにまとめた非公式の記事です。商品の画像は掲載していません。価格・販売店舗・在庫は変わることがあるため、最新の情報は公式サイトと東京ディズニーリゾート・アプリで確認してください（確認日：2026年11月17日）。"
    >
      <Tldr
        items={[
          <>グッズの販売は<strong>11月10日(火)から</strong>。イベント「ディズニー・クリスマス」は11月11日(水)〜12月25日(金)</>,
          <>リルリンリンのぬいぐるみバッジは<strong>¥2,500</strong>（東京ディズニーシー25周年のジュビリーブルーは¥2,800）</>,
          <>ランドとシーの<strong>13店</strong>でスタンバイパスが必要（11月17日時点の公式の案内）</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="schedule" num={1}>
        販売開始日とイベントの日程
      </H2>
      <Timeline
        items={[
          { date: "11/1(日)", text: "スペシャルメニューの販売開始（ランドの「ジョリーフード・プラザ」も同じ日から）" },
          { date: "11/10(火)", text: "スペシャルグッズの販売開始。ランド5店・シー6店でスタンバイパスが必要に", hot: true },
          { date: "11/11(水)", text: "イベント「ディズニー・クリスマス」開始。シーのアグラバーマーケットプレイスもスタンバイパスの対象に" },
          { date: "11/17(火)", text: "ランドのガラスの靴もスタンバイパスの対象に" },
          { date: "12/25(金)", text: "イベント最終日" },
        ]}
      />
      <p>
        イベントの楽しみ方（パレード・新登場の「ジョリーフード・プラザ」・限定メニューなど）は
        <Link href="/blog/disney-christmas-2026-guide">ディズニー・クリスマス2026はいつから？まとめ</Link>
        にまとめています。
      </p>

      <H2 id="list" num={2}>
        価格の一覧（公式の商品ページで確認できた20点）
      </H2>
      <p>
        東京ディズニーリゾート公式サイトの商品ページ（おすすめグッズ）で、価格を確認できたものです。クリスマスグッズの<strong>全商品ではありません</strong>。価格はすべて税込です。
      </p>
      <div className={s.tableWrap} role="region" aria-label="ディズニー・クリスマス2026のグッズの価格（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>ディズニー・クリスマス2026 グッズの価格（11月17日確認）</caption>
          <thead>
            <tr>
              <th>種類</th>
              <th>商品</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {groups.flatMap((g) =>
              g.items.map((it, i) => (
                <tr key={it.name}>
                  {i === 0 && <th scope="rowgroup" rowSpan={g.items.length}>{g.cat}</th>}
                  <td>
                    {it.name}
                    {it.note && <span className={s.tableNote}>（{it.note}）</span>}
                  </td>
                  <td>{it.price != null ? yen(it.price) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>20点すべて1つずつ買うと {yen(sumPrice(T.items))}。販売店舗は商品ごとに違うため、東京ディズニーリゾート・アプリで確認してください。</p>

      <H2 id="budget" num={3}>
        予算の目安
      </H2>
      <div className={s.tableWrap} role="region" aria-label="予算の目安" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>買い方</th>
              <th>合計</th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{yen(sumPrice(p.items))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>ぬいぐるみチャームはどれが出るか分からない商品のため、1回分の価格で計算しています。</p>

      <ArticleAd />

      <H2 id="standby" num={4}>
        スタンバイパスが必要なショップ
      </H2>
      <p>
        クリスマスグッズを販売するため、次のショップは入店にスタンバイパス（東京ディズニーリゾート・アプリで取る入店の予約）が必要です。どれも「当面の間」で、終わる日は決まっていません。
      </p>
      <div className={s.tableWrap} role="region" aria-label="スタンバイパスが必要なショップ" tabIndex={0}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>パーク</th>
              <th>ショップ</th>
              <th>対象になる日</th>
            </tr>
          </thead>
          <tbody>
            {STANDBY.map((x) => (
              <tr key={x.shop}>
                <td>{x.park}</td>
                <th scope="row">{x.shop}</th>
                <td>{x.from}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>出典：東京ディズニーリゾート「サイト更新情報（グッズ/ショップ）」10/7・11/10・11/16 更新分。対象のショップは追加されることがあります。</p>
      <Card kind="memo">
        <p>
          東京ディズニーシーでは、ダッフィー＆フレンズの冬のグッズのため、11月2日(月)から当面の間、マクダックス・デパートメントストア、アーント・ペグズ・ヴィレッジストア、ガッレリーア・ディズニーもスタンバイパスの対象です（同じ更新情報より）。
        </p>
      </Card>

      <H2 id="rules" num={5}>
        買う前に知っておきたいこと
      </H2>
      <p>公式サイトの商品ページ・イベントページに書かれている注意です。</p>
      <ul>
        <li>ひとりあたりの販売数や、入店の回数が制限されることがある</li>
        <li>グッズを買うときに、ひとり1枚のパークチケットが必要になることがある</li>
        <li>一部の商品は、販売開始のあとに東京ディズニーリゾート・アプリで予約販売になることがある（対象はアプリで確認）</li>
        <li>パーク外のボン・ヴォヤージュは、入店に事前の来店予約が必要になることがある</li>
        <li>在庫によっては、イベント期間中でも品切れ・販売終了になることがある</li>
      </ul>
      <Checklist
        title="パークに行く前に"
        icon={<CalendarCheck className="w-5 h-5" aria-hidden />}
        items={[
          { text: "東京ディズニーリゾート・アプリにログインできるか確認", must: true, why: "スタンバイパス・在庫・取り扱いショップの確認に使う" },
          { text: "欲しい商品の取り扱いショップと在庫をアプリで確認" },
          { text: "スタンバイパスが必要なショップか確認（上の表）" },
          { text: "買う物と予算を決めておく" },
        ]}
      />
      <Card kind="info" label="オフィシャルホテル限定">
        <p>
          オフィシャルホテル6館の限定プランでは、11月11日(水)〜12月25日(金)の宿泊分に、オリジナルの窓付ポーチがつきます（パークでは買えないグッズ）。詳しくは各ホテルのウェブサイトで確認してください。
        </p>
      </Card>

      <H2 id="list-make" num={6}>
        買う物リストを作っておく
      </H2>
      <p>
        店に入れる時間が限られることもあるので、欲しい物と合計金額を前もって決めておくと迷いません。上の20点を、そのまま自分の買う物リストにできるテンプレートを用意しました。
      </p>
      <p>
        <Link href="/mochico/templates/disney-christmas-2026" className={s.back}>
          <ShoppingBag className="inline w-4 h-4 mr-1" aria-hidden />
          この20点で買う物リストを作る（Mochico・無料）
        </Link>
      </p>
      <MochicoNudge title="買う物と買えた物を、1つのリストで">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを一覧にして、買えたものをタップで記録できるアプリです。テンプレートから作れば、名前と価格を入力する手間がありません。リストはリンクで一緒に行く人と共有できます（買えたかどうかは本人にだけ表示）。
        </p>
      </MochicoNudge>

      <H2 id="links" num={7}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: `${TDR}/treasure/christmas2026/tdl/`, title: "東京ディズニーランド「ディズニー・クリスマス」", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${TDR}/treasure/christmas2026/tds/`, title: "東京ディズニーシー「ディズニー・クリスマス」", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
          { href: `${TDR}/tdr/news/update/shop/`, title: "サイト更新情報（スタンバイパスの対象ショップ）", icon: <ExternalLink className="w-5 h-5" aria-hidden /> },
        ]}
      />

      <Sources
        items={[
          { href: `${TDR}/treasure/christmas2026/tdl/`, label: "東京ディズニーランド スペシャルイベント「ディズニー・クリスマス」（期間・販売開始日・注意事項）" },
          { href: `${TDR}/treasure/christmas2026/tds/`, label: "東京ディズニーシー スペシャルイベント「ディズニー・クリスマス」（販売開始日・オフィシャルホテル）" },
          { href: `${TDR}/treasure/christmas2026/tdl/goods02.html`, label: "スペシャルグッズ「クリスマスの妖精“リルリンリン”のグッズ」" },
          { href: `${TDR}/goods/116002212/`, label: "おすすめグッズ「ぬいぐるみバッジ」ほか各商品ページ（価格・販売時の注意）" },
          { href: `${TDR}/tdr/news/update/shop/`, label: "サイト更新情報（グッズ/ショップ）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
