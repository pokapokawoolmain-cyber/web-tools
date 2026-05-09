"use client";
// ========================================
// 画像圧縮ツール
// Canvas APIを使ったブラウザ完結の画像圧縮
// ========================================
import { useState, useRef, useCallback } from "react";
import { Upload, Download, X } from "lucide-react";

type CompressedImage = {
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  previewUrl: string;
  compressionRate: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Canvas APIで画像を圧縮する関数
async function compressImage(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas error")); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("圧縮に失敗しました"));
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    img.src = url;
  });
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsProcessing(true);
    const newResults: CompressedImage[] = [];

    for (const file of imageFiles) {
      try {
        const compressed = await compressImage(file, quality);
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
        });
      } catch {
        // エラーはスキップして次のファイルへ
      }
    }

    setResults((prev) => [...prev, ...newResults]);
    setIsProcessing(false);
  }, [quality]);

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
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6">
        <div className="flex justify-between items-center mb-3">
          <label className="font-medium text-slate-700 dark:text-slate-300 text-sm">
            圧縮品質
          </label>
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            {quality}%
          </span>
        </div>
        <input
          type="range"
          value={quality}
          min={10}
          max={100}
          step={5}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${quality}%, #e2e8f0 ${quality}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>高圧縮（ファイル小）</span>
          <span>高品質（ファイル大）</span>
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
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>{formatSize(result.originalSize)}</span>
                  <span>→</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {formatSize(result.compressedSize)}
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                    −{result.compressionRate.toFixed(0)}%
                  </span>
                </div>
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

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ 画像はサーバーに送信されません。すべてブラウザ上で処理されます。
      </p>
    </div>
  );
}
