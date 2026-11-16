"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, Download, X, AlertCircle } from "lucide-react";
import { SliderInput } from "@/components/ui/SliderInput";
import { trackToolStarted, trackToolCompleted, trackToolFailed } from "@/lib/analytics/track";
import { InternalToolBanner } from "@/components/revenue/InternalToolBanner";

type CompressedImage = {
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  previewUrl: string;
  compressionRate: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
};

// 長辺の上限（0 は「元のまま」）
const MAX_EDGE_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "元のまま" },
  { value: 2560, label: "2560px" },
  { value: 1920, label: "1920px" },
  { value: 1280, label: "1280px" },
];
const DEFAULT_MAX_EDGE = 2560;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像の読み込みに失敗しました")); };
    img.src = url;
  });
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas error");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

// Canvas APIで画像を縮小・圧縮する関数（すべてブラウザ内で処理）
async function compressImage(
  file: File,
  quality: number,
  maxEdge: number
): Promise<{ blob: Blob; originalWidth: number; originalHeight: number; width: number; height: number }> {
  const img = await loadImage(file);
  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;
  const longEdge = Math.max(originalWidth, originalHeight);
  const scale = maxEdge > 0 && longEdge > maxEdge ? maxEdge / longEdge : 1;
  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));

  // 大きく縮小するときは半分ずつ段階的に縮めて、ギザギザを抑える
  let source: CanvasImageSource = img;
  let sw = originalWidth;
  let sh = originalHeight;
  while (sw / 2 >= width && sh / 2 >= height) {
    const nw = Math.round(sw / 2);
    const nh = Math.round(sh / 2);
    const step = makeCanvas(nw, nh);
    step.ctx.drawImage(source, 0, 0, sw, sh, 0, 0, nw, nh);
    source = step.canvas;
    sw = nw;
    sh = nh;
  }

  const { canvas, ctx } = makeCanvas(width, height);
  // JPEG は透明を持てないため、透明部分を白で塗ってから描く（黒くなるのを防ぐ）
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, sw, sh, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("圧縮に失敗しました"))),
      "image/jpeg",
      quality / 100
    );
  });
  return { blob, originalWidth, originalHeight, width, height };
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(80);
  const [maxEdge, setMaxEdge] = useState(DEFAULT_MAX_EDGE);
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsProcessing(true);
    const startedAt = trackToolStarted({ toolId: "image-compress", toolCategory: "image", toolName: "画像圧縮" });
    const newResults: CompressedImage[] = [];

    for (const file of imageFiles) {
      try {
        const { blob: compressed, originalWidth, originalHeight, width, height } =
          await compressImage(file, quality, maxEdge);
        const previewUrl = URL.createObjectURL(compressed);
        const compressionRate =
          ((file.size - compressed.size) / file.size) * 100;
        newResults.push({
          originalFile: file,
          originalSize: file.size,
          compressedBlob: compressed,
          compressedSize: compressed.size,
          previewUrl,
          compressionRate,
          originalWidth,
          originalHeight,
          width,
          height,
        });
      } catch {
        // エラーはスキップして次のファイルへ
      }
    }

    setResults((prev) => [...prev, ...newResults]);
    setIsProcessing(false);

    if (newResults.length > 0) {
      trackToolCompleted({
        toolId: "image-compress",
        toolCategory: "image",
        toolName: "画像圧縮",
        completionType: "processed",
        durationMs: Date.now() - startedAt,
        itemCount: newResults.length,
      });
    } else {
      trackToolFailed({ toolId: "image-compress", toolCategory: "image", toolName: "画像圧縮", errorStage: "compress" });
    }
  }, [quality, maxEdge]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDownload = (result: CompressedImage) => {
    const a = document.createElement("a");
    a.href = result.previewUrl;
    a.download = `compressed_${result.originalFile.name.replace(/\.[^.]+$/, "")}.jpg`;
    a.click();
  };

  const handleRemove = (index: number) => {
    setResults((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 圧縮品質設定 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-3">
        <SliderInput
          id="quality"
          label="圧縮品質"
          value={quality}
          onChange={setQuality}
          min={1}
          max={100}
          step={1}
          unit="%"
          formatValue={(v) => `${v}%`}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>← 高圧縮（ファイル小）</span>
          <span>高品質（ファイル大）→</span>
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">長辺の上限</p>
          <div className="grid grid-cols-4 gap-2">
            {MAX_EDGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMaxEdge(opt.value)}
                aria-pressed={maxEdge === opt.value}
                className={`py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                  maxEdge === opt.value
                    ? "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:border-blue-600 dark:text-blue-300"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            写真は縦横を縮めると大きく軽くなります。上限より小さい画像はそのままの大きさです。
          </p>
        </div>
      </div>

      {/* ドロップゾーン */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
            : "border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/10"
        }`}
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-medium text-slate-700 dark:text-slate-300">
          画像をドロップ、またはクリックして選択
        </p>
        <p className="text-sm text-slate-400 mt-1">JPG・PNG・WebP対応</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {isProcessing && (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
          圧縮中...
        </div>
      )}

      {/* 結果リスト */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white">
            圧縮結果（{results.length}件）
          </h2>
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center gap-4"
            >
              {/* プレビュー */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.previewUrl}
                alt={result.originalFile.name}
                className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
              />

              {/* 情報 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                  {result.originalFile.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                  <span>{formatSize(result.originalSize)}</span>
                  <span>→</span>
                  <span className={`font-medium ${result.compressionRate > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {formatSize(result.compressedSize)}
                  </span>
                  {result.compressionRate > 0 ? (
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                      −{result.compressionRate.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {result.compressionRate < 0 ? "元より大きくなりました" : "これ以上小さくなりません"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {result.width === result.originalWidth && result.height === result.originalHeight
                    ? `${result.width}×${result.height}px（大きさは元のまま）`
                    : `${result.originalWidth}×${result.originalHeight}px → ${result.width}×${result.height}px`}
                </p>
                {result.compressionRate <= 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    {result.compressionRate < 0
                      ? "圧縮すると元のファイルより大きくなります。この画像は元のファイルをそのままお使いください。"
                      : "この画像はこれ以上小さくなりません。元のファイルをそのままお使いいただくか、長辺の上限を小さくしてお試しください。"}
                  </p>
                )}
              </div>

              {/* アクション */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(result)}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                  aria-label="ダウンロード"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="削除"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length >= 2 && <InternalToolBanner toolId="image-compress" />}

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ 画像はサーバーに送信されません。すべてブラウザ上で処理されます。
      </p>
    </div>
  );
}
