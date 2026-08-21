// ============================================================
// favicon-lib.ts – ファビコン作成ツール 共通ライブラリ
// Canvas描画 / ICO生成 / 画像解析 / Manifest / ZIP / コード生成
// ============================================================

// ── Types ────────────────────────────────────────────────────────────
export type BgShape = "square" | "rounded" | "circle" | "squircle";
export type BgType = "transparent" | "solid" | "gradient";
export type CropMode = "contain" | "cover";
export type PreviewBg = "light" | "dark";
export type MainMode = "easy" | "pro" | "diagnose";

export interface FaviconSettings {
  proSubMode: "text" | "image";

  // Text
  text: string;
  textColor: string;
  fontSize: number; // % of canvas size (30–90)

  // Image adjustments
  cropMode: CropMode;
  padding: number;    // % (0–40)
  brightness: number; // 0–200
  contrast: number;
  saturation: number;

  // Background
  bgType: BgType;
  bgColor: string;
  bgColor2: string;
  bgGradientAngle: number;
  bgShape: BgShape;

  // Border
  border: boolean;
  borderWidth: number;
  borderColor: string;

  // Maskable
  maskableEnabled: boolean;
  maskableScale: number; // 0.6–0.95

  // Small-size override
  smallSizeOptimize: boolean;
  s16Scale: number; // multiplier applied at 16px
  s32Scale: number;

  // Meta (for code generation + preview)
  siteName: string;
  siteUrl: string;
  themeColor: string;
  bgPageColor: string;

  // UI state
  previewBg: PreviewBg;
  showSafeZone: boolean;
}

export const DEFAULT_SETTINGS: FaviconSettings = {
  proSubMode: "text",
  text: "🚀",
  textColor: "#ffffff",
  fontSize: 68,

  cropMode: "cover",
  padding: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,

  bgType: "solid",
  bgColor: "#3b82f6",
  bgColor2: "#6366f1",
  bgGradientAngle: 135,
  bgShape: "rounded",

  border: false,
  borderWidth: 2,
  borderColor: "#ffffff",

  maskableEnabled: true,
  maskableScale: 0.8,

  smallSizeOptimize: false,
  s16Scale: 1.0,
  s32Scale: 1.0,

  siteName: "My Website",
  siteUrl: "example.com",
  themeColor: "#3b82f6",
  bgPageColor: "#ffffff",

  previewBg: "light",
  showSafeZone: false,
};

export interface AnalysisIssue {
  id: string;
  severity: "error" | "warn" | "info";
  title: string;
  detail: string;
  fixLabel?: string;
  fixId?: string;
}

export interface ImageAnalysis {
  width: number;
  height: number;
  isSquare: boolean;
  hasTransparency: boolean;
  transpPaddingPct: number;
  fileSizeKB: number;
  isLowRes: boolean;
  lightContrastOk: boolean;
  darkContrastOk: boolean;
  issues: AnalysisIssue[];
}

export interface ScoreItem {
  label: string;
  passed: boolean;
  points: number;
  detail: string;
  fixId?: string;
}

// ── Canvas Renderer ────────────────────────────────────────────────────
export interface RenderParams {
  size: number;
  settings: FaviconSettings;
  imageEl?: HTMLImageElement | null;
  maskable?: boolean;
  sizeScaleBoost?: number; // extra scale for small-size optimize
}

