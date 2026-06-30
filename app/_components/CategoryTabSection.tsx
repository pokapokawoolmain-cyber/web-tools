"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PdfPreview,
  ImagePreview,
  MoneyPreview,
  BusinessPreview,
  LifePreview,
  TextPreview,
} from "./ToolPreviewMockup";

const TABS = [
  {
    id: "pdf",
    label: "PDF",
    emoji: "📄",
    heading: "PDFをまとめる・軽くする・変換する",
    desc: "PDF結合・分割・圧縮・回転・画像変換まで、よく使うPDF作業をブラウザで完結。アプリ不要、ファイルは外部送信なし。",
    tools: [
      { emoji: "📎", name: "PDF結合", href: "/tools/pdf-merge" },
      { emoji: "✂️", name: "PDF分割", href: "/tools/pdf-split" },
      { emoji: "🗜️", name: "PDF圧縮", href: "/tools/pdf-compress" },
      { emoji: "🖼️", name: "JPG→PDF", href: "/tools/jpg-to-pdf" },
      { emoji: "📄", name: "PDF→JPG", href: "/tools/pdf-to-jpg" },
    ],
    cta: { label: "PDFツールをすべて見る", href: "/pdf" },
    Preview: PdfPreview,
  },
  {
    id: "image",
    label: "画像",
    emoji: "🖼️",
    heading: "画像を圧縮・変換・証明写真に",
    desc: "JPG・PNG・HEIC・WebPの圧縮・変換・リサイズ・証明写真作成。写真はすべてブラウザ内で処理し、サーバーに送信されません。",
    tools: [
      { emoji: "🗜️", name: "画像圧縮", href: "/tools/image-compress" },
      { emoji: "🖼️", name: "HEIC→JPG変換", href: "/tools/heic-to-jpg" },
      { emoji: "✂️", name: "画像リサイズ", href: "/tools/image-resize" },
      { emoji: "📸", name: "証明写真作成", href: "/tools/id-photo" },
      { emoji: "🎬", name: "動画圧縮", href: "/tools/video-compress" },
    ],
    cta: { label: "画像ツールをすべて見る", href: "/image" },
    Preview: ImagePreview,
  },
  {
    id: "money",
    label: "お金",
    emoji: "💰",
    heading: "FIRE・NISA・手取り・税金を計算する",
    desc: "FIREシミュレーター・新NISA積立・住宅ローン・ふるさと納税・手取り計算まで、お金の計算を一か所にまとめました。",
    tools: [
      { emoji: "🔥", name: "FIREシミュレーター", href: "/tools/fire-simulator" },
      { emoji: "📈", name: "新NISA積立計算", href: "/tools/nisa-calculator" },
      { emoji: "💴", name: "手取り計算", href: "/tools/net-income" },
      { emoji: "🎁", name: "ふるさと納税シミュ", href: "/tools/furusato-simulator" },
      { emoji: "🏠", name: "住宅ローン", href: "/tools/mortgage-calculator" },
    ],
    cta: { label: "お金ツールをすべて見る", href: "/money" },
    Preview: MoneyPreview,
  },
  {
    id: "business",
    label: "仕事",
    emoji: "📋",
    heading: "請求書・見積書・契約書をその場で作成",
    desc: "請求書・見積書・業務委託契約書・履歴書・退職届。フォームを埋めるだけでPDF出力まで完結。Wordや専用ソフト不要。",
    tools: [
      { emoji: "🧾", name: "請求書作成", href: "/tools/invoice-generator" },
      { emoji: "📊", name: "見積書作成", href: "/tools/estimate-generator" },
      { emoji: "📋", name: "業務委託契約書", href: "/tools/business-contract-generator" },
      { emoji: "🤝", name: "NDA作成", href: "/tools/nda-generator" },
      { emoji: "📄", name: "履歴書・職務経歴書", href: "/tools/resume-builder" },
    ],
    cta: { label: "ビジネスツールをすべて見る", href: "/business" },
    Preview: BusinessPreview,
  },
  {
    id: "life",
    label: "生活",
    emoji: "🏠",
    heading: "Wi-Fi QR・SNSリンク・副業計算",
    desc: "来客用Wi-FiのQRコード・SNSリンクまとめ・副業税金計算・シフト給与計算。日常のちょっとした作業をすぐ片付けます。",
    tools: [
      { emoji: "📶", name: "Wi-Fi QRコード生成", href: "/tools/wifi-qr" },
      { emoji: "🔗", name: "SNSリンクまとめ", href: "/tools/sns-links" },
      { emoji: "💼", name: "副業利益・税金計算", href: "/tools/side-job-profit" },
      { emoji: "⏰", name: "シフト給与計算", href: "/tools/shift-salary" },
      { emoji: "🛍️", name: "メルカリ利益計算", href: "/tools/mercari-profit" },
    ],
    cta: { label: "生活ツールをすべて見る", href: "/tools/lifestyle" },
    Preview: LifePreview,
  },
  {
    id: "text",
    label: "便利ツール",
    emoji: "✍️",
    heading: "文字数カウント・QR・パスワード生成",
    desc: "X/Twitter用の文字数カウント・QRコード生成・パスワード生成・Markdownエディタ。日常のWeb作業をすぐ完結できます。",
    tools: [
      { emoji: "✍️", name: "文字数カウント", href: "/tools/word-counter" },
      { emoji: "📱", name: "QRコード生成", href: "/tools/qr-generator" },
      { emoji: "🔐", name: "パスワード生成", href: "/tools/password-generator" },
      { emoji: "📝", name: "Markdownエディタ", href: "/tools/markdown-editor" },
      { emoji: "📶", name: "Wi-Fi QR生成", href: "/tools/wifi-qr" },
    ],
    cta: { label: "テキスト・Webツールを見る", href: "/tools/text" },
    Preview: TextPreview,
  },
] as const;

export function CategoryTabSection() {
  const [activeId, setActiveId] = useState<string>(TABS[0].id);

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950">
      <div className="container-base">
        {/* セクション見出し */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            ToolBoxJPでできること
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            カテゴリを選んで、どんな作業ができるかを確認してください
          </p>
        </div>

        {/* タブリスト */}
        <div
          role="tablist"
          aria-label="ツールカテゴリ"
          className="flex gap-1.5 flex-wrap mb-8"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveId(tab.id)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-150 min-h-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700",
                ].join(" ")}
              >
                <span aria-hidden="true">{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* タブコンテンツ */}
        {TABS.map((tab) => {
          const isActive = tab.id === activeId;
          const TabPreview = tab.Preview;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              className={[
                "transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* 左：説明 */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {tab.heading}
                  </h3>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tab.desc}
                  </p>
                  {/* ツールリスト */}
                  <ul className="space-y-2 mb-6" aria-label={`${tab.label}カテゴリのツール`}>
                    {tab.tools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all min-h-[44px]"
                        >
                          <span className="text-xl w-7 text-center" aria-hidden="true">
                            {tool.emoji}
                          </span>
                          <span className="text-[14px] font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-1 transition-colors">
                            {tool.name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tab.cta.href}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-[14px] font-semibold hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px]"
                  >
                    {tab.cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* 右：UIプレビュー */}
                <div className="relative">
                  <div className="max-w-sm mx-auto lg:ml-auto lg:mr-0">
                    <TabPreview />
                  </div>
                  {/* 背景デコ（控えめ） */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-2xl -z-10"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
