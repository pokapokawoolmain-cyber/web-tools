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

const post = getBlogPost("random-goods-management")!;

export const metadata = mochicoArticleMeta(post, [
  "ランダムグッズ 管理",
  "缶バッジ 管理",
  "トレカ 管理",
  "ランダム グッズ コンプ 管理",
  "缶バッジ 何持ってるか",
  "推しグッズ 管理",
]);

const TOC: TocItem[] = [
  { id: "hard", label: "ランダムグッズの管理が難しい理由" },
  { id: "per-kind", label: "基本は「種類ごとに1件」で記録する" },
  { id: "name", label: "見分けやすい名前の付け方" },
  { id: "flow", label: "開封から記録までの流れ" },
  { id: "trade", label: "交換・事後通販で一覧を使うコツ" },
  { id: "mochico", label: "スマホで絵柄ごと・個数まで管理するなら" },
  { id: "summary", label: "まとめ" },
];

export default function Page() {
  return (
    <MochicoArticleLayout
      post={post}
      heroLead="缶バッジやトレカ、ランダムのアクスタ。どの絵柄を持っていて、あと何が足りないのか。一目で分かる一覧の作り方を紹介します。"
    >
      <p>
        ランダムグッズは、開けるまで何が出るか分からないのが楽しいところです。でも数が増えてくると、「この絵柄、もう持っていたっけ？」「推しはあと何種類残っている？」が分からなくなりがちです。交換の約束をしたあとで、実は持っていた……ということもあります。
      </p>
      <p>この記事では、缶バッジ・トレーディングカード・ランダムのアクリルスタンドなどを、絵柄単位で把握するための記録の仕方を紹介します。</p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>ランダムグッズは「商品ごと」ではなく「種類（絵柄）ごとに1件」で記録する</li>
          <li>名前は「シリーズ名＋絵柄の違い」で、見ただけで区別できるように付ける</li>
          <li>全種類を先に登録し、出たものから「持っている」にすると残りが一目で分かる</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="hard">ランダムグッズの管理が難しい理由</h2>
      <ul>
        <li>
          <strong>種類が多い。</strong>1シリーズで数種類から数十種類あることも珍しくありません。
        </li>
        <li>
          <strong>見た目が似ている。</strong>同じデザインで衣装や表情だけが違う、ということもよくあります。
        </li>
        <li>
          <strong>同じものが何個も出る。</strong>重複分は交換に回すので、「持っている種類」と「余っているもの」を区別したくなります。
        </li>
        <li>
          <strong>入手経路が多い。</strong>会場、通販、くじ、交換と、少しずつ集まっていきます。
        </li>
      </ul>
      <p>こうした事情から、「缶バッジ（全10種）を3個買った」という記録だけでは、どの絵柄を持っているかが分かりません。</p>

      <h2 id="per-kind">基本は「種類ごとに1件」で記録する</h2>
      <p>おすすめは、ランダム商品を<strong>絵柄の種類ごとに1件ずつ</strong>登録する方法です。</p>
      <div className={s.compare}>
        <div className={s.compareItem}>
          <h3>商品ごとに1件</h3>
          <p>「ランダム缶バッジ（全10種）×3」のような記録。入力は楽ですが、どの絵柄が手元にあるのか、何が足りないのかは分かりません。</p>
        </div>
        <div className={s.compareItem}>
          <h3>種類ごとに1件</h3>
          <p>「ランダム缶バッジ A」「同 B」……と10件作る記録。最初の登録は少し手間ですが、持っている絵柄と残りの絵柄がそのまま一覧で分かります。</p>
        </div>
      </div>
      <p>
        全種類を最初に登録しておき、出たものから「持っている」に変えていくと、「コンプまであと何種類か」がいつでも分かります。公式の商品画像（全種類が並んだ画像）があれば、それを見ながら登録すると早く終わります。
      </p>
      <div className={s.point}>
        <p className={s.cardLabel}>POINT</p>
        <p>
          全部の種類を集めるつもりがなくても、推しの絵柄だけは1件ずつ登録しておくと便利です。それ以外の絵柄は「その他」として一つにまとめる、という使い分けもできます。
        </p>
      </div>

      <h2 id="name">見分けやすい名前の付け方</h2>
      <p>名前は「シリーズ名＋絵柄の違い」の順で付けると、並べたときに見分けやすくなります。</p>
      <div className={s.tableWrap} role="region" aria-label="名前の付け方の例（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>名前の付け方の例</caption>
          <thead>
            <tr>
              <th scope="col">分かりにくい例</th>
              <th scope="col">見分けやすい例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">缶バッジ 3</th>
              <td>冬ツアー 缶バッジ 〇〇（衣装B）</td>
            </tr>
            <tr>
              <th scope="row">トレカ キラ</th>
              <td>2nd トレカ 〇〇 シークレット</td>
            </tr>
            <tr>
              <th scope="row">アクスタ 青</th>
              <td>コラボカフェ アクスタ 〇〇（制服）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>〇〇にはメンバー名やキャラクター名を入れます。</p>
      <p>
        番号だけの名前は、時間がたつと何番がどの絵柄か分からなくなります。写真を一緒に残せる道具なら、名前と写真の両方で見分けられるので確実です。
      </p>

      <ArticleAd />

      <h2 id="flow">開封から記録までの流れ</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>発売前に、全種類を一覧に入れておく</span>
          公式のラインナップが出たら、種類ごとに登録します。この時点では全部「持っていない」です。
        </li>
        <li>
          <span className={s.stepTitle}>開封したら、その場で「持っている」にする</span>
          会場で開けたなら、列を離れる前に記録しておくと、次に買うか交換を探すかをすぐ判断できます。
        </li>
        <li>
          <span className={s.stepTitle}>重複したものはメモしておく</span>
          同じ絵柄が2つ以上出たら、交換用としてメモしておきます（個数を数えられる道具なら個数で）。
        </li>
        <li>
          <span className={s.stepTitle}>「持っていない」だけを見返す</span>
          足りない絵柄だけを絞り込んで表示できると、交換相手を探すときにそのまま使えます。
        </li>
      </ol>
      <div className={s.caution}>
        <p className={s.cardLabel}>買いすぎに注意</p>
        <p>
          「次こそ推しが出るかも」と追加で買い続けてしまうのがランダムグッズの難しいところです。何個まで買うかは事前に決めておき、出なかった分は交換で探すと決めておくと、予算を守りやすくなります。物販前の予算の決め方は「
          <Link href="/blog/live-goods-shopping-list">ライブ物販の買い物リストの作り方</Link>」で紹介しています。
        </p>
      </div>

      <h2 id="trade">交換・事後通販で一覧を使うコツ</h2>
      <ul>
        <li>
          <strong>交換の前に一覧を確認する。</strong>「持っていない」絵柄だけを見せれば、相手にも伝わりやすくなります。
        </li>
        <li>
          <strong>交換が成立したら、すぐ記録を更新する。</strong>受け取った絵柄を「持っている」にし、渡した重複分のメモを消しておきます。
        </li>
        <li>
          <strong>事後通販では、注文した時点で記録する。</strong>届くまで時間がかかるので、注文時に記録しておくと二重注文を防げます（詳しくは「<Link href="/blog/prevent-duplicate-goods">推しグッズの重複買いを防ぐ方法</Link>」）。
        </li>
      </ul>

      <h2 id="mochico">スマホで絵柄ごと・個数まで管理するなら</h2>
      <p className={s.disclosure}>ここからは、ToolBoxJPが提供しているグッズ管理アプリ「Mochico（モチコ）」の紹介です。</p>
      <p>
        Mochicoには「ランダム商品」という種類があり、缶バッジやトレカを<strong>1つのグッズの中に絵柄ごと</strong>まとめて管理できます。グッズを登録するときに「ランダム商品」を選び、絵柄を追加していきます（最大100種。「全○種」と入れてまとめて追加することもできます）。
      </p>
      <ul>
        <li>絵柄ごとに写真と名前を登録でき、絵柄ごとに所持数を＋／－で記録できます。</li>
        <li>一覧のカードには「2/8種」のように集めた種類の数と合計の個数が表示され、カードの枠線が集めた割合だけピンクになります。全種類そろうと枠線が一周します。</li>
        <li>同じ絵柄を2個以上持っていれば、その数がそのまま表示されるので、交換に出せる重複分がひと目で分かります。</li>
        <li>グッズを開くと絵柄が並び、まだ持っていない絵柄（0個）がすぐ分かります。交換で探している絵柄の確認に使えます。</li>
        <li>友達とリストを共有しても、絵柄ごとの所持数は一人ひとり別々で、相手には表示されません。</li>
      </ul>
      <p>
        なお、「交換用」「取り置き」といった状態の区別はありません。交換に出すものは、所持数（2個以上の分）や概要欄のメモで管理してください。
      </p>
      <MochicoCta title="ランダムグッズも、絵柄ごと・個数まで写真で一覧に" sub="使い方と実際の画面は、Mochicoの紹介ページで確認できます。" />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>ランダムグッズは種類（絵柄）ごとに1件で記録する</li>
          <li>名前は「シリーズ名＋絵柄の違い」、できれば写真も残す</li>
          <li>全種類を先に登録し、開封したらその場で「持っている」にする</li>
          <li>「持っていない」だけを見返せば、交換や事後通販のリストになる</li>
        </ul>
      </div>
      <p>まずは推しの絵柄だけでも、種類ごとの一覧を作ってみてください。</p>
    </MochicoArticleLayout>
  );
}
