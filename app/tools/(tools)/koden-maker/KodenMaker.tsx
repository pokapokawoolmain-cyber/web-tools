"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw } from "lucide-react";
import Link from "next/link";

type Religion = "buddhist" | "shinto" | "christian" | "unknown";

const RELIGION_OPTIONS: { id: Religion; label: string; emoji: string }[] = [
  { id: "buddhist", label: "仏式", emoji: "🙏" },
  { id: "shinto", label: "神式", emoji: "⛩️" },
  { id: "christian", label: "キリスト教", emoji: "✝️" },
  { id: "unknown", label: "宗派不明", emoji: "❓" },
];

const OMOTE_GAKI_BY_RELIGION: Record<Religion, string[]> = {
  buddhist: ["御霊前", "御仏前", "御香典", "御香料", "御供料"],
  shinto: ["御霊前", "玉串料", "御榊料", "御神前"],
  christian: ["御花料", "御霊前", "御ミサ料"],
  unknown: ["御霊前", "御香典", "御花料"],
};

export function KodenMaker() {
  const [religion, setReligion] = useState<Religion>("buddhist");
  const [omoteGaki, setOmoteGaki] = useState("御霊前");
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [amount, setAmount] = useState("");
  const [fontStyle, setFontStyle] = useState<"thin" | "bold">("thin");
  const [showPreview, setShowPreview] = useState(false);

  const handleReligionChange = useCallback((r: Religion) => {
    setReligion(r);
    setOmoteGaki(OMOTE_GAKI_BY_RELIGION[r][0]);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Convert amount to kanji
  const toKanjiAmount = (n: string): string => {
    const num = parseInt(n.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return "";
    const kanjiDigits = ["〇","一","二","三","四","五","六","七","八","九"];
    const units = ["","拾","百","仟","萬","拾","百","仟","億"];
    const str = String(num);
    let result = "金";
    for (let i = 0; i < str.length; i++) {
      result += kanjiDigits[parseInt(str[i])];
      if (i < str.length - 1) result += units[str.length - 1 - i] || "";
    }
    return result + "圓";
  };

  const kanjiAmount = toKanjiAmount(amount);
  const fontClass = fontStyle === "thin"
    ? "font-normal"
    : "font-bold";

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#koden-print-area) { display: none !important; }
          #koden-print-area { display: flex !important; }
          @page { size: A4; margin: 10mm; }
        }
        @media screen { #koden-print-area { display: none; } }
      `}</style>

      {/* Print area */}
      <div id="koden-print-area" className="hidden print:flex flex-col items-center gap-8 w-full">
        {/* 表 (front) */}
        <div style={{ width: "120mm", height: "170mm", border: "1px solid #ccc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10mm", fontFamily: "'Noto Serif JP', serif", background: "white", position: "relative" }}>
          <p style={{ position: "absolute", top: "12mm", left: "50%", transform: "translateX(-50%)", fontSize: "8pt", color: "#64748b", letterSpacing: "0.1em" }}>表書き（おもてがき）</p>
          <p style={{ fontSize: "24pt", fontWeight: fontStyle === "bold" ? "bold" : "normal", letterSpacing: "0.2em", textAlign: "center", color: "#1e293b", marginBottom: "15mm", fontFamily: "'Noto Serif JP', serif" }}>
            {omoteGaki}
          </p>
          <div style={{ width: "60%", height: "1px", background: "#94a3b8", marginBottom: "15mm" }} />
          <p style={{ fontSize: "16pt", textAlign: "center", color: "#1e293b", fontFamily: "'Noto Serif JP', serif" }}>{name || "　　　　　"}</p>
          {subName && <p style={{ fontSize: "11pt", textAlign: "center", color: "#64748b", marginTop: "4mm", fontFamily: "'Noto Serif JP', serif" }}>{subName}</p>}
        </div>
        {/* 中袋（金額） */}
        {amount && (
          <div style={{ width: "120mm", height: "80mm", border: "1px solid #ccc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8mm", fontFamily: "'Noto Serif JP', serif", background: "white" }}>
            <p style={{ fontSize: "8pt", color: "#64748b", marginBottom: "4mm" }}>中袋（金額）</p>
            <p style={{ fontSize: "16pt", textAlign: "center", letterSpacing: "0.1em", color: "#1e293b" }}>{kanjiAmount}</p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Religion selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">宗派を選択</p>
          <div className="grid grid-cols-4 gap-2">
            {RELIGION_OPTIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleReligionChange(r.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-center transition-all ${
                  religion === r.id
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-[11px] font-semibold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 表書き selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">表書き</p>
          <div className="grid grid-cols-3 gap-2">
            {OMOTE_GAKI_BY_RELIGION[religion].map((og) => (
              <button
                key={og}
                onClick={() => setOmoteGaki(og)}
                className={`py-3 px-2 rounded-xl text-[14px] font-semibold tracking-wider transition-all ${
                  omoteGaki === og
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                {og}
              </button>
            ))}
          </div>
          {religion === "buddhist" && (
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
              ※「御仏前」は四十九日以降に使用。「御霊前」は四十九日前まで。
            </p>
          )}
        </div>

        {/* Font style */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">フォントスタイル</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "thin", label: "薄墨（弔事向け）", desc: "細めの文字で薄墨を再現" },
              { id: "bold", label: "濃墨（慶事向け）", desc: "しっかりした太字" },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFontStyle(f.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  fontStyle === f.id
                    ? "border-slate-700 dark:border-zinc-300 bg-slate-50 dark:bg-zinc-800"
                    : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                }`}
              >
                <p className={`text-[18px] ${fontStyle === f.id ? fontClass : ""} text-slate-800 dark:text-zinc-200 mb-1`} style={{ fontFamily: "'Noto Serif JP', serif" }}>御霊前</p>
                <p className="text-[11px] text-slate-400">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">お名前（下段）</p>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田太郎"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 tracking-wider"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            />
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="連名・会社名（任意）例：山田太郎・田中花子"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">香典金額（中袋用・任意）</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例：5000（円）"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-500"
          />
          {kanjiAmount && (
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-2">大字：<strong className="text-slate-800 dark:text-zinc-200">{kanjiAmount}</strong></p>
          )}
        </div>

        {/* Preview */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700 text-[13px] font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
        >
          {showPreview ? "▲ プレビューを閉じる" : "▼ 画面でプレビューを確認する"}
        </button>

        {showPreview && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6">
            <p className="text-[12px] text-center text-slate-400 mb-4">香典袋プレビュー（表）</p>
            <div className="mx-auto bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 p-8" style={{ width: "min(220px, 100%)", minHeight: "280px" }}>
              <p className={`text-[26px] ${fontClass} text-slate-800 tracking-[0.25em] text-center`} style={{ fontFamily: "'Noto Serif JP', Georgia, serif", color: fontStyle === "thin" ? "#94a3b8" : "#1e293b" }}>
                {omoteGaki}
              </p>
              <div className="w-2/3 h-px bg-slate-300" />
              <p className="text-[16px] text-slate-700 tracking-wider text-center" style={{ fontFamily: "'Noto Serif JP', Georgia, serif" }}>
                {name || "　　　　"}
              </p>
              {subName && <p className="text-[12px] text-slate-400 text-center">{subName}</p>}
            </div>
          </div>
        )}

        {/* Print button */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            <Printer className="w-5 h-5" />
            印刷・PDF保存
          </button>
          <button
            onClick={() => { setName(""); setSubName(""); setAmount(""); setShowPreview(false); }}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 text-[12px] text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">⚠️ ご注意</p>
          <ul className="space-y-1">
            <li>• 薄墨の再現はモニター・プリンターによって異なります</li>
            <li>• 重要な場面では手書きまたは専門店での作成を推奨します</li>
            <li>• 入力内容はサーバーに送信されません</li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { href: "/tools/noshi-maker", emoji: "🎀", label: "のし紙作成", desc: "慶事用のし紙" },
              { href: "/tools/fax-cover", emoji: "📠", label: "送付状作成", desc: "書類送付状" },
              { href: "/tools/resignation-letter", emoji: "📄", label: "退職届作成", desc: "テンプレ多数" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 hover:border-slate-400 transition-colors group">
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">{t.label}</p>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
