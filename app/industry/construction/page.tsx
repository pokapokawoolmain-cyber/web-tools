import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { InArticleAd, BottomAd, CategoryFeedAd } from "@/components/ads/presets";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.toolboxjp.com";

export const metadata: Metadata = generateMeta({
  title: "建設・リフォーム業向け無料ツール集｜工事見積書・原価計算・外壁面積・近隣挨拶文",
  description: "建設・リフォーム業の現場で使える無料ツール集。工事見積書作成・原価率粗利率計算・外壁塗装面積計算・近隣挨拶文メーカー・補助金診断など。登録不要・ブラウザ完結・スマホ対応。",
  path: "/industry/construction",
  keywords: [
    "建設業 ツール 無料", "リフォーム 見積書 作成", "工事見積書 テンプレ 無料",
    "外壁塗装 面積 計算", "原価率 計算 建設", "近隣挨拶文 工事", "工事 補助金 診断",
    "建設業 無料 アプリ", "リフォーム 補助金 無料診断",
  ],
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ToolBoxJP", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "建設・リフォーム業向けツール", "item": `${SITE_URL}/industry/construction` },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "建設業の工事見積書を無料で作成できますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "はい、工事見積書作成ツールで無料で作成できます。工事明細・諸経費・消費税を入力してPDF保存・印刷が可能です。登録不要です。" }
    },
    {
      "@type": "Question",
      "name": "外壁塗装の面積はどうやって計算しますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "外壁塗装面積計算ツールで、建物の間口・奥行・階数を入力するか、延べ床面積（坪数）を入力するだけで概算面積が計算できます。塗料使用量・工事費目安も算出します。" }
    },
    {
      "@type": "Question",
      "name": "工事の近隣挨拶文はどう作ればいいですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "近隣挨拶文メーカーで、工事の種類・期間・会社名を入力するだけで状況に合った挨拶文が自動生成されます。コピー・印刷に対応しています。" }
    },
    {
      "@type": "Question",
      "name": "リフォーム工事で使える補助金はどうやって調べますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "補助金・助成金診断ツールから、省エネリフォーム・耐震改修・バリアフリー改修に関する補助金情報を確認できます。" }
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
  isExternal?: boolean;
};

