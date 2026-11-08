import { getBlogPost } from "@/data/blog-posts";
import { snsKitArticleMeta } from "../_components/sns-kit/meta";
import {
  SnsKitArticleLayout,
  SnsKitCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/sns-kit/SnsKitArticle";

const post = getBlogPost("community-sns-moderation")!;

export const metadata = snsKitArticleMeta(post, [
  "SNS 通報機能 作り方",
  "ブロック機能 実装",
  "コミュニティ モデレーション",
  "SNS 管理画面 設計",
  "荒らし対策 SNS",
  "Supabase 通報 ブロック",
]);

const TOC: TocItem[] = [
  { id: "why", label: "モデレーションの機能を後回しにすると困る理由" },
  { id: "report", label: "通報: 何を、誰が、どこまで見られるか" },
  { id: "block", label: "ブロック: 「見えない」と「関われない」を両方" },
  { id: "admin", label: "管理画面: 非表示・利用停止と記録" },
  { id: "limits", label: "上限と自動の非表示" },
  { id: "ops", label: "運営の決まりも、機能と一緒に用意する" },
  { id: "summary", label: "まとめ" },
];

const FEATURE_ROWS: { name: string; purpose: string; pitfall: string }[] = [
  { name: "通報", purpose: "問題のある投稿・返信・利用者を運営に知らせる", pitfall: "通報の内容が、通報された本人やほかの利用者に見えてしまう" },
  { name: "ブロック", purpose: "特定の相手と関わらないようにする", pitfall: "画面で隠すだけで、API から読めたり返信できたりする" },
  { name: "非表示", purpose: "運営が投稿を見えなくする", pitfall: "一覧からは消えたが、画像や返信が残って見える" },
  { name: "利用停止", purpose: "ルール違反を繰り返す利用者の操作を止める", pitfall: "ログインはできないが、残ったセッションで投稿できてしまう" },
  { name: "投稿の上限", purpose: "連続投稿やスパムを抑える", pitfall: "画面でだけ制限していて、API を直接呼ぶと上限なく投稿できる" },
];

export default function Page() {
  return (
    <SnsKitArticleLayout
      post={post}
      audience="developer"
      heroLead="コミュニティSNSを公開すると、遅かれ早かれ困った投稿や利用者に出会います。通報・ブロック・非表示・利用停止・投稿の上限を、最初から設計に入れておくべき理由と、実装でよくある抜け漏れをまとめました。"
    >
      <p>
        プロフィールと投稿の画面ができると、SNS はひとまず完成したように見えます。しかし、公開して人が集まり始めると、宣伝の書き込み、言い争い、特定の人へのしつこい返信などが起きます。そのときに運営が使える道具がないと、対応はすべて手作業になり、運営者の負担と利用者の不安が一気に大きくなります。
      </p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>通報・ブロック・非表示・利用停止・投稿の上限は、公開前にそろえる</li>
          <li>どれも、画面ではなくデータベースのポリシーで効かせる</li>
          <li>運営の決まり（誰が見て、どう対応するか）を、機能と一緒に用意する</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="why">モデレーションの機能を後回しにすると困る理由</h2>
      <ul>
        <li>
          <strong>問題は、人が増えた後に起きる。</strong>いちばん忙しい時期に、機能の追加とデータの手直しを同時にすることになります。
        </li>
        <li>
          <strong>後から入れると、すべての読み取りに影響する。</strong>ブロックや非表示は、投稿・返信・プロフィール・画像・通知のすべての読み取りに関わります。後から足すと、直す場所が多くなり、漏れも出やすくなります。
        </li>
        <li>
          <strong>利用者は、守られているかで場所を選ぶ。</strong>通報やブロックの手段が見当たらない場所には、安心して書き込めません。
        </li>
      </ul>

      <div className={s.tableWrap} role="region" aria-label="モデレーションの機能の比較表（横にスクロールできます）" tabIndex={0}>
        <table className={s.table}>
          <caption>モデレーションの機能と、よくある抜け漏れ</caption>
          <thead>
            <tr>
              <th scope="col">機能</th>
              <th scope="col">目的</th>
              <th scope="col">よくある抜け漏れ</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.purpose}</td>
                <td>{r.pitfall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="report">通報: 何を、誰が、どこまで見られるか</h2>
      <ul className={s.checklist}>
        <li>
          <b>通報の対象を種類で管理する</b>：投稿・返信・利用者など、対象の種類を表で持っておくと、後から機能を足したときに同じ仕組みで通報できます
        </li>
        <li>
          <b>読める人を絞る</b>：通報の内容を読めるのは、通報した本人と管理者だけにします
        </li>
        <li>
          <b>同じ相手への重複を防ぐ</b>：同じ人が同じ対象を何度も通報できないよう、一意の制約を付けます
        </li>
        <li>
          <b>状態を持つ</b>：「未対応・対応済み・問題なし」などの状態と、対応した管理者・日時を残します
        </li>
      </ul>

      <h2 id="block">ブロック: 「見えない」と「関われない」を両方</h2>
      <p>ブロックには、2つの意味があります。</p>
      <ol>
        <li>
          <strong>見えない。</strong>ブロックした相手の投稿・返信・プロフィールが、自分の画面に出ない。
        </li>
        <li>
          <strong>関われない。</strong>ブロックされた相手が、自分の投稿に返信したり、自分を通報の対象以外で操作したりできない。
        </li>
      </ol>
      <p>
        どちらも、読み取りと書き込みのポリシーで効かせます。「AさんとBさんの間にブロックがあるか」を判定する関数を1つ作り、投稿・返信・プロフィールなどすべてのポリシーから同じ関数を呼ぶと、抜け漏れが減ります。ブロックは双方向に効かせるのが一般的です（どちらが設定しても、互いに関われない）。
      </p>
      <div className={s.caution}>
        <p className={s.cardLabel}>注意</p>
        <p>
          ブロックしている相手でも、運営への通報はできるようにしておきます。ブロックで通報まで止めると、嫌がらせを受けた人が運営に知らせる手段がなくなります。
        </p>
      </div>

      <h2 id="admin">管理画面: 非表示・利用停止と記録</h2>
      <ul className={s.checklist}>
        <li>
          <b>削除より非表示</b>：運営の判断で消すときは、まず非表示にします。判断を誤ったときに戻せて、対応の記録も残ります
        </li>
        <li>
          <b>非表示の範囲</b>：投稿を非表示にしたら、その返信や画像も一緒に見えなくなるかを確かめます
        </li>
        <li>
          <b>利用停止の効き方</b>：利用停止の判定をポリシーに入れ、ログイン中のセッションが残っていても、投稿・返信・通報を作れないようにします
        </li>
        <li>
          <b>管理者の操作もデータベースで制限</b>：管理画面を開けるかどうかだけでなく、非表示や利用停止の操作そのものを、管理者だけが実行できるようにします
        </li>
        <li>
          <b>操作の記録</b>：誰が、いつ、何に対して、どの操作をしたかを残します。運営者が複数いるときに、対応が重なったり漏れたりするのを防げます
        </li>
      </ul>

      <h2 id="limits">上限と自動の非表示</h2>
      <ul>
        <li>
          <strong>投稿の上限。</strong>1時間あたりの投稿数・返信数・通報数に上限を設けます。画面だけでなく、データベースでも数えて止めます。
        </li>
        <li>
          <strong>一定数の通報で自動の非表示。</strong>複数の利用者から通報された投稿を、管理者が確認するまで自動で非表示にする方法もあります。ただし、少数で特定の人を狙った通報が起きうるため、件数のしきい値と、管理者が確認して戻す流れをセットで用意します。
        </li>
      </ul>

      <h2 id="ops">運営の決まりも、機能と一緒に用意する</h2>
      <p>機能がそろっていても、使う人と決まりがなければ動きません。公開前に、次の3つを用意しておきましょう。</p>
      <ol>
        <li>
          <strong>コミュニティのルール。</strong>禁止すること（宣伝・売買・個人情報の書き込み・特定の人への攻撃など）と、違反したときの対応（非表示・警告・利用停止）。
        </li>
        <li>
          <strong>見回りの担当。</strong>通報を確認する人を、少なくとも2人。確認する頻度の目安も決めておきます。
        </li>
        <li>
          <strong>利用規約とプライバシーポリシー。</strong>会員のデータの扱いと、運営が投稿を非表示にできることを明記します。
        </li>
      </ol>

      <SnsKitCta
        title="通報・ブロック・管理画面が入った、コミュニティSNSの土台"
        sub="SNS Starter Kit は、通報・ブロック・投稿の非表示・利用停止・投稿の上限をデータベースのポリシーで実装しています。ルール・規約の文章のひな形も同梱しています。"
        href="/sns-starter-kit/guide#developer"
        label="開発者向けの説明を見る"
      />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>モデレーションの機能は、人が集まる前にそろえておく</li>
          <li>ブロックは「見えない」と「関われない」の両方を、ポリシーで効かせる</li>
          <li>運営の削除は、まず非表示。操作の記録も残す</li>
          <li>ルール・見回りの担当・規約を、機能と一緒に用意する</li>
        </ul>
      </div>
      <p>
        権限まわりの全体の見直しには、
        <a href="/blog/supabase-community-sns-security">Supabase で会員制コミュニティを作るときの安全チェックリスト</a>もお使いください。
      </p>
    </SnsKitArticleLayout>
  );
}
