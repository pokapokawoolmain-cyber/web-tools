"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, RotateCcw, Lock, Unlock } from "lucide-react";
import { SliderInput } from "@/components/ui/SliderInput";

// ─── プリセット ────────────────────────────────
type Preset = { label: string; w: number; h: number; desc: string };

const RATIO_PRESETS: { label: string; ratio: [number, number]; desc: string }[] = [
  { label: "16:9",  ratio: [16, 9],  desc: "YouTube・PC壁紙" },
  { label: "9:16",  ratio: [9, 16],  desc: "Stories・TikTok" },
  { label: "4:3",   ratio: [4, 3],   desc: "旧デジカメ・資料" },
  { label: "3:2",   ratio: [3, 2],   desc: "一眼レフ標準" },
  { label: "1:1",   ratio: [1, 1],   desc: "Instagram・アイコン" },
  { label: "2:3",   ratio: [2, 3],   desc: "ポートレート" },
];

const SIZE_PRESETS: Preset[] = [
  { label: "Twitter ヘッダー",    w: 1500, h: 500,  desc: "" },
  { label: "Instagram 投稿",      w: 1080, h: 1080, desc: "" },
  { label: "YouTube サムネ",      w: 1280, h: 720,  desc: "" },
  { label: "OGP画像",             w: 1200, h: 630,  desc: "" },
  { label: "iPhone壁紙",          w: 1170, h: 2532, desc: "" },
  { label: "A4（72dpi）",         w: 595,  h: 842,  desc: "" },
];

type ImageInfo = {
  src: string;
  origW: number;
  origH: number;
  name: string;
  type: string;
};

