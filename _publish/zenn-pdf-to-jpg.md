---
title: "【Next.js】PDF.jsでブラウザ完結のPDF→JPG変換を実装する"
emoji: "📄"
type: "tech"
topics: ["nextjs", "typescript", "pdfjs", "react", "webapi"]
published: true
---

## はじめに

PDFをJPG画像に変換する処理は、通常サーバーサイドで行うことが多いです。しかし **PDF.js**（Mozilla製）を使えば、ファイルをサーバーに送信することなく、ブラウザ内だけで完結させることができます。

この記事では Next.js（App Router）+ TypeScript 環境で、以下の機能を持つPDF→JPG変換ツールを実装する手順を解説します。

- PDFをドラッグ＆ドロップでアップロード
- 全ページを高解像度JPGに変換
- 複数ページはZIPにまとめてダウンロード
- ファイルはサーバーに**一切送信しない**

実際に動くツールはこちら → [PDF→JPG変換ツール - ToolBoxJP](https://www.toolboxjp.com/tools/pdf-to-jpg)

---

## 技術スタック

- **Next.js 15**（App Router）
- **TypeScript**
- **PDF.js** — PDFのレンダリングに使用
- **JSZip** — 複数JPGをZIP化
- **Canvas API** — PDFページを画像に変換

---

## セットアップ

```bash
npm install pdfjs-dist jszip
```

`pdfjs-dist` は PDF.js の npm パッケージです。Next.js では動的インポートが必要になるケースがあるため、後述の対応を行います。

---

## 実装

### 1. Worker の設定（Next.js 特有の注意点）

PDF.js は内部で Web Worker を使用します。Next.js のバンドラーと相性を持たせるため、`next.config.ts` にコピー設定を追加します。

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["pdfjs-dist"] = "pdfjs-dist/legacy/build/pdf";
    return config;
  },
};

export default nextConfig;
```

### 2. PDF.js の動的インポート

クライアントコンポーネント内で PDF.js を動的インポートします。

```tsx
// app/tools/pdf-to-jpg/PdfToJpg.tsx
"use client";
import { useState, useCallback } from "react";

async function getPdfLib() {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  // workerSrc は CDN から読み込む（バンドルサイズ削減のため）
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  return pdfjsLib;
}
```

### 3. PDFページを Canvas にレンダリングしてJPGに変換

PDF.js の `getPage()` → `render()` を使い、Canvas に描画した内容を `toDataURL("image/jpeg")` でJPG化します。

```tsx
async function pdfPageToJpg(
  pdfDoc: any,
  pageNum: number,
  scale: number = 2.0  // 2倍スケールで高解像度に
): Promise<{ dataUrl: string; filename: string }> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  return {
    dataUrl,
    filename: `page-${String(pageNum).padStart(3, "0")}.jpg`,
  };
}
```

**スケール `2.0` にする理由：**
PDFの標準解像度（72dpi）の2倍でレンダリングするため、テキストや図表が鮮明に出力されます。スマホ・Retina ディスプレイでも読みやすい品質です。

### 4. 複数ページを ZIP にまとめる

```tsx
import JSZip from "jszip";

async function pagesToZip(pages: { dataUrl: string; filename: string }[]): Promise<Blob> {
  const zip = new JSZip();

  for (const { dataUrl, filename } of pages) {
    // data:image/jpeg;base64,xxxxxx → base64部分だけ取り出す
    const base64 = dataUrl.split(",")[1];
    zip.file(filename, base64, { base64: true });
  }

  return await zip.generateAsync({ type: "blob" });
}
```

### 5. 全体の処理フロー

```tsx
async function convertPdfToJpg(file: File) {
  const pdfjsLib = await getPdfLib();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const totalPages = pdfDoc.numPages;
  const results: { dataUrl: string; filename: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const result = await pdfPageToJpg(pdfDoc, i, 2.0);
    results.push(result);
  }

  if (results.length === 1) {
    // 1ページのみ → JPG直接ダウンロード
    downloadDataUrl(results[0].dataUrl, results[0].filename);
  } else {
    // 複数ページ → ZIP化してダウンロード
    const zipBlob = await pagesToZip(results);
    downloadBlob(zipBlob, `${file.name.replace(".pdf", "")}-images.zip`);
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 6. React コンポーネント（ドラッグ＆ドロップ対応）

```tsx
export function PdfToJpg() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("PDFファイルを選択してください");
      return;
    }
    setIsConverting(true);
    try {
      await convertPdfToJpg(file);
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer ${
        dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200"
      }`}
      onClick={() => document.getElementById("pdf-input")?.click()}
    >
      <input
        id="pdf-input"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {isConverting ? (
        <p>変換中... {progress}%</p>
      ) : (
        <p>PDFをドロップ、またはクリックして選択</p>
      )}
    </div>
  );
}
```

---

## パフォーマンスの考慮

### 大きなPDFでのメモリ問題

100ページを超えるPDFは、全ページを一度にメモリに展開するとブラウザがクラッシュすることがあります。対策として：

```tsx
// ページを1枚ずつ処理してメモリを解放する
for (let i = 1; i <= totalPages; i++) {
  const result = await pdfPageToJpg(pdfDoc, i);
  // 直接ZIPに追加してから参照を手放す
  zip.file(result.filename, result.dataUrl.split(",")[1], { base64: true });
  // 次のループで result は GC される
}
```

### Worker スレッドの活用

PDF.js の `render()` は Worker スレッドで実行されるため、UIスレッドをブロックしません。ただし、Canvas 操作はメインスレッドで行われます。

---

## セキュリティについて

ブラウザ完結処理の最大のメリットは**プライバシー保護**です。

- ファイルはサーバーに送信されない
- ネットワーク通信なし
- ユーザーのデータが外部に漏れるリスクがゼロ

契約書・個人情報を含むPDFも安全に処理できます。

---

## まとめ

| 項目 | 内容 |
|---|---|
| ライブラリ | `pdfjs-dist` + `jszip` |
| レンダリング | Canvas API（2倍スケール） |
| 出力 | JPG（単ページ）/ ZIP（複数ページ） |
| サーバー送信 | なし（完全ブラウザ完結） |
| Next.js 対応 | webpack alias + CDN worker |

PDF.js はブラウザ互換性も高く（Chrome/Firefox/Safari/Edge すべて対応）、Next.js との組み合わせも安定しています。

ファイルをサーバーに送らないブラウザ完結ツールは、プライバシー重視のユーザーに特に好評です。実際に動くデモは [ToolBoxJP の PDF→JPG変換ツール](https://www.toolboxjp.com/tools/pdf-to-jpg) で確認できます。

---

## 参考

- [PDF.js 公式ドキュメント](https://mozilla.github.io/pdf.js/)
- [JSZip ドキュメント](https://stuk.github.io/jszip/)
- [Canvas.toDataURL() - MDN](https://developer.mozilla.org/ja/docs/Web/API/HTMLCanvasElement/toDataURL)
