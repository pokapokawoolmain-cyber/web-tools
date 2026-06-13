"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type { FaviconSettings, ImageAnalysis, MainMode } from "./lib/favicon-lib";
import { DEFAULT_SETTINGS, renderFavicon } from "./lib/favicon-lib";
import { EasyMode } from "./EasyMode";
import { ProMode } from "./ProMode";
import { DiagnoseMode } from "./DiagnoseMode";
import { PreviewPanel } from "./PreviewPanel";
import { ScorePanel } from "./ScorePanel";
import { DownloadPanel } from "./DownloadPanel";

type RightTab = "preview" | "score" | "download";

const MASTER_SIZE = 512;

export function FaviconGenerator() {
  const [mainMode, setMainMode] = useState<MainMode>("easy");
  const [settings, setSettings] = useState<FaviconSettings>(DEFAULT_SETTINGS);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("preview");

  // Rendered output
  const [mainDataUrl, setMainDataUrl] = useState("");
  const [maskDataUrl, setMaskDataUrl] = useState("");
  const [thumbUrls, setThumbUrls] = useState<Record<number, string>>({});

  const masterCanvasRef = useRef<HTMLCanvasElement>(null);

  // ── Shared update helpers ───────────────────────────────────────────
  const updateSettings = useCallback((partial: Partial<FaviconSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const handleImageChange = useCallback(
    (img: HTMLImageElement, anal: ImageAnalysis) => {
      setSourceImage(img);
      setAnalysis(anal);
      setSettings(prev => ({ ...prev, proSubMode: "image" }));
    },
    []
  );

  // ── Re-render whenever settings or sourceImage changes ─────────────
  const renderAll = useCallback(() => {
    const canvas = masterCanvasRef.current;
    if (!canvas) return;

    const imgEl = settings.proSubMode === "image" ? sourceImage ?? undefined : undefined;

    // Master 512px
    renderFavicon(canvas, { size: MASTER_SIZE, settings, imageEl: imgEl });
    setMainDataUrl(canvas.toDataURL("image/png"));

    // Maskable 512px (only if enabled)
    if (settings.maskableEnabled) {
      const mc = document.createElement("canvas");
      renderFavicon(mc, { size: MASTER_SIZE, settings, imageEl: imgEl, maskable: true });
      setMaskDataUrl(mc.toDataURL("image/png"));
    }

    // Thumbnails
    const thumbs: Record<number, string> = {};
    for (const sz of [256, 64, 32, 16]) {
      const tc = document.createElement("canvas");
      renderFavicon(tc, { size: sz, settings, imageEl: imgEl });
      thumbs[sz] = tc.toDataURL("image/png");
    }
    setThumbUrls(thumbs);
  }, [settings, sourceImage]);

  useEffect(() => {
    renderAll();
  }, [renderAll]);

  // ── Auto-fix handler ────────────────────────────────────────────────
  const handleFix = useCallback((fixId: string) => {
    switch (fixId) {
      case "fix-bg":
        updateSettings({ bgType: "solid", bgColor: "#3b82f6" });
        break;
      case "fix-maskable":
        updateSettings({ maskableEnabled: true });
        setRightTab("preview");
        break;
      case "fix-maskscale":
        updateSettings({ maskableScale: 0.82 });
        break;
      case "fix-fontsize":
        updateSettings({ fontSize: 50 });
        break;
      case "fix-border":
        updateSettings({ border: true, borderWidth: 3, borderColor: "#ffffff" });
        break;
      case "fix-brightness":
        updateSettings({ brightness: 130 });
        break;
      default:
        break;
    }
  }, [updateSettings]);

  return (
    <div className="space-y-4">
      {/* ── Mode tabs ──────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
        {([
          ["easy", "かんたん作成"],
          ["pro", "プロ編集"],
          ["diagnose", "サイト診断"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMainMode(id)}
            className={`flex-1 py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              mainMode === id
                ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hidden master canvas */}
      <canvas ref={masterCanvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: creation controls ─────────────────────────────────── */}
        <div>
          {mainMode === "easy" && (
            <EasyMode
              settings={settings}
              sourceImage={sourceImage}
              analysis={analysis}
              onSettingsChange={updateSettings}
              onImageChange={handleImageChange}
            />
          )}
          {mainMode === "pro" && (
            <ProMode
              settings={settings}
              sourceImage={sourceImage}
              analysis={analysis}
              onSettingsChange={updateSettings}
              onImageChange={handleImageChange}
            />
          )}
          {mainMode === "diagnose" && <DiagnoseMode />}
        </div>

        {/* ── Right: Preview / Score / Download ──────────────────────── */}
        <div className="space-y-4">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
            {([
              ["preview", "プレビュー"],
              ["score", "品質スコア"],
              ["download", "ダウンロード"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setRightTab(id)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  rightTab === id
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {rightTab === "preview" && (
            <PreviewPanel
              mainDataUrl={mainDataUrl}
              maskDataUrl={maskDataUrl}
              thumbUrls={thumbUrls}
              settings={settings}
              onSettingsChange={updateSettings}
            />
          )}
          {rightTab === "score" && (
            <ScorePanel
              mainDataUrl={mainDataUrl}
              maskDataUrl={maskDataUrl}
              settings={settings}
              analysis={analysis}
              onFix={handleFix}
            />
          )}
          {rightTab === "download" && (
            <DownloadPanel
              mainDataUrl={mainDataUrl}
              maskDataUrl={maskDataUrl}
              thumbUrls={thumbUrls}
              settings={settings}
              sourceImage={sourceImage}
              onSettingsChange={updateSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
}