export function ImageResize() {
  const [image, setImage]         = useState<ImageInfo | null>(null);
  const [targetW, setTargetW]     = useState(1280);
  const [targetH, setTargetH]     = useState(720);
  const [lockRatio, setLockRatio] = useState(true);
  const [quality, setQuality]     = useState(90);
  const [format, setFormat]       = useState<"jpeg" | "png" | "webp">("jpeg");
  const [fitMode, setFitMode]     = useState<"crop" | "stretch">("crop");
  const [isDrag, setIsDrag]       = useState(false);
  const [preview, setPreview]     = useState<string | null>(null);

  const fileRef  = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 元の縦横比
  const origRatio = image ? image.origW / image.origH : 1;

  // 幅を変えたとき高さを連動
  const handleWidthChange = (w: number) => {
    setTargetW(w);
    if (lockRatio && image) setTargetH(Math.round(w / origRatio));
  };

  // 高さを変えたとき幅を連動
  const handleHeightChange = (h: number) => {
    setTargetH(h);
    if (lockRatio && image) setTargetW(Math.round(h * origRatio));
  };

  // 比率プリセット適用
  const applyRatioPreset = (rw: number, rh: number) => {
    const newW = targetW;
    const newH = Math.round((targetW * rh) / rw);
    setTargetW(newW);
    setTargetH(newH);
  };

  // サイズプリセット適用
  const applySizePreset = (p: Preset) => {
    setTargetW(p.w);
    setTargetH(p.h);
    setLockRatio(false);
  };

  // ファイル読み込み
  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage({ src: url, origW: img.width, origH: img.height, name: file.name, type: file.type });
      setTargetW(img.width);
      setTargetH(img.height);
    };
    img.src = url;
  }, []);

  // Canvas でリサイズしてプレビュー生成
  const renderPreview = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width  = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, targetW, targetH);
      if (fitMode === "crop") {
        // 中央基準で切り抜き（歪みなし）: 出力比率に合わせて元画像の中央部を切り出す
        const dstRatio = targetW / targetH;
        const srcRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (srcRatio > dstRatio) {
          sw = img.height * dstRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / dstRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      } else {
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }
      setPreview(canvas.toDataURL(`image/${format}`, quality / 100));
    };
    img.src = image.src;
  }, [image, targetW, targetH, format, quality, fitMode]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  // ダウンロード
  const download = () => {
    if (!preview) return;
    const ext = format === "jpeg" ? "jpg" : format;
    const base = image?.name.replace(/\.[^.]+$/, "") ?? "image";
    const a = document.createElement("a");
    a.href = preview;
    a.download = `${base}_${targetW}x${targetH}.${ext}`;
    a.click();
  };

  // リセット
  const reset = () => {
    if (image) { setTargetW(image.origW); setTargetH(image.origH); setLockRatio(true); }
  };

  const dropZoneClass = `border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
    isDrag
      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
      : "border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/10"
  }`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* アップロードゾーン */}
      {!image ? (
        <div
          className={dropZoneClass}
          onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="font-medium text-slate-700 dark:text-slate-300">
            画像をドロップ、またはクリックして選択
          </p>
          <p className="text-xs text-slate-400 mt-1">JPG・PNG・WebP・GIF 対応</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-6">

          {/* 元画像情報バー */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-xs">{image.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                元サイズ: {image.origW} × {image.origH} px
              </p>
            </div>
            <button onClick={() => { setImage(null); setPreview(null); }}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />別の画像を選ぶ
            </button>
          </div>

          {/* サイズプリセット */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">📐 比率プリセット</h2>
            <div className="flex flex-wrap gap-2">
              {RATIO_PRESETS.map(p => (
                <button key={p.label} onClick={() => applyRatioPreset(...p.ratio)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 rounded-xl transition-colors border border-transparent hover:border-blue-300 dark:hover:border-blue-700">
                  {p.label} <span className="text-slate-400 ml-1">{p.desc}</span>
                </button>
              ))}
            </div>

            <h2 className="font-bold text-slate-900 dark:text-white text-sm">🎯 サイズプリセット</h2>
            <div className="flex flex-wrap gap-2">
              {SIZE_PRESETS.map(p => (
                <button key={p.label} onClick={() => applySizePreset(p)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 rounded-xl transition-colors border border-transparent hover:border-blue-300 dark:hover:border-blue-700">
                  {p.label}
                  <span className="text-slate-400 ml-1">{p.w}×{p.h}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 幅・高さ入力 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">📏 サイズを指定</h2>
              <button onClick={() => setLockRatio(!lockRatio)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  lockRatio
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500"
                }`}>
                {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {lockRatio ? "比率を固定" : "比率フリー"}
              </button>
            </div>

            <SliderInput
              id="width"
              label="幅 (Width)"
              value={targetW}
              onChange={handleWidthChange}
              min={1}
              max={8000}
              step={1}
              unit="px"
              formatValue={(v) => `${v}px`}
            />
            <SliderInput
              id="height"
              label="高さ (Height)"
              value={targetH}
              onChange={handleHeightChange}
              min={1}
              max={8000}
              step={1}
              unit="px"
              formatValue={(v) => `${v}px`}
            />

            {/* 変換方法（比率が変わるときの扱い） */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">比率が変わるときの変換方法</p>
              <div className="flex gap-2">
                <button onClick={() => setFitMode("crop")}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                    fitMode === "crop"
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}>
                  中央切り抜き<span className="text-xs ml-1 text-emerald-500">歪みなし</span>
                </button>
                <button onClick={() => setFitMode("stretch")}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                    fitMode === "stretch"
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}>
                  引き伸ばし<span className="text-xs ml-1 text-slate-400">全体を残す</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                中央切り抜き: 被写体が歪まず、はみ出た部分がカットされます ／ 引き伸ばし: 画像全体が残りますが縦横比が変わると歪みます
              </p>
            </div>

            {/* 現在の比率表示 */}
            <p className="text-xs text-slate-400 text-center">
              現在の比率: {targetW}:{targetH}
              {" "}（{(targetW / targetH).toFixed(3)}:1）
              {" "}— 元: {image.origW}×{image.origH}
              {" "}→ 変換後: {targetW}×{targetH}px
            </p>
          </div>

          {/* 出力設定 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-5">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">⚙️ 出力設定</h2>

            {/* フォーマット */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">ファイル形式</p>
              <div className="flex gap-2">
                {(["jpeg", "png", "webp"] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                      format === f
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                        : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}>
                    {f.toUpperCase()}
                    {f === "webp" && <span className="text-xs ml-1 text-emerald-500">推奨</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 品質（PNG以外） */}
            {format !== "png" && (
              <SliderInput
                id="quality"
                label="品質"
                value={quality}
                onChange={setQuality}
                min={10}
                max={100}
                step={5}
                unit="%"
                formatValue={(v) => `${v}%`}
              />
            )}
          </div>

          {/* プレビュー & ダウンロード */}
          {preview && (
            <div className="space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">👁️ プレビュー</h2>
              <div className="relative bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/></svg>')] rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="プレビュー"
                  className="max-w-full max-h-64 mx-auto block object-contain" />
              </div>
              <div className="flex gap-3">
                <button onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-sm">
                  <RotateCcw className="w-4 h-4" />元のサイズに戻す
                </button>
                <button onClick={download}
                  className="flex-1 btn-primary justify-center">
                  <Download className="w-4 h-4" />
                  {targetW}×{targetH} でダウンロード
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas（非表示） */}
      <canvas ref={canvasRef} className="hidden" />

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ 画像はサーバーに送信されません。すべてブラウザ内で処理されます。
      </p>
    </div>
  );
}
