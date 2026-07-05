// ========================================
// AI文章ツールの生成ロジック（ローカルテンプレート）
// 各関数は入力値 → 文字列を返す純粋関数。
// 将来 OpenAI 等のAPIに差し替える場合は、この関数を
// async にして fetch("/api/ai-writing") を呼ぶだけでよい。
// ========================================

import type { AiTextValues } from "@/components/tools/AiTextTool";

// ─── 共通ヘルパー ───────────────────────────────
const clean = (s: string) => (s ?? "").trim();

function nameLine(v: string, fallback = "") {
  const n = clean(v);
  return n || fallback;
}

/** 相手に応じた宛名の敬称 */
function honorific(recipient: string): string {
  switch (recipient) {
    case "取引先":
    case "初めて":
      return "ご担当者";
    case "上司":
      return "";
    case "同僚":
      return "";
    default:
      return "ご担当者";
  }
}

// ─── 1. メール作成 ──────────────────────────────
export function generateEmail(v: AiTextValues): string {
  const purpose = v.purpose;
  const recipient = v.recipient;
  const tone = v.tone;
  const body = clean(v.body);
  const sender = nameLine(v.sender, "（あなたの名前）");
  const company = clean(v.recipientName) || "（会社名）";

  const isFormal = tone !== "簡潔";
  const isSocial = recipient === "取引先" || recipient === "初めて";

  const subjectMap: Record<string, string> = {
    依頼: "ご依頼のお願い",
    お礼: "御礼",
    日程調整: "日程調整のお願い",
    報告: "ご報告",
    相談: "ご相談",
    督促: "ご確認のお願い",
  };
  const subject = `【${subjectMap[purpose] ?? "ご連絡"}】${body ? body.split("\n")[0].slice(0, 18) : ""}`.replace(/】$/, "】");

  // 宛名
  const to = isSocial
    ? `${company}\n${honorific(recipient)}　様`
    : recipient === "上司"
      ? "（上司のお名前）　様"
      : "（宛先）　様";

  // 書き出し
  const opening = isSocial
    ? isFormal
      ? "いつも大変お世話になっております。"
      : "お世話になっております。"
    : recipient === "上司"
      ? "お疲れさまです。"
      : "お疲れさまです。";
  const nameIntro = isSocial ? `${sender}でございます。\n` : "";

  // 用途別の導入と結び
  const leadMap: Record<string, string> = {
    依頼: "下記の件につきまして、ご対応をお願いしたくご連絡いたしました。",
    お礼: "このたびは大変お世話になり、心より御礼申し上げます。",
    日程調整: "打ち合わせの日程につきまして、ご相談させていただきたくご連絡いたしました。",
    報告: "下記のとおりご報告いたします。",
    相談: "下記の件につきまして、ご相談させていただきたくご連絡いたしました。",
    督促: "先日お伝えした件につきまして、その後の状況をご確認させていただきたくご連絡いたしました。",
  };
  const closeMap: Record<string, string> = {
    依頼: "お手数をおかけしますが、何卒よろしくお願いいたします。",
    お礼: "今後ともどうぞよろしくお願いいたします。",
    日程調整: "ご都合のよい日時をいくつかお知らせいただけますと幸いです。",
    報告: "ご確認のほど、よろしくお願いいたします。",
    相談: "お忙しいところ恐れ入りますが、ご意見をいただけますと幸いです。",
    督促: "行き違いの際はご容赦ください。ご確認のほどよろしくお願いいたします。",
  };

  const mainBody = body || "（ここに要件を入力すると本文に反映されます）";

  const lines = [
    `件名：${subject}`,
    "",
    to,
    "",
    `${opening}${nameIntro ? "\n" + nameIntro : ""}`.trim(),
    "",
    leadMap[purpose] ?? "下記のとおりご連絡いたします。",
    "",
    mainBody,
    "",
    closeMap[purpose] ?? "何卒よろしくお願いいたします。",
    "",
    "──────────",
    sender,
  ];
  return lines.join("\n");
}

