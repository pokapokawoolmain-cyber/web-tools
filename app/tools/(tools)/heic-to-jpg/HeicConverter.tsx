"use client";
// ========================================
// HEIC→JPG変換ツール
// heic2anyライブラリを使用（npm install heic2any）
// ========================================
import { useState, useCallback, useRef } from "react";
import { Upload, Download, AlertCircle } from "lucide-react";

type ConvertedFile = {
  name: string;
  url: string;
  size: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function HeicConverter() {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const heicFiles = fileArray.filter(
      (f) =>
        f.name.toLowerCase().endsWith(".heic") ||
        f.name.toLowerCase().endsWith(".heif") ||
        f.type === "image/heic" ||
        f.type === "image/heif"
    );

    if (heicFiles.length === 0) {
      setError("HEICまたはHEIFファイルを選択してください。");
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // heic2anyを動的インポート（SSRエラー防止）
      const heic2any = (await import("heic2any")).default;
      const newFiles: ConvertedFile[] = [];

      for (const file of heicFiles) {
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        const blob = Array.isArray(result) ? result[0] : result;
        const url = URL.createObjectURL(blob);
        const name = file.name.replace(/\.(heic|heif)$/i, ".jpg");

        newFiles.push({ name, url, size: blob.size });
      }

      setConvertedFiles((prev) => [...prev, ...newFiles]);
    } catch {
      setError(
        "変換に失敗しました。対応していないファイル形式の可能性があります。"
      );
    } finally {
      setIsConverting(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    convertFiles(e.dataTransfer.files);
  }, [convertFiles]);

  const handleDownload = (file: ConvertedFile) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 注意: heic2anyのインストールが必要 */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
        <p className="font-semibold mb-1">⚙️ セットアップが必要</p>
        <p>このツールを使うには <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">npm install heic2any</code> が必要です。</p>
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
          HEICファイルをドロップ、またはクリックして選択
        </p>
        <p className="text-sm text-slate-400 mt-1">.heic / .heif 対応</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".heic,.heif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && convertFiles(e.target.files)}
        />
      </div>

      {/* エラー */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {isConverting && (
        <div className="text-center text-sm text-slate-500 py-4">変換中...</div>
      )}

      {/* 変換済みファイル */}
      {convertedFiles.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white">
            変換完了（{convertedFiles.length}件）
          </h2>
          {convertedFiles.map((file, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(file)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                ダウンロード
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ ファイルはサーバーに送信されません。すべてブラウザ上で処理されます。
      </p>
    </div>
  );
}