const TOOL_CATEGORIES: { label: string; tools: ToolCard[] }[] = [
  {
    label: "見積・請求",
    tools: [
      {
        href: "/tools/construction-estimate",
        emoji: "📋",
        title: "工事見積書作成ツール",
        desc: "工事明細・諸経費・消費税を入力してPDF出力。建設業許可番号対応。施工会社情報は自動保存。",
        category: "見積・請求",
        isNew: true,
      },
      {
        href: "/tools/estimate-generator",
        emoji: "📄",
        title: "見積書作成ツール（汎用）",
        desc: "汎用見積書のブラウザ作成ツール。明細追加・有効期限・承認欄付き。PDF保存・印刷対応。",
        category: "見積・請求",
      },
      {
        href: "/tools/invoice-generator",
        emoji: "🧾",
        title: "請求書作成ツール",
        desc: "インボイス対応の請求書を無料作成。消費税計算・振込先・印鑑対応。PDF保存・印刷。",
        category: "見積・請求",
      },
    ],
  },
  {
    label: "現場計算",
    tools: [
      {
        href: "/tools/gross-profit-calculator",
        emoji: "📊",
        title: "原価率・粗利率計算ツール",
        desc: "売上・原価から粗利率を即計算。目標粗利率から必要見積金額の逆算も対応。建設業の目安表付き。",
        category: "現場計算",
        isNew: true,
      },
      {
        href: "/tools/exterior-paint-calculator",
        emoji: "🏠",
        title: "外壁塗装面積計算ツール",
        desc: "間口・奥行・坪数から外壁面積を計算。塗料使用量・工事費目安も算出。シリコン〜無機塗料対応。",
        category: "現場計算",
        isNew: true,
      },
      {
        href: "/tools/gas-calculator",
        emoji: "⛽",
        title: "ガソリン代計算ツール",
        desc: "現場への往復燃料費を自動計算。燃費・ガソリン単価・距離を入力。経費申請に。",
        category: "現場計算",
      },
    ],
  },
  {
    label: "書類・テンプレート",
    tools: [
      {
        href: "/tools/construction-contract",
        emoji: "📑",
        title: "工事請負契約書作成ツール",
        desc: "発注者・請負者情報、工事金額・支払条件・保証を入力して請負契約書をPDF出力。着手金自動計算対応。",
        category: "書類・テンプレート",
        isNew: true,
      },
      {
        href: "/tools/construction-report",
        emoji: "📋",
        title: "工事完了報告書作成ツール",
        desc: "工事内容・使用材料・保証を入力して完了報告書をPDF出力。施主への提出書類として活用。",
        category: "書類・テンプレート",
        isNew: true,
      },
      {
        href: "/tools/neighbor-greeting",
        emoji: "📝",
        title: "近隣挨拶文メーカー",
        desc: "工事の種類・期間・会社名を入力して状況別の近隣挨拶文を自動生成。解体・リフォーム・外壁塗装等に対応。",
        category: "書類・テンプレート",
        isNew: true,
      },
      {
        href: "/tools/receipt-generator",
        emoji: "🧾",
        title: "領収書作成ツール",
        desc: "工事代金の領収書を無料作成。インボイス登録番号・消費税・収入印紙ガイド対応。",
        category: "書類・テンプレート",
      },
    ],
  },
  {
    label: "写真・PDF",
    tools: [
      {
        href: "/tools/construction-photo-pdf",
        emoji: "📸",
        title: "工事写真帳作成ツール",
        desc: "施工前・施工中・施工後の工事写真に工程区分・コメントを付けてA4 PDF写真帳を作成。外壁塗装・リフォーム完了報告に。",
        category: "写真・PDF",
        isNew: true,
      },
      {
        href: "/tools/jpg-to-pdf",
        emoji: "📷",
        title: "写真→PDF変換（汎用）",
        desc: "複数の工事写真（JPG・PNG）をまとめてPDFに変換。ドラッグで順番変更可能。",
        category: "写真・PDF",
      },
      {
        href: "/tools/pdf-merge",
        emoji: "📚",
        title: "PDF結合ツール",
        desc: "見積書・図面・仕様書など複数PDFを1ファイルに結合。ブラウザ完結で安心。",
        category: "写真・PDF",
      },
      {
        href: "/tools/image-compress",
        emoji: "🖼️",
        title: "画像圧縮ツール",
        desc: "工事写真をメール送信できるサイズに圧縮。品質を保ちながらファイルサイズを削減。",
        category: "写真・PDF",
      },
    ],
  },
  {
    label: "補助金・制度",
    tools: [
      {
        href: "/subsidy",
        emoji: "🏛️",
        title: "補助金・助成金診断",
        desc: "リフォーム・省エネ・耐震改修・バリアフリー工事に使える補助金を無料診断。施主への提案にも活用可。",
        category: "補助金・制度",
      },
    ],
  },
];

const FEATURES = [
  { icon: "⚡", title: "登録・インストール不要", desc: "URLを開けばすぐ使えます。アカウント作成もアプリインストールも不要。" },
  { icon: "🔒", title: "データはサーバーに送信しない", desc: "工事情報・顧客情報はすべてブラウザ内で処理。機密情報も安心して入力できます。" },
  { icon: "📱", title: "スマホ・タブレット対応", desc: "現場でのスマホ確認、事務所でのPC作業など、デバイスを選ばず利用可能。" },
  { icon: "🆓", title: "すべて完全無料", desc: "広告収益による運営のため、掲載ツールはすべて無料でご利用いただけます。" },
];

