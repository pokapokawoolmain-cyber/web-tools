// ========================================
// スピードテスト: アップロード測定用エンドポイント
// クライアントから送られたボディを読み捨て、受信バイト数を返す。
// Edge Runtime のボディ上限を考慮し、クライアントは3MB以下の
// チャンクを複数回POSTして合算する方式。
// ========================================

export const runtime = "edge";
export const preferredRegion = "hnd1";

export async function POST(req: Request) {
  let received = 0;
  const reader = req.body?.getReader();
  if (reader) {
    // 読み捨てながらバイト数だけ数える
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value?.byteLength ?? 0;
    }
  }
  return Response.json(
    { received },
    { headers: { "Cache-Control": "no-store" } },
  );
}
