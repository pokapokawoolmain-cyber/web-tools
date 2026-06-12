"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type BgShape = "square" | "rounded" | "circle";
type Mode = "text" | "image";

const CANVAS_SIZE = 256;

const PRESET_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#84cc16",
  "#1e293b", "#ffffff",
];

const PREVIEW_SIZES = [64, 32, 16] as const;

// ── ICO builder ──────────────────────────────────────────────────────
function buildIco(sizes: number[], pngBuffers: ArrayBuffer[]): Blob {
  const n = sizes.length;
  const headerSize = 6;
  const dirEntrySize = 16;

  let dataOffset = headerSize + n * dirEntrySize;
  const entries = pngBuffers.map((data, i) => {
    const entry = { size: sizes[i], data, offset: dataOffset };
    dataOffset += data.byteLength;
    return entry;
  });

  const buf = new ArrayBuffer(dataOffset);
  const view = new DataView(buf);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true); // ICO type
  view.setUint16(4, n, true);

  entries.forEach(({ size, data, offset }, i) => {
    const base = headerSize + i * dirEntrySize;
    view.setUint8(base, size >= 256 ? 0 : size);
    view.setUint8(base + 1, size >= 256 ? 0 : size);
    view.setUint8(base + 2, 0);
    view.setUint8(base + 3, 0);
    view.setUint16(base + 4, 1, true);
    view.setUint16(base + 6, 32, true);
    view.setUint32(base + 8, data.byteLength, true);
    view.setUint32(base + 12, offset, true);
  });

  entries.forEach(({ data, offset }) => {
    new Uint8Array(buf, offset).set(new Uint8Array(data));
  });

  return new Blob([buf], { type: "image/x-icon" });
}