export default function ConstructionPage() {
  const totalTools = TOOL_CATEGORIES.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema] as Record<string, unknown>[]} />
      <div className="min-h-screen bg-white dark:bg-zinc-950">

        {/* ヒーロー */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border-b border-slate-100 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <nav className="text-[13px] text-slate-400 dark:text-zinc-500 mb-6 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-slate-600 dark:hover:text-zinc-300">ToolBoxJP</Link>
              <span>›</span>
              <span className="text-slate-600 dark:text-zinc-300">建設・リフォーム業向けツール</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl flex-shrink-0">🏗️</span>
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Industry</span>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500">{totalTools}種類のツールを無料提供</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                  建設・リフォーム業向け<br className="sm:hidden" />無料ツール集
                </h1>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  工事見積書の作成から、原価計算・外壁塗装面積・近隣挨拶文・補助金診断まで。
                  建設・リフォーム業の実務で使えるツールを、<strong className="text-slate-800 dark:text-zinc-200">登録不要・完全無料</strong>でご提供します。
                </p>
              </div>
            </div>
            {/* クイックアクセス */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { href: "/tools/construction-photo-pdf", label: "📸 工事写真帳" },
                { href: "/tools/construction-estimate", label: "📋 工事見積書" },
                { href: "/tools/construction-contract", label: "📑 請負契約書" },
                { href: "/tools/construction-report", label: "📋 完了報告書" },
                { href: "/tools/gross-profit-calculator", label: "📊 原価率計算" },
                { href: "/tools/exterior-paint-calculator", label: "🏠 外壁面積計算" },
                { href: "/subsidy", label: "🏛️ 補助金診断" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[13px] font-medium text-slate-700 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors shadow-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-14">

          {/* 広告①：導入文直下 */}
          <InArticleAd />

          {/* ツールカテゴリ一覧 */}
          {TOOL_CATEGORIES.map((cat) => (
            <section key={cat.label}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{cat.label}</h2>
                <div className="flex-1 h-px bg-slate-100 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <p className="font-bold text-[14px] text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{tool.title}</p>
                          {tool.isNew && (
                            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">NEW</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed flex-1">{tool.desc}</p>
                    <div className="mt-3 text-[12px] font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
                      ツールを使う →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* 広告②：カテゴリ一覧後 */}
          <CategoryFeedAd />

          {/* 特徴 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">ToolBoxJPが選ばれる理由</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-5">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="font-bold text-[14px] text-slate-800 dark:text-zinc-200 mb-1">{title}</p>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 活用シーン */}
          <section className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">こんな場面で使われています</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
              {[
                { scene: "📞 電話でのヒアリング後すぐ", desc: "スマホで粗利率を即計算して、概算の見積金額を伝える" },
                { scene: "🏠 現場調査の帰り道", desc: "外壁塗装面積・塗料使用量を計算してメモしておく" },
                { scene: "📋 見積書・契約書の提出前", desc: "工事見積書・請負契約書ツールで体裁を整えてPDF出力" },
                { scene: "🤝 工事着工前", desc: "近隣挨拶文を生成・印刷して近隣に配布する" },
                { scene: "📸 工事完了後", desc: "施工写真を写真帳ツールでまとめて施主に提出" },
                { scene: "🏛️ 施主への提案時", desc: "補助金診断ツールで使える補助金を一緒に確認" },
              ].map(({ scene, desc }) => (
                <div key={scene} className="flex gap-3">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 flex-shrink-0">{scene}</span>
                  <span className="text-slate-600 dark:text-zinc-400">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">よくある質問</h2>
            <div className="space-y-4">
              {[
                { q: "有料プランや登録は必要ですか？", a: "すべて完全無料・登録不要でご利用いただけます。広告収益により無料で提供しています。" },
                { q: "入力した顧客情報・工事情報はどこかに送信されますか？", a: "送信されません。すべての計算・処理はブラウザ内で完結しています。顧客の個人情報や工事内容が外部に漏れる心配はありません。" },
                { q: "工事見積書は建設業法上有効ですか？", a: "本ツールで作成した書類はひな形です。建設業法では工事金額等に応じた書面要件があります。重要な工事・高額工事では専門家や行政書士にご確認ください。" },
                { q: "スマートフォンでも使えますか？", a: "はい、すべてのツールはスマートフォン・タブレット対応のレスポンシブデザインです。iOS・Androidどちらでも動作します。" },
                { q: "新しいツールの追加要望はできますか？", a: "お問い合わせページからご要望をお送りください。実務でよく使われる機能を優先的に開発・追加しています。" },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
                  <p className="font-semibold text-[14px] text-slate-800 dark:text-zinc-200 mb-1.5">Q. {q}</p>
                  <p className="text-[14px] text-slate-500 dark:text-zinc-400 leading-relaxed">A. {a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 広告③：FAQ後 */}
          <BottomAd />

          {/* 関連リンク */}
          <section className="border-t border-slate-100 dark:border-zinc-800 pt-8">
            <h2 className="text-base font-bold text-slate-700 dark:text-zinc-300 mb-4">関連ページ</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/tools", label: "全ツール一覧" },
                { href: "/subsidy", label: "補助金・助成金診断" },
                { href: "/tools/estimate-generator", label: "見積書作成（汎用）" },
                { href: "/tools/invoice-generator", label: "請求書作成" },
                { href: "/tools/pdf-merge", label: "PDF結合" },
                { href: "/tools/jpg-to-pdf", label: "写真→PDF変換" },
                { href: "/blog", label: "ブログ記事" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
