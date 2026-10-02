import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateMeta } from "@/lib/seo";

export const metadata: Metadata = generateMeta({
  title: "プライバシーポリシー",
  description:
    "ToolBoxJPのプライバシーポリシー。運営者、先行予約フォームで取得する情報と利用目的、保存期間、アクセス解析、開示等の請求窓口について説明します。",
  path: "/privacy",
});

// ============================================================
// プライバシーポリシー（CEO 確定文面 2026-10-02）
//
// ★本番公開時に必ず行うこと
//   1. LAST_UPDATED を本番公開日に置き換える（現在はプレースホルダー）
//   2. 下の「追加提案（AdSense / Cookie）」ブロックの扱いを CEO が決定し、
//      採用する場合は番号を振り直して正式な条文にする（PENDING 表示を外す）
//   3. 文面を変えた場合は lib/sns-starter-kit/reservation.ts の RESERVATION_CONSENT_VERSION を更新する
// ============================================================
const LAST_UPDATED = "［本番公開日］";
const CONTACT_EMAIL = "privacy@toolboxjp.com";
const PENDING =
  "rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10 p-4 sm:p-5";

const P = ({ children }: { children: ReactNode }) => (
  <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>
);

const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);

const Mail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 hover:underline">
    {CONTACT_EMAIL}
  </a>
);

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">
    {children}
  </a>
);

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">最終更新日：{LAST_UPDATED}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <P>
            ToolBoxJP（以下「当サイト」といいます。）は、当サイトをご利用いただく方の個人情報その他の情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
          </P>

          <Section n={1} title="運営者">
            <UL items={["運営者：𠮷田 貴由", "屋号：akamaru Corp."]} />
            <P>当サイトは個人事業として運営しています。</P>
            <P>
              所在地については、個人情報保護法その他の法令に基づき、ご本人から開示の求めがあった場合、必要な本人確認を行ったうえで遅滞なく回答します。
            </P>
            <P>
              個人情報に関するお問い合わせ先：
              <Mail />
            </P>
          </Section>

          <Section n={2} title="無料ツールの利用について">
            <P>
              ToolBoxJPで提供する無料ツールのうち、ブラウザ内で処理が完結するものについては、入力したファイルや入力内容を当サイトのサーバーへ送信しない設計を基本としています。
            </P>
            <P>ただし、各ツールの機能上、外部サーバーとの通信が必要となる場合は、そのツール上で必要な情報を表示します。</P>
            <P>
              また、お問い合わせフォーム、先行予約フォームその他、ご本人が情報を送信するフォームについては、本ポリシーに記載する目的のため、送信された情報を取得します。
            </P>
          </Section>

          <Section n={3} title="先行予約フォームで取得する情報">
            <P>SNS Starter Kitの先行予約では、次の情報を取得します。</P>
            <UL
              items={[
                "メールアドレス",
                "AIを利用したWeb開発経験等の選択内容",
                "作成したいコミュニティに関する記述",
                "利用予定時期に関する回答",
                "販売開始案内への同意",
                "その他のお知らせへの同意",
                "同意時に表示した文言の版",
                "流入元に関する情報（source、UTMパラメータ等）",
                "登録日時",
                "予約状態",
                "受信停止に関する記録",
              ]}
            />
          </Section>

          <Section n={4} title="取得した情報の利用目的">
            <P>取得した情報は、次の目的で利用します。</P>
            <UL
              items={[
                "SNS Starter Kitの先行予約を管理するため",
                "重複登録を防止するため",
                "SNS Starter Kitの販売開始、提供内容および購入方法をご案内するため",
                "商品の内容、導入方法および提供方法を改善するため",
                "流入経路や利用状況を個人を特定しない形で分析するため",
                "ご本人からのお問い合わせ、開示、訂正、削除、利用停止等へ対応するため",
                "任意の同意をいただいた場合に限り、ToolBoxJPの商品、サービスその他のお知らせをご案内するため",
              ]}
            />
            <P>販売開始案内への同意と、その他のマーケティング目的のお知らせへの同意は分けて取得します。</P>
            <P>その他のお知らせへの同意は任意であり、同意しなくてもSNS Starter Kitの先行予約を行うことができます。</P>
          </Section>

          <Section n={5} title="先行予約について">
            <P>
              SNS Starter Kitの先行予約は、商品の購入、売買契約の成立、予約金または前金の支払いを意味するものではありません。
            </P>
            <P>先行予約時点では代金を受領せず、販売条件が確定した後、販売開始の案内をお送りします。</P>
            <P>
              販売開始後に購入を希望される場合は、その時点で提示する販売条件をご確認いただいたうえで、別途購入手続を行っていただきます。
            </P>
          </Section>

          <Section n={6} title="情報の保存および外部サービスの利用">
            <P>SNS Starter Kitの先行予約情報は、当サイトが利用するデータベースサービスであるSupabaseに保存します。</P>
            <P>現在、予約情報は日本国内の東京リージョンに保存する構成としています。</P>
            <P>
              また、当サイトはWebサイトの提供、フォームの処理、データの保存、アクセス解析等のため、Vercel、Supabase、Googleその他の外部サービスを利用する場合があります。
            </P>
            <P>
              これらの外部サービスを利用する場合は、利用目的の達成に必要な範囲で情報を取り扱い、各サービスの契約、設定および適用法令に基づき適切な管理に努めます。
            </P>
          </Section>

          <Section n={7} title="保存期間">
            <P>SNS Starter Kitの先行予約情報は、販売開始の案内が完了した後6か月を基本的な保存期間とします。</P>
            <P>保存する必要がなくなった情報については、法令上保存が必要な場合を除き、削除または適切な方法で処理します。</P>
            <P>
              ご本人から削除または利用停止の依頼があった場合は、法令その他の正当な理由により保存が必要な場合を除き、内容を確認のうえ対応します。
            </P>
            <P>
              商品購入後に必要となる注文、決済、会計その他の記録については、先行予約情報とは分けて管理し、それぞれ適用される法令および保存目的に従って取り扱います。
            </P>
          </Section>

          <Section n={8} title="アクセス解析">
            <P>当サイトでは、Google Analytics、Vercel Analyticsその他のアクセス解析サービスを利用する場合があります。</P>
            <P>アクセス解析では、ページの閲覧、操作、利用端末、流入元等に関する情報を取得する場合があります。</P>
            <P>
              SNS Starter Kitの予約フォームへ入力したメールアドレスやコミュニティに関する自由記述内容を、アクセス解析サービスのイベント情報として送信しません。
            </P>
            <P>アクセス解析サービスによる情報の取扱いについては、それぞれのサービス提供者の定めるポリシーが適用される場合があります。</P>
          </Section>

          {/* ★追加提案（CEO承認待ち）: 現行ポリシーにあった広告配信・Cookie の記載。
                本番では Google AdSense が有効なため、AdSense のプログラムポリシー上、
                第三者 Cookie の利用とオプトアウト方法の開示が必要。採用時は番号を振り直す。 */}
          <section className={PENDING}>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3">
              【追加提案（CEO承認待ち）】現行ポリシーの広告配信・Cookieに関する記載
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">広告配信（Google AdSense）</h2>
            <div className="space-y-3">
              <P>当サイトは、第三者配信の広告サービスとしてGoogle AdSense（Google LLC）を利用しています。</P>
              <UL
                items={[
                  "Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーの過去のアクセス情報に基づいて広告を配信します。",
                  "これにより、ユーザーの興味・関心に応じた広告（パーソナライズ広告）が表示される場合があります。",
                ]}
              />
              <P>パーソナライズ広告は、次の方法で無効化（オプトアウト）できます。</P>
              <UL
                items={[
                  <>
                    Googleの<ExtLink href="https://myadcenter.google.com/">広告設定（My Ad Center）</ExtLink>
                    でパーソナライズを管理する
                  </>,
                  <>
                    <ExtLink href="https://www.aboutads.info/choices/">aboutads.info</ExtLink>
                    で参加事業者の広告をまとめてオプトアウトする
                  </>,
                  <>
                    第三者配信事業者によるCookie利用の詳細は
                    <ExtLink href="https://policies.google.com/technologies/partner-sites">
                      Googleの「ユーザーがGoogleパートナーのサイトやアプリを使用する際のデータ処理」
                    </ExtLink>
                    を確認する
                  </>,
                ]}
              />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">Cookieと同意管理</h2>
            <div className="space-y-3">
              <P>当サイトでは目的別に次のCookieを使用します。</P>
              <UL
                items={[
                  "必須Cookie：テーマ（ダークモード）設定など、サイトの基本動作に必要なもの。",
                  "アクセス解析Cookie：Google Analyticsによる利用状況の把握。",
                  "広告Cookie：Google AdSenseによる広告配信・効果測定。",
                ]}
              />
              <P>
                欧州経済領域（EEA）・英国・スイスなどからのアクセスについては、Google認定の同意管理ツール（CMP）を通じて、広告・解析Cookieの利用可否を選択いただけるよう対応します。いずれの地域でも、ブラウザの設定からCookieを無効化できますが、その場合は一部機能が正常に動作しないことがあります。
              </P>
            </div>
          </section>

          <Section n={9} title="第三者への提供">
            <P>当サイトは、法令に基づく場合その他法令上認められる場合を除き、ご本人の同意なく個人データを第三者へ提供しません。</P>
            <P>
              ただし、サイト運営、データ保存、メール送信その他の業務を行うため、必要な範囲で外部サービス事業者へ個人情報の取扱いを委託する場合があります。
            </P>
          </Section>

          <Section n={10} title="安全管理">
            <P>
              当サイトは、取得した情報について、不正アクセス、漏えい、滅失または毀損等を防止するため、必要かつ適切な安全管理措置を講じるよう努めます。
            </P>
            <P>SNS Starter Kitの先行予約データについては、ブラウザからデータベースへ直接アクセスさせず、サーバー側の処理を通じて保存します。</P>
            <P>また、データベースへの一般利用者からの直接的な読み取り、追加、変更および削除を制限する構成としています。</P>
          </Section>

          <Section n={11} title="販売開始案内およびその他のメール">
            <P>販売開始案内は、先行予約時に明示的に同意いただいたメールアドレスへ送信します。</P>
            <P>その他の商品・サービス等に関するお知らせは、別途任意の同意をいただいた場合に限り送信します。</P>
            <P>メールの受信停止を希望される場合は、メール本文に記載する方法または以下の窓口からお申し出いただけます。</P>
            <P>
              <Mail />
            </P>
            <P>受信停止の意思を確認した後は、法令上認められる場合を除き、その意思に反して対象となる案内を送信しません。</P>
          </Section>

          <Section n={12} title="開示、訂正、削除、利用停止等の請求">
            <P>
              当サイトが保有するご本人の個人データについて、利用目的の通知、開示、訂正、追加、削除、利用停止、消去その他法令に基づく請求を希望される場合は、以下の窓口までご連絡ください。
            </P>
            <P>
              <Mail />
            </P>
            <P>ご連絡の際は、次の事項をお知らせください。</P>
            <UL items={["ご希望の手続内容", "先行予約等で使用したメールアドレス", "本人確認に必要な情報"]} />
            <P>原則として、登録に使用したメールアドレスからのご連絡等により本人確認を行います。</P>
            <P>必要以上の本人確認資料を求めることはせず、請求内容に応じて合理的な方法で本人確認を行います。</P>
            <P>本人確認後、法令に従い遅滞なく対応します。</P>
            <P>これらの手続に関する手数料は原則としていただきません。</P>
          </Section>

          <Section n={13} title="住所に関するお問い合わせ">
            <P>
              当サイト運営者の住所について、個人情報保護法その他の法令に基づきご本人から開示の求めがあった場合は、以下の窓口へご連絡ください。
            </P>
            <P>
              <Mail />
            </P>
            <P>必要な本人確認を行ったうえで、法令に従い遅滞なく回答します。</P>
          </Section>

          <Section n={14} title="プライバシーポリシーの変更">
            <P>当サイトは、法令の改正、サービス内容の変更その他必要に応じて、本ポリシーを変更することがあります。</P>
            <P>重要な変更を行う場合は、当サイト上での掲載その他適切な方法によりお知らせします。</P>
            <P>変更後のプライバシーポリシーは、当サイト上に掲載した時点から適用します。</P>
          </Section>

          <Section n={15} title="お問い合わせ">
            <P>本ポリシーおよび当サイトにおける個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。</P>
            <UL
              items={[
                "ToolBoxJP",
                "運営者：𠮷田 貴由",
                "屋号：akamaru Corp.",
                <>
                  メール：
                  <Mail />
                </>,
              ]}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
