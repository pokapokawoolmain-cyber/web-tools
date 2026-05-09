"use client";
// ========================================
// 職務経歴書ビルダー
// 一般的な日本の職務経歴書フォーマット準拠
// 印刷時は入力フォームが非表示になりA4用紙に最適化
// ========================================
import { useState, useMemo } from "react";
import { Plus, Trash2, Printer, Copy, Check } from "lucide-react";

// ─── 型定義 ───────────────────────────────────
type Career = {
  id: number;
  period: string;
  company: string;
  department: string;
  employment: string;
  role: string;
  detail: string;
  achievement: string;
};

type Skill = { id: number; name: string; level: string };
type License = { id: number; date: string; name: string };

let nextId = 1;
const uid = () => nextId++;

const EMPLOYMENT_TYPES = ["正社員", "契約社員", "派遣社員", "業務委託", "アルバイト・パート"];

// ─── 小コンポーネント ─────────────────────────

function Field({
  label, value, onChange, placeholder = "", multiline = false, className = ""
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; className?: string;
}) {
  const base = "w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none";
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {multiline
        ? <textarea className={base} rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input type="text" className={base} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 bg-blue-500 rounded-full" />
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{children}</h3>
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────

export function ResumeBuilder() {
  // 基本情報
  const today = new Date();
  const [createdDate, setCreatedDate] = useState(
    `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  );
  const [name, setName]           = useState("");
  const [nameKana, setNameKana]   = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress]     = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");
  const [summary, setSummary]     = useState("");
  const [pr, setPr]               = useState("");

  // 職務経歴
  const [careers, setCareers] = useState<Career[]>([{
    id: uid(), period: "", company: "", department: "", employment: "正社員",
    role: "", detail: "", achievement: ""
  }]);

  // スキル
  const [skills, setSkills] = useState<Skill[]>([
    { id: uid(), name: "", level: "実務経験あり" }
  ]);

  // 資格・免許
  const [licenses, setLicenses] = useState<License[]>([
    { id: uid(), date: "", name: "" }
  ]);

  // キャリア操作
  const addCareer = () => setCareers(p => [...p, {
    id: uid(), period: "", company: "", department: "", employment: "正社員",
    role: "", detail: "", achievement: ""
  }]);
  const removeCareer = (id: number) => setCareers(p => p.filter(c => c.id !== id));
  const updateCareer = (id: number, key: keyof Career, val: string) =>
    setCareers(p => p.map(c => c.id === id ? { ...c, [key]: val } : c));

  // スキル操作
  const addSkill = () => setSkills(p => [...p, { id: uid(), name: "", level: "実務経験あり" }]);
  const removeSkill = (id: number) => setSkills(p => p.filter(s => s.id !== id));
  const updateSkill = (id: number, key: keyof Skill, val: string) =>
    setSkills(p => p.map(s => s.id === id ? { ...s, [key]: val } : s));

  // 資格操作
  const addLicense = () => setLicenses(p => [...p, { id: uid(), date: "", name: "" }]);
  const removeLicense = (id: number) => setLicenses(p => p.filter(l => l.id !== id));
  const updateLicense = (id: number, key: keyof License, val: string) =>
    setLicenses(p => p.map(l => l.id === id ? { ...l, [key]: val } : l));

  // 印刷
  const handlePrint = () => window.print();

  // テキストコピー用
  const [copied, setCopied] = useState(false);
  const plainText = useMemo(() => {
    const lines: string[] = [];
    lines.push("職務経歴書");
    lines.push(`作成日：${createdDate}`);
    lines.push("");
    if (name) lines.push(`氏名：${name}　（${nameKana}）`);
    if (birthDate) lines.push(`生年月日：${birthDate}`);
    if (address) lines.push(`住所：${address}`);
    if (phone) lines.push(`電話：${phone}`);
    if (email) lines.push(`Email：${email}`);
    if (summary) { lines.push(""); lines.push("【職務要約】"); lines.push(summary); }
    if (careers.some(c => c.company)) {
      lines.push(""); lines.push("【職務経歴】");
      careers.forEach(c => {
        if (!c.company) return;
        lines.push(`\n■ ${c.period}　${c.company}${c.department ? `　${c.department}` : ""}　（${c.employment}）`);
        if (c.role) lines.push(`職種・役職：${c.role}`);
        if (c.detail) lines.push(`業務内容：\n${c.detail}`);
        if (c.achievement) lines.push(`実績・成果：\n${c.achievement}`);
      });
    }
    const activeSkills = skills.filter(s => s.name);
    if (activeSkills.length) {
      lines.push(""); lines.push("【スキル・経験】");
      activeSkills.forEach(s => lines.push(`・${s.name}（${s.level}）`));
    }
    const activeLicenses = licenses.filter(l => l.name);
    if (activeLicenses.length) {
      lines.push(""); lines.push("【資格・免許】");
      activeLicenses.forEach(l => lines.push(`・${l.date ? l.date + "　" : ""}${l.name}`));
    }
    if (pr) { lines.push(""); lines.push("【自己PR】"); lines.push(pr); }
    return lines.join("\n");
  }, [name, nameKana, birthDate, address, phone, email, summary, careers, skills, licenses, pr, createdDate]);

  const copyText = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── UI ─────────────────────────────────────
  return (
    <>
      {/* 印刷専用CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-print, #resume-print * { visibility: visible !important; }
          #resume-print {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            padding: 12mm 15mm !important;
            font-size: 10pt !important;
            color: #000 !important;
            background: #fff !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="space-y-6 animate-fade-in">

        {/* ─ 操作バー ─ */}
        <div className="flex flex-wrap gap-2 justify-end no-print">
          <button onClick={copyText}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            {copied ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
            テキストコピー
          </button>
          <button onClick={handlePrint}
            className="btn-primary">
            <Printer className="w-4 h-4" />
            印刷 / PDF保存
          </button>
        </div>

        {/* ─ 入力フォーム ─ */}
        <div className="space-y-5 no-print">

          {/* 基本情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
            <SectionTitle>基本情報</SectionTitle>
            <Field label="作成日" value={createdDate} onChange={setCreatedDate} placeholder="2024年1月1日" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="氏名" value={name} onChange={setName} placeholder="山田 太郎" />
              <Field label="ふりがな" value={nameKana} onChange={setNameKana} placeholder="やまだ たろう" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="生年月日" value={birthDate} onChange={setBirthDate} placeholder="1990年1月1日" />
              <Field label="電話番号" value={phone} onChange={setPhone} placeholder="090-0000-0000" />
            </div>
            <Field label="住所" value={address} onChange={setAddress} placeholder="東京都渋谷区〇〇1-2-3" />
            <Field label="メールアドレス" value={email} onChange={setEmail} placeholder="example@email.com" />
          </div>

          {/* 職務要約 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <SectionTitle>職務要約（3〜5行が目安）</SectionTitle>
            <Field label="" value={summary} onChange={setSummary} multiline
              placeholder="Webエンジニアとして5年間、主にフロントエンド開発に従事してきました。React・TypeScriptを用いた大規模アプリの開発経験があり、チームリーダーとして5名のメンバーをまとめた経験があります。" />
          </div>

          {/* 職務経歴 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <SectionTitle>職務経歴（新しい順に記入）</SectionTitle>
              <button onClick={addCareer}
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
                <Plus className="w-4 h-4" />追加
              </button>
            </div>
            {careers.map((c, idx) => (
              <div key={c.id} className="relative bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-500">職歴 {idx + 1}</span>
                  {careers.length > 1 && (
                    <button onClick={() => removeCareer(c.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="在職期間" value={c.period} onChange={v => updateCareer(c.id, "period", v)}
                    placeholder="2020年4月 〜 現在" />
                  <Field label="会社名" value={c.company} onChange={v => updateCareer(c.id, "company", v)}
                    placeholder="株式会社〇〇" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="部署・チーム" value={c.department} onChange={v => updateCareer(c.id, "department", v)}
                    placeholder="開発部　Webチーム" />
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">雇用形態</label>
                    <select value={c.employment} onChange={e => updateCareer(c.id, "employment", e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                      {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <Field label="職種・役職" value={c.role} onChange={v => updateCareer(c.id, "role", v)}
                  placeholder="フロントエンドエンジニア / リードエンジニア" />
                <Field label="業務内容（箇条書き推奨）" value={c.detail} onChange={v => updateCareer(c.id, "detail", v)} multiline
                  placeholder="・Next.js / TypeScriptを用いたWebアプリケーション開発&#10;・新機能の要件定義〜設計〜実装〜テストまで一貫して担当&#10;・チームメンバー5名のコードレビューおよびタスク管理" />
                <Field label="実績・成果" value={c.achievement} onChange={v => updateCareer(c.id, "achievement", v)} multiline
                  placeholder="・ページ表示速度を30%改善し、CVRが15%向上&#10;・工数見積もり精度の改善により、プロジェクト遅延ゼロを達成" />
              </div>
            ))}
          </div>

          {/* スキル */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>スキル・経験</SectionTitle>
              <button onClick={addSkill} className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
                <Plus className="w-4 h-4" />追加
              </button>
            </div>
            {skills.map(s => (
              <div key={s.id} className="flex gap-2 items-center">
                <input type="text" value={s.name} onChange={e => updateSkill(s.id, "name", e.target.value)}
                  placeholder="TypeScript / React / Next.js"
                  className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <select value={s.level} onChange={e => updateSkill(s.id, "level", e.target.value)}
                  className="w-36 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {["業務レベル", "実務経験あり", "個人開発経験", "学習中"].map(l => <option key={l}>{l}</option>)}
                </select>
                {skills.length > 1 && (
                  <button onClick={() => removeSkill(s.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 資格・免許 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>資格・免許</SectionTitle>
              <button onClick={addLicense} className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
                <Plus className="w-4 h-4" />追加
              </button>
            </div>
            {licenses.map(l => (
              <div key={l.id} className="flex gap-2 items-center">
                <input type="text" value={l.date} onChange={e => updateLicense(l.id, "date", e.target.value)}
                  placeholder="2022年6月"
                  className="w-32 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="text" value={l.name} onChange={e => updateLicense(l.id, "name", e.target.value)}
                  placeholder="AWS認定ソリューションアーキテクト"
                  className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                {licenses.length > 1 && (
                  <button onClick={() => removeLicense(l.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 自己PR */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <SectionTitle>自己PR</SectionTitle>
            <Field label="" value={pr} onChange={setPr} multiline
              placeholder="問題解決力と継続的な学習姿勢を強みとしています。前職では〇〇の課題に対し、〇〇を提案・実行することで〇〇の成果を達成しました..." />
          </div>
        </div>

        {/* ─ 印刷プレビュー ─ */}
        <div id="resume-print"
          className="bg-white text-black rounded-2xl border border-slate-200 p-8 text-sm leading-relaxed font-sans"
          style={{ fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif' }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
            <h1 className="text-xl font-bold tracking-widest">職務経歴書</h1>
            <p className="text-xs text-gray-600">{createdDate}</p>
          </div>

          {/* 基本情報 */}
          <table className="w-full mb-6 text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1.5 w-24 text-gray-500 text-xs font-semibold">氏名</td>
                <td className="py-1.5 font-bold text-base">
                  {name || "（未入力）"}
                  {nameKana && <span className="text-xs text-gray-500 ml-2 font-normal">（{nameKana}）</span>}
                </td>
              </tr>
              {birthDate && (
                <tr className="border-b border-gray-200">
                  <td className="py-1.5 text-gray-500 text-xs font-semibold">生年月日</td>
                  <td className="py-1.5">{birthDate}</td>
                </tr>
              )}
              {address && (
                <tr className="border-b border-gray-200">
                  <td className="py-1.5 text-gray-500 text-xs font-semibold">住所</td>
                  <td className="py-1.5">{address}</td>
                </tr>
              )}
              {(phone || email) && (
                <tr>
                  <td className="py-1.5 text-gray-500 text-xs font-semibold">連絡先</td>
                  <td className="py-1.5">
                    {phone && <span className="mr-4">{phone}</span>}
                    {email && <span>{email}</span>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 職務要約 */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-2 tracking-wider">■ 職務要約</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">{summary}</p>
            </div>
          )}

          {/* 職務経歴 */}
          {careers.some(c => c.company) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-3 tracking-wider">■ 職務経歴</h2>
              {careers.filter(c => c.company).map((c, i) => (
                <div key={c.id} className={`${i > 0 ? "mt-5 pt-5 border-t border-gray-200" : ""}`}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-bold text-sm">{c.company}</span>
                    {c.department && <span className="text-xs text-gray-500">{c.department}</span>}
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{c.employment}</span>
                    <span className="text-xs text-gray-500 ml-auto">{c.period}</span>
                  </div>
                  {c.role && (
                    <p className="text-xs text-gray-600 mb-2">
                      <span className="font-semibold">職種・役職：</span>{c.role}
                    </p>
                  )}
                  {c.detail && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">業務内容</p>
                      <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800 pl-2">{c.detail}</p>
                    </div>
                  )}
                  {c.achievement && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">実績・成果</p>
                      <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800 pl-2">{c.achievement}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* スキル */}
          {skills.some(s => s.name) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-2 tracking-wider">■ スキル・経験</h2>
              <div className="flex flex-wrap gap-2">
                {skills.filter(s => s.name).map(s => (
                  <span key={s.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {s.name}
                    <span className="text-gray-500 ml-1">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 資格・免許 */}
          {licenses.some(l => l.name) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-2 tracking-wider">■ 資格・免許</h2>
              <ul className="space-y-1">
                {licenses.filter(l => l.name).map(l => (
                  <li key={l.id} className="text-xs flex gap-4">
                    {l.date && <span className="text-gray-500 w-24 flex-shrink-0">{l.date}</span>}
                    <span>{l.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 自己PR */}
          {pr && (
            <div>
              <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-2 tracking-wider">■ 自己PR</h2>
              <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800">{pr}</p>
            </div>
          )}

          <p className="text-right text-xs text-gray-400 mt-8">以上</p>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center no-print">
          ※「印刷 / PDF保存」ボタンを押すと、入力フォームが非表示になり職務経歴書のみが印刷されます。
        </p>
      </div>
    </>
  );
}
