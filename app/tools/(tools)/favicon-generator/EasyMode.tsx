"use client";
import { useCallback, useRef, useState } from "react";
import type { FaviconSettings, ImageAnalysis } from "./lib/favicon-lib";
import { analyzeImage, trimTransparentPadding } from "./lib/favicon-lib";
import { SliderRow } from "./SliderRow";
import { Wrench, AlertTriangle } from "lucide-react";

interface Props {
  settings: FaviconSettings;
  sourceImage: HTMLImageElement | null;
  analysis: ImageAnalysis | null;
  onSettingsChange: (p: Partial<FaviconSettings>) => void;
  onImageChange: (img: HTMLImageElement, analysis: ImageAnalysis, dataUrl: string) => void;
}

const PRESET_BG_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#1e293b", "#ffffff",
];

export function EasyMode({ settings, sourceImage, analysis, onSettingsChange, onImageChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      // HEIC support
      let blob: Blob = file;
      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        blob = Array.isArray(converted) ? converted[0] : converted;
      }

      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("画像を読み込めませんでした。"));
        img.src = url;
      });

      // Validate dimensions
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        throw new Error("画像が壊れているか、サポートされていない形式です。");
      }
      if (img.naturalWidth > 8192 || img.naturalHeight > 8192) {
        throw new Error("画像が大きすぎます（最大8192px）。");
      }

      const dataUrl = url;
      const anal = analyzeImage(img, file);
      onSettingsChange({ proSubMode: "image" });
      onImageChange(img, anal, dataUrl);
    } catch (e) {
      setUploadError((e as Error).message || "読み込みエラーが発生しました。");
    } finally {
      setUploading(false);
    }
  }, [onSettingsChange, onImageChange]);

  // Clipboard paste
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
    if (item) {
      const file = item.getAsFile();
      if (file) await loadFile(file);
    }
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const applyFix = async (fixId: string) => {
    if (!sourceImage) return;
    if (fixId === "fix-trim") {
      const trimmed = trimTransparentPadding(sourceImage);
      const img = new Image();
      img.src = trimmed;
      await img.decode();
      const dummyFile = new File([], "trimmed.png", { type: "image/png" });
      const anal = analyzeImage(img, dummyFile);
      onImageChange(img, anal, trimmed);
    } else if (fixId === "fix-border") {
      onSettingsChange({ border: true, borderWidth: 3, borderColor: "#ffffff" });
    } else if (fixId === "fix-brightness") {
      onSettingsChange({ brightness: 130 });
    } else if (fixId === "fix-square") {
      onSettingsChange({ cropMode: "cover" });
    }
  };

  return (
    <div className="space-y-4" onPaste={handlePaste}>
      {/* Upload area */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">画像をアップロード</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            端末内で処理・送信なし
          </span>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/heic,.heic"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }}
        />

        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all text-center py-8 px-4 ${
            isDragging
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">読み込み中...</span>
            </div>
          ) : sourceImage ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sourceImage.src} alt="uploaded" className="w-16 h-16 object-contain rounded-lg" />
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {analysis ? `${analysis.width}×${analysis.height}px` : ""}
                　クリックで変更
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-zinc-400">
              <svg className="w-10 h-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium">クリックまたはドラッグで画像をアップロード</p>
                <p className="text-xs opacity-70 mt-0.5">PNG / JPG / WebP / AVIF / HEIC対応　または Ctrl+V で貼り付け</p>
              </div>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Analysis results */}
        {analysis && analysis.issues.length > 0 && (
          <div className="space-y-2">
            {analysis.issues.filter(i => i.id !== "ok").map(issue => (
              <div
                key={issue.id}
                className={`rounded-lg p-3 text-xs flex items-start gap-2 ${
                  issue.severity === "error"
                    ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    : issue.severity === "warn"
                    ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                    : "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {issue.severity === "error"
                    ? <span className="text-red-600 dark:text-red-400 font-bold text-sm">✕</span>
                    : issue.severity === "warn"
                    ? <AlertTriangle size={14} />
                    : <span className="text-blue-500 font-bold text-sm">i</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{issue.title}</p>
                  <p className="opacity-80 mt-0.5">{issue.detail}</p>
                  {issue.fixLabel && issue.fixId && (
                    <button
                      onClick={() => applyFix(issue.fixId!)}
                      className="mt-1.5 px-2.5 py-1 bg-white dark:bg-zinc-800 rounded border text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                    >
                      <Wrench size={12} />
                      {issue.fixLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {analysis.issues.find(i => i.id === "ok") && (
              <div className="rounded-lg p-3 text-xs bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                ✅ {analysis.issues.find(i => i.id === "ok")!.detail}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Background settings */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">背景設定</h3>

        {/* Crop mode */}
        {sourceImage && (
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">切り抜き方式</label>
            <div className="flex gap-2">
              {([["cover", "枠を埋める（推奨）", "画像全体を拡大して正方形に収める"], ["contain", "全体を収める", "余白付きで画像全体を表示"]] as const).map(([val, label, desc]) => (
                <button
                  key={val}
                  onClick={() => onSettingsChange({ cropMode: val })}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-colors text-left ${
                    settings.cropMode === val
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="opacity-70 mt-0.5 text-[10px]">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background type */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">背景</label>
          <div className="flex gap-2 mb-3">
            {([["transparent", "なし"], ["solid", "単色"], ["gradient", "グラデーション"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => onSettingsChange({ bgType: val })}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                  settings.bgType === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {settings.bgType !== "transparent" && (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="color"
                value={settings.bgColor}
                onChange={e => onSettingsChange({ bgColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
              />
              {PRESET_BG_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onSettingsChange({ bgColor: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-md border-2 transition-all ${
                    settings.bgColor === c
                      ? "border-blue-500 scale-110"
                      : "border-slate-200 dark:border-zinc-600"
                  } ${c === "#ffffff" ? "shadow-sm" : ""}`}
                />
              ))}
              {settings.bgType === "gradient" && (
                <>
                  <span className="text-xs text-slate-400">→</span>
                  <input
                    type="color"
                    value={settings.bgColor2}
                    onChange={e => onSettingsChange({ bgColor2: e.target.value })}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Shape */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">形状</label>
          <div className="grid grid-cols-4 gap-1.5">
            {([
              ["square", "四角"],
              ["rounded", "角丸"],
              ["squircle", "iOSスタイル"],
              ["circle", "円形"],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => onSettingsChange({ bgShape: val })}
                className={`py-2 text-xs rounded-lg border transition-colors ${
                  settings.bgShape === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Padding */}
        <SliderRow
          label="余白（パディング）"
          min={0} max={40} step={1}
          value={settings.padding}
          onChange={v => onSettingsChange({ padding: v })}
          unit="%"
        />
      </div>

      {/* Border & decoration */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">枠線・装飾</h3>
          <button
            onClick={() => onSettingsChange({ border: !settings.border })}
            className={`relative w-11 h-6 rounded-full transition-colors ${settings.border ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-600"}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.border ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {settings.border && (
          <div className="space-y-3">
            <SliderRow
              label="枠線の太さ"
              min={1} max={12} step={1}
              value={settings.borderWidth}
              onChange={v => onSettingsChange({ borderWidth: v })}
              unit="px"
            />
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-500">枠線の色</label>
              <input
                type="color" value={settings.borderColor}
                onChange={e => onSettingsChange({ borderColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
              />
              {["#ffffff", "#000000", "#3b82f6", "#ef4444"].map(c => (
                <button key={c} onClick={() => onSettingsChange({ borderColor: c })}
                  style={{ backgroundColor: c }}
                  className="w-7 h-7 rounded-md border-2 border-slate-200 dark:border-zinc-600"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
