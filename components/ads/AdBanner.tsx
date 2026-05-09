"use client";
// ========================================
// 広告バナーコンポーネント
// Google AdSense取得後にここを編集するだけ
// ========================================

type AdBannerProps = {
  slot: "header" | "sidebar" | "in-article" | "footer";
  className?: string;
};

// AdSenseのクライアントID（.env.localで設定）
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  // AdSenseが設定されていない場合はプレースホルダーを表示（開発用）
  if (!ADSENSE_CLIENT) {
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div
        className={`flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-slate-600 text-xs ${
          slot === "sidebar" ? "h-64" : "h-24"
        } ${className}`}
      >
        広告枠 ({slot})
        <br />
        AdSense設定後に表示
      </div>
    );
  }

  // AdSense本番コード（取得後にアンコメント）
  // return (
  //   <ins
  //     className={`adsbygoogle ${className}`}
  //     style={{ display: "block" }}
  //     data-ad-client={ADSENSE_CLIENT}
  //     data-ad-slot="YOUR_AD_SLOT_ID"
  //     data-ad-format="auto"
  //     data-full-width-responsive="true"
  //   />
  // );

  return null;
}
