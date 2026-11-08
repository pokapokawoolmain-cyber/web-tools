import { getBlogPost } from "@/data/blog-posts";
import { snsKitArticleMeta } from "../_components/sns-kit/meta";
import {
  SnsKitArticleLayout,
  SnsKitCta,
  Toc,
  articleStyles as s,
  type TocItem,
} from "../_components/sns-kit/SnsKitArticle";

const post = getBlogPost("supabase-community-sns-security")!;

export const metadata = snsKitArticleMeta(post, [
  "Supabase RLS チェックリスト",
  "Supabase セキュリティ",
  "Supabase Storage ポリシー",
  "会員制SNS セキュリティ",
  "Supabase service_role 注意",
  "Next.js Supabase SNS",
]);

const TOC: TocItem[] = [
  { id: "premise", label: "前提: Supabase では「データベースが最後の砦」" },
  { id: "rls", label: "1. テーブルと RLS" },
  { id: "functions", label: "2. 関数・ビュー・トリガー" },
  { id: "storage", label: "3. Storage（画像の保存場所）" },
  { id: "auth", label: "4. 認証とメール" },
  { id: "roles", label: "5. 管理者権限とモデレーション" },
  { id: "delete", label: "6. 退会とデータの削除" },
  { id: "secrets", label: "7. 鍵と、AI に触らせる範囲" },
  { id: "test", label: "8. テストで確かめる" },
  { id: "summary", label: "まとめ" },
];