// ─── 2. 敬語変換 ───────────────────────────────
// よく使う口語・カジュアル表現 → 敬語/丁寧表現の辞書
const KEIGO_DICT: [RegExp, string][] = [
  // あいさつ・返答
  [/了解です|了解しました|りょうかい/g, "承知いたしました"],
  [/わかりました|分かりました|わかった/g, "承知いたしました"],
  [/オッケー|OK|おけ/gi, "承知いたしました"],
  [/ごめんなさい|ごめん|すみません(?!が)/g, "申し訳ございません"],
  [/ありがとう(ございます)?/g, "ありがとうございます"],
  [/よろしく(お願いします)?/g, "よろしくお願いいたします"],
  // 依頼（〜しといて / 〜しておいて / 〜して(ください) を先に処理）
  [/確認しと(いて)?(ください|ね)?|確認しておいて(ください|ね)?|確認して(ください|ね)?/g, "ご確認いただけますでしょうか"],
  [/教えて(ください|ね|ほしい)?/g, "お教えいただけますでしょうか"],
  [/送っと(いて)?(ください|ね)?|送っておいて(ください|ね)?|送って(ください|ね)?/g, "お送りいただけますでしょうか"],
  [/見て(ください|ね)?/g, "ご覧いただけますでしょうか"],
  [/来て(ください|ね)?/g, "お越しいただけますでしょうか"],
  [/伝えと(いて)?(ください|ね)?|伝えておいて(ください|ね)?|伝えて(ください|ね)?/g, "お伝えいただけますでしょうか"],
  // 動詞のます形 → 謙譲・丁寧
  [/送ります(ね)?/g, "お送りいたします"],
  [/送りたい/g, "お送りしたく存じます"],
  [/確認します(ね)?/g, "確認いたします"],
  [/連絡します(ね)?/g, "ご連絡いたします"],
  [/連絡しま(す)?/g, "ご連絡いたします"],
  [/報告します(ね)?/g, "ご報告いたします"],
  [/相談したい|相談させて/g, "ご相談させていただきたく存じます"],
  [/お願いします|おねがいします/g, "お願いいたします"],
  // 可能・依頼表現
  [/できます(か)?/g, "可能でしょうか"],
  [/できません|できない/g, "いたしかねます"],
  [/もらえますか|もらえる\?|もらえますか\?/g, "いただけますでしょうか"],
  [/くれますか|くれる\?/g, "いただけますでしょうか"],
  [/いいですか|大丈夫ですか|大丈夫\?/g, "差し支えございませんでしょうか"],
  [/知りたい/g, "お伺いしたく存じます"],
  [/思います/g, "存じます"],
  // 語彙のトーン
  [/すぐに|早めに/g, "お早めに"],
  [/ちょっと/g, "少々"],
  [/やっぱり|やっぱ/g, "やはり"],
  [/なので/g, "そのため"],
  [/だけど|でも(?=、|\s|[一-龥])/g, "しかしながら"],
];

export function generateKeigo(v: AiTextValues): string {
  const src = clean(v.body);
  if (!src) return "（変換したい文章を入力してください）";
  const mode = v.mode;

  let out = src;
  for (const [re, rep] of KEIGO_DICT) out = out.replace(re, rep);

  // 語尾の丁寧化（〜だ/〜する → 〜です/〜します）を軽く補正
  out = out
    .replace(/([一-龥ぁ-んァ-ン])だ。/g, "$1です。")
    .replace(/([一-龥ぁ-んァ-ン])する。/g, "$1いたします。");

  if (mode === "casual") {
    // 丁寧すぎる文を少しやわらかく（社内向け）
    out = out
      .replace(/いたします/g, "します")
      .replace(/ございます/g, "です")
      .replace(/いただけますでしょうか/g, "いただけますか");
  }

  const note =
    mode === "sonkei"
      ? "※ 尊敬語・謙譲語を優先して変換しました。相手の動作は尊敬語、自分の動作は謙譲語になっているかご確認ください。"
      : mode === "casual"
        ? "※ 社内向けにやわらかい丁寧語へ調整しました。"
        : "※ ビジネス標準の丁寧表現へ変換しました。";

  return `${out}\n\n──────────\n${note}`;
}

// ─── 3. 謝罪文作成 ──────────────────────────────
export function generateApology(v: AiTextValues): string {
  const recipient = v.recipient;
  const about = clean(v.about) || "このたびの件";
  const cause = clean(v.cause);
  const action = clean(v.action);
  const sender = nameLine(v.sender, "（あなたの名前）");
  const isSocial = recipient === "取引先" || recipient === "顧客";

  const to = isSocial ? "（会社名）\nご担当者　様" : "（宛先）　様";
  const opening = isSocial ? "いつも大変お世話になっております。" : "お疲れさまです。";

  const parts: string[] = [
    `件名：【お詫び】${about.split("\n")[0].slice(0, 20)}`,
    "",
    to,
    "",
    opening,
    isSocial ? `${sender}でございます。` : "",
    "",
    `このたびは、${about}につきまして、多大なご迷惑とご心配をおかけし、心より深くお詫び申し上げます。`,
  ].filter(Boolean);

  if (cause) {
    parts.push("", `原因を確認いたしましたところ、${cause}によるものでございました。`);
  }
  if (action) {
    parts.push("", `今後は、${action}を徹底し、再発防止に努めてまいります。`);
  } else {
    parts.push("", "今後はこのようなことのないよう、再発防止に努めてまいります。");
  }

  parts.push(
    "",
    "まずは書面（メール）にて、謹んでお詫び申し上げます。",
    "何卒ご容赦賜りますようお願い申し上げます。",
    "",
    "──────────",
    sender,
  );
  return parts.join("\n");
}

