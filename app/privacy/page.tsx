import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";

export const metadata: Metadata = generateMeta({
  title: "プライバシーポリシー",
  description: "ToolBoxのプライバシーポリシー。個人情報の取り扱い、Cookie・Google Analytics・Google AdSenseの利用について説明します。",
  path: "/privacy",
});

// ★DRAFT（2026-09-30）: SNS Starter Kit 先行予約フォームの追加に合わせた改訂案。
//   CEO / Legal の承認前。承認時に「最終更新日」と【要決定】の箇所を確定させること。
//   根拠: lib/sns-starter-kit/reservation.ts（取得項目）・lib/analytics/sns-starter-kit.ts（計測項目）
const PENDING = "text-amber-700 dark:text-amber-400 font-semibold";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">最終更新日：2026年6月14日</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">1. 基本方針</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ToolBox（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。当サイトの無料ツールはすべてブラウザ内で処理が完結しており、ツールにアップロードしたファイルや入力データはサーバーに送信されません。ただし、お問い合わせフォームや商品の先行予約フォームなど、ご本人が入力して送信するフォームの内容は、第3項に定めるとおり取得します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">2. 収集する情報</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              当サイトでは、以下の情報を自動的に収集することがあります。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
              <li>アクセスログ（IPアドレス、ブラウザの種類、参照元URL、アクセス日時）</li>
              <li>Cookie情報（アクセス解析・広告配信のため）</li>
              <li>ページ閲覧履歴・操作ログ（Google Analytics経由）</li>
            </ul>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
              無料ツールのご利用にあたって、氏名・メールアドレス・住所などの個人を特定できる情報を取得することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. フォームから送信いただく情報</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              ご本人が次のフォームに入力して送信した場合に限り、その内容を取得します。
            </p>

            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mt-4 mb-2">（1）SNS Starter Kit の先行予約</h3>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">取得する情報：</p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400 mb-3">
              <li>メールアドレス</li>
              <li>AIを使ったWeb開発の経験（選択式）、作りたいコミュニティの説明（自由記述）、30日以内に使い始める予定（選択式）</li>
              <li>販売開始のご案内の受け取りへの同意、その他のお知らせの受け取りへの同意（任意）と、同意時の文言の版</li>
              <li>流入元（参照元の分類と、URLに含まれる utm_source / utm_medium / utm_campaign の値）</li>
              <li>登録日時と、ご案内の状況（予約済み・案内済みなど）</li>
            </ul>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">利用目的：</p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400 mb-3">
              <li>SNS Starter Kit の販売開始時に、商品内容と購入方法をメールでご案内するため（先行予約の成立に必要な同意です）</li>
              <li>「その他のお知らせ」の受け取りに同意いただいた方にのみ、ToolBoxJP の他の商品やお知らせをメールでご案内するため（任意。同意しなくても先行予約はできます）</li>
              <li>商品の内容や案内の改善の参考とするため（個人を特定しない形で集計します）</li>
              <li>どの経路から先行予約があったかを把握するため</li>
            </ul>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              先行予約は購入ではなく、予約金や購入の義務はありません。先行予約フォームに入力されたメールアドレスや自由記述の内容は、Google Analytics などのアクセス解析には送信しません。
            </p>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              保存と管理：取得した情報は、当サイトが利用する外部のデータベースサービス
              <span className={PENDING}>【要決定：サービス名（例：Supabase）とデータの保存地域】</span>
              に保存し、閲覧できる者を運営者に限定します。保存期間は
              <span className={PENDING}>【要決定：例「販売開始のご案内の完了後◯か月」】</span>
              とし、期間の経過後またはご本人からの削除のご依頼があった場合は速やかに削除します。
            </p>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              メールの受信停止・登録内容の削除：
              <span className={PENDING}>【要決定：受付方法（例：お問い合わせフォーム、または案内メールに記載する連絡先）】</span>
              からご連絡ください。
            </p>

            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mt-6 mb-2">（2）お問い合わせフォーム</h3>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              お名前、メールアドレス、お問い合わせの種類と内容を取得し、お問い合わせへの回答のためにのみ利用します。送信内容は Google フォーム（Google LLC）を通じて受け付けます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. Google Analytics</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトはアクセス解析にGoogle Analytics（Google LLC）を使用しています。Google AnalyticsはCookieを使用してアクセス情報を収集しますが、個人を特定する情報は含まれません。フォームに入力されたメールアドレスや自由記述の内容を Google Analytics に送信することはありません（先行予約ページでは、ページの閲覧・ボタンの操作・フォームの送信完了といった操作の記録と、流入元の分類だけを送信します）。収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。Googleのデータ収集・利用を無効にしたい場合は、Google Analytics オプトアウトアドオンをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">5. Google AdSenseと第三者配信事業者</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              当サイトは、第三者配信の広告サービスとしてGoogle AdSense（Google LLC）を利用しています。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400 mb-3">
              <li>Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーの過去のアクセス情報に基づいて広告を配信します。</li>
              <li>これにより、ユーザーの興味・関心に応じた広告（パーソナライズ広告）が表示される場合があります。</li>
              <li>当サイトが取得するのは匿名のアクセス情報であり、氏名・住所などの個人を特定する情報は取得しません。</li>
            </ul>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              パーソナライズ広告は、次の方法で無効化（オプトアウト）できます。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
              <li>
                Googleの
                <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">広告設定（My Ad Center）でパーソナライズを管理する</a>
              </li>
              <li>
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">aboutads.info で参加事業者の広告をまとめてオプトアウトする</a>
              </li>
              <li>
                第三者配信事業者によるCookie利用の詳細は
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">Googleの「ユーザーがGoogleパートナーのサイトやアプリを使用する際のデータ処理」を確認する</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">6. Cookieと同意管理</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Cookieとは、ウェブサイトがブラウザに保存する小さなデータファイルです。当サイトでは目的別に次のCookieを使用します。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400 mb-3">
              <li><strong>必須Cookie</strong>：テーマ（ダークモード）設定など、サイトの基本動作に必要なもの。</li>
              <li><strong>アクセス解析Cookie</strong>：Google Analyticsによる利用状況の把握。</li>
              <li><strong>広告Cookie</strong>：Google AdSenseによる広告配信・効果測定。</li>
            </ul>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              欧州経済領域（EEA）・英国・スイスなどからのアクセスについては、Google認定の同意管理ツール（CMP）を通じて、広告・解析Cookieの利用可否を選択いただけるよう対応します。いずれの地域でも、ブラウザの設定からCookieを無効化できますが、その場合は一部機能が正常に動作しないことがあります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7. ファイルのプライバシー</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトの画像変換・PDF処理などのツールはすべてブラウザ内で処理が完結します。アップロードされたファイルは外部サーバーに送信されることなく、処理後はブラウザのメモリから削除されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">8. 第三者への情報提供</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトは、法令に基づく場合を除き、収集した情報を第三者に提供することはありません。なお、サイトの運営やフォーム内容の保存のために、ホスティング（Vercel Inc.）やデータベースなどの外部サービスを利用しており、これらのサービス上で情報が保管・処理されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">9. プライバシーポリシーの変更</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本ポリシーは必要に応じて変更することがあります。変更後のポリシーはこのページに掲載し、掲載をもって効力が生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">10. お問い合わせ</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本ポリシーに関するご質問、および保有する個人情報の開示・訂正・利用停止・削除のご請求は、サイト内のお問い合わせフォームよりご連絡ください。
              <span className={PENDING}>【要決定（Legal）：個人情報取扱事業者としての名称・住所・代表者、開示等の請求手続の記載要否】</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
