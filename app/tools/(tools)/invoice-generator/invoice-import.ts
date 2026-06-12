"use client";

// ─── Types ────────────────────────────────────────────────────────
export type ParsedItem = {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: number;
};

export type ImportWarningLevel = "error" | "warn" | "info";

export type ImportWarning = {
  level: ImportWarningLevel;
  message: string;
  suggestion: string;
};

export type ParsedInvoice = {
  items: ParsedItem[];
  issuerName?: string;
  issueDate?: string;
  warnings: ImportWarning[];
};

// ─── Main entry ───────────────────────────────────────────────────
export async function importFromFile(
  file: File,
  onProgress?: (msg: string) => void
): Promise<ParsedInvoice> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isPdf = ext === "pdf" || file.type === "application/pdf";
  const isImage =
    ["jpg", "jpeg", "png", "webp"].includes(ext) ||
    file.type.startsWith("image/");

  if (isPdf) {
    onProgress?.("PDFを読み込み中...");
    return importFromPdf(file, onProgress);
  }
  if (isImage) {
    onProgress?.("画像を準備中...");
    return importFromImage(file, onProgress);
  }
  throw new Error("未対応のファイル形式です（.pdf / .jpg / .png に対応）");
}

// ─── PDF ──────────────────────────────────────────────────────────
async function importFromPdf(
  file: File,
  onProgress?: (msg: string) => void
): Promise<ParsedInvoice> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let allLines: string[] = [];
  let totalChars = 0;

  for (let p = 1; p <= Math.min(pdf.numPages, 3); p++) {
    onProgress?.(`${p}ページ目を解析中...`);
    const page = await pdf.getPage(p);
    const textContent = await page.getTextContent();

    // 位置情報を使って行単位に再構成
    type TItem = { str: string; transform: number[] };
    const rawItems = textContent.items as TItem[];

    rawItems.sort((a, b) => {
      const dy = b.transform[5] - a.transform[5];
      if (Math.abs(dy) > 3) return dy;
      return a.transform[4] - b.transform[4];
    });

    const rows: string[][] = [];
    let rowBuf: string[] = [];
    let lastY = Infinity;
    for (const item of rawItems) {
      const y = item.transform[5];
      if (Math.abs(y - lastY) > 3 && rowBuf.length > 0) {
        rows.push(rowBuf);
        rowBuf = [];
      }
      rowBuf.push(item.str);
      lastY = y;
    }
    if (rowBuf.length > 0) rows.push(rowBuf);

    for (const row of rows) {
      const line = row.join(" ").trim();
      if (line) {
        allLines.push(line);
        totalChars += line.replace(/\s/g, "").length;
      }
    }
  }

  // テキストが少なければスキャンPDF → OCR
  if (totalChars < 30) {
    onProgress?.("スキャンPDFを検出。OCR処理を開始します...");
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx as any, viewport, canvas }).promise;

    const { text, confidence } = await runOcr(canvas.toDataURL("image/png"), onProgress);
    const result = parseText(text.split("\n"), confidence);
    result.warnings.unshift({
      level: "warn",
      message: "スキャンPDFのため、テキストPDFより読み取り精度が低下します。",
      suggestion: "可能であればテキストデータが埋め込まれたPDFをご使用ください（freee・マネーフォワード等の出力PDFが最適です）。",
    });
    return result;
  }

  onProgress?.("テキストを解析中...");
  return parseText(allLines);
}

// ─── Image ────────────────────────────────────────────────────────
async function importFromImage(
  file: File,
  onProgress?: (msg: string) => void
): Promise<ParsedInvoice> {
  const { text, confidence } = await runOcr(file, onProgress);
  return parseText(text.split("\n"), confidence);
}

// ─── Tesseract OCR ────────────────────────────────────────────────
async function runOcr(
  src: File | string,
  onProgress?: (msg: string) => void
): Promise<{ text: string; confidence: number }> {
  onProgress?.("OCR言語データを準備中（初回は少し時間がかかります）...");
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("jpn+eng", undefined, {
    logger: (m: { status: string; progress?: number }) => {
      if (m.status === "recognizing text" && m.progress != null) {
        onProgress?.(`OCR処理中... ${Math.round(m.progress * 100)}%`);
      } else if (m.status === "loading language traineddata") {
        onProgress?.("日本語データを読み込み中...");
      }
    },
  });
  try {
    const result = await worker.recognize(src as string);
    return { text: result.data.text, confidence: result.data.confidence };
  } finally {
    await worker.terminate();
  }
}

// ─── Text parser ──────────────────────────────────────────────────
const SKIP_RE =
  /^(小計|合計|消費税|内税|外税|税率|税抜|税込|割引|値引|ポイント|お釣り|預かり|お預|支払|振込|口座|電話|TEL|FAX|住所|〒|発行日|締切|登録番号|ご請求|請求金額|総計|担当|御中|様|No\.|番号|ページ|Page)/i;

