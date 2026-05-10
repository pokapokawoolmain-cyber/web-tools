"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, Printer, RotateCcw, Wand2, Check, Loader2 } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

// Photo size presets (mm) — will render at 300dpi on canvas
type SizePreset = { id: string; label: string; w: number; h: number; desc: string };
const SIZES: SizePreset[] = [
  { id: "resume", label: "履歴書", w: 30, h: 40, desc: "30×40mm" },
  { id: "mynumber", label: "マイナンバー", w: 35, h: 45, desc: "35×45mm" },
  { id: "passport", label: "パスポート", w: 35, h: 45, desc: "35×45mm" },
  { id: "license", label: "運転免許", w: 24, h: 30, desc: "24×30mm" },
  { id: "exam", label: "受験用", w: 30, h: 40, desc: "30×40mm" },
];

const BG_COLORS = [
  { label: "白", value: "#ffffff" },
  { label: "ライトグレー", value: "#e8ecf0" },
  { label: "ブルー", value: "#a8c4e0" },
];

// mm to px at 300dpi
const mmToPx = (mm: number) => Math.round((mm / 25.4) * 300);

export function IdPhoto() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizePreset>(SIZES[0]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDrag, setIsDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<"edit" | "preview" | "print">("edit");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [printUrl, setPrintUrl] = useState<string | null>(null);

  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgRemoved, setBgRemoved] = useState(false);

  // Use processed (transparent) image if available
  const activeSrc = processedSrc ?? imgSrc;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const EDITOR_W = 240; // px, display size of editor
  const EDITOR_H = Math.round(EDITOR_W * (selectedSize.h / selectedSize.w));

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setProcessedSrc(null);
    setBgRemoved(false);
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setMode("edit");
    setPreviewUrl(null);
  }, []);

  // Drag events for repositioning
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  }, [isDragging, dragStart]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offsetX, y: t.clientY - offsetY });
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setOffsetX(t.clientX - dragStart.x);
    setOffsetY(t.clientY - dragStart.y);
  };

  // BFS flood-fill background removal from image edges
  const handleRemoveBg = useCallback(async () => {
    if (!imgSrc) return;
    setIsRemovingBg(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 1500;
          const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
          const w = Math.round(img.width * ratio);
          const h = Math.round(img.height * ratio);

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);

          const imageData = ctx.getImageData(0, 0, w, h);
          const d = imageData.data;

          // Sample background color from 8 edge points
          const samples: [number, number][] = [
            [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
            [w >> 1, 0], [0, h >> 1], [w - 1, h >> 1], [w >> 1, h - 1],
          ];
          let sr = 0, sg = 0, sb = 0;
          for (const [x, y] of samples) {
            const i = (y * w + x) * 4;
            sr += d[i]; sg += d[i + 1]; sb += d[i + 2];
          }
          sr = Math.round(sr / samples.length);
          sg = Math.round(sg / samples.length);
          sb = Math.round(sb / samples.length);

          const TOLERANCE = 40;
          const dist = (i: number) => {
            const dr = d[i] - sr, dg = d[i + 1] - sg, db = d[i + 2] - sb;
            return Math.sqrt(dr * dr + dg * dg + db * db);
          };

          // BFS from all border pixels
          const visited = new Uint8Array(w * h);
          const queue: number[] = [];
          const seed = (x: number, y: number) => {
            const idx = y * w + x;
            if (!visited[idx]) { visited[idx] = 1; queue.push(idx); }
          };
          for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
          for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

          let qi = 0;
          while (qi < queue.length) {
            const idx = queue[qi++];
            const pi = idx * 4;
            if (dist(pi) > TOLERANCE) continue;
            // Smooth edge: partial alpha based on distance
            const fade = Math.min(dist(pi) / TOLERANCE, 1);
            d[pi + 3] = Math.round(fade * fade * 255);

            const x = idx % w, y = (idx / w) | 0;
            const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dx, dy] of dirs) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
              const ni = ny * w + nx;
              if (!visited[ni]) { visited[ni] = 1; queue.push(ni); }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const url = canvas.toDataURL("image/png");
          setProcessedSrc(url);
          setBgRemoved(true);
          resolve();
        };
        img.onerror = () => reject(new Error("load error"));
        img.src = imgSrc;
      });
    } catch (e) {
      console.error("BG removal failed:", e);
    } finally {
      setIsRemovingBg(false);
    }
  }, [imgSrc]);

  // Render single photo to canvas
  const renderPhoto = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!activeSrc) { reject("no image"); return; }
      const pw = mmToPx(selectedSize.w);
      const ph = mmToPx(selectedSize.h);
      const canvas = document.createElement("canvas");
      canvas.width = pw;
      canvas.height = ph;
      const ctx = canvas.getContext("2d")!;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, pw, ph);

      const img = new Image();
      img.onload = () => {
        const scaleRatio = pw / EDITOR_W;
        const drawW = img.width * scale * scaleRatio;
        const drawH = img.height * scale * scaleRatio;
        const startX = (pw - drawW) / 2 + offsetX * scaleRatio;
        const startY = (ph - drawH) / 2 + offsetY * scaleRatio;
        ctx.drawImage(img, startX, startY, drawW, drawH);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.onerror = () => reject("load error");
      img.src = activeSrc;
    });
  }, [activeSrc, selectedSize, bgColor, scale, offsetX, offsetY, EDITOR_W]);

  const handleGenerate = async () => {
    try {
      const url = await renderPhoto();
      setPreviewUrl(url);
      setMode("preview");
    } catch (e) { console.error(e); }
  };

  // Conveni print: L-size (89x127mm at 300dpi) with 4 photos
  const handlePrint = async () => {
    try {
      const photoUrl = await renderPhoto();
      const LW = mmToPx(89);
      const LH = mmToPx(127);
      const canvas = document.createElement("canvas");
      canvas.width = LW;
      canvas.height = LH;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, LW, LH);

      const img = new Image();
      img.onload = () => {
        const pw = mmToPx(selectedSize.w);
        const ph = mmToPx(selectedSize.h);
        const margin = mmToPx(3);
        const positions = [
          { x: margin, y: margin },
          { x: margin + pw + margin, y: margin },
          { x: margin, y: margin + ph + margin },
          { x: margin + pw + margin, y: margin + ph + margin },
        ];
        for (const pos of positions) {
          ctx.drawImage(img, pos.x, pos.y, pw, ph);
        }
        setPrintUrl(canvas.toDataURL("image/jpeg", 0.95));
        setMode("print");
      };
      img.src = photoUrl;
    } catch (e) { console.error(e); }
  };

  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">証明写真作成</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">履歴書・マイナンバー・パスポート対応。ブラウザで完結。</p>
        </div>

        {/* Step 1: Upload */}
        {!imgSrc ? (
          <section>
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">写真をアップロード</p>
            <div
              className={`bg-white dark:bg-zinc-900 rounded-2xl p-10 text-center cursor-pointer border-2 border-dashed transition-all ${isDrag ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-slate-200 dark:border-zinc-700 hover:border-slate-300"}`}
              onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) loadImage(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
              onDragLeave={() => setIsDrag(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300">写真をドロップ、またはタップして選択</p>
              <p className="text-[13px] text-slate-400 mt-1">JPG・PNG・HEIC対応</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} />
            </div>
          </section>
        ) : mode === "edit" ? (
          <>
            {/* Step 2: Size selection */}
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">サイズを選択</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                {SIZES.map(s => (
                  <button key={s.id} onClick={() => setSelectedSize(s)}
                    className="w-full flex items-center px-5 py-[13px] hover:opacity-70 transition-opacity">
                    <span className="text-[15px] text-slate-900 dark:text-white flex-1 text-left">{s.label}</span>
                    <span className="text-[13px] text-slate-400 mr-3">{s.desc}</span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSize.id === s.id ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-zinc-600"}`}>
                      {selectedSize.id === s.id && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Background color */}
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">背景色</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 space-y-4">
                <div className="flex gap-4">
                  {BG_COLORS.map(c => (
                    <button key={c.value} onClick={() => setBgColor(c.value)}
                      className="flex flex-col items-center gap-2">
                      <span className={`w-10 h-10 rounded-full border-2 transition-all ${bgColor === c.value ? "border-blue-500 scale-110" : "border-slate-200 dark:border-zinc-700"}`}
                        style={{ backgroundColor: c.value }} />
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">{c.label}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-zinc-800 pt-3">
                  {bgRemoved ? (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[13px] text-green-600 dark:text-green-400 font-medium">
                        <Check className="w-4 h-4" />背景除去済み
                      </span>
                      <button
                        onClick={() => { setProcessedSrc(null); setBgRemoved(false); }}
                        className="text-[12px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        元の写真に戻す
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRemoveBg}
                      disabled={isRemovingBg}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[14px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                      {isRemovingBg ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />背景を解析中…</>
                      ) : (
                        <><Wand2 className="w-4 h-4" />背景を自動除去して色を変更</>
                      )}
                    </button>
                  )}
                  <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-1.5">
                    {bgRemoved ? "上の色を選んで背景色を変更できます" : "背景除去後、上の色が反映されます"}
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4: Editor */}
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">顔の位置を調整</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 space-y-4">
                {/* Crop viewport */}
                <div className="flex justify-center">
                  <div
                    ref={editorRef}
                    className="relative overflow-hidden rounded-xl border-2 border-blue-400 cursor-grab active:cursor-grabbing select-none"
                    style={{ width: EDITOR_W, height: EDITOR_H, backgroundColor: bgColor }}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => setIsDragging(false)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeSrc!}
                      alt="編集中の写真"
                      draggable={false}
                      className="absolute pointer-events-none"
                      style={{
                        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`,
                        top: "50%",
                        left: "50%",
                        maxWidth: "none",
                        width: "auto",
                        height: "auto",
                      }}
                    />
                    {/* Guide lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/30" />
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-400 text-center">ドラッグして顔の位置を調整</p>

                {/* Zoom slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500 dark:text-zinc-400">ズーム</span>
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{Math.round(scale * 100)}%</span>
                  </div>
                  <input type="range" min={0.5} max={3} step={0.05} value={scale}
                    onChange={e => setScale(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-zinc-700"
                    style={{ background: `linear-gradient(to right, #3b82f6 ${((scale - 0.5) / 2.5) * 100}%, #e2e8f0 ${((scale - 0.5) / 2.5) * 100}%)` }}
                  />
                </div>
              </div>
            </section>

            {/* Reset + Generate buttons */}
            <div className="space-y-3">
              <button onClick={handleGenerate}
                className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity">
                証明写真を生成
              </button>
              <button onClick={() => { setImgSrc(null); setMode("edit"); }}
                className="w-full py-[14px] text-[15px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />別の写真を選ぶ
              </button>
            </div>
          </>
        ) : mode === "preview" && previewUrl ? (
          <>
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">プレビュー</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex justify-center" style={{ backgroundColor: "#f0f0f0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="証明写真プレビュー"
                  className="rounded shadow-md"
                  style={{ height: 180 }} />
              </div>
            </section>

            <div className="space-y-3">
              <button onClick={() => download(previewUrl, `id-photo-${selectedSize.id}.jpg`)}
                className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />JPGでダウンロード
              </button>
              <button onClick={handlePrint}
                className="w-full py-[14px] text-[15px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />コンビニ印刷用（L判4枚）を生成
              </button>
              <button onClick={() => setMode("edit")}
                className="w-full py-[14px] text-[15px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 active:opacity-80 transition-opacity">
                位置を調整し直す
              </button>
            </div>
          </>
        ) : mode === "print" && printUrl ? (
          <>
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">コンビニ印刷用（L判）</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex justify-center" style={{ backgroundColor: "#f0f0f0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={printUrl} alt="L判4枚配置プレビュー"
                  className="rounded shadow-md"
                  style={{ maxWidth: "100%", maxHeight: 280 }} />
              </div>
              <p className="text-[12px] text-slate-400 text-center mt-2">L判（89×127mm）に4枚配置済み</p>
            </section>

            <div className="space-y-3">
              <button onClick={() => download(printUrl, `id-photo-L-print.jpg`)}
                className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />L判データをダウンロード
              </button>
              <button onClick={() => setMode("preview")}
                className="w-full py-[14px] text-[15px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 active:opacity-80 transition-opacity">
                戻る
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 text-[13px] text-amber-700 dark:text-amber-400">
              <p className="font-medium mb-1">コンビニ印刷の手順</p>
              <ol className="space-y-1 list-decimal list-inside opacity-90">
                <li>ダウンロードした画像をスマホに保存</li>
                <li>コンビニのマルチコピー機で「写真プリント」を選択</li>
                <li>「L判」サイズで印刷（フチなし推奨）</li>
              </ol>
            </div>
          </>
        ) : null}

        <p className="text-[12px] text-slate-400 dark:text-zinc-600 text-center">
          ✅ 写真はサーバーに送信されません。すべてブラウザ内で処理されます。
        </p>

        <RelatedTools currentId="id-photo" category="画像・PDF" />
      </div>
    </div>
  );
}