export function renderFavicon(
  canvas: HTMLCanvasElement,
  params: RenderParams
): void {
  const { size, settings, imageEl, maskable } = params;
  canvas.width = size;
  canvas.height = size;
  const ctxOrNull = canvas.getContext("2d");
  if (!ctxOrNull) return;
  const ctx: CanvasRenderingContext2D = ctxOrNull;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high"; // 縮小・拡大時の画質を最大化
  ctx.clearRect(0, 0, size, size);

  const shape = settings.bgShape;

  // Helper: set the current path to background shape
  function setShapePath() {
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    } else {
      const r =
        shape === "rounded"
          ? size * 0.2
          : shape === "squircle"
          ? size * 0.27
          : 0;
      if (r > 0) {
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(0, 0, size, size, r);
        } else {
          _roundRectPath(ctx, 0, 0, size, size, r);
        }
      } else {
        ctx.rect(0, 0, size, size);
      }
    }
  }

  // ── Background ──────────────────────────────────────────────────────
  const needOpaqueBg = maskable || settings.bgType !== "transparent";
  if (needOpaqueBg) {
    setShapePath();
    if (settings.bgType === "gradient") {
      const angle = (settings.bgGradientAngle * Math.PI) / 180;
      const gx1 = size / 2 - Math.cos(angle) * size / 2;
      const gy1 = size / 2 - Math.sin(angle) * size / 2;
      const gx2 = size / 2 + Math.cos(angle) * size / 2;
      const gy2 = size / 2 + Math.sin(angle) * size / 2;
      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      grad.addColorStop(0, settings.bgColor);
      grad.addColorStop(1, settings.bgColor2 || settings.bgColor);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = maskable && settings.bgType === "transparent"
        ? "#3b82f6" // fallback opaque color for maskable
        : settings.bgColor;
    }
    ctx.fill();
  }

  // ── Clip to shape ──────────────────────────────────────────────────
  ctx.save();
  setShapePath();
  ctx.clip();

  // Content area
  let paddingPx = size * settings.padding / 100;
  if (maskable) {
    const safeR = size * 0.4 * settings.maskableScale;
    const safeMargin = size / 2 - safeR;
    paddingPx = Math.max(paddingPx, safeMargin);
  }
  const cx = paddingPx;
  const cy = paddingPx;
  const cw = size - paddingPx * 2;
  const ch = size - paddingPx * 2;

  // Apply CSS filters
  const b = settings.brightness;
  const c = settings.contrast;
  const s = settings.saturation;
  if (b !== 100 || c !== 100 || s !== 100) {
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  }

  // Draw content
  const useImg = settings.proSubMode === "image" && imageEl;
  if (useImg && imageEl) {
    _drawImageInArea(ctx, imageEl, cx, cy, cw, ch, settings.cropMode);
  } else {
    ctx.filter = "none";
    const displayText = settings.text.slice(0, 3) || "?";
    const fs = Math.round(cw * settings.fontSize / 100);
    ctx.font = `bold ${fs}px sans-serif`;
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, size / 2, size / 2 + size * 0.02);
  }

  ctx.filter = "none";
  ctx.restore();

  // ── Border ─────────────────────────────────────────────────────────
  if (settings.border && settings.borderWidth > 0) {
    setShapePath();
    ctx.strokeStyle = settings.borderColor;
    ctx.lineWidth = settings.borderWidth * size / 256;
    ctx.stroke();
  }
}

