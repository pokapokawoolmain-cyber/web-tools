import type { Metadata } from "next";
import { SELLER, TERMS_EFFECTIVE_DATE, TEXT } from "@/lib/sns-starter-kit/commerce";
import { LegalSection, LegalShell } from "@/components/sns-starter-kit/legal/LegalShell";

export const metadata: Metadata = {
  title: { absolute: "販売利用規約・使用許諾条件｜SNS Starter Kit | ToolBoxJP" },
  description: "SNS Starter Kit の販売利用規約、使用許諾条件（Standard License）、返金・サポートの条件です。",
  alternates: { canonical: "https://www.toolboxjp.com/sns-starter-kit/terms" },
};

const UL = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc pl-5 space-y-1">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);

export default function SnsKitTermsPage() {
  return (
    <LegalShell title="販売利用規約・使用許諾条件" updated={TERMS_EFFECTIVE_DATE}>
      <p>
        この規約は、{SELLER.name}（以下「販売者」）が販売する「{TEXT.product}」（以下「本商品」）の購入と利用に適用されます。購入の手続きを完了した方（以下「購入者」）は、この規約に同意したものとします。
      </p>

      <h2 className="text-xl font-bold text-slate-900 pt-4">第1部 販売利用規約</h2>

      <LegalSection title="第1条（商品の内容）">
        <p>{TEXT.form}本商品は、会員制のコミュニティのサイトを構築するためのソースコード・設定・文書であり、完成したサービスや運用の代行ではありません。</p>
        <p>{TEXT.update}</p>
        <p>{TEXT.env}</p>
        <p>{TEXT.external}購入者は、外部サービスのアカウントを自身で用意し、それぞれの利用規約に同意する必要があります。</p>
        <p>{TEXT.separate}</p>
      </LegalSection>

      <LegalSection title="第2条（契約の成立）">
        <p>購入者が支払い画面で購入を確定し、決済が完了した時点で、売買契約が成立します。決済が完了しなかった場合、契約は成立しません。</p>
        <p>決済が完了した日を「購入日」とし、サポートと返金の期間はこの日から数えます。</p>
      </LegalSection>

      <LegalSection title="第3条（支払い・引渡し）">
        <p>支払方法: {TEXT.payMethod}。{TEXT.payTiming}</p>
        <p>引渡方法: {TEXT.deliveryMethod}</p>
        <p>引渡時期: {TEXT.deliveryTiming}</p>
        <p>ダウンロードの案内に記載するリンクの有効期限は7日間です。期限が切れた場合は、購入時のメールアドレスからご連絡いただければ、購入日から1年間は新しいリンクをお送りします。</p>
      </LegalSection>

      <LegalSection title="第4条（返品・返金）">
        <p>{TEXT.refund}</p>
        <p>{TEXT.cancelBeforeConfirm}</p>
        <p>返金する場合は、決済に使われた支払方法に対して返金します。返金した場合、本商品の使用許諾は終了し、購入者は本商品を削除するものとします。</p>
      </LegalSection>

      <LegalSection title="第5条（サポート）">
        <p>{TEXT.support}</p>
        <p>窓口: {SELLER.email}。お問い合わせの際は、鍵・パスワード・<code>.env.local</code> の中身やその画面のスクリーンショットを送らないでください（エラーの文言とコマンドの結果を文字でお送りください）。</p>
        <p>サポートでは、原因の切り分けの手助けと、同梱の手順書の該当箇所のご案内を行います。修正版の提供はお約束していません。</p>
      </LegalSection>

      <LegalSection title="第6条（購入者の責任）">
        <UL
          items={[
            "購入者は、本商品を使って構築したサイトを、自身の責任で運営します（会員の個人情報の取り扱い、利用規約・プライバシーポリシーの作成、法令の遵守、投稿の管理を含みます）。本商品には、構築したサイトで使う規約・プライバシーポリシーの文面は含まれません。",
            "鍵・パスワードなどの秘密の情報の管理は、購入者が行います。",
            "本商品を改変した場合（Core の改変を含みます）の動作は、購入者の責任とします。",
          ]}
        />
      </LegalSection>

      <LegalSection title="第7条（保証）">
        <p>販売者は、本商品を提供する時点で、動作確認済みの環境において、同梱の手順書どおりに導入できることを確認しています。</p>
        <p>販売者は、購入者の特定の目的への適合、外部サービスの継続・仕様・料金、動作確認の対象外の環境での動作、AI ツールの出力、将来の更新の提供について、保証するものではありません。</p>
      </LegalSection>

      <LegalSection title="第8条（責任）">
        <p>本商品に関して購入者に損害が生じた場合の販売者の責任は、法令の定めるところによります。</p>
      </LegalSection>

      <LegalSection title="第9条（禁止事項）">
        <UL
          items={[
            "第2部（使用許諾条件）に反する行為（再配布・再販売・公開リポジトリへの掲載・制作代行への使用など）",
            "販売者または第三者の権利を侵害する行為",
            "不正な決済、事実と異なる返金の請求",
          ]}
        />
      </LegalSection>

      <LegalSection title="第10条（個人情報）">
        <p>販売者は、購入・引渡し・サポートのために、氏名・メールアドレス・購入の記録・ダウンロードの記録（日時と回数）・お問い合わせの内容を取得し、本商品の引渡し、サポート、返金、法令に基づく記録の保存のために利用します。</p>
        <p>カード番号などの決済の情報は、決済代行会社（Stripe）が取り扱い、販売者は保持しません。決済、引渡しのためのメール送信とファイルの保存のために、必要な範囲で外部の事業者に取り扱いを委託します。</p>
        <p>
          そのほかの取り扱いと、開示などのご請求の窓口は、
          <a href="/privacy" className="underline underline-offset-2">ToolBoxJP のプライバシーポリシー</a>
          によります。
        </p>
      </LegalSection>

      <LegalSection title="第11条（規約の変更）">
        <p>販売者は、法令に従い、この規約を変更できます。変更後の規約は、このページに掲載した時点から適用します。ただし、変更前に購入された方の購入時の条件（価格・ライセンス・返金・サポートの期間）を、購入者に不利に変更することはありません。</p>
      </LegalSection>

      <LegalSection title="第12条（準拠法）">
        <p>この規約は、日本法に準拠します。</p>
      </LegalSection>

      <h2 className="text-xl font-bold text-slate-900 pt-4">第2部 使用許諾条件（Standard License）</h2>

      <LegalSection title="第1条（使用許諾）">
        <p>販売者は購入者に対し、この条件に従って、本商品を使用・複製・改変する、非独占的で譲渡できない権利を許諾します。</p>
        <p>{TEXT.license}</p>
        <p>本番環境で公開するプロジェクト（Production Project）とは、一般の利用者が使えるように公開して運用する1つのコミュニティ（1つの Supabase プロジェクトと1つの公開先の組み合わせ）をいいます。2つ以上の Production Project で使う場合は、その数だけ購入が必要です。購入者が法人の場合は、その法人の役員・従業員が、その法人の Production Project のために使用できます。</p>
      </LegalSection>

      <LegalSection title="第2条（できること）">
        <UL
          items={[
            "改変（設定・文章・ロゴの変更、Extension の追加、Core の改変を含みます）",
            "Claude Code などの AI ツールへの読み込み（AI ツールの提供者の規約の範囲内で）",
            "バックアップのための複製",
            "非公開（Private）の Git リポジトリでの管理",
            "自社の Production Project のために業務委託した外部の開発者への、必要な範囲での共有（委託先もこの条件に従うものとし、購入者が委託先の行為に責任を負います）",
          ]}
        />
      </LegalSection>

      <LegalSection title="第3条（禁止事項）">
        <UL
          items={[
            "本商品（改変したものを含みます）の再配布・再販売・譲渡・貸与",
            "公開（Public）の Git リポジトリなど、誰でも見られる場所への掲載",
            "本商品を素材にしたテンプレート・スターターキット・類似商品の作成と、その第三者への販売・配布",
            "第三者のための制作代行への使用（代理店向けのライセンスは Standard に含まれません）",
            "著作権表示・ライセンスの文書の削除（構築したサイトの画面上の表示は除きます）",
            "法令や公序良俗に反するサービスの運営",
          ]}
        />
      </LegalSection>

      <LegalSection title="第4条（権利）">
        <p>購入者が作成した文章・画像・設定と、構築したサイトに投稿されたデータの権利は、購入者または投稿者に帰属します。本商品自体の著作権は、販売者に帰属します。</p>
        <p>本商品が利用するオープンソースのソフトウェアには、それぞれのライセンス（MIT・Apache-2.0 など）が適用されます。一覧は本商品に同梱の <code>THIRD_PARTY_LICENSES.md</code> にあります。</p>
      </LegalSection>

      <LegalSection title="第5条（違反した場合）">
        <p>購入者がこの条件に違反した場合、販売者は使用許諾を解除できます。</p>
      </LegalSection>
    </LegalShell>
  );
}
