"use client";
import { useState, useMemo } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

type Scene = "wedding" | "funeral";

type NgWord = {
  word: string;
  category: "重ね言葉" | "忌み言葉" | "忌み数字";
  reason: string;
  alt?: string;
};

// 結婚式のスピーチ・挨拶で避けるべき言葉
const WEDDING_NG: NgWord[] = [
  { word: "切れる", category: "忌み言葉", reason: "夫婦の縁が切れることを連想させます", alt: "（使わずに言い換える）" },
  { word: "別れる", category: "忌み言葉", reason: "離別を連想させます", alt: "（使わずに言い換える）" },
  { word: "離れる", category: "忌み言葉", reason: "離別を連想させます", alt: "（使わずに言い換える）" },
  { word: "去る", category: "忌み言葉", reason: "別れ・離縁を連想させます", alt: "（使わずに言い換える）" },
  { word: "終わる", category: "忌み言葉", reason: "結婚生活の終わりを連想させます", alt: "お開きになる" },
  { word: "冷える", category: "忌み言葉", reason: "夫婦仲の冷え込みを連想させます", alt: "（使わずに言い換える）" },
  { word: "薄い", category: "忌み言葉", reason: "縁の薄さを連想させます", alt: "（使わずに言い換える）" },
  { word: "浅い", category: "忌み言葉", reason: "関係の浅さを連想させます", alt: "（使わずに言い換える）" },
  { word: "苦しい", category: "忌み言葉", reason: "「苦」を連想させます", alt: "（使わずに言い換える）" },
  { word: "壊れる", category: "忌み言葉", reason: "関係の破綻を連想させます", alt: "（使わずに言い換える）" },
  { word: "失う", category: "忌み言葉", reason: "喪失を連想させます", alt: "（使わずに言い換える）" },
  { word: "たびたび", category: "重ね言葉", reason: "再婚を連想させる重ね言葉です", alt: "何度も／よく" },
  { word: "しばしば", category: "重ね言葉", reason: "再婚を連想させる重ね言葉です", alt: "何度も／よく" },
  { word: "重ね重ね", category: "重ね言葉", reason: "再婚を連想させる重ね言葉です", alt: "心より／深く" },
  { word: "重々", category: "重ね言葉", reason: "再婚を連想させる重ね言葉です", alt: "十分に" },
  { word: "再三", category: "重ね言葉", reason: "再婚を連想させる重ね言葉です", alt: "何度も" },
  { word: "再び", category: "忌み言葉", reason: "再婚を連想させます", alt: "改めて"},
  { word: "繰り返す", category: "忌み言葉", reason: "離婚・再婚の繰り返しを連想させます", alt: "（使わずに言い換える）" },
  { word: "戻る", category: "忌み言葉", reason: "実家に戻る＝離婚を連想させます", alt: "（使わずに言い換える）" },
  { word: "4", category: "忌み数字", reason: "「死」を連想させます", alt: "（数を避けて表現）" },
  { word: "9", category: "忌み数字", reason: "「苦」を連想させます", alt: "（数を避けて表現）" },
];

// 葬儀・法事の挨拶・弔辞で避けるべき言葉
const FUNERAL_NG: NgWord[] = [
  { word: "たびたび", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "何度も／よく" },
  { word: "しばしば", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "何度も／よく" },
  { word: "重ね重ね", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "心より／深く" },
  { word: "重々", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "十分に" },
  { word: "返す返す", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "本当に／実に" },
  { word: "再三", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "何度も" },
  { word: "再び", category: "重ね言葉", reason: "不幸が重なることを連想させます", alt: "改めて" },
  { word: "続く", category: "忌み言葉", reason: "不幸が続くことを連想させます", alt: "（使わずに言い換える）" },
  { word: "次々", category: "忌み言葉", reason: "不幸が続くことを連想させます", alt: "（使わずに言い換える）" },
  { word: "ますます", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "一層／さらに" },
  { word: "いよいよ", category: "重ね言葉", reason: "不幸が重なることを連想させる重ね言葉です", alt: "（使わずに言い換える）" },
  { word: "死ぬ", category: "忌み言葉", reason: "直接的な表現は避けます", alt: "ご逝去される／お亡くなりになる" },
  { word: "死亡", category: "忌み言葉", reason: "直接的な表現は避けます", alt: "ご逝去／永眠" },
  { word: "生きる", category: "忌み言葉", reason: "生死に関する直接表現は避けます", alt: "ご生前" },
  { word: "生存", category: "忌み言葉", reason: "生死に関する直接表現は避けます", alt: "ご生前" },
  { word: "浮かばれない", category: "忌み言葉", reason: "不吉な印象を与えます", alt: "（使わずに言い換える）" },
  { word: "迷う", category: "忌み言葉", reason: "成仏できないことを連想させます", alt: "（使わずに言い換える）" },
  { word: "4", category: "忌み数字", reason: "「死」を連想させます", alt: "（数を避けて表現）" },
  { word: "9", category: "忌み数字", reason: "「苦」を連想させます", alt: "（数を避けて表現）" },
];

