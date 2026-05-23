"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw } from "lucide-react";
import Link from "next/link";

type OmoteGaki = {
  label: string;
  mizuhiki: "cho" | "musubi" | "awaji";
  color: string;
};

const OMOTE_GAKI: OmoteGaki[] = [
  { label: "御祝", mizuhiki: "cho", color: "#e11d48" },
  { label: "御結婚御祝", mizuhiki: "musubi", color: "#e11d48" },
  { label: "内祝", mizuhiki: "cho", color: "#e11d48" },
  { label: "出産祝", mizuhiki: "cho", color: "#e11d48" },
  { label: "出産内祝", mizuhiki: "cho", color: "#e11d48" },
  { label: "快気祝", mizuhiki: "musubi", color: "#e11d48" },
  { label: "御歳暮", mizuhiki: "cho", color: "#2563eb" },
  { label: "御中元", mizuhiki: "cho", color: "#2563eb" },
  { label: "御年賀", mizuhiki: "cho", color: "#e11d48" },
  { label: "御見舞", mizuhiki: "musubi", color: "#64748b" },
  { label: "粗品", mizuhiki: "cho", color: "#64748b" },
  { label: "寸志", mizuhiki: "cho", color: "#64748b" },
];

const MIZUHIKI_LABELS: Record<string, string> = {
  cho: "蝶結び（花結び）",
  musubi: "結び切り",
  awaji: "あわじ結び",
};

// SVG components for mizuhiki
function MizuhikiSvg({ type, color }: { type: string; color: string }) {
  const c2 = "#d4a017";
  if (type === "cho") {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-12" aria-hidden="true">
        <path d="M10,30 Q50,5 100,30 Q150,55 190,30" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M10,30 Q50,55 100,30 Q150,5 190,30" stroke={c2} strokeWidth="2" fill="none"/>
        <circle cx="100" cy="30" r="5" fill={color}/>
        <circle cx="100" cy="30" r="3" fill={c2}/>
        <path d="M100,30 Q90,42 85,50" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M100,30 Q110,42 115,50" stroke={c2} strokeWidth="2" fill="none"/>
        <path d="M100,30 Q90,18 85,10" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M100,30 Q110,18 115,10" stroke={c2} strokeWidth="2" fill="none"/>
      </svg>
    );
  }
  if (type === "musubi") {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-12" aria-hidden="true">
        <path d="M10,25 L85,25 Q100,25 100,30 Q100,35 115,35 L190,35" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M10,35 L85,35 Q100,35 100,30 Q100,25 115,25 L190,25" stroke={c2} strokeWidth="2" fill="none"/>
        <ellipse cx="100" cy="30" rx="8" ry="6" fill="none" stroke={color} strokeWidth="2"/>
      </svg>
    );
  }
  // awaji
  return (
    <svg viewBox="0 0 200 60" className="w-full h-12" aria-hidden="true">
      <path d="M10,30 Q40,10 70,25 Q100,40 100,30 Q100,20 130,25 Q160,30 190,30" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M10,30 Q40,50 70,35 Q100,20 100,30 Q100,40 130,35 Q160,30 190,30" stroke={c2} strokeWidth="2" fill="none"/>
      <circle cx="100" cy="30" r="4" fill={color}/>
    </svg>
  );
}

// Noshi symbol (右上の熨斗マーク)
function NoshiSymbol() {
  return (
    <div className="absolute top-2 right-2 w-16 h-20 flex flex-col items-center justify-center print:top-3 print:right-3">
      <svg viewBox="0 0 50 70" className="w-12 h-16" aria-hidden="true">
        <polygon points="25,2 48,35 25,68 2,35" fill="#fff9c4" stroke="#d4a017" strokeWidth="1.5"/>
        <polygon points="25,8 43,35 25,62 7,35" fill="#fff176" stroke="#d4a017" strokeWidth="1"/>
        <text x="25" y="40" textAnchor="middle" fontSize="10" fill="#92400e" fontFamily="serif">熨斗</text>
      </svg>
    </div>
  );
}

