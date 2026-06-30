"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TABS = [
  {
    id: "pdf",
    label: "PDF",
    emoji: "📄",
    gradient: "from-blue-500 to-blue-600",
    heading: "PDFをまとめる・軽くする・変換する",
    desc: "PDF結合・分割・圧縮・回転・画像変換まで、よく使うPDF作業をブラウザで完結。アプリ不要、ファイルは外部送信なし。",
    img: "/previews/home/pdf-merge.jpg",
    imgAlt: "PDF結合ツールの操作画面",
    tools: [
      { emoji: "📎", name: "PDF結合", href: "/tools/pdf-merge" },
      { emoji: "✂️", name: "PDF分割", href: "/tools/pdf-split" },
      { emoji: "🗜️", name: "PDF圧縮", href: "/tools/pdf-compress" },
      { emoji: "🖼️", name: "JPG→PDF変換", href: "/tools/jpg-to-pdf" },
      { emoji: "📄", name: "PDF→JPG変換", href: "/tools/pdf-to-jpg" },
    ],
    cta: { label: "PDFツールをすべて見る", href: "/pdf" },
  },
  {
    id: "image",
    label: "画像",
    emoji: "🖼️",
    gradient: "from-emerald-500 to-teal-600",
    heading: "画像を圧縮・変換・証明写真に",
    desc: "JPG・PNG・HEIC・WebPの圧縮・変換・リサイズ・証明写真作成。写真はすべてブラウザ内で処理し、サーバーに送信されません。",
    img: "/previews/home/image-compress.jpg",
    imgAlt: "画像圧縮ツールの操作画面",
    tools: [
      { emoji: "🗜️", name: "画像圧縮", href: "/tools/image-compress" },
      { emoji: "🖼️", name: "HEIC→JPG変換", href: "/tools/heic-to-jpg" },
      { emoji: "✂️", name: "画像リサイズ", href: "/tools/image-resize" },
      { emoji: "📸", name: "証明写真作成", href: "/tools/id-photo" },
      { emoji: "🎬", name: "動画圧縮", href: "/tools/video-compress" },
    ],
    cta: { label: "画像ツールをすべて見る", href: "/image" },
  },
  {
    id: "money",
    label: "お金",
    emoji: "💰",
    gradient: "from-amber-500 to-orange-500",
    heading: "FIRE・NISA・手取り・税金を計算する",
    desc: "FIREシミュレーター・新NISA積立・住宅ローン・ふるさと納税・手取り計算まで、お金の計算を一か所にまとめました。",
    img: "/previews/home/fire-simulator.jpg",
    imgAlt: "FIREシミュレーターの操作画面",
    tools: [
      { emoji: "🔥", name: "FIREシミュレーター", href: "/tools/fire-simulator" },
      { emoji: "📈", name: "新NISA積立計算", href: "/tools/nisa-calculator" },
      { emoji: "💴", name: "手取り計算", href: "/tools/net-income" },
      { emoji: "🎁", name: "ふるさと納税シミュ", href: "/tools/furusato-simulator" },
      { emoji: "🏠", name: "住宅ローン", href: "/tools/mortgage-calculator" },
    ],
    cta: { label: "お金ツールをすべて見る", href: "/money" },
  },
  {
    id: "business",
    label: "仕事",
    emoji: "📋",
    gradient: "from-violet-500 to-purple-600",
    heading: "請求書・見積書・契約書をその場で作成",
    desc: "請求書・見積書・業務委託契約書・履歴書・退職届。フォームを埋めるだけでPDF出力まで完結。Wordや専用ソフト不要。",
    img: "/previews/home/invoice.jpg",
    imgAlt: "請求書作成ツールの操作画面",
    tools: [
      { emoji: "🧾", name: "請求書作成", href: "/tools/invoice-generator" },
      { emoji: "📊", name: "見積書作成", href: "/tools/estimate-generator" },
      { emoji: "📋", name: "業務委託契約書", href: "/tools/business-contract-generator" },
      { emoji: "🤝", name: "NDA作成", href: "/tools/nda-generator" },
      { emoji: "📄", name: "履歴書・職務経歴書", href: "/tools/resume-builder" },
    ],
    cta: { label: "ビジネスツールをすべて見る", href: "/business" },
  },
  {
    id: "life",
    label: "生活",
    emoji: "🏠",
    gradient: "from-pink-500 to-rose-500",
    heading: "Wi-Fi QR・シフト計算・生活の作業を楽に",
    desc: "来客用Wi-FiのQRコード・副業税金計算・シフト給与計算・ガソリン代計算。日常のちょっとした作業をすぐ片付けます。",
    img: "/previews/home/wifi-qr.jpg",
    imgAlt: "Wi-Fi QRコード生成ツールの操作画面",
    tools: [
      { emoji: "📶", name: "Wi-Fi QRコード生成", href: "/tools/wifi-qr" },
      { emoji: "💼", name: "副業利益・税金計算", href: "/tools/side-job-profit" },
      { emoji: "⏰", name: "シフト給与計算", href: "/tools/shift-salary" },
      { emoji: "⛽", name: "ガソリン代計算", href: "/tools/gas-calculator" },
      { emoji: "🛍️", name: "メルカリ利益計算", href: "/tools/mercari-profit" },
    ],
    cta: { label: "生活ツールをすべて見る", href: "/tools/lifestyle" },
  },
] as const;

