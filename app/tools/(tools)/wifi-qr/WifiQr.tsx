"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

type Encryption = "WPA" | "WEP" | "None";

export function WifiQr() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<Encryption>("WPA");
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (!ssid) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let wifiString: string;
    if (encryption === "None") {
      wifiString = `WIFI:T:nopass;S:${ssid};;`;
    } else {
      wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }

    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, wifiString, {
        width: 280,
        margin: 2,
        color: {
          dark: "#1e293b",
          light: "#ffffff",
        },
      });
    });
  }, [ssid, password, encryption]);

  const handleDownload = () => {
    if (!canvasRef.current || !ssid) return;
    const link = document.createElement("a");
    link.download = `wifi-${ssid}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const encryptionOptions: Encryption[] = ["WPA", "WEP", "None"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Wi-Fi QRコード生成</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">スキャンするだけで簡単Wi-Fi接続</p>
        </div>

        {/* Encryption Segmented Control */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">暗号化方式</p>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 flex">
            {encryptionOptions.map(o => (
              <button
                key={o}
                onClick={() => setEncryption(o)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  encryption === o
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </section>

        {/* Input Fields */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">ネットワーク情報</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px] gap-3">
              <span className="text-[15px] text-slate-900 dark:text-white flex-1">ネットワーク名 (SSID)</span>
              <input
                type="text"
                value={ssid}
                onChange={e => setSsid(e.target.value)}
                placeholder="MyWiFi"
                className="text-right text-[15px] text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none w-36"
              />
            </div>
            {encryption !== "None" && (
              <div className="flex items-center px-5 py-[14px] gap-3">
                <span className="text-[15px] text-slate-900 dark:text-white flex-1">パスワード</span>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-right text-[15px] text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none w-28"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 dark:text-zinc-500 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* QR Preview */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">QRコード</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-10 flex flex-col items-center gap-4">
            {ssid ? (
              <>
                <canvas ref={canvasRef} className="rounded-xl" />
                <p className="text-[13px] text-slate-400 dark:text-zinc-500">スマートフォンのカメラでスキャン</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📶</span>
                </div>
                <p className="text-[15px] text-slate-400 dark:text-zinc-500">SSIDを入力するとQRコードが表示されます</p>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        </section>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!ssid}
          className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity disabled:opacity-40"
        >
          PNGでダウンロード
        </button>

        {/* Related Tools */}
        <RelatedTools currentId="wifi-qr" category="text" />
      </div>
    </div>
  );
}
