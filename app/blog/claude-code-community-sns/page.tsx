import { getBlogPost } from "@/data/blog-posts";
import { snsKitArticleMeta } from "../_components/sns-kit/meta";
import {
  SnsKitArticleLayout,
  SnsKitCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/sns-kit/SnsKitArticle";

const post = getBlogPost("claude-code-community-sns")!;

export const metadata = snsKitArticleMeta(post, [
  "Claude Code SNS 作り方",
  "Claude Code 非エンジニア",
  "AI SNS 作る",
  "コミュニティSNS 自作 費用",
  "Supabase Vercel SNS",
  "AI アプリ開発 コミュニティ",
]);

const TOC: TocItem[] = [
  { id: "what", label: "Claude Code でできること・できないこと" },
  { id: "prepare", label: "始める前に用意するもの" },
  { id: "cost", label: "かかる費用の目安" },
  { id: "flow", label: "作る流れ（土台を使う場合）" },
  { id: "ask", label: "Claude Code への頼み方のコツ" },
  { id: "stuck", label: "つまずきやすいところ" },
  { id: "summary", label: "まとめ" },
];

const COST_ROWS: { name: string; role: string; cost: string }[] = [
  { name: "Claude（Claude Code）", role: "AI に話して作る・変える", cost: "有料プラン（Pro は月20ドル〜）" },
  { name: "Supabase", role: "データベース・ログイン・画像の保存", cost: "無料から。公開して運用するなら Pro（月25ドル〜）が安心" },
  { name: "Vercel", role: "公開先", cost: "無料の Hobby は個人の非商用まで。商用なら Pro（1人あたり月20ドル〜）" },
  { name: "Resend など", role: "登録・パスワード再設定のメール", cost: "Resend は無料で月3,000通（1日100通）まで" },
  { name: "独自ドメイン", role: "メールの送信元", cost: "年1,000〜3,000円程度（種類による）" },
];

export default function Page() {
  return (
    <SnsKitArticleLayout
      post={post}
      audience="organizer"
      heroLead="Claude Code を使えば、プログラミングに詳しくなくてもコミュニティ用のSNSを形にしやすくなりました。この記事では、始める前に用意するもの、費用の目安、作る流れ、AI への頼み方、そしてつまずきやすいところを、運営者の目線で説明します。"
    >
      <p>
        Claude Code は、Anthropic の AI に、パソコンの中のファイルを読み書きしたり、コマンドを動かしたりしてもらえる道具です。「プロフィールに『愛車』の項目を足して」と話すと、AI が必要なファイルを探して書き換えます。
      </p>
      <p>
        ただし、AI に任せればSNSが自動で完成するわけではありません。何を作るかを決めるのも、公開して運営するのも人です。この記事では、その分担を分かったうえで進められるように、流れを順に説明します。
      </p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>用意するのは、パソコン・Claude の有料プラン・データベースと公開先のアカウント・ドメイン</li>
          <li>ログインや通報などの欠かせない部分は、一から作るより土台を使うほうが安全で早い</li>
          <li>AI には「1回に1つ」頼み、変えるたびに動作を確かめる</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="what">Claude Code でできること・できないこと</h2>
      <div className={s.compare}>
        <div className={s.compareItem}>
          <h3>得意なこと</h3>
          <ul>
            <li>言葉で伝えた変更を、ファイルに反映する</li>
            <li>エラーの表示を読んで、原因を探して直す</li>
            <li>コマンドを動かして、結果を確かめる</li>
            <li>コードの意味を、分かる言葉で説明する</li>
          </ul>
        </div>
        <div className={s.compareItem}>
          <h3>人がすること</h3>
          <ul>
            <li>どんなコミュニティにするかを決める</li>
            <li>外部サービスのアカウントを作り、契約する</li>
            <li>パスワードや鍵を安全に扱う</li>
            <li>公開した後の運営と、会員のデータの管理</li>
          </ul>
        </div>
      </div>
      <p>
        特に注意したいのは、AI が書いたコードが「動く」ことと「安全である」ことは別だという点です。SNS には、他人の投稿を書き換えられない、ブロックした相手から見えなくなる、退会したらデータが消える、といった目立たない約束がたくさんあります。ここを AI と一から作る場合は、自分で確かめる知識が必要になります。
      </p>

      <h2 id="prepare">始める前に用意するもの</h2>
      <ul className={s.checklist}>
        <li>
          <b>パソコン</b>：作業はパソコンで行います。ターミナル（コマンドを入力する画面）を使う場面があります
        </li>
        <li>
          <b>Claude の有料プラン</b>：Claude Code は有料プランで使えます
        </li>
        <li>
          <b>データベース（Supabase など）</b>：会員・投稿・画像を保存する場所
        </li>
        <li>
          <b>公開先（Vercel など）</b>：SNS をインターネットに公開する場所
        </li>
        <li>
          <b>メール送信サービス（Resend など）と独自ドメイン</b>：登録の確認やパスワード再設定のメールを送るため
        </li>
      </ul>
      <p>
        アカウントはすべて、運営者（または運営する団体）の名前で作ります。誰かに作ってもらった場合も、ログインの方法と請求先は運営者が把握しておきましょう。
      </p>

      <h2 id="cost">かかる費用の目安</h2>
      <div className={s.tableWrap} role="region" aria-label="費用の目安（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>外部サービスの費用の目安（2026年11月時点）</caption>
          <thead>
            <tr>
              <th scope="col">サービス</th>
              <th scope="col">役割</th>
              <th scope="col">費用</th>
            </tr>
          </thead>
          <tbody>
            {COST_ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.role}</td>
                <td>{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>
        料金と条件は各サービスが変更することがあります。契約の前に、それぞれの公式の料金ページで確かめてください。ドルの料金は為替によって円の金額が変わります。
      </p>
      <div className={s.point}>
        <p className={s.cardLabel}>POINT</p>
        <p>
          試している間は無料のプランで十分なことが多いです。会員を招いて運営を始めるときに、データベースの一時停止がない有料プランや、商用で使える公開先のプランに切り替えるかを検討しましょう。
        </p>
      </div>

      <h2 id="flow">作る流れ（土台を使う場合）</h2>
      <p>ログインや投稿などができあがった土台から始める場合の、一般的な流れです。</p>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>土台の手順書を読む</span>
          何を用意して、どの順で進めるかを先に把握します。
        </li>
        <li>
          <span className={s.stepTitle}>外部サービスを用意する</span>
          データベース・公開先・メール送信のアカウントを作り、必要な設定をします。
        </li>
        <li>
          <span className={s.stepTitle}>初期設定をして、手元で動かす</span>
          鍵の書き込みやデータベースの準備をして、自分のパソコンで画面が開くところまで進めます。
        </li>
        <li>
          <span className={s.stepTitle}>Claude Code に話して、コミュニティに合わせる</span>
          名前・色・カテゴリ・プロフィールの項目などを、1つずつ変えていきます。
        </li>
        <li>
          <span className={s.stepTitle}>動作を確かめて、公開する</span>
          登録・ログイン・投稿・通報を実際に試してから、会員を招きます。
        </li>
      </ol>

      <h2 id="ask">Claude Code への頼み方のコツ</h2>
      <ul>
        <li>
          <strong>1回に1つだけ頼む。</strong>「名前を変えて、色も変えて、カテゴリも増やして」とまとめて頼むと、どこで問題が起きたか分からなくなります。
        </li>
        <li>
          <strong>目的を一緒に伝える。</strong>「初めて来た人が迷わないように、ホームの文章をやさしくしたい」のように、なぜ変えたいかを添えると、意図に合った変更になりやすくなります。
        </li>
        <li>
          <strong>変えたら確かめる。</strong>画面を開いて確かめ、うまくいったら記録（コミット）してから次へ進みます。戻したいときに、その時点まで戻せます。
        </li>
        <li>
          <strong>鍵やパスワードを貼り付けない。</strong>チャットに秘密の値を書くと、記録に残ってしまいます。鍵は決められたファイルに、自分で書き込みます。
        </li>
      </ul>

      <h2 id="stuck">つまずきやすいところ</h2>
      <p>実際に導入を試したときに、時間がかかりやすかったのは次のような場面です。</p>
      <ul>
        <li>
          <strong>メールが届かない。</strong>送信元のドメインの設定（DNS）が終わっていない、メール送信サービスの別のアカウントで鍵を作ってしまった、などが原因になります。新しいドメインからのメールは、最初は迷惑メールのフォルダに入ることもあります。
        </li>
        <li>
          <strong>メールのリンクを押すと、手元の住所（localhost）が開く。</strong>データベースのサービス側に、公開したサイトのアドレスを登録し忘れているときに起きます。
        </li>
        <li>
          <strong>パスワードの貼り付けを間違える。</strong>ターミナルでは、入力したパスワードが画面に表示されないことがあります。表示されなくても入力はされているので、貼り付けて Enter を押します。
        </li>
        <li>
          <strong>画面を撮って人に送ってしまう。</strong>鍵が表示された画面のスクリーンショットは、そのまま鍵を渡すのと同じです。人に見せる前に、鍵が写っていないか確かめましょう。
        </li>
      </ul>
      <p>
        ToolBoxJP の <strong>SNS Starter Kit</strong> の手順書は、こうした場面で迷わないように、画面ごとに押すボタンと確かめ方を書いています。また、変更のたびに動かす確認のコマンド（<code>npm run verify</code>）が、守るべき場所が変わっていないか、秘密の値が混ざっていないかなどを自動で確かめます。
      </p>

      <SnsKitCta
        title="Claude Code で、コミュニティに合わせて変えられるSNSの土台"
        sub="作業は Mac（macOS 26・Apple シリコン）で確認しています。導入の流れと費用の目安は活用ガイドへ。"
        href="/sns-starter-kit/guide"
        label="活用ガイドを見る"
      />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>Claude Code は言葉で伝えた変更をファイルに反映できるが、決めること・契約すること・運営することは人の役目</li>
          <li>費用は Claude の有料プランと、データベース・公開先・メール・ドメインの利用料</li>
          <li>ログインや通報などの欠かせない部分は、土台を使うと安全に始めやすい</li>
          <li>AI には1回に1つ頼み、変えるたびに確かめて記録する</li>
        </ul>
      </div>
      <p>
        どの方法でコミュニティの場所を持つか迷っている場合は、
        <a href="/blog/community-sns-how-to-own">自分たちのコミュニティSNSを持つには</a>もあわせてご覧ください。
      </p>
    </SnsKitArticleLayout>
  );
}
