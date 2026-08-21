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
    <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-start gap-2.5 flex-1">
        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <span className="font-medium text-slate-800 dark:text-zinc-200">毎回まとめて処理していますか？</span>
          <br />
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
        className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors"
      />
    </div>
  );
}
