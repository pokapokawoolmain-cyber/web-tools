import { Clock } from "lucide-react";
import type { RevenueProduct } from "@/lib/analytics/events";
import { WaitlistForm } from "./WaitlistForm";

/** CTA押下後に表示する「準備中」パネル。決済誤認を避けるため断定的に伝える。 */
export function ComingSoonPanel({ product, productName }: { product: RevenueProduct; productName: string }) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-zinc-700">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Clock className="w-5 h-5" />
        <span className="font-semibold text-[14.5px]">{productName}は現在準備中です</span>
      </div>
      <p className="text-[13.5px] text-slate-600 dark:text-zinc-400 leading-relaxed">
        まだ決済のご案内はできません。どのくらいの方が関心を持ってくださっているかを確認している段階です。
        先行案内をご希望の方は、メールアドレスをご登録ください（任意・登録は無料です）。
      </p>
      <WaitlistForm product={product} productName={productName} />
    </div>
  );
}