export function NoshiMaker() {
  const [selected, setSelected] = useState<OmoteGaki>(OMOTE_GAKI[0]);
  const [customText, setCustomText] = useState("");
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [mizuhikiOverride, setMizuhikiOverride] = useState<"auto" | "cho" | "musubi" | "awaji">("auto");
  const [showPreview, setShowPreview] = useState(false);

  const effectiveMizuhiki = mizuhikiOverride === "auto" ? selected.mizuhiki : mizuhikiOverride;
  const displayText = customText.trim() || selected.label;
  const displayName = name.trim();
  const displaySubName = subName.trim();

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#noshi-print-area) { display: none !important; }
          #noshi-print-area { display: flex !important; }
          @page { size: A4; margin: 10mm; }
        }
        @media screen {
          #noshi-print-area { display: none; }
        }
      `}</style>

      {/* Print output (hidden on screen, shown on print) */}
      <div id="noshi-print-area" className="hidden print:flex items-center justify-center w-full h-full">
        <div className="relative border-2 border-slate-300" style={{ width: "150mm", height: "210mm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10mm", fontFamily: "'Noto Serif JP', serif", background: "white" }}>
          <div style={{ position: "absolute", top: "8mm", right: "8mm", width: "20mm", height: "28mm" }}>
            <svg viewBox="0 0 50 70" style={{ width: "100%", height: "100%" }}>
              <polygon points="25,2 48,35 25,68 2,35" fill="#fff9c4" stroke="#d4a017" strokeWidth="1.5"/>
              <polygon points="25,8 43,35 25,62 7,35" fill="#fff176" stroke="#d4a017" strokeWidth="1"/>
              <text x="25" y="40" textAnchor="middle" fontSize="10" fill="#92400e" fontFamily="serif">熨斗</text>
            </svg>
          </div>
          <div style={{ marginBottom: "8mm", width: "120mm" }}>
            {effectiveMizuhiki === "cho" && (
              <svg viewBox="0 0 200 60" style={{ width: "100%", height: "20mm" }}>
                <path d="M10,30 Q50,5 100,30 Q150,55 190,30" stroke="#e11d48" strokeWidth="2" fill="none"/>
                <path d="M10,30 Q50,55 100,30 Q150,5 190,30" stroke="#d4a017" strokeWidth="2" fill="none"/>
                <circle cx="100" cy="30" r="5" fill="#e11d48"/>
                <path d="M100,30 Q90,42 85,50" stroke="#e11d48" strokeWidth="2" fill="none"/>
                <path d="M100,30 Q110,42 115,50" stroke="#d4a017" strokeWidth="2" fill="none"/>
              </svg>
            )}
            {effectiveMizuhiki === "musubi" && (
              <svg viewBox="0 0 200 60" style={{ width: "100%", height: "20mm" }}>
                <path d="M10,25 L85,25 Q100,25 100,30 Q100,35 115,35 L190,35" stroke="#e11d48" strokeWidth="2" fill="none"/>
                <path d="M10,35 L85,35 Q100,35 100,30 Q100,25 115,25 L190,25" stroke="#d4a017" strokeWidth="2" fill="none"/>
              </svg>
            )}
            {effectiveMizuhiki === "awaji" && (
              <svg viewBox="0 0 200 60" style={{ width: "100%", height: "20mm" }}>
                <path d="M10,30 Q40,10 70,25 Q100,40 100,30 Q100,20 130,25 Q160,30 190,30" stroke="#e11d48" strokeWidth="2" fill="none"/>
                <path d="M10,30 Q40,50 70,35 Q100,20 100,30 Q100,40 130,35 Q160,30 190,30" stroke="#d4a017" strokeWidth="2" fill="none"/>
              </svg>
            )}
          </div>
          <p style={{ fontSize: "22pt", fontWeight: "bold", letterSpacing: "0.15em", textAlign: "center", color: "#1e293b", marginBottom: "12mm", fontFamily: "'Noto Serif JP', serif", writingMode: "horizontal-tb" }}>
            {displayText}
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4mm" }}>
            {displayName && (
              <p style={{ fontSize: "16pt", textAlign: "center", color: "#1e293b", fontFamily: "'Noto Serif JP', serif" }}>{displayName}</p>
            )}
            {displaySubName && (
              <p style={{ fontSize: "12pt", textAlign: "center", color: "#64748b", fontFamily: "'Noto Serif JP', serif" }}>{displaySubName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* 表書き selection */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">表書きを選択</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {OMOTE_GAKI.map((og) => (
              <button
                key={og.label}
                onClick={() => { setSelected(og); setCustomText(""); }}
                className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold text-center transition-all ${
                  selected.label === og.label && !customText
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700"
                }`}
              >
                {og.label}
              </button>
            ))}
          </div>
          <div>
            <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1 block">独自の表書き（任意）</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="例：御餞別"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* 水引 selection */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">水引の種類</p>
          <div className="grid grid-cols-3 gap-3">
            {(["auto", "cho", "musubi", "awaji"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMizuhikiOverride(type)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  mizuhikiOverride === type
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20"
                    : "border-slate-200 dark:border-zinc-700 hover:border-rose-200"
                }`}
              >
                {type !== "auto" && <MizuhikiSvg type={type} color="#e11d48" />}
                <p className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 mt-1">
                  {type === "auto" ? "自動（表書きに合わせる）" : MIZUHIKI_LABELS[type]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 名入れ */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">名入れ</p>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1 block">お名前（下段）</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：山田太郎"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1 block">副名・読み仮名（任意）</label>
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="例：やまだたろう / 田中・山田"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700 text-[13px] font-semibold text-slate-500 hover:border-rose-300 hover:text-rose-600 transition-colors"
        >
          {showPreview ? "▲ プレビューを閉じる" : "▼ 画面でプレビューを確認する"}
        </button>

        {/* Screen preview */}
        {showPreview && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-rose-200 dark:border-rose-800/50 p-6">
            <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 text-center">プレビュー（のし紙イメージ）</p>
            <div className="relative mx-auto bg-white border border-slate-200 rounded-lg shadow-sm" style={{ width: "min(280px, 100%)", aspectRatio: "150/210", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
              <NoshiSymbol />
              <div className="w-full mb-4">
                <MizuhikiSvg type={effectiveMizuhiki} color={selected.color} />
              </div>
              <p className="text-[22px] font-bold text-center text-slate-800 tracking-widest" style={{ fontFamily: "'Noto Serif JP', Georgia, serif" }}>
                {displayText || "表書き"}
              </p>
              {displayName && (
                <p className="text-[14px] text-center text-slate-600 mt-4" style={{ fontFamily: "'Noto Serif JP', Georgia, serif" }}>
                  {displayName}
                </p>
              )}
              {displaySubName && (
                <p className="text-[11px] text-center text-slate-400 mt-1" style={{ fontFamily: "'Noto Serif JP', Georgia, serif" }}>
                  {displaySubName}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Print / reset buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
          >
            <Printer className="w-5 h-5" />
            印刷・PDF保存
          </button>
          <button
            onClick={() => { setSelected(OMOTE_GAKI[0]); setCustomText(""); setName(""); setSubName(""); setMizuhikiOverride("auto"); setShowPreview(false); }}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            title="リセット"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Print tip */}
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 text-[13px] text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">🖨️ 印刷のヒント</p>
          <ul className="space-y-1 text-[12px]">
            <li>• A4用紙に印刷 → 切り取ってのし紙として使用できます</li>
            <li>• ブラウザの印刷ダイアログで「余白：なし」を推奨</li>
            <li>• コンビニ印刷：PDFとして保存 → ネットプリントで出力</li>
          </ul>
        </div>

        {/* Related tools */}
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { href: "/tools/koden-maker", emoji: "🕯️", label: "香典袋表書き", desc: "宗派別表書き作成" },
              { href: "/tools/fax-cover", emoji: "📠", label: "送付状作成", desc: "書類送付状を作成" },
              { href: "/tools/invoice-generator", emoji: "🧾", label: "請求書作成", desc: "PDF対応" },
            ].map((t) => (
              <Link key={t.href} href={t.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 hover:border-rose-300 dark:hover:border-rose-700 transition-colors group">
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{t.label}</p>
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
