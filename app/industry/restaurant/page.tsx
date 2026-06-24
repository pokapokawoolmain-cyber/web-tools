import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { InArticleAd, BottomAd, CategoryFeedAd } from "@/components/ads/presets";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

export const metadata: Metadata = generateMeta({
  title: "飲食店向け無料ツール集｜原価率計算・メニュー表作成・シフト給料・口コミ返信",
  description: "飲食店・カフェ・居酒屋・キッチンカーの店舗運営で使える無料ツール集。原価率計算・メニュー価格決め・メニュー表作成・Google口コミ返信・POP作成・シフト人件費計算など。登録不要・ブラウザ完結・スマホ対応。",
  path: "/industry/restaurant",
  keywords: [
    "飲食店 ツール 無料", "飲食店 原価率 計算", "メニュー 価格 決め方",
    "メニュー表 作成 無料", "飲食店 シフト 人件費", "Google口コミ 返信 飲食店",
    "飲食店 POP 作成", "飲食店 補助金", "カフェ 原価計算", "居酒屋 メニュー表",
  ],
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ToolBoxJP", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "飲食店向けツール", "item": `${SITE_URL}/industry/restaurant` },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "飲食店の原価率の目安はどれくらいですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "飲食業界全般では原価率30〜35%が目安です。ラーメン・居酒屋は25〜30%、カフェ・スイーツ系は30〜40%が一般的。原価率計算ツールで食材費と販売価格を入力すると即計算できます。" }
    },
    {
      "@type": "Question",
      "name": "メニューの値段はどうやって決めればいいですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "食材費（原価）÷目標原価率で基準価格を算出し、競合の相場・客層・立地・提供価値を加味して最終決定します。メニュー価格シミュレーターで即座に逆算できます。" }
    },
    {
      "@type": "Question",
      "name": "Google口コミへの返信は必要ですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "はい。高評価・低評価ともに返信することで閲覧者への信頼性が高まります。口コミ返信文メーカーで状況別の自然な返信文を自動生成できます。" }
    },
    {
      "@type": "Question",
      "name": "飲食店で使える補助金はありますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "IT導入補助金・小規模事業者持続化補助金・事業再構築補助金・省エネ設備導入補助金など多数あります。補助金診断ツールで自店に適した補助金を確認できます。" }
    },
    {
      "@type": "Question",
      "name": "スマホからでも使えますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "はい。全ツールがスマートフォン・タブレット対応です。仕込み中の原価計算や、営業中の口コミ確認など現場での活用を想定した設計です。" }
    },
  ],
};

type ToolCard = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  category: string;
  isNew?: boolean;
};

