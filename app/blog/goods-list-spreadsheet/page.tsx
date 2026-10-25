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

const post = getBlogPost("goods-list-spreadsheet")!;

export const metadata = mochicoArticleMeta(post, [
  "グッズリスト スプレッドシート",
  "推しグッズ 管理 スプレッドシート",
  "グッズリスト 作り方",
  "推し活 スプレッドシート テンプレート",
  "グッズ 管理表",
  "推しグッズ 管理",
]);

const TOC: TocItem[] = [
  { id: "fit", label: "スプレッドシートで管理するのが向いている人" },
  { id: "columns", label: "列（項目）の例" },
  { id: "steps", label: "Googleスプレッドシートでの作り方" },
  { id: "formulas", label: "あると便利な集計の例" },
  { id: "weak", label: "スプレッドシートが苦手なこと" },
  { id: "combine", label: "アプリと組み合わせる使い分け" },
  { id: "summary", label: "まとめ" },
];

const COLUMNS: { col: string; name: string; example: string; note: string }[] = [
  { col: "A", name: "イベント・作品", example: "冬ツアー2026", note: "フィルタで絞り込む軸になる" },
  { col: "B", name: "商品名", example: "アクスタ 〇〇（衣装B）", note: "シリーズ名＋違いで書く" },
  { col: "C", name: "カテゴリ", example: "アクスタ / 缶バッジ / タオル", note: "プルダウンにすると表記がそろう" },
  { col: "D", name: "価格", example: "2000", note: "数字だけで入れると集計できる" },
  { col: "E", name: "個数", example: "1", note: "重複分や友達の分" },
  { col: "F", name: "入手方法", example: "物販 / 通販 / くじ / 交換", note: "プルダウン" },
  { col: "G", name: "持っている", example: "チェック", note: "チェックボックス" },
  { col: "H", name: "メモ", example: "交換用1つ", note: "保管場所など自由に" },
];

