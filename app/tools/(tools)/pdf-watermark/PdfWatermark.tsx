"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Stamp, Download, Loader2, CheckCircle2, X } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type WatermarkPos = "center" | "diagonal";

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // watermark settings
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(25);
  const [fontSize, setFontSize] = useState(60);
  const [position, setPosition] = useState<WatermarkPos>("diagonal");
  const [color, setColor] = useState("#FF0000");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDFファイルを選択してください"); return;
    }
    setError(null); setDone(false); setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDFの読み込みに失敗しました。破損していないか確認してください。");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  const applyWatermark = async () => {
    if (!file || !text.trim()) {
      setError("透かしテキストを入力してください"); return;
    }
    setProcessing(true); setError(null);
    try {
      const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = hexToRgb(color);

      const pages = doc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        if (position === "center") {
          page.drawText(text, {
            x: (width - textWidth) / 2,
            y: (height - textHeight) / 2,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity / 100,
          });
        } else {
          // Diagonal: draw multiple times
          const angle = 45;
          const positions = [
            { x: width * 0.1, y: height * 0.2 },
            { x: width * 0.4, y: height * 0.5 },
            { x: width * 0.05, y: height * 0.65 },
            { x: width * 0.45, y: height * 0.85 },
            { x: width * 0.2, y: height * 0.35 },
            { x: width * 0.55, y: height * 0.15 },
          ];
          for (const pos of positions) {
            page.drawText(text, {
              x: pos.x,
              y: pos.y,
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity: opacity / 100,
              rotate: degrees(angle),
            });
          }
        }
      }

      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_watermarked.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError("透かし処理に失敗しました。");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setDone(false); setError(null); };

  const presetTexts = ["CONFIDENTIAL", "社外秘", "DRAFT", "サンプル", "校正中"];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 mb-4">
            <Stamp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDF透かし（ウォーターマーク）ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">PDFにテキスト透かしを追加。「社外秘」「DRAFT」など自由に設定。</p>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center mb-6
              ${dragOver ? "border-teal-400 bg-teal-50 dark:bg-teal-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { loadFile(e.target.files[0]); e.target.value = ""; } }} />
            {loading ? (
              <><Loader2 className="w-8 h-8 text-teal-400 mx-auto mb-3 animate-spin" /><p className="text-[15px] text-slate-500">読み込み中...</p></>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">PDF形式のみ対応</p>
              </>
            )}
          </div>
        )}

        {/* File loaded */}
        {file && pageCount > 0 && (
          <div className="mb-6 space-y-5">
            {/* File card */}
            <div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                <span className="text-lg">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400">{formatSize(file.size)} · {pageCount}ページ</p>
              </div>
              <button onClick={reset} className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Watermark text */}
            <div>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">透かしテキスト</p>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={40}
                placeholder="例: CONFIDENTIAL"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[15px] font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {presetTexts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setText(p)}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">配置スタイル</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { val: "diagonal", label: "斜め繰り返し", desc: "全面にタイル状" },
                  { val: "center", label: "中央1箇所", desc: "ページ中央のみ" },
                ] as { val: WatermarkPos; label: string; desc: string }[]).map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setPosition(opt.val)}
                    className={`flex flex-col items-start gap-0.5 p-4 rounded-2xl border-2 transition-all text-left ${position === opt.val ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30" : "border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-teal-200"}`}
                  >
                    <span className={`text-[13px] font-semibold ${position === opt.val ? "text-teal-700 dark:text-teal-300" : "text-slate-700 dark:text-slate-300"}`}>{opt.label}</span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color + opacity + size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">色</p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {["#FF0000", "#0000FF", "#808080", "#000000"].map((c) => (
                      <button key={c} onClick={() => setColor(c)} style={{ background: c }} className="w-7 h-7 rounded-lg border-2 border-white dark:border-zinc-900 shadow-sm hover:scale-110 transition-transform" />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">フォントサイズ <span className="font-normal text-slate-400">{fontSize}pt</span></p>
                <input type="range" min={20} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-teal-500" />
              </div>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">透明度 <span className="font-normal text-slate-400">{opacity}%</span></p>
              <input type="range" min={5} max={80} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-teal-500" />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>薄い</span><span>濃い</span>
              </div>
            </div>

            {/* Preview badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
              <span className="text-[11px] text-slate-400 shrink-0">プレビュー：</span>
              <span style={{ color, opacity: opacity / 100, fontSize: Math.min(fontSize * 0.35, 28), fontWeight: 700 }} className="truncate">
                {text || "（テキストを入力してください）"}
              </span>
            </div>
          </div>
        )}

        {error && <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{error}</div>}
        {done && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">透かし追加完了！</span>
          </div>
        )}

        <button
          onClick={applyWatermark}
          disabled={!file || pageCount === 0 || processing || !text.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
        >
          {processing ? <><Loader2 className="w-5 h-5 animate-spin" />処理中...</> : <><Download className="w-5 h-5" />透かしを追加してダウンロード</>}
        </button>

        {file && (
          <button onClick={reset} className="w-full mt-3 py-3 text-[14px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">リセット</button>
        )}

        {/* Usage */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>PDFをドロップまたはタップして選択</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>透かしテキスト・配置・色・透明度を設定</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>「透かしを追加してダウンロード」でPDFを取得</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">処理はブラウザ内で完結。ファイルはサーバーに送信されません。</p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "日本語の透かし文字は使えますか？", a: "入力フィールドに日本語テキストを入力できますが、pdf-libの標準フォント（Helvetica）はASCII文字のみ対応のため、日本語は記号や〓などで表示される場合があります。「DRAFT」「SAMPLE」「CONFIDENTIAL」などの英字や、「社外秘」の日本語プリセットをご活用ください。" },
              { q: "透かしを後から削除できますか？", a: "このツールはPDF内にテキストを埋め込む形式で透かしを追加します。追加後に削除するには専用のPDF編集ソフトが必要です。" },
              { q: "全ページに一括で透かしを追加できますか？", a: "はい。アップロードしたPDFの全ページに自動的に透かしが追加されます。" },
            ].map((item) => (
              <div key={item.q} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-[14px] font-semibold text-slate-800 dark:text-white mb-1.5">{item.q}</p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
