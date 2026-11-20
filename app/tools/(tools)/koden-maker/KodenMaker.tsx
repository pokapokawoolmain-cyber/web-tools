"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw } from "lucide-react";
import Link from "next/link";
import { EnvelopeFront, EnvelopeInner, PREVIEW_SIZE, PRINT_SIZE } from "@/components/tools/EnvelopeFace";
import { hasAvoidedDigits, splitSubName, toDaijiAmount } from "@/lib/envelope";

type Religion = "buddhist" | "shinto" | "christian" | "unknown" | "ofuse";

const RELIGION_OPTIONS: { id: Religion; label: string; emoji: string }[] = [
  { id: "buddhist", label: "仏式", emoji: "🙏" },
  { id: "shinto", label: "神式", emoji: "⛩️" },
  { id: "christian", label: "キリスト教", emoji: "✝️" },
  { id: "unknown", label: "宗派不明", emoji: "❓" },
  { id: "ofuse", label: "お布施", emoji: "🪷" },
];

const OMOTE_GAKI_BY_RELIGION: Record<Religion, string[]> = {
  buddhist: ["御霊前", "御仏前", "御香典", "御香料", "御供料"],
  shinto: ["御霊前", "玉串料", "御榊料", "御神前"],
  christian: ["御花料", "御霊前", "御ミサ料"],
  unknown: ["御霊前", "御香典", "御花料"],
  ofuse: ["御布施", "御車代", "御膳料"],
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
    // お布施は濃墨で書くのがマナーのため自動で切り替え
    if (r === "ofuse") setFontStyle("bold");
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);


  const kanjiAmount = toDaijiAmount(amount);
  const avoidDigits = hasAvoidedDigits(amount);
  const sub = splitSubName(subName);
  const names = [name.trim(), ...sub.names].filter(Boolean);
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
        {/* 表（縦書き：上段＝表書き／下段＝氏名） */}
        <EnvelopeFront omote={omoteGaki} names={names} org={sub.org} bold={fontStyle === "bold"} ink={fontStyle === "thin" ? "#6b7280" : "#111827"} size={PRINT_SIZE} />
        {/* 中袋（金額・縦書き） */}
        {kanjiAmount && <EnvelopeInner amount={kanjiAmount} size={PRINT_SIZE} heightRatio={0.52} />}
      </div>

      <div className="space-y-5">
        {/* Religion selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">宗派・用途を選択</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
          {religion === "ofuse" && (
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
              ※お布施は僧侶へのお礼のため薄墨ではなく濃墨で書きます。「御車代」「御膳料」は御布施とは別の封筒で渡します。
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
          {avoidDigits && (
            <p className="text-[12px] text-amber-700 dark:text-amber-400 mt-1">香典では「4（死）」「9（苦）」を連想させる金額は避けるのが一般的です。</p>
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
            <div className="flex flex-wrap items-start justify-center gap-4">
              <EnvelopeFront omote={omoteGaki} names={names} org={sub.org} bold={fontStyle === "bold"} ink={fontStyle === "thin" ? "#6b7280" : "#111827"} size={PREVIEW_SIZE} />
              {kanjiAmount && (
                <div className="text-center">
                  <EnvelopeInner amount={kanjiAmount} size={PREVIEW_SIZE} />
                  <p className="mt-1 text-[11px] text-slate-400">中袋（表）</p>
                </div>
              )}
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
              { href: "/tools/noshi-maker", emoji: "🎀", label: "のし紙作成", desc: "のし紙・香典返しのかけ紙" },
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
