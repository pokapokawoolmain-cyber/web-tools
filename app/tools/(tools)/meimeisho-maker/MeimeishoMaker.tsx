"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw } from "lucide-react";

type Style = "formal" | "simple";

function toWarekiEra(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  let eraName = "令和";
  let eraYear = y - 2018;
  if (y < 2019 || (y === 2019 && m < 5)) {
    eraName = "平成";
    eraYear = y - 1988;
  }
  const eraYearText = eraYear === 1 ? "元" : String(eraYear);
  return `${eraName}${eraYearText}年${m}月${day}日`;
}

export function MeimeishoMaker() {
  const [style, setStyle] = useState<Style>("formal");
  const [babyName, setBabyName] = useState("");
  const [babyKana, setBabyKana] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [writeDate, setWriteDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = useCallback(() => window.print(), []);
  const handleReset = useCallback(() => {
    setBabyName(""); setBabyKana(""); setBirthDate(""); setFatherName(""); setMotherName(""); setWriteDate("");
  }, []);

  const birthWareki = toWarekiEra(birthDate);
  const writeWareki = toWarekiEra(writeDate);
  const parentsLine = fatherName && motherName ? `父　${fatherName}　母　${motherName}` : fatherName ? `父　${fatherName}` : motherName ? `母　${motherName}` : "父　　　　　　母";

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2.5 text-[14px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500";

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#meimeisho-print-area) { display: none !important; }
          #meimeisho-print-area { display: flex !important; }
          @page { size: A4; margin: 15mm; }
        }
        @media screen { #meimeisho-print-area { display: none; } }
      `}</style>

      {/* Print area */}
      <div id="meimeisho-print-area" className="hidden print:flex flex-col items-center justify-center w-full" style={{ minHeight: "250mm" }}>
        <div style={{ width: "150mm", height: "210mm", border: "1px solid #ccc", display: "flex", flexDirection: "row-reverse", padding: "12mm", fontFamily: "'Noto Serif JP', serif", background: "white", position: "relative" }}>
          {/* 右側：命名 + 名前（縦書き） */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", writingMode: "vertical-rl", height: "100%" }}>
            <p style={{ fontSize: "20pt", letterSpacing: "0.3em", color: "#1e293b" }}>命名</p>
            <div style={{ height: "10mm" }} />
            <p style={{ fontSize: "40pt", letterSpacing: "0.15em", color: "#1e293b", fontWeight: 500 }}>
              {babyName || "○　○　○　○"}
            </p>
            {babyKana && (
              <p style={{ fontSize: "10pt", color: "#64748b", marginTop: "4mm" }}>{babyKana}</p>
            )}
          </div>

          {style === "formal" && (
            <>
              {/* 中央：生年月日（縦書き） */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", flex: 1 }}>
                <p style={{ fontSize: "13pt", color: "#334155" }}>
                  {birthWareki ? `${birthWareki}生` : "　　　　　　　　　年　　月　　日生"}
                </p>
              </div>
              {/* 左側：両親名 + 記名日（縦書き） */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", writingMode: "vertical-rl", height: "100%" }}>
                <p style={{ fontSize: "12pt", color: "#334155" }}>{parentsLine}</p>
                <p style={{ fontSize: "11pt", color: "#64748b" }}>{writeWareki || "命名の日"}</p>
              </div>
            </>
          )}
          {style === "simple" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", writingMode: "vertical-rl", flex: 1 }}>
              <p style={{ fontSize: "12pt", color: "#334155" }}>{parentsLine}</p>
              {birthWareki && <p style={{ fontSize: "11pt", color: "#64748b", marginTop: "3mm" }}>{birthWareki}生</p>}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {/* 書式選択 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">書式を選択</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "formal", label: "正式（奉書・命名式向け）" },
                { id: "simple", label: "略式（シンプル・命名紙）" },
              ] as { id: Style; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`py-3 px-3 rounded-xl text-[13px] font-semibold transition-all ${
                  style === s.id
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 赤ちゃん情報 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">赤ちゃんの情報</p>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">お名前（漢字）</label>
            <input type="text" value={babyName} onChange={(e) => setBabyName(e.target.value)} placeholder="山田　太郎" className={inputClass} style={{ fontFamily: "'Noto Serif JP', serif" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">よみがな（任意）</label>
            <input type="text" value={babyKana} onChange={(e) => setBabyKana(e.target.value)} placeholder="やまだ　たろう" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">生年月日</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* 両親情報 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ご両親・記名日</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">父の名前</label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="山田　一郎" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">母の名前</label>
              <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="山田　花子" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">命名書に記す日付（お七夜など・任意）</label>
            <input type="date" value={writeDate} onChange={(e) => setWriteDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* プレビュー切替 */}
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-[13px] font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {showPreview ? "プレビューを閉じる" : "プレビューを表示"}
        </button>

        {showPreview && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 flex justify-center overflow-x-auto">
            <div style={{ width: "260px", height: "360px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "row-reverse", padding: "16px", fontFamily: "'Noto Serif JP', serif", background: "white", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", writingMode: "vertical-rl", height: "100%" }}>
                <p style={{ fontSize: "14px", letterSpacing: "0.3em", color: "#1e293b" }}>命名</p>
                <div style={{ height: "10px" }} />
                <p style={{ fontSize: "28px", letterSpacing: "0.15em", color: "#1e293b", fontWeight: 500 }}>{babyName || "○○○○"}</p>
              </div>
              {style === "formal" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", flex: 1 }}>
                    <p style={{ fontSize: "10px", color: "#334155" }}>{birthWareki ? `${birthWareki}生` : ""}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", writingMode: "vertical-rl", height: "100%" }}>
                    <p style={{ fontSize: "9px", color: "#334155" }}>{parentsLine}</p>
                    <p style={{ fontSize: "9px", color: "#64748b" }}>{writeWareki}</p>
                  </div>
                </>
              )}
              {style === "simple" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", writingMode: "vertical-rl", flex: 1 }}>
                  <p style={{ fontSize: "10px", color: "#334155" }}>{parentsLine}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作ボタン */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-zinc-200 dark:to-white text-white dark:text-zinc-900 text-[14px] font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Printer className="w-4 h-4" />
            印刷 / PDF保存
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 text-[13px] font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            リセット
          </button>
        </div>

        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-4">
          <p className="text-[12px] text-amber-800 dark:text-amber-300 leading-relaxed">
            ※ 命名書は、正式には奉書紙に毛筆で書き、お七夜（生後7日目の祝い）に神棚や床の間、赤ちゃんの枕元に飾る習わしです。本ツールはA4用紙にそのまま印刷できる略式版として、コンビニ印刷や自宅プリンターでの使用を想定しています。正式な奉書での命名書は、書道の心得がある方や専門店への依頼もご検討ください。
          </p>
        </div>
      </div>
    </>
  );
}