// Draw safe zone overlay on top of existing canvas content
export function drawSafeZoneOverlay(
  canvas: HTMLCanvasElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const r = size * 0.4;

  ctx.save();
  // Darken outside safe zone
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  // Dashed circle
  ctx.strokeStyle = "rgba(255,220,0,0.9)";
  ctx.lineWidth = Math.max(1, size / 128);
  ctx.setLineDash([size / 32, size / 64]);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function _drawImageInArea(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number,
  cropMode: CropMode
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (cropMode === "cover") {
    const imgAspect = iw / ih;
    const areaAspect = dw / dh;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgAspect > areaAspect) {
      sw = ih * areaAspect;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / areaAspect;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  } else {
    const imgAspect = iw / ih;
    const areaAspect = dw / dh;
    let fdx = dx, fdy = dy, fdw = dw, fdh = dh;
    if (imgAspect > areaAspect) {
      fdh = dw / imgAspect;
      fdy = dy + (dh - fdh) / 2;
    } else {
      fdw = dh * imgAspect;
      fdx = dx + (dw - fdw) / 2;
    }
    ctx.drawImage(img, fdx, fdy, fdw, fdh);
  }
}

function _roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Image Analysis ──────────────────────────────────────────────────────
export function analyzeImage(
  img: HTMLImageElement,
  file: File
): ImageAnalysis {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const isSquare = w === h;
  const fileSizeKB = file.size / 1024;
  const isLowRes = Math.min(w, h) < 64;

  const canvas = document.createElement("canvas");
  const maxDim = Math.min(Math.max(w, h), 256);
  const scale = maxDim / Math.max(w, h);
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const { hasTransparency, transpPaddingPct } = _checkTransparency(imageData, canvas.width, canvas.height);
  const avgBrightness = _getAvgBrightness(imageData);
  const lightContrastOk = avgBrightness < 210;
  const darkContrastOk = avgBrightness > 45;

  const issues: AnalysisIssue[] = [];

  if (!isSquare) {
    issues.push({
      id: "not-square",
      severity: "warn",
      title: "画像が正方形ではありません",
      detail: `${w}×${h}px（${w > h ? "横長" : "縦長"}）。ファビコンは正方形が推奨されます。`,
      fixLabel: "中央切り抜きで正方形に修正",
      fixId: "fix-square",
    });
  }

  if (isLowRes) {
    issues.push({
      id: "low-res",
      severity: "error",
      title: "解像度が低すぎます",
      detail: `${Math.min(w, h)}px。64px以上を推奨します。16px表示では細部が潰れます。`,
    });
  }

  if (hasTransparency && transpPaddingPct > 15) {
    issues.push({
      id: "large-padding",
      severity: "warn",
      title: "透明な余白が大きすぎます",
      detail: `周囲の透明余白が約${Math.round(transpPaddingPct)}%あります。実際のコンテンツが小さく表示されます。`,
      fixLabel: "余白を自動除去",
      fixId: "fix-trim",
    });
  }

  if (!lightContrastOk) {
    issues.push({
      id: "light-contrast",
      severity: "warn",
      title: "明るい背景では見えにくい可能性があります",
      detail: "画像全体が明るすぎます。ライトモードのブラウザで識別しにくくなる場合があります。",
      fixLabel: "白い枠線を追加",
      fixId: "fix-border",
    });
  }

  if (!darkContrastOk) {
    issues.push({
      id: "dark-contrast",
      severity: "warn",
      title: "暗い背景では見えにくい可能性があります",
      detail: "画像全体が暗すぎます。ダークモードのブラウザで認識しにくくなる場合があります。",
      fixLabel: "明るさを上げる",
      fixId: "fix-brightness",
    });
  }

  if (issues.length === 0 || (issues.length === 1 && issues[0].id === "not-square" && Math.abs(w - h) < 5)) {
    issues.push({
      id: "ok",
      severity: "info",
      title: "画像の品質に大きな問題は見つかりませんでした",
      detail: `${w}×${h}px・${Math.round(fileSizeKB)}KB。そのまま使用できます。`,
    });
  }

  return { width: w, height: h, isSquare, hasTransparency, transpPaddingPct, fileSizeKB, isLowRes, lightContrastOk, darkContrastOk, issues };
}

function _checkTransparency(
  data: ImageData, w: number, h: number
): { hasTransparency: boolean; transpPaddingPct: number } {
  const px = data.data;
  let hasTransp = false;
  for (let i = 3; i < px.length; i += 4) {
    if (px[i] < 255) { hasTransp = true; break; }
  }
  if (!hasTransp) return { hasTransparency: false, transpPaddingPct: 0 };

  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] > 20) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return { hasTransparency: true, transpPaddingPct: 100 };
  const transpPaddingPct = Math.max(
    ((w - (maxX - minX + 1)) / w) * 100,
    ((h - (maxY - minY + 1)) / h) * 100
  );
  return { hasTransparency: true, transpPaddingPct };
}

function _getAvgBrightness(data: ImageData): number {
  const px = data.data;
  let total = 0, count = 0;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] > 50) {
      total += 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      count++;
    }
  }
  return count > 0 ? total / count : 128;
}

// Auto-trim transparent padding → returns dataURL of trimmed square image
export function trimTransparentPadding(img: HTMLImageElement): string {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const px = data.data;
  const w = c.width, h = c.height;

  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 10) {
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return c.toDataURL();
  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;
  const sq = Math.max(tw, th);
  const tc = document.createElement("canvas");
  tc.width = sq; tc.height = sq;
  const tctx = tc.getContext("2d")!;
  tctx.drawImage(c, minX, minY, tw, th, (sq - tw) / 2, (sq - th) / 2, tw, th);
  return tc.toDataURL("image/png");
}

