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

const post = getBlogPost("share-goods-list-with-friends")!;

export const metadata = mochicoArticleMeta(post, [
  "グッズ 一覧 共有",
  "友達 グッズ 共有",
  "推し活 リスト 共有",
  "ライブ グッズ 友達 共有",
  "グッズリスト 共有 方法",
  "推しグッズ 管理 共有",
]);

const TOC: TocItem[] = [
  { id: "scenes", label: "グッズ一覧を共有したくなる場面" },
  { id: "two", label: "「一覧」と「誰が何を持っているか」は分けて考える" },
  { id: "methods", label: "共有の方法と、それぞれの向き不向き" },
  { id: "rules", label: "共有する前に決めておきたいこと" },
  { id: "privacy", label: "共有リンクを使うときの注意点" },
  { id: "mochico", label: "一覧だけを共有できるMochicoの方法" },
  { id: "summary", label: "まとめ" },
];

const ROWS: { name: string; start: string; photo: string; own: string; edit: string; stop: string }[] = [
  {
    name: "LINEのメモ・ノート",
    start: "グループですぐ始められる",
    photo: "画像は別に送る必要がある",
    own: "書き込むと全員に見える",
    edit: "誰でも書き換えられる",
    stop: "グループを抜ける・削除する",
  },
  {
    name: "共有スプレッドシート",
    start: "表を作る手間がある",
    photo: "画像の扱いは手間",
    own: "人ごとの列を作ると全員に見える",
    edit: "権限の設定しだい",
    stop: "共有設定を変更する",
  },
  {
    name: "共有リンクのあるグッズ管理アプリ",
    start: "作った人が一覧を作れば、受け取る側は開くだけ",
    photo: "写真つきで見られるものが多い",
    own: "アプリによって違う",
    edit: "アプリによって違う",
    stop: "アプリによって違う",
  },
];

