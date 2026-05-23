"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw, Copy, Check } from "lucide-react";
import Link from "next/link";

const BODY_TEMPLATES = [
  { label: "標準", text: "平素より大変お世話になっております。\n下記の書類をお送りいたしますので、ご査収のほどよろしくお願いいたします。\n\nご不明な点がございましたら、お気軽にご連絡ください。" },
  { label: "請求書", text: "平素より大変お世話になっております。\n請求書をお送りいたします。ご確認の上、お手続きいただけますと幸いです。\n\nご不明な点がございましたら、ご連絡ください。" },
  { label: "見積書", text: "平素より大変お世話になっております。\nご依頼いただきました見積書をお送りいたします。\nご検討のほどよろしくお願いいたします。" },
  { label: "契約書", text: "平素より大変お世話になっております。\n契約書をお送りいたします。内容をご確認いただき、ご署名・押印のうえ、ご返送いただけますと幸いです。" },
];

const DOC_TEMPLATES = [
  "請求書",
  "見積書",
  "契約書",
  "確認書",
  "報告書",
  "企画書",
  "領収書",
  "その他",
];

type DocEntry = { name: string; count: string };

export function FaxCover() {
  const [form, setForm] = useState({
    toCompany: "",
    toDept: "",
    toName: "",
    fromCompany: "",
    fromDept: "",
    fromName: "",
    fromTel: "",
    fromFax: "",
    subject: "",
    date: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }),
    body: BODY_TEMPLATES[0].text,
    totalPages: "",
  });
  const [docs, setDocs] = useState<DocEntry[]>([{ name: "", count: "1" }]);
  const [copied, setCopied] = useState(false);

  const set = useCallback(<K extends keyof typeof form>(key: K, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  }, []);

  const addDoc = () => setDocs((p) => [...p, { name: "", count: "1" }]);
  const removeDoc = (i: number) => setDocs((p) => p.filter((_, idx) => idx !== i));
  const updateDoc = (i: number, key: keyof DocEntry, val: string) => {
    setDocs((p) => p.map((d, idx) => idx === i ? { ...d, [key]: val } : d));
  };

  const handlePrint = () => window.print();

  const previewText = `${form.date}\n\n宛先：${form.toCompany} ${form.toDept} ${form.toName}様\n差出人：${form.fromCompany} ${form.fromDept} ${form.fromName}\n\n件名：${form.subject}\n\n${form.body}\n\n送付書類：\n${docs.filter(d=>d.name).map(d=>`　・${d.name} ${d.count}部`).join("\n")}\n${form.totalPages ? `\n送付枚数：${form.totalPages}枚（本状含む）` : ""}`;

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#fax-print) { display: none !important; }
          #fax-print { display: block !important; }
          @page { size: A4; margin: 20mm 15mm; }
        }
        @media screen { #fax-print { display: none; } }
      `}</style>

      {/* Print area */}
      <div id="fax-print" className="hidden">
        <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "10pt", lineHeight: "1.8", color: "#1e293b" }}>
          <p style={{ textAlign: "right", marginBottom: "10mm", fontSize: "10pt" }}>{form.date}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8mm", fontSize: "10pt" }}>
            <tbody>
              <tr>
                <td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8", width: "20%", background: "#f8fafc", fontWeight: "bold" }}>宛先</td>
                <td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8" }}>{[form.toCompany, form.toDept, form.toName ? form.toName + " 様" : ""].filter(Boolean).join("　")}</td>
              </tr>
              <tr>
                <td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8", background: "#f8fafc", fontWeight: "bold" }}>差出人</td>
                <td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8" }}>{[form.fromCompany, form.fromDept, form.fromName].filter(Boolean).join("　")}</td>
              </tr>
              {form.fromTel && <tr><td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8", background: "#f8fafc" }}>TEL</td><td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8" }}>{form.fromTel}</td></tr>}
              {form.fromFax && <tr><td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8", background: "#f8fafc" }}>FAX</td><td style={{ padding: "2mm 3mm", border: "1px solid #94a3b8" }}>{form.fromFax}</td></tr>}
            </tbody>
          </table>
          <h1 style={{ textAlign: "center", fontSize: "16pt", fontWeight: "bold", letterSpacing: "0.2em", marginBottom: "8mm", borderBottom: "2px solid #1e293b", paddingBottom: "3mm" }}>送付状</h1>
          <p style={{ marginBottom: "6mm" }}><strong>件名：</strong>{form.subject}</p>
          <p style={{ whiteSpace: "pre-line", marginBottom: "8mm", lineHeight: "2" }}>{form.body}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6mm" }}>
            <thead><tr><th style={{ padding: "2mm 4mm", border: "1px solid #94a3b8", background: "#f1f5f9", textAlign: "left" }}>書類名</th><th style={{ padding: "2mm 4mm", border: "1px solid #94a3b8", background: "#f1f5f9", width: "20%", textAlign: "center" }}>部数</th></tr></thead>
            <tbody>{docs.filter(d=>d.name).map((d, i) => <tr key={i}><td style={{ padding: "2mm 4mm", border: "1px solid #94a3b8" }}>{d.name}</td><td style={{ padding: "2mm 4mm", border: "1px solid #94a3b8", textAlign: "center" }}>{d.count}部</td></tr>)}</tbody>
          </table>
          {form.totalPages && <p style={{ textAlign: "right", fontSize: "9pt", color: "#64748b" }}>送付総枚数：{form.totalPages}枚（本状含む）</p>}
          <p style={{ textAlign: "center", marginTop: "15mm", fontSize: "9pt", color: "#94a3b8" }}>以上</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* To */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">宛先</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "toCompany", label: "会社名", placeholder: "〇〇株式会社" },
              { key: "toDept", label: "部署名（任意）", placeholder: "営業部" },
              { key: "toName", label: "担当者名（任意）", placeholder: "田中太郎" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">{label}</label>
                <input value={form[key as keyof typeof form]} onChange={(e) => set(key as keyof typeof form, e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* From */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">差出人</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "fromCompany", label: "会社名", placeholder: "自社名" },
              { key: "fromDept", label: "部署名（任意）", placeholder: "部署名" },
              { key: "fromName", label: "氏名", placeholder: "山田花子" },
              { key: "fromTel", label: "TEL（任意）", placeholder: "03-0000-0000" },
              { key: "fromFax", label: "FAX番号（任意）", placeholder: "03-0000-0001" },
              { key: "date", label: "日付", placeholder: "" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">{label}</label>
                <input value={form[key as keyof typeof form]} onChange={(e) => set(key as keyof typeof form, e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">件名</p>
          <input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="例：請求書送付の件" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-400" />
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">本文</p>
            <div className="flex gap-1.5 flex-wrap">
              {BODY_TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => set("body", t.text)} className="text-[11px] px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-blue-950/40 hover:text-blue-700 transition-colors">{t.label}</button>
              ))}
            </div>
          </div>
          <textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none resize-none leading-relaxed" />
        </div>

        {/* Docs list */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">送付書類</p>
            <button onClick={addDoc} className="text-[12px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 transition-colors">+ 追加</button>
          </div>
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select value={doc.name} onChange={(e) => updateDoc(i, "name", e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none">
                  <option value="">書類を選択...</option>
                  {DOC_TEMPLATES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="text" value={doc.count} onChange={(e) => updateDoc(i, "count", e.target.value)} className="w-16 px-2 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none text-center" placeholder="部数" />
                <span className="text-[13px] text-slate-400">部</span>
                {docs.length > 1 && <button onClick={() => removeDoc(i)} className="text-slate-400 hover:text-red-500 px-2 text-lg">×</button>}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">送付総枚数（FAXの場合・任意）</label>
            <input value={form.totalPages} onChange={(e) => set("totalPages", e.target.value)} placeholder="例：3（本状含む）" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none" />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">プレビュー</span>
            <button onClick={async () => { await navigator.clipboard.writeText(previewText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${copied ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200"}`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "コピー済み" : "テキストコピー"}
            </button>
          </div>
          <pre className="p-5 text-[13px] text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans overflow-x-auto">{previewText}</pre>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-lg">
            <Printer className="w-5 h-5" />印刷・PDF保存
          </button>
          <button onClick={() => setDocs([{ name: "", count: "1" }])} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">関連ツール</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { href: "/tools/invoice-generator", emoji: "🧾", label: "請求書作成", desc: "インボイス対応" },
              { href: "/tools/resignation-letter", emoji: "📄", label: "退職届作成", desc: "理由別テンプレ" },
              { href: "/tools/estimate-generator", emoji: "📊", label: "見積書作成", desc: "PDF保存対応" },
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
