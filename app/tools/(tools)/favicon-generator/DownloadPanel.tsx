"use client";
import { useState, useCallback } from "react";
import type { FaviconSettings } from "./lib/favicon-lib";
import {
  renderFavicon, buildIco, canvasToBlob,
  buildWebManifest, buildHtmlCode, buildNextjsCode, buildWordPressCode, buildZip,
} from "./lib/favicon-lib";

interface Props {
  mainDataUrl: string;
  maskDataUrl: string;
  thumbUrls: Record<number, string>;
  settings: FaviconSettings;
  sourceImage: HTMLImageElement | null;
  onSettingsChange: (p: Partial<FaviconSettings>) => void;
}

type DownloadPreset = "recommended" | "pwa" | "custom";
type CodeTab = "html" | "nextjs" | "wordpress";

export function DownloadPanel({ settings, sourceImage, onSettingsChange }: Props) {
  const [preset, setPreset] = useState<DownloadPreset>("recommended");
  const [codeTab, setCodeTab] = useState<CodeTab>("html");
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState("");
  const [toast, setToast] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // Render a single size to blob
  const renderSize = useCallback(async (size: number, maskable = false): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const img = settings.proSubMode === "image" ? sourceImage ?? undefined : undefined;
    renderFavicon(canvas, { size, settings, imageEl: img, maskable });
    return canvasToBlob(canvas);
  }, [settings, sourceImage]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const downloadSingle = async (size: number, maskable = false) => {
    const blob = await renderSize(size, maskable);
    const name = maskable ? `favicon-${size}x${size}-maskable.png` : `favicon-${size}x${size}.png`;
    downloadBlob(blob, name);
    showToast(`${name} をダウンロードしました`);
  };

  const downloadIco = async () => {
    const sizes = [16, 32, 48];
    setProgress("favicon.ico を生成中...");
    const buffers: ArrayBuffer[] = [];
    for (const s of sizes) {
      const blob = await renderSize(s);
      buffers.push(await blob.arrayBuffer());
    }
    const ico = buildIco(sizes, buffers);
    downloadBlob(ico, "favicon.ico");
    setProgress("");
    showToast("favicon.ico をダウンロードしました");
  };

  const downloadZip = useCallback(async () => {
    setBuilding(true);
    setProgress("ファビコンを生成中...");

    try {
      const entries: { name: string; blob: Blob }[] = [];

      // Core sizes
      const coreSizes: [number, string][] = [
        [16, "favicon-16x16.png"],
        [32, "favicon-32x32.png"],
        [48, "favicon-48x48.png"],
        [96, "favicon-96x96.png"],
        [180, "apple-touch-icon.png"],
        [192, "favicon-192x192.png"],
        [512, "favicon-512x512.png"],
      ];

      for (const [size, name] of coreSizes) {
        setProgress(`${name} を生成中...`);
        entries.push({ name, blob: await renderSize(size) });
      }

      // Maskable
      if (settings.maskableEnabled || preset === "pwa") {
        setProgress("Maskable Iconを生成中...");
        entries.push({ name: "favicon-192x192-maskable.png", blob: await renderSize(192, true) });
        entries.push({ name: "favicon-512x512-maskable.png", blob: await renderSize(512, true) });
      }

      // favicon.ico (16, 32, 48)
      setProgress("favicon.ico を生成中...");
      const icoBuffers = await Promise.all([16, 32, 48].map(async s => {
        const b = await renderSize(s);
        return b.arrayBuffer();
      }));
      entries.push({ name: "favicon.ico", blob: buildIco([16, 32, 48], icoBuffers) });

      // Manifest
      const manifestJson = buildWebManifest(settings);
      entries.push({ name: "site.webmanifest", blob: new Blob([manifestJson], { type: "application/json" }) });

      setProgress("ZIPを作成中...");
      const zip = await buildZip(entries, settings);
      downloadBlob(zip, `favicon-${(settings.siteName || "toolbox").replace(/\s+/g, "-").toLowerCase()}.zip`);
      showToast("ZIPをダウンロードしました ✅");
    } catch (e) {
      showToast(`エラー: ${(e as Error).message}`);
    } finally {
      setBuilding(false);
      setProgress("");
    }
  }, [settings, preset, renderSize]);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const htmlCode = buildHtmlCode(settings);
  const nextjsCode = buildNextjsCode();
  const wpCode = buildWordPressCode();
  const manifestJson = buildWebManifest(settings);
  const codeContent = codeTab === "html" ? htmlCode : codeTab === "nextjs" ? nextjsCode : wpCode;

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Preset selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">出力プリセット</h3>
        <div className="space-y-2">
          {([
            ["recommended", "推奨セット（おすすめ）", "favicon.ico・PNG各サイズ・Apple Touch Icon・Maskable・Manifest・READMEをまとめてダウンロード"],
            ["pwa", "PWA完全セット", "推奨セットに加え、マニフェスト最適化・全Maskableサイズを含む完全なPWAパッケージ"],
            ["custom", "個別ダウンロード", "必要なサイズ・ファイルを1つずつダウンロード"],
          ] as const).map(([val, label, desc]) => (
            <button
              key={val}
              onClick={() => setPreset(val)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                preset === val
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              <div className={`text-sm font-medium ${preset === val ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-zinc-300"}`}>
                {preset === val ? "● " : "○ "}{label}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main download (ZIP) */}
      {(preset === "recommended" || preset === "pwa") && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <button
            onClick={downloadZip}
            disabled={building}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {building ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {progress || "生成中..."}
              </>
            ) : (
              <>⬇️ ZIPをダウンロード（全ファイル一括）</>
            )}
          </button>

          {/* What's included */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-xs text-slate-600 dark:text-zinc-400 space-y-1">
            <p className="font-medium text-slate-700 dark:text-zinc-300 mb-1">含まれるファイル</p>
            {[
              "favicon.ico（16/32/48px）",
              "favicon-16x16.png、32x32.png、48x48.png、96x96.png",
              "apple-touch-icon.png（180px）",
              "favicon-192x192.png・512x512.png",
              ...(settings.maskableEnabled ? ["favicon-192x192-maskable.png・512x512-maskable.png"] : []),
              "site.webmanifest",
              "install.html（HTMLコードサンプル）",
              "README.md（設置手順）",
            ].map((f, i) => <p key={i}>• {f}</p>)}
          </div>
        </div>
      )}

      {/* Individual downloads */}
      {preset === "custom" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300">個別ダウンロード</h3>

          {/* ICO */}
          <button onClick={downloadIco}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            ⬇️ favicon.ico（16/32/48px入り）
          </button>

          {/* PNG grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { size: 16, label: "PNG 16px" },
              { size: 32, label: "PNG 32px（標準）" },
              { size: 48, label: "PNG 48px" },
              { size: 96, label: "PNG 96px" },
              { size: 180, label: "PNG 180px（Apple）" },
              { size: 192, label: "PNG 192px（PWA）" },
              { size: 256, label: "PNG 256px" },
              { size: 512, label: "PNG 512px（最大）" },
            ].map(({ size, label }) => (
              <button key={size} onClick={() => downloadSingle(size)}
                className="py-2 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Maskable */}
          {settings.maskableEnabled && (
            <>
              <p className="text-xs text-slate-500 font-medium">Maskable Icon</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => downloadSingle(192, true)}
                  className="py-2 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl text-xs transition-colors"
                >
                  Maskable 192px
                </button>
                <button onClick={() => downloadSingle(512, true)}
                  className="py-2 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl text-xs transition-colors"
                >
                  Maskable 512px
                </button>
              </div>
            </>
          )}

          {/* Manifest */}
          <button
            onClick={() => downloadBlob(new Blob([manifestJson], { type: "application/json" }), "site.webmanifest")}
            className="w-full py-2 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs transition-colors"
          >
            📄 site.webmanifest
          </button>
        </div>
      )}

      {/* Code generation */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">HTMLへの設置コード</h3>

        {/* Code tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
          {([
            ["html", "HTML"],
            ["nextjs", "Next.js"],
            ["wordpress", "WordPress"],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setCodeTab(id)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                codeTab === id
                  ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="relative">
          <pre className="bg-slate-900 dark:bg-zinc-950 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
            {codeContent}
          </pre>
          <button
            onClick={() => copyCode(codeContent)}
            className={`absolute top-2 right-2 px-2.5 py-1 text-xs rounded-lg transition-colors ${
              copiedCode
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            {copiedCode ? "✅ コピー済み" : "コピー"}
          </button>
        </div>

        {codeTab === "nextjs" && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">💡 Next.js App Router おすすめの設置方法</p>
            <p>
              <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">app/favicon.ico</code> に配置するだけで自動認識されます。
              <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded ml-1">app/icon.png</code>・
              <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">app/apple-icon.png</code> も同様です。
            </p>
          </div>
        )}

        {/* Manifest preview */}
        <details className="text-xs">
          <summary className="text-slate-500 dark:text-zinc-500 cursor-pointer hover:text-slate-700 dark:hover:text-zinc-300 py-1">
            📄 site.webmanifest の内容を確認
          </summary>
          <pre className="mt-2 bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-slate-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap break-words">
            {manifestJson}
          </pre>
        </details>
      </div>

      {/* Site meta for manifest */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">PWA設定（manifest用）</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["themeColor", "テーマカラー"],
            ["bgPageColor", "背景色"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs text-slate-500 mb-1">{label}</label>
              <input type="color" value={settings[key] as string}
                onChange={e => onSettingsChange({ [key]: e.target.value })}
                className="w-full h-8 rounded border border-slate-200 dark:border-zinc-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