// ── Technical Score ───────────────────────────────────────────────────
export function calcScore(
  mainDataUrl: string,
  maskDataUrl: string,
  settings: FaviconSettings,
  analysis: ImageAnalysis | null
): { score: number; items: ScoreItem[] } {
  const items: ScoreItem[] = [];

  const add = (label: string, passed: boolean, pts: number, detail: string, fixId?: string) => {
    items.push({ label, passed, points: pts, detail, fixId });
  };

  // 1. 解像度 512px確保
  add("推奨解像度（512px）", true, 10, "マスターキャンバスは常に512×512pxで生成されます。");

  // 2. 正方形
  add("正方形", true, 8, "生成されるファビコンは常に正方形です。");

  // 3. 背景の不透明性 (ライト表示)
  const hasBg = settings.bgType !== "transparent";
  add(
    "背景色あり（ライト・ダーク表示）",
    hasBg,
    10,
    hasBg ? "背景色が設定されています。" : "透明背景はダークモードで表示されません。",
    hasBg ? undefined : "fix-bg"
  );

  // 4. マスク対応
  add(
    "Maskable Icon対応",
    settings.maskableEnabled,
    12,
    settings.maskableEnabled
      ? "Maskable IconはAndroid端末でのPWA表示に必要です。"
      : "Maskable Iconが無効です。Android端末でPWAアイコンが崩れる場合があります。",
    "fix-maskable"
  );

  // 5. Maskable背景不透明
  if (settings.maskableEnabled) {
    const maskOpaque = settings.bgType !== "transparent";
    add(
      "Maskable Icon – 不透明背景",
      maskOpaque,
      8,
      maskOpaque ? "Maskable Iconに不透明背景があります。" : "Maskable Iconには必ず不透明な背景が必要です。",
      "fix-bg"
    );
  }

  // 6. 16px判別性 (text mode: fontSize >= 50, image mode: always ok)
  const smallSizeOk =
    settings.proSubMode === "image" || settings.fontSize >= 45;
  add(
    "16px表示での判別性",
    smallSizeOk,
    10,
    smallSizeOk
      ? "16px表示で十分な大きさがあります。"
      : "文字サイズが小さすぎます。16pxでは潰れる可能性があります。（45%以上推奨）",
    "fix-fontsize"
  );

  // 7. ライト背景コントラスト
  const lightOk = analysis ? analysis.lightContrastOk : hasBg;
  add(
    "ライト背景でのコントラスト",
    lightOk,
    8,
    lightOk ? "明るい背景でも識別できます。" : "明るい背景での視認性が低い可能性があります。",
    lightOk ? undefined : "fix-border"
  );

  // 8. ダーク背景コントラスト
  const darkOk = analysis ? analysis.darkContrastOk : true;
  add(
    "ダーク背景でのコントラスト",
    darkOk,
    8,
    darkOk ? "暗い背景でも識別できます。" : "暗い背景での視認性が低い可能性があります。",
    darkOk ? undefined : "fix-brightness"
  );

  // 9. ファイルセット完成度 (simplified: always good since we generate it)
  const hasMask = settings.maskableEnabled;
  add(
    "推奨ファイルセット",
    hasMask,
    10,
    hasMask
      ? "favicon.ico・PNG各サイズ・Maskable・Manifest・HTMLコードが生成されます。"
      : "Maskableアイコンを有効にすると、完全なPWAファイルセットが生成されます。",
    "fix-maskable"
  );

  // 10. マスク安全領域
  if (settings.maskableEnabled) {
    const inSafeZone = settings.maskableScale <= 0.9;
    add(
      "Maskable 安全領域内に収まっている",
      inSafeZone,
      8,
      inSafeZone
        ? `スケール${Math.round(settings.maskableScale * 100)}%で安全領域内に収まっています。`
        : "スケールが大きすぎます。マスク適用時にコンテンツが切れる場合があります。",
      "fix-maskscale"
    );
  }

  const earned = items.filter(i => i.passed).reduce((a, b) => a + b.points, 0);
  const total = items.reduce((a, b) => a + b.points, 0);
  const score = Math.round((earned / total) * 100);

  return { score, items };
}

// ── ICO Builder ────────────────────────────────────────────────────────
export function buildIco(sizes: number[], pngBuffers: ArrayBuffer[]): Blob {
  const n = sizes.length;
  const HEADER = 6;
  const DIR = 16;
  let off = HEADER + n * DIR;
  const entries = pngBuffers.map((data, i) => {
    const e = { size: sizes[i], data, offset: off };
    off += data.byteLength;
    return e;
  });
  const buf = new ArrayBuffer(off);
  const view = new DataView(buf);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, n, true);
  entries.forEach(({ size, data, offset }, i) => {
    const base = HEADER + i * DIR;
    view.setUint8(base, size >= 256 ? 0 : size);
    view.setUint8(base + 1, size >= 256 ? 0 : size);
    view.setUint8(base + 2, 0);
    view.setUint8(base + 3, 0);
    view.setUint16(base + 4, 1, true);
    view.setUint16(base + 6, 32, true);
    view.setUint32(base + 8, data.byteLength, true);
    view.setUint32(base + 12, offset, true);
  });
  entries.forEach(({ data, offset }) => {
    new Uint8Array(buf, offset).set(new Uint8Array(data));
  });
  return new Blob([buf], { type: "image/x-icon" });
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), type)
  );
}

