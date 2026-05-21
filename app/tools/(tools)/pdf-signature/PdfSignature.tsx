"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { getSavedSeals } from "@/lib/seal-storage";
import type { SavedSeal } from "@/lib/seal-storage";
import { toPdfCoords, sigToPercent } from "@/lib/pdf-coords";

type Mode = "draw" | "text" | "seal";

type Sig = {
  id: string;
  type: "draw" | "text" | "seal";
  dataUrl?: string;
  text?: string;
  x: number;   // pdfjs canvas pixels from left
  y: number;   // pdfjs canvas pixels from top
  w: number;   // pdfjs canvas pixels width
  h: number;   // pdfjs canvas pixels height
  rot: number; // degrees
  opa: number; // 0–1
};

// ─── HandwritingCard ──────────────────────────────────────────────────────────
// Standalone canvas inside the control panel.
// User draws here → "署名を追加" exports a trimmed transparent-bg PNG
// → caller places it as a stamp on the PDF overlay.
// ──────────────────────────────────────────────────────────────────────────────
interface HandwritingCardProps {
  onAdd: (dataUrl: string, naturalW: number, naturalH: number) => void;
}

function HandwritingCard({ onAdd }: HandwritingCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hasStrokes, setHasStrokes] = useState(false);

  // Init canvas resolution with devicePixelRatio – once after first layout tick
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const raf = requestAnimationFrame(() => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.offsetWidth || 320;
      const cssH = 180;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Pointer events – imperative with passive:false so preventDefault works on iOS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: PointerEvent): { x: number; y: number } => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const pos = getPos(e);
      isDrawingRef.current = true;
      lastPosRef.current = pos;
      const ctx = canvas.getContext("2d")!;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !lastPosRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      const last = lastPosRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2;
      const mid = { x: (pos.x + last.x) / 2, y: (pos.y + last.y) / 2 };
      ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mid.x, mid.y);
      lastPosRef.current = pos;
      setHasStrokes(true);
    };

    const onUp = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasStrokes(false);
  };

  const handleAdd = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas; // physical pixels
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, width, height);
    const px = imgData.data;

    // Find bounding box of non-transparent pixels
    let minX = width, minY = height, maxX = 0, maxY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (px[(y * width + x) * 4 + 3] > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX > maxX || minY > maxY) return; // nothing drawn

    const pad = Math.round(10 * dpr);
    const x1 = Math.max(0, minX - pad);
    const y1 = Math.max(0, minY - pad);
    const x2 = Math.min(width, maxX + pad);
    const y2 = Math.min(height, maxY + pad);
    const tw = x2 - x1;
    const th = y2 - y1;

    // Export trimmed region as transparent-bg PNG
    const tmp = document.createElement("canvas");
    tmp.width = tw;
    tmp.height = th;
    tmp.getContext("2d")!.drawImage(canvas, x1, y1, tw, th, 0, 0, tw, th);

    // natural size in CSS pixels (for aspect ratio, not final PDF size)
    onAdd(tmp.toDataURL("image/png"), tw / dpr, th / dpr);
    handleClear();
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-0.5">
          手書き署名を作成
        </p>
        <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed">
          枠内に指またはマウスで署名を書いてください。作成後、PDF上で位置を調整できます。
        </p>
      </div>

      {/* Drawing canvas — white CSS background, transparent canvas pixels */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 180,
          display: "block",
          backgroundColor: "white",
          borderRadius: 10,
          border: "1.5px solid #e2e8f0",
          touchAction: "none",
          cursor: "crosshair",
          userSelect: "none",
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          disabled={!hasStrokes}
          className="flex-1 px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 disabled:opacity-40 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          クリア
        </button>
        <button
          onClick={handleAdd}
          disabled={!hasStrokes}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          署名を追加 →
        </button>
      </div>
    </div>
  );
}

