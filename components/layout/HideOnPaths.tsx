"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// 指定したパスでは子要素（日本語のサイトのフッターなど）を出さない。英語版の商品ページ（/en/）用。
export function HideOnPaths({ prefixes, children }: { prefixes: string[]; children: ReactNode }) {
  const pathname = usePathname();
  return prefixes.some((p) => pathname.startsWith(p)) ? null : <>{children}</>;
}