// ── Manifest & Code Generation ─────────────────────────────────────────
export function buildWebManifest(settings: FaviconSettings): string {
  const name = settings.siteName || "My Website";
  const icons = [
    { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ...(settings.maskableEnabled ? [
      { src: "/favicon-192x192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/favicon-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ] : []),
  ];
  return JSON.stringify({
    name,
    short_name: name.length > 12 ? name.slice(0, 12) : name,
    start_url: "/",
    display: "standalone",
    theme_color: settings.themeColor,
    background_color: settings.bgPageColor,
    icons,
  }, null, 2);
}

export function buildHtmlCode(settings: FaviconSettings): string {
  return `<!-- ファビコン・PWA設定 (toolboxjp.com/tools/favicon-generator で生成) -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${settings.themeColor}">`;
}

export function buildNextjsCode(): string {
  return `// Next.js App Router — ファイルベースMetadata API（推奨）
// 以下のファイルをappディレクトリに配置するだけで自動認識されます:
//
//   app/favicon.ico           ← favicon.ico をそのままコピー
//   app/icon.png              ← favicon-512x512.png を icon.png に改名
//   app/apple-icon.png        ← apple-touch-icon.png を apple-icon.png に改名
//   app/manifest.webmanifest  ← site.webmanifest を manifest.webmanifest に改名

// layout.tsx に明示的に設定する場合:
export const metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};`;
}

export function buildWordPressCode(): string {
  return `<?php
// WordPress: 外観 → カスタマイズ → サイト基本情報 → サイトアイコン から設定するか、
// テーマの functions.php に追加:

function my_favicon() { ?>
  <link rel="icon" href="<?php echo get_theme_file_uri('/favicon.ico'); ?>" sizes="any">
  <link rel="icon" href="<?php echo get_theme_file_uri('/favicon-32x32.png'); ?>" type="image/png">
  <link rel="apple-touch-icon" href="<?php echo get_theme_file_uri('/apple-touch-icon.png'); ?>">
  <link rel="manifest" href="<?php echo get_theme_file_uri('/site.webmanifest'); ?>">
<?php }
add_action('wp_head', 'my_favicon');`;
}

export function buildReadme(settings: FaviconSettings, files: string[]): string {
  const name = settings.siteName || "My Website";
  return `# Favicon Package — ${name}

ToolBox ファビコン作成ツールで生成: https://www.toolboxjp.com/tools/favicon-generator

## ファイル一覧

${files.map(f => `- ${f}`).join("\n")}

## 各ファイルの用途

| ファイル | 用途 |
|--------|------|
| favicon.ico | ブラウザタブ（主要ブラウザ対応、16/32/48px入り）|
| favicon-16x16.png | ブラウザタブ（小サイズ）|
| favicon-32x32.png | ブラウザタブ（通常）|
| favicon-96x96.png | Googleショートカット・Opera等 |
| apple-touch-icon.png | iPhoneホーム画面追加 (180×180px) |
| favicon-192x192.png | PWA / Android ホーム画面 |
| favicon-512x512.png | PWAスプラッシュ画面・Webアプリ |
| favicon-192x192-maskable.png | Android適応型アイコン (192px) |
| favicon-512x512-maskable.png | Android適応型アイコン (512px) |
| site.webmanifest | PWA設定ファイル |
| install.html | HTMLへの設置コードサンプル |

## 設置方法

### HTMLサイト
1. すべてのファイルをサイトルートに配置
2. install.html の内容を各ページの <head> にコピー

### Next.js App Router（推奨）
\`\`\`
app/favicon.ico          ← そのままコピー
app/icon.png             ← favicon-512x512.png → icon.png に改名
app/apple-icon.png       ← apple-touch-icon.png → apple-icon.png に改名
app/manifest.webmanifest ← site.webmanifest → manifest.webmanifest に改名
\`\`\`

### WordPress
「外観 → カスタマイズ → サイト基本情報 → サイトアイコン」から設定

## キャッシュが残る場合
Ctrl+Shift+R（Win）/ Cmd+Shift+R（Mac）で強制リロード

## Google検索への反映
- 反映まで数日〜数週間かかる場合があります
- ファビコンURLを頻繁に変更しないでください
- robots.txt や CSP で favicon.ico へのアクセスを遮断しないでください

---
Generated by ToolBox — https://www.toolboxjp.com
`;
}

// ── ZIP Package Builder ────────────────────────────────────────────────
export interface ZipEntry { name: string; blob: Blob }

export async function buildZip(
  entries: ZipEntry[],
  settings: FaviconSettings
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const { name, blob } of entries) {
    zip.file(name, blob);
  }
  // README
  const fileNames = entries.map(e => e.name);
  zip.file("README.md", buildReadme(settings, fileNames));
  // Install HTML
  zip.file("install.html", `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>ファビコン設置コード</title>
</head>
<body>
<h1>HTMLに貼り付けるコード</h1>
<pre><code>${buildHtmlCode(settings).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
</body></html>`);
  return zip.generateAsync({ type: "blob" });
}
