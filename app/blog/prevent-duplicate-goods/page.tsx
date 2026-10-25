import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  MochicoArticleLayout,
  MochicoCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/mochico/MochicoArticle";

const post = getBlogPost("prevent-duplicate-goods")!;

export const metadata = mochicoArticleMeta(post, [
  "グッズ 重複買い 防止",
  "推しグッズ 二重購入",
  "グッズ 被り 防ぐ",
  "通販 二重注文 防ぐ",
  "推しグッズ 管理",
  "グッズ 持ってるか 確認",
]);

const TOC: TocItem[] = [
  { id: "why", label: "なぜ重複買いは起きるのか" },
  { id: "rules", label: "重複買いを防ぐ3つのルール" },
  { id: "routes", label: "入手経路ごとの注意点" },
  { id: "what", label: "重複に気づくために記録すること" },
  { id: "already", label: "重複してしまったときは" },
  { id: "mochico", label: "買う前にスマホで確認するなら" },
  { id: "summary", label: "まとめ" },
];

const ROUTES: { route: string; risk: string; tip: string }[] = [
  {
    route: "会場の物販",
    risk: "列でゆっくり確認できない。友達の分と混ざる",
    tip: "並ぶ前に「持っていないもの」だけを見ておく。会計後すぐ記録",
  },
  {
    route: "公式通販・事後通販",
    risk: "届くまでに時間があり、注文したことを忘れる",
    tip: "注文を確定した時点で「持っている」にする",
  },
  {
    route: "くじ・ランダム",
    risk: "どの絵柄を引いたか覚えていない",
    tip: "種類ごとに記録し、引いたらその場で更新",
  },
  {
    route: "コラボカフェ・特典",
    risk: "飲食や購入の特典として配られ、記録から漏れる",
    tip: "受け取ったら写真を撮っておき、帰宅後にまとめて記録",
  },
  {
    route: "交換・譲渡",
    risk: "やり取りの途中で記録の更新を忘れる",
    tip: "交換が成立したら、その場で受け取った分を記録",
  },
];

