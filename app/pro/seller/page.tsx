import { Suspense } from "react";
import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { getProductConfig } from "@/lib/revenue/products";
import { ProductLpView } from "@/components/revenue/ProductLpView";

const product = getProductConfig("seller");

export const metadata: Metadata = generateMeta({
  title: `${product.name}｜${product.tagline}`,
  description: `${product.audience}。${product.priceLabel}。Phase Revenue 0検証中の商品仮説ページです。`,
  path: product.path,
  noIndex: true, // 検証段階のLPのため検索エンジンには出さない
});

export default function SellerPage() {
  return (
    <Suspense fallback={null}>
      <ProductLpView product={product} />
    </Suspense>
  );
}
