"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, ImageIcon, TrendingUp, FileCheck, Sparkles, Lock } from "lucide-react";

const TABS = [
  {
    id: "pdf",
    label: "PDF",
    Icon: FileText,
    gradient: "from-blue-500 to-blue-600",
    heading: "PDFをまとめる・軽くする・変換する",
    desc: "PDF結合・分割・圧縮・回転・画像変換まで、よく使うPDF作業をブラウザで完結。アプリ不要、ファイルは外部送信なし。",
    img: "/previews/home/pdf-merge.jpg",
    imgAlt: "PDF結合ツールの操作画面",
    tools: [
      { name: "PDF結合", href: "/tools/pdf-merge" },
      { name: "PDF分割", href: "/tools/pdf-split" },
      { name: "PDF圧縮", href: "/tools/pdf-compress" },
      { name: "JPG→PDF変換", href: "/tools/jpg-to-pdf" },
      { name: "PDF→JPG変換", href: "/tools/pdf-to-jpg" },
    ],
    cta: { label: "PDFツールをすべて見る", href: "/pdf" },
  },
  {
    id: "image",
    label: "画像",
    Icon: ImageIcon,
    gradient: "from-emerald-500 to-teal-600",
    heading: "画像を圧縮・変換・証明写真に",
    desc: "JPG・PNG・HEIC・WebPの圧縮・変換・リサイズ・証明写真作成。写真はすべてブラウザ内で処理し、サーバーに送信されません。",
    img: "/previews/home/image-compress.jpg",
    imgAlt: "画像圧縮ツールの操作画面",
    tools: [
      { name: "画像圧縮", href: "/tools/image-compress" },
      { name: "HEIC→JPG変換", href: "/tools/heic-to-jpg" },
      { name: "画像リサイズ", href: "/tools/image-resize" },
      { name: "証明写真作成", href: "/tools/id-photo" },
      { name: "動画圧縮", href: "/tools/video-compress" },
    ],
    cta: { label: "画像ツールをすべて見る", href: "/image" },
  },
  {
    id: "money",
    label: "お金",
    Icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    heading: "FIRE・NISA・手取り・税金を計算する",
    desc: "FIREシミュレーター・新NISA積立・住宅ローン・ふるさと納税・手取り計算まで、お金の計算を一か所にまとめました。",
    img: "/previews/home/fire-simulator.jpg",
    imgAlt: "FIREシミュレーターの操作画面",
    tools: [
      { name: "FIREシミュレーター", href: "/tools/fire-simulator" },
      { name: "新NISA積立計算", href: "/tools/nisa-calculator" },
      { name: "手取り計算", href: "/tools/net-income" },
      { name: "ふるさと納税シミュ", href: "/tools/furusato-simulator" },
      { name: "住宅ローン計算", href: "/tools/mortgage-calculator" },
    ],
    cta: { label: "お金ツールをすべて見る", href: "/money" },
  },
  {
    id: "business",
    label: "仕事",
    Icon: FileCheck,
    gradient: "from-violet-500 to-purple-600",
    heading: "請求書・見積書・契約書をその場で作成",
    desc: "請求書・見積書・業務委託契約書・履歴書・退職届。フォームを埋めるだけでPDF出力まで完結。Wordや専用ソフト不要。",
    img: "/previews/home/invoice.jpg",
    imgAlt: "請求書作成ツールの操作画面",
    tools: [
      { name: "請求書作成", href: "/tools/invoice-generator" },
      { name: "見積書作成", href: "/tools/estimate-generator" },
      { name: "業務委託契約書", href: "/tools/business-contract-generator" },
      { name: "NDA作成", href: "/tools/nda-generator" },
      { name: "履歴書・職務経歴書", href: "/tools/resume-builder" },
    ],
    cta: { label: "書類ツールをすべて見る", href: "/business" },
  },
  {
    id: "life",
    label: "生活",
    Icon: Sparkles,
    gradient: "from-pink-500 to-rose-500",
    heading: "Wi-Fi QR・シフト計算・生活の作業を楽に",
    desc: "来客用Wi-FiのQRコード・副業税金計算・シフト給与計算・ガソリン代計算。日常のちょっとした作業をすぐ片付けます。",
    img: "/previews/home/wifi-qr.jpg",
    imgAlt: "Wi-Fi QRコード生成ツールの操作画面",
    tools: [
      { name: "Wi-Fi QRコード生成", href: "/tools/wifi-qr" },
      { name: "副業利益・税金計算", href: "/tools/side-job-profit" },
      { name: "シフト給与計算", href: "/tools/shift-salary" },
      { name: "ガソリン代計算", href: "/tools/gas-calculator" },
      { name: "メルカリ利益計算", href: "/tools/mercari-profit" },
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
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
      <div className="container-base">
        {/* 見出し */}
        <div className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">
            EXPLORE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            カテゴリから探す
          </h2>
        </div>

        {/* タブリスト */}
        <div
          role="tablist"
          aria-label="ツールカテゴリ"
          className="flex gap-1 flex-wrap mb-8 border-b border-slate-200 dark:border-zinc-700"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeId;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => switchTab(tab.id)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 min-h-[44px] border-b-2 -mb-px",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-t",
                  isActive
                    ? "border-slate-900 text-slate-900 dark:border-white dark:text-white"
                    : "border-transparent text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300",
                ].join(" ")}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* 左：説明＋ツール一覧 */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {active.heading}
              </h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {active.desc}
              </p>

              <ul className="space-y-1.5 mb-7" aria-label={`${active.label}カテゴリのツール`}>
                {active.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 transition-all min-h-[48px]"
                    >
                      <span className="text-[14px] font-medium text-slate-800 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {tool.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-slate-600 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
                  "hover:opacity-90 hover:shadow-md hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                {active.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 右：実画面プレビュー */}
            <div className="relative">
              <div
                aria-hidden="true"
                className={[
                  "absolute -inset-3 rounded-3xl bg-gradient-to-br opacity-8 dark:opacity-5",
                  active.gradient,
                ].join(" ")}
              />
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-2 flex-1 h-4.5 bg-white dark:bg-zinc-700 rounded text-[10px] text-slate-400 dark:text-zinc-500 px-2 flex items-center gap-1 border border-slate-200 dark:border-zinc-600">
                    <Lock className="w-2 h-2 flex-shrink-0" />
                    <span>toolboxjp.com</span>
                  </div>
                </div>
                <Image
                  src={active.img}
                  alt={active.imgAlt}
                  width={1280}
                  height={760}
                  className="w-full object-cover object-top"
                  style={{ height: "320px" }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
