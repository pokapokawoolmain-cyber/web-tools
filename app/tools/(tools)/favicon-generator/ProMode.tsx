"use client";
import { useRef, useState, useCallback } from "react";
import type { FaviconSettings, ImageAnalysis } from "./lib/favicon-lib";
import { analyzeImage } from "./lib/favicon-lib";

interface Props {
  settings: FaviconSettings;
  sourceImage: HTMLImageElement | null;
  analysis?: ImageAnalysis | null;
  onSettingsChange: (p: Partial<FaviconSettings>) => void;
  onImageChange: (img: HTMLImageElement, analysis: ImageAnalysis, dataUrl: string) => void;
}

const PRESET_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#84cc16",
  "#1e293b", "#ffffff",
];

type ProTab = "text" | "image" | "maskable";

export function ProMode({ settings, sourceImage, onSettingsChange, onImageChange }: Props) {
  const [tab, setTab] = useState<ProTab>("text");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      let blob: Blob = file;
      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        const heic2any = (await import("heic2any")).default;
        const conv = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        blob = Array.isArray(conv) ? conv[0] : conv;
      }
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("画像を読み込めませんでした。"));
        img.src = url;
      });
      if (img.naturalWidth > 8192 || img.naturalHeight > 8192)
        throw new Error("画像が大きすぎます（最大8192px）。");

      const anal = analyzeImage(img, file);
      onSettingsChange({ proSubMode: "image" });
      onImageChange(img, anal, url);
      setTab("image");
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }, [onSettingsChange, onImageChange]);

  const SliderRow = ({
    label, min, max, value, onChange, unit = "",
  }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit?: string }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <label className="font-medium text-slate-600 dark:text-zinc-400">{label}</label>
        <span className="text-slate-500">{value}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <input type="number" min={min} max={max} value={value}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
          className="w-14 text-xs text-center rounded border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 py-1"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Sub tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
        {([
          ["text", "✏️ テキスト・絵文字"],
          ["image", "🖼️ 画像"],
          ["maskable", "🎭 Maskable設定"],
        ] as const).map(([id, label]) => (
          <button key={id} onClick={() => {
            setTab(id);
            if (id === "text") onSettingsChange({ proSubMode: "text" });
            if (id === "image") onSettingsChange({ proSubMode: "image" });
          }}
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

      {/* ── Text tab ──────────────────────────────────────────────────────── */}
      {tab === "text" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">テキスト・絵文字（1〜3文字）</label>
            <input
              type="text"
              value={settings.text}
              onChange={e => onSettingsChange({ text: e.target.value.slice(0, 3) })}
              placeholder="A"
              className="w-full px-3 py-3 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-3xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {settings.text.length > 1 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠️ 2文字以上は16pxでは読めない場合があります。1文字推奨。</p>
            )}
          </div>

          <SliderRow label="文字サイズ" min={30} max={90} value={settings.fontSize} onChange={v => onSettingsChange({ fontSize: v })} unit="%" />

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">文字・絵文字の色</label>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="color" value={settings.textColor}
                onChange={e => onSettingsChange({ textColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
              />
              {["#ffffff", "#000000", "#1e293b", "#3b82f6", "#ef4444"].map(c => (
                <button key={c} onClick={() => onSettingsChange({ textColor: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-md border-2 transition-all ${settings.textColor === c ? "border-blue-500 scale-110" : "border-slate-200 dark:border-zinc-600"} ${c === "#ffffff" ? "shadow-sm" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Background for text */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">背景色</label>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="color" value={settings.bgColor}
                onChange={e => onSettingsChange({ bgColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
              />
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => onSettingsChange({ bgColor: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-md border-2 transition-all ${settings.bgColor === c ? "border-blue-500 scale-110" : "border-slate-200 dark:border-zinc-600"} ${c === "#ffffff" ? "shadow-sm" : ""}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">背景の形状</label>
            <div className="grid grid-cols-4 gap-1.5">
              {([["square", "四角"], ["rounded", "角丸"], ["squircle", "iOSスタイル"], ["circle", "円形"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => onSettingsChange({ bgShape: val })}
                  className={`py-2 text-xs rounded-lg border transition-colors ${
                    settings.bgShape === val
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Image tab ────────────────────────────────────────────────────── */}
      {tab === "image" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <input ref={fileRef} type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/heic,.heic"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }}
            />
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl text-slate-500 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
            >
              {uploading ? "読み込み中..." : sourceImage ? "✅ 画像を変更（クリック）" : "📷 画像をアップロード"}
            </button>
            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Image adjustments */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300">画像調整</h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">切り抜き方式</label>
              <div className="flex gap-2">
                {([["cover", "枠を埋める"], ["contain", "全体を収める"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => onSettingsChange({ cropMode: val })}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                      settings.cropMode === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >{label}</button>
                ))}
              </div>
            </div>

            <SliderRow label="余白" min={0} max={40} value={settings.padding} onChange={v => onSettingsChange({ padding: v })} unit="%" />
            <SliderRow label="明るさ" min={0} max={200} value={settings.brightness} onChange={v => onSettingsChange({ brightness: v })} />
            <SliderRow label="コントラスト" min={0} max={200} value={settings.contrast} onChange={v => onSettingsChange({ contrast: v })} />
            <SliderRow label="彩度" min={0} max={200} value={settings.saturation} onChange={v => onSettingsChange({ saturation: v })} />

            {(settings.brightness !== 100 || settings.contrast !== 100 || settings.saturation !== 100) && (
              <button
                onClick={() => onSettingsChange({ brightness: 100, contrast: 100, saturation: 100 })}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                フィルターをリセット
              </button>
            )}
          </div>

          {/* Background */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300">背景設定</h3>
            <div className="flex gap-2">
              {([["transparent", "なし"], ["solid", "単色"], ["gradient", "グラデーション"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => onSettingsChange({ bgType: val })}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                    settings.bgType === val
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >{label}</button>
              ))}
            </div>
            {settings.bgType !== "transparent" && (
              <div className="flex items-center gap-2 flex-wrap">
                <input type="color" value={settings.bgColor}
                  onChange={e => onSettingsChange({ bgColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
                />
                {PRESET_COLORS.slice(0, 8).map(c => (
                  <button key={c} onClick={() => onSettingsChange({ bgColor: c })}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-md border-2 ${settings.bgColor === c ? "border-blue-500 scale-110" : "border-slate-200 dark:border-zinc-600"} ${c === "#ffffff" ? "shadow-sm" : ""}`}
                  />
                ))}
                {settings.bgType === "gradient" && (
                  <>
                    <span className="text-xs text-slate-400">→</span>
                    <input type="color" value={settings.bgColor2}
                      onChange={e => onSettingsChange({ bgColor2: e.target.value })}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
                    />
                  </>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">形状</label>
              <div className="grid grid-cols-4 gap-1.5">
                {([["square", "四角"], ["rounded", "角丸"], ["squircle", "iOSスタイル"], ["circle", "円形"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => onSettingsChange({ bgShape: val })}
                    className={`py-2 text-xs rounded-lg border transition-colors ${
                      settings.bgShape === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Maskable tab ─────────────────────────────────────────────────── */}
      {tab === "maskable" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Maskable Icon設定</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
              AndroidのPWAアイコンでは、端末によって円形・四角などに自動マスクされます。
              コンテンツを中央80%（安全領域）に収める必要があります。
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-zinc-300">Maskable Iconを生成する</span>
            <button
              onClick={() => onSettingsChange({ maskableEnabled: !settings.maskableEnabled })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.maskableEnabled ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-600"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.maskableEnabled ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {settings.maskableEnabled && (
            <>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-medium text-slate-600 dark:text-zinc-400">安全領域内のスケール</label>
                  <span className="text-slate-500">{Math.round(settings.maskableScale * 100)}%</span>
                </div>
                <input type="range" min={60} max={95} value={Math.round(settings.maskableScale * 100)}
                  onChange={e => onSettingsChange({ maskableScale: Number(e.target.value) / 100 })}
                  className="w-full accent-blue-600"
                />
                <p className="text-xs text-slate-400 mt-1">
                  80-85%推奨。高いほど大きく表示されますが、マスク時に端が切れる場合があります。
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-zinc-300">安全領域を表示</span>
                <button
                  onClick={() => onSettingsChange({ showSafeZone: !settings.showSafeZone })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.showSafeZone ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-600"}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.showSafeZone ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <p className="font-semibold">⚠️ Maskable Iconの注意点</p>
                <p>• 背景は必ず不透明にしてください（現在: {settings.bgType === "transparent" ? "❌ 透明" : "✅ 設定あり"}）</p>
                <p>• 通常版とは別ファイルとして生成されます</p>
                <p>• Maskable版を通常版として使用しないでください</p>
              </div>

              {settings.bgType === "transparent" && (
                <button
                  onClick={() => onSettingsChange({ bgType: "solid", bgColor: "#3b82f6" })}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-xl transition-colors"
                >
                  🔧 背景色を設定する（必須）
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Small size optimization */}
      {tab !== "maskable" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">小サイズ個別最適化</h3>
              <p className="text-xs text-slate-500 mt-0.5">16px・32pxの見え方を個別に調整</p>
            </div>
            <button
              onClick={() => onSettingsChange({ smallSizeOptimize: !settings.smallSizeOptimize })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.smallSizeOptimize ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-600"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.smallSizeOptimize ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {settings.smallSizeOptimize && (
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-medium text-slate-600 dark:text-zinc-400">16px コンテンツスケール</label>
                  <span className="text-slate-500">{Math.round(settings.s16Scale * 100)}%</span>
                </div>
                <input type="range" min={80} max={120} value={Math.round(settings.s16Scale * 100)}
                  onChange={e => onSettingsChange({ s16Scale: Number(e.target.value) / 100 })}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-medium text-slate-600 dark:text-zinc-400">32px コンテンツスケール</label>
                  <span className="text-slate-500">{Math.round(settings.s32Scale * 100)}%</span>
                </div>
                <input type="range" min={80} max={120} value={Math.round(settings.s32Scale * 100)}
                  onChange={e => onSettingsChange({ s32Scale: Number(e.target.value) / 100 })}
                  className="w-full accent-blue-600"
                />
              </div>
              <p className="text-xs text-slate-400">
                100%=マスター設定と同じ。100%超=小さいサイズでコンテンツを大きく表示。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
