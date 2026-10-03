"use client";
// 設定: ホーム画面への追加方法（案内を「あとで」「今後表示しない」にした人も、いつでも確認できる）
import { useEffect, useState, useSyncExternalStore } from "react";
import { Smartphone } from "lucide-react";
import { canPromptInstall, detectPlatform, isStandalone, promptInstall, subscribeInstallPrompt, writeA2hsState, type Platform } from "@/lib/goods/pwa";
import { btn, card } from "@/lib/goods/ui";
import { InstallGuideDialog, guideVariantFor } from "../_components/InstallGuide";
import { useToast } from "../_components/Toast";

export function HomeScreenSettings({ userId }: { userId: string }) {
  const toast = useToast();
  const promptReady = useSyncExternalStore(subscribeInstallPrompt, canPromptInstall, () => false);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setStandalone(isStandalone());
  }, []);

  async function onClick() {
    if (promptReady) {
      const outcome = await promptInstall();
      if (outcome === "accepted") {
        writeA2hsState(userId, { state: "done" });
        toast.show("ホーム画面に追加しました。次回からアイコンで開けます。");
        return;
      }
      if (outcome === "dismissed") return;
    }
    setOpen(true);
  }

  return (
    <section className={`${card} mt-4 p-5`}>
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
        <Smartphone className="h-4 w-4" aria-hidden="true" />
        ホーム画面への追加方法
      </h2>
      {standalone ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">いまはホーム画面のアイコンから開いています。</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">ホーム画面に追加すると、次回からアプリのようにすぐ開けます。</p>
          <button type="button" onClick={onClick} disabled={!platform} className={`${btn.secondary} mt-3`}>
            {promptReady ? "ホーム画面に追加" : "追加方法を見る"}
          </button>
        </>
      )}
      {platform && <InstallGuideDialog open={open} variant={guideVariantFor(platform)} onClose={() => setOpen(false)} />}
    </section>
  );
}
