import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS } from "@/data/blog-posts";
import { getSiteUrl } from "@/lib/utils";
import {
  COMMUNITY_EXAMPLES,
  CONFIRMED_ENVIRONMENT,
  FOUNDATION_FEATURES,
  NOT_INCLUDED,
  PRODUCT,
  SENSITIVE_AREAS,
} from "@/lib/sns-starter-kit/content";
import { TEXT } from "@/lib/sns-starter-kit/commerce";
import { SNS_KIT_GUIDE_CATEGORY } from "@/app/blog/_components/sns-kit/SnsKitArticle";
import s from "@/app/blog/_components/sns-kit/article.module.css";

// ============================================================
// SNS Starter Kit — 活用ガイド
//
// 販売ページ（/sns-starter-kit）の補足。ブログ記事と note の行き先になるページ。
// ・読み手は2種類: コミュニティを運営する方 / 自分のサービスを作る開発者
// ・商品について書いてよいことは lib/sns-starter-kit/content.ts と commerce.ts だけを根拠にする
//   （機能の一覧・動作環境・価格・ライセンスはそこから読み込み、このページで新しい約束をしない）
// ・外部サービスの料金は変わるため、時点を明記し、公式の料金ページを確かめるよう案内する
// ============================================================

const TITLE = "SNS Starter Kit 活用ガイド｜作れるSNSの例・導入の流れ・費用の目安・よくある質問 | ToolBoxJP";
const DESCRIPTION =
  "SNS Starter Kit で作れるコミュニティSNSの例、Claude Code での変え方、導入の流れ、外部サービスの費用の目安、向いている方・向いていない方、よくある質問をまとめました。コミュニティを運営する方と、自分のサービスを作る開発者の両方に向けたガイドです。";
const PATH = "/sns-starter-kit/guide";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `https://www.toolboxjp.com${PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ToolBoxJP",
    url: `https://www.toolboxjp.com${PATH}`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// 「AI に頼む例」は同梱の SAFE_CHANGE_GUIDE.md の標準の道（設定ファイルで変えられる範囲）から
const ASK_EXAMPLES: { want: string; ask: string }[] = [
  { want: "名前とロゴ", ask: "名前を『週末ランナーズ』にして、ロゴを public/brand/logo.svg にしたい" },
  { want: "色と角の丸み", ask: "全体を落ち着いた緑にして、角を丸くしたい" },
  { want: "画面の言葉", ask: "『投稿』を『作品』、ボタンを『作品を投稿』にしたい" },
  { want: "カテゴリ", ask: "カテゴリを『大会・練習・ギア・質問』にしたい" },
  { want: "プロフィールの項目", ask: "プロフィールに『よく走る距離（km）』を足したい" },
  { want: "機能の ON / OFF", ask: "投稿に画像を付けられないようにしたい" },
  { want: "スパム対策", ask: "1時間に投稿できる数を10件にしたい" },
  { want: "ルールの文章", ask: "ルールに『売買の禁止』を加えたい" },
];

