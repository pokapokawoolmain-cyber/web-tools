"use client";
import { useState, useEffect, useMemo } from "react";

type FormState = {
  date: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  body: string;
  senderName: string;
  senderAddress: string;
};

const defaultForm: FormState = {
  date: "",
  recipientName: "",
  recipientAddress: "",
  subject: "通知書",
  body: "",
  senderName: "",
  senderAddress: "",
};

const CHARS_PER_LINE = 26;
const LINES_PER_PAGE = 20;

export function CertifiedLetterGenerator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("certified-letter-form");
    if (saved) {
      try { setForm(JSON.parse(saved)); return; } catch {}
    }
    const today = new Date();
    setForm(f => ({
      ...f,
      date: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("certified-letter-form", JSON.stringify(form));
  }, [form]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm(f => ({ ...f, [key]: val }));

  const bodyLines = useMemo(() => {
    return form.body.split('\n').flatMap(line => {
      if (!line) return [''];
      const chunks: string[] = [];
      for (let i = 0; i < line.length; i += CHARS_PER_LINE) {
        chunks.push(line.slice(i, i + CHARS_PER_LINE));
      }
      return chunks;
    });
  }, [form.body]);

  const totalLines = bodyLines.length;
  const totalPages = Math.max(1, Math.ceil(totalLines / LINES_PER_PAGE));
  const isOverLimit = totalLines > LINES_PER_PAGE;

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2000); };

  const handleCopy = () => {
    const text = `${form.date}

${form.recipientName} 殿
${form.recipientAddress}

${form.subject}

${form.body}

差出人 ${form.senderName}
${form.senderAddress}`;
    navigator.clipboard.writeText(text).then(() => showToast("コピーしました"));
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">{toastMsg}</div>
      )}

      <div className="no-print bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">作成日</label>
            <input type="text" value={form.date} onChange={e => set("date", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">件名</label>
            <input type="text" value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="催告書・通知書 など" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">宛先名</label>
            <input type="text" value={form.recipientName} onChange={e => set("recipientName", e.target.value)} placeholder="〇〇 〇〇" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">宛先住所</label>
            <input type="text" value={form.recipientAddress} onChange={e => set("recipientAddress", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">差出人名</label>
            <input type="text" value={form.senderName} onChange={e => set("senderName", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">差出人住所</label>
            <input type="text" value={form.senderAddress} onChange={e => set("senderAddress", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">本文</label>
          <textarea value={form.body} onChange={e => set("body", e.target.value)} placeholder="貴殿は、令和〇年〇月〇日……" rows={10} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 dark:text-white" />
        </div>

        {/* 文字数ガイドバー */}
        <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between text-slate-700 dark:text-zinc-300">
            <span>本文行数: <strong>{totalLines}</strong>行 / 約{totalPages}枚</span>
            <span className="text-slate-500">推奨: 1枚あたり{LINES_PER_PAGE}行以内</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${isOverLimit ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((totalLines / LINES_PER_PAGE) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-500">日本郵便の内容証明：1行{CHARS_PER_LINE}文字・1枚{LINES_PER_PAGE}行が目安です</p>
        </div>
      </div>

      <div className="no-print flex gap-3 flex-wrap">
        <button onClick={() => window.print()} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">🖨️ PDFで保存・印刷</button>
        <button onClick={handleCopy} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors">📋 テキストをコピー</button>
        <button onClick={() => { setForm(defaultForm); localStorage.removeItem("certified-letter-form"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-zinc-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm transition-colors">リセット</button>
      </div>

      <div className="print-area">
        <div className="bg-white shadow-lg rounded-xl p-10 sm:p-16 text-slate-900 mx-auto" style={{ minHeight: '297mm', maxWidth: '210mm', fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold" style={{ letterSpacing: '0.5em' }}>内　容　証　明</h1>
          </div>

          <p className="text-right mb-8 text-sm">{form.date || "令和　年　月　日"}</p>

          <div className="mb-8 text-sm">
            <p>{form.recipientName || "宛先名"} 殿</p>
            <p>{form.recipientAddress}</p>
          </div>

          <p className="text-center text-lg font-bold mb-6">{form.subject || "通知書"}</p>

          <div className="text-sm leading-loose mb-10 font-mono">
            {bodyLines.length > 0 && bodyLines[0] ? (
              bodyLines.map((line, i) => <p key={i}>{line || " "}</p>)
            ) : (
              <p className="text-slate-400">（本文を入力してください）</p>
            )}
          </div>

          <div className="text-right text-sm space-y-1">
            <p>差出人 {form.senderName || "氏名"}</p>
            <p>{form.senderAddress}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-area > div { box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
