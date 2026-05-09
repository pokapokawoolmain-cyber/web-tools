"use client";
// ========================================
// QRコード生成ツール
// npm install qrcode @types/qrcode が必要
// ========================================
import { useState, useEffect, useRef, useCallback } from "react";
import { Download } from "lucide-react";

type TabType = "url" | "text" | "wifi";

const WIFI_SECURITY = ["WPA/WPA2", "WEP", "なし（オープン）"] as const;

export function QrGenerator() {
  const [tab, setTab]           = useState<TabType>("url");
  const [urlInput, setUrlInput] = useState("https://");
  const [textInput, setTextInput] = useState("");
  const [wifiSSID, setWifiSSID]   = useState("");
  const [wifiPass, setWifiPass]   = useState("");
  const [wifiSec, setWifiSec]     = useState<typeof WIFI_SECURITY[number]>("WPA/WPA2");
  const [fgColor, setFgColor]     = useState("#000000");
  const [bgColor, setBgColor]     = useState("#ffffff");
  const [size, setSize]           = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QR内容の決定
  const qrContent = (() => {
    if (tab === "url")  return urlInput;
    if (tab === "text") return textInput;
    // WiFiのQR形式: WIFI:T:WPA;S:SSID;P:password;;
    const sec = wifiSec === "なし（オープン）" ? "nopass" : wifiSec === "WEP" ? "WEP" : "WPA";
    return `WIFI:T:${sec};S:${wifiSSID};P:${wifiPass};;`;
  })();

  const generateQR = useCallback(async () => {
    if (!canvasRef.current || !qrContent.trim()) return;
    try {
      const QRCode = (await import("qrcode")).default;
      await QRCode.toCanvas(canvasRef.current, qrContent, {
        width: size,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
        margin: 2,
      });
    } catch {
      // qrcodeがインストールされていない場合はスキップ
    }
  }, [qrContent, fgColor, bgColor, size]);

  useEffect(() => { generateQR(); }, [generateQR]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = "qrcode.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const inputClass = "w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* インストール案内 */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
        <code>npm install qrcode @types/qrcode</code> が必要です
      </div>

      {/* タブ切替 */}
      <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 gap-1">
        {(["url", "text", "wifi"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {t === "url" ? "🔗 URL" : t === "text" ? "📝 テキスト" : "📶 WiFi"}
          </button>
        ))}
      </div>

      {/* 入力エリア */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-4">
        {tab === "url" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL</label>
            <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
              className={inputClass} placeholder="https://example.com" />
          </div>
        )}
        {tab === "text" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">テキスト</label>
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
              className={inputClass} rows={3} placeholder="QRコードにするテキストを入力" />
          </div>
        )}
        {tab === "wifi" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SSID（ネットワーク名）</label>
              <input type="text" value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)}
                className={inputClass} placeholder="MyWiFiNetwork" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">パスワード</label>
              <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)}
                className={inputClass} placeholder="WiFiパスワード" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">セキュリティ</label>
              <select value={wifiSec} onChange={(e) => setWifiSec(e.target.value as typeof wifiSec)}
                className={inputClass}>
                {WIFI_SECURITY.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* カラー・サイズ設定 */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">前景色</label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-700 cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">背景色</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-zinc-700 cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">サイズ</label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))}
              className="text-xs border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1 bg-transparent dark:text-white">
              {[128, 256, 512].map((s) => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* プレビュー & ダウンロード */}
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white dark:bg-white rounded-2xl shadow-md">
          <canvas ref={canvasRef} width={size} height={size} />
        </div>
        <button onClick={downloadPNG} className="btn-primary">
          <Download className="w-4 h-4" />
          PNG ダウンロード
        </button>
      </div>
    </div>
  );
}
