// ============================================================
// Mochico 利用規約（ToolBoxJP 利用規約の補足）
//   実装済みの仕様だけを書く。法的な保証・断定は書かない。
//   文面の変更は CEO 確認のうえで行うこと。
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, P, Section, UL, linkClass } from "@/components/mochico/legal/LegalPage";

const UPDATED = "2026年10月4日";

export const metadata: Metadata = {
  title: { absolute: "Mochico 利用規約｜ToolBoxJP" },
  description: "推しグッズ管理アプリ Mochico（モチコ）の利用規約です。",
  alternates: { canonical: "https://www.toolboxjp.com/mochico/terms" },
};

export default function MochicoTermsPage() {
  return (
    <LegalPage title="Mochico 利用規約" updated={UPDATED}>
      <P>
        本規約は、ToolBoxJP（以下「当サイト」）が提供する推しグッズ管理アプリ「Mochico（モチコ）」（以下「本サービス」）の利用条件を定めるものです。本規約に定めのない事項は、
        <Link href="/terms" className={linkClass}>
          ToolBoxJP 利用規約
        </Link>
        が適用されます。本サービスを利用した時点で、本規約に同意いただいたものとみなします。
      </P>

      <Section n={1} title="アカウント">
        <UL
          items={[
            "メールアドレスに届くログインコードでログインします。ご自身が受信できるメールアドレスを使ってください。",
            "ログインコードや、ログイン中の端末を第三者に使わせないでください。",
          ]}
        />
      </Section>

      <Section n={2} title="登録する内容と画像">
        <UL
          items={[
            "登録する内容・画像は、ご本人が登録する権利を持つものに限ります。",
            "他人の権利（著作権・肖像権など）を侵害するもの、法令や公序良俗に反するものは登録・共有しないでください。",
            "登録内容の権利はご本人に帰属します。当サイトは本サービスの提供に必要な範囲でのみ取り扱います。",
          ]}
        />
      </Section>

      <Section n={3} title="共有">
        <UL
          items={[
            "共有リンクを知っている人は、そのリストを閲覧し、自分の管理に追加できます。共有する相手と範囲はご自身で判断してください。",
            "共有されたリストのグッズを追加・修正できるのはリストの作成者だけです。参加者は自分の取得状況だけを記録できます。",
            "作成者は共有をいつでも停止できます。停止後も、すでに参加している人は引き続き利用できます。",
          ]}
        />
      </Section>

      <Section n={4} title="退会">
        <P>
          設定画面から退会できます。退会時の情報の取扱いは
          <Link href="/mochico/privacy" className={linkClass}>
            Mochico プライバシーポリシー
          </Link>
          のとおりです。ほかの参加者がいるリストは、作成者の情報を切り離したうえで参加者向けに残り、以後は編集・共有できなくなります。
        </P>
      </Section>

      <Section n={5} title="禁止事項">
        <UL
          items={[
            "本サービスや他の利用者への不正アクセス、過度な負荷をかける行為",
            "他人になりすます行為、他人のメールアドレスを無断で使う行為",
            "本サービスを通じた営利目的の宣伝・勧誘",
            "その他、当サイトが不適切と判断する行為",
          ]}
        />
      </Section>

      <Section n={6} title="サービスの変更・停止">
        <P>
          当サイトは、本サービスの内容を変更し、または提供を停止・終了することがあります。終了する場合は、可能な範囲で事前に本サービス上でお知らせします。
        </P>
        <P>
          登録内容は通常の運用の中で保存していますが、端末の故障や通信障害、その他の事情により表示・利用できない場合があります。大切な情報は必要に応じてご自身でも控えてください。
        </P>
      </Section>

      <Section n={7} title="規約の変更">
        <P>本規約は必要に応じて変更することがあります。変更後の規約は本ページに掲載した時点から適用します。</P>
      </Section>
    </LegalPage>
  );
}
