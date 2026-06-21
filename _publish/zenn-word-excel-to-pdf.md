---
title: "mammoth.js + SheetJS でWord/ExcelをブラウザだけでPDFに変換する実装"
emoji: "📊"
type: "tech"
topics: ["nextjs", "typescript", "react", "mammoth", "sheetjs"]
published: true
---

## はじめに

Word（.docx）やExcel（.xlsx）をPDFに変換するとき、通常は LibreOffice をサーバーで動かしたり、外部APIを使ったりします。しかし以下のライブラリを組み合わせることで、**ブラウザだけでサーバーレスに実現**できます。

| ライブラリ | 役割 |
|---|---|
| [mammoth.js](https://github.com/mwilliamson/mammoth.js) | `.docx` → HTML 変換 |
| [SheetJS (xlsx)](https://sheetjs.com/) | `.xlsx/.xls/.csv` → HTML テーブル変換 |
| iframe + `contentWindow.print()` | HTML → PDFとして印刷ダイアログ |

実際に動くツール：
- [Word→PDF変換 - ToolBoxJP](https://www.toolboxjp.com/tools/word-to-pdf)
- [Excel→PDF変換 - ToolBoxJP](https://www.toolboxjp.com/tools/excel-to-pdf)

---

## アーキテクチャ

```
[ユーザーがファイルをアップロード]
        ↓
[mammoth.js / SheetJS でHTML文字列に変換]
        ↓
[非表示 iframe を生成し、HTMLを書き込む]
        ↓
[iframe.contentWindow.print() を呼ぶ]
        ↓
[ブラウザの印刷ダイアログ → 「PDFとして保存」]
```

ポイントは**HTMLを中間フォーマットとして使う**ことです。Word/ExcelのデータをHTMLに変換してブラウザに渡すことで、ブラウザ標準の印刷機能をPDF出力に流用できます。

---

## Word（.docx）→ PDF 実装

### インストール

```bash
npm install mammoth
```

### mammoth.js で .docx を HTML に変換

```tsx
"use client";
import { useState } from "react";

async function convertDocxToHtml(file: File): Promise<{ html: string; warnings: string[] }> {
  // mammoth は ESM/CJS 両対応。Next.js では動的インポートが確実
  const mammoth = (await import("mammoth")) as any;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return {
    html: result.value,
    warnings: result.messages.map((m: any) => m.message),
  };
}
```

**mammoth.js が変換できるもの：**
- 見出し（H1〜H6）→ `<h1>〜<h6>`
- 段落、箇条書き、番号付きリスト
- 表（テーブル）
- 太字・斜体・下線・取り消し線
- 画像（base64埋め込み）
- リンク

**変換できないもの（既知の限界）：**
- ヘッダー・フッター・ページ番号
- テキストボックス・図形・SmartArt
- 独自フォント（游ゴシック等）→ ブラウザのデフォルトフォントにフォールバック
- 複雑な段組み・差し込み印刷

### iframe に流し込んでPDF出力

```tsx
function printHtmlAsPdf(html: string, filename: string) {
  const printHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${filename}</title>
<style>
  @page { size: A4; margin: 20mm 25mm; }
  @media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  body {
    font-family: 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', sans-serif;
    font-size: 10.5pt;
    line-height: 1.7;
    color: #111;
  }
  h1 { font-size: 18pt; margin: 20pt 0 10pt; }
  h2 { font-size: 15pt; margin: 16pt 0 8pt; }
  h3 { font-size: 12pt; margin: 12pt 0 6pt; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
  td, th { border: 1px solid #aaa; padding: 4pt 8pt; }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>${html}</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(printHtml);
  doc.close();

  iframe.contentWindow?.focus();

  // レンダリングを待ってから print()
  setTimeout(() => {
    iframe.contentWindow?.print();
    // 印刷ダイアログを閉じた後に iframe を削除
    setTimeout(() => document.body.removeChild(iframe), 3000);
  }, 400);
}
```

**`setTimeout` が必要な理由：**
`doc.write()` 直後は画像や外部リソースのロードが完了していないことがあるため、少し待ってから `print()` を呼びます。画像が多い場合は `400ms` より長くする必要があることも。

### Word→PDF コンポーネント全体像

```tsx
export function WordToPdf() {
  const [html, setHtml] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      alert(".docx ファイルのみ対応しています");
      return;
    }
    setIsConverting(true);
    try {
      const result = await convertDocxToHtml(file);
      setHtml(result.html);
      setWarnings(result.warnings);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".docx"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {warnings.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
          {warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
        </div>
      )}

      {html && (
        <>
          {/* プレビュー */}
          <div
            className="mt-6 prose max-w-none border rounded-xl p-6 max-h-[500px] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <button
            onClick={() => printHtmlAsPdf(html, "document.pdf")}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            PDFとして保存する
          </button>
        </>
      )}
    </div>
  );
}
```

---

## Excel（.xlsx/.xls/.csv）→ PDF 実装

### インストール

```bash
npm install xlsx
```

### SheetJS で .xlsx を HTML テーブルに変換

```tsx
async function convertExcelToHtml(
  file: File
): Promise<{ sheets: { name: string; html: string }[] }> {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();

  // cellStyles: true でスタイル情報も読み込む
  const wb = XLSX.read(arrayBuffer, { type: "array", cellStyles: true });

  const sheets = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name];
    // sheet_to_html はシートをHTMLテーブルに変換する組み込みメソッド
    const html = XLSX.utils.sheet_to_html(ws, {
      id: `sheet-${name}`,
      editable: false,
    });
    return { name, html };
  });

  return { sheets };
}
```

### 複数シートのPDF出力

```tsx
function printSheetsAsPdf(
  sheets: { name: string; html: string }[],
  selectedIndices: number[],
  orientation: "portrait" | "landscape" = "landscape"
) {
  // 選択シートのHTMLを結合（ページ区切りを挿入）
  const combinedHtml = selectedIndices
    .map((idx, i) => {
      const pageBreak =
        i < selectedIndices.length - 1
          ? '<div style="page-break-after: always;"></div>'
          : "";
      return `<h2 style="font-size:12pt;margin:0 0 8pt;">${sheets[idx].name}</h2>
${sheets[idx].html}${pageBreak}`;
    })
    .join("");

  const printHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 ${orientation}; margin: 15mm 20mm; }
  body {
    font-family: 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', sans-serif;
    font-size: 8pt;
  }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #bbb; padding: 3pt 6pt; white-space: pre-wrap; }
  tr:nth-child(even) td { background: #f7f7f7; }
</style>
</head>
<body>${combinedHtml}</body>
</html>`;

  // Word→PDFと同じ iframe print アプローチ
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(printHtml);
  doc.close();
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 3000);
  }, 350);
}
```

**Excelの列数が多い場合の対策：**
`@page { size: A4 landscape; }` で横向きにすることで、多列のシートも1ページに収まりやすくなります。

---

## ユーザーへの正直な案内

mammoth.js / SheetJS はサーバーサイドのツール（LibreOffice等）と比較して**変換精度に限界**があります。実装する際はUIで以下を明示することを推奨します。

```tsx
// 制限事項の表示例
const LIMITATIONS = {
  word: [
    "ヘッダー・フッター・ページ番号は再現されません",
    "テキストボックス・図形・SmartArtは省略されます",
    "独自フォント（游ゴシック等）はブラウザのフォントで代替されます",
  ],
  excel: [
    "グラフ・ピボットテーブルは変換されません",
    "セル結合・複雑な書式は一部省略されます",
    "数式の結果は表示されますが、数式自体は変換されません",
  ],
};
```

---

## セキュリティとプライバシー

両ツールともファイルはサーバーに送信されません。

```tsx
// 証明できる実装の特徴
// 1. 外部APIへの fetch がない
// 2. arrayBuffer は FileReader/Blob API でローカル処理
// 3. 出力は blob URL または iframe 内の印刷ダイアログ
```

社内書類・個人情報を含むファイルを扱うユーザーにとって、ブラウザ完結は大きな安心材料になります。

---

## まとめ

```
Word (.docx) → mammoth.js → HTML → iframe print → PDF
Excel (.xlsx) → SheetJS    → HTML table → iframe print → PDF
```

**iframe + `contentWindow.print()` というアプローチのメリット：**
- サードパーティのPDFライブラリが不要（jsPDF等と比べてバンドルサイズが小さい）
- ブラウザが用紙設定・余白・改ページを処理するため実装がシンプル
- ユーザーが印刷設定（PDF保存先・用紙サイズ）を自由に選べる

**デメリット：**
- 印刷ダイアログを経由するため「ワンクリックで保存」は不可
- ブラウザ・OSによってダイアログのUIが異なる

ブラウザ完結の制約は多いですが、**登録不要・インストール不要・ファイル送信なし**という価値はユーザーに刺さります。実際のデモは [ToolBoxJP](https://www.toolboxjp.com/tools/word-to-pdf) で確認できます。

---

## 参考

- [mammoth.js GitHub](https://github.com/mwilliamson/mammoth.js)
- [SheetJS ドキュメント](https://docs.sheetjs.com/)
- [Window.print() - MDN](https://developer.mozilla.org/ja/docs/Web/API/Window/print)
