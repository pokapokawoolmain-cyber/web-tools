"use client";
import { useState, useRef } from "react";
import { Printer, Copy, CheckCircle2 } from "lucide-react";

type ReportData = {
  constructionName: string;
  clientName: string;
  clientAddress: string;
  siteAddress: string;
  startDate: string;
  endDate: string;
  constructionDetails: string;
  materials: string;
  warranty: string;
  notes: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  licenseNo: string;
  managerName: string;
  issueDate: string;
};

const CONSTRUCTION_TYPES = [
  "外壁塗装工事", "屋根塗装工事", "外壁・屋根塗装工事", "内装リフォーム工事",
  "キッチンリフォーム工事", "浴室リフォーム工事", "洗面所リフォーム工事",
  "トイレリフォーム工事", "耐震補強工事", "断熱改修工事", "バリアフリー改修工事",
  "外構工事", "屋根葺き替え工事", "防水工事", "その他",
];

const WARRANTY_TEMPLATES = [
  "外壁塗装：塗膜保証 5年 / 施工保証 2年",
  "屋根塗装：塗膜保証 5年 / 施工保証 2年",
  "防水工事：防水保証 10年 / 施工保証 5年",
  "内装工事：施工保証 1年",
];

export function ConstructionReport() {
  const [data, setData] = useState<ReportData>({
    constructionName: "",
    clientName: "",
    clientAddress: "",
    siteAddress: "",
    startDate: "",
    endDate: "",
    constructionDetails: "",
    materials: "",
    warranty: "",
    notes: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    licenseNo: "",
    managerName: "",
    issueDate: new Date().toISOString().slice(0, 10),
  });
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof ReportData, val: string) => setData((prev) => ({ ...prev, [key]: val }));

  const handlePrint = () => window.print();

  const handleCopyText = async () => {
    const lines = [
      "工事完了報告書",
      "",
      `発行日：${data.issueDate}`,
      `工事名：${data.constructionName}`,
      `施主名：${data.clientName} 様`,
      `施主住所：${data.clientAddress}`,
      `工事場所：${data.siteAddress || data.clientAddress}`,
      `工期：${data.startDate} 〜 ${data.endDate}`,
      "",
      "【施工内容】",
      data.constructionDetails,
      "",
      "【使用材料・仕様】",
      data.materials,
      "",
      "【工事保証】",
      data.warranty,
      "",
      data.notes ? `【特記事項】\n${data.notes}\n` : "",
      "───────────────────",
      `施工会社：${data.companyName}`,
      `住所：${data.companyAddress}`,
      `電話：${data.companyPhone}`,
      data.licenseNo ? `建設業許可番号：${data.licenseNo}` : "",
      `担当者：${data.managerName}`,
    ].filter(Boolean).join("\n");
    await navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputSm = "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-[13px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* 印刷専用 */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 20mm 15mm; }
          body > *:not(#construction-report-print) { display: none !important; }
          #construction-report-print { display: block !important; font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif; }
        }
      `}</style>

      <div id="construction-report-print" className="hidden print:block">
        <div style={{ border: "2px solid #1e293b", padding: "24px 28px", fontFamily: "'Hiragino Kaku Gothic ProN', sans-serif" }}>
          <h1 style={{ textAlign: "center", fontSize: "22px", fontWeight: "bold", borderBottom: "2px solid #1e293b", paddingBottom: "12px", marginBottom: "16px" }}>工事完了報告書</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: "16px", fontSize: "13px" }}>
            <div><span style={{ color: "#64748b" }}>発行日：</span>{data.issueDate}</div>
            <div><span style={{ color: "#64748b" }}>施工会社：</span>{data.companyName}</div>
            <div><span style={{ color: "#64748b" }}>工事名：</span><strong>{data.constructionName}</strong></div>
            <div><span style={{ color: "#64748b" }}>建設業許可：</span>{data.licenseNo}</div>
            <div><span style={{ color: "#64748b" }}>施主名：</span>{data.clientName} 様</div>
            <div><span style={{ color: "#64748b" }}>住所：</span>{data.companyAddress}</div>
            <div><span style={{ color: "#64748b" }}>施主住所：</span>{data.clientAddress}</div>
            <div><span style={{ color: "#64748b" }}>電話：</span>{data.companyPhone}</div>
            <div><span style={{ color: "#64748b" }}>工事場所：</span>{data.siteAddress || data.clientAddress}</div>
            <div><span style={{ color: "#64748b" }}>担当者：</span>{data.managerName}</div>
            <div><span style={{ color: "#64748b" }}>工期：</span>{data.startDate} 〜 {data.endDate}</div>
          </div>
          {[
            { label: "施工内容", value: data.constructionDetails },
            { label: "使用材料・仕様", value: data.materials },
            { label: "工事保証", value: data.warranty },
            ...(data.notes ? [{ label: "特記事項", value: data.notes }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ background: "#f1f5f9", padding: "4px 12px", fontWeight: "bold", fontSize: "12px", color: "#475569" }}>{label}</div>
              <div style={{ padding: "8px 12px", fontSize: "13px", lineHeight: "1.8", whiteSpace: "pre-wrap", color: "#1e293b" }}>{value}</div>
            </div>
          ))}
          <div style={{ marginTop: "24px", textAlign: "right", fontSize: "13px", color: "#64748b" }}>
            <div>上記のとおり工事が完了したことをご報告申し上げます。</div>
            <div style={{ marginTop: "8px" }}>以上</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左：施工・施主情報 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事名</label>
              <div className="flex gap-2">
                <input type="text" value={data.constructionName} onChange={(e) => set("constructionName", e.target.value)} placeholder="○○邸 外壁塗装工事" className={`${inputSm} flex-1`} />
                <select className={`${inputSm} w-28 flex-shrink-0`} onChange={(e) => { if (e.target.value) set("constructionName", e.target.value); }}>
                  <option value="">工事種別</option>
                  {CONSTRUCTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">着工日</label>
                <input type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputSm} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">完工日</label>
                <input type="date" value={data.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputSm} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施主情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施主名</label>
              <input type="text" value={data.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="山田 太郎" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施主住所</label>
              <input type="text" value={data.clientAddress} onChange={(e) => set("clientAddress", e.target.value)} placeholder="東京都○○区○○町1-2-3" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事場所（異なる場合）</label>
              <input type="text" value={data.siteAddress} onChange={(e) => set("siteAddress", e.target.value)} placeholder="未入力の場合は施主住所を使用" className={inputSm} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施工会社情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施工会社名</label>
              <input type="text" value={data.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="○○建設株式会社" className={inputSm} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">住所</label>
              <input type="text" value={data.companyAddress} onChange={(e) => set("companyAddress", e.target.value)} placeholder="東京都○○区○○町" className={inputSm} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">電話番号</label>
                <input type="tel" value={data.companyPhone} onChange={(e) => set("companyPhone", e.target.value)} placeholder="03-0000-0000" className={inputSm} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">担当者名</label>
                <input type="text" value={data.managerName} onChange={(e) => set("managerName", e.target.value)} placeholder="田中 一郎" className={inputSm} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">建設業許可番号（任意）</label>
              <input type="text" value={data.licenseNo} onChange={(e) => set("licenseNo", e.target.value)} placeholder="国土交通大臣許可（般-00）第○○○○○号" className={inputSm} />
            </div>
          </div>
        </div>

        {/* 右：施工内容・保証 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施工内容・材料・保証</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">施工内容</label>
              <textarea rows={5} value={data.constructionDetails} onChange={(e) => set("constructionDetails", e.target.value)}
                placeholder={"例：\n・高圧洗浄（全外壁・屋根）\n・シーリング打ち替え（窓周り・サッシ周り）\n・下塗り（浸透型シーラー）\n・中塗り（シリコン系塗料）\n・上塗り（シリコン系塗料）"}
                className={`${inputSm} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">使用材料・仕様</label>
              <textarea rows={4} value={data.materials} onChange={(e) => set("materials", e.target.value)}
                placeholder={"例：\n・外壁塗料：○○シリコン（色：ND-110）\n・下塗り材：○○シーラー\n・シーリング材：変成シリコン系 20年保証品"}
                className={`${inputSm} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">工事保証</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {WARRANTY_TEMPLATES.map((t) => (
                  <button key={t} onClick={() => set("warranty", t)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    {t.split("：")[0]}
                  </button>
                ))}
              </div>
              <textarea rows={3} value={data.warranty} onChange={(e) => set("warranty", e.target.value)}
                placeholder="例：塗膜保証5年 / 施工保証2年"
                className={`${inputSm} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">特記事項（任意）</label>
              <textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)}
                placeholder="アフターメンテナンスの案内、次回点検時期など"
                className={`${inputSm} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">報告書発行日</label>
              <input type="date" value={data.issueDate} onChange={(e) => set("issueDate", e.target.value)} className={inputSm} />
            </div>
          </div>

          {/* プレビュー */}
          <div ref={reportRef} className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-slate-200 dark:border-zinc-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">プレビュー</h3>
              <div className="flex gap-2">
                <button onClick={handleCopyText} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[12px] font-semibold hover:bg-slate-200 transition-colors">
                  {copied ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />コピー済み</> : <><Copy className="w-3.5 h-3.5" />テキストコピー</>}
                </button>
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[12px] font-semibold hover:bg-blue-700 transition-colors">
                  <Printer className="w-3.5 h-3.5" />PDF保存・印刷
                </button>
              </div>
            </div>
            <div className="text-[12px] text-slate-500 dark:text-zinc-400 space-y-2 border border-slate-100 dark:border-zinc-800 rounded-xl p-4">
              <div className="text-center font-bold text-[16px] text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-700 pb-2 mb-3">工事完了報告書</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>工事名：<span className="text-slate-700 dark:text-zinc-300">{data.constructionName || "—"}</span></div>
                <div>施主名：<span className="text-slate-700 dark:text-zinc-300">{data.clientName ? `${data.clientName} 様` : "—"}</span></div>
                <div>工期：<span className="text-slate-700 dark:text-zinc-300">{data.startDate && data.endDate ? `${data.startDate} 〜 ${data.endDate}` : "—"}</span></div>
                <div>施工会社：<span className="text-slate-700 dark:text-zinc-300">{data.companyName || "—"}</span></div>
              </div>
              {data.constructionDetails && (
                <div className="mt-2 border border-slate-100 dark:border-zinc-800 rounded-lg p-2">
                  <div className="font-semibold text-slate-600 dark:text-zinc-400 mb-1">施工内容</div>
                  <div className="whitespace-pre-wrap text-slate-500 dark:text-zinc-500 text-[11px]">{data.constructionDetails}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
