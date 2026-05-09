"use client";
// ========================================
// URL整形 & QR生成ツール
// バックエンドなしで動作するクライアント完結版
// 将来的にDB + API Route を追加すれば本格短縮URLに拡張可能
// ========================================
import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";

// URLパラメータを整理・クリーンアップ
function cleanUrl(rawUrl: string): { clean: string; removed: string[] } {
  try {
    const url = new URL(rawUrl);
    const removed: string[] = [];
    // トラッキングパラメータを削除
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "fbclid", "gclid", "msclkid", "ref", "referrer"
    ];
    trackingParams.forEach((p) => {
      if (url.searchParams.has(p)) {
        removed.push(p);
        url.searchParams.delete(p);
      }
    });
    return { clean: url.toString(), removed };
  } catch {
    return { clean: rawUrl, removed: [] };
  }
}

// 短いハッシュを生成（表示用）
async function hashUrl(url: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(url + Date.now());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(36)).join("").slice(0, 8);
}

export function ShortLink() {
  const [input, setInput]     = useState("");
  const [result, setResult]   = useState<{
    original: string; clean: string; shortCode: string; removedParams: string[];
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showQR, setShowQR]       = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const process = async () => {
    if (!input.trim()) return;
    const { clean, removed } = cleanUrl(input.trim());
    const shortCode = await hashUrl(clean);
    setResult({ original: input.trim(), clean, shortCode, removedParams: removed });
    setShowQR(false);
  };

  const renderQR = useCallback(async () => {
    if (!canvasRef.current || !result || !showQR) return;
    try {
      const QRCode = (await import("qrcode")).default;
      await QRCode.toCanvas(canvasRef.current, result.clean, {
        width: 200, margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    } catch { /* qrcode not installed */ }
  }, [result, showQR]);

  useEffect(() => { renderQR(); }, [renderQR]);

  const inputClass = "w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 入力 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">URLを入力</h2>
        <div className="space-y-1.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="https://www.example.com/very-long-path?utm_source=google&utm_medium=cpc&..."
          />
        </div>
        <button onClick={process} className="btn-primary w-full justify-center">
          🔗 URLを整形・QR生成
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div className="space-y-4">
          {/* トラッキング除去のアラート */}
          {result.removedParams.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-400">
              ✅ トラッキングパラメータを除去しました: {result.removedParams.map((p) => (
                <code key={p} className="mx-1 text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">{p}</code>
              ))}
            </div>
          )}

          {/* クリーンURL */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">整形済みURL</p>
              <div className="flex gap-2">
                <a href={result.clean} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => copy(result.clean, "clean")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                  {copiedKey === "clean" ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 break-all font-mono leading-relaxed">
              {result.clean}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>元: {result.original.length}文字 → 整形後: {result.clean.length}文字</span>
              {result.original.length > result.clean.length && (
                <span className="text-emerald-500">−{result.original.length - result.clean.length}文字</span>
              )}
            </div>
          </div>

          {/* QRコード */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? "QRコードを閉じる" : "QRコードを表示"}
            </button>
            {showQR && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-md">
                  <canvas ref={canvasRef} width={200} height={200} />
                </div>
                <button
                  onClick={() => {
                    if (!canvasRef.current) return;
                    const a = document.createElement("a");
                    a.download = "qr.png";
                    a.href = canvasRef.current.toDataURL();
                    a.click();
                  }}
                  className="text-xs text-slate-500 hover:text-blue-500 flex items-center gap-1"
                >
                  ↓ PNG ダウンロード
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 将来の拡張について */}
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4 text-xs text-slate-400 dark:text-slate-500">
        💡 本ツールはクライアント完結型です。
        バックエンド（DB + API）を追加することで、カスタム短縮URLや
        クリック数分析に拡張できます。
      </div>
    </div>
  );
}
