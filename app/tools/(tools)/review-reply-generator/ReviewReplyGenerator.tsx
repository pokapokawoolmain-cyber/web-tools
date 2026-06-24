"use client";

import { useState } from "react";

type Rating = 1 | 2 | 3 | 4 | 5;
type Tone = "formal" | "casual" | "owner";
type Category =
  | "food"
  | "service"
  | "atmosphere"
  | "price"
  | "wait"
  | "cleanliness"
  | "other";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "food", label: "料理・味" },
  { value: "service", label: "接客・サービス" },
  { value: "atmosphere", label: "雰囲気・空間" },
  { value: "price", label: "価格・コスパ" },
  { value: "wait", label: "待ち時間" },
  { value: "cleanliness", label: "清潔さ・衛生" },
  { value: "other", label: "その他" },
];

// カテゴリ × 評価帯（high/low）別の言及フレーズ
const CATEGORY_PHRASES: Record<Category, { high: string[]; low: string[] }> = {
  food: {
    high: [
      "お料理についてお褒めのお言葉をいただき、料理人一同大変喜んでおります。",
      "お料理を気に入っていただけたとのこと、シェフはじめスタッフ一同嬉しく思っております。",
      "お料理についてのご好評、誠にありがとうございます。日々の励みになります。",
    ],
    low: [
      "お料理についてご満足いただけなかったとのこと、大変申し訳ございませんでした。食材の選定から調理方法まで改めて見直してまいります。",
      "お料理に関してご不満をおかけしてしまい、誠に申し訳ございません。品質向上に向けて取り組んでまいります。",
      "ご提供した料理についてご期待に沿えなかったこと、深くお詫び申し上げます。",
    ],
  },
  service: {
    high: [
      "スタッフのサービスをご評価いただき、接客担当者一同大変励みになっております。",
      "接客についてお褒めの言葉をいただき、スタッフ一同大変うれしく思っております。",
      "サービスにご満足いただけたとのこと、スタッフ一同これからも丁寧な接客を続けてまいります。",
    ],
    low: [
      "接客・サービス面でご不快をおかけしてしまい、誠に申し訳ございませんでした。スタッフ教育を徹底し、改善に努めてまいります。",
      "サービスについてご期待に沿えなかったこと、大変申し訳ございませんでした。いただいたご意見を全スタッフで共有いたします。",
      "ご不快な思いをさせてしまったこと、心よりお詫び申し上げます。接客品質の向上に取り組んでまいります。",
    ],
  },
  atmosphere: {
    high: [
      "雰囲気をお楽しみいただけたとのこと、大変嬉しく思います。",
      "店内の雰囲気をご評価いただき、ありがとうございます。居心地よくお過ごしいただけるよう今後も心がけてまいります。",
      "空間についてお褒めいただき、スタッフ一同とても励みになっております。",
    ],
    low: [
      "店内の雰囲気についてご不満をおかけしてしまい、誠に申し訳ございません。環境改善に向けて取り組んでまいります。",
      "お席や空間についてご不便をおかけし、大変申し訳ございませんでした。より快適な環境づくりに努めてまいります。",
      "雰囲気面でご期待に沿えなかったこと、申し訳なく思っております。改善に向けて検討してまいります。",
    ],
  },
  price: {
    high: [
      "お値打ちにお楽しみいただけたとのこと、大変嬉しく思います。",
      "コストパフォーマンスをご評価いただき、ありがとうございます。これからもご満足いただける価値をお届けしてまいります。",
      "価格面もご満足いただけたとのこと、スタッフ一同励みになっております。",
    ],
    low: [
      "価格面についてご意見をいただきありがとうございます。より良いコストパフォーマンスを実現できるよう検討してまいります。",
      "お値段についてご不満をいただいたこと、真摯に受け止めております。お客様に納得していただける価格設定を改めて見直してまいります。",
      "価格に関するご意見をありがとうございます。品質とコストのバランスを大切にしながら改善を検討してまいります。",
    ],
  },
  wait: {
    high: [
      "お待ちいただいた時間もご理解いただき、ありがとうございます。",
      "スムーズにご案内できてよかったです。今後も迅速な対応を心がけてまいります。",
    ],
    low: [
      "長らくお待たせしてしまい、大変申し訳ございませんでした。オペレーションを見直し、待ち時間の短縮に取り組んでまいります。",
      "ご来店時にお待たせしてしまったこと、誠に申し訳ございません。スムーズなご案内ができるよう改善を進めてまいります。",
      "混雑時のご対応が不十分でご迷惑をおかけしました。スタッフ配置や提供スピードを改善してまいります。",
    ],
  },
  cleanliness: {
    high: [
      "清潔感についてもお褒めいただき、ありがとうございます。衛生管理を今後も徹底してまいります。",
      "清潔さにご満足いただけたとのこと、スタッフ一同大変励みになっております。",
    ],
    low: [
      "清潔さについてご不満をおかけしてしまい、大変申し訳ございませんでした。衛生管理を徹底し、再発防止に努めてまいります。",
      "店内の清潔さについてご指摘いただきありがとうございます。清掃体制を見直し、より清潔な環境を維持するよう努めてまいります。",
      "衛生面でご不快をおかけしてしまい、誠に申し訳ございません。スタッフ全員で衛生意識を高めてまいります。",
    ],
  },
  other: {
    high: [
      "嬉しいご感想をいただきありがとうございます。",
      "温かいお言葉をいただき、スタッフ一同大変励みになっております。",
    ],
    low: [
      "ご意見をいただきありがとうございます。今後のサービス向上に活かしてまいります。",
      "いただいたご指摘を真摯に受け止め、改善に努めてまいります。",
    ],
  },
};

