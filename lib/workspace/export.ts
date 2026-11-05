// ============================================================
// 書き出し：ZIP にまとめる・1つの PDF にまとめる（ブラウザ内で完結）
// ============================================================

export interface ExportItem {
  name: string;
  blob: Blob;
  width: number;
  height: number;
}

export async function toZip(items: ExportItem[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const it of items) zip.file(it.name, it.blob);
  return zip.generateAsync({ type: "blob" });
}

/** A4（縦長の画像は縦、横長の画像は横）に1枚ずつ余白10mmで収める */
export async function toPdf(items: ExportItem[]): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const A4 = { w: 595.28, h: 841.89 };
  const margin = 28.35; // 10mm
  for (const it of items) {
    const bytes = new Uint8Array(await it.blob.arrayBuffer());
    const img = it.blob.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const landscape = it.width > it.height;
    const pw = landscape ? A4.h : A4.w;
    const ph = landscape ? A4.w : A4.h;
    const scale = Math.min((pw - margin * 2) / it.width, (ph - margin * 2) / it.height);
    const w = it.width * scale;
    const h = it.height * scale;
    const page = doc.addPage([pw, ph]);
    page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  doc.setProducer("ToolBoxJP");
  doc.setCreator("ToolBoxJP");
  const out = await doc.save();
  return new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

/** ブラウザでファイルを保存する（ObjectURL はすぐ解放する） */
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
