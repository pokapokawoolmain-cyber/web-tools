"use client";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

type WorkType =
  | "新築工事"
  | "リフォーム工事"
  | "外壁塗装工事"
  | "解体工事"
  | "増築工事"
  | "屋根工事"
  | "外構工事"
  | "設備工事";

type NoiseLevel = "高い（解体・基礎・鉄骨等）" | "中程度（一般的な工事）" | "低め（内装・設備等）";

const WORK_TYPES: WorkType[] = [
  "新築工事", "リフォーム工事", "外壁塗装工事", "解体工事",
  "増築工事", "屋根工事", "外構工事", "設備工事",
];

const NOISE_DESCS: Record<NoiseLevel, string> = {
  "高い（解体・基礎・鉄骨等）": "解体・基礎工事・鉄骨建方など、特に騒音・振動が大きい工程があります。",
  "中程度（一般的な工事）": "工事機械や作業音が発生しますが、一般的な建設工事の範囲内です。",
  "低め（内装・設備等）": "室内作業が中心で、外部への騒音・振動は比較的少ない工事です。",
};

function buildGreeting(params: {
  companyName: string;
  contactName: string;
  contactPhone: string;
  workType: WorkType;
  address: string;
  startDate: string;
  endDate: string;
  workHoursStart: string;
  workHoursEnd: string;
  noiseLevel: NoiseLevel;
  hasCrane: boolean;
  hasParking: boolean;
  hasDust: boolean;
  customNote: string;
  ownerName: string;
}): string {
  const {
    companyName, contactName, contactPhone, workType,
    address, startDate, endDate, workHoursStart, workHoursEnd,
    noiseLevel, hasCrane, hasParking, hasDust, customNote, ownerName,
  } = params;

  const noiseDesc = NOISE_DESCS[noiseLevel];

  const concerns: string[] = [];
  if (noiseLevel !== "低め（内装・設備等）") concerns.push("騒音・振動");
  if (hasDust) concerns.push("粉塵・ほこり");
  if (hasCrane) concerns.push("クレーン・重機の作業");
  if (hasParking) concerns.push("工事車両の駐停車");

  const concernText = concerns.length > 0
    ? `工事期間中は、${concerns.join("・")}等でご不便をおかけする場合がございます。`
    : "工事期間中はご不便をおかけする場合がございます。";

  const dateText = startDate && endDate
    ? `${startDate}（開始）〜${endDate}（完了予定）`
    : startDate
    ? `${startDate}（開始予定）〜工期については別途ご案内します`
    : "工事日程については別途ご案内いたします";

  const hoursText = workHoursStart && workHoursEnd
    ? `${workHoursStart}〜${workHoursEnd}`
    : "8:00〜18:00（予定）";

  return `拝啓

　時下ますますご清栄のこととお慶び申し上げます。

　このたび、下記のとおり工事を施工させていただく運びとなりました。ご近隣の皆様には、工事期間中にご迷惑をおかけすることを深くお詫び申し上げますとともに、ご理解とご協力を賜りますようお願い申し上げます。

敬具

━━━━━━━━━━━━━━━━━━━━━━
工 事 概 要
━━━━━━━━━━━━━━━━━━━━━━

【工 事 名】　${workType}
【工事場所】　${address || "○○市○○町○丁目○番地"}
【施 主 名】　${ownerName || "○○　様"}
【工事期間】　${dateText}
【作業時間】　${hoursText}（土日祝は作業を行わない場合があります）

━━━━━━━━━━━━━━━━━━━━━━
ご案内・お願い
━━━━━━━━━━━━━━━━━━━━━━

${noiseDesc}

${concernText}

作業にあたっては安全・防音・防塵に最大限配慮し、近隣の皆様へのご迷惑を最小限に抑えるよう努めてまいります。${hasCrane ? "\nクレーン・重機を使用する際は、事前に作業時間のご案内をするよう努めます。" : ""}${hasParking ? "\n工事車両はなるべく工事敷地内に駐車しますが、やむを得ず路上に停車する場合は、通行の妨げにならないよう努めます。" : ""}

何かお気づきの点やご不明な点がございましたら、お気軽に担当者までご連絡ください。${customNote ? "\n\n" + customNote : ""}

━━━━━━━━━━━━━━━━━━━━━━
施 工 会 社
━━━━━━━━━━━━━━━━━━━━━━

社　名：${companyName || "○○建設株式会社"}
担当者：${contactName || "担当　○○"}
電　話：${contactPhone || "000-0000-0000"}
（受付時間：平日 8:00〜18:00）`;
}

