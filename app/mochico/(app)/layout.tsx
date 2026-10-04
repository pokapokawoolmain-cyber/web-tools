// ============================================================
// Mochico アプリ本体の共通レイアウト（公開 LP /mochico には適用されない: route group で分離）
//
// * 個人データを扱うため noindex（metadata + vercel.json の X-Robots-Tag）
// * 常に動的レンダリング（ユーザーごとの内容をキャッシュさせない）
// * ToolBox 共通の Header / Footer の内側に、アプリ用のサブナビを置く
// ============================================================
import type { Metadata, Viewport } from "next";
import { GoodsSubNav } from "./_components/GoodsSubNav";
import { OfflineBanner } from "./_components/OfflineBanner";
import { PwaBootstrap } from "./_components/PwaBootstrap";
import { ToastProvider } from "./_components/Toast";
import { StateMessage } from "./_components/StateMessage";
import { Wrench } from "lucide-react";
import { isGoodsConfigured } from "@/lib/goods/env";
import { GOODS_APP_NAME, GOODS_APP_SHORT_NAME } from "@/lib/goods/app-meta";
import "./goods.css";
import { getSessionUser } from "@/lib/goods/data";
import { MascotColorProvider } from "@/components/mochico/MascotColorContext";
import { DEFAULT_MASCOT_COLOR, isMascotColor } from "@/components/mochico/palette";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { template: "%s | Mochico", default: "Mochico" },
  description: "推しグッズを見やすく管理・共有できるアプリ Mochico。",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  // ホーム画面に追加したとき「Mochico」アプリとして起動させる（ToolBox 全体の manifest を上書き）
  manifest: "/mochico/manifest.webmanifest",
  applicationName: GOODS_APP_NAME,
  appleWebApp: { capable: true, title: GOODS_APP_SHORT_NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  // iOS 16.3 以前はマニフェストではなくこのタグで全画面起動を判断する（Next は新しい mobile-web-app-capable のみ出力）
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  // 入力欄フォーカス時の iOS 自動ズームは font-size 16px で防ぐ（拡大自体は禁止しない）
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default async function GoodsLayout({ children }: { children: React.ReactNode }) {
  if (!isGoodsConfigured()) {
    return (
      <StateMessage icon={<Wrench className="h-7 w-7" />} title="Mochicoは準備中です">
        もうしばらくお待ちください。
      </StateMessage>
    );
  }
  // キャラクターの色（本人の設定のみ。未ログイン・取得失敗時は公式色）
  let mascotColor = DEFAULT_MASCOT_COLOR;
  try {
    const { supabase, user } = await getSessionUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("mascot_color").eq("id", user.id).maybeSingle();
      if (isMascotColor(data?.mascot_color)) mascotColor = data.mascot_color;
    }
  } catch {
    /* 見た目の設定なので、失敗しても既定色で表示を続ける */
  }
  return (
    <MascotColorProvider initial={mascotColor}>
      <ToastProvider>
        <div className="min-h-[70vh] bg-slate-50 pb-16 dark:bg-zinc-950">
          <PwaBootstrap />
          <GoodsSubNav />
          <OfflineBanner />
          {children}
        </div>
      </ToastProvider>
    </MascotColorProvider>
  );
}