// ─── PdfSignature ─────────────────────────────────────────────────────────────
export function PdfSignature() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState<Mode>("draw");
  const [textInput, setTextInput] = useState("");
  const [sigs, setSigs] = useState<Sig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Sig[][]>([[]]);
  const [histIdx, setHistIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [savedSeals, setSavedSeals] = useState<SavedSeal[]>([]);
  const [cw, setCw] = useState(893);
  const [ch, setCh] = useState(1263);

  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Refs prevent stale closures in imperative handlers
  const cwRef = useRef(893);
  const chRef = useRef(1263);
  const sigsRef = useRef<Sig[]>([]);
  const histIdxRef = useRef(0);
  const draggingRef = useRef<{ sigId: string; offX: number; offY: number } | null>(null);
  const resizingRef = useRef<{
    sigId: string;
    origW: number;
    origH: number;
    origAspect: number;
    startX: number;
    startY: number;
    lockAspect: boolean;
  } | null>(null);

  useEffect(() => { sigsRef.current = sigs; }, [sigs]);
  useEffect(() => { cwRef.current = cw; chRef.current = ch; }, [cw, ch]);
  useEffect(() => { histIdxRef.current = histIdx; }, [histIdx]);

  useEffect(() => { setSavedSeals(getSavedSeals()); }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const pushHistory = useCallback((next: Sig[]) => {
    const idx = histIdxRef.current;
    setHistory(h => [...h.slice(0, idx + 1), [...next]]);
    setHistIdx(idx + 1);
    histIdxRef.current = idx + 1;
  }, []);

  const renderPdfPage = useCallback(async (file: File, page: number) => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const ab = await file.arrayBuffer();
      const pdfDoc = await getDocument({ data: ab }).promise;
      setTotalPages(pdfDoc.numPages);
      const pdfPage = await pdfDoc.getPage(page);
      const vp = pdfPage.getViewport({ scale: 1.5 });
      const c = pdfCanvasRef.current;
      if (!c) return;
      c.width = vp.width;
      c.height = vp.height;
      await pdfPage.render({ canvasContext: c.getContext("2d")!, viewport: vp, canvas: c }).promise;
      setCw(vp.width);
      setCh(vp.height);
      cwRef.current = vp.width;
      chRef.current = vp.height;
    } catch {
      showToast("PDFの読み込みに失敗しました");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("PDFファイルを選択してください");
      return;
    }
    setPdfFile(file);
    setSigs([]);
    sigsRef.current = [];
    setCurrentPage(1);
    setHistory([[]]);
    setHistIdx(0);
    histIdxRef.current = 0;
    renderPdfPage(file, 1);
  }, [renderPdfPage]);

  useEffect(() => {
    if (pdfFile) renderPdfPage(pdfFile, currentPage);
  }, [currentPage, pdfFile, renderPdfPage]);

  // ── Overlay: only drag / resize — NO drawing on PDF ──────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !pdfFile) return;

    const getPos = (e: PointerEvent) => {
      const r = overlay.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * cwRef.current,
        y: ((e.clientY - r.top) / r.height) * chRef.current,
      };
    };

    const onMove = (e: PointerEvent) => {
      e.preventDefault();

      if (draggingRef.current) {
        const { sigId, offX, offY } = draggingRef.current;
        const pos = getPos(e);
        setSigs(ss =>
          ss.map(s =>
            s.id === sigId
              ? {
                  ...s,
                  x: Math.max(0, Math.min(cwRef.current - s.w, pos.x - offX)),
                  y: Math.max(0, Math.min(chRef.current - s.h, pos.y - offY)),
                }
              : s
          )
        );
        return;
      }

      if (resizingRef.current) {
        const { sigId, origW, origH, origAspect, startX, startY, lockAspect } =
          resizingRef.current;
        const pos = getPos(e);
        const newW = Math.max(20, origW + (pos.x - startX));
        const newH = lockAspect
          ? Math.round(newW * origAspect)
          : Math.max(20, origH + (pos.y - startY));
        setSigs(ss => ss.map(s => (s.id === sigId ? { ...s, w: newW, h: newH } : s)));
      }
    };

    const onUp = () => {
      if (draggingRef.current) {
        pushHistory(sigsRef.current);
        draggingRef.current = null;
        return;
      }
      if (resizingRef.current) {
        pushHistory(sigsRef.current);
        resizingRef.current = null;
      }
    };

    overlay.addEventListener("pointermove", onMove, { passive: false });
    overlay.addEventListener("pointerup", onUp);
    overlay.addEventListener("pointercancel", onUp);
    return () => {
      overlay.removeEventListener("pointermove", onMove);
      overlay.removeEventListener("pointerup", onUp);
      overlay.removeEventListener("pointercancel", onUp);
    };
  }, [pdfFile, pushHistory]);

  // ── Stamp interaction helpers ─────────────────────────────────────────────
  const startDrag = (e: React.PointerEvent, sig: Sig) => {
    e.stopPropagation();
    const overlay = overlayRef.current!;
    overlay.setPointerCapture(e.pointerId);
    const r = overlay.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width) * cw;
    const cy = ((e.clientY - r.top) / r.height) * ch;
    draggingRef.current = { sigId: sig.id, offX: cx - sig.x, offY: cy - sig.y };
    setSelectedId(sig.id);
  };

  const startResize = (e: React.PointerEvent, sig: Sig) => {
    e.stopPropagation();
    const overlay = overlayRef.current!;
    overlay.setPointerCapture(e.pointerId);
    const r = overlay.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width) * cw;
    const cy = ((e.clientY - r.top) / r.height) * ch;
    resizingRef.current = {
      sigId: sig.id,
      origW: sig.w,
      origH: sig.h,
      origAspect: sig.h / Math.max(1, sig.w),
      startX: cx,
      startY: cy,
      lockAspect: sig.type !== "text", // draw + seal lock aspect; text is free
    };
  };

  // ── Add actions ───────────────────────────────────────────────────────────
  const addText = () => {
    if (!textInput.trim() || !pdfFile) return;
    const newSig: Sig = {
      id: `${Date.now()}`,
      type: "text",
      text: textInput,
      x: Math.round(cw / 2 - 100),
      y: Math.round(ch / 2 - 16),
      w: 200,
      h: 32,
      rot: 0,
      opa: 1,
    };
    const next = [...sigs, newSig];
    setSigs(next);
    pushHistory(next);
    setTextInput("");
    setSelectedId(newSig.id);
  };

  // Called by HandwritingCard when user presses "署名を追加"
  const addHandwriting = useCallback(
    (dataUrl: string, naturalW: number, naturalH: number) => {
      if (!pdfFile) return;
      // Scale to ~40% of PDF canvas width, preserving aspect ratio
      const targetW = Math.round(cwRef.current * 0.4);
      const targetH = Math.round(targetW * (naturalH / Math.max(1, naturalW)));
      const newSig: Sig = {
        id: `${Date.now()}`,
        type: "draw",
        dataUrl,
        x: Math.round(cwRef.current / 2 - targetW / 2),
        y: Math.round(chRef.current / 2 - targetH / 2),
        w: targetW,
        h: targetH,
        rot: 0,
        opa: 1,
      };
      const next = [...sigsRef.current, newSig];
      setSigs(next);
      pushHistory(next);
      setSelectedId(newSig.id);
      setMode("text"); // switch to move mode so user can drag immediately
      showToast("署名をPDFに追加しました ✓  PDF上でドラッグして位置調整できます");
    },
    [pdfFile, pushHistory]
  );

  const placeSeal = (seal: SavedSeal) => {
    if (!pdfFile) return;
    const size = Math.round(Math.min(cw, ch) * 0.14);
    const newSig: Sig = {
      id: `${Date.now()}`,
      type: "seal",
      dataUrl: seal.dataUrl,
      x: Math.round(cw / 2 - size / 2),
      y: Math.round(ch / 2 - size / 2),
      w: size,
      h: size,
      rot: 0,
      opa: 0.9,
    };
    const next = [...sigs, newSig];
    setSigs(next);
    pushHistory(next);
    setSelectedId(newSig.id);
    setMode("text"); // switch to move mode
  };

  // ── History ───────────────────────────────────────────────────────────────
  const undo = () => {
    if (histIdx <= 0) return;
    setSigs(history[histIdx - 1] ?? []);
    setHistIdx(i => i - 1);
  };

  const redo = () => {
    if (histIdx >= history.length - 1) return;
    setSigs(history[histIdx + 1]);
    setHistIdx(i => i + 1);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    const next = sigs.filter(s => s.id !== selectedId);
    setSigs(next);
    pushHistory(next);
    setSelectedId(null);
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const exportPdf = async () => {
    if (!pdfFile) { showToast("PDFをアップロードしてください"); return; }
    if (sigs.length === 0) { showToast("署名を追加してください"); return; }
    setIsExporting(true);
    try {
      const ab = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(ab);
      const pages = doc.getPages();
      const page = pages[currentPage - 1];
      const { width: pw, height: ph } = page.getSize();

      for (const sig of sigs) {
        const pdfCoords = toPdfCoords(sig.x, sig.y, sig.w, sig.h, cw, ch, pw, ph);

        if ((sig.type === "draw" || sig.type === "seal") && sig.dataUrl) {
          const imgBytes = await fetch(sig.dataUrl).then(r => r.arrayBuffer());
          const img = await doc.embedPng(imgBytes);

          if (sig.type === "seal") {
            // Force square to prevent floating-point aspect drift
            const side = Math.min(pdfCoords.width, pdfCoords.height);
            page.drawImage(img, {
              x: pdfCoords.x,
              y: pdfCoords.y,
              width: side,
              height: side,
              opacity: sig.opa,
              rotate: degrees(-sig.rot),
            });
          } else {
            page.drawImage(img, {
              x: pdfCoords.x,
              y: pdfCoords.y,
              width: pdfCoords.width,
              height: pdfCoords.height,
              opacity: sig.opa,
              rotate: degrees(-sig.rot),
            });
          }
        } else if (sig.type === "text" && sig.text) {
          page.drawText(sig.text, {
            x: pdfCoords.x,
            y: pdfCoords.y + pdfCoords.height * 0.2,
            size: 14,
            color: rgb(0.1, 0.1, 0.5),
            opacity: sig.opa,
            rotate: degrees(-sig.rot),
          });
        }
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `signed_${pdfFile.name}`;
      a.click();
      showToast("署名済みPDFを保存しました ✓");
    } catch {
      showToast("エクスポートに失敗しました");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedSig = selectedId ? sigs.find(s => s.id === selectedId) ?? null : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl pointer-events-none">
          {toastMsg}
        </div>
      )}

      {!pdfFile ? (
        /* ── Upload area ─────────────────────────────────────────────── */
        <div
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          }`}
          onClick={() => document.getElementById("pdf-sig-upload")?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="text-slate-700 dark:text-zinc-300 font-semibold text-lg mb-1">
            PDFをドラッグ＆ドロップ
          </p>
          <p className="text-sm text-slate-400">または クリックしてPDFを選択</p>
          <input
            id="pdf-sig-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        /* ── Main editor: left=PDF, right=panel ─────────────────────── */
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── PDF preview ─────────────────────────────────────────── */}
          <div className="w-full lg:flex-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {/* Overlay container – handles drag/resize only, NO drawing */}
              <div
                ref={overlayRef}
                className="relative w-full"
                style={{
                  aspectRatio: cw > 0 ? `${cw}/${ch}` : "0.707",
                  touchAction: "none",
                  cursor: "default",
                }}
                onClick={e => {
                  // Deselect when tapping empty canvas area
                  const target = e.target as HTMLElement;
                  if (target === e.currentTarget || target.tagName === "CANVAS") {
                    setSelectedId(null);
                  }
                }}
              >
                {/* PDF render canvas */}
                <canvas
                  ref={pdfCanvasRef}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                  }}
                />

                {/* Stamp overlays (draw + seal + text) */}
                {sigs.map(sig => {
                  const pos = sigToPercent(sig.x, sig.y, sig.w, sig.h, cw, ch);
                  const isSelected = selectedId === sig.id;
                  return (
                    <div
                      key={sig.id}
                      style={{
                        position: "absolute",
                        left: pos.left,
                        top: pos.top,
                        width: pos.width,
                        height: pos.height,
                        cursor: "move",
                        border: isSelected
                          ? "1.5px dashed #3b82f6"
                          : "1px dashed transparent",
                        boxSizing: "border-box",
                        transform: sig.rot ? `rotate(${sig.rot}deg)` : undefined,
                        transformOrigin: "center center",
                        opacity: sig.opa,
                        touchAction: "none",
                        userSelect: "none",
                        zIndex: 5,
                      }}
                      onPointerDown={e => startDrag(e, sig)}
                      onClick={e => { e.stopPropagation(); setSelectedId(sig.id); }}
                    >
                      {(sig.type === "draw" || sig.type === "seal") && sig.dataUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sig.dataUrl}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            pointerEvents: "none",
                            display: "block",
                          }}
                        />
                      )}
                      {sig.type === "text" && (
                        <span
                          style={{
                            fontSize: 14,
                            color: "#1e3a8a",
                            fontFamily: "serif",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                            pointerEvents: "none",
                          }}
                        >
                          {sig.text}
                        </span>
                      )}

                      {/* Resize handle – bottom-right corner */}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            right: -6,
                            bottom: -6,
                            width: 14,
                            height: 14,
                            background: "white",
                            border: "2px solid #3b82f6",
                            borderRadius: 3,
                            cursor: "nwse-resize",
                            touchAction: "none",
                            zIndex: 6,
                          }}
                          onPointerDown={e => startResize(e, sig)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  ← 前
                </button>
                <span className="text-sm text-slate-500 dark:text-zinc-400">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  次 →
                </button>
              </div>
              <button
                onClick={() => { setPdfFile(null); setSigs([]); }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline"
              >
                別のPDFを選択
              </button>
            </div>
          </div>

          {/* ── Control panel ───────────────────────────────────────── */}
          <div className="w-full lg:w-72 space-y-4">

            {/* Mode selector + mode-specific content */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-4">
              {/* Tab buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("draw")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    mode === "draw"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  ✍️ 手書き
                </button>
                <button
                  onClick={() => setMode("text")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    mode === "text"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  💬 テキスト
                </button>
                <button
                  onClick={() => { setMode("seal"); setSavedSeals(getSavedSeals()); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    mode === "seal"
                      ? "bg-red-600 text-white border-red-600"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  🔴 印鑑
                </button>
              </div>

              {/* Draw mode: HandwritingCard */}
              {mode === "draw" && (
                <HandwritingCard onAdd={addHandwriting} />
              )}

              {/* Text mode */}
              {mode === "text" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder="署名・社名など"
                    onKeyDown={e => e.key === "Enter" && addText()}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addText}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    追加
                  </button>
                </div>
              )}

              {/* Seal mode */}
              {mode === "seal" && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
                    印鑑を選択してPDF上に配置
                  </p>
                  {savedSeals.length === 0 ? (
                    <div className="flex flex-col gap-1 text-xs text-slate-400">
                      <span>保存済み印鑑がありません。</span>
                      <a href="/tools/hanko-generator" className="text-blue-500 hover:underline font-medium">
                        電子印鑑メーカーで作成 →
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {savedSeals.map(seal => (
                        <button
                          key={seal.id}
                          onClick={() => placeSeal(seal)}
                          className="p-2 border-2 border-slate-200 dark:border-zinc-700 rounded-xl hover:border-red-400 dark:hover:border-red-500 transition-colors bg-white dark:bg-zinc-800"
                          title={seal.name || "印鑑"}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={seal.dataUrl}
                            alt={seal.name || "印鑑"}
                            className="w-12 h-12 object-contain"
                          />
                          {seal.name && (
                            <p className="text-xs text-center mt-1 text-slate-500 dark:text-zinc-400">
                              {seal.name}
                            </p>
                          )}
                        </button>
                      ))}
                      <a
                        href="/tools/hanko-generator"
                        className="flex flex-col items-center justify-center p-2 w-[60px] h-[60px] border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl hover:border-red-400 text-slate-400 transition-colors"
                      >
                        <span className="text-xl leading-none">＋</span>
                        <span className="text-xs mt-1">作成</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Undo / Redo */}
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={histIdx <= 0}
                className="flex-1 px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                ↩ 元に戻す
              </button>
              <button
                onClick={redo}
                disabled={histIdx >= history.length - 1}
                className="flex-1 px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                やり直し ↪
              </button>
            </div>

            {/* Selected stamp properties */}
            {selectedSig && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-blue-200 dark:border-blue-800/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {selectedSig.type === "seal"
                      ? "🔴 印鑑"
                      : selectedSig.type === "draw"
                      ? "✍️ 署名"
                      : "💬 テキスト"}
                  </span>
                  <button
                    onClick={deleteSelected}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    🗑 削除
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>回転</span>
                    <span>{selectedSig.rot}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedSig.rot}
                    onChange={e =>
                      setSigs(ss =>
                        ss.map(s => s.id === selectedId ? { ...s, rot: +e.target.value } : s)
                      )
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>濃さ</span>
                    <span>{Math.round(selectedSig.opa * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(selectedSig.opa * 100)}
                    onChange={e =>
                      setSigs(ss =>
                        ss.map(s => s.id === selectedId ? { ...s, opa: +e.target.value / 100 } : s)
                      )
                    }
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Export */}
            <button
              onClick={exportPdf}
              disabled={isExporting || sigs.length === 0}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              {isExporting ? "保存中…" : "✓ 署名済みPDFを保存"}
            </button>

            {/* Document creation links */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-3">
                署名する書類を作成する
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/tools/business-contract-generator", emoji: "📋", label: "業務委託契約書" },
                  { href: "/tools/nda-generator", emoji: "🤝", label: "NDA" },
                  { href: "/tools/invoice-generator", emoji: "🧾", label: "請求書" },
                  { href: "/tools/estimate-generator", emoji: "📊", label: "見積書" },
                ].map(({ href, emoji, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-sm">{emoji}</span>
                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