function parseDate(text: string): string | undefined {
  const m1 = text.match(/(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})日?/);
  if (m1)
    return `${m1[1]}-${String(m1[2]).padStart(2, "0")}-${String(m1[3]).padStart(2, "0")}`;
  const m2 = text.match(/令和\s*(\d+)\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (m2)
    return `${2018 + +m2[1]}-${String(m2[2]).padStart(2, "0")}-${String(m2[3]).padStart(2, "0")}`;
  return undefined;
}

function parseText(lines: string[], ocrConfidence?: number): ParsedInvoice {
  const warnings: ImportWarning[] = [];
  const items: ParsedItem[] = [];
  let issueDate: string | undefined;
  let issuerName: string | undefined;

  const fullText = lines.join("\n");
  issueDate = parseDate(fullText);

  for (const line of lines) {
    if (
      /株式会社|合同会社|有限会社|一般社団法人/.test(line) &&
      !issuerName
    ) {
      issuerName = line.replace(/\s{2,}/g, " ").trim().slice(0, 40);
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (SKIP_RE.test(trimmed) || trimmed.length < 2) continue;

    // 行内の金額らしき数値を収集
    const numMatches = [
      ...trimmed.matchAll(/[¥￥]?\s*(\d{1,3}(?:,\d{3})*|\d{2,7})\b/g),
    ]
      .map((m) => parseInt(m[1].replace(/,/g, ""), 10))
      .filter((n) => n > 0 && n < 5_000_000);

    if (numMatches.length === 0) continue;

    // 名称: 数値・記号を除いたテキスト部分
    const nameRaw = trimmed
      .replace(/[¥￥]/g, "")
      .replace(/\d{1,3}(?:,\d{3})*|\d+/g, " ")
      .replace(/[×x×\*・。、\s]+/g, " ")
      .trim()
      .slice(0, 50);

    if (nameRaw.length < 1 || SKIP_RE.test(nameRaw)) continue;

    // 数量: × パターンから取得
    let qty = 1;
    const qtyMatch = trimmed.match(/[×x×]\s*(\d{1,3})\b/);
    if (qtyMatch) qty = parseInt(qtyMatch[1], 10);

    // 単価の推定
    let price = numMatches[numMatches.length - 1]; // デフォルトは末尾の数値

    if (qty > 1 && numMatches.length >= 2) {
      // 末尾が合計、その前が単価の場合
      const candidate = numMatches[numMatches.length - 2];
      if (candidate * qty === price) {
        price = candidate;
      } else {
        price = Math.round(price / qty);
      }
    } else if (
      numMatches.length >= 2 &&
      numMatches[0] >= 1 &&
      numMatches[0] <= 999
    ) {
      // 先頭の小さな数値が数量の可能性
      if (
        Math.abs(
          numMatches[0] * numMatches[1] -
            numMatches[numMatches.length - 1]
        ) < 10
      ) {
        qty = numMatches[0];
        price = numMatches[1];
      }
    }

    items.push({ id: Date.now() + items.length, name: nameRaw, qty, unit: "式", price });
  }

  // ── 警告の生成 ──────────────────────────────────────────────
  if (ocrConfidence != null) {
    if (ocrConfidence < 60) {
      warnings.push({
        level: "error",
        message: `OCR信頼度が${Math.round(ocrConfidence)}%と低く、読み取りに多数の誤りが含まれる可能性があります。`,
        suggestion:
          "① 明るい場所で正面からまっすぐ撮影してください\n② 影や手ブレがないか確認してください\n③ 可能であればPDFファイルをご使用ください（精度が大幅に向上します）",
      });
    } else if (ocrConfidence < 80) {
      warnings.push({
        level: "warn",
        message: `OCR信頼度が${Math.round(ocrConfidence)}%です。一部の文字が正しく読み取れていない可能性があります。`,
        suggestion: "金額・品目名を目視で必ずご確認・修正ください。",
      });
    }
  }

  if (items.length === 0) {
    warnings.push({
      level: "error",
      message: "品目を自動検出できませんでした。",
      suggestion:
        "以下をお試しください：\n① より鮮明な画像で撮り直す\n② テキスト形式のPDF（freee・マネーフォワード等）を使用する\n③「品目名,数量,単位,単価」の4列CSVでインポートする\n④ 品目欄に直接手動入力する",
    });
  } else {
    if (items.some((i) => i.price === 0)) {
      warnings.push({
        level: "warn",
        message: "単価が0円の品目があります。読み取り結果を確認してください。",
        suggestion: "該当品目の単価欄を手動でご修正ください。",
      });
    }
    warnings.push({
      level: "info",
      message: `${items.length}件の品目を検出しました。`,
      suggestion:
        "自動解析のため、品目名・数量・単価に誤りが含まれる場合があります。送付前に必ずご確認ください。",
    });
  }

  if (!issueDate) {
    warnings.push({
      level: "info",
      message: "発行日を読み取れませんでした。",
      suggestion: "発行日欄を手動でご入力ください。",
    });
  }

  return { items, issuerName, issueDate, warnings };
}
