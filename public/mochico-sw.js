// ============================================================
// Mochico（/mochico）専用 Service Worker
//
// 役割は1つだけ: /mochico 配下のページ遷移が「通信できずに失敗」したとき、
// 静的なオフライン案内ページ（個人データを含まない）を返す。
//
// しないこと（意図的）:
//   * アプリの JS / CSS / HTML / API 応答 / 画像 / 個人データのキャッシュ
//     （古い JS が残る・別ユーザーのデータが出る事故を避ける）
//   * /mochico 以外（ToolBox 本体）への介入（scope も /mochico に限定して登録する）
// ============================================================
const CACHE = "mochico-offline-v1";
const OFFLINE_URL = "/mochico-offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("mochico-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode !== "navigate") return; // ページ遷移以外は一切触らない（通常どおりネットワーク）
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!(url.pathname === "/mochico" || url.pathname.startsWith("/mochico/"))) return;
  event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
});
