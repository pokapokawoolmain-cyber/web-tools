"use client";

import { useState, useEffect } from "react";

type Info = {
  screenW: number;
  screenH: number;
  availW: number;
  availH: number;
  viewportW: number;
  viewportH: number;
  dpr: number;
  physicalW: number;
  physicalH: number;
  colorDepth: number;
  orientation: string;
  aspect: string;
};

function gcd(a: number, b: number): number {
  a = Math.round(a); b = Math.round(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function read(): Info {
  const dpr = window.devicePixelRatio || 1;
  const sw = window.screen.width;
  const sh = window.screen.height;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pw = Math.round(sw * dpr);
  const ph = Math.round(sh * dpr);
  const g = gcd(sw, sh);
  const orient = (screen.orientation && screen.orientation.type) || (vw >= vh ? "landscape" : "portrait");
  return {
    screenW: sw, screenH: sh,
    availW: window.screen.availWidth, availH: window.screen.availHeight,
    viewportW: vw, viewportH: vh,
    dpr,
    physicalW: pw, physicalH: ph,
    colorDepth: window.screen.colorDepth,
    orientation: orient.includes("portrait") ? "縦（portrait）" : "横（landscape）",
    aspect: `${Math.round(sw / g)}:${Math.round(sh / g)}`,
  };
}

export function ScreenResolution() {
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    const update = () => setInfo(read());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!info) {
    return <div className="h-40 rounded-2xl bg-slate-50 dark:bg-zinc-900 animate-pulse" />;
  }

  const rows: { label: string; value: string; hint?: string; big?: boolean }[] = [
    { label: "画面解像度（論理）", value: `${info.screenW} × ${info.screenH} px`, hint: "CSSピクセル。OSのディスプレイ設定に相当", big: true },
    { label: "物理解像度（推定）", value: `${info.physicalW} × ${info.physicalH} px`, hint: "論理解像度 × ピクセル比。実際のドット数の目安" },
    { label: "ブラウザ表示領域", value: `${info.viewportW} × ${info.viewportH} px`, hint: "今のウィンドウの内寸（レスポンシブ判定に使う値）" },
    { label: "使用可能領域", value: `${info.availW} × ${info.availH} px`, hint: "タスクバー等を除いた領域" },
    { label: "ピクセル比（DPR）", value: `${info.dpr}`, hint: "Retina等の高精細ディスプレイで2や3になる" },
    { label: "アスペクト比", value: info.aspect },
    { label: "画面の向き", value: info.orientation },
    { label: "色深度", value: `${info.colorDepth} bit` },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
        今お使いの画面・ウィンドウの情報を自動で表示します。ウィンドウサイズを変えると<strong>ブラウザ表示領域はリアルタイムに更新</strong>されるので、レスポンシブ確認にも使えます。
      </div>

      {/* メイン: 解像度 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 px-6 py-8 text-center">
        <p className="text-[13px] text-slate-400 dark:text-zinc-500 mb-1">画面解像度（論理）</p>
        <p className="text-[44px] leading-none font-bold text-slate-900 dark:text-white font-mono">
          {info.screenW}<span className="text-2xl mx-2 text-slate-400">×</span>{info.screenH}
        </p>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-3">
          物理解像度 約 {info.physicalW} × {info.physicalH} px（DPR {info.dpr}）
        </p>
      </div>

      {/* 詳細 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 divide-y divide-slate-100 dark:divide-zinc-800">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4 px-5 py-3.5">
            <div>
              <p className="text-[14px] text-slate-700 dark:text-zinc-200">{r.label}</p>
              {r.hint && <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{r.hint}</p>}
            </div>
            <p className="text-[15px] font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">{r.value}</p>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-slate-400 dark:text-zinc-500 px-1">
        ※ すべてブラウザが取得できる値です。物理解像度は論理解像度×ピクセル比からの推定で、実際のパネル解像度と異なる場合があります。
      </p>
    </div>
  );
}
