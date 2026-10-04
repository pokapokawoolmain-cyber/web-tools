"use client";
// ============================================================
// ホーム画面追加（クライアント側）
//
// * 環境判定: iPhone/iPad（Safari / 他ブラウザ / アプリ内ブラウザ）・Android・その他
// * ホーム画面から起動中か（display-mode: standalone / navigator.standalone）
// * Android/Chromium: ブラウザ標準のインストールイベント（beforeinstallprompt）を捕まえて保持し、
//   ユーザーが「ホーム画面に追加」を押した瞬間に標準の確認画面を出す（最終確認はユーザー）
// * 案内の表示状態（あとで / 今後表示しない / 完了）を端末に記録（localStorage・端末内の利便機能）
// 判定できない環境では断定しない（unknown 扱いで案内を出しすぎない）。
// ============================================================

export type Platform =
  | { os: "ios"; browser: "safari" | "other" | "inapp" }
  | { os: "android"; browser: "chromium" | "other" | "inapp" }
  | { os: "other" };

const IN_APP_RE = /\bLine\/|Instagram|FBAN|FBAV|FB_IAB|Twitter|MicroMessenger|KAKAOTALK|; wv\)/i;

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return { os: "other" };
  const ua = navigator.userAgent;
  // iPadOS 13+ のデスクトップ表示は Macintosh を名乗るため、タッチ対応で判定する
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) {
    if (IN_APP_RE.test(ua)) return { os: "ios", browser: "inapp" };
    // iPhone の Chrome / Edge / Firefox / Opera 等は UA に独自の識別子が入る
    if (/CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo|YaBrowser|GSA\//.test(ua)) return { os: "ios", browser: "other" };
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return { os: "ios", browser: "safari" };
    return { os: "ios", browser: "other" };
  }
  if (/Android/.test(ua)) {
    if (IN_APP_RE.test(ua)) return { os: "android", browser: "inapp" };
    if (/Chrome\/|SamsungBrowser|EdgA|OPR\//.test(ua) && !/Firefox/.test(ua)) return { os: "android", browser: "chromium" };
    return { os: "android", browser: "other" };
  }
  return { os: "other" };
}

/** ホーム画面（アプリとして）から起動しているか */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
    if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
  } catch {
    /* matchMedia 非対応は判定しない */
  }
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// ------------------------------------------------------------
// beforeinstallprompt（Android / Chromium の標準インストール確認）
// ページ読み込みのどこかで1回だけ発火するため、レイアウトで早めに捕まえて保持する。
// ------------------------------------------------------------
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installedThisSession = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function startInstallPromptCapture() {
  if (typeof window === "undefined" || (window as unknown as { __goodsA2hs?: boolean }).__goodsA2hs) return;
  (window as unknown as { __goodsA2hs?: boolean }).__goodsA2hs = true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // ブラウザ独自のミニバーを抑え、アプリ内のボタンから出す
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installedThisSession = true;
    emit();
  });
}

export function subscribeInstallPrompt(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export const canPromptInstall = () => deferred !== null;
export const wasInstalledThisSession = () => installedThisSession;

/**
 * ブラウザ標準のインストール確認を表示する（ユーザーのタップ操作の中で呼ぶこと）。
 * 戻り値: accepted / dismissed / unavailable（確認画面を出せない）
 */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const e = deferred;
  if (!e) return "unavailable";
  deferred = null; // 1つのイベントで prompt() できるのは1回だけ
  emit();
  try {
    await e.prompt();
    const choice = await e.userChoice;
    return choice.outcome;
  } catch {
    return "unavailable";
  }
}

// ------------------------------------------------------------
// 案内の表示状態（端末内・ユーザー単位）
// ------------------------------------------------------------
export const SNOOZE_DAYS = 7;
export const GUIDE_SNOOZE_DAYS = 30;

type A2hsState = { state: "snoozed"; until: number } | { state: "never" } | { state: "done" };

const key = (userId: string) => `mochico.a2hs.v1:${userId}`;

export function readA2hsState(userId: string): A2hsState | null {
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as A2hsState) : null;
  } catch {
    return null;
  }
}

export function writeA2hsState(userId: string, s: A2hsState) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(s));
  } catch {
    /* 保存できない環境（プライベートブラウズ等）では、その場限りの抑制になる */
  }
}

export function snooze(userId: string, days: number) {
  writeA2hsState(userId, { state: "snoozed", until: Date.now() + days * 24 * 60 * 60 * 1000 });
}

/** 今この端末・このユーザーに案内を出してよいか（環境条件は呼び出し側で判定） */
export function isA2hsSuppressed(userId: string): boolean {
  const s = readA2hsState(userId);
  if (!s) return false;
  if (s.state === "never" || s.state === "done") return true;
  return s.until > Date.now();
}

// ------------------------------------------------------------
// Service Worker（オフライン案内ページのみ。個人データはキャッシュしない）
// ------------------------------------------------------------
export function registerGoodsServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return; // HTTPS（または localhost）のみ
  if (process.env.NODE_ENV !== "production") return; // 開発中は古いスクリプトが残る事故を避ける
  navigator.serviceWorker.register("/mochico-sw.js", { scope: "/mochico" }).catch(() => undefined);
}
