"use client";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

type DocType = "nenga-jimai" | "mochu" | "kanchu";

type Audience = "personal" | "business";

/** 寒中見舞いの用途 */
type KanchuCase = "reply" | "late";

type NengaReason =
  | "高齢のため"
  | "身辺整理のため"
  | "今後はメール・SNS等でご挨拶させていただくため"
  | "その他（自由入力）";

type Relation =
  | "父" | "母" | "祖父" | "祖母" | "夫" | "妻" | "息子" | "娘" | "兄" | "姉" | "弟" | "妹" | "その他（自由入力）";

const NENGA_REASONS: NengaReason[] = [
  "高齢のため",
  "身辺整理のため",
  "今後はメール・SNS等でご挨拶させていただくため",
  "その他（自由入力）",
];

/** 取引先向け（法人・個人事業主）の年賀状じまいの理由 */
const BUSINESS_REASONS = [
  "環境保護と資源節約の観点から",
  "業務のデジタル化に伴い",
  "その他（自由入力）",
] as const;
type BusinessReason = (typeof BUSINESS_REASONS)[number];

const RELATIONS: Relation[] = ["父", "母", "祖父", "祖母", "夫", "妻", "息子", "娘", "兄", "姉", "弟", "妹", "その他（自由入力）"];

function reasonSentence(reason: NengaReason, custom: string): string {
  switch (reason) {
    case "高齢のため":
      return "高齢になりましたことに加え、体力的な衰えもございますため、";
    case "身辺整理のため":
      return "この度、身辺の整理を機に、";
    case "今後はメール・SNS等でご挨拶させていただくため":
      return "時代の変化に伴い、今後はメールやSNS等を通じて近況をお伝えしたいと考えており、";
    case "その他（自由入力）":
      return custom ? `${custom}、` : "";
  }
}

function buildNengaJimai(params: {
  year: string;
  reason: NengaReason;
  customReason: string;
  senderName: string;
  senderAddress: string;
  customNote: string;
}): string {
  const { year, reason, customReason, senderName, senderAddress, customNote } = params;
  const reasonText = reasonSentence(reason, customReason);

  return `謹んで新年のお慶びを申し上げます

　旧年中は大変お世話になり、誠にありがとうございました。

　さて、勝手ながら${reasonText}本年をもちまして年始のご挨拶状によるご挨拶を控えさせていただきたく存じます。

　これまで長年にわたり賀詞を交わしていただきましたこと、心より感謝申し上げます。今後はメールやお電話、直接お目にかかった際などに近況をお伝えできれば幸いです。

　勝手なお願いとは存じますが、何卒ご理解のほどお願い申し上げます。${customNote ? "\n\n" + customNote : ""}

　皆様のご健勝とご多幸を心よりお祈り申し上げます。

${year}年　元旦

${senderAddress ? senderAddress + "\n" : ""}${senderName || "○○　○○"}`;
}

function buildBusinessNengaJimai(params: {
  year: string;
  reason: BusinessReason;
  customReason: string;
  senderName: string;
  senderAddress: string;
  customNote: string;
}): string {
  const { year, reason, customReason, senderName, senderAddress, customNote } = params;
  const reasonText = reason === "その他（自由入力）" ? (customReason ? `${customReason}、` : "") : `${reason}、`;

  return `謹んで新春のお慶びを申し上げます

　旧年中は格別のお引き立てを賜り、厚く御礼申し上げます。

　さて、弊社では${reasonText}誠に勝手ながら本年をもちまして年賀状による新年のご挨拶を控えさせていただくことといたしました。

　今後はメール等にてご挨拶を申し上げたく存じます。何卒ご理解を賜りますようお願い申し上げます。${customNote ? "\n\n" + customNote : ""}

　本年も変わらぬご愛顧を賜りますよう、よろしくお願い申し上げます。

${year}年　元旦

${senderAddress ? senderAddress + "\n" : ""}${senderName || "株式会社○○　代表取締役　○○　○○"}`;
}

function buildKanchu(params: {
  kanchuCase: KanchuCase;
  relation: Relation;
  customRelation: string;
  deathMonth: string;
  senderName: string;
  senderAddress: string;
  customNote: string;
}): string {
  const { kanchuCase, relation, customRelation, deathMonth, senderName, senderAddress, customNote } = params;
  const relationText = relation === "その他（自由入力）" ? (customRelation || "近親者") : relation;
  const monthText = deathMonth ? `昨年${deathMonth}に` : "昨年";
  const body =
    kanchuCase === "reply"
      ? `　ご丁寧な年始のご挨拶をいただき　ありがとうございました
　${monthText}${relationText}が永眠いたしましたため　年頭のご挨拶を控えさせていただきました
　旧年中にお知らせすべきところ　ご通知が行き届かず失礼いたしました`
      : `　${monthText}${relationText}が永眠いたしましたため　年頭のご挨拶を控えさせていただきました
　暮れも押し詰まってからのことで　ご通知が遅れましたことをお詫び申し上げます
　生前に賜りましたご厚情に　心より御礼申し上げます`;

  return `寒中お見舞い申し上げます

${body}${customNote ? "\n\n" + customNote : ""}

　寒さ厳しき折　皆様のご健康をお祈り申し上げます

令和　　年　　月

${senderAddress ? senderAddress + "\n" : ""}${senderName || "○○　○○"}`;
}

