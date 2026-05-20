"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, Printer, RotateCcw, Wand2, Check, Loader2 } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

type SizePreset = { id: string; label: string; w: number; h: number; desc: string };
const SIZES: SizePreset[] = [
  { id: "resume",   label: "履歴書",       w: 30, h: 40, desc: "30×40mm" },
  { id: "mynumber", label: "マイナンバー",  w: 35, h: 45, desc: "35×45mm" },
  { id: "passport", label: "パスポート",    w: 35, h: 45, desc: "35×45mm" },
  { id: "license",  label: "運転免許",      w: 24, h: 30, desc: "24×30mm" },
  { id: "exam",     label: "受験用",        w: 30, h: 40, desc: "30×40mm" },
];

const BG_COLORS = [
  { label: "白",         value: "#ffffff" },
  { label: "ライトグレー", value: "#e8ecf0" },
  { label: "ブルー",     value: "#a8c4e0" },
];

const mmToPx = (mm: number) => Math.round((mm / 25.4) * 300);

export function IdPhoto() {
  const [imgSrc, setImgSrc]               = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<SizePreset>(SIZES[0]);
  const [bgColor, setBgColor]             = useState("#ffffff");
  const [scale, setScale]                 = useState(1);
  const [fillScale, setFillScale]         = useState(1);   // scale at which image fills editor
  const [offsetX, setOffsetX]             = useState(0);
  const [offsetY, setOffsetY]             = useState(0);
  const [isDrag, setIsDrag]               = useState(false);
  const [isDragging, setIsDragging]       = useState(false);
  const [dragStart, setDragStart]         = useState({ x: 0, y: 0 });
  const [mode, setMode]                   = useState<"edit" | "preview" | "print">("edit");
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [printUrl, setPrintUrl]           = useState<string | null>(null);
  const [processedSrc, setProcessedSrc]   = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg]   = useState(false);
  const [bgRemoved, setBgRemoved]         = useState(false);

  const activeSrc = processedSrc ?? imgSrc;

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const editorRef     = useRef<HTMLDivElement>(null);
  const fillScaleRef  = useRef(fillScale);
  const scaleRef      = useRef(scale);
  useEffect(() => { fillScaleRef.current = fillScale; }, [fillScale]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const EDITOR_W = 240;
  const EDITOR_H = Math.round(EDITOR_W * (selectedSize.h / selectedSize.w));

  // ── image load ────────────────────────────────────────────────────────────
  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const tmp = new Image();
    tmp.onload = () => {
      const fs = Math.max(EDITOR_W / tmp.naturalWidth, EDITOR_H / tmp.naturalHeight);
      setFillScale(fs);
      setScale(fs);
      setImgSrc(url);
      setProcessedSrc(null);
      setBgRemoved(false);
      setOffsetX(0);
      setOffsetY(0);
      setMode("edit");
      setPreviewUrl(null);
    };
    tmp.src = url;
  }, [EDITOR_W, EDITOR_H]);

  // ── mouse drag ────────────────────────────────────────────────────────────
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

  // ── touch drag (touchAction:none on editor prevents page scroll) ──────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offsetX, y: t.clientY - offsetY });
  }, [offsetX, offsetY]);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setOffsetX(t.clientX - dragStart.x);
    setOffsetY(t.clientY - dragStart.y);
  }, [isDragging, dragStart]);

  // ── wheel zoom (non-passive to prevent page scroll) ───────────────────────
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      setScale(s => {
        const fs = fillScaleRef.current;
        return Math.min(fs * 3, Math.max(fs * 0.5, s + dir * fs * 0.06));
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── background removal (BFS flood-fill) ───────────────────────────────────
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
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);

          const imageData = ctx.getImageData(0, 0, w, h);
          const d = imageData.data;

          // Collect all border pixels for robust BG color detection
          const border: [number, number, number][] = [];
          for (let x = 0; x < w; x++) {
            const ti = x * 4, bi = ((h - 1) * w + x) * 4;
            border.push([d[ti], d[ti + 1], d[ti + 2]]);
            border.push([d[bi], d[bi + 1], d[bi + 2]]);
          }
          for (let y = 1; y < h - 1; y++) {
            const li = y * w * 4, ri = (y * w + w - 1) * 4;
            border.push([d[li], d[li + 1], d[li + 2]]);
            border.push([d[ri], d[ri + 1], d[ri + 2]]);
          }
          // Sort by luminance, use trimmed mean (middle 60%) to exclude hair/clothing
          border.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
          const s0 = Math.floor(border.length * 0.2);
          const s1 = Math.floor(border.length * 0.8);
          let sr = 0, sg = 0, sb = 0;
          for (let i = s0; i < s1; i++) { sr += border[i][0]; sg += border[i][1]; sb += border[i][2]; }
          const cnt = s1 - s0;
          sr = Math.round(sr / cnt); sg = Math.round(sg / cnt); sb = Math.round(sb / cnt);

          const TOLERANCE = 50;
          const dist = (pi: number) => {
            const dr = d[pi] - sr, dg = d[pi + 1] - sg, db = d[pi + 2] - sb;
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
          for (let y = 1; y < h - 1; y++) { seed(0, y); seed(w - 1, y); }

          let qi = 0;
          while (qi < queue.length) {
            const idx = queue[qi++];
            const pi = idx * 4;
            const dv = dist(pi);
            if (dv > TOLERANCE) continue;
            // Smooth edge: transparent at 0 dist, increasingly opaque toward tolerance
            d[pi + 3] = Math.round((dv / TOLERANCE) ** 1.5 * 255);

            const x = idx % w, y = (idx / w) | 0;
            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
              const ni = ny * w + nx;
              if (!visited[ni]) { visited[ni] = 1; queue.push(ni); }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const url = canvas.toDataURL("image/png");

          // Recalculate fill scale for processed image dimensions, preserving zoom ratio
          const newFill = Math.max(EDITOR_W / w, EDITOR_H / h);
          const zoomRatio = scaleRef.current / fillScaleRef.current;
          setFillScale(newFill);
          setScale(newFill * zoomRatio);
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
  }, [imgSrc, EDITOR_W, EDITOR_H]);

  // ── canvas render ─────────────────────────────────────────────────────────
  const renderPhoto = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!activeSrc) { reject("no image"); return; }
      const pw = mmToPx(selectedSize.w);
      const ph = mmToPx(selectedSize.h);
      const canvas = document.createElement("canvas");
      canvas.width = pw; canvas.height = ph;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, pw, ph);

      const img = new Image();
      img.onload = () => {
        // fillScale maps img.width → EDITOR_W, so img.width*fillScale = EDITOR_W
        // scale is relative to fillScale (1x fill = fillScale)
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
    try { setPreviewUrl(await renderPhoto()); setMode("preview"); }
    catch (e) { console.error(e); }
  };

  // Compute optimal grid layout (derived from selectedSize — no extra state needed)
  const PRINT_GAP_MM = 2;
  const lPrintCols = Math.max(1, Math.floor((89 + PRINT_GAP_MM) / (selectedSize.w + PRINT_GAP_MM)));
  const lPrintRows = Math.max(1, Math.floor((127 + PRINT_GAP_MM) / (selectedSize.h + PRINT_GAP_MM)));
  const lPrintCount = lPrintCols * lPrintRows;

  const handlePrint = async () => {
    try {
      const photoUrl = await renderPhoto();
      const LW = mmToPx(89), LH = mmToPx(127);
      const GAP = mmToPx(PRINT_GAP_MM);

      const pw = mmToPx(selectedSize.w), ph = mmToPx(selectedSize.h);
      const cols = lPrintCols, rows = lPrintRows;
      const gridW = cols * pw + (cols - 1) * GAP;
      const gridH = rows * ph + (rows - 1) * GAP;

      // Center the grid on the L-size paper
      const ox = Math.round((LW - gridW) / 2);
      const oy = Math.round((LH - gridH) / 2);

      const canvas = document.createElement("canvas");
      canvas.width = LW; canvas.height = LH;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, LW, LH);

      const img = new Image();
      img.onload = () => {
        // Draw photos in grid
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            ctx.drawImage(img,
              ox + c * (pw + GAP),
              oy + r * (ph + GAP),
              pw, ph
            );
          }
        }

        // Draw cut guide lines — only in margin/gap areas, never over photos
        ctx.strokeStyle = "#c0c0c0";
        ctx.lineWidth = 2;

        // Horizontal guide line at given y: draws in outer margins + column gaps
        const drawHLine = (y: number) => {
          ctx.beginPath();
          if (ox > 0) { ctx.moveTo(0, y); ctx.lineTo(ox, y); }
          for (let c = 1; c < cols; c++) {
            const x1 = ox + (c - 1) * (pw + GAP) + pw;
            const x2 = ox + c * (pw + GAP);
            ctx.moveTo(x1, y); ctx.lineTo(x2, y);
          }
          if (ox + gridW < LW) { ctx.moveTo(ox + gridW, y); ctx.lineTo(LW, y); }
          ctx.stroke();
        };

        // Vertical guide line at given x: draws in outer margins + row gaps
        const drawVLine = (x: number) => {
          ctx.beginPath();
          if (oy > 0) { ctx.moveTo(x, 0); ctx.lineTo(x, oy); }
          for (let r = 1; r < rows; r++) {
            const y1 = oy + (r - 1) * (ph + GAP) + ph;
            const y2 = oy + r * (ph + GAP);
            ctx.moveTo(x, y1); ctx.lineTo(x, y2);
          }
          if (oy + gridH < LH) { ctx.moveTo(x, oy + gridH); ctx.lineTo(x, LH); }
          ctx.stroke();
        };

        // Top and bottom horizontal cut lines
        drawHLine(oy);
        drawHLine(oy + gridH);
        // Between-row cut lines (center of each row gap)
        for (let r = 1; r < rows; r++) {
          drawHLine(oy + r * (ph + GAP) - Math.round(GAP / 2));
        }

        // Left and right vertical cut lines
        drawVLine(ox);
        drawVLine(ox + gridW);
        // Between-column cut lines (center of each column gap)
        for (let c = 1; c < cols; c++) {
          drawVLine(ox + c * (pw + GAP) - Math.round(GAP / 2));
        }

        setPrintUrl(canvas.toDataURL("image/jpeg", 0.95));
        setMode("print");
      };
      img.src = photoUrl;
    } catch (e) { console.error(e); }
  };

  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  };

  // Slider range relative to fill scale
  const minScale  = fillScale * 0.5;
  const maxScale  = fillScale * 3;
  const sliderPct = Math.max(0, Math.min(100, ((scale - minScale) / (maxScale - minScale)) * 100));
  const zoomPct   = Math.round((scale / fillScale) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">

        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">証明写真作成</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">履歴書・マイナンバー・パスポート対応。ブラウザで完結。</p>
        </div>

        {/* ── Step 1: Upload ────────────────────────────────────────────── */}
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
            {/* ── Step 2: Size ─────────────────────────────────────────── */}
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

            {/* ── Step 3: Background ───────────────────────────────────── */}
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
                        onClick={() => {
                          // Restore original fill scale
                          if (imgSrc) {
                            const tmp = new Image();
                            tmp.onload = () => {
                              const fs = Math.max(EDITOR_W / tmp.naturalWidth, EDITOR_H / tmp.naturalHeight);
                              const zr = scaleRef.current / fillScaleRef.current;
                              setFillScale(fs);
                              setScale(fs * zr);
                            };
                            tmp.src = imgSrc;
                          }
                          setProcessedSrc(null); setBgRemoved(false);
                        }}
                        className="text-[12px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        元の写真に戻す
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleRemoveBg} disabled={isRemovingBg}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[14px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50">
                      {isRemovingBg
                        ? <><Loader2 className="w-4 h-4 animate-spin" />背景を解析中…</>
                        : <><Wand2 className="w-4 h-4" />背景を自動除去して色を変更</>}
                    </button>
                  )}
                  <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-1.5">
                    {bgRemoved ? "上の色を選んで背景色を変更できます" : "背景除去後、上の色が反映されます"}
                  </p>
                </div>
              </div>
            </section>

            {/* ── Step 4: Editor ───────────────────────────────────────── */}
            <section>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">顔の位置を調整</p>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-center">
                  <div
                    ref={editorRef}
                    className="relative overflow-hidden rounded-xl border-2 border-blue-400 cursor-grab active:cursor-grabbing select-none"
                    style={{ width: EDITOR_W, height: EDITOR_H, backgroundColor: bgColor, touchAction: "none" }}
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
                        top: "50%", left: "50%",
                        maxWidth: "none", width: "auto", height: "auto",
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/30" />
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/30" />
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-400 text-center">ドラッグ・スクロールで位置とズームを調整</p>

                {/* Zoom slider — range relative to fill scale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500 dark:text-zinc-400">ズーム</span>
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{zoomPct}%</span>
                  </div>
                  <input type="range"
                    min={minScale} max={maxScale} step={fillScale * 0.02}
                    value={scale}
                    onChange={e => setScale(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #3b82f6 ${sliderPct}%, #e2e8f0 ${sliderPct}%)` }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 dark:text-zinc-600">
                    <span>縮小</span><span>等倍</span><span>拡大</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-3">
              <button onClick={handleGenerate}
                className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity">
                証明写真を生成
              </button>
              <button onClick={() => { setImgSrc(null); setProcessedSrc(null); setBgRemoved(false); setMode("edit"); }}
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
                <img src={previewUrl} alt="証明写真プレビュー" className="rounded shadow-md" style={{ height: 180 }} />
              </div>
            </section>
            <div className="space-y-3">
              <button onClick={() => download(previewUrl, `id-photo-${selectedSize.id}.jpg`)}
                className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />JPGでダウンロード
              </button>
              <button onClick={handlePrint}
                className="w-full py-[14px] text-[15px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />コンビニ印刷用（L判{lPrintCount}枚）を生成
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
                <img src={printUrl} alt="L判4枚配置プレビュー" className="rounded shadow-md" style={{ maxWidth: "100%", maxHeight: 280 }} />
              </div>
              <p className="text-[12px] text-slate-400 text-center mt-2">L判（89×127mm）に{lPrintCount}枚配置済み・カットガイド線入り</p>
            </section>
            <div className="space-y-3">
              <button onClick={() => download(printUrl, "id-photo-L-print.jpg")}
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

        <RelatedTools toolId="id-photo" />
      </div>
    </div>
  );
}