const SCENE_CONFIG: Record<Scene, { label: string; words: NgWord[]; placeholder: string }> = {
  wedding: {
    label: "結婚式のスピーチ",
    words: WEDDING_NG,
    placeholder: "結婚式・披露宴のスピーチ原稿をここに貼り付けてください…",
  },
  funeral: {
    label: "葬儀・法事の挨拶",
    words: FUNERAL_NG,
    placeholder: "弔辞・お悔やみの挨拶文をここに貼り付けてください…",
  },
};

type Match = { ng: NgWord; count: number };

export function ImikotobaChecker() {
  const [scene, setScene] = useState<Scene>("wedding");
  const [text, setText] = useState("");

  const config = SCENE_CONFIG[scene];

  const matches: Match[] = useMemo(() => {
    if (!text) return [];
    const found: Match[] = [];
    for (const ng of config.words) {
      const re = new RegExp(escapeRegExp(ng.word), "g");
      const count = (text.match(re) || []).length;
      if (count > 0) found.push({ ng, count });
    }
    return found;
  }, [text, config.words]);

  const highlighted = useMemo(() => {
    if (!text || matches.length === 0) return null;
    const words = matches.map((m) => m.ng.word).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "g");
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      words.includes(part) ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }, [text, matches]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 場面選択 */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-zinc-800 rounded-2xl p-1.5">
        {(Object.keys(SCENE_CONFIG) as Scene[]).map((s) => (
          <button
            key={s}
            onClick={() => setScene(s)}
            className={`py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all ${
              scene === s
                ? "bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                : "bg-transparent text-slate-500 dark:text-zinc-400"
            }`}
          >
            {SCENE_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* テキストエリア */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">スピーチ・挨拶文を入力</span>
          <button
            onClick={() => setText("")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={config.placeholder}
          className="w-full h-56 p-4 text-sm text-slate-900 dark:text-white bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 dark:placeholder-slate-600"
        />
      </div>

      {/* 結果 */}
      {text && (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-4 flex items-center gap-3 ${
              matches.length > 0
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
                : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
            }`}
          >
            {matches.length > 0 ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 text-lg flex-shrink-0">✓</span>
            )}
            <p className={`text-sm font-semibold ${matches.length > 0 ? "text-amber-800 dark:text-amber-300" : "text-emerald-800 dark:text-emerald-300"}`}>
              {matches.length > 0
                ? `${matches.length}種類・計${matches.reduce((s, m) => s + m.count, 0)}箇所の忌み言葉が見つかりました`
                : "忌み言葉・重ね言葉は見つかりませんでした"}
            </p>
          </div>

          {matches.length > 0 && (
            <>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">本文ハイライト</p>
                <div className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{highlighted}</div>
              </div>

              <div className="space-y-2">
                {matches
                  .sort((a, b) => b.count - a.count)
                  .map((m) => (
                    <div key={m.ng.word} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-zinc-100 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                            {m.ng.word}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                            {m.ng.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-zinc-500">{m.count}箇所</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">{m.ng.reason}</p>
                      {m.ng.alt && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">言い換え例：{m.ng.alt}</p>}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ 入力したテキストはブラウザ内でのみ処理され、外部に送信されません。本ツールは代表的な忌み言葉を機械的に検出するもので、文脈によっては誤検出（例：日付の「4日」「9日」など）が含まれる場合があります。最終的な原稿は自分の目で読み返してご確認ください。
      </p>
    </div>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
