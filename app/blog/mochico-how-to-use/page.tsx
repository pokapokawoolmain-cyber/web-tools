import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  MochicoArticleLayout,
  MochicoCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/mochico/MochicoArticle";

const post = getBlogPost("mochico-how-to-use")!;

export const metadata = mochicoArticleMeta(post, [
  "Mochico",
  "モチコ",
  "モチコ グッズ管理",
  "モチコ 使い方",
  "Mochico 使い方",
  "推しグッズ 管理 アプリ",
]);

const TOC: TocItem[] = [
  { id: "what", label: "Mochico（モチコ）とは" },
  { id: "login", label: "はじめ方（ログイン）" },
  { id: "event", label: "イベントとグッズを登録する" },
  { id: "owned", label: "「取得済み」を記録する" },
  { id: "share", label: "リストを友達と共有する" },
  { id: "receive", label: "共有されたリストを使う" },
  { id: "home", label: "ホーム画面に追加する" },
  { id: "settings", label: "設定と退会" },
  { id: "faq", label: "よくある質問" },
];

export default function Page() {
  return (
    <MochicoArticleLayout
      post={post}
      heroLead="ToolBoxJPの推しグッズ管理アプリ「Mochico（モチコ）」の使い方を、ログインからリストの共有、ホーム画面への追加まで、画面の順番に沿って説明します。"
    >
      <p className={s.disclosure}>この記事は、ToolBoxJPが提供しているグッズ管理アプリ「Mochico（モチコ）」の公式の使い方ガイドです。</p>

      <div className={s.answer}>
        <p className={s.answerTitle}>3ステップで始められます</p>
        <ol>
          <li>紹介ページの「Mochicoをはじめる」から、メールアドレスに届く6桁のコードでログイン</li>
          <li>ライブやイベントのリストを作り、グッズを写真つきで登録</li>
          <li>手に入れたグッズをタップして「取得済み」に。リストはリンクで友達と共有できます</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="what">Mochico（モチコ）とは</h2>
      <p>
        Mochicoは、ライブやイベントのグッズを写真つきの一覧にして、持っているものをタップで記録できる、推しグッズの管理アプリです。ダウンロードは不要で、スマートフォンやパソコンのブラウザで使えます。
      </p>
      <ul>
        <li>イベントごとに、グッズを写真・名前・価格・カテゴリ・概要つきで一覧にできます。</li>
        <li>タップで「取得済み」と「未取得」を切り替え、取得数と割合を確認できます。</li>
        <li>グッズの一覧はリンクで共有できます。自分の取得状況は、共有した相手にもリストを作った人にも表示されません。</li>
      </ul>
      <p>
        どんな場面で使えるかは、紹介ページ（<Link href="/mochico">Mochico（モチコ）｜推しグッズ管理アプリ</Link>）で、実際の画面と一緒に紹介しています。
      </p>

      <h2 id="login">はじめ方（ログイン）</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>紹介ページの「Mochicoをはじめる」を押す</span>
          ログインの画面が開きます。はじめての人も、2回目以降の人も同じ手順です。
        </li>
        <li>
          <span className={s.stepTitle}>メールアドレスを入れて「ログインコードを送る」</span>
          パスワードは使いません。入力したメールアドレスに、件名「Mochico ログインコード」のメールが届きます。
        </li>
        <li>
          <span className={s.stepTitle}>メールの6桁のコードを入れて「ログイン」</span>
          コードの有効期限は1時間です。同じ端末・同じブラウザなら、メール内のリンクからもログインできます。
        </li>
      </ol>
      <div className={s.caution}>
        <p className={s.cardLabel}>メールが届かないとき</p>
        <p>迷惑メールフォルダを確認してください。それでも見つからない場合は、少し時間をおいてから、メールアドレスに間違いがないか確かめて送り直してください。</p>
      </div>

      <h2 id="event">イベントとグッズを登録する</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>「マイイベント」で「イベントを作成」</span>
          イベント名と開始日を入れます。終了日・概要・カバー画像は必要に応じて。物販の時間や購入制限は「概要」にメモしておくと便利です。
        </li>
        <li>
          <span className={s.stepTitle}>「作成してグッズを登録」で、グッズを追加</span>
          グッズ写真・商品名・価格（円）・カテゴリ・概要を入れます。必須は商品名だけです。写真はスマートフォンで撮ったものをそのまま選べ、自動で縮小されます（撮影場所などの位置情報は保存されません）。
        </li>
        <li>
          <span className={s.stepTitle}>「保存して続けて追加」で、次々に登録</span>
          最後のグッズは「保存して一覧へ」で保存すると、イベントのグッズ一覧に戻ります。
        </li>
      </ol>
      <p>
        ランダム商品は、絵柄の種類ごとに1件ずつ登録しておくと、どれを持っているかが一目で分かります（詳しくは「<Link href="/blog/random-goods-management">ランダムグッズの管理方法</Link>」）。
      </p>

      <h2 id="owned">「取得済み」を記録する</h2>
      <p>
        グッズの一覧でグッズをタップすると「取得済み」になり、もう一度タップすると「未取得」に戻ります。確認の画面は出ないので、物販の列でもすぐ記録できます。間違えたときは、画面下に出る「元に戻す」で戻せます。
      </p>
      <ul>
        <li>一覧の上に、取得数と割合が表示されます。</li>
        <li>「すべて」「未取得」「取得済み」で絞り込めます。「未取得」は、まだ買っていないものの買い物リストとして使えます。</li>
        <li>取得済みのグッズは、チェックの印・文字・枠の色で区別できます（色だけに頼らない表示です）。</li>
      </ul>
      <figure className={s.shot}>
        {/* eslint-disable-next-line @next/next/no-img-element -- LP と同じ静的な小さい WebP（遅延読込） */}
        <img
          src="/mochico/shots/event.webp"
          alt="Mochicoのイベント画面。グッズが写真つきで2列に並び、取得済みのグッズに印がついている。上部に取得数と割合"
          width={390}
          height={780}
          loading="lazy"
          decoding="async"
        />
        <figcaption>イベントのグッズ一覧（テスト用のデータで撮影）。</figcaption>
      </figure>

      <h2 id="share">リストを友達と共有する</h2>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>イベントの画面で「共有」を押す</span>
          共有の画面が開きます。共有できるのは、そのリストを作った人だけです。
        </li>
        <li>
          <span className={s.stepTitle}>有効期限を選んで「共有リンクを作成」</span>
          リンクの有効期限は「期限なし」「7日間」「30日間」から選べます。
        </li>
        <li>
          <span className={s.stepTitle}>「コピー」または「送る」で友達に渡す</span>
          LINEなどで、送りたい相手に直接送ってください。SNSに貼ると、リンクを知った誰でも一覧を見られる状態になります。
        </li>
      </ol>
      <p>
        共有されるのはグッズの一覧だけで、あなたの取得状況は共有されません。グッズを追加・修正すると、共有した全員の一覧にも反映されます。使い終わったら、同じ画面の「共有を停止（リンクを失効）」で止められます。止めたあとは、そのリンクから新しく見たり追加したりできなくなり、すでに追加した人のリストはそのまま使えます。
      </p>

      <h2 id="receive">共有されたリストを使う</h2>
      <ul>
        <li>受け取ったリンクを開くと、ログインしなくてもグッズの一覧を見られます。</li>
        <li>「ログインして自分の管理に追加」（ログイン済みなら「自分の管理に追加」）を押すと、マイイベントにそのリストが入り、自分の取得状況を記録できるようになります。</li>
        <li>共有されたリストには「共有」の印が付きます。グッズの追加や編集はできませんが、作った人が更新した内容はそのまま反映されます。</li>
        <li>自分の取得状況は、リストを作った人にも、ほかの参加者にも表示されません。</li>
      </ul>
      <p>
        友達との共有の考え方や注意点は「<Link href="/blog/share-goods-list-with-friends">友達とグッズ一覧を共有する方法と注意点</Link>」で詳しく紹介しています。
      </p>

      <h2 id="home">ホーム画面に追加する</h2>
      <p>ホーム画面に追加すると、次からアイコンをタップするだけで、アプリのように開けます。</p>
      <div className={s.methods}>
        <div className={s.method}>
          <h3>iPhone（Safari）</h3>
          <p>画面の「…」または共有ボタンから「共有」→「ホーム画面に追加」→（「Webアプリとして開く」がある場合はオンのまま）「追加」の順に進みます。</p>
        </div>
        <div className={s.method}>
          <h3>Android（Chrome など）</h3>
          <p>Mochicoの画面に出る「ホーム画面に追加」のボタンを押すと、ブラウザの確認画面が開きます。「インストール」を選べば追加できます。</p>
        </div>
      </div>
      <p>
        手順はアプリの「設定」→「ホーム画面への追加方法」でも、いつでも確認できます。なお、iPhoneではホーム画面から開いたMochicoとSafariのログイン状態が別になるため、はじめて開いたときにもう一度ログインが必要になることがあります。
      </p>

      <h2 id="settings">設定と退会</h2>
      <ul>
        <li>
          <strong>表示名</strong>：アプリ内で使う名前を変えられます。
        </li>
        <li>
          <strong>キャラクターの色</strong>：アプリ内に出てくるキャラクターの色を12色から選べます。
        </li>
        <li>
          <strong>ホーム画面への追加方法</strong>：お使いの端末に合わせた手順を確認できます。
        </li>
        <li>
          <strong>ログアウト</strong>：この端末からログアウトします。
        </li>
        <li>
          <strong>アカウントを削除</strong>：メールアドレス・表示名・あなたの取得状況が削除されます。ほかの人に共有して使われているリストは、作った人の情報を切り離したうえで、参加者が引き続き使えるよう残ります（以後は誰も編集・共有できません）。
        </li>
      </ul>
      <p>
        取り扱う情報の詳細は<Link href="/mochico/privacy">Mochico プライバシーポリシー</Link>、利用条件は<Link href="/mochico/terms">Mochico 利用規約</Link>をご覧ください。
      </p>

      <h2 id="faq">よくある質問</h2>
      <div className={s.methods}>
        <div className={s.method}>
          <h3>アプリのダウンロードは必要ですか？</h3>
          <p>必要ありません。スマートフォンやパソコンのブラウザで使えます。ホーム画面に追加すれば、アイコンから開けます。</p>
        </div>
        <div className={s.method}>
          <h3>機種変更したらデータは消えますか？</h3>
          <p>登録した内容はアカウントに保存されるので、新しい端末で同じメールアドレスでログインすれば、そのまま使えます。</p>
        </div>
        <div className={s.method}>
          <h3>個数や「欲しい」「交換用」も管理できますか？</h3>
          <p>Mochicoで記録できるのは「取得済み」「未取得」の二つです。個数や細かい状態、金額の集計は、メモやスプレッドシートと組み合わせてください（<Link href="/blog/goods-list-spreadsheet">スプレッドシートでの作り方</Link>）。</p>
        </div>
      </div>

      <MochicoCta title="さっそくMochicoを使ってみる" sub="紹介ページの「Mochicoをはじめる」から、メールアドレスだけで始められます。" label="紹介ページへ" />
    </MochicoArticleLayout>
  );
}