export default function Page() {
  return (
    <MochicoArticleLayout
      post={post}
      heroLead="「これ、もう持っていたかも」と気づくのは、たいてい買ったあと。重複買いは、記録するタイミングと、買う直前に見返せる一覧でほとんど防げます。"
    >
      <p>
        同じアクスタが二つ、同じ缶バッジが三つ。推し活をしていると、うっかり同じグッズを買ってしまうことがあります。交換に出せる場合もありますが、予算や置き場所を考えると、できれば避けたいところです。
      </p>
      <p>この記事では、重複買いが起きる理由と、それを防ぐための記録のルールを、入手経路ごとに紹介します。</p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>買う前に、スマホですぐ開ける「持っているもの一覧」を確認する</li>
          <li>記録は「買ったその場」、通販なら「注文した時点」で行う</li>
          <li>似たグッズは写真と「シリーズ名＋違い」の名前で見分けられるようにする</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="why">なぜ重複買いは起きるのか</h2>
      <ul>
        <li>
          <strong>確認する場所に、確認する手段がない。</strong>迷うのは物販の列やショップ、通販の購入画面です。家の収納を見に行くことはできません。
        </li>
        <li>
          <strong>記録が実物より遅れる。</strong>「あとでまとめて記録しよう」と思っているあいだに、次の買い物が来てしまいます。特に通販は、届くまで手元に実物がありません。
        </li>
        <li>
          <strong>似たグッズが多い。</strong>衣装違い・年違い・再販など、名前だけでは区別しにくいものが多くあります。
        </li>
      </ul>

      <h2 id="rules">重複買いを防ぐ3つのルール</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>買う直前に一覧を見る</span>
          物販の列に並んだら、通販の購入ボタンを押す前に、一覧を開く習慣をつけます。スマホからすぐ開ける形で記録しておくのが前提です。
        </li>
        <li>
          <span className={s.stepTitle}>手に入れた瞬間に記録する</span>
          会場なら会計が終わったとき、通販なら注文を確定したとき、くじなら引いたとき。実物が届くのを待たないのがコツです。
        </li>
        <li>
          <span className={s.stepTitle}>見分けられる形で残す</span>
          写真と「シリーズ名＋絵柄の違い」の名前をセットにします。「アクスタ」だけでは、次に見たときに判断できません。
        </li>
      </ol>

      <h2 id="routes">入手経路ごとの注意点</h2>
      <div className={s.tableWrap} role="region" aria-label="入手経路ごとの注意点（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>入手経路ごとの重複リスクと対策</caption>
          <thead>
            <tr>
              <th scope="col">入手経路</th>
              <th scope="col">重複が起きやすい理由</th>
              <th scope="col">対策</th>
            </tr>
          </thead>
          <tbody>
            {ROUTES.map((r) => (
              <tr key={r.route}>
                <th scope="row">{r.route}</th>
                <td>{r.risk}</td>
                <td>{r.tip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>スマホでは表を横にスクロールできます。</p>
      <div className={s.caution}>
        <p className={s.cardLabel}>通販の二重注文</p>
        <p>
          通販は、注文してから届くまでに日数がかかります。そのあいだに会場の物販や別の通販があると、「まだ持っていない」と思って二重に注文しがちです。注文を確定したら、届く前でも一覧上は「持っている」にしておきましょう。
        </p>
      </div>

      <ArticleAd />

      <h2 id="what">重複に気づくために記録すること</h2>
      <p>重複を防ぐだけなら、項目は少なくて構いません。</p>
      <ul className={s.checklist}>
        <li>
          <b>写真</b>：似たグッズを見分けるいちばん確かな手がかり。公式画像でも実物でも構いません。
        </li>
        <li>
          <b>名前</b>：「シリーズ名＋絵柄やメンバーの違い」で付けます。
        </li>
        <li>
          <b>持っているかどうか</b>：持っていないものも一覧に入れておくと、「持っていないもの」だけを見返せます。
        </li>
        <li>
          <b>どのイベント・作品のものか</b>：イベントや作品ごとに分けておくと、確認する範囲がすぐ絞れます。
        </li>
      </ul>
      <p>
        ランダムグッズは、商品ごとではなく絵柄ごとに記録するのがポイントです。詳しくは「
        <Link href="/blog/random-goods-management">ランダムグッズ（缶バッジ・トレカ）の管理方法</Link>」で紹介しています。記録の方法全体を比べたい場合は「
        <Link href="/blog/oshi-goods-management">推しグッズの管理方法</Link>」も参考にしてください。
      </p>

      <h2 id="already">重複してしまったときは</h2>
      <ul>
        <li>同じグッズを集めている友達や、推し仲間との交換に回す</li>
        <li>保存用・飾る用として使い分ける</li>
        <li>不要なら、フリマアプリなどで譲る（各サービスや公式の規約・転売に関するルールを確認してください）</li>
      </ul>
      <p>どの場合も、重複分を一覧にメモしておくと、交換の相談をするときに役立ちます。</p>

      <h2 id="mochico">買う前にスマホで確認するなら</h2>
      <p className={s.disclosure}>ここからは、ToolBoxJPが提供しているグッズ管理アプリ「Mochico（モチコ）」の紹介です。</p>
      <p>Mochicoは、イベントごとのグッズ一覧を写真つきで作り、タップで「取得済み」を記録するアプリです。重複買いを防ぐ使い方は次のとおりです。</p>
      <ul>
        <li>ブラウザで使え、ホーム画面に追加すればアイコンからすぐ開けるので、物販の列や通販の購入前に確認できます。</li>
        <li>グッズをタップするだけで「取得済み」に切り替わるので、会計直後や注文直後にその場で記録できます。</li>
        <li>「取得済み」「未取得」で絞り込めるので、持っているものと持っていないものをすぐ見分けられます。</li>
      </ul>
      <p>同じグッズを複数買うときは個数も記録でき、缶バッジなどのランダム商品は絵柄ごとに所持数を残せるので、「この絵柄はもう2個ある」まで確認できます。</p>
      <MochicoCta title="「持ってたっけ？」を、買う前にスマホで確認" sub="使い方と実際の画面は、Mochicoの紹介ページで確認できます。" />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>重複買いは、確認する手段がない場所で、記録が遅れることで起きる</li>
          <li>買う直前に一覧を見て、手に入れた瞬間（通販は注文時）に記録する</li>
          <li>写真と見分けやすい名前で残し、ランダムは絵柄ごとに記録する</li>
        </ul>
      </div>
      <p>次の買い物から、「買う前に一覧を開く」を習慣にしてみてください。</p>
    </MochicoArticleLayout>
  );
}
