"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type HankoConfig = {
  text: string;
  shape: "circle" | "square";
  orientation: "vertical" | "horizontal";
  size: number;
  redLevel: number;
  style: "normal" | "worn";
};

const defaultConfig: HankoConfig = {
  text: "田中",
  shape: "circle",
  orientation: "vertical",
  size: 120,
  redLevel: 80,
  style: "normal",
};

export function HankoGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<HankoConfig>(defaultConfig);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const drawHanko = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = config.size;
    canvas.width = s;
    canvas.height = s;

    ctx.clearRect(0, 0, s, s);

    const alpha = config.redLevel / 100;
    const strokeColor = `rgba(180, 20, 20, ${alpha})`;
    const fillColor = `rgba(180, 20, 20, ${alpha})`;

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = s / 25;

    if (config.style === "worn") {
      ctx.globalAlpha = 0.85;
    }

    if (config.shape === "circle") {
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s / 2 - s / 25, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const pad = s / 20;
      ctx.strokeRect(pad, pad, s - pad * 2, s - pad * 2);
    }

    ctx.fillStyle = fillColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = config.text;
    const chars = text.split("");
    const innerSize = s * 0.6;

    if (config.orientation === "vertical") {
      const charSize = Math.floor(innerSize / Math.max(chars.length, 1));
      ctx.font = `bold ${charSize}px 'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif`;
      chars.forEach((ch, i) => {
        const totalHeight = charSize * chars.length;
        const startY = s / 2 - totalHeight / 2 + charSize / 2;
        ctx.fillText(ch, s / 2, startY + i * charSize);
      });
    } else {
      const fontSize = Math.floor(innerSize / Math.max(text.length * 0.7, 1));
      ctx.font = `bold ${fontSize}px 'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif`;
      ctx.fillText(text, s / 2, s / 2);
    }

    if (config.style === "worn") {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const r = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }
  }, [config]);

  useEffect(() => { drawHanko(); }, [drawHanko]);

  const set = <K extends keyof HankoConfig>(key: K, val: HankoConfig[K]) =>
    setConfig(c => ({ ...c, [key]: val }));

  const downloadPng = (transparent: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!transparent) {
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = canvas.height;
      const tmpCtx = tmpCanvas.getContext("2d")!;
      tmpCtx.fillStyle = "white";
      tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
      tmpCtx.drawImage(canvas, 0, 0);
      const a = document.createElement("a");
      a.download = `hanko_${config.text}.png`;
      a.href = tmpCanvas.toDataURL("image/png");
      a.click();
    } else {
      const a = document.createElement("a");
      a.download = `hanko_${config.text}_transparent.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    }
    showToast("ダウンロードしました");
  };

  const downloadSvg = () => {
    const s = config.size;
    const alpha = config.redLevel / 100;
    const color = `rgba(180,20,20,${alpha})`;
    const strokeW = s / 25;
    const text = config.text;
    const chars = text.split("");

    let shapeEl = "";
    if (config.shape === "circle") {
      shapeEl = `<circle cx="${s/2}" cy="${s/2}" r="${s/2 - strokeW}" stroke="${color}" stroke-width="${strokeW}" fill="none"/>`;
    } else {
      const pad = s / 20;
      shapeEl = `<rect x="${pad}" y="${pad}" width="${s - pad*2}" height="${s - pad*2}" stroke="${color}" stroke-width="${strokeW}" fill="none"/>`;
    }

    let textEl = "";
    if (config.orientation === "vertical") {
      const charSize = Math.floor(s * 0.6 / Math.max(chars.length, 1));
      const totalH = charSize * chars.length;
      const startY = s / 2 - totalH / 2 + charSize / 2;
      textEl = chars.map((ch, i) =>
        `<text x="${s/2}" y="${startY + i * charSize}" text-anchor="middle" dominant-baseline="middle" font-size="${charSize}" font-family="'Yu Mincho',serif" font-weight="bold" fill="${color}">${ch}</text>`
      ).join("");
    } else {
      const fontSize = Math.floor(s * 0.6 / Math.max(text.length * 0.7, 1));
      textEl = `<text x="${s/2}" y="${s/2}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" font-family="'Yu Mincho',serif" font-weight="bold" fill="${color}">${text}</text>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${shapeEl}${textEl}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = `hanko_${config.text}.svg`;
    a.href = URL.createObjectURL(blob);
    a.click();
    showToast("SVGをダウンロードしました");
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl">
          ✓ {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">印鑑の内容</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">印鑑に入れる文字</label>
                <input
                  type="text"
                  value={config.text}
                  onChange={e => set("text", e.target.value)}
                  maxLength={6}
                  placeholder="田中"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <p className="text-xs text-slate-400 mt-1">最大6文字</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">形</label>
                  <div className="flex gap-2">
                    {([["circle", "○ 円形"], ["square", "□ 角印"]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => set("shape", val)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                          config.shape === val
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">文字向き</label>
                  <div className="flex gap-2">
                    {([["vertical", "縦書き"], ["horizontal", "横書き"]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => set("orientation", val)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                          config.orientation === val
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">スタイル設定</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">サイズ</label>
                  <span className="text-xs text-slate-500">{config.size}px</span>
                </div>
                <input
                  type="range" min="60" max="200" value={config.size}
                  onChange={e => set("size", parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">赤の濃さ</label>
                  <span className="text-xs text-slate-500">{config.redLevel}%</span>
                </div>
                <input
                  type="range" min="30" max="100" value={config.redLevel}
                  onChange={e => set("redLevel", parseInt(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">質感</label>
                <div className="flex gap-2">
                  {([["normal", "くっきり"], ["worn", "かすれ（味あり）"]] as const).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => set("style", val)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                        config.style === val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => downloadPng(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              透過PNGでダウンロード（推奨）
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadPng(false)}
                className="py-2.5 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors"
              >
                PNG（白背景）
              </button>
              <button
                onClick={downloadSvg}
                className="py-2.5 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium rounded-xl text-sm transition-colors"
              >
                SVGで保存
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-3">この印鑑を使う</p>
            <div className="space-y-2">
              {[
                { href: "/tools/pdf-signature", label: "✍️ PDFに押印する", desc: "PDF電子署名ツール" },
                { href: "/tools/invoice-generator", label: "🧾 請求書へ使う", desc: "請求書作成ツール" },
                { href: "/tools/receipt-generator", label: "📄 領収書へ使う", desc: "領収書作成ツール" },
              ].map(({ href, label, desc }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</span>
                  <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">{desc} →</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-8 w-full flex flex-col items-center gap-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">プレビュー</p>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="relative block"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
            <div className="w-full bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 text-sm text-slate-600 dark:text-zinc-400 text-center">
              <p className="text-xs text-slate-400">書類に押した雰囲気を再現するため、白背景のPNGや透過PNGで保存して書類に貼り付けてご利用ください。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