export default function Page() {
  return (
    <MochicoArticleLayout
      post={post}
      heroLead="項目を自由に作れて、金額の合計も出せるスプレッドシート。推しグッズのリストを作るときの列の例と、作り方の手順をまとめました。"
    >
      <p>
        推しグッズの記録を、表でしっかり管理したい人にはスプレッドシートが向いています。列を自由に増やせて、支出の合計やコンプ率も計算できるからです。一方で、写真の扱いや、外出先での素早い確認は少し苦手です。
      </p>
      <p>この記事では、Googleスプレッドシートを例に、推しグッズのリストの作り方と、得意・不得意を紹介します。</p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>列は「イベント・商品名・カテゴリ・価格・個数・入手方法・持っている・メモ」くらいから始める</li>
          <li>カテゴリや入手方法はプルダウン、「持っている」はチェックボックスにすると入力が楽になる</li>
          <li>支出の集計はスプレッドシート、外出先での確認は写真つきのアプリ、と使い分けるのもおすすめ</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="fit">スプレッドシートで管理するのが向いている人</h2>
      <ul>
        <li>グッズの数が多く、並べ替えや絞り込みをしたい</li>
        <li>月ごとやイベントごとの支出を計算したい</li>
        <li>個数・保管場所・交換用など、自分なりの項目を細かく持ちたい</li>
        <li>パソコンで作業するのが苦にならない</li>
      </ul>
      <p>逆に、「物販の列で写真を見ながらさっと確認したい」が一番の目的なら、写真つきのグッズ管理アプリのほうが手軽です（方法ごとの比較は「<Link href="/blog/oshi-goods-management">推しグッズの管理方法</Link>」で紹介しています）。</p>

      <h2 id="columns">列（項目）の例</h2>
      <p>最初から項目を増やしすぎると入力が続きません。まずは次の8列くらいから始めて、必要になったら足していくのがおすすめです。</p>
      <div className={s.tableWrap} role="region" aria-label="列の例（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>推しグッズのリストの列の例</caption>
          <thead>
            <tr>
              <th scope="col">列</th>
              <th scope="col">項目</th>
              <th scope="col">入力例</th>
              <th scope="col">ポイント</th>
            </tr>
          </thead>
          <tbody>
            {COLUMNS.map((c) => (
              <tr key={c.col}>
                <th scope="row">{c.col}</th>
                <td>{c.name}</td>
                <td>{c.example}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>スマホでは表を横にスクロールできます。〇〇にはメンバー名やキャラクター名を入れます。</p>

      <h2 id="steps">Googleスプレッドシートでの作り方</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>1行目に見出しを入れて固定する</span>
          A1から順に項目名を入れ、「表示」メニューの「固定」で1行目を固定します。下にスクロールしても見出しが見えたままになります。
        </li>
        <li>
          <span className={s.stepTitle}>カテゴリと入手方法をプルダウンにする</span>
          列を選んで「挿入」メニューの「プルダウン」から選択肢を登録します。表記ゆれ（「缶バ」「缶バッジ」など）がなくなり、絞り込みや集計が正確になります。
        </li>
        <li>
          <span className={s.stepTitle}>「持っている」をチェックボックスにする</span>
          G列を選んで「挿入」メニューの「チェックボックス」を選ぶと、クリックやタップで切り替えられるようになります。
        </li>
        <li>
          <span className={s.stepTitle}>持っていない行を色分けする</span>
          「表示形式」メニューの「条件付き書式」で、チェックが入っていない行の色を変えると、足りないものが一目で分かります。
        </li>
        <li>
          <span className={s.stepTitle}>フィルタで絞り込めるようにする</span>
          見出し行を選んで「データ」メニューの「フィルタを作成」を選ぶと、イベントやカテゴリごとに表示を絞り込めます。
        </li>
      </ol>
      <p className={s.tableNote}>メニューの名前は、Googleスプレッドシートの画面の更新で変わることがあります。</p>

      <ArticleAd />

      <h2 id="formulas">あると便利な集計の例</h2>
      <p>上の列の例（D列が価格、E列が個数、G列がチェックボックス）を前提にした式の例です。</p>
      <ul>
        <li>
          <strong>持っているグッズの数</strong>：<code>=COUNTIF(G2:G, TRUE)</code>
        </li>
        <li>
          <strong>登録したグッズの数</strong>：<code>=COUNTA(B2:B)</code>
        </li>
        <li>
          <strong>コンプ率</strong>：持っている数 ÷ 登録した数（セルの表示形式を「パーセント」にする）
        </li>
        <li>
          <strong>持っているグッズの合計金額</strong>：<code>=SUMPRODUCT((G2:G=TRUE)*D2:D*E2:E)</code>
        </li>
      </ul>
      <p>イベントごとの合計を出したい場合は、ピボットテーブルを使うと、イベント別・カテゴリ別の集計表が手早く作れます。</p>

      <h2 id="weak">スプレッドシートが苦手なこと</h2>
      <ul>
        <li>
          <strong>写真の扱い。</strong>セルに画像を入れることはできますが、スマホで1件ずつ撮って入れるのは手間がかかり、似たグッズを写真で見比べる用途には向きません。
        </li>
        <li>
          <strong>外出先での素早い確認。</strong>スマホの小さな画面で横に長い表を見るのは大変です。物販の列で探しているうちに順番が来てしまうこともあります。
        </li>
        <li>
          <strong>共有したときの所持状況。</strong>友達と同じ表を使うと、全員の「持っている」が全員に見えます（共有の注意点は「<Link href="/blog/share-goods-list-with-friends">友達とグッズ一覧を共有する方法と注意点</Link>」）。
        </li>
      </ul>

      <h2 id="combine">アプリと組み合わせる使い分け</h2>
      <p>
        すべてを一つの道具でやろうとせず、役割を分けると続けやすくなります。たとえば、<strong>支出や個数の管理はスプレッドシート</strong>、<strong>物販の列での確認や「持っている」の記録は写真つきのアプリ</strong>、という分け方です。
      </p>
      <p className={s.disclosure}>ここからは、ToolBoxJPが提供しているグッズ管理アプリ「Mochico（モチコ）」の紹介です。</p>
      <p>
        Mochicoは、イベントごとのグッズ一覧を写真つきで作り、タップで「取得済み」を記録するアプリです。スマホのブラウザで開けて、絞り込みで「持っていないもの」だけを見られるので、外出先での確認役に向いています。個数（ランダム商品は絵柄ごと）は記録できますが、金額の集計には対応していないため、スプレッドシートと組み合わせると、それぞれの得意なところを活かせます。
      </p>
      <MochicoCta title="外出先での確認は、写真つきの一覧で" sub="使い方と実際の画面は、Mochicoの紹介ページで確認できます。" />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>スプレッドシートは、項目の自由さと集計が強み</li>
          <li>列は8つくらいから始め、プルダウン・チェックボックス・条件付き書式で入力を楽にする</li>
          <li>写真や外出先での確認は苦手なので、必要ならアプリと使い分ける</li>
        </ul>
      </div>
      <p>まずは次のイベント一つ分から、表を作ってみてください。</p>
    </MochicoArticleLayout>
  );
}
