// ========================================
// スピードテスト: ダウンロード測定用エンドポイント
// 指定バイト数のランダムデータをストリーミングで返す。
// Edge Runtime: サーバーレスの4.5MBレスポンス制限を受けず、
// ストリームで大きなペイロードを返せる。
// クライアントは1リクエスト最大32MBで、必要に応じて連続取得する。
// ========================================

export const runtime = "edge";

const CHUNK_SIZE = 65536; // crypto.getRandomValues の1回あたり上限
const MAX_BYTES = 32 * 1024 * 1024; // 1リクエストの上限 32MB
const MIN_BYTES = 1024;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requested = parseInt(searchParams.get("bytes") ?? "1048576", 10);
  const bytes = Math.min(Math.max(Number.isFinite(requested) ? requested : 1048576, MIN_BYTES), MAX_BYTES);

  // ランダムデータ: 中間経路での透過圧縮によるスコア水増しを防ぐ
  const chunk = new Uint8Array(CHUNK_SIZE);
  crypto.getRandomValues(chunk);

  let sent = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent >= bytes) {
        controller.close();
        return;
      }
      const n = Math.min(CHUNK_SIZE, bytes - sent);
      controller.enqueue(n === CHUNK_SIZE ? chunk : chunk.subarray(0, n));
      sent += n;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(bytes),
      // no-transform: CDN・プロキシでの圧縮/変形を禁止（測定精度のため）
      "Cache-Control": "no-store, no-transform",
    },
  });
}