// 冒頭フレーズ
const OPENINGS: Record<Tone, Record<"high" | "mid" | "low", string[]>> = {
  formal: {
    high: [
      "このたびはご来店いただき、誠にありがとうございます。また、嬉しいご評価をいただきありがとうございます。",
      "ご来店いただきまして、誠にありがとうございます。さらに、温かいご評価を賜りまして、スタッフ一同大変嬉しく思っております。",
      "このたびは貴重なお時間をいただき口コミをご投稿くださり、誠にありがとうございます。",
    ],
    mid: [
      "このたびはご来店いただき、また口コミをご投稿いただきありがとうございます。",
      "ご来店いただきましてありがとうございます。口コミをお寄せいただき、スタッフ一同感謝しております。",
    ],
    low: [
      "このたびはご来店いただきありがとうございます。ご不満な点がございましたこと、大変申し訳ございませんでした。",
      "ご来店いただいたにもかかわらず、ご満足いただけなかったとのこと、誠に申し訳ございません。",
      "このたびは不快なお気持ちにさせてしまい、心よりお詫び申し上げます。",
    ],
  },
  casual: {
    high: [
      "ご来店ありがとうございます！嬉しいご評価をいただき、スタッフ一同とても喜んでいます。",
      "来てくださってありがとうございます！素敵なご感想をいただき、本当に嬉しいです！",
      "ご来店・口コミありがとうございます！そんなお言葉をいただけて、スタッフみんな元気が出ました！",
    ],
    mid: [
      "ご来店・口コミありがとうございます！率直なご感想、参考になります。",
      "来てくださってありがとうございます！ご意見をいただき、ありがたく思っています。",
    ],
    low: [
      "ご来店ありがとうございます。ご不便をおかけしてしまい、本当に申し訳なかったです。",
      "来てくださったのにご不満をおかけしてしまい、ごめんなさい。",
    ],
  },
  owner: {
    high: [
      "ご来店いただきありがとうございます。私（店主）、こうしたお声が何よりの励みになります。",
      "来てくださってありがとうございます。お褒めの言葉、私から直接お礼を申し上げます。",
      "この口コミを読んで、私は本当に嬉しくなりました。ご来店ありがとうございます。",
    ],
    mid: [
      "ご来店・口コミありがとうございます。私（店主）として、率直なご意見は大変参考になります。",
      "来てくださってありがとうございます。私が直接お返事させていただきます。",
    ],
    low: [
      "ご来店いただいたにもかかわらず、私の店でご不便をおかけしてしまい、店主として深くお詫び申し上げます。",
      "ご不満をおかけしてしまい、誠に申し訳ありませんでした。私（店主）が責任をもって改善いたします。",
    ],
  },
};