export function CategoryTabSection() {
  const [activeId, setActiveId] = useState<string>(TABS[0].id);
  const [fading, setFading] = useState(false);

  function switchTab(id: string) {
    if (id === activeId) return;
    setFading(true);
    setTimeout(() => {
      setActiveId(id);
      setFading(false);
    }, 150);
  }

  const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
      <div className="container-base">
        {/* 見出し */}
        <div className="mb-10">
          <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
            FEATURES
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            ToolBoxJPでできること
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] max-w-xl">
            カテゴリを選んで、実際のツール画面を確認してください
          </p>
        </div>

        {/* タブリスト */}
        <div
          role="tablist"
          aria-label="ツールカテゴリ"
          className="flex gap-2 flex-wrap mb-8 border-b border-slate-100 dark:border-zinc-800 pb-0"
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
                onClick={() => switchTab(tab.id)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold transition-all duration-150 min-h-[44px] border-b-2 -mb-px",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-t-lg",
                  isActive
                    ? `border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400`
                    : "border-transparent text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600",
                ].join(" ")}
              >
                <span aria-hidden="true">{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* タブコンテンツ */}
        <div
          role="tabpanel"
          id={`tabpanel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className={[
            "transition-all duration-150",
            fading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0",
          ].join(" ")}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* 左：説明＋ツール一覧 */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {active.heading}
              </h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {active.desc}
              </p>

              <ul className="space-y-2 mb-7" aria-label={`${active.label}カテゴリのツール`}>
                {active.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all min-h-[48px]"
                    >
                      <span className="text-xl w-7 text-center flex-shrink-0" aria-hidden="true">
                        {tool.emoji}
                      </span>
                      <span className="text-[14px] font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-1 transition-colors">
                        {tool.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={active.cta.href}
                className={[
                  "inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-[14px] font-semibold transition-all min-h-[44px]",
                  "bg-gradient-to-r",
                  active.gradient,
                  "hover:opacity-90 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                {active.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 右：実画面プレビュー */}
            <div className="relative">
              {/* デコ背景 */}
              <div
                aria-hidden="true"
                className={[
                  "absolute -inset-3 rounded-3xl bg-gradient-to-br opacity-10 dark:opacity-5",
                  active.gradient,
                ].join(" ")}
              />
              {/* ブラウザフレーム */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 flex-shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 flex-shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80 flex-shrink-0" />
                  <div className="ml-2 flex-1 h-5 bg-white dark:bg-zinc-700 rounded text-[10px] text-slate-400 dark:text-zinc-500 px-2 flex items-center gap-1 border border-slate-200 dark:border-zinc-600">
                    <span>🔒</span>
                    <span>toolboxjp.com</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <Image
                    src={active.img}
                    alt={active.imgAlt}
                    width={1280}
                    height={760}
                    className="w-full object-cover object-top"
                    style={{ height: "360px" }}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