function buildMochu(params: {
  relation: Relation;
  customRelation: string;
  deceasedName: string;
  deceasedAge: string;
  deathMonth: string;
  senderName: string;
  senderAddress: string;
  customNote: string;
}): string {
  const { relation, customRelation, deceasedName, deceasedAge, deathMonth, senderName, senderAddress, customNote } = params;
  const relationText = relation === "その他（自由入力）" ? (customRelation || "近親者") : relation;
  const nameLine = deceasedName ? `${relationText}　${deceasedName}${deceasedAge ? "（享年" + deceasedAge + "）" : ""}` : "";
  const monthText = deathMonth ? `本年${deathMonth}に` : "本年";

  return `喪中につき年頭のご挨拶をご遠慮申し上げます

　${monthText}${relationText}が永眠いたしました
　ここに本年お世話になりました皆様に生前のご厚誼を深く感謝申し上げますとともに
　明年も変わらぬご交誼を賜りますようお願い申し上げます${nameLine ? "\n\n" + nameLine : ""}

　寒さ厳しき折 皆様にはくれぐれもご自愛くださいませ${customNote ? "\n\n" + customNote : ""}

令和　　年　　月

${senderAddress ? senderAddress + "\n" : ""}${senderName || "○○　○○"}`;
}

export function NengaJimaiMaker() {
  const [docType, setDocType] = useState<DocType>("nenga-jimai");
  const [audience, setAudience] = useState<Audience>("personal");
  const [businessReason, setBusinessReason] = useState<BusinessReason>("環境保護と資源節約の観点から");
  const [kanchuCase, setKanchuCase] = useState<KanchuCase>("reply");

  // 年賀状じまい
  const [year, setYear] = useState("2027");
  const [reason, setReason] = useState<NengaReason>("高齢のため");
  const [customReason, setCustomReason] = useState("");

  // 喪中はがき
  const [relation, setRelation] = useState<Relation>("父");
  const [customRelation, setCustomRelation] = useState("");
  const [deceasedName, setDeceasedName] = useState("");
  const [deceasedAge, setDeceasedAge] = useState("");
  const [deathMonth, setDeathMonth] = useState("");

  // 共通
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    if (docType === "nenga-jimai") {
      return audience === "business"
        ? buildBusinessNengaJimai({ year, reason: businessReason, customReason, senderName, senderAddress, customNote })
        : buildNengaJimai({ year, reason, customReason, senderName, senderAddress, customNote });
    }
    if (docType === "kanchu") {
      return buildKanchu({ kanchuCase, relation, customRelation, deathMonth, senderName, senderAddress, customNote });
    }
    return buildMochu({ relation, customRelation, deceasedName, deceasedAge, deathMonth, senderName, senderAddress, customNote });
  }, [docType, audience, businessReason, kanchuCase, year, reason, customReason, relation, customRelation, deceasedName, deceasedAge, deathMonth, senderName, senderAddress, customNote]);

  const docTitle = docType === "nenga-jimai" ? "年賀状じまい" : docType === "kanchu" ? "寒中見舞い" : "喪中はがき";

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handlePrint = () => window.print();

  const handleWordDownload = () => {
    const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const bodyHtml = text
      .split("\n")
      .map((line) => `<p style="margin:0;text-align:center">${line ? escapeHtml(line) : "&nbsp;"}</p>`)
      .join("");
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${docTitle}</title></head><body style="font-family:'MS Mincho',serif;font-size:13pt;line-height:2">${bodyHtml}</body></html>`;
    const blob = new Blob(["﻿", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-[14px] text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500";

  return (
    <div className="space-y-6">
      {/* 文書タイプ切替 */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-zinc-800 rounded-2xl p-1.5">
        {(
          [
            { key: "nenga-jimai", label: "年賀状じまい", hint: "年賀状の卒業" },
            { key: "mochu", label: "喪中はがき", hint: "年始挨拶の欠礼" },
            { key: "kanchu", label: "寒中見舞い", hint: "喪中の年明けに" },
          ] as { key: DocType; label: string; hint: string }[]
        ).map(({ key, label, hint }) => (
          <button
            key={key}
            onClick={() => setDocType(key)}
            className={`py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all ${
              docType === key
                ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                : "bg-transparent text-slate-500 dark:text-zinc-400"
            }`}
          >
            <span className="block">{label}</span>
            <span className={`block text-[11px] font-normal mt-0.5 ${docType === key ? "opacity-80" : "opacity-70"}`}>{hint}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 入力フォーム */}
        <div className="space-y-4">
          {docType === "nenga-jimai" ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
              <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">年賀状じまいの内容</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">送る相手</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { key: "personal", label: "友人・知人・親戚" },
                      { key: "business", label: "取引先（会社・お店）" },
                    ] as { key: Audience; label: string }[]
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setAudience(key)}
                      className={`py-2.5 px-3 rounded-xl text-[13px] font-medium border transition-all ${
                        audience === key
                          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-700 dark:text-rose-400"
                          : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">お届けする年（元旦）</label>
                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2027" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">やめる理由</label>
                <div className="grid grid-cols-1 gap-2">
                  {(audience === "business" ? BUSINESS_REASONS : NENGA_REASONS).map((r) => {
                    const selected = audience === "business" ? businessReason === r : reason === r;
                    return (
                      <button
                        key={r}
                        onClick={() => (audience === "business" ? setBusinessReason(r as BusinessReason) : setReason(r as NengaReason))}
                        className={`py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all text-left ${
                          selected
                            ? "bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-700 dark:text-rose-400"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
              {(audience === "business" ? businessReason : reason) === "その他（自由入力）" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">理由（自由入力・「〜のため」に続く形で）</label>
                  <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="家族と相談した結果" className={inputClass} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
              <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">{docType === "kanchu" ? "寒中見舞いの内容" : "喪中はがきの内容"}</h3>
              {docType === "kanchu" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">送る場面</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(
                      [
                        { key: "reply", label: "喪中と知らずに年賀状をくれた方へのお返事" },
                        { key: "late", label: "12月に不幸があり、喪中はがきが間に合わなかった" },
                      ] as { key: KanchuCase; label: string }[]
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setKanchuCase(key)}
                        className={`py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all text-left ${
                          kanchuCase === key
                            ? "bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-700 dark:text-rose-400"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">故人との続柄</label>
                <div className="grid grid-cols-3 gap-2">
                  {RELATIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRelation(r)}
                      className={`py-2 px-2 rounded-xl text-[12px] font-medium border transition-all ${
                        relation === r
                          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-700 dark:text-rose-400"
                          : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {relation === "その他（自由入力）" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">続柄（自由入力）</label>
                  <input type="text" value={customRelation} onChange={(e) => setCustomRelation(e.target.value)} placeholder="義父" className={inputClass} />
                </div>
              )}
              {docType === "mochu" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">故人の名前（任意）</label>
                  <input type="text" value={deceasedName} onChange={(e) => setDeceasedName(e.target.value)} placeholder="山田太郎" className={inputClass} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {docType === "mochu" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">享年（任意）</label>
                    <input type="text" value={deceasedAge} onChange={(e) => setDeceasedAge(e.target.value)} placeholder="82" className={inputClass} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">お亡くなりになった月（任意）</label>
                  <input type="text" value={deathMonth} onChange={(e) => setDeathMonth(e.target.value)} placeholder="8月" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* 差出人情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">差出人情報</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">差出人名</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="山田　太郎" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">住所（任意）</label>
              <input type="text" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} placeholder="東京都○○区○○1-2-3" className={inputClass} />
            </div>
          </div>

          {/* 追加メモ */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">追加で伝えたいこと（任意）</label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="例：これまでいただいたご厚誼に、この場をお借りして御礼申し上げます。"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* プレビュー */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">生成された文例</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition-colors"
              >
                {copied ? "✓ コピー済み" : "📋 コピー"}
              </button>
              <button
                onClick={handleWordDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[13px] font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                📄 Wordでダウンロード
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
            id="nenga-preview"
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap min-h-[400px]"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {text}
          </div>
          <p className="text-[12px] text-slate-400 dark:text-zinc-600">
            {docType === "nenga-jimai"
              ? audience === "business"
                ? "※取引先への年賀状じまいは、最後の年賀状に添えて伝えるのが一般的です。社名・代表者名・所在地を差出人欄に入れてください。今後のご挨拶の手段（メールなど）を明記すると丁寧です。"
                : "※年賀状じまいは、これまで年賀状を送ってきた相手に「今年（または来年）を最後にする」ことを伝える文面です。届くのが遅くならないよう、通常の年賀状と同じく元旦にお手元に届くよう投函してください。"
              : docType === "kanchu"
                ? "※寒中見舞いは松の内（1月7日頃。地域によって15日）が明けてから、立春の前日（2月3日頃）までに届くよう送ります。年賀はがきではなく、通常のはがきや寒中見舞い用のはがきを使います。"
                : "※喪中はがきは相手が年賀状を準備し始める前、11月中旬〜12月上旬までに届くよう投函するのがマナーです。"}
          </p>
        </div>
      </div>

      {/* 印刷CSS: portal経由でbody直下に配置するためセレクタが確実に機能する */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 25mm 20mm; }
          body > *:not(#nenga-print-root) { display: none !important; }
          #nenga-print-root {
            display: flex !important;
            justify-content: center;
            font-family: 'Noto Serif JP', serif;
            font-size: 13pt;
            padding: 0;
            margin: 0;
            white-space: pre-wrap;
            line-height: 2.1;
            color: #000;
            text-align: center;
          }
        }
      `}</style>

      {/* 印刷専用DOM（portal経由でbody直下へ） */}
      {mounted && createPortal(
        <div id="nenga-print-root" style={{ display: "none" }}>
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}