// ── Component ────────────────────────────────────────────────────────
export function FaviconGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("🚀");
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [bgShape, setBgShape] = useState<BgShape>("rounded");
  const [fontSize, setFontSize] = useState(68);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
  const [toastMsg, setToastMsg] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Canvas drawing ─────────────────────────────────────────────────
  const drawToCanvas = useCallback(
    (canvas: HTMLCanvasElement, size: number, imgEl?: HTMLImageElement) => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      const r =
        bgShape === "circle"
          ? size / 2
          : bgShape === "rounded"
          ? size * 0.2
          : 0;

      // Background
      ctx.beginPath();
      if (r > 0 && typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, size, size, r);
      } else if (r > 0) {
        roundRectPath(ctx, 0, 0, size, size, r);
      } else {
        ctx.rect(0, 0, size, size);
      }
      ctx.fillStyle = bgColor;
      ctx.fill();

      // Clip to shape
      ctx.save();
      ctx.beginPath();
      if (r > 0 && typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, size, size, r);
      } else if (r > 0) {
        roundRectPath(ctx, 0, 0, size, size, r);
      } else {
        ctx.rect(0, 0, size, size);
      }
      ctx.clip();

      if (mode === "text") {
        const actualFontSize = Math.round(size * fontSize / 100);
        ctx.font = `bold ${actualFontSize}px sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text || "?", size / 2, size / 2 + size * 0.02);
      } else if (mode === "image" && imgEl) {
        const s = Math.min(imgEl.naturalWidth, imgEl.naturalHeight);
        const sx = (imgEl.naturalWidth - s) / 2;
        const sy = (imgEl.naturalHeight - s) / 2;
        ctx.drawImage(imgEl, sx, sy, s, s, 0, 0, size, size);
      }

      ctx.restore();
    },
    [bgColor, bgShape, fontSize, mode, text, textColor]
  );

  // ── Render all (main canvas + previews) ───────────────────────────
  const renderAll = useCallback(
    (imgEl?: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawToCanvas(canvas, CANVAS_SIZE, imgEl);

      const urls: Record<number, string> = {};
      for (const size of PREVIEW_SIZES) {
        const off = document.createElement("canvas");
        drawToCanvas(off, size, imgEl);
        urls[size] = off.toDataURL("image/png");
      }
      setPreviewUrls(urls);
    },
    [drawToCanvas]
  );

  useEffect(() => {
    if (mode === "image" && imageDataUrl) {
      const img = new Image();
      img.onload = () => renderAll(img);
      img.src = imageDataUrl;
    } else {
      renderAll();
    }
  }, [renderAll, mode, imageDataUrl]);

  // ── Toast ──────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // ── Downloads ─────────────────────────────────────────────────────
  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderOffscreen = (size: number): Promise<HTMLCanvasElement> => {
    const off = document.createElement("canvas");
    if (mode === "image" && imageDataUrl) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          drawToCanvas(off, size, img);
          resolve(off);
        };
        img.src = imageDataUrl;
      });
    }
    drawToCanvas(off, size);
    return Promise.resolve(off);
  };

  const downloadPng = async (size: number) => {
    const off = await renderOffscreen(size);
    off.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), `favicon-${size}x${size}.png`);
    }, "image/png");
    showToast(`PNG ${size}×${size}px をダウンロードしました`);
  };

  const downloadIco = async () => {
    const sizes = [16, 32, 48, 64];
    const pngBuffers: ArrayBuffer[] = [];

    for (const size of sizes) {
      const off = await renderOffscreen(size);
      const blob = await new Promise<Blob>((r) =>
        off.toBlob((b) => r(b!), "image/png")
      );
      pngBuffers.push(await blob.arrayBuffer());
    }

    const icoBlob = buildIco(sizes, pngBuffers);
    triggerDownload(URL.createObjectURL(icoBlob), "favicon.ico");
    showToast("favicon.ico をダウンロードしました");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target?.result as string);
      setMode("image");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl animate-fade-in">
          ✅ {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── 左カラム: 設定 ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* モード切替 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <div className="flex gap-2">
              {(["text", "image"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {m === "text" ? "✏️ テキスト・絵文字" : "🖼️ 画像をアップロード"}
                </button>
              ))}
            </div>

            {mode === "text" ? (
              <div className="space-y-4">
                {/* テキスト入力 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                    テキスト・絵文字（1〜3文字）
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 3))}
                    placeholder="A"
                    className="w-full px-3 py-3 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                    絵文字も使えます（例: 🔥 ⚡ 🌸 ✨ A B C 1 2 3）
                  </p>
                </div>

                {/* 文字サイズ */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                    文字サイズ: {fontSize}%
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={90}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 文字色 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                    文字・絵文字の色
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
                    />
                    {["#ffffff", "#000000", "#1e293b", "#3b82f6"].map((c) => (
                      <ColorSwatch
                        key={c}
                        color={c}
                        selected={textColor === c}
                        onClick={() => setTextColor(c)}
                      />
                    ))}
                    <span className="text-xs text-slate-400 font-mono">{textColor}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl text-slate-500 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
                >
                  {imageDataUrl
                    ? "✅ 画像を変更する（クリックして再選択）"
                    : "📷 クリックまたはドラッグで画像をアップロード"}
                </button>
                <p className="text-xs text-slate-400 dark:text-zinc-500">
                  PNG / JPG / WebP 対応。正方形に自動クロップされます。
                </p>
              </div>
            )}
          </div>

          {/* 背景設定 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              背景設定
            </h3>

            {/* 背景色 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                背景色
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-600"
                />
                {PRESET_COLORS.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    selected={bgColor === c}
                    onClick={() => setBgColor(c)}
                    size="md"
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-mono mt-1 block">{bgColor}</span>
            </div>

            {/* 形状 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                形状
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { key: "square" as BgShape, label: "四角", icon: "⬛" },
                    { key: "rounded" as BgShape, label: "角丸", icon: "🟦" },
                    { key: "circle" as BgShape, label: "円形", icon: "🔵" },
                  ] as const
                ).map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setBgShape(key)}
                    className={`flex-1 py-2.5 text-xs rounded-lg border transition-colors ${
                      bgShape === key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 右カラム: プレビューとダウンロード ───────────────────────── */}
        <div className="space-y-4">
          {/* プレビュー */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">
              プレビュー
            </h3>

            {/* メインキャンバス */}
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="rounded-xl shadow-sm"
                style={{ width: 160, height: 160 }}
              />
            </div>

            {/* サイズ別プレビュー */}
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mb-3">実際のサイズ感</p>
              <div className="flex items-end gap-5 flex-wrap">
                {PREVIEW_SIZES.map((size) => (
                  <div key={size} className="text-center">
                    {previewUrls[size] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={previewUrls[size]}
                        alt={`${size}px preview`}
                        width={size}
                        height={size}
                        style={{ imageRendering: size <= 32 ? "pixelated" : "auto" }}
                        className="rounded-sm"
                      />
                    ) : (
                      <div
                        style={{ width: size, height: size }}
                        className="bg-slate-100 dark:bg-zinc-800 rounded-sm"
                      />
                    )}
                    <p className="text-xs text-slate-400 mt-1">{size}px</p>
                  </div>
                ))}

                {/* ブラウザタブシミュレーション */}
                <div className="ml-2 flex-shrink-0">
                  <div className="bg-slate-100 dark:bg-zinc-800 rounded-t-lg px-2.5 py-1.5 flex items-center gap-1.5 border border-b-0 border-slate-200 dark:border-zinc-700 w-36">
                    {previewUrls[16] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={previewUrls[16]}
                        alt="tab favicon"
                        width={16}
                        height={16}
                        style={{ imageRendering: "pixelated", flexShrink: 0 }}
                      />
                    ) : (
                      <div className="w-4 h-4 bg-slate-300 dark:bg-zinc-600 rounded-sm flex-shrink-0" />
                    )}
                    <span className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                      サイトタイトル
                    </span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-t-0 border-slate-200 dark:border-zinc-700 h-2 rounded-b-sm w-36" />
                  <p className="text-xs text-slate-400 mt-1 text-center">タブイメージ</p>
                </div>
              </div>
            </div>
          </div>

          {/* ダウンロード */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              ダウンロード
            </h3>

            <button
              onClick={downloadIco}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              ⬇️ favicon.ico をダウンロード
              <span className="text-xs font-normal opacity-75">（16・32・48・64px 入り）</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadPng(256)}
                className="py-2.5 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors"
              >
                PNG 256px
              </button>
              <button
                onClick={() => downloadPng(32)}
                className="py-2.5 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors"
              >
                PNG 32px
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p className="font-semibold">💡 使い方ガイド</p>
              <p>• <strong>favicon.ico</strong> → HTMLの <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">&lt;link rel=&quot;icon&quot;&gt;</code> に指定</p>
              <p>• <strong>PNG 256px</strong> → Apple Touch Icon（スマホのホーム画面用）</p>
              <p>• すべてブラウザ完結・サーバー送信なし</p>
            </div>
          </div>

          {/* HTMLスニペット */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              HTMLに貼り付けるコード
            </h3>
            <pre className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-3 text-xs text-slate-600 dark:text-zinc-300 overflow-x-auto select-all">
{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32x32.png" type="image/png">
<link rel="apple-touch-icon" href="/favicon-256x256.png">`}
            </pre>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              ダウンロードしたファイルをサイトのルートに置き、上記を{" "}
              <code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">&lt;head&gt;</code> 内に追加してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────
function ColorSwatch({
  color,
  selected,
  onClick,
  size = "sm",
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "w-7 h-7" : "w-6 h-6";
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`${dim} rounded-md border-2 transition-all ${
        selected
          ? "border-blue-500 scale-110 ring-2 ring-blue-300 dark:ring-blue-700"
          : "border-slate-200 dark:border-zinc-600 hover:scale-105"
      } ${color === "#ffffff" ? "shadow-sm" : ""}`}
      title={color}
    />
  );
}

// ── Fallback roundRect ────────────────────────────────────────────────
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