export default function Page() {
  return (
    <MochicoArticleLayout
      post={post}
      heroLead="同じライブに行く友達と、グッズのラインナップは共有したい。でも、自分が何をいくつ買ったかまでは見せなくていい。そんなときの共有の仕方をまとめました。"
    >
      <p>
        同じツアーに参加する友達や、いつも一緒に物販に並ぶ仲間とは、「今回のグッズ、何が出てたっけ？」という会話が何度も起こります。誰か一人がグッズの一覧を作って共有できれば、全員が公式サイトを見返す手間が減ります。
      </p>
      <p>一方で、共有の仕方によっては、自分の買った量が筒抜けになったり、誰かが一覧をうっかり書き換えてしまったりします。この記事では、グッズ一覧を共有する方法を比べながら、気をつけたい点を整理します。</p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>共有するのは「グッズの一覧」だけにして、「持っているかどうか」は各自で管理する</li>
          <li>一覧を作る人・直す人を一人に決めておくと、内容が崩れにくい</li>
          <li>共有リンクは送る相手を決めて使い、使い終わったら止められるものを選ぶ</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="scenes">グッズ一覧を共有したくなる場面</h2>
      <ul>
        <li>同じツアーの複数公演に、友達と分かれて参加する</li>
        <li>物販に並ぶ人と並ばない人がいて、代わりに買ってくることになった</li>
        <li>推し仲間とランダムグッズを交換したい</li>
        <li>グループで同じイベントに行くので、ラインナップを一人がまとめておきたい</li>
      </ul>
      <p>どの場面でも、ラインナップ（商品名・価格・写真）は全員に共通です。一人が作れば全員が使えるので、共有する価値の大きい情報です。</p>

      <h2 id="two">「一覧」と「誰が何を持っているか」は分けて考える</h2>
      <p>グッズの共有で混ざりやすいのが、次の二つです。</p>
      <div className={s.compare}>
        <div className={s.compareItem}>
          <h3>グッズの一覧</h3>
          <p>どんなグッズが出ているか。名前、価格、写真、購入制限など。誰が見ても同じ内容で、共有すると全員の手間が減ります。</p>
        </div>
        <div className={s.compareItem}>
          <h3>誰が何を持っているか</h3>
          <p>一人ひとりの「持っている・持っていない」。予算も考え方も人それぞれで、知られたくない人もいます。</p>
        </div>
      </div>
      <p>
        一つの表に「Aさん」「Bさん」のような列を足すと手軽ですが、全員の所持状況が全員に見える状態になります。仲の良い友達同士でも、「あの人はこんなに買っているのに」と気をつかう原因になりがちです。<strong>一覧は共有、所持は各自</strong>という分け方にしておくと、気をつかわずに長く使えます。
      </p>

      <h2 id="methods">共有の方法と、それぞれの向き不向き</h2>
      <div className={s.tableWrap} role="region" aria-label="共有方法の比較表（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>グッズ一覧の共有方法の比較</caption>
          <thead>
            <tr>
              <th scope="col">方法</th>
              <th scope="col">始めやすさ</th>
              <th scope="col">写真</th>
              <th scope="col">所持状況の見え方</th>
              <th scope="col">書き換え</th>
              <th scope="col">共有の止め方</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.start}</td>
                <td>{r.photo}</td>
                <td>{r.own}</td>
                <td>{r.edit}</td>
                <td>{r.stop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>スマホでは表を横にスクロールできます。サービスの仕様は変わることがあるため、一般的な傾向として書いています。</p>

      <div className={s.methods}>
        <div className={s.method}>
          <h3>LINEのメモ・ノート</h3>
          <p>
            普段のやり取りの延長で始められるのが強みです。少人数・短期間なら十分ですが、画像と文字が別々になりやすく、誰かが書き換えると元に戻すのが大変です。所持状況まで書き込むと全員に見えます。
          </p>
        </div>
        <div className={s.method}>
          <h3>共有スプレッドシート</h3>
          <p>
            列を自由に作れて、閲覧のみ・編集可などの権限も設定できます。一覧を作る人を決めて、他の人は閲覧のみにすると崩れにくくなります。ただ、各自の所持状況を同じ表に入れると全員に見えるので、所持は各自のコピーや別のシートで管理するのが無難です（表の作り方は「
            <Link href="/blog/goods-list-spreadsheet">推しグッズのリストをスプレッドシートで作る方法</Link>」で紹介しています）。
          </p>
        </div>
        <div className={s.method}>
          <h3>共有リンクのあるグッズ管理アプリ</h3>
          <p>
            作った人がリンクを送るだけで、写真つきの一覧を全員が見られます。所持状況を共有するか、各自のものにするかはアプリによって違うので、共有する前に確認しておきましょう。
          </p>
        </div>
      </div>

      <ArticleAd />

      <h2 id="rules">共有する前に決めておきたいこと</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>一覧を作る人・直す人を決める</span>
          全員が編集できると、似た商品の重複登録や、うっかり消してしまう事故が起こりやすくなります。公式の追加発表を反映する人も決めておくと安心です。
        </li>
        <li>
          <span className={s.stepTitle}>どこまで共有するかを決める</span>
          ラインナップだけか、代理購入のメモまで含めるか。所持状況は各自に任せるのが基本です。
        </li>
        <li>
          <span className={s.stepTitle}>いつまで使うかを決める</span>
          ツアー中だけ、事後通販が終わるまで、など。期間を決めておくと、共有をやめるタイミングに迷いません。
        </li>
      </ol>

      <h2 id="privacy">共有リンクを使うときの注意点</h2>
      <ul>
        <li>
          <strong>リンクを知っている人なら見られる形式が多い。</strong>SNSに貼ったり、大人数のグループに転送されたりすると、意図しない人まで見られる状態になります。送る相手を決めて使いましょう。
        </li>
        <li>
          <strong>止められるかを確認する。</strong>あとから共有を止めたり、期限を付けたりできると、使い終わったあとも安心です。
        </li>
        <li>
          <strong>一覧に個人情報を書かない。</strong>受け渡しの場所や連絡先などは、一覧ではなく個別のメッセージでやり取りします。
        </li>
      </ul>

      <h2 id="mochico">一覧だけを共有できるMochicoの方法</h2>
      <p className={s.disclosure}>ここからは、ToolBoxJPが提供しているグッズ管理アプリ「Mochico（モチコ）」の紹介です。</p>
      <p>Mochicoは「一覧は共有、所持は各自」という考え方で作られています。</p>
      <ul>
        <li>リストを作った人が「共有」からリンクを作成し、友達に送ります。リンクの有効期限は「期限なし」「7日間」「30日間」から選べます。</li>
        <li>受け取った人は、ログインしなくても一覧を見られます。ログインすると自分の管理に追加して、自分の取得状況を記録できます。</li>
        <li>取得状況は本人にしか表示されません。リストを作った人にも見えません。</li>
        <li>グッズの追加・編集ができるのはリストを作った人だけで、変更は共有した全員の一覧に反映されます。</li>
        <li>共有はいつでも止められます。止めたあとは、そのリンクから新しく見たり追加したりできなくなり、すでに追加した人のリストはそのまま使えます。</li>
      </ul>
      <figure className={s.shot}>
        {/* eslint-disable-next-line @next/next/no-img-element -- LP と同じ静的な小さい WebP（遅延読込） */}
        <img
          src="/mochico/shots/share.webp"
          alt="Mochicoの共有画面。共有URLのコピーと送信、共有の停止ができ、自分の取得状況は共有されないと表示されている"
          width={390}
          height={780}
          loading="lazy"
          decoding="async"
        />
        <figcaption>共有の画面。一覧だけが共有され、自分の取得状況は共有されません（テスト用のデータで撮影）。</figcaption>
      </figure>
      <p>
        使い方の詳しい手順は「<Link href="/blog/mochico-how-to-use">Mochico（モチコ）の使い方</Link>」で紹介しています。
      </p>
      <MochicoCta title="グッズの一覧を、友達とリンクで共有" sub="自分の取得状況は共有されません。実際の画面は紹介ページで確認できます。" />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>ラインナップは共有、「持っているかどうか」は各自で管理すると気をつかわない</li>
          <li>一覧を作る人・直す人を決めておくと崩れにくい</li>
          <li>共有リンクは送る相手を決め、止められる・期限を付けられるものを選ぶ</li>
        </ul>
      </div>
      <p>次のツアーでは、一覧づくりを一人が担当して、みんなで同じ一覧を使ってみてください。</p>
    </MochicoArticleLayout>
  );
}