export default function Page() {
  return (
    <SnsKitArticleLayout
      post={post}
      audience="developer"
      heroLead="Supabase と Next.js で会員制のコミュニティを作るとき、画面が動いた後に確かめておきたい項目をチェックリストにしました。RLS・関数・Storage・認証・管理者権限・退会・鍵の扱いまで、公開前の見直しにお使いください。"
    >
      <p>
        Supabase は、ブラウザから直接データベースに問い合わせられるのが大きな利点です。その代わり、権限の設定を1か所でも誤ると、ログインした利用者が他人のデータを読めたり、書き換えられたりします。AI にコードを書いてもらう場合は、画面が期待どおりに動いていても、この部分が抜けていることがあります。
      </p>
      <p>
        以下は、コミュニティSNS（プロフィール・投稿・返信・画像・通報・ブロック・管理画面がある構成）を想定したチェックリストです。
      </p>

      <div className={s.answer}>
        <p className={s.answerTitle}>先に結論</p>
        <ol>
          <li>public スキーマのすべてのテーブルで RLS を有効にし、既定の権限を見直す</li>
          <li>ブロック・利用停止・管理者の判定は、画面ではなくデータベースの関数とポリシーで行う</li>
          <li>Storage は非公開にし、読み書きをポリシーで制限する</li>
          <li>「他人として操作したら失敗する」ことを、テストで確かめる</li>
        </ol>
      </div>

      <Toc items={TOC} />

      <h2 id="premise">前提: Supabase では「データベースが最後の砦」</h2>
      <p>
        Supabase の公開用の鍵（anon / publishable key）は、ブラウザに配る前提の鍵です。つまり、利用者は画面を通さずに、その鍵で直接データベースの API を呼べます。画面でボタンを隠しても、API を直接呼ばれれば意味がありません。
      </p>
      <p>
        そのため、「この人はこの行を読める・書ける」という判断は、すべてデータベースの RLS（行ごとのアクセス制限）とポリシーで行う必要があります。
      </p>

      <h2 id="rls">1. テーブルと RLS</h2>
      <ul className={s.checklist}>
        <li>
          <b>public スキーマのすべてのテーブルで RLS が有効か</b>：新しく足したテーブルで有効にし忘れていないかを、Supabase の Security Advisor でも確かめます
        </li>
        <li>
          <b>不要な権限を取り消しているか</b>：<code>anon</code>・<code>authenticated</code> に既定で付く権限を見直し、必要な操作と列だけに <code>grant</code> します
        </li>
        <li>
          <b>insert と update の <code>with check</code></b>：<code>owner_id = auth.uid()</code> を確かめないと、他人になりすました行を作れてしまいます
        </li>
        <li>
          <b>利用者に書き換えさせない列</b>：<code>role</code>・<code>is_hidden</code>・<code>created_at</code> などは、列単位の <code>grant</code> で書き換えられないようにします
        </li>
        <li>
          <b>ブロックの反映</b>：ブロックした・された相手の投稿やプロフィールが、読み取りのポリシーで見えなくなっているか
        </li>
        <li>
          <b>利用停止の反映</b>：利用停止にした利用者が、投稿・返信・通報を作れなくなっているか
        </li>
      </ul>

      <h2 id="functions">2. 関数・ビュー・トリガー</h2>
      <ul className={s.checklist}>
        <li>
          <b>SECURITY DEFINER の関数</b>：作成者の権限で動くため、<code>search_path</code> を固定し、引数の利用者が本人かを関数の中で確かめます。public スキーマに置くと API から呼べる点にも注意します
        </li>
        <li>
          <b>ビュー</b>：既定では作成者の権限で動き、元のテーブルの RLS を通らないことがあります。<code>security_invoker</code> を付けるか、公開しないスキーマに置きます
        </li>
        <li>
          <b>判定の関数を1か所に</b>：「ブロックしているか」「操作してよい利用者か」「管理者か」を関数にまとめ、すべてのポリシーから同じ関数を使うと、抜け漏れが減ります
        </li>
      </ul>

      <h2 id="storage">3. Storage（画像の保存場所）</h2>
      <ul className={s.checklist}>
        <li>
          <b>バケットを Public にしていないか</b>：Public のバケットは、URL を知っていれば誰でも読めます。非公開にして、読み取りもポリシーで制限します
        </li>
        <li>
          <b>保存先のパスに利用者の ID を含める</b>：<code>{"<user_id>/<ファイル名>"}</code> のようにし、書き込みのポリシーで本人のフォルダにしか置けないようにします
        </li>
        <li>
          <b>ファイルの種類と大きさ</b>：バケットの設定で、受け付ける MIME タイプと最大サイズを制限します
        </li>
        <li>
          <b>非表示・ブロックとの整合</b>：投稿を非表示にしたり、利用者をブロックしたりしたときに、画像だけ読めてしまわないか
        </li>
      </ul>

      <h2 id="auth">4. 認証とメール</h2>
      <ul className={s.checklist}>
        <li>
          <b>メールアドレスの確認を有効にしているか</b>：確認前の利用者に投稿させない設計にします
        </li>
        <li>
          <b>Site URL とリダイレクト先の許可リスト</b>：公開したアドレスを登録します。登録し忘れると、メールのリンクが localhost を開きます
        </li>
        <li>
          <b>メールのリンクの「先読み」</b>：一部のメールサービスのセキュリティ機能は、届いたリンクを自動で開くことがあります。リンクを開いただけで確認が終わる作りだと、本人が押す前に使われてしまいます。リンク先にボタンを置き、押したときに確認する作りにすると防げます
        </li>
        <li>
          <b>送信元のドメイン</b>：独自のメール送信サービス（SMTP）を設定し、SPF・DKIM・DMARC を整えます
        </li>
      </ul>

      <h2 id="roles">5. 管理者権限とモデレーション</h2>
      <ul className={s.checklist}>
        <li>
          <b>管理者の判定をデータベースで</b>：管理画面を隠すだけでなく、非表示・利用停止などの操作そのものを、管理者だけが実行できるポリシーや関数にします
        </li>
        <li>
          <b>管理者を増やす手順</b>：利用者が自分で管理者になれる経路（プロフィールの更新など）がないか
        </li>
        <li>
          <b>通報の読み取り</b>：通報の内容は、通報した本人と管理者だけが読めるようにします
        </li>
        <li>
          <b>連続投稿の上限</b>：1時間あたりの投稿数などの上限を、データベース側でも確かめます
        </li>
      </ul>

      <h2 id="delete">6. 退会とデータの削除</h2>
      <ul className={s.checklist}>
        <li>
          <b>関連する行が消えるか</b>：プロフィールを起点に、投稿・返信・ブロック・通報などが外部キーの <code>on delete cascade</code> で消えるか
        </li>
        <li>
          <b>Storage のファイル</b>：データベースの行が消えても、ファイルは自動では消えません。退会の処理で、その利用者のフォルダを消します
        </li>
        <li>
          <b>Auth の利用者</b>：認証の利用者そのものも削除されるか（サーバー側の処理で行う）
        </li>
      </ul>

      <h2 id="secrets">7. 鍵と、AI に触らせる範囲</h2>
      <ul className={s.checklist}>
        <li>
          <b>service_role（secret）鍵をブラウザに出さない</b>：<code>NEXT_PUBLIC_</code> で始まる環境変数に入れない。サーバー側だけで使います
        </li>
        <li>
          <b>.env.local をコミットしない・AI に見せない</b>：AI のチャットや記録に、鍵が残らないようにします
        </li>
        <li>
          <b>AI が変えてはいけない場所を決める</b>：認証・RLS・マイグレーション・Storage のポリシーなどを「守る場所」として文書にし、変更されたら検出する仕組み（Git の hook や、CI での差分の確認）を用意します
        </li>
      </ul>

      <h2 id="test">8. テストで確かめる</h2>
      <p>
        ポリシーは、読んで正しそうに見えても、実際に試すと穴が見つかることがあります。次のような「失敗するはずの操作」を、テストとして残しておくのがおすすめです。
      </p>
      <ul>
        <li>利用者 A として、利用者 B の投稿を更新・削除しようとすると失敗する</li>
        <li>B が A をブロックした後、A から B の投稿が見えない・返信できない</li>
        <li>利用停止中の利用者は、投稿・返信・通報を作れない</li>
        <li>管理者でない利用者は、投稿を非表示にできない・自分を管理者にできない</li>
        <li>ログインしていない状態では、どのテーブルも読めない（公開する設計なら、その範囲だけ）</li>
        <li>退会すると、関連する行とファイルが残らない</li>
      </ul>
      <p>
        テストは、トランザクションの中で利用者を切り替えて実行し、最後に取り消す（rollback）と、データベースを汚さずに何度でも試せます。
      </p>

      <SnsKitCta
        title="このチェックリストの多くを、最初から満たした土台"
        sub="SNS Starter Kit は、RLS・Storage のポリシー・ブロック・通報・管理者権限・退会を実装し、データベースの安全の仕組みを実際に試すテスト（verify:full）を同梱しています。"
        href="/sns-starter-kit/guide#developer"
        label="開発者向けの説明を見る"
      />

      <h2 id="summary">まとめ</h2>
      <div className={s.summary}>
        <ul>
          <li>Supabase では、画面ではなくデータベースの RLS とポリシーが最後の砦</li>
          <li>関数・ビュー・Storage は、RLS とは別に確かめる</li>
          <li>管理者・ブロック・利用停止の判定は、関数にまとめてすべてのポリシーで使う</li>
          <li>「他人として操作したら失敗する」ことを、テストで残しておく</li>
        </ul>
      </div>
      <p>
        通報・ブロック・管理画面の設計については、
        <a href="/blog/community-sns-moderation">コミュニティSNSの通報・ブロック・管理画面の作り方</a>で詳しく説明しています。
      </p>
    </SnsKitArticleLayout>
  );
}
