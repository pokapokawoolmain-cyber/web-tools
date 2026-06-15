import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";

export const metadata: Metadata = generateMeta({
  title: "プライバシーポリシー",
  description: "ToolBoxのプライバシーポリシー。個人情報の取り扱い、Cookie・Google Analytics・Google AdSenseの利用について説明します。",
  path: "/privacy",
});

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
              ToolBox（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。当サイトのツールはすべてブラウザ内で処理が完結しており、ユーザーがアップロードしたファイルや入力データはサーバーに送信されません。
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
              氏名・メールアドレス・住所などの個人を特定できる情報は収集していません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. Google Analytics</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトはアクセス解析にGoogle Analytics（Google LLC）を使用しています。Google AnalyticsはCookieを使用してアクセス情報を収集しますが、個人を特定する情報は含まれません。収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。Googleのデータ収集・利用を無効にしたい場合は、Google Analytics オプトアウトアドオンをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. Google AdSenseと第三者配信事業者</h2>
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">5. Cookieと同意管理</h2>
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">6. ファイルのプライバシー</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトの画像変換・PDF処理などのツールはすべてブラウザ内で処理が完結します。アップロードされたファイルは外部サーバーに送信されることなく、処理後はブラウザのメモリから削除されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7. 第三者への情報提供</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトは、法令に基づく場合を除き、収集した情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">8. プライバシーポリシーの変更</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本ポリシーは必要に応じて変更することがあります。変更後のポリシーはこのページに掲載し、掲載をもって効力が生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">9. お問い合わせ</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本ポリシーに関するご質問は、サイト内のお問い合わせフォームよりご連絡ください。
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
