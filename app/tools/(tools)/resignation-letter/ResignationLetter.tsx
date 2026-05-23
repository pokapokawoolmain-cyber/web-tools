"use client";
import { useState, useCallback } from "react";
import { Printer, RefreshCw, Copy, Check } from "lucide-react";

type DocType = "退職届" | "退職願";
type ReasonKey = "personal" | "health" | "career" | "harassment" | "contract" | "custom";

const REASONS: Record<ReasonKey, { label: string; text: string; tag?: string }> = {
  personal: { label: "一身上の都合", text: "一身上の都合により" },
  health: { label: "体調不良", text: "健康上の理由により療養に専念するため" },
  career: { label: "キャリアチェンジ", text: "自己のキャリアアップを目指すため" },
  harassment: { label: "ハラスメント", text: "一身上の都合により", tag: "パワハラ向け" },
  contract: { label: "契約満了", text: "契約期間満了のため" },
  custom: { label: "自由入力", text: "" },
};

export function ResignationLetter() {
  const [docType, setDocType] = useState<DocType>("退職届");
  const [reasonKey, setReasonKey] = useState<ReasonKey>("personal");
  const [customReason, setCustomReason] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    ceoName: "",
    department: "",
    resignDate: "",
    submitDate: new Date().toISOString().split("T")[0],
  });
  const [copied, setCopied] = useState(false);

  const set = useCallback(<K extends keyof typeof form>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reasonText = reasonKey === "custom" ? customReason : REASONS[reasonKey].text;

  const bodyText = `私儀
${reasonText}、誠に勝手ながら来たる${form.resignDate || "　　年　　月　　日"}をもって退職いたしたくご${docType === "退職届" ? "通知" : "願い"}申し上げます。

　${form.submitDate || "　　年　　月　　日"}

${form.department ? form.department + "\n" : ""}${form.name || "氏名"}　印`;

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#resignation-print) { display: none !important; }
          #resignation-print { display: block !important; }
          @page { size: A4 portrait; margin: 25mm 20mm; }
        }
        @media screen { #resignation-print { display: none; } }
      `}</style>

      {/* Print area */}
      <div id="resignation-print" className="hidden">
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "11pt", lineHeight: "2.2", color: "#1e293b" }}>
          <p style={{ textAlign: "right", marginBottom: "20mm", fontSize: "10pt", color: "#64748b" }}>{form.submitDate}</p>
          <p style={{ marginBottom: "4mm" }}>{form.companyName || "　　　　　株式会社"}</p>
          <p style={{ marginBottom: "20mm" }}>{form.ceoName ? `${form.ceoName}様` : "代表取締役社長　殿"}</p>
          <p style={{ textAlign: "right", marginBottom: "2mm" }}>{form.department}</p>
          <p style={{ textAlign: "right", marginBottom: "20mm" }}>{form.name}　印</p>
          <h1 style={{ textAlign: "center", fontSize: "16pt", fontWeight: "bold", marginBottom: "12mm", letterSpacing: "0.3em" }}>{docType}</h1>
          <p style={{ whiteSpace: "pre-line" }}>{bodyText}</p>
          <p style={{ textAlign: "center", marginTop: "30mm", fontSize: "9pt", color: "#94a3b8" }}>以上</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Doc type */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">書類の種類</p>
          <div className="grid grid-cols-2 gap-3">
            {(["退職届", "退職願"] as DocType[]).map((t) => (
              <button key={t} onClick={() => setDocType(t)}
                className={`py-3 rounded-xl text-[15px] font-bold transition-all ${
                  docType === t
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"
                }`}
              >{t}</button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {docType === "退職届" ? "退職の意思を通知する書類（撤回原則不可）" : "退職をお願いする書類（承認前なら撤回可能）"}
          </p>
        </div>

        {/* Reason */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">退職理由</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {(Object.entries(REASONS) as [ReasonKey, typeof REASONS[ReasonKey]][]).map(([key, val]) => (
              <button key={key} onClick={() => setReasonKey(key)}
                className={`relative py-2.5 px-3 rounded-xl text-[13px] font-semibold text-left transition-all ${
                  reasonKey === key
                    ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700"
                }`}
              >
                {val.label}
                {val.tag && <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">{val.tag}</span>}
              </button>
            ))}
          </div>
          {reasonKey === "custom" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="例：一身上の都合により"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          )}
          {reasonKey === "harassment" && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
              <p className="text-[12px] text-amber-800 dark:text-amber-300">💡 退職届本文には「一身上の都合」と記載されます。パワハラの記録は別途証拠として保全してください。</p>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
          <p className="text-[12px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">入力情報</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "companyName", label: "会社名", placeholder: "例：株式会社〇〇" },
              { key: "ceoName", label: "代表者名（任意）", placeholder: "例：鈴木一郎" },
              { key: "department", label: "所属部署（任意）", placeholder: "例：営業部" },
              { key: "name", label: "氏名", placeholder: "例：山田太郎" },
              { key: "resignDate", label: "退職希望日", placeholder: "例：令和7年6月30日" },
              { key: "submitDate", label: "提出日", placeholder: "" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-1 block">{label}</label>
                <input
                  type="text"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key as keyof typeof form, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-[13px] font-semibold text-slate-600 dark:text-zinc-300">プレビュー</span>
            <button onClick={handleCopy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${copied ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-300"}`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "コピー済み" : "テキストコピー"}
            </button>
          </div>
          <div className="p-5">
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl p-6" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              <p className="text-right text-[12px] text-slate-400 mb-6">{form.submitDate}</p>
              <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-1">{form.companyName || "〇〇株式会社"}</p>
              <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-6">{form.ceoName ? `${form.ceoName}様` : "代表取締役社長　殿"}</p>
              <p className="text-right text-[13px] text-slate-600 dark:text-zinc-400">{form.department}</p>
              <p className="text-right text-[14px] font-semibold text-slate-800 dark:text-zinc-200 mb-6">{form.name || "氏名"}　印</p>
              <h2 className="text-center text-[18px] font-bold tracking-[0.3em] text-slate-900 dark:text-white mb-6">{docType}</h2>
              <pre className="text-[13px] text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-loose font-sans" style={{ fontFamily: "'Noto Serif JP', serif" }}>{bodyText}</pre>
              <p className="text-center text-[12px] text-slate-400 mt-8">以上</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-lg">
            <Printer className="w-5 h-5" />印刷・PDF保存
          </button>
          <button onClick={() => setForm({ name: "", companyName: "", ceoName: "", department: "", resignDate: "", submitDate: new Date().toISOString().split("T")[0] })} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 text-[12px] text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">⚠️ 提出前に確認してください</p>
          <ul className="space-y-1">
            <li>• 就業規則で書式・提出期限が指定されている場合があります</li>
            <li>• 退職届の提出前に上司への口頭での意思表示が推奨されます</li>
            <li>• 入力した内容はサーバーに送信されません</li>
          </ul>
        </div>
      </div>
    </>
  );
}