export function NeighborGreeting() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [workType, setWorkType] = useState<WorkType>("リフォーム工事");
  const [address, setAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workHoursStart, setWorkHoursStart] = useState("8:00");
  const [workHoursEnd, setWorkHoursEnd] = useState("18:00");
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel>("中程度（一般的な工事）");
  const [hasCrane, setHasCrane] = useState(false);
  const [hasParking, setHasParking] = useState(true);
  const [hasDust, setHasDust] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);

  const greeting = useMemo(() => buildGreeting({
    companyName, contactName, contactPhone, workType,
    address, startDate, endDate, workHoursStart, workHoursEnd,
    noiseLevel, hasCrane, hasParking, hasDust, customNote, ownerName,
  }), [companyName, contactName, contactPhone, workType, address, startDate,
       endDate, workHoursStart, workHoursEnd, noiseLevel, hasCrane, hasParking,
       hasDust, customNote, ownerName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(greeting).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handlePrint = () => window.print();

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-[14px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 入力フォーム */}
        <div className="space-y-4">
          {/* 工事情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">工事の種類</label>
              <div className="grid grid-cols-2 gap-2">
                {WORK_TYPES.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorkType(w)}
                    className={`py-2 px-3 rounded-xl text-[12px] font-medium border transition-all text-left ${
                      workType === w
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">工事場所（住所）</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="東京都○○区○○町1-2-3" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">施主名（様）</label>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="山田太郎　様" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">工事開始日</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">完了予定日</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">作業開始時刻</label>
                <input type="time" value={workHoursStart} onChange={(e) => setWorkHoursStart(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">作業終了時刻</label>
                <input type="time" value={workHoursEnd} onChange={(e) => setWorkHoursEnd(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 騒音・影響 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">工事の影響・配慮事項</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">騒音・振動レベル</label>
              <div className="space-y-2">
                {(Object.keys(NOISE_DESCS) as NoiseLevel[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNoiseLevel(n)}
                    className={`w-full py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all text-left ${
                      noiseLevel === n
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: "hasCrane", label: "クレーン・重機を使用する", value: hasCrane, set: setHasCrane },
                { key: "hasParking", label: "工事車両が路上に停車する場合がある", value: hasParking, set: setHasParking },
                { key: "hasDust", label: "粉塵・ほこりが発生する（解体・塗装等）", value: hasDust, set: setHasDust },
              ].map(({ key, label, value, set }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => set(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <span className="text-[13px] text-slate-700 dark:text-zinc-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 会社情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">施工会社情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">会社名</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="○○建設株式会社" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">担当者名</label>
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="鈴木　一郎" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">連絡先電話番号</label>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="03-0000-0000" className={inputClass} />
            </div>
          </div>

          {/* 追加メモ */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">追加で伝えたいこと（任意）</label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="例：工事期間中は仮設トイレを設置します。臭気が発生した場合は即時対応いたします。"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* プレビュー */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">生成された挨拶文</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors"
              >
                {copied ? "✓ コピー済み" : "📋 コピー"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[13px] font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                🖨️ 印刷
              </button>
            </div>
          </div>
          <div
            id="greeting-preview"
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono min-h-[400px]"
          >
            {greeting}
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-600">
            ※挨拶文は工事前日までに、対象範囲（通常は工事現場から半径50m〜100m）の近隣へお届けください。
          </p>
        </div>
      </div>

      {/* 印刷CSS: portal経由でbody直下に配置するためセレクタが確実に機能する */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 20mm 18mm; }
          body > *:not(#greeting-print-root) { display: none !important; }
          #greeting-print-root {
            display: block !important;
            font-family: serif;
            font-size: 12pt;
            padding: 0;
            margin: 0;
            white-space: pre-wrap;
            line-height: 2;
            color: #000;
          }
        }
      `}</style>

      {/* 印刷専用DOM（portal経由でbody直下へ） */}
      {mounted && createPortal(
        <div id="greeting-print-root" style={{ display: "none" }}>
          {greeting}
        </div>,
        document.body
      )}
    </div>
  );
}
