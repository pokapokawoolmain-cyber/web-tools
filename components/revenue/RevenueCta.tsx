"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RevenueCtaPlacement, RevenueProduct } from "@/lib/analytics/events";
import { trackRevenueCtaClick, trackRevenueCtaImpression } from "@/lib/analytics/track";
import { useCtaImpression } from "./useCtaImpression";

interface RevenueCtaProps {
  product: RevenueProduct;
  placement: RevenueCtaPlacement;
  priceShown: number | null;
  toolId?: string;
  label: string;
  /** 指定時はLinkとして描画し遷移する（ツール内バナー用）。 */
  href?: string;
  /** 指定時はbuttonとして描画し、遷移せずコールバックのみ呼ぶ（LP本体の準備中パネル表示用）。 */
  onActivate?: () => void;
  className?: string;
}

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] transition-colors";

/** ProへのCTA。IntersectionObserverでimpressionを、押下でclickを送る。LP本体・ツール内バナーの両方で共用。 */
export function RevenueCta({ product, placement, priceShown, toolId, label, href, onActivate, className }: RevenueCtaProps) {
  const ref = useCtaImpression<HTMLDivElement>(() => {
    trackRevenueCtaImpression({ product, placement, toolId });
  });

  const handleClick = () => {
    trackRevenueCtaClick({ product, placement, toolId, priceShown });
    onActivate?.();
  };

  return (
    <div ref={ref} className="inline-block">
      {href ? (
        <Link href={href} onClick={handleClick} className={className ?? BASE_CLASS}>
          {label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button type="button" onClick={handleClick} className={className ?? BASE_CLASS}>
          {label}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
