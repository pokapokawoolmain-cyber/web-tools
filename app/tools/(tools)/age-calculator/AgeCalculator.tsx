"use client";

import { useState, useMemo } from "react";
import { toWareki, getEto, getZodiac } from "@/lib/wareki";

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AgeCalculator() {
  const today = new Date();
  const [birth, setBirth] = useState("2000-01-01");
  const [base, setBase] = useState(ymd(today));

  const result = useMemo(() => {
    const b = new Date(birth + "T00:00:00");
    const a = new Date(base + "T00:00:00");
    if (isNaN(b.getTime()) || isNaN(a.getTime()) || a < b) return null;

    const by = b.getFullYear(), bm = b.getMonth() + 1, bd = b.getDate();

    // 満年齢
    let age = a.getFullYear() - by;
    const hadBirthday =
      a.getMonth() + 1 > bm || (a.getMonth() + 1 === bm && a.getDate() >= bd);
    if (!hadBirthday) age -= 1;

    // 数え年（その年の1月1日に1歳加齢）
    const kazoe = a.getFullYear() - by + 1;

    // 生まれてからの日数
    const days = Math.floor((a.getTime() - b.getTime()) / 86400000);

    // 次の誕生日まで
    let nextBday = new Date(a.getFullYear(), bm - 1, bd);
    if (nextBday < a) nextBday = new Date(a.getFullYear() + 1, bm - 1, bd);
    const daysToNext = Math.round((nextBday.getTime() - a.getTime()) / 86400000);

    const wareki = toWareki(by, bm, bd);
    const eto = getEto(by);
    const zodiac = getZodiac(bm, bd);

    return { age, kazoe, days, daysToNext, wareki, eto, zodiac };
  }, [birth, base]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 使い方 */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        生年月日を入れると、満年齢・数え年・干支・星座・生まれてからの日数を自動で計算します。基準日を変えれば「過去のあの日に何歳だったか」「未来のあの日に何歳になるか」も分かります。
      </div>

      {/* 入力 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">生年月日</span>
          <input
            type="date"
            value={birth}
            max="2100-12-31"
            onChange={(e) => setBirth(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-slate-600 dark:text-zinc-300">基準日（何歳かを知りたい日）</span>
          <input
            type="date"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
          />
        </label>
      </div>

      {result ? (
        <>
          {/* メイン結果 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
            <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">満年齢</p>
            <p className="text-[52px] leading-none font-bold text-slate-900 dark:text-white">
              {result.age}<span className="text-2xl font-semibold ml-1">歳</span>
            </p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
              数え年 {result.kazoe}歳・次の誕生日まで {result.daysToNext}日
            </p>
          </div>

          {/* 内訳 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "生まれてからの日数", value: `${result.days.toLocaleString()}日` },
              { label: "生年の和暦", value: result.wareki ? result.wareki.text : "—" },
              { label: "干支（十二支）", value: `${result.eto.sign}（${result.eto.animal}）` },
              { label: "星座", value: result.zodiac },
              { label: "数え年", value: `${result.kazoe}歳` },
              { label: "次の誕生日まで", value: `${result.daysToNext}日` },
            ].map((c) => (
              <div key={c.label} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3">
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">{c.label}</p>
                <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">{c.value}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center text-[14px] text-slate-500 dark:text-zinc-400">
          生年月日が基準日より後になっています。日付を確認してください。
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 満年齢は誕生日の前日に加齢する「年齢計算に関する法律」ではなく、一般的な「誕生日当日に加齢」で計算しています。
      </p>
    </div>
  );
}