// 外部サービスの費用の目安（2026年11月時点。料金は変わるため公式の料金ページで確かめる）
const COST_ROWS: { name: string; role: string; start: string; when: string }[] = [
  {
    name: "Claude（Claude Code）",
    role: "AI に話して変える",
    start: "有料プラン（Pro は月20ドル〜）",
    when: "Claude Code は有料プランで使えます。使う量が多いと上位のプランが必要になることがあります",
  },
  {
    name: "Supabase",
    role: "データベース・ログイン・画像の保存",
    start: "無料プランから始められます",
    when: "無料プランは、1週間使われないと一時停止します。公開して運用するなら Pro（月25ドル〜）が安心です",
  },
  {
    name: "Vercel",
    role: "公開先（サイトを置く場所）",
    start: "無料の Hobby プランから試せます",
    when: "Hobby は個人の非商用の利用に限られます。会費を取るなど商用で使うなら Pro（1人あたり月20ドル〜）",
  },
  {
    name: "Resend など",
    role: "登録・パスワード再設定のメール",
    start: "Resend は無料で月3,000通（1日100通）まで",
    when: "登録が多い日に1日100通を超えそうなら有料プラン",
  },
  {
    name: "独自ドメイン",
    role: "例: example.jp",
    start: "年1,000〜3,000円程度（種類による）",
    when: "登録や再設定のメールの送信元に使うため、必要です（持っているドメインのサブドメインで構いません）",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "プログラミングが分からなくても使えますか？",
    a: "同梱の日本語の手順書（START_HERE.md・SETUP_GUIDE.md）に沿って、ターミナルにコマンドを貼り付けたり、Supabase や Vercel の画面で設定したりする作業があります。AI で Web アプリを作ったことがある方、またはその作業を手伝ってくれる方がいる場合を想定しています。初期設定が終わった後の変更は、Claude Code に話して進められます。",
  },
  {
    q: "Windows で使えますか？",
    a: `動作を確認しているのは ${CONFIRMED_ENVIRONMENT.map((e) => e.value).join("。")}。`,
  },
  {
    q: "月々の費用はかかりますか？",
    a: `商品は買い切り（${PRODUCT.launch ? `${PRODUCT.launch.label} ${PRODUCT.priceLabel}・税込。先着${PRODUCT.launch.limit}件まで、通常価格は${PRODUCT.launch.regularPriceLabel}` : `${PRODUCT.priceLabel}・税込`}）で、月額の利用料はありません。ただし Claude・Supabase・Vercel・メール送信サービス・ドメインなどの外部サービスの費用は、ご自身の契約で別途かかります（このページの「費用の目安」をご覧ください）。`,
  },
  {
    q: "いくつのSNSに使えますか？",
    a: TEXT.license,
  },
  {
    q: "お客さまから頼まれたSNSを作るのに使えますか？",
    a: "Standard のライセンスでは、第三者のための制作代行には使えません。ご自身（法人の場合はその法人）が運営するコミュニティのためにお使いください。",
  },
  {
    q: "アップデートはありますか？",
    a: TEXT.update,
  },
  {
    q: "サポートはありますか？",
    a: TEXT.support,
  },
  {
    q: "DM やプッシュ通知はありますか？",
    a: `初期版には含めていません。含めていないもの: ${NOT_INCLUDED.slice(0, 9).join("・")}。独自の機能は、同梱の Extension の仕組みで足せます（作るのはご自身です）。`,
  },
  {
    q: "返品・返金はできますか？",
    a: TEXT.refund,
  },
];

