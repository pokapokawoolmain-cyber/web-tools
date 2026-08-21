"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { resolveRevenueAttribution } from "@/lib/analytics/attribution";
import { trackRevenueLpView } from "@/lib/analytics/track";
import type { ProductConfig } from "@/lib/revenue/products";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { ComingSoonPanel } from "./ComingSoonPanel";
import { RevenueCta } from "./RevenueCta";

export function ProductLpView({ product }: { product: ProductConfig }) {
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const viewFiredRef = useRef(false);

  useEffect(() => {
    if (viewFiredRef.current) return;
    viewFiredRef.current = true;
    const attribution = resolveRevenueAttribution(searchParams);
    trackRevenueLpView(product.id, attribution);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActivate = () => {
    setRevealed(true);
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ヒーロー */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <nav aria-label="パンくずリスト" className="mb-5 text-sm text-slate-500">
            <ol className="flex items-center gap-1">
              <li><Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">ToolBox</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 dark:text-slate-300">{product.name}</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[12px] font-medium">
            準備中・先行案内受付中
          </div>

          <ToolIcon toolId={product.id} size="lg" label={product.name} className="mb-5" />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
            {product.name}
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-4">
            {product.tagline}
          </p>
          <p className="text-[14.5px] text-slate-600 dark:text-zinc-400 mb-8">{product.audience}</p>

          <div className="mb-5">
            <span className="font-bold text-slate-900 dark:text-white text-2xl">{product.priceLabel}</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {product.priceBullets.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[13px] text-slate-600 dark:text-zinc-400">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          <RevenueCta
            product={product.id}
            placement="lp_hero"
            priceShown={product.price}
            label={product.lpCtaLabel}
            onActivate={handleActivate}
          />
          <p className="text-[12.5px] text-slate-400 dark:text-zinc-500 mt-3 max-w-md">{product.priceNote}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-14">
        {/* ユースケース */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            こんな作業を、一度で終わらせる
          </h2>
          {product.useCases.map((useCase) => (
            <div key={useCase.title} className="tool-card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-zinc-200 mb-4 text-[15px]">{useCase.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {useCase.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[13px]">
                      {step}
                    </span>
                    {i < useCase.steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 構想機能（補助情報） */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
            今後の構想（すべて実装確定ではありません）
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.plannedFeatures.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 text-[12.5px] text-slate-500 dark:text-zinc-400"
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {product.disclaimer && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 text-[12.5px] text-amber-700 dark:text-amber-400 leading-relaxed">
            {product.disclaimer}
          </div>
        )}

        {/* 準備中パネル */}
        <div ref={panelRef}>
          {revealed ? (
            <ComingSoonPanel product={product.id} productName={product.name} />
          ) : (
            <div className="text-center py-8">
              <RevenueCta
                product={product.id}
                placement="lp_footer"
                priceShown={product.price}
                label={product.lpCtaLabel}
                onActivate={handleActivate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