const TOOL_CATEGORIES: { label: string; icon: string; tools: ToolCard[] }[] = [
  {
    label: "原価・価格計算",
    icon: "💰",
    tools: [
      {
        href: "/tools/food-cost-calculator",
        emoji: "🍽️",
        title: "原価率計算ツール",
        desc: "食材費と販売価格を入力して原価率・粗利率を即計算。複数食材・歩留まり・ロス率対応。目標原価率との差と値上げ目安も表示。",
        category: "原価・価格",
        isNew: true,
      },
      {
        href: "/tools/menu-price-calculator",
        emoji: "💴",
        title: "メニュー価格シミュレーター",
        desc: "食材費と目標原価率から適正販売価格を逆算。税込・税抜・端数調整（580円、680円、980円など）に対応。ランチ/ディナー/テイクアウト別シミュレーション。",
        category: "原価・価格",
        isNew: true,
      },
      {
        href: "/tools/gross-profit-calculator",
        emoji: "📊",
        title: "粗利率・原価率計算（汎用）",
        desc: "売上・原価を入力するだけで原価率・粗利率・粗利額を即計算。目標粗利率から逆算した見積金額も算出。",
        category: "原価・価格",
      },
    ],
  },
  {
    label: "メニュー・POP作成",
    icon: "📋",
    tools: [
      {
        href: "/tools/restaurant-menu-maker",
        emoji: "📋",
        title: "メニュー表作成ツール",
        desc: "カテゴリ・メニュー名・価格・説明・アレルギー情報を入力してA4メニュー表をPDF保存・印刷。シンプル・カフェ風・居酒屋風テーマ対応。",
        category: "メニュー・POP",
        isNew: true,
      },
      {
        href: "/tools/restaurant-pop-generator",
        emoji: "📢",
        title: "POP・店内案内文メーカー",
        desc: "本日のおすすめ・期間限定・臨時休業・予約案内など、そのまま使える案内文を自動生成。店内掲示・SNS投稿・黒板メニューに。",
        category: "メニュー・POP",
        isNew: true,
      },
    ],
  },
  {
    label: "シフト・人件費",
    icon: "👥",
    tools: [
      {
        href: "/tools/shift-salary",
        emoji: "📅",
        title: "シフト給与計算ツール",
        desc: "時給・勤務時間・深夜時間・勤務日数・交通費を入力して月収を計算。深夜割増（25%増）・時間外も自動計算。アルバイト・パート対応。",
        category: "シフト・人件費",
      },
      {
        href: "/tools/net-income",
        emoji: "💼",
        title: "手取り計算ツール",
        desc: "年収・月収から手取り額・社会保険料・所得税・住民税を計算。社員・パートの給与管理の参考に。",
        category: "シフト・人件費",
      },
    ],
  },
  {
    label: "集客・口コミ対応",
    icon: "⭐",
    tools: [
      {
        href: "/tools/review-reply-generator",
        emoji: "⭐",
        title: "Google口コミ返信文メーカー",
        desc: "高評価・低評価・クレームなど状況別に自然な返信文を自動生成。丁寧・カジュアル・店主らしい文体を選択可。そのままコピーして使用可。",
        category: "集客・口コミ",
        isNew: true,
      },
    ],
  },
  {
    label: "書類・PDF",
    icon: "📄",
    tools: [
      {
        href: "/tools/invoice-generator",
        emoji: "📄",
        title: "請求書作成ツール",
        desc: "取引先・商品・金額を入力して請求書をPDF出力。インボイス対応。業者への支払い請求や委託料の請求に。",
        category: "書類・PDF",
      },
      {
        href: "/tools/receipt-generator",
        emoji: "🧾",
        title: "領収書作成ツール",
        desc: "宛名・金額・但し書きを入力して領収書をPDF出力。現金払い・経費精算時の領収書発行に。",
        category: "書類・PDF",
      },
      {
        href: "/tools/pdf-merge",
        emoji: "📑",
        title: "PDF結合ツール",
        desc: "複数PDFを1ファイルに結合。メニュー表・営業案内・衛生管理書類などのまとめに。",
        category: "書類・PDF",
      },
    ],
  },
  {
    label: "補助金・制度",
    icon: "🏛️",
    tools: [
      {
        href: "/subsidy",
        emoji: "🏛️",
        title: "補助金・助成金診断ツール",
        desc: "飲食店で活用できるIT導入補助金・小規模事業者持続化補助金・省エネ設備補助金などを診断。業種・規模・目的に合わせた補助金情報を確認。",
        category: "補助金・制度",
      },
    ],
  },
];

function ToolCardComponent({ tool }: { tool: ToolCard }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0" role="img">{tool.emoji}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {tool.title}
            </h3>
            {tool.isNew && (
              <span className="shrink-0 text-[10px] font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">NEW</span>
            )}
          </div>
          <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">{tool.category}</span>
        </div>
      </div>
      <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed flex-1">{tool.desc}</p>
      <div className="mt-3 text-[12px] font-semibold text-orange-600 dark:text-orange-400 group-hover:underline">
        使ってみる →
      </div>
    </Link>
  );
}

