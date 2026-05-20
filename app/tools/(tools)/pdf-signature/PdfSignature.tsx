"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { getSavedSeals } from "@/lib/seal-storage";
import type { SavedSeal } from "@/lib/seal-storage";

type SignatureMode = "draw" | "text" | "seal";

type SigItem = {
  id: string;
  type: "draw" | "text" | "seal";
  dataUrl?: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
};

export function PdfSignature() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [textInput, setTextInput] = useState("");
  const [sigs, setSigs] = useState<SigItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<SigItem[][]>([[]]);
  const [histIdx, setHistIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [savedSeals, setSavedSeals] = useState<SavedSeal[]>([]);
  const [moveStep, setMoveStep] = useState(5);

  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setSavedSeals(getSavedSeals());
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const pushHistory = useCallback((next: SigItem[]) => {
    setHistory((h) => {
      const sliced = h.slice(0, histIdx + 1);
      return [...sliced, [...next]];
    });
    setHistIdx((i) => i + 1);
  }, [histIdx]);

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
      const ctx = c.getContext("2d")!;
      await pdfPage.render({ canvasContext: ctx, viewport: vp, canvas: c }).promise;
      const dc = drawCanvasRef.current;
      if (dc) { dc.width = vp.width; dc.height = vp.height; }
    } catch {
      showToast("PDFの読み込みに失敗しました");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) { showToast("PDFファイルを選択してください"); return; }
    setPdfFile(file);
    setSigs([]);
    setCurrentPage(1);
    setHistory([[]]);
    setHistIdx(0);
    renderPdfPage(file, 1);
  }, [renderPdfPage]);

  useEffect(() => {
    if (pdfFile) renderPdfPage(pdfFile, currentPage);
  }, [currentPage, pdfFile, renderPdfPage]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = drawCanvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "draw") return;
    setIsDrawing(true);
    const pos = getCanvasPos(e);
    pathRef.current = [pos];
    const ctx = drawCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 2.5;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== "draw") return;
    const pos = getCanvasPos(e);
    pathRef.current.push(pos);
    const ctx = drawCanvasRef.current?.getContext("2d");
    if (ctx) { ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
  };

  const onMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const dc = drawCanvasRef.current;
    if (!dc || pathRef.current.length < 2) { pathRef.current = []; return; }
    const xs = pathRef.current.map((p) => p.x);
    const ys = pathRef.current.map((p) => p.y);
    const pad = 12;
    const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
    const w = Math.max(...xs) + pad - minX, h = Math.max(...ys) + pad - minY;
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    tmp.getContext("2d")!.drawImage(dc, -minX, -minY);
    const dataUrl = tmp.toDataURL();
    const next = [...sigs, { id: `${Date.now()}`, type: "draw" as const, dataUrl, x: minX, y: minY, width: w, height: h, rotation: 0, opacity: 1 }];
    setSigs(next);
    pushHistory(next);
    dc.getContext("2d")?.clearRect(0, 0, dc.width, dc.height);
    pathRef.current = [];
  };

  const addText = () => {
    if (!textInput.trim() || !pdfCanvasRef.current) return;
    const c = pdfCanvasRef.current;
    const next = [...sigs, { id: `${Date.now()}`, type: "text" as const, text: textInput, x: c.width / 2 - 80, y: c.height / 2 - 16, width: 200, height: 32, rotation: 0, opacity: 1 }];
    setSigs(next);
    pushHistory(next);
    setTextInput("");
    setSelectedId(next[next.length - 1].id);
  };

  const placeSeal = (seal: SavedSeal) => {
    if (!pdfCanvasRef.current) return;
    const c = pdfCanvasRef.current;
    const size = Math.round(Math.min(c.width, c.height) * 0.14);
    const item: SigItem = {
      id: `${Date.now()}`,
      type: "seal",
      dataUrl: seal.dataUrl,
      x: Math.round(c.width / 2 - size / 2),
      y: Math.round(c.height / 2 - size / 2),
      width: size,
      height: size,
      rotation: 0,
      opacity: 0.9,
    };
    const next = [...sigs, item];
    setSigs(next);
    pushHistory(next);
    setSelectedId(item.id);
    setMode("text");
  };

  const undo = () => {
    if (histIdx <= 0) return;
    const prev = history[histIdx - 1] ?? [];
    setSigs(prev); setHistIdx((i) => i - 1);
  };
  const redo = () => {
    if (histIdx >= history.length - 1) return;
    setSigs(history[histIdx + 1]); setHistIdx((i) => i + 1);
  };
  const deleteSelected = () => {
    if (!selectedId) return;
    const next = sigs.filter((s) => s.id !== selectedId);
    setSigs(next); pushHistory(next); setSelectedId(null);
  };

  const updateSigProp = useCallback((id: string, updates: Partial<SigItem>) => {
    setSigs((ss) => ss.map((s) => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const moveSig = (id: string, dx: number, dy: number) => {
    setSigs((ss) => ss.map((s) => s.id === id ? { ...s, x: Math.max(0, Math.round(s.x + dx)), y: Math.max(0, Math.round(s.y + dy)) } : s));
  };

  const getSigPos = (e: React.MouseEvent, sigId: string) => {
    const c = pdfCanvasRef.current!;
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width, scaleY = c.height / r.height;
    const sig = sigs.find((s) => s.id === sigId)!;
    setDragOffset({ x: (e.clientX - r.left) * scaleX - sig.x, y: (e.clientY - r.top) * scaleY - sig.y });
    setIsDragging(sigId);
    setSelectedId(sigId);
  };

  const onOverlayMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const c = pdfCanvasRef.current!;
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width, scaleY = c.height / r.height;
    const x = Math.round((e.clientX - r.left) * scaleX - dragOffset.x);
    const y = Math.round((e.clientY - r.top) * scaleY - dragOffset.y);
    setSigs((ss) => ss.map((s) => s.id === isDragging ? { ...s, x, y } : s));
  };

  const onOverlayUp = () => {
    if (isDragging) { pushHistory(sigs); setIsDragging(null); }
  };

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
      const cw = pdfCanvasRef.current!.width, ch = pdfCanvasRef.current!.height;

      for (const sig of sigs) {
        const pdfX = (sig.x / cw) * pw;
        const pdfY = ph - ((sig.y + sig.height) / ch) * ph;
        const pdfW = (sig.width / cw) * pw;
        const pdfH = (sig.height / ch) * ph;

        if ((sig.type === "draw" || sig.type === "seal") && sig.dataUrl) {
          const imgBytes = await fetch(sig.dataUrl).then((r) => r.arrayBuffer());
          const img = await doc.embedPng(imgBytes);
          page.drawImage(img, {
            x: pdfX,
            y: pdfY,
            width: pdfW,
            height: pdfH,
            opacity: sig.opacity,
            rotate: degrees(-sig.rotation),
          });
        } else if (sig.type === "text" && sig.text) {
          page.drawText(sig.text, {
            x: pdfX,
            y: pdfY,
            size: 12,
            color: rgb(0.1, 0.1, 0.5),
            opacity: sig.opacity,
            rotate: degrees(-sig.rotation),
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

  const selectedSig = selectedId ? sigs.find((s) => s.id === selectedId) ?? null : null;

  return (
    <div className="space-y-5">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toastMsg}
        </div>
      )}

      {!pdfFile ? (
        /* ── アップロードエリア ── */
        <div
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          }`}
          onClick={() => document.getElementById("pdf-sig-upload")?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="text-slate-700 dark:text-zinc-300 font-semibold text-lg mb-1">PDFをドラッグ＆ドロップ</p>
          <p className="text-sm text-slate-400">または クリックしてPDFを選択</p>
          <input id="pdf-sig-upload" type="file" accept=".pdf" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── ツールバー ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* モード切替 */}
              <button onClick={() => setMode("draw")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  mode === "draw" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                ✍️ 手書き
              </button>
              <button onClick={() => setMode("text")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  mode === "text" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                💬 テキスト
              </button>
              <button
                onClick={() => { setMode("seal"); setSavedSeals(getSavedSeals()); }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  mode === "seal" ? "bg-red-600 text-white border-red-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                🔴 印鑑
              </button>

              {mode === "text" && (
                <div className="flex gap-2">
                  <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}
                    placeholder="署名・社名など" onKeyDown={(e) => e.key === "Enter" && addText()}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                  />
                  <button onClick={addText} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">追加</button>
                </div>
              )}

              <div className="flex gap-2 ml-auto">
                <button onClick={undo} disabled={histIdx <= 0} title="元に戻す"
                  className="px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800">↩</button>
                <button onClick={redo} disabled={histIdx >= history.length - 1} title="やり直し"
                  className="px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800">↪</button>
                {selectedId && (
                  <button onClick={deleteSelected}
                    className="px-3 py-2 rounded-lg text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100">
                    🗑 削除
                  </button>
                )}
              </div>
            </div>

            {/* 印鑑ピッカー */}
            {mode === "seal" && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">印鑑を選択してPDF上に配置</p>
                {savedSeals.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>保存済み印鑑がありません。</span>
                    <a href="/tools/hanko-generator" className="text-blue-500 hover:underline font-medium">
                      電子印鑑メーカーで作成 →
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {savedSeals.map((seal) => (
                      <button key={seal.id} onClick={() => placeSeal(seal)}
                        className="p-2 border-2 border-slate-200 dark:border-zinc-700 rounded-xl hover:border-red-400 dark:hover:border-red-500 transition-colors bg-white dark:bg-zinc-800"
                        title={seal.name || "印鑑"}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={seal.dataUrl} alt={seal.name || "印鑑"} className="w-12 h-12 object-contain" />
                        {seal.name && <p className="text-xs text-center mt-1 text-slate-500 dark:text-zinc-400">{seal.name}</p>}
                      </button>
                    ))}
                    <a href="/tools/hanko-generator"
                      className="flex flex-col items-center justify-center p-2 w-[60px] h-[60px] border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl hover:border-red-400 text-slate-400 transition-colors">
                      <span className="text-xl leading-none">＋</span>
                      <span className="text-xs mt-1">作成</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {mode === "draw" && (
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                PDFの上でマウスをドラッグして署名を描いてください。
              </p>
            )}
          </div>

          {/* ── PDF表示 ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            <div
              className="relative overflow-auto"
              style={{ maxHeight: "65vh", cursor: mode === "draw" ? "crosshair" : "default" }}
              onMouseMove={onOverlayMove}
              onMouseUp={onOverlayUp}
              onMouseLeave={onOverlayUp}
            >
              <canvas ref={pdfCanvasRef} className="block" />

              {/* 署名・印鑑オーバーレイ */}
              {sigs.map((sig) => (
                <div key={sig.id}
                  style={{
                    position: "absolute",
                    left: sig.x,
                    top: sig.y,
                    width: sig.width,
                    height: sig.height,
                    cursor: "move",
                    border: selectedId === sig.id ? "1.5px dashed #3b82f6" : "1px dashed transparent",
                    boxSizing: "border-box",
                    transform: sig.rotation ? `rotate(${sig.rotation}deg)` : undefined,
                    transformOrigin: "center center",
                    opacity: sig.opacity,
                  }}
                  onMouseDown={(e) => getSigPos(e, sig.id)}
                  onClick={() => setSelectedId(sig.id)}
                >
                  {(sig.type === "draw" || sig.type === "seal") && sig.dataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sig.dataUrl} alt="署名" style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
                  )}
                  {sig.type === "text" && (
                    <span style={{ fontSize: 14, color: "#1e3a8a", fontFamily: "serif", whiteSpace: "nowrap", lineHeight: 1 }}>
                      {sig.text}
                    </span>
                  )}
                </div>
              ))}

              {/* 描画キャンバス */}
              <canvas ref={drawCanvasRef}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: mode === "draw" ? "auto" : "none" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              />
            </div>
          </div>

          {/* ── 選択オブジェクト プロパティパネル ── */}
          {selectedSig && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-blue-200 dark:border-blue-800/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {selectedSig.type === "seal" ? "🔴 印鑑の設定" : selectedSig.type === "draw" ? "✍️ 署名の設定" : "💬 テキストの設定"}
                </h4>
                <button onClick={() => setSelectedId(null)} className="text-xs text-slate-400 hover:text-slate-600">✕ 閉じる</button>
              </div>

              {/* X / Y / W / H */}
              <div className="grid grid-cols-4 gap-2">
                {(["x", "y", "width", "height"] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1 uppercase">{key === "width" ? "W" : key === "height" ? "H" : key.toUpperCase()}</label>
                    <input
                      type="number"
                      value={Math.round(selectedSig[key] as number)}
                      onChange={(e) => updateSigProp(selectedSig.id, { [key]: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* 矢印ボタン + ステップ */}
              <div className="flex items-center gap-4">
                <div className="grid grid-cols-3 gap-1 w-24">
                  <div />
                  <button onClick={() => moveSig(selectedSig.id, 0, -moveStep)}
                    className="p-1.5 rounded border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-center font-bold">↑</button>
                  <div />
                  <button onClick={() => moveSig(selectedSig.id, -moveStep, 0)}
                    className="p-1.5 rounded border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-center font-bold">←</button>
                  <div className="flex items-center justify-center text-xs text-slate-300 dark:text-zinc-600">✛</div>
                  <button onClick={() => moveSig(selectedSig.id, moveStep, 0)}
                    className="p-1.5 rounded border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-center font-bold">→</button>
                  <div />
                  <button onClick={() => moveSig(selectedSig.id, 0, moveStep)}
                    className="p-1.5 rounded border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-center font-bold">↓</button>
                  <div />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">移動幅</p>
                  <div className="flex gap-1">
                    {[1, 5, 10].map((step) => (
                      <button key={step} onClick={() => setMoveStep(step)}
                        className={`px-2 py-1 rounded-lg text-xs border transition-all ${moveStep === step ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"}`}>
                        {step}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* 配置プリセット */}
                <div className="ml-auto">
                  <p className="text-xs text-slate-400 mb-1.5">プリセット</p>
                  <div className="flex gap-1">
                    {pdfCanvasRef.current && [
                      { label: "中央", dx: Math.round(pdfCanvasRef.current.width / 2 - selectedSig.width / 2), dy: Math.round(pdfCanvasRef.current.height / 2 - selectedSig.height / 2) },
                      { label: "右下", dx: Math.round(pdfCanvasRef.current.width - selectedSig.width - 30), dy: Math.round(pdfCanvasRef.current.height - selectedSig.height - 30) },
                      { label: "右上", dx: Math.round(pdfCanvasRef.current.width - selectedSig.width - 30), dy: 30 },
                    ].map(({ label, dx, dy }) => (
                      <button key={label}
                        onClick={() => updateSigProp(selectedSig.id, { x: dx, y: dy })}
                        className="px-2 py-1 rounded-lg text-xs border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 回転 */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-slate-500 dark:text-zinc-400">回転</label>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{selectedSig.rotation}°</span>
                </div>
                <input type="range" min="-180" max="180" value={selectedSig.rotation}
                  onChange={(e) => updateSigProp(selectedSig.id, { rotation: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* 透明度 */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-slate-500 dark:text-zinc-400">透明度</label>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{Math.round(selectedSig.opacity * 100)}%</span>
                </div>
                <input type="range" min="10" max="100" value={Math.round(selectedSig.opacity * 100)}
                  onChange={(e) => updateSigProp(selectedSig.id, { opacity: Number(e.target.value) / 100 })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* ── フッター操作 ── */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800">
                ← 前
              </button>
              <span className="text-sm text-slate-500 dark:text-zinc-400">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800">
                次 →
              </button>
              <button onClick={() => { setPdfFile(null); setSigs([]); }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline">
                別のPDFを選択
              </button>
            </div>
            <button onClick={exportPdf} disabled={isExporting || sigs.length === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm disabled:opacity-50 transition-colors">
              {isExporting ? "保存中…" : "✓ 署名済みPDFを保存"}
            </button>
          </div>

          {/* ── 書類作成導線 ── */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-3">署名する書類を作成する</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { href: "/tools/business-contract-generator", emoji: "📋", label: "業務委託契約書" },
                { href: "/tools/nda-generator", emoji: "🤝", label: "NDA" },
                { href: "/tools/invoice-generator", emoji: "🧾", label: "請求書" },
                { href: "/tools/estimate-generator", emoji: "📊", label: "見積書" },
              ].map(({ href, emoji, label }) => (
                <a key={href} href={href}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <span>{emoji}</span>
                  <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
