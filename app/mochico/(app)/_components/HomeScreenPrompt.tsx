"use client";
// ============================================================
// ホーム画面追加の案内カード（マイイベントにだけ表示）
//
// 表示条件（すべて満たすとき・表示まで少し待つ）:
//   ログイン済み（このページはログイン必須）/ スマートフォン / ホーム画面から起動していない /
//   この端末・このユーザーで「あとで」「今後表示しない」「完了」になっていない
//   Android の Chromium 系は、ブラウザ標準のインストール確認が出せる状態になってから表示する
//   （出せないまま案内してメニューを探させない）
// ============================================================
import { useEffect, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { AppMascot } from "@/components/mochico/MascotColorContext";
import {
  GUIDE_SNOOZE_DAYS,
  SNOOZE_DAYS,
  canPromptInstall,
  detectPlatform,
  isA2hsSuppressed,
  isStandalone,
  promptInstall,
  snooze,
  subscribeInstallPrompt,
  writeA2hsState,
  type Platform,
} from "@/lib/goods/pwa";
import { btn } from "@/lib/goods/ui";
import { InstallGuideDialog, guideVariantFor } from "./InstallGuide";
import { useToast } from "./Toast";

const SHOW_DELAY_MS = 1500;

export function HomeScreenPrompt({ userId }: { userId: string }) {
  const toast = useToast();
  const promptReady = useSyncExternalStore(subscribeInstallPrompt, canPromptInstall, () => false);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    setEligible(p.os !== "other" && !isStandalone() && !isA2hsSuppressed(userId));
  }, [userId]);

  // マイイベントの表示が落ち着いてから出す（最初の操作を邪魔しない）
  useEffect(() => {
    if (!eligible || !platform) return;
    const needsPrompt = platform.os === "android" && platform.browser === "chromium";
    if (needsPrompt && !promptReady) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [eligible, platform, promptReady]);

  if (!visible || !platform) return null;

  const hide = () => setVisible(false);

  async function add() {
    if (canPromptInstall()) {
      // ユーザーのタップの中でブラウザ標準の確認画面を出す（最終確認はユーザー）
      const outcome = await promptInstall();
      if (outcome === "accepted") {
        writeA2hsState(userId, { state: "done" });
        hide();
        toast.show("ホーム画面に追加しました。次回からアイコンで開けます。");
        return;
      }
      if (outcome === "dismissed") {
        snooze(userId, SNOOZE_DAYS);
        hide();
        return;
      }
    }
    setGuideOpen(true);
  }

  return (
    <>
      <section
        aria-labelledby="a2hs-title"
        className="goods-slide-up mb-4 flex items-start gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-900/60 dark:bg-pink-950/30"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900" aria-hidden="true">
          <AppMascot size={36} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="a2hs-title" className="text-[15px] font-bold text-slate-900 dark:text-white">
            ホーム画面に追加
          </h2>
          <p className="mt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">ホーム画面に追加すると、次回からアプリのようにすぐ開けます。</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={add} className={btn.primary}>
              ホーム画面に追加
            </button>
            <button
              type="button"
              onClick={() => {
                snooze(userId, SNOOZE_DAYS);
                hide();
              }}
              className={btn.ghost}
            >
              あとで
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              writeA2hsState(userId, { state: "never" });
              hide();
              toast.show("今後は表示しません。設定からいつでも追加方法を確認できます。");
            }}
            className="mt-1 min-h-9 text-xs text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
          >
            今後表示しない
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            snooze(userId, SNOOZE_DAYS);
            hide();
          }}
          aria-label="閉じる"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-pink-900/40"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
      <InstallGuideDialog
        open={guideOpen}
        variant={guideVariantFor(platform)}
        onClose={() => {
          setGuideOpen(false);
          // 手順を見た人には、しばらく案内を出さない（iPhone は追加できたかを判定できないため）
          snooze(userId, GUIDE_SNOOZE_DAYS);
          hide();
        }}
      />
    </>
  );
}
