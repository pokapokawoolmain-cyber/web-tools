"use client";
// 画像選択 + 前処理 + プレビュー。アップロード自体は保存時に親が行う。
import { useEffect, useId, useRef, useState } from "react";
import { Camera, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { ImageProcessError, preprocessImage, type ProcessedImage } from "@/lib/goods/image/preprocess";
import { btn } from "@/lib/goods/ui";

export type ImageChange = { kind: "keep" } | { kind: "new"; img: ProcessedImage } | { kind: "remove" };

interface Props {
  label: string;
  currentUrl: string | null;
  value: ImageChange;
  onChange: (v: ImageChange) => void;
  aspect?: "square" | "wide";
  disabled?: boolean;
}

export function ImagePicker({ label, currentUrl, value, onChange, aspect = "square", disabled }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = value.kind === "new" ? value.img.previewUrl : value.kind === "keep" ? currentUrl : null;

  // プレビュー用 ObjectURL の解放
  useEffect(() => {
    if (value.kind !== "new") return;
    const url = value.img.previewUrl;
    return () => URL.revokeObjectURL(url);
  }, [value]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const img = await preprocessImage(file);
      onChange({ kind: "new", img });
    } catch (e) {
      setError(e instanceof ImageProcessError ? e.userMessage : "画像を読み込めませんでした。別の画像でお試しください。");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box = aspect === "square" ? "aspect-square w-full max-w-[240px]" : "aspect-[16/9] w-full";

  return (
    <div>
      <span className="block text-sm font-bold text-slate-800 dark:text-slate-100" id={`${inputId}-label`}>
        {label}
      </span>
      <div className={`relative mt-1.5 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800/60 ${box}`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- ローカルプレビュー / 署名URL
          <img src={preview} alt={`${label}のプレビュー`} className={`h-full w-full ${aspect === "wide" ? "object-cover" : "object-contain"}`} />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || processing}
            aria-label={`${label}を選ぶ・撮る`}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500 transition hover:bg-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-zinc-800"
          >
            <Camera className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm font-medium">写真を選ぶ・撮る</span>
          </button>
        )}
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 text-sm font-medium text-slate-700 dark:bg-zinc-900/80 dark:text-slate-200" role="status">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            画像を最適化しています…
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {preview && (
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled || processing} className={btn.secondary}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            変更
          </button>
          <button type="button" onClick={() => onChange({ kind: "remove" })} disabled={disabled || processing} className={btn.ghost}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            画像を外す
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {!error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">JPG・PNG・HEIC・WebP に対応。自動で縮小・圧縮し、位置情報は保存しません。</p>}
    </div>
  );
}