// 締めフレーズ
const CLOSINGS: Record<Tone, string[]> = {
  formal: [
    "またのご来店を心よりお待ちしております。",
    "引き続きご愛顧のほど、よろしくお願い申し上げます。またのご来店をお待ちしております。",
    "今後ともご贔屓いただけますと幸いです。またお会いできる日を楽しみにしております。",
  ],
  casual: [
    "またぜひ来てください！お待ちしています！",
    "次回もきっとお気に入りいただけるよう頑張ります！またお越しください！",
    "またのご来店、心よりお待ちしています！",
  ],
  owner: [
    "またいつでも来てください。私自身、皆さんに喜んでいただける店づくりに全力を注いでいます。",
    "次回ご来店の際は、私が直接ご挨拶できれば嬉しいです。またお越しいただけることを楽しみにしています。",
    "引き続き精進してまいります。またのご来店を心よりお待ちしております。",
  ],
};

// 改善言及フレーズ（低評価時追加）
const IMPROVEMENT_PHRASES: Record<Tone, string[]> = {
  formal: [
    "いただいたご意見を参考に、サービスのさらなる向上に努めてまいります。",
    "ご指摘の点を真摯に受け止め、スタッフ一同で改善を進めてまいります。",
    "貴重なご意見を胸に、より良い店づくりに向けて取り組んでまいります。",
  ],
  casual: [
    "お気づきの点もしっかり受け取りました。改善していきますね！",
    "いただいたご意見、スタッフ全員で共有して改善していきます！",
    "教えてくれてありがとうございます。もっとよくなれるよう頑張ります！",
  ],
  owner: [
    "ご指摘の点、私が責任をもって改善いたします。",
    "いただいたお言葉を忘れず、より良い店にしていきます。",
    "率直なご意見をありがとうございます。私自身が先頭に立って改善してまいります。",
  ],
};