export default function RestaurantIndustryPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema] as Record<string, unknown>[]} />

      {/* ヒーロー */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-orange-100 dark:border-zinc-800">
        <div className="container-base py-10 sm:py-16">
          <nav aria-label="パンくずリスト" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-slate-500 dark:text-zinc-500 flex-wrap">
              <li><Link href="/" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">ToolBoxJP</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 dark:text-zinc-300">飲食店向けツール</li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <span className="text-5xl sm:text-6xl" role="img" aria-label="飲食店">🍽️</span>
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
                飲食店・カフェ・居酒屋向け
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                飲食店向け無料ツール集
              </h1>
              <p className="mt-2 text-slate-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
                原価計算・メニュー表作成・口コミ返信・POP作成・人件費計算など、店舗運営に必要なツールを無料提供。登録不要・ブラウザ完結・スマホ対応。
              </p>
            </div>
          </div>

          {/* クイックアクセス */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { href: "/tools/food-cost-calculator", label: "🍽️ 原価率計算" },
              { href: "/tools/menu-price-calculator", label: "💴 メニュー価格逆算" },
              { href: "/tools/restaurant-menu-maker", label: "📋 メニュー表作成" },
              { href: "/tools/review-reply-generator", label: "⭐ 口コミ返信" },
              { href: "/tools/restaurant-pop-generator", label: "📢 POP作成" },
              { href: "/tools/shift-salary", label: "👥 シフト給与計算" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800 border border-orange-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 text-sm px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-zinc-700 hover:border-orange-400 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-base py-10 sm:py-14">

        {/* 広告：冒頭下 */}
        <InArticleAd className="mb-10" />

        {/* 特徴 */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">このツール集でできること</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "💰", title: "原価・利益の見える化", desc: "食材費・販売価格から原価率・粗利を即計算。目標原価率との差分と値上げ目安を表示します。" },
              { icon: "📋", title: "メニュー表をブラウザで作成", desc: "テンプレートに入力するだけでA4メニュー表が完成。PDF保存・印刷も無料・登録不要。" },
              { icon: "⭐", title: "口コミ返信を自動生成", desc: "高評価・低評価・クレームなど状況別に自然な返信文を自動作成。コピーしてすぐ使えます。" },
              { icon: "📢", title: "店内POP・案内文を即作成", desc: "おすすめ・期間限定・臨時休業など目的別テンプレートで案内文を自動生成します。" },
              { icon: "👥", title: "シフト・人件費を正確に計算", desc: "時給・深夜割増・交通費を含めた月収を計算。人件費率の目安も確認できます。" },
              { icon: "🏛️", title: "使える補助金を診断", desc: "IT導入・省エネ・持続化など飲食店に関連する補助金をまとめて確認できます。" },
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-[15px] mb-2">{feature.title}</h3>
                <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ツール一覧 */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8">全ツール一覧</h2>
          <div className="space-y-10">
            {TOOL_CATEGORIES.map((cat, i) => (
              <div key={cat.label}>
                {i === 2 && <CategoryFeedAd className="mb-10" />}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">{cat.label}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.tools.map((tool) => (
                    <ToolCardComponent key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 補助金バナー */}
        <section className="bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-800/50 p-6 sm:p-8 mb-12">
          <div className="flex items-start gap-4">
            <span className="text-4xl shrink-0">🏛️</span>
            <div>
              <h2 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">飲食店で活用できる補助金・助成金</h2>
              <p className="text-[13px] text-green-700 dark:text-green-400 leading-relaxed mb-3">
                IT導入補助金（POSレジ・予約システム）・小規模事業者持続化補助金（販路開拓・メニュー開発）・事業再構築補助金・省エネ設備導入補助金・キャッシュレス決済導入支援など、飲食店に関連する補助金は多数あります。
              </p>
              <div className="flex flex-wrap gap-2 mb-3 text-[12px] text-green-700 dark:text-green-400">
                {["✓ IT導入補助金", "✓ 小規模持続化補助金", "✓ 事業再構築補助金", "✓ 省エネ設備補助金", "✓ 食品衛生設備補助", "✓ 雇用関係助成金"].map(item => (
                  <span key={item} className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{item}</span>
                ))}
              </div>
              <Link href="/subsidy" className="inline-flex items-center gap-1 text-[13px] font-semibold text-green-700 dark:text-green-400 hover:underline">
                🏛️ 補助金・助成金診断ツールで確認する →
              </Link>
            </div>
          </div>
        </section>

        {/* 活用シーン */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">こんな場面で役立ちます</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { scene: "食材費が高騰したとき", detail: "原価率計算ツールで現状の原価率を確認し、メニュー価格シミュレーターで値上げ後の適正価格を試算できます。" },
              { scene: "新メニューの価格を決めるとき", detail: "食材費を入力して目標原価率30%なら販売価格はいくらにすべきかを逆算。税込・端数調整も自動対応。" },
              { scene: "季節メニューのメニュー表を作るとき", detail: "メニュー表作成ツールで新しいカテゴリとメニューを追加してA4印刷。ラミネートしてテーブルに設置。" },
              { scene: "Googleに低評価の口コミが入ったとき", detail: "口コミの内容と評価を選ぶだけで、炎上しにくい丁寧な返信文を自動生成。コピーしてそのまま返信できます。" },
              { scene: "臨時休業・時間変更を案内するとき", detail: "POP・案内文メーカーで種別を選んで内容を入力するだけ。SNS投稿や店頭掲示に使えます。" },
              { scene: "アルバイトの給与を計算するとき", detail: "時給・深夜割増・交通費・勤務日数を入力して月収を計算。人件費合計の確認にも使えます。" },
            ].map((item) => (
              <div key={item.scene} className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800 p-4">
                <p className="font-semibold text-slate-800 dark:text-zinc-200 text-[14px] mb-1.5">💡 {item.scene}</p>
                <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 広告：中段 */}
        <BottomAd className="mb-12" />

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "原価率の目安はどれくらいですか？", a: "飲食業界全般では原価率30〜35%が目安です。ラーメン・居酒屋は25〜30%、カフェ・スイーツ系は30〜40%が一般的。ただし業態・立地・客単価によって異なるため、自店の目標粗利額から逆算することが重要です。" },
              { q: "メニュー価格を値上げするときの考え方は？", a: "食材費高騰時は「食材費÷目標原価率」で必要販売価格を算出し、現在価格との差を確認します。一度に大幅値上げするより、小幅改定を複数回行うか、容量・仕様変更（実質値上げ）を組み合わせると受け入れられやすい傾向があります。" },
              { q: "Google口コミへの返信で注意することは？", a: "①個人情報（氏名・日時・注文内容）に触れない ②過度な謝罪や断定的な表現を避ける ③事実誤認の訂正は丁寧に行う ④感情的な反論はしない ⑤すべての口コミに返信することを推奨します。" },
              { q: "飲食店で使える補助金はありますか？", a: "IT導入補助金（POSレジ・予約システム・キャッシュレス）、小規模事業者持続化補助金（新メニュー開発・販路開拓・設備投資）、省エネ設備補助金（冷蔵庫・厨房機器）など多数あります。補助金診断ツールで確認してください。" },
              { q: "スマホから使えますか？", a: "はい。全ツールはスマートフォン・タブレット対応です。仕込み中の原価計算、営業中の口コミ確認など現場での利用を想定した設計になっています。" },
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-800 dark:text-zinc-200 text-[14px] list-none">
                  <span>Q. {faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform ml-3 shrink-0">▼</span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 関連リンク */}
        <section className="border-t border-slate-100 dark:border-zinc-800 pt-8">
          <h2 className="text-base font-bold text-slate-700 dark:text-zinc-300 mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/industry/construction", label: "🏗️ 建設・リフォーム業向けツール" },
              { href: "/tools", label: "🧰 全ツール一覧" },
              { href: "/subsidy", label: "🏛️ 補助金・助成金診断" },
              { href: "/category/business", label: "💼 ビジネス・契約書ツール" },
              { href: "/category/money", label: "💰 お金・収支計算ツール" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