// ─── 4. 断り文作成 ──────────────────────────────
export function generateDecline(v: AiTextValues): string {
  const what = v.what; // 誘い/依頼/見積・提案/勧誘
  const recipient = v.recipient;
  const reason = clean(v.reason);
  const alt = clean(v.alternative);
  const sender = nameLine(v.sender, "（あなたの名前）");
  const isSocial = recipient === "取引先" || recipient === "顧客";

  const to = isSocial ? "（会社名）\nご担当者　様" : "（宛先）　様";
  const opening = isSocial ? "いつも大変お世話になっております。" : "お世話になっております。";

  const thanksMap: Record<string, string> = {
    誘い: "このたびはお誘いいただき、誠にありがとうございます。",
    依頼: "このたびはご依頼いただき、誠にありがとうございます。",
    "見積・提案": "このたびはご提案をいただき、誠にありがとうございます。",
    勧誘: "このたびはご案内をいただき、誠にありがとうございます。",
  };

  const reasonLine = reason
    ? `大変恐縮ではございますが、${reason}のため、今回は見送らせていただきたく存じます。`
    : "せっかくのお話ではございますが、諸般の事情により、今回は見送らせていただきたく存じます。";

  const parts: string[] = [
    `件名：${what === "見積・提案" ? "ご提案の件について" : "ご連絡"}`,
    "",
    to,
    "",
    opening,
    isSocial ? `${sender}でございます。` : "",
    "",
    thanksMap[what] ?? "ご連絡いただき、誠にありがとうございます。",
    "",
    reasonLine,
  ].filter(Boolean);

  if (alt) {
    parts.push("", `なお、${alt}でしたら改めてご相談させていただければ幸いです。`);
  }

  parts.push(
    "",
    "ご期待に沿えず誠に恐縮ですが、何卒ご理解賜りますようお願い申し上げます。",
    "今後ともどうぞよろしくお願いいたします。",
    "",
    "──────────",
    sender,
  );
  return parts.join("\n");
}

// ─── 5. 問い合わせ文作成 ─────────────────────────
export function generateInquiry(v: AiTextValues): string {
  const target = v.target; // 企業/店舗/役所/サポート
  const kind = v.kind; // 商品/在庫/予約/不具合/請求/その他
  const content = clean(v.content) || "（問い合わせ内容を入力してください）";
  const want = clean(v.want);
  const sender = nameLine(v.sender, "（あなたの名前）");

  const to =
    target === "役所"
      ? "（担当課）　御中"
      : target === "店舗"
        ? "（店舗名）　御中"
        : "（会社名）\nカスタマーサポート　御中";

  const kindLead: Record<string, string> = {
    商品: "貴社の商品について、お伺いしたい点がございます。",
    在庫: "商品の在庫状況について、お伺いしたく存じます。",
    予約: "予約について、お伺いしたく存じます。",
    不具合: "購入した商品（サービス）の不具合について、ご相談がございます。",
    請求: "ご請求内容について、確認させていただきたい点がございます。",
    その他: "下記の件について、お伺いしたく存じます。",
  };

  const parts: string[] = [
    `件名：${kind === "不具合" ? "不具合に関するお問い合わせ" : "お問い合わせ"}`,
    "",
    to,
    "",
    "はじめまして。突然のご連絡失礼いたします。",
    "",
    kindLead[kind] ?? "下記の件について、お伺いしたく存じます。",
    "",
    "【お問い合わせ内容】",
    content,
  ];

  if (want) {
    parts.push("", `お手数ですが、${want}にてご回答いただけますと幸いです。`);
  }

  parts.push(
    "",
    "お忙しいところ恐れ入りますが、ご確認のほどよろしくお願いいたします。",
    "",
    "──────────",
    sender,
  );
  return parts.join("\n");
}

// ─── 6. ChatGPTプロンプト作成補助 ─────────────────
export function generatePrompt(v: AiTextValues): string {
  const task = clean(v.task) || "（AIにやってほしいことを入力してください）";
  const role = clean(v.role);
  const format = v.format; // 箇条書き/表/ステップ/文章/コード
  const audience = clean(v.audience);
  const tone = v.tone;
  const constraints = clean(v.constraints);

  const formatMap: Record<string, string> = {
    箇条書き: "箇条書き（要点ごとに簡潔に）",
    表: "表形式（項目を列で整理）",
    ステップ: "手順（ステップ1、2…の順序立て）",
    文章: "まとまった文章",
    コード: "コード（説明コメント付き）",
  };

  const lines: string[] = [];

  if (role) {
    lines.push(`あなたは${role}です。その専門家として回答してください。`, "");
  }

  lines.push("# 依頼内容", task, "");

  const conditions: string[] = [];
  conditions.push(`- 出力形式：${formatMap[format] ?? "まとまった文章"}`);
  if (audience) conditions.push(`- 想定読者：${audience}`);
  if (tone && tone !== "指定なし") conditions.push(`- トーン：${tone}`);
  if (constraints) conditions.push(`- 制約・条件：${constraints}`);
  conditions.push("- 前提が不足している場合は、決めつけずに質問してください。");

  lines.push("# 条件", ...conditions, "");

  lines.push(
    "# 補足",
    "・専門用語には短い説明を添えてください。",
    "・確信が持てない情報は、その旨を明記してください。",
  );

  return lines.join("\n");
}
