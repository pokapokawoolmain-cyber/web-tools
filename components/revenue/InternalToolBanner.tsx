import { Sparkles } from "lucide-react";
import { buildInternalToolLinkParams } from "@/lib/analytics/attribution";
import { getProductConfig } from "@/lib/revenue/products";
import { RevenueCta } from "./RevenueCta";

/**
 * 実利用のある画像系ツールの処理完了後に表示する、Image Proへの控えめな文脈CTA。
 * 邪魔なモーダル・強制表示・無料機能の制限は行わない（既存Free体験を維持する）。
 */
export function InternalToolBanner({ toolId }: { toolId: string }) {
  const product = getProductConfig("image_pro");
  const href = `${product.path}?${buildInternalToolLinkParams(toolId)}`;

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-800/60 border-l-[6px] border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/40 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
      <div className="flex items-start gap-4 flex-1">
        <span className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center mt-0.5">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </span>
        <p className="text-[14.5px] text-slate-700 dark:text-zinc-300 leading-relaxed">
          <span className="block font-bold text-slate-900 dark:text-white text-[16px] mb-0.5">毎回まとめて処理していますか？</span>
          {product.name}なら大量画像を同じ設定で一括処理できます。
        </p>
      </div>
      <RevenueCta
        product="image_pro"
        placement="tool_banner"
        priceShown={product.price}
        toolId={toolId}
        label={product.bannerCtaLabel}
        href={href}
        className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14.5px] font-semibold transition-colors shadow-sm w-full sm:w-auto"
      />
    </div>
  );
}