function getRatingBand(rating: Rating): "high" | "mid" | "low" {
  if (rating >= 4) return "high";
  if (rating === 3) return "mid";
  return "low";
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateReply(
  rating: Rating,
  categories: Category[],
  isNegative: boolean,
  overview: string,
  tone: Tone,
  storeName: string,
  seed: number
): string {
  const band = getRatingBand(rating);
  const effectiveBand = isNegative && band === "high" ? "mid" : band;

  const opening = pick(OPENINGS[tone][effectiveBand], seed);
  const closing = pick(CLOSINGS[tone], seed + 1);

  // カテゴリ別言及
  const categoryPhrases = categories
    .map((cat) => {
      const phrasesPool = CATEGORY_PHRASES[cat];
      const isLow = band === "low" || (isNegative && cat !== "food");
      const pool = isLow ? phrasesPool.low : phrasesPool.high;
      return pick(pool, seed + categories.indexOf(cat) + 2);
    })
    .join("\n");

  // overview がある場合の追加言及
  let overviewPart = "";
  if (overview.trim()) {
    if (band === "high" && !isNegative) {
      overviewPart = `「${overview.trim()}」とのお言葉、大変嬉しく拝読いたしました。\n`;
    } else {
      overviewPart = `ご指摘いただいた「${overview.trim()}」について、真摯に受け止めております。\n`;
    }
  }

  // 改善言及（低評価 or ネガティブ時）
  const improvementPart =
    band === "low" || isNegative
      ? pick(IMPROVEMENT_PHRASES[tone], seed + 3) + "\n"
      : "";

  // 署名
  const signature = storeName.trim()
    ? tone === "owner"
      ? `\n${storeName.trim()} 店主`
      : `\n${storeName.trim()}スタッフ一同`
    : "";

  const parts = [
    opening,
    overviewPart ? "\n" + overviewPart : "",
    categoryPhrases ? "\n" + categoryPhrases : "",
    improvementPart ? "\n" + improvementPart : "",
    "\n" + closing,
    signature,
  ].filter(Boolean);

  return parts.join("");
}

export function ReviewReplyGenerator() {
  const [rating, setRating] = useState<Rating>(5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNegative, setIsNegative] = useState(false);
  const [overview, setOverview] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [storeName, setStoreName] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const toggleCategory = (cat: Category) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerate = (newSeed?: number) => {
    const effectiveCategories = categories.length > 0 ? categories : (["other"] as Category[]);
    const s = newSeed ?? seed;
    const text = generateReply(
      rating,
      effectiveCategories,
      isNegative,
      overview,
      tone,
      storeName,
      s
    );
    setGeneratedText(text);
  };

  const handleRegenerate = () => {
    const newSeed = Math.floor(Math.random() * 100) + seed + 1;
    setSeed(newSeed);
    handleGenerate(newSeed);
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 評価 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          口コミの評価
        </label>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as Rating[]).map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={`flex-1 py-3 rounded-xl text-2xl transition-all border-2 ${
                rating >= r
                  ? "bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-500"
                  : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 opacity-50"
              }`}
              aria-label={`${r}星`}
            >
              {rating >= r ? "★" : "☆"}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          {rating}星の口コミへの返信文を生成します
        </p>
      </div>

      {/* カテゴリ */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          口コミのカテゴリ <span className="font-normal text-slate-400">（複数選択可）</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                categories.includes(cat.value)
                  ? "bg-orange-100 dark:bg-orange-900/40 border-orange-400 dark:border-orange-500 text-orange-800 dark:text-orange-300"
                  : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-orange-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ネガティブコメント有無 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          口コミに改善点・ネガティブな内容が含まれる
        </label>
        <div className="flex gap-3">
          {[
            { value: false, label: "含まない（ポジティブのみ）" },
            { value: true, label: "含む（改善点あり）" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setIsNegative(opt.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                isNegative === opt.value
                  ? "bg-orange-50 dark:bg-orange-900/30 border-orange-400 dark:border-orange-500 text-orange-800 dark:text-orange-300"
                  : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 口コミ概要 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          口コミの概要 <span className="font-normal text-slate-400">（任意）</span>
        </label>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
          例: ラーメンが絶品だった / 席が狭くて窮屈だった
        </p>
        <textarea
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          placeholder="口コミ内容の要点を入力（返信文に自然に盛り込まれます）"
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 文体 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          文体
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "formal" as Tone, label: "丁寧", desc: "敬語・フォーマル" },
            { value: "casual" as Tone, label: "カジュアル", desc: "親しみやすい" },
            { value: "owner" as Tone, label: "店主らしい", desc: "一人称「私」で直接的" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${
                tone === t.value
                  ? "bg-orange-50 dark:bg-orange-900/30 border-orange-400 dark:border-orange-500"
                  : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-orange-300"
              }`}
            >
              <div className="font-semibold text-sm text-slate-800 dark:text-zinc-200">
                {t.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 店舗名 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          店舗名 <span className="font-normal text-slate-400">（任意）</span>
        </label>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
          入力すると「○○スタッフ一同」のように署名として使用します
        </p>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="例: 麺屋○○"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 生成ボタン */}
      <button
        onClick={() => handleGenerate()}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-base shadow-sm"
      >
        返信文を生成する
      </button>

      {/* 結果 */}
      {generatedText && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
              生成された返信文
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {generatedText.length}文字
            </span>
          </div>
          <textarea
            readOnly
            value={generatedText}
            rows={10}
            className="w-full px-3 py-2.5 rounded-xl border border-orange-200 dark:border-orange-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-sm resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                copied
                  ? "bg-green-100 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-300"
                  : "bg-white dark:bg-zinc-900 border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-50"
              }`}
            >
              {copied ? "コピーしました!" : "コピー"}
            </button>
            <button
              onClick={handleRegenerate}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all"
            >
              再生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
