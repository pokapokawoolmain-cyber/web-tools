import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = generateMeta({
  title: "ToolBoxについて｜運営者情報・サイトの目的",
  description: "ToolBoxの運営者情報、サイト立ち上げの経緯、提供するサービスの目的と価値観をご紹介します。",
  path: "/about",
});

const siteUrl = getSiteUrl();

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolBox",
  "url": siteUrl,
  "description": "登録不要・ブラウザ完結の無料Webツール集",
  "inLanguage": "ja",
  "publisher": {
    "@type": "Person",
    "name": "ToolBox運営",
    "url": `${siteUrl}/about`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ToolBox", "item": siteUrl },
    { "@type": "ListItem", "position": 2, "name": "ToolBoxについて", "item": `${siteUrl}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[organizationSchema, breadcrumbSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <nav aria-label="パンくずリスト" className="mb-4 text-sm text-slate-500">
              <ol className="flex items-center gap-1">
                <li><Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">ToolBox</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 dark:text-slate-300">ToolBoxについて</li>
              </ol>
            </nav>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">🧰</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  ToolBoxについて
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  運営者情報・サイトの目的・提供価値
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 本文 */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

          {/* ───── はじめに ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              ToolBoxとは
            </h2>
            <div className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                ToolBoxは、「<strong className="text-slate-800 dark:text-zinc-200">すぐ使える、迷わない、ブラウザだけで完結する</strong>」をコンセプトに作られた、無料Webツール集です。
              </p>
              <p>
                FIRE（経済的自立）シミュレーター・NISA積立計算・PDF結合・画像圧縮・カラーコード変換など、日常生活や仕事で「ちょっと使いたい」場面に応えるツールを揃えています。
                現在<strong className="text-slate-800 dark:text-zinc-200">58種類以上</strong>のツールが無料で利用でき、すべてアカウント登録不要・スマートフォン対応です。
              </p>
              <p>
                また、各ツールに関連した解説ブログ記事を合わせて提供することで、「ツールで計算するだけでなく、背景知識も身につく」体験を目指しています。
              </p>
            </div>
          </section>

          {/* ───── 立ち上げの経緯 ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              ToolBoxを立ち上げた経緯
            </h2>
            <div className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                最初に作ったのは<strong className="text-slate-700 dark:text-zinc-300">ガソリン代計算ツール</strong>でした。
                会社に毎月通勤費の実費申請をしていたのですが、「往復○km × 燃費 × ガソリン単価」を毎回Excelで計算するのが地味に面倒で。
                「ブラウザで開いて3項目入れたら終わり」というものを作ったのが始まりです。
              </p>
              <p>
                次に困ったのがPDF結合でした。取引先に送る書類が「見積書.pdf」「仕様書.pdf」「会社概要.pdf」と3つに分かれてしまい、
                一つにまとめたかった。オンラインツールを探したところ、大半がファイルをサーバーにアップロードするタイプで、
                社内文書を外部に送るのはさすがに気が引けました。
                それで「ブラウザ内で完結するPDF結合ツール」も自分で作ることにしました。
              </p>
              <p>
                こうして「自分が欲しいと思ったものを作る」を繰り返していたら、気づけばFIREシミュレーターや画像圧縮、カラーコード変換まで58種類を超えていました。
                全部、自分が実際に「あれ、これどこかでサっと計算したい」と感じた瞬間がきっかけです。
              </p>

              {/* 実測データ */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 text-[13px] space-y-2 mt-2">
                <p className="font-semibold text-blue-800 dark:text-blue-300">実際に試してみた結果（一例）</p>
                <ul className="space-y-1 text-blue-700 dark:text-blue-400">
                  <li>・iPhone 15 Proで撮影した5分の4K動画（1.1GB）→ 動画圧縮ツールで44MBに圧縮、LINEで送信できた</li>
                  <li>・20ページのPDFを3ファイル → PDF結合で1ファイルに、処理時間は約3秒</li>
                  <li>・年収500万・積立投資シミュレーション → FIRE達成に必要な額を5秒で試算</li>
                  <li>・デザイン作業中に「このグレー、コントラスト足りてる？」→ コントラストチェッカーで即確認</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ───── 3つの価値観 ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              ToolBoxが大切にしていること
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚡",
                  title: "すぐ使える",
                  body: "会員登録・アプリインストール・クレジットカード情報の入力は一切不要。URLを開けばすぐ使えます。",
                },
                {
                  icon: "🔒",
                  title: "安全・安心",
                  body: "PDFや画像ファイルはサーバーに送信されません。すべての処理はブラウザ内で完結。機密書類も安心して使えます。",
                },
                {
                  icon: "📱",
                  title: "どこでも使える",
                  body: "iPhone・Android・PC・Macを問わず、モダンブラウザがあればすべてのツールを快適に利用できます。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-700"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-2">{item.title}</h3>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ───── 提供ツール一覧 ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              提供しているカテゴリ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
              {[
                { emoji: "💰", cat: "お金・投資ツール", desc: "FIREシミュレーター・NISA積立・住宅ローン計算など" },
                { emoji: "📄", cat: "PDFツール", desc: "結合・分割・圧縮・圧縮・パスワード設定など11種類" },
                { emoji: "🖼️", cat: "画像ツール", desc: "圧縮・HEIC変換・リサイズ・証明写真作成など" },
                { emoji: "🎨", cat: "カラーツール", desc: "HEX/RGB/HSL変換・パレット生成・グラデーション作成など" },
                { emoji: "📝", cat: "ビジネス書類", desc: "業務委託契約書・NDA・請求書・見積書・退職届など" },
                { emoji: "🤖", cat: "AI文章ツール", desc: "ChatGPT整形・AI文章自然化・X投稿プレビューなど" },
                { emoji: "🎌", cat: "冠婚葬祭・文書", desc: "のし紙・香典袋・祝儀袋の表書き作成など" },
                { emoji: "🧮", cat: "計算ツール", desc: "GPA計算・ガソリン代・シフト給与計算など" },
              ].map((item) => (
                <div key={item.cat} className="flex items-start gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl px-4 py-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-zinc-300">{item.cat}</p>
                    <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ───── 更新方針 ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              コンテンツの更新方針
            </h2>
            <div className="space-y-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                ToolBoxは定期的に新しいツールの追加と既存ツールの機能改善を行っています。
                新ツールの追加情報や機能改善の履歴は<Link href="/updates" className="text-blue-600 dark:text-blue-400 hover:underline">更新履歴ページ</Link>でご確認いただけます。
              </p>
              <p>
                ブログ記事についても、税制改正・法律変更・最新データへの対応など、情報の正確性を保つために定期的な見直しを実施しています。
                記事には最終更新日を明記しており、古い情報を参照することがないよう配慮しています。
              </p>
              <p>
                税金・投資・法律に関する計算ツール・記事は、公式情報（国税庁・金融庁・各省庁の発表）をもとに作成していますが、
                個別の状況によって結果が異なる場合があります。重要な判断は専門家にご相談ください。
              </p>
            </div>
          </section>

          {/* ───── 免責事項 ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              免責事項・注意事項
            </h2>
            <div className="space-y-3 text-[14px] text-slate-500 dark:text-zinc-500 leading-relaxed bg-slate-50 dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-700">
              <p>
                • 本サイトの計算ツールの結果はあくまで参考値です。税務・法務・投資に関する最終判断は、税理士・弁護士・ファイナンシャルプランナー等の専門家にご相談ください。
              </p>
              <p>
                • 本サイトの情報・ツールをご利用になったことで生じたいかなる損害についても、運営者は責任を負いかねます。
              </p>
              <p>
                • 法制度・税制の変更等により、一部の情報が最新でない場合があります。重要事項は必ず公式サイトや一次情報源でご確認ください。
              </p>
              <p>
                • 本サイトはGoogle AdSenseによる広告収益により運営されています。広告の内容は運営者と無関係です。
              </p>
            </div>
          </section>

          {/* ───── 運営者・お問い合わせ ───── */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
              運営者情報・お問い合わせ
            </h2>
            <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 space-y-4">
              <dl className="space-y-3 text-[14px]">
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">サイト名</dt>
                  <dd className="text-slate-700 dark:text-zinc-300 font-medium">ToolBox（ツールボックス）</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">URL</dt>
                  <dd className="text-slate-700 dark:text-zinc-300 font-mono text-[13px]">https://www.toolboxjp.com</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">運営開始</dt>
                  <dd className="text-slate-700 dark:text-zinc-300">2024年秋</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">運営者</dt>
                  <dd className="text-slate-700 dark:text-zinc-300">ひゆ（個人運営）</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">運営形態</dt>
                  <dd className="text-slate-500 dark:text-zinc-400 text-[13px]">個人が趣味と実益を兼ねて開発・運営。広告収益で維持費をまかなっています。</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-slate-400 dark:text-zinc-500 w-24 flex-shrink-0">お問い合わせ</dt>
                  <dd>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors"
                    >
                      お問い合わせフォーム →
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* ───── リンク ───── */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Link href="/" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">← トップページへ</Link>
            <Link href="/updates" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">更新履歴</Link>
            <Link href="/privacy" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">プライバシーポリシー</Link>
            <Link href="/terms" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">利用規約</Link>
            <Link href="/contact" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">お問い合わせ</Link>
            <Link href="/about/reprint" className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline">転載・引用ガイドライン</Link>
          </div>
        </div>
      </div>
    </>
  );
}
