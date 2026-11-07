// ============================================================
// 「印刷ダイアログでPDFとして保存」の共通処理（Word→PDF・Excel→PDF）
//
// パソコン: これまで通り、見えない iframe から印刷ダイアログを開く
// スマホ:   見えない iframe からの印刷は開かないことがあるため、
//           印刷用ページを新しいタブで開き、そこで「印刷・PDF保存」を押してもらう
// どちらもファイルは端末の外へ送信しない
// ============================================================

export type PrintPlatform = "desktop" | "ios" | "android";

export function detectPlatform(): PrintPlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  // iPadOS は Mac と名乗るため、タッチ点数で見分ける
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function printViaIframe(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 3000);
  }, 350);
}

// 印刷用ページの上部に出す案内（画面だけに表示し、PDFには入らない）
const MOBILE_BAR = `
<style>
.tbx-bar{position:sticky;top:0;z-index:10;background:#eff6ff;border-bottom:1px solid #bfdbfe;padding:12px 16px;font:14px/1.6 -apple-system,'Hiragino Sans',sans-serif;color:#1e3a8a}
.tbx-bar button{display:block;width:100%;min-height:48px;margin-top:8px;border:0;border-radius:12px;background:#2563eb;color:#fff;font-size:16px;font-weight:700}
.tbx-body{padding:16px}
@media print{.tbx-bar{display:none!important}.tbx-body{padding:0}}
</style>
<div class="tbx-bar">このページを印刷の画面からPDFとして保存します。<button type="button" onclick="window.print()">印刷・PDF保存</button></div>`;

/**
 * 印刷ダイアログを開く。スマホでは印刷用ページを新しいタブで開く。
 * 新しいタブが開けなかった場合は iframe 方式にもどす。
 */
export function openPrintDialog(html: string, platform: PrintPlatform = detectPlatform()) {
  if (platform === "desktop") {
    printViaIframe(html);
    return;
  }
  const withBar = html.replace(/<body([^>]*)>/i, `<body$1>${MOBILE_BAR}<div class="tbx-body">`).replace(/<\/body>/i, "</div></body>");
  const url = URL.createObjectURL(new Blob([withBar], { type: "text/html;charset=utf-8" }));
  const win = window.open(url, "_blank");
  if (!win) {
    URL.revokeObjectURL(url);
    printViaIframe(html);
    return;
  }
  // 新しいタブが読み込みを終えるまで待ってから解放する
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export const PRINT_STEPS: Record<PrintPlatform, { label: string; steps: string[] }> = {
  desktop: {
    label: "パソコン",
    steps: [
      "「PDFとして保存する」を押すと印刷画面が開きます",
      "Chrome・Edge: 「送信先」または「プリンター」で「PDFとして保存」を選び、「保存」を押す",
      "Mac の Safari: 左下の「PDF」から「PDFとして保存」を選ぶ",
    ],
  },
  ios: {
    label: "iPhone・iPad",
    steps: [
      "「PDFとして保存する」を押すと、印刷用のページが新しいタブで開きます",
      "上の「印刷・PDF保存」を押して、印刷の画面を開く",
      "画面上部の共有ボタンを押し、「“ファイル”に保存」を選ぶ",
    ],
  },
  android: {
    label: "Android",
    steps: [
      "「PDFとして保存する」を押すと、印刷用のページが新しいタブで開きます",
      "上の「印刷・PDF保存」を押して、印刷の画面を開く",
      "プリンターの選択で「PDF形式で保存」を選び、PDFのボタンを押して保存する",
    ],
  },
};
