"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw } from "lucide-react";
import Link from "next/link";
import { EnvelopeFront, EnvelopeInner, PREVIEW_SIZE, PRINT_SIZE } from "@/components/tools/EnvelopeFace";
import { hasAvoidedDigits, splitSubName, toDaijiAmount } from "@/lib/envelope";

type Occasion = "wedding" | "baby" | "school" | "house" | "thanks";

const OCCASION_OPTIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: "wedding", label: "結婚", emoji: "💒" },
  { id: "baby", label: "出産", emoji: "🍼" },
  { id: "school", label: "入学・就職", emoji: "🎓" },
  { id: "house", label: "新築・御祝", emoji: "🏠" },
  { id: "thanks", label: "御礼・内祝", emoji: "🎁" },
];

const OMOTE_GAKI_BY_OCCASION: Record<Occasion, string[]> = {
  wedding: ["寿", "御結婚御祝", "御祝"],
  baby: ["御出産御祝", "御祝"],
  school: ["御入学御祝", "御卒業御祝", "御就職御祝", "御祝"],
  house: ["御新築御祝", "御祝"],
  thanks: ["御礼", "内祝", "寿"],
};

// 水引の案内（結婚＝結び切り／その他慶事＝蝶結び）
const MIZUHIKI_NOTE: Record<Occasion, string> = {
  wedding: "※結婚祝いの水引は「結び切り（10本・金銀または紅白）」を選びます。ほどけない結び方で「一度きり」の意味を込めます。",
  baby: "※出産祝いの水引は「蝶結び（紅白5本または7本）」。何度あっても嬉しいお祝いに使います。",
  school: "※入学・卒業・就職祝いの水引は「蝶結び（紅白5本または7本）」を選びます。",
  house: "※新築祝い・一般の御祝の水引は「蝶結び（紅白5本または7本）」を選びます。",
  thanks: "※結婚の内祝・御礼は「結び切り」、出産などその他の内祝は「蝶結び」を選びます。",
};

export function ShugiMaker() {
  const [occasion, setOccasion] = useState<Occasion>("wedding");
  const [omoteGaki, setOmoteGaki] = useState("寿");
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [amount, setAmount] = useState("");
  const [fontStyle, setFontStyle] = useState<"normal" | "bold">("bold");
  const [showPreview, setShowPreview] = useState(false);

  const handleOccasionChange = useCallback((o: Occasion) => {
    setOccasion(o);
    setOmoteGaki(OMOTE_GAKI_BY_OCCASION[o][0]);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);


  const kanjiAmount = toDaijiAmount(amount);
  const avoidDigits = hasAvoidedDigits(amount);
  const sub = splitSubName(subName);
  const names = [name.trim(), ...sub.names].filter(Boolean);

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#shugi-print-area) { display: none !important; }
          #shugi-print-area { display: flex !important; }
          @page { size: A4; margin: 10mm; }
        }
        @media screen { #shugi-print-area { display: none; } }
      `}</style>

      {/* Print area */}
      <div id="shugi-print-area" className="hidden print:flex flex-col items-center gap-8 w-full">
        {/* 表（縦書き：上段＝表書き／下段＝氏名） */}
        <EnvelopeFront omote={omoteGaki} names={names} org={sub.org} bold={fontStyle === "bold"} ink={"#111827"} size={PRINT_SIZE} />
        {/* 中袋（金額・縦書き） */}
        {kanjiAmount && <EnvelopeInner amount={kanjiAmount} size={PRINT_SIZE} heightRatio={0.52} />}
      </div>

      <div className="space-y-5">
        {/* Occasion selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">お祝いの用途を選択</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {OCCASION_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => handleOccasionChange(o.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-center transition-all ${
                  occasion === o.id
                    ? "bg-rose-700 dark:bg-rose-300 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="text-xl">{o.emoji}</span>
                <span className="text-[11px] font-semibold">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 表書き selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">表書き</p>
          <div className="grid grid-cols-3 gap-2">
            {OMOTE_GAKI_BY_OCCASION[occasion].map((og) => (
              <button
                key={og}
                onClick={() => setOmoteGaki(og)}
                className={`py-3 px-2 rounded-xl text-[14px] font-semibold tracking-wider transition-all ${
                  omoteGaki === og
                    ? "bg-rose-700 dark:bg-rose-300 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                {og}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">{MIZUHIKI_NOTE[occasion]}</p>
        </div>

        {/* Font style */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">フォントスタイル</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "bold", label: "濃墨・太字（推奨）", desc: "慶事は濃くはっきりと書きます" },
              { id: "normal", label: "標準", desc: "細めの上品な文字" },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFontStyle(f.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  fontStyle === f.id
                    ? "border-rose-600 dark:border-rose-300 bg-rose-50 dark:bg-zinc-800"
                    : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                }`}
              >
                <p className={`text-[18px] ${f.id === "bold" ? "font-bold" : "font-normal"} text-slate-800 dark:text-zinc-200 mb-1`} style={{ fontFamily: "'Noto Serif JP', serif" }}>寿</p>
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
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 tracking-wider"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            />
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="連名・会社名（任意）例：山田太郎・田中花子"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
            ※連名は3名まで。右から目上の順に書きます。4名以上は代表者名＋「外一同」とし、全員の名前は中袋に書きます。
          </p>
        </div>

        {/* Amount */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">ご祝儀金額（中袋用・任意）</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例：30000（円）"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
          />
          {kanjiAmount && (
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-2">大字：<strong className="text-slate-800 dark:text-zinc-200">{kanjiAmount}</strong></p>
          )}
          {avoidDigits && (
            <p className="text-[12px] text-amber-700 dark:text-amber-400 mt-1">ご祝儀では「4（死）」「9（苦）」を連想させる金額は避けるのが一般的です。</p>
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
            <p className="text-[12px] text-center text-slate-400 mb-4">祝儀袋プレビュー（表）</p>
            <div className="flex flex-wrap items-start justify-center gap-4">
              <EnvelopeFront omote={omoteGaki} names={names} org={sub.org} bold={fontStyle === "bold"} ink={"#111827"} size={PREVIEW_SIZE} />
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
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-800 text-white font-bold text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-lg"
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
            <li>• 印刷の濃さ・色味はモニター・プリンターによって異なります</li>
            <li>• 結婚式など重要な場面では手書きまたは専門店での作成も検討してください</li>
            <li>• 入力内容はサーバーに送信されません</li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { href: "/tools/noshi-maker", emoji: "🎀", label: "のし紙作成", desc: "慶事用のし紙" },
              { href: "/tools/koden-maker", emoji: "🕯️", label: "香典袋表書き", desc: "弔事用表書き" },
              { href: "/tools/hanko-generator", emoji: "🖋️", label: "ハンコ作成", desc: "電子印鑑" },
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
