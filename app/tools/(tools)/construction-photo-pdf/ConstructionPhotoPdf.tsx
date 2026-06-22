"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, GripVertical, Loader2, CheckCircle2, Printer } from "lucide-react";

type Phase = "施工前" | "施工中" | "施工後" | "完成" | "その他";

type PhotoItem = {
  id: string;
  file: File;
  preview: string;
  phase: Phase;
  location: string;
  comment: string;
};

type ReportInfo = {
  projectName: string;
  constructionName: string;
  constructionAddress: string;
  reportDate: string;
  companyName: string;
  managerName: string;
  notes: string;
};

const PHASES: Phase[] = ["施工前", "施工中", "施工後", "完成", "その他"];
const PHASE_COLORS: Record<Phase, string> = {
  "施工前": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "施工中": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "施工後": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "完成": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "その他": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};
const PHASE_PRINT_COLORS: Record<Phase, string> = {
  "施工前": "#64748b",
  "施工中": "#2563eb",
  "施工後": "#16a34a",
  "完成": "#d97706",
  "その他": "#7c3aed",
};

export function ConstructionPhotoPdf() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [info, setInfo] = useState<ReportInfo>({
    projectName: "",
    constructionName: "",
    constructionAddress: "",
    reportDate: new Date().toISOString().slice(0, 10),
    companyName: "",
    managerName: "",
    notes: "",
  });
  const [photosPerPage, setPhotosPerPage] = useState<2 | 4>(2);
  const [printing, setPrinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const imgs = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/") || /\.(jpg|jpeg|png|heic|webp)$/i.test(f.name)
    );
    if (!imgs.length) return;
    setPhotos((prev) => [
      ...prev,
      ...imgs.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        preview: URL.createObjectURL(f),
        phase: "施工前" as Phase,
        location: "",
        comment: "",
      })),
    ]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePhoto = (id: string, field: keyof PhotoItem, value: string) => {
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handlePrint = async () => {
    if (photos.length === 0) return;
    setPrinting(true);
    // Give object URLs a moment to be ready
    await new Promise((r) => setTimeout(r, 100));
    window.print();
    setPrinting(false);
  };

  const inputSm = "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-[13px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const cols = photosPerPage === 2 ? 2 : 2;

  return (
    <div className="space-y-6">
      {/* ── 印刷専用DOM（通常非表示） ── */}
      <div id="print-report" className="hidden print:block">
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 15mm 12mm; }
            body > *:not(#print-report) { display: none !important; }
            #print-report { display: block !important; font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif; }
            .print-page-break { page-break-after: always; }
            .print-avoid-break { page-break-inside: avoid; }
          }
        `}</style>

        {/* 表紙 */}
        <div className="print-page-break" style={{ minHeight: "250mm", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "16px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b", marginBottom: "8px" }}>工事写真帳</div>
          {info.constructionName && <div style={{ fontSize: "18px", color: "#334155" }}>{info.constructionName}</div>}
          {info.projectName && <div style={{ fontSize: "16px", color: "#475569" }}>現場名：{info.projectName}</div>}
          {info.constructionAddress && <div style={{ fontSize: "14px", color: "#64748b" }}>{info.constructionAddress}</div>}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "16px", fontSize: "14px", color: "#64748b", lineHeight: "2" }}>
            {info.reportDate && <div>作成日：{info.reportDate}</div>}
            {info.companyName && <div>施工会社：{info.companyName}</div>}
            {info.managerName && <div>担当者：{info.managerName}</div>}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>全{photos.length}枚</div>
        </div>

        {/* 写真グリッドページ */}
        {(() => {
          const pages: PhotoItem[][] = [];
          for (let i = 0; i < photos.length; i += photosPerPage) {
            pages.push(photos.slice(i, i + photosPerPage));
          }
          return pages.map((pagePhotos, pi) => (
            <div key={pi} className={pi < pages.length - 1 ? "print-page-break" : ""} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "12px", alignContent: "start" }}>
              {pagePhotos.map((photo) => (
                <div key={photo.id} className="print-avoid-break" style={{ border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.preview} alt={photo.comment || photo.location || "工事写真"} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "8px 10px", background: "#f8fafc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ background: PHASE_PRINT_COLORS[photo.phase], color: "#fff", fontSize: "11px", fontWeight: "bold", padding: "2px 8px", borderRadius: "999px" }}>{photo.phase}</span>
                      {photo.location && <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>{photo.location}</span>}
                    </div>
                    {photo.comment && <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{photo.comment}</div>}
                  </div>
                </div>
              ))}
            </div>
          ));
        })()}

        {/* 備考 */}
        {info.notes && (
          <div style={{ marginTop: "24px", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px", color: "#475569" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>備考・特記事項</div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{info.notes}</div>
          </div>
        )}
      </div>

      {/* ── 通常UI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* 左：レポート設定 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">写真帳の基本情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事名</label>
              <input type="text" value={info.constructionName} onChange={(e) => setInfo({ ...info, constructionName: e.target.value })} placeholder="○○邸 外壁塗装工事" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">現場名</label>
              <input type="text" value={info.projectName} onChange={(e) => setInfo({ ...info, projectName: e.target.value })} placeholder="山田邸" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事場所</label>
              <input type="text" value={info.constructionAddress} onChange={(e) => setInfo({ ...info, constructionAddress: e.target.value })} placeholder="東京都○○区○○町1-2-3" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">作成日</label>
              <input type="date" value={info.reportDate} onChange={(e) => setInfo({ ...info, reportDate: e.target.value })} className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施工会社</label>
              <input type="text" value={info.companyName} onChange={(e) => setInfo({ ...info, companyName: e.target.value })} placeholder="○○建設株式会社" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">担当者名</label>
              <input type="text" value={info.managerName} onChange={(e) => setInfo({ ...info, managerName: e.target.value })} placeholder="担当者名" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">備考・特記事項</label>
              <textarea rows={3} value={info.notes} onChange={(e) => setInfo({ ...info, notes: e.target.value })} placeholder="工期・使用材料など" className={`${inputSm} resize-none`} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">レイアウト設定</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">1ページあたりの枚数</label>
              <div className="flex gap-2">
                {([2, 4] as const).map((n) => (
                  <button key={n} onClick={() => setPhotosPerPage(n)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${photosPerPage === n ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"}`}>
                    {n}枚
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            disabled={photos.length === 0 || printing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 text-white font-semibold rounded-xl text-[15px] transition-colors flex items-center justify-center gap-2">
            {printing ? <><Loader2 className="w-5 h-5 animate-spin" />準備中...</> : <><Printer className="w-5 h-5" />PDF保存・印刷</>}
          </button>
          {photos.length === 0 && <p className="text-center text-[13px] text-slate-400">写真を追加してください</p>}
        </div>

        {/* 右：写真追加・編集 */}
        <div className="lg:col-span-3 space-y-4">
          {/* ドロップゾーン */}
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 text-center
              ${dragOver ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }} />
            <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">工事写真をドロップ、またはタップして選択</p>
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mt-1">JPG・PNG・HEIC対応・複数選択可</p>
          </div>

          {/* 写真リスト */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-slate-600 dark:text-zinc-400">{photos.length}枚追加済み — ドラッグで順番変更</p>
                <button onClick={() => { photos.forEach((p) => URL.revokeObjectURL(p.preview)); setPhotos([]); }}
                  className="text-[13px] text-slate-400 hover:text-red-500 transition-colors">全削除</button>
              </div>
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragIndex(null)}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl p-3 flex gap-3 items-start cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-zinc-600 mt-2 shrink-0" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.preview} alt="" className="w-20 h-16 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {PHASES.map((phase) => (
                        <button key={phase} onClick={() => updatePhoto(photo.id, "phase", phase)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${photo.phase === phase ? PHASE_COLORS[phase] : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"}`}>
                          {phase}
                        </button>
                      ))}
                    </div>
                    <input type="text" placeholder="施工箇所（例：南面外壁）" value={photo.location}
                      onChange={(e) => updatePhoto(photo.id, "location", e.target.value)}
                      className={`${inputSm} text-[12px]`} />
                    <textarea placeholder="コメント（例：下塗り完了。一部クラック補修済み）" value={photo.comment}
                      onChange={(e) => updatePhoto(photo.id, "comment", e.target.value)}
                      rows={2} className={`${inputSm} resize-none text-[12px]`} />
                  </div>
                  <button onClick={() => removePhoto(photo.id)} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0">×</button>
                </div>
              ))}
            </div>
          )}

          {/* 完了バナー */}
          {photos.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-[13px] text-green-700 dark:text-green-400">
                {photos.length}枚の写真が準備できました。左の「PDF保存・印刷」ボタンで出力できます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