export default function SnsStarterKitGuidePage() {
  const siteUrl = getSiteUrl();
  const articles = BLOG_POSTS.filter((p) => p.category === SNS_KIT_GUIDE_CATEGORY);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ToolBox", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "SNS Starter Kit", item: `${siteUrl}${PRODUCT.path}` },
        { "@type": "ListItem", position: 3, name: "活用ガイド", item: `${siteUrl}${PATH}` },
      ],
    },
  ];

  return (
    <div className={s.page}>
      <JsonLd data={schemas} />

      <nav aria-label="パンくずリスト" className={s.crumbs}>
        <ol>
          <li>
            <Link href="/">ToolBox</Link>
          </li>
          <li>
            <Link href={PRODUCT.path}>SNS Starter Kit</Link>
          </li>
          <li aria-current="page">活用ガイド</li>
        </ol>
      </nav>

      <article>
        <header className={s.hero}>
          <div className={s.kicker}>
            <span className={s.category}>SNS Starter Kit</span>
            <span className={s.brand}>活用ガイド</span>
          </div>
          <h1 className={s.h1}>自分たちのSNSを、土台から作らずに始める</h1>
          <p className={s.lead}>
            SNS Starter Kit は、ログイン・投稿・通報・管理画面まで入った、コミュニティSNSの土台です。このページでは、どんなSNSが作れるか、Claude
            Code でどう変えていくか、何が必要で費用はどのくらいかを、購入前に確かめられるようにまとめました。
          </p>
        </header>

        <div className={s.paper}>
          <div className={s.body}>
            <div className={s.answer}>
              <p className={s.answerTitle}>このページで分かること</p>
              <ol>
                <li>作れるコミュニティの例と、Claude Code に頼める変更</li>
                <li>導入の流れと、事前に用意するもの</li>
                <li>外部サービスの費用の目安</li>
                <li>向いている方・向いていない方と、よくある質問</li>
              </ol>
            </div>

            <h2 id="who">どちらに近いですか？</h2>
            <div className={s.compare}>
              <div className={s.compareItem}>
                <h3>コミュニティを運営する方</h3>
                <p>
                  趣味の会・ファンの集まり・地域のサークルなどを、LINE のグループや Discord ではなく、自分たちの名前のSNSにしたい方。
                </p>
                <p>
                  <a href="#organizer">運営する方へ →</a>
                </p>
              </div>
              <div className={s.compareItem}>
                <h3>自分のサービスを作る開発者</h3>
                <p>
                  会員制のコミュニティを自分のサービスとして作りたいが、認証・権限・通報まわりを一から作るのは避けたい方。
                </p>
                <p>
                  <a href="#developer">開発者の方へ →</a>
                </p>
              </div>
            </div>

            <h2 id="examples">作れるコミュニティの例</h2>
            <p>
              同じ土台から、名前・色・カテゴリ・プロフィールの項目を変えて、コミュニティに合わせます。下はすべて架空の例です。
            </p>
            <div className={s.tableWrap} role="region" aria-label="コミュニティの例（横にスクロールできます）" tabIndex={0}>
              <table className={s.table}>
                <caption>コミュニティごとの設定の例</caption>
                <thead>
                  <tr>
                    <th scope="col">コミュニティ</th>
                    <th scope="col">プロフィールの項目</th>
                    <th scope="col">投稿のカテゴリ</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMUNITY_EXAMPLES.map((c) => (
                    <tr key={c.id}>
                      <th scope="row">{c.name}</th>
                      <td>{c.profileFields.join("・")}</td>
                      <td>{c.categories.join("・")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.tableNote}>
              車・写真・ファンクラブの3つは、設定の見本として商品に同梱しています（コマンド1つで当てはめられます）。
            </p>

            <h2 id="organizer">コミュニティを運営する方へ</h2>
            <h3>初期設定の後は、Claude Code に話して変える</h3>
            <p>
              同梱の開発ルール（CLAUDE.md・AGENTS.md）には、AI が変えてよい場所と、変えてはいけない場所が書いてあります。名前や色、カテゴリなどは「標準の道」として、設定ファイルを変えるだけで反映されます。たとえば次のように頼みます。
            </p>
            <div className={s.tableWrap} role="region" aria-label="Claude Code に頼む例（横にスクロールできます）" tabIndex={0}>
              <table className={s.table}>
                <caption>Claude Code に頼む例（同梱の SAFE_CHANGE_GUIDE.md より）</caption>
                <thead>
                  <tr>
                    <th scope="col">変えたいこと</th>
                    <th scope="col">頼み方の例</th>
                  </tr>
                </thead>
                <tbody>
                  {ASK_EXAMPLES.map((e) => (
                    <tr key={e.want}>
                      <th scope="row">{e.want}</th>
                      <td>「{e.ask}」</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              変えた後は <code>npm run verify</code> という確認のコマンドを動かします（2分ほど）。守る場所が変わっていないか、秘密の値が混ざっていないか、画面が動くかを自動で確かめ、問題があればどこが悪いかを表示します。
            </p>

            <h3>運営に必要な機能は、最初から入っています</h3>
            <ul className={s.checklist}>
              {FOUNDATION_FEATURES.filter((f) => f.status === "verified").map((f) => (
                <li key={f.id}>{f.label}</li>
              ))}
            </ul>
            <p>
              荒らしや迷惑な投稿への対応（通報・ブロック・管理画面での非表示）は、コミュニティを続けるうえで欠かせません。ここを後から作るのは手間がかかるため、土台に含めています。
            </p>

            <div className={s.caution}>
              <p className={s.cardLabel}>先に知っておいてほしいこと</p>
              <p>
                サービスは、ご自身の Supabase と Vercel のアカウントで公開・運用します。会員のデータを預かるのはご自身です。公開後のデータの管理や、利用者からの問い合わせへの対応も、ご自身（または手伝ってくれる方）が担います。
              </p>
            </div>

            <h2 id="developer">自分のサービスを作る開発者の方へ</h2>
            <p>
              Next.js（App Router）と Supabase（Auth・Postgres・Storage）で作った、会員制コミュニティのソースコード一式です。公開先は Vercel を想定しています。
            </p>
            <h3>守りが固い場所と、自由に足せる場所を分けています</h3>
            <p>
              認証や行ごとのアクセス制限（RLS）など、間違えると事故につながる場所は「守る場所」としてまとめ、変更を検出する仕組み（guard と Git の hook）を入れています。Claude Code が守る場所を書き換えようとすると、その時点で止まります。
            </p>
            <ul>
              <li>
                <strong>守る場所:</strong> {SENSITIVE_AREAS.join("・")}
              </li>
              <li>
                <strong>自由に足せる場所:</strong> 設定ファイル（名前・テーマ・カテゴリ・プロフィールの項目・機能の ON/OFF・投稿の上限）と、Extension（Core を書き換えずに画面・テーブル・通報の対象・通知を足す仕組み）
              </li>
              <li>
                <strong>独自のテーブル:</strong> 決まったひな形（<code>custom_</code> や <code>ext_&lt;id&gt;_</code> で始まる名前、RLS つき、取り消しの SQL つき）で足します。RLS を外す・未ログインの利用者に権限を与える・画像を公開にする、といった危険な書き方は guard が止めます
              </li>
            </ul>
            <h3>確かめるコマンドが同梱されています</h3>
            <ul>
              <li>
                <code>npm run verify</code>（2分ほど）: 守る場所・危険な書き方・秘密の値・設定・型・lint・ビルドと、アプリを起動して主な画面を操作する確認
              </li>
              <li>
                <code>npm run verify:full</code>（2〜3分）: 上に加えて、データベースの安全の仕組み（権限・ブロック・通報・上限・削除など）を実際のデータベースで試す確認
              </li>
            </ul>
            <div className={s.point}>
              <p className={s.cardLabel}>ライセンス</p>
              <p>
                {TEXT.license}自社のサービスとして運営するコミュニティのためにお使いください。
              </p>
            </div>

            <h2 id="flow">導入の流れ</h2>
            <ol className={s.steps}>
              <li>
                <span className={s.stepTitle}>購入して、ZIP を受け取る</span>
                決済のあと、ダウンロードの案内をメールでお送りします（24時間以内）。
              </li>
              <li>
                <span className={s.stepTitle}>START_HERE.md を読む</span>
                何を用意して、どの順で進めるかが書いてあります。
              </li>
              <li>
                <span className={s.stepTitle}>Supabase・Vercel・メール送信を用意する</span>
                ご自身のアカウントで作ります。手順書は画面ごとに、押すボタンまで書いています。
              </li>
              <li>
                <span className={s.stepTitle}>初期設定のコマンドを動かす</span>
                鍵の書き込み・データベースの準備・確認（verify:full）を、用意したコマンドで進めます。
              </li>
              <li>
                <span className={s.stepTitle}>Claude Code に話して、コミュニティに合わせる</span>
                最初に同梱の FIRST_PROMPT を渡し、そのあと変えたいことを1つずつ頼みます。
              </li>
              <li>
                <span className={s.stepTitle}>確かめて、公開する</span>
                verify で確かめ、Vercel に公開します。ログインから投稿・通報までを、実際に試してから案内を始めます。
              </li>
            </ol>

            <h3>用意するもの</h3>
            <ul className={s.checklist}>
              <li>
                <b>Mac</b>：{CONFIRMED_ENVIRONMENT[0]?.value}
              </li>
              <li>
                <b>Claude Code</b>：Claude の有料プランで使えます
              </li>
              <li>
                <b>外部サービスのアカウント</b>：Supabase・Vercel・メール送信サービス（Resend など）。GitHub は無くても公開できます
              </li>
              <li>
                <b>独自ドメイン</b>：登録や再設定のメールの送信元に使います（持っているドメインのサブドメインで構いません）
              </li>
            </ul>

            <h2 id="cost">外部サービスの費用の目安</h2>
            <p>商品の代金とは別に、ご自身で契約する外部サービスの費用がかかります。</p>
            <div className={s.tableWrap} role="region" aria-label="外部サービスの費用の目安（横にスクロールできます）" tabIndex={0}>
              <table className={s.table}>
                <caption>外部サービスの費用の目安（2026年11月時点）</caption>
                <thead>
                  <tr>
                    <th scope="col">サービス</th>
                    <th scope="col">役割</th>
                    <th scope="col">始めるとき</th>
                    <th scope="col">有料にするとき</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_ROWS.map((r) => (
                    <tr key={r.name}>
                      <th scope="row">{r.name}</th>
                      <td>{r.role}</td>
                      <td>{r.start}</td>
                      <td>{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.tableNote}>
              料金と条件は各サービスが変更することがあります。契約の前に、それぞれの公式の料金ページで確かめてください。ドルの料金は為替によって円の金額が変わります。
            </p>

            <h2 id="fit">向いている方・向いていない方</h2>
            <div className={s.compare}>
              <div className={s.compareItem}>
                <h3>向いている方</h3>
                <ul>
                  <li>自分たちの名前のSNSを、自分の管理で持ちたい</li>
                  <li>AI で Web アプリを作ったことがある（または手伝ってくれる人がいる）</li>
                  <li>ログイン・通報・管理画面を一から作る時間を省きたい</li>
                  <li>Mac で作業できる</li>
                </ul>
              </div>
              <div className={s.compareItem}>
                <h3>向いていない方</h3>
                <ul>
                  <li>設定や運用を、すべて誰かに任せたい（運営代行は行っていません）</li>
                  <li>DM・動画・ライブ配信・アプリストアのアプリが最初から必要</li>
                  <li>お客さまのSNSを制作して納品したい（制作代行には使えません）</li>
                  <li>Windows・Linux で作業したい</li>
                </ul>
              </div>
            </div>

            <h2 id="faq">よくある質問</h2>
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            {articles.length > 0 && (
              <>
                <h2 id="articles">関連する記事</h2>
                <ul>
                  {articles.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className={s.cta}>
              <div className={s.ctaText}>
                <p className={s.ctaTitle}>
                  SNS Starter Kit Standard ・ {PRODUCT.launch ? `${PRODUCT.launch.label} ` : ""}{PRODUCT.priceLabel}（{PRODUCT.taxLabel}）
                </p>
                <p className={s.ctaSub}>買い切り・1 Production Project・購入後30日間のメールサポート</p>
              </div>
              <Link href={PRODUCT.path} className={s.ctaButton}>
                販売ページを見る
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <div className={s.bottomArea}>
        <p className={s.footerNote}>
          <Link href="/sns-starter-kit/terms">販売利用規約・使用許諾条件</Link>
          {" ・ "}
          <Link href="/sns-starter-kit/tokushoho">特定商取引法に基づく表記</Link>
        </p>
      </div>
    </div>
  );
}
