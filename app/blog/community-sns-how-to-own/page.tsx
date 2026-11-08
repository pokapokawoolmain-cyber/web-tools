import { getBlogPost } from "@/data/blog-posts";
import { snsKitArticleMeta } from "../_components/sns-kit/meta";
import {
  SnsKitArticleLayout,
  SnsKitCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/sns-kit/SnsKitArticle";

const post = getBlogPost("community-sns-how-to-own")!;

export const metadata = snsKitArticleMeta(post, [
  "コミュニティ SNS 作り方",
  "自分たちのSNS 作る",
  "オンラインコミュニティ 作り方",
  "LINE オープンチャット Discord 比較",
  "会員制SNS 自作",
  "ファンコミュニティ 作り方",
]);

const TOC: TocItem[] = [
  { id: "why", label: "「自分たちの場所」がほしくなる理由" },
  { id: "options", label: "コミュニティの場所の選び方は、大きく3つ" },
  { id: "compare", label: "比べるときの6つの観点" },
  { id: "when-own", label: "自分たちのSNSを持つのが向いているとき" },
  { id: "before", label: "自分たちのSNSを持つ前に、決めておくこと" },
  { id: "how", label: "自分たちのSNSを持つ方法" },
  { id: "summary", label: "まとめ" },
];

const ROWS: { name: string; start: string; brand: string; data: string; rules: string; cost: string; work: string }[] = [
  {
    name: "LINE のグループ・オープンチャット",
    start: "すぐ始められる。多くの人がアプリを持っている",
    brand: "LINE の中の1つの部屋",
    data: "LINE のサービスの中にある",
    rules: "LINE の決まりの範囲で",
    cost: "無料",
    work: "ほぼなし",
  },
  {
    name: "Discord",
    start: "アカウント作成が必要。慣れていない人には少し難しい",
    brand: "サーバー名・アイコンは設定できる",
    data: "Discord のサービスの中にある",
    rules: "チャンネル・権限を細かく分けられる",
    cost: "無料から",
    work: "権限やチャンネルの設計",
  },
  {
    name: "コミュニティ作成サービス",
    start: "画面の案内に沿って作れる",
    brand: "名前・色は変えられることが多い",
    data: "サービスの中にある。書き出せるかはサービスによる",
    rules: "サービスが用意した機能の範囲",
    cost: "月額の料金がかかることが多い",
    work: "少ない",
  },
  {
    name: "自分たちのSNS",
    start: "準備に時間がかかる",
    brand: "名前・見た目・言葉づかいまで自分たちで決められる",
    data: "自分たちが契約したデータベースにある",
    rules: "カテゴリやプロフィールの項目まで自由に",
    cost: "サーバーなどの利用料（無料から始められるものもある）",
    work: "公開・運用・データの管理を自分たちで",
  },
];

export default function Page() {
  return (
    <SnsKitArticleLayout
      post={post}
      audience="organizer"
      heroLead="趣味の会やファンの集まりを、LINE や Discord ではなく自分たちの名前の場所にしたい。そう考え始めた運営者の方に向けて、選び方の観点と、自分たちのSNSを持つ前に決めておきたいことをまとめました。"
    >
      <p>
        最初は LINE のグループで十分だった集まりも、人が増えると困りごとが出てきます。大事なお知らせが雑談に流れてしまう。昔の投稿を探せない。初めて来た人に、どこから読めばいいかを毎回説明している。
      </p>
      <p>
        そのとき候補になるのが、Discord への引っ越しや、コミュニティ作成サービスの利用、そして自分たちのSNSを持つことです。この記事では、それぞれの向き不向きを比べたうえで、自分たちのSNSを持つなら何を決めておくべきかを説明します。
      </p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>まず連絡を取り合いたいだけなら、LINE や Discord のほうが手軽です</li>
          <li>名前・見た目・ルール・データを自分たちで持ちたいなら、自分たちのSNSが向いています</li>
          <li>自分たちのSNSは、作ることより「運営する人と決まり」を先に決めるのが大切です</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="why">「自分たちの場所」がほしくなる理由</h2>
      <p>運営者からよく聞くのは、次のような悩みです。</p>
      <ul>
        <li>
          <strong>話題が流れてしまう。</strong>チャットは新しい発言が上に積み重なるため、大事な情報ほど埋もれます。
        </li>
        <li>
          <strong>話題ごとに分けにくい。</strong>「質問」「作品」「イベント」などのカテゴリで整理したくても、チャットでは限界があります。
        </li>
        <li>
          <strong>メンバーのことが分からない。</strong>どんな車に乗っているか、どのカメラを使っているかなど、コミュニティならではのプロフィールを見せ合いたい。
        </li>
        <li>
          <strong>決まりを自分たちで作れない。</strong>投稿のルールや、困った投稿への対応を、自分たちの方針で決めたい。
        </li>
      </ul>
      <p>
        どれも、「会話の場所」から「情報が積み上がる場所」に変えたいという悩みです。まずは、選べる方法を並べてみましょう。
      </p>

      <h2 id="options">コミュニティの場所の選び方は、大きく3つ</h2>
      <div className={s.methods}>
        <div className={s.method}>
          <h3>1. 既存のチャットサービスを使う</h3>
          <p>
            LINE のグループやオープンチャット、Discord など。参加する人が慣れていて、今日から始められるのが強みです。一方で、見た目や機能はサービスが決めたものになり、データもそのサービスの中にあります。
          </p>
        </div>
        <div className={s.method}>
          <h3>2. コミュニティ作成サービスを使う</h3>
          <p>
            コミュニティの場所を作れるサービスを契約する方法です。画面の案内に沿って作れて、運用の手間も少なめです。月額の料金がかかることが多く、機能やデザインはそのサービスで用意された範囲になります。
          </p>
        </div>
        <div className={s.method}>
          <h3>3. 自分たちのSNSを持つ</h3>
          <p>
            自分たちで契約したサーバーやデータベースに、コミュニティ専用のSNSを置く方法です。名前・見た目・カテゴリ・プロフィールの項目・ルールまで、自分たちで決められます。その代わり、公開や運用、会員のデータの管理も自分たちで担います。
          </p>
        </div>
      </div>

      <h2 id="compare">比べるときの6つの観点</h2>
      <div className={s.tableWrap} role="region" aria-label="コミュニティの場所の比較表（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>コミュニティの場所ごとの特徴</caption>
          <thead>
            <tr>
              <th scope="col">方法</th>
              <th scope="col">始めやすさ</th>
              <th scope="col">自分たちらしさ</th>
              <th scope="col">データの置き場所</th>
              <th scope="col">ルール・機能の自由</th>
              <th scope="col">費用</th>
              <th scope="col">運営の手間</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.start}</td>
                <td>{r.brand}</td>
                <td>{r.data}</td>
                <td>{r.rules}</td>
                <td>{r.cost}</td>
                <td>{r.work}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>
        スマホでは表を横にスクロールできます。サービスごとに機能や料金は違うため、一般的な傾向として書いています。
      </p>

      <h2 id="when-own">自分たちのSNSを持つのが向いているとき</h2>
      <p>次のうち、いくつ当てはまるかを数えてみてください。2つ以上なら、自分たちのSNSを検討する価値があります。</p>
      <ul className={s.checklist}>
        <li>コミュニティの名前で、独立した場所として見せたい</li>
        <li>投稿をカテゴリで整理して、あとから探せるようにしたい</li>
        <li>コミュニティならではのプロフィールの項目（愛車・機材・推しなど）がほしい</li>
        <li>会員のデータを、自分たちが契約した場所に置きたい</li>
        <li>参加のルールや、困った投稿への対応を自分たちで決めたい</li>
      </ul>
      <p>
        反対に、「とにかく連絡が取れればいい」「運営に時間をかけられない」という場合は、無理に自分たちのSNSを持つ必要はありません。既存のチャットサービスのほうが、参加する人にとっても負担が少ないはずです。
      </p>

      <h2 id="before">自分たちのSNSを持つ前に、決めておくこと</h2>
      <p>作り始める前に、次の4つを決めておくと、あとで困りません。</p>
      <ol>
        <li>
          <strong>誰のための場所か。</strong>参加できる人の条件（誰でも／招待した人だけ）と、どんな投稿が集まる場所かを一文で言えるようにします。
        </li>
        <li>
          <strong>ルール。</strong>禁止すること（売買・勧誘・個人情報の書き込みなど）と、違反したときの対応を文章にします。
        </li>
        <li>
          <strong>見回りをする人。</strong>通報が来たときに確認する人を、少なくとも2人決めておきます。1人だと、休んでいる間に対応が止まります。
        </li>
        <li>
          <strong>費用を誰が払うか。</strong>サーバーなどの利用料がかかります。会費で賄うのか、運営者が負担するのかを決めておきます。
        </li>
      </ol>
      <div className={s.caution}>
        <p className={s.cardLabel}>注意</p>
        <p>
          自分たちのSNSでは、会員のメールアドレスやプロフィールを自分たちが預かることになります。利用規約とプライバシーポリシーを用意し、データの扱いを会員に説明できるようにしておきましょう。
        </p>
      </div>

      <h2 id="how">自分たちのSNSを持つ方法</h2>
      <p>方法は、大きく分けて3つです。</p>
      <ul>
        <li>
          <strong>制作会社に頼む。</strong>要望をまとめて作ってもらう方法です。費用は大きくなりますが、作る作業を任せられます。
        </li>
        <li>
          <strong>一から自分で作る。</strong>AI に手伝ってもらえば、画面を作ること自体は以前より手軽になりました。ただし、ログイン・権限・通報・退会といった、目立たないけれど欠かせない部分を正しく作るのは、今でも手間がかかります。
        </li>
        <li>
          <strong>土台を使って、自分たちに合わせる。</strong>ログインや投稿、通報などができあがった土台から始めて、名前・色・カテゴリなどを自分たちに合わせる方法です。
        </li>
      </ul>
      <p>
        ToolBoxJP の <strong>SNS Starter Kit</strong> は、3つめの方法のための商品です。メール認証・投稿と返信・画像・通報とブロック・管理画面などが入った土台を、ご自身の Supabase と Vercel に置いて使います。初期設定が終わった後は、Claude Code に「カテゴリを『愛車紹介・整備記録・ツーリング』にしたい」のように話して、コミュニティに合わせていきます。
      </p>
      <p>
        作業は Mac で行い、ターミナルにコマンドを貼り付ける場面もあります。AI で Web アプリを作ったことがある方か、手伝ってくれる方がいる場合に向いています。具体的な流れは、
        <a href="/blog/claude-code-community-sns">Claude Code でコミュニティ用のSNSを作る流れ</a>で説明しています。
      </p>

      <SnsKitCta
        title="ログイン・通報・管理画面まで入った、コミュニティSNSの土台"
        sub="作れるSNSの例・導入の流れ・費用の目安を、活用ガイドにまとめています。"
        href="/sns-starter-kit/guide"
        label="活用ガイドを見る"
      />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>連絡が取れればよいなら、LINE や Discord が手軽</li>
          <li>名前・見た目・ルール・データを自分たちで持ちたいなら、自分たちのSNSが向いている</li>
          <li>作る前に「誰のための場所か・ルール・見回りをする人・費用」を決めておく</li>
          <li>ログインや通報などの欠かせない部分は、土台を使うと手間を減らせる</li>
        </ul>
      </div>
    </SnsKitArticleLayout>
  );
}
