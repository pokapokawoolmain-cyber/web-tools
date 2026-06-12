"use client";
import { useState } from "react";
import type { FaviconSettings } from "./lib/favicon-lib";
import { drawSafeZoneOverlay } from "./lib/favicon-lib";
import { useEffect, useRef } from "react";

interface Props {
  mainDataUrl: string;
  maskDataUrl: string;
  thumbUrls: Record<number, string>;
  settings: FaviconSettings;
  onSettingsChange: (p: Partial<FaviconSettings>) => void;
}

type PreviewTab = "sizes" | "mockups" | "maskable";

export function PreviewPanel({ mainDataUrl, maskDataUrl, thumbUrls, settings, onSettingsChange }: Props) {
  const [tab, setTab] = useState<PreviewTab>("sizes");
  const safeZoneCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw safe zone overlay on maskable canvas
  useEffect(() => {
    if (tab !== "maskable" || !safeZoneCanvasRef.current || !maskDataUrl) return;
    const canvas = safeZoneCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 192;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      if (settings.showSafeZone) {
        drawSafeZoneOverlay(canvas);
      }
    };
    img.src = maskDataUrl || mainDataUrl;
  }, [tab, maskDataUrl, mainDataUrl, settings.showSafeZone]);

  const siteName = settings.siteName || "My Website";
  const siteUrl = settings.siteUrl || "example.com";
  const favicon16 = thumbUrls[16] || thumbUrls[32] || mainDataUrl;
  const favicon32 = thumbUrls[32] || mainDataUrl;

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
        {([
          ["sizes", "サイズ確認"],
          ["mockups", "表示シミュレーション"],
          ["maskable", "Maskable確認"],
        ] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              tab === id
                ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Site meta inputs */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-2">プレビュー用のサイト情報</p>
        <div className="flex gap-2">
          <input
            type="text" value={settings.siteName}
            onChange={e => onSettingsChange({ siteName: e.target.value })}
            placeholder="サイト名"
            className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text" value={settings.siteUrl}
            onChange={e => onSettingsChange({ siteUrl: e.target.value })}
            placeholder="example.com"
            className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ── Sizes tab ────────────────────────────────────────────────────── */}
      {tab === "sizes" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          {/* Main preview */}
          <div className="flex justify-center mb-6">
            {mainDataUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={mainDataUrl} alt="favicon 512px" width={160} height={160} className="rounded-xl shadow-md" />
            ) : (
              <div className="w-40 h-40 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
            )}
          </div>

          {/* Size grid */}
          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-4">実際のサイズ</p>
          <div className="flex items-end gap-5 flex-wrap">
            {[{ size: 64, label: "64px" }, { size: 32, label: "32px" }, { size: 16, label: "16px" }].map(({ size, label }) => (
              <div key={size} className="text-center">
                {thumbUrls[size] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={thumbUrls[size]}
                    alt={label}
                    width={size}
                    height={size}
                    style={{ imageRendering: size <= 32 ? "pixelated" : "auto" }}
                    className="rounded-sm"
                  />
                ) : (
                  <div style={{ width: size, height: size }} className="bg-slate-100 dark:bg-zinc-800 rounded-sm" />
                )}
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}

            {/* Pixelated x8 view for 16px */}
            {thumbUrls[16] && (
              <div className="ml-2 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrls[16]}
                  alt="16px x8"
                  width={128}
                  height={128}
                  style={{ imageRendering: "pixelated" }}
                  className="rounded border border-slate-200 dark:border-zinc-700"
                />
                <p className="text-xs text-slate-400 mt-1">16px（8倍表示）</p>
              </div>
            )}
          </div>

          {/* Light/dark toggle */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2">背景での見え方</p>
            <div className="flex gap-2">
              {([["light", "ライト", "#ffffff"], ["dark", "ダーク", "#1e293b"]] as const).map(([val, label, bg]) => (
                <div
                  key={val}
                  style={{ backgroundColor: bg }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-4 border border-slate-200 dark:border-zinc-700"
                >
                  {thumbUrls[32] && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={thumbUrls[32]} alt={label} width={32} height={32} style={{ imageRendering: "pixelated" }} />
                  )}
                  <span style={{ color: val === "light" ? "#374151" : "#e5e7eb" }} className="text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mockups tab ──────────────────────────────────────────────────── */}
      {tab === "mockups" && (
        <div className="space-y-4">
          {/* Chrome browser tab */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-3">ブラウザタブ</p>
            {/* Chrome-style */}
            <div className="rounded-t-xl overflow-hidden border border-b-0 border-slate-200 dark:border-zinc-700">
              {/* Tab bar */}
              <div className="bg-slate-200 dark:bg-zinc-800 px-3 pt-2 flex gap-1">
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-t-lg max-w-48 border-t border-l border-r border-slate-200 dark:border-zinc-700">
                  {favicon16 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={favicon16} alt="tab icon" width={16} height={16} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                  ) : (
                    <div className="w-4 h-4 bg-slate-200 rounded flex-shrink-0" />
                  )}
                  <span className="text-xs text-slate-700 dark:text-zinc-300 truncate">{siteName}</span>
                  <span className="text-slate-400 ml-auto pl-1 flex-shrink-0">×</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 text-slate-400 text-xs">+</div>
              </div>
              {/* Address bar */}
              <div className="bg-white dark:bg-zinc-900 px-3 py-2.5 flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-1 text-slate-400 text-xs">←→</div>
                <div className="flex-1 flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full px-3 py-1">
                  {favicon16 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={favicon16} alt="" width={14} height={14} style={{ imageRendering: "pixelated" }} />
                  ) : null}
                  <span className="text-xs text-slate-600 dark:text-zinc-400">{siteUrl}</span>
                </div>
              </div>
            </div>
            <div className="h-16 bg-white dark:bg-zinc-900 border border-t-0 border-slate-200 dark:border-zinc-700 rounded-b-xl" />
          </div>

          {/* Google search result */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-3">Google検索結果</p>
            <div className="bg-white rounded-xl border border-slate-200 p-4 max-w-sm shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                {favicon16 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={favicon16} alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} />
                ) : (
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                )}
                <span className="text-xs text-slate-600">{siteUrl}</span>
              </div>
              <p className="text-blue-700 font-medium text-base leading-snug hover:underline cursor-pointer">
                {siteName} — ToolBox
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                テキスト・絵文字・画像からファビコンを無料作成。favicon.ico・PNG各サイズ・Maskable Icon・WebManifestを一括ダウンロード。
              </p>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              ※ Googleのファビコン反映には数日〜数週間かかる場合があります
            </p>
          </div>

          {/* iOS home screen */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-3">iPhoneホーム画面</p>
            <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-4">
              <div className="grid grid-cols-4 gap-3">
                {/* 9 placeholder icons */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 bg-white/20 rounded-[16px]" />
                    <div className="w-10 h-1.5 bg-white/30 rounded" />
                  </div>
                ))}
                {/* Our icon */}
                <div className="flex flex-col items-center gap-1">
                  {thumbUrls[256] || mainDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumbUrls[256] || mainDataUrl}
                      alt={siteName}
                      className="w-14 h-14 rounded-[16px] shadow-lg"
                      style={{ imageRendering: "auto" }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-white/40 rounded-[16px]" />
                  )}
                  <span className="text-white text-[10px] text-center leading-tight drop-shadow w-16 truncate">
                    {siteName}
                  </span>
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i + 5} className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 bg-white/20 rounded-[16px]" />
                    <div className="w-10 h-1.5 bg-white/30 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              Apple Touch Icon (180×180px) — ホーム画面に追加時
            </p>
          </div>

          {/* Android PWA */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-3">Android ホーム画面 (PWA)</p>
            <div className="bg-zinc-900 rounded-2xl p-4">
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl" />
                    <div className="w-10 h-1.5 bg-white/20 rounded" />
                  </div>
                ))}
                <div className="flex flex-col items-center gap-1">
                  {maskDataUrl || mainDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={maskDataUrl || mainDataUrl}
                      alt={siteName}
                      className="w-12 h-12 rounded-2xl shadow"
                      style={{ imageRendering: "auto" }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-2xl" />
                  )}
                  <span className="text-white text-[10px] text-center leading-tight w-14 truncate">{siteName}</span>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i + 5} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl" />
                    <div className="w-10 h-1.5 bg-white/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              Maskable Icon (192×192px, purpose: maskable)
            </p>
          </div>

          {/* Windows taskbar */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-3">Windowsタスクバー・ブックマーク</p>
            <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-700 rounded px-2 py-1.5">
                {favicon32 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={favicon32} alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} />
                ) : (
                  <div className="w-4 h-4 bg-slate-500 rounded" />
                )}
                <span className="text-white text-xs">{siteName}</span>
              </div>
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                {thumbUrls[32] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={thumbUrls[32]} alt="" width={20} height={20} style={{ imageRendering: "pixelated" }} />
                ) : (
                  <div className="w-5 h-5 bg-slate-500 rounded" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Maskable tab ─────────────────────────────────────────────────── */}
      {tab === "maskable" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mb-4">
              Maskable Icon プレビュー（黄色の円が安全領域）
            </p>

            <div className="flex items-start gap-6 flex-wrap">
              {/* Safe zone canvas */}
              <div className="text-center">
                <canvas
                  ref={safeZoneCanvasRef}
                  width={192}
                  height={192}
                  className="rounded-xl border border-slate-200 dark:border-zinc-700"
                />
                <p className="text-xs text-slate-400 mt-1">192px（安全領域表示）</p>
                <button
                  onClick={() => onSettingsChange({ showSafeZone: !settings.showSafeZone })}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  {settings.showSafeZone ? "安全領域を非表示" : "安全領域を表示"}
                </button>
              </div>

              {/* Shape previews */}
              <div>
                <p className="text-xs text-slate-500 dark:text-zinc-500 mb-3">マスク形状シミュレーション</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "円形 (Pixel 等)", clip: "rounded-full" },
                    { label: "角丸 (Samsung)", clip: "rounded-2xl" },
                    { label: "四角 (一部機種)", clip: "rounded-none" },
                    { label: "ティアドロップ", clip: "rounded-[35%]" },
                  ].map(({ label, clip }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className={`w-14 h-14 overflow-hidden ${clip}`}>
                        {maskDataUrl || mainDataUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={maskDataUrl || mainDataUrl} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-zinc-700" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 text-center">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <p className="text-xs text-slate-500 dark:text-zinc-500 mb-3">通常版 vs Maskable版 比較</p>
              <div className="flex gap-4">
                <div className="text-center">
                  {mainDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={mainDataUrl} alt="通常版" width={72} height={72} className="rounded-xl border border-slate-200 dark:border-zinc-700" />
                  ) : <div className="w-18 h-18 bg-slate-100 rounded-xl" />}
                  <p className="text-xs text-slate-400 mt-1">通常版</p>
                </div>
                <div className="text-center">
                  {(maskDataUrl || mainDataUrl) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={maskDataUrl || mainDataUrl} alt="Maskable版" width={72} height={72} className="rounded-xl border border-slate-200 dark:border-zinc-700" />
                  ) : <div className="w-18 h-18 bg-slate-100 rounded-xl" />}
                  <p className="text-xs text-slate-400 mt-1">Maskable版</p>
                </div>
                <div className="text-center">
                  <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700">
                    {(maskDataUrl || mainDataUrl) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={maskDataUrl || mainDataUrl} alt="円形マスク適用" className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full bg-slate-100" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">円形マスク後</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
